<template>
  <b-container>
    <h4>
      <p></p>
      <b>{{ title }}:</b>
      <p></p>
      <slot></slot>
    </h4>
    <b-col>
      <b-row v-for="r in recipesList" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-row>
    </b-col>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    recipesList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
