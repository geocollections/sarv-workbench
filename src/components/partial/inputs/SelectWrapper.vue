<template>
  <div class="input-class">
    <v-select
      background-color="white"
      clearable
      clear-icon="fas fa-times"
      dense
      hide-details
      outlined
      placeholder=" "
      :item-color="$attrs.color"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
  export default {
    name: "SelectWrapper",
    inheritAttrs: false
  }
</script>

<style scoped>
  /* Adding margin auto to inner icon (close-icon) */
  .input-class >>> .v-input__append-inner {
    margin: auto !important;
  }

  /* Small size to clear icon */
  .input-class >>> .v-input__append-inner > .v-input__icon--clear > .v-icon {
    font-size: 20px;
  }
</style>
