<template>
  <div class="drillcore">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('drillcore') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('drillcore') ? 'green--text' : 'red--text'"
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
          <!-- DRILLCORE and DRILLCORE_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="drillcore.drillcore"
                :color="bodyActiveColor"
                :label="$t('common.drillcore')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="drillcore.drillcore_en"
                :color="bodyActiveColor"
                :label="$t('common.drillcore_en')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- LOCALITY, YEAR, AGENT and DEPTH  -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.locality"
                :color="bodyActiveColor"
                :items="autocomplete.locality"
                :loading="autocomplete.loaders.locality"
                :item-text="localityLabel"
                :label="$t('common.locality')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore.year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('drillcore.agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore.depth"
                :color="bodyActiveColor"
                :label="$t('common.depth')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- OTHER INFO -->
    <v-card
      class="mt-2"
      id="block-details"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.details = !block.details"
        >
          <span>{{ $t("drillcore.details") }}</span>
          <v-icon right>fas fa-info</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.details = !block.details"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.details ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.details" class="pa-1">
          <!-- DEPOSITORY, LOCATION and STORAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.depository"
                :color="bodyActiveColor"
                :items="autocomplete.list_drillcore_storage"
                :loading="autocomplete.loaders.list_drillcore_storage"
                :item-text="commonLabel"
                :label="$t('drillcore.depository')"
              />
            </v-col>

            <!--            <v-col cols="12" md="4" class="pa-1">-->
            <!--              <input-wrapper-->
            <!--                v-model="drillcore.location"-->
            <!--                :color="bodyActiveColor"-->
            <!--                :label="$t('common.location')"-->
            <!--              />-->
            <!--            </v-col>-->

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.storage"
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

          <!-- BOXES, BOX_NUMBERS and NUMBER_METERS -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore.boxes"
                :color="bodyActiveColor"
                :label="$t('drillcore.boxes')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore.box_numbers"
                :color="bodyActiveColor"
                :label="$t('drillcore.box_numbers')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore.number_meters"
                :color="bodyActiveColor"
                :label="$t('drillcore.number_meters')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore.remarks"
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
      v-if="$route.meta.isEdit"
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
                :files-from-object="drillcore.attachments"
                @update:existing-files="drillcore.attachments = $event"
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

    <!-- DRILLCORE BOX IMAGES -->
    <v-card
      v-if="$route.meta.isEdit && drillcore.drillcore_boxes.length > 0"
      class="mt-2"
      id="block-drillcore_boxes"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.drillcore_boxes = !block.drillcore_boxes"
        >
          <span>{{ $t("drillcore.relatedTables.drillcore_box_images") }}</span>
          <v-icon right>fas fa-images</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.drillcore_boxes = !block.drillcore_boxes"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.drillcore_boxes ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.drillcore_boxes">
          <v-btn
            class="my-3 mx-2"
            v-if="drillcore.drillcore_boxes.count > 0"
            :color="bodyActiveColor"
            dark
            @click="openDrillcorePrintView($route.params.id)"
          >
            <v-icon small class="pr-1">fas fa-print</v-icon>
            {{ $t("common.print") }}
          </v-btn>
          <v-divider class="mt-0" />
          <drillcore-box-list-view :data="drillcore.drillcore_boxes">
            <template v-slot:itemTitle="{ item }">
              <router-link
                v-if="item && item.id"
                :to="{ path: '/drillcore_box/' + item.id }"
                :title="$t('editDrillcoreBox.editMessage')"
                class="sarv-link ma-0"
                :class="`${bodyActiveColor}--text`"
              >
                <h5
                  v-translate="{
                    et: `Kast nr. ${item.number} ${boxRange(item)}`,
                    en: `Box nr. ${item.number} ${boxRange(item)}`,
                  }"
                ></h5>
              </router-link>
            </template>
          </drillcore-box-list-view>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
    <v-card
      v-if="$route.meta.isEdit"
      class="related-tabs mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-tabs
        :background-color="bodyColor.split('n-')[0] + 'n-3'"
        show-arrows
        grow
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :active-class="bodyColor.split('n-')[0] + 'n-5 black--text'"
        hide-slider
      >
        <v-tab
          v-for="tab in relatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("drillcore.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2"
            :class="`${bodyActiveColor}--text`"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <drillcore-box-table
            v-show="activeTab === 'drillcore_box'"
            :response="relatedData.drillcore_box"
            :search-parameters="relatedData.searchParameters.drillcore_box"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <drillcore-study-table
            v-show="activeTab === 'drillcore_study'"
            :response="relatedData.drillcore_study"
            :search-parameters="relatedData.searchParameters.drillcore_study"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <!-- PAGINATION -->
          <pagination
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="pa-1"
            :body-active-color="bodyActiveColor"
            :count="relatedData[activeTab].count"
            :items-per-page="relatedData.searchParameters[activeTab].itemsPerPage"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            @update:options="handleUpdateOptions({ ...$event, activeTab })"
          />
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- DIRECTION_LR and IS_PRIVATE -->
    <div class="d-flex flex-wrap mt-2">
      <checkbox-wrapper
        class="mr-1"
        v-model="drillcore.direction_lr"
        :color="bodyActiveColor"
        :label="$t('drillcore.direction_lr')"
        @change="drillcore.direction_lr = !drillcore.direction_lr"
      />
      <checkbox-wrapper
        v-model="drillcore.is_private"
        :color="bodyActiveColor"
        :label="$t('common.is_private')"
        @change="drillcore.is_private = !drillcore.is_private"
      />
    </div>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import DrillcoreBoxTable from "@/components/drillcore/relatedTables/DrillcoreBoxTable";
import DrillcoreStudyTable from "@/components/drillcore/relatedTables/DrillcoreStudyTable";
import { mapActions, mapState } from "vuex";
import DrillcoreBoxListView from "@/components/drillcore_box/DrillcoreBoxListView";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Drillcore",

  components: {
    Pagination,
    DrillcoreBoxListView,
    DrillcoreStudyTable,
    DrillcoreBoxTable,
    FileInput,
    CheckboxWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  computed: {
    ...mapState("search", {
      activeRelatedDataTab: (state) => state.activeRelatedDataTab.drillcore,
    }),
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),
    boxRange(item) {
      if (!item?.depth_start && !item?.depth_end) {
        return "";
      }

      return `(${item?.depth_start ?? ""} - ${item?.depth_end ?? ""} m)`;
    },
    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "drillcore_box", iconClass: "fas fa-box" },
          { name: "drillcore_study", iconClass: "fas fa-school" },
        ],
        activeTab: "drillcore_box",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: ["list_drillcore_storage"],
        autocomplete: {
          loaders: {
            locality: false,
            agent: false,
            list_drillcore_storage: false,
            storage: false,
            attachment: false,
            attachments: false,
            drillcore_boxes: false,
            stratigraphy_base: false,
            stratigraphy_top: false,
          },
          locality: [],
          agent: [],
          list_drillcore_storage: [],
          storage: [],
          attachment: [],
          attachments: [],
          drillcore_boxes: [],
          stratigraphy_base: [],
          stratigraphy_top: [],
        },
        requiredFields: ["drillcore", "drillcore_en"],
        drillcore: {
          id: null,
          drillcore: null,
          drillcore_en: null,
          locality: null,
          year: null,
          agent: null,
          depository: null,
          // location: null,
          storage: null,
          boxes: null,
          box_numbers: null,
          number_meters: null,
          direction_lr: null,
          depth: null,
          remarks: null,
          is_private: false,
          attachments: [],
          drillcore_boxes: [],
        },
        block: {
          info: true,
          details: true,
          files: true,
          drillcore_boxes: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        drillcore_box: { count: 0, results: [] },
        drillcore_study: { count: 0, results: [] },
        searchParameters: {
          drillcore_box: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          drillcore_study: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    openDrillcorePrintView(id) {
      let routeData = this.$router.resolve({
        path: "/drillcore_print/" + id,
      });
      window.open(routeData.href, "_blank", "width=1000,height=750");
    },

    addFiles(files, singleFileMetadata) {
      this.addFilesAsNewObjects(files, this.drillcore, singleFileMetadata);
    },
  },
};
</script>
