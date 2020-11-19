<template>
  <div class="image-view-wrapper mx-3" v-if="data && data.length > 0">
    <v-row class="mx-0">
      <v-col
        v-for="(image, index) in data"
        :key="index"
        class="d-flex child-flex my-3"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-tooltip bottom :color="bodyActiveColor" z-index="51000">
          <template v-slot:activator="{ on }">
            <v-card
              flat
              class="d-flex image-hover"
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
              <v-img
                max-height="400"
                min-width="72"
                aspect-ratio="1"
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
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>

              <v-row align="center" v-else>
                <v-col class="text-center">
                  <div class="py-3">
                    <v-icon
                      style="font-size: 6rem"
                      :class="bodyActiveColor + '--text'"
                      >far {{ getAttachmentIcon(image) }}</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>

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
                image.specimen__database__acronym && image.specimen__specimen_id
              "
            >
              {{ image.specimen__database__acronym }}
              {{ image.specimen__specimen_id }}
            </span>
          </span>
          <span v-else-if="object === 'location'">
            <span v-if="image.attach_link__storage__location">
              {{ image.attach_link__storage__location }}
            </span>
          </span>

          <span v-else-if="object === 'drillcore_box'">
            <span
              v-translate="{
                et: image.drillcore_box__drillcore__drillcore,
                en: image.drillcore_box__drillcore__drillcore_en
              }"
            >
            </span>
          </span>
        </v-tooltip>

        <div
          class="d-flex flex-row justify-space-around"
          style="position: absolute; padding-right: 30px; bottom: 5px; width: 100%"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                dark
                @click.stop="openFileInNewWindow(image)"
              >
                <v-icon
                  style="text-shadow: 0 0 6px #000, 0 0 4px #2196F3;"
                  small
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
                  style="text-shadow: 0 0 6px #000, 0 0 4px #4CAF50;"
                  small
                  >fas fa-edit</v-icon
                ></v-btn
              >
            </template>

            <span>{{ $t(editMessage) }}</span>
          </v-tooltip>
        </div>

        <!--        <v-row no-gutters class="pr-2" style="max-width: 50px;">-->
        <!--          <v-col cols="12" class="pa-1 align-self-center">-->
        <!--            <v-btn-->
        <!--              :title="$t(viewMessage)"-->
        <!--              icon-->
        <!--              color="blue"-->
        <!--              @click="openFileInNewWindow(image)"-->
        <!--              :small="$vuetify.breakpoint.xsOnly"-->
        <!--            >-->
        <!--              <v-icon :small="$vuetify.breakpoint.xsOnly">fas fa-eye</v-icon>-->
        <!--            </v-btn>-->
        <!--          </v-col>-->
        <!--          <v-col cols="12" class="pa-1 align-self-center">-->
        <!--            <v-btn-->
        <!--              color="green"-->
        <!--              :title="$t(editMessage)"-->
        <!--              icon-->
        <!--              @click="openInNewTab(object, image[idField])"-->
        <!--              :small="$vuetify.breakpoint.xsOnly"-->
        <!--              ><v-icon :small="$vuetify.breakpoint.xsOnly"-->
        <!--                >fas fa-edit</v-icon-->
        <!--              ></v-btn-->
        <!--            >-->
        <!--          </v-col>-->
        <!--        </v-row>-->
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ImageViewWrapper",
  props: {
    data: {
      type: Array
    },
    object: {
      type: String,
      default: "attachment"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    clearItemBackground: Boolean,
    openFile: Boolean,
    showAttachmentLink: Boolean
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
      if (this.object === "drillcore_box") return "drillcore_box";
      else return "id";
    }
  },
  methods: {
    openFileInNewWindow(file) {
      if (typeof file !== "undefined" && file !== null) {
        let url = "";
        if (this.isImageFile(file)) {
          url = this.getFileUrl(file.uuid_filename, "large");
        } else {
          url = this.getFileUrl(file.uuid_filename);
        }
        window.open(url, "_blank", "width=800,height=750");
      }
    },

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
    },

    openInNewTab(object, id) {
      let routeData = this.$router.resolve({ path: `/${object}/${id}` });
      window.open(routeData.href, "AttachmentWindow");
    }
  }
};
</script>

<style scoped>
.image-hover:hover {
  opacity: 0.7;
}
</style>
