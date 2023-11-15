<template>
  <div class="drillcoreBox-attachment-table">
    <v-data-table
      mobile-breakpoint="0"
      :headers="translatedHeaders"
      hide-default-footer
      dense
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :search="filter"
      expand-icon="fas fa-caret-down"
      :sort-by.sync="searchParameters.sortBy"
      :sort-desc.sync="searchParameters.sortDesc"
      :server-items-length="response.count"
      :class="bodyColor.split('n-')[0] + 'n-5'"
      :disable-sort="!$route.meta.isEdit"
    >
      <template v-slot:item.action="{ item }">
        <v-btn
          icon
          @click="openAttachment(item.id)"
          color="green"
          :title="$t('buttons.edit')"
          small
        >
          <v-icon small>far fa-edit</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.id="{ item, value }">
        <router-link
          v-if="item.uuid_filename"
          :title="$t('edit.editMessage')"
          :to="{ path: '/attachment/' + item.id }"
          class="image-link my-1"
          style="max-width: 150px; max-height: 150px; display: block"
        >
          <file-preview :attachment="item" />
        </router-link>
      </template>

      <template v-slot:item.is_preferred="{ item }">
        <div class="d-flex justify-center">
          <v-checkbox
            hide-details
            class="mt-0"
            v-model="item.is_preferred"
            @change="
              $emit('toggle-preferred-state', {
                is_preferred: item.is_preferred,
                id: item.id,
              })
            "
            :color="bodyActiveColor"
          />
        </div>
        <!--        <v-icon v-if="item.is_preferred" color="green" small-->
        <!--          >fas fa-check</v-icon-->
        <!--        >-->
        <!--        <v-icon v-else color="red" small>fas fa-times</v-icon>-->
      </template>

      <template v-slot:item.is_private="{ item }">
        <div class="d-flex justify-center">
          <v-checkbox
            hide-details
            class="mt-0"
            v-model="item.is_private"
            @change="
              $emit('toggle-privacy-state', {
                is_private: item.is_private,
                id: item.id,
              })
            "
            :color="bodyActiveColor"
          />
        </div>
        <!--        <v-icon v-if="item.is_private" color="green" small>fas fa-check</v-icon>-->
        <!--        <v-icon v-else color="red" small>fas fa-times</v-icon>-->
      </template>
    </v-data-table>

    <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-dialog v-model="dialog" max-width="500px" style="z-index: 50000">
        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
          <v-card-title>
            <span class="headline">{{ $t("header.attachment") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_preferred"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.is_preferred')"
                    @change="item.is_preferred = !item.is_preferred"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_private"
                    :color="bodyActiveColor"
                    :label="$t('common.is_private')"
                    @change="item.is_private = !item.is_private"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancel">{{
              $t("buttons.cancel")
            }}</v-btn>
            <v-btn color="green" text @click="addItem">{{
              $t("buttons.edit")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import FilePreview from "@/components/FilePreview.vue";

export default {
  name: "DrillcoreBoxAttachmentTable",

  components: {
    FilePreview,
    CheckboxWrapper,
  },

  props: {
    response: {
      type: Object,
    },
    filter: {
      type: String,
      required: false,
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function () {
        return {
          page: 1,
          paginateBy: 25,
        };
      },
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: () => ({
    headers: [
      { text: "drillcore_box.attachment", value: "id", align: "center" },
      {
        text: "drillcore_box.is_preferred",
        value: "is_preferred",
        align: "center",
      },
      { text: "common.is_private", value: "is_private", align: "center" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      is_preferred: false,
      is_private: false,
    },
    widths: {},
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        };
      });
    },
  },

  watch: {
    "response.results": {
      handler(newVal) {
        if (
          newVal.length > 0 &&
          Object.keys(this.widths).length !== newVal.length
        ) {
          newVal.forEach((item) =>
            this.getImageWidth(item.uuid_filename, item.id)
          );
        }
      },
      deep: true,
    },
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.item = {
        is_preferred: false,
        is_private: false,
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      this.$emit("related:edit", {
        table: "attachment",
        item: formattedItem,
        rawItem: this.item,
      });
      this.cancel();
    },

    editItem(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      this.item.is_preferred = item.is_preferred;
      this.item.is_private = item.is_private;

      this.dialog = true;
    },

    formatItem(item) {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        } else if (typeof item[key] === "string" && item[key].length === 0) {
          item[key] = null;
        }
      });
      return item;
    },

    getMeta(url) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    },

    async getImageWidth(uuid, id) {
      if (uuid) {
        let img = await this.getMeta(
          this.$helpers.getPublicFileUrl(uuid, "small")
        );
        if (img.width) this.$set(this.widths, id, img.width);
        else this.$set(this.widths, id, 400);
      } else this.$set(this.widths, id, 400);
    },

    openAttachment(id) {
      let routeData = this.$router.resolve({
        path: "/attachment/" + id,
      });
      window.open(routeData.href, "_blank", "width=800,height=750");
    },
  },
};
</script>

<style scoped>
.image-link {
  transition: opacity 200ms ease-in;
}
.image-link:hover {
  opacity: 0.8;
}
</style>
