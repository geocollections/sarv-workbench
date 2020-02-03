<template>
  <div class="add-form">
    <div class="d-flex flex-wrap justify-content-between mt-2 mb-1">
      <div class="pr-4">
        <p class="h2 mb-1">{{ $t($route.meta.addNew) }}</p>
      </div>

      <v-tabs
        v-if="$route.meta.object === 'attachment'"
        :color="appSettings.bodyActiveColor"
        :background-color="appSettings.bodyColor"
        right
        show-arrows
      >
        <v-tab
          v-for="(item, index) in $route.meta.subForms"
          :key="index"
          :to="{ path: item.path }"
          class="text-none"
          >{{ $t(item.name) }}</v-tab
        >
      </v-tabs>
    </div>

    <router-view
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
      :is-body-active-color-dark="appSettings.bodyActiveColorDark"
    />

    <object-permissions
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
    />

    <bottom-options
      :body-color="appSettings.bodyColor"
      :is-navbar-dark="appSettings.navbarDark"
      :navbar-color="appSettings.navbarColor"
      :object="$route.meta.object"
    />
  </div>
</template>

<script>
import BottomOptions from "../components/partial/BottomOptions";
import { mapState } from "vuex";
import ObjectPermissions from "../components/partial/ObjectPermissions";

export default {
  name: "AddForm",
  components: {ObjectPermissions, BottomOptions },
  computed: {
    ...mapState(["appSettings"])
  }
};
</script>

<style scoped></style>
