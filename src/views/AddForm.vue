<template>
  <div class="add-form">
    <div class="d-flex flex-wrap justify-content-between mt-2 mb-1">
      <div class="pr-4">
        <p class="h2 mb-1">{{ $t($route.meta.addNew) }}</p>
      </div>

      <v-tabs
        v-if="$route.meta.object === 'attachment'"
        :color="bodyActiveColor"
        :background-color="bodyColor"
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

    <SpinnerWrapper />

    <router-view
      :body-color="bodyColor"
      :body-active-color="bodyActiveColor"
      :is-body-active-color-dark="bodyActiveColorDark"
    />

    <object-permissions
      v-if="false"
      :body-color="bodyColor"
      :body-active-color="bodyActiveColor"
    />

    <bottom-options
      :body-color="bodyColor"
      :is-navbar-dark="navbarDark"
      :navbar-color="navbarColor"
      :object="$route.meta.object"
    />
  </div>
</template>

<script>
import BottomOptions from "../components/partial/BottomOptions";
import { mapState } from "vuex";
import ObjectPermissions from "../components/partial/ObjectPermissions";
import SpinnerWrapper from "../components/partial/SpinnerWrapper";

export default {
  name: "AddForm",
  components: { SpinnerWrapper, ObjectPermissions, BottomOptions },
  computed: {
    ...mapState("settings", [
      "bodyColor",
      "bodyActiveColor",
      "bodyActiveColorDark",
      "navbarDark",
      "navbarColor"
    ])
  }
};
</script>

<style scoped></style>
