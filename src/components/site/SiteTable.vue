<template>
  <tbody>
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/site/' + entity.id }" :title="$t('editSite.editMessage')">{{
        entity.id }}
      </router-link>
    </td>
    <td v-translate="{ et: entity.name, en: entity.name_en }"></td>
    <td v-translate="{ et: entity.project__name, en: entity.project__name_en }"></td>
    <!--<td>{{entity.date_start}}</td>-->
    <!--<td>{{entity.date_end}}</td>-->
    <!--<td>{{entity.date_free}}</td>-->
  </tr>

  </tbody>
</template>

<script>
    export default {
      name: "SiteTable",
      props: {
        response: {
          type: Object
        },
      }
    }
</script>

<style scoped>

</style>
