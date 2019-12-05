<template>
  <div class="input-class">
    <v-textarea
      background-color="white"
      dense
      hide-details
      outlined
      rows="3"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
export default {
  name: "TextareaWrapper"
};
</script>

<style scoped>
/* Adding border to input because outlined has fixed height */
.input-class >>> .v-input {
  /*border: 1px solid;*/
}

/* Centers text in input */
.input-class >>> .v-text-field input {
  /*padding: 8px 0 8px !important;*/
}
</style>
