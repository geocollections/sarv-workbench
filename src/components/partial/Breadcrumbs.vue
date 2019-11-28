<template>
  <div class="breadcrumbs" v-if="items && items.length > 0">
    <span v-for="(entity, index) in items" :key="index">
      <router-link
        class="sarv-link"
        :class="bodyActiveColor + '--text'"
        :to="{ path: entity.href }"
      >
        {{ entity.text }}
      </router-link>
      <span v-if="index !== items.length - 1" class="mx-2">{{ divider }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    items: {
      type: Array,
      required: true
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    },
    divider: {
      type: String,
      required: false,
      default: "-"
    }
  }
};
</script>

<style scoped>
.breadcrumbs {
  white-space: nowrap;
  overflow-x: auto;
}

.breadcrumbs::-webkit-scrollbar {
  background: transparent;
  height: 4px;
}

.breadcrumbs::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.33);
  border-radius: 10px;
}

.breadcrumbs::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.66);
}
</style>
