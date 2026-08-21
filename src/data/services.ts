import { applyServiceOverrides } from "./overrides";
import type { Service } from "./types";

/**
 * NEXMOD workshop services.
 *
 * PRICING IS PLACEHOLDER DATA — realistic mid-2026 Colombo market estimates.
 * Replace `fromPrice` on every service with the owner's real figures.
 * Service scope, process and technical detail reflect standard professional
 * practice for each discipline.
 */

const catalogue: Service[] = [
  {
    slug: "carbon-fibre-wrapping",
    name: "Carbon Fibre Wrapping",
    tagline: "8D gloss carbon, cut and heat-formed on your car.",
    category: "styling",
    fromPrice: 4500,
    priceNote: "From Rs. 4,500 for mirror caps. Full interior from Rs. 32,500. Quoted per panel.",
    duration: "45 minutes – 8 hours depending on coverage",
    icon: "carbon",
    featured: true,
    body: [
      "Carbon fibre wrapping is the highest-impact styling change you can make without touching paint. We work exclusively in 8D gloss carbon film — a genuine three-dimensional weave under a high-gloss lacquer layer, so it shifts and catches light the way dry carbon does rather than looking like a printed pattern.",
      "Coverage is entirely up to you. Mirror caps are a 45-minute walk-in. A front bumper accent set takes an afternoon. A full interior — console, dash, doors, pillars, vents — is a full day or two, with every removable panel taken off the car and wrapped off-vehicle so the edges are genuinely wrapped rather than cut.",
      "The difference between a wrap that lasts three years and one that lifts in three months is almost entirely in the edges. Film has memory: stretch it into a recess without post-heating and it will slowly try to return to flat, and it will win. Every edge we lay is post-heated to lock the film's memory in its new shape, then sealed.",
      "Everything is fully reversible. The paint underneath is protected from UV and stone chips while wrapped, and comes out unmarked when the film is removed with heat.",
    ],
    includes: [
      "Full surface decontamination and degrease before application",
      "Film cut oversize and formed on the vehicle for a true contour fit",
      "Removable panels taken off and wrapped off-car for wrapped edges",
      "Every edge post-heated to 90°C to lock film memory",
      "Edge sealing against water ingress and lifting",
      "Post-fit inspection and aftercare briefing",
    ],
    process: [
      {
        title: "Consultation and quote",
        detail:
          "Send photos on WhatsApp or bring the car in. We agree exactly which panels are in scope and show you the film sample in daylight — 8D carbon looks very different under workshop lights than it does in the sun.",
      },
      {
        title: "Preparation",
        detail:
          "Panels are washed, clay-barred where needed, and degreased with isopropyl alcohol. Any wax or sealant left on the surface will cause the film to lift, so this step is not rushed.",
      },
      {
        title: "Panel removal",
        detail:
          "Interior trim, mirror caps and any panel that unclips comes off the car. This is what allows a fully wrapped edge instead of a visible cut line. Trim clips are replaced with new ones on reassembly.",
      },
      {
        title: "Application and forming",
        detail:
          "Film is cut oversize, positioned, and heat-formed into every contour with a torch and squeegee. Air-release channels in the adhesive mean no trapped bubbles.",
      },
      {
        title: "Trimming and post-heat",
        detail:
          "Excess film is trimmed on the vehicle with a fresh blade against a knifeless tape line where possible. Every edge is then post-heated to 90°C, which permanently sets the film's shape memory.",
      },
      {
        title: "Inspection and handover",
        detail:
          "We walk the car with you in daylight, check every edge, and brief you on the 48-hour cure period and long-term care.",
      },
    ],
    specs: [
      { label: "Film type", value: "8D gloss carbon fibre vinyl, air-release adhesive" },
      { label: "Colours", value: "Black, silver, red-weave, blue-weave" },
      { label: "Exterior life", value: "3–5 years garaged, 2–3 years in constant sun" },
      { label: "Interior life", value: "5+ years (no UV exposure)" },
      { label: "Cure time", value: "48 hours before washing" },
      { label: "Reversibility", value: "Fully removable with heat, paint unmarked" },
    ],
    faqs: [
      {
        q: "Is it real carbon fibre?",
        a: "No. This is 8D carbon vinyl film, and any shop telling you otherwise at this price is not being straight with you. Real dry carbon parts cost 15–30 times more, and they replace the panel rather than covering it. 8D film gives you the visual depth of carbon at a fraction of the cost, with zero added weight, and it is removable.",
      },
      {
        q: "How long will it last in Sri Lankan sun?",
        a: "The lacquer layer carries UV inhibitors. Realistically: 3–5 years if the car is garaged overnight, 2–3 years if it lives outdoors in direct sun. Degradation shows first as a loss of gloss rather than a colour shift. Interior wraps last far longer because they see no UV at all.",
      },
      {
        q: "Will it damage my paint?",
        a: "No — the opposite. While the film is on, the paint underneath is shielded from UV, stone chips and light scratching. On removal with heat, the paint comes out unmarked. The one exception is a panel that has already been resprayed poorly; film can lift weak aftermarket paint. We will check and warn you before wrapping a resprayed panel.",
      },
      {
        q: "Can I wash it normally?",
        a: "After a 48-hour cure, yes. Hand wash is best. Pressure washing is fine at 30cm or more, but never aim the lance directly into an edge — that is the one thing that will lift a wrap.",
      },
      {
        q: "How much of the car should I wrap?",
        a: "Honestly, most people are happiest with accents rather than full coverage. Mirror caps, bumper trims and an interior console set give you most of the visual impact for a fraction of the cost of a full bonnet or full body wrap. Start there and add later.",
      },
    ],
    suitableFor: [
      "Front bumper accents, splitter lips and grille trim",
      "Full bonnet and roof",
      "Mirror caps and door handles",
      "Interior console, dash, door cards, pillars and vent surrounds",
      "B-pillar gloss black conversions",
    ],
    aftercare: [
      "Do not wash for the first 48 hours while the adhesive cures",
      "Hand wash where possible; pressure wash from 30cm and never into an edge",
      "Avoid automatic brush car washes entirely — brushes catch edges",
      "Use a pH-neutral shampoo; avoid solvent-based cleaners on film",
      "Park in shade or a garage where you can — UV is the main ageing factor",
      "Bring it back if you ever see an edge starting to lift; an early re-heat is a five-minute fix",
    ],
    warranty: "6 months on exterior panels, 12 months on interior, against lifting and delamination",
    relatedProducts: ["carbon-fibre-front-bumper-trim", "carbon-fibre-interior-console-set", "carbon-fibre-mirror-caps", "carbon-fibre-bonnet-wrap"],
    relatedServices: ["window-tinting", "spoiler-body-kit-fitting", "detailing-protection"],
    keywords: ["carbon fibre wrapping Sri Lanka", "car wrap Colombo", "8D carbon wrap price", "vinyl wrap Dehiwala", "carbon wrap service Sri Lanka"],
  },

  {
    slug: "ez-lip-installation",
    name: "EZ Lip Supply & Installation",
    tagline: "Official Sri Lanka agent for EZ Lip USA. Supplied and fitted here only.",
    category: "styling",
    fromPrice: 18500,
    priceNote: "Includes the genuine lip and professional installation. From Rs. 18,500.",
    duration: "75–90 minutes",
    icon: "lip",
    featured: true,
    body: [
      "Nexmod is the official Sri Lankan agent for EZ Lip USA. Every genuine EZ Lip and EZ Lip Pro on the island is supplied and installed here — there is no second authorised outlet in Sri Lanka.",
      "EZ Lip is a flexible universal front lip that bonds to the leading edge of your bumper. It drops the visual ride height by 20–40mm depending on the model you choose, and it sharpens the whole front end without cutting, drilling or replacing a single panel.",
      "The reason it works so well here specifically is survivability. A fibreglass or ABS lip is rigid — one badly judged speed bump on Galle Road, one steep hotel ramp, and it cracks or tears clean off. EZ Lip is a soft, high-memory polymer. It deflects, scrapes, and springs back.",
      "Counterfeits exist and they are easy to spot after a few months: a harder compound that goes chalky under UV and cracks at the first real impact. Buying genuine costs a little more once, rather than a little less twice.",
    ],
    includes: [
      "Genuine EZ Lip or EZ Lip Pro unit in factory packaging",
      "Bumper edge degrease and adhesion preparation",
      "Dry-fit, marking and trim to your bumper profile",
      "Heat-activated factory adhesive application",
      "Clamped cure while you wait",
      "12-month warranty on product and fitting",
    ],
    process: [
      {
        title: "Choose your profile",
        detail:
          "EZ Lip Original drops 20–25mm and is the daily-driver choice. EZ Lip Pro drops 30–40mm for a more aggressive stance. We will look at your bumper and your usual parking situation and tell you honestly which suits.",
      },
      {
        title: "Preparation",
        detail:
          "The bumper leading edge is washed, degreased with isopropyl alcohol and dried. Any wax on that edge will compromise the bond, so this step matters more than it looks.",
      },
      {
        title: "Dry fit and mark",
        detail:
          "The lip is offered up, the run is marked, and the ends are trimmed to your specific bumper profile. We check the fitted depth against your ramp clearance before anything is bonded.",
      },
      {
        title: "Bond and clamp",
        detail:
          "Factory heat-activated adhesive is applied, the lip is positioned and pressed home, then clamped along its length while the bond develops.",
      },
      {
        title: "Cure and handover",
        detail:
          "Clamps stay on for the cure period, then we walk the car with you. It is road-ready when you leave — no waiting days before driving.",
      },
    ],
    specs: [
      { label: "Material", value: "High-memory flexible polymer, made in the USA" },
      { label: "Available lengths", value: "2.4 m standard, 3.0 m XL" },
      { label: "Drop", value: "20–25mm (Original) or 30–40mm (Pro)" },
      { label: "Finish", value: "Gloss black or carbon-look" },
      { label: "Fitment", value: "Universal — bonds to virtually any bumper profile" },
      { label: "Fitting time", value: "75–90 minutes, wait-in" },
    ],
    faqs: [
      {
        q: "How do I know it is a genuine EZ Lip?",
        a: "Genuine EZ Lip is sold in Sri Lanka through Nexmod only. Every unit arrives in branded EZ Lip USA packaging with the factory heat-activated adhesive. If you are offered an EZ Lip anywhere else on the island, it is not genuine — and the difference shows within a season as the copy compound goes chalky and cracks.",
      },
      {
        q: "Will it fit my car?",
        a: "Almost certainly. It is a universal-fit product that bonds to the bumper leading edge — hatchbacks, sedans, SUVs and vans. We have fitted it to Vitz, Aqua, Vezel, Swift, Lancer, Axio, Premio, Prado and plenty more. Send a straight-on photo of your front bumper on WhatsApp and we will confirm before you commit.",
      },
      {
        q: "Will it scrape on speed bumps and ramps?",
        a: "It may touch — that is inherent to any lip. The difference is that EZ Lip flexes and recovers where a rigid lip cracks. Approach bumps slowly and at an angle, as you would with any lowered car. If you use very steep ramps daily, take the Original rather than the Pro.",
      },
      {
        q: "Can it be removed later?",
        a: "Yes. Heat softens the adhesive, the lip peels away, and residue comes off with an automotive adhesive remover leaving the paint intact. We will do it for you at the workshop for a small fee.",
      },
      {
        q: "Does it need painting?",
        a: "No. It comes finished in gloss black or carbon-look and is designed to read as a contrast lip. We can colour-match it if you specifically want it body-coloured, but the black contrast is what most people are after.",
      },
    ],
    suitableFor: [
      "Any car where you want a lower, sharper front end without a body kit",
      "Daily drivers that cannot risk a rigid fibreglass lip",
      "Cars on steep ramps or rough roads",
      "Pairing with side skirts and a rear diffuser for a full three-piece lip kit",
    ],
    aftercare: [
      "Avoid pressure-washing directly into the bond line",
      "Approach speed bumps slowly and at a slight angle",
      "Clean with normal car shampoo — no solvents on the polymer",
      "If an end ever lifts after a hard strike, bring it in; re-bonding is quick",
    ],
    warranty: "12 months on the lip against manufacturing defect, and on our bond",
    relatedProducts: ["ez-lip-pro-universal-front-lip", "ez-lip-original-front-lip", "side-skirt-extension-pair", "rear-diffuser-quad-fin"],
    relatedServices: ["spoiler-body-kit-fitting", "carbon-fibre-wrapping"],
    keywords: ["EZ Lip Sri Lanka", "ez lip installation Colombo", "official ez lip agent Sri Lanka", "front lip fitting Dehiwala", "ez lip pro price"],
  },

  {
    slug: "spoiler-body-kit-fitting",
    name: "Spoiler & Body Kit Fitting",
    tagline: "Bonded, sealed and aligned. No boot leaks, no rust, no rattles.",
    category: "styling",
    fromPrice: 14500,
    priceNote: "Part plus fitting. Ducktail from Rs. 16,500. Painting to colour code from Rs. 8,000 extra.",
    duration: "2–3 hours (plus 2–3 days if painting)",
    icon: "spoiler",
    featured: true,
    body: [
      "We supply and fit ducktail spoilers, roof wings, rear diffusers, side skirts, canards and front lips — in ABS, flexible PU and carbon-look finishes, painted to your exact factory colour code if you want it invisible-looking rather than aftermarket.",
      "The part is the easy bit. Every spoiler failure we are asked to fix comes from one of three things: a bond laid on an unprepared surface, a drilled hole left unsealed, or a part fitted without checking the wiper sweep or boot seal.",
      "So the process here is deliberate. Surfaces are degreased and primed for adhesion. Bonded fits use 3M automotive VHB, which is what the manufacturers use for factory mouldings. Where a design genuinely requires bolts, every hole is deburred, primed, and sealed with butyl before a stainless fixing goes in — because a bare drilled hole in a boot lid is a rust site and a water path straight into your spare wheel well.",
      "If you are painting, allow two to three working days. We spray to your door-jamb colour code, or blend-match on older cars where the factory code no longer matches the faded reality of the panel.",
    ],
    includes: [
      "Dry fit and alignment check before any permanent bonding",
      "Surface degrease and adhesion primer",
      "3M automotive VHB bonding, or sealed stainless fixings where required",
      "Every drilled hole deburred, primed and butyl-sealed",
      "Boot seal and wiper sweep clearance verified",
      "Optional spray to factory colour code or 8D carbon wrap",
    ],
    process: [
      {
        title: "Part selection and fitment check",
        detail:
          "We confirm the part suits your model and your intent. A roof wing suits a hatchback; a ducktail suits a sedan boot line. Fitting the wrong style well still looks wrong.",
      },
      {
        title: "Paint or wrap (optional)",
        detail:
          "Sprayed to your door-jamb colour code, blend-matched on faded paint, or wrapped in 8D carbon. Allow 2–3 working days for paint to cure properly before fitting.",
      },
      {
        title: "Dry fit and marking",
        detail:
          "The part is offered up, aligned by eye and by measurement from fixed reference points, and marked. On hatchbacks we cycle the rear wiper to confirm clearance before anything is permanent.",
      },
      {
        title: "Surface preparation",
        detail:
          "The contact area is degreased with isopropyl alcohol and treated with adhesion promoter. Bonding to a waxed or dirty surface is why cheap fittings peel.",
      },
      {
        title: "Bond or bolt",
        detail:
          "3M VHB tape for bonded fits, clamped while it develops strength. For bolted designs: pilot-drill, deburr, prime the bare metal, butyl-seal, then fit stainless fixings with sealing washers.",
      },
      {
        title: "Seal check and handover",
        detail:
          "We water-test bolted fits before you leave. Boot seals get checked. Then we brief you on the 24-hour cure before washing.",
      },
    ],
    faqs: [
      {
        q: "Will drilling my boot lid cause rust?",
        a: "Not the way we do it. Every hole is deburred, the bare metal is primed, and butyl sealant goes in before a stainless fixing with a sealing washer. Rust comes from bare drilled steel left open to moisture — which is exactly what a rushed install leaves behind. We water-test before handover.",
      },
      {
        q: "Bonded or bolted — which is better?",
        a: "Bonded, whenever the design allows it. 3M automotive VHB is genuinely strong — it is what holds factory body mouldings and badges on — and it puts no holes in your car. We only bolt where the part's size or leverage demands it.",
      },
      {
        q: "Can you match my paint exactly?",
        a: "We spray to the colour code from your door jamb plate, which is exact against factory-fresh paint. On an older car whose paint has faded, an exact code match can actually look wrong — so we offer blend-matching to the current panel colour instead. We will show you both and let you choose.",
      },
      {
        q: "Will a spoiler affect my fuel economy or handling?",
        a: "At Sri Lankan road speeds, honestly no — not measurably. These are styling parts. Anyone claiming meaningful downforce from a bolt-on ducktail at 60km/h is selling you something. We fit them because they look right.",
      },
      {
        q: "Can it be removed if I sell the car?",
        a: "Bonded parts come off with heat and adhesive remover, leaving paint intact. Bolted parts leave holes that need filling and respraying — which is another argument for bonded wherever possible.",
      },
    ],
    suitableFor: [
      "Ducktail and lip spoilers on sedans",
      "Roof wings on hatchbacks",
      "Rear diffusers and canards",
      "Side skirt extensions",
      "Full three-piece lip kits",
    ],
    aftercare: [
      "Do not wash for 24 hours after a bonded fit",
      "Avoid pressure-washing directly at the bond line",
      "On hatchbacks, check rear wiper clearance stays true after any hard knock",
      "Bring it in if you ever hear a rattle — usually a 10-minute re-bond",
    ],
    warranty: "12 months on fitting, bond integrity and seal",
    relatedProducts: ["ducktail-spoiler-abs", "roof-wing-spoiler", "rear-diffuser-quad-fin", "side-skirt-extension-pair"],
    relatedServices: ["ez-lip-installation", "carbon-fibre-wrapping"],
    keywords: ["spoiler fitting Sri Lanka", "body kit installation Colombo", "spoiler painting Sri Lanka", "ducktail fitting Dehiwala"],
  },

  {
    slug: "body-kit-fitting",
    name: "Body Kit Fitting",
    tagline: "Dry-fitted complete, gapped, then painted as a set.",
    category: "styling",
    fromPrice: 68500,
    priceNote: "Three-piece lip kit from Rs. 68,500. Full aero kit from Rs. 185,000. Quoted per vehicle.",
    duration: "1 day to 1 week depending on kit",
    icon: "bodykit",
    featured: true,
    body: [
      "We supply and fit three-piece lip kits, full aero kits, wide-body arch sets and OEM-plus conversions. A body kit is the biggest visual change you can make to a car, and it is also the job where fitting quality is most visible for the rest of the car's life.",
      "The single thing that separates a good kit fit from a bad one is that everything is dry-fitted complete before anything is permanent. A kit is not four parts in a box — it is four parts that have to agree with each other and with panels that were never designed to accept them. Gaps get set while they can still be set.",
      "Then it is painted as a set, in one booth session, off the car. Painting parts individually as they arrive is how you end up with a front bumper that is very slightly a different colour from the skirts in daylight — and once you have seen it, you cannot stop seeing it.",
      "On most cars some flange trimming is needed. That is normal for any aftermarket kit, and doing it carefully rather than forcing the part is most of what you are paying for.",
      "Your original bumpers come back to you boxed and labelled. A body kit narrows your buyer pool when you sell, and being able to return the car to standard resolves most of that.",
    ],
    includes: [
      "Complete dry fit before any bonding, drilling or paint",
      "Panel gaps set against wings, bonnet and boot",
      "Flange trimming where the kit requires it",
      "Painted as a complete set in one booth session",
      "New clips and fixings throughout on refit",
      "Every drilled hole deburred, primed and butyl-sealed",
      "Original parts boxed, labelled and returned",
    ],
    process: [
      {
        title: "Fitment check and honest quote",
        detail:
          "We confirm the kit actually suits your shell and tell you what adaptation it will need. If a kit is known to fit badly on your model, we will say so rather than take the booking and discover it with your car in pieces.",
      },
      {
        title: "Strip and dry fit",
        detail:
          "Original bumpers and trim come off. The complete kit is offered up and held in position so every gap can be assessed together rather than one part at a time.",
      },
      {
        title: "Gapping and trimming",
        detail:
          "Flanges are trimmed and mounting points adjusted until gaps are even against the wings, bonnet and boot. This is the slow part and the part that decides how the car looks forever.",
      },
      {
        title: "Paint as a set",
        detail:
          "Parts go to the booth together and are sprayed in one session to your colour code, then cured properly. Painting as a set is the only reliable way to get colour match across every piece.",
      },
      {
        title: "Refit and seal",
        detail:
          "Bonded with 3M automotive VHB where the design allows. Where fixings are required, every hole is deburred, primed and butyl-sealed before a stainless fixing goes in. New clips throughout.",
      },
      {
        title: "Inspection and handover",
        detail:
          "We walk the car with you in daylight, check every gap and edge, hand over your original parts boxed, and go through the aftercare.",
      },
    ],
    specs: [
      { label: "Kit types", value: "Three-piece lip, full aero, wide-body arch, OEM-plus" },
      { label: "Materials", value: "Flexible PU, ABS, fibre-reinforced polymer" },
      { label: "Mounting", value: "3M VHB bonded; sealed stainless fixings where required" },
      { label: "Paint", value: "Colour code or blend-matched, sprayed as a set" },
      { label: "Timeline", value: "Lip kit 1 day; full aero approx. 1 week" },
      { label: "Original parts", value: "Boxed, labelled and returned to you" },
    ],
    faqs: [
      {
        q: "Will a body kit hurt my resale value?",
        a: "A full aftermarket kit narrows your buyer pool — that is simply true, and anyone who tells you otherwise is selling. It matters less than people fear if the work is reversible and the original parts exist, which is why we box and label them. An OEM-plus conversion is the exception: it generally helps, because the car reads as a higher factory grade.",
      },
      {
        q: "Do I need to tell my insurer?",
        a: "Yes, and this is not optional. A body kit is a material modification. Most Sri Lankan insurers accept it with an adjusted premium; not declaring it can void a claim entirely. Do this before you book, not after.",
      },
      {
        q: "Why does trimming take so long?",
        a: "Because aftermarket kits are moulded to a tolerance and factory panels vary between cars. Achieving even gaps means removing material a little at a time and re-offering the part repeatedly. Forcing a part into place instead is faster, and you can see the result from across a car park.",
      },
      {
        q: "Can you fit a kit I bought myself?",
        a: "Usually yes, and we will quote fitting only. We will inspect it first and tell you honestly if the moulding quality means it will never gap well — better you hear that before we start than after.",
      },
      {
        q: "What about ground clearance?",
        a: "A lip kit drops the front around 40mm. That is manageable with care on Colombo ramps because we use flexible PU on the contact runs. If you use very steep basement ramps daily, tell us and we will steer you to a shallower profile.",
      },
    ],
    suitableFor: [
      "Cars where you want a complete visual change, not an accent",
      "Three-piece lip kits as a first, reversible step",
      "OEM-plus conversions where resale matters",
      "Wide-body builds with a matched wheel package",
      "Correcting a previously badly fitted kit",
    ],
    aftercare: [
      "Do not wash for 24 hours after a bonded fit, or 7 days after fresh paint",
      "Avoid pressure-washing directly into a bond line or panel gap",
      "Approach ramps slowly and at an angle",
      "Wax fresh paint only after 30 days, once it has fully cured",
      "Bring it in if a gap opens or an edge lifts — early re-bonding is quick",
    ],
    warranty: "12 months on fitting, bond integrity, sealing and paint adhesion",
    relatedProducts: ["three-piece-lip-kit", "full-aero-body-kit", "wide-body-arch-kit", "oem-plus-conversion"],
    relatedServices: ["spoiler-body-kit-fitting", "carbon-fibre-wrapping", "detailing-protection"],
    keywords: ["body kit fitting Sri Lanka", "body kit installation Colombo", "wide body Sri Lanka", "aero kit fitting Dehiwala", "bumper conversion Sri Lanka"],
  },

  {
    slug: "tyre-lettering",
    name: "Tyre Lettering & Sidewall Graphics",
    tagline: "TyreDeckz rubber lettering — flexes with the tyre instead of cracking off it.",
    category: "styling",
    fromPrice: 7500,
    priceNote: "From Rs. 7,500 for two tyres. Full set of four from Rs. 13,500.",
    duration: "2–3 hours including cure",
    icon: "tyre",
    featured: true,
    body: [
      "Tyre lettering is the detail that makes a wheel setup look finished. Crisp white lettering on the sidewall reads as deliberate in a way that a bare tyre never does, and it photographs exceptionally well.",
      "We fit TyreDeckz — a rubber-based lettering system. The letters are moulded rubber bonded chemically into the sidewall, not vinyl stickers laid on top of it.",
      "That distinction is the entire product. Vinyl tyre stickers fail here, reliably. A sidewall flexes on every single rotation, and vinyl does not; within weeks the lettering cracks at the shoulder, and monsoon standing water gets under the edges and lifts them. Rubber lettering flexes with the tyre because it is made of the same thing the tyre is.",
      "Text is entirely yours — a brand name, a model designation, or your own wording. We apply on degreased sidewalls and cure before you drive away.",
    ],
    includes: [
      "Sidewall clean, degrease and surface preparation",
      "Custom text set-out and alignment across all tyres",
      "TyreDeckz rubber lettering application",
      "Full cure before handover",
      "Aftercare briefing on dressings to avoid",
    ],
    process: [
      {
        title: "Choose text and colour",
        detail:
          "Any wording you like, in white or a custom colour. We will show you the letter height against your tyre size — lettering that is too large for a low-profile sidewall looks cramped, and we would rather tell you that first.",
      },
      {
        title: "Sidewall preparation",
        detail:
          "Tyres are washed and then degreased hard. Tyre dressing residue is the number one cause of lettering failure, and most tyres arriving here have some on them.",
      },
      {
        title: "Set-out and alignment",
        detail:
          "Lettering is positioned consistently relative to the valve stem across all four tyres, so the text sits in the same place on every wheel rather than drifting.",
      },
      {
        title: "Application",
        detail:
          "Letters are applied and bonded into the sidewall with the chemical bonding agent, then pressed home and checked for full edge contact.",
      },
      {
        title: "Cure and handover",
        detail:
          "The bond cures before you leave. We brief you on which tyre dressings to avoid — solvent-heavy ones will attack the bond over time.",
      },
    ],
    faqs: [
      {
        q: "How is this different from tyre sticker vinyl?",
        a: "Vinyl sits on the surface of the rubber and cracks as the sidewall flexes — usually within a few weeks in Sri Lankan conditions, and faster in monsoon season. TyreDeckz lettering is rubber, chemically bonded, and flexes with the tyre. It is designed to last the life of the tyre.",
      },
      {
        q: "Can I still pressure-wash and use tyre shine?",
        a: "Pressure wash at a sensible distance, yes. For dressing, use a water-based product and wipe the lettering clean afterwards. Avoid solvent-heavy shine products directly on the letters — over time they soften the bond.",
      },
      {
        q: "What happens when I replace my tyres?",
        a: "The lettering stays with the old tyre. New tyres need a new set, and we offer returning customers a discount on re-lettering.",
      },
      {
        q: "Does it affect tyre balance?",
        a: "No. The material is negligible in weight and applied symmetrically around the sidewall. We have never had to rebalance a wheel after lettering.",
      },
      {
        q: "Can I have a custom logo, not just text?",
        a: "Text and standard character sets, yes. Complex logos are limited by the moulded letter format — bring us what you have in mind and we will tell you honestly whether it will work.",
      },
    ],
    suitableFor: [
      "Any tyre with a sidewall deep enough for the letter height",
      "Show cars and photo builds",
      "Matching a wheel-and-tyre package",
      "Paired with side decals for a coordinated look",
    ],
    aftercare: [
      "Use water-based tyre dressings only — avoid solvent-heavy shine products on the letters",
      "Wipe lettering clean after dressing the rest of the sidewall",
      "Pressure wash from a sensible distance",
      "Bring it in if a letter edge ever lifts — a quick re-bond fixes it",
    ],
    warranty: "6 months against lifting and cracking",
    relatedProducts: ["tyredeckz-tyre-stickers-set", "side-decal-stickers-custom", "window-decal-custom"],
    relatedServices: ["decals-graphics", "detailing-protection"],
    keywords: ["tyre lettering Sri Lanka", "tyre stickers Colombo", "TyreDeckz Sri Lanka", "white letter tyres Sri Lanka", "tire lettering price"],
  },

  {
    slug: "decals-graphics",
    name: "Custom Decals & Vehicle Graphics",
    tagline: "Designed, mocked up on your actual car, then plot-cut and applied.",
    category: "styling",
    fromPrice: 4500,
    priceNote: "Window decals from Rs. 4,500. Side graphics from Rs. 8,500. Design mock-up included.",
    duration: "45 minutes – 4 hours",
    icon: "decal",
    body: [
      "Racing stripes, side flashes, sponsor-style layouts, club decals, sun strips, rear glass lettering and full custom artwork — designed, cut and applied in-house.",
      "Design is included in the price and it happens before anything is cut. Send us a reference or describe what you have in mind, and we will mock it up on a photograph of your actual car in your actual colour. Seeing it on your car rather than on a generic silhouette prevents most of the regret in this category.",
      "We cut from cast vinyl rather than calendered. Cast film is thinner, conforms to compound curves without lifting, and carries a five-to-seven year outdoor rating. Calendered film is cheaper and shrinks back from its edges within a year — which is why old stripes on other people's cars have those thin outlines of clean paint around them.",
      "On windscreen work we keep everything within the legal visibility band. A banner that intrudes into the swept area is an inspection failure and a real safety problem, and we will tell you where that line is rather than take the job and let you find out.",
    ],
    includes: [
      "Design consultation and digital mock-up on a photo of your car",
      "Plot-cut premium cast vinyl",
      "Surface decontamination and degrease",
      "Wet-mount application, bubble-free",
      "Legal compliance check on all glass work",
    ],
    process: [
      {
        title: "Brief and mock-up",
        detail:
          "Tell us the idea or send a reference. We mock it up on a photo of your car in your colour, and iterate until you are happy. Nothing is cut until you sign off.",
      },
      {
        title: "Material selection",
        detail:
          "Gloss, matte, satin, metallic or chrome cast vinyl. We will steer you on which finish survives best — matte films show wash marks more than gloss, which is worth knowing before you choose.",
      },
      {
        title: "Plot cutting and weeding",
        detail:
          "Artwork is plot-cut and weeded, then transfer tape is applied so multi-piece designs stay in register during application.",
      },
      {
        title: "Surface preparation",
        detail:
          "Panels are washed, clay-barred if contaminated, and degreased. Vinyl bonds to whatever is on the paint, so anything left behind becomes a lift point later.",
      },
      {
        title: "Wet-mount application",
        detail:
          "Applied with a slip solution so the graphic can be positioned precisely, then squeegeed out from the centre. Edges are post-heated on curved sections.",
      },
      {
        title: "Cure and handover",
        detail:
          "24 hours before washing. We photograph the finished car for you — these jobs photograph well and most customers want the shots.",
      },
    ],
    faqs: [
      {
        q: "Will decals damage my paint when removed?",
        a: "Cast vinyl removes cleanly with heat, leaving paint intact. The one real risk is on a car where a graphic has been on for many years — the covered paint will have faded less than the exposed paint around it, so removal can reveal a visible outline. That is UV on the surrounding paint, not damage from the vinyl.",
      },
      {
        q: "Can I have a windscreen banner?",
        a: "Yes, within the legal visibility band at the top of the screen. We will not fit anything that intrudes into the wiper-swept area — it is an inspection failure and it genuinely compromises your view in rain.",
      },
      {
        q: "How long do graphics last?",
        a: "Cast vinyl carries a 5–7 year outdoor rating. In constant Sri Lankan sun, expect closer to 4–5 years before gloss loss becomes noticeable. Garaged cars comfortably exceed this.",
      },
      {
        q: "Do you do full colour-change wraps?",
        a: "We focus on graphics, accents and carbon work rather than full colour-change wraps. If you need a full respray-in-vinyl, tell us and we will point you to someone who does them properly rather than take on a job outside our lane.",
      },
    ],
    suitableFor: [
      "Racing stripes and side flashes",
      "Sponsor and club decal layouts",
      "Sun strips and rear glass lettering",
      "Model badging and custom text",
      "Business vehicle branding",
    ],
    aftercare: [
      "Do not wash for 24 hours after application",
      "Hand wash where possible; never take matte films through a brush wash",
      "Avoid pressure-washing directly at a decal edge",
      "Wax and sealant are safe on gloss vinyl; avoid wax on matte films",
    ],
    warranty: "6 months against lifting",
    relatedProducts: ["side-decal-stickers-custom", "window-decal-custom", "tyredeckz-tyre-stickers-set"],
    relatedServices: ["tyre-lettering", "carbon-fibre-wrapping", "window-tinting"],
    keywords: ["car decals Sri Lanka", "vehicle graphics Colombo", "custom stickers Sri Lanka", "racing stripes Sri Lanka", "car branding Dehiwala"],
  },

  {
    slug: "window-tinting",
    name: "Window Tinting & Heat Rejection Film",
    tagline: "Ceramic film that actually blocks heat, applied within the legal band.",
    category: "protection",
    fromPrice: 18500,
    priceNote: "Full car from Rs. 18,500 (carbon) or Rs. 32,500 (ceramic). Windscreen extra.",
    duration: "3–5 hours",
    icon: "tint",
    body: [
      "Most window film sold on price is dyed film. It goes dark, it looks fine for a year, and it blocks almost no heat — because darkness and heat rejection are not the same property. Then it turns purple and bubbles, because the dye breaks down under UV.",
      "Ceramic film is a different technology. Non-metallic ceramic particles reject infrared — the actual heat-carrying part of sunlight — while staying optically clear and not interfering with GPS, mobile signal or your keyless entry the way old metallic films did.",
      "The practical result in Colombo is a cabin that is genuinely several degrees cooler after the car has sat in sun, an air conditioner that reaches temperature faster, and a dashboard and seats that stop cooking. It is a comfort upgrade first and a styling one second.",
      "We apply within Sri Lankan legal visible-light-transmission limits. We will tell you what those are, and we will not fit anything below them — a tint that gets you stopped is not a bargain.",
    ],
    includes: [
      "Glass decontamination, clay and full degrease",
      "Computer-cut film patterns for your exact model",
      "Heat-shrink forming on curved rear glass",
      "Wet-mount application, edge-to-edge with no light gaps",
      "Legal VLT compliance check",
      "Defroster line integrity preserved on rear glass",
    ],
    process: [
      {
        title: "Film selection",
        detail:
          "We show you carbon and ceramic samples against a heat lamp so you can feel the difference rather than take our word for it. Then we pick a VLT that is legal and suits how you use the car.",
      },
      {
        title: "Glass preparation",
        detail:
          "Every window is washed, clay-barred and degreased inside and out. Contamination trapped under film shows as a permanent speck, and it is the most common defect in cheap tint jobs.",
      },
      {
        title: "Pattern cutting",
        detail:
          "Film is computer-cut to your model's exact glass shapes rather than hand-trimmed on the glass. That means no blade ever touches your rear defroster lines.",
      },
      {
        title: "Heat forming",
        detail:
          "Rear glass is compound-curved, so film must be heat-shrunk to shape on the outside of the glass before it can be applied inside. This is the step that separates a professional job from a fingernail-creased one.",
      },
      {
        title: "Application",
        detail:
          "Wet-mounted and squeegeed out, working the slip solution fully to the edges. Door glass is dropped slightly to get film fully into the top channel.",
      },
      {
        title: "Cure and handover",
        detail:
          "Do not roll windows down for 3–5 days while the adhesive cures. Slight haze or small water pockets during the first week are normal and clear as the moisture evaporates.",
      },
    ],
    specs: [
      { label: "Film types", value: "Carbon and multi-layer nano-ceramic" },
      { label: "Heat rejection", value: "Up to 60% total solar energy rejected (ceramic)" },
      { label: "UV rejection", value: "99% UVA/UVB, both film types" },
      { label: "Signal interference", value: "None — non-metallic construction" },
      { label: "Warranty", value: "5 years against bubbling, peeling and colour change (ceramic)" },
      { label: "Cure time", value: "3–5 days before operating windows" },
    ],
    faqs: [
      {
        q: "What tint level is legal in Sri Lanka?",
        a: "Sri Lankan regulations set minimum visible light transmission levels, and enforcement does happen. We fit within the legal band and will tell you exactly what that means for your car before we start. If you want something darker than the law allows, we are not the shop for it.",
      },
      {
        q: "Is ceramic film worth more than double the price of carbon?",
        a: "If your car sits outdoors in Colombo sun, genuinely yes — the heat rejection difference is something you feel every time you get in. If the car is garaged and mostly used at night, carbon film is perfectly sensible and we will say so.",
      },
      {
        q: "Will it affect my GPS, mobile signal or keyless entry?",
        a: "No. Both our carbon and ceramic films are non-metallic. Older metallised films did interfere with signals — that is a real problem, but not with these.",
      },
      {
        q: "Why can I see haze and small bubbles after fitting?",
        a: "That is residual slip solution, and it is completely normal for the first week. It evaporates through the film. What is not normal is bubbling that appears months later — that is adhesive failure, and it is what the warranty covers.",
      },
      {
        q: "Can you tint the windscreen?",
        a: "We can fit a clear or very light ceramic film to the windscreen, which rejects a large amount of heat without reducing visibility. A dark windscreen tint is neither legal nor safe.",
      },
    ],
    suitableFor: [
      "Cars parked outdoors in direct sun",
      "Protecting dashboard, seats and trim from UV degradation",
      "Reducing air conditioning load and fuel use",
      "Privacy for rear passengers",
    ],
    aftercare: [
      "Do not operate windows for 3–5 days after fitting",
      "Slight haze in the first week is normal — do not try to squeeze it out",
      "Clean the inside with an ammonia-free glass cleaner and a microfibre towel",
      "Never use a bladed scraper on tinted glass",
    ],
    warranty: "5 years on ceramic film, 2 years on carbon, against bubbling, peeling and discolouration",
    relatedProducts: ["hydrophobic-glass-coating", "ceramic-spray-sealant"],
    relatedServices: ["detailing-protection", "carbon-fibre-wrapping"],
    keywords: ["window tinting Sri Lanka", "ceramic tint Colombo", "car tint price Sri Lanka", "heat rejection film Sri Lanka", "legal tint Sri Lanka"],
  },

  {
    slug: "lighting-installation",
    name: "Lighting Installation & Upgrades",
    tagline: "Fused, relayed and heat-shrunk. Not spliced into the nearest live wire.",
    category: "electronics",
    fromPrice: 8500,
    priceNote: "Sequential indicators from Rs. 8,500. DRL strips from Rs. 15,500. Bi-LED retrofit from Rs. 42,500.",
    duration: "1 hour – full day",
    icon: "light",
    featured: true,
    body: [
      "Sequential DRL strips, bi-LED projector retrofits, sequential indicators, selective-yellow fog lamps, reverse light LEDs and RGB interior ambient kits — supplied and installed.",
      "Automotive lighting is where cheap installation does real damage, and it is worth being blunt about why. Modern cars monitor their lighting circuits. Splice a load into the wrong place and you get bulb-out warnings, hyperflash, or a blown body control module output — and a BCM is not a cheap part.",
      "So every install here runs off a properly identified switched feed, through a relay where current demands it, with an inline fuse sized to the load, and every joint soldered and heat-shrunk rather than scotch-locked. Looms are routed through existing grommets, clear of exhaust heat and away from anything that moves.",
      "On beam-pattern work we go further than most. Dropping an LED bulb into a halogen reflector does not give you more usable light — it gives you glare and a smeared pattern, because the LED chip sits in the wrong focal position for that reflector. If you want a real improvement at night, the answer is a bi-LED projector retrofit, and we will explain why rather than sell you a bulb that makes things worse.",
    ],
    includes: [
      "Circuit identification and correct switched-feed selection",
      "Relay and inline fuse sized to the load",
      "Soldered and heat-shrunk joints — no scotch-locks",
      "Loom routing through existing grommets, clear of heat and movement",
      "Load correction where needed to prevent bulb-out faults and hyperflash",
      "Beam aiming on a wall board for all headlight work",
    ],
    process: [
      {
        title: "Assessment",
        detail:
          "We look at what you want, what your car's electrical architecture allows, and what is legal. Some cars make certain installs straightforward; others need a CANbus decoder. We tell you which before quoting.",
      },
      {
        title: "Circuit design",
        detail:
          "We identify a correct switched feed, size the fuse to the actual load, and decide whether a relay is needed. This is the part that separates a two-year install from a two-month one.",
      },
      {
        title: "Fitting",
        detail:
          "Strips, projectors or modules are fitted. For headlight retrofits, housings are oven-baked to soften the original butyl, split, fitted, and resealed with fresh butyl — with the factory breather vents kept clear so condensation cannot form.",
      },
      {
        title: "Wiring",
        detail:
          "Every joint soldered and heat-shrunk. Loom run through existing grommets, secured with proper P-clips, routed away from the exhaust and from any steering or suspension movement.",
      },
      {
        title: "Load correction and testing",
        detail:
          "Where the car monitors bulb current, load resistors or a CANbus decoder are fitted so you get no dash warnings and no hyperflash. Then every function is tested, including with the engine running.",
      },
      {
        title: "Beam aiming and handover",
        detail:
          "All headlight work is aimed on a marked wall board at the correct distance. An unaimed projector retrofit dazzles oncoming traffic no matter how good the optic is.",
      },
    ],
    faqs: [
      {
        q: "Why not just fit LED bulbs in my existing headlights?",
        a: "Because a reflector housing is designed around the exact position and shape of a halogen filament. An LED chip is a different shape in a different place, so the reflector cannot focus it — you get glare and a worse beam pattern, and you dazzle oncoming drivers while seeing less yourself. A bi-LED projector is designed for an LED source. It costs more and it is the only version of this that actually works.",
      },
      {
        q: "Is coloured lighting legal?",
        a: "Forward-facing white and rear-facing red are standard. Coloured forward-facing lights while driving are not legal. Our RGB DRL option auto-reverts to white above walking pace for exactly this reason. Interior ambient lighting is unrestricted.",
      },
      {
        q: "Will resealing my headlights cause condensation?",
        a: "Not if it is done properly. We remove all original butyl, clean the channel, lay fresh butyl and clamp while it cools — and critically, we keep the factory breather vents clear. Blocked breathers are the actual cause of most post-retrofit condensation, not the reseal itself.",
      },
      {
        q: "Will any of this drain my battery?",
        a: "No. Everything runs off ignition-switched feeds, so it is dead when the car is off. Ambient lighting and DRLs together draw well under 50W.",
      },
      {
        q: "Can you fix a bad install someone else did?",
        a: "Often, yes, and we see a fair amount of it. Bring it in — we will trace the circuit, replace scotch-locks with soldered joints, add the fuse that should have been there, and reroute anything sitting against the exhaust.",
      },
    ],
    suitableFor: [
      "Sequential DRL strips and flowing indicators",
      "Bi-LED and bi-xenon projector retrofits",
      "Selective-yellow fog lamp upgrades",
      "Interior RGB ambient lighting",
      "Reverse and numberplate LED conversions",
      "Repairing poor previous installations",
    ],
    aftercare: [
      "Report any flicker immediately — it usually means a connection, and it is easier to fix early",
      "Do not pressure-wash directly into headlight seams after a retrofit",
      "If a dash warning appears after fitting, bring it back; it means load correction needs adjusting",
    ],
    warranty: "12 months on parts, and on our wiring for as long as you own the car",
    relatedProducts: ["sequential-drl-strip", "bi-led-projector-conversion", "ambient-lighting-kit", "led-fog-lamp-upgrade", "sequential-indicator-module"],
    relatedServices: ["car-audio-installation", "camera-safety-installation"],
    keywords: ["DRL installation Sri Lanka", "LED headlight upgrade Colombo", "bi LED retrofit Sri Lanka", "ambient lighting installation", "car lighting Dehiwala"],
  },

  {
    slug: "car-audio-installation",
    name: "Car Audio Systems & Installation",
    tagline: "Head units, component stages, amps and subs — tuned, not just fitted.",
    category: "audio",
    fromPrice: 28500,
    priceNote: "Head unit fitted from Rs. 36,500. Component front stage from Rs. 28,500. Full builds quoted.",
    duration: "3 hours – 2 days",
    icon: "audio",
    featured: true,
    body: [
      "We build audio systems that fit the car, the music and the budget — from a clean head-unit-and-speaker refresh through to a fully damped, amplified and DSP-tuned install.",
      "The honest starting point for almost every Sri Lankan car is not a speaker. It is the door. A car door is a steel box with a large hole in it; your speaker fires into that box, the outer skin resonates out of phase with the cone, and your midbass cancels itself out before it ever reaches you. Fit a great speaker into an untreated door and you have an expensive speaker that still sounds thin.",
      "So we will usually recommend sound deadening before we recommend spending more on drivers. It is less profitable advice and it is the right advice — a mid-range component set in a properly damped door comfortably beats an expensive set in a resonating one.",
      "Installation quality is the other half. Model-specific fascia kits and plug-and-play CANbus harnesses mean we never cut the factory loom, so steering controls, factory cameras and warning chimes all keep working, and the whole install is reversible when you sell the car. Power and signal cabling run down opposite sides of the vehicle — running them together is the reason so many amateur installs have alternator whine.",
    ],
    includes: [
      "Model-specific fascia kit and plug-and-play CANbus harness",
      "Steering wheel control retention",
      "Factory reverse camera and chime retention",
      "Power and signal cabling routed on opposite sides — no alternator whine",
      "Correct gauge power cable, fused at the battery",
      "Gains and crossovers set by measurement, not guessed",
    ],
    process: [
      {
        title: "Listen and discuss",
        detail:
          "We listen to what you have, ask what you actually listen to, and find out what bothers you about the current sound. 'More bass' and 'clearer vocals' need completely different solutions.",
      },
      {
        title: "Honest recommendation",
        detail:
          "We tell you where your money goes furthest. Very often that is door deadening and a component front stage, not the biggest subwoofer you can afford. If your budget only covers one thing, we will tell you which one.",
      },
      {
        title: "Preparation and deadening",
        detail:
          "Door cards come off. Butyl constrained-layer damper goes on the outer skin, closed-cell foam over it, and the inner skin is sealed to turn the door into a proper enclosure. Factory drain holes stay clear.",
      },
      {
        title: "Fitting",
        detail:
          "Head unit into a model-specific fascia with a CANbus harness. Tweeters mounted at ear height on the A-pillar or sail panel. Amplifiers mounted where they get airflow, not buried under carpet.",
      },
      {
        title: "Cabling",
        detail:
          "Correct gauge power cable from the battery with a fuse within 30cm of the terminal. Signal cabling down the opposite side of the car. Every pass-through uses a grommet.",
      },
      {
        title: "Tuning and handover",
        detail:
          "Gains set properly with a meter rather than by ear-and-hope, crossovers set to the drivers' actual capabilities, and DSP time alignment where the head unit supports it. Then we sit in the car with you and adjust to your taste.",
      },
    ],
    faqs: [
      {
        q: "Will I lose my steering wheel controls?",
        a: "No. The CANbus harness reads the factory bus and maps your existing buttons to the new head unit — volume, track, phone and voice all continue to work. We never cut the factory loom.",
      },
      {
        q: "Do I really need sound deadening?",
        a: "If you want your speakers to perform, yes — and it is the single highest-value spend in car audio. It also drops road and rain noise by a measurable 3–5 dB(A). Almost nobody sells it because it is unglamorous labour, which is exactly why most systems underperform.",
      },
      {
        q: "Is a 2GB Android head unit good enough?",
        a: "It runs, but it stutters when navigation and music are open together, and it gets worse as apps update. If the car is a keeper, 4GB is the sensible floor and you will not think about it again.",
      },
      {
        q: "Can I keep my factory head unit and still improve the sound?",
        a: "Absolutely. Deadening, a component front stage and an amplifier with high-level inputs will transform a factory system without changing the dashboard at all. On newer cars with integrated screens this is often the better route.",
      },
      {
        q: "Why does my current system whine when I accelerate?",
        a: "Alternator whine — almost always caused by power and RCA signal cable run down the same side of the car, or by a bad ground. It is a wiring fault, not a component fault, and it is fixable. Bring it in.",
      },
    ],
    suitableFor: [
      "Factory system refresh on any car",
      "Android head unit upgrades with CarPlay and Android Auto",
      "Component front stages with pillar-mounted tweeters",
      "Under-seat and boot subwoofer installs",
      "Full DSP-tuned competition-grade builds",
      "Diagnosing and fixing poor previous installs",
    ],
    aftercare: [
      "Give new speakers 20–30 hours of moderate use to loosen up before final tuning judgements",
      "Come back for a free re-tune once they are run in",
      "If you ever hear whine, buzz or a rattle, bring it in — these are wiring or mounting faults and both are fixable",
    ],
    warranty: "12 months on supplied components, lifetime on our wiring and mounting",
    relatedProducts: ["android-head-unit-9-inch", "component-speaker-set-6-5", "sound-deadening-doors", "underseat-subwoofer-active", "four-channel-amplifier"],
    relatedServices: ["sound-deadening", "lighting-installation", "camera-safety-installation"],
    keywords: ["car audio installation Sri Lanka", "car speakers Colombo", "android player installation Sri Lanka", "subwoofer fitting Dehiwala", "car sound system Sri Lanka"],
  },

  {
    slug: "sound-deadening",
    name: "Sound Deadening & Noise Reduction",
    tagline: "The cheapest real improvement in car audio — and in daily comfort.",
    category: "audio",
    fromPrice: 24500,
    priceNote: "Front doors from Rs. 24,500. All four doors from Rs. 42,500. Full car from Rs. 95,000.",
    duration: "4 hours – 2 days",
    icon: "deaden",
    body: [
      "Sound deadening does two things at once, and most people only come in for one of them. It transforms how your audio system performs, and it makes the car quieter and more comfortable to sit in on a long drive.",
      "The audio side comes down to physics. Your door speaker fires into a hollow steel box. The outer door skin flexes in sympathy, moving out of phase with the speaker cone, and the two cancel. That is why factory door speakers have almost no midbass regardless of what you paid for them.",
      "Constrained-layer butyl damper on the outer skin stops the panel resonating. A closed-cell foam layer decouples the trim from the metal. Sealing the inner skin turns the door into a proper sealed enclosure so the speaker's rear wave stops interfering with its front wave. The result is midbass that simply was not there before.",
      "The comfort side is measurable: typically 3–5 dB(A) less cabin noise at 80 km/h, a noticeable drop in rain drumming on the roof, and a solid thunk instead of a tinny clang when you close the door. Customers consistently tell us it is the most unexpectedly satisfying thing they have had done.",
      "We keep every factory drain hole clear and never seal the bottom of a door. Trapped water is caused by careless application, and it is entirely avoidable.",
    ],
    includes: [
      "Trim removal with new clips fitted on reassembly",
      "Butyl constrained-layer damper on outer skin",
      "Closed-cell foam decoupling layer",
      "Inner skin sealing to create a speaker enclosure",
      "Speaker ring sealing and aperture treatment",
      "All factory drain paths verified clear",
    ],
    process: [
      {
        title: "Scope and quote",
        detail:
          "Front doors are where the audio benefit lives. All four doors adds rear passenger comfort. Full car — doors, floor, boot, wheel arches, roof — is a serious refinement upgrade and a two-day job.",
      },
      {
        title: "Strip out",
        detail:
          "Door cards, seals and vapour barriers come off carefully. We carry replacement trim clips for common models, because reusing broken clips is why most trim jobs rattle afterwards.",
      },
      {
        title: "Outer skin damping",
        detail:
          "Butyl constrained-layer damper is rolled onto the outer skin through the access holes. Coverage is about damping resonance, not about covering every square centimetre — 25–35% well-placed coverage does nearly all the work.",
      },
      {
        title: "Decoupling layer",
        detail:
          "Closed-cell foam over the damper, and on the back of the trim card, so nothing touches metal directly and rattles.",
      },
      {
        title: "Inner skin sealing",
        detail:
          "Access holes in the inner skin are sealed, converting the door into a sealed enclosure for the speaker. Drain holes at the bottom are deliberately left open.",
      },
      {
        title: "Reassembly and test",
        detail:
          "New clips, everything torqued back properly, then a drive with you to demonstrate the difference — door shut sound, road noise, and midbass.",
      },
    ],
    specs: [
      { label: "Damper", value: "Butyl constrained-layer, aluminium-faced, 2mm" },
      { label: "Decoupler", value: "Closed-cell foam, 6mm" },
      { label: "Typical noise reduction", value: "3–5 dB(A) cabin at 80 km/h (four doors)" },
      { label: "Coverage strategy", value: "25–35% targeted coverage on outer skin" },
      { label: "Drain paths", value: "All factory drainage kept clear" },
    ],
    faqs: [
      {
        q: "Will this trap water in my doors and cause rust?",
        a: "No — not when it is done correctly. We keep every factory drain hole open and we never seal the bottom of the door. Trapped water comes from careless application, not from the material itself. It is a fair question and one you should ask any shop before they start.",
      },
      {
        q: "Is it worth it if I am not upgrading my speakers?",
        a: "Genuinely, yes. It improves your existing speakers noticeably and cuts road and rain noise regardless of what you are listening to. If your budget only stretches to one thing, do this before you buy speakers.",
      },
      {
        q: "How much weight does it add?",
        a: "Roughly 6–10kg for four doors with targeted coverage. Full-car treatment adds around 25–35kg. That is a real trade-off worth knowing about, though at Sri Lankan speeds it is not something you will feel.",
      },
      {
        q: "Do I need to cover every surface?",
        a: "No, and shops that cover 100% of a panel are wasting your money and adding needless weight. Resonance damping works on the panel's vibration modes — 25–35% of well-placed coverage achieves nearly the full effect.",
      },
    ],
    suitableFor: [
      "Any car where the audio lacks midbass",
      "Long-distance drivers wanting a quieter cabin",
      "Older cars with tinny door shut sounds",
      "Cars with noticeable rain drumming on the roof",
      "Preparation before any speaker upgrade",
    ],
    aftercare: [
      "Nothing required — it is a permanent, sealed treatment",
      "If a new rattle appears, bring it in; it is almost always a trim clip",
    ],
    warranty: "Lifetime on material adhesion",
    relatedProducts: ["sound-deadening-doors", "component-speaker-set-6-5", "android-head-unit-9-inch"],
    relatedServices: ["car-audio-installation", "interior-fitting"],
    keywords: ["sound deadening Sri Lanka", "car noise reduction Colombo", "door damping Sri Lanka", "sound proofing car Sri Lanka", "cabin noise reduction"],
  },

  {
    slug: "camera-safety-installation",
    name: "360° Cameras, Dashcams & Sensors",
    tagline: "Installed and calibrated — because an uncalibrated 360 view lies to you.",
    category: "electronics",
    fromPrice: 9500,
    priceNote: "Reverse camera from Rs. 9,500. Dashcam from Rs. 26,500. 3D 360 system from Rs. 68,500.",
    duration: "2 hours – full day",
    icon: "camera",
    featured: true,
    body: [
      "Reverse cameras, dual-channel dashcams, parking sensor arrays and full 3D 360-degree bird's-eye systems — supplied, installed, concealed and calibrated.",
      "A 360 system stitches four wide-angle cameras into a single overhead view of your car and everything around it. In a Colombo multi-storey or a narrow Dehiwala lane, it turns a three-point struggle into a glance at the screen. It is the single most useful electronic upgrade for city driving.",
      "But calibration is the entire game, and it is what almost everyone skips. An uncalibrated 360 system produces a stitched overhead view where the seams do not align with reality — kerbs appear to bend, and a pillar can disappear into a seam. That is worse than having no system, because you have learned to trust it. We calibrate every install on a marked mat and verify each seam before the car leaves.",
      "Dashcams get hardwired to the fuse box through a low-voltage cutoff, so parking mode can watch the car without ever flattening the battery. All cabling is tucked into the headliner and A-pillar — nothing dangling, nothing in your sightline.",
      "Parking sensors are simple, but the install quality is entirely visible in the drilling. Sensors must sit at the right height, evenly spaced and perfectly perpendicular. We use a hole-saw jig and spray the sensor faces to your colour code so the result reads factory rather than aftermarket.",
    ],
    includes: [
      "All cabling concealed in headliner, pillars and trim",
      "Hardwired fuse-box connection with low-voltage battery cutoff",
      "Shielded video runs routed opposite to power cabling",
      "360 systems calibrated on a marked mat and seam-verified",
      "Parking sensors drilled with a jig and sprayed to colour code",
      "Integration with factory screen where supported",
    ],
    process: [
      {
        title: "System selection",
        detail:
          "We establish what you actually need. Reverse camera for basic visibility. Dashcam for evidence. Parking sensors for audible distance. 360 for genuine spatial awareness in tight spaces. Many people need less than they think.",
      },
      {
        title: "Display integration check",
        detail:
          "We confirm whether your factory screen accepts an external video input. Most do via a decoder module. A few do not — in which case we will tell you upfront rather than discovering it mid-install.",
      },
      {
        title: "Camera mounting",
        detail:
          "Front camera into the grille, side cameras into the mirror housings, rear into the numberplate light housing or boot trim. Flush-mounted into trim rather than bolted onto the outside of a bumper.",
      },
      {
        title: "Cabling",
        detail:
          "Every cable through an existing grommet with a drip loop. Shielded video runs down the opposite side from power cabling, so you get a clean picture with no interference lines.",
      },
      {
        title: "Calibration",
        detail:
          "For 360 systems, the car is positioned on a marked calibration mat and each camera's stitch boundary is aligned to the physical reference marks. This takes about an hour and it is not optional.",
      },
      {
        title: "Testing and handover",
        detail:
          "Every trigger tested — reverse gear, indicator, manual button. Parking sensor ranges verified against a physical obstacle. Then we show you how to use it properly.",
      },
    ],
    faqs: [
      {
        q: "Will a 360 system work with my factory screen?",
        a: "On most cars, yes — we feed video into the factory display through a decoder module. A small number of models have screens that cannot accept an external input at all, and in those cases we would pair it with an Android head unit. We check this before quoting, never after starting.",
      },
      {
        q: "Why does calibration matter so much?",
        a: "Because a 360 view is four separate camera images stitched into one picture. If the stitch boundaries are not aligned to reality, the overhead view distorts at exactly the seams — which are the corners of your car, the places you are looking at. An uncalibrated system will confidently show you clearance that is not there.",
      },
      {
        q: "Will dashcam parking mode drain my battery?",
        a: "No. The hardwire kit includes a low-voltage cutoff that shuts the camera down well before your battery reaches a no-start state. We set it conservatively.",
      },
      {
        q: "Are the cameras waterproof enough for monsoon?",
        a: "The cameras are IP68 — fully sealed. The more important detail is that every cable passes through a proper grommet with a drip loop, so water tracks down the cable and drips off rather than following it into a connector.",
      },
      {
        q: "Can dashcam footage be used for an insurance claim?",
        a: "Yes, and it is frequently decisive. Clips are timestamped and, with GPS logging enabled, carry speed and location data. Download the clip promptly — loop recording will eventually overwrite it.",
      },
    ],
    suitableFor: [
      "Tight urban parking and narrow lanes",
      "Large vehicles and SUVs with poor rear visibility",
      "Evidence recording for insurance disputes",
      "Unattended parking protection",
      "New drivers building spatial confidence",
    ],
    aftercare: [
      "Clean camera lenses when you wash the car — a dirty lens defeats the whole system",
      "Format the dashcam SD card monthly for reliability",
      "Download important clips promptly before loop recording overwrites them",
      "Return for recalibration after any bumper repair or replacement",
    ],
    warranty: "12 months on cameras and modules, lifetime on our wiring",
    relatedProducts: ["camera-360-3d-system", "dashcam-dual-channel", "parking-sensor-kit", "reverse-camera-hd"],
    relatedServices: ["car-audio-installation", "lighting-installation"],
    keywords: ["360 camera installation Sri Lanka", "dashcam fitting Colombo", "reverse camera Sri Lanka", "parking sensor installation Dehiwala", "bird eye camera Sri Lanka"],
  },

  {
    slug: "interior-fitting",
    name: "Interior Upgrades & Trim Fitting",
    tagline: "Mats, covers, steering wraps and console work — airbag-safe, rattle-free.",
    category: "styling",
    fromPrice: 11500,
    priceNote: "Boot liner from Rs. 11,500. 7D mats from Rs. 21,500. Custom seat covers from Rs. 42,500.",
    duration: "30 minutes – 4 hours",
    icon: "interior",
    body: [
      "7D custom floor mats, custom-fit seat covers, hand-stitched leather steering wraps, moulded boot liners and carbon console trim — supplied, fitted and finished properly.",
      "There is one genuine safety issue in this category and it deserves saying plainly: seat covers and side airbags. Most modern seats contain a side airbag that deploys through a designed tear seam in the outer bolster. That seam is engineered to split at a specific force. A seat cover sewn shut across it can stop the airbag deploying entirely, and plenty of cheap covers do exactly that. Every cover we fit uses airbag-safe tear stitching on that seam. It is not a feature we charge extra for; it is the only acceptable way to make the product.",
      "The second thing that matters is mat anchoring. A universal mat that slides forward and bunches under your brake pedal is a real hazard, and it happens. Our mats are laser-cut to your model with the factory anchor points engaged, so the driver's mat cannot move. That is also why we do not sell universal trim-to-fit mats at all.",
      "Everything else here is about finish. Panels come apart with the right tools, trim clips get replaced rather than reused, and things go back together without rattles.",
    ],
    includes: [
      "Model-specific patterns — no universal trim-to-fit parts",
      "Airbag-safe tear-seam stitching on all seat covers",
      "Factory mat anchor points engaged",
      "New trim clips fitted on reassembly",
      "In-house fitting — nothing handed to you in a bag",
    ],
    process: [
      {
        title: "Model confirmation",
        detail:
          "We confirm we have the exact pattern for your model, year and seat configuration. If we need to order a pattern, allow one to two weeks — we will tell you before taking payment.",
      },
      {
        title: "Material and colour",
        detail:
          "Leatherette, perforated leatherette or nappa-look, with contrast stitch and piping options. For cars that park outdoors, we will steer you to perforated — solid leatherette gets genuinely uncomfortable in Colombo sun.",
      },
      {
        title: "Fitting",
        detail:
          "Seats are covered working from the back forward, with tension pulled evenly so nothing bunches at the bolsters. Airbag tear seams are verified clear before final fixing.",
      },
      {
        title: "Steering wrap (if applicable)",
        detail:
          "Leather is cut to your wheel, stretched into position and hand-stitched in place with waxed thread. It takes three to four hours and it is the reason it does not rotate like a slip-on cover.",
      },
      {
        title: "Reassembly and inspection",
        detail:
          "New clips, everything back together, then a check for rattles and a walk-through with you.",
      },
    ],
    faqs: [
      {
        q: "Are seat covers safe with side airbags?",
        a: "Only if they are made with tear seams on the airbag bolster — ours are. A cover with ordinary stitching across that seam can prevent deployment. This is a documented, real risk, not a sales angle. Ask any shop this question before you let them fit covers.",
      },
      {
        q: "Why will you not sell universal floor mats?",
        a: "Because a universal mat that slides forward and bunches under the brake pedal is a genuine hazard, and there is no version of that we are comfortable selling. Model-specific mats engage the factory anchors and cannot move.",
      },
      {
        q: "Will leatherette get too hot in Colombo?",
        a: "Solid leatherette will, in direct sun. Perforated is noticeably more comfortable and worth the difference if the car parks outdoors. We will tell you this rather than sell you the cheaper option and let you find out.",
      },
      {
        q: "Will removing my door cards cause rattles?",
        a: "Not when clips are replaced rather than reused. We stock replacement clips for common models and fit new ones on reassembly. Reused broken clips are why most trim jobs rattle afterwards.",
      },
    ],
    suitableFor: [
      "Refreshing a worn or dated interior",
      "Protecting a new car's original trim",
      "Hybrids and SUVs where boot floor protection matters",
      "Cars with worn, shiny steering wheels",
      "Preparing a car for sale",
    ],
    aftercare: [
      "Clean leatherette with a pH-neutral interior cleaner, never a solvent",
      "Lift and hose 7D mats periodically — do not let sand sit under them",
      "Condition the steering leather every few months to prevent drying",
    ],
    warranty: "12 months on stitching, material and fitting",
    relatedProducts: ["seven-d-floor-mats", "custom-seat-covers", "steering-wheel-wrap", "boot-liner-tray", "carbon-fibre-interior-console-set"],
    relatedServices: ["carbon-fibre-wrapping", "sound-deadening", "lighting-installation"],
    keywords: ["car seat covers Sri Lanka", "7D mats Colombo", "car interior fitting Sri Lanka", "steering wheel wrap Dehiwala", "custom interior Sri Lanka"],
  },

  {
    slug: "detailing-protection",
    name: "Detailing & Paint Protection",
    tagline: "Decontaminate, correct, protect — in that order, or not at all.",
    category: "protection",
    fromPrice: 7500,
    priceNote: "Glass coating from Rs. 7,500. Full decontamination and sealant from Rs. 18,500. Correction quoted per car.",
    duration: "2 hours – 2 days",
    icon: "detail",
    body: [
      "Paint decontamination, machine polishing, sealant application and hydrophobic glass coating — the protection layer that keeps everything else we fit looking new.",
      "The order matters and most people get it backwards. Applying a sealant or coating over contaminated, swirled paint locks the defects in and seals the contamination underneath. You get a glossy layer over a poor surface, and you have to strip it back off to fix anything. Decontaminate first, correct second, protect third — there is no shortcut through that sequence.",
      "Decontamination means a chemical iron-fallout remover followed by a clay bar to pull out embedded brake dust and industrial fallout that washing cannot touch. Run your hand over your paint through a plastic bag after washing — if it feels gritty, that grit is what a coating would be sealing in.",
      "Machine correction is where gloss actually comes from. Swirl marks are thousands of fine scratches scattering light in every direction; polishing levels the clear coat so light reflects cleanly instead. We are conservative about it — clear coat is finite, and a shop that aggressively compounds a car every year will run out of it.",
      "Our hydrophobic glass coating deserves a specific mention because it is a genuine safety upgrade rather than a cosmetic one. Water beads into tight droplets and blows clear above about 60 km/h, so on the expressway in heavy rain you often do not need wipers at all.",
    ],
    includes: [
      "Two-bucket wash with grit guards",
      "Chemical iron-fallout decontamination",
      "Clay bar treatment",
      "Machine polish where correction is in scope",
      "SiO2 sealant or ceramic coating application",
      "Glass clay and cerium polish before any glass coating",
    ],
    process: [
      {
        title: "Inspection",
        detail:
          "We assess paint condition under proper lighting and measure clear coat thickness where correction is on the table. We will tell you honestly what is correctable and what is too deep to safely chase.",
      },
      {
        title: "Wash and decontamination",
        detail:
          "Two-bucket wash with grit guards, then chemical iron-fallout remover — you will watch it bleed purple as it dissolves embedded brake dust — followed by clay bar.",
      },
      {
        title: "Correction (if in scope)",
        detail:
          "Machine polishing to level swirls and light scratches. We work conservatively and check thickness as we go. Preserving clear coat matters more than chasing the last 5% of defects.",
      },
      {
        title: "Panel wipe",
        detail:
          "An IPA panel wipe strips all polishing oils, so what you are looking at is the true corrected finish rather than oils temporarily filling defects. This is where honest shops and dishonest ones separate.",
      },
      {
        title: "Protection",
        detail:
          "SiO2 sealant or ceramic coating applied panel by panel and levelled within the flash window. Glass gets clay-barred and cerium-polished before its coating — a glass coating over bonded contamination fails within weeks.",
      },
      {
        title: "Cure and handover",
        detail:
          "Coatings need cure time before the car gets wet. We tell you exactly how long for the product used, and hand over a maintenance plan.",
      },
    ],
    faqs: [
      {
        q: "Is a ceramic coating worth it?",
        a: "It depends on how you use the car. A coating makes washing dramatically easier and holds gloss for years — but it is not scratch-proof, whatever anyone tells you. If the car is garaged and you wash it yourself, it is excellent value. If it lives outdoors and goes through brush washes, a coating will not save it and we would rather you spent the money on tint.",
      },
      {
        q: "Can you remove all my scratches?",
        a: "We can level anything within the clear coat. Run a fingernail across the scratch — if it catches, it has broken through the clear and polishing cannot fix it without a respray. We will tell you which of your defects are which before we quote.",
      },
      {
        q: "Why do you insist on decontaminating first?",
        a: "Because a coating applied over embedded contamination seals it in permanently, and the only way to fix it afterwards is to strip the coating off. Decontamination is unglamorous and it is where the actual result comes from.",
      },
      {
        q: "How is your glass coating different from a spray product?",
        a: "Mostly in the preparation. Any glass sealant works briefly on clean glass. Ours is applied after clay-barring and a cerium oxide polish, which removes bonded contamination and water spotting the coating would otherwise sit on top of. That is why ours lasts 8–12 months instead of six weeks.",
      },
      {
        q: "Can you detail a wrapped or coated car?",
        a: "Yes. Wrapped panels get a specific decontamination process and a wrap-safe sealant — never a machine polish, which would burn through film. Tell us what has been done to the car before we start.",
      },
    ],
    suitableFor: [
      "New cars — protect before the first defects appear",
      "Cars with swirl marks from brush washes",
      "Preparing a car for sale or photography",
      "Maintaining a wrapped or coated vehicle",
      "Monsoon-season visibility via glass coating",
    ],
    aftercare: [
      "Wait for the full cure window before the car gets wet — we will tell you the exact number",
      "Two-bucket hand wash with a pH-neutral shampoo",
      "Never use an automatic brush wash on a corrected or coated car",
      "Top up with an SiO2 spray sealant every few months",
      "Dry with a plush microfibre towel or a filtered blower, never a chamois",
    ],
    warranty: "Coating durability per manufacturer specification; workmanship guaranteed",
    relatedProducts: ["hydrophobic-glass-coating", "ceramic-spray-sealant", "microfibre-detailing-kit", "frameless-wiper-pair"],
    relatedServices: ["window-tinting", "carbon-fibre-wrapping"],
    keywords: ["car detailing Sri Lanka", "ceramic coating Colombo", "paint correction Sri Lanka", "car polish Dehiwala", "glass coating Sri Lanka"],
  },
];

/* ------------------------------------------------------------------ helpers */

/** From-prices and price notes are overridable from the local admin panel. */
export const services: Service[] = applyServiceOverrides(catalogue);

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

export function getService(slug: string): Service | undefined {
  return serviceBySlug.get(slug);
}

export function featuredServices(limit = 6): Service[] {
  return services.filter((s) => s.featured).slice(0, limit);
}

export function servicesInCategory(category: Service["category"]): Service[] {
  return services.filter((s) => s.category === category);
}

export const serviceCategories: { id: Service["category"]; label: string; blurb: string }[] = [
  { id: "styling", label: "Styling & Appearance", blurb: "Carbon, lips, spoilers, decals and interior trim." },
  { id: "protection", label: "Protection", blurb: "Tinting, detailing, coatings and paint care." },
  { id: "electronics", label: "Electronics", blurb: "Lighting, cameras, sensors and safety systems." },
  { id: "audio", label: "Audio & Refinement", blurb: "Head units, speakers, amps and sound deadening." },
];
