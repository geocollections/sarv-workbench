<template>
  <div class="taxon-image-table">
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
        <v-btn
          v-if="!$route.meta.isEdit"
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.attachment_image="{ item }">
        <div v-if="$route.meta.isEdit">
          <router-link
            v-if="item.attachment__uuid_filename"
            :title="$t('edit.editMessage')"
            :to="{ path: '/attachment/' + item.attachment }"
          >
            <v-img
              v-if="
                !!item.attachment__attachment_format__value.includes('image')
              "
              :src="getFileUrl(item.attachment__uuid_filename, 'small')"
              :lazy-src="getFileUrl(item.attachment__uuid_filename, 'small')"
              class="grey lighten-2 attachment-table-image-preview my-1"
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
          </router-link>
        </div>

        <div v-else>
          <router-link
            v-if="item.attachment && item.attachment.uuid_filename"
            :title="$t('edit.editMessage')"
            :to="{ path: '/attachment/' + item.attachment }"
          >
            <v-img
              v-if="
                !!item.attachment.attachment_format__value.includes('image')
              "
              :src="getFileUrl(item.attachment.uuid_filename, 'small')"
              :lazy-src="getFileUrl(item.attachment.uuid_filename, 'small')"
              class="grey lighten-2 attachment-table-image-preview my-1"
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
          </router-link>
        </div>
      </template>

      <template v-slot:item.attachment="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/attachment/' + item.attachment }"
            :title="$t('editAttachment.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.attachment__original_filename }}
          </router-link>
          <router-link
            v-else-if="item.attachment"
            :to="{ path: '/attachment/' + item.attachment.id }"
            :title="$t('editAttachment.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.attachment.original_filename }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/attachment/' + item.attachment }"
          :title="$t('editAttachment.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.attachment__original_filename }}
        </router-link>
      </template>

      <template v-slot:item.link="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/taxon/' + item.link }"
            :title="$t('editTaxon.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.link__taxon }}
          </router-link>
          <router-link
            v-else-if="item.link"
            :to="{ path: '/taxon/' + item.link.id }"
            :title="$t('editTaxon.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.link.taxon }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/taxon/' + item.link }"
          :title="$t('editTaxon.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.link__taxon }}
        </router-link>
      </template>
    </v-data-table>

    <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-dialog v-model="dialog" max-width="500px" style="z-index: 50000">
        <template v-slot:activator="{ on }">
          <v-btn :color="bodyActiveColor" small dark v-on="on">{{
            $t("buttons.add_new")
          }}</v-btn>
        </template>
        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
          <v-card-title>
            <span class="headline">{{ $t("header.taxon_image") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.attachment"
                    :color="bodyActiveColor"
                    :items="autocomplete.attachment"
                    :loading="autocomplete.loaders.attachment"
                    item-text="original_filename"
                    use-state
                    :label="$t('taxon.attachment')"
                    is-link
                    route-object="attachment"
                    is-searchable
                    v-on:search:items="autocompletePublicAttachmentImageSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.link"
                    :color="bodyActiveColor"
                    :items="autocomplete.taxon"
                    :loading="autocomplete.loaders.taxon"
                    item-text="taxon"
                    :label="$t('taxon.taxon')"
                    is-link
                    route-object="taxon"
                    is-searchable
                    v-on:search:items="autocompleteTaxonSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.title"
                    :color="bodyActiveColor"
                    :label="$t('taxon.title')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.title_en"
                    :color="bodyActiveColor"
                    :label="$t('taxon.title_en')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('common.remarks')"
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
            <v-btn
              :disabled="!isItemValid"
              color="green"
              text
              @click="addItem"
              >{{ isNewItem ? $t("buttons.add") : $t("buttons.edit") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </div>
</template>

<script>
import InputWrapper from "../../partial/inputs/InputWrapper";
import { cloneDeep } from "lodash";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";

export default {
  name: "TaxonImageTable",

  components: {
    AutocompleteWrapper,
    InputWrapper
  },

  mixins: [autocompleteMixin],

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
      { text: "taxon.attachment", value: "attachment_image" },
      { text: "taxon.attachment_filename", value: "attachment" },
      { text: "taxon.taxon", value: "link" },
      { text: "taxon.title", value: "title" },
      { text: "taxon.title_en", value: "title_en" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      attachment: null,
      link: null,
      title: "",
      title_en: "",
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      attachment: [],
      taxon: [],
      loaders: {
        attachment: false,
        taxon: false
      }
    }
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    },

    isItemValid() {
      return (
        typeof this.item.attachment !== "undefined" &&
        this.item.attachment !== null
      );
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        attachment: null,
        link: null,
        title: "",
        title_en: "",
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "taxon_image",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "taxon_image",
          item: formattedItem,
          rawItem: this.item
        });
      }
      this.cancel();
    },

    editItem(item) {
      this.isNewItem = false;

      if (this.$route.meta.isEdit) this.item.id = item.id;
      // else this.item.onEditIndex = this.response.results.indexOf(item);

      if (typeof item.attachment !== "object" && item.attachment !== null) {
        this.item.attachment = {
          id: item.attachment,
          original_filename: item.attachment__original_filename,
          uuid_filename: item.attachment__uuid_filename,
          attachment_format__value: item.attachment__attachment_format__value
        };
        this.autocomplete.attachment.push(this.item.attachment);
      } else if (item.attachment !== null) {
        this.item.attachment = item.attachment;
        this.autocomplete.attachment.push(this.item.attachment);
      }

      if (typeof item.link !== "object" && item.link !== null) {
        this.item.link = {
          id: item.link,
          taxon: item.link__taxon
        };
        this.autocomplete.taxon.push(this.item.link);
      } else if (item.link !== null) {
        this.item.link = item.link;
        this.autocomplete.taxon.push(this.item.link);
      }

      this.item.title = item.title;
      this.item.title_en = item.title_en;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "taxon_image",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
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
    }
  }
};
</script>

<style scoped>
.attachment-table-image-preview {
  max-height: 200px;
  max-width: 200px;
  border-radius: 0.25rem;
}
</style>
