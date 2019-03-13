<template>
  <div class="add-reference">

    <div class="row mt-3 mb-4">
      <div class="col">

        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/reference/add' }">{{ $t('add.reference') }}</router-link>
          </li>
        </ul>

      </div>
    </div>

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
