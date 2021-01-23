<template>
  <div>
    <div class="container">
      <!-- Search form  -->
      <p></p>
      <!-- <b><h5 class="title">Search Page</h5></b> -->
      <p></p>
      <b-col>
        <form
          class="form-inline d-flex justify-content-center md-form form-sm active-cyan-2 mt-2"
        >
          <input
            class="form-control form-control-sm mr-3 w-75"
            v-model="searchInput"
            type="text"
            placeholder="Search recipe/meal name"
            aria-label="Search"
          />
          <i class="fas fa-search" aria-hidden="true"></i>
          <input
            type="button"
            value="search"
            :disabled="!searchInput"
            v-on:click="searchRecipes"
          />
        </form>
      </b-col>
      <br />

      <b-form-group
        id="input-group-amount"
        label-cols-sm="5"
        label="Choose amount (default - 5):"
        label-for="Amount"
      >
        <b-form-select
          id="Amount"
          :options="amounts"
          v-model="amountSelected"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-cuisine"
        label-cols-sm="5"
        label="Choose Cuisine (optional):"
        label-for="Cuisine"
      >
        <b-form-select
          id="Cuisine"
          :options="cuisines"
          v-model="cuisineSelected"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-diet"
        label-cols-sm="5"
        label="Choose Diet (optional):"
        label-for="Diet"
      >
        <b-form-select
          v-model="dietsSelected"
          id="Diet"
          :options="diets"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-intolerance"
        label-cols-sm="5"
        label="Choose Intolerance (optional):"
        label-for="Intolerance"
      >
        <b-form-select
          v-model="intoleranceSelected"
          id="Intolerance"
          :options="intolerances"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-sort"
        label-cols-sm="5"
        label="Sort recipes (optional):"
        label-for="Sort"
      >
        <b-form-select
          :disabled="!recipes.length > 0"
          id="Sort"
          :options="sortOptions"
          v-model="sortSelected"
          @change="sort"
        ></b-form-select>
      </b-form-group>

      <b-row v-if="recipes.length > 0">
        <b-row v-for="r in recipes" :key="r.id" class="mb-10">
          <RecipePreview class="recipePreview" :recipe="r" />
        </b-row>
      </b-row>
      <b-row v-else-if="isRecipesExist">
        <h1>No recipes found on this search! please try again!</h1>
      </b-row>
    </div>
  </div>
</template>

<script>
import cuisines from "../assets/Cuisine";
import diets from "../assets/Diet";
import intolerances from "../assets/intolerance";
import RecipePreview from "../components/RecipePreview";
export default {
  components: {
    RecipePreview,
  },
  data() {
    return {
      cuisines: [{ value: "", text: "Choose Cuisine (optional):" }],
      diets: [{ value: "", text: "Choose Diet (optional):" }],
      intolerances: [{ value: "", text: "Choose Intolerance (optional):" }],
      amounts: [
        { value: 5, text: "5 recipes" },
        { value: 10, text: "10 recipes" },
        { value: 15, text: "15 recipes" },
      ],
      sortOptions: [
        { value: 0, text: "Sort recipes (optional):" },
        { value: 1, text: "sorting by likes" },
        { value: 2, text: "sorting by time preparation" },
      ],
      amountSelected: 5,
      sortSelected: 0,
      cuisineSelected: "",
      dietsSelected: "",
      intoleranceSelected: "",
      searchInput: "",
      recipes: [],
      isRecipesExist: false,
    };
  },
  mounted() {
    if (
      $cookies.get("session") != null &&
      localStorage.getItem($cookies.get("session")) != null
    ) {
      this.recipes.push(
        ...JSON.parse(localStorage.getItem($cookies.get("session")))
      );
      this.isRecipesExist = true;
    }
    this.cuisines.push(...cuisines);
    this.diets.push(...diets);
    this.intolerances.push(...intolerances);
  },
  methods: {
    async searchRecipes() {
      const response = await this.axios.get(
        `http://localhost:3001/recipes/search/${this.searchInput}/amount/${this.amountSelected}`,
        {
          params: {
            cuisine: this.cuisineSelected,
            diet: this.dietsSelected,
            intolerances: this.intoleranceSelected,
          },
        }
      );
      this.recipes = [];
      this.recipes.push(...response.data);
      this.isRecipesExist = true;
      if ($cookies.get("session") != null) {
        localStorage.setItem(
          $cookies.get("session"),
          JSON.stringify(this.recipes)
        );
      }
    },
    sort() {
      let flag = false;
      if (this.sortSelected == 1) {
        this.recipes.sort(this.compareByLikes);
        flag = true;
      } else if (this.sortSelected == 2) {
        this.recipes.sort(this.compareByTime);
        flag = true;
      }
      if (flag && $cookies.get("session") != null) {
        localStorage.setItem(
          $cookies.get("session"),
          JSON.stringify(this.recipes)
        );
      }
    },
    compareByLikes(recipe1, recipe2) {
      const aggregateLikes1 = recipe1.aggregateLikes;
      const aggregateLikes2 = recipe2.aggregateLikes;
      let comparison = 0;
      if (aggregateLikes1 > aggregateLikes2) {
        comparison = 1;
      } else if (aggregateLikes1 < aggregateLikes2) {
        comparison = -1;
      }
      return comparison;
    },
    compareByTime(recipe1, recipe2) {
      const time1 = recipe1.readyInMinutes;
      const time2 = recipe2.readyInMinutes;
      let comparison = 0;
      if (time1 > time2) {
        comparison = 1;
      } else if (time1 < time2) {
        comparison = -1;
      }
      return comparison;
    },
  },
};
</script>
