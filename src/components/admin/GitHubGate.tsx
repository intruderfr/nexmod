"use client";

import { useState } from "react";

import { IconArrowRight, IconCheck, IconShield } from "@/components/Icons";
import {
  REPO,
  TOKEN_SETUP_URL,
  verifyToken,
  writeToken,
  type GitHubUser,
} from "@/lib/github";

/**
 * The sign-in step.
 *
 * Written to be read by someone who has not made a GitHub token before, which
 * is the actual audience. The instructions are specific about the two settings
 * that matter — repository access and the Contents permission — because those
 * are what a fine-grained token gets wrong, and a wrong one fails with a 404
 * that reads as though the repository does not exist.
 */
export function GitHubGate({ onSignedIn }: { onSignedIn: (user: GitHubUser, token: string) => void }) {
  const [token, setToken] = useState("");
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "checking" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) return;

    setState({ kind: "checking" });
    try {
      const user = await verifyToken(trimmed);
      writeToken(trimmed);
      onSignedIn(user, trimmed);
    } catch (error) {
      setState({ kind: "error", message: (error as Error).message });
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_22rem] gap-8 items-start">
      <form onSubmit={submit} className="surface p-6 md:p-8">
        <p className="eyebrow mb-4">Sign in</p>
        <h2 className="text-heading mb-3">Connect to GitHub</h2>
        <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed mb-6 max-w-prose">
          This page has no server. It talks to the GitHub API directly from your browser, so it
          needs a token that says it may edit{" "}
          <strong className="text-[var(--fg)] font-semibold">
            {REPO.owner}/{REPO.name}
          </strong>
          . Nothing is sent anywhere except github.com.
        </p>

        <label htmlFor="gh-token" className="label">
          Fine-grained personal access token
        </label>
        <input
          id="gh-token"
          type="password"
          className="field font-[family-name:var(--font-mono)] text-[13px]"
          placeholder="github_pat_..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />

        {state.kind === "error" && (
          <p className="text-[13px] text-[var(--accent)] mt-3 leading-relaxed">{state.message}</p>
        )}

        <div className="flex flex-wrap gap-2.5 mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={state.kind === "checking" || !token.trim()}
          >
            {state.kind === "checking" ? "Checking…" : "Connect"}
            <IconArrowRight width={16} height={16} />
          </button>
          <a
            href={TOKEN_SETUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Create a token
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <h3 className="font-semibold text-[14px] mb-3">Settings that matter</h3>
          <ol className="space-y-2.5 text-[13.5px] text-[var(--fg-muted)]">
            <li className="flex gap-2.5">
              <span className="step-marker shrink-0">1</span>
              <span>
                <strong className="text-[var(--fg)] font-semibold">Resource owner</strong> —{" "}
                {REPO.owner}.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="step-marker shrink-0">2</span>
              <span>
                <strong className="text-[var(--fg)] font-semibold">Repository access</strong> — Only
                select repositories, then pick {REPO.name}. Do not grant all repositories.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="step-marker shrink-0">3</span>
              <span>
                <strong className="text-[var(--fg)] font-semibold">Permissions</strong> — under
                Repository permissions set <em>Contents</em> to{" "}
                <strong className="text-[var(--fg)] font-semibold">Read and write</strong>. That is
                the only one needed.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="step-marker shrink-0">4</span>
              <span>
                <strong className="text-[var(--fg)] font-semibold">Expiry</strong> — pick a short
                one. Ninety days is plenty, and making a new one takes a minute.
              </span>
            </li>
          </ol>
        </div>
      </form>

      <aside className="surface p-6">
        <div className="flex items-center gap-2 mb-3">
          <IconShield width={16} height={16} className="text-[var(--accent)]" aria-hidden="true" />
          <h3 className="font-semibold text-[14.5px]">Be clear about the trade-off</h3>
        </div>
        <ul className="space-y-3 text-[13px] text-[var(--fg-muted)] leading-relaxed">
          <li>
            The token is kept in this browser&rsquo;s local storage so you do not have to paste it
            every time. Anyone who can use this browser profile can read it.
          </li>
          <li>
            Use it on your own machine, not a shared or public one, and sign out when you are
            finished — that deletes it from this device.
          </li>
          <li>
            Scoped as described, the worst it can do is change files in one repository. You can
            revoke it instantly from GitHub settings.
          </li>
          <li className="flex items-start gap-2 text-[var(--fg)]">
            <IconCheck
              width={14}
              height={14}
              className="text-[var(--accent)] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              This page is public, but it can do nothing at all without a token. The token is the
              lock.
            </span>
          </li>
        </ul>
      </aside>
    </div>
  );
}
