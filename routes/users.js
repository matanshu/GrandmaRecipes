const express = require("express");
const router = express.Router();
const DBQueries = require("../DB/DBReaduQueries");
const axios = require("axios");

router.use(function requireLogin(req, res, next) {
  if (!req.user_id) {
    next({ status: 401, message: "unauthorized" });
  } else {
    next();
  }
});

//--------------get my recipes----------------------------
router.get("/myRecipes", async (req, res) => {
  let myRecipes = await DBQueries.getMyRecipes(req.user_id.toLowerCase());
  let myRecipes_array = [];
  for (let i = 0; i < myRecipes.length; i++) {
    myRecipes_array.push(getFullRecipeData(myRecipes[i]));
  }
  res.json(myRecipes_array);
});

//--------------get my family recipes----------------------------
router.get("/familyRecipes", async (req, res) => {
  let myRecipes = await DBQueries.getMyFamilyRecipes(req.user_id.toLowerCase());
  let myRecipes_array = [];
  for (let i = 0; i < myRecipes.length; i++) {
    console.log(myRecipes[i].ingerdients);
    myRecipes_array.push(getFullRecipeData(myRecipes[i]));
  }
  res.json(myRecipes_array);
});

function getFullRecipeData(data) {
  return {
    id: data.recipe_id,
    image: data.image,
    title: data.title,
    readyInMinutes: data.readyInMinutes,
    aggregateLikes: data.aggregateLikes,
    vegan: data.vegan,
    vegetarian: data.vegetarian,
    glutenFree: data.glutenFree,
    ingredients: data.ingerdients,
    instructions: data.instructions,
    servings: data.servings,
  };
}
// --------------add to watch table----------------------
router.post("/addToWatchTable", async (req, res) => {
  let recipe_id = req.body.recipeId;
  let watch_recipe = await DBQueries.getSpecificWatchedRecipeByUserId(
    req.user_id,
    recipe_id
  );
  let first = null;
  let second = null;
  let third = null;
  let lastWatchRecipe;
  if (watch_recipe.length == 0) {
    await DBQueries.insertRecipeIntoWatchRecipe(req.user_id, recipe_id);
  }
  lastWatchRecipe = await DBQueries.getLastWatchRecipes(req.user_id);
  console.log(lastWatchRecipe);
  if (lastWatchRecipe.length != 0) {
    first = lastWatchRecipe[0].recipe_id1;
    second = lastWatchRecipe[0].recipe_id2;
    third = lastWatchRecipe[0].recipe_id3;
  }
  if (first == null) {
    await DBQueries.insertRecipeIntoLastWatchTable(req.user_id, recipe_id);
  } else if (second == null) {
    if (first != recipe_id) {
      second = first;
      await DBQueries.updateToLastWatch(req.user_id, recipe_id, second);
    }
    //else first = recipe_id
  } else {
    if (first != recipe_id) {
      if (second != recipe_id) {
        third = second;
      }
      second = first;
      await DBQueries.updateToLastWatch(req.user_id, recipe_id, second, third);
    }
  }
  res.sendStatus(200);
});

//--------------recipes info in acccording to users----------------------
router.get("/recipeInfo/:ids", async (req, res) => {
  const ids = JSON.parse(req.params.ids);
  const userId = req.user_id;
  const userRecipesData = await getUserInfoOnRecipes(userId, ids);
  res.json(userRecipesData);
});

async function getUserInfoOnRecipes(userId, ids) {
  let favoriteRecipes = await DBQueries.getAllFavoriteRecipes(userId);
  let watchRecipes = await DBQueries.getAllwatchesRecipes(userId);
  let ans = [];
  for (let i = 0; i < ids.length; i++) {
    let ifFavotite = false;
    let ifWatch = false;
    if (checkFavoriteOrWatchStatusForIds(ids[i], favoriteRecipes)) {
      ifFavotite = true;
    }
    if (checkFavoriteOrWatchStatusForIds(ids[i], watchRecipes)) {
      ifWatch = true;
    }
    let obejct = {
      [ids[i]]: {
        watched: ifWatch,
        saved: ifFavotite,
      },
    };
    ans.push(obejct);
  }
  return ans;
}

// --------------3 last watch recipes
router.get("/lastWatch", async (req, res) => {
  let recipes_id_array = await DBQueries.getLastWatchRecipes(req.user_id);
  let first = recipes_id_array[0].recipe_id1;
  let second = recipes_id_array[0].recipe_id2;
  let third = recipes_id_array[0].recipe_id3;
  let preview_recipe_array = [];
  if (first != null) {
    let recipe1 = await getRecipeFromApiById(first);
    preview_recipe_array.push(recipe1);
  }
  if (second != null) {
    let recipe2 = await getRecipeFromApiById(second);
    preview_recipe_array.push(recipe2);
  }
  if (third != null) {
    let recipe3 = await getRecipeFromApiById(third);
    preview_recipe_array.push(recipe3);
  }
  if (preview_recipe_array.length != 0) {
    res.json(preview_recipe_array);
  } else {
    res.status(201).send({ message: "no watched recipes yet", success: true });
  }
});

async function getRecipeFromApiById(recipeId) {
  const recipe = await axios.get(
    `https://api.spoonacular.com/recipes/${recipeId}/information`,
    {
      params: {
        apiKey: "8888fa9d5e894d3f8f6ead539bc3b747",
      },
    }
  );
  return getPartialRecipeParams(recipe.data);
}

function getPartialRecipeParams(data) {
  return {
    id: data.id,
    image: data.image,
    title: data.title,
    readyInMinutes: data.readyInMinutes,
    aggregateLikes: data.aggregateLikes,
    vegan: data.vegan,
    vegetarian: data.vegetarian,
    glutenFree: data.glutenFree,
  };
}

// --------------add recipe to favorites----------------------
router.post("/addToFavorites", async (req, res) => {
  try {
    let recipe = await DBQueries.getSpecificfavoriteRecipeByUserId(
      req.user_id,
      req.body.recipeId
    );
    if (recipe.length == 0) {
      await DBQueries.insertRecipeIntoFavoriteRecipes(
        req.user_id,
        req.body.recipeId
      );
    }
    res.status(201).send({ message: "recipe add to favorites", success: true });
  } catch (error) {
    next(error);
  }
});

// --------------show my favorites----------------------
router.get("/myFavorites", async (req, res) => {
  let recipes_array = [];
  try {
    let recipes_id = await DBQueries.getAllFavoriteRecipes(req.user_id);
    let preview_recipe_array = [];
    for (let i = 0; i < recipes_id.length; i++) {
      let id = recipes_id[i].recipe_id;
      let recipe = await getRecipeFromApiById(id);
      preview_recipe_array.push(recipe);
    }
    if (preview_recipe_array.length != 0) {
      res.json(preview_recipe_array);
    } else {
      res
        .status(201)
        .send({ message: "no favorite recipes yet", success: true });
    }
  } catch (error) {
    res.status(next.status).send(next.message);
    next(error);
    res.status(401).send(error.message);
  }
});

function checkFavoriteOrWatchStatus(random_recipe, DB_array_recipe) {
  for (let i = 0; i < DB_array_recipe.length; i++) {
    let DB_id = DB_array_recipe[i].recipe_id;
    if (DB_id == random_recipe.id) {
      return true;
    }
  }
  return false;
}

//--------------  Logout  ----------------------
router.post("/logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;