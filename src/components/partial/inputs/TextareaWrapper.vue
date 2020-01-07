<template>
  <div class="input-class">
    <v-textarea
      auto-grow
      background-color="white"
      dense
      hide-details
      placeholder=" "
      outlined
      rows="1"
      :error="useState ? !$attrs.value : false"
      :success="useState ? !!$attrs.value : false"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-if="useState" v-slot:append>
        <v-icon small v-if="!$attrs.value" color="red"
          >fas fa-exclamation-circle</v-icon
        >
        <v-icon small v-else color="green">fas fa-check</v-icon>
      </template>
    </v-textarea>
  </div>
</template>

<script>
export default {
  name: "TextareaWrapper",
  props: {
    useState: Boolean
  }
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
