<template>
  <div class="locality-image-table">
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
          @click="editItem(item)"
          color="green"
          :title="$t('buttons.edit')"
          small
        >
          <v-icon small>far fa-edit</v-icon>
        </v-btn>
        <v-btn
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
        <router-link
          v-if="item.attachment && item.attachment__uuid_filename"
          :title="$t('edit.editMessage')"
          :to="{ path: '/attachment/' + item.attachment }"
          class="my-1"
          style="max-width: 150px; max-height: 150px; display: block"
        >
          <file-preview
            class="file-preview"
            :attachment="item"
            prefix="attachment__"
            max="150"
          />
        </router-link>
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
            <span class="headline">{{ $t("header.locality_image") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="8" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.attachment"
                    :color="bodyActiveColor"
                    :items="autocomplete.attachment"
                    :loading="autocomplete.loaders.attachment"
                    item-text="original_filename"
                    use-state
                    :label="$t('localityImage.attachment')"
                    is-link
                    route-object="attachment"
                    is-searchable
                    v-on:search:items="autocompletePublicAttachmentImageSearch"
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <input-wrapper
                    v-model="item.sort"
                    :color="bodyActiveColor"
                    :label="$t('localityImage.sort')"
                  />
                </v-col>
                <v-col cols="12" md="12" class="pa-1">
                  <input-wrapper
                    v-model="item.title"
                    :color="bodyActiveColor"
                    :label="$t('localityImage.title')"
                  />
                </v-col>

                <v-col cols="12" md="12" class="pa-1">
                  <input-wrapper
                    v-model="item.title_en"
                    :color="bodyActiveColor"
                    :label="$t('localityImage.title_en')"
                  />
                </v-col>

                <v-col cols="12" md="12" class="pa-1">
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
import cloneDeep from "lodash/cloneDeep";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import FilePreview from "@/components/FilePreview.vue";

export default {
  name: "LocalityImageTable",

  components: {
    FilePreview,
    AutocompleteWrapper,
    InputWrapper,
  },

  mixins: [autocompleteMixin],

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
          paginateBy: 10,
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
      { text: "localityImage.attachment", value: "attachment_image" },
      { text: "localityImage.attachment_filename", value: "attachment" },
      { text: "localityImage.title", value: "title" },
      { text: "localityImage.title_en", value: "title_en" },
      { text: "localityImage.sort", value: "sort" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      attachment: null,
      title: "",
      title_en: "",
      remarks: "",
      sort: null,
    },
    isNewItem: true,
    autocomplete: {
      attachment: [],
      loaders: {
        attachment: false,
      },
    },
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

    isItemValid() {
      return (
        typeof this.item.attachment !== "undefined" &&
        this.item.attachment !== null
      );
    },
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        attachment: null,
        title: "",
        title_en: "",
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "locality_image",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "locality_image",
          item: formattedItem,
          rawItem: this.item,
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
          attachment_format__value: item.attachment__attachment_format__value,
        };
        this.autocomplete.attachment.push(this.item.attachment);
      } else if (item.attachment !== null) {
        this.item.attachment = item.attachment;
        this.autocomplete.attachment.push(this.item.attachment);
      }

      this.item.title = item.title;
      this.item.title_en = item.title_en;
      this.item.remarks = item.remarks;
      this.item.sort = item.sort;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "locality_image",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
    },

    formatItem(item) {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        }
      });
      return item;
    },
  },
};
</script>

<style scoped>
.file-preview {
  opacity: 1;
  transition: opacity 200ms ease-in;
  cursor: pointer;
}

.file-preview:hover {
  opacity: 0.8;
}
</style>
