<template>
  <div class="specimen">
    <!-- SAVE AS NEW -->
    <div class="text-center text-sm-left mt-2" v-if="$route.meta.isEdit">
      <v-btn
        dark
        :color="bodyActiveColor"
        @click="saveAsNew($route.meta.object, 'sample')"
      >
        <v-icon left small>fas fa-vial</v-icon>
        {{ $t("specimen.save_as_new_sample") }}
      </v-btn>
    </div>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('specimen') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('specimen') ? 'green--text' : 'red--text'"
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
          <!-- SPECIMEN_FULL_NUMBER -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <v-tooltip top z-index="60000">
                <template v-slot:activator="{ on, attrs }">
                  <input-wrapper
                    v-on="on"
                    v-bind="attrs"
                    v-model="specimen.specimen_full_number"
                    :color="bodyActiveColor"
                    :label="$t('specimen.specimen_full_number')"
                    readonly
                  />
                </template>
                <span>{{ $t("specimen.nameTooltip") }}</span>
              </v-tooltip>
            </v-col>
          </v-row>

          <!-- FOSSIL, SPECIMEN_ID, COLL and SPECIMEN_NR  -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.fossil"
                :color="bodyActiveColor"
                :items="autocomplete.list_specimen_kind"
                :loading="autocomplete.loaders.list_specimen_kind"
                :item-text="commonLabel"
                :label="$t('specimen.fossil')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.specimen_id"
                :color="bodyActiveColor"
                :label="$t('specimen.specimen_id')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.coll"
                :color="bodyActiveColor"
                :items="autocomplete.coll"
                :loading="autocomplete.loaders.coll"
                item-text="number"
                :label="$t('specimen.coll')"
                is-link
                route-object="collection"
                is-searchable
                v-on:search:items="autocompleteCollSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.specimen_nr"
                :color="bodyActiveColor"
                :label="$t('specimen.specimen_nr')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- LOCALITY INFO -->
    <v-card
      class="mt-2"
      id="block-localityInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.localityInfo = !block.localityInfo"
        >
          <span>{{ $t("specimen.localityInfo") }}</span>
          <v-icon right>fas fa-map-signs</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.localityInfo = !block.localityInfo"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.localityInfo ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.localityInfo" class="pa-1">
          <!-- LOCALITY, LOCALITY_FREE, REMARKS_COLLECTING and LOCALITY_IS_PRIVATE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.locality"
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
                v-model="specimen.locality_free"
                :color="bodyActiveColor"
                :label="$t('specimen.locality_free')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.remarks_collecting"
                :color="bodyActiveColor"
                :label="$t('specimen.remarks_collecting')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="specimen.locality_is_private"
                :color="bodyActiveColor"
                :label="$t('specimen.locality_is_private')"
                @change="
                  specimen.locality_is_private = !specimen.locality_is_private
                "
              />
            </v-col>
          </v-row>

          <!-- SAMPLE, SAMPLE_NUMBER, DEPTH and DEPTH_INTERVAL -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.sample"
                :color="bodyActiveColor"
                :items="autocomplete.sample"
                :loading="autocomplete.loaders.sample"
                item-text="number"
                :label="$t('specimen.sample')"
                is-link
                route-object="sample"
                is-searchable
                v-on:search:items="autocompleteSampleSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.sample_number"
                :color="bodyActiveColor"
                :label="$t('specimen.sample_number')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.depth"
                :color="bodyActiveColor"
                :label="$t('common.depth')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.depth_interval"
                :color="bodyActiveColor"
                :label="$t('common.depth_interval')"
                type="number"
                step="0.01"
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY, STRATIGRAPHY_FREE and FIELD NUMBER -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.stratigraphy"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy"
                :loading="autocomplete.loaders.stratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('common.stratigraphy')"
                is-searchable
                v-on:search:items="autocompleteChronostratigraphySearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.lithostratigraphy"
                :color="bodyActiveColor"
                :items="autocomplete.lithostratigraphy"
                :loading="autocomplete.loaders.lithostratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('common.lithostratigraphy')"
                is-searchable
                v-on:search:items="autocompleteLithostratigraphySearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.stratigraphy_free"
                :color="bodyActiveColor"
                :label="$t('common.stratigraphy_free')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.number_field"
                :color="bodyActiveColor"
                :label="$t('specimen.number_field')"
              />
            </v-col>
          </v-row>

          <!-- AGENT_COLLECTED, AGENT_COLLECTED_FREE, DATE_COLLECTED, DATE_COLLECTED_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.agent_collected"
                :color="bodyActiveColor"
                :items="autocomplete.agent_collected"
                :loading="autocomplete.loaders.agent_collected"
                item-text="agent"
                :label="$t('specimen.agent_collected')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentCollectedSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.agent_collected_free"
                :color="bodyActiveColor"
                :label="$t('specimen.agent_collected_free')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <date-wrapper
                v-model="specimen.date_collected"
                :color="bodyActiveColor"
                :label="$t('specimen.date_collected')"
                v-on:date:clear="specimen.date_collected = null"
                v-on:date:update="
                  updateUserInputtedDate('date_collected', $event)
                "
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.date_collected_free"
                :color="bodyActiveColor"
                :label="$t('specimen.date_collected_free')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SPECIMEN DETAILS -->
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
          <span>{{ $t("specimen.details") }}</span>
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
          <!-- TYPE, PART, CLASSIFICATION and PARENT -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.type"
                :color="bodyActiveColor"
                :items="autocomplete.list_specimen_type"
                :loading="autocomplete.loaders.list_specimen_type"
                :item-text="commonLabel"
                :label="$t('common.type')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.part"
                :color="bodyActiveColor"
                :label="$t('specimen.part')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.classification"
                :color="bodyActiveColor"
                :items="autocomplete.classification"
                :loading="autocomplete.loaders.classification"
                :item-text="classLabel"
                :label="$t('specimen.classification')"
                is-searchable
                v-on:search:items="autocompleteClassificationSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.parent"
                :color="bodyActiveColor"
                :items="autocomplete.parent"
                :loading="autocomplete.loaders.parent"
                item-text="specimen_id"
                :label="$t('specimen.related_specimen')"
                is-link
                route-object="specimen"
                is-searchable
                v-on:search:items="autocompleteSpecimenSearch($event, 'parent')"
              />
            </v-col>
          </v-row>

          <!-- SUBTYPE_ID, PRESENCE, STORAGE and NUMBER_PIECES -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.subtype_id"
                :color="bodyActiveColor"
                :items="autocomplete.list_specimen_subtype"
                :loading="autocomplete.loaders.list_specimen_subtype"
                :item-text="commonLabel"
                :label="$t('common.subtype')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.presence"
                :color="bodyActiveColor"
                :items="autocomplete.list_specimen_presence"
                :loading="autocomplete.loaders.list_specimen_presence"
                :item-text="commonLabel"
                :label="$t('specimen.presence')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.storage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('common.storage')"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="specimen.number_pieces"
                :color="bodyActiveColor"
                :label="$t('specimen.number_pieces')"
              />
            </v-col>
          </v-row>

          <!-- ACCESSION, DEACCESSION, STATUS and ORIGINAL_STATUS -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.accession"
                :color="bodyActiveColor"
                :items="autocomplete.accession"
                :loading="autocomplete.loaders.accession"
                item-text="number"
                :label="$t('specimen.accession')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.deaccession"
                :color="bodyActiveColor"
                :items="autocomplete.deaccession"
                :loading="autocomplete.loaders.deaccession"
                item-text="number"
                :label="$t('specimen.deaccession')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.status"
                :color="bodyActiveColor"
                :items="autocomplete.list_specimen_status"
                :loading="autocomplete.loaders.list_specimen_status"
                :item-text="commonLabel"
                :label="$t('specimen.status')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="specimen.original_status"
                :color="bodyActiveColor"
                :items="autocomplete.list_specimen_original_status"
                :loading="autocomplete.loaders.list_specimen_original_status"
                :item-text="commonLabel"
                :label="$t('specimen.original_status')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED IMAGES -->
    <v-card
      class="mt-2"
      id="block-images"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
      v-if="$route.meta.isEdit && specimenImages && specimenImages.length > 0"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.images = !block.images"
        >
          <span>{{ $t("specimen.specimenImages") }}</span>
          <v-icon right>fas fa-images</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.images = !block.images"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.images ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.images" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <image-view-wrapper
                :data="specimenImages"
                :body-active-color="bodyActiveColor"
                :body-color="bodyColor"
              />
            </v-col>
          </v-row>
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
          <span>{{ $t("specimen.relatedTables." + tab.name) }}</span>
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
          <specimen-identification-table
            v-show="activeTab === 'specimen_identification'"
            :response="relatedData.specimen_identification"
            :search-parameters="
              relatedData.searchParameters.specimen_identification
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
            :is-add-new-available="isFossil"
          />

          <specimen-identification-geology-table
            v-show="activeTab === 'specimen_identification_geology'"
            :response="relatedData.specimen_identification_geology"
            :search-parameters="
              relatedData.searchParameters.specimen_identification_geology
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
            :is-add-new-available="!isFossil"
          />

          <specimen-reference-table
            v-show="activeTab === 'specimen_reference'"
            :response="relatedData.specimen_reference"
            :search-parameters="relatedData.searchParameters.specimen_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <specimen-description-table
            v-show="activeTab === 'specimen_description'"
            :response="relatedData.specimen_description"
            :search-parameters="
              relatedData.searchParameters.specimen_description
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <div v-show="activeTab === 'attachment'">
            <file-input
              show-existing
              :files-from-object="relatedData.attachment.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
            />
          </div>

          <specimen-location-table
            v-show="activeTab === 'specimen_location'"
            :response="relatedData.specimen_location"
            :search-parameters="relatedData.searchParameters.specimen_location"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <specimen-history-table
            v-show="activeTab === 'specimen_history'"
            :response="relatedData.specimen_history"
            :search-parameters="relatedData.searchParameters.specimen_history"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <specimen-analysis-table
            v-show="activeTab === 'analysis'"
            :response="relatedData.analysis"
            :search-parameters="relatedData.searchParameters.analysis"
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
            :paginate-by="relatedData.searchParameters[activeTab].paginateBy"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            v-on:update:page="
              relatedData.searchParameters[activeTab].page = $event
            "
            v-on:update:paginateBy="
              relatedData.searchParameters[activeTab].paginateBy = $event
            "
          />
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.description = !block.description"
        >
          <span>{{ $t("common.description") }}</span>
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.description = !block.description"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="specimen.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>

            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="specimen.remarks_internal"
                :color="bodyActiveColor"
                :label="$t('specimen.remarks_internal')"
              />
            </v-col>

            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="specimen.tags"
                :color="bodyActiveColor"
                :label="$t('specimen.tags')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <checkbox-wrapper
          v-model="specimen.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="specimen.is_private = !specimen.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapActions, mapState } from "vuex";
import AutocompleteWrapper from "../../components/partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../components/partial/inputs/InputWrapper";
import TextareaWrapper from "../../components/partial/inputs/TextareaWrapper";
import DateWrapper from "../../components/partial/inputs/DateWrapper";
import CheckboxWrapper from "../../components/partial/inputs/CheckboxWrapper";
import FileInput from "../../components/partial/inputs/FileInput";
import SpecimenIdentificationTable from "../../components/specimen/relatedTables/SpecimenIdentificationTable";
import SpecimenIdentificationGeologyTable from "../../components/specimen/relatedTables/SpecimenIdentificationGeologyTable";
import SpecimenReferenceTable from "../../components/specimen/relatedTables/SpecimenReferenceTable";
import SpecimenDescriptionTable from "../../components/specimen/relatedTables/SpecimenDescriptionTable";
import SpecimenLocationTable from "../../components/specimen/relatedTables/SpecimenLocationTable";
import SpecimenHistoryTable from "../../components/specimen/relatedTables/SpecimenHistoryTable";
import SpecimenAnalysisTable from "../../components/specimen/relatedTables/SpecimenAnalysisTable";
import saveAsNewMixin from "@/mixins/saveAsNewMixin";
import Pagination from "@/components/partial/Pagination";
import ImageViewWrapper from "@/components/partial/image_view/ImageViewWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Specimen",

  components: {
    ImageViewWrapper,
    Pagination,
    SpecimenAnalysisTable,
    SpecimenHistoryTable,
    SpecimenLocationTable,
    SpecimenDescriptionTable,
    SpecimenReferenceTable,
    SpecimenIdentificationGeologyTable,
    SpecimenIdentificationTable,
    FileInput,
    CheckboxWrapper,
    DateWrapper,
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    saveAsNewMixin,
    globalUtilsMixin,
    detailViewUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    if (this?.$route?.query?.storage) {
      this.specimen.storage = JSON.parse(this.$route.query.storage);
      this.autocomplete.storage.push(this.specimen.storage);
    }

    this.loadFullInfo();
  },

  watch: {
    "relatedData.searchParameters": {
      handler: function () {
        this.loadRelatedData(
          [this.activeTab],
          "specimen",
          this.$route.params.id
        );
      },
      deep: true,
    },
    "specimen.specimen_id"(newVal) {
      this.updateSpecimenFullName({
        specimen_id: newVal,
        coll: this.specimen?.coll?.number,
      });
    },
    "specimen.coll"(newVal) {
      this.updateSpecimenFullName({
        specimen_id: this.specimen?.specimen_id,
        coll: newVal?.number,
      });
    },
  },

  computed: {
    ...mapState("search", {
      activeRelatedDataTab: (state) => state.activeRelatedDataTab.specimen,
    }),

    isFossil() {
      let fossilId = this.specimen?.fossil?.id;

      return fossilId === 1 || fossilId === 7;
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),
    ...mapActions("detail", ["saveFields"]),

    updateSpecimenFullName(obj) {
      if (!obj.specimen_id || !obj.coll)
        this.specimen.specimen_full_number = null;
      else
        this.specimen.specimen_full_number = `${obj.coll.split(" ")[0]} ${
          obj.specimen_id
        }`;
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
        tabIndex: null,
        relatedTabs: [
          { name: "specimen_identification", iconClass: "fas fa-atlas" },
          { name: "specimen_identification_geology", iconClass: "far fa-gem" },
          { name: "specimen_reference", iconClass: "fas fa-book" },
          { name: "specimen_description", iconClass: "fas fa-info" },
          { name: "attachment", iconClass: "far fa-folder-open" },
          { name: "specimen_location", iconClass: "fas fa-globe-europe" },
          { name: "specimen_history", iconClass: "fas fa-history" },
          { name: "analysis", iconClass: "far fa-chart-bar" },
        ],
        activeTab: "specimen_identification",
        relatedData: this.setDefaultRelatedData(),
        specimenImages: null,
        listOfAutocompleteTables: [
          "list_specimen_kind",
          "list_specimen_original_status",
          "list_specimen_presence",
          "list_specimen_status",
          "list_specimen_type",
          "list_specimen_subtype",
          "list_history_type",
          "accession",
          "deaccession",
        ],
        autocomplete: {
          loaders: {
            list_specimen_kind: false,
            list_specimen_original_status: false,
            list_specimen_presence: false,
            list_specimen_status: false,
            list_specimen_type: false,
            list_specimen_subtype: false,
            list_history_type: false,
            accession: false,
            deaccession: false,
            coll: false,
            locality: false,
            sample: false,
            stratigraphy: false,
            lithostratigraphy: false,
            agent_collected: false,
            storage: false,
            classification: false,
            specimen: false,
            taxon: false,
            agent: false,
            reference: false,
            list_identification_type: false,
            rock: false,
            list_unit: false,
            attachment: false,
            analysis_method: false,
            parent: false,
            fossil: false,
          },
          list_specimen_kind: [],
          list_specimen_original_status: [],
          list_specimen_presence: [],
          list_specimen_status: [],
          list_specimen_type: [],
          list_specimen_subtype: [],
          list_history_type: [],
          accession: [],
          deaccession: [],
          coll: [],
          locality: [],
          sample: [],
          stratigraphy: [],
          lithostratigraphy: [],
          agent_collected: [],
          storage: [],
          classification: [],
          specimen: [],
          taxon: [],
          agent: [],
          reference: [],
          list_identification_type: [],
          rock: [],
          list_unit: [],
          attachment: [],
          analysis_method: [],
          parent: [],
          fossil: [],
        },
        requiredFields: ["fossil"],
        specimen: {
          id: null,
          specimen_id: null,
          collection: null,
          specimen_nr: null,
          number_field: null,
          part: null,
          number_pieces: null,
          locality_free: null,
          locality_free_en: null,
          locality_is_private: false,
          depth: null,
          depth_interval: null,
          sample_number: null,
          remarks_collecting: null,
          stratigraphy_free: null,
          agent_collected_free: null,
          date_collected: null,
          date_collected_free: null,
          remarks: null,
          remarks_internal: null,
          tags: null,
          location: null,
          is_private: false,
          coll: null,
          type: null,
          subtype_id: null,
          fossil: null,
          kind: null,
          classification: null,
          locality: null,
          sample: null,
          parent: null,
          stratigraphy: null,
          lithostratigraphy: null,
          agent_collected: null,
          presence: null,
          storage: null,
          status: null,
          original_status: null,
          database: null,
          accession: null,
          deaccession: null,
        },
        block: {
          info: true,
          localityInfo: true,
          details: true,
          images: true,
          description: true,
        },
      };
    },

    loadSpecimenImages(specimenId) {
      this.specimenImages = this.$api.rw.get("attachment", {
        defaultParams: {
          specimen: specimenId,
        },
      });
    },

    setDefaultRelatedData() {
      return {
        specimen_identification: { count: 0, results: [] },
        specimen_identification_geology: { count: 0, results: [] },
        specimen_reference: { count: 0, results: [] },
        specimen_description: { count: 0, results: [] },
        attachment: { count: 0, results: [] },
        specimen_location: { count: 0, results: [] },
        specimen_history: { count: 0, results: [] },
        analysis: { count: 0, results: [] },
        searchParameters: {
          specimen_identification: {
            page: 1,
            paginateBy: 10,
            sortBy: ["taxon", "current"],
            sortDesc: [true, true],
          },
          specimen_identification_geology: {
            page: 1,
            paginateBy: 10,
            sortBy: ["rock", "current"],
            sortDesc: [true, true],
          },
          specimen_reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["reference"],
            sortDesc: [true],
          },
          specimen_description: {
            page: 1,
            paginateBy: 10,
            sortBy: ["length"],
            sortDesc: [true],
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          specimen_location: {
            page: 1,
            paginateBy: 10,
            sortBy: ["number"],
            sortDesc: [true],
          },
          specimen_history: {
            page: 1,
            paginateBy: 10,
            sortBy: ["type"],
            sortDesc: [true],
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    addFiles(files, singleFileMetadata) {
      this.addFilesAsNewObjects(files, "specimen", singleFileMetadata);
    },

    addExistingFiles(files) {
      this.relatedData.attachment.results = files;
    },
  },
};
</script>

<style scoped></style>
