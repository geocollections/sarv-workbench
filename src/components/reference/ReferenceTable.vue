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

    <td class="middle">
      <i v-if="entity.is_estonian_reference" class="fas fa-check fa"></i>
    </td>

    <td class="middle">
      <i v-if="entity.is_estonian_author" class="fas fa-check fa"></i>
    </td>

<!--    <td class="middle">-->
<!--      <vs-checkbox id="is_private"-->
<!--                   v-model="entity.is_private"-->
<!--                   @input="$emit('toggle-privacy-state', entity.is_private, entity.id)"-->
<!--                   icon="fa-lock"-->
<!--                   icon-pack="fas">-->
<!--      </vs-checkbox>-->
<!--    </td>-->

    <td>
      <a v-if="!entity.is_private" href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.id})"
         :title="$t('editReference.viewMessage')">{{ $t('edit.view') }}</a>
    </td>

    <td>
      <a v-if="entity.doi" href="javascript:void(0)" @click="openDOI({doi: entity.doi})">DOI</a>
      <a v-else-if="entity.doi_url" href="javascript:void(0)" @click="openDOI({doi: entity.doi_url})">DOI</a>
    </td>

    <td class="middle">
      <a v-if="entity.attachment__filename" href="javascript:void(0)" @click="openPdf({pdf: entity.attachment__filename})">
        <i class="far fa-file-pdf fa-lg" :title="entity.attachment__filename"></i>
      </a>
    </td>

    <td class="middle">
      <a v-if="entity.url && getUrl(entity.url) !== false" :href="getUrl(entity.url)" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-external-link-alt fa-lg" :title="entity.url"></i>
      </a>
    </td>

    <td v-if="isLibraryActive" @click="$parent.$emit('add-reference-to-active-library', entity.id)" class="add-library" :title="$t('reference.addReferenceToLibrary')">
      <i class="far fa-plus-square fa-lg"></i>
    </td>

  </tr>
  </tbody>
</template>

<script>
  import formManipulation from '../../mixins/formManipulation'

  export default {
    mixins: [formManipulation],
    name: "ReferenceTable",
    props: {
      response: {
        type: Object
      },
      isLibraryActive: {
        type: Boolean
      }
    },
    methods: {
      getUrl(url) {
        if (url.startsWith('http')) return url
        else if (url.startsWith('www.')) return 'http://' + url
        else if (url.includes('www.')) return 'http://' + url.substring(url.indexOf('www.'))
        else return false
      }
    }

  }
</script>

<style scoped>
  .add-library {
    text-align: center;
    vertical-align: middle;
    color: #28a745;
    transition: background-color 300ms linear;
  }

  .add-library:hover {
    cursor: pointer;
    background-color: rgba(40, 167, 69, 0.2);
    transition: background-color 300ms linear;
  }

  .middle {
    text-align: center;
    vertical-align: middle;
  }

</style>
