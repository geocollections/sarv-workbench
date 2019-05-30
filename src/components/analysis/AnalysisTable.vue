<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/analysis/' + entity.id }" :title="$t('editDoi.editMessage')">{{
        entity.identifier }}
      </router-link>
    </td>


    <td>
      <!-- Api returns server error 500 for this field, maybe not in models? -->
      <!--      {{ entity.datacite_created }}-->
    </td>

    <td>
      <a v-if="!entity.is_private" href="javascript:void(0)" @click="openGeoInNewWindow({object: 'analysis', id: entity.id})"
         :title="$t('editDoi.viewMessage')">{{ $t('edit.view') }}</a>
    </td>

<!--    <td>-->
<!--      <a v-if="entity.identifier" href="javascript:void(0)" @click="openDOI({doi: entity.identifier})">DOI</a>-->
<!--    </td>-->

  </tr>
  </tbody>
</template>

<script>
  import formManipulation from "../mixins/formManipulation";

  export default {
    mixins: [formManipulation],
    name: "AnalysisTable",
    props: {
      response: {
        type: Object
      },
    }
  }
</script>

<style scoped>

</style>
