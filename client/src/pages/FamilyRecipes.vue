<template>
  <b-container>
    <h1>Family recipes</h1>
    <b-row v-for="r in recipes" :key="r.id">
      <RecipePreview class="recipePreview" :recipe="r" />
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
export default {
  name: "FamilyRecipes",
  components: {
    RecipePreview,
  },
  // props: {
  //   title: {
  //     type: String,
  //     required: true,
  //   },
  // },
  data() {
    return {
      recipes: [],
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const response = await this.axios.get(
          "http://localhost:3001/users/familyRecipes"
        );

        // console.log(response);
        const recipes = response.data;
        this.recipes = [];
        this.recipes.push(...recipes);
        // console.log(this.recipes);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
