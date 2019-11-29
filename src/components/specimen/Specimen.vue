<template>
  <div class="specimen red--text f">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

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
            $t("specimen.generalInfo")
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- FOSSIL, SPECIMEN_ID, COLL and SPECIMEN_NR  -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`fossil`">{{ $t("specimen.fossil") }}:</label>
              <vue-multiselect
                v-model="specimen.fossil"
                id="fossil"
                :options="autocomplete.specimen_kind"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :class="isNotEmpty(specimen.fossil) ? 'valid' : 'invalid'"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`specimen_id`"
                >{{ $t("specimen.specimen_id") }}:</label
              >
              <b-form-input
                size="sm"
                id="specimen_id"
                v-model="specimen.specimen_id"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`coll`">{{ $t("specimen.coll") }}:</label>
              <vue-multiselect
                id="copyright_agent"
                v-model="specimen.coll"
                label="number"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.coll"
                :options="autocomplete.coll"
                @search-change="autocompleteCollSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`specimen_nr`"
                >{{ $t("specimen.specimen_nr") }}:</label
              >
              <b-form-input
                size="sm"
                id="specimen_nr"
                v-model="specimen.specimen_nr"
                type="text"
              ></b-form-input>
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
        <div v-show="block.localityInfo" class="px-1 pt-1 pb-2">
          <!-- LOCALITY, LOCALITY_FREE, REMARKS_COLLECTING and LOCALITY_IS_PRIVATE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`locality`">{{ $t("specimen.locality") }}:</label>
              <vue-multiselect
                v-model="specimen.locality"
                id="locality"
                track-by="id"
                :label="localityLabel"
                :options="autocomplete.locality"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteLocalitySearch2"
                :loading="autocomplete.loaders.locality"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[localityLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`locality_free`"
                >{{ $t("specimen.locality_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="locality_free"
                v-model="specimen.locality_free"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`remarks_collecting`"
                >{{ $t("specimen.remarks_collecting") }}:</label
              >
              <b-form-input
                size="sm"
                id="remarks_collecting"
                v-model="specimen.remarks_collecting"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`locality_is_private`"
                >{{ $t("specimen.locality_is_private") }}:</label
              >
              <v-checkbox
                v-model="specimen.locality_is_private"
                :label="$t('specimen.is_private_text')"
                hide-details
                :color="bodyActiveColor"
                class="mt-0 vuetify-checkbox"
              ></v-checkbox>
            </v-col>
          </v-row>

          <!-- SAMPLE, SAMPLE_NUMBER, DEPTH and DEPTH_INTERVAL -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`sample`">{{ $t("specimen.sample") }}:</label>
              <vue-multiselect
                id="sample"
                v-model="specimen.sample"
                label="number"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.sample"
                :options="autocomplete.sample"
                @search-change="autocompleteSampleSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`sample_number`"
                >{{ $t("specimen.sample_number") }}:</label
              >
              <b-form-input
                size="sm"
                id="sample_number"
                v-model="specimen.sample_number"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`depth`">{{ $t("specimen.depth") }}:</label>
              <b-form-input
                size="sm"
                id="depth"
                v-model="specimen.depth"
                type="number"
                step="0.01"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`depth_interval`"
                >{{ $t("specimen.depth_interval") }}:</label
              >
              <b-form-input
                size="sm"
                id="depth_interval"
                v-model="specimen.depth_interval"
                type="number"
                step="0.01"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY, STRATIGRAPHY_FREE and FIELD NUMBER -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`stratigraphy`"
                >{{ $t("specimen.stratigraphy") }}:</label
              >
              <vue-multiselect
                v-model="specimen.stratigraphy"
                id="stratigraphy"
                :label="stratigraphyLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.stratigraphy"
                :options="autocomplete.stratigraphy"
                @search-change="autocompleteStratigraphySearch2"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`lithostratigraphy`"
                >{{ $t("specimen.lithostratigraphy") }}:</label
              >
              <vue-multiselect
                v-model="specimen.lithostratigraphy"
                id="lithostratigraphy"
                :label="stratigraphyLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.lithostratigraphy"
                :options="autocomplete.lithostratigraphy"
                @search-change="autocompleteLithostratigraphySearch2"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`stratigraphy_free`"
                >{{ $t("specimen.stratigraphy_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="stratigraphy_free"
                v-model="specimen.stratigraphy_free"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`number_field`"
                >{{ $t("specimen.number_field") }}:</label
              >
              <b-form-input
                size="sm"
                id="number_field"
                v-model="specimen.number_field"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- AGENT_COLLECTED, AGENT_COLLECTED_FREE, DATE_COLLECTED, DATE_COLLECTED_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`agent_collected`"
                >{{ $t("specimen.agent_collected") }}:</label
              >
              <vue-multiselect
                id="agent"
                v-model="specimen.agent_collected"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.agent_collected"
                :options="autocomplete.agent_collected"
                @search-change="autocompleteAgentCollectedSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`agent_collected_free`"
                >{{ $t("specimen.agent_collected_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="agent_collected_free"
                v-model="specimen.agent_collected_free"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`date_collected`"
                >{{ $t("specimen.date_collected") }}:</label
              >
              <datepicker
                id="date_start"
                v-model="specimen.date_collected"
                use-utc="true "
                lang="en"
                :first-day-of-week="1"
                format="DD MMM YYYY"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`date_collected_free`"
                >{{ $t("specimen.date_collected_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="date_collected_free"
                v-model="specimen.date_collected_free"
                type="text"
              ></b-form-input>
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
        <div v-show="block.details" class="px-1 pt-1 pb-2">
          <!-- TYPE, PART, CLASSIFICATION and PARENT -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`type`">{{ $t("specimen.type") }}:</label>
              <vue-multiselect
                v-model="specimen.type"
                id="type"
                :options="autocomplete.specimen_type"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`part`">{{ $t("specimen.part") }}:</label>
              <b-form-input
                size="sm"
                id="part"
                v-model="specimen.part"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`classification`"
                >{{ $t("specimen.classification") }}:</label
              >
              <vue-multiselect
                id="classification"
                v-model="specimen.classification"
                :label="classLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.classification"
                :options="autocomplete.classification"
                @search-change="autocompleteClassificationSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[classLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`parent`"
                >{{ $t("specimen.related_specimen") }}:</label
              >
              <vue-multiselect
                id="parent"
                v-model="specimen.parent"
                label="specimen_id"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.specimen"
                :options="autocomplete.specimen"
                @search-change="autocompleteSpecimenSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.specimen_id }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- PRESENCE and STORAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`presence`">{{ $t("specimen.presence") }}:</label>
              <vue-multiselect
                v-model="specimen.presence"
                id="presence"
                :options="autocomplete.specimen_presence"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`storage`">{{ $t("specimen.storage") }}:</label>
              <vue-multiselect
                v-model="specimen.storage"
                id="storage"
                label="location"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.storage"
                :options="autocomplete.storage"
                @search-change="autocompleteStorageSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }"
                  ><strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- ACCESSION, DEACCESSION, STATUS and ORIGINAL_STATUS -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`accession`">{{ $t("specimen.accession") }}:</label>
              <vue-multiselect
                v-model="specimen.accession"
                id="accession"
                :options="autocomplete.accession"
                track-by="id"
                label="number"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`deaccession`"
                >{{ $t("specimen.deaccession") }}:</label
              >
              <vue-multiselect
                v-model="specimen.deaccession"
                id="deaccession"
                :options="autocomplete.deaccession"
                track-by="id"
                label="number"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`status`">{{ $t("specimen.status") }}:</label>
              <vue-multiselect
                v-model="specimen.status"
                id="status"
                :options="autocomplete.specimen_status"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`original_status`"
                >{{ $t("specimen.original_status") }}:</label
              >
              <vue-multiselect
                v-model="specimen.original_status"
                id="original_status"
                :options="autocomplete.specimen_original_status"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
    <v-card
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
          v-for="tab in computedRelatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("specimen.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].length > 0"
            class="font-weight-bold ml-2"
          >
            {{ relatedData[tab.name].length }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card
          class="pt-3 px-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <specimen-identification
            v-if="
              specimen.fossil &&
                (specimen.fossil.id === 1 || specimen.fossil.id === 7)
            "
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <specimen-identification-geology
            v-if="
              specimen.fossil &&
                specimen.fossil.id !== 1 &&
                specimen.fossil.id !== 7
            "
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <specimen-reference
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <specimen-description
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <specimen-attachment
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <specimen-location
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <specimen-history
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <specimen-analysis
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData.count[activeTab] > 0"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none px-1"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters[activeTab].paginateBy"
                :color="bodyActiveColor"
                dense
                :items="paginateByOptionsTranslated"
                :item-color="bodyActiveColor"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters[activeTab].page"
                :color="bodyActiveColor"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData.count[activeTab] /
                      relatedData.searchParameters[activeTab].paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>
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
          <span>{{ $t("specimen.description") }}</span>
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
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("specimen.remarks") }}:</label>
              <editor :data.sync="specimen.remarks" />
            </v-col>

            <v-col cols="12" class="px-1">
              <label :for="`tags`">{{ $t("specimen.tags") }}:</label>
              <b-form-input
                size="sm"
                id="tags"
                v-model="specimen.tags"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <v-checkbox
          v-model="specimen.is_private"
          id="is_private"
          :label="$t('specimen.is_private_text')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import Editor from "../partial/editor/Editor";
import Datepicker from "vue2-datepicker";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchAccession,
  fetchDeaccession,
  fetchListHistoryType,
  fetchListIdentificationType,
  fetchListSpecimenKind,
  fetchListSpecimenOriginalStatus,
  fetchListSpecimenPresence,
  fetchListSpecimenStatus,
  fetchListSpecimenType,
  fetchListUnit,
  fetchSpecimen,
  fetchSpecimenAnalyses,
  fetchSpecimenAttachments,
  fetchSpecimenDescriptions,
  fetchSpecimenHistory,
  fetchSpecimenIdentificationGeologies,
  fetchSpecimenIdentifications,
  fetchSpecimenLocations,
  fetchSpecimenReferences,
  fetchSpecimens
} from "../../assets/js/api/apiCalls";
import { mapState } from "vuex";
import SpecimenIdentification from "./relatedTables/SpecimenIdentification";
import SpecimenIdentificationGeology from "./relatedTables/SpecimenIdentificationGeology";
import SpecimenReference from "./relatedTables/SpecimenReference";
import SpecimenDescription from "./relatedTables/SpecimenDescription";
import SpecimenAttachment from "./relatedTables/SpecimenAttachment";
import SpecimenLocation from "./relatedTables/SpecimenLocation";
import SpecimenHistory from "./relatedTables/SpecimenHistory";
import SpecimenAnalysis from "./relatedTables/SpecimenAnalysis";

export default {
  name: "Specimen",

  components: {
    SpecimenAnalysis,
    SpecimenHistory,
    SpecimenLocation,
    SpecimenAttachment,
    SpecimenDescription,
    SpecimenReference,
    SpecimenIdentificationGeology,
    SpecimenIdentification,
    Editor,
    Spinner,
    Datepicker
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
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
    }
  },

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      const searchHistory = this.$localStorage.get(
        this.searchHistory,
        "fallbackValue"
      );
      let params =
        this.isNotEmpty(searchHistory) && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "specimenSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_SPECIMENS",
        title: "header.specimens",
        object: "specimen",
        field: "specimen_id",
        databaseId: this.databaseId,
        block: this.block
      });
    } else {
      // Adding specimen default values from local storage
      const specimenHistory = this.$localStorage.get(
        "specimen",
        "fallbackValue"
      );
      if (
        specimenHistory !== "fallbackValue" &&
        Object.keys(specimenHistory).length !== 0 &&
        specimenHistory.constructor === Object
      ) {
        this.specimen = specimenHistory;
      }
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters": {
      handler: function() {
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["databaseId"]),

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },

    computedRelatedTabs() {
      return this.relatedTabs.filter(tab => {
        if (tab.name === "specimen_identification") {
          if (
            this.specimen &&
            this.specimen.fossil &&
            (this.specimen.fossil.id === 1 || this.specimen.fossil.id === 7)
          ) {
            return tab;
          }
        } else if (tab.name === "specimen_identification_geology") {
          if (
            this.specimen &&
            this.specimen.fossil &&
            this.specimen.fossil.id !== 1 &&
            this.specimen.fossil.id !== 7
          ) {
            return tab;
          }
        } else return tab;
      });
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  },

  methods: {
    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "specimen_identification", iconClass: "fas fa-atlas" },
          { name: "specimen_identification_geology", iconClass: "far fa-gem" },
          { name: "specimen_reference", iconClass: "fas fa-book" },
          { name: "specimen_description", iconClass: "fas fa-info" },
          { name: "attachment", iconClass: "far fa-folder-open" },
          { name: "specimen_location", iconClass: "fas fa-globe-europe" },
          { name: "specimen_history", iconClass: "fas fa-history" },
          { name: "analysis", iconClass: "far fa-chart-bar" }
        ],
        searchHistory: "specimenSearchHistory",
        activeTab: "specimen_identification",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "specimen_id",
          "coll",
          "specimen_nr",
          "number_field",
          "fossil",
          "type",
          "part",
          "locality",
          "locality_free",
          "depth",
          "depth_interval",
          "sample",
          "sample_number",
          "stratigraphy",
          "lithostratigraphy",
          "agent_collected",
          "agent_collected_free",
          "date_collected",
          "date_collected_free",
          "agent_collected",
          "presence",
          "storage",
          "classification",
          "locality_is_private",
          "remarks_collecting",
          "stratigraphy_free",
          "accession",
          "deaccession",
          "remarks",
          "remarks_internal",
          "is_private",
          "tags",
          "status",
          "original_status",
          "parent"
        ],
        autocomplete: {
          loaders: {
            coll: false,
            specimen_kind: false,
            specimen_original_status: false,
            specimen_presence: false,
            specimen_status: false,
            specimen_type: false,
            locality: false,
            sample: false,
            stratigraphy: false,
            lithostratigraphy: false,
            agent_collected: false,
            storage: false,
            classification: false,
            accession: false,
            deaccession: false,
            specimen: false,
            taxon: false,
            agent: false,
            reference: false,
            list_identification_type: false,
            rock: false,
            list_unit: false,
            attachment: false,
            list_specimen_type: false,
            list_history_type: false,
            analysis_method: false
          },
          coll: [],
          specimen_kind: [],
          specimen_original_status: [],
          specimen_presence: [],
          specimen_status: [],
          specimen_type: [],
          locality: [],
          sample: [],
          stratigraphy: [],
          lithostratigraphy: [],
          agent_collected: [],
          storage: [],
          classification: [],
          accession: [],
          deaccession: [],
          specimen: [],
          taxon: [],
          agent: [],
          reference: [],
          list_identification_type: [],
          rock: [],
          list_unit: [],
          attachment: [],
          list_specimen_type: [],
          list_history_type: [],
          analysis_method: []
        },
        requiredFields: ["fossil"],
        specimen: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          localityInfo: true,
          details: true,
          description: true
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ]
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields(true, true);

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "specimen");
        fetchSpecimen(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.specimen = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.specimen);

            this.removeUnnecessaryFields(this.specimen, this.copyFields);
            this.$emit("data-loaded", this.specimen);
            this.sendingData = false;

            // Set default tab
            if (this.specimen && this.specimen.fossil) {
              if (
                this.specimen.fossil.id === 1 ||
                this.specimen.fossil.id === 7
              ) {
                if (
                  this.activeRelatedDataTab &&
                  this.activeRelatedDataTab !==
                    "specimen_identification_geology"
                )
                  this.setTab(this.activeRelatedDataTab);
                else this.setTab("specimen_identification");
              } else {
                if (this.activeRelatedDataTab)
                  this.setTab(this.activeRelatedDataTab);
                else this.setTab("specimen_identification_geology");
              }
            } else {
              if (
                this.activeRelatedDataTab &&
                this.activeRelatedDataTab !== "specimen_identification" &&
                this.activeRelatedDataTab !== "specimen_identification_geology"
              )
                this.setTab(this.activeRelatedDataTab);
              else this.setTab("specimen_reference");
            }
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(tab => tab.name)
        );
      } else {
        // Set default tab
        if (this.specimen && this.specimen.fossil) {
          if (this.specimen.fossil.id === 1 || this.specimen.fossil.id === 7) {
            if (
              this.activeRelatedDataTab &&
              this.activeRelatedDataTab !== "specimen_identification_geology"
            )
              this.setTab(this.activeRelatedDataTab);
            else this.setTab("specimen_identification");
          } else {
            if (this.activeRelatedDataTab)
              this.setTab(this.activeRelatedDataTab);
            else this.setTab("specimen_identification_geology");
          }
        } else {
          if (
            this.activeRelatedDataTab &&
            this.activeRelatedDataTab !== "specimen_identification" &&
            this.activeRelatedDataTab !== "specimen_identification_geology"
          )
            this.setTab(this.activeRelatedDataTab);
          else this.setTab("specimen_reference");
        }
      }
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchListSpecimenKind().then(
          response =>
            (this.autocomplete.specimen_kind = this.handleResponse(response))
        );
        fetchListSpecimenOriginalStatus().then(
          response =>
            (this.autocomplete.specimen_original_status = this.handleResponse(
              response
            ))
        );
        fetchListSpecimenPresence().then(
          response =>
            (this.autocomplete.specimen_presence = this.handleResponse(
              response
            ))
        );
        fetchListSpecimenStatus().then(
          response =>
            (this.autocomplete.specimen_status = this.handleResponse(response))
        );
        fetchListSpecimenType().then(
          response =>
            (this.autocomplete.specimen_type = this.handleResponse(response))
        );
        fetchAccession().then(
          response =>
            (this.autocomplete.accession = this.handleResponse(response))
        );
        fetchDeaccession().then(
          response =>
            (this.autocomplete.deaccession = this.handleResponse(response))
        );
      }

      if (relatedDataAutocompleteFields) {
        fetchListIdentificationType().then(
          response =>
            (this.autocomplete.list_identification_type = this.handleResponse(
              response
            ))
        );
        fetchListUnit().then(
          response =>
            (this.autocomplete.list_unit = this.handleResponse(response))
        );
        fetchListSpecimenType().then(
          response =>
            (this.autocomplete.list_specimen_type = this.handleResponse(
              response
            ))
        );
        fetchListHistoryType().then(
          response =>
            (this.autocomplete.list_history_type = this.handleResponse(
              response
            ))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        specimen_identification: [],
        specimen_identification_geology: [],
        specimen_reference: [],
        specimen_description: [],
        attachment: [],
        specimen_location: [],
        specimen_history: [],
        analysis: [],
        new: {
          specimen_identification: [],
          specimen_identification_geology: [],
          specimen_reference: [],
          specimen_description: [],
          attachment: [],
          specimen_location: [],
          specimen_history: [],
          analysis: []
        },
        copyFields: {
          specimen_identification: [
            "taxon",
            "name",
            "agent",
            "reference",
            "date_identified",
            "type",
            "current"
          ],
          specimen_identification_geology: [
            "rock",
            "name",
            "name_en",
            "agent",
            "reference",
            "date_identified",
            "type",
            "current"
          ],
          specimen_reference: ["reference", "pages", "figures", "remarks"],
          specimen_description: [
            "length",
            "width",
            "height",
            "unit",
            "mass",
            "description",
            "agent",
            "date",
            "remarks"
          ],
          attachment: ["attachment", "remarks"],
          specimen_location: ["number", "type", "part", "storage", "remarks"],
          specimen_history: [
            "type",
            "value_old",
            "value_new",
            "date",
            "remarks"
          ],
          analysis: [
            "analysis_method",
            "method_details",
            "mass",
            "date",
            "date_end",
            "date_free",
            "agent",
            "remarks",
            "storage",
            "is_private"
          ]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          specimen_identification: {
            page: 1,
            paginateBy: 10,
            orderBy: "taxon__taxon,current"
          },
          specimen_identification_geology: {
            page: 1,
            paginateBy: 10,
            orderBy: "rock__name,rock__name_en,current"
          },
          specimen_reference: {
            page: 1,
            paginateBy: 10,
            orderBy: "reference__reference"
          },
          specimen_description: {
            page: 1,
            paginateBy: 10,
            orderBy: "length"
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            orderBy: "original_filename"
          },
          specimen_location: {
            page: 1,
            paginateBy: 10,
            orderBy: "number"
          },
          specimen_history: {
            page: 1,
            paginateBy: 10,
            orderBy: "type"
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          specimen_identification: 0,
          specimen_identification_geology: 0,
          specimen_reference: 0,
          specimen_description: 0,
          attachment: 0,
          specimen_location: 0,
          specimen_history: 0,
          analysis: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        specimen_identification: {},
        specimen_identification_geology: {},
        specimen_reference: {},
        specimen_description: {},
        attachment: {},
        specimen_location: {},
        specimen_history: {},
        analysis: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Todo: Api doesn't save specimen_nr and throws error
      delete uploadableObject.specimen_nr;
      if (!this.$route.meta.isEdit)
        this.$localStorage.set("specimen", objectToUpload);

      if (this.isNotEmpty(objectToUpload.date_collected))
        uploadableObject.date_collected = this.formatDateForUpload(
          objectToUpload.date_collected
        );

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.coll))
        uploadableObject.coll = objectToUpload.coll.id;
      if (this.isNotEmpty(objectToUpload.fossil))
        uploadableObject.fossil = objectToUpload.fossil.id;
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      if (this.isNotEmpty(objectToUpload.locality))
        uploadableObject.locality = objectToUpload.locality.id;
      if (this.isNotEmpty(objectToUpload.sample))
        uploadableObject.sample = objectToUpload.sample.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy))
        uploadableObject.stratigraphy = objectToUpload.stratigraphy.id;
      if (this.isNotEmpty(objectToUpload.lithostratigraphy))
        uploadableObject.lithostratigraphy =
          objectToUpload.lithostratigraphy.id;
      if (this.isNotEmpty(objectToUpload.presence))
        uploadableObject.presence = objectToUpload.presence.id;
      if (this.isNotEmpty(objectToUpload.storage))
        uploadableObject.storage = objectToUpload.storage.id;
      if (this.isNotEmpty(objectToUpload.classification))
        uploadableObject.classification = objectToUpload.classification.id;
      if (this.isNotEmpty(objectToUpload.accession))
        uploadableObject.accession = objectToUpload.accession.id;
      if (this.isNotEmpty(objectToUpload.deaccession))
        uploadableObject.deaccession = objectToUpload.deaccession.id;
      if (this.isNotEmpty(objectToUpload.agent_collected))
        uploadableObject.agent_collected = objectToUpload.agent_collected.id;
      if (this.isNotEmpty(objectToUpload.status))
        uploadableObject.status = objectToUpload.status.id;
      if (this.isNotEmpty(objectToUpload.original_status))
        uploadableObject.original_status = objectToUpload.original_status.id;
      if (this.isNotEmpty(objectToUpload.parent))
        uploadableObject.parent = objectToUpload.parent.id;

      if (this.databaseId) uploadableObject.database = this.databaseId;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            uploadableObject.related_data[tab.name] = this.relatedData[
              tab.name
            ];
        });
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.specimen.coll = { id: obj.coll, number: obj.coll__number };
      this.specimen.fossil = {
        id: obj.fossil,
        value: obj.fossil__value,
        value_en: obj.fossil__value_en
      };
      this.specimen.type = {
        id: obj.type,
        value: obj.type__value,
        value_en: obj.type__value_en
      };
      this.specimen.locality = {
        id: obj.locality,
        locality: obj.locality__locality,
        locality_en: obj.locality__locality_en
      };
      this.specimen.sample = { id: obj.sample, number: obj.sample__number };
      this.specimen.stratigraphy = {
        id: obj.stratigraphy,
        stratigraphy: obj.stratigraphy__stratigraphy,
        stratigraphy_en: obj.stratigraphy__stratigraphy_en
      };
      this.specimen.lithostratigraphy = {
        id: obj.lithostratigraphy,
        stratigraphy: obj.lithostratigraphy__stratigraphy,
        stratigraphy_en: obj.lithostratigraphy__stratigraphy_en
      };
      this.specimen.agent_collected = {
        id: obj.agent_collected,
        agent: obj.agent_collected__agent
      };
      this.specimen.presence = {
        id: obj.presence,
        value: obj.presence__value,
        value_en: obj.presence__value_en
      };
      this.specimen.storage = {
        id: obj.storage,
        location: obj.storage__location
      };
      this.specimen.classification = {
        id: obj.classification,
        class_field: obj.classification__class_field,
        class_en: obj.classification__class_en
      };
      this.specimen.accession = {
        id: obj.accession,
        number: obj.accession__number
      };
      this.specimen.deaccession = {
        id: obj.deaccession,
        nnumber: obj.deaccession__number
      };
      this.specimen.status = {
        id: obj.status,
        value: obj.status__value,
        value_en: obj.status__value_en
      };
      this.specimen.original_status = {
        id: obj.original_status,
        value: obj.original_status__value,
        value_en: obj.original_status__value_en
      };
      this.specimen.parent = {
        id: obj.parent,
        specimen_id: obj.parent__specimen_id
      };
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.taxon))
        obj.taxon = { id: obj.taxon, taxon: obj.taxon__taxon };
      if (this.isNotEmpty(obj.agent))
        obj.agent = { id: obj.agent, agent: obj.agent__agent };
      if (this.isNotEmpty(obj.reference))
        obj.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
      if (this.isNotEmpty(obj.type))
        obj.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en
        };
      if (this.isNotEmpty(obj.rock))
        obj.rock = {
          id: obj.rock,
          name: obj.rock__name,
          name_en: obj.rock__name_en
        };
      if (this.isNotEmpty(obj.unit))
        obj.unit = {
          id: obj.unit,
          value: obj.unit__value,
          value_en: obj.unit__value_en
        };
      if (this.isNotEmpty(obj.original_filename))
        obj.attachment = {
          id: obj.id,
          original_filename: obj.original_filename
        };
      if (this.isNotEmpty(obj.storage))
        obj.storage = { id: obj.storage, location: obj.storage__location };
      if (this.isNotEmpty(obj.analysis_method))
        obj.analysis_method = {
          id: obj.analysis_method,
          analysis_method: obj.analysis_method__analysis_method,
          method_en: obj.analysis_method__method_en
        };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.taxon)) {
        newObject.taxon = obj.taxon.id;
        newObject.taxon__taxon = obj.taxon.taxon;
      }
      if (this.isNotEmpty(obj.agent)) {
        newObject.agent = obj.agent.id;
        newObject.agent__agent = obj.agent.agent;
      }
      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }
      if (this.isNotEmpty(obj.type)) {
        newObject.type = obj.type.id;
        newObject.type__value = obj.type.value;
        newObject.type__value_en = obj.type.value_en;
      }
      if (this.isNotEmpty(obj.rock)) {
        newObject.rock = obj.rock.id;
        newObject.rock__name = obj.rock.name;
        newObject.rock__name_en = obj.rock.name_en;
      }
      if (this.isNotEmpty(obj.unit)) {
        newObject.unit = obj.unit.id;
        newObject.unit__value = obj.unit.value;
        newObject.unit__value_en = obj.unit.value_en;
      }
      if (this.isNotEmpty(obj.original_filename)) {
        newObject.attachment = obj.attachment.id;
        newObject.original_filename = obj.attachment.original_filename;
      }
      if (this.isNotEmpty(obj.storage)) {
        newObject.storage = obj.storage.id;
        newObject.storage__location = obj.storage.location;
      }
      if (this.isNotEmpty(obj.analysis_method)) {
        newObject.analysis_method = obj.analysis_method.id;
        newObject.analysis_method__analysis_method =
          obj.analysis_method.analysis_method;
        newObject.analysis_method__method_en = obj.analysis_method.method_en;
      }

      return newObject;
    },

    loadRelatedData(object) {
      let query;

      if (object === "specimen_identification") {
        query = fetchSpecimenIdentifications(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_identification
        );
      } else if (object === "specimen_identification_geology") {
        query = fetchSpecimenIdentificationGeologies(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_identification_geology
        );
      } else if (object === "specimen_reference") {
        query = fetchSpecimenReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_reference
        );
      } else if (object === "specimen_description") {
        query = fetchSpecimenDescriptions(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_description
        );
      } else if (object === "attachment") {
        query = fetchSpecimenAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment
        );
      } else if (object === "specimen_location") {
        query = fetchSpecimenLocations(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_location
        );
      } else if (object === "specimen_history") {
        query = fetchSpecimenHistory(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_history
        );
      } else if (object === "analysis") {
        query = fetchSpecimenAnalyses(
          this.$route.params.id,
          this.relatedData.searchParameters.analysis
        );
      }

      return new Promise(resolve => {
        query.then(response => {
          this.relatedData[object] = this.handleResponse(response);
          this.relatedData.count[object] = response.body.count;
          resolve(true);
        });
      });
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.specimen = this.specimen.id;

      // Todo: Use foreach because DRY basically

      if (this.isNotEmpty(uploadableObject.taxon)) {
        uploadableObject.taxon = uploadableObject.taxon.id
          ? uploadableObject.taxon.id
          : uploadableObject.taxon;
      }
      if (this.isNotEmpty(uploadableObject.agent)) {
        uploadableObject.agent = uploadableObject.agent.id
          ? uploadableObject.agent.id
          : uploadableObject.agent;
      }
      if (this.isNotEmpty(uploadableObject.reference)) {
        uploadableObject.reference = uploadableObject.reference.id
          ? uploadableObject.reference.id
          : uploadableObject.reference;
      }
      if (this.isNotEmpty(uploadableObject.date_identified)) {
        uploadableObject.date_identified = this.formatDateForUpload(
          uploadableObject.date_identified
        );
      }
      if (this.isNotEmpty(uploadableObject.type)) {
        uploadableObject.type = uploadableObject.type.id
          ? uploadableObject.type.id
          : uploadableObject.type;
      }
      if (this.isNotEmpty(uploadableObject.rock)) {
        uploadableObject.rock = uploadableObject.rock.id
          ? uploadableObject.rock.id
          : uploadableObject.rock;
      }
      if (this.isNotEmpty(uploadableObject.unit)) {
        uploadableObject.unit = uploadableObject.unit.id
          ? uploadableObject.unit.id
          : uploadableObject.unit;
      }
      if (this.isNotEmpty(uploadableObject.date)) {
        uploadableObject.date = this.formatDateForUpload(uploadableObject.date);
      }
      if (this.isNotEmpty(uploadableObject.date_end)) {
        uploadableObject.date_end = this.formatDateForUpload(
          uploadableObject.date_end
        );
      }
      if (this.isNotEmpty(uploadableObject.attachment)) {
        uploadableObject.attachment = uploadableObject.attachment.id
          ? uploadableObject.attachment.id
          : uploadableObject.attachment;
      }
      if (this.isNotEmpty(uploadableObject.storage)) {
        uploadableObject.storage = uploadableObject.storage.id
          ? uploadableObject.storage.id
          : uploadableObject.storage;
      }
      if (this.isNotEmpty(uploadableObject.analysis_method)) {
        uploadableObject.analysis_method = uploadableObject.analysis_method.id
          ? uploadableObject.analysis_method.id
          : uploadableObject.analysis_method;
      }

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fetchList(localStorageData) {
      let params =
        this.isNotEmpty(localStorageData) &&
        localStorageData !== "fallbackValue" &&
        localStorageData !== "[object Object]"
          ? localStorageData
          : this.searchParameters;
      return new Promise(resolve => {
        resolve(fetchSpecimens(params, this.databaseId));
      });
    },

    setDefaultSearchParameters() {
      return {
        idSpecimen: null,
        collNumber: null,
        fossil: null,
        mineralRock: null,
        locality: null,
        stratigraphy: null,
        agent_collected: null,
        storage: null,
        selectionId: null,
        selection: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}

.related-tabs >>> .related-table > thead {
  color: #546e7a;
}
.active-tab-color {
  color: #000000;
}
</style>
