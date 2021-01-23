<template>
  <div>
    <b-card
      :title="recipe.title"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 300rem;"
      class="mb-2"
    >
      <router-link
        :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
        class="recipe-preview"
      >
        <b-card-img :src="recipe.image"> </b-card-img>
      </router-link>
      <b-card-text>
        <ul class="recipe-overview">
          <li>preparation time: {{ recipe.readyInMinutes }} minutes</li>
          <li v-if="this.recipe.id > 0">
            number of likes: {{ recipe.aggregateLikes }} likes
          </li>
          <li v-if="$cookies.get('session') != null && this.recipe.id > 0">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                :checked="watchRecipe"
                disabled
              />
              <label
                v-if="this.recipe.id > 0"
                class="form-check-label"
                for="check5"
              >
                is already watched recipe
              </label>
            </div>
          </li>
          <li v-if="$cookies.get('session') != null && this.recipe.id > 0">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                :checked="saveToFavorite"
                v-on:click="favoriteCheck"
                :disabled="saveToFavorite"
                id="defaultCheck1"
              />
              <label class="form-check-label" for="check4">
                saved to favorites
              </label>
            </div>
          </li>
          <li
            v-if="
              this.recipe.vegan ||
                this.recipe.glutenFree ||
                this.recipe.vegetarian
            "
          >
            <img
              v-if="this.recipe.vegan"
              :src="imageVegan"
              height="50px"
              width="50px"
              title="Vegan"
            />
            <img
              v-if="this.recipe.glutenFree"
              :src="imageGlutenFree"
              height="50px"
              width="50px"
              title="Gluten free"
            />
            <img
              v-if="this.recipe.vegetarian"
              :src="imageVegetarian"
              height="35px"
              width="35px"
              title="Vegetarian"
            />
          </li>
        </ul>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import imageVegan from "../assets/vegan.jpg";
import imageFavorite from "../assets/favorite.jpg";
import imageGlutenFree from "../assets/glutenfree.jpg";
import imageNoFavorite from "../assets/nofavorite.png";
import imageVegetarian from "../assets/vegetarian.jpg";
import imageSeen from "../assets/seen.png";

export default {
  data() {
    return {
      imageVegan: imageVegan,
      imageFavorite: imageFavorite,
      imageVegetarian: imageVegetarian,
      imageGlutenFree: imageGlutenFree,
      imageNoFavorite: imageNoFavorite,
      imageSeen: imageSeen,
      saveToFavorite: false,
      watchRecipe: false,
    };
  },

  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.updateWatchedAndSave();
  },
  methods: {
    async updateWatchedAndSave() {
      try {
        if ($cookies.get("session") != null) {
          //info about if user save recipe to favorites
          let userRecipeDetails = await this.axios.get(
            `http://localhost:3001/users/singleRecipeInfo/${this.recipe.id}`
          );
          this.saveToFavorite = userRecipeDetails.data.saved;
          this.watchRecipe = userRecipeDetails.data.watched;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async favoriteCheck() {
      this.saveToFavorite = true;
      await this.axios.post("http://localhost:3001/users/addToFavorites/", {
        recipeId: this.recipe.id,
      });
    },
  },
};
</script>

<style scoped>
.recipe-preview {
  display: inline-block;
  width: 90%;
  height: 100%;
  position: relative;
  margin: 10px 10px;
}
.recipe-preview > .recipe-body {
  width: 100%;
  height: 200px;
  position: relative;
}

.recipe-preview .recipe-body .recipe-image {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: block;
  width: 98%;
  height: auto;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}

.recipe-preview .recipe-body .recipe-image-forLogo {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: block;
  width: 3%;
  height: auto;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}

.recipe-preview .recipe-footer {
  width: 100%;
  height: 50%;
  overflow: hidden;
}

.recipe-preview .recipe-footer .recipe-title {
  padding: 10px 10px;
  width: 100%;
  font-size: 12pt;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

.recipe-preview .recipe-footer ul.recipe-overview {
  padding: 5px 10px;
  width: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  box-flex: 1;
  -webkit-flex: 1 auto;
  -ms-flex: 1 auto;
  flex: 1 auto;
  table-layout: fixed;
  margin-bottom: 0px;
}

.recipe-preview .recipe-footer ul.recipe-overview li {
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  -ms-box-flex: 1;
  box-flex: 1;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  width: 90px;
  display: table-cell;
  text-align: center;
}
</style>
