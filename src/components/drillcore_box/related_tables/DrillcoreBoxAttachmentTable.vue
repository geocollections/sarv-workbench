<template>
  <div class="drillcoreBox-attachment-table">
    <v-data-table
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
          @click="editItem(item)"
          color="green"
          :title="$t('buttons.edit')"
          small
        >
          <v-icon small>far fa-edit</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.id="{ item, value }">
        <!--        <router-link-->
        <!--          v-if="item.id"-->
        <!--          :title="$t('edit.editMessage')"-->
        <!--          :to="{ path: '/attachment/' + item.id }"-->
        <!--        >-->
        <a
          :href="getFileUrl(item.uuid_filename)"
          target="DrillcoreBoxWindow"
          title="View original image"
        >
          <v-img
            :id="item.id"
            v-if="!!item.attachment_format__value.includes('image')"
            :src="getFileUrl(item.uuid_filename, 'small')"
            :lazy-src="getFileUrl(item.uuid_filename, 'small')"
            class="grey lighten-2 attachment-table-image-preview my-1"
            :max-width="widths[value]"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>

          <v-icon v-else class="my-1" style="font-size: 3rem"
            >far fa-file</v-icon
          >
        </a>
        <!--        </router-link>-->
      </template>

      <template v-slot:item.is_preferred="{ item }">
        <v-icon v-if="item.is_preferred" color="green" small
          >fas fa-check</v-icon
        >
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>

      <template v-slot:item.is_wet="{ item }">
        <v-icon v-if="item.is_wet" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
      </template>
    </v-data-table>

    <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-dialog v-model="dialog" max-width="500px" style="z-index: 50000">
        <v-card>
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
                    v-model="item.is_wet"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.is_wet')"
                    @change="item.is_wet = !item.is_wet"
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
import { cloneDeep } from "lodash";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";

export default {
  name: "DrillcoreBoxAttachmentTable",

  components: {
    CheckboxWrapper
  },

  props: {
    response: {
      type: Object
    },
    filter: {
      type: String,
      required: false
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function() {
        return {
          page: 1,
          paginateBy: 25
        };
      }
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    },
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    headers: [
      { text: "drillcore_box.attachment", value: "id" },
      { text: "drillcore_box.is_preferred", value: "is_preferred" },
      { text: "drillcore_box.is_wet", value: "is_wet" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      is_preferred: false,
      is_wet: false
    },
    widths: {}
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    }
  },

  watch: {
    "response.results": {
      handler(newVal) {
        if (newVal.length > 0) {
          newVal.forEach(item =>
            this.getImageWidth(item.uuid_filename, item.id)
          );
        }
      },
      deep: true
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.item = {
        is_preferred: false,
        is_wet: false
      };
    },

    addItem() {
      delete this.item.is_wet; // Todo: functionality needs implementing
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      this.$emit("related:edit", {
        table: "attachment",
        item: formattedItem,
        rawItem: this.item
      });
      this.cancel();
    },

    editItem(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      this.item.is_preferred = item.is_preferred;
      // this.item.is_wet = item.is_wet; Todo: functionality needs implementing

      this.dialog = true;
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        } else if (typeof item[key] === "string" && item[key].length === 0) {
          item[key] = null;
        }
      });
      return item;
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
        let img = await this.getMeta(this.getFileUrl(uuid, "small"));
        if (img.width) this.$set(this.widths, id, img.width);
        else this.$set(this.widths, id, 400);
      } else this.$set(this.widths, id, 400);
    }
  }
};
</script>

<style scoped />
