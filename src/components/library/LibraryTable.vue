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
  import formManipulation from './../mixins/formManipulation'

  export default {
    mixins: [formManipulation],
    name: "LibraryTable",
    props: {
      response: {
        type: Object
      },
    }
  }
</script>

<style scoped>

</style>
