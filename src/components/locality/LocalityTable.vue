<template>
  <tbody>
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/locality/' + entity.id }" :title="$t('editLocality.editMessage')">{{
        entity.id }}
      </router-link>
    </td>

    <td>{{ entity.locality }}</td>

    <td>{{ entity.number }}</td>

    <td>{{ entity.country }}</td>

    <td>{{ entity.agent }}</td>

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
