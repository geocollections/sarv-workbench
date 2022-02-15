<template>
  <div class="rock-image-table">
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
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.attachment="{ item }">
        <router-link
          v-if="item.attachment"
          :to="{ path: '/attachment/' + item.attachment.id }"
          :title="$t('editAttachment.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.attachment.id }}
        </router-link>
      </template>

      <template v-slot:item.link="{ item }">
        <router-link
          v-if="item.link"
          :to="{ path: '/rock/' + item.link.id }"
          :title="$t('editRock.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <div
            v-translate="{
              et: item.link.name,
              en: item.link.name_en,
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.is_private="{ item }">
        <v-icon v-if="item.is_private" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
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
            <span class="headline">{{ $t("header.rock_image") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.attachment"
                    :color="bodyActiveColor"
                    :items="autocomplete.attachment"
                    :loading="autocomplete.loaders.attachment"
                    :item-text="customLabelForAttachment"
                    :label="$t('rock.attachment')"
                    use-state
                    is-searchable
                    v-on:search:items="autocompleteAttachmentSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.link"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock"
                    :loading="autocomplete.loaders.rock"
                    :item-text="nameLabel"
                    :label="$t('rock.parent')"
                    is-searchable
                    v-on:search:items="autocompleteRockSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.title"
                    :color="bodyActiveColor"
                    :label="$t('rock.title')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.title_en"
                    :color="bodyActiveColor"
                    :label="$t('rock.title_en')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.sort"
                    :color="bodyActiveColor"
                    :label="$t('rock.sort')"
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

    <RelatedDataDeleteDialog
      :dialog="deleteDialog"
      @cancel="cancelDeletion"
      @delete="runDeletion"
    />
  </div>
</template>

<script>
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import { cloneDeep } from "lodash";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "RockImageTable",

  components: {
    RelatedDataDeleteDialog,
    CheckboxWrapper,
    AutocompleteWrapper,
    InputWrapper,
  },

  mixins: [autocompleteMixin, relatedDataMixin],

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
  },

  data: () => ({
    headers: [
      { text: "rock.attachment", value: "attachment" },
      { text: "rock.link", value: "link" },
      { text: "rock.title", value: "title" },
      { text: "rock.title_en", value: "title_en" },
      { text: "rock.sort", value: "sort" },
      { text: "common.is_private", value: "is_private" },
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
      link: null,
      title: "",
      title_en: "",
      sort: "",
      is_private: false,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      attachment: [],
      rock: [],
      loaders: {
        attachment: false,
        rock: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.attachment !== "undefined" &&
        this.item.attachment !== null
      );
    },
  },

  methods: {
    resetItem() {
      this.item = {
        attachment: null,
        link: null,
        title: "",
        title_en: "",
        sort: "",
        is_private: false,
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.attachment) {
        this.item.attachment = item.attachment;
        this.autocomplete.attachment.push(this.item.attachment);
      }

      if (item.link) {
        this.item.link = item.link;
        this.autocomplete.rock.push(this.item.link);
      }

      this.item.title = item.title;
      this.item.title_en = item.title_en;
      this.item.sort = item.sort;
      this.item.is_private = item.is_private;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    customLabelForAttachment(option) {
      return `${option.id} - (${option.original_filename})`;
    },
  },
};
</script>
