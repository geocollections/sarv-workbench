<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/analysis/' + entity.id }" :title="$t('editDoi.editMessage')">{{
        entity.id }}
      </router-link>
    </td>

    <td>
      <router-link :to="{ path: '/sample/' + entity.sample__id }" :title="$t('editDoi.editMessage')">
        {{entity.sample__id}}
      </router-link>
    </td>
    <td>{{entity.sample__number}}</td>
    <td>{{entity.sample__locality__locality}}</td>
    <td>{{entity.sample__depth}}</td>
    <td>{{entity.analysis_method__analysis_method}}</td>
    <td>{{entity.date}}</td>
    <td>{{entity.lab_txt}}</td>
    <td>{{entity.agent__agent}}</td>

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
