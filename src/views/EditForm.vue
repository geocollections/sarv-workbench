<template>
  <div class="edit-form">

    <div class="row mt-4">
      <div class="col">
        <p class="h2">{{ $t($route.meta.heading) }}: <b>{{$route.params.id}}</b></p>
      </div>
    </div>

    <router-view/>

  </div>
</template>

<script>
  export default {
    name: "EditForm",
    metaInfo () {
      return {
        title: this.$t(this.$route.meta.title) + ' ' + this.$route.params.id
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
