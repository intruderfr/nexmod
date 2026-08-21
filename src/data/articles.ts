import type { Article } from "./types";

/**
 * NEXMOD articles, guides and news.
 *
 * SCHEDULED PUBLISHING
 * Articles with a `publishedAt` in the future are automatically hidden from the
 * site, the sitemap and the RSS feed until that date arrives. To schedule a
 * post, simply give it a future date — no other action needed. See
 * src/lib/content.ts for the filtering logic and src/data/calendar.ts for the
 * editorial calendar that drives the daily posting plan.
 */

export const articles: Article[] = [
  {
    slug: "carbon-fibre-wrap-guide-sri-lanka",
    title: "Carbon Fibre Wrap in Sri Lanka: What It Costs, How Long It Lasts, and What Nobody Tells You",
    excerpt:
      "3D, 5D, 8D and real dry carbon explained — with honest Sri Lankan prices, realistic lifespans in tropical sun, and the one detail that decides whether a wrap lasts three years or three months.",
    category: "guides",
    publishedAt: "2026-08-04",
    author: "Nexmod Workshop",
    readingMinutes: 9,
    tags: ["carbon fibre", "wrapping", "buying guide", "pricing"],
    featured: true,
    keywords: [
      "carbon fiber wrap Sri Lanka price",
      "8D carbon wrap",
      "carbon wrap cost Colombo",
      "car wrap Sri Lanka",
      "3D vs 5D vs 8D carbon",
    ],
    relatedProducts: ["carbon-fibre-front-bumper-trim", "carbon-fibre-interior-console-set", "carbon-fibre-mirror-caps"],
    relatedServices: ["carbon-fibre-wrapping"],
    body: [
      {
        type: "p",
        text: "Carbon fibre is the most requested styling change in Sri Lanka right now, and it is also the one where buyers get misled most often. The confusion is mostly about the numbers — 3D, 5D, 8D — and about what any of it actually is.",
      },
      { type: "h2", text: "First, the honest part: this is vinyl, not carbon" },
      {
        type: "p",
        text: "Nearly every 'carbon fibre' job advertised in Sri Lanka is carbon-effect vinyl film. Real dry carbon is a woven composite part — a whole new bonnet, a whole new mirror cap — that replaces the original component. It costs fifteen to thirty times more, and it is genuinely lighter.",
      },
      {
        type: "p",
        text: "That does not make film a bad product. It makes it a different product. Film gives you the visual depth of carbon at a fraction of the cost, adds no weight, protects the paint underneath, and comes off cleanly when you want it gone. But any shop that lets you believe you are buying woven carbon at vinyl prices is not one to trust with the rest of the job either.",
      },
      { type: "h2", text: "What the numbers actually mean" },
      {
        type: "table",
        head: ["Grade", "What it is", "How it reads in daylight"],
        rows: [
          ["3D", "Printed weave pattern with a light surface texture", "Obviously flat. Reads as a sticker up close."],
          ["4D / 5D", "Printed weave under a gloss layer, moderate texture", "Better. Convincing from two metres, less so from arm's length."],
          ["6D", "Deeper texture, higher-gloss lacquer", "Good. The gloss starts doing the work."],
          ["8D", "True three-dimensional weave under a wet-look lacquer", "The weave shifts as you move. Convincing at arm's length."],
          ["Dry carbon", "Actual woven carbon composite part", "It is carbon. It is also a different budget entirely."],
        ],
      },
      {
        type: "p",
        text: "The jump that matters is from printed to genuinely textured. 8D film has physical depth in the weave, so light moves across it as you walk past the car — which is precisely what your eye uses to identify real carbon. That is why we work in 8D and not in the cheaper grades.",
      },
      { type: "h2", text: "Realistic Sri Lankan pricing" },
      {
        type: "table",
        head: ["Job", "Typical range (LKR)", "Time"],
        rows: [
          ["Mirror caps (pair)", "4,000 – 6,000", "45–60 min"],
          ["Front bumper accents", "10,000 – 15,000", "3–4 hrs"],
          ["Gear console + dash strip", "16,000 – 22,000", "3 hrs"],
          ["Full interior set", "28,000 – 38,000", "6–8 hrs"],
          ["Full bonnet", "28,000 – 38,000", "6–8 hrs"],
          ["B-pillar gloss black", "5,000 – 8,000", "1–2 hrs"],
        ],
      },
      {
        type: "callout",
        title: "If your quote is dramatically below this",
        text: "It is either 3D film sold as 8D, or the shop is skipping the panel-removal and post-heating steps. Both show up within a few months as lifted edges. Ask which grade of film, and ask whether panels come off the car.",
      },
      { type: "h2", text: "How long it lasts in Sri Lankan sun" },
      {
        type: "p",
        text: "This is where local conditions matter more than the marketing. Manufacturer ratings are written for temperate climates. Realistically here:",
      },
      {
        type: "ul",
        items: [
          "Exterior, garaged overnight: 3–5 years before noticeable gloss loss",
          "Exterior, parked outdoors in direct sun: 2–3 years",
          "Interior panels: 5+ years — effectively permanent, because there is no UV",
          "Bonnet and roof: shortest life of any exterior panel, because they take the most direct sun",
        ],
      },
      {
        type: "p",
        text: "Ageing shows up as loss of gloss before it shows as colour change. A three-year-old exterior wrap does not turn purple; it just stops looking wet.",
      },
      { type: "h2", text: "The one detail that decides everything: edges" },
      {
        type: "p",
        text: "Almost every failed wrap fails the same way. Not in the middle of a panel — at the edges, where the film was stretched into a recess or around a lip.",
      },
      {
        type: "p",
        text: "Vinyl has memory. Stretch it and it spends the rest of its life trying to return to flat, and given a warm bonnet and enough months, it wins. The fix is post-heating: bringing every stretched edge up to around 90°C after application, which permanently resets the film's shape memory to its new position.",
      },
      {
        type: "quote",
        text: "Post-heating takes an extra twenty minutes per panel and it is the single difference between a wrap that lasts years and one that lifts in a season. It is also completely invisible at handover — which is exactly why it gets skipped.",
      },
      { type: "h2", text: "Where to start if you are not sure" },
      {
        type: "p",
        text: "Most people who wrap their whole car wish they had started smaller. The accents carry most of the visual impact:",
      },
      {
        type: "ol",
        items: [
          "Mirror caps — cheapest change on the car, permanently in your peripheral vision",
          "Front bumper accents and grille trim — sharpens the face of the car",
          "Gear console and dash strip — you look at it every drive, and it never sees UV so it lasts",
          "Then, if you still want more, consider the bonnet",
        ],
      },
      {
        type: "p",
        text: "Start at the top of that list. You can always add. Removing a full bonnet wrap you regret is a different afternoon entirely.",
      },
    ],
    faqs: [
      {
        q: "Does carbon wrap damage paint?",
        a: "No — it protects it. While wrapped, the paint underneath is shielded from UV and stone chips. It removes with heat leaving paint intact. The exception is a panel with weak aftermarket respray, which film can lift. Always mention previous paintwork before wrapping.",
      },
      {
        q: "Can I pressure-wash a wrapped car?",
        a: "Yes, from at least 30cm and never aimed directly into an edge. Avoid automatic brush washes entirely — the brushes catch edges and that is how wraps get torn.",
      },
      {
        q: "How much does it cost to remove?",
        a: "Typically 20–40% of the application cost, depending on age. Older film that has baked on takes considerably longer to lift cleanly.",
      },
    ],
  },

  {
    slug: "ez-lip-vs-fibreglass-lip-sri-lanka",
    title: "EZ Lip vs Fibreglass Front Lip: Which Survives Sri Lankan Roads?",
    excerpt:
      "Speed bumps, hotel ramps and unmarked road repairs destroy rigid front lips. Here is an honest comparison of flexible vs rigid lips, what each costs, and how to spot a counterfeit EZ Lip.",
    category: "guides",
    publishedAt: "2026-08-08",
    author: "Nexmod Workshop",
    readingMinutes: 7,
    tags: ["EZ Lip", "front lip", "body styling", "buying guide"],
    featured: true,
    keywords: [
      "EZ Lip Sri Lanka",
      "front lip Sri Lanka price",
      "flexible vs fibreglass lip",
      "genuine ez lip",
      "universal front lip Colombo",
    ],
    relatedProducts: ["ez-lip-pro-universal-front-lip", "ez-lip-original-front-lip"],
    relatedServices: ["ez-lip-installation"],
    body: [
      {
        type: "p",
        text: "A front lip is the highest-impact, lowest-cost change you can make to how a car sits. It drops the visual ride height, sharpens the nose, and costs a fraction of a full body kit. The only real question in Sri Lanka is which type survives the roads.",
      },
      { type: "h2", text: "The Sri Lankan problem" },
      {
        type: "p",
        text: "It is not the highways. It is the speed bumps outside every school, the steep ramps into hotel and mall car parks, the unmarked road repairs, and the kerb you cannot see over the bonnet when parking. Any of those will meet the leading edge of your bumper at some point.",
      },
      {
        type: "p",
        text: "That single fact determines which lip is right, more than looks or price do.",
      },
      { type: "h2", text: "Rigid lips: fibreglass, ABS and PU" },
      {
        type: "table",
        head: ["Material", "Typical price", "What happens on impact"],
        rows: [
          ["Fibreglass", "Rs. 12,000 – 25,000", "Cracks or shatters. Repairable, but visibly."],
          ["ABS", "Rs. 15,000 – 30,000", "Cracks at stress points. Usually not repairable neatly."],
          ["Polyurethane (PU)", "Rs. 18,000 – 35,000", "Deforms and mostly recovers. Better, but can tear at mounts."],
        ],
      },
      {
        type: "p",
        text: "Rigid lips have one genuine advantage: they can be moulded into aggressive model-specific shapes that a universal flexible lip cannot match. If you want a specific OEM-plus look for a specific model and the car is garaged and driven carefully, a rigid lip is a legitimate choice.",
      },
      { type: "h2", text: "Flexible: the EZ Lip approach" },
      {
        type: "p",
        text: "EZ Lip is a high-memory polymer strip that bonds to the leading edge of your existing bumper. When it hits something, it deflects out of the way and springs back.",
      },
      {
        type: "ul",
        items: [
          "Universal fit — bonds to virtually any bumper profile, no model-specific mould required",
          "No cutting, no drilling, no bumper removal",
          "Drops visual ride height 20–25mm (Original) or 30–40mm (Pro)",
          "Survives repeated scraping that would destroy a rigid lip",
          "Removable with heat, leaving the paint intact",
        ],
      },
      {
        type: "callout",
        title: "Nexmod is the official EZ Lip agent for Sri Lanka",
        text: "Genuine EZ Lip is supplied and installed in Sri Lanka through Nexmod only. There is no second authorised outlet on the island.",
      },
      { type: "h2", text: "How to spot a counterfeit" },
      {
        type: "p",
        text: "Copies exist, and they are convincing on day one. The differences show up over a season:",
      },
      {
        type: "ol",
        items: [
          "Feel it. Genuine EZ Lip is noticeably softer and springs back instantly when bent. Copies feel stiff and stay bent slightly.",
          "Check the packaging. Genuine product arrives in branded EZ Lip USA packaging with factory heat-activated adhesive included.",
          "Look at the adhesive. Copies ship with generic double-sided tape, which fails in Colombo heat within months.",
          "Ask where it came from. If it is not Nexmod, it is not genuine — that is simply how the agency works.",
          "Watch for chalking. Counterfeit compound goes chalky and grey under UV within one dry season.",
        ],
      },
      { type: "h2", text: "Original or Pro?" },
      {
        type: "table",
        head: ["", "EZ Lip Original", "EZ Lip Pro"],
        rows: [
          ["Drop", "20–25 mm", "30–40 mm"],
          ["Visual impact", "Subtle, factory-plus", "Clearly modified"],
          ["Ramp clearance", "Comfortable", "Requires care"],
          ["Best for", "Daily drivers, company cars, steep ramps", "Weekend cars, show builds, flat approaches"],
        ],
      },
      {
        type: "p",
        text: "If you use a steep car park ramp every single day, take the Original. The difference in look is smaller than people expect, and the difference in daily stress is not.",
      },
      { type: "h2", text: "The verdict" },
      {
        type: "p",
        text: "For most Sri Lankan cars — daily driven, parked in real car parks, crossing real speed bumps — a flexible lip is simply the more sensible engineering choice. A rigid lip is the right answer only if you need a model-specific shape and you can commit to driving around the hazards.",
      },
    ],
    faqs: [
      {
        q: "Will EZ Lip fit my car?",
        a: "Almost certainly — it is universal-fit and bonds to any bumper leading edge. We have fitted it to Vitz, Aqua, Vezel, Swift, Lancer, Axio, Premio, Prado and more. Send a straight-on photo of your bumper on WhatsApp and we will confirm.",
      },
      {
        q: "How long does the adhesive last in Sri Lankan heat?",
        a: "The genuine factory heat-activated adhesive is rated well beyond ambient Sri Lankan temperatures. It is the generic tape supplied with counterfeits that fails in heat.",
      },
      {
        q: "Can I fit it myself?",
        a: "You can, but the two things that go wrong — inadequate degreasing and uneven clamping during cure — are exactly the two things that cause the lip to lift at the ends later. Our installation is included in the price.",
      },
    ],
  },

  {
    slug: "window-tint-law-sri-lanka",
    title: "Window Tinting Law in Sri Lanka: What Is Legal, and What Actually Blocks Heat",
    excerpt:
      "Darkness and heat rejection are two different things — and most people buy the wrong one. A practical guide to legal tint levels, ceramic vs carbon film, and why your dashboard is still cooking.",
    category: "guides",
    publishedAt: "2026-08-12",
    author: "Nexmod Workshop",
    readingMinutes: 8,
    tags: ["window tint", "heat rejection", "legal", "ceramic film"],
    featured: true,
    keywords: [
      "window tint law Sri Lanka",
      "legal tint percentage Sri Lanka",
      "ceramic tint Colombo",
      "heat rejection film Sri Lanka",
      "car tint price Sri Lanka",
    ],
    relatedServices: ["window-tinting", "detailing-protection"],
    relatedProducts: ["hydrophobic-glass-coating"],
    body: [
      {
        type: "p",
        text: "There are two completely separate reasons to tint a car, and confusing them is why so many people end up with a dark car that is still unbearably hot inside.",
      },
      { type: "h2", text: "Darkness is not heat rejection" },
      {
        type: "p",
        text: "Visible light transmission (VLT) measures how much visible light passes through. Heat rejection measures how much infrared energy is blocked. These are different parts of the spectrum, and a film can be excellent at one and useless at the other.",
      },
      {
        type: "p",
        text: "Cheap dyed film is very dark and blocks almost no infrared. Good ceramic film can be relatively light and block a large majority of the heat. If your car is dark inside and still an oven after two hours in the sun, you have dyed film.",
      },
      {
        type: "table",
        head: ["Film type", "Heat rejection", "Signal interference", "Typical life"],
        rows: [
          ["Dyed", "Very low (5–15%)", "None", "1–3 years, then purples"],
          ["Metallised", "Moderate (30–45%)", "Yes — GPS, keyless, radio", "5+ years"],
          ["Carbon", "Good (35–50%)", "None", "5–7 years"],
          ["Nano-ceramic", "Excellent (50–65%)", "None", "10+ years"],
        ],
      },
      {
        type: "callout",
        title: "The dyed film tell",
        text: "If you see cars around Colombo with purple-looking side windows, that is dyed film breaking down under UV. The dye oxidises. It cannot be prevented, only replaced.",
      },
      { type: "h2", text: "What the law requires" },
      {
        type: "p",
        text: "Sri Lankan regulations specify minimum visible light transmission levels for vehicle glass, and enforcement is real. Fitting film below the legal threshold risks a fine and being ordered to remove it — at which point you have paid twice.",
      },
      {
        type: "p",
        text: "Because these thresholds are periodically revised, we check the current requirement before every job rather than quoting a number that may be out of date. Ask us and we will tell you what applies right now, and we will not fit below it.",
      },
      {
        type: "quote",
        text: "A tint that gets you stopped is not a bargain. Neither is one you have to scrape off at your own expense.",
      },
      { type: "h2", text: "Why ceramic is worth the difference here" },
      {
        type: "p",
        text: "In a temperate climate, the argument for ceramic over carbon is marginal. In Colombo, it is not.",
      },
      {
        type: "ul",
        items: [
          "A car parked in direct sun for two hours is measurably cooler inside with ceramic film",
          "Air conditioning reaches temperature faster and cycles less, which saves fuel",
          "Dashboard and seat surfaces stay cool enough to touch",
          "UV rejection at 99% protects trim and upholstery from the fading and cracking that ages an interior",
          "Non-metallic construction means no interference with GPS, mobile signal or keyless entry",
        ],
      },
      {
        type: "p",
        text: "If the car is garaged and mostly driven at night, carbon film is perfectly sensible and we will tell you so. If it sits outdoors in Colombo, ceramic is the one upgrade in this category people never regret.",
      },
      { type: "h2", text: "The windscreen: the biggest missed opportunity" },
      {
        type: "p",
        text: "The windscreen is the largest piece of glass on the car and the one facing the sun most directly, and almost nobody treats it — because people assume tinting a windscreen means making it dark, which is neither legal nor safe.",
      },
      {
        type: "p",
        text: "A clear or very light ceramic windscreen film changes this. It is optically almost invisible, keeps VLT well within legal limits, and rejects a large amount of infrared through the biggest heat aperture in the car. On cars that park outdoors, it makes more difference than darkening the side windows further.",
      },
      { type: "h2", text: "How to tell a good installation from a bad one" },
      {
        type: "ol",
        items: [
          "Look at the top edge of the door glass. Film should run fully into the channel with no visible light gap.",
          "Check the rear glass for creases. Rear glass is compound-curved and must be heat-shrunk to shape first — fingernail creases mean it was not.",
          "Look for specks under the film. That is contamination that was not cleaned off, and it is permanent.",
          "Check the defroster lines are intact. Hand-trimming on the glass is how those get cut. Computer-cut patterns never touch them.",
          "Expect haze for the first week. That is slip solution evaporating and it is normal. Bubbling months later is adhesive failure and is not.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long before I can roll my windows down?",
        a: "Three to five days. The adhesive needs to cure fully, and dropping the glass early can drag the film out of the top channel.",
      },
      {
        q: "Will ceramic film affect my dashcam or GPS?",
        a: "No. Ceramic film is non-metallic. It is old metallised film that interferes with signals.",
      },
      {
        q: "Can tint be removed cleanly?",
        a: "Quality film removes cleanly with steam and patience. Degraded dyed film is the difficult one — the layers separate and the adhesive has to be scraped, which is slow and risks rear defroster lines.",
      },
    ],
  },

  {
    slug: "sound-deadening-explained-sri-lanka",
    title: "Why Your Car Speakers Sound Thin (And Why New Speakers Will Not Fix It)",
    excerpt:
      "The most expensive mistake in car audio is buying better speakers for an untreated door. Here is the physics, the fix, and what it actually costs in Sri Lanka.",
    category: "guides",
    publishedAt: "2026-08-15",
    author: "Nexmod Workshop",
    readingMinutes: 7,
    tags: ["car audio", "sound deadening", "speakers", "refinement"],
    featured: true,
    keywords: [
      "sound deadening Sri Lanka",
      "car speakers sound thin",
      "car audio upgrade Colombo",
      "door damping Sri Lanka",
      "car noise reduction",
    ],
    relatedProducts: ["sound-deadening-doors", "component-speaker-set-6-5", "android-head-unit-9-inch"],
    relatedServices: ["sound-deadening", "car-audio-installation"],
    body: [
      {
        type: "p",
        text: "Someone comes in every week with the same complaint: they spent good money on speakers and the sound barely changed. The speakers are usually fine. The door is the problem.",
      },
      { type: "h2", text: "What is actually happening in your door" },
      {
        type: "p",
        text: "A car door is a thin steel box with a large hole cut in it. Your speaker is mounted in that hole, and it radiates sound in two directions at once — forward into the cabin, and backward into the door cavity.",
      },
      {
        type: "p",
        text: "Two things then go wrong. First, the rear wave bounces around inside the cavity and leaks back out through every gap in the inner skin, arriving at your ears out of phase with the front wave and cancelling it. Second, the outer door skin is thin enough to flex in sympathy with the bass, becoming a second, badly-behaved speaker moving in opposition to the first.",
      },
      {
        type: "quote",
        text: "Both effects attack the same frequencies: midbass, roughly 60–200Hz. That is the weight and body in music. Lose it and everything sounds thin, no matter what driver you fit.",
      },
      { type: "h2", text: "Why a better speaker does not solve it" },
      {
        type: "p",
        text: "A more capable speaker produces more midbass energy — into the same cancelling environment. You get slightly more of a signal that is still being destroyed. That is why the upgrade feels underwhelming and why people conclude car audio is not worth the money.",
      },
      { type: "h2", text: "The three-layer fix" },
      {
        type: "ol",
        items: [
          "Constrained-layer butyl damper on the outer skin. This adds mass and shear damping so the panel stops resonating. You do not need full coverage — 25–35% of well-placed coverage does nearly all the work, and covering 100% just adds weight and cost.",
          "Closed-cell foam decoupling layer. This sits over the damper and on the back of the trim card, so nothing touches bare metal and rattles.",
          "Inner skin sealing. Sealing the access holes converts the door into a proper sealed enclosure, so the rear wave stops leaking forward and cancelling.",
        ],
      },
      {
        type: "callout",
        title: "Drain holes stay open",
        text: "The single legitimate worry about deadening is trapped water. Every factory drain hole must stay clear and the bottom of the door must never be sealed. Ask any shop this before they start. Trapped water is caused by careless work, not by the material.",
      },
      { type: "h2", text: "What it costs and what you get" },
      {
        type: "table",
        head: ["Scope", "Typical cost (LKR)", "What changes"],
        rows: [
          ["Front doors", "24,000 – 30,000", "Midbass appears. Door shut sounds solid."],
          ["All four doors", "40,000 – 50,000", "Above, plus 3–5 dB(A) less cabin noise at 80km/h."],
          ["Full car", "90,000 – 110,000", "Roof rain drumming gone. Highway refinement transformed."],
        ],
      },
      {
        type: "p",
        text: "The second benefit is the one nobody comes in for and everybody mentions afterwards. Deadened doors cut road noise, rain noise and wind noise regardless of whether the stereo is on. On a long drive to Galle, that is the difference between arriving relaxed and arriving tired.",
      },
      { type: "h2", text: "The order to spend in" },
      {
        type: "ol",
        items: [
          "Front door deadening — the foundation. Improves the speakers you already own.",
          "Component front stage with tweeters at ear height — lifts the soundstage out of the footwell.",
          "Head unit, if yours lacks the outputs or the tuning you need.",
          "Amplifier — clean headroom, not more volume.",
          "Subwoofer — only after everything above. A sub cannot fix missing midbass; those are different frequencies.",
        ],
      },
      {
        type: "p",
        text: "Most people do this list backwards, starting with the subwoofer because it is the most visible purchase. Then they wonder why the music sounds like bass plus thin.",
      },
      { type: "h2", text: "The weight question" },
      {
        type: "p",
        text: "Four doors adds roughly 6–10kg with targeted coverage. Full car adds 25–35kg. That is a real trade-off and worth knowing — though at Sri Lankan speeds and traffic, it is not something you will feel in the way the refinement gain is.",
      },
    ],
    faqs: [
      {
        q: "Can I do this myself?",
        a: "You can, and the material is available. The two things that go wrong are sealing drain holes by accident and breaking trim clips on removal. If you do it yourself, buy replacement clips for your model before you start.",
      },
      {
        q: "Is it worth deadening the roof?",
        a: "Only as part of a full-car job. The roof's main contribution is rain drumming, which matters a lot in monsoon season and not much otherwise.",
      },
      {
        q: "How long does it take?",
        a: "Front doors are about four hours. All four doors is a full day. Full car is two days.",
      },
    ],
  },

  {
    slug: "led-headlight-upgrade-mistake",
    title: "The LED Headlight Mistake Almost Everyone Makes",
    excerpt:
      "Dropping LED bulbs into halogen reflector housings makes your night vision worse, not better. Here is why the physics does not work, and what actually does.",
    category: "guides",
    publishedAt: "2026-08-18",
    author: "Nexmod Workshop",
    readingMinutes: 6,
    tags: ["lighting", "headlights", "LED", "safety"],
    keywords: [
      "LED headlight upgrade Sri Lanka",
      "bi LED projector retrofit",
      "LED bulb reflector glare",
      "headlight upgrade Colombo",
    ],
    relatedProducts: ["bi-led-projector-conversion", "sequential-drl-strip", "led-fog-lamp-upgrade"],
    relatedServices: ["lighting-installation"],
    body: [
      {
        type: "p",
        text: "LED headlight bulbs are cheap, widely available, and take fifteen minutes to fit. They are also, in a halogen reflector housing, one of the few upgrades that makes your car objectively worse.",
      },
      { type: "h2", text: "Why reflectors are fussy" },
      {
        type: "p",
        text: "A halogen reflector is a precisely computed curved mirror. Its shape is calculated around one assumption: that a small cylindrical filament of a specific size sits at a specific focal point. Every curve in that reflector exists to take light from that exact point and throw it where it belongs on the road, with a sharp cut-off so you do not dazzle oncoming traffic.",
      },
      {
        type: "p",
        text: "An LED bulb does not have a filament. It has flat chips on the sides of a board, emitting from a different shape in a different position. The reflector cannot focus what it was not designed for.",
      },
      {
        type: "table",
        head: ["", "Halogen bulb in reflector", "LED bulb in reflector", "LED in projector"],
        rows: [
          ["Beam cut-off", "Sharp", "Smeared", "Sharp"],
          ["Light on the road", "Adequate", "Less than halogen", "Substantially more"],
          ["Glare to oncoming traffic", "Low", "High", "Low"],
          ["Looks modern", "No", "Yes", "Yes"],
        ],
      },
      {
        type: "callout",
        title: "The counterintuitive part",
        text: "An LED bulb in a reflector often puts less usable light on the road than the halogen it replaced, while producing far more glare. It looks brighter to everyone except the person driving the car.",
      },
      { type: "h2", text: "Why it feels brighter anyway" },
      {
        type: "p",
        text: "Two reasons. First, the light scattered upward makes the whole area in front of the car glow, which reads as brightness. Second, LED light is much cooler in colour temperature, and our eyes perceive cool white as brighter than warm white at the same actual intensity.",
      },
      {
        type: "p",
        text: "So the car feels brighter, oncoming drivers flash you, and your usable distance vision on an unlit road has actually decreased.",
      },
      { type: "h2", text: "What actually works: a projector retrofit" },
      {
        type: "p",
        text: "A projector is a completely different optical system. Light is collected by an elliptical reflector, passed through a shutter that creates the cut-off line, and focused by a lens. The optic is designed around the LED source rather than fighting it.",
      },
      {
        type: "ul",
        items: [
          "Sharp, correct horizontal cut-off — no glare to oncoming traffic",
          "Two to three times the usable light on the road versus halogen",
          "Mechanical shutter for genuine high beam, not just a second brightness setting",
          "Consistent beam pattern that does not degrade as the bulb ages",
        ],
      },
      { type: "h2", text: "What a proper retrofit involves" },
      {
        type: "ol",
        items: [
          "The headlight is oven-baked at low temperature to soften the original butyl seal",
          "The housing is split open and the halogen reflector removed",
          "The bi-LED projector is mounted and aligned to the correct axis",
          "The housing is resealed with fresh butyl and clamped while it cools",
          "Factory breather vents are verified clear — blocked breathers, not the reseal, cause condensation",
          "The beam is aimed on a marked wall board at the correct distance",
        ],
      },
      {
        type: "p",
        text: "That last step matters more than people expect. A perfectly built projector aimed too high dazzles everyone. Aimed too low it wastes its own range. Aiming is not optional and it takes a marked board, not a garage wall and a guess.",
      },
      { type: "h2", text: "What about the fog lamps?" },
      {
        type: "p",
        text: "Fog lamps are the one place where a bulb swap can genuinely help, because fog housings are shallow and less focus-critical. The key is colour: selective yellow at around 3000K scatters least in water vapour. Cool white LED fogs look dramatic and actively hurt visibility in rain, which is the only weather where fog lamps matter.",
      },
      {
        type: "quote",
        text: "If you fit one lighting upgrade for actual driving in Sri Lanka rather than for looks, make it yellow fog lamps. Monsoon rain on the expressway is where they earn it.",
      },
    ],
    faqs: [
      {
        q: "My car came with LED headlights from the factory. Is that different?",
        a: "Completely different. Factory LED headlights use optics designed around the LED source from the start — usually projectors or purpose-computed reflectors. The problem is only with retrofitting LED bulbs into housings designed for halogen.",
      },
      {
        q: "Will a projector retrofit pass inspection?",
        a: "A correctly aimed projector retrofit with a sharp cut-off produces a better and more compliant beam pattern than an LED-in-reflector setup. Aiming is the deciding factor.",
      },
      {
        q: "Can you fix the condensation from a previous retrofit?",
        a: "Usually yes. It is almost always blocked breather vents or a reseal done without cleaning out the old butyl. We can re-open, dry, clean and reseal properly.",
      },
    ],
  },

  {
    slug: "car-modification-trends-sri-lanka-2026",
    title: "Car Modification Trends in Sri Lanka: What Is Actually Popular in 2026",
    excerpt:
      "From the workshop floor in Dehiwala — the builds people are actually asking for this year, what has fallen out of favour, and where the money is going.",
    category: "trends",
    publishedAt: "2026-08-19",
    author: "Nexmod Workshop",
    readingMinutes: 6,
    tags: ["trends", "2026", "Sri Lanka", "modification culture"],
    featured: true,
    keywords: [
      "car modification trends Sri Lanka 2026",
      "popular car mods Sri Lanka",
      "car culture Colombo",
      "modified cars Sri Lanka",
    ],
    relatedProducts: ["ez-lip-pro-universal-front-lip", "ambient-lighting-kit", "carbon-fibre-interior-console-set"],
    relatedServices: ["carbon-fibre-wrapping", "lighting-installation"],
    body: [
      {
        type: "p",
        text: "We see a few hundred cars a year come through the workshop in Dehiwala. That is not a national survey, but it is a real sample of what people in and around Colombo are actually spending money on right now.",
      },
      { type: "h2", text: "1. Interior-first builds have overtaken exterior-first" },
      {
        type: "p",
        text: "The biggest shift of the last two years. People are spending on ambient lighting, carbon console sets, custom seat covers and sound deadening before they touch the outside of the car.",
      },
      {
        type: "p",
        text: "The logic makes sense once you hear it: with import restrictions keeping people in the same cars far longer than planned, the interior is where you actually live. A five-year-old Vezel with a refreshed cabin feels new every morning. The same car with a spoiler does not.",
      },
      { type: "h2", text: "2. Subtle is winning" },
      {
        type: "p",
        text: "Loud full-colour wraps and oversized wings have quietly declined. What is replacing them is a coordinated, restrained look:",
      },
      {
        type: "ul",
        items: [
          "Gloss black B-pillars and mirror caps rather than full colour change",
          "Carbon accents on bumper trim rather than whole panels",
          "Ducktail spoilers instead of roof wings on sedans",
          "Tyre lettering as the finishing detail rather than the headline",
        ],
      },
      {
        type: "quote",
        text: "The most common brief we get now is some version of: make it look like an expensive factory trim level, not like a modified car.",
      },
      { type: "h2", text: "3. Lighting is the single busiest category" },
      {
        type: "p",
        text: "Sequential DRLs and flowing indicators remain the fastest-growing request, and RGB ambient interior lighting has gone from novelty to near-standard on any interior refresh.",
      },
      {
        type: "p",
        text: "What has changed is the quality expectation. Two years ago people wanted the cheapest strip that lit up. Now they arrive asking whether it is fused, whether it will throw a dash warning, and whether it is legal. That is a healthy shift, and it is mostly driven by people who bought cheap once.",
      },
      { type: "h2", text: "4. Comfort and refinement have become mods" },
      {
        type: "p",
        text: "Sound deadening, ceramic window film and 360 cameras used to be niche. They are now regular sellers — because they solve problems people experience every day rather than delivering a look.",
      },
      {
        type: "p",
        text: "This tracks with cars being kept much longer. If you are keeping the car for another five years, a quieter cabin and a cooler interior are worth more than a spoiler.",
      },
      { type: "h2", text: "5. Hybrid owners are a distinct customer now" },
      {
        type: "p",
        text: "Aqua, Vezel, Fit and Prius owners come in with a specific and consistent brief: no additional battery drain, nothing that upsets the electrical system, everything reversible.",
      },
      {
        type: "p",
        text: "They ask better electrical questions than anyone else, and they are right to. Anything that draws current when the car is off is a genuine problem on a hybrid. Everything we fit runs off switched feeds — but on hybrids we get asked to prove it, which we welcome.",
      },
      { type: "h2", text: "6. What has quietly declined" },
      {
        type: "ul",
        items: [
          "Very dark window tint — enforcement plus the arrival of genuinely effective ceramic film",
          "Loud exhausts — noise enforcement and, honestly, a shift in taste",
          "Chrome accents — replaced almost entirely by gloss black and carbon",
          "Oversized roof wings on sedans — the ducktail won",
          "Big boot-mounted subwoofer boxes — under-seat active subs took that market",
        ],
      },
      { type: "h2", text: "Where the money actually goes" },
      {
        type: "p",
        text: "The most common real-world build we quote in 2026 looks like this, in this order:",
      },
      {
        type: "ol",
        items: [
          "Ceramic window film — comfort first",
          "Front door sound deadening",
          "Ambient interior lighting",
          "Carbon console and dash trim",
          "EZ Lip and tyre lettering to finish the exterior",
        ],
      },
      {
        type: "p",
        text: "Total, that lands in the Rs. 90,000–130,000 range and it transforms how a car feels to own — which is a very different goal from how it looks parked, and it is the goal most people now have.",
      },
    ],
    faqs: [
      {
        q: "What is the best value first modification?",
        a: "For most people, ceramic window tint or front door sound deadening. Both improve the car every single day rather than only when you look at it.",
      },
      {
        q: "Do modifications hurt resale value in Sri Lanka?",
        a: "Reversible, quality work generally does not, and tasteful interior work often helps. Irreversible changes — drilled panels, cut looms, poor paint — reliably hurt. This is a strong argument for bonded and plug-and-play installs over cut-and-splice.",
      },
    ],
  },

  {
    slug: "monsoon-car-care-checklist-sri-lanka",
    title: "Monsoon Car Care: A Practical Checklist for Sri Lankan Drivers",
    excerpt:
      "Visibility, water ingress, electrical faults and interior damp — what actually goes wrong in monsoon season and the cheap fixes that prevent most of it.",
    category: "care",
    publishedAt: "2026-08-20",
    author: "Nexmod Workshop",
    readingMinutes: 7,
    tags: ["monsoon", "car care", "maintenance", "safety"],
    keywords: [
      "monsoon car care Sri Lanka",
      "rainy season car tips",
      "car water leak Sri Lanka",
      "hydrophobic windscreen Sri Lanka",
    ],
    relatedProducts: ["hydrophobic-glass-coating", "frameless-wiper-pair", "led-fog-lamp-upgrade", "seven-d-floor-mats"],
    relatedServices: ["detailing-protection", "lighting-installation"],
    body: [
      {
        type: "p",
        text: "Monsoon season does predictable damage to cars here, and almost all of it is preventable for less than the cost of one repair. This is the checklist we run through with customers before the rains.",
      },
      { type: "h2", text: "Visibility first — it is the safety item" },
      {
        type: "ol",
        items: [
          "Replace wipers if they judder, streak or leave a haze. Silicone frameless blades last longer under UV and leave a light hydrophobic film as they wipe.",
          "Apply a hydrophobic windscreen coating. Above roughly 60 km/h, water beads and blows clear on its own — on the expressway in heavy rain you often will not need wipers at all.",
          "Clean the inside of the glass. Interior film from plastics off-gassing is why your screen fogs faster than it should, and it is invisible until you wipe it.",
          "Check your demister works on both front and rear glass before you need it in traffic.",
          "Fit selective-yellow fog lamps if you drive intercity. Cool white fogs actively hurt in rain; 3000K yellow scatters least in water vapour.",
        ],
      },
      {
        type: "callout",
        title: "The cheapest safety upgrade in this article",
        text: "A hydrophobic glass coating costs less than a tank of fuel and genuinely changes how much you can see in a downpour. If you do one thing on this list, do that.",
      },
      { type: "h2", text: "Water ingress — find it before it finds your carpet" },
      {
        type: "p",
        text: "Water gets in through a small number of predictable places. Check them while it is still dry:",
      },
      {
        type: "ul",
        items: [
          "Door drain holes. Open the bottom edge of each door — there are drain slots. Poke them clear. Blocked drains mean water sits inside the door and rusts it from the inside out.",
          "Sunroof drains, if fitted. These run down the pillars and clog with dust and leaf debris. A blocked sunroof drain floods a headliner.",
          "Bonnet and boot seals. Squeeze the rubber; if it stays compressed instead of springing back, it is done.",
          "Aftermarket fittings. Any spoiler, aerial, camera or roof rack that was bolted through metal is a potential water path if it was not butyl-sealed.",
          "Windscreen surround. If your screen has ever been replaced, check the seal edge carefully.",
        ],
      },
      {
        type: "p",
        text: "A musty smell after rain is not the air conditioning. It is water sitting in the carpet underlay, and it will corrode floor pan metal from above while you ignore it.",
      },
      { type: "h2", text: "Electrical — where cheap installs fail" },
      {
        type: "p",
        text: "Monsoon season is when badly installed accessories reveal themselves. Water finds a scotch-lock connector, corrosion starts, and something stops working — or worse, something shorts.",
      },
      {
        type: "ul",
        items: [
          "Check every aftermarket light, camera and sensor still works before the rains",
          "Look for cables entering the cabin without a grommet — that is a direct water path",
          "Any connector below the door sill line should have a drip loop so water drips off rather than tracking in",
          "Flickering, intermittent faults are almost always connection corrosion, not component failure",
        ],
      },
      { type: "h2", text: "Interior — stopping damp before it starts" },
      {
        type: "ol",
        items: [
          "Fit proper model-specific mats with raised edges. Water, sand and mud stay in the tray instead of soaking into carpet.",
          "Lift the mats out weekly during the rains and let the carpet breathe. Mats that stay down trap moisture against the floor pan.",
          "Run the air conditioning on fresh air rather than recirculate for the last few minutes of a drive — it dries the evaporator and prevents the smell.",
          "Keep a plush microfibre towel in the door pocket for the inside of the windscreen.",
          "If the carpet is already wet, lift it and dry it properly. Drying the surface while the underlay stays soaked achieves nothing.",
        ],
      },
      { type: "h2", text: "Paint and trim" },
      {
        type: "p",
        text: "Sri Lankan rain is not clean. It carries dust, salt near the coast, and industrial fallout, and it dries on the paint leaving mineral deposits that bond and etch.",
      },
      {
        type: "ul",
        items: [
          "Rinse the car after heavy rain, even if you do not wash it properly",
          "An SiO2 spray sealant makes rain sheet off and stops deposits bonding — a ten-minute job every few months",
          "Pay attention to the lower quarter panels, where road spray concentrates",
          "Near the coast, rinse the underside occasionally — salt is not just a temperate-climate problem",
        ],
      },
      { type: "h2", text: "The five-minute version" },
      {
        type: "p",
        text: "If you do nothing else: clear your door drains, replace tired wipers, and get a hydrophobic coating on the windscreen. Those three prevent most monsoon damage and all of the monsoon danger.",
      },
    ],
    faqs: [
      {
        q: "How long does a hydrophobic glass coating last?",
        a: "Eight to twelve months when the glass is properly clay-barred and cerium-polished first. Sprayed onto unprepared glass, closer to six weeks — which is why preparation is most of the job.",
      },
      {
        q: "My car smells musty after rain. What is it?",
        a: "Almost always water in the carpet underlay from a blocked drain — door, sunroof or air-conditioning condensate. Find the source before treating the smell, or it comes straight back.",
      },
      {
        q: "Are LED fog lamps better in rain?",
        a: "Only if they are selective yellow, around 3000K. Cool white LED fogs scatter badly in water vapour and reduce visibility. Colour matters more than brightness here.",
      },
    ],
  },

  {
    slug: "how-to-choose-android-head-unit",
    title: "How to Choose an Android Head Unit (Without Buying One Twice)",
    excerpt:
      "RAM, chipset, CANbus harnesses and the specs that actually matter. A buyer's guide to the most confusing product category in car audio.",
    category: "guides",
    publishedAt: "2026-08-22",
    author: "Nexmod Workshop",
    readingMinutes: 8,
    tags: ["car audio", "head unit", "android", "buying guide"],
    keywords: [
      "android head unit Sri Lanka",
      "car player buying guide",
      "apple carplay Sri Lanka",
      "best android car player Colombo",
    ],
    relatedProducts: ["android-head-unit-9-inch", "component-speaker-set-6-5", "reverse-camera-hd"],
    relatedServices: ["car-audio-installation"],
    body: [
      {
        type: "p",
        text: "Android head units are the most confusing product we sell, because the listings are written to obscure rather than inform. Two units at wildly different prices will both claim a nine-inch screen, Android, CarPlay and GPS. Here is what actually separates them.",
      },
      { type: "h2", text: "RAM is the spec that decides everything" },
      {
        type: "p",
        text: "If you remember one thing: 2GB is the floor, 4GB is the sensible choice, and 1GB units should not be sold at all.",
      },
      {
        type: "table",
        head: ["RAM", "Real-world behaviour"],
        rows: [
          ["1GB", "Slow boot, apps reload constantly, unusable within a year of updates"],
          ["2GB", "Fine alone, stutters with navigation and music together"],
          ["4GB", "Smooth. Navigation, music and CarPlay all comfortable."],
          ["8GB", "Overkill for most, useful if running dashcam apps or heavy multitasking"],
        ],
      },
      {
        type: "callout",
        title: "Why cheap units get worse over time",
        text: "Apps grow with every update. A 2GB unit that is fine today will be tight in eighteen months. This is why buying cheap in this category so often means buying twice.",
      },
      { type: "h2", text: "The chipset nobody lists" },
      {
        type: "p",
        text: "Listings mention 'octa-core' and stop there. But an eight-year-old octa-core chip is slower than a current quad-core, and the chip decides screen responsiveness, boot time, and whether video playback stutters.",
      },
      {
        type: "p",
        text: "Ask for the actual chipset model. If the seller cannot tell you, that is your answer.",
      },
      { type: "h2", text: "Wireless CarPlay and Android Auto" },
      {
        type: "p",
        text: "Wireless is worth having. With a wired unit you plug in every single trip, and within a month you stop bothering and the feature is wasted.",
      },
      {
        type: "p",
        text: "Check that it is genuinely wireless CarPlay and not a dongle-based workaround, which adds a connection delay of fifteen to twenty seconds every time you get in.",
      },
      { type: "h2", text: "The harness matters more than the head unit" },
      {
        type: "p",
        text: "This is the part buyers never ask about and installers should always raise. A model-specific CANbus harness lets the new unit talk to your car's existing systems, so you keep:",
      },
      {
        type: "ul",
        items: [
          "Steering wheel controls — volume, track, phone, voice",
          "Factory reverse camera",
          "Parking sensor chimes and warning tones",
          "Door-ajar and seatbelt chimes routed through the speakers",
          "Factory amplifier integration where fitted",
        ],
      },
      {
        type: "p",
        text: "Without the right harness, an installer has to cut into the factory loom — which loses some of those functions, makes the install irreversible, and will be noticed by any buyer when you sell the car.",
      },
      {
        type: "quote",
        text: "Always ask: is this plug-and-play with a model-specific harness, or are you cutting my loom? The answer tells you what kind of shop you are dealing with.",
      },
      { type: "h2", text: "Screen quality: IPS and brightness" },
      {
        type: "p",
        text: "Insist on IPS. Cheaper TN panels wash out badly when viewed from the driver's angle — which is the only angle that matters — and become unreadable in daylight.",
      },
      {
        type: "p",
        text: "Brightness matters more here than in most markets. A screen that looks fine in a showroom can be unreadable at 2pm in Colombo with sun through the windscreen.",
      },
      { type: "h2", text: "Specs you can safely ignore" },
      {
        type: "ul",
        items: [
          "Storage above 64GB — you will stream, not store",
          "Built-in DVD drives — genuinely nobody uses these",
          "'Maximum power 4x60W' claims — that is peak, not RMS, and it is marketing",
          "Built-in 4G — a phone hotspot works better and you already pay for it",
          "DSP presets with names like 'Rock' and 'Pop' — a proper installer tunes to the car, not to a preset",
        ],
      },
      { type: "h2", text: "What to actually buy" },
      {
        type: "p",
        text: "For most cars: 9-inch IPS, 4GB/64GB, current-generation octa-core, wireless CarPlay and Android Auto, four-channel pre-outs with DSP, fitted with a model-specific fascia and CANbus harness.",
      },
      {
        type: "p",
        text: "That specification will still feel fine in four years, keeps every factory function working, and comes out cleanly when you sell the car.",
      },
    ],
    faqs: [
      {
        q: "Will a new head unit improve my sound quality?",
        a: "Somewhat — better DAC, cleaner pre-outs, and real tuning control. But if your doors are untreated, the door is still your bottleneck. Deadening plus your existing head unit will usually beat a new head unit alone.",
      },
      {
        q: "Can I keep my factory screen and still get CarPlay?",
        a: "On many newer cars, yes — via an integration module that feeds CarPlay into the factory display and retains the factory interface. On cars with a large integrated screen this is usually the better route.",
      },
      {
        q: "Is it reversible if I sell the car?",
        a: "With a model-specific fascia and CANbus harness, completely. Unplug, refit the original unit, and there is no evidence anything changed. With a cut loom, it is not.",
      },
    ],
  },

  {
    slug: "nexmod-official-ez-lip-agent-sri-lanka",
    title: "Nexmod Named Official EZ Lip Agent for Sri Lanka",
    excerpt:
      "Genuine EZ Lip and EZ Lip Pro products are now supplied and professionally installed exclusively at our Dehiwala workshop — with full warranty and counterfeit protection.",
    category: "news",
    publishedAt: "2026-07-15",
    author: "Nexmod",
    readingMinutes: 3,
    tags: ["EZ Lip", "news", "announcement"],
    keywords: ["EZ Lip Sri Lanka agent", "official ez lip dealer Sri Lanka", "genuine ez lip Colombo"],
    relatedProducts: ["ez-lip-pro-universal-front-lip", "ez-lip-original-front-lip"],
    relatedServices: ["ez-lip-installation"],
    body: [
      {
        type: "p",
        text: "Nexmod is the official Sri Lankan agent for EZ Lip USA. Genuine EZ Lip and EZ Lip Pro products are sold and installed in Sri Lanka exclusively through our Dehiwala workshop.",
      },
      { type: "h2", text: "What this means for customers" },
      {
        type: "ul",
        items: [
          "Genuine EZ Lip USA product in factory packaging with factory heat-activated adhesive",
          "Full 12-month manufacturer warranty, honoured locally",
          "Professional installation included — dry fit, degrease, bond and clamped cure",
          "Direct supply, so stock stays available rather than arriving in unpredictable batches",
        ],
      },
      { type: "h2", text: "Why the agency exists" },
      {
        type: "p",
        text: "Counterfeit EZ Lip products have circulated in the region for some years. They look correct on day one and use a harder polymer compound that goes chalky under UV and cracks on the first meaningful impact — which defeats the entire purpose of choosing a flexible lip.",
      },
      {
        type: "p",
        text: "An authorised local agency means there is a single, verifiable source of genuine product on the island, and a local warranty path if anything goes wrong.",
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "EZ Lip Original and EZ Lip Pro are in stock in gloss black and carbon-look, in standard 2.4m and XL 3.0m lengths, at 71 Sri Saranankara Road, Dehiwala. Installation takes 75–90 minutes and you can wait for it.",
      },
    ],
  },

  {
    slug: "360-camera-worth-it-sri-lanka",
    title: "Is a 360° Camera Worth It in Sri Lanka? An Honest Assessment",
    excerpt:
      "The most useful electronic upgrade for city driving — but only if it is calibrated. What these systems do, what they cost, and the step almost every installer skips.",
    category: "guides",
    publishedAt: "2026-08-25",
    author: "Nexmod Workshop",
    readingMinutes: 6,
    tags: ["360 camera", "parking", "safety", "buying guide"],
    keywords: [
      "360 camera Sri Lanka worth it",
      "bird eye camera price Sri Lanka",
      "360 camera installation Colombo",
      "reverse camera vs 360",
    ],
    relatedProducts: ["camera-360-3d-system", "parking-sensor-kit", "reverse-camera-hd"],
    relatedServices: ["camera-safety-installation"],
    body: [
      {
        type: "p",
        text: "A 360-degree camera system is the single most useful electronic upgrade for driving in Colombo — and it is also the one most often installed badly, in a way that makes it actively dangerous.",
      },
      { type: "h2", text: "What it actually does" },
      {
        type: "p",
        text: "Four wide-angle cameras — front grille, both mirrors, rear — feed a processing module that corrects each lens's fisheye distortion, transforms each image to a top-down perspective, and stitches all four into one continuous overhead view of your car and its surroundings.",
      },
      {
        type: "p",
        text: "The result on screen looks like a drone hovering above your car. In a Colombo multi-storey, a narrow Dehiwala lane, or reversing out of a shop frontage onto Galle Road, it removes the guesswork entirely.",
      },
      { type: "h2", text: "The step that makes or breaks it: calibration" },
      {
        type: "p",
        text: "The module has to know precisely where each camera is mounted and at what angle in order to stitch the four images into a coherent picture. That information comes from calibration — parking the car on a mat with printed reference markings and aligning each camera's stitch boundary to the physical marks.",
      },
      {
        type: "callout",
        title: "Why an uncalibrated system is worse than no system",
        text: "Without calibration, the seams do not align with reality — and the seams sit exactly at the four corners of your car, which are the places you are looking. Kerbs appear to bend. A bollard can vanish into a seam. You have been given a confident picture that is wrong, and you have learned to trust it.",
      },
      {
        type: "p",
        text: "Calibration adds about an hour to the job. It is the first thing dropped when a shop is competing on price, and it is invisible at handover unless you know to check the seams.",
      },
      { type: "h2", text: "How to check the install yourself" },
      {
        type: "ol",
        items: [
          "Park with a straight painted line running alongside the car. In the overhead view, that line should be continuous and straight through every seam. If it kinks, the system is not calibrated.",
          "Place a cone or bottle at each corner of the car. Each should be visible, and none should disappear into a seam.",
          "Check brightness matching. Cameras should be balanced so the overhead view does not have obviously lighter and darker quadrants.",
          "Test every trigger — reverse gear, both indicators, the manual button.",
        ],
      },
      { type: "h2", text: "What it costs" },
      {
        type: "table",
        head: ["System", "Typical fitted price (LKR)", "Best for"],
        rows: [
          ["Reverse camera only", "9,000 – 14,000", "Basic rear visibility"],
          ["Parking sensors (8)", "16,000 – 22,000", "Audible distance, no screen needed"],
          ["Reverse camera + sensors", "24,000 – 32,000", "Most cars — the sensible middle"],
          ["2D 360 system", "48,000 – 62,000", "Tight parking, larger vehicles"],
          ["3D 360 system", "65,000 – 85,000", "SUVs, poor visibility, maximum awareness"],
        ],
      },
      { type: "h2", text: "Who genuinely benefits" },
      {
        type: "ul",
        items: [
          "SUV and larger vehicle drivers — where the bonnet hides everything close in front",
          "Anyone regularly using multi-storey or basement car parks",
          "Drivers navigating narrow lanes with walls on both sides",
          "New drivers building spatial confidence",
          "Anyone who has already kerbed an alloy wheel more than once",
        ],
      },
      { type: "h2", text: "Who does not need one" },
      {
        type: "p",
        text: "If you drive a small hatchback with good all-round visibility and you park mostly on the street, a reverse camera plus rear sensors will cover you for a quarter of the cost. We will tell you that rather than sell you the bigger system — a 360 on a Vitz is a solution looking for a problem.",
      },
    ],
    faqs: [
      {
        q: "Will it work with my factory screen?",
        a: "On most cars, yes, through a decoder module. A few models have screens that cannot accept an external video input at all, in which case pairing with an Android head unit is the route. This should be confirmed before quoting, not discovered mid-install.",
      },
      {
        q: "Do the cameras survive monsoon rain?",
        a: "The cameras are IP68 and fully sealed. What matters just as much is that every cable passes through a proper grommet with a drip loop, so water drips off rather than tracking into a connector.",
      },
      {
        q: "Does it need recalibrating?",
        a: "Yes — after any bumper repair or replacement, or after a mirror is knocked out of position. If the camera moves, the stitch is wrong.",
      },
    ],
  },

  {
    slug: "tyre-stickers-guide-sri-lanka",
    title: "Tyre Stickers in Sri Lanka: Why Vinyl Fails and Rubber Lettering Does Not",
    excerpt:
      "Sidewall lettering is the detail that finishes a wheel setup — but only one type survives here. The difference between vinyl stickers and bonded rubber lettering.",
    category: "guides",
    publishedAt: "2026-08-28",
    author: "Nexmod Workshop",
    readingMinutes: 5,
    tags: ["tyre stickers", "TyreDeckz", "styling"],
    keywords: [
      "tyre stickers Sri Lanka",
      "tire lettering Colombo",
      "TyreDeckz Sri Lanka",
      "white letter tyres price",
    ],
    relatedProducts: ["tyredeckz-tyre-stickers-set", "side-decal-stickers-custom"],
    relatedServices: ["tyre-lettering"],
    body: [
      {
        type: "p",
        text: "Sidewall lettering is one of those details that seems trivial until you see the same car with and without it. It finishes a wheel setup the way a watch strap finishes a watch.",
      },
      { type: "h2", text: "Two completely different products" },
      {
        type: "table",
        head: ["", "Vinyl tyre stickers", "Bonded rubber lettering"],
        rows: [
          ["Material", "Adhesive vinyl", "Moulded rubber"],
          ["Attachment", "Sits on the sidewall surface", "Chemically bonded into the rubber"],
          ["Flexes with tyre", "No", "Yes"],
          ["Typical life here", "2–8 weeks", "Life of the tyre"],
          ["Cost (set of 4)", "Rs. 3,000 – 6,000", "Rs. 13,000 – 16,000"],
        ],
      },
      { type: "h2", text: "Why vinyl fails, specifically" },
      {
        type: "p",
        text: "A tyre sidewall flexes on every single rotation — that flex is its job, absorbing road irregularity. At 60 km/h a tyre rotates roughly eight times per second, so the sidewall goes through hundreds of thousands of flex cycles in a week.",
      },
      {
        type: "p",
        text: "Vinyl does not flex the same amount, so a shear stress develops at the bond line on every one of those cycles. It cracks first at the shoulder, where flex is greatest. Then monsoon standing water works under the lifted edge, and the rest peels.",
      },
      {
        type: "quote",
        text: "Vinyl tyre stickers are not badly made. They are the wrong material for a surface that changes shape hundreds of thousands of times a week.",
      },
      { type: "h2", text: "How bonded rubber lettering works" },
      {
        type: "p",
        text: "The letters are moulded rubber, applied with a chemical bonding agent that creates a bond between two pieces of the same material. Because the letter is rubber, it flexes exactly as much as the sidewall flexes. No shear stress develops, so there is nothing to crack.",
      },
      { type: "h2", text: "Getting it right" },
      {
        type: "ol",
        items: [
          "Degreasing is most of the job. Almost every tyre arriving has silicone tyre dressing on it, and lettering will not bond through it.",
          "Letter height must suit the sidewall. Low-profile tyres need smaller lettering — oversized letters on a 40-series sidewall look cramped and crack sooner at the edges.",
          "Alignment should be consistent relative to the valve stem across all four wheels, so text sits in the same place on every tyre.",
          "The bond needs to cure before driving.",
        ],
      },
      { type: "h2", text: "Living with it" },
      {
        type: "ul",
        items: [
          "Use water-based tyre dressings only — solvent-heavy shine products attack the bond over time",
          "Wipe the lettering clean after dressing the rest of the sidewall",
          "Pressure wash at sensible distance",
          "The lettering stays with the tyre — new tyres need a new set",
        ],
      },
      {
        type: "p",
        text: "Do that and the lettering lasts as long as the tyre does, which is precisely the point.",
      },
    ],
    faqs: [
      {
        q: "Does it affect wheel balance?",
        a: "No. The material weight is negligible and it is applied symmetrically around the sidewall. We have never had to rebalance a wheel after lettering.",
      },
      {
        q: "Can I have a custom logo?",
        a: "Text and standard character sets, yes. Complex logos are constrained by the moulded letter format — bring us the idea and we will tell you honestly whether it will work.",
      },
      {
        q: "Is it legal?",
        a: "Sidewall lettering does not affect the tyre's structure or its load and speed markings, which remain fully visible. It is a cosmetic surface application.",
      },
    ],
  },

  {
    slug: "modifications-that-hurt-resale-value",
    title: "Which Modifications Hurt Resale Value in Sri Lanka (And Which Do Not)",
    excerpt:
      "With cars being kept longer than ever, reversibility has become the single most important question in modifying. A practical guide to what buyers forgive and what they do not.",
    category: "guides",
    publishedAt: "2026-09-01",
    author: "Nexmod Workshop",
    readingMinutes: 7,
    tags: ["resale", "buying guide", "reversibility"],
    keywords: [
      "car modification resale value Sri Lanka",
      "do mods hurt resale",
      "reversible car modifications",
      "selling modified car Sri Lanka",
    ],
    relatedServices: ["carbon-fibre-wrapping", "car-audio-installation", "interior-fitting"],
    relatedProducts: ["android-head-unit-9-inch", "seven-d-floor-mats"],
    body: [
      {
        type: "p",
        text: "Import restrictions have changed the calculation on modifying cars in Sri Lanka. People are keeping vehicles far longer than they planned, and when they do sell, the buyer pool is larger and more discerning than it used to be.",
      },
      {
        type: "p",
        text: "That makes one question more important than any styling decision: can it be undone?",
      },
      { type: "h2", text: "The reversibility test" },
      {
        type: "p",
        text: "Before any modification, ask what it takes to return the car to standard, and what evidence remains afterwards. That single question sorts nearly everything.",
      },
      {
        type: "table",
        head: ["Reversibility", "Examples", "Resale impact"],
        rows: [
          ["Fully reversible, no trace", "Vinyl wraps, bonded lips, plug-and-play head units, seat covers, mats", "Neutral to positive"],
          ["Reversible with minor work", "Bonded spoilers, sound deadening, ambient lighting", "Neutral"],
          ["Reversible with visible trace", "Bolted spoilers, drilled sensors, headlight retrofits", "Slightly negative"],
          ["Irreversible", "Cut looms, cut bumpers, poor respray, drilled roof", "Clearly negative"],
        ],
      },
      { type: "h2", text: "What actually helps" },
      {
        type: "ul",
        items: [
          "A quality plug-and-play head unit with CarPlay — buyers see it as a feature and it costs them nothing to keep",
          "Ceramic window tint — comfort with no downside, and the buyer inherits it",
          "Sound deadening — invisible, permanent, and the car simply feels better built on the test drive",
          "Custom mats and seat covers — they protect the original trim underneath, which is the real value",
          "Reverse camera and parking sensors — read as safety equipment, not modification",
        ],
      },
      {
        type: "callout",
        title: "The underrated one",
        text: "Seat covers and floor mats fitted from new mean the original upholstery and carpet come out looking nearly new years later. That preserved original interior is worth more at sale than the covers cost.",
      },
      { type: "h2", text: "What hurts" },
      {
        type: "ol",
        items: [
          "A cut factory wiring loom. This is the worst of all, because it is permanent, hard to fully assess, and it makes a careful buyer wonder what else was done badly.",
          "Drilled bodywork that was not sealed. Rust around a spoiler mount tells a buyer everything about how the car was treated.",
          "Poor paintwork. A colour-mismatched panel or orange-peel respray reads as accident damage whether or not it was.",
          "Very dark illegal tint. The buyer inherits the legal problem and the cost of removing it.",
          "Loud exhausts. Small enthusiast market, and everyone else discounts for the cost of putting it back.",
          "Anything drawing current with the ignition off. On a hybrid especially, this is an immediate red flag.",
        ],
      },
      { type: "h2", text: "The grey areas" },
      {
        type: "p",
        text: "Some modifications are neutral or positive to the right buyer and negative to everyone else. Aggressive body kits, very low suspension and bright colour wraps all fall here. They narrow your buyer pool rather than reducing the car's value outright.",
      },
      {
        type: "p",
        text: "If the modification is reversible, that narrowing costs you nothing — you can return the car to standard before selling. If it is not, you have permanently reduced the number of people who will buy it.",
      },
      { type: "h2", text: "Keep the original parts" },
      {
        type: "p",
        text: "This is the most practical advice in this article and the most commonly ignored. Keep the original head unit, the original mirror caps, the standard grille, the factory wheels. Box them and label them.",
      },
      {
        type: "quote",
        text: "A buyer who does not want your modifications will still buy the car if you can hand them the original parts in a box. Without that box, they walk away or they discount heavily.",
      },
      { type: "h2", text: "How we approach it" },
      {
        type: "p",
        text: "Almost everything we fit is deliberately reversible: bonded rather than bolted where the design allows, plug-and-play harnesses rather than cut looms, film rather than paint. That is not only about resale — it is about not making permanent decisions on your behalf for a look you may not want in three years.",
      },
    ],
    faqs: [
      {
        q: "Should I remove modifications before selling?",
        a: "Depends on the buyer pool. Tasteful, quality work usually helps. Polarising work is worth reversing if reversing is cheap. Either way, having the original parts available gives you the option — which is the whole point.",
      },
      {
        q: "Does a vinyl wrap hurt resale?",
        a: "Not if it is quality film professionally applied. It has protected the paint underneath. The risk is a cheap wrap left on for years, where the covered paint has faded differently from the exposed paint around it.",
      },
      {
        q: "Will a buyer know if my loom was cut?",
        a: "Any competent inspection will find it, and a lot of private buyers now bring someone who checks. It is also the single fastest way to lose trust mid-negotiation.",
      },
    ],
  },

  /* ------------------------------------------------------------------------
   * SCHEDULED — these have future publish dates and stay hidden from the site,
   * sitemap and RSS feed until their date arrives. See src/lib/content.ts.
   * ---------------------------------------------------------------------- */

  {
    slug: "ambient-lighting-guide-sri-lanka",
    title: "Ambient Interior Lighting: How to Get the Factory Look, Not the Cheap One",
    excerpt:
      "Fibre-optic strand, hidden sources and proper trim work — what separates ambient lighting that looks built-in from lighting that looks stuck on.",
    category: "guides",
    publishedAt: "2026-09-05",
    author: "Nexmod Workshop",
    readingMinutes: 6,
    tags: ["lighting", "interior", "ambient"],
    keywords: [
      "ambient lighting car Sri Lanka",
      "interior LED Colombo",
      "fibre optic ambient light price",
      "car mood lighting Sri Lanka",
    ],
    relatedProducts: ["ambient-lighting-kit", "carbon-fibre-interior-console-set"],
    relatedServices: ["lighting-installation", "interior-fitting"],
    body: [
      {
        type: "p",
        text: "Ambient lighting has gone from novelty to near-standard on interior refreshes in the last two years. It is also the modification where the gap between a good job and a cheap one is most obvious the moment you open the door at night.",
      },
      { type: "h2", text: "The single rule: never see the source" },
      {
        type: "p",
        text: "Factory ambient lighting works because you see a line of glow and never the LEDs producing it. Cheap installs stick an LED strip along a door card, and you see a row of bright dots with dark gaps between them.",
      },
      {
        type: "p",
        text: "Fibre-optic strand solves this. A single RGB illuminator sits hidden inside the trim, and light travels down a thin fibre that glows evenly along its entire length. What you see is a continuous line, not dots.",
      },
      { type: "h2", text: "Where it belongs" },
      {
        type: "ul",
        items: [
          "The seam line across the dashboard — the highest-impact single run",
          "Door card contour lines, following the existing design crease",
          "Footwells, angled downward so it lights the floor rather than your eyes",
          "Centre console edges and cup holder surrounds",
          "Under the seats, subtly, for rear passengers",
        ],
      },
      {
        type: "callout",
        title: "Follow the design lines the car already has",
        text: "The reason factory ambient lighting looks right is that it traces lines the interior designer already drew. Running a strand across a flat panel with no existing feature always looks added on, no matter how well it is installed.",
      },
      { type: "h2", text: "What a proper install involves" },
      {
        type: "ol",
        items: [
          "Door cards and dash trim come off. There is no shortcut — strand tucked into a seam from outside will work loose.",
          "The seam is opened slightly, strand seated and secured along its run.",
          "The illuminator is mounted where it can be reached later for service but never seen.",
          "Wiring runs to a switched ignition feed with an inline fuse.",
          "New trim clips on reassembly — reused broken clips are why cheap trim work rattles.",
        ],
      },
      { type: "h2", text: "Control and colour" },
      {
        type: "p",
        text: "App control over colour, brightness and mode is standard now. Music-reactive modes are fun for a week and then most people settle on one colour at low brightness.",
      },
      {
        type: "p",
        text: "A practical tip: set brightness lower than feels right in the showroom. At night on a dark road, ambient lighting that seemed subtle in daylight becomes a distraction reflected in the windscreen.",
      },
      { type: "h2", text: "Power draw" },
      {
        type: "p",
        text: "A full ambient kit draws well under 20W. Wired to a switched feed it is completely dead when the car is off, so there is no parasitic drain — which matters especially on hybrids, where any always-live accessory is a genuine problem.",
      },
    ],
    faqs: [
      {
        q: "Will removing my door cards cause rattles?",
        a: "Not if clips are replaced rather than reused. Broken clips reinstalled are the reason most trim work rattles afterwards. Ask whether the shop stocks clips for your model.",
      },
      {
        q: "Is coloured interior lighting legal while driving?",
        a: "Interior lighting is not restricted the way forward-facing exterior lighting is. Keep it dim enough not to reflect in the windscreen, which is a genuine visibility issue rather than a legal one.",
      },
    ],
  },

  {
    slug: "new-car-first-90-days-protection",
    title: "Your New Car's First 90 Days: What to Do Before the Damage Starts",
    excerpt:
      "Paint protection, tint and mats are cheapest and most effective on a car that is still perfect. A practical first-three-months plan.",
    category: "care",
    publishedAt: "2026-09-10",
    author: "Nexmod Workshop",
    readingMinutes: 6,
    tags: ["new car", "protection", "detailing", "care"],
    keywords: [
      "new car protection Sri Lanka",
      "ceramic coating new car Colombo",
      "paint protection Sri Lanka",
      "new car checklist",
    ],
    relatedServices: ["detailing-protection", "window-tinting", "interior-fitting"],
    relatedProducts: ["seven-d-floor-mats", "ceramic-spray-sealant", "hydrophobic-glass-coating"],
    body: [
      {
        type: "p",
        text: "Everything in car care is cheaper and more effective before the damage happens. A new or newly acquired car is the one moment when protection costs the least and delivers the most, because there is nothing to correct first.",
      },
      { type: "h2", text: "Week one: stop the avoidable damage" },
      {
        type: "ol",
        items: [
          "Fit proper model-specific floor mats immediately. Grit ground into new carpet in the first month is permanent.",
          "Fit seat covers if you have children, pets, or a job involving anything dusty. The original upholstery underneath stays new, and that is what a buyer values years later.",
          "Never take it through an automatic brush wash. Brush washes are the single largest cause of the swirl marks you will later pay to have polished out.",
          "Buy two buckets, two grit guards and a pH-neutral shampoo. That is the entire investment needed to avoid ever creating swirls.",
        ],
      },
      {
        type: "callout",
        title: "The single most valuable habit",
        text: "Two-bucket washing — one bucket for soapy water, one for rinsing the mitt, both with grit guards. It costs almost nothing and prevents most of what paint correction later exists to fix.",
      },
      { type: "h2", text: "Weeks two to four: protect" },
      {
        type: "p",
        text: "Manufacturers recommend waiting roughly 30 days before applying a coating to factory paint, allowing any final curing to complete. That window is the right moment.",
      },
      {
        type: "ul",
        items: [
          "Ceramic window film — the biggest daily comfort gain, and it stops UV degrading your new interior from day one",
          "A paint sealant or ceramic coating on decontaminated paint — no correction needed, because there is nothing to correct",
          "A hydrophobic glass coating on the windscreen — safety in monsoon rain, and it is cheap",
          "Interior fabric or leather protection before the first spill, not after",
        ],
      },
      { type: "h2", text: "Months two and three: the details" },
      {
        type: "p",
        text: "With protection in place, this is when to consider anything that improves how the car feels to live with:",
      },
      {
        type: "ul",
        items: [
          "Front door sound deadening — quieter cabin, better audio, completely invisible",
          "Reverse camera or parking sensors if the car did not come with them",
          "Ambient lighting, if you want it — better done before the interior has been apart for anything else",
          "Boot liner, before the first wet or dirty load",
        ],
      },
      { type: "h2", text: "What to avoid in the first year" },
      {
        type: "ol",
        items: [
          "Anything requiring drilling. Live with the car first — most people's taste in modification changes once the novelty settles.",
          "Cheap accessories that need replacing. Buying twice is more expensive than buying once.",
          "Anything irreversible. See our guide on resale value — reversibility is the question that matters most now.",
          "Paint correction. A new car does not need it. If someone suggests polishing a new car, they are removing clear coat for no reason.",
        ],
      },
      { type: "h2", text: "The realistic budget" },
      {
        type: "table",
        head: ["Item", "Typical cost (LKR)", "When"],
        rows: [
          ["Model-specific mats", "21,000 – 28,000", "Week 1"],
          ["Seat covers", "42,000 – 62,000", "Week 1"],
          ["Ceramic window film", "32,000 – 45,000", "Weeks 2–4"],
          ["Paint sealant / coating", "18,000 – 65,000", "Weeks 2–4"],
          ["Glass coating", "7,000 – 9,000", "Weeks 2–4"],
          ["Front door deadening", "24,000 – 30,000", "Months 2–3"],
        ],
      },
      {
        type: "p",
        text: "Not everyone needs all of it. If the budget stretches to two things, make them window film and mats — comfort every day, and protection of the surface you will otherwise pay to restore.",
      },
    ],
    faqs: [
      {
        q: "Does a new car need paint correction before coating?",
        a: "Usually not. It needs decontamination — iron fallout removal and clay bar — because cars accumulate contamination in transit and storage. But polishing removes clear coat, and a new car has no defects worth spending clear coat on.",
      },
      {
        q: "How soon can I coat a brand new car?",
        a: "Most manufacturers suggest around 30 days. Factory paint is cured at the plant, but the conservative wait costs nothing.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ helpers */

export const articleBySlug = new Map(articles.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return articleBySlug.get(slug);
}

export const articleCategories: { id: Article["category"]; label: string; blurb: string }[] = [
  { id: "guides", label: "Guides", blurb: "Buying guides and how things actually work." },
  { id: "news", label: "News", blurb: "Announcements from the workshop." },
  { id: "trends", label: "Trends", blurb: "What Sri Lanka is fitting right now." },
  { id: "builds", label: "Builds", blurb: "Cars that came through the workshop." },
  { id: "care", label: "Care", blurb: "Keeping a good car looking good." },
];
