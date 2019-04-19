<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/library/' + entity.library }" :title="$t('editLibrary.editMessage')">
        {{ entity.library }}
      </router-link>
    </td>

    <td>{{ entity.agent__agent }}</td>

    <td v-translate="{ et: entity.library__title, en: entity.library__title_en }"></td>

    <td>
      <b-form-checkbox
        id="is_private"
        v-model="entity.library__is_private"
        :value="0"
        :unchecked-value="1"
        :disabled="true">
      </b-form-checkbox>
    </td>

    <td>
      <a href="javascript:void(0)" v-if="!entity.library__is_private" @click="openGeoInNewWindow({object: 'library', id: entity.library})"
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
