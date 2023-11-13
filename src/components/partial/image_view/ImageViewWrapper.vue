<template>
  <div class="image-view-wrapper mx-3" v-if="data && data.length > 0">
    <div class="mb-3">
      <v-switch
        v-model="containImages"
        hide-details
        :color="bodyActiveColor"
        :label="$t('messages.containImages')"
      />
    </div>
    <v-row>
      <v-col
        v-for="image in data"
        :key="image.id"
        class="py-3"
        style="position: relative"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-tooltip bottom :color="bodyActiveColor" z-index="51000">
          <template v-slot:activator="{ on }">
            <v-card
              flat
              style="max-width: 400px; max-height: 400px"
              class="d-flex image-hover fill-height"
              v-on="on"
              :class="
                clearItemBackground
                  ? bodyColor.split('n-')[0] + 'n-5'
                  : bodyColor.split('n-')[0] + 'n-3'
              "
              hover
              :title="openFile ? $t(viewMessage) : $t(editMessage)"
              @click="
                openFile
                  ? openFileInNewWindow(image)
                  : $router.push({ path: `/${object}/${image[idField]}` })
              "
            >
              <file-preview
                :attachment="image"
                :contain="containImages"
                icon-size="6rem"
                square
                :prefix="
                  object === 'drillcore_box' || object === 'location'
                    ? 'attachment__'
                    : ''
                "
              />
            </v-card>
          </template>

          <div style="max-width: 300px">
            <span v-if="object === 'attachment'">
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
            <span v-else-if="object === 'specimen'">
              <span
                v-if="
                  image.specimen__database__acronym &&
                  image.specimen__specimen_id
                "
              >
                {{ image.specimen__database__acronym }}
                {{ image.specimen__specimen_id }}
              </span>
            </span>
            <span v-else-if="object === 'location'">
              <span v-if="image.attachment_link__storage__location">
                {{ image.attachment_link__storage__location }}
              </span>
            </span>
            <span v-else-if="object === 'drillcore_box'">
              <span
                v-translate="{
                  et: image.drillcore_box__drillcore__drillcore,
                  en: image.drillcore_box__drillcore__drillcore_en,
                }"
              >
              </span>
            </span>
          </div>
        </v-tooltip>

        <div
          class="d-flex flex-row justify-space-around"
          style="
            position: absolute;
            padding-right: 30px;
            bottom: 12px;
            width: 100%;
          "
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                dark
                @click.stop="openFileInNewWindow(image)"
              >
                <v-icon style="text-shadow: 0 0 6px #000, 0 0 4px #2196f3" small
                  >fas fa-eye</v-icon
                >
              </v-btn>
            </template>

            <span>{{ $t(viewMessage) }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                dark
                icon
                @click.stop="openInNewTab(object, image[idField])"
                ><v-icon
                  style="text-shadow: 0 0 6px #000, 0 0 4px #4caf50"
                  small
                  >fas fa-edit</v-icon
                ></v-btn
              >
            </template>

            <span>{{ $t(editMessage) }}</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import config from "@/config";
import FilePreview from "@/components/FilePreview.vue";

export default {
  name: "ImageViewWrapper",
  components: { FilePreview },
  props: {
    data: {
      type: Array,
    },
    object: {
      type: String,
      default: "attachment",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    clearItemBackground: Boolean,
    openFile: Boolean,
    showAttachmentLink: Boolean,
  },
  data() {
    return {
      containImages: false,
      config,
    };
  },
  computed: {
    editMessage() {
      if (this.object === "specimen") return "editSpecimen.editMessage";
      else return "editAttachment.editMessage";
    },

    viewMessage() {
      if (this.object === "specimen") return "editSpecimen.viewMessage";
      else return "editAttachment.viewMessage1";
    },

    idField() {
      if (this.object === "specimen") return "specimen_id";
      if (this.object === "location") return "storage__id";
      if (this.object === "drillcore_box") return "drillcore_box__id";
      else return "id";
    },
  },
  methods: {
    openFileInNewWindow(file) {
      console.log(file);
      if (!file) return;
      const uuidFilename = file.uuid_filename || file.attachment__uuid_filename;

      const uuid = uuidFilename.split(".")?.[0];
      let url = this.config.app.filesUrl;
      if (this.isImageFile(file)) {
        url += `/large/${uuid}`;
      } else {
        url += "/" + uuid;
      }
      this.$helpers.openUrlInNewWindow(url);
    },

    isImageFile(image) {
      const mimeType =
        image.attachment_format__value ||
        image.attachment__attachment_format__value;
      const uuidFilename =
        image.uuid_filename || image.attachment__uuid_filename;
      const imageMimeTypes = [
        "image/jpe",
        "image/jpg",
        "image/jpeg",
        "image/png",
      ];
      if (mimeType) {
        return imageMimeTypes.includes(mimeType);
      } else {
        let fileType = uuidFilename.split(".")[1];
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value which 859 are jpg and 2 png
        return !!(fileType.includes("jpg") || fileType.includes("png"));
      }
    },

    openInNewTab(object, id) {
      let routeData = this.$router.resolve({ path: `/${object}/${id}` });
      window.open(routeData.href, "AttachmentWindow");
    },
  },
};
</script>

<style scoped>
.image-hover:hover {
  opacity: 0.7;
}
</style>
