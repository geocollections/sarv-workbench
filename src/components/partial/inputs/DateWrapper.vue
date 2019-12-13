<template>
  <v-menu
    v-model="menuState"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <input-wrapper
        v-bind="$attrs"
        is-date
        v-on="on"
        v-on:date:clear="$emit('date:clear')"
      />
    </template>
    <v-date-picker
      @input="menuState = false"
      :header-color="`${$attrs.color} darken-3`"
      scrollable
      v-bind="$attrs"
      v-on="$listeners"
    />
  </v-menu>
</template>

<script>
import InputWrapper from "./InputWrapper";
export default {
  name: "DateWrapper",
  components: { InputWrapper },
  inheritAttrs: false,
  data: () => ({
    menuState: false
  })
};
</script>

<style scoped></style>
