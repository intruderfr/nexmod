/**
 * A very small GitHub Contents API client.
 *
 * WHY THIS WORKS ON A STATIC SITE. api.github.com sends permissive CORS
 * headers, so a page served from GitHub Pages can read and write repository
 * files directly from the browser with no server in between. That is the whole
 * trick: the admin panel is static, and GitHub is the backend.
 *
 * WHY A TOKEN RATHER THAN OAUTH. GitHub's OAuth and device flows are not
 * CORS-enabled, so a browser cannot complete them without a proxy — and a
 * proxy means a server, which is the thing we do not have. A fine-grained
 * personal access token is the honest alternative: the owner creates it,
 * scopes it to this one repository, and can revoke it in one click.
 *
 * WHERE THE TOKEN LIVES. localStorage on the owner's own device, and nowhere
 * else. It is sent to api.github.com and to no other origin. That is a real
 * trade-off rather than a perfect answer, and the UI says so plainly: anyone
 * with access to that browser profile can read it, so it should be scoped to
 * this repository only and given a short expiry.
 */

export const REPO = {
  owner: process.env.NEXT_PUBLIC_GH_OWNER || "intruderfr",
  name: process.env.NEXT_PUBLIC_GH_REPO || "nexmod",
  branch: process.env.NEXT_PUBLIC_GH_BRANCH || "master",
} as const;

export const OVERRIDES_PATH = "src/data/overrides.json";

const TOKEN_KEY = "nexmod.gh.token";
const API = "https://api.github.com";

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeToken(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token.trim());
  } catch {
    // Private mode with storage disabled. The session still works in memory.
  }
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nothing to do */
  }
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/**
 * GitHub returns base64 with newlines in it, and JSON that may contain any
 * Unicode. atob/btoa alone handle neither, so both directions round-trip
 * through UTF-8 bytes explicitly.
 */
function decodeBase64(value: string): string {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export interface GitHubUser {
  login: string;
  avatarUrl: string;
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

async function fail(response: Response): Promise<never> {
  let detail = "";
  try {
    const body = await response.json();
    detail = body?.message ?? "";
  } catch {
    /* response had no JSON body */
  }

  // The messages GitHub returns here are terse; these are the ones that
  // actually happen, translated into what the person should do about them.
  const friendly =
    response.status === 401
      ? "That token was rejected. It may be expired, mistyped, or revoked."
      : response.status === 403
        ? "The token is valid but not allowed to do this. It needs Contents: read and write on this repository."
        : response.status === 404
          ? "Repository or file not found. A fine-grained token also returns 404 when it has no access to the repository at all."
          : response.status === 409
            ? "The file changed on GitHub since this page loaded. Reload and reapply your edits."
            : detail || `GitHub returned ${response.status}.`;

  throw new GitHubError(friendly, response.status);
}

export async function verifyToken(token: string): Promise<GitHubUser> {
  const response = await fetch(`${API}/user`, { headers: headers(token) });
  if (!response.ok) await fail(response);
  const body = await response.json();
  return { login: body.login, avatarUrl: body.avatar_url };
}

export interface FileContents {
  text: string;
  /** Needed to write the file back without clobbering someone else's change. */
  sha: string;
}

export async function getFile(token: string, path: string): Promise<FileContents> {
  const url = `${API}/repos/${REPO.owner}/${REPO.name}/contents/${path}?ref=${REPO.branch}`;
  // Cache-busting matters here: a stale sha makes the next write fail with 409.
  const response = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (!response.ok) await fail(response);
  const body = await response.json();
  return { text: decodeBase64(body.content ?? ""), sha: body.sha };
}

export interface CommitResult {
  sha: string;
  url: string;
}

export async function putFile(
  token: string,
  path: string,
  text: string,
  sha: string,
  message: string,
): Promise<CommitResult> {
  const response = await fetch(`${API}/repos/${REPO.owner}/${REPO.name}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: encodeBase64(text),
      sha,
      branch: REPO.branch,
    }),
  });
  if (!response.ok) await fail(response);
  const body = await response.json();
  return { sha: body.commit.sha, url: body.commit.html_url };
}

export const ACTIONS_URL = `https://github.com/${REPO.owner}/${REPO.name}/actions`;
export const TOKEN_SETUP_URL =
  "https://github.com/settings/personal-access-tokens/new";
