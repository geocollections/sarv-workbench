<template>
  <div class="input-class">
    <v-select
      background-color="white"
      :clearable="typeof $attrs.clearable !== 'undefined' ? $attrs.clearable : true"
      clear-icon="fas fa-times"
      dense
      hide-details
      outlined
      placeholder=" "
      :item-color="$attrs.color"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-slot:item="data">
        <div class="v-list-item__content">
          <div class="v-list-item__title">
            {{ $t(translationPrefix + data.item[$attrs["item-text"]]) }}
          </div>
        </div>
      </template>

      <template v-slot:selection="data">
        <div class="v-select__selection">{{ $t(translationPrefix + data.item[$attrs["item-text"]]) }}</div>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: "SelectWrapper",
  inheritAttrs: false,
  props: {
    translationPrefix: String
  }
};
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
