<template>
  <v-card>
    <v-card-title class="px-2 py-1" @click="internalOpen = !internalOpen">
      <slot name="title" />
      <v-spacer />
      <v-icon v-if="internalOpen">fas fa-chevron-up</v-icon>
      <v-icon v-else>fas fa-chevron-down</v-icon>
    </v-card-title>
    <v-expand-transition>
      <div v-show="internalOpen">
        <slot />
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "ExpandableCard",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      internalOpen: this.open,
    };
  },
};
</script>
