<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td class="text-center">
      <router-link v-if="entity.uuid_filename !== null" :title="$t('edit.editMessage')"
                   :to="{ path: '/attachment/' + entity.id }">
        <img class="image-preview"
             v-if="entity.uuid_filename.endsWith('jpg') || entity.uuid_filename.endsWith('jpeg') || entity.uuid_filename.endsWith('png')"
             :src="composeFileUrl(entity.uuid_filename)"/>
        <font-awesome-icon v-else size="3x" icon="file"/>
      </router-link>

      <router-link :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
        <font-awesome-icon v-if="entity.uuid_filename === null" size="3x" :icon="file"/>
      </router-link>
    </td>

    <td>
      <router-link :to="{ path: '/attachment/' + entity.id }" :title="$t('edit.editMessage')">{{ entity.id }}
      </router-link>
    </td>

    <td>{{ entity.uuid_filename.split('.')[1] }}</td>

    <td>{{ entity.image_number }}</td>

    <td>
      <span v-if="entity.author__agent">{{ entity.author__agent }}</span>
      <span v-else>{{ entity.author_free }}</span>
    </td>

    <td>
      <span v-if="entity.date_created !== null">{{ entity.date_created | moment('ddd, MMM Do YYYY') }}</span>
      <span
        v-if="entity.date_created === null && entity.date_created_free !== null">{{ entity.date_created_free }}</span>
    </td>

    <!-- TODO: ShowSpecimen only when specimens exist same goes to table head in list module core -->
<!--    <td v-if="showSpecimen">-->
    <td>
      <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'specimen', id: entity.specimen})">
        <!-- TODO: Get specimen name -->
        {{ entity.specimen }}
      </a>
    </td>

    <!-- TODO: ShowReference only when references exist same goes to table head in list module core -->
<!--    <td v-if="showReference">-->
    <td>
      <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.reference_id})">
        {{ entity.reference__reference }}
      </a>
    </td>

    <td>
      <span v-if="entity.specimen_image_attachment === 1">{{ $t('attachment.specimenFile') }}</span>
      <span v-if="entity.specimen_image_attachment === 2">{{ $t('attachment.photoArchiveFile') }}</span>
      <span v-if="entity.specimen_image_attachment === 3">{{ $t('attachment.otherFile') }}</span>
      <span v-if="entity.specimen_image_attachment === 4">{{ $t('attachment.digitisedReferenceFile') }}</span>
    </td>

    <td>
      <a href="javascript:void(0)" v-if="!entity.is_private" @click="openGeoInNewWindow({object: 'file', id: entity.id})"
         :title="$t('edit.viewMessage')">{{ $t('edit.view') }}</a>
    </td>
  </tr>
  </tbody>
</template>

<script>
  import formManipulation from "../mixins/formManipulation";

  export default {
    mixins: [formManipulation],
    name: "AttachmentTable",
    props: {
      response: {
        type: Object
      },
    }
  }
</script>

<style scoped>
  .image-preview {
    max-height: 200px;
    max-width: 200px;
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
  }
</style>
