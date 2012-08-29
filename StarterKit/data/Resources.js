var Ratio = Ratio || {};

Ratio.Resources = function () {
    "use strict";

    var Resources = { featured: {}, counts: {} };
    //hardcoding for now - will move to json db later, then update when collections are added

    Resources.counts.recipes = 2059; //<--TODO: WHAT IS THE TOTAL AMOUNT OF RECIPES???
    Resources.counts.dish = 1422;
    Resources.counts.ingredient = 2059;
    Resources.counts.theme = 2059;
    Resources.counts.cuisine = 649;
    Resources.counts.occasion = 1539;
    Resources.counts.brand = 1269;

    Resources.featured.recipes = [1280004405, 1280005530, 1280011535, 1280006755, 1280003825, 1280003385, 1280010915, 1280005465, 1280005080, 1280014955, 1280014135, 1280005615, 1280002815, 1280014925, 1280012730, 1280002985, 1280015310, 1280010530, 1280011110, 1280009055, 1280019395, 1280002065, 1280006070, 1280006715];
    Resources.featured.spotlightRecipes = [1280003310, 1280013765, 1280015890, 1280021800];//[1280021800, 1280013365, 1280005485, 1280006625];//, 1280001910];
    Resources.featured.dishRecipes = [1280005080, 1280014955, 1280014135, 1280005615];
    Resources.featured.ingredientRecipes = [1280002815, 1280014925, 1280012730, 1280002985];
    Resources.featured.themeRecipes = [1280019395, 1280002065, 1280006070, 1280006715];
    Resources.featured.cuisineRecipes = [1280004405, 1280005530, 1280010915, 1280005465];
    Resources.featured.occasionRecipes = [1280015310, 1280010530, 1280011110, 1280009055];
    Resources.featured.brandRecipes = [1280011535, 1280006755, 1280003825, 1280003385];

    // map of image assets to db ids

    //Alphabetical list of filters for "Dish"
    Resources.dish = [
{ _id: 1, title: "Appetizers & Snacks", uri: "/assets/images/dish/appetizersSnacks.jpg", count: "190 recipes" },
{ _id: 3, title: "Beverages", uri: "/assets/images/dish/beverages.jpg", count: "26 recipes" },
{ _id: 9, title: "Breakfasts & Brunches", uri: "/assets/images/dish/breakfastsBrunches.jpg", count: "65 recipes" },
{ _id: 4, title: "Desserts", uri: "/assets/images/dish/desserts.jpg", count: "234 recipes" },
{ _id: 2, title: "Main Dishes", uri: "/assets/images/dish/mainDishes.jpg", count: "451 recipes" },
{ _id: 8, title: "Salads", uri: "/assets/images/dish/salads.jpg", count: "55 recipes" },
{ _id: 6, title: "Sandwiches", uri: "/assets/images/dish/sandwiches.jpg", count: "76 recipes" },
{ _id: 5, title: "Side Dishes", uri: "/assets/images/dish/sideDishes.jpg", count: "177 recipes" },
{ _id: 7, title: "Soups, Stews, & Chilis", uri: "/assets/images/dish/soupsStewsChilis.jpg", count: "148 recipes" }
    ];

    //Alphabetical list of filters for "Ingredients"
    Resources.ingredient = [
{ _id: 9, title: "Beans", uri: "/assets/images/ingredient/beans.jpg", count: "122 recipes" },
{ _id: 6, title: "Beef & Lamb", uri: "/assets/images/ingredient/beefLamb.jpg", count: "202 recipes" },
{ _id: 7, title: "Chocolate", uri: "/assets/images/ingredient/chocolate.jpg", count: "177 recipes" },
{ _id: 3, title: "Eggs", uri: "/assets/images/ingredient/eggs.jpg", count: "49 recipes" },
{ _id: 8, title: "Fruit", uri: "/assets/images/ingredient/fruit.jpg", count: "213 recipes" },
{ _id: 10, title: "Pasta", uri: "/assets/images/ingredient/pasta.jpg", count: "183 recipes" },
{ _id: 2, title: "Pork", uri: "/assets/images/ingredient/pork.jpg", count: "184 recipes" },
{ _id: 4, title: "Potatoes", uri: "/assets/images/ingredient/potatoes.jpg", count: "111 recipes" },
{ _id: 1, title: "Poultry", uri: "/assets/images/ingredient/poultry.jpg", count: "290 recipes" },
{ _id: 11, title: "Rice", uri: "/assets/images/ingredient/rice.jpg", count: "171 recipes" },
{ _id: 12, title: "Seafood", uri: "/assets/images/ingredient/seafood.jpg", count: "74 recipes" },
{ _id: 5, title: "Vegetables", uri: "/assets/images/ingredient/vegetables.jpg", count: "392 recipes" }
    ];

    //Alphabetical list of filters for "Theme"
    Resources.theme = [
{ _id: 6, title: "6 Ingredients or Less", uri: "/assets/images/theme/6IngredientsOrLess.jpg", count: "457 recipes" },
{ _id: 2, title: "30-Minute Recipes", uri: "/assets/images/theme/30MinuteRecipes.jpg", count: "248 recipes" },
{ _id: 15, title: "Bake", uri: "/assets/images/theme/bake.jpg", count: "506 recipes" },
{ _id: 14, title: "Broil", uri: "/assets/images/theme/broil.jpg", count: "19 recipes" },
//{ _id: 18, title: "Casserole", uri: "/assets/images/theme/.jpg", count: "147 recipes" },
{ _id: 16, title: "Casseroles", uri: "/assets/images/theme/casserole.jpg", count: "139 recipes" },
//{ _id: 11, title: "Frozen", uri: "/assets/images/theme/.jpg", count: "31 recipes" },
//{ _id: 5, title: "Gourmet", uri: "/assets/images/theme/.jpg", count: "600 recipes" },
{ _id: 1, title: "Grill", uri: "/assets/images/theme/grill.jpg", count: "120 recipes" },
//{ _id: 4, title: "Grill/BBQ", uri: "/assets/images/theme/.jpg", count: "135 recipes" },
{ _id: 8, title: "Kid-Friendly", uri: "/assets/images/theme/kidFriendly.jpg", count: "195 recipes" },
//{ _id: 3, title: "Kids", uri: "/assets/images/theme/.jpg", count: "315 recipes" },
//{ _id: 10, title: "Microwave", uri: "/assets/images/theme/.jpg", count: "17 recipes" },
{ _id: 12, title: "No-Bake Desserts", uri: "/assets/images/theme/noBakeDesserts.jpg", count: "63 recipes" },
{ _id: 9, title: "One-Dish", uri: "/assets/images/theme/oneDish.jpg", count: "414 recipes" },
{ _id: 13, title: "Slow Cooker", uri: "/assets/images/theme/slowCooker.jpg", count: "114 recipes" },
{ _id: 7, title: "Stir-Fry", uri: "/assets/images/theme/stirFry.jpg", count: "34 recipes" },
{ _id: 17, title: "Vegetarian", uri: "/assets/images/theme/vegetarian.jpg", count: "137 recipes" }
    ];

    //Alphabetical list of filters for "Cuisine"
    Resources.cuisine = [
{ _id: 6, title: "Asian", uri: "/assets/images/cuisine/asian.jpg", count: "59 recipes" },
{ _id: 2, title: "Chinese", uri: "/assets/images/cuisine/chinese.jpg", count: "25 recipes" },
{ _id: 9, title: "European", uri: "/assets/images/cuisine/european.jpg", count: "47 recipes" },
{ _id: 5, title: "French", uri: "/assets/images/cuisine/french.jpg", count: "45 recipes" },
{ _id: 8, title: "Islands", uri: "/assets/images/cuisine/islands.jpg", count: "28 recipes" },
{ _id: 10, title: "Italian", uri: "/assets/images/cuisine/italian.jpg", count: "180 recipes" },
{ _id: 3, title: "Mediterranean", uri: "/assets/images/cuisine/mediterranean.jpg", count: "35 recipes" },
{ _id: 1, title: "Mexican", uri: "/assets/images/cuisine/mexican.jpg", count: "103 recipes" },
{ _id: 4, title: "Southern", uri: "/assets/images/cuisine/southern.jpg", count: "23 recipes" },
{ _id: 7, title: "Southwestern", uri: "/assets/images/cuisine/southwestern.jpg", count: "104 recipes" }
    ];

    //Alphabetical list of filters for "Occasion"
    Resources.occasion = [
{ _id: 6, title: "Birthday", uri: "/assets/images/occasion/birthday.jpg", count: "81 recipes" },
{ _id: 10, title: "Christmas", uri: "/assets/images/occasion/christmas.jpg", count: "123 recipes" },
{ _id: 9, title: "Cinco de Mayo", uri: "/assets/images/occasion/cincoDeMayo.jpg", count: "89 recipes" },
{ _id: 8, title: "Easter", uri: "/assets/images/occasion/easter.jpg", count: "39 recipes" },
{ _id: 7, title: "Fall", uri: "/assets/images/occasion/fall.jpg", count: "355 recipes" },
{ _id: 3, title: "Halloween", uri: "/assets/images/occasion/halloween.jpg", count: "26 recipes" },
{ _id: 2, title: "Spring", uri: "/assets/images/occasion/spring.jpg", count: "355 recipes" },
{ _id: 11, title: "St. Patrick's Day", uri: "/assets/images/occasion/stPatricksDay.jpg", count: "8 recipes" },
{ _id: 4, title: "Thanksgiving", uri: "/assets/images/occasion/thanksgiving.jpg", count: "127 recipes" },
{ _id: 5, title: "Valentine's Day", uri: "/assets/images/occasion/valentinesDay.jpg", count: "36 recipes" },
{ _id: 1, title: "Winter", uri: "/assets/images/occasion/winter.jpg", count: "300 recipes" }
    ];

    //Alphabetical list of filters for "Brand"
    Resources.brand = [
{ _id: 45, title: "Campbell's<sup>®</sup>", uri: "/assets/images/brand/campbells.jpg", count: "89 recipes" },
{ _id: 44, title: "Carnation<sup>®</sup>", uri: "/assets/images/brand/carnation.jpg", count: "25 recipes" },
{ _id: 38, title: "Contadina<sup>®</sup>", uri: "/assets/images/brand/contadina.jpg", count: "23 recipes" },
{ _id: 19, title: "Cream of Wheat<sup>®</sup>", uri: "/assets/images/brand/creamOfWheat.jpg", count: "14 recipes" },
{ _id: 26, title: "Crock-Pot<sup>®</sup>", uri: "/assets/images/brand/crockPot.jpg", count: "80 recipes" },
{ _id: 54, title: "Cure 81<sup>®</sup>", uri: "/assets/images/brand/cure81.jpg", count: "13 recipes" },
{ _id: 2, title: "Del Monte<sup>®</sup>", uri: "/assets/images/brand/delMonte.jpg", count: "25 recipes" },
{ _id: 53, title: "Fleischmann's<sup>®</sup>", uri: "/assets/images/brand/fleischmanns.jpg", count: "16 recipes" },
{ _id: 7, title: "Frank's<sup>®</sup> RedHot<sup>®</sup>", uri: "/assets/images/brand/franksRedHot.jpg", count: "34 recipes" },
{ _id: 1, title: "French's<sup>®</sup> French Fried Onions", uri: "/assets/images/brand/frenchsFrenchFriedOnions.jpg", count: "32 recipes" },
{ _id: 51, title: "French's<sup>®</sup> Mustard", uri: "/assets/images/brand/frenchsMustard.jpg", count: "30 recipes" },
{ _id: 4, title: "Healthy Request<sup>®</sup> Soups", uri: "/assets/images/brand/healthyRequestSoups.jpg", count: "5 recipes" },
{ _id: 31, title: "Heinz<sup>®</sup>", uri: "/assets/images/brand/heinz.jpg", count: "3 recipes" },
{ _id: 23, title: "Hellmann's<sup>®</sup>", uri: "/assets/images/brand/hellmanns.jpg", count: "18 recipes" },
{ _id: 10, title: "Herb-Ox<sup>®</sup>", uri: "/assets/images/brand/herbOx.jpg", count: "1 recipe" },
{ _id: 43, title: "Hershey'<sup>®</sup>s", uri: "/assets/images/brand/hersheys.jpg", count: "65 recipes" },
{ _id: 13, title: "Hormel<sup>®</sup>", uri: "/assets/images/brand/hormel.jpg", count: "1 recipe" },
{ _id: 49, title: "I Can't Believe It's Not Butter!<sup>®</sup>", uri: "/assets/images/brand/iCantBelieveItsNotButter.jpg", count: "16 recipes" },
{ _id: 39, title: "Jennie-O Turkey Store<sup>®</sup>", uri: "/assets/images/brand/jennieOTurkeyStore.jpg", count: "9 recipes" },
{ _id: 25, title: "Johnsonville<sup>®</sup>", uri: "/assets/images/brand/johnsonville.jpg", count: "16 recipes" },
{ _id: 36, title: "Karo<sup>®</sup>", uri: "/assets/images/brand/karo.jpg", count: "17 recipes" },
{ _id: 52, title: "KitchenAid<sup>®</sup>", uri: "/assets/images/brand/kitchenAid.jpg", count: "23 recipes" },
{ _id: 27, title: "Knorr<sup>®</sup>", uri: "/assets/images/brand/knorr.jpg", count: "4 recipes" },
{ _id: 6, title: "Kozy Shack<sup>®</sup>", uri: "/assets/images/brand/kozyShack.jpg", count: "3 recipes" },
{ _id: 47, title: "Libby's<sup>®</sup>", uri: "/assets/images/brand/libbys.jpg", count: "22 recipes" },
{ _id: 18, title: "Lipton<sup>®</sup> Recipe Secrets<sup>®</sup>", uri: "/assets/images/brand/liptonRecipeSecrets.jpg", count: "33 recipes" },
{ _id: 16, title: "Minute<sup>®</sup>", uri: "/assets/images/brand/minute.jpg", count: "4 recipes" },
{ _id: 22, title: "Nestlé<sup>®</sup>", uri: "/assets/images/brand/nestle.jpg", count: "58 recipes" },
{ _id: 41, title: "Ortega<sup>®</sup>", uri: "/assets/images/brand/ortega.jpg", count: "43 recipes" },
{ _id: 46, title: "Oster<sup>®</sup>", uri: "/assets/images/brand/oster.jpg", count: "5 recipes" },
{ _id: 35, title: "Pace<sup>®</sup>", uri: "/assets/images/brand/pace.jpg", count: "47 recipes" },
{ _id: 57, title: "Pasta-A-Roni<sup>®</sup>", uri: "/assets/images/brand/pastaARoni.jpg", count: "10 recipes" },
{ _id: 24, title: "Pepperidge Farm<sup>®</sup>", uri: "/assets/images/brand/pepperidgeFarm.jpg", count: "44 recipes" },
{ _id: 30, title: "Polaner<sup>®</sup>", uri: "/assets/images/brand/polaner.jpg", count: "11 recipes" },
{ _id: 32, title: "Prego<sup>®</sup>", uri: "/assets/images/brand/prego.jpg", count: "29 recipes" },
{ _id: 5, title: "Quaker<sup>®</sup>", uri: "/assets/images/brand/quaker.jpg", count: "44 recipes" },
{ _id: 9, title: "Ragú<sup>®</sup>", uri: "/assets/images/brand/ragu.jpg", count: "39 recipes" },
{ _id: 34, title: "Reynolds<sup>®</sup>", uri: "/assets/images/brand/reynolds.jpg", count: "52 recipes" },
{ _id: 56, title: "Rice-A-Roni<sup>®</sup>", uri: "/assets/images/brand/riceARoni.jpg", count: "16 recipes" },
{ _id: 50, title: "Sargento<sup>®</sup>", uri: "/assets/images/brand/sargento.jpg", count: "24 recipes" },
{ _id: 20, title: "SeaPak<sup>®</sup>", uri: "/assets/images/brand/seaPak.jpg", count: "8 recipes" },
{ _id: 11, title: "Simply Potatoes<sup>®</sup>", uri: "/assets/images/brand/simplyPotatoes.jpg", count: "4 recipes" },
{ _id: 28, title: "Skippy<sup>®</sup>", uri: "/assets/images/brand/skippy.jpg", count: "2 recipes" },
{ _id: 42, title: "Spam<sup>®</sup>", uri: "/assets/images/brand/spam.jpg", count: "11 recipes" },
{ _id: 14, title: "StarKist<sup>®</sup>", uri: "/assets/images/brand/starKist.jpg", count: "27 recipes" },
{ _id: 12, title: "Stonyfield Farm<sup>®</sup>", uri: "/assets/images/brand/stonyfieldFarm.jpg", count: "1 recipe" },
{ _id: 8, title: "Success<sup>®</sup>", uri: "/assets/images/brand/success.jpg", count: "34 recipes" },
{ _id: 33, title: "Sun-Maid<sup>®</sup>", uri: "/assets/images/brand/sunMaid.jpg", count: "1 recipe" },
{ _id: 48, title: "Sunkist<sup>®</sup>", uri: "/assets/images/brand/sunkist.jpg", count: "5 recipes" },
{ _id: 15, title: "Swanson<sup>®</sup>", uri: "/assets/images/brand/swanson.jpg", count: "79 recipes" },
{ _id: 3, title: "The Beef Checkoff", uri: "/assets/images/brand/theBeefCheckoff.jpg", count: "15 recipes" },
{ _id: 17, title: "V8<sup>®</sup>", uri: "/assets/images/brand/v8.jpg", count: "28 recipes" },
{ _id: 55, title: "Wish-Bone<sup>®</sup>", uri: "/assets/images/brand/wishbone.jpg", count: "11 recipes" }
];

    return Resources;
}();