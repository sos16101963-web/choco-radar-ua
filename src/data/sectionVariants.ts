import { CategorySlug } from './chocolateData';

export type MacroSectionId = 'home' | 'chocolate' | 'cakes' | 'zefir';

export interface ProductVariantItem {
  id: string;
  section: Exclude<MacroSectionId, 'home'>;
  categorySlug: Exclude<CategorySlug, 'all'>;
  emoji: string;
  titleUk: string;
  titleRu: string;
  shortDescUk: string;
  shortDescRu: string;
  detailedAssortmentUk: string;
  detailedAssortmentRu: string;
  ingredientsUk: string;
  ingredientsRu: string;
  shelfLifeUk: string;
  shelfLifeRu: string;
  imageUrl: string;
  preferredMakerIds: string[];
  customDirectUrls?: Record<string, string>;
}

export const CHOCOLATE_VARIANTS: ProductVariantItem[] = [
  {
    id: 'choco-bars',
    section: 'chocolate',
    categorySlug: 'plytky-shokoladu',
    emoji: '🍫',
    titleUk: 'Плитка шоколаду та батончики',
    titleRu: 'Плитка шоколада и батончики',
    shortDescUk: 'Авторські плитки з горіхами і ягодами, дубайський шоколад, ремісничий bean-to-bar та праліне-батончики.',
    shortDescRu: 'Авторские плитки с орехами и ягодами, дубайский шоколад, ремесленный bean-to-bar и пралине-батончики.',
    detailedAssortmentUk:
      'Преміальні крафтові плитки молочного, темного, білого, рубінового та карамельного шоколаду з цільним фундуком, фісташкою, сублімованою малиною, полуницею, а також хрусткий дубайський шоколад з катаїфі та фісташковою пастою і ситні шоколадні батончики.',
    detailedAssortmentRu:
      'Премиальные крафтовые плитки молочного, темного, белого, рубинового и карамельного шоколада с цельным фундуком, фисташкой, сублимированной малиной, клубникой, а также хрустящий дубайский шоколад с катаифи и фисташковой пастой и сытные шоколадные батончики.',
    ingredientsUk: '100% бельгійський кувертюр Barry Callebaut або фермерські какао-боби Fino de Aroma, натуральне какао-масло без пальмової олії.',
    ingredientsRu: '100% бельгийский кувертюр Barry Callebaut или фермерские какао-бобы Fino de Aroma, натуральное какао-масло без пальмового масла.',
    shelfLifeUk: '6–9 місяців при +15...+21 °C',
    shelfLifeRu: '6–9 месяцев при +15...+21 °C',
    imageUrl: '/images/crafo-collage.jpg',
    preferredMakerIds: ['crafo-kharkiv', 'sisters-a', 'yandmi', 'chocoblues-odesa'],
  },
  {
    id: 'choco-candies',
    section: 'chocolate',
    categorySlug: 'korpusni-ta-rozmalovani-tsukerky',
    emoji: '🍬',
    titleUk: 'Цукерки ручної роботи та трюфелі',
    titleRu: 'Конфеты ручной работы и трюфели',
    shortDescUk: 'Подарункові бокси корпусних цукерок з художнім розписом, класичні й сирні трюфелі, праліне.',
    shortDescRu: 'Подарочные боксы корпусных конфет с художественной росписью, классические и сырные трюфели, пралине.',
    detailedAssortmentUk:
      'Дизайнерські набори від 4 до 36 цукерок ручної роботи: корпусні цукерки з натуральними фруктово-ягідними ганашами, солоною карамеллю, фісташковим та фундучним праліне, а також авторські трюфелі з витриманими сирами (Дорблю, Пармезан, Горгонзола).',
    detailedAssortmentRu:
      'Дизайнерские наборы от 4 до 36 конфет ручной работы: корпусные конфеты с натуральными фруктово-ягодными ганашами, соленой карамелью, фисташковым и фундучным пралине, а также авторские трюфели с выдержанными сырами (Дорблю, Пармезан, Горгонзола).',
    ingredientsUk: 'Бельгійський та французький шоколад Callebaut / Valrhona, вершки, натуральні ягідні пюре, горіхові пасти.',
    ingredientsRu: 'Бельгийский и французский шоколад Callebaut / Valrhona, сливки, натуральные ягодные пюре, ореховые пасты.',
    shelfLifeUk: 'Від 14 днів до 3 місяців',
    shelfLifeRu: 'От 14 дней до 3 месяцев',
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['crafo-kharkiv', 'chocoblues-odesa', 'bogi-cacao', 'candy-coupe-buffet'],
  },
  {
    id: 'choco-flowers',
    section: 'chocolate',
    categorySlug: 'shokoladni-kvity-ta-bukety',
    emoji: '🌹',
    titleUk: 'Шоколадні квіти та букети',
    titleRu: 'Шоколадные цветы и букеты',
    shortDescUk: 'Реалістичні букети з шоколадних троянд, півоній і тюльпанів, які не в’януть.',
    shortDescRu: 'Реалистичные букеты из шоколадных роз, пионов и тюльпанов, которые не вянут.',
    detailedAssortmentUk:
      'Ефектні подарункові букети у капелюшних коробках і дизайнерському пакуванні з реалістичних шоколадних півоній, троянд, тюльпанів і ромашок. Кожна пелюстка відливається вручну з цільного преміального бельгійського шоколаду.',
    detailedAssortmentRu:
      'Эффектные подарочные букеты в шляпных коробках и дизайнерской упаковке из реалистичных шоколадных пионов, роз, тюльпанов и ромашек. Каждый лепесток отливается вручную из цельного премиального бельгийского шоколада.',
    ingredientsUk: 'Натуральний бельгійський шоколад Barry Callebaut та Veliche Gourmet (білий, молочний, полуничний, темний) без глазурі.',
    ingredientsRu: 'Натуральный бельгийский шоколад Barry Callebaut и Veliche Gourmet (белый, молочный, клубничный, темный) без глазури.',
    shelfLifeUk: 'До 6 місяців при кімнатній температурі',
    shelfLifeRu: 'До 6 месяцев при комнатной температуре',
    imageUrl: '/images/crafo-hero.jpg',
    preferredMakerIds: ['crafo-kharkiv', 'ecojoy', 'candy-coupe-buffet', 'chocolady'],
  },
  {
    id: 'choco-berries',
    section: 'chocolate',
    categorySlug: 'malyna-ta-polunytsia-v-shokoladi',
    emoji: '🍓',
    titleUk: 'Малина та полуниця в шоколаді',
    titleRu: 'Малина и клубника в шоколаде',
    shortDescUk: 'Ціла сублімована малина та свіжа відбірна полуниця у бельгійському шоколаді.',
    shortDescRu: 'Целая сублимированная малина и свежая отборная клубника в бельгийском шоколаде.',
    detailedAssortmentUk:
      'Хрустка сублімована малина та полуниця у подвійному шарі молочного, білого та рубінового шоколаду, а також подарункові набори свіжої полуниці, лохини та бананів у шоколаді для романтичних сюрпризів.',
    detailedAssortmentRu:
      'Хрустящая сублимированная малина и клубника в двойном слое молочного, белого и рубинового шоколада, а также подарочные наборы свежей клубники, голубики и бананов в шоколаде для романтических сюрпризов.',
    ingredientsUk: 'Добірні ягоди (сублімовані або свіжі) + 100% бельгійський шоколад Callebaut.',
    ingredientsRu: 'Отборные ягоды (сублимированные или свежие) + 100% бельгийский шоколад Callebaut.',
    shelfLifeUk: 'Сублімовані ягоди — 6 міс., свіжі — 24–36 год',
    shelfLifeRu: 'Сублимированные ягоды — 6 мес., свежие — 24–36 ч',
    imageUrl: 'https://images.unsplash.com/photo-1575372587186-5012f8886b4e?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['crafo-kharkiv', 'yandmi', 'honey-zavertailo', 'frutado'],
  },
  {
    id: 'choco-nuts',
    section: 'chocolate',
    categorySlug: 'horikhy-ta-sukhofrukty-v-shokoladi',
    emoji: '🌰',
    titleUk: 'Горіхи та сухофрукти в шоколаді',
    titleRu: 'Орехи и сухофрукты в шоколаде',
    shortDescUk: 'Фундук, мигдаль, кеш’ю, фісташка, чорнослив та курага у ремісничому шоколаді.',
    shortDescRu: 'Фундук, миндаль, кешью, фисташка, чернослив и курага в ремесленном шоколаде.',
    detailedAssortmentUk:
      'Ремісниче горіхове драже (карамелізований фундук і мигдаль у темному та молочному шоколаді), а також соковитий чорнослив, курага, фінік та інжир з волоським горіхом у натуральній шоколадній оболонці.',
    detailedAssortmentRu:
      'Ремесленное ореховое драже (карамелизированный фундук и миндаль в темном и молочном шоколаде), а также сочный чернослив, курага, финик и инжир с грецким орехом в натуральной шоколадной оболочке.',
    ingredientsUk: 'Цільні обсмажені горіхи, натуральні сухофрукти без консервантів, ремісничий шоколад.',
    ingredientsRu: 'Цельные обжаренные орехи, натуральные сухофрукты без консервантов, ремесленный шоколад.',
    shelfLifeUk: 'До 6 місяців',
    shelfLifeRu: 'До 6 месяцев',
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['crafo-kharkiv', 'yandmi', 'honey-zavertailo', 'shoco-lviv'],
  },
  {
    id: 'choco-sugarfree',
    section: 'chocolate',
    categorySlug: 'bez-tsukru-ta-vegan',
    emoji: '🌿',
    titleUk: 'Шоколад без цукру та Vegan',
    titleRu: 'Шоколад без сахара и Vegan',
    shortDescUk: 'Натуральний шоколад і цукерки на меду, стевії, еритритолі, кокосовому нектарі та керобі.',
    shortDescRu: 'Натуральный шоколад и конфеты на меду, стевии, эритритоле, кокосовом нектаре и кэробе.',
    detailedAssortmentUk:
      'Корисний ремісничий шоколад без білого рафінованого цукру, лактози та глютену. Ідеальний вибір для прихильників ЗОЖ, спортсменів, веганів та людей, які контролюють рівень глікемічного індексу.',
    detailedAssortmentRu:
      'Полезный ремесленный шоколад без белого рафинированного сахара, лактозы и глютена. Идеальный выбор для сторонников ЗОЖ, спортсменов, веганов и людей, контролирующих уровень гликемического индекса.',
    ingredientsUk: 'Терте какао, какао-масло, кокосове або вівсяне молоко, стевія, еритритол, мед або кероб.',
    ingredientsRu: 'Тертое какао, какао-масло, кокосовое или овсяное молоко, стевия, эритритол, мед или кэроб.',
    shelfLifeUk: '6–9 місяців',
    shelfLifeRu: '6–9 месяцев',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['sisters-a', 'yandmi', 'bogi-cacao', 'zhiviy-shokolad'],
  },
  {
    id: 'choco-kids',
    section: 'chocolate',
    categorySlug: 'solodoshchi-dlia-ditei',
    emoji: '🧸',
    titleUk: 'Шоколадні солодощі для дітей',
    titleRu: 'Шоколадные сладости для детей',
    shortDescUk: 'Дитячі шоколадні фігурки, ведмедики, набори без хімії та штучних барвників.',
    shortDescRu: 'Детские шоколадные фигурки, мишки, наборы без химии и искусственных красителей.',
    detailedAssortmentUk:
      'Безпечні дитячі ласощі з чистим складом: шоколадні ведмедики, зайчики, машинки, лоліпопси на паличці з натурального молочного та білого бельгійського шоколаду або керобу (без кофеїну).',
    detailedAssortmentRu:
      'Безопасные детские лакомства с чистым составом: шоколадные мишки, зайчики, машинки, лолипопсы на палочке из натурального молочного и белого бельгийского шоколада или кэроба (без кофеина).',
    ingredientsUk: '100% натуральне какао-масло, цільне молоко, натуральні ягідні порошки замість барвників.',
    ingredientsRu: '100% натуральное какао-масло, цельное молоко, натуральные ягодные порошки вместо красителей.',
    shelfLifeUk: 'До 6 місяців',
    shelfLifeRu: 'До 6 месяцев',
    imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['crafo-kharkiv', 'chocolady', 'wander', 'lvivska-kopalnya'],
  },
];

export const CAKE_VARIANTS: ProductVariantItem[] = [
  {
    id: 'cakes-custom',
    section: 'cakes',
    categorySlug: 'avtorski-torty-ta-deserty',
    emoji: '🎂',
    titleUk: 'Святкові та мусові торти на замовлення',
    titleRu: 'Праздничные и муссовые торты на заказ',
    shortDescUk: 'Дизайнерські мусові торти у шоколадному велюрі, бісквітні іменинні торти з авторським декором.',
    shortDescRu: 'Дизайнерские муссовые торты в шоколадном велюре, бисквитные именинные торты с авторским декором.',
    detailedAssortmentUk:
      'Флагманські святкові торти ручної роботи від 1.5 кг: мусові європейські торти у бельгійському шоколадному велюрі та дзеркальній глазурі, а також класичні багатошарові бісквітні торти з ягідним конфі, фісташкою, манго-маракуйєю та солоною карамеллю.',
    detailedAssortmentRu:
      'Флагманские праздничные торты ручной работы от 1.5 кг: муссовые европейские торты в бельгийском шоколадном велюре и зеркальной глазури, а также классические многослойные бисквитные торты с ягодным конфи, фисташкой, манго-маракуйей и соленой карамелью.',
    ingredientsUk: 'Натуральні вершки 33%, вершкове масло 82.5%, сир Маскарпоне / Філадельфія, бельгійський шоколад, живе пюре ягід.',
    ingredientsRu: 'Натуральные сливки 33%, сливочное масло 82.5%, сыр Маскарпоне / Филадельфия, бельгийский шоколад, живое пюре ягод.',
    shelfLifeUk: '72 години у холодильнику (+2...+6 °C)',
    shelfLifeRu: '72 часа в холодильнике (+2...+6 °C)',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['chebakery-kharkiv', 'bakerstreet-kyiv', 'tortiya-kharkiv', 'manzhosova-patisserie'],
    customDirectUrls: {
      'chebakery-kharkiv': 'https://chebakery.com.ua/cake-gallery',
      'bakerstreet-kyiv': 'https://bakerstreet.ua/catalog/torty',
      'tortiya-kharkiv': 'https://torti.kh.ua/torty-na-zamovlennya/',
      'manzhosova-patisserie': 'https://manzhosova.com',
    },
  },
  {
    id: 'cakes-bento',
    section: 'cakes',
    categorySlug: 'avtorski-torty-ta-deserty',
    emoji: '🍱',
    titleUk: 'Бенто-торти та міні-торти (на 1–3 особи)',
    titleRu: 'Бенто-торты и мини-торты (на 1–3 человека)',
    shortDescUk: 'Стильні міні-тортики 450–600 г у подарунковому боксі зі свічкою та вашим написом.',
    shortDescRu: 'Стильные мини-тортики 450–600 г в подарочном боксе со свечкой и вашей надписью.',
    detailedAssortmentUk:
      'Ідеальний швидкий подарунок-сюрприз: міні-торт вагою 450–650 г у крафтовому ланч-боксі з дерев’яною ложечкою та святковою свічкою. Індивідуальний напис або малюнок кремом за вашим побажанням.',
    detailedAssortmentRu:
      'Идеальный быстрый подарок-сюрприз: мини-торт весом 450–650 г в крафтовом ланч-боксе с деревянной ложечкой и праздничной свечкой. Индивидуальная надпись или рисунок кремом по вашему пожеланию.',
    ingredientsUk: 'Ніжний ванільний або шоколадний бісквіт, крем-чіз на вершках, полунична, вишнева або карамельно-арахісова начинка.',
    ingredientsRu: 'Нежный ванильный или шоколадный бисквит, крем-чиз на сливках, клубничная, вишневая или карамельно-арахисовая начинка.',
    shelfLifeUk: '48–72 години у холодильнику',
    shelfLifeRu: '48–72 часа в холодильнике',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['bakerstreet-kyiv', 'tortiya-kharkiv', 'chebakery-kharkiv', 'syndykat-smaku-kharkiv'],
    customDirectUrls: {
      'bakerstreet-kyiv': 'https://bakerstreet.ua/catalog/bento-torti',
      'tortiya-kharkiv': 'https://torti.kh.ua/bento-torty/',
      'chebakery-kharkiv': 'https://chebakery.com.ua/cake-gallery',
      'syndykat-smaku-kharkiv': 'https://www.tortsvkus.com.ua/torty-pid-zamovlennya/',
    },
  },
  {
    id: 'cakes-kids',
    section: 'cakes',
    categorySlug: 'avtorski-torty-ta-deserty',
    emoji: '🧸',
    titleUk: 'Дитячі святкові торти з натуральним складом',
    titleRu: 'Детские праздничные торты с натуральным составом',
    shortDescUk: 'Яскраві торти на день народження дитини з шоколадними фігурками та безпечним складом.',
    shortDescRu: 'Яркие торты на день рождения ребенка с шоколадными фигурками и безопасным составом.',
    detailedAssortmentUk:
      'Казкові дитячі торти на 1 рік, хрестини та дні народження з їстівними фігурками улюблених героїв із бельгійського шоколаду, пряничними топерами, меренгою та безпечними натуральними барвниками.',
    detailedAssortmentRu:
      'Сказочные детские торты на 1 год, крестины и дни рождения со съедобными фигурками любимых героев из бельгийского шоколада, пряничными топперами, меренгой и безопасными натуральными красителями.',
    ingredientsUk: 'Гіпоалергенні начинки, натуральні вершки, йогуртові муси, сезонні ягоди та фрукти без маргарину.',
    ingredientsRu: 'Гипоаллергенные начинки, натуральные сливки, йогуртовые муссы, сезонные ягоды и фрукты без маргарина.',
    shelfLifeUk: '72 години у холодильнику',
    shelfLifeRu: '72 часа в холодильнике',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['bakerstreet-kyiv', 'tortiya-kharkiv', 'chebakery-kharkiv', 'mamulin-tortyk-kyiv'],
    customDirectUrls: {
      'bakerstreet-kyiv': 'https://bakerstreet.ua/catalog/dityachi-torti',
      'tortiya-kharkiv': 'https://torti.kh.ua/dytiachi-torty/',
      'chebakery-kharkiv': 'https://chebakery.com.ua/cake-gallery',
      'mamulin-tortyk-kyiv': 'https://mamatort.com.ua',
    },
  },
  {
    id: 'cakes-wedding',
    section: 'cakes',
    categorySlug: 'avtorski-torty-ta-deserty',
    emoji: '💍',
    titleUk: 'Весільні, корпоративні та багатоярусні торти',
    titleRu: 'Свадебные, корпоративные и многоярусные торты',
    shortDescUk: 'Розкішні багатоярусні конструкції з доставкою на локацію свята чи банкет.',
    shortDescRu: 'Роскошные многоярусные конструкции с доставкой на локацию праздника или банкет.',
    detailedAssortmentUk:
      'Ексклюзивні весільні та ювілейні торти від 3 до 25 кг: можливість поєднання різних смаків у кожному ярусі, декор живими або шоколадними квітами, велюрове покриття та бережна доставка спеціалізованим транспортом.',
    detailedAssortmentRu:
      'Эксклюзивные свадебные и юбилейные торты от 3 до 25 кг: возможность сочетания разных вкусов в каждом ярусе, декор живыми или шоколадными цветами, велюровое покрытие и бережная доставка специализированным транспортом.',
    ingredientsUk: 'Преміальні інгредієнти ресторанного класу, дегустаційні сети начинок перед замовленням.',
    ingredientsRu: 'Премиальные ингредиенты ресторанного класса, дегустационные сеты начинок перед заказом.',
    shelfLifeUk: '72 години у холодильнику',
    shelfLifeRu: '72 часа в холодильнике',
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['chebakery-kharkiv', 'manzhosova-patisserie', 'bakerstreet-kyiv', 'torts-ua-dnipro'],
    customDirectUrls: {
      'chebakery-kharkiv': 'https://chebakery.com.ua/cake-gallery',
      'manzhosova-patisserie': 'https://manzhosova.com',
      'bakerstreet-kyiv': 'https://bakerstreet.ua/catalog/vesilni-torti',
      'torts-ua-dnipro': 'https://torts.ua',
    },
  },
  {
    id: 'cakes-pastry',
    section: 'cakes',
    categorySlug: 'avtorski-torty-ta-deserty',
    emoji: '🧁',
    titleUk: 'Макарони, мусові тістечка, еклери та кенді-бар',
    titleRu: 'Макароны, муссовые пирожные, эклеры и кэнди-бар',
    shortDescUk: 'Французькі макарони, тістечка шу, еклери, капкейки та порційні десерти у боксах.',
    shortDescRu: 'Французские макароны, пирожные шу, эклеры, капкейки и порционные десерты в боксах.',
    detailedAssortmentUk:
      'Подарункові сети французьких макаронів на мигдальному борошні з ганашем із бельгійського шоколаду та сиру Дорблю, заварні еклери, тістечка шу, капкейки з логотипом або фотодруком для свят і корпоративів.',
    detailedAssortmentRu:
      'Подарочные сеты французских макаронов на миндальной муке с ганашем из бельгийского шоколада и сыра Дорблю, заварные эклеры, пирожные шу, капкейки с логотипом или фотопечатью для праздников и корпоративов.',
    ingredientsUk: 'Мигдальне борошно дрібного помелу, бельгійський шоколад, натуральні фруктові пюре Boiron.',
    ingredientsRu: 'Миндальная мука мелкого помола, бельгийский шоколад, натуральные фруктовые пюре Boiron.',
    shelfLifeUk: 'Від 3 до 7 діб',
    shelfLifeRu: 'От 3 до 7 суток',
    imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['bakerstreet-kyiv', 'chebakery-kharkiv', 'cupcake-studio', 'manzhosova-patisserie'],
    customDirectUrls: {
      'bakerstreet-kyiv': 'https://bakerstreet.ua/catalog/deserty',
      'chebakery-kharkiv': 'https://chebakery.com.ua/cake-gallery',
      'cupcake-studio': 'https://cupcake.com.ua',
      'manzhosova-patisserie': 'https://manzhosova.com',
    },
  },
];

export const ZEFIR_VARIANTS: ProductVariantItem[] = [
  {
    id: 'zefir-bouquets',
    section: 'zefir',
    categorySlug: 'kraftovyi-zefir-ta-bukety',
    emoji: '💐',
    titleUk: 'Зефірні букети (півонії, троянди, тюльпани)',
    titleRu: 'Зефирные букеты (пионы, розы, тюльпаны)',
    shortDescUk: 'Розкішні їстівні букети з реалістичних зефірних квітів ручної роботи у коробках та букетах.',
    shortDescRu: 'Роскошные съедобные букеты из реалистичных зефирных цветов ручной работы в коробках и букетах.',
    detailedAssortmentUk:
      'Справжнє мистецтво зефірної флористики: кожна пелюстка півонії, троянди, гортензії чи тюльпана відсаджується майстром вручну з повітряного ягідно-яблучного зефіру. Букет виглядає як живі квіти і водночас є ніжним натуральним десертом.',
    detailedAssortmentRu:
      'Настоящее искусство зефирной флористики: каждый лепесток пиона, розы, гортензии или тюльпана отсаживается мастером вручную из воздушного ягодно-яблочного зефира. Букет выглядит как живые цветы и одновременно является нежным натуральным десертом.',
    ingredientsUk: 'Пюре запечених яблук та свіжих ягід власного виробництва, витяжка з морських водоростей (агар-агар), пастеризований білок.',
    ingredientsRu: 'Пюре запеченных яблок и свежих ягод собственного производства, вытяжка из морских водорослей (агар-агар), пастеризованный белок.',
    shelfLifeUk: '7–14 днів у герметичному пакуванні',
    shelfLifeRu: '7–14 дней в герметичной упаковке',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['piolli-zefir', 'charivnyi-zefir', 'artzefir-ua', 'zefiroly-dnipro'],
    customDirectUrls: {
      'piolli-zefir': 'https://piolli.com.ua/shop/cat/zefirni-buketi-ta-koshiki',
      'charivnyi-zefir': 'https://www.charivnyi-zefir.com',
      'artzefir-ua': 'https://artzefir.com',
      'zefiroly-dnipro': 'https://zefiroly.com',
    },
  },
  {
    id: 'zefir-boxes',
    section: 'zefir',
    categorySlug: 'kraftovyi-zefir-ta-bukety',
    emoji: '🌸',
    titleUk: 'Натуральний ягідний та фруктовий зефір у боксах',
    titleRu: 'Натуральный ягодный и фруктовый зефир в боксах',
    shortDescUk: 'Повітряні завитки зефіру з малини, смородини, манго-маракуйї, обліпихи та лаванди.',
    shortDescRu: 'Воздушные завитки зефира из малины, смородины, манго-маракуйи, облепихи и лаванды.',
    detailedAssortmentUk:
      'Подарункові коробки класичного крафтового зефіру на 6, 9, 12 та 24 штуки з яскравими природними смаками: чорна смородина, малина, полуниця-шампанське, манго-маракуйя, пряна груша з дорблю, кава-бейліс та лаванда-чорниця.',
    detailedAssortmentRu:
      'Подарочные коробки классического крафтового зефира на 6, 9, 12 и 24 штуки с яркими природными вкусами: черная смородина, малина, клубника-шампанское, манго-маракуйя, пряная груша с дорблю, кофе-бейлис и лаванда-черника.',
    ingredientsUk: '100% натуральне фруктово-ягідне пюре, агар-агар, знижений вміст цукру, без штучних консервантів.',
    ingredientsRu: '100% натуральное фруктово-ягодное пюре, агар-агар, сниженное содержание сахара, без искусственных консервантов.',
    shelfLifeUk: '10–14 днів при кімнатній температурі',
    shelfLifeRu: '10–14 дней при комнатной температуре',
    imageUrl: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['charivnyi-zefir', 'zefiroly-dnipro', 'glam-zefyr', 'ginger-pastila-lviv'],
    customDirectUrls: {
      'charivnyi-zefir': 'https://www.charivnyi-zefir.com',
      'zefiroly-dnipro': 'https://zefiroly.com',
      'glam-zefyr': 'https://zefir.com.ua',
      'ginger-pastila-lviv': 'https://ginger.org.ua',
    },
  },
  {
    id: 'zefir-chocolate',
    section: 'zefir',
    categorySlug: 'kraftovyi-zefir-ta-bukety',
    emoji: '🍫',
    titleUk: 'Зефір у бельгійському шоколаді та зефіро-сендвічі',
    titleRu: 'Зефир в бельгийском шоколаде и зефиро-сэндвичи',
    shortDescUk: 'Ніжний ягідний зефір у хрумкому корпусі зі справжнього бельгійського шоколаду Callebaut.',
    shortDescRu: 'Нежный ягодный зефир в хрустящем корпусе из настоящего бельгийского шоколада Callebaut.',
    detailedAssortmentUk:
      'Улюблений формат гурманів: пухкий домашній зефір із ягідною кислинкою, глазурований тонким шаром справжнього темного або молочного бельгійського шоколаду Callebaut, а також трендові зефіро-сендвічі на пісочному сабле.',
    detailedAssortmentRu:
      'Любимый формат гурманов: пышный домашний зефир с ягодной кислинкой, глазированный тонким слоем настоящего темного или молочного бельгийского шоколада Callebaut, а также трендовые зефиро-сэндвичи на песочном сабле.',
    ingredientsUk: 'Натуральний ягідний зефір на агар-агарі + 100% бельгійський кувертюр Barry Callebaut.',
    ingredientsRu: 'Натуральный ягодный зефир на агар-агаре + 100% бельгийский кувертюр Barry Callebaut.',
    shelfLifeUk: '14–21 день',
    shelfLifeRu: '14–21 день',
    imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['charivnyi-zefir', 'zefiroly-dnipro', 'glam-zefyr', 'marshmallow-com-ua'],
    customDirectUrls: {
      'charivnyi-zefir': 'https://www.charivnyi-zefir.com',
      'zefiroly-dnipro': 'https://zefiroly.com',
      'glam-zefyr': 'https://zefir.com.ua',
      'marshmallow-com-ua': 'https://marshmallow.com.ua',
    },
  },
  {
    id: 'zefir-pastila',
    section: 'zefir',
    categorySlug: 'kraftovyi-zefir-ta-bukety',
    emoji: '🌿',
    titleUk: 'Зефір без цукру, натуральна пастила та фріпси',
    titleRu: 'Зефир без сахара, натуральная пастила и фрипсы',
    shortDescUk: 'Ягідна пастила без цукру, фруктові чіпси та легкий дієтичний зефір для дітей та ЗОЖ.',
    shortDescRu: 'Ягодная пастила без сахара, фруктовые чипсы и легкий диетический зефир для детей и ЗОЖ.',
    detailedAssortmentUk:
      '100% натуральна реміснича пастила з печених яблук і лісових ягід, висушена при бережній температурі до 45 °C для збереження всіх вітамінів, хрусткі фруктові фріпси та легкий зефір на еритритолі/стевії.',
    detailedAssortmentRu:
      '100% натуральная ремесленная пастила из печеных яблок и лесных ягод, высушенная при бережной температуре до 45 °C для сохранения всех витаминов, хрустящие фруктовые фрипсы и легкий зефир на эритритоле/стевии.',
    ingredientsUk: 'Тільки свіжі українські ягоди та фрукти без доданого білого цукру, барвників і глютену.',
    ingredientsRu: 'Только свежие украинские ягоды и фрукты без добавленного белого сахара, красителей и глютена.',
    shelfLifeUk: 'Пастила та фріпси — до 6 місяців',
    shelfLifeRu: 'Пастила и фрипсы — до 6 месяцев',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=85',
    preferredMakerIds: ['ginger-pastila-lviv', 'charivnyi-zefir', 'zefiroly-dnipro', 'piolli-zefir'],
    customDirectUrls: {
      'ginger-pastila-lviv': 'https://ginger.org.ua',
      'charivnyi-zefir': 'https://www.charivnyi-zefir.com',
      'zefiroly-dnipro': 'https://zefiroly.com',
      'piolli-zefir': 'https://piolli.com.ua/shop/cat/zefirni-buketi-ta-koshiki',
    },
  },
];

export const ALL_SECTION_VARIANTS: Record<Exclude<MacroSectionId, 'home'>, ProductVariantItem[]> = {
  chocolate: CHOCOLATE_VARIANTS,
  cakes: CAKE_VARIANTS,
  zefir: ZEFIR_VARIANTS,
};
