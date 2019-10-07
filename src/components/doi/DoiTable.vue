<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/doi/' + entity.id }" :title="$t('editDoi.editMessage')">{{
        entity.identifier }}
      </router-link>
    </td>

    <td>{{ entity.creators }}</td>

    <td>{{ entity.publication_year }}</td>

    <td>{{ entity.title }}</td>

    <td>{{ entity.resource_type__value }}</td>

    <td>
      <span v-if="entity.datacite_created">
              {{ new Date(entity.datacite_created).toDateString() }}
      </span>
    </td>

    <td>
      <a v-if="!entity.is_private" :href="getSarvDoiUrl(entity.identifier)" target="SarvDoiWindow"
         :title="getSarvDoiUrl(entity.identifier)">{{ $t('edit.view') }}</a>
    </td>

<!--    <td>-->
<!--      <a v-if="entity.identifier" href="javascript:void(0)" @click="openDOI({doi: entity.identifier})">DOI</a>-->
<!--    </td>-->

  </tr>
  </tbody>
</template>

<script>
  import formManipulation from "../../mixins/formManipulation";

  export default {
    mixins: [formManipulation],
    name: "DoiTable",
    props: {
      response: {
        type: Object
      },
    }
  }
</script>

<style scoped>

</style>
