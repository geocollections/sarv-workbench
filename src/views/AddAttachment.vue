<template>
  <div class="add-attachment">

    <div class="row mt-3 mb-4">
      <div class="col">

        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/photo_archive' }">{{ $t('add.photoArchive') }}</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/specimen_image' }">{{ $t('add.specimenImage') }}</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/other_file' }">{{ $t('add.otherFiles') }}</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/digitised_reference' }">{{ $t('add.digitisedReference') }}</router-link>
          </li>
        </ul>

      </div>
    </div>

    <router-view/>

  </div>
</template>

<script>

  export default {
    name: "AddAttachment",
    metaInfo () {
      return {
        title: this.$t('titles.addAttachment')
      }
    },
  }
</script>

<style scoped>
  .router-link-active {
    color: #fff;
    background-color: #007bff;
  }

</style>
