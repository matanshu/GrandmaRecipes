<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <!-- <b-navbar-brand>Recipes - Ido Matan</b-navbar-brand> -->

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item>
              <router-link class="link" :to="{ name: 'main' }">
                Main
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="link" :to="{ name: 'search' }"
                >Search</router-link
              >
            </b-nav-item>
            <b-nav-item>
              <router-link class="link" :to="{ name: 'about' }"
                >About</router-link
              >
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto" v-if="$root.store.username">
            <b-nav-item-dropdown
              text="Personal"
              style="font-weight: bold"
              right
            >
              <b-dropdown-item>
                <router-link :to="{ name: 'favoriteRecipes' }">
                  My Favorite Recipes</router-link
                >
              </b-dropdown-item>
              <b-dropdown-item>
                <router-link :to="{ name: 'myRecipes' }">
                  My Recipes</router-link
                >
              </b-dropdown-item>

              <b-dropdown-item>
                <router-link :to="{ name: 'familyRecipes' }">
                  My Family Recipes</router-link
                >
              </b-dropdown-item>

              <b-dropdown-item>
                <router-link :to="{ name: 'singleFile' }">
                  test file Upload</router-link
                >
              </b-dropdown-item>

              <b-dropdown-item v-b-modal.modal-prevent-closing>
                Create New Recipe
              </b-dropdown-item>

              <b-modal
                id="modal-prevent-closing"
                ref="modal"
                title="Recipe Details:"
                @show="onReset"
                @ok="onCreate"
              >
                <form ref="form" @submit.stop.prevent="onCreate">
                  <b-form-group
                    id="input-group-username"
                    label-cols-sm="3"
                    label="Recipe Name:"
                    label-for="recipeName"
                  >
                    <b-form-input
                      id="recipeName"
                      v-model="$v.form.recipeName.$model"
                      type="text"
                      :state="validateState('recipeName')"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="!$v.form.recipeName.required"
                    >
                      Recipe Name is required
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group
                    id="input-group-readyInMinutes"
                    label-cols-sm="3"
                    label="Ready In Minutes:"
                    label-for="readyInMinutes"
                  >
                    <b-form-input
                      id="readyInMinutes"
                      v-model="$v.form.readyInMinutes.$model"
                      type="number"
                      :state="validateState('readyInMinutes')"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="!$v.form.readyInMinutes.required"
                    >
                      Ready In Minutes is required
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group
                    id="input-group-servingsAmount"
                    label-cols-sm="3"
                    label="Servings amount:"
                    label-for="servingsAmount"
                  >
                    <b-form-input
                      id="servingsAmount"
                      v-model="$v.form.servingsAmount.$model"
                      type="number"
                      :state="validateState('servingsAmount')"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="!$v.form.servingsAmount.required"
                    >
                      servings amount is required
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group>
                    <b-form-checkbox-group
                      id="checkbox-group-2"
                      v-model="selected"
                      name="flavour-2"
                    >
                      <b-form-checkbox value="vegan">Vegan</b-form-checkbox>
                      <b-form-checkbox value="vegeterian"
                        >Vegeterian</b-form-checkbox
                      >
                      <b-form-checkbox value="glutenFree"
                        >Gluten Free</b-form-checkbox
                      >
                    </b-form-checkbox-group>
                  </b-form-group>

                  <b-form-group
                    id="input-group-ingredient"
                    label="Ingredients:"
                    label-for="ingredient"
                  >
                    <p v-for="(i, index) in ingredients" :key="i.id">
                      <b-container>
                        <b-row>
                          <b-col>
                            <button
                              type="button"
                              @click="removeIngredient(index)"
                            >
                              delete
                            </button>
                          </b-col>

                          <b-col sm="9">
                            <b-form-input
                              v-model="ingredients[index]"
                              id="ingredient"
                              type="text"
                            >
                            </b-form-input>
                          </b-col>
                        </b-row>
                      </b-container>
                    </p>
                    <button type="button" @click="addIngredient">
                      add ingredient
                    </button>
                  </b-form-group>

                  <b-form-group
                    id="input-group-instruction"
                    label="Instructions:"
                    label-for="instruction"
                  >
                    <p v-for="(i, index) in instructions" :key="i.id">
                      <b-container>
                        <b-row>
                          <b-col>
                            <button
                              type="button"
                              @click="removeInstruction(index)"
                            >
                              delete
                            </button>
                          </b-col>

                          <b-col sm="9">
                            <b-form-input
                              v-model="instructions[index]"
                              id="instruction"
                              type="text"
                            >
                            </b-form-input>
                          </b-col>
                        </b-row>
                      </b-container>
                    </p>
                    <button type="button" @click="addInstruction">
                      add instruction
                    </button>
                  </b-form-group>
                  <div class="container">
                    <div class="large-12 medium-12 small-12 cell">
                      <label
                        >File
                        <input
                          type="file"
                          id="file"
                          ref="file"
                          v-on:change="handleFileUpload()"
                        />
                      </label>
                      <!-- <button v-on:click="submitFile()">Submit</button> -->
                    </div>
                  </div>
                </form>
              </b-modal>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <template v-slot:button-content>
                <em>
                  <b> {{ $root.store.username }} </b>
                </em>
              </template>
              <b-dropdown-item href="Logout" @click="Logout"
                >Sign Out</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto" v-else>
            <b-navbar-brand>Hellow Guest!</b-navbar-brand>
            <b-nav-item>
              <router-link class="link" :to="{ name: 'login' }"
                >Login</router-link
              >
            </b-nav-item>
            <b-nav-item>
              <router-link class="link" :to="{ name: 'register' }"
                >Register</router-link
              >
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import {
  checkIfContainsNumber,
  checkIfContainsSpecialChar
} from "./validators/password";

import {
  required,
  minLength,
  maxLength,
  alpha,
  sameAs,
  email,
  url
} from "vuelidate/lib/validators";
export default {
  data() {
    return {
      form: {
        recipeName: "",
        readyInMinutes: 0,
        servingsAmount: 0
      },
      //ingredients: [{ ingredient: "dsfds" }]
      imagePath: "",
      instructions: [""],
      ingredients: [""],
      selected: [],
      errors: [],
      validated: false,
      name: "App",
      results: null,
      file: ""
    };
  },
  validations: {
    form: {
      recipeName: {
        required
      },
      readyInMinutes: {
        required
      },
      servingsAmount: {
        required
      }
      // fileImage: {
      //   required,
      // },
    }
  },
  methods: {
    submitFile() {
      let formData = new FormData();
      formData.append("file", this.file);
      this.axios
        .post("http://localhost:3001/users/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function() {
          console.log("SUCCESS!!");
        })
        .catch(function() {
          console.log("FAILURE!!");
        });
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    addIngredient() {
      this.ingredients.push("");
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1);
    },
    addInstruction() {
      this.instructions.push("");
    },
    removeInstruction(index) {
      this.instructions.splice(index, 1);
    },
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },

    onCreate(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.form.submitError = undefined; //maybe
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });

      this.submitFile();
      this.createRecipe();
    },
    async createRecipe() {
      try {
        let analyzedInstructions = {};
        analyzedInstructions.steps = [];
        for (let i = 0; i < this.instructions.length; i++) {
          analyzedInstructions.steps.push({
            number: i + 1,
            step: this.instructions[i]
          });
        }

        console.log("title: " + this.form.recipeName);
        console.log("readyInMinutes: " + this.form.readyInMinutes);
        console.log("vegan: " + this.selected.includes("vegan"));
        console.log("vegetarian: " + this.selected.includes("vegetarian"));
        console.log("glutenFree: " + this.selected.includes("glutenFree"));
        console.log("ingredients: " + this.ingredients);
        console.log("analyzedInstructions: " + analyzedInstructions);
        console.log("servingsAmounts: " + this.form.servingsAmount);
        //console.log(this.form.file.name);
        // let formData = new FormData();
        // formData.append("file", this.file);
        const response = await this.axios.post(
          "http://localhost:3001/users/createRecipe",
          {
            // image: formData,
            title: this.form.recipeName,
            readyInMinutes: this.form.readyInMinutes,
            aggregateLikes: 0,
            vegan: this.selected.includes("vegan"),
            vegetarian: this.selected.includes("vegeterian"),
            glutenFree: this.selected.includes("glutenFree"),
            ingredients: this.ingredients,
            instructions: "",
            analyzedInstructions: analyzedInstructions,
            servings: this.form.servingsAmount
          }
          // {
          //   headers: {
          //     "Content-Type": "multipart/form-data"
          //   }
          // }
        );
      } catch (err) {
        console.log(err.response);
      }
    },
    onReset() {
      this.form = {
        recipeName: "",
        readyInMinutes: 0,
        instructions: "",
        servingsAmount: 0
      };
      this.selected = [];
      this.file = "";
      this.ingredients = [""];
      this.instructions = [""];

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    Logout() {
      this.$root.store.logout();
      this.$root.toast("Logout", "User logged out successfully", "success");

      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    }
  }
};
</script>
  
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.link {
  color: white;
  //font-weight: bold;
}

.has-link {
  padding: 0 !important;
  > div {
    cursor: pointer; // Enable click events on iOS
    padding: 0.5rem 1rem;
  }
}
</style>
