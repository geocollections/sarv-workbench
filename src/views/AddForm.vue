<template>
  <div class="add-form">

    <div class="row mt-3 mb-4">
      <div class="col">

        <ul class="nav nav-pills">
          <li class="nav-item" v-for="item in $route.meta.subForms">
            <router-link class="nav-link" :to="{ path: item.path }">{{ $t(item.name) }}</router-link>
          </li>
        </ul>

      </div>
    </div>

    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "AddForm",

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
