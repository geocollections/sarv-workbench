<template>
  <tbody>
  <tr v-for="entity in response.results">
    <td>
      <router-link :to="{ path: '/site/' + entity.id }" :title="$t('editSite.editMessage')">{{
        entity.id }}
      </router-link>
    </td>

    <td v-translate="{ et: entity.name, en: entity.name_en }"></td>

    <td>{{entity.number}}</td>

    <td v-translate="{ et: entity.project__name, en: entity.project__name_en }"></td>

    <td>{{ parseDate(entity.date_start)}}</td>

    <td>{{ parseDate(entity.date_end)}}</td>
  </tr>
  </tbody>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "SiteTable",
    props: {
      response: {
        type: Object
      },
    },

    methods: {
      parseDate(date) {
        if (date) {
          return moment(String(date)).format('DD.MM.YYYY HH:mm')
        }
      }
    }
  }
</script>

<style scoped>

</style>
