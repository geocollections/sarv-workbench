<template>
  <div class="sample-wrapper">
    <slot name="loader"></slot>
    <slot name="switch"></slot>
    <slot name="basic-form" v-if="!simpleView"></slot>
    <slot name="simplified-form" v-if="simpleView"></slot>
    <slot name="privacy"></slot>
    <slot name="related-data" v-if="!simpleView"></slot>
    <slot name="buttons"></slot>
  </div>
</template>

<script>
export default {
  name: "SampleWrapper",
  props: {
    simpleView: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
