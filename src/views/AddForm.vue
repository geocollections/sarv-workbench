<template>
  <div class="add-form">

    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t($route.meta.addNew) }}</p>
      </div>

      <!-- TODO: Enable if more than one subform -->
      <div class="col-sm-6 text-right" v-if="$route.meta.object === 'attachment'">
        <ul class="nav nav-pills">
          <li class="nav-item" v-for="item in $route.meta.subForms">
            <router-link class="nav-link" :to="{ path: item.path }">{{ $t(item.name) }}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <router-view/>

    <bottom-options :object="$route.meta.object" :is-navigation-shown="$route.meta.isNavigationShown" v-if="$route.meta.isBottomOptionShown"/>

  </div>
</template>

<script>
  import BottomOptions from "../components/partial/BottomOptions";
  export default {
    name: "AddForm",
    components: {BottomOptions},
    metaInfo () {
      return {
        title: this.$t(this.$route.meta.title)
      }
    },
  }
</script>

<style scoped>
  .router-link-exact-active {
    color: #fff;
    background-color: #007bff;
  }
</style>
