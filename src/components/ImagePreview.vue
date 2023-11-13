<template>
  <v-img
    class="image-preview grey lighten-2"
    :src="src"
    :lazy-src="lazySrc"
    :contain="contain"
    :aspect-ratio="square ? 1 : undefined"
    min-height="50"
    min-width="50"
    :max-height="max"
    :max-width="max"
  >
    <template v-slot:placeholder>
      <v-row no-gutters class="fill-height" align="center" justify="center">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-row>
    </template>
  </v-img>
</template>

<script>
export default {
  name: "ImagePreview",
  props: {
    src: {
      type: String,
      required: true,
    },
    lazySrc: {
      type: String,
      required: false,
    },
    contain: {
      type: Boolean,
      required: false,
    },
    square: {
      type: Boolean,
      required: false,
    },
    max: {
      type: String,
      required: false,
    },
  },
};
</script>

<style scoped>
.image-preview {
  border-radius: 4px;
}
</style>
