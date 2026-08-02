/** Store settings + the legal pages a Moroccan shop must publish (CGV, CNDP, retours). */

const SETTINGS = [
  ["store.name", "SOHOFI BRICO", "general"],
  ["store.tagline_fr", "Quincaillerie & outillage professionnel", "general"],
  ["store.tagline_ar", "الأدوات والمعدات المهنية", "general"],
  ["store.email", "contact@sohofibrico.ma", "contact"],
  ["store.phone", "+212522334455", "contact"],
  ["store.whatsapp", "212661223344", "contact"],
  ["store.address", "142, rue Ibn Mounir, Hay Mohammadi, Casablanca 20250", "contact"],
  ["store.hours_fr", "Lun–Sam 8h30–19h00 · Dimanche fermé", "contact"],
  ["store.hours_ar", "الإثنين–السبت 8:30–19:00 · الأحد مغلق", "contact"],
  ["store.ice", "002745188000041", "legal"],
  ["store.rc", "512847", "legal"],
  ["social.facebook", "https://facebook.com/sohofibrico", "social"],
  ["social.instagram", "https://instagram.com/sohofibrico", "social"],
  ["social.youtube", "https://youtube.com/@sohofibrico", "social"],
  ["shipping.free_threshold", "600", "shipping"],
  ["shipping.cod_fee", "0", "shipping"],
  ["tax.rate", "0.20", "tax"],
  ["tax.included_in_prices", "1", "tax"],
  ["shop.maintenance_mode", "0", "general"],
  ["shop.returns_days", "14", "general"],
];

const PAGES = [
  {
    key: "cgv",
    fr: {
      slug: "conditions-generales-de-vente",
      title: "Conditions générales de vente",
      excerpt:
        "Commandes, prix TTC, paiement à la livraison, délais d'expédition, garanties et droit de rétractation.",
      body: [
        "<h2>1. Objet</h2><p>Les présentes conditions régissent les ventes conclues sur sohofibrico.ma entre SOHOFI BRICO SARL, immatriculée au registre du commerce de Casablanca sous le n° 512847 (ICE 002745188000041), et tout acheteur.</p>",
        "<h2>2. Prix</h2><p>Tous les prix sont exprimés en dirhams marocains (MAD), toutes taxes comprises, TVA 20 % incluse. Les frais de livraison sont indiqués avant la validation définitive de la commande.</p>",
        "<h2>3. Commande</h2><p>La commande est ferme à la réception de la confirmation envoyée par e-mail ou SMS. SOHOFI BRICO se réserve le droit d'annuler toute commande présentant une anomalie manifeste de prix ou de stock, avec remboursement intégral.</p>",
        "<h2>4. Paiement</h2><p>Le paiement à la livraison (espèces) est le mode par défaut. Le paiement par carte bancaire via la plateforme sécurisée CMI et le virement bancaire sont également acceptés. Aucune donnée de carte n'est stockée sur nos serveurs.</p>",
        "<h2>5. Livraison</h2><p>Expédition sous 24 h ouvrées pour les articles en stock. Délais indicatifs : 24 h sur le Grand Casablanca, 48 à 72 h sur les grandes villes, jusqu'à 5 jours ouvrés ailleurs.</p>",
        "<h2>6. Garantie et rétractation</h2><p>Garantie constructeur selon la durée indiquée sur chaque fiche produit. Droit de rétractation de 14 jours à compter de la réception, produit neuf, complet et dans son emballage d'origine.</p>",
      ].join(""),
    },
    ar: {
      slug: "الشروط-العامة-للبيع",
      title: "الشروط العامة للبيع",
      excerpt: "الطلبات، الأثمنة شاملة الضريبة، الدفع عند الاستلام، آجال الشحن، الضمانات وحق التراجع.",
      body: [
        "<h2>1. الموضوع</h2><p>تنظم هذه الشروط عمليات البيع المبرمة على موقع sohofibrico.ma بين شركة سوهوفي بريكو ش.م.م، المسجلة بالسجل التجاري بالدار البيضاء تحت رقم 512847، وكل مشترٍ.</p>",
        "<h2>2. الأثمنة</h2><p>جميع الأثمنة بالدرهم المغربي شاملة الضريبة على القيمة المضافة بنسبة 20٪. تُعرض مصاريف التوصيل قبل التأكيد النهائي للطلب.</p>",
        "<h2>3. الطلب</h2><p>يصبح الطلب نهائياً عند توصلكم برسالة التأكيد عبر البريد الإلكتروني أو الرسائل القصيرة.</p>",
        "<h2>4. الأداء</h2><p>الدفع عند الاستلام نقداً هو الوسيلة الافتراضية. كما نقبل الأداء بالبطاقة البنكية عبر منصة CMI الآمنة والتحويل البنكي. لا نحتفظ بأي معطيات بنكية على خوادمنا.</p>",
        "<h2>5. التوصيل</h2><p>الشحن خلال 24 ساعة عمل للمنتجات المتوفرة. آجال تقديرية: 24 ساعة بالدار البيضاء الكبرى، 48 إلى 72 ساعة بالمدن الكبرى، وحتى 5 أيام عمل في باقي المناطق.</p>",
        "<h2>6. الضمان وحق التراجع</h2><p>ضمان المصنّع حسب المدة المشار إليها في بطاقة كل منتج. حق التراجع داخل 14 يوماً من تاريخ التوصل، شريطة أن يكون المنتج جديداً وكاملاً وفي غلافه الأصلي.</p>",
      ].join(""),
    },
  },
  {
    key: "privacy",
    fr: {
      slug: "politique-de-confidentialite",
      title: "Politique de confidentialité",
      excerpt: "Données collectées, finalités, durée de conservation et vos droits au titre de la loi 09-08.",
      body: [
        "<h2>Responsable du traitement</h2><p>SOHOFI BRICO SARL, 142 rue Ibn Mounir, Hay Mohammadi, Casablanca. Traitement déclaré auprès de la CNDP conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.</p>",
        "<h2>Données collectées</h2><p>Nom, téléphone, e-mail et adresse de livraison, strictement nécessaires au traitement de votre commande, ainsi que l'historique d'achat et des statistiques de navigation agrégées.</p>",
        "<h2>Conservation</h2><p>Données de commande conservées 10 ans au titre des obligations comptables. Compte client supprimé sur simple demande.</p>",
        "<h2>Vos droits</h2><p>Accès, rectification, opposition et suppression par e-mail à contact@sohofibrico.ma. Aucune donnée n'est revendue à des tiers.</p>",
      ].join(""),
    },
    ar: {
      slug: "سياسة-الخصوصية",
      title: "سياسة الخصوصية",
      excerpt: "المعطيات المجمّعة والغايات ومدة الحفظ وحقوقكم بموجب القانون 09-08.",
      body: [
        "<h2>المسؤول عن المعالجة</h2><p>شركة سوهوفي بريكو ش.م.م، 142 زنقة ابن منير، الحي المحمدي، الدار البيضاء. معالجة مصرّح بها لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي طبقاً للقانون 09-08.</p>",
        "<h2>المعطيات المجمّعة</h2><p>الاسم والهاتف والبريد الإلكتروني وعنوان التوصيل، وهي ضرورية حصراً لمعالجة طلبكم.</p>",
        "<h2>مدة الحفظ</h2><p>تُحفظ معطيات الطلبات لمدة 10 سنوات بموجب الالتزامات المحاسبية. يُحذف حساب الزبون بمجرد الطلب.</p>",
        "<h2>حقوقكم</h2><p>الولوج والتصحيح والتعرض والحذف عبر البريد contact@sohofibrico.ma. لا تُباع أي معطيات لأطراف ثالثة.</p>",
      ].join(""),
    },
  },
  {
    key: "returns",
    fr: {
      slug: "retours-et-garanties",
      title: "Retours & garanties",
      excerpt: "14 jours pour changer d'avis, garantie constructeur et SAV depuis notre atelier de Casablanca.",
      body: [
        "<h2>Rétractation — 14 jours</h2><p>Vous disposez de 14 jours après réception pour nous retourner un article neuf, complet, non utilisé et dans son emballage d'origine. Remboursement sous 7 jours ouvrés après réception et contrôle.</p>",
        "<h2>Produit défectueux</h2><p>Signalez le défaut sous 48 h avec photos à contact@sohofibrico.ma. Nous organisons l'enlèvement à nos frais et remplaçons ou remboursons.</p>",
        "<h2>Garantie constructeur</h2><p>De 12 à 120 mois selon les articles, indiquée sur chaque fiche produit. La garantie ne couvre pas l'usure normale, les consommables ni les dommages résultant d'un usage non conforme.</p>",
        "<h2>SAV</h2><p>Atelier de réparation intégré à Casablanca, pièces détachées d'origine pour Bosch, Makita, DeWalt, Stanley et Facom.</p>",
      ].join(""),
    },
    ar: {
      slug: "الإرجاع-والضمان",
      title: "الإرجاع والضمان",
      excerpt: "14 يوماً لتغيير رأيكم، ضمان المصنّع وخدمة ما بعد البيع من ورشتنا بالدار البيضاء.",
      body: [
        "<h2>حق التراجع — 14 يوماً</h2><p>لديكم 14 يوماً بعد التوصل لإرجاع منتج جديد وكامل وغير مستعمل وفي غلافه الأصلي. الاسترجاع خلال 7 أيام عمل بعد التوصل والمراقبة.</p>",
        "<h2>منتج معيب</h2><p>أبلغونا بالعيب داخل 48 ساعة مع صور عبر contact@sohofibrico.ma. نتكفل بالسحب على نفقتنا مع التعويض أو الاسترجاع.</p>",
        "<h2>ضمان المصنّع</h2><p>من 12 إلى 120 شهراً حسب المنتج، مبيّن في كل بطاقة منتج. لا يشمل الضمان الاستعمال العادي ولا المواد الاستهلاكية.</p>",
        "<h2>خدمة ما بعد البيع</h2><p>ورشة إصلاح بالدار البيضاء وقطع غيار أصلية لعلامات بوش وماكيتا وديوالت وستانلي وفاكوم.</p>",
      ].join(""),
    },
  },
  {
    key: "about",
    fr: {
      slug: "a-propos",
      title: "À propos de SOHOFI BRICO",
      excerpt: "Quincaillerie familiale à Casablanca depuis 1998, aujourd'hui aussi en ligne.",
      body: [
        "<p>SOHOFI BRICO est née en 1998 d'un comptoir de quartier à Hay Mohammadi. Trois générations d'artisans, de plombiers et d'électriciens casablancais y ont trouvé le bon outil au bon prix.</p>",
        "<p>Nous vendons ce que nous utilisons nous-mêmes : des marques qui tiennent, des pièces détachées disponibles, et un atelier de réparation qui répond quand une machine lâche.</p>",
        "<h2>Ce que nous garantissons</h2><ul><li>Produits d'origine, jamais de contrefaçon</li><li>Facture avec TVA 20 % sur chaque commande</li><li>Paiement à la livraison partout au Maroc</li><li>Conseil technique par téléphone et WhatsApp</li></ul>",
      ].join(""),
    },
    ar: {
      slug: "من-نحن",
      title: "من نحن — سوهوفي بريكو",
      excerpt: "محل عائلي للأدوات بالدار البيضاء منذ 1998، واليوم على الإنترنت أيضاً.",
      body: [
        "<p>انطلقت سوهوفي بريكو سنة 1998 من دكان صغير بالحي المحمدي. ثلاثة أجيال من الحرفيين والسباكين والكهربائيين البيضاويين وجدوا فيها الأداة المناسبة بالثمن المناسب.</p>",
        "<p>نبيع ما نستعمله بأنفسنا: علامات تدوم، قطع غيار متوفرة، وورشة إصلاح تستجيب عند تعطل الآلة.</p>",
        "<h2>ما نضمنه</h2><ul><li>منتجات أصلية دون تقليد</li><li>فاتورة بالضريبة 20٪ مع كل طلب</li><li>الدفع عند الاستلام في كل المغرب</li><li>استشارة تقنية عبر الهاتف وواتساب</li></ul>",
      ].join(""),
    },
  },
  {
    key: "contact",
    fr: {
      slug: "contact",
      title: "Nous contacter",
      excerpt: "Magasin, téléphone, WhatsApp et formulaire — réponse le jour même en semaine.",
      body: [
        "<p><strong>Magasin :</strong> 142, rue Ibn Mounir, Hay Mohammadi, Casablanca 20250</p>",
        "<p><strong>Téléphone :</strong> +212 5 22 33 44 55 — <strong>WhatsApp :</strong> +212 6 61 22 33 44</p>",
        "<p><strong>Horaires :</strong> lundi au samedi, 8h30 à 19h00. Fermé le dimanche.</p>",
        "<p><strong>Commandes et SAV :</strong> contact@sohofibrico.ma</p>",
      ].join(""),
    },
    ar: {
      slug: "اتصل-بنا",
      title: "اتصلوا بنا",
      excerpt: "المتجر والهاتف وواتساب واستمارة التواصل — الجواب في نفس اليوم خلال أيام العمل.",
      body: [
        "<p><strong>المتجر:</strong> 142 زنقة ابن منير، الحي المحمدي، الدار البيضاء 20250</p>",
        "<p><strong>الهاتف:</strong> 55 44 33 22 5 212+ — <strong>واتساب:</strong> 44 33 22 61 6 212+</p>",
        "<p><strong>ساعات العمل:</strong> من الإثنين إلى السبت، من 8:30 إلى 19:00. مغلق يوم الأحد.</p>",
        "<p><strong>الطلبات وخدمة ما بعد البيع:</strong> contact@sohofibrico.ma</p>",
      ].join(""),
    },
  },
];

export async function seed(knex) {
  await knex("shop_pages").del();
  await knex("shop_settings").del();

  await knex("shop_settings").insert(
    SETTINGS.map(([key, value, group]) => ({ key, value, group })),
  );

  const rows = [];
  let position = 0;
  for (const page of PAGES) {
    position += 10;
    for (const locale of ["fr", "ar"]) {
      const p = page[locale];
      rows.push({
        key: page.key,
        locale,
        slug: p.slug,
        type: "page",
        title: p.title,
        excerpt: p.excerpt,
        body_html: p.body,
        meta_title: `${p.title} | SOHOFI BRICO`,
        meta_description: p.excerpt,
        is_published: true,
        position,
      });
    }
  }
  await knex("shop_pages").insert(rows);
}
