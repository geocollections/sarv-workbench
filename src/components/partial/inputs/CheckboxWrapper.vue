<template>
  <div class="input-class">
    <v-checkbox class="ma-1" hide-details v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  name: "CheckboxWrapper",
  inheritAttrs: false
};
</script>

<style scoped>
.input-class >>> .v-label {
  margin-bottom: 0;
}
</style>
