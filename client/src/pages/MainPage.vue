<template>
  <div class="container">
    <!-- <h1 class="title">Main Page</h1> -->
    <b-row>
      <b-col>
        <RandomRecipePreviewList />
        <!-- <button v-on:click="updateRandomRecipes">refresh recipes</button> -->
      </b-col>

      <!-- <b-col v-if="$cookies.get('session') == null">
        <login-page></login-page>
      </b-col> -->
      <b-col v-if="!$root.store.username || $cookies.get('session') == null">
        <login-page></login-page>
      </b-col>
      <b-col v-else>
        <LastWatchRecipePreviewList />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RandomRecipePreviewList from "../components/RandomRecipePreviewList";
import LastWatchRecipePreviewList from "../components/LastWatchRecipePreviewList";
import LoginPage from "./LoginPage";
export default {
  components: {
    RandomRecipePreviewList,
    LoginPage,
    LastWatchRecipePreviewList,
  },
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
</style>
