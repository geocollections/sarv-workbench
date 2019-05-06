<template>
  <div class="row" v-if="data.length > 0">
    <div class="preview" v-for="(entity, index) in data">

      <div :id="'icon-' + index" class="">
        <router-link v-if="entity.uuid_filename !== null" :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
          <img class="image-preview"
               v-if="entity.uuid_filename.endsWith('jpg') || entity.uuid_filename.endsWith('jpeg') || entity.uuid_filename.endsWith('png')"
               :src="composeFileUrl(entity.uuid_filename)"/>
          <font-awesome-icon v-else class="ico"  size="6x" icon="file"/>
        </router-link>

        <router-link :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
          <font-awesome-icon v-if="entity.uuid_filename === null" size="5x" :icon="file"/>
        </router-link>
      </div>

      <b-tooltip :target="'icon-' + index" placement="auto">
        <b>ID:</b> {{ entity.id }}<br />
        <span v-if="entity.date_created || entity.date_created_free"><b>Date:</b> {{ entity.date_created }} | {{ entity.date_created_free }}<br /></span>
        <span v-if="entity.author__agent"><b>Author:</b> {{ entity.author__agent }}<br /></span>
        <span v-if="entity.image_number"><b>Photo:</b> {{ entity.image_number }}<br /></span>
        <span v-if="entity.original_filename"><b>Filename:</b> {{ entity.original_filename }}<br /></span>
      </b-tooltip>
    </div>
  </div>
</template>

<script>
  import formManipulation from "../mixins/formManipulation";

  export default {
    props: {
      data: {
        type: Array
      }
    },
    name: "AttachmentListView",
    mixins: [formManipulation]
  }
</script>

<style scoped>
  @media (max-width: 575.98px) {
    .image-preview {
      max-height: 150px;
      max-width: 150px;
    }
  }

  @media (min-width: 576px) {
    .image-preview {
      max-height: 200px;
      max-width: 200px;
    }
  }

  .image-preview {
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
	padding: 0.2rem;
    margin: 0.2rem 0.4rem;
	max-height: 120px;
  }

  .center {
    height: 200px;
    position: relative;
    /*border: 3px solid green;*/
  }

  .center div {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .preview .ico {
    padding: 0.2rem;
    margin: 0.2rem 0.4rem;
    max-height: 120px;
    color: #999;
  }
</style>
