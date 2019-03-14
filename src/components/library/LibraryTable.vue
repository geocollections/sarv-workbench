<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/library/' + entity.id }" :title="$t('editLibrary.editMessage')">
        {{ entity.id }}
      </router-link>
    </td>
    <td>{{ entity.author_txt }}</td>
    <td v-translate="{ et: entity.title, en: entity.title_en }"></td>
    <td>{{ entity.is_private }}</td>
    <td>
      <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'library', id: entity.id})"
         :title="$t('editLibrary.viewMessage')">{{ $t('edit.view') }}</a>
    </td>

  </tr>
  </tbody>



</template>

<script>
  export default {
    name: "LibraryTable",
    props: {
      response: {
        type: Object
      },
    },
    methods: {
      openGeoInNewWindow(params) {
        let width = 600;
        switch (params.object) {
          case "specimen":
            width = 1050;
            break;
          case "locality":
            width = 1025;
            break;
          case "doi":
            width = 1000;
        }
        window.open('https://geocollections.info/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750')
      },
    }
  }
</script>

<style scoped>

</style>
