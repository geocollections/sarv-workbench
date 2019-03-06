<template>
  <tbody>
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/locality/' + entity.id }" :title="$t('editLocality.editMessage')">{{
        entity.id }}
      </router-link>
    </td>

    <td v-translate="{ et: entity.locality, en: entity.locality_en }"></td>

    <td>{{ entity.number }}</td>

    <td  v-translate="{ et: entity.country__value, en: entity.country__value_en }"></td>

    <td>{{ entity.user_added }}</td>

  </tr>

  </tbody>
</template>

<script>
    export default {
      name: "LocalityTable",
      props: {
        response: {
          type: Object
        },
      }
    }
</script>

<style scoped>

</style>
