const express = require("express");
const router = express.Router();
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const search_utils = require("./utils/search_utils");
const apiKey = "8888fa9d5e894d3f8f6ead539bc3b747";

//--------------get full recipe info----------------------------
router.get("/recipeInfo/:recipeId", async (req, res, next) => {
  try {
    console.log(req.params.recipeId);
    const recipe = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.recipeId}/information`,
      {
        params: {
          apiKey: "8888fa9d5e894d3f8f6ead539bc3b747",
        },
      }
    );
    if (recipe == null || recipe.length == 0) {
      throw { status: 401, message: "recipe id is incorrect" };
    }
    let ingredients = [];
    recipe.data.extendedIngredients.forEach((element) => {
      ingredients.push(element.original);
    });
    let display_recipe = getFullRecipeParams(recipe.data, ingredients);
    res.json(display_recipe);
  } catch (error) {
    next(error);
  }
});

function getFullRecipeParams(data, ingredients) {
  return {
    id: data.id,
    image: data.image,
    title: data.title,
    readyInMinutes: data.readyInMinutes,
    aggregateLikes: data.aggregateLikes,
    vegan: data.vegan,
    vegetarian: data.vegetarian,
    glutenFree: data.glutenFree,
    ingredients: ingredients,
    instructions: data.instructions,
    servings: data.servings,
  };
}

// --------------get 3 random recipes----------------------
router.get("/random", async (req, res, next) => {
  try {
    let instructions1 = "";
    let instructions2 = "";
    let instructions3 = "";
    let recipe;
    let preview_recipe_array = [];
    while (instructions1 == "" || instructions2 == "" || instructions3 == "") {
      recipe = await axios.get(`https://api.spoonacular.com/recipes/random`, {
        params: {
          apiKey: "8888fa9d5e894d3f8f6ead539bc3b747",
          number: "3",
        },
      });
      instructions1 = recipe.data.recipes[0].instructions;
      instructions2 = recipe.data.recipes[1].instructions;
      instructions3 = recipe.data.recipes[2].instructions;
    }
    for (let J = 0; J < recipe.data.recipes.length; J++) {
      //loop through all 3 random recipes
      let preview_recipe = getPartialRecipeParams(recipe.data.recipes[J]);
      preview_recipe_array.push(preview_recipe);
    }
    res.json(preview_recipe_array);
  } catch (error) {
    next(error);
  }
});

function getPartialRecipeParams(data) {
  return {
    [data.id]: {
      image: data.image,
      title: data.title,
      readyInMinutes: data.readyInMinutes,
      aggregateLikes: data.aggregateLikes,
      vegan: data.vegan,
      vegetarian: data.vegetarian,
      glutenFree: data.glutenFree,
    },
  };
}

// --------------search recipes----------------------
router.get("/search/:recipeName/amount/:amount", async (req, res) => {
  const { recipeName, amount } = req.params;
  //set search params
  search_params = {};
  search_params.query = recipeName;
  search_params.number = amount;
  search_params.instructionsRequired = true;
  search_params.apiKey = apiKey;
  //check if queries params exist
  search_utils.extractQueriesParams(req.query, search_params);

  search_utils
    .searchForRecipes(search_params)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
      console.log(error);
      res.status(500);
    });
});

module.exports = router;
