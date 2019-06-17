<template>
  <div class="sample-wrapper">
    <slot name="loader"></slot>
    <slot name="basic-form" v-if="fullView"></slot>
    <slot name="simplified-form" v-if="!fullView"></slot>
    <slot name="privacy"></slot>
    <slot name="related-data" v-if="fullView"></slot>
    <slot name="buttons"></slot>
  </div>
</template>

<script>
    export default {
        name: "SampleWrapper",
      props: {
        fullView: {
          type: Boolean,
          default: true
        },
      }
    }
</script>

<style scoped>

</style>
