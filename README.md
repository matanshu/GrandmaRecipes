Matan Shushan - 204106950, Ido Kestenbaum - 205767833
link to swagger api - https://app.swaggerhub.com/apis-docs/matanshu/IdoMatanRecipeApi/1.0.0
important info about server project part 3.2:
1. We try to split the implementation as much as we can to different files
2. There are 3 routers: auth, users and recipes
3. auth => for All authentication related routes 
4. users => for all the user personal app info related routes
5. recipes => for all recipes general info
6. There is a completely seperation between functionality of a login user to guest (not login)
7. All the DB functionality (INSERT, SELECT and etc.) is implemented on seperated file which contains only DB functions.
8. The server is implementing only one request each time as small as possible. moreover, There is no mix between different functionality.

