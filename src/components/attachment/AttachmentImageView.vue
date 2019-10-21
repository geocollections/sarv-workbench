<template>
  <div v-if="data.length > 0">

    <vs-switch class="mb-2 mx-2" v-model="isFancyImageList">
      <span slot="on">{{ $t('attachments.fancyView') }}</span>
      <span slot="off">{{ $t('attachments.regularView') }}</span>
    </vs-switch>

    <div v-if="isFancyImageList" class="vs-component vs-images vs-images-hover-default">

      <ul class="vs-ul-images vs-images--ul">
        <li class="vs-image custom-size" v-for="(entity, index) in data" :key="index">

          <div class="con-vs-image" :id="'icon-' + index">

            <router-link v-if="entity.uuid_filename !== null" :to="{ path: '/attachment/' + entity.id }">

<!--              /* TODO: Makes image nicer, does not zoom in (Eurocore uses that) */-->
<!--              .vs-image&#45;&#45;img {-->
<!--              background-size: cover;-->
<!--              }-->

              <div class="vs-image--img" :style="'background-image: url(' + composeFileUrl(entity.uuid_filename) + ')'"
                   v-if="entity.uuid_filename.endsWith('jpg') || entity.uuid_filename.endsWith('jpeg') || entity.uuid_filename.endsWith('png')"></div>
              <!-- TODO: Get icon working -->
              <!-- <font-awesome-icon v-else class="vs-image&#45;&#45;img" size="6x" icon="file"/>-->
              <div v-else class="vs-image--img no-image"></div>
            </router-link>

            <router-link :to="{ path: '/attachment/' + entity.id }">
              <div class="vs-image--img no-image" v-if="entity.uuid_filename === null"></div>
              <!-- font-awesome-icon v-if="entity.uuid_filename === null" size="6x" icon="file"/>-->
            </router-link>
          </div>

          <b-tooltip :target="'icon-' + index" placement="auto">
            <b>ID:</b> {{ entity.id }}<br/>
            <span v-if="entity.date_created || entity.date_created_free"><b>Date:</b> {{ entity.date_created }} | {{ entity.date_created_free }}<br/></span>
            <span v-if="entity.author__agent"><b>Author:</b> {{ entity.author__agent }}<br/></span>
            <span v-if="entity.image_number"><b>Photo:</b> {{ entity.image_number }}<br/></span>
            <span v-if="entity.original_filename"><b>Filename:</b> {{ entity.original_filename }}<br/></span>
          </b-tooltip>
        </li>
      </ul>

    </div>

    <div v-if="!isFancyImageList" class="row mb-3 mx-3">
      <div class="preview" v-for="(entity, index) in data" :key="index">

        <div :id="'icon-' + index" class="">
          <router-link v-if="entity.uuid_filename !== null" :title="$t('edit.editMessage')"
                       :to="{ path: '/attachment/' + entity.id }">
            <img class="image-preview"
                 v-if="entity.uuid_filename.endsWith('jpg') || entity.uuid_filename.endsWith('jpeg') || entity.uuid_filename.endsWith('png')"
                 :src="composeFileUrl(entity.uuid_filename)"/>
            <i v-else class="ico far fa-file fa-6x"/>
          </router-link>

          <router-link :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
            <i v-if="entity.uuid_filename === null" class=" far fa-file fa-5x"/>
          </router-link>
        </div>

        <b-tooltip :target="'icon-' + index" placement="auto">
          <b>ID:</b> {{ entity.id }}<br/>
          <span v-if="entity.date_created || entity.date_created_free"><b>Date:</b> {{ entity.date_created }} | {{ entity.date_created_free }}<br/></span>
          <span v-if="entity.author__agent"><b>Author:</b> {{ entity.author__agent }}<br/></span>
          <span v-if="entity.image_number"><b>Photo:</b> {{ entity.image_number }}<br/></span>
          <span v-if="entity.original_filename"><b>Filename:</b> {{ entity.original_filename }}<br/></span>
        </b-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
  import formManipulation from "../../mixins/formManipulation";

  export default {
    props: {
      data: {
        type: Array
      }
    },
    name: "AttachmentListView",
    mixins: [formManipulation],
    data() {
      return {
        isFancyImageList: true
      }
    }
  }
</script>

<style scoped>
  .vs-image--img {
    background-size: cover;
  }

  @media (max-width: 575.98px) {
    .image-preview {
      max-height: 150px;
      max-width: 150px;
    }

    .custom-size {
      max-height: 130px;
      max-width: 130px;
    }
  }

  @media (min-width: 576px) {
    .image-preview {
      max-height: 200px;
      max-width: 200px;
    }

    .custom-size {
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

  .no-image {
    position: relative;
  }

  .no-image:before {
    content: "Preview Image";
    position: absolute;
    font-weight: 900;
    font-size: large;
    top: 43%;
    left: 18%;
  }
</style>
