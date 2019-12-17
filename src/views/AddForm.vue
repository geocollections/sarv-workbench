<template>
  <div class="add-form">
    <div class="d-flex flex-wrap justify-content-between mt-2 mb-1">
      <div class="pr-4">
        <p class="h2 mb-1">{{ $t($route.meta.addNew) }}</p>
      </div>

      <div class="mb-1" v-if="$route.meta.object === 'attachment'">
        <ul
          class="nav nav-pills nav-fill"
          v-if="$route.meta.object === 'attachment'"
        >
          <li
            class="nav-item"
            v-for="(item, index) in $route.meta.subForms"
            :key="index"
          >
            <router-link class="nav-link" :to="{ path: item.path }">{{
              $t(item.name)
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <router-view
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
      :is-body-active-color-dark="appSettings.bodyActiveColorDark"
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

export default {
  name: "AddForm",
  components: { BottomOptions },
  metaInfo() {
    return {
      title: this.$t(this.$route.meta.title)
    };
  },
  computed: {
    ...mapState(["appSettings"])
  }
};
</script>

<style scoped></style>
