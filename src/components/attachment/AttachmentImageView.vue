<template>
  <div class="attachment-image-view mx-3 mb-3" v-if="data.length > 0">
    <v-row>
      <v-col class="vuetify-switch">
        <v-switch
          inset
          color="blue"
          v-model="isFancyImageList"
          :label="
            isFancyImageList
              ? $t('attachments.fancyView')
              : $t('attachments.regularView')
          "
          class="mx-3 mt-0 mb-2"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>

    <!-- FANCY VIEW -->
    <v-row v-if="isFancyImageList" class="mx-0">
      <v-col
        v-for="(image, index) in data"
        :key="index"
        class="d-flex child-flex my-3"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-tooltip bottom color="blue darken-3" z-index="51000">
          <template v-slot:activator="{ on }">
            <v-card
              flat
              v-on="on"
              class="d-flex image-hover"
              hover
              :to="{ path: '/attachment/' + image.id }"
              :title="$t('editAttachment.editMessage')"
            >
              <v-img
                max-height="400"
                v-if="isImageFile(image)"
                :src="getFileUrl(image.uuid_filename, 'small')"
                :lazy-src="getFileUrl(image.uuid_filename, 'small')"
                class="grey lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>

              <v-row align="center" v-else>
                <v-col class="text-center">
                  <div class="py-3">
                    <v-icon style="font-size: 6rem" color="blue-grey lighten-3"
                      >far {{ getAttachmentIcon(image) }}</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>

          <span>
            <b>ID:</b> {{ image.id }}<br />
            <span v-if="image.date_created || image.date_created_free">
              <b>Date:</b> {{ image.date_created }} |
              {{ image.date_created_free }}
              <br />
            </span>
            <span v-if="image.author__agent">
              <b>Author:</b>
              {{ image.author__agent }}
              <br />
            </span>
            <span v-if="image.image_number">
              <b>Photo:</b>
              {{ image.image_number }}
              <br />
            </span>
            <span v-if="image.original_filename">
              <b>Filename:</b>
              {{ image.original_filename }}
              <br />
            </span>
          </span>
        </v-tooltip>
      </v-col>
    </v-row>

    <!-- OLD VIEW -->
    <div v-if="!isFancyImageList" class="row mb-3 mx-3">
      <div class="preview" v-for="(entity, index) in data" :key="index">
        <div :id="'icon-' + index" class="">
          <router-link
            v-if="entity.uuid_filename !== null"
            :title="$t('edit.editMessage')"
            :to="{ path: '/attachment/' + entity.id }"
          >
            <img
              class="image-preview"
              v-if="
                entity.uuid_filename.endsWith('jpg') ||
                  entity.uuid_filename.endsWith('jpeg') ||
                  entity.uuid_filename.endsWith('png')
              "
              :src="composeFileUrl(entity.uuid_filename)"
            />
            <i v-else class="ico far fa-file fa-6x" />
          </router-link>

          <router-link
            :title="$t('edit.editMessage')"
            :to="{ path: '/attachment/' + entity.id }"
          >
            <i
              v-if="entity.uuid_filename === null"
              class=" far fa-file fa-5x"
            />
          </router-link>
        </div>

        <b-tooltip :target="'icon-' + index" placement="auto">
          <b>ID:</b> {{ entity.id }}<br />
          <span v-if="entity.date_created || entity.date_created_free"
            ><b>Date:</b> {{ entity.date_created }} |
            {{ entity.date_created_free }}<br
          /></span>
          <span v-if="entity.author__agent"
            ><b>Author:</b> {{ entity.author__agent }}<br
          /></span>
          <span v-if="entity.image_number"
            ><b>Photo:</b> {{ entity.image_number }}<br
          /></span>
          <span v-if="entity.original_filename"
            ><b>Filename:</b> {{ entity.original_filename }}<br
          /></span>
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
    };
  },
  computed: {
    isAudioFile() {
      return !!(
        this.data.attachment_format__value &&
        this.data.attachment_format__value.includes("audio")
      );
    },

    isVideoFile() {
      if (this.data.attachment_format__value) {
        return !!this.data.attachment_format__value.includes("video");
      } else {
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value and only 1 is webm
        return !!this.data.uuid_filename.split(".")[1].includes("webm");
      }
    }
  },
  methods: {
    getFileUrl(uuid, size = null) {
      if (size) {
        return `https://files.geocollections.info/${size}/${uuid.substring(
          0,
          2
        )}/${uuid.substring(2, 4)}/${uuid}`;
      } else {
        return `https://files.geocollections.info/${uuid.substring(
          0,
          2
        )}/${uuid.substring(2, 4)}/${uuid}`;
      }
    },

    getAttachmentIcon(attachment) {
      if (attachment.attachment_format__value) {
        let fileType = attachment.attachment_format__value;
        if (fileType.includes("application")) {
          if (fileType.includes("docx")) return "fa-file-word";
          else if (fileType.includes("pdf")) return "fa-file-pdf";
          else if (fileType.includes("xlsx") || fileType.includes("ods"))
            return "fa-file-excel";
          else if (fileType.includes("zip")) return "fa-file-archive";
          else return "fa-file";
        } else if (fileType.includes("audio")) return "fa-file-audio";
        else if (fileType.includes("image")) return "fa-file-image";
        else if (fileType.includes("text")) return "fa-file-alt";
        else if (fileType.includes("video")) return "fa-file-video";
        else return "fa-file";
      } else {
        let fileType = attachment.uuid_filename.split(".")[1];
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value
        if (fileType.includes("jpg") || fileType.includes("png"))
          return "fa-file-image";
        // 859 jpg and 2 png
        else if (fileType.includes("pdf")) return "fa-file-pdf";
        // 635 pdf
        else if (fileType.includes("xls") || fileType.includes("ods"))
          return "fa-file-excel";
        // 4 xls and 2 ods
        else if (fileType.includes("txt")) return "fa-file-alt";
        // 1 txt
        else if (fileType.includes("webm")) return "fa-file-video";
        // 1 webm
        else return "fa-file"; // 4 hz1
      }
    },

    isImageFile(image) {
      if (image.attachment_format__value) {
        return !!image.attachment_format__value.includes("image");
      } else {
        let fileType = image.uuid_filename.split(".")[1];
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value which 859 are jpg and 2 png
        return !!(fileType.includes("jpg") || fileType.includes("png"));
      }
    }
  }
};
</script>

<style scoped>
.image-hover:hover {
  opacity: 0.7;
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

.preview .ico {
  padding: 0.2rem;
  margin: 0.2rem 0.4rem;
  max-height: 120px;
  color: #999;
}
</style>
