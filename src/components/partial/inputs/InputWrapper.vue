<template>
  <div class="input-class">
    <v-text-field
      background-color="white"
      dense
      hide-details
      outlined
      :clearable="isDate"
      placeholder=" "
      clear-icon="fas fa-times"
      :readonly="isDate"
      :error="useState ? !$attrs.value : false"
      :success="useState ? !!$attrs.value : false"
      v-bind="$attrs"
      v-on="$listeners"
      :title="$attrs.value"
    >
      <template v-if="isDate" v-slot:prepend-inner>
        <v-icon small>far fa-calendar-alt</v-icon>
      </template>

      <template v-if="useState" v-slot:append>
        <v-icon small v-if="!$attrs.value" color="red"
          >fas fa-exclamation-circle</v-icon
        >
        <v-icon small v-else color="green">fas fa-check</v-icon>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: "InputWrapper",
  inheritAttrs: false,
  props: {
    isDate: Boolean,
    useState: Boolean
  }
};
</script>

<style scoped>
/* Adding border to input because outlined has fixed height */
.input-class >>> .v-input {
  /*border: 1px solid;*/
}

/* Overriding default min-height */
.input-class >>> .v-input__control {
  /*min-height: 20px !important;*/
}

/* Centers text in input */
.input-class >>> .v-text-field input {
  /*padding: 8px 0 8px !important;*/
}

/* Centers append-inner icon in input */
.input-class >>> .v-input__append-inner {
  margin: auto !important;
}

/* Centers prepend-inner icon in input */
.input-class >>> .v-input__prepend-inner {
  margin: auto !important;
}

/* Centers append-outer icon in input */
.input-class >>> .v-input__append-outer {
  /*margin: auto;*/
  /*margin-left: 9px;*/
}

/* Small size to clear icon */
.input-class >>> .v-input__append-inner > .v-input__icon--clear > .v-icon {
  font-size: 20px;
}
</style>
