// Auto-discovered & HTTP-verified direct links to category pages on makers' websites.
// Manual `categoryUrls` in chocolateData.ts always take priority over these.
import type { CategorySlug } from './chocolateData';

export const DISCOVERED_CATEGORY_URLS: Record<string, Partial<Record<Exclude<CategorySlug, 'all'>, string>>> = {
  "sisters-a": {
    "plytky-shokoladu": "https://sisterschocolate.com/product-category/miniplytky/",
    "bez-tsukru-ta-vegan": "https://sisterschocolate.com/product-category/kraftovuj-molochnyy-shokolad-vegan/",
  },
  "chebakery-kharkiv": {
    "avtorski-torty-ta-deserty": "https://chebakery.com.ua/minicake",
  },
  "yandmi": {
    "plytky-shokoladu": "https://yandmi.com/catalog/plytky",
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://yandmi.com/catalog/drazhe",
    "malyna-ta-polunytsia-v-shokoladi": "https://yandmi.com/catalog/frukty-yahody-u-shokoladi",
  },
  "ecojoy": {
    "shokoladni-kvity-ta-bukety": "https://ecojoy.com.ua/ua/shokoladni-buketi/shokoladnyj-buket-iz-kvitiv-artemida/",
  },
  "bakerstreet-kyiv": {
    "avtorski-torty-ta-deserty": "https://bakerstreet.ua/catalog/bento-torti",
    "solodoshchi-dlia-ditei": "https://bakerstreet.ua/catalog/dityachi-torti",
  },
  "bogi-cacao": {
    "plytky-shokoladu": "https://bogicacao.com.ua/product-category/chocolate/",
    "korpusni-ta-rozmalovani-tsukerky": "https://bogicacao.com.ua/product-category/tsukerky/",
  },
  "meetty": {
    "plytky-shokoladu": "https://meettychocolate.com/product-category/%d1%88%d0%be%d0%ba%d0%be%d0%bb%d0%b0%d0%b4%d0%bd%d1%96-%d0%bf%d0%bb%d0%b8%d1%82%d0%ba%d0%b8/",
  },
  "candy-coupe-buffet": {
    "korpusni-ta-rozmalovani-tsukerky": "https://candybuffet.kiev.ua/shop/candies/",
    "shokoladni-kvity-ta-bukety": "https://candybuffet.kiev.ua/shop/chocolate/choco-magic-kvity-1/",
    "plytky-shokoladu": "https://candybuffet.kiev.ua/shop/shokoladni-plytky-chocolate/",
  },
  "honey-zavertailo": {
    "malyna-ta-polunytsia-v-shokoladi": "https://honeykyiv.com/product-category/yagody-v-shokoladi",
    "korpusni-ta-rozmalovani-tsukerky": "https://honeykyiv.com/product-category/shokolad",
  },
  "ginger-pastila-lviv": {
    "kraftovyi-zefir-ta-bukety": "https://ginger.org.ua/shop/pastila-asorti/",
  },
  "vatsak": {
    "avtorski-torty-ta-deserty": "https://vatsak.com.ua/cakes/",
  },
  "stimul": {
    "kraftovyi-zefir-ta-bukety": "https://stimulsweet.com/product-marshmallow/",
  },
  "myzo": {
    "plytky-shokoladu": "https://myzo.com.ua/products/gift-set-bean-to-bar-6-bars",
  },
  "wander": {
    "plytky-shokoladu": "https://wander.boutique/product/shokoladna-plytka-bigwan-fistashka-kataifi",
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://wander.boutique/store/drazhe",
  },
  "shoco-lviv": {
    "korpusni-ta-rozmalovani-tsukerky": "https://shoco.ua/product-category/avtorski-czukerky/",
  },
  "healthy-choice": {
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://healthychoice.ua/product-category/drazhe/",
  },
  "chocobox-kyiv": {
    "shokoladni-kvity-ta-bukety": "https://chocobox.com.ua/bouquets-flowers",
  },
  "cukorka-volyn": {
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://cukorka.com.ua/catalog/tsukerky/suhofrukty/",
    "korpusni-ta-rozmalovani-tsukerky": "https://cukorka.com.ua/catalog/tsukerky/multyzlakovi-cukerky/",
  },
  "glam-zefyr": {
    "kraftovyi-zefir-ta-bukety": "https://zefir.com.ua/buketi",
    "solodoshchi-dlia-ditei": "https://zefir.com.ua/dityachi",
  },
  "tortiya-kharkiv": {
    "avtorski-torty-ta-deserty": "http://torti.kh.ua/gotovye-torty-v-kharkove",
    "solodoshchi-dlia-ditei": "http://torti.kh.ua/detskie-torty-na-zakaz-v-harkove",
  },
  "torts-ua-dnipro": {
    "avtorski-torty-ta-deserty": "https://torts.ua/product-category/premuim_desserts/",
  },
  "spell": {
    "plytky-shokoladu": "https://spellchocolate.com/our-productions/plitki-shokoladu/chocolate-bars-with-coconut",
    "korpusni-ta-rozmalovani-tsukerky": "https://spellchocolate.com/our-productions/seti-cukerok/cukerku-tortu",
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://spellchocolate.com/our-productions/drazhe-ta-suhofrukti/dried-fruits",
  },
  "nptruffles": {
    "korpusni-ta-rozmalovani-tsukerky": "https://www.nptruffles.in.ua/product/kraftovi-syrni-tsukerky-6-sht/",
  },
  "nomer-doma": {
    "korpusni-ta-rozmalovani-tsukerky": "https://nomerdomu.com.ua/product-category/sweets/",
  },
  "panfruit": {
    "malyna-ta-polunytsia-v-shokoladi": "https://panfruit.ua/products/freeze-dried-strawberry",
  },
  "syndykat-smaku-kharkiv": {
    "avtorski-torty-ta-deserty": "https://www.tortsvkus.com.ua/torty-pid-zamovlennya/",
  },
  "sweets-kharkiv": {
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://sweets.net.ua/ua/g86589895-orehi-suhofrukty-shokolade",
  },
  "choconel-lutsk": {
    "korpusni-ta-rozmalovani-tsukerky": "https://choconel.com.ua/product-category/tsukerky-ruchno-roboty",
    "plytky-shokoladu": "https://choconel.com.ua/product-category/shokoladni-plytky",
  },
  "aimant": {
    "korpusni-ta-rozmalovani-tsukerky": "https://www.aimant.ua/ua/products/bonbons",
  },
  "afrodiziak": {
    "plytky-shokoladu": "https://afrodiziak-chocolate.com.ua/shop/cat/plitki-shokoladu",
    "korpusni-ta-rozmalovani-tsukerky": "https://afrodiziak-chocolate.com.ua/shop/cat/cukerki",
  },
  "chocolady": {
    "shokoladni-kvity-ta-bukety": "https://www.chocolady.com.ua/figuri-iz-shokoladu/lyubov-romantika-kviti",
    "korpusni-ta-rozmalovani-tsukerky": "https://www.chocolady.com.ua/shokoladni-podarunki/cukerki-ruchnoj-roboti-nabori",
    "solodoshchi-dlia-ditei": "https://www.chocolady.com.ua/figuri-iz-shokoladu/dityam",
  },
  "asal-ukraine": {
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://asal.com.ua/katalog-tovarov/orehi/sumish-gorikhiv-i-sukhofruktiv-baby/",
  },
  "lviv-workshop": {
    "korpusni-ta-rozmalovani-tsukerky": "https://www.chocolate.lviv.ua/product/nabir-tsukerok-trufeliada",
    "plytky-shokoladu": "https://www.chocolate.lviv.ua/category/tablets/chocolate-bars",
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://www.chocolate.lviv.ua/category/dragees/chocolate-dragees",
    "solodoshchi-dlia-ditei": "https://www.chocolate.lviv.ua/collection/kids-collection",
  },
  "yaro-sunfill": {
    "korpusni-ta-rozmalovani-tsukerky": "https://sunfill.ua/candies",
    "solodoshchi-dlia-ditei": "https://sunfill.ua/for-children",
  },
  "amelia-dnipro": {
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://ameliasweet.com.ua/product-category/dried-fruits-in-chocolate/",
    "korpusni-ta-rozmalovani-tsukerky": "https://ameliasweet.com.ua/product-category/premium-line-of-candies/",
  },
  "craftchocolate-ua": {
    "plytky-shokoladu": "https://www.craftchocolate.com.ua/product-category/shokoladni-plytky/",
    "korpusni-ta-rozmalovani-tsukerky": "https://www.craftchocolate.com.ua/product-category/tryufeli/",
    "horikhy-ta-sukhofrukty-v-shokoladi": "https://www.craftchocolate.com.ua/product-category/suhofrukty-v-shokoladi/",
  },
  "cupcake-studio": {
    "avtorski-torty-ta-deserty": "https://cupcake.com.ua/info/torti-na-zamovlennya-v-kievi/torti-dityachi/",
  },
  "sweet-chef": {
    "avtorski-torty-ta-deserty": "https://sweetchef.com.ua/bento-tort-ukraina",
  },
  "kombinat-bakery": {
    "avtorski-torty-ta-deserty": "https://kmbnt.com.ua/bento-torty/",
  },
  "marshmallow-com-ua": {
    "kraftovyi-zefir-ta-bukety": "https://marshmallow.com.ua/production/zefir/",
  },
  "millennium-chocolate": {
    "korpusni-ta-rozmalovani-tsukerky": "https://millennium-chocolate.com/products/tsukerki-millennium-cocktail-truffle-collection",
  },
  "pure-taste": {
    "plytky-shokoladu": "https://pure-taste.com.ua/batonchyty-ta-krokany",
  },
  "dobroizh-sumy": {
    "bez-tsukru-ta-vegan": "https://dobroizh.com.ua/ua/p1682700490-positive-halva-kerob.html",
    "plytky-shokoladu": "https://dobroizh.com.ua/ua/g110719685-poleznyj-batonchik-dobroyizh",
  },
  "shokoladno-kharkiv": {
    "korpusni-ta-rozmalovani-tsukerky": "https://shokoladno.com.ua/category/catalog/candies/praline-candies/",
  },
};
