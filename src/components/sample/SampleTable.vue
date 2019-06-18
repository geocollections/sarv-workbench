<template>
  <tbody>
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/sample/' + entity.id }" :title="$t('editSample.editMessage')">
        <span v-if="entity.number">{{ entity.number }}</span>
        <span v-else>{{entity.id }}</span>
      </router-link>
    </td>
    <td>{{ entity.id }}</td>
    <td v-translate="{ et: entity.locality__locality, en: entity.locality__locality_en }"></td>
    <td>{{ entity.depth }}</td>
    <td v-translate="{ et: entity.stratigraphy__stratigraphy, en: entity.stratigraphy__stratigraphy_en }"></td>
    <td>{{ entity.agent_collected__agent }}</td>
    <td></td>

  </tr>

  </tbody>
</template>

<script>
    export default {
      name: "SampleTable",
      props: {
        response: {
          type: Object
        },
      }
    }
</script>

<style scoped>

</style>
