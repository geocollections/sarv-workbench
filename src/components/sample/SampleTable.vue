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

    <td>
      <router-link :to="{ path: '/locality/' + entity.locality }" :title="$t('editLocality.viewMessage')"
                   v-if="entity.locality__locality || entity.locality__locality_en">
        <span v-translate="{ et: entity.locality__locality, en: entity.locality__locality_en }"></span>
      </router-link>

      <span v-else-if="entity.locality_free">{{ entity.locality_free }}</span>

      <span v-else-if="entity.site__name">{{ entity.site__name }}</span>
    </td>

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
