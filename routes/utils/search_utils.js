const axios = require("axios");
const apiKey = process.env.spooncular_apiKey;

async function searchForRecipes(search_params) {
  let search_response = await axios.get(
    `https://api.spoonacular.com/recipes/search`,
    {
      params: search_params,
    }
  );
  const recipes_id_list = extractSearchResultsIds(search_response);
  let info_array = await getRecipesInfo(recipes_id_list);
  return info_array;
}

async function getRecipesInfo(recipes_id_list) {
  let promises = [];
  recipes_id_list.map((id) =>
    promises.push(
      axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: apiKey,
        },
      })
    )
  );
  let info_response1 = await Promise.all(promises);
  relevantRecipesData = extractRelvantRecipeData(info_response1);
  return relevantRecipesData;
}

function extractRelvantRecipeData(recipes_info) {
  return recipes_info.map((recipes_info) => {
    const {
      id,
      title,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
      image,
    } = recipes_info.data;
    return {
      [id]: {
        title: title,
        readyInMinutes: readyInMinutes,
        aggregateLikes: aggregateLikes,
        vegetarian: vegetarian,
        vegan: vegan,
        glutenFree: glutenFree,
        image: image,
      },
    };
  });
}

async function promiseAll(func, params_list) {
  let promises = [];
  params_list.map((param) => promises.push(func(param)));
  let info_response = await Promise.all(promises);
  return info_response;
}

function extractSearchResultsIds(search_response) {
  let recipes = search_response.data.results;
  recipes_id_list = [];
  recipes.map((element) => {
    recipes_id_list.push(element.id);
  });
  return recipes_id_list;
}

//res.send(recipes.data);

function extractQueriesParams(query_params, search_params) {
  const params_list = ["diet", "cuisine", "intolerances"];
  params_list.forEach((param) => {
    if (query_params[param]) {
      search_params[param] = query_params[param];
    }
  });
  //console.log(search_params);
}

exports.searchForRecipes = searchForRecipes;
exports.extractQueriesParams = extractQueriesParams;
