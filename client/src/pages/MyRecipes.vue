<template>
  <b-container>
    <h1>My recipes</h1>

    <b-row>
      <b-col v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
export default {
  name: "MyRecipes",
  components: {
    RecipePreview
  },
  // props: {
  //   title: {
  //     type: String,
  //     required: true,
  //   },
  // },
  data() {
    return {
      recipes: []
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const response = await this.axios.get(
          "http://localhost:3001/users/myPersonalRecipes"
        );
        const recipes = response.data;
        this.recipes = [];
        this.recipes.push(...recipes);
        this.updateImages();
      } catch (error) {
        console.log(error);
      }
    },
    async updateImages() {
      for (let i = 0; i < this.recipes.length; i++) {
        let imageName = this.recipes[i].image;
        //console.log("image name in place: " + i + "is: " + imageName);
        const response = await this.axios.get(
          `http://localhost:3001/users/image/${imageName}`
        );
        this.recipes[i].image = "data:image/jpeg;base64," + response.data;
        //console.log(this.recipes[i].image);
      }

      //console.log("finish update images...");
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
