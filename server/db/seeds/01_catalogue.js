import { slugify } from "../../../shared/slug.js";

/** Verified Unsplash IDs — every product gets a 3-shot gallery from this pool. */
const SHOTS = [
  "photo-1504148455328-c376907d081c",
  "photo-1572981779307-38b8cabb2407",
  "photo-1530124566582-a618bc2615dc",
  "photo-1426927308491-6380b6a9936f",
  "photo-1416879595882-3373a0480b5b",
  "photo-1581092160562-40aa08e78837",
  "photo-1675301711126-a4107176d936",
  "photo-1607472586893-edb57bdc0e39",
  "photo-1558618666-fcd25c85cd64",
  "photo-1595246140625-573b715d11dc",
  "photo-1586864387967-d02ef85d93e8",
  "photo-1621905251189-08b45d6a269e",
  "photo-1503387762-592deb58ef4e",
  "photo-1521791136064-7986c2920216",
  "photo-1581244277943-fe4a9c777189",
  "photo-1584622650111-993a426fbf0a",
  "photo-1622021142947-da7dedc7c39a",
  "photo-1615529182904-14819c35db37",
  "photo-1600585152220-90363fe7e115",
  "photo-1590959651373-a3db0f38a961",
  "photo-1512314889357-e157c22f938d",
  "photo-1531835551805-16d864c8d311",
  "photo-1416339306562-f3d12fefd36f",
  "photo-1493934558415-9d19f0b2b4d2",
  "photo-1600585154340-be6161a56a0c",
  "photo-1607400201515-c2c41c07d307",
  "photo-1567361808960-dec9cb578182",
  "photo-1550009158-9ebf69173e03",
  "photo-1580901368919-7738efb0f87e",
  "photo-1589939705384-5185137a7f0f",
  "photo-1517646287270-a5a9ca602e5c",
  "photo-1533090161767-e6ffed986c88",
];

const shot = (i, w = 1000) =>
  `https://images.unsplash.com/${SHOTS[i % SHOTS.length]}?auto=format&fit=crop&w=${w}&q=70`;

/** [key, name_fr, name_ar, icon, parentKey] */
const CATEGORIES = [
  ["electroportatif", "Outillage électroportatif", "أدوات كهربائية", "Drill", null],
  ["perceuses", "Perceuses & visseuses", "مثاقب ومفكات", "Wrench", "electroportatif"],
  ["decoupe", "Meuleuses & scies", "أجهزة القطع والجلخ", "CircleDot", "electroportatif"],
  ["poncage", "Ponçage & rabotage", "الصنفرة والتنعيم", "Layers", "electroportatif"],

  ["outillage-main", "Outillage à main", "عدد يدوية", "Hammer", null],
  ["frappe", "Marteaux & burins", "مطارق وأزاميل", "Hammer", "outillage-main"],
  ["cles", "Clés & pinces", "مفاتيح وكماشات", "Wrench", "outillage-main"],
  ["mesure", "Mesure & traçage", "القياس والتخطيط", "Ruler", "outillage-main"],

  ["quincaillerie", "Quincaillerie & fixation", "أدوات التثبيت", "Bolt", null],
  ["visserie", "Vis, chevilles & boulons", "براغي وخوابير", "Bolt", "quincaillerie"],
  ["serrurerie", "Serrures & charnières", "أقفال ومفصلات", "Lock", "quincaillerie"],

  ["plomberie", "Plomberie", "السباكة", "Droplets", null],
  ["electricite", "Électricité", "الكهرباء", "Zap", null],
  ["peinture", "Peinture & droguerie", "الدهان والمواد", "Paintbrush", null],
  ["jardinage", "Jardinage", "البستنة", "Sprout", null],
  ["securite", "Sécurité & EPI", "السلامة والوقاية", "HardHat", null],
];

const INTRO = {
  electroportatif: {
    fr: "Perceuses, meuleuses, scies et ponceuses des grandes marques — garantie constructeur, pièces détachées disponibles et livraison partout au Maroc.",
    ar: "مثاقب وأجهزة جلخ ومناشير من أفضل العلامات — ضمان المصنّع وقطع غيار متوفرة وتوصيل لجميع المدن المغربية.",
  },
  "outillage-main": {
    fr: "Marteaux, clés, pinces et instruments de mesure sélectionnés pour l'usage professionnel quotidien : acier traité, prise en main confortable, garantie à vie sur les grandes marques.",
    ar: "مطارق ومفاتيح وكماشات وأدوات قياس مختارة للاستعمال المهني اليومي: فولاذ معالج ومقبض مريح وضمان مدى الحياة على العلامات الكبرى.",
  },
  quincaillerie: {
    fr: "Visserie, chevilles, boulons, serrures et charnières vendus à l'unité, en boîte ou en assortiment — de quoi finir le chantier sans deuxième aller-retour.",
    ar: "براغي وخوابير ومسامير وأقفال ومفصلات بالقطعة أو بالعلبة أو بالطقم — كل ما يلزم لإنهاء الورش دون رحلة ثانية.",
  },
  electricite: {
    fr: "Disjoncteurs, câbles, appareillage et éclairage LED conformes aux normes marocaines, avec facture TVA pour vos chantiers déclarés.",
    ar: "قواطع وكابلات وتجهيزات وإنارة LED مطابقة للمعايير المغربية، مع فاتورة بالضريبة لأوراشكم المصرّح بها.",
  },
  securite: {
    fr: "Casques, gants anti-coupure, masques FFP2, lunettes et extincteurs — l'EPI qui protège vraiment vos équipes, à prix chantier.",
    ar: "خوذ وقفازات مضادة للقطع وكمامات FFP2 ونظارات وطفايات — معدات وقاية حقيقية لفرقكم بأثمنة الورش.",
  },
};

/**
 * [sku, catKey, brand, name_fr, name_ar, price, compareAt, stock, unit, weight, warranty, featured, tags]
 */
const PRODUCTS = [
  ["SB-PER-001", "perceuses", "Bosch", "Perceuse à percussion GSB 13 RE 600 W", "مثقاب دقاق بوش GSB 13 RE 600 واط", 749, 899, 34, "piece", 1.8, 24, true, "perceuse,percussion,bosch,600w"],
  ["SB-PER-002", "perceuses", "Makita", "Perceuse-visseuse sans fil DF333D 12 V", "مفك ومثقاب لاسلكي ماكيتا DF333D 12 فولت", 1290, 1490, 18, "piece", 1.1, 24, true, "visseuse,sans fil,makita,12v"],
  ["SB-PER-003", "perceuses", "DeWalt", "Perceuse à percussion DCD778 18 V XR", "مثقاب دقاق ديوالت DCD778 18 فولت", 2190, null, 9, "piece", 1.6, 36, false, "perceuse,18v,dewalt,xr"],
  ["SB-PER-004", "perceuses", "Stanley", "Perforateur SDS-Plus 800 W 2,4 J", "مثقاب هيدروليكي SDS-Plus 800 واط", 1090, 1250, 12, "piece", 2.9, 12, false, "perforateur,sds,beton"],
  ["SB-PER-005", "perceuses", "Bosch", "Coffret 100 embouts et forets Bosch V-Line", "علبة 100 قطعة رؤوس ولقم بوش", 349, 429, 61, "coffret", 1.2, 12, false, "forets,embouts,coffret"],

  ["SB-DEC-001", "decoupe", "Bosch", "Meuleuse d'angle GWS 750 125 mm", "جلاخة زاوية بوش GWS 750 قياس 125 مم", 629, 749, 27, "piece", 1.9, 24, true, "meuleuse,125,disqueuse"],
  ["SB-DEC-002", "decoupe", "Makita", "Scie circulaire HS7601 1200 W 190 mm", "منشار دائري ماكيتا HS7601 1200 واط", 1450, null, 7, "piece", 4.0, 24, false, "scie,circulaire,190mm"],
  ["SB-DEC-003", "decoupe", "Ryobi", "Scie sauteuse RJS750-G 500 W", "منشار أركيت ريوبي RJS750-G 500 واط", 549, 649, 22, "piece", 2.1, 24, false, "scie sauteuse,decoupe"],
  ["SB-DEC-004", "decoupe", "Norton", "Lot de 25 disques à tronçonner 125 mm métal", "25 قرص قطع للمعدن 125 مم", 189, 239, 140, "lot", 2.4, 0, false, "disque,tronconnage,metal"],

  ["SB-PON-001", "poncage", "Bosch", "Ponceuse excentrique PEX 220 A 220 W", "صنفرة دورانية بوش PEX 220 A", 689, null, 15, "piece", 1.3, 24, false, "ponceuse,excentrique"],
  ["SB-PON-002", "poncage", "Makita", "Ponceuse vibrante BO3711 190 W", "صنفرة اهتزازية ماكيتا BO3711", 749, 829, 11, "piece", 1.6, 24, false, "ponceuse,vibrante"],
  ["SB-PON-003", "poncage", "3M", "Papier abrasif assorti — 50 feuilles", "ورق صنفرة متنوع 50 ورقة", 129, null, 210, "lot", 0.6, 0, false, "abrasif,papier de verre"],

  ["SB-FRA-001", "frappe", "Stanley", "Marteau de charpentier manche fibre 570 g", "مطرقة نجار بمقبض فيبر 570 غ", 179, 219, 88, "piece", 0.7, 120, false, "marteau,charpentier"],
  ["SB-FRA-002", "frappe", "Facom", "Massette 1250 g manche bois", "مطرقة ثقيلة 1250 غ بمقبض خشبي", 249, null, 41, "piece", 1.4, 120, false, "massette,demolition"],
  ["SB-FRA-003", "frappe", "Stanley", "Jeu de 5 burins et pointeaux acier", "طقم 5 أزاميل ومخارز فولاذية", 219, 269, 33, "jeu", 1.1, 60, false, "burin,pointeau,ciseau"],

  ["SB-CLE-001", "cles", "Facom", "Coffret 108 outils cliquet 1/4 + 1/2", "علبة 108 أدوات مع مفتاح راتشيت", 1690, 1990, 8, "coffret", 8.4, 120, true, "cliquet,douilles,coffret"],
  ["SB-CLE-002", "cles", "Stanley", "Jeu de 12 clés mixtes 8-24 mm", "طقم 12 مفتاح مزدوج 8-24 مم", 389, 459, 46, "jeu", 2.2, 120, false, "cles,mixtes,plates"],
  ["SB-CLE-003", "cles", "Knipex", "Pince multiprise Cobra 250 mm", "كماشة متعددة كنيبكس 250 مم", 549, null, 19, "piece", 0.4, 120, true, "pince,multiprise,cobra"],
  ["SB-CLE-004", "cles", "Facom", "Clé à molette 300 mm chromée", "مفتاح إنجليزي 300 مم", 279, 329, 52, "piece", 0.6, 120, false, "cle a molette,anglaise"],

  ["SB-MES-001", "mesure", "Stanley", "Mètre ruban PowerLock 8 m x 25 mm", "متر شريطي ستانلي 8 م", 129, 159, 173, "piece", 0.3, 12, false, "metre,ruban,mesure"],
  ["SB-MES-002", "mesure", "Bosch", "Télémètre laser GLM 40 — portée 40 m", "جهاز قياس ليزر بوش GLM 40", 890, 1090, 14, "piece", 0.1, 24, true, "laser,telemetre,distance"],
  ["SB-MES-003", "mesure", "Stabila", "Niveau à bulle 100 cm aluminium", "ميزان ماء 100 سم ألمنيوم", 339, null, 37, "piece", 0.9, 60, false, "niveau,bulle,alu"],
  ["SB-MES-004", "mesure", "Bosch", "Détecteur de métaux et câbles Truvo", "كاشف المعادن والأسلاك بوش Truvo", 429, 499, 21, "piece", 0.2, 24, false, "detecteur,cables,metaux"],

  ["SB-VIS-001", "visserie", "Fischer", "Boîte 200 chevilles nylon SX 6 + vis", "علبة 200 خابور نايلون SX 6 مع براغي", 149, null, 220, "boite", 1.0, 0, false, "cheville,fischer,nylon"],
  ["SB-VIS-002", "visserie", "Spax", "Vis à bois 4x50 mm — boîte de 500", "براغي خشب 4×50 مم علبة 500", 189, 229, 165, "boite", 2.1, 0, false, "vis,bois,torx"],
  ["SB-VIS-003", "visserie", "Generic", "Assortiment 1000 vis et écrous inox", "طقم 1000 برغي وصامولة إنوكس", 299, 379, 74, "coffret", 3.2, 0, false, "vis,ecrous,inox,assortiment"],
  ["SB-VIS-004", "visserie", "Fischer", "Chevilles à frapper béton 8x80 — 100 pcs", "خوابير خرسانة 8×80 — 100 قطعة", 219, null, 96, "boite", 1.8, 0, false, "cheville,beton,frapper"],

  ["SB-SER-001", "serrurerie", "Yale", "Serrure encastrable 3 points + 5 clés", "قفل مدمج 3 نقاط مع 5 مفاتيح", 899, 1090, 16, "piece", 2.6, 24, false, "serrure,3 points,yale"],
  ["SB-SER-002", "serrurerie", "Abus", "Cadenas laiton 50 mm anse trempée", "قفل نحاسي 50 مم", 219, 259, 68, "piece", 0.4, 24, false, "cadenas,laiton,abus"],
  ["SB-SER-003", "serrurerie", "Generic", "Lot de 10 charnières inox 100 mm", "10 مفصلات إنوكس 100 مم", 179, null, 84, "lot", 1.5, 12, false, "charniere,paumelle,inox"],

  ["SB-PLO-001", "plomberie", "Grohe", "Mitigeur évier col de cygne chromé", "خلاط مجلى غروهي كروم", 1290, 1590, 13, "piece", 1.9, 60, true, "mitigeur,robinet,grohe"],
  ["SB-PLO-002", "plomberie", "Nicoll", "Tube PVC évacuation Ø100 — 2 m", "أنبوب PVC للصرف قطر 100 — 2 م", 149, null, 130, "piece", 2.4, 0, false, "pvc,evacuation,tube"],
  ["SB-PLO-003", "plomberie", "Generic", "Kit raccords PER 16 mm — 20 pièces", "طقم وصلات PER 16 مم — 20 قطعة", 239, 289, 57, "kit", 1.1, 12, false, "per,raccord,plomberie"],
  ["SB-PLO-004", "plomberie", "Karcher", "Furet déboucheur manuel 5 m", "سلك تسليك المجاري 5 م", 189, 229, 44, "piece", 1.3, 12, false, "furet,debouchage"],

  ["SB-ELE-001", "electricite", "Legrand", "Disjoncteur différentiel 30 mA 40 A", "قاطع تفاضلي 30 مللي أمبير 40 أمبير", 469, 559, 29, "piece", 0.5, 24, false, "disjoncteur,differentiel,legrand"],
  ["SB-ELE-002", "electricite", "Nexans", "Câble H07V-U 2,5 mm² — couronne 100 m", "كابل كهربائي 2.5 مم² لفة 100 م", 649, null, 38, "couronne", 9.5, 0, true, "cable,fil,electrique"],
  ["SB-ELE-003", "electricite", "Legrand", "Lot 10 prises Mosaic 16 A + support", "10 مقابس ليغراند 16 أمبير", 549, 629, 25, "lot", 1.2, 24, false, "prise,interrupteur,mosaic"],
  ["SB-ELE-004", "electricite", "Philips", "Projecteur LED 50 W IP65 4000 K", "كشاف LED 50 واط IP65", 289, 359, 63, "piece", 0.8, 24, false, "led,projecteur,exterieur"],

  ["SB-PEI-001", "peinture", "Astral", "Peinture acrylique mate blanche 10 L", "دهان أكريليك مطفي أبيض 10 لتر", 549, 649, 47, "bidon", 12.5, 0, true, "peinture,acrylique,blanc"],
  ["SB-PEI-002", "peinture", "Colorado", "Enduit de rebouchage 5 kg", "معجون ترميم 5 كغ", 129, null, 92, "sac", 5.0, 0, false, "enduit,rebouchage,platre"],
  ["SB-PEI-003", "peinture", "Generic", "Kit rouleaux + bac + pinceaux 9 pièces", "طقم رولات وفرشاة 9 قطع", 179, 219, 108, "kit", 1.4, 0, false, "rouleau,pinceau,peinture"],
  ["SB-PEI-004", "peinture", "Sika", "Mastic polyuréthane étanchéité 300 ml", "معجون بولي يوريثان للعزل 300 مل", 89, null, 186, "cartouche", 0.4, 0, false, "mastic,sika,etancheite"],

  ["SB-JAR-001", "jardinage", "Gardena", "Tuyau d'arrosage 25 m + raccords", "خرطوم سقي 25 م مع وصلات", 469, 549, 31, "kit", 4.6, 24, false, "arrosage,tuyau,jardin"],
  ["SB-JAR-002", "jardinage", "Fiskars", "Sécateur à enclume PowerGear X", "مقص تقليم فيسكارس", 389, null, 26, "piece", 0.3, 60, false, "secateur,taille,jardin"],
  ["SB-JAR-003", "jardinage", "Bosch", "Taille-haie électrique AHS 45-16 420 W", "مقص سياج كهربائي بوش 420 واط", 999, 1190, 10, "piece", 2.7, 24, false, "taille-haie,jardin"],

  ["SB-SEC-001", "securite", "3M", "Lot 10 masques FFP2 + 2 lunettes", "10 كمامات FFP2 مع نظارتي حماية", 149, 189, 145, "lot", 0.5, 0, false, "masque,ffp2,lunettes"],
  ["SB-SEC-002", "securite", "Delta Plus", "Casque de chantier + jugulaire", "خوذة ورش مع حزام ذقن", 129, null, 77, "piece", 0.4, 24, false, "casque,chantier,epi"],
  ["SB-SEC-003", "securite", "Delta Plus", "Gants anti-coupure niveau 5 — 3 paires", "قفازات مضادة للقطع مستوى 5 — 3 أزواج", 169, 199, 118, "lot", 0.4, 0, false, "gants,anticoupure,protection"],
  ["SB-SEC-004", "securite", "Generic", "Extincteur poudre ABC 6 kg + support", "طفاية حريق بودرة 6 كغ", 549, 649, 23, "piece", 9.2, 60, false, "extincteur,incendie,abc"],
];

const shortFr = (name, brand) =>
  `${name} — ${brand}. Stock Casablanca, expédition sous 24 h, paiement à la livraison partout au Maroc.`;
const shortAr = (name) => `${name} — متوفر بالمخزون، شحن خلال 24 ساعة والدفع عند الاستلام في كل المغرب.`;

const descFr = (name, brand, warranty) =>
  [
    `<p>La <strong>${name}</strong> de ${brand} fait partie de la sélection SOHOFI BRICO : du matériel choisi pour tenir sur un vrai chantier, pas seulement sur une étagère.</p>`,
    "<ul>",
    "<li>Références d'origine, facture avec TVA 20 %</li>",
    warranty ? `<li>Garantie constructeur ${warranty} mois</li>` : "<li>Produit consommable, non garanti</li>",
    "<li>Pièces détachées et SAV assurés depuis notre atelier de Casablanca</li>",
    "<li>Retrait gratuit en magasin ou livraison 24-72 h</li>",
    "</ul>",
  ].join("");

const descAr = (name, brand, warranty) =>
  [
    `<p><strong>${name}</strong> من ${brand} ضمن تشكيلة سوهوفي بريكو المختارة للاستعمال المهني اليومي.</p>`,
    "<ul>",
    "<li>منتج أصلي مع فاتورة تتضمن الضريبة 20٪</li>",
    warranty ? `<li>ضمان المصنّع ${warranty} شهرا</li>` : "<li>مادة استهلاكية بدون ضمان</li>",
    "<li>قطع الغيار وخدمة ما بعد البيع من ورشتنا بالدار البيضاء</li>",
    "<li>سحب مجاني من المتجر أو توصيل خلال 24-72 ساعة</li>",
    "</ul>",
  ].join("");

export async function seed(knex) {
  // Idempotent: wipe only what this seed owns.
  await knex("shop_product_seo").del();
  await knex("shop_product_images").del();
  await knex("shop_category_seo").del();
  await knex("products").del();
  await knex("categories").del();
  await knex("suppliers").del();

  const [supplierId] = await knex("suppliers")
    .insert({
      name: "SOHOFI Distribution",
      contact_name: "Service achats",
      phone: "+212522000000",
      email: "achats@sohofibrico.ma",
      city: "Casablanca",
    })
    .returning("id")
    .then((r) => r.map((x) => (typeof x === "object" ? x.id : x)));

  // ── categories ────────────────────────────────────────────────────────────
  const catIdByKey = new Map();
  let position = 0;

  for (const [key, nameFr, nameAr, icon, parentKey] of CATEGORIES) {
    const rows = await knex("categories")
      .insert({
        name: nameFr,
        name_fr: nameFr,
        name_ar: nameAr,
        description: INTRO[key]?.fr ?? null,
        icon,
        parent_id: parentKey ? catIdByKey.get(parentKey) : null,
        position: (position += 10),
        is_active: true,
        is_visible_online: true,
        image_url: shot(catIdByKey.size + 3, 800),
      })
      .returning("id");
    const id = typeof rows[0] === "object" ? rows[0].id : rows[0];
    catIdByKey.set(key, id);

    await knex("shop_category_seo").insert([
      {
        category_id: id,
        locale: "fr",
        slug: slugify(nameFr, "fr"),
        meta_title: `${nameFr} au Maroc — prix, stock et livraison | SOHOFI BRICO`,
        meta_description: `Achetez ${nameFr.toLowerCase()} en ligne au Maroc. Paiement à la livraison, facture TVA, retrait à Casablanca et livraison 24-72 h.`,
        intro_html: INTRO[key]?.fr ? `<p>${INTRO[key].fr}</p>` : null,
      },
      {
        category_id: id,
        locale: "ar",
        slug: slugify(nameAr, "ar"),
        meta_title: `${nameAr} في المغرب — الأثمنة والتوفر | سوهوفي بريكو`,
        meta_description: `اشتر ${nameAr} عبر الإنترنت في المغرب. الدفع عند الاستلام، فاتورة بالضريبة، وتوصيل خلال 24-72 ساعة.`,
        intro_html: INTRO[key]?.ar ? `<p>${INTRO[key].ar}</p>` : null,
      },
    ]);
  }

  // ── products ──────────────────────────────────────────────────────────────
  let i = 0;
  for (const [
    sku,
    catKey,
    brand,
    nameFr,
    nameAr,
    price,
    compareAt,
    stock,
    unit,
    weight,
    warranty,
    featured,
    tags,
  ] of PRODUCTS) {
    const seedIdx = i * 3;
    const rows = await knex("products")
      .insert({
        sku,
        barcode: `611${String(1000000 + i * 137).slice(0, 10)}`,
        name: nameFr,
        name_fr: nameFr,
        name_ar: nameAr,
        description: descFr(nameFr, brand, warranty),
        description_fr: descFr(nameFr, brand, warranty),
        description_ar: descAr(nameAr, brand, warranty),
        short_description_fr: shortFr(nameFr, brand),
        short_description_ar: shortAr(nameAr),
        brand,
        unit,
        price,
        compare_at_price: compareAt,
        cost_price: Math.round(price * 0.68 * 100) / 100,
        stock_quantity: stock,
        min_stock: 5,
        category_id: catIdByKey.get(catKey),
        supplier_id: supplierId,
        image_url: shot(seedIdx),
        tags,
        weight_kg: weight,
        dimensions: `${20 + (i % 25)}x${12 + (i % 14)}x${8 + (i % 10)} cm`,
        warranty_months: warranty,
        is_active: true,
        is_featured: featured,
        is_online: true,
        rating_avg: Math.round((3.9 + ((i * 7) % 11) / 10) * 100) / 100,
        rating_count: 4 + ((i * 13) % 90),
        sold_count: 6 + ((i * 29) % 240),
      })
      .returning("id");
    const productId = typeof rows[0] === "object" ? rows[0].id : rows[0];

    await knex("shop_product_images").insert(
      [0, 1, 2].map((n) => ({
        product_id: productId,
        url: shot(seedIdx + n),
        alt_fr: `${nameFr} — vue ${n + 1}`,
        alt_ar: `${nameAr} — صورة ${n + 1}`,
        width: 1000,
        height: 1000,
        position: n,
        is_primary: n === 0,
      })),
    );

    await knex("shop_product_seo").insert([
      {
        product_id: productId,
        locale: "fr",
        slug: slugify(nameFr, "fr"),
        meta_title: `${nameFr} — ${price} MAD | SOHOFI BRICO`,
        meta_description: shortFr(nameFr, brand).slice(0, 300),
        og_image: shot(seedIdx, 1200),
      },
      {
        product_id: productId,
        locale: "ar",
        slug: slugify(nameAr, "ar"),
        meta_title: `${nameAr} — ${price} درهم | سوهوفي بريكو`,
        meta_description: shortAr(nameAr).slice(0, 300),
        og_image: shot(seedIdx, 1200),
      },
    ]);

    i += 1;
  }
}
