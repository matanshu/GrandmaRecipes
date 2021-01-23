<template>
  <div class="container">
    <!-- Search form  -->
    <h1 class="title">My favorites recipes:</h1>
    <b-row v-for="r in recipes" :key="r.id" class="mb-10">
      <RecipePreview class="recipePreview" :recipe="r" />
    </b-row>
  </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview";
export default {
  components: {
    RecipePreview,
  },
  data() {
    return {
      recipes: [],
    };
  },
  mounted() {
    this.favoritesRecipes();
  },
  methods: {
    async favoritesRecipes() {
      const response = await this.axios.get(
        `http://localhost:3001/users/myFavorites/`
      );
      this.recipes = [];
      this.recipes.push(...response.data);
      console.log(this.recipes);
    },
  },
};
</script>
