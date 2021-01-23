const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const DBQueries = require("../DB/DBReaduQueries");
const axios = require("axios");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const { Buffer } = require("buffer");
let image = undefined;
router.use(fileUpload());

router.use(function requireLogin(req, res, next) {
  if (!req.user_id) {
    next({ status: 401, message: "unauthorized" });
  } else {
    next();
  }
});

/*
router.post("/register", async (req, res, next) => {
  try {
    const users = await DBQueries.getAllUserNames();
    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };
    if (req.body.password != req.body.confirmPassword)
      throw { status: 409, message: "password confirmation is wrong" };
    let hash_password = bcrypt.hashSync(req.body.password, 14);
    //insert new user into db
    await DBQueries.insertNewUser(req, hash_password);
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

*/

//--------------get my recipes not update----------------------------
router.get("/myRecipes", async (req, res) => {
  try {
    let myRecipes = await DBQueries.getMyRecipes(req.user_id.toLowerCase());
    let myRecipes_array = [];
    for (let i = 0; i < myRecipes.length; i++) {
      myRecipes_array.push(getFullRecipeData(myRecipes[i]));
    }
    res.status(200).json(myRecipes_array);
  }
  catch (error) {
    next(error);
  }
});



//--------------get my family recipes----------------------------
router.get("/familyRecipes", async (req, res) => {
  try {
    let myRecipes = await DBQueries.getMyFamilyRecipes(req.user_id.toLowerCase());
    let myRecipes_array = [];
    for (let i = 0; i < myRecipes.length; i++) {
      myRecipes_array.push(getFullRecipeData(myRecipes[i]));
    }
    res.status(200).json(myRecipes_array);
  }
  catch (error) {
    next(error);
  }
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
  try {
    let recipe_id = req.body.recipeId.toString();
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
    if (lastWatchRecipe.length != 0) {
      first = lastWatchRecipe[0].recipe_id1;
      second = lastWatchRecipe[0].recipe_id2;
      third = lastWatchRecipe[0].recipe_id3;
      let oldArr = [first, second, third];
      let newArr = [first, second, third];
      let preview_recipe_array = [];
      if (!oldArr.includes(recipe_id) || oldArr[2] == recipe_id) {
        newArr[0] = recipe_id;
        newArr[1] = oldArr[0];
        newArr[2] = oldArr[1];
      } else {
        if (oldArr[1] == recipe_id) {
          newArr[0] = oldArr[1];
          newArr[1] = oldArr[0];
        }
      }
      await DBQueries.updateToLastWatch(
        req.user_id,
        newArr[0],
        newArr[1],
        newArr[2]
      );
    } else {
      DBQueries.insertRecipeIntoLastWatchTable(req.user_id, recipe_id);
    }
    res.status(201).send({ message: "recipe successfully added to watch table", success: true });
  }
  catch (error) {
    next(error);
  }
});

//--------------recipes info in acccording to users----------------------
router.get("/recipeInfo/:ids", async (req, res) => {
  try {
    const ids = JSON.parse(req.params.ids);
    //req.params.recipeId
    const userId = req.user_id;
    const userRecipesData = await getUserInfoOnRecipes(userId, ids);
    res.status(200).json(userRecipesData);
  }
  catch (error) {
    next(error);
  }
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

//--------------single recipe info acccording to login user----------------------
router.get("/singleRecipeInfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user_id;
    const userRecipesData = await getUserInfoOnSingleRecipe(userId, id);
    res.status(200).json(userRecipesData);
  }
  catch (error) {
    next(error);
  }
});

async function getUserInfoOnSingleRecipe(userId, id) {
  let favoriteRecipes = await DBQueries.getAllFavoriteRecipes(userId);
  let watchRecipes = await DBQueries.getAllwatchesRecipes(userId);
  let ans = [];
  let ifFavotite = false;
  let ifWatch = false;
  if (checkFavoriteOrWatchStatusForIds(id, favoriteRecipes)) {
    ifFavotite = true;
  }
  if (checkFavoriteOrWatchStatusForIds(id, watchRecipes)) {
    ifWatch = true;
  }
  let obejct = {
    watched: ifWatch,
    saved: ifFavotite,
  };
  return obejct;
}

function checkFavoriteOrWatchStatusForIds(id, arrayOfRecipes) {
  for (let i = 0; i < arrayOfRecipes.length; i++) {
    if (arrayOfRecipes[i].recipe_id == id) {
      return true;
    }
  }
  return false;
}

// --------------3 last watch recipes
router.get("/lastWatch", async (req, res) => {
  try {
    let recipes_id_array = await DBQueries.getLastWatchRecipes(req.user_id);
    let preview_recipe_array = [];
    if (recipes_id_array.length > 0) {
      //res.status(404).send({ message: "no watched recipes yet", success: true });
      let first = recipes_id_array[0].recipe_id1;
      let second = recipes_id_array[0].recipe_id2;
      let third = recipes_id_array[0].recipe_id3;
      if (first != null && first != "null" && first != "undefined") {
        let recipe1 = await getRecipeFromApiById(first);
        preview_recipe_array.push(recipe1);
      }
      if (second != null && second != "null" && second != "undefined") {
        let recipe2 = await getRecipeFromApiById(second);
        preview_recipe_array.push(recipe2);
      }
      if (third != null && third != "null" && third != "undefined") {
        let recipe3 = await getRecipeFromApiById(third);
        preview_recipe_array.push(recipe3);
      }
      res.json(preview_recipe_array);
    }
    else {
      throw { status: 404, message: "no recipes in last watch recipes" };
    }
  }
  catch (erroe) {
    next(error);
  }

});

async function getRecipeFromApiById(recipeId) {
  const recipe = await axios.get(
    `https://api.spoonacular.com/recipes/${recipeId}/information`,
    {
      params: {
        apiKey: process.env.spooncular_apiKey,
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
    console.log();
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
  try {
    let recipes_array = [];
    let recipes_id = await DBQueries.getAllFavoriteRecipes(req.user_id);
    let preview_recipe_array = [];
    for (let i = 0; i < recipes_id.length; i++) {
      let id = recipes_id[i].recipe_id;
      let recipe = await getRecipeFromApiById(id);
      preview_recipe_array.push(recipe);
    }
    if (preview_recipe_array.length != 0) {
      res.status(200).json(preview_recipe_array);
    } else {
      throw { status: 404, message: "no favorite recipes yet" };
    }
  } catch (error) {
    next(error);
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
  try {
    req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
    res.send({ success: true, message: "logout succeeded" });
  }
  catch (error) {
    next(error);
  }
});
// "users/uploadImage"
router.post("/uploadImage", (req, res) => {
  image = req.files.file;
  handleStoringImage();
  res.send({ success: true, message: "upload image succeeded" });
});

function handleStoringImage() {
  image.mv("./recipes images/" + image.name, async function (error) {
    if (error) {
      console.log("couldn't upload file");
      console.log(error);
    } else {
      console.log("upload sussussfully");
    }
  });
}

//--------------  create personal recipe  ----------------------
router.post("/createRecipe", async (req, res) => {
  try {
    let myStringRecipes = await DBQueries.getMyPersonalRecipes(
      req.user_id.toLowerCase()
    );
    let recipe = req.body;
    recipe.user_id = req.user_id;
    //personal recipes ids are negative whereas sponcoolar recipes ids are positive
    let recipeId = myStringRecipes.length * -1 - 1;
    recipe.id = recipeId;
    recipe.image = image.name;
    //console.log(recipe);
    await DBQueries.insertRecipeIntoMyRecipesTable(
      req.user_id,
      recipeId,
      JSON.stringify(recipe)
    );
    res.send({ success: true, message: "new recipe was created" });
  } catch (error) {
    //next(error);
  }
});

//--------------get my personal recipes----------------------------
router.get("/myPersonalRecipes", async (req, res) => {
  let myStringRecipes = await DBQueries.getMyPersonalRecipes(
    req.user_id.toLowerCase()
  );
  console.log("num of personal recipes is: " + myStringRecipes.length);
  let myRecipes_array = [];
  let recipe;
  for (let i = 0; i < myStringRecipes.length; i++) {
    recipe = JSON.parse(myStringRecipes[i].recipe);
    console.log(recipe);
    myRecipes_array.push(
      getPartialRecipeParams(JSON.parse(myStringRecipes[i].recipe))
    );
  }
  console.log(myRecipes_array);
  res.json(myRecipes_array);
});

async function getImage(imageName) {
  await fs.readFile("./recipes images/" + imageName, function (err, data) {
    if (err) throw err; // Fail if the file can't be read.
    console.log(data);
    return data;
  });
}
//--------------get specific image ----------------------
router.get("/image/:imageName", async (req, res) => {
  console.log("./recipes images/" + req.params.imageName);

  await fs.readFile("./recipes images/" + req.params.imageName, function (
    err,
    data
  ) {
    if (err) throw err; // Fail if the file can't be read.
    let imageB = new Buffer(data, "binary").toString("base64");
    //console.log(imageB);
    res.end(imageB); // Send the file data to the browser.
  });
});

//--------------upload image test----------------------------
router.post("/image", async (req, res) => {
  console.log("req is: " + req.file("file"));
  console.log("req.file is: " + req.file);
  console.log("req.files is: " + req.files);
  console.log("req.body is: " + req.body);
  console.log("req.body.file is: " + req.body.file);
  // console.log("req.body.image.files is: " + req.body.image.files);
  // console.log("req.body.image.files.image is: " + req.body.image.files.image);
  // console.log(req);
  // console.log(req.body);
  // console.log(req.body.image);
  //console.log(req.test);
});

router.post("/singleFile", async (req, res) => {
  //console.log(req);
  console.log(req.files);
  let file = req.files.profile;
  console.log(file.data);
  await DBQueries.insertImage(file.name);
  file.mv("./recipes images/" + file.name, async function (error) {
    if (error) {
      console.log("couldn't upload file");
      console.log(error);
    } else {
      await DBQueries.insertImage(file.name);
      console.log("upload sussussfully");
    }
  });
  res.sendStatus(200);
});


//--------------get my personal recipe full info----------------------------
router.get("/myRecipeInfo/:recipeId", async (req, res, next) => {
  try {
    const recipe = await DBQueries.getSecificPersonalRecipe(
      req.params.recipeId,
      req.user_id
    );
    console.log(recipe);
    console.log(recipe[0]);
    let parseRecipe = JSON.parse(recipe[0].recipe);
    console.log(parseRecipe);
    //console.log

    if (recipe == null || recipe.length == 0) {
      throw { status: 401, message: "recipe id is incorrect" };
    }
    res.status(200).json(parseRecipe);
  } catch (error) {
    next(error);
  }
});
// res.sendFile("recipes images/pizza for test.jpeg", {
//   root:
//     "/Users/matanshushan/Desktop/university/third year/web development/tasks/task3/task 3.2/",
// });

//console.log(imageB);
//res.writeHead(200, { "Content-Type": "text/html" });
module.exports = router;
