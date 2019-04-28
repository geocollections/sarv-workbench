<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/reference/' + entity.id }" :title="$t('editReference.editMessage')">{{
        entity.id }}
      </router-link>
    </td>

    <td>{{ entity.author }}</td>

    <td>{{ entity.year }}</td>

    <td>{{ entity.title }}</td>

    <td>
      <div v-if="entity.journal__journal_name">{{ entity.journal__journal_name }}</div>
      <div v-else-if="entity.journal_name">{{ entity.journal_name }}</div>
    </td>

    <td>{{ entity.volume }}</td>

    <td>{{ entity.pages }}</td>

    <td>
      <a v-if="!entity.is_private" href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.id})"
         :title="$t('editReference.viewMessage')">{{ $t('edit.view') }}</a>
    </td>

    <td>
      <a v-if="entity.doi" href="javascript:void(0)" @click="openDOI({doi: entity.doi})">DOI</a>
      <a v-else-if="entity.doi_urll" href="javascript:void(0)" @click="openDOI({doi: entity.doi_url})">DOI</a>
    </td>

    <td>
      <a v-if="entity.attachment__filename" href="javascript:void(0)"
         @click="openPdf({pdf: entity.attachment__filename})">PDF</a>
      <a v-if="entity.attachment__filename === null && entity.url" :href="entity.url" target="_blank" rel="noopener noreferrer">PDF</a>
    </td>

  </tr>
  </tbody>
</template>

<script>
  import formManipulation from './../mixins/formManipulation'

  export default {
    mixins: [formManipulation],
    name: "ReferenceTable",
    props: {
      response: {
        type: Object
      },
    }

  }
</script>

<style scoped>

</style>
