const DButils = require("./DButils");

//input userId, recipeId
//output recipeId that match to userId if match on WatchedRecipes table
function getSpecificWatchedRecipeByUserId(userId, recipeId) {
  return DButils.execQuery(
    "SELECT recipe_id FROM watchRecipes WHERE user_id = '" +
    userId +
    "' AND recipe_id = '" +
    recipeId +
    "'"
  );
}

//input userId, recipeId
//output recipeId that match to userId if match on favoriteRecipes table
function getSpecificfavoriteRecipeByUserId(userId, recipeId) {
  return DButils.execQuery(
    "SELECT recipe_id FROM favoriteRecipes WHERE user_id = '" +
    userId +
    "' AND recipe_id = '" +
    recipeId +
    "'"
  );
}

//input userId, recipeId
//output insert  recipeId into WatchedRecipes table
function insertRecipeIntoWatchRecipe(userId, recipeId) {
  DButils.execQuery(
    `INSERT INTO watchRecipes VALUES ('${userId}', '${recipeId}')`
  );
}

//input userId, recipeId
//output insert recipeId into favoriteRecipes table
function insertRecipeIntoFavoriteRecipes(userId, recipeId) {
  DButils.execQuery(
    `INSERT INTO favoriteRecipes VALUES ('${userId}', '${recipeId}')`
  );
}

//input userId
//output get all recipes from favorites table which match to userId
function getAllFavoriteRecipes(userId) {
  return DButils.execQuery(
    "SELECT recipe_id FROM favoriteRecipes WHERE user_id = '" + userId + "'"
  );
}

//input none
//output get all exist username from users table
function getAllUserNames() {
  return DButils.execQuery("SELECT username FROM users");
}

//input none
//output insert new user into users table
function insertNewUser(req, hash_password) {
  DButils.execQuery(
    `INSERT INTO users VALUES (default, '${req.body.username}', '${req.body.firstName}',
    '${req.body.lastName}', '${req.body.country}', '${hash_password}', '${req.body.email}',
    '${req.body.profileImage}')`
  );
}

//input userId
//output get all recipes from watches table which match to userId
function getAllwatchesRecipes(userId) {
  return DButils.execQuery(
    "SELECT recipe_id FROM watchRecipes WHERE user_id = '" + userId + "'"
  );
}
//input userId, recipeId
//output delete record (userId, recipeId) from WatchedRecipes table
function deleteRecipeFromWatchRecipes(userId, recipeId) {
  DButils.execQuery(
    //`INSERT INTO watchRecipes VALUES ('${userId}', '${recipeId}')`
    "DELETE FROM watchRecipes WHERE user_id = '" +
    userId +
    "' AND recipe_id = '" +
    recipeId +
    "'"
  );
}

function getLastWatchRecipes(userId) {
  return DButils.execQuery(
    "SELECT * FROM lastWatchRecipes WHERE user_id = '" + userId + "'"
  );
}

function insertRecipeIntoLastWatchTable(userId, recipeId) {
  DButils.execQuery(
    "INSERT INTO lastWatchRecipes (user_id, recipe_id1)" +
    "VALUES ('" +
    userId +
    "','" +
    recipeId +
    "')"
  );
}

function updateToLastWatch(userId, recipeId1, recipeId2) {
  DButils.execQuery(
    "UPDATE lastWatchRecipes SET recipe_id1 = '" +
    recipeId1 +
    "', recipe_id2 = '" +
    recipeId2 +
    "' WHERE user_id = '" +
    userId +
    "'"
  );
}

function updateToLastWatch(userId, recipeId1, recipeId2, recipeId3) {
  DButils.execQuery(
    "UPDATE lastWatchRecipes SET recipe_id1 = '" +
    recipeId1 +
    "', recipe_id2 = '" +
    recipeId2 +
    "', recipe_id3 = '" +
    recipeId3 +
    "' WHERE user_id = '" +
    userId +
    "'"
  );
}

function getMyRecipes(userId) {
  return DButils.execQuery(
    "SELECT * FROM myRecipes WHERE user_id = '" + userId + "'"
  );
}

function getMyPersonalRecipes(userId) {
  return DButils.execQuery(
    "SELECT * FROM personalRecipes WHERE user_id = '" + userId + "'"
  );
}

function getMyFamilyRecipes(userId) {
  return DButils.execQuery(
    "SELECT * FROM familyRecipes WHERE user_id = '" + userId + "'"
  );
}

//count how many personal recipes userId has
function myRecipesCount(userId) {
  return DButils.execQuery(
    "SELECT COUNT(*) FROM personalRecipes WHERE user_id = '" + userId + "'"
  );
}

// CREATE TABLE [dbo].[personalRecipes]
// (
// 	[user_id] [varchar](50) NOT NULL,
// 	[recipe_id] [int] NOT NULL,
//     [recipe] [varchar](4000) NOT NULL
// 	PRIMARY KEY (user_id, recipe_id)
// )

//inert into personal recipes new recipe
function insertRecipeIntoMyRecipesTable(userId, recipeId, recipe) {
  console.log(recipe);
  DButils.execQuery(
    `INSERT INTO personalRecipes VALUES ('${userId}', '${recipeId}', '${recipe}')`
  );
}

function getMyPersonalRecipes(userId) {
  return DButils.execQuery(
    "SELECT * FROM personalRecipes WHERE user_id = '" + userId + "'"
  );
}
/*
CREATE TABLE [dbo].[imaegeTest]
(
    [image] [varchar](50) PRIMARY KEY NOT NULL ,
)
*/
function insertImage(image) {
  DButils.execQuery(`INSERT INTO imageTest VALUES ('${image}')`);
}

function getImage() {
  DButils.execQuery(`SELECT * FROM imaegeTest`);
}

/*
-- CREATE TABLE [dbo].[personalRecipes]
-- (
-- 	[user_id] [varchar](50) NOT NULL,
-- 	[recipe_id] [int] NOT NULL,
--     [recipe] [varchar](4000) NOT NULL
-- 	PRIMARY KEY (user_id, recipe_id)
-- )
*/
function getSecificPersonalRecipe(Recipeid, userId) {
  return DButils.execQuery(
    `SELECT recipe FROM personalRecipes WHERE user_id = '${userId}' AND recipe_id = '${Recipeid}'`
  );
}
exports.getSecificPersonalRecipe = getSecificPersonalRecipe;
exports.getImage = getImage;
exports.insertImage = insertImage;
exports.getMyFamilyRecipes = getMyFamilyRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getSpecificWatchedRecipeByUserId = getSpecificWatchedRecipeByUserId;
exports.insertRecipeIntoWatchRecipe = insertRecipeIntoWatchRecipe;
exports.getAllFavoriteRecipes = getAllFavoriteRecipes;
exports.getAllwatchesRecipes = getAllwatchesRecipes;
exports.deleteRecipeFromWatchRecipes = deleteRecipeFromWatchRecipes;
exports.insertRecipeIntoFavoriteRecipes = insertRecipeIntoFavoriteRecipes;
exports.getLastWatchRecipes = getLastWatchRecipes;
exports.insertRecipeIntoLastWatchTable = insertRecipeIntoLastWatchTable;
exports.updateToLastWatch = updateToLastWatch;
exports.getSpecificfavoriteRecipeByUserId = getSpecificfavoriteRecipeByUserId;
exports.getAllUserNames = getAllUserNames;
exports.insertNewUser = insertNewUser;
exports.insertRecipeIntoMyRecipesTable = insertRecipeIntoMyRecipesTable;
exports.myRecipesCount = myRecipesCount;
exports.getMyPersonalRecipes = getMyPersonalRecipes;
