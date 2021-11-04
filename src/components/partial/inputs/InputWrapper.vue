<template>
  <div class="input-class">
    <v-text-field
      background-color="white"
      dense
      hide-details
      outlined
      :placeholder="!!$attrs.placeholder ? $attrs.placeholder : ' '"
      :error="useCustomState ? $attrs.error : useState ? !$attrs.value : false"
      :success="
        useCustomState ? $attrs.success : useState ? !!$attrs.value : false
      "
      v-bind="$attrs"
      v-on="$listeners"
      :title="$attrs.value"
    >
      <template v-if="isDate" v-slot:prepend-inner>
        <v-icon small>far fa-calendar-alt</v-icon>
      </template>

      <template v-if="useState || isDate" v-slot:append>
        <div
          class="v-input__icon v-input__icon--clear"
          style="cursor: pointer"
          v-if="isDate"
        >
          <v-icon @click="$emit('date:clear')">fas fa-times</v-icon>
        </div>
        <div v-else>
          <v-icon small v-if="!$attrs.value" color="red"
            >fas fa-exclamation-circle</v-icon
          >
          <v-icon small v-else color="green">fas fa-check</v-icon>
        </div>
      </template>

      <template v-else-if="useCustomState" v-slot:append>
        <v-icon small v-if="$attrs.error" color="red"
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
    useState: Boolean,
    useCustomState: Boolean,
  },
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
