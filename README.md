# GrandmaRecipes
Author: Matan Shushan

A Single-Page-Application project Implemented during Web Development Environments course
It aimed for retrieving, managing and displaying recipes.

# Client Build Setup
install dependencies
npm install

serve with hot reload at localhost:8081
npm run serve

build for production with minification
npm run build

# Main functionallity:
1. login, logout, registration
2. Displaying recipes as preview
3. Displaying full details recipe (including ingredients and preperation intstructions)
4. Creating new recipes
5. Searching recipes (with option to filter by: Cuisine, Diet or Intolerance)
6. Saving recipes to favorites
7. Getting indication whether user already watched recipe and added it to his favorite list
8. Displaying user last watched recipes
9. Generating random recipes

# Additional Info:
1. Webiste communicates with external api: https://spoonacular.com/food-api/docs
2. Link for website api: https://app.swaggerhub.com/apis-docs/matanshu/IdoMatanRecipeApi/3.0.3
3. Server was Implemented by node js, using express library and communicates with external api. It also used Microsoft Azure DB for saving website data.
4. Server Includes three routers: auth, users and recipes.
auth => for All authentication related routes, users => for all user personal app info related routes and recipes => for all recipes general info
4. Client was Implemented by Vue js framework.
