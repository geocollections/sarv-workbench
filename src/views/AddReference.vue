<template>
  <div class="add-reference">

    <router-view/>

  </div>
</template>

<script>
  export default {
    name: "AddReference",
    metaInfo () {
      return {
        title: this.$t('titles.addReference')
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
