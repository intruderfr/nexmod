/**
 * SEO CONTENT CALENDAR & GOOGLE BUSINESS PROFILE POSTING PLAN
 *
 * This drives the internal planning page at /studio/calendar — a private
 * working tool for whoever runs Nexmod's marketing. It is intentionally
 * `noindex` and not linked from the public navigation.
 *
 * Two systems live here:
 *
 * 1. WEEKLY POSTING RHYTHM (`weeklyPlan`)
 *    A repeatable seven-day cycle covering Google Business Profile posts,
 *    Instagram/Facebook/TikTok, and the site's own article publishing.
 *
 * 2. ARTICLE PIPELINE (`articlePipeline`)
 *    The queue of planned articles, each mapped to a target keyword and a
 *    publish date. Adding an article to src/data/articles.ts with a future
 *    `publishedAt` schedules it automatically — the site, sitemap and RSS
 *    feed all respect the date without any further action.
 */

export type Channel = "gbp" | "instagram" | "facebook" | "tiktok" | "website";

export interface PostTemplate {
  channel: Channel;
  /** Google Business Profile post type, where applicable. */
  gbpType?: "update" | "offer" | "event" | "product";
  title: string;
  /** Ready-to-paste copy. Keep GBP updates under 1,500 characters. */
  body: string;
  cta: string;
  /** Suggested photo/video subject — shoot list for the workshop. */
  media: string;
  hashtags?: string[];
}

export interface DayPlan {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  theme: string;
  why: string;
  posts: PostTemplate[];
}

/* ------------------------------------------------------------------------- */
/* 1. WEEKLY POSTING RHYTHM                                                   */
/* ------------------------------------------------------------------------- */

export const weeklyPlan: DayPlan[] = [
  {
    day: "Monday",
    theme: "Finished work",
    why:
      "Monday is the highest-intent day for local service searches — people plan the week's jobs. A completed build post gives Google fresh content and gives customers proof.",
    posts: [
      {
        channel: "gbp",
        gbpType: "update",
        title: "Completed this week at Nexmod",
        body:
          "[Car model] in for [service]. [One specific detail about what was done and why it matters — e.g. 'Every carbon edge post-heated to 90°C so it will not lift at the corners.']\n\nPremium car accessories and professional installation at 71 Sri Saranankara Road, Dehiwala. Open Mon–Thu and Sat 10:00–19:00, Sun 10:30–19:00.\n\nWhatsApp 075 774 0404 for a quote.",
        cta: "Call now",
        media: "Three photos: wide shot of the finished car, one detail shot, one before/after pair.",
      },
      {
        channel: "instagram",
        title: "Finished build reel",
        body:
          "Short reel — 15–25 seconds. Walk-around of the finished car, then cut to a close detail. First frame must be the strongest shot; that is what stops the scroll.",
        cta: "Link in bio",
        media: "Vertical video, natural daylight, car clean and shot at golden hour if possible.",
        hashtags: ["#nexmod", "#nexmodlk", "#carbonfibre", "#srilankacars", "#colombocars", "#carmodification", "#dehiwala"],
      },
    ],
  },
  {
    day: "Tuesday",
    theme: "Education — answer one real question",
    why:
      "Educational posts build the topical authority Google uses to rank the whole site. Take a question a customer actually asked at the counter and answer it properly.",
    posts: [
      {
        channel: "gbp",
        gbpType: "update",
        title: "Answering a question we get every week",
        body:
          "\"[The actual question]\"\n\n[Two or three sentences of honest, specific answer. Include a number or a technical detail — that is what makes it credible.]\n\nFull guide on our website. Any questions, WhatsApp 075 774 0404.",
        cta: "Learn more",
        media: "One photo showing the thing being discussed, ideally mid-job rather than finished.",
      },
      {
        channel: "facebook",
        title: "Long-form explainer",
        body:
          "Facebook tolerates longer text than Instagram. Expand the same question into 150–250 words and link to the full article on the site.",
        cta: "Read the full guide",
        media: "Carousel of 3–5 photos showing the process step by step.",
      },
    ],
  },
  {
    day: "Wednesday",
    theme: "Product spotlight",
    why:
      "Mid-week is when people research purchases. A single product with a clear price and a clear reason to care converts better than a range post.",
    posts: [
      {
        channel: "gbp",
        gbpType: "product",
        title: "[Product name] — Rs. [price]",
        body:
          "[One sentence on what it is.] [One sentence on the specific problem it solves.] [One sentence on what is included — installation, warranty.]\n\nIn stock at Dehiwala. Fitting takes [duration] and you can wait for it.",
        cta: "Buy online",
        media: "Clean product shot plus one shot of it fitted to a real car.",
      },
      {
        channel: "instagram",
        title: "Product detail post",
        body: "Close macro detail of the product. Price in the caption — hiding prices costs more enquiries than it saves.",
        cta: "DM to order",
        media: "Macro detail shot, shallow depth of field.",
        hashtags: ["#nexmod", "#nexmodlk", "#caraccessories", "#srilanka", "#colombo"],
      },
    ],
  },
  {
    day: "Thursday",
    theme: "Behind the scenes / process",
    why:
      "Process content is the strongest trust signal a workshop has. Showing the unglamorous step other shops skip is the single most persuasive thing you can post.",
    posts: [
      {
        channel: "gbp",
        gbpType: "update",
        title: "The step most shops skip",
        body:
          "[Name the step — post-heating a wrap edge, calibrating a 360 camera, sealing a drilled spoiler hole.]\n\n[Why it matters, in one or two plain sentences. Then what happens when it is skipped.]\n\nIt adds time. It is why the work lasts.",
        cta: "Learn more",
        media: "Mid-process photo or short video of the actual step being performed.",
      },
      {
        channel: "tiktok",
        title: "Process video",
        body:
          "20–40 second satisfying-process video. Squeegee passes, heat gun on an edge, lettering going onto a sidewall. Minimal talking, let the work carry it.",
        cta: "Follow for more",
        media: "Vertical video, close and stable. A phone tripod is worth buying.",
        hashtags: ["#carmods", "#srilanka", "#satisfying", "#carbonfibre", "#nexmod"],
      },
    ],
  },
  {
    day: "Friday",
    theme: "Offer or weekend booking push",
    why:
      "Friday is when weekend plans get made. Note: the workshop is closed Fridays — so this post exists to fill Saturday and Sunday slots.",
    posts: [
      {
        channel: "gbp",
        gbpType: "offer",
        title: "Weekend slots at Nexmod",
        body:
          "We are open Saturday 10:00–19:00 and Sunday 10:30–19:00.\n\n[Current offer or a specific quick job that suits a weekend visit — mirror caps, tyre lettering, wiper change.]\n\nBook a slot on WhatsApp 075 774 0404 so you are not waiting.",
        cta: "Book",
        media: "Shot of the workshop, or a car mid-job with space around it.",
      },
      {
        channel: "instagram",
        title: "Weekend availability story",
        body: "Story with a poll or question sticker — 'What are we fitting this weekend?' Engagement stickers lift reach measurably.",
        cta: "Swipe up / link sticker",
        media: "Story-format image, workshop shot.",
      },
    ],
  },
  {
    day: "Saturday",
    theme: "Customer proof",
    why:
      "Saturday is the busiest walk-in day. Social proof posted on Saturday reaches people who are already deciding where to go today.",
    posts: [
      {
        channel: "gbp",
        gbpType: "update",
        title: "Happy customer",
        body:
          "[Car model] collected today after [service].\n\n[A short line in the customer's words if they gave you one, with permission.]\n\nThank you for choosing Nexmod. 4.5 stars from 94 reviews and counting — if we did good work for you, a Google review genuinely helps.",
        cta: "Learn more",
        media: "Customer with their car if they consent, otherwise the car alone. Never post a face without asking.",
      },
      {
        channel: "instagram",
        title: "Customer car feature",
        body: "Tag the customer if they are happy to be tagged. Their repost is worth more reach than anything you can buy.",
        cta: "Tag us in your build",
        media: "Two or three strong finished shots.",
        hashtags: ["#nexmod", "#customercar", "#srilankacars", "#modifiedcars"],
      },
    ],
  },
  {
    day: "Sunday",
    theme: "Article publish + weekly roundup",
    why:
      "Publish the week's article on Sunday and let Google index it before Monday's search peak. Roundup content also performs well on a slow social day.",
    posts: [
      {
        channel: "website",
        title: "Publish the scheduled article",
        body:
          "The article publishes itself if its publishedAt date is set — no action needed. Then submit the URL in Google Search Console under URL Inspection > Request Indexing.",
        cta: "Request indexing in Search Console",
        media: "None.",
      },
      {
        channel: "gbp",
        gbpType: "update",
        title: "New guide on our site",
        body:
          "[Article title]\n\n[One-sentence hook — the most surprising or useful thing in the piece.]\n\nRead the full guide on nexmod.lk.",
        cta: "Learn more",
        media: "One strong image related to the article subject.",
      },
    ],
  },
];

/* ------------------------------------------------------------------------- */
/* 2. ARTICLE PIPELINE                                                        */
/* ------------------------------------------------------------------------- */

export interface PipelineItem {
  title: string;
  targetKeyword: string;
  /** Rough monthly search intent in Sri Lanka — informed estimate, not a tool figure. */
  intent: "high" | "medium" | "low";
  /** Which service or product this article should drive enquiries toward. */
  drivesTo: string;
  status: "published" | "scheduled" | "planned";
  publishDate?: string;
  notes?: string;
}

export const articlePipeline: PipelineItem[] = [
  // Published
  { title: "Carbon Fibre Wrap in Sri Lanka", targetKeyword: "carbon fiber wrap Sri Lanka price", intent: "high", drivesTo: "carbon-fibre-wrapping", status: "published", publishDate: "2026-08-04" },
  { title: "EZ Lip vs Fibreglass Front Lip", targetKeyword: "EZ Lip Sri Lanka", intent: "high", drivesTo: "ez-lip-installation", status: "published", publishDate: "2026-08-08" },
  { title: "Window Tinting Law in Sri Lanka", targetKeyword: "window tint law Sri Lanka", intent: "high", drivesTo: "window-tinting", status: "published", publishDate: "2026-08-12" },
  { title: "Why Your Car Speakers Sound Thin", targetKeyword: "sound deadening Sri Lanka", intent: "medium", drivesTo: "sound-deadening", status: "published", publishDate: "2026-08-15" },
  { title: "The LED Headlight Mistake", targetKeyword: "LED headlight upgrade Sri Lanka", intent: "high", drivesTo: "lighting-installation", status: "published", publishDate: "2026-08-18" },
  { title: "Car Modification Trends 2026", targetKeyword: "car modification trends Sri Lanka", intent: "medium", drivesTo: "services", status: "published", publishDate: "2026-08-19" },
  { title: "Monsoon Car Care Checklist", targetKeyword: "monsoon car care Sri Lanka", intent: "medium", drivesTo: "detailing-protection", status: "published", publishDate: "2026-08-20" },

  // Scheduled — already written, publishing automatically
  { title: "How to Choose an Android Head Unit", targetKeyword: "android head unit Sri Lanka", intent: "high", drivesTo: "car-audio-installation", status: "scheduled", publishDate: "2026-08-22" },
  { title: "Is a 360 Camera Worth It?", targetKeyword: "360 camera Sri Lanka", intent: "high", drivesTo: "camera-safety-installation", status: "scheduled", publishDate: "2026-08-25" },
  { title: "Tyre Stickers: Vinyl vs Rubber", targetKeyword: "tyre stickers Sri Lanka", intent: "medium", drivesTo: "tyre-lettering", status: "scheduled", publishDate: "2026-08-28" },
  { title: "Modifications That Hurt Resale Value", targetKeyword: "car modification resale value Sri Lanka", intent: "medium", drivesTo: "services", status: "scheduled", publishDate: "2026-09-01" },
  { title: "Ambient Lighting Guide", targetKeyword: "ambient lighting car Sri Lanka", intent: "medium", drivesTo: "lighting-installation", status: "scheduled", publishDate: "2026-09-05" },
  { title: "Your New Car's First 90 Days", targetKeyword: "new car protection Sri Lanka", intent: "medium", drivesTo: "detailing-protection", status: "scheduled", publishDate: "2026-09-10" },

  // Planned — write these next, in this order
  { title: "Spoiler Buying Guide: Ducktail vs Roof Wing vs GT Wing", targetKeyword: "car spoiler price Sri Lanka", intent: "high", drivesTo: "spoiler-body-kit-fitting", status: "planned", publishDate: "2026-09-15", notes: "High commercial intent. Include a real price table." },
  { title: "Toyota Vitz Modification Guide", targetKeyword: "Toyota Vitz modification Sri Lanka", intent: "high", drivesTo: "services", status: "planned", publishDate: "2026-09-20", notes: "Model-specific guides are the biggest untapped opportunity — one per popular model." },
  { title: "Honda Vezel Modification Guide", targetKeyword: "Honda Vezel modification Sri Lanka", intent: "high", drivesTo: "services", status: "planned", publishDate: "2026-09-25" },
  { title: "Suzuki Swift Modification Guide", targetKeyword: "Suzuki Swift RS modification Sri Lanka", intent: "medium", drivesTo: "services", status: "planned", publishDate: "2026-09-30" },
  { title: "Car Audio Build Budgets: Rs 50k, 150k and 400k", targetKeyword: "car audio system price Sri Lanka", intent: "high", drivesTo: "car-audio-installation", status: "planned", publishDate: "2026-10-05", notes: "Budget-tier articles convert exceptionally well." },
  { title: "Ceramic Coating vs Wax vs Sealant", targetKeyword: "ceramic coating Sri Lanka price", intent: "high", drivesTo: "detailing-protection", status: "planned", publishDate: "2026-10-10" },
  { title: "Hybrid Car Accessories: What Is Safe to Fit", targetKeyword: "hybrid car accessories Sri Lanka", intent: "medium", drivesTo: "services", status: "planned", publishDate: "2026-10-15", notes: "Underserved topic, high trust value, distinct customer segment." },
  { title: "How to Spot a Bad Wrap Job Before You Pay", targetKeyword: "car wrap quality check", intent: "medium", drivesTo: "carbon-fibre-wrapping", status: "planned", publishDate: "2026-10-20" },
  { title: "Interior Refresh on a Budget: Rs 100,000 Plan", targetKeyword: "car interior upgrade Sri Lanka", intent: "high", drivesTo: "interior-fitting", status: "planned", publishDate: "2026-10-25" },
  { title: "Parking Sensors vs Reverse Camera vs 360", targetKeyword: "parking sensor vs camera", intent: "medium", drivesTo: "camera-safety-installation", status: "planned", publishDate: "2026-10-30" },
];

/* ------------------------------------------------------------------------- */
/* 3. LOCAL SEO CHECKLIST                                                     */
/* ------------------------------------------------------------------------- */

export interface ChecklistItem {
  task: string;
  detail: string;
  frequency: "once" | "weekly" | "monthly" | "quarterly";
  priority: "critical" | "high" | "medium";
}

export const localSeoChecklist: ChecklistItem[] = [
  {
    task: "Claim and fully complete the Google Business Profile",
    detail:
      "Every field: categories (primary 'Auto parts store', secondary 'Car accessories store', 'Auto body shop'), full service list, hours including the Friday closure, attributes, and the nexmod.lk website link. A complete profile outranks an incomplete one in the local pack.",
    frequency: "once",
    priority: "critical",
  },
  {
    task: "Add every service as a GBP Service item",
    detail:
      "List all 12 services individually with descriptions and prices. GBP services are a direct ranking input for service-related local searches and most businesses leave them empty.",
    frequency: "once",
    priority: "critical",
  },
  {
    task: "Post to Google Business Profile 3–4 times per week",
    detail:
      "GBP posts expire after seven days, so consistency matters more than volume. Use the weekly plan above. Businesses that post regularly appear more often in the local pack.",
    frequency: "weekly",
    priority: "critical",
  },
  {
    task: "Upload new photos to GBP weekly",
    detail:
      "Businesses with more photos get significantly more direction requests and clicks. Geotag where possible. Prioritise: finished cars, workshop interior, team at work, product close-ups.",
    frequency: "weekly",
    priority: "high",
  },
  {
    task: "Ask every satisfied customer for a Google review",
    detail:
      "94 reviews at 4.5 stars is already strong. Getting to 150+ while holding above 4.5 would make Nexmod the dominant result for car accessory searches in the Dehiwala–Colombo area. Ask at handover, and follow up on WhatsApp with the direct review link.",
    frequency: "weekly",
    priority: "critical",
  },
  {
    task: "Reply to every review, positive and negative",
    detail:
      "Reply within 48 hours. Replies are a confirmed ranking factor and they demonstrate responsiveness to people reading. Never argue with a negative review — respond factually, offer to fix it, and move the conversation offline.",
    frequency: "weekly",
    priority: "critical",
  },
  {
    task: "Submit the sitemap to Google Search Console",
    detail: "Submit https://nexmod.lk/sitemap.xml. Then request indexing for each new article on publish day.",
    frequency: "once",
    priority: "critical",
  },
  {
    task: "Build local citations with identical NAP",
    detail:
      "Name, address and phone must be byte-identical everywhere: 'Nexmod', '71 Sri Saranankara Road, Dehiwala-Mount Lavinia 00600', '075 774 0404'. Target: ikman.lk shop page, Yellow Pages Sri Lanka, Lanka Business Directory, Foursquare, Apple Maps, Bing Places. Inconsistent NAP actively suppresses local rankings.",
    frequency: "once",
    priority: "high",
  },
  {
    task: "Publish one article per week minimum",
    detail:
      "Work down the article pipeline above. Set a future publishedAt date and the site handles scheduling automatically. Consistency signals an active site.",
    frequency: "weekly",
    priority: "high",
  },
  {
    task: "Check Search Console for query opportunities",
    detail:
      "Look for queries where the site ranks positions 5–20 with impressions but low clicks. Those are the pages worth improving — a small ranking gain there produces more traffic than a new article.",
    frequency: "monthly",
    priority: "high",
  },
  {
    task: "Audit Core Web Vitals",
    detail:
      "Run PageSpeed Insights on the home page, a product page and an article. Target LCP under 2.5s, INP under 200ms, CLS under 0.1. Mobile is what matters — most Sri Lankan traffic is mobile.",
    frequency: "monthly",
    priority: "medium",
  },
  {
    task: "Add a Google Business Profile Q&A section",
    detail:
      "Seed it yourself with the five questions customers actually ask, and answer them. Unanswered Q&A gets answered by strangers, often wrongly.",
    frequency: "quarterly",
    priority: "medium",
  },
  {
    task: "Refresh older articles",
    detail:
      "Update prices, add new sections, update the `updatedAt` field. Refreshed content often outperforms new content for effort spent, and the sitemap picks up the new date automatically.",
    frequency: "quarterly",
    priority: "medium",
  },
];

/* ------------------------------------------------------------------------- */
/* 4. TARGET KEYWORD MAP                                                      */
/* ------------------------------------------------------------------------- */

export interface KeywordTarget {
  keyword: string;
  page: string;
  intent: "transactional" | "commercial" | "informational" | "navigational";
  difficulty: "low" | "medium" | "high";
  note?: string;
}

export const keywordMap: KeywordTarget[] = [
  { keyword: "EZ Lip Sri Lanka", page: "/products/ez-lip-pro-universal-front-lip", intent: "transactional", difficulty: "low", note: "Official agency — this should rank #1. Own it completely." },
  { keyword: "ez lip pro price Sri Lanka", page: "/products/ez-lip-pro-universal-front-lip", intent: "transactional", difficulty: "low" },
  { keyword: "carbon fiber wrap Sri Lanka", page: "/services/carbon-fibre-wrapping", intent: "commercial", difficulty: "medium" },
  { keyword: "carbon fibre wrap price Sri Lanka", page: "/articles/carbon-fibre-wrap-guide-sri-lanka", intent: "commercial", difficulty: "medium" },
  { keyword: "tyre stickers Sri Lanka", page: "/products/tyredeckz-tyre-stickers-set", intent: "transactional", difficulty: "low" },
  { keyword: "car spoiler price Sri Lanka", page: "/categories/spoilers-body", intent: "transactional", difficulty: "medium" },
  { keyword: "window tint Sri Lanka price", page: "/services/window-tinting", intent: "commercial", difficulty: "high" },
  { keyword: "window tint law Sri Lanka", page: "/articles/window-tint-law-sri-lanka", intent: "informational", difficulty: "low", note: "Low competition, high trust value, feeds the tinting service." },
  { keyword: "car audio Sri Lanka", page: "/services/car-audio-installation", intent: "commercial", difficulty: "high" },
  { keyword: "sound deadening Sri Lanka", page: "/services/sound-deadening", intent: "commercial", difficulty: "low", note: "Almost nobody targets this. Genuine gap." },
  { keyword: "360 camera car Sri Lanka", page: "/products/camera-360-3d-system", intent: "transactional", difficulty: "medium" },
  { keyword: "DRL lights Sri Lanka", page: "/products/sequential-drl-strip", intent: "transactional", difficulty: "medium" },
  { keyword: "car accessories Dehiwala", page: "/", intent: "navigational", difficulty: "low", note: "Local pack term. GBP does most of the work here." },
  { keyword: "car accessories shop Colombo", page: "/", intent: "commercial", difficulty: "high" },
  { keyword: "car modification Sri Lanka", page: "/services", intent: "commercial", difficulty: "high" },
  { keyword: "7D car mats Sri Lanka", page: "/products/seven-d-floor-mats", intent: "transactional", difficulty: "medium" },
  { keyword: "seat covers Sri Lanka price", page: "/products/custom-seat-covers", intent: "transactional", difficulty: "high" },
  { keyword: "android car player Sri Lanka", page: "/products/android-head-unit-9-inch", intent: "transactional", difficulty: "high" },
  { keyword: "ceramic coating Colombo", page: "/services/detailing-protection", intent: "commercial", difficulty: "high" },
  { keyword: "car interior upgrade Sri Lanka", page: "/services/interior-fitting", intent: "commercial", difficulty: "medium" },
];
