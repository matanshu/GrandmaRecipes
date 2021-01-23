import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },

  {
    path: "/users/myFavorites",
    name: "favoriteRecipes",
    component: () => import("./pages/favoriteRecipes"),
  },

  {
    path: "/users/myRecipes",
    name: "myRecipes",
    component: () => import("./pages/MyRecipes"),
  },

  {
    path: "/users/familyRecipes",
    name: "familyRecipes",
    component: () => import("./pages/FamilyRecipes"),
  },

  {
    path: "/users/singleFile",
    name: "singleFile",
    component: () => import("./pages/uploadFileTest"),
  },
  // {
  //   path: "/users/createRecipe",
  //   name: "createRecipe",
  //   component: () => import("./pages/createRecipe"),
  // },

  {
    path: "/about",
    name: "about",
    component: () => import("./pages/About"),
  },

  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },
];

export default routes;
