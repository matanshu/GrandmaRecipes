# GrandmaRecipes
Author: Matan Shushan

A Single-Page-Application project Implemented during Web Development Environments course
It aimed for retrieving, managing and displaying recipes.

Including the following functionallity:
1. login, logout, registration
2. Displaying recipes as preview
3. Displaying full details recipe (including ingredients and preperation intstructions)
4. Creating new recipes
5. Searching recipes (with option to filter by: Cuisine, Diet or Intolerance)
6. Saving recipes to favorites
7. Getting indication whether user already watched recipe and added it to his favorite list
8. Displaying user last watched recipes
9. Generating random recipes

Additional Info:
1. Webiste communicates with external api: https://spoonacular.com/food-api/docs
2. Server was Implemented by node js, using express library and communicates with external api. It also used Microsoft Azure DB for saving website data.
3. Server Includes three routers: auth, users and recipes 3.1 auth => for All authentication related routes 3.2 users => for all the user personal app info related routes 3.3 recipes => for all recipes general info
4. Client was Implemented by Vue js framework. 
