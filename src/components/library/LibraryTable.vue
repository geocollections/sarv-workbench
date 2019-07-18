<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/library/' + entity.library }" :title="$t('editLibrary.editMessage')">
        {{ entity.library }}
      </router-link>
    </td>

    <td>
      <router-link :to="{ path: '/library/' + entity.library }" :title="$t('editLibrary.editMessage')">
        {{ entity.library__title }}
      </router-link>
    </td>

    <td>{{ entity.agent__agent }}</td>

    <td class="text-center">
<!--      <b-form-checkbox-->
<!--        id="is_private"-->
<!--        v-model="entity.library__is_private"-->
<!--        @change="handlePrivateState"-->
<!--        :value="0"-->
<!--        :unchecked-value="1">-->
<!--      </b-form-checkbox>-->


      <vs-checkbox id="is_private"
                   v-model="entity.library__is_private"
                   @input="$parent.$emit('toggle-library-state', entity.library__is_private, entity.library)"
                   icon="fa-lock"
                   icon-pack="fas">
      </vs-checkbox>
    </td>

    <td>
      <a href="javascript:void(0)" v-if="!entity.library__is_private" @click="openGeoInNewWindow({object: 'library', id: entity.library})"
         :title="$t('editLibrary.viewMessage')">{{ $t('edit.view') }}</a>
    </td>

  </tr>
  </tbody>



</template>

<script>
  import formManipulation from '../../mixins/formManipulation'

  export default {
    mixins: [formManipulation],
    name: "LibraryTable",
    props: {
      response: {
        type: Object
      },
    },
    methods: {
      handlePrivateState(state, libraryID) {
        console.log(state)
        console.log(libraryID)
      },
    }
  }
</script>

<style scoped>

</style>
