import type { Locale } from "./config";

/**
 * CONTENT TRANSLATIONS
 *
 * Kept in one file rather than scattered through the data files, so a
 * translator can work on a single reviewable document without touching
 * application code.
 *
 * Scope decisions, stated plainly:
 *
 *  - Category and service NAMES and TAGLINES are translated. These are the
 *    navigational surface — the words a customer scans to find what they want.
 *  - Product TAGLINES are translated. Product NAMES are not: "8D Carbon Fibre
 *    Front Bumper Trim Wrap" and "EZ Lip Pro" function as product identifiers,
 *    and Sri Lankan customers ask for them in English regardless of the
 *    language they are speaking.
 *  - Long-form body copy (product descriptions, service process steps, article
 *    bodies) remains English. These are technical documents, and a machine-grade
 *    translation of them would read worse than the English does. When the owner
 *    has them professionally translated, add the strings here.
 *
 * Anything without an entry falls back to English automatically.
 */

type Translated = Partial<Record<Exclude<Locale, "en">, string>>;

interface Entry {
  name?: Translated;
  tagline?: Translated;
}

/* -------------------------------------------------------------- categories */

export const categoryTranslations: Record<string, Entry> = {
  "carbon-fibre": {
    name: { si: "Carbon Fibre", ta: "Carbon Fibre" },
    tagline: {
      si: "සැබෑ රෙදි වියමන මෙන් පෙනෙන 8D ග්ලොස් කාබන්.",
      ta: "உண்மையான நெசவு போலத் தெரியும் 8D கிளாஸ் கார்பன்.",
    },
  },
  "ez-lip": {
    name: { si: "EZ Lip", ta: "EZ Lip" },
    tagline: {
      si: "එක්සත් ජනපදයේ නිෂ්පාදිත universal front lip. විකුණන්නේ සහ සවි කරන්නේ Nexmod හි පමණයි.",
      ta: "அமெரிக்காவில் தயாரிக்கப்பட்ட universal front lip. Nexmod இல் மட்டுமே விற்கப்பட்டு பொருத்தப்படுகிறது.",
    },
  },
  "spoilers-body": {
    name: { si: "Spoilers සහ බොඩි කිට්", ta: "Spoilers மற்றும் பாடி கிட்" },
    tagline: {
      si: "Boot spoilers, ducktails, diffusers සහ side skirts.",
      ta: "Boot spoilers, ducktails, diffusers மற்றும் side skirts.",
    },
  },
  "tyre-stickers": {
    name: { si: "ටයර් ස්ටිකර්", ta: "டயர் ஸ்டிக்கர்" },
    tagline: {
      si: "ශ්‍රී ලාංකික මාර්ගවලට ඔරොත්තු දෙන ස්ථිර රබර් අකුරු.",
      ta: "இலங்கைச் சாலைகளைத் தாங்கும் நிரந்தர ரப்பர் எழுத்துக்கள்.",
    },
  },
  lighting: {
    name: { si: "ලයිටින්", ta: "விளக்குகள்" },
    tagline: {
      si: "Sequential DRL, LED පරිවර්තන සහ අභ්‍යන්තර ambient ලයිටින්.",
      ta: "Sequential DRL, LED மாற்றங்கள் மற்றும் உள்ளக ambient விளக்குகள்.",
    },
  },
  audio: {
    name: { si: "කාර් ඕඩියෝ", ta: "கார் ஆடியோ" },
    tagline: {
      si: "Head units, speakers, subs, amps සහ sound deadening.",
      ta: "Head units, speakers, subs, amps மற்றும் sound deadening.",
    },
  },
  "cameras-safety": {
    name: { si: "කැමරා සහ ආරක්ෂාව", ta: "கேமராக்கள் & பாதுகாப்பு" },
    tagline: {
      si: "සියල්ල දකින්න. සියල්ල පටිගත කරන්න.",
      ta: "எல்லாவற்றையும் பாருங்கள். எல்லாவற்றையும் பதிவு செய்யுங்கள்.",
    },
  },
  interior: {
    name: { si: "අභ්‍යන්තරය", ta: "உட்புறம்" },
    tagline: {
      si: "මැට්, කවර්, කොන්සෝල් සහ ඔබ දිනපතා ස්පර්ශ කරන විස්තර.",
      ta: "மேட், கவர், கன்சோல் மற்றும் நீங்கள் தினமும் தொடும் விவரங்கள்.",
    },
  },
  essentials: {
    name: { si: "අත්‍යවශ්‍ය දෑ", ta: "அத்தியாவசியப் பொருட்கள்" },
    tagline: {
      si: "හොඳ වාහනයක් හොඳින් තබා ගන්නා දෑ.",
      ta: "நல்ல வாகனத்தை நல்ல நிலையில் வைத்திருக்கும் பொருட்கள்.",
    },
  },
};

/* ---------------------------------------------------------------- services */

export const serviceTranslations: Record<string, Entry> = {
  "carbon-fibre-wrapping": {
    name: { si: "Carbon Fibre රැපින්", ta: "Carbon Fibre ரேப்பிங்" },
    tagline: {
      si: "8D ග්ලොස් කාබන්, ඔබේ වාහනයේදීම කපා තාපයෙන් හැඩගස්වා.",
      ta: "8D கிளாஸ் கார்பன், உங்கள் வாகனத்திலேயே வெட்டி வெப்பத்தால் வடிவமைக்கப்படுகிறது.",
    },
  },
  "ez-lip-installation": {
    name: { si: "EZ Lip සැපයීම සහ සවි කිරීම", ta: "EZ Lip வழங்கல் & பொருத்துதல்" },
    tagline: {
      si: "EZ Lip USA හි නිල ශ්‍රී ලංකා නියෝජිත. සපයන්නේ සහ සවි කරන්නේ මෙහිදී පමණයි.",
      ta: "EZ Lip USA இன் அதிகாரப்பூர்வ இலங்கை முகவர். இங்கு மட்டுமே வழங்கப்பட்டு பொருத்தப்படுகிறது.",
    },
  },
  "spoiler-body-kit-fitting": {
    name: { si: "Spoiler සහ බොඩි කිට් සවි කිරීම", ta: "Spoiler & பாடி கிட் பொருத்துதல்" },
    tagline: {
      si: "බැඳ, මුද්‍රා තබා, පෙළගස්වා. බූට් එකට වතුර නැත, මලකඩ නැත, කිරිච්චි නැත.",
      ta: "ஒட்டி, முத்திரையிட்டு, சீரமைத்து. பூட்டில் நீர் இல்லை, துரு இல்லை, சத்தம் இல்லை.",
    },
  },
  "tyre-lettering": {
    name: { si: "ටයර් අකුරු සහ පැති ග්‍රැෆික්ස්", ta: "டயர் எழுத்துக்கள் & பக்க கிராஃபிக்ஸ்" },
    tagline: {
      si: "TyreDeckz රබර් අකුරු — ටයරය සමඟ නැමෙයි, ගැලවී යන්නේ නැත.",
      ta: "TyreDeckz ரப்பர் எழுத்துக்கள் — டயருடன் வளையும், உரிந்து விழாது.",
    },
  },
  "decals-graphics": {
    name: { si: "කස්ටම් ඩෙකල් සහ ග්‍රැෆික්ස්", ta: "தனிப்பயன் டெக்கல் & கிராஃபிக்ஸ்" },
    tagline: {
      si: "නිර්මාණය කර, ඔබේම වාහනයේ ඡායාරූපයක පෙන්වා, පසුව කපා අලවනු ලැබේ.",
      ta: "வடிவமைத்து, உங்கள் வாகனத்தின் புகைப்படத்தில் காட்டி, பின்னர் வெட்டி ஒட்டப்படுகிறது.",
    },
  },
  "window-tinting": {
    name: { si: "වීදුරු ටින්ට් සහ තාප ආරක්ෂණය", ta: "கண்ணாடி டின்ட் & வெப்பத் தடுப்பு" },
    tagline: {
      si: "සැබවින්ම තාපය අවහිර කරන ceramic film, නීතිමය සීමාව තුළ.",
      ta: "உண்மையிலேயே வெப்பத்தைத் தடுக்கும் ceramic film, சட்டப்பூர்வ வரம்பிற்குள்.",
    },
  },
  "lighting-installation": {
    name: { si: "ලයිටින් සවි කිරීම සහ දියුණු කිරීම", ta: "விளக்கு பொருத்துதல் & மேம்படுத்தல்" },
    tagline: {
      si: "ෆියුස්, රිලේ සහ හීට්-ෂ්‍රින්ක් සමඟ. ළඟම ඇති වයරයට කපා සම්බන්ධ කිරීමක් නොවේ.",
      ta: "ஃபியூஸ், ரிலே மற்றும் ஹீட்-ஷ்ரிங்க் உடன். அருகிலுள்ள கம்பியில் வெட்டி இணைப்பதல்ல.",
    },
  },
  "car-audio-installation": {
    name: { si: "කාර් ඕඩියෝ පද්ධති සහ සවි කිරීම", ta: "கார் ஆடியோ அமைப்பு & பொருத்துதல்" },
    tagline: {
      si: "Head units, speakers, amps සහ subs — සවි කරනවා පමණක් නොව, ට්‍යූන් කරයි.",
      ta: "Head units, speakers, amps மற்றும் subs — பொருத்துவது மட்டுமல்ல, ட்யூன் செய்யப்படுகிறது.",
    },
  },
  "sound-deadening": {
    name: { si: "ශබ්ද අවහිර කිරීම", ta: "ஒலி தடுப்பு" },
    tagline: {
      si: "කාර් ඕඩියෝ වල අඩුම මුදලට ලැබෙන විශාලම වෙනස.",
      ta: "கார் ஆடியோவில் குறைந்த செலவில் கிடைக்கும் மிகப்பெரிய மாற்றம்.",
    },
  },
  "camera-safety-installation": {
    name: { si: "360° කැමරා, ඩෑෂ්කැම් සහ සෙන්සර්", ta: "360° கேமரா, டேஷ்கேம் & சென்சார்" },
    tagline: {
      si: "සවි කර කැලිබ්‍රේට් කරයි — කැලිබ්‍රේට් නොකළ 360 දර්ශනයක් ඔබට බොරු කියයි.",
      ta: "பொருத்தி கேலிபிரேட் செய்யப்படுகிறது — கேலிபிரேட் செய்யப்படாத 360 காட்சி உங்களை ஏமாற்றும்.",
    },
  },
  "interior-fitting": {
    name: { si: "අභ්‍යන්තර දියුණු කිරීම් සහ ට්‍රිම්", ta: "உட்புற மேம்பாடுகள் & டிரிம்" },
    tagline: {
      si: "මැට්, කවර්, ස්ටියරින් රැප් — එයාර්බෑග් ආරක්ෂිත, කිරිච්චි නැති.",
      ta: "மேட், கவர், ஸ்டீயரிங் ரேப் — ஏர்பேக் பாதுகாப்பானது, சத்தமில்லாதது.",
    },
  },
  "detailing-protection": {
    name: { si: "ඩිටේලින් සහ තීන්ත ආරක්ෂණය", ta: "டீடெய்லிங் & வர்ணப் பாதுகாப்பு" },
    tagline: {
      si: "පිරිසිදු කරන්න, නිවැරදි කරන්න, ආරක්ෂා කරන්න — එම අනුපිළිවෙලින්ම.",
      ta: "சுத்தம் செய்க, சரிசெய்க, பாதுகாக்க — அதே வரிசையில்.",
    },
  },
};

/* ---------------------------------------------------------------- products */

/** Product taglines only. Names are identifiers and stay in English. */
export const productTranslations: Record<string, Entry> = {
  "ez-lip-pro-universal-front-lip": {
    tagline: {
      si: "එක්සත් ජනපදයේ නිෂ්පාදිත සැබෑ නම්‍යශීලී front lip. නිල ශ්‍රී ලංකා නියෝජිත.",
      ta: "அமெரிக்காவில் தயாரிக்கப்பட்ட உண்மையான நெகிழ்வான front lip. அதிகாரப்பூர்வ இலங்கை முகவர்.",
    },
  },
  "ez-lip-original-front-lip": {
    tagline: {
      si: "සම්භාව්‍ය EZ Lip හැඩය. අඩු පහත් වීමක්, එම ම කල් පැවැත්ම.",
      ta: "பாரம்பரிய EZ Lip வடிவம். குறைவான தாழ்வு, அதே நீடித்த தன்மை.",
    },
  },
  "carbon-fibre-front-bumper-trim": {
    tagline: {
      si: "ඔබේ front bumper එකේ 8D කාබන්, වාහනයේදීම කපා හැඩගස්වා.",
      ta: "உங்கள் front bumper இல் 8D கார்பன், வாகனத்திலேயே வெட்டி வடிவமைக்கப்படுகிறது.",
    },
  },
  "carbon-fibre-interior-console-set": {
    tagline: {
      si: "ගියර් කොන්සෝලය, දොර පැනල්, ඩෑෂ් ට්‍රිම් සහ පිලර් එකම සෙට් එකකින්.",
      ta: "கியர் கன்சோல், கதவுப் பேனல், டேஷ் டிரிம் மற்றும் பில்லர் ஒரே செட்டில்.",
    },
  },
  "carbon-fibre-mirror-caps": {
    tagline: {
      si: "අඩුම මුදලට වැඩිම වෙනසක් පෙන්වන දේ.",
      ta: "குறைந்த செலவில் அதிக மாற்றத்தைக் காட்டுவது.",
    },
  },
  "carbon-fibre-bonnet-wrap": {
    tagline: {
      si: "සම්පූර්ණ බොනට් එක 8D කාබන් වලින් — ප්‍රධාන ප්‍රකාශය.",
      ta: "முழு பானட்டும் 8D கார்பனில் — முக்கிய அறிவிப்பு.",
    },
  },
  "ducktail-spoiler-abs": {
    tagline: {
      si: "පිරිසිදු OEM-plus ducktail. බැඳ, මුද්‍රා තබා, වර්ණ කේතයට තීන්ත ගා.",
      ta: "சுத்தமான OEM-plus ducktail. ஒட்டி, முத்திரையிட்டு, நிற குறியீட்டில் வர்ணம் பூசி.",
    },
  },
  "roof-wing-spoiler": {
    tagline: {
      si: "රූෆ්ලයින් එක දිගු කරයි, පිටුපස වීදුරුවට සෙවණ දෙයි.",
      ta: "ரூஃப்லைனை நீட்டுகிறது, பின் கண்ணாடிக்கு நிழல் தருகிறது.",
    },
  },
  "rear-diffuser-quad-fin": {
    tagline: {
      si: "පිටුපස හිස් කොටස පුරවා වාහනය පළල් සහ ස්ථාවර ලෙස පෙන්වයි.",
      ta: "பின்பக்க வெற்றிடத்தை நிரப்பி வாகனத்தை அகலமாகவும் உறுதியாகவும் காட்டுகிறது.",
    },
  },
  "side-skirt-extension-pair": {
    tagline: {
      si: "රෝද අතර පෙනුම වසා පැති පෙනුම පහත් කරයි.",
      ta: "சக்கரங்களுக்கு இடையிலான இடைவெளியை மூடி பக்கத் தோற்றத்தைத் தாழ்த்துகிறது.",
    },
  },
  "tyredeckz-tyre-stickers-set": {
    tagline: {
      si: "ස්ථිර රබර් අකුරු. ටයර් හතරක්, ඕනෑම වචනයක්.",
      ta: "நிரந்தர ரப்பர் எழுத்துக்கள். நான்கு டயர்கள், எந்த வார்த்தையும்.",
    },
  },
  "side-decal-stickers-custom": {
    tagline: {
      si: "ඔබේ වාහනයට නිර්මාණය කළ, කපන ලද vinyl ග්‍රැෆික්ස්.",
      ta: "உங்கள் வாகனத்திற்காக வடிவமைக்கப்பட்ட, வெட்டப்பட்ட vinyl கிராஃபிக்ஸ்.",
    },
  },
  "window-decal-custom": {
    tagline: {
      si: "බැනර් තීරු, ක්ලබ් ඩෙකල් සහ පිටුපස වීදුරු අකුරු.",
      ta: "பேனர் பட்டைகள், கிளப் டெக்கல் மற்றும் பின் கண்ணாடி எழுத்துக்கள்.",
    },
  },
  "sequential-drl-strip": {
    tagline: {
      si: "Sequential indicator ක්‍රියාකාරිත්වය සහිත ගලා යන DRL.",
      ta: "Sequential indicator செயல்பாட்டுடன் கூடிய ஓடும் DRL.",
    },
  },
  "bi-led-projector-conversion": {
    tagline: {
      si: "සැබෑ projector ඔප්ටික්ස්. තියුණු කට්-ඕෆ් එකක් සහ අවශ්‍ය තැනට එළිය.",
      ta: "உண்மையான projector ஆப்டிக்ஸ். கூர்மையான கட்-ஆஃப் மற்றும் தேவையான இடத்தில் வெளிச்சம்.",
    },
  },
  "sequential-indicator-module": {
    tagline: {
      si: "ඔබේ දැනට ඇති indicator ගලා යන ආකාරයට හරවයි.",
      ta: "உங்கள் தற்போதைய indicator ஐ ஓடும் வகையாக மாற்றுகிறது.",
    },
  },
  "ambient-lighting-kit": {
    tagline: {
      si: "ඩෑෂ් සහ දොරවල් හරහා සැඟවුණු fibre-optic ambient එළිය.",
      ta: "டேஷ் மற்றும் கதவுகள் வழியாக மறைக்கப்பட்ட fibre-optic ambient வெளிச்சம்.",
    },
  },
  "led-fog-lamp-upgrade": {
    tagline: {
      si: "වැස්සේදී සැබවින්ම කැපී පෙනෙන පළල්, පහත්, කහ පැහැති එළිය.",
      ta: "மழையில் உண்மையிலேயே ஊடுருவும் அகலமான, தாழ்வான, மஞ்சள் வெளிச்சம்.",
    },
  },
  "android-head-unit-9-inch": {
    tagline: {
      si: "CarPlay, Android Auto, GPS සහ ලෑග් නොවන තිරයක්.",
      ta: "CarPlay, Android Auto, GPS மற்றும் லேக் ஆகாத திரை.",
    },
  },
  "component-speaker-set-6-5": {
    tagline: {
      si: "වෙන් වූ tweeters සහ crossovers. ඔබට සැබවින්ම ඇසෙන දියුණුව.",
      ta: "தனித்த tweeters மற்றும் crossovers. நீங்கள் உண்மையில் கேட்கும் மேம்பாடு.",
    },
  },
  "sound-deadening-doors": {
    tagline: {
      si: "කාර් ඕඩියෝ වල අඩුම මුදලට ලැබෙන සැබෑ දියුණුව.",
      ta: "கார் ஆடியோவில் குறைந்த செலவில் கிடைக்கும் உண்மையான மேம்பாடு.",
    },
  },
  "underseat-subwoofer-active": {
    tagline: {
      si: "බූට් එක අහිමි නොකර සැබෑ බාස්.",
      ta: "பூட்டை இழக்காமல் உண்மையான பாஸ்.",
    },
  },
  "four-channel-amplifier": {
    tagline: {
      si: "Component front stage එකකට පිරිසිදු බලය.",
      ta: "Component front stage இற்கு தூய்மையான சக்தி.",
    },
  },
  "camera-360-3d-system": {
    tagline: {
      si: "කැමරා හතරක්, එක් සම්පූර්ණ උඩ සිට දර්ශනයක්, නිසි ලෙස කැලිබ්‍රේට් කර.",
      ta: "நான்கு கேமராக்கள், ஒரே முழுமையான மேல் காட்சி, சரியாக கேலிபிரேட் செய்யப்பட்டு.",
    },
  },
  "dashcam-dual-channel": {
    tagline: {
      si: "ඔබ ගන්නා ලාභම රක්ෂණය.",
      ta: "நீங்கள் வாங்கும் மலிவான காப்பீடு.",
    },
  },
  "parking-sensor-kit": {
    tagline: {
      si: "සෙන්සර් අටක්, වර්ණයට ගැලපූ, පිරිසිදු නිමාවක් සමඟ.",
      ta: "எட்டு சென்சார்கள், நிறத்திற்கு ஏற்ப, சுத்தமான முடிவுடன்.",
    },
  },
  "reverse-camera-hd": {
    tagline: {
      si: "රාත්‍රියේද හොඳින් ක්‍රියා කරන, ට්‍රිම් එකට සවි කළ reverse කැමරාවක්.",
      ta: "இரவிலும் நன்றாகச் செயல்படும், டிரிம்மில் பொருத்தப்பட்ட reverse கேமரா.",
    },
  },
  "seven-d-floor-mats": {
    tagline: {
      si: "ඔබේ වාහන මාදිලියටම ලේසර් කපන ලද. සම්පූර්ණ ආවරණය, උස් දාර.",
      ta: "உங்கள் வாகன மாடலுக்கே லேசர் வெட்டப்பட்டது. முழு மறைப்பு, உயர்ந்த விளிம்புகள்.",
    },
  },
  "custom-seat-covers": {
    tagline: {
      si: "ඔබේ සීට් වලට කපන ලද, එයාර්බෑග් ආරක්ෂිත, රැලි නොවන.",
      ta: "உங்கள் இருக்கைகளுக்கு வெட்டப்பட்டது, ஏர்பேக் பாதுகாப்பானது, சுருங்காதது.",
    },
  },
  "steering-wheel-wrap": {
    tagline: {
      si: "රෝදයේම අතින් මසන ලද. ස්පර්ශයට වැයවන හොඳම මුදල.",
      ta: "சக்கரத்திலேயே கையால் தைக்கப்பட்டது. தொடு உணர்வுக்கு செலவழிக்கும் சிறந்த பணம்.",
    },
  },
  "boot-liner-tray": {
    tagline: {
      si: "ගැඹුරු දාර සහිත, ජල නොවැදෙන, මාදිලියටම කැපූ.",
      ta: "ஆழமான விளிம்புகளுடன், நீர்புகா, மாடலுக்கே வெட்டப்பட்டது.",
    },
  },
  "frameless-wiper-pair": {
    tagline: {
      si: "සම්පූර්ණ දිග පුරා සමාන පීඩනය. කම්පනයක් නැත, ඉරි නැත.",
      ta: "முழு நீளத்திலும் சமமான அழுத்தம். அதிர்வு இல்லை, கோடுகள் இல்லை.",
    },
  },
  "hydrophobic-glass-coating": {
    tagline: {
      si: "වේගය 60km/h ට වැඩි විට වැස්ස තනිවම ඉවත් වේ. සැබෑ ආරක්ෂක දියුණුවක්.",
      ta: "வேகம் 60km/h ஐத் தாண்டும்போது மழை தானாக விலகும். உண்மையான பாதுகாப்பு மேம்பாடு.",
    },
  },
  "ceramic-spray-sealant": {
    tagline: {
      si: "මිනිත්තු දහයක යෙදීමකින් මාස හයක දිලිසීමක්.",
      ta: "பத்து நிமிட பயன்பாட்டில் ஆறு மாத பளபளப்பு.",
    },
  },
  "microfibre-detailing-kit": {
    tagline: {
      si: "අප භාවිතා කරන තුවා. වර්ණ අනුව වෙන් කර ඇත.",
      ta: "நாங்கள் பயன்படுத்தும் துணிகள். நிறத்தின்படி பிரிக்கப்பட்டவை.",
    },
  },
};

/* ----------------------------------------------------------------- helpers */

function pick(entry: Entry | undefined, field: keyof Entry, locale: Locale, fallback: string) {
  if (locale === "en") return fallback;
  return entry?.[field]?.[locale] ?? fallback;
}

export function categoryName(slug: string, locale: Locale, fallback: string) {
  return pick(categoryTranslations[slug], "name", locale, fallback);
}
export function categoryTagline(slug: string, locale: Locale, fallback: string) {
  return pick(categoryTranslations[slug], "tagline", locale, fallback);
}

export function serviceName(slug: string, locale: Locale, fallback: string) {
  return pick(serviceTranslations[slug], "name", locale, fallback);
}
export function serviceTagline(slug: string, locale: Locale, fallback: string) {
  return pick(serviceTranslations[slug], "tagline", locale, fallback);
}

/** Product names are identifiers — always English. */
export function productTagline(slug: string, locale: Locale, fallback: string) {
  return pick(productTranslations[slug], "tagline", locale, fallback);
}
