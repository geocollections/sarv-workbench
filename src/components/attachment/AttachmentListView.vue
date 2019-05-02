<template>
  <div class="row" v-if="data.length > 0">
    <div class="col-6 col-md-4 col-lg-4 col-xl-3 text-center mt-2 center" v-for="(entity, index) in data">

      <div :id="'icon-' + index">
        <router-link v-if="entity.uuid_filename !== null" :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
          <img class="image-preview"
               v-if="entity.uuid_filename.endsWith('jpg') || entity.uuid_filename.endsWith('jpeg') || entity.uuid_filename.endsWith('png')"
               :src="composeFileUrl(entity.uuid_filename)"/>

          <font-awesome-icon v-else class="text-center"  size="5x" icon="file"/>
        </router-link>

        <router-link :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
          <font-awesome-icon v-if="entity.uuid_filename === null" size="5x" :icon="file"/>
        </router-link>
      </div>

      <b-tooltip :target="'icon-' + index" placement="bottom">
        <b>ID:</b> {{ entity.id }}
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
</style>
