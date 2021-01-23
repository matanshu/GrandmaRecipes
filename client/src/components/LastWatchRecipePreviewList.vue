<template>
  <div>
    <RecipePreviewList
      title="Last Watched Recipes"
      :recipesList="lastWatchRecipes"
      class="LastWatchRecipes center"
    />
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
      lastWatchRecipes: [],
    };
  },
  mounted() {
    this.updateLastWatchRecipes(); //only if user login
  },
  methods: {
    async updateLastWatchRecipes() {
      try {
        const response = await this.axios.get(
          "http://localhost:3001/users/lastWatch/"
        );
        console.log(response.status);
        if (response.status != 404) {
          const recipes = response.data;
          this.lastWatchRecipes = [];
          this.lastWatchRecipes.push(...recipes);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
