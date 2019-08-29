<template>
  <div class="add-form">

    <div class="d-flex flex-wrap justify-content-between mt-4">
      <div class="pr-4">
        <p class="h2">{{ $t($route.meta.addNew) }}</p>
      </div>

      <div class="mb-2" v-if="$route.meta.object === 'attachment'">
        <ul class="nav nav-pills nav-fill" v-if="$route.meta.object === 'attachment'">
          <li class="nav-item" v-for="item in $route.meta.subForms">
            <router-link class="nav-link" :to="{ path: item.path }">{{ $t(item.name) }}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <hr class="mt-1 mb-2 divider">

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

  .divider {
    border-color: #999;
  }
</style>
