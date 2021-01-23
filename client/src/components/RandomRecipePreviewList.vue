<template>
  <div>
    <RecipePreviewList
      title="Random Recipes"
      :recipesList="randomRecipes"
      class="RandomRecipes center"
    />
    <button v-on:click="updateRandomRecipes">refresh recipes</button>
  </div>
</template>

<script>
import RecipePreviewList from "./RecipePreviewList";
export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      randomRecipes: [],
    };
  },
  mounted() {
    this.updateRandomRecipes();
  },
  methods: {
    async updateRandomRecipes() {
      try {
        const response = await this.axios.get(
          "http://localhost:3001/recipes/random/"
        );
        const recipes = response.data;
        this.randomRecipes = [];
        this.randomRecipes.push(...recipes);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
