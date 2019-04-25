<template>
  <tbody>
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/project/' + entity.id }" :title="$t('editProject.editMessage')">{{
        entity.id }}
      </router-link>
    </td>
    <td>
      <router-link :to="{ path: '/project/' + entity.id }" :title="$t('editProject.editMessage')">{{
        entity.name }}
      </router-link>
    </td>
    <td v-translate="{ et: entity.project_type__name, en: entity.project_type__name_en }"></td>
    <td>{{entity.date_start}}</td>
    <td>{{entity.date_end}}</td>
    <td>{{entity.date_free}}</td>
    <td>{{entity.owner__agent}}</td>
  </tr>

  </tbody>
</template>

<script>
    export default {
      name: "ProjectTable",
      props: {
        response: {
          type: Object
        },
      }
    }
</script>

<style scoped>

</style>
