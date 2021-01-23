<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-header mt-3 mb-4">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center" />
      </div>
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <div class="mb-3">
              <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
              <div>Likes: {{ recipe.aggregateLikes }} likes</div>
              <div class="form-check" v-if="$root.store.username">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  :checked="watchRecipe"
                  disabled
                />
                <label class="form-check-label" for="check0">
                  watch Recipe
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  :checked="recipe.vegan"
                  disabled
                />
                <label class="form-check-label" for="check1">
                  Vegan
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  :checked="recipe.vegetarian"
                  disabled
                />
                <label class="form-check-label" for="check2">
                  Vegetarian
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  :checked="recipe.glutenFree"
                  disabled
                />
                <label class="form-check-label" for="check3">
                  GlutenFree
                </label>
              </div>
              <div class="form-check" v-if="$root.store.username">
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
                  save to favorites
                </label>
              </div>
              <div>Servings amount: {{ recipe.servings }}</div>
            </div>
            Ingredients:
            <ul>
              <li
                v-for="(r, index) in recipe.ingredients"
                :key="index + '_' + r.id"
              >
                {{ r }}
              </li>
            </ul>
          </div>
          <div class="wrapped">
            Instructions:
            <ol>
              <li v-for="s in recipe._instructions" :key="s.number">
                {{ s.step }}
              </li>
            </ol>
          </div>
        </div>
      </div>
      <!-- <pre>
      {{ $route.params }}
      {{ recipe }}
    </pre
      > -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null,
      saveToFavorite: false,
      watchRecipe: true,
      id: 0
    };
  },
  mounted() {
    this.updateData();
  },
  methods: {
    async updateData() {
      try {
        let response;
        // response = this.$route.params.response;
        console.log(this.$route.params.recipeId);
        try {
          this.id = this.$route.params.recipeId;
          if (this.id > 0) {
            //info about clicked recipe
            response = await this.axios.get(
              `http://localhost:3001/recipes/recipeInfo/${this.id}`
            );

            if ($cookies.get("session") != null) {
              let anotherRes = await this.axios.post(
                "http://localhost:3001/users/addToWatchTable/",
                {
                  recipeId: this.id
                }
              );
              //info about if user save recipe to favorites
              let userRecipeDetails = await this.axios.get(
                `http://localhost:3001/users/singleRecipeInfo/${this.id}`
              );
              this.saveToFavorite = userRecipeDetails.data.saved;
            }
            if (response.status !== 200) this.$router.replace("/NotFound");
          } else {
            response = await this.axios.get(
              `http://localhost:3001/users/myRecipeInfo/${this.id}`
            );
            let image = await this.axios.get(
              `http://localhost:3001/users/image/${response.data.image}`
            );
            response.data.image = "data:image/jpeg;base64," + image.data;
            console.log(response.data);
            console.log("debugging");
          }
        } catch (error) {
          console.log("error.response.status", error.response.status);
          this.$router.replace("/NotFound");
          return;
        }

        let {
          analyzedInstructions,
          instructions,
          ingredients,
          aggregateLikes,
          readyInMinutes,
          image,
          title,
          vegan,
          vegetarian,
          glutenFree,
          servings
        } = response.data;

        let _instructions;
        if (this.id > 0) {
          _instructions = analyzedInstructions
            .map(fstep => {
              fstep.steps[0].step = fstep.name + fstep.steps[0].step;
              return fstep.steps;
            })
            .reduce((a, b) => [...a, ...b], []);
          console.log("from spooncular api: " + _instructions);
        } else {
          console.log(analyzedInstructions);
          _instructions = analyzedInstructions.steps;
          console.log("from DB: " + _instructions);
        }

        let _recipe = {
          instructions,
          _instructions,
          analyzedInstructions,
          ingredients,
          aggregateLikes,
          readyInMinutes,
          image,
          title,
          vegan,
          vegetarian,
          glutenFree,
          servings
        };

        this.recipe = _recipe;
      } catch (error) {
        console.log(error);
      }
    },
    async favoriteCheck() {
      this.saveToFavorite = true;
      await this.axios.post("http://localhost:3001/users/addToFavorites/", {
        recipeId: this.id
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.wrapped {
  width: 50%;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
/* .recipe-header{

} */
</style>
