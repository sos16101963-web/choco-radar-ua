export type CategorySlug =
  | 'all'
  | 'plytky-shokoladu'
  | 'korpusni-ta-rozmalovani-tsukerky'
  | 'shokoladni-kvity-ta-bukety'
  | 'malyna-ta-polunytsia-v-shokoladi'
  | 'horikhy-ta-sukhofrukty-v-shokoladi'
  | 'bez-tsukru-ta-vegan'
  | 'solodoshchi-dlia-ditei'
  | 'kraftovyi-zefir-ta-bukety'
  | 'avtorski-torty-ta-deserty';

export type MakerSegment =
  | 'bean-to-bar'
  | 'chocolatier-bonbons'
  | 'healthy-vegan'
  | 'flowers-berries-nuts'
  | 'craft-zefir-pastila'
  | 'custom-cakes-pastry';

export interface CategoryInfo {
  slug: CategorySlug;
  titleUk: string;
  shortTitle: string;
  emoji: string;
  seoH1: string;
  seoDescription: string;
  expertGuide: string;
}

export interface CraftMaker {
  id: string;
  name: string;
  slug: string;
  segment: MakerSegment;
  segmentTitle: string;
  city: string;
  regionCity: 'Харків' | 'Київ' | 'Львів' | 'Луцьк / Волинь' | 'Дніпро' | 'Одеса / Південь' | 'Полтава / Суми / Запоріжжя' | 'Вінниця / Хмельницький / Житомир' | 'Черкаси / Захід та Центри';
  foundedYear: number;
  specialty: string;
  categories: Exclude<CategorySlug, 'all'>[]; // What this maker actually produces!
  mainCategory: Exclude<CategorySlug, 'all'>;
  isBeanToBar: boolean;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  cacaoOrigin: string[];
  description: string;
  websiteUrl: string;
  categoryUrls?: Partial<Record<Exclude<CategorySlug, 'all'>, string>>;
  instagramHandle?: string;
  instagramUrl?: string;
  phone: string;
  email?: string;
  address: string;
  shippingNote: string;
  badges: string[];
  imageUrl?: string;
  priceMin?: number;
  priceMax?: number;
  priceUnit?: string;
}

export interface ChocolateProduct {
  id: string;
  title: string;
  slug: string;
  makerId: string;
  makerName: string;
  makerCity: string;
  category: Exclude<CategorySlug, 'all'>;
  subType: string;
  priceUah: number;
  weightGrams: number;
  cacaoPercent: number;
  sweetener:
    | 'Тростинний цукор'
    | 'Мед'
    | 'Кокосовий цукор'
    | 'Без цукру (Еритритол/Стевія)'
    | 'Сироп топінамбура'
    | 'Кероб (природна солодкість)'
    | 'Класичний буряковий';
  cacaoType: string;
  isSugarFree: boolean;
  isVegan: boolean;
  isBeanToBar: boolean;
  isHandPainted: boolean;
  isGiftReady: boolean;
  thermoBoxIncluded: boolean;
  rating: number;
  reviewsCount: number;
  cleanLabelScore: number;
  flavorProfile: {
    sweetness: number;
    acidity: number;
    bitterness: number;
    fruityNotes: number;
    nuttyNotes: number;
  };
  tastingNotes: string[];
  expertVerdict: string;
  bestFor: ('gift-her' | 'gift-boss' | 'kids' | 'gourmet-self' | 'corporate')[];
  imageUrl: string;
  offersCount: number;
  productUrl?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'all',
    titleUk: 'Всі вироби та виробники шоколаду, зефіру і тортів України',
    shortTitle: 'Всі категорії',
    emoji: '✨',
    seoH1: 'CrafoHub — Всі крафтові виробники шоколаду, зефіру та авторських тортів України',
    seoDescription:
      'Всеукраїнська платформа CrafoHub: 105 перевірені активні майстерні з прямими телефонами, адресами та сайтами. Плитки шоколаду і батончики, цукерки ручної роботи, шоколадні та зефірні букети, малина в шоколаді, вироби без цукру, солодощі для дітей та торти на замовлення.',
    expertGuide:
      'Оберіть потрібну рубрику зверху або скористайтеся Інтерактивним Сомельє Подарунків: платформа миттєво підбере кращі вироби та перевірених майстрів вашого міста.',
  },
  {
    slug: 'plytky-shokoladu',
    titleUk: 'Плитка шоколаду, батончик (Авторський та Ремісничий шоколад)',
    shortTitle: 'Плитка шоколаду, батончик',
    emoji: '🍫',
    seoH1: 'Плитка шоколаду та крафтові батончики України — CrafoHub',
    seoDescription:
      'Крафтові плитки шоколаду, шоколадні батончики з горіхами, карамеллю, ягодами та дубайський шоколад від найкращих майстерень України.',
    expertGuide:
      'Звертайте увагу на ціну за 100 г та % какао. Справжня крафтова плитка шоколаду або батончик виготовляється на чистому какао-маслі без пальмової олії.',
  },
  {
    slug: 'korpusni-ta-rozmalovani-tsukerky',
    titleUk: 'Корпусні, розмальовані цукерки, сирні трюфелі та фадж',
    shortTitle: 'Цукерки ручної роботи',
    emoji: '🍬',
    seoH1: 'Цукерки ручної роботи та трюфелі України — CrafoHub',
    seoDescription:
      'Дизайнерські розписні корпусні цукерки, сирні трюфелі з дорблю та пармезаном, праліне й американський фадж від українських шоколатьє.',
    expertGuide:
      'Авторські цукерки створюються з бельгійського, французького або італійського шоколаду з натуральними ягідними пюре, горіховим праліне або витриманими сирами.',
  },
  {
    slug: 'shokoladni-kvity-ta-bukety',
    titleUk: 'Шоколадні квіти, півонії, троянди та подарункові букети',
    shortTitle: 'Шоколадні квіти і букети',
    emoji: '🌹',
    seoH1: 'Шоколадні квіти та букети ручної роботи в Україні — CrafoHub',
    seoDescription:
      'Реалістичні букети з шоколадних троянд, півоній і тюльпанів зі справжнього бельгійського шоколаду Callebaut та Veliche з доставкою Новою Поштою.',
    expertGuide:
      'Справжні крафтові шоколадні квіти (Crafo Харків, Ecojoy Ковель, ChocoLady Одеса) відливаються з натурального бельгійського шоколаду без пальмової глазурі й не в’януть до 6 місяців.',
  },
  {
    slug: 'malyna-ta-polunytsia-v-shokoladi',
    titleUk: 'Малина та полуниця в шоколаді (Сублімована та Свіжа)',
    shortTitle: 'Малина і полуниця в шоколаді',
    emoji: '🍓',
    seoH1: 'Малина та полуниця в шоколаді — Виробники України | CrafoHub',
    seoDescription:
      'Цільна хрумка сублімована малина в шоколаді з доставкою по всій Україні та подарункові бокси свіжої полуниці в бельгійському шоколаді.',
    expertGuide:
      'Сублімована малина в шоколаді зберігається до 6 місяців і доставляється Новою Поштою в будь-яке місто. Свіжа полуниця в шоколаді доставляється кур’єром або в термобоксах.',
  },
  {
    slug: 'horikhy-ta-sukhofrukty-v-shokoladi',
    titleUk: 'Горіхи, драже, чорнослив та сухофрукти в шоколаді',
    shortTitle: 'Горіхи та сухофрукти',
    emoji: '🌰',
    seoH1: 'Горіхи та сухофрукти в шоколаді — Виробники України | CrafoHub',
    seoDescription:
      'Карамелізований фундук, мигдаль, фісташка, чорнослив з волоським горіхом, курага, інжир та фініки в справжньому шоколаді.',
    expertGuide:
      'Українські крафтові мануфактури використовують сухофрукти без хімічного копчення та цільні обсмажені горіхи в товстому шарі шоколаду.',
  },
  {
    slug: 'bez-tsukru-ta-vegan',
    titleUk: 'Без цукру / Vegan / На меду та стевії',
    shortTitle: 'Без цукру',
    emoji: '🌿',
    seoH1: 'Шоколад, батончики та зефір без цукру в Україні — CrafoHub',
    seoDescription:
      'Корисний крафтовий шоколад, батончики, пастила, зефір і цукерки без білого цукру, лактози та глютену: на меду, кокосовому нектарі, еритритолі та стевії.',
    expertGuide:
      'Вироби з цієї рубрики не містять рафінованого білого цукру — ідеально для тих, хто дотримується здорового харчування, кето або веган-раціону.',
  },
  {
    slug: 'solodoshchi-dlia-ditei',
    titleUk: 'Для дітей (Натуральні ласощі, шоколад на керобі, пастила, фігурки)',
    shortTitle: 'Для дітей',
    emoji: '🧸',
    seoH1: 'Крафтові солодощі та шоколад для дітей в Україні — CrafoHub',
    seoDescription:
      'Безпечні натуральні солодощі для дітей: дитячий шоколад на керобі без кофеїну, ягідна пастила без цукру, шоколадні фігурки, льодяники та дитячі святкові торти.',
    expertGuide:
      'Для дітей найкраще підходить шоколад на керобі (без кофеїну і білого цукру), натуральна фруктово-ягідна пастила, зефір на агар-агарі та фігурки зі справжнього бельгійського шоколаду.',
  },
  {
    slug: 'kraftovyi-zefir-ta-bukety',
    titleUk: 'Крафтовий зефір ручної роботи, зефірні букети та пастила',
    shortTitle: 'Зефір та зефірні букети',
    emoji: '🌸',
    seoH1: 'Крафтовий зефір, зефірні букети та пастила ручної роботи — CrafoHub',
    seoDescription:
      'Натуральний ягідно-фруктовий зефір на агар-агарі, розкішні букети з зефірних квітів (півонії, троянди, тюльпани), зефір у бельгійському шоколаді та пастила.',
    expertGuide:
      'Крафтовий зефір готується виключно зі свіжого ягідного та яблучного пюре на морському агар-агарі без консервантів і відправляється Новою Поштою по всій Україні.',
  },
  {
    slug: 'avtorski-torty-ta-deserty',
    titleUk: 'Авторські торти на замовлення, бенто-торти, макарони та десерти',
    shortTitle: 'Авторські торти і десерти',
    emoji: '🎂',
    seoH1: 'Авторські торти на замовлення та крафтові кондитерські України — CrafoHub',
    seoDescription:
      'Перевірені кондитерські ательє Харкова, Києва, Львова, Дніпра та Одеси: весільні, дитячі та корпоративні торти, мусові десерти, бенто-торти та макарони.',
    expertGuide:
      'Обирайте кондитерську у своєму місті за допомогою фільтра міста або скористайтеся Калькулятором Торта та Біржею Замовлень.',
  },
];

// ПОВНА ЕНЦИКЛОПЕДИЧНА БАЗА 42 РЕАЛЬНИХ ВИРОБНИКІВ УКРАЇНИ З ТОЧНИМИ КОНТАКТАМИ, ТЕЛЕФОНАМИ ТА АДРЕСАМИ
export const MAKERS: CraftMaker[] = [
  {
    "id": "crafo-kharkiv",
    "name": "Crafo — Майстерня крафтового шоколаду",
    "slug": "crafo-kharkiv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2018,
    "specialty": "Плитки шоколаду, авторські цукерки, букети з шоколадних квітів та подарункові набори з бельгійського Callebaut",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "shokoladni-kvity-ta-bukety",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "malyna-ta-polunytsia-v-shokoladi",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 5,
    "reviewsCount": 540,
    "cacaoOrigin": [
      "Бельгія (Barry Callebaut)"
    ],
    "description": "Преміальна майстерня крафтового шоколаду: виготовлення авторських плиток, корпусних та трюфельних цукерок, реалістичних букетів з шоколадних квітів та подарункових боксів зі 100% бельгійського шоколаду Barry Callebaut.",
    "websiteUrl": "https://crafo.com.ua/katalog",
    "categoryUrls": {
      "plytky-shokoladu": "https://crafo.com.ua/podarunky/mystetstvo-u-ploti",
      "korpusni-ta-rozmalovani-tsukerky": "https://crafo.com.ua/podarunky/sviato-bez-povodu",
      "shokoladni-kvity-ta-bukety": "https://crafo.com.ua/podarunky/buket-iakyi-ne-ziviane",
      "horikhy-ta-sukhofrukty-v-shokoladi": "https://crafo.com.ua/podarunky/vse-shcho-tobi-pobazhaiu",
      "malyna-ta-polunytsia-v-shokoladi": "https://crafo.com.ua/podarunky/rozmova-po-dushakh",
      "solodoshchi-dlia-ditei": "https://crafo.com.ua/podarunky/malenki-druzi"
    },
    "instagramHandle": "@craftchoco_kharkiv",
    "instagramUrl": "https://crafo.com.ua",
    "phone": "+38 (096) 253-56-10 (Viber, Telegram, WhatsApp)",
    "address": "м. Харків, вул. Лебединська, 1 (р-н стадіону «Металіст»)",
    "shippingNote": "Працюють щодня 09:00–20:00, доставка по Харкову та Новою Поштою по всій Україні",
    "badges": [
      "🏆 №1 Лідер категорії Шоколад",
      "Плитки + Цукерки + Квіти",
      "Callebaut 100%",
      "Свіжий Instagram та Сайт"
    ],
    "imageUrl": "/images/crafo-collage.jpg"
  },
  {
    "id": "sisters-a",
    "name": "Sisters A. Chocolate",
    "slug": "sisters-a-chocolate",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Луцьк",
    "regionCity": "Луцьк / Волинь",
    "foundedYear": 2018,
    "specialty": "Титулований моносортовий шоколад (витримка 72 год у меланжері) та гречаний шоколад",
    "categories": [
      "plytky-shokoladu",
      "bez-tsukru-ta-vegan"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.99,
    "reviewsCount": 342,
    "cacaoOrigin": [
      "Танзанія (Kokoa Kamili)",
      "Еквадор",
      "Перу",
      "Мадагаскар"
    ],
    "description": "Призери Academy of Chocolate Awards у Лондоні (засновниці — сестри Олена та Олександра). Перетирають ароматичні какао-боби Fino de Aroma у кам’яних меланжерах до 72 годин без лецитину й білого цукру.",
    "websiteUrl": "https://sisterschocolate.com",
    "instagramHandle": "@sisters.a.choco",
    "instagramUrl": "https://www.instagram.com/sisters.a.choco/",
    "phone": "+38 (050) 915-33-55",
    "email": "sisters.a.chocolate@gmail.com",
    "address": "м. Луцьк, Волинська обл.",
    "shippingNote": "Доставка Новою Поштою по всій Україні",
    "badges": [
      "Academy of Chocolate London",
      "Плитка шоколаду • Батончик 72 год",
      "Fino de Aroma"
    ],
    "imageUrl": "/images/sisters-a.jpg"
  },
  {
    "id": "piolli-zefir",
    "name": "Piolli — Студія зефірних квітів",
    "slug": "piolli-zefir-kyiv",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Ексклюзивні букети з зефірних квітів (півонії, троянди, гортензії, тюльпани) та подарункові капелюшні бокси",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.99,
    "reviewsCount": 275,
    "cacaoOrigin": [
      "Яблучне та ягідне пюре власного виробництва",
      "Агар-агар"
    ],
    "description": "Спеціалізована студія зефірної флористики в центрі Києва. Кожна квітка створюється вручну з натурального ягідно-фруктового зефіру з пониженим вмістом цукру.",
    "websiteUrl": "https://piolli.com.ua/shop/cat/zefirni-buketi-ta-koshiki",
    "categoryUrls": {
      "kraftovyi-zefir-ta-bukety": "https://piolli.com.ua/shop/cat/zefirni-buketi-ta-koshiki"
    },
    "phone": "+38 (093) 515-57-94",
    "address": "м. Київ, вул. Назарівська, 19",
    "shippingNote": "Доставка по Києву та відправка Новою Поштою по Україні",
    "badges": [
      "Зефірна флористика №1",
      "Ручна робота",
      "Натуральний склад"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "chebakery-kharkiv",
    "name": "CheBakery — Кондитерська Олени Чечендаєвої",
    "slug": "chebakery-kharkiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2016,
    "specialty": "Преміальні авторські торти на замовлення, весільні й дитячі торти, бенто-торти, макарони та еклери",
    "categories": [
      "avtorski-torty-ta-deserty",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.99,
    "reviewsCount": 430,
    "cacaoOrigin": [
      "Бельгійський Callebaut",
      "Французький Cacao Barry",
      "Натуральні вершки 33%"
    ],
    "description": "Провідна авторська кондитерська Харкова Олени Чечендаєвої: дизайнерські святкові, дитячі та весільні торти, бенто-торти, макарони та корпусні десерти з топових європейських інгредієнтів.",
    "websiteUrl": "https://chebakery.com.ua/cake-gallery",
    "categoryUrls": {
      "avtorski-torty-ta-deserty": "https://chebakery.com.ua/cake-gallery",
      "solodoshchi-dlia-ditei": "https://chebakery.com.ua/cake-gallery"
    },
    "phone": "+38 (050) 033-50-00, +38 (093) 207-20-00 (Telegram)",
    "address": "м. Харків",
    "shippingNote": "Дбайлива адресна доставка тортів по Харкову та самовивіз",
    "badges": [
      "Топ кондитерська Харкова",
      "Авторські торти",
      "Бельгійський шоколад"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "yandmi",
    "name": "YandMi",
    "slug": "yandmi-craft",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Житомир / Харків",
    "regionCity": "Харків",
    "foundedYear": 2019,
    "specialty": "Сімейна майстерня: боби Fino de Aroma, цільні горіхи, сухофрукти та малина в шоколаді",
    "categories": [
      "plytky-shokoladu",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "malyna-ta-polunytsia-v-shokoladi",
      "bez-tsukru-ta-vegan"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.98,
    "reviewsCount": 310,
    "cacaoOrigin": [
      "Колумбія (Fino de Aroma)",
      "Перу"
    ],
    "description": "Бренд почав історію у Харкові та відновив потужне виробництво у Житомирі. Працюють виключно з какао Fino de Aroma, цільними горіхами власного обсмаження, сухофруктами та бурбонською ваніллю.",
    "websiteUrl": "https://yandmi.com",
    "instagramHandle": "@yandmi_ua",
    "instagramUrl": "https://www.instagram.com/yandmi_ua/",
    "phone": "Онлайн-замовлення на yandmi.com та підтримка в Telegram (Пн–Пт 09:00–18:00)",
    "address": "м. Житомир (засновано в м. Харків)",
    "shippingNote": "Швидка доставка Новою Поштою по Україні",
    "badges": [
      "Fino de Aroma",
      "Горіхи та сухофрукти в шоколаді",
      "Плитка шоколаду • Батончик"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "ecojoy",
    "name": "Ecojoy — Майстерня шоколадних букетів",
    "slug": "ecojoy-chocolate-florist",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Ковель (Волинь) / Вся Україна",
    "regionCity": "Луцьк / Волинь",
    "foundedYear": 2019,
    "specialty": "Букети з шоколадних квітів (півонії, троянди, тюльпани) з бельгійського шоколаду Veliche",
    "categories": [
      "shokoladni-kvity-ta-bukety",
    ],
    "mainCategory": "shokoladni-kvity-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.98,
    "reviewsCount": 410,
    "cacaoOrigin": [
      "Бельгія (Veliche Gourmet & Callebaut)"
    ],
    "description": "Провідна українська майстерня шоколадної флористики. Створюють реалістичні букети з шоколадних півоній, троянд та тюльпанів зі справжнього бельгійського шоколаду Veliche.",
    "websiteUrl": "https://ecojoy.com.ua/ua/shokoladni-buketi/",
    "categoryUrls": {
      "shokoladni-kvity-ta-bukety": "https://ecojoy.com.ua/ua/shokoladni-buketi/",
    },
    "instagramHandle": "@ecojoy.ua",
    "instagramUrl": "https://www.instagram.com/ecojoy.ua/",
    "phone": "+38 (098) 645-49-86, +38 (067) 366-87-65",
    "email": "info@ecojoy.com.ua",
    "address": "Волинська обл., м. Ковель, вул. Незалежності, 168",
    "shippingNote": "09:00–18:00 без вихідних, ударостійке пакування для Нової Пошти",
    "badges": [
      "Бельгійський шоколад Veliche",
      "Шоколадні букети №1",
      "Гарантія цілісності НП"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "charivnyi-zefir",
    "name": "Майстерня «Чарівний Зефір»",
    "slug": "charivnyi-zefir-kyiv",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2018,
    "specialty": "Натуральний зефір ручної роботи, зефір у бельгійському шоколаді, зефірні букети та зефіро-сендвічі",
    "categories": [
      "kraftovyi-zefir-ta-bukety",
      "bez-tsukru-ta-vegan",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.98,
    "reviewsCount": 310,
    "cacaoOrigin": [
      "Натуральне фруктово-ягідне пюре",
      "Агар-агар",
      "Бельгійський Callebaut"
    ],
    "description": "Київська крафтова майстерня натурального зефіру без штучних барвників і консервантів: створюють ягідний зефір, зефір у бельгійському шоколаді, зефіро-сендвічі та квіткові зефірні букети.",
    "websiteUrl": "https://www.charivnyi-zefir.com",
    "phone": "+38 (066) 200-51-42",
    "address": "м. Київ, вул. Воскресенська, 14Б (ЖК «Паркові озера»)",
    "shippingNote": "Самовивіз у Києві, кур’єр та відправка Новою Поштою по Україні",
    "badges": [
      "100% натуральне пюре",
      "Зефір у шоколаді",
      "Зефірні букети"
    ],
    "instagramUrl": "https://www.instagram.com/charivnyi_zefir",
    "instagramHandle": "@charivnyi_zefir",
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "bakerstreet-kyiv",
    "name": "BAKERSTREET Bakery",
    "slug": "bakerstreet-kyiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2015,
    "specialty": "Преміальні дизайнерські торти на замовлення, мусові торти в шоколадному велюрі, макарони та зефір",
    "categories": [
      "avtorski-torty-ta-deserty",
      "kraftovyi-zefir-ta-bukety",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.98,
    "reviewsCount": 520,
    "cacaoOrigin": [
      "Бельгія (Callebaut)",
      "Франція"
    ],
    "description": "Одна з найбільших крафтових кондитерських студій Києва: створюють дизайнерські торти з фігурками з бельгійського шоколаду, бенто-торти, кенді-бари, зефір та макарони.",
    "websiteUrl": "https://bakerstreet.ua/catalog/torty",
    "categoryUrls": {
      "avtorski-torty-ta-deserty": "https://bakerstreet.ua/catalog/torty",
      "solodoshchi-dlia-ditei": "https://bakerstreet.ua/catalog/dityachi-torti",
      "kraftovyi-zefir-ta-bukety": "https://bakerstreet.ua/catalog/deserty"
    },
    "phone": "+38 (067) 409-72-77",
    "address": "м. Київ",
    "shippingNote": "Власна спеціалізована доставка у рефрижераторах по Києву та області",
    "badges": [
      "Преміум торти Києва",
      "Шоколадний велюр та фігурки",
      "Кенді-бари"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "chocoblues-odesa",
    "name": "Chocoblues — Майстерня авторського шоколаду",
    "slug": "chocoblues-odesa",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Цукерки ручної роботи, шоколатьє та авторські набори",
    "city": "Одеса / Вся Україна",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2018,
    "specialty": "Ексклюзивні авторські цукерки з художнім розписом, трюфелі, тематичні подарункові колекції та преміальні плитки",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 268,
    "cacaoOrigin": [
      "Преміальний бельгійський шоколад",
      "Французький кувертюр"
    ],
    "description": "Одеська майстерня елітного авторського шоколаду ручної роботи. Кожна цукерка створюється за авторською рецептурою з витонченим ручним художнім розписом, натуральними ганашами та праліне.",
    "websiteUrl": "https://chocoblues.com.ua/shop/",
    "categoryUrls": {
      "korpusni-ta-rozmalovani-tsukerky": "https://chocoblues.com.ua/shop/",
      "plytky-shokoladu": "https://chocoblues.com.ua/shop/"
    },
    "instagramHandle": "@ChocoBlues",
    "instagramUrl": "https://www.instagram.com/ChocoBlues",
    "phone": "+38 (073) 803-83-46",
    "address": "м. Одеса",
    "shippingNote": "Фірмове подарункове пакування, термобокси для літа, доставка Новою Поштою по всій Україні",
    "badges": [
      "Ручний розпис",
      "Бельгійський кувертюр",
      "Одеса",
      "Корпоративні набори"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "stranger",
    "name": "Stranger Craft Chocolate",
    "slug": "stranger-craft-chocolate",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Полтава / Київ",
    "regionCity": "Київ",
    "foundedYear": 2016,
    "specialty": "Майстерня теруарного моносортового шоколаду (підхід як у мікровиноробстві)",
    "categories": [
      "plytky-shokoladu"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 156,
    "cacaoOrigin": [
      "Уганда",
      "Індія (Ідуккі)",
      "Перу",
      "В’єтнам"
    ],
    "description": "Заснована у 2016 році Русланом та Тетяною майстерня теруарного моносортового шоколаду. Кожна плитка розкриває смаковий профіль конкретного регіону та врожаю какао-бобів.",
    "websiteUrl": "https://stranger.org.ua",
    "instagramHandle": "@stranger_chocolate",
    "instagramUrl": "https://www.instagram.com/stranger_chocolate/",
    "phone": "+38 (095) 670-12-07",
    "email": "info@stranger.org.ua",
    "address": "м. Полтава",
    "shippingNote": "Доставка Новою Поштою по Україні (Пн–Пт 10:00–18:00)",
    "badges": [
      "Теруарний шоколад",
      "З 2016 року",
      "Плитка шоколаду • Батончик"
    ],
    "imageUrl": "https://static.wixstatic.com/media/93c538_5923c9898ce74187900833e45b954574%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/93c538_5923c9898ce74187900833e45b954574%7Emv2.jpg"
  },
  {
    "id": "bogi-cacao",
    "name": "Bogi Cacao",
    "slug": "bogi-cacao",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Обухів / Київ",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Ремісничий шоколад і цукерки з преміальних какао-бобів Criollo без білого цукру",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "bez-tsukru-ta-vegan"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 215,
    "cacaoOrigin": [
      "Перу (Criollo)",
      "Еквадор"
    ],
    "description": "Виробник крафтового шоколаду та корисних цукерок у форматі крафтових плиток та батончиків з елітних какао-бобів Criollo без білого цукру та консервантів.",
    "websiteUrl": "https://bogicacao.com.ua",
    "instagramHandle": "@bogi.cacao",
    "instagramUrl": "https://www.instagram.com/bogi.cacao/",
    "phone": "+38 (096) 964-68-46, +38 (095) 794-96-06, +38 (068) 865-11-36",
    "email": "bogi.manager@gmail.com",
    "address": "Київська обл., м. Обухів, вул. Київська, 53",
    "shippingNote": "Без вихідних 09:00–21:00, доставка Новою Поштою",
    "badges": [
      "Боби Criollo",
      "Плитка шоколаду • Батончик",
      "Без цукру"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8d99bc0547b9.jpg"
  },
  {
    "id": "meetty",
    "name": "Meetty Chocolate",
    "slug": "meetty-chocolate",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Кременчук",
    "regionCity": "Полтава / Суми / Запоріжжя",
    "foundedYear": 2017,
    "specialty": "Крафтовий плитка шоколаду та батончик шоколад із локальними смаками (білі гриби, гречка, шовковиця, троянда)",
    "categories": [
      "plytky-shokoladu",
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 240,
    "cacaoOrigin": [
      "Венесуела",
      "Колумбія",
      "Еквадор"
    ],
    "description": "Лауреат міжнародної премії Academy of Chocolate Awards у Лондоні (срібло за шоколад із пелюстками троянди та виноградом). Повний цикл виробництва крафтова плитка шоколаду у Кременчуці.",
    "websiteUrl": "https://meettychocolate.com",
    "instagramHandle": "@meetty_chocolate",
    "instagramUrl": "https://www.instagram.com/meetty_chocolate/",
    "phone": "+38 (067) 139-79-30",
    "email": "meetty@meettychocolate.com",
    "address": "Полтавська обл., м. Кременчук",
    "shippingNote": "Доставка Новою Поштою по всій Україні",
    "badges": [
      "Призер Academy of Chocolate",
      "Локальні смаки України",
      "Плитка шоколаду • Батончик"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "candy-coupe-buffet",
    "name": "CandyBuffet / Candy Coupe",
    "slug": "candy-coupe",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2018,
    "specialty": "Дизайнерські корпусні цукерки з ручним художнім розписом, шоколадні квіти та подарункові бокси",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "shokoladni-kvity-ta-bukety",
      "plytky-shokoladu"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 230,
    "cacaoOrigin": [
      "Франція (Valrhona)",
      "Бельгія (Cacao Barry)"
    ],
    "description": "Київська шоколатерія ексклюзивних корпусних цукерок із ручним художнім розписом какао-маслом, шоколадних квіткових композицій та авторських начинок.",
    "websiteUrl": "https://candybuffet.kiev.ua",
    "instagramHandle": "@candybuffet_kyiv",
    "instagramUrl": "https://www.instagram.com/candybuffet_kyiv/",
    "phone": "+38 (068) 208-08-28",
    "address": "м. Київ, вул. Ованеса Туманяна, 15А",
    "shippingNote": "Самовивіз у Києві, кур’єр та доставка Новою Поштою",
    "badges": [
      "Ручний художній розпис",
      "Valrhona & Cacao Barry",
      "Київська шоколатерія"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "honey-zavertailo",
    "name": "HONEY & Zavertailo",
    "slug": "honey-zavertailo",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2014,
    "specialty": "Дика українська малина-матча-юзу в білому шоколаді, горіхові драже та авторські цукерки",
    "categories": [
      "malyna-ta-polunytsia-v-shokoladi",
      "korpusni-ta-rozmalovani-tsukerky",
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "malyna-ta-polunytsia-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 510,
    "cacaoOrigin": [
      "Франція (Valrhona)",
      "Бельгія"
    ],
    "description": "Знаменитий київський бренд високого кондитерського та шоколадного мистецтва. Творці культової «Дикої малини в білому шоколаді з матчею та юзу», горіхового драже та колекційних корпусних цукерок.",
    "websiteUrl": "https://honeykyiv.com",
    "instagramHandle": "@honey_cafe",
    "instagramUrl": "https://www.instagram.com/honey_cafe/",
    "phone": "+38 (067) 127-19-21",
    "address": "м. Київ, вул. Нижній Вал, 19-21 / вул. Ярославів Вал, 20",
    "shippingNote": "Доставка по Києву та відправка шоколадних серій Новою Поштою",
    "badges": [
      "Дика малина-матча",
      "Французький Valrhona",
      "Преміум сегмент"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "zefiroly-dnipro",
    "name": "Майстерня «ZefirOly»",
    "slug": "zefiroly-dnipro",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Дніпро",
    "regionCity": "Дніпро",
    "foundedYear": 2019,
    "specialty": "Крафтовий зефір і фруктово-ягідна пастила ручної роботи (зокрема лінійка без доданого цукру)",
    "categories": [
      "kraftovyi-zefir-ta-bukety",
      "bez-tsukru-ta-vegan",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 225,
    "cacaoOrigin": [
      "100% натуральні ягоди та фрукти",
      "Без цукру / Еритритол"
    ],
    "description": "Дніпровська крафтова майстерня натурального зефіру та пастили: понад 20 смаків ягідного зефіру, зефір без цукру для дітей та подарункові набори пастили.",
    "websiteUrl": "https://zefiroly.com",
    "phone": "+38 (050) 400-05-47",
    "address": "м. Дніпро",
    "shippingNote": "Відправка Новою Поштою по всій Україні",
    "badges": [
      "Зефір без цукру",
      "Натуральна пастила",
      "Для дітей та веганів"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "ginger-pastila-lviv",
    "name": "Крамничка «Джинджер» / Ginger",
    "slug": "ginger-pastila-lviv",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Львівська обл. (Новояворівськ)",
    "regionCity": "Львів",
    "foundedYear": 2018,
    "specialty": "Натуральна фруктово-ягідна пастила без цукру, фріпси, горішки з медом та корисні подарункові бокси",
    "categories": [
      "kraftovyi-zefir-ta-bukety",
      "bez-tsukru-ta-vegan",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 210,
    "cacaoOrigin": [
      "Карпатські ягоди та фрукти",
      "Мед",
      "Суперфуди"
    ],
    "description": "Крафтове виробництво на Львівщині: виготовляють понад 15 видів пастили без доданого цукру, барвників і консервантів, ідеальної для дітей.",
    "websiteUrl": "https://ginger.org.ua",
    "phone": "+38 (050) 239-43-49",
    "address": "Львівська обл., м. Новояворівськ",
    "shippingNote": "Відправка Новою Поштою та Укрпоштою по всій Україні",
    "badges": [
      "0% Цукру",
      "Ідеально дітям",
      "Львівський крафт"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "manzhosova-patisserie",
    "name": "Manzhosova Patisserie",
    "slug": "manzhosova-patisserie",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Авторські торти, французькі десерти, весільні торти, корпоративні замовлення",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 185,
    "cacaoOrigin": [
      "авторські торти",
      "французькі десерти",
      "весільні торти",
      "корпоративні замовлення"
    ],
    "description": "Французька кондитерська Євгенії Манжосової — авторські торти на замовлення в Києві та Україні. Вишукані десерти преміум-класу, розробка унікального дизайну під подію. Один із найвідоміших авторських брендів тортів в Україні.",
    "websiteUrl": "https://manzhosova.com",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "авторські торти",
      "французькі десерти",
      "весільні торти",
      "корпоративні замовлення"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "vatsak",
    "name": "Вацак (Vatsak)",
    "slug": "vatsak",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Луцьк, Волинська область",
    "regionCity": "Луцьк / Волинь",
    "foundedYear": 2020,
    "specialty": "Торти на замовлення, авторський дизайн, сертифікована якість",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 185,
    "cacaoOrigin": [
      "торти на замовлення",
      "авторський дизайн",
      "сертифікована якість"
    ],
    "description": "Торти на замовлення з міжнародними сертифікатами якості. Авторський дизайн, доставка по країні. Великий вибір тортів на будь-яку подію.",
    "websiteUrl": "https://vatsak.com.ua",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Луцьк, Волинська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти на замовлення",
      "авторський дизайн",
      "сертифікована якість"
    ],
    "imageUrl": "https://vatsak.com.ua/image/catalog/frame.jpg"
  },
  {
    "id": "stimul",
    "name": "Кондитерська фабрика Stimul",
    "slug": "stimul",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Зефір, зефір зі смаком лохини, грушевий зефір, авторські смаки",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 185,
    "cacaoOrigin": [
      "зефір",
      "зефір зі смаком лохини",
      "грушевий зефір",
      "авторські смаки"
    ],
    "description": "Виробництво натурального зефіру з авторськими смаками: зефір зі смаком лохини, грушевий, «Смак Перемоги», біло-рожевий, «Інь-Ян». Сучасні рецептури на базі класичної технології.",
    "websiteUrl": "https://stimulsweet.com",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "зефір",
      "зефір зі смаком лохини",
      "грушевий зефір",
      "авторські смаки"
    ],
    "imageUrl": "https://stimulsweet.com/wp-content/uploads/2019/03/AG3A8494o1-min.jpg"
  },
  {
    "id": "solodenko",
    "name": "ФОП Солоденько (Soloden.ko)",
    "slug": "solodenko",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Винники, Львівська область",
    "regionCity": "Львів",
    "foundedYear": 2020,
    "specialty": "Крафтовий зефір, ягідне пюре, фруктовий зефір, класична технологія",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.97,
    "reviewsCount": 185,
    "cacaoOrigin": [
      "крафтовий зефір",
      "ягідне пюре",
      "фруктовий зефір",
      "класична технологія"
    ],
    "description": "Преміальний крафтовий зефір класичної технології на основі фруктових та ягідних пюре власного виробництва. Лише з ягід та фруктів, топові інгредієнти. Елегантний та смачний — не проторний, з легкою кислинкою. Від кондитера Марії Солоденько.",
    "websiteUrl": "https://www.instagram.com/soloden.ko",
    "instagramHandle": "@soloden.ko",
    "instagramUrl": "https://www.instagram.com/soloden.ko",
    "phone": "Direct @soloden.ko",
    "address": "м. Винники, Львівська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "крафтовий зефір",
      "ягідне пюре",
      "фруктовий зефір",
      "класична технологія"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "myzo",
    "name": "MYZO Chocolate",
    "slug": "myzo-chocolate",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Луцький р-н (с. Зміїнець)",
    "regionCity": "Луцьк / Волинь",
    "foundedYear": 2021,
    "specialty": "Прямий імпорт какао-бобів з ферм Коста-Рики: темний, молочний та веганський на вівсяному молоці",
    "categories": [
      "plytky-shokoladu",
      "bez-tsukru-ta-vegan",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 184,
    "cacaoOrigin": [
      "Коста-Рика (регіон Матіна, Criollo & Trinitario)"
    ],
    "description": "Працюють напряму з родинною фермою в Коста-Риці. Роблять чистий темний (70%), молочний (48%) та веганський шоколад на вівсяному молоці з малиною, лавандою та ліщиною.",
    "websiteUrl": "https://myzo.com.ua",
    "instagramHandle": "@myzochocolate_ua",
    "instagramUrl": "https://www.instagram.com/myzochocolate_ua/",
    "phone": "Замовлення онлайн 24/7 через сайт myzo.com.ua та Direct",
    "address": "Волинська обл., Луцький р-н, с. Зміїнець (ТОВ \"Мізо Чоколейт\")",
    "shippingNote": "Відправка Новою Поштою щодня",
    "badges": [
      "Direct Trade Коста-Рика",
      "На вівсяному молоці",
      "Плитка шоколаду • Батончик"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d1091410c08e.jpg"
  },
  {
    "id": "wander",
    "name": "Wander Boutique (wander.boutique)",
    "slug": "wander-boutique",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Житомир / Київ",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Преміальна майстерня шоколаду, розмальованих корпусних цукерок та горіхового драже",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu",
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 310,
    "cacaoOrigin": [
      "Бельгія",
      "Франція"
    ],
    "description": "Бутік ексклюзивного шоколаду та корпусних цукерок ручної роботи з яскравим візуальним стилем (виробництво у Житомирі та фірмовий бутік у ТРЦ Gulliver, Київ).",
    "websiteUrl": "https://wander.boutique",
    "instagramHandle": "@wander.chocolate",
    "instagramUrl": "https://www.instagram.com/wander.chocolate/",
    "phone": "+38 (096) 395-18-38, +38 (098) 675-19-87, +38 (097) 395-47-90",
    "email": "wander.chocolate.boutique@gmail.com",
    "address": "м. Житомир / м. Київ, пл. Спортивна, 1А (ТРЦ Gulliver)",
    "shippingNote": "Доставка по Києву, Житомиру та Новою Поштою по Україні",
    "badges": [
      "Преміум бутік",
      "Дизайнерські цукерки",
      "Ручна робота"
    ],
    "imageUrl": "https://wander.boutique/image/catalog/logo.webp"
  },
  {
    "id": "cheese-sweets",
    "name": "Cheese Sweets Олега Соловйова",
    "slug": "cheese-sweets",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Дніпро",
    "regionCity": "Дніпро",
    "foundedYear": 2019,
    "specialty": "Унікальні цукерки ручної роботи з елітними сирами (дорблю, пармезан, брі, козячий сир)",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 276,
    "cacaoOrigin": [
      "Бельгія",
      "Італія"
    ],
    "description": "Крафтовий проєкт Олега Соловйова у Дніпрі: цукерки ручної роботи, що поєднують понад 20 видів справжніх витриманих сирів (дорблю, пармезан, брі, чеддер) з бельгійським шоколадом.",
    "websiteUrl": "https://cheesesweets.com.ua",
    "instagramHandle": "@cheesesweets",
    "instagramUrl": "https://www.instagram.com/cheesesweets/",
    "phone": "+38 (073) 717-00-37",
    "email": "oleh.soloviov.cheesesweets@gmail.com",
    "address": "м. Дніпро, смт Слобожанське",
    "shippingNote": "Відправка в термопакуванні Новою Поштою по Україні",
    "badges": [
      "20+ видів сиру",
      "Ідеально до вина",
      "Авторський крафт"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1575372587186-50020fa3a815?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "shoco-lviv",
    "name": "SHOco. Chocolaterie",
    "slug": "shoco-lviv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Львів",
    "regionCity": "Львів",
    "foundedYear": 2017,
    "specialty": "Авторські колекції корпусних цукерок, горіхове драже у тубусах та плитки без цукру",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "bez-tsukru-ta-vegan"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 380,
    "cacaoOrigin": [
      "Франція (Cacao Barry)",
      "Бельгія (Callebaut)"
    ],
    "description": "Сучасна львівська школа шоколатьє: створюють дизайнерські набори корпусних цукерок, горіхи в карамельному шоколаді та лінійки без цукру.",
    "websiteUrl": "https://shoco.ua",
    "instagramHandle": "@shoco.lviv",
    "instagramUrl": "https://www.instagram.com/shoco.lviv/",
    "phone": "+38 (050) 431-50-50",
    "address": "м. Львів, вул. Сахарова, 44 / вул. Курбаса, 3",
    "shippingNote": "Доставка шоколадних наборів та драже Новою Поштою по Україні",
    "badges": [
      "Львівське шоколатьє",
      "Дизайнерські тубуси",
      "Cacao Barry"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "shtefanyo",
    "name": "Chocolaterie Valentin & Valentina Shtefanyo",
    "slug": "shtefanyo-uzhhorod",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Ужгород",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2010,
    "specialty": "Закарпатські авторські цукерки, грильяж, макарони та шоколадні витвори ручної роботи",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu",
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 420,
    "cacaoOrigin": [
      "Франція",
      "Бельгія"
    ],
    "description": "Знаменитий кондитерський дім шоколатьє міжнародного рівня Валентина Штефаньо в Ужгороді. Візитівка Закарпаття з унікальними горіхово-шоколадними рецептурами.",
    "websiteUrl": "https://www.instagram.com/shtefanyo_valentin/",
    "instagramHandle": "@shtefanyo_valentin",
    "instagramUrl": "https://www.instagram.com/shtefanyo_valentin/",
    "phone": "+38 (050) 905-60-86",
    "address": "м. Ужгород, вул. Духновича, 16 / наб. Незалежності, 8",
    "shippingNote": "Відправка подарункових наборів з Ужгорода Новою Поштою",
    "badges": [
      "Легенда Закарпаття",
      "Шоколатьє міжнародного класу",
      "Авторські цукерки"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "leopol",
    "name": "Leopol' (Львів)",
    "slug": "leopol-chocolate",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Львів",
    "regionCity": "Львів",
    "foundedYear": 2018,
    "specialty": "Дитячий та крафтовий шоколад, пасти й батончики на основі какао-бобів та обсмаженого керобу",
    "categories": [
      "bez-tsukru-ta-vegan",
      "plytky-shokoladu",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 175,
    "cacaoOrigin": [
      "Іспанський кероб",
      "Перу (Какао-боби)"
    ],
    "description": "Львівський крафтовий бренд. Виготовляють ремісничий шоколад без цукру (зокрема дитячі лінійки на основі керобу без кофеїну та теоброміну), горіхові пасти та цукерки.",
    "websiteUrl": "https://www.instagram.com/leopol_chocolate/",
    "instagramHandle": "@leopol_chocolate",
    "instagramUrl": "https://www.instagram.com/leopol_chocolate/",
    "phone": "Замовлення через @leopol_chocolate та Лавку Традицій",
    "address": "м. Львів",
    "shippingNote": "Доставка Новою Поштою зі Львова по Україні",
    "badges": [
      "На основі керобу",
      "Ідеально для дітей",
      "Львівський крафт"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/41b6e3095bc6.jpg"
  },
  {
    "id": "healthy-choice",
    "name": "Healthy Choice",
    "slug": "healthy-choice-ukraine",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Одеса",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2019,
    "specialty": "Преміальний корисний шоколад плитка шоколаду та батончик з бобів Criollo на кокосовому нектарі та горіхові пасти",
    "categories": [
      "bez-tsukru-ta-vegan",
      "plytky-shokoladu",
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 210,
    "cacaoOrigin": [
      "Перу Organic (Criollo)",
      "Еквадор"
    ],
    "description": "Одеська компанія, що виробляє преміальний крафтовий шоколад повного циклу (крафтова плитка шоколаду) із какао-бобів Кріолло на кокосовому нектарі без рафінованого цукру.",
    "websiteUrl": "https://healthychoice.ua",
    "instagramHandle": "@healthy_choice.ua",
    "instagramUrl": "https://www.instagram.com/healthy_choice.ua/",
    "phone": "+38 (066) 289-96-54, +38 (099) 474-48-81",
    "email": "order@healthychoice.ua",
    "address": "м. Одеса, вул. Новосельського, 100",
    "shippingNote": "Доставка Новою Поштою по всій Україні",
    "badges": [
      "Плитка шоколаду • Батончик Одеса",
      "Какао Criollo",
      "Кокосовий цукор"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1ff763f593b2.jpg"
  },
  {
    "id": "chocobox-kyiv",
    "name": "Chocobox",
    "slug": "chocobox-kyiv",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Свіжа полуниця в бельгійському шоколаді Callebaut, шоколадні букети та подарункові бокси",
    "categories": [
      "malyna-ta-polunytsia-v-shokoladi",
      "shokoladni-kvity-ta-bukety",
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "malyna-ta-polunytsia-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 320,
    "cacaoOrigin": [
      "Бельгія (Callebaut Milk, White, Ruby)"
    ],
    "description": "Преміальна київська майстерня полуниці в бельгійському шоколаді ручної роботи, ягідних букетів та шоколадних подарункових наборів.",
    "websiteUrl": "https://chocobox.com.ua",
    "phone": "+38 (099) 074-33-90",
    "address": "м. Київ, вул. Приозерна, 8-А (м. Оболонь)",
    "shippingNote": "Кур’єрська доставка по Києву та відправка наборів по Україні",
    "badges": [
      "Полуниця в шоколаді",
      "Бельгійський Callebaut",
      "Букети та бокси"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "maslotom",
    "name": "ТОМ / MasloTOM",
    "slug": "maslotom-chocolate",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Вінниця",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2015,
    "specialty": "Цільна сублімована малина та полуниця в молочному й темному шоколаді, горіхові пасти",
    "categories": [
      "malyna-ta-polunytsia-v-shokoladi",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "bez-tsukru-ta-vegan",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "malyna-ta-polunytsia-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 640,
    "cacaoOrigin": [
      "Бельгія"
    ],
    "description": "Відомий вінницький виробник, який випускає цільну сублімовану малину та полуницю в справжньому шоколаді у баночках і тубусах, а також горіхові пасти.",
    "websiteUrl": "https://maslotom.com",
    "instagramHandle": "@maslotom",
    "instagramUrl": "https://www.instagram.com/maslotom/",
    "phone": "+38 (067) 430-15-15 (Підтримка на maslotom.com)",
    "address": "м. Вінниця",
    "shippingNote": "Швидка відправка Новою Поштою по всій Україні",
    "badges": [
      "Малина в шоколаді",
      "Вінницьке виробництво",
      "Хіт продажів"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "cukorka-volyn",
    "name": "ТМ «Цукорка» / Волинські солодощі",
    "slug": "cukorka-volyn",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Луцьк (с. Полонка)",
    "regionCity": "Луцьк / Волинь",
    "foundedYear": 2012,
    "specialty": "Цукерки ручної роботи з сухофруктів (чорнослив, курага, інжир, диня) з горіхами в шоколаді, грильяж",
    "categories": [
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "korpusni-ta-rozmalovani-tsukerky",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 340,
    "cacaoOrigin": [
      "Європа",
      "Україна"
    ],
    "description": "Відомий волинський виробник цукерок ручної роботи з відбірних сухофруктів (чорнослив, курага, фінік, інжир, персик) з волоським горіхом і фундуком у шоколаді.",
    "websiteUrl": "https://cukorka.com.ua",
    "phone": "+38 (095) 116-33-55, +38 (098) 116-33-55 (Viber)",
    "email": "intermag@cukorka.com.ua",
    "address": "Волинська обл., Луцький р-н, с. Полонка, вул. Перемоги, 21А",
    "shippingNote": "Власна фабрика на Волині, доставка Новою Поштою по всій Україні",
    "badges": [
      "Волинські солодощі",
      "Сухофрукти з горіхом у шоколаді",
      "Власне виробництво"
    ],
    "instagramUrl": "https://www.instagram.com/volyn_sweets",
    "instagramHandle": "@volyn_sweets",
    "imageUrl": "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "glam-zefyr",
    "name": "Glam_Zefyr",
    "slug": "glam-zefyr-ukraine",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Київ / Вся Україна",
    "regionCity": "Київ",
    "foundedYear": 2017,
    "specialty": "Крафтовий зефір ручної роботи, великі зефірні букети, пташине молоко та горішки зі згущеним молоком",
    "categories": [
      "kraftovyi-zefir-ta-bukety",
      "avtorski-torty-ta-deserty",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 340,
    "cacaoOrigin": [
      "Натуральне ягідне пюре",
      "Агар-агар",
      "Бельгійський шоколад"
    ],
    "description": "Популярна кондитерська майстерня зефіру ручної роботи та зефірних букетів із точкою видачі в Києві та щоденною відправкою по Україні.",
    "websiteUrl": "https://zefir.com.ua",
    "phone": "+38 (095) 167-53-81",
    "email": "zakaz@zefir.com.ua",
    "address": "м. Київ, вул. Олександра Архипенка, 1/12",
    "shippingNote": "Пн–Нд 08:00–22:00, доставка по Києву та Новою Поштою",
    "badges": [
      "Зефірні букети",
      "Пташине молоко",
      "Доставка по Україні"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "artzefir-ua",
    "name": "ARTZEFIR — Майстерня зефірних квітів",
    "slug": "artzefir-ukraine",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Кропивницький / Україна",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2019,
    "specialty": "Дизайнерські зефірні букети та бокси ручної роботи з натурального фруктового пюре та агар-агару",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 185,
    "cacaoOrigin": [
      "Фруктово-ягідне пюре",
      "Агар-агар"
    ],
    "description": "Авторська майстерня зефірних квітів та подарункових композицій з доставкою Новою Поштою по всій Україні.",
    "websiteUrl": "https://artzefir.com",
    "phone": "+38 (066) 168-60-47 (Viber / Telegram)",
    "address": "м. Кропивницький (відправка по всій Україні)",
    "shippingNote": "Надійне пакування для доставки Новою Поштою",
    "badges": [
      "Зефірна флористика",
      "Ручна робота",
      "Натуральне пюре"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "tortiya-kharkiv",
    "name": "Кондитерська «ТортиЯ»",
    "slug": "tortiya-kharkiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2014,
    "specialty": "Святкові, дитячі, весільні та корпоративні торти на замовлення, бенто-торти та тістечка в Харкові",
    "categories": [
      "avtorski-torty-ta-deserty",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 380,
    "cacaoOrigin": [
      "Бельгія",
      "Натуральне вершкове масло та ягоди"
    ],
    "description": "Харківська кондитерська-пекарня з власною студією декору: виготовляють авторські торти будь-якої складності, шоколадний велюр, фігурки ручної роботи та кенді-бари.",
    "websiteUrl": "https://torti.kh.ua",
    "phone": "+38 (095) 148-40-08, +38 (068) 148-40-08, +38 (099) 273-60-34",
    "address": "м. Харків, вул. Полтавський Шлях, 148/2",
    "shippingNote": "Самовивіз та кур’єрська доставка по Харкову",
    "badges": [
      "Харківська кондитерська",
      "Весільні та дитячі торти",
      "Кенді-бар"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "mamulin-tortyk-kyiv",
    "name": "Студія «Мамулін Тортик»",
    "slug": "mamulin-tortyk-kyiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2016,
    "specialty": "Домашні авторські торти з натуральних інгредієнтів, бенто-торти, крафтовий зефір та пряники",
    "categories": [
      "avtorski-torty-ta-deserty",
      "kraftovyi-zefir-ta-bukety",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 310,
    "cacaoOrigin": [
      "Бельгійський шоколад",
      "Фермерські вершки"
    ],
    "description": "Київська кондитерська студія натуральних дитячих, весільних і корпоративних тортів, бенто-тортів та домашнього зефіру на агар-агарі.",
    "websiteUrl": "https://mamatort.com.ua",
    "phone": "+38 (067) 407-93-83, +38 (066) 392-55-27 (Viber)",
    "address": "м. Київ",
    "shippingNote": "Доставка по Києву та самовивіз",
    "badges": [
      "Дитячі та весільні торти",
      "Натуральний склад",
      "Торти + Зефір"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "torts-ua-dnipro",
    "name": "Кондитерське ательє «TORTS.UA»",
    "slug": "torts-ua-dnipro",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Дніпро",
    "regionCity": "Дніпро",
    "foundedYear": 2017,
    "specialty": "Авторські мусові та бісквітні торти, бенто-торти, шоколадні десерти та макарони",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.96,
    "reviewsCount": 410,
    "cacaoOrigin": [
      "Бельгія",
      "Франція"
    ],
    "description": "Провідний дніпровський виробник сучасних десертів, бенто-тортів та святкових тортів на замовлення з фірмовими кондитерськими у Дніпрі.",
    "websiteUrl": "https://torts.ua",
    "phone": "+38 (067) 630-45-00 (Замовлення на torts.ua)",
    "address": "м. Дніпро, просп. Науки / вул. Незалежності / пр. Б. Хмельницького",
    "shippingNote": "Фірмові магазини та доставка по м. Дніпро",
    "badges": [
      "Бенто-торти та мусові торти",
      "Мережа у Дніпрі",
      "Свіжі десерти"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "spell",
    "name": "Spell Chocolate",
    "slug": "spell-chocolate",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2016,
    "specialty": "Найбільший крафтовий бренд України: плитки з солоною карамеллю і сиром, трюфелі, драже",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 890,
    "cacaoOrigin": [
      "Бельгійський кувертюр Callebaut",
      "Колумбія"
    ],
    "description": "Провідний український виробник авторського шоколаду, цукерок ручної роботи, солоної карамелі та корпоративних подарункових боксів.",
    "websiteUrl": "https://spellchocolate.com/our-productions/plitki-shokoladu/",
    "categoryUrls": {
      "plytky-shokoladu": "https://spellchocolate.com/our-productions/plitki-shokoladu/",
      "korpusni-ta-rozmalovani-tsukerky": "https://spellchocolate.com/our-productions/seti-cukerok/",
      "horikhy-ta-sukhofrukty-v-shokoladi": "https://spellchocolate.com/our-productions/plitki-shokoladu/z-gorihami",
      "malyna-ta-polunytsia-v-shokoladi": "https://spellchocolate.com/our-productions/plitki-shokoladu/bars-with-berries"
    },
    "instagramHandle": "@spellchocolate",
    "instagramUrl": "https://www.instagram.com/spellchocolate/",
    "phone": "0 800 319 233, +38 (073) 049-02-95, +38 (096) 520-60-99",
    "email": "office@spellchocolate.com",
    "address": "м. Київ",
    "shippingNote": "Безкоштовна гаряча лінія, доставка по всій Україні",
    "badges": [
      "Лідер ринку",
      "Солона карамель",
      "Бельгійський кувертюр"
    ],
    "imageUrl": "https://spellchocolate.com/image/cache/catalog/logo702x364-144x144.png"
  },
  {
    "id": "laviva",
    "name": "LAVIVA Chocolate",
    "slug": "laviva-chocolate",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київська обл. (П. Борщагівка)",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Авторські шоколадні плитки, дубайський шоколад з катаїфі, міні-плитки без цукру з гречаним чаєм та цукерки",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "bez-tsukru-ta-vegan"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 265,
    "cacaoOrigin": [
      "Бельгія",
      "Колумбія"
    ],
    "description": "Відомий український виробник крафтових шоколадних виробів: авторські плитки, дубайський шоколад із фісташковою пастою, лінійки без цукру з гречаним чаєм та подарункові набори.",
    "websiteUrl": "https://laviva.com.ua",
    "instagramHandle": "@laviva.chocolate",
    "instagramUrl": "https://laviva.com.ua",
    "phone": "+38 (097) 966-69-66, +38 (096) 118-85-84",
    "email": "laviva.ukr@gmail.com",
    "address": "Київська обл., Бучанський р-н, с. Петропавлівська Борщагівка, пров. Софіївський, 14",
    "shippingNote": "Власне виробництво під Києвом, відправка Новою Поштою щодня",
    "badges": [
      "Дубайський шоколад",
      "Серія з гречаним чаєм",
      "Власна мануфактура"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "nptruffles",
    "name": "NPtruffles",
    "slug": "nptruffles-ukraine",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ / Україна",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Крафтові сирні та фруктові трюфелі ручної роботи з бельгійського шоколаду (рокфор, пармезан, манго)",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 142,
    "cacaoOrigin": [
      "Бельгія (Callebaut)"
    ],
    "description": "Майстерня авторських крафтових трюфелів із бельгійського шоколаду з додаванням французьких та італійських витриманих сирів, ягідних пюре та спецій.",
    "websiteUrl": "https://www.nptruffles.in.ua",
    "phone": "+38 (096) 537-49-49",
    "address": "Україна (доставка Новою Поштою з виробництва)",
    "shippingNote": "Індивідуальний відлив під замовлення, термопакування",
    "badges": [
      "Сирні трюфелі",
      "Ручна робота",
      "Бельгійський шоколад"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "nomer-doma",
    "name": "Номер Дому",
    "slug": "nomer-doma",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2016,
    "specialty": "Перша українська майстерня американського фаджу (м’яких шоколадних цукерок) та авторських плиток",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 260,
    "cacaoOrigin": [
      "Бельгія",
      "Колумбія"
    ],
    "description": "Крафтова кондитерська Марічки Тимошенко (з 2016 року), що спеціалізується на американському вершково-шоколадному фаджі та авторському шоколаді з блакитним сиром, ягодами та горіхами.",
    "websiteUrl": "https://nomerdomu.com.ua",
    "instagramHandle": "@nomerdomu",
    "instagramUrl": "https://www.instagram.com/nomerdomu/",
    "phone": "+38 (073) 470-31-62",
    "email": "order@nomerdomu.com.ua",
    "address": "м. Київ",
    "shippingNote": "Відправка Новою Поштою по всій Україні",
    "badges": [
      "Американський Фадж №1",
      "З 2016 року",
      "Авторські смаки"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1575372587186-50020fa3a815?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "una-luna",
    "name": "Una Luna / Пригощайся",
    "slug": "una-luna",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Гоща (Рівненська обл.) / Київ",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Крафтові трюфелі Una Luna та сухофрукти в італійському шоколаді з горіховими й лікерними ганашами",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 395,
    "cacaoOrigin": [
      "Італія",
      "Бельгія"
    ],
    "description": "Преміальна крафтова лінійка цукерок ручної роботи Una Luna та сухофруктів у шоколаді від відомої мануфактури «Пригощайся» у Гощі.",
    "websiteUrl": "https://gzpt.com.ua",
    "instagramHandle": "@prygoshchaysya",
    "instagramUrl": "https://www.instagram.com/prygoshchaysya/",
    "phone": "+38 (073) 200-37-57",
    "address": "Рівненська обл., смт Гоща, вул. Рівненська, 19 (та фірмові магазини в Києві й Рівному)",
    "shippingNote": "Доставка Новою Поштою по всій Україні",
    "badges": [
      "Італійський шоколад",
      "Сухофрукти та трюфелі",
      "Власна фабрика"
    ],
    "imageUrl": "https://gzpt.com.ua/content/images/2/1500x1500l90nn0/56398136928817.jpg"
  },
  {
    "id": "vilni",
    "name": "Вільні / Vilni",
    "slug": "vilni-sweets",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Крафтовий шоколад, трюфелі та цукерки без білого цукру, лактози та глютену",
    "categories": [
      "bez-tsukru-ta-vegan",
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 180,
    "cacaoOrigin": [
      "Перу",
      "Колумбія"
    ],
    "description": "Український крафтовий виробник корисних солодощів: шоколад, трюфелі та цукерки на основі натурального какао-масла, меду й активованих горіхів без білого цукру, лактози та глютену.",
    "websiteUrl": "https://www.instagram.com/v.i.l.n.i/",
    "instagramHandle": "@v.i.l.n.i",
    "instagramUrl": "https://www.instagram.com/v.i.l.n.i/",
    "phone": "Замовлення у Direct @v.i.l.n.i та мережі Лавка Традицій",
    "address": "м. Київ",
    "shippingNote": "Доставка Новою Поштою по Україні",
    "badges": [
      "Без білого цукру",
      "Без лактози та глютену",
      "Активовані горіхи"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "zhuzhu-shop",
    "name": "ЖуЖу Shop",
    "slug": "zhuzhu-shop",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Ніжин (Чернігівська обл.)",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2018,
    "specialty": "Сімейна майстерня натурального шоколаду, цукерок і паст на власному меду без білого цукру",
    "categories": [
      "bez-tsukru-ta-vegan",
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 148,
    "cacaoOrigin": [
      "Венесуела",
      "Колумбія"
    ],
    "description": "Сімейне виробництво натуральних солодощів із Ніжина: авторський шоколад на меду, цукерки та горіхові пасти без додавання рафінованого цукру.",
    "websiteUrl": "https://djujushop.com.ua",
    "instagramHandle": "@djujushop",
    "instagramUrl": "https://www.instagram.com/djujushop/",
    "phone": "+38 (093) 722-93-09, +38 (096) 256-19-14",
    "email": "djujushop@gmail.com",
    "address": "Чернігівська обл., м. Ніжин, вул. Шевченка, 64",
    "shippingNote": "Відправка Новою Поштою та Укрпоштою по всій Україні",
    "badges": [
      "Шоколад на меду",
      "Сімейне виробництво",
      "0% Рафінованого цукру"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "frutado",
    "name": "FRUTADO",
    "slug": "frutado-ukraine",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Набори свіжої полуниці та ягід у чорному, молочному й білому шоколаді з горіхами",
    "categories": [
      "malyna-ta-polunytsia-v-shokoladi",
      "shokoladni-kvity-ta-bukety"
    ],
    "mainCategory": "malyna-ta-polunytsia-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 190,
    "cacaoOrigin": [
      "Бельгія (Callebaut)"
    ],
    "description": "Студія подарункових боксів свіжої полуниці в шоколаді з сублімованою малиною, фісташкою та кокосом.",
    "websiteUrl": "https://frutado.com.ua",
    "phone": "+38 (096) 26-11-770, +38 (066) 51-99-911",
    "address": "м. Київ",
    "shippingNote": "Швидка кур’єрська доставка у термобоксах",
    "badges": [
      "Бокси полуниці в шоколаді",
      "Ручна робота",
      "Свіжа ягода"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "panfruit",
    "name": "Panfruit Ukraine",
    "slug": "panfruit-ukraine",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Власне сублімування ягід: цільна малина, полуниця, вишня та лохина в бельгійському шоколаді",
    "categories": [
      "malyna-ta-polunytsia-v-shokoladi",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "malyna-ta-polunytsia-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 230,
    "cacaoOrigin": [
      "Бельгія (Callebaut)"
    ],
    "description": "Український виробник сублімованих ягід і фруктів повного циклу: покривають добірну цільну малину та полуницю бельгійським білим, молочним та темним шоколадом.",
    "websiteUrl": "https://panfruit.ua",
    "instagramHandle": "@panfruit.ua",
    "instagramUrl": "https://www.instagram.com/panfruit.ua/",
    "phone": "+38 (097) 900-50-40 (Замовлення на panfruit.ua)",
    "address": "м. Київ",
    "shippingNote": "Зберігається до 6 місяців, відправка Новою Поштою щодня",
    "badges": [
      "Власна сублімація ягід",
      "Малина та полуниця в шоколаді",
      "Callebaut"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "golden-fruit-zakarpattia",
    "name": "Golden Fruit — Закарпатські сухофрукти в шоколаді",
    "slug": "golden-fruit-bushtyno",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Буштино (Закарпатська обл.)",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2015,
    "specialty": "Карпатський чорнослив, курага та горіхи в шоколаді ручної роботи без консервантів",
    "categories": [
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 150,
    "cacaoOrigin": [
      "Італія",
      "Європа"
    ],
    "description": "Закарпатське крафтове виробництво цукерок із екологічно чистого чорносливу з волоським горіхом у шоколаді.",
    "websiteUrl": "https://goldenfruit.ub.ua",
    "phone": "+38 (068) 974-92-94, +38 (050) 679-88-58",
    "address": "Закарпатська обл., Тячівський р-н, смт Буштино, вул. Торгова, 3",
    "shippingNote": "Пряма відправка із Закарпаття Новою Поштою",
    "badges": [
      "Еко-продукт Закарпаття",
      "Чорнослив з горіхом",
      "Ручна робота"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "eclat-yumberry",
    "name": "Eclat Atelier & Yumberryum",
    "slug": "eclat-yumberryum",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Королівські фініки в шоколаді з фісташкою і пеканом, апельсини в шоколаді та медіанти",
    "categories": [
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "malyna-ta-polunytsia-v-shokoladi"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 190,
    "cacaoOrigin": [
      "Бельгія (Callebaut & Cacao Barry)"
    ],
    "description": "Крафтові майстерні, що спеціалізуються на королівських фініках у бельгійському шоколаді з горіховими пастами та карамелізованих цитрусах у шоколаді.",
    "websiteUrl": "https://www.instagram.com/eclatatelier.ua/",
    "instagramHandle": "@eclatatelier.ua / @yumberryum",
    "instagramUrl": "https://www.instagram.com/yumberryum/",
    "phone": "Замовлення через Instagram Direct @eclatatelier.ua та @yumberryum",
    "address": "м. Київ",
    "shippingNote": "Доставка Новою Поштою по Україні та кур’єром по Києву",
    "badges": [
      "Фініки в шоколаді",
      "Бельгійський Callebaut",
      "Подарункові бокси"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "syndykat-smaku-kharkiv",
    "name": "Майстерня тортів «Синдикат Смаку»",
    "slug": "syndykat-smaku-kharkiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2015,
    "specialty": "Авторські торти з шоколадним декором, термінове виготовлення тортів, капкейки та трайфли",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.95,
    "reviewsCount": 290,
    "cacaoOrigin": [
      "Бельгійський кувертюр",
      "Натуральні начинки"
    ],
    "description": "Майстерня ексклюзивних тортів у Харкові: понад 18 авторських шоколадних, ягідних і карамельних начинок, прийом термінових замовлень та власна доставка.",
    "websiteUrl": "https://tortsvkus.com.ua",
    "phone": "+38 (067) 575-25-80",
    "address": "м. Харків",
    "shippingNote": "Адресна доставка по Харкову та області",
    "badges": [
      "18+ авторських начинок",
      "Термінові замовлення",
      "Шоколадний декор"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "sweets-kharkiv",
    "name": "SWEETS | Солодощі & Подарунки",
    "slug": "sweets-net-ua-kharkiv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та подарункові набори",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2017,
    "specialty": "Оригінальні шоколадні подарункові набори, цукерки, драже та авторські солодкі бокси",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.94,
    "reviewsCount": 290,
    "cacaoOrigin": [
      "Бельгія",
      "Європа"
    ],
    "description": "Харківська студія та магазин оригінальних шоколадних і солодких подарунків у ТРЦ «Французький бульвар». Формують ексклюзивні подарункові бокси, шоколадні набори, цукерки та горіхове драже з доставкою по всій Україні.",
    "websiteUrl": "https://sweets.net.ua/ua/g83328965-shokolad-ruchnoj-raboty",
    "categoryUrls": {
      "korpusni-ta-rozmalovani-tsukerky": "https://sweets.net.ua/ua/g17002299-shokoladnye-nabory",
      "plytky-shokoladu": "https://sweets.net.ua/ua/g83328965-shokolad-ruchnoj-raboty",
      "horikhy-ta-sukhofrukty-v-shokoladi": "https://sweets.net.ua/ua/g86589895-orehi-suhofrukty-shokolade",
      "solodoshchi-dlia-ditei": "https://sweets.net.ua/ua/g17002072-vkusnaya-pomosch"
    },
    "instagramHandle": "@sweets_kharkiv",
    "instagramUrl": "https://sweets.net.ua",
    "phone": "+38 (093) 370-00-00",
    "address": "м. Харків, вул. Академіка Павлова, 44Б (ТРЦ «Французький бульвар»)",
    "shippingNote": "Самовивіз у Харкові та щоденна відправка Новою Поштою по Україні",
    "badges": [
      "Подарункові бокси Харків",
      "ТРЦ Французький бульвар",
      "Доставка по Україні"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "limar-kharkiv",
    "name": "Limar Chocolate",
    "slug": "limar-chocolate",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2018,
    "specialty": "Ремісничий шоколад плитка шоколаду та батончик із бобів Criollo з локальними інгредієнтами та горіхами",
    "categories": [
      "plytky-shokoladu",
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.94,
    "reviewsCount": 138,
    "cacaoOrigin": [
      "Перу (Criollo)",
      "Еквадор",
      "Венесуела"
    ],
    "description": "Харківська майстерня ремісничого шоколаду з елітних какао-бобів Criollo з додаванням маку, шовковиці, кави та цільних горіхів.",
    "websiteUrl": "https://www.instagram.com/limar_chocolate/",
    "instagramHandle": "@limar_chocolate",
    "instagramUrl": "https://www.instagram.com/limar_chocolate/",
    "phone": "+38 (096) 926-07-77",
    "address": "м. Харків",
    "shippingNote": "Відправка з Харкова Новою Поштою",
    "badges": [
      "Плитка шоколаду • Батончик Харків",
      "Боби Criollo",
      "Натуральний склад"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "igors-craft",
    "name": "Igor's Craft Chocolate",
    "slug": "igors-craft-chocolate",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Крафтовий шоколад із бобів Criollo з шафраном, чорною сіллю та кунжутною тахіні",
    "categories": [
      "plytky-shokoladu"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.94,
    "reviewsCount": 118,
    "cacaoOrigin": [
      "Перу (Criollo)",
      "Венесуела"
    ],
    "description": "Авторське виробництво шоколаду з рідкісних какао-бобів Criollo з гастрономічними додатками: шафраном, чорною вулканічною сіллю, тахіні та фісташкою.",
    "websiteUrl": "https://www.instagram.com/igors_craft_chocolate/",
    "instagramHandle": "@igors_craft_chocolate",
    "instagramUrl": "https://www.instagram.com/igors_craft_chocolate/",
    "phone": "Замовлення через Instagram Direct та партнерські мережі Києва",
    "address": "м. Київ",
    "shippingNote": "Доставка Новою Поштою по Україні",
    "badges": [
      "Боби Criollo",
      "З шафраном та тахіні",
      "Плитка шоколаду • Батончик"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f2d09fb58802.jpg"
  },
  {
    "id": "choconel-lutsk",
    "name": "Choconel / Чоконель",
    "slug": "choconel-lutsk",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Луцьк",
    "regionCity": "Луцьк / Волинь",
    "foundedYear": 2017,
    "specialty": "Майстерня авторських шоколадних плиток, фігурок та подарункових наборів",
    "categories": [
      "plytky-shokoladu",
      "shokoladni-kvity-ta-bukety",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.94,
    "reviewsCount": 175,
    "cacaoOrigin": [
      "Бельгія"
    ],
    "description": "Волинська ательє-майстерня крафтового шоколаду в центрі Луцька: авторські шоколадні плитки, фігурний шоколад та святкові подарункові бокси.",
    "websiteUrl": "https://choconel.com.ua",
    "phone": "+38 (067) 332-27-08",
    "email": "choconel.atelier@gmail.com",
    "address": "м. Луцьк, вул. Винниченка, 23",
    "shippingNote": "Фірмова крамниця у Луцьку та доставка Новою Поштою",
    "badges": [
      "Луцьке шоколадне ательє",
      "Плитки та шоколадні набори",
      "Ручна робота"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "berry-bar-zt",
    "name": "Berry Bar",
    "slug": "berry-bar-zhytomyr",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Житомир",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2019,
    "specialty": "Крафтові шоколадні плитки з ягодами, корпусні цукерки ручної роботи та корпоративні набори",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "malyna-ta-polunytsia-v-shokoladi"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.94,
    "reviewsCount": 165,
    "cacaoOrigin": [
      "Бельгія (Callebaut)"
    ],
    "description": "Житомирська майстерня крафтових шоколадних плиток із сублімованими ягодами й горіхами, цукерок ручної роботи та подарункових боксів.",
    "websiteUrl": "https://berrybar.com.ua",
    "phone": "+38 (063) 847-33-85",
    "email": "berrybarzt@gmail.com",
    "address": "м. Житомир",
    "shippingNote": "Доставка Новою Поштою по всій Україні",
    "badges": [
      "Ягідні шоколадні плитки",
      "Подарункові набори",
      "Ручна робота"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b9f707e9c518.jpg"
  },
  {
    "id": "fruitlife",
    "name": "FruitLife",
    "slug": "fruitlife-ukraine",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Київ / Харків / Одеса",
    "regionCity": "Харків",
    "foundedYear": 2016,
    "specialty": "Букети з полуниці в бельгійському та італійському шоколаді, фрукти в шоколаді",
    "categories": [
      "malyna-ta-polunytsia-v-shokoladi",
      "shokoladni-kvity-ta-bukety"
    ],
    "mainCategory": "malyna-ta-polunytsia-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.94,
    "reviewsCount": 275,
    "cacaoOrigin": [
      "Бельгія",
      "Італія"
    ],
    "description": "Всеукраїнський сервіс подарункових боксів та букетів зі свіжої полуниці й фруктів у справжньому шоколаді з представництвами в Києві, Харкові та Одесі.",
    "websiteUrl": "https://fruitlife.com.ua",
    "phone": "+38 (066) 635-01-01",
    "address": "м. Київ / м. Харків / м. Одеса",
    "shippingNote": "Доставка день-у-день у Києві, Харкові та Одесі",
    "badges": [
      "Полуниця в шоколаді",
      "Київ • Харків • Одеса",
      "Ягідні букети"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "choconut-lviv",
    "name": "КФ «Шоконат» / Choconut",
    "slug": "choconut-lviv",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Львів",
    "regionCity": "Львів",
    "foundedYear": 2015,
    "specialty": "Львівське виробництво горіхів, мигдалю, фундука та сухофруктів у шоколаді, подарункові набори",
    "categories": [
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.94,
    "reviewsCount": 210,
    "cacaoOrigin": [
      "Бельгія",
      "Італія"
    ],
    "description": "Львівська кондитерська фабрика «Шоконат», що спеціалізується на міксах благородних горіхів (мигдаль, фундук, кеш’ю) та фруктів у справжньому шоколаді.",
    "websiteUrl": "https://choconut.com.ua",
    "phone": "+38 (095) 689-44-62 (Viber)",
    "email": "choconut.ua@gmail.com",
    "address": "м. Львів, вул. Гайдучка, 5",
    "shippingNote": "Доставка зі Львова по всій Україні (роздріб та опт)",
    "badges": [
      "Львівська фабрика",
      "Горіхи в шоколаді",
      "Подарункові серії"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "shoude-kharkiv",
    "name": "SHOUD'E / Кондитерська фабрика «Солодкий Світ»",
    "slug": "shoude-sweetworld-kharkiv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2007,
    "specialty": "Шоколадна майстерня: крафтові плитки з ягодами, цукерки ручної роботи, фігурний шоколад, горіхи в шоколаді",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "malyna-ta-polunytsia-v-shokoladi",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.93,
    "reviewsCount": 540,
    "cacaoOrigin": [
      "Бельгія (Barry Callebaut)"
    ],
    "description": "Відомий харківський виробник натурального шоколаду ручної роботи без пальмової олії. Мають власне виробництво та фірмові шоколадні майстерні у центрі Харкова.",
    "websiteUrl": "https://sweetworld.com.ua",
    "instagramHandle": "@shoude.ua",
    "instagramUrl": "https://sweetworld.com.ua",
    "phone": "+38 (050) 325-09-62, +38 (050) 300-31-44, +38 (050) 401-01-53",
    "email": "info@sladkiymir.com.ua",
    "address": "м. Харків, вул. Ясенева, 6 (виробництво) / вул. Сумська, 45 / вул. Кооперативна, 6/8",
    "shippingNote": "Фірмові магазини у Харкові та доставка по всій Україні",
    "badges": [
      "Харківська фабрика",
      "Стандарт ISO 22000",
      "Плитки та цукерки"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "aimant",
    "name": "Aimant",
    "slug": "aimant-chocolate",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Авторський бельгійський шоколад, конструктор шоколадних плиток та подарункові набори",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "malyna-ta-polunytsia-v-shokoladi"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.93,
    "reviewsCount": 215,
    "cacaoOrigin": [
      "Бельгія (Callebaut)"
    ],
    "description": "Популярний український бренд авторського шоколаду з широкою лінійкою смаків, ягід у шоколаді та онлайн-конструктором персоналізованих шоколадних подарунків.",
    "websiteUrl": "https://www.aimant.ua",
    "instagramHandle": "@aimant.ua",
    "instagramUrl": "https://www.instagram.com/aimant.ua/",
    "phone": "+38 (093) 620-07-03 (Telegram), +38 (099) 375-15-50 (Viber)",
    "address": "м. Київ",
    "shippingNote": "Доставка по Києву та Новою Поштою по всій Україні",
    "badges": [
      "Бельгійський шоколад",
      "Конструктор плиток",
      "Учасник Всі.Свої"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1f1d8f30e86c.png"
  },
  {
    "id": "afrodiziak",
    "name": "Afrodiziak Chocolate",
    "slug": "afrodiziak-chocolate",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Полтава",
    "regionCity": "Полтава / Суми / Запоріжжя",
    "foundedYear": 2020,
    "specialty": "Майстерня натурального шоколаду та цукерок без білого цукру зі спеціями та ягодами",
    "categories": [
      "bez-tsukru-ta-vegan",
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.93,
    "reviewsCount": 112,
    "cacaoOrigin": [
      "Колумбія",
      "Перу"
    ],
    "description": "Полтавська майстерня натурального авторського шоколаду та цукерок без використання білого цукру та лактози.",
    "websiteUrl": "https://afrodiziak-chocolate.com.ua",
    "instagramHandle": "@afrodiziak.chocolate",
    "instagramUrl": "https://www.instagram.com/afrodiziak.chocolate/",
    "phone": "+38 (066) 377-02-34",
    "address": "м. Полтава",
    "shippingNote": "Доставка Новою Поштою по всій Україні",
    "badges": [
      "Без білого цукру",
      "Натуральні спеції",
      "Ручна робота"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6c93b7831bee.jpg"
  },
  {
    "id": "chocolady",
    "name": "ChocoLady",
    "slug": "chocolady-ukraine",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Одеса",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2018,
    "specialty": "Шоколадні квіти, подарункові букети з троянд, фігурні шоколадні набори та плитки",
    "categories": [
      "shokoladni-kvity-ta-bukety",
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "shokoladni-kvity-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.93,
    "reviewsCount": 290,
    "cacaoOrigin": [
      "Бельгія",
      "Італія"
    ],
    "description": "Одеська майстерня та інтернет-магазин шоколадних букетів, квіткових композицій із шоколадних троянд та подарункових фігурних наборів.",
    "websiteUrl": "https://www.chocolady.com.ua",
    "phone": "+38 (063) 028-23-54, +38 (050) 051-65-49",
    "email": "odessa@chocolady.com.ua",
    "address": "м. Одеса, вул. Преображенська, 2",
    "shippingNote": "Доставка Новою Поштою по всій Україні (10:00–18:00)",
    "badges": [
      "Шоколадні троянди й букети",
      "Подарункові бокси",
      "Доставка по Україні"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1575372587186-50020fa3a815?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "asal-ukraine",
    "name": "ТМ «ASAL»",
    "slug": "asal-sweets-ukraine",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Дніпро / Україна",
    "regionCity": "Дніпро",
    "foundedYear": 2016,
    "specialty": "Цукерки з сухофруктів, чорнослив, курага, фінік та диня з фундуком і волоським горіхом у шоколаді",
    "categories": [
      "horikhy-ta-sukhofrukty-v-shokoladi"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.93,
    "reviewsCount": 195,
    "cacaoOrigin": [
      "Європа"
    ],
    "description": "Український виробник натуральних фруктово-горіхових цукерок у шоколаді без консервантів.",
    "websiteUrl": "https://asal.com.ua",
    "phone": "+38 (095) 635-96-73 (роздріб), +38 (093) 225-79-90 (опт)",
    "address": "Україна (відправка зі складу виробника)",
    "shippingNote": "Роздріб та гуртові поставки Новою Поштою",
    "badges": [
      "Фрукти з горіхом у шоколаді",
      "Від виробника",
      "Роздріб та Опт"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "khorek-kharkiv",
    "name": "KHorek Chocolate",
    "slug": "khorek-chocolate-kharkiv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2019,
    "specialty": "Крафтовий шоколад, міні-шоколадки, подарункові набори та цукерки ручної роботи",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 125,
    "cacaoOrigin": [
      "Бельгія"
    ],
    "description": "Харківська майстерня крафтового шоколаду та подарункових наборів ручної роботи на Олексіївці.",
    "websiteUrl": "https://khorekchocolate.com.ua",
    "phone": "+38 (050) 927-14-07",
    "address": "м. Харків, вул. Ахсарова, 1В",
    "shippingNote": "Доставка по Харкову та Україні Новою Поштою",
    "badges": [
      "Харківський крафт",
      "Подарункові набори",
      "Ручна робота"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/87ba3c95fee4.jpg"
  },
  {
    "id": "cacao-chocolates",
    "name": "Cacao & Chocolates",
    "slug": "cacao-chocolates-ua",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Інтернет-майстерня авторських цукерок, праліне та шоколаду ручної роботи",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 130,
    "cacaoOrigin": [
      "Бельгія",
      "Франція"
    ],
    "description": "Виробництво свіжих авторських цукерок ручної роботи, праліне, трюфелів та плиткового шоколаду з доставкою по Україні.",
    "websiteUrl": "https://cacao-chocolates.com.ua",
    "phone": "+38 (063) 423-06-10 (Viber / Telegram)",
    "email": "cacao.chocolate.ua@gmail.com",
    "address": "м. Київ",
    "shippingNote": "Доставка Новою Поштою по Україні",
    "badges": [
      "Авторське праліне",
      "Свіжий відлив",
      "Ручна робота"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "lviv-workshop",
    "name": "Львівська майстерня шоколаду",
    "slug": "lviv-chocolate-workshop",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Львів / Київ / Харків / Одеса / Дніпро",
    "regionCity": "Харків",
    "foundedYear": 2009,
    "specialty": "Піонери ручної роботи в Україні: понад 60 видів трюфелів, праліне, тафель та фігурок",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "plytky-shokoladu",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 1450,
    "cacaoOrigin": [
      "Бельгія",
      "Гана",
      "Еквадор"
    ],
    "description": "Найбільша мережа шоколаду ручної роботи в Україні. Понад 60 видів цукерок з марципаном, праліне та горіхами.",
    "websiteUrl": "https://www.chocolate.lviv.ua",
    "instagramHandle": "@lvivhandmadechocolate",
    "instagramUrl": "https://www.instagram.com/lvivhandmadechocolate/",
    "phone": "0 800 50 8338, +38 (050) 372-98-97",
    "email": "e-shop@chocolate.lviv.ua",
    "address": "м. Львів, вул. Сербська, 3 (та 30+ майстерень по Україні)",
    "shippingNote": "Доставка Новою Поштою та самовивіз у міських майстернях",
    "badges": [
      "З 2009 року",
      "60+ видів цукерок",
      "Всеукраїнська мережа"
    ],
    "imageUrl": "https://www.chocolate.lviv.ua/images/logo.png"
  },
  {
    "id": "yaro-sunfill",
    "name": "Sunfill & YARO",
    "slug": "yaro-sunfill",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Київ",
    "regionCity": "Київ",
    "foundedYear": 2017,
    "specialty": "Виробники корисних солодощів, raw-шоколаду на керобі та цукерок без цукру і глютену",
    "categories": [
      "bez-tsukru-ta-vegan",
      "korpusni-ta-rozmalovani-tsukerky",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 490,
    "cacaoOrigin": [
      "Перу Organic",
      "Кероб"
    ],
    "description": "Відомі українські бренди корисних plant-based солодощів: виготовляють raw-шоколад на керобі, горіхово-фруктові цукерки в шоколаді та батончики без білого цукру й глютену.",
    "websiteUrl": "https://sunfill.ua",
    "instagramHandle": "@sunfill.ua / @yaro.ua",
    "instagramUrl": "https://www.instagram.com/yaro.ua/",
    "phone": "+38 (093) 779-96-51, +38 (093) 731-99-01, +38 (093) 041-94-48",
    "email": "sunfill.info@gmail.com",
    "address": "м. Київ",
    "shippingNote": "Доставка по всій Україні",
    "badges": [
      "100% Plant-Based",
      "Raw шоколад і цукерки",
      "Без цукру і глютену"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "amelia-dnipro",
    "name": "ТМ «Amelia»",
    "slug": "amelia-sweet-dnipro",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Дніпро",
    "regionCity": "Дніпро",
    "foundedYear": 2014,
    "specialty": "Виробник цукерок «Чорнослив та курага з горіхом у шоколаді», грильяжних та фруктових цукерок",
    "categories": [
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 185,
    "cacaoOrigin": [
      "Європа"
    ],
    "description": "Дніпровська кондитерська мануфактура, що виготовляє натуральні цукерки з сухофруктів і горіхів у шоколаді.",
    "websiteUrl": "https://ameliasweet.com.ua",
    "phone": "Замовлення через сайт ameliasweet.com.ua",
    "email": "info@ameliasweet.com.ua",
    "address": "м. Дніпро, вул. Новомосковська, 1",
    "shippingNote": "Відправка з Дніпра по всій Україні",
    "badges": [
      "Чорнослив у шоколаді",
      "Виробництво Дніпро",
      "Натуральні сухофрукти"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "craftchocolate-ua",
    "name": "Craft Chocolate",
    "slug": "craftchocolate-com-ua",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ / Україна",
    "regionCity": "Київ",
    "foundedYear": 2019,
    "specialty": "Майстерня натурального шоколаду ручної роботи: трюфелі, плитки, горіхи й сухофрукти в шоколаді",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky",
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "bez-tsukru-ta-vegan"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 145,
    "cacaoOrigin": [
      "Бельгія",
      "Колумбія"
    ],
    "description": "Інтернет-майстерня крафтового шоколаду ручної роботи малими партіями: трюфелі, авторські плитки, горіхи в шоколаді та веганська лінійка без пальмової олії.",
    "websiteUrl": "https://www.craftchocolate.com.ua",
    "phone": "Замовлення через кошик на сайті craftchocolate.com.ua",
    "address": "Україна (доставка Новою Поштою)",
    "shippingNote": "Відправка по всій Україні",
    "badges": [
      "Малі крафтові партії",
      "Без пальмової олії",
      "Трюфелі та плитки"
    ],
    "imageUrl": "https://static.wixstatic.com/media/93c538_5923c9898ce74187900833e45b954574%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/93c538_5923c9898ce74187900833e45b954574%7Emv2.jpg",
    "instagramUrl": "https://www.instagram.com/stranger_craft_chocolate",
    "instagramHandle": "@stranger_craft_chocolate"
  },
  {
    "id": "cupcake-studio",
    "name": "Cupcake Studio",
    "slug": "cupcake-studio",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Торти, капкейки, макаруни, арт-дизайн",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти",
      "капкейки",
      "макаруни",
      "арт-дизайн"
    ],
    "description": "Арт-кондитерська власного виробництва. Виготовляють на замовлення торти, капкейки та макаруни. Власне виробництво, доставка по Києву та регіону.",
    "websiteUrl": "https://cupcake.com.ua",
    "phone": "+380 (44) 333 65 25",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти",
      "капкейки",
      "макаруни",
      "арт-дизайн"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/162e98273516.jpeg"
  },
  {
    "id": "sweet-chef",
    "name": "Sweet Chef",
    "slug": "sweet-chef",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Торти на замовлення, доставка по Києву, святкові торти",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти на замовлення",
      "доставка по Києву",
      "святкові торти"
    ],
    "description": "Торти на замовлення з доставкою по Києву. Приймають замовлення за 24–72 години. Знаходяться в районі Позняки. Великий вибір дизайнів та начинок на будь-яку подію.",
    "websiteUrl": "https://sweetchef.com.ua",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти на замовлення",
      "доставка по Києву",
      "святкові торти"
    ],
    "imageUrl": "https://sweetchef.com.ua/image/catalog/icon.png"
  },
  {
    "id": "bellissimo-khm",
    "name": "Bellissimo Art Cake (Хмельницький)",
    "slug": "bellissimo-khm",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Хмельницький, Хмельницька область",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2020,
    "specialty": "Торти на замовлення, складні торти, Хмельницький",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти на замовлення",
      "складні торти",
      "Хмельницький"
    ],
    "description": "Торти на замовлення у Хмельницькому від сміливого кондитера Софії Рожко. Складні торти на «ти». Вул. Петра Болбочана 3/1, Дубово. Телефон 0967185725.",
    "websiteUrl": "https://www.instagram.com/bellissimo_art_cake",
    "instagramHandle": "@bellissimo_art_cake",
    "instagramUrl": "https://www.instagram.com/bellissimo_art_cake",
    "phone": "+380 96 718 5725",
    "address": "м. Хмельницький, Хмельницька область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти на замовлення",
      "складні торти",
      "Хмельницький"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/71b3ebd84c6e.jpg"
  },
  {
    "id": "cacaogold",
    "name": "CacaoGold",
    "slug": "cacaogold",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Темний шоколад 73%, какао з Африки, натуральний склад",
    "categories": [
      "plytky-shokoladu"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "темний шоколад 73%",
      "какао з Африки",
      "натуральний склад"
    ],
    "description": "Крафтовий чорний шоколад 73% з какао-бобів Західної Африки. Склад: какао терте, какао масло, цукор. Свіжообсмажені боби, без замінників. Високий вміст какао-продуктів.",
    "websiteUrl": "https://cacaogold.com.ua",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "темний шоколад 73%",
      "какао з Африки",
      "натуральний склад"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0af2f0bd04e7.jpg"
  },
  {
    "id": "choco-confetto",
    "name": "Choco Confetto (Юля)",
    "slug": "choco-confetto",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Шоколад ручної роботи, бельгійський шоколад, натуральні солодощі",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколад ручної роботи",
      "бельгійський шоколад",
      "натуральні солодощі"
    ],
    "description": "Шоколад ручної роботи від Юлі. Натуральні солодощі, які приносять незабутню насолоду і користь. Найкращий бельгійський шоколад. Замовлення через Директ та Viber.",
    "websiteUrl": "https://www.instagram.com/choco_confetto",
    "instagramHandle": "@choco_confetto",
    "instagramUrl": "https://www.instagram.com/choco_confetto",
    "phone": "+380 63 763 9422",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколад ручної роботи",
      "бельгійський шоколад",
      "натуральні солодощі"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ad811ba53108.png"
  },
  {
    "id": "choco-hit-khm",
    "name": "Choco Hit (Хмельницький)",
    "slug": "choco-hit-khm",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Хмельницький, Хмельницька область",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2020,
    "specialty": "Шоколад з написом, індивідуальний дизайн, бельгійський, без цукру, Хмельницький",
    "categories": [
      "bez-tsukru-ta-vegan"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколад з написом",
      "індивідуальний дизайн",
      "бельгійський",
      "без цукру"
    ],
    "description": "Шоколад ручної роботи з написом у Хмельницькому. Індивідуальний дизайн. Бельгійський шоколад або крафтовий без цукру — на вибір. Телефон 0983311258.",
    "websiteUrl": "https://www.instagram.com/choco.hit",
    "instagramHandle": "@choco.hit",
    "instagramUrl": "https://www.instagram.com/choco.hit",
    "phone": "+380 98 331 1258",
    "address": "м. Хмельницький, Хмельницька область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколад з написом",
      "індивідуальний дизайн",
      "бельгійський",
      "без цукру"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ad811ba53108.png"
  },
  {
    "id": "choco-milars-kharkiv",
    "name": "Choco Milars (Харків)",
    "slug": "choco-milars-kharkiv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Харків, Харківська область",
    "regionCity": "Харків",
    "foundedYear": 2020,
    "specialty": "Італійська шоколадна глазур, фігурки, торти, Харків",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "avtorski-torty-ta-deserty",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "італійська шоколадна глазур",
      "фігурки",
      "торти",
      "Харків"
    ],
    "description": "Світ насолоди від Наталі — торти, квіти, фігурки з італійської шоколадної глазурі. Харків, відправка Новою Поштою. Авторський декор та скульптури з шоколаду.",
    "websiteUrl": "https://www.instagram.com/choco_milars",
    "instagramHandle": "@choco_milars",
    "instagramUrl": "https://www.instagram.com/choco_milars",
    "phone": "+380 99 194 8262",
    "address": "м. Харків, Харківська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "італійська шоколадна глазур",
      "фігурки",
      "торти",
      "Харків"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5b241c2d4077.png"
  },
  {
    "id": "chocolado-rivne",
    "name": "Chocolado (Рівне)",
    "slug": "chocolado-rivne",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Рівне, Рівненська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Шоколадні вироби, ручна робота, Рівне, доставка НП",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколадні вироби",
      "ручна робота",
      "Рівне",
      "доставка НП"
    ],
    "description": "Магазин-майстерня CHOCOLADO у Рівному (вул. Відінська, 33). Шоколадні вироби та шоколад ручної роботи. Доставка Новою Поштою. Графік: Пн-Пт 10:00-18:00, Сб-Нд 10:00-17:00.",
    "websiteUrl": "https://www.instagram.com/chocolado_lyuda_poberezhna",
    "instagramHandle": "@chocolado_lyuda_poberezhna",
    "instagramUrl": "https://www.instagram.com/chocolado_lyuda_poberezhna",
    "phone": "+380 96 882 4520",
    "address": "м. Рівне, Рівненська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколадні вироби",
      "ручна робота",
      "Рівне",
      "доставка НП"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/05d8c9db8dee.jpeg"
  },
  {
    "id": "desserty-mo-khm",
    "name": "Desserty Mo (Хмельницький)",
    "slug": "desserty-mo-khm",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Хмельницький, Хмельницька область",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2020,
    "specialty": "Торти, десерти, Хмельницький",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти",
      "десерти",
      "Хмельницький"
    ],
    "description": "Тортики та весь солодкий світ у Хмельницькому від Юлі. Торти, десерти на замовлення. Телефон 097 118 06 39 для замовлень.",
    "websiteUrl": "https://www.instagram.com/desserty_mo",
    "instagramHandle": "@desserty_mo",
    "instagramUrl": "https://www.instagram.com/desserty_mo",
    "phone": "+380 97 118 0639",
    "address": "м. Хмельницький, Хмельницька область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти",
      "десерти",
      "Хмельницький"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/59e738102588.jpg"
  },
  {
    "id": "fino-chocolate-bar",
    "name": "FINO Chocolate Bar",
    "slug": "fino-chocolate-bar",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Львів, Львівська область",
    "regionCity": "Львів",
    "foundedYear": 2020,
    "specialty": "плитка шоколаду та батончик, кав'ярня третьої хвилі, власне виробництво, Львів",
    "categories": [
      "plytky-shokoladu"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "bean-to-bar",
      "кав'ярня третьої хвилі",
      "власне виробництво",
      "Львів"
    ],
    "description": "Кав'ярня третьої хвилі з власним виробництвом крафтова плитка шоколаду шоколаду за склом. Графік 8:00-21:00. Унікальне поєднання кави та крафтового шоколаду власного виробництва.",
    "websiteUrl": "https://www.instagram.com/fino.chocolate.bar",
    "instagramHandle": "@fino.chocolate.bar",
    "instagramUrl": "https://www.instagram.com/fino.chocolate.bar",
    "phone": "+380 68 845 2808",
    "address": "м. Львів, Львівська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "Плитка шоколаду • Батончик",
      "кав'ярня третьої хвилі",
      "власне виробництво",
      "Львів"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/013ac826c6c9.jpeg"
  },
  {
    "id": "grand-konditer-cherkasy",
    "name": "Grand Konditer (Черкаси)",
    "slug": "grand-konditer-cherkasy",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Черкаси, Черкаська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Торти, капкейки, трайфли, співпраця з кав'ярнями, Черкаси",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти",
      "капкейки",
      "трайфли",
      "співпраця з кав'ярнями"
    ],
    "description": "Торти, капкейки та трайфли у Черкасах. Задоволення в кожному шматочку. Готова до співпраці з кав'ярнями. Телефон 0986642506 для замовлень.",
    "websiteUrl": "https://www.instagram.com/grand_konditer",
    "instagramHandle": "@grand_konditer",
    "instagramUrl": "https://www.instagram.com/grand_konditer",
    "phone": "+380 98 664 2506",
    "address": "м. Черкаси, Черкаська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти",
      "капкейки",
      "трайфли",
      "співпраця з кав'ярнями"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e84d1feaad76.png"
  },
  {
    "id": "irina-solodkamriya-khm",
    "name": "Irina Solodkamriya (Хмельницький)",
    "slug": "irina-solodkamriya-khm",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Хмельницький, Хмельницька область",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2020,
    "specialty": "Домашня випічка, солодощі, Хмельницький",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "домашня випічка",
      "солодощі",
      "Хмельницький"
    ],
    "description": "Домашня випічка та солодощі у Хмельницькому від Ірини Шевчук. Зроблю життя солодким. Телефон 0976304978. Домашні солодощі ручної роботи.",
    "websiteUrl": "https://www.instagram.com/irina_solodkamriya",
    "instagramHandle": "@irina_solodkamriya",
    "instagramUrl": "https://www.instagram.com/irina_solodkamriya",
    "phone": "+380 97 630 4978",
    "address": "м. Хмельницький, Хмельницька область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "домашня випічка",
      "солодощі",
      "Хмельницький"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "its-craft",
    "name": "It's Craft (Це Крафт)",
    "slug": "its-craft",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Львів, Львівська область",
    "regionCity": "Львів",
    "foundedYear": 2020,
    "specialty": "Крафтовий шоколад, цукерки, кураторські добірки, подарунки",
    "categories": [
      "plytky-shokoladu",
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "крафтовий шоколад",
      "цукерки",
      "кураторські добірки",
      "подарунки"
    ],
    "description": "Інтернет-магазин крафтових смаколиків, що об'єднує крафтовий шоколад з різних куточків України — Львів, Закарпаття та інші регіони. Кураторська добірка найкращих крафтових брендів: білий, темний, молочний шоколад з авторськими смаками.",
    "websiteUrl": "https://itscraft.com.ua",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Львів, Львівська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "крафтовий шоколад",
      "цукерки",
      "кураторські добірки",
      "подарунки"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a6740517a0d7.webp"
  },
  {
    "id": "kombinat-bakery",
    "name": "Kombinat Bakery",
    "slug": "kombinat-bakery",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Торти, десерти, святкові замовлення, корпоративні торти",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти",
      "десерти",
      "святкові замовлення",
      "корпоративні торти"
    ],
    "description": "Багатий вибір тортів та десертів на будь-який смак та для будь-якої події. Особливість пропозиції — саме торти різноманітних форматів і дизайнів. Замовлення кондитерських виробів у Києві.",
    "websiteUrl": "https://kmbnt.com.ua",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти",
      "десерти",
      "святкові замовлення",
      "корпоративні торти"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ed942b0e49bd.jpg"
  },
  {
    "id": "le-zefir-cherkasy",
    "name": "Le Zefir (Черкаси)",
    "slug": "le-zefir-cherkasy",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Черкаси, Черкаська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Зефірні квіти, букети, Черкаси",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "зефірні квіти",
      "букети",
      "Черкаси"
    ],
    "description": "Зефірні квіти та букети у Черкасах. Створюю квіти для особливих моментів. Доставка, замовлення через Direct або Viber 0973264623.",
    "websiteUrl": "https://www.instagram.com/le_zefir_che",
    "instagramHandle": "@le_zefir_che",
    "instagramUrl": "https://www.instagram.com/le_zefir_che",
    "phone": "+380 97 326 4623",
    "address": "м. Черкаси, Черкаська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "зефірні квіти",
      "букети",
      "Черкаси"
    ],
    "imageUrl": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/dfd9ed74502d.jpg"
  },
  {
    "id": "marshmallow-com-ua",
    "name": "Marshmallow.com.ua",
    "slug": "marshmallow-com-ua",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Маршмелоу, натуральні солодощі, подарункові набори, корпоративні замовлення",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "маршмелоу",
      "натуральні солодощі",
      "подарункові набори",
      "корпоративні замовлення"
    ],
    "description": "Власне виробництво натуральних солодощів: маршмелоу, десерти та кава. Корпоративні замовлення, подарункові набори. Кав'ярня в Києві щодня з 9:00 до 21:00.",
    "websiteUrl": "https://marshmallow.com.ua",
    "instagramHandle": "@marshmallow.com.ua",
    "instagramUrl": "https://www.instagram.com/marshmallow.com.ua",
    "phone": "Direct @marshmallow.com.ua",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "маршмелоу",
      "натуральні солодощі",
      "подарункові набори",
      "корпоративні замовлення"
    ],
    "imageUrl": "https://marshmallow.com.ua/image/cache/catalog/marshmallow_logo_new-300x300.png"
  },
  {
    "id": "millennium-chocolate",
    "name": "Millennium Chocolate",
    "slug": "millennium-chocolate",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Дніпро, Дніпропетровська область",
    "regionCity": "Дніпро",
    "foundedYear": 2020,
    "specialty": "Крафтові цукерки, подарункові набори, персональні набори",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "крафтові цукерки",
      "подарункові набори",
      "персональні набори"
    ],
    "description": "Дніпровська кондитерська майстерня з понад 25-річною історією. Крафтова колекція цукерок — ручна робота, добірні інгредієнти, персональні набори. Онлайн-магазин з доставкою.",
    "websiteUrl": "https://millennium-chocolate.com",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Дніпро, Дніпропетровська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "крафтові цукерки",
      "подарункові набори",
      "персональні набори"
    ],
    "imageUrl": "http://millennium-chocolate.com/cdn/shop/files/Frame_92.png?v=1774393140"
  },
  {
    "id": "mon-cheri-vinnytsia",
    "name": "Mon Cheri (Вінниця)",
    "slug": "mon-cheri-vinnytsia",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Вінниця, Вінницька область",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2020,
    "specialty": "Торти, кенді-бари, десерти, Вінниця",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти",
      "кенді-бари",
      "десерти",
      "Вінниця"
    ],
    "description": "Торти, кенді-бари та десерти у Вінниці (пл. Калічанська, 4). Коли смак стає почуттям. Графік 8:00-20:00. Телефон для замовлень 0967529157.",
    "websiteUrl": "https://www.instagram.com/mon_cheri_vn",
    "instagramHandle": "@mon_cheri_vn",
    "instagramUrl": "https://www.instagram.com/mon_cheri_vn",
    "phone": "+380 96 752 9157",
    "address": "м. Вінниця, Вінницька область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти",
      "кенді-бари",
      "десерти",
      "Вінниця"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "mon-plaisir-mykolaiv",
    "name": "Mon Plaisir (Миколаїв)",
    "slug": "mon-plaisir-mykolaiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Миколаїв, Миколаївська область",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2020,
    "specialty": "Макарон, моті, чізкейки, торти, кенді-бари, Миколаїв",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "макарон",
      "моті",
      "чізкейки",
      "торти"
    ],
    "description": "Макарон, моті, чізкейки, павлова, торти та кенді-бари у Миколаєві від Насті. Співпраця із закладами. Телефон 0954499558 для замовлень.",
    "websiteUrl": "https://www.instagram.com/mon_plaisir_mykolaiv",
    "instagramHandle": "@mon_plaisir_mykolaiv",
    "instagramUrl": "https://www.instagram.com/mon_plaisir_mykolaiv",
    "phone": "+380 95 449 9558",
    "address": "м. Миколаїв, Миколаївська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "макарон",
      "моті",
      "чізкейки",
      "торти"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "my-taste-lviv",
    "name": "My Taste Lviv",
    "slug": "my-taste-lviv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Львів, Львівська область",
    "regionCity": "Львів",
    "foundedYear": 2020,
    "specialty": "Шоколадні подарунки, бельгійський шоколад, корпоративні замовлення, Львів",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколадні подарунки",
      "бельгійський шоколад",
      "корпоративні замовлення",
      "Львів"
    ],
    "description": "Ексклюзивні шоколадні подарунки з бельгійського шоколаду у Львові. Корпоративні та індивідуальні замовлення. Доставка по Львову та Новою Поштою.",
    "websiteUrl": "https://www.instagram.com/my_taste_lviv",
    "instagramHandle": "@my_taste_lviv",
    "instagramUrl": "https://www.instagram.com/my_taste_lviv",
    "phone": "+380 97 644 4225",
    "address": "м. Львів, Львівська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколадні подарунки",
      "бельгійський шоколад",
      "корпоративні замовлення",
      "Львів"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1575372587186-50020fa3a815?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "np-kharkiv",
    "name": "NP Kharkiv (торти)",
    "slug": "np-kharkiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Харків, Харківська область",
    "regionCity": "Харків",
    "foundedYear": 2020,
    "specialty": "Торти на замовлення, авторські, Харків, досвід 7+ років",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти на замовлення",
      "авторські",
      "Харків",
      "досвід 7+ років"
    ],
    "description": "Смачні та яскраві торти у Харкові. Досвід понад 7 років, видача замовлень з 9:00-23:00 (вул. Квіткінська, 26). Авторські торти на замовлення.",
    "websiteUrl": "https://www.instagram.com/np.kh.ua",
    "instagramHandle": "@np.kh.ua",
    "instagramUrl": "https://www.instagram.com/np.kh.ua",
    "phone": "+380 99 293 0912",
    "address": "м. Харків, Харківська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти на замовлення",
      "авторські",
      "Харків",
      "досвід 7+ років"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "nata-chocolate-mk-mykolaiv",
    "name": "Nata Chocolate (Миколаїв)",
    "slug": "nata-chocolate-mk-mykolaiv",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Миколаїв, Миколаївська область",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2020,
    "specialty": "Шоколад ручної роботи, авторські дизайни, Миколаїв",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколад ручної роботи",
      "авторські дизайни",
      "Миколаїв"
    ],
    "description": "Шоколад ручної роботи у Миколаєві від Наталі та Максима Рубльових. Найкрасивіші та найсмачніші шоколадні вироби. Термін виготовлення 5-10 днів. Телефон 0633424981.",
    "websiteUrl": "https://www.instagram.com/nata_chocolate_mk",
    "instagramHandle": "@nata_chocolate_mk",
    "instagramUrl": "https://www.instagram.com/nata_chocolate_mk",
    "phone": "+380 63 342 4981",
    "address": "м. Миколаїв, Миколаївська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколад ручної роботи",
      "авторські дизайни",
      "Миколаїв"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "pure-taste",
    "name": "Pure Taste",
    "slug": "pure-taste",
    "segment": "bean-to-bar",
    "segmentTitle": "1. Плитка шоколаду та крафтові батончики",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "плитка шоколаду та батончик, одиночне походження, темний шоколад",
    "categories": [
      "plytky-shokoladu"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": true,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "bean-to-bar",
      "одиночне походження",
      "темний шоколад"
    ],
    "description": "Шоколад за технологією крафтова плитка шоколаду, що відображає смак і аромат конкретних какао-бобів. Як і вино чи кава, какао має різноманітні смаки, які Pure Taste розкриває в кожній плитці.",
    "websiteUrl": "https://pure-taste.com.ua",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "Плитка шоколаду • Батончик",
      "одиночне походження",
      "темний шоколад"
    ],
    "imageUrl": "https://static.tildacdn.net/tild3465-3237-4065-b833-393432366562/999.jpg"
  },
  {
    "id": "sweet-compliment-cherkasy",
    "name": "Sweet Compliment (Черкаси)",
    "slug": "sweet-compliment-cherkasy",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Черкаси, Черкаська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Зефірні букети, зефірна флористика, Черкаси",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "зефірні букети",
      "зефірна флористика",
      "Черкаси"
    ],
    "description": "Зефірна флористика від Іри у Черкасах. Зефірні букети ручної роботи. Доставка по Україні. Телефон 0938567375 для замовлень.",
    "websiteUrl": "https://www.instagram.com/sweet_compliment_ck",
    "instagramHandle": "@sweet_compliment_ck",
    "instagramUrl": "https://www.instagram.com/sweet_compliment_ck",
    "phone": "+380 93 856 7375",
    "address": "м. Черкаси, Черкаська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "зефірні букети",
      "зефірна флористика",
      "Черкаси"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "sweetmarket-cherkasy",
    "name": "Sweetmarket (Черкаси)",
    "slug": "sweetmarket-cherkasy",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Черкаси, Черкаська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Шоколад ручної роботи, бельгійський, італійський, Черкаси",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколад ручної роботи",
      "бельгійський",
      "італійський",
      "Черкаси"
    ],
    "description": "Шоколадки ручної роботи у Черкасах. Якісна та свіжа продукція. Бельгійський та італійський шоколад. Безкоштовна доставка від 1000 грн. Телефон 0501534804.",
    "websiteUrl": "https://www.instagram.com/sweetmarket.ua",
    "instagramHandle": "@sweetmarket.ua",
    "instagramUrl": "https://www.instagram.com/sweetmarket.ua",
    "phone": "+380 50 153 4804",
    "address": "м. Черкаси, Черкаська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколад ручної роботи",
      "бельгійський",
      "італійський",
      "Черкаси"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "zefir-irinka-khm",
    "name": "Zefir Irinka (Хмельницький)",
    "slug": "zefir-irinka-khm",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Хмельницький, Хмельницька область",
    "regionCity": "Вінниця / Хмельницький / Житомир",
    "foundedYear": 2020,
    "specialty": "Зефірні квіти, солодкі букети, Хмельницький",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "зефірні квіти",
      "солодкі букети",
      "Хмельницький"
    ],
    "description": "Зефірні квіти та солодкі букети від Ірини у Хмельницькому. Для тих, хто втомився від банальних подарунків. 500+ задоволених замовників. НП по Україні. Телефон 0999832278.",
    "websiteUrl": "https://www.instagram.com/zefir_irinka",
    "instagramHandle": "@zefir_irinka",
    "instagramUrl": "https://www.instagram.com/zefir_irinka",
    "phone": "+380 99 983 2278",
    "address": "м. Хмельницький, Хмельницька область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "зефірні квіти",
      "солодкі букети",
      "Хмельницький"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "zefiriya-bouquet-sumy",
    "name": "Zefiriya Bouquet (Суми)",
    "slug": "zefiriya-bouquet-sumy",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Суми, Сумська область",
    "regionCity": "Полтава / Суми / Запоріжжя",
    "foundedYear": 2020,
    "specialty": "Зефірні букети, їстівні букети, відправка НП, Суми",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "зефірні букети",
      "їстівні букети",
      "відправка НП",
      "Суми"
    ],
    "description": "Зефірні букети у Сумах від Каріни. Їстівні букети ручної роботи. Відправка Новою Поштою по всій Україні. Телефон +380997289515 (Viber/Telegram).",
    "websiteUrl": "https://www.instagram.com/zefiriya.bouquet",
    "instagramHandle": "@zefiriya.bouquet",
    "instagramUrl": "https://www.instagram.com/zefiriya.bouquet",
    "phone": "+380 99 728 9515",
    "address": "м. Суми, Сумська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "зефірні букети",
      "їстівні букети",
      "відправка НП",
      "Суми"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "zefirka-gift-cherkasy",
    "name": "Zefirka Gift (Черкаси)",
    "slug": "zefirka-gift-cherkasy",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Черкаси, Черкаська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Зефірні букети, доставка, Черкаси, 5 років досвіду",
    "categories": [
      "kraftovyi-zefir-ta-bukety"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "зефірні букети",
      "доставка",
      "Черкаси",
      "5 років досвіду"
    ],
    "description": "Зефірні букети у Черкасах від Наталії. 5 років на ринку. «Той самий букет» — мене рекомендують подругам. Доставка Черкаси та Україна. Телефон 096 2645747.",
    "websiteUrl": "https://www.instagram.com/zefirka.gift",
    "instagramHandle": "@zefirka.gift",
    "instagramUrl": "https://www.instagram.com/zefirka.gift",
    "phone": "+380 96 264 5747",
    "address": "м. Черкаси, Черкаська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "зефірні букети",
      "доставка",
      "Черкаси",
      "5 років досвіду"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "ineo-chocolate",
    "name": "ineo Chocolate",
    "slug": "ineo-chocolate",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Київ, Київська область",
    "regionCity": "Київ",
    "foundedYear": 2020,
    "specialty": "Темний шоколад 70%, білий шоколад, фундук, вишня, крісп",
    "categories": [
      "plytky-shokoladu"
    ],
    "mainCategory": "plytky-shokoladu",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "темний шоколад 70%",
      "білий шоколад",
      "фундук",
      "вишня"
    ],
    "description": "Крафтовий шоколад: чорний 70% з фундуком та вишнею, білий 32% з кріспом та смородиною. Авторські поєднання смаків, натуральні інгредієнти, ручна робота.",
    "websiteUrl": "https://ineo.ltd/chocolate",
    "phone": "Замовлення онлайн на сайті",
    "address": "м. Київ, Київська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "темний шоколад 70%",
      "білий шоколад",
      "фундук",
      "вишня"
    ],
    "imageUrl": "https://ineo.ltd/content/images/34/1500x1500l80mc0/75726012849468.jpg"
  },
  {
    "id": "albinka-lysenko-cherkasy",
    "name": "Альбіна Лисенко (Черкаси)",
    "slug": "albinka-lysenko-cherkasy",
    "segment": "craft-zefir-pastila",
    "segmentTitle": "5. Крафтовий зефір ручної роботи, зефірні квіти та пастила",
    "city": "Черкаси, Черкаська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Зефірні букети, торти, майстер-класи, Черкаси",
    "categories": [
      "kraftovyi-zefir-ta-bukety",
      "shokoladni-kvity-ta-bukety",
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "kraftovyi-zefir-ta-bukety",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "зефірні букети",
      "торти",
      "майстер-класи",
      "Черкаси"
    ],
    "description": "Чарівниця смаколиків Альбіна — зефірні букети та торти у Черкасах. Проводжу майстер-класи в школах. Доставка зефірних букетів по всій Україні. Телефон 0978205077.",
    "websiteUrl": "https://www.instagram.com/albinka_lysenko",
    "instagramHandle": "@albinka_lysenko",
    "instagramUrl": "https://www.instagram.com/albinka_lysenko",
    "phone": "+380 97 820 5077",
    "address": "м. Черкаси, Черкаська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "зефірні букети",
      "торти",
      "майстер-класи",
      "Черкаси"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "dimanikiforenko-dnipro",
    "name": "Дима Нікіфоренко (Дніпро)",
    "slug": "dimanikiforenko-dnipro",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Дніпро, Дніпропетровська область",
    "regionCity": "Дніпро",
    "foundedYear": 2020,
    "specialty": "3D торти, дитячі торти, ексклюзивні, Дніпро",
    "categories": [
      "avtorski-torty-ta-deserty",
      "solodoshchi-dlia-ditei"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "3D торти",
      "дитячі торти",
      "ексклюзивні",
      "Дніпро"
    ],
    "description": "Ексклюзивні 3D торти у Дніпрі. Торти для дітей, торти на улюблені свята. Авторські дизайни з об'ємними фігурами. Телефони 098 983 0603, 063 711 9099.",
    "websiteUrl": "https://www.instagram.com/dimanikiforenko_ua",
    "instagramHandle": "@dimanikiforenko_ua",
    "instagramUrl": "https://www.instagram.com/dimanikiforenko_ua",
    "phone": "+380 98 983 0603",
    "address": "м. Дніпро, Дніпропетровська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "3D торти",
      "дитячі торти",
      "ексклюзивні",
      "Дніпро"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "dobroizh-sumy",
    "name": "ДоброЇж (Суми)",
    "slug": "dobroizh-sumy",
    "segment": "healthy-vegan",
    "segmentTitle": "3. Healthy / Vegan / Raw шоколад (Без білого цукру, лактози та глютену)",
    "city": "Суми, Сумська область",
    "regionCity": "Полтава / Суми / Запоріжжя",
    "foundedYear": 2020,
    "specialty": "Солодощі без цукру, батончики, жива халва, корисні, Суми",
    "categories": [
      "bez-tsukru-ta-vegan",
      "plytky-shokoladu"
    ],
    "mainCategory": "bez-tsukru-ta-vegan",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "солодощі без цукру",
      "батончики",
      "жива халва",
      "корисні"
    ],
    "description": "Корисні солодощі без цукру, ГМО та консервантів — виробник із Сум. Батончики, жива халва. Більше ніж солодощі — даруємо емоції. Телефон +380503071225.",
    "websiteUrl": "https://dobroizh.com.ua",
    "instagramHandle": "@dobroizh",
    "instagramUrl": "https://www.instagram.com/dobroizh",
    "phone": "+380 50 307 1225",
    "address": "м. Суми, Сумська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "солодощі без цукру",
      "батончики",
      "жива халва",
      "корисні"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "vash-conditer-timoshenko-mykolaiv",
    "name": "Кондитер Тимофієнко (Миколаїв)",
    "slug": "vash-conditer-timoshenko-mykolaiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Миколаїв, Миколаївська область",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2020,
    "specialty": "Авторські торти, десерти, натуральні інгредієнти, Миколаїв",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "авторські торти",
      "десерти",
      "натуральні інгредієнти",
      "Миколаїв"
    ],
    "description": "Авторські торти та десерти у Миколаєві від Оксани Тимофієнко. Натуральні інгредієнти, без хімії. Самовивіз та доставка. Телефон 0675742507.",
    "websiteUrl": "https://www.instagram.com/vash_conditer_timoshenko",
    "instagramHandle": "@vash_conditer_timoshenko",
    "instagramUrl": "https://www.instagram.com/vash_conditer_timoshenko",
    "phone": "+380 67 574 2507",
    "address": "м. Миколаїв, Миколаївська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "авторські торти",
      "десерти",
      "натуральні інгредієнти",
      "Миколаїв"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "korytsia-mykolaiv",
    "name": "Кориція (Миколаїв)",
    "slug": "korytsia-mykolaiv",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Миколаїв, Миколаївська область",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2020,
    "specialty": "Торти, капкейки, чізкейки, домашня випічка, Миколаїв",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "торти",
      "капкейки",
      "чізкейки",
      "домашня випічка"
    ],
    "description": "Домашня кондитерська «Кориця» у Миколаєві від Оксани. Тортики, капкейки, десерти, чізкейки, смачна домашня випічка. Телефон 0962438641.",
    "websiteUrl": "https://www.instagram.com/_korytsia_",
    "instagramHandle": "@_korytsia_",
    "instagramUrl": "https://www.instagram.com/_korytsia_",
    "phone": "+380 96 243 8641",
    "address": "м. Миколаїв, Миколаївська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "торти",
      "капкейки",
      "чізкейки",
      "домашня випічка"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "larisa-bilovol-sumy",
    "name": "Лариса Біловол (Суми)",
    "slug": "larisa-bilovol-sumy",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Суми, Сумська область",
    "regionCity": "Полтава / Суми / Запоріжжя",
    "foundedYear": 2020,
    "specialty": "Авторські торти на замовлення, Суми",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "авторські торти на замовлення",
      "Суми"
    ],
    "description": "Авторські торти на замовлення у Сумах від Лариси Біловол. Смачно, стильно, з любов'ю. Viber/Telegram 066 060 68 27, замовлення через direct або телефон.",
    "websiteUrl": "https://www.instagram.com/larisa_bilovol_bakery",
    "instagramHandle": "@larisa_bilovol_bakery",
    "instagramUrl": "https://www.instagram.com/larisa_bilovol_bakery",
    "phone": "+380 66 060 6827",
    "address": "м. Суми, Сумська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "авторські торти на замовлення",
      "Суми"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "lviv-chocolate-sumy",
    "name": "Львівська Майстерня Шоколаду (Суми)",
    "slug": "lviv-chocolate-sumy",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Суми, Сумська область",
    "regionCity": "Полтава / Суми / Запоріжжя",
    "foundedYear": 2020,
    "specialty": "Шоколад ручної роботи, цукерки, гарячий шоколад, Суми",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколад ручної роботи",
      "цукерки",
      "гарячий шоколад",
      "Суми"
    ],
    "description": "Філія Львівської майстерні шоколаду у Сумах (пл. Покровська, 8). Шоколад ручної роботи, цукерки, гарячий шоколад. Графік Пн-Нд 09:00-20:00. Телефон +38 099 161 8963.",
    "websiteUrl": "https://www.instagram.com/lviv.chocolate.sumy",
    "instagramHandle": "@lviv.chocolate.sumy",
    "instagramUrl": "https://www.instagram.com/lviv.chocolate.sumy",
    "phone": "+380 99 161 8963",
    "address": "м. Суми, Сумська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколад ручної роботи",
      "цукерки",
      "гарячий шоколад",
      "Суми"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "lviv-chocolate-cherkasy",
    "name": "Львівська Майстерня Шоколаду (Черкаси)",
    "slug": "lviv-chocolate-cherkasy",
    "segment": "chocolatier-bonbons",
    "segmentTitle": "2. Шоколатьє, авторські плитки, цукерки та шоколадні квіти",
    "city": "Черкаси, Черкаська область",
    "regionCity": "Черкаси / Захід та Центри",
    "foundedYear": 2020,
    "specialty": "Шоколад, цукерки, гарячий шоколад, майстер-класи, Черкаси",
    "categories": [
      "korpusni-ta-rozmalovani-tsukerky",
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "korpusni-ta-rozmalovani-tsukerky",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "шоколад",
      "цукерки",
      "гарячий шоколад",
      "майстер-класи"
    ],
    "description": "Філія Львівської майстерні шоколаду у Черкасах. Кава та гарячий шоколад, цукерки, шоколад, тортики. Майстер-класи. Графік Пн-Сб 9:00-20:00, Нд 10:00-20:00.",
    "websiteUrl": "https://www.instagram.com/lvivchocolate_cherkasy",
    "instagramHandle": "@lvivchocolate_cherkasy",
    "instagramUrl": "https://www.instagram.com/lvivchocolate_cherkasy",
    "phone": "+380 67 473 6982",
    "address": "м. Черкаси, Черкаська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "шоколад",
      "цукерки",
      "гарячий шоколад",
      "майстер-класи"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1575372587186-50020fa3a815?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "natasha-shtofa-odesa",
    "name": "Наташа Штофа (Одеса)",
    "slug": "natasha-shtofa-odesa",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Одеса, Одеська область",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2020,
    "specialty": "Весільні торти, макаруни, авторський дизайн, Одесa",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "весільні торти",
      "макаруни",
      "авторський дизайн",
      "Одесa"
    ],
    "description": "Весільні торти та макаруни в Одесі від Наташі Штофи. Особливі торти на замовлення до будь-якої події. Авторський дизайн, телефон +3806795196 66.",
    "websiteUrl": "https://www.instagram.com/natasha_shtofa",
    "instagramHandle": "@natasha_shtofa",
    "instagramUrl": "https://www.instagram.com/natasha_shtofa",
    "phone": "+380 67 951 9666",
    "address": "м. Одеса, Одеська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "весільні торти",
      "макаруни",
      "авторський дизайн",
      "Одесa"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "alexandrova-odesa",
    "name": "Юлія Александрова (Одеса)",
    "slug": "alexandrova-odesa",
    "segment": "custom-cakes-pastry",
    "segmentTitle": "6. Авторські торти на замовлення, бенто-торти та десерти ручної роботи",
    "city": "Одеса, Одеська область",
    "regionCity": "Одеса / Південь",
    "foundedYear": 2020,
    "specialty": "Авторські торти, індивідуальний дизайн, Одесa, з 2014",
    "categories": [
      "avtorski-torty-ta-deserty"
    ],
    "mainCategory": "avtorski-torty-ta-deserty",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.92,
    "reviewsCount": 95,
    "cacaoOrigin": [
      "авторські торти",
      "індивідуальний дизайн",
      "Одесa",
      "з 2014"
    ],
    "description": "Авторські торти з індивідуальним дизайном в Одесі (селище Котовського). Створюю торти з 2014 року, ФОП. Замовлення через Direct.",
    "websiteUrl": "https://www.instagram.com/alexandrova.juliya",
    "instagramHandle": "@alexandrova.juliya",
    "instagramUrl": "https://www.instagram.com/alexandrova.juliya",
    "phone": "+380 67 681 7229",
    "address": "м. Одеса, Одеська область",
    "shippingNote": "Доставка по місту та Новою Поштою по Україні",
    "badges": [
      "авторські торти",
      "індивідуальний дизайн",
      "Одесa",
      "з 2014"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    "id": "shokoladno-kharkiv",
    "name": "ТМ «Шоколадно»",
    "slug": "tm-shokoladno-kharkiv",
    "segment": "flowers-berries-nuts",
    "segmentTitle": "4. Шоколадні квіти, букети, малина, полуниця та горіхи в шоколаді",
    "city": "Харків",
    "regionCity": "Харків",
    "foundedYear": 2016,
    "specialty": "Виробництво цукерок із сухофруктів та горіхів у шоколаді, подарункові набори",
    "categories": [
      "horikhy-ta-sukhofrukty-v-shokoladi",
      "korpusni-ta-rozmalovani-tsukerky"
    ],
    "mainCategory": "horikhy-ta-sukhofrukty-v-shokoladi",
    "isBeanToBar": false,
    "isVerified": true,
    "rating": 4.91,
    "reviewsCount": 160,
    "cacaoOrigin": [
      "Європа",
      "Україна"
    ],
    "description": "Харківський виробник шоколадної продукції, цукерок із натуральних сухофруктів і горіхів у шоколаді.",
    "websiteUrl": "https://shokoladno.com.ua",
    "phone": "+38 (097) 20-80-500, +38 (050) 98-108-98",
    "email": "tm.shokoladno@gmail.com",
    "address": "м. Харків, вул. Каштанова, 29",
    "shippingNote": "Роздріб та опт по всій Україні",
    "badges": [
      "Сухофрукти в шоколаді",
      "Харківський виробник",
      "Опт і роздріб"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=85"
  }
];

export const PRODUCTS: ChocolateProduct[] = [
  {
    id: 'p-13',
    title: '🏆 Крафтова плитка темного та молочного шоколаду Callebaut з цільним фундуком і ягодами (Хіт №1)',
    slug: 'crafo-kharkiv-belgian-chocolate-bar-nuts-berries',
    makerId: 'crafo-kharkiv',
    makerName: 'CraftChoco / ChocoCraft (crafo.com.ua)',
    makerCity: 'Харків',
    category: 'plytky-shokoladu',
    subType: '🏆 Лідер продажів • Авторська плитка',
    priceUah: 110,
    weightGrams: 100,
    cacaoPercent: 54,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський кувертюр Barry Callebaut',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 5.0,
    reviewsCount: 540,
    cleanLabelScore: 98,
    flavorProfile: {
      sweetness: 3,
      acidity: 2,
      bitterness: 2,
      fruityNotes: 4,
      nuttyNotes: 5,
    },
    tastingNotes: ['Бельгійський шоколад Callebaut', 'Обсмажений фундук і мигдаль', 'Сублімована полуниця і малина'],
    expertVerdict:
      'Флагманська плитка лідера категорії crafo.com.ua: ідеальний баланс 100% бельгійського шоколаду Callebaut, добірних горіхів та ягід. Найкращий вибір як для себе, так і на подарунок.',
    bestFor: ['gift-her', 'gourmet-self', 'kids', 'corporate', 'gift-boss'],
    imageUrl: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80',
    offersCount: 5,
    productUrl: 'https://crafo.com.ua/podarunky/mystetstvo-u-ploti',
  },
  {
    id: 'p-2',
    title: '🏆 Подарунковий букет з шоколадних троянд та цукерок ручної роботи Callebaut (Crafo)',
    slug: 'crafo-kharkiv-chocolate-flowers-and-bonbons',
    makerId: 'crafo-kharkiv',
    makerName: 'CraftChoco / ChocoCraft (crafo.com.ua)',
    makerCity: 'Харків',
    category: 'shokoladni-kvity-ta-bukety',
    subType: '🏆 №1 Шоколадні квіти + Цукерки',
    priceUah: 620,
    weightGrams: 320,
    cacaoPercent: 54,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський шоколад Barry Callebaut',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 5.0,
    reviewsCount: 495,
    cleanLabelScore: 98,
    flavorProfile: {
      sweetness: 3,
      acidity: 2,
      bitterness: 2,
      fruityNotes: 4,
      nuttyNotes: 4,
    },
    tastingNotes: ['Бельгійський молочний та білий шоколад', 'Фундучне праліне', 'Сублімована ягода'],
    expertVerdict:
      'Виготовляється у провідній харківській майстерні Crafo (crafo.com.ua, вул. Лебединська, 1) зі 100% бельгійського шоколаду Callebaut. Доступні плитки, авторські цукерки та розкішні шоколадні квіти.',
    bestFor: ['gift-her', 'gift-boss', 'corporate', 'kids'],
    imageUrl: '/images/crafo-hero.jpg',
    offersCount: 5,
    productUrl: 'https://crafo.com.ua/podarunky/buket-iakyi-ne-ziviane',
  },
  {
    id: 'p-1',
    title: 'Моносортова плитка Tanzania Kokoa Kamili 72% (Плитка шоколаду)',
    slug: 'tanzania-kokoa-kamili-72-sisters-a',
    makerId: 'sisters-a',
    makerName: 'Sisters A. Chocolate',
    makerCity: 'Луцьк',
    category: 'plytky-shokoladu',
    subType: 'Плитка шоколаду • 72 год витримки',
    priceUah: 245,
    weightGrams: 75,
    cacaoPercent: 72,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Trinitario Organic (Танзанія)',
    isSugarFree: false,
    isVegan: true,
    isBeanToBar: true,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.99,
    reviewsCount: 128,
    cleanLabelScore: 100,
    flavorProfile: {
      sweetness: 2,
      acidity: 4,
      bitterness: 2,
      fruityNotes: 5,
      nuttyNotes: 2,
    },
    tastingNotes: ['Червоні ягоди', 'Вишня', 'Тропічні фрукти'],
    expertVerdict:
      'Лише 2 інгредієнти: фермерські какао-боби з Танзанії та тростинний цукор. Призер Academy of Chocolate Awards у Лондоні.',
    bestFor: ['gourmet-self', 'gift-boss'],
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80',
    offersCount: 3,
  },
  
  {
    id: 'p-3',
    title: 'Дизайнерський набір розписних корпусних цукерок ручної роботи (12 шт)',
    slug: 'cosmos-hand-painted-bonbons-12',
    makerId: 'candy-coupe-buffet',
    makerName: 'CandyBuffet / Candy Coupe',
    makerCity: 'Київ',
    category: 'korpusni-ta-rozmalovani-tsukerky',
    subType: 'Розмальовані корпусні цукерки',
    priceUah: 680,
    weightGrams: 180,
    cacaoPercent: 64,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Valrhona (Франція) & Cacao Barry',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.97,
    reviewsCount: 94,
    cleanLabelScore: 95,
    flavorProfile: {
      sweetness: 3,
      acidity: 4,
      bitterness: 2,
      fruityNotes: 5,
      nuttyNotes: 4,
    },
    tastingNotes: ['Маракуйя-Манго', 'Малина-Лічі', 'Фісташкове праліне', 'Солона карамель'],
    expertVerdict:
      'Ручний художній розпис кольоровим какао-маслом. Ультратонкий хрумкий корпус і подвійна начинка.',
    bestFor: ['gift-her', 'gift-boss', 'corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-4',
    title: 'Букет шоколадних півоній та троянд у капелюшній коробці (19 квітів Veliche)',
    slug: 'chocolate-peonies-and-roses-hatbox-19',
    makerId: 'ecojoy',
    makerName: 'Ecojoy (ecojoy.com.ua)',
    makerCity: 'Ковель / Доставка НП',
    category: 'shokoladni-kvity-ta-bukety',
    subType: 'Шоколадний букет ручної роботи',
    priceUah: 740,
    weightGrams: 380,
    cacaoPercent: 34,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський Veliche Gourmet & Callebaut',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.99,
    reviewsCount: 284,
    cleanLabelScore: 95,
    flavorProfile: {
      sweetness: 4,
      acidity: 3,
      bitterness: 1,
      fruityNotes: 5,
      nuttyNotes: 2,
    },
    tastingNotes: ['Бельгійський білий та молочний шоколад', 'Ягідні ноти', 'Вершковий післясмак'],
    expertVerdict:
      'Візуально не відрізнити від живих квітів. Відливається зі 100% бельгійського шоколаду Veliche (без пальмової глазурі), зберігається до 6 місяців.',
    bestFor: ['gift-her', 'gift-boss', 'corporate', 'kids'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-5',
    title: 'Цільна сублімована малина та полуниця у бельгійському шоколаді',
    slug: 'freeze-dried-raspberry-double-chocolate',
    makerId: 'panfruit',
    makerName: 'Panfruit Ukraine (panfruit.ua)',
    makerCity: 'Київ',
    category: 'malyna-ta-polunytsia-v-shokoladi',
    subType: 'Цільна ягода в шоколаді',
    priceUah: 360,
    weightGrams: 160,
    cacaoPercent: 54,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський кувертюр Callebaut',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.96,
    reviewsCount: 215,
    cleanLabelScore: 96,
    flavorProfile: {
      sweetness: 3,
      acidity: 5,
      bitterness: 1,
      fruityNotes: 5,
      nuttyNotes: 1,
    },
    tastingNotes: ['Хрумка лісова малина', 'Вершковий білий та молочний шоколад'],
    expertVerdict:
      'Власна сублімація ягід в Україні: цільна ягода зберігає 98% вітамінів і природну кислинку під шаром бельгійського шоколаду.',
    bestFor: ['gift-her', 'gourmet-self', 'kids'],
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
    offersCount: 5,
  },
  {
    id: 'p-6',
    title: 'Набір сирних цукерок ручної роботи «Cheese & Wine Collection» (9 шт)',
    slug: 'cheese-and-wine-truffles-9',
    makerId: 'cheese-sweets',
    makerName: 'Cheese Sweets Олега Соловйова',
    makerCity: 'Дніпро',
    category: 'korpusni-ta-rozmalovani-tsukerky',
    subType: 'Сирні цукерки в шоколаді',
    priceUah: 520,
    weightGrams: 145,
    cacaoPercent: 60,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Бельгійський та Італійський кувертюр',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.96,
    reviewsCount: 163,
    cleanLabelScore: 96,
    flavorProfile: {
      sweetness: 2,
      acidity: 3,
      bitterness: 2,
      fruityNotes: 3,
      nuttyNotes: 4,
    },
    tastingNotes: ['Дорблю та груша', 'Пармезан 24 міс', 'Козячий сир', 'Брі та чеддер'],
    expertVerdict:
      'До 35% справжнього витриманого сиру в кожній цукерці. Ідеальний гастрономічний подарунок до вина.',
    bestFor: ['gift-boss', 'gourmet-self', 'corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80',
    offersCount: 2,
  },
  {
    id: 'p-7',
    title: 'Карамелізований фундук, мигдаль та сухофрукти в шоколаді Fino de Aroma',
    slug: 'caramelized-hazelnut-pistachio-dragee',
    makerId: 'yandmi',
    makerName: 'YandMi (yandmi.com)',
    makerCity: 'Житомир / Харків',
    category: 'horikhy-ta-sukhofrukty-v-shokoladi',
    subType: 'Горіхи та сухофрукти в шоколаді',
    priceUah: 340,
    weightGrams: 180,
    cacaoPercent: 70,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Colombia Fino de Aroma',
    isSugarFree: false,
    isVegan: true,
    isBeanToBar: true,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.98,
    reviewsCount: 142,
    cleanLabelScore: 99,
    flavorProfile: {
      sweetness: 2,
      acidity: 1,
      bitterness: 3,
      fruityNotes: 2,
      nuttyNotes: 5,
    },
    tastingNotes: ['Цільний обсмажений фундук', 'Фісташка', 'Бурбонська ваніль'],
    expertVerdict:
      'Добірне ядро горіха власного обсмаження в товстому шарі ремісничого колумбійського шоколаду Fino de Aroma.',
    bestFor: ['gourmet-self', 'gift-boss', 'corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-8',
    title: 'Плитка з солоною карамеллю, пеканом та хрумким кранчем у молочному шоколаді',
    slug: 'salted-caramel-pecan-milk-bar-spell',
    makerId: 'spell',
    makerName: 'Spell Chocolate',
    makerCity: 'Київ',
    category: 'plytky-shokoladu',
    subType: 'Авторська плитка з карамеллю',
    priceUah: 219,
    weightGrams: 110,
    cacaoPercent: 36,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський Callebaut',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.94,
    reviewsCount: 380,
    cleanLabelScore: 92,
    flavorProfile: {
      sweetness: 4,
      acidity: 1,
      bitterness: 1,
      fruityNotes: 1,
      nuttyNotes: 5,
    },
    tastingNotes: ['Тягуча солона карамель', 'Обсмажений пекан', 'Молочний шоколад'],
    expertVerdict:
      'Найвигідніше співвідношення ціни за 100 г серед преміальних подарункових плиток з начинкою.',
    bestFor: ['gift-her', 'corporate', 'gourmet-self', 'kids'],
    imageUrl: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80',
    offersCount: 6,
  },
  {
    id: 'p-9',
    title: 'Асорті сухофруктів з волоським горіхом у шоколаді «Волинські солодощі» (Чорнослив, Курага, Інжир)',
    slug: 'volyn-dried-fruits-with-nuts-in-chocolate-cukorka',
    makerId: 'cukorka-volyn',
    makerName: 'ТМ «Цукорка» (cukorka.com.ua)',
    makerCity: 'Луцьк',
    category: 'horikhy-ta-sukhofrukty-v-shokoladi',
    subType: 'Сухофрукти з горіхом у шоколаді',
    priceUah: 380,
    weightGrams: 400,
    cacaoPercent: 56,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Натуральна шоколадна маса',
    isSugarFree: false,
    isVegan: true,
    isBeanToBar: false,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.96,
    reviewsCount: 280,
    cleanLabelScore: 94,
    flavorProfile: {
      sweetness: 3,
      acidity: 2,
      bitterness: 2,
      fruityNotes: 5,
      nuttyNotes: 5,
    },
    tastingNotes: ['Чорнослив з волоським горіхом', 'Курага та інжир', 'Темний шоколад'],
    expertVerdict:
      'Найкраща ціна за 100 г (лише 95 грн / 100 г!) серед українських крафтових наборів сухофруктів із цільним горіхом у шоколаді.',
    bestFor: ['gift-boss', 'corporate', 'kids', 'gourmet-self'],
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80',
    offersCount: 5,
  },
  {
    id: 'p-10',
    title: 'Свіжа полуниця в бельгійському молочному, білому та рубіновому шоколаді (Набір 16 шт)',
    slug: 'chocobox-fresh-strawberries-in-belgian-chocolate',
    makerId: 'chocobox-kyiv',
    makerName: 'Chocobox (chocobox.com.ua)',
    makerCity: 'Київ',
    category: 'malyna-ta-polunytsia-v-shokoladi',
    subType: 'Свіжа полуниця в шоколаді',
    priceUah: 850,
    weightGrams: 460,
    cacaoPercent: 45,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський Callebaut Milk, White & Ruby',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.97,
    reviewsCount: 210,
    cleanLabelScore: 95,
    flavorProfile: {
      sweetness: 3,
      acidity: 4,
      bitterness: 1,
      fruityNotes: 5,
      nuttyNotes: 3,
    },
    tastingNotes: ['Соковита свіжа полуниця', 'Бельгійський шоколад Callebaut', 'Сублімована малина та фісташка'],
    expertVerdict:
      'Готується безпосередньо перед доставкою з добірної полуниці та справжнього бельгійського шоколаду Callebaut.',
    bestFor: ['gift-her', 'gift-boss', 'kids'],
    imageUrl: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-11',
    title: 'Дитячий шоколад на керобі з лісовим горіхом та полуницею (Без цукру і кофеїну)',
    slug: 'carob-chocolate-kids-hazelnut-strawberry-leopol',
    makerId: 'leopol',
    makerName: "Leopol' (Львів)",
    makerCity: 'Львів',
    category: 'solodoshchi-dlia-ditei',
    subType: 'Дитяча плитка шоколаду та батончик на керобі',
    priceUah: 185,
    weightGrams: 85,
    cacaoPercent: 55,
    sweetener: 'Кероб (природна солодкість)',
    cacaoType: 'Нерафіноване какао-масло + Іспанський кероб',
    isSugarFree: true,
    isVegan: true,
    isBeanToBar: true,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.97,
    reviewsCount: 194,
    cleanLabelScore: 100,
    flavorProfile: {
      sweetness: 4,
      acidity: 2,
      bitterness: 1,
      fruityNotes: 4,
      nuttyNotes: 4,
    },
    tastingNotes: ['Карамельний кероб', 'Сублімована полуниця', 'Фундук'],
    expertVerdict:
      'Безпечний шоколад для дітей: не містить кофеїну, теоброміну та білого цукру.',
    bestFor: ['kids', 'gourmet-self'],
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-12',
    title: 'Крафтовий шоколад на власному квітковому меду з фундуком та журавлиною',
    slug: 'honey-craft-chocolate-hazelnut-zhuzhu',
    makerId: 'zhuzhu-shop',
    makerName: 'ЖуЖу Shop (djujushop.com.ua)',
    makerCity: 'Ніжин',
    category: 'bez-tsukru-ta-vegan',
    subType: 'Шоколад на натуральному меду',
    priceUah: 195,
    weightGrams: 85,
    cacaoPercent: 70,
    sweetener: 'Мед',
    cacaoType: 'Венесуела та Колумбія',
    isSugarFree: true,
    isVegan: false,
    isBeanToBar: true,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.96,
    reviewsCount: 148,
    cleanLabelScore: 100,
    flavorProfile: {
      sweetness: 3,
      acidity: 3,
      bitterness: 2,
      fruityNotes: 4,
      nuttyNotes: 5,
    },
    tastingNotes: ['Квітковий мед з власної пасіки', 'Лісовий фундук', 'В’ялена журавлина'],
    expertVerdict:
      'Живий ремісничий шоколад без грама білого цукру — підсолоджений виключно натуральним медом за температури до 42°C.',
    bestFor: ['kids', 'gourmet-self', 'gift-her'],
    imageUrl: 'https://images.unsplash.com/photo-1623660053975-cf75a8be0908?auto=format&fit=crop&w=800&q=80',
    offersCount: 3,
  },
  
  {
    id: 'p-14',
    title: 'Подарунковий набір бельгійських цукерок ручної роботи та шоколадних фігур SWEETS (16 шт)',
    slug: 'sweets-net-ua-kharkiv-gift-chocolate-box-16',
    makerId: 'sweets-net-ua',
    makerName: 'SWEETS | солодощі & подарунки (sweets.net.ua)',
    makerCity: 'Харків',
    category: 'korpusni-ta-rozmalovani-tsukerky',
    subType: 'Подарунковий набір цукерок та шоколаду',
    priceUah: 590,
    weightGrams: 260,
    cacaoPercent: 54,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський шоколад Callebaut',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.97,
    reviewsCount: 185,
    cleanLabelScore: 95,
    flavorProfile: {
      sweetness: 3,
      acidity: 2,
      bitterness: 2,
      fruityNotes: 4,
      nuttyNotes: 5,
    },
    tastingNotes: ['Горіхове праліне', 'Ягідний ганаш', 'Бельгійський молочний та темний шоколад'],
    expertVerdict:
      'Фірмовий бутік-майстерня у Харкові (ТРЦ Французький бульвар, sweets.net.ua): великий вибір подарункових шоколадних наборів, плиток, квітів та фігур.',
    bestFor: ['gift-her', 'gift-boss', 'corporate', 'kids'],
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    offersCount: 5,
  },
  {
    id: 'p-15',
    title: 'Веганський молочний шоколад на вівсяному молоці з какао-бобів Коста-Ріки (Плитка шоколаду)',
    slug: 'myzo-oat-milk-vegan-costa-rica-bar',
    makerId: 'myzo',
    makerName: 'MYZO Chocolate (myzochocolate.com)',
    makerCity: 'Волинська обл. / Луцьк',
    category: 'bez-tsukru-ta-vegan',
    subType: 'Плитка шоколаду • Веган на вівсяному молоці',
    priceUah: 220,
    weightGrams: 80,
    cacaoPercent: 52,
    sweetener: 'Кокосовий цукор',
    cacaoType: 'Fino de Aroma (Коста-Ріка)',
    isSugarFree: true,
    isVegan: true,
    isBeanToBar: true,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.98,
    reviewsCount: 192,
    cleanLabelScore: 100,
    flavorProfile: {
      sweetness: 3,
      acidity: 2,
      bitterness: 1,
      fruityNotes: 3,
      nuttyNotes: 4,
    },
    tastingNotes: ['Ніжне вівсяне молоко', 'Карамельний кокосовий нектар', 'Какао-боби Коста-Ріки'],
    expertVerdict:
      'Ідеальний молочний смак без лактози, білого цукру та лецитину. Перетертий на кам’яних жорнах із фермерських бобів.',
    bestFor: ['kids', 'gourmet-self', 'gift-her'],
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-16',
    title: 'Авторська плитка з білими грибами або гречихою та шовковицею (Плитка шоколаду, Черкаси)',
    slug: 'meetty-porcini-buckwheat-craft-chocolate-bar',
    makerId: 'meetty',
    makerName: 'Meetty Chocolate (meetty.com.ua)',
    makerCity: 'Черкаси',
    category: 'plytky-shokoladu',
    subType: 'Гастрономічна плитка шоколаду',
    priceUah: 230,
    weightGrams: 85,
    cacaoPercent: 65,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Trinitario & Criollo',
    isSugarFree: false,
    isVegan: true,
    isBeanToBar: true,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.98,
    reviewsCount: 215,
    cleanLabelScore: 99,
    flavorProfile: {
      sweetness: 3,
      acidity: 2,
      bitterness: 2,
      fruityNotes: 4,
      nuttyNotes: 5,
    },
    tastingNotes: ['Карпатські білі гриби', 'Гречане праліне', 'Троянда та шовковиця'],
    expertVerdict:
      'Унікальний український гастрономічний шоколад із Черкас, відзначений світовими нагородами Academy of Chocolate Awards.',
    bestFor: ['gourmet-self', 'gift-boss', 'gift-her'],
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-17',
    title: 'Подарунковий букет із зефірних півоній та троянд ручної роботи (100% ягідне пюре)',
    slug: 'piolli-zefir-peonies-bouquet-kyiv',
    makerId: 'piolli-zefir',
    makerName: 'Piolli — Студія зефірних квітів (piolli.com.ua)',
    makerCity: 'Київ',
    category: 'kraftovyi-zefir-ta-bukety',
    subType: 'Зефірний букет ручної роботи',
    priceUah: 890,
    weightGrams: 550,
    cacaoPercent: 0,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Ягідно-яблучне пюре + Агар-агар',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.99,
    reviewsCount: 184,
    cleanLabelScore: 98,
    flavorProfile: {
      sweetness: 3,
      acidity: 3,
      bitterness: 1,
      fruityNotes: 5,
      nuttyNotes: 1,
    },
    tastingNotes: ['Смородина та малина', 'Печене яблуко', 'Ніжна повітряна текстура на агар-агарі'],
    expertVerdict:
      'Розкішний їстівний букет із натурального ягідного зефіру без штучних консервантів. Чудова альтернатива живим квітам.',
    bestFor: ['gift-her', 'gift-boss', 'kids', 'corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-18',
    title: 'Натуральний ягідний зефір у бельгійському темному шоколаді Callebaut (Набір 9 шт)',
    slug: 'charivnyi-zefir-in-belgian-chocolate-9',
    makerId: 'charivnyi-zefir',
    makerName: 'Майстерня «Чарівний Зефір» (charivnyi-zefir.com)',
    makerCity: 'Київ',
    category: 'kraftovyi-zefir-ta-bukety',
    subType: 'Зефір у бельгійському шоколаді',
    priceUah: 460,
    weightGrams: 360,
    cacaoPercent: 54,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський кувертюр Callebaut + Ягідне пюре',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: false,
    isGiftReady: true,
    thermoBoxIncluded: false,
    rating: 4.98,
    reviewsCount: 165,
    cleanLabelScore: 97,
    flavorProfile: {
      sweetness: 3,
      acidity: 4,
      bitterness: 2,
      fruityNotes: 5,
      nuttyNotes: 1,
    },
    tastingNotes: ['Хрумкий бельгійський шоколад', 'Малиново-смородиновий зефір', 'Натуральний агар-агар'],
    expertVerdict:
      'Поєднання повітряного домашнього зефіру з живих ягід та тонкого хрумкого корпусу зі справжнього бельгійського шоколаду.',
    bestFor: ['gift-her', 'kids', 'gourmet-self', 'corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=800&q=80',
    offersCount: 3,
  },
  {
    id: 'p-19',
    title: 'Авторський мусовий торт у бельгійському шоколадному велюрі «Фундук-Малина-Шоколад»',
    slug: 'chebakery-kharkiv-signature-chocolate-velour-cake',
    makerId: 'chebakery-kharkiv',
    makerName: 'CheBakery Олени Чечендаєвої (chebakery.com.ua)',
    makerCity: 'Харків',
    category: 'avtorski-torty-ta-deserty',
    subType: 'Авторський торт на замовлення',
    priceUah: 1350,
    weightGrams: 1200,
    cacaoPercent: 54,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Бельгійський Callebaut & Французький Cacao Barry',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.99,
    reviewsCount: 240,
    cleanLabelScore: 97,
    flavorProfile: {
      sweetness: 3,
      acidity: 3,
      bitterness: 2,
      fruityNotes: 4,
      nuttyNotes: 5,
    },
    tastingNotes: ['Шоколадний мус Callebaut', 'Хрумке фундучне праліне', 'Малинове конфі'],
    expertVerdict:
      'Лише 113 грн за 100 г преміального авторського торта з натуральних вершків 33% та бельгійського шоколаду від топової кондитерської Харкова.',
    bestFor: ['gift-her', 'gift-boss', 'kids', 'corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    offersCount: 4,
  },
  {
    id: 'p-20',
    title: 'Святковий бенто-торт та набір макаронів із бельгійським ганашем (Подарунковий бокс)',
    slug: 'bakerstreet-kyiv-bento-cake-and-macarons',
    makerId: 'bakerstreet-kyiv',
    makerName: 'BAKERSTREET Bakery (bakerstreet.ua)',
    makerCity: 'Київ',
    category: 'avtorski-torty-ta-deserty',
    subType: 'Бенто-торт + Макарони',
    priceUah: 780,
    weightGrams: 650,
    cacaoPercent: 54,
    sweetener: 'Класичний буряковий',
    cacaoType: 'Бельгійський кувертюр Callebaut',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.98,
    reviewsCount: 295,
    cleanLabelScore: 96,
    flavorProfile: {
      sweetness: 3,
      acidity: 2,
      bitterness: 1,
      fruityNotes: 4,
      nuttyNotes: 4,
    },
    tastingNotes: ['Вершковий крем-чіз', 'Фісташковий та шоколадний ганаш', 'Мигдалеві макарони'],
    expertVerdict:
      'Найпопулярніший подарунковий формат на День народження чи річницю: індивідуальний напис на бенто-торті та асорті французьких макаронів.',
    bestFor: ['gift-her', 'kids', 'corporate', 'gift-boss'],
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    offersCount: 5,
  },
  {
    id: 'p-21',
    title: 'Ексклюзивна подарункова колекція авторських корпусних цукерок ручного розпису «Chocoblues Exclusive»',
    slug: 'chocoblues-exclusive-handpainted-bonbons-box',
    makerId: 'chocoblues-odesa',
    makerName: 'Chocoblues — Майстерня авторського шоколаду (chocoblues.com.ua)',
    makerCity: 'Одеса / Вся Україна',
    category: 'korpusni-ta-rozmalovani-tsukerky',
    subType: 'Колекційні цукерки ручного розпису',
    priceUah: 620,
    weightGrams: 220,
    cacaoPercent: 60,
    sweetener: 'Тростинний цукор',
    cacaoType: 'Добірний бельгійський кувертюр',
    isSugarFree: false,
    isVegan: false,
    isBeanToBar: false,
    isHandPainted: true,
    isGiftReady: true,
    thermoBoxIncluded: true,
    rating: 4.98,
    reviewsCount: 184,
    cleanLabelScore: 98,
    flavorProfile: {
      sweetness: 3,
      acidity: 3,
      bitterness: 3,
      fruityNotes: 5,
      nuttyNotes: 4,
    },
    tastingNotes: ['Маракуя та солона карамель', 'Фісташковий ганаш', 'Лавандовий трюфель'],
    expertVerdict:
      'Один із найвиразніших одеських зразків авторських цукерок: тонкий корпус із бельгійського шоколаду, неперевершений ручний живопис та свіжі ніжні ганаші.',
    bestFor: ['gift-her', 'gift-boss', 'corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    offersCount: 3,
  },
];

export function getPricePer100g(priceUah: number, weightGrams: number): number {
  return Math.round((priceUah / weightGrams) * 100);
}
