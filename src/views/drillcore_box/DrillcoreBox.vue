<template>
  <div class="drillcoreBox">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span
            :class="validate('drillcore_box') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('drillcore_box') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- DRILLCORE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.drillcore"
                :color="bodyActiveColor"
                :items="autocomplete.drillcore"
                :loading="autocomplete.loaders.drillcore"
                :item-text="drillcoreLabel"
                :label="$t('drillcore.drillcore')"
                is-link
                route-object="drillcore"
                is-searchable
                v-on:search:items="autocompleteDrillcoreSearch"
                use-state
              />
            </v-col>
          </v-row>

          <!-- NUMBER, NUMBER_METERS, DIAMETER and STORAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.number"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.number')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.number_meters"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.number_meters')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.diameter"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.diameter')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.storage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('common.storage')"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_START, STRATIGRAPHY_TOP and STRATIGRAPHY_TOP_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.depth_start"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_start')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.stratigraphy_top"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_top"
                :loading="autocomplete.loaders.stratigraphy_top"
                :item-text="stratigraphyLabel"
                :label="$t('drillcore_box.stratigraphy_top')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteStratigraphyTopSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.stratigraphy_top_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_top_free')"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_END, STRATIGRAPHY_BASE and STRATIGRAPHY_BASE_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.depth_end"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_end')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.stratigraphy_base"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_base"
                :loading="autocomplete.loaders.stratigraphy_base"
                :item-text="stratigraphyLabel"
                :label="$t('drillcore_box.stratigraphy_base')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteStratigraphyBaseSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.stratigraphy_base_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_base_free')"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_OTHER -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.depth_other"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_other')"
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY_FREE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.stratigraphy_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_free')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED FILES -->
    <v-card
      class="mt-2"
      id="block-files"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.files = !block.files">
          <span>{{ $t("reference.relatedTables.attachment") }}</span>
          <v-icon right>fas fa-folder-open</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.files = !block.files"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.files ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.files" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <file-input
                show-existing
                :files-from-object="drillcore_box.attachments"
                @update:existing-files="drillcore_box.attachments = $event"
                @file-uploaded="addFiles"
                accept-multiple
                :record-options="$route.meta.isEdit"
                open-file
                acceptable-format="*/*"
                :is-draggable="$route.meta.isEdit"
                show-attachment-link
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "DrillcoreBox",

  components: {
    FileInput,
    TextareaWrapper,
    InputWrapper,
    AutocompleteWrapper,
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
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

  mixins: [formManipulation, autocompleteMixin, detailViewUtilsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  methods: {
    setInitialData() {
      return {
        autocomplete: {
          loaders: {
            drillcore: false,
            storage: false,
            stratigraphy_base: false,
            stratigraphy_top: false,
            attachments: false,
          },
          drillcore: [],
          storage: [],
          stratigraphy_base: [],
          stratigraphy_top: [],
          attachments: [],
        },
        requiredFields: ["drillcore", "number"],
        drillcore_box: {
          id: null,
          drillcore: null,
          number: null,
          number_meters: null,
          diameter: null,
          storage: null,
          depth_start: null,
          stratigraphy_base: null,
          stratigraphy_base_free: null,
          depth_end: null,
          stratigraphy_top: null,
          stratigraphy_top_free: null,
          depth_other: null,
          stratigraphy_free: null,
          remarks: null,
          attachments: [],
        },
        block: {
          info: true,
          files: true,
        },
      };
    },

    addFiles(files, singleFileMetadata) {
      this.addFilesAsNewObjects(files, this.drillcore_box, singleFileMetadata);
    },
  },
};
</script>

<style scoped />
