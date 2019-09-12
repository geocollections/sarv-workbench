<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/specimen/' + entity.id }" :title="$t('specimen.editMessage')">
        {{entity.id }}
      </router-link>
    </td>

    <td>{{ entity.coll__number }}</td>

    <td>{{ entity.specimen_id }}</td>

    <td>{{ entity.specimen_nr }}</td>

    <td>
      <router-link v-if="entity.locality_id" :to="{ path: '/locality/' + entity.locality_id }" :title="$t('editLocality.editMessage')">
        <div v-translate="{et: entity.locality__locality ,en: entity.locality__locality_en}"></div>
      </router-link>

      <div v-else>{{ entity.locality_free }}</div>
    </td>

    <td>
      <span>{{ entity.depth }}</span>
      <span v-if="entity.depth_interval"> ({{ entity.depth_interval }})</span>
    </td>

    <td>
<!--      <router-link v-if="entity.stratigraphy_id" :to="{ path: '/stratigraphy/' + entity.stratigraphy_id }" :title="$t('stratigraphy.editMessage')">-->
      <div v-if="entity.stratigraphy_id" v-translate="{et: entity.stratigraphy__stratigraphy ,en: entity.stratigraphy__stratigraphy_en}"></div>
<!--      </router-link>-->
      <div v-else>{{ entity.stratigraphy_free }}</div>
    </td>

    <td>
      {{ entity.agent_collected__agent }}
    </td>

    <td>
      {{ entity.storage__location }}
    </td>

    <td class="middle">
      <vs-checkbox id="is_private"
                   v-model="entity.is_private"
                   @input="$emit('toggle-privacy-state', entity.is_private, entity.id)"
                   icon="fa-lock"
                   icon-pack="fas">
      </vs-checkbox>
    </td>

    <td class="middle">
      <a href="javascript:void(0)" v-if="!entity.is_private" @click="openGeoInNewWindow({object: 'specimen', id: entity.id})"
         :title="$t('specimen.viewMessage')">
        <i class="far fa-eye"></i>
<!--        {{ $t('edit.view') }}-->
      </a>
    </td>

  </tr>
  </tbody>
</template>

<script>
  import formManipulation from "../../mixins/formManipulation";

  export default {
    name: "SpecimenTable",
    props: {
      response: {
        type: Object
      },
    },
    mixins: [formManipulation]
  }
</script>

<style scoped>
  .middle {
    text-align: center;
    vertical-align: middle;
  }

</style>
