<template>
  <div>
    <button v-on:click="submitFile()">Submit</button>
    <div class="recipe-header mt-3 mb-4">
      <img v-if="this.image != null" :src="this.image" class="center" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: null
    };
  },
  methods: {
    async submitFile() {
      const response = await this.axios.get(
        "http://localhost:3001/users/image/pizza for test.jpeg"
      );
      this.image = "data:image/jpeg;base64," + response.data;
      console.log(this.image);
    },

    dataUrl(response) {
      return (
        "data:image/jpeg;base64," +
        btoa(
          new Uint8Array(response).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )
      );
    },

    hexToBase64(str) {
      return btoa(
        String.fromCharCode.apply(
          null,
          str
            .replace(/\r|\n/g, "")
            .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
            .replace(/ +$/, "")
            .split(" ")
        )
      );
    }
  }
};
</script>