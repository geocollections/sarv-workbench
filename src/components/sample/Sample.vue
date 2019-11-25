<template>
  <sample-wrapper :simple-view="isSimpleView">
    <template slot="loader">
      <spinner
        v-show="sendingData"
        class="loading-overlay"
        size="massive"
        :message="
          $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
        "
      ></spinner>
    </template>

    <template slot="switch">
      <v-row>
        <v-col>
          <v-switch
            class="vuetify-switch mt-0"
            inset
            v-model="isSimpleView"
            :label="
              isSimpleView ? $t('sample.simpleForm') : $t('sample.basicForm')
            "
            hide-details
            :color="bodyActiveColor"
          ></v-switch>
        </v-col>

        <v-col class="text-right">
          <v-btn
            dark
            :color="bodyActiveColor"
            :to="{
              name: 'Analysis add',
              params: { sample: { id: sample.number, number: sample.number } }
            }"
          >
            <v-icon left small>fas fa-chart-pie</v-icon>
            {{ this.$t("sample.addAnalysis") }}
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template slot="basic-form">
      <!-- GENERAL INFO -->
      <v-card
        class="mt-2"
        id="block-info"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div class="card-title--clickable" @click="block.info = !block.info">
            <span :class="validate('sample') ? 'green--text' : 'red--text'">{{
              $t("sample.generalInfo")
            }}</span>
            <v-icon
              right
              :class="validate('sample') ? 'green--text' : 'red--text'"
              >fas fa-project-diagram</v-icon
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.info = !block.info"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.info ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.info" class="px-1 pt-1 pb-2">
            <!-- NUMBERS -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`number`">{{ $t("sample.number") }}:</label>
                <b-form-input
                  size="sm"
                  id="number"
                  v-model="sample.number"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`number_additional`"
                  >{{ $t("sample.number_additional") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="number_additional"
                  v-model="sample.number_additional"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`number_field`"
                  >{{ $t("sample.number_field") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="number_field"
                  v-model="sample.number_field"
                  type="text"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- SAMPLE PURPOSE, TYPE and SERIES -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`sample_purpose`"
                  >{{ $t("sample.sample_purpose") }}:</label
                >
                <vue-multiselect
                  v-model="sample.sample_purpose"
                  id="type"
                  :options="autocomplete.purpose"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`sample_type`"
                  >{{ $t("sample.sample_type") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="sample_type"
                  v-model="sample.sample_type"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`series`">{{ $t("sample.series") }}:</label>
                <vue-multiselect
                  v-model="sample.series"
                  id="series"
                  label="name"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.series"
                  :options="autocomplete.series"
                  @search-change="autocompleteSampleSeriesSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.name }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>
            </v-row>

            <!-- LOCALITY and DEPTH -->
            <v-row no-gutters>
              <v-col cols="12" md="6" class="px-1">
                <label :for="`locality`">{{ $t("sample.locality") }}:</label>
                <vue-multiselect
                  v-model="sample.locality"
                  id="locality"
                  :label="localityLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.locality"
                  :options="autocomplete.locality"
                  @search-change="autocompleteLocalitySearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }"
                    ><strong> {{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>

              <v-col cols="6" md="3" class="px-1">
                <label :for="`depth`">{{ $t("sample.depth") }}:</label>
                <b-form-input
                  size="sm"
                  id="depth"
                  v-model="sample.depth"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </v-col>

              <v-col cols="6" md="3" class="px-1">
                <label :for="`depth_interval`"
                  >{{ $t("sample.depth_interval") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="depth_interval"
                  v-model="sample.depth_interval"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- LOCALITY FREE, LATITUDE and LONGITUDE  -->
            <v-row no-gutters>
              <v-col cols="12" md="6" class="px-1">
                <label :for="`locality_free`"
                  >{{ $t("sample.locality_free") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="locality_free"
                  v-model="sample.locality_free"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="6" md="3" class="px-1">
                <label :for="`latitude`">Lat:</label>
                <b-form-input
                  size="sm"
                  id="latitude"
                  v-model="sample.latitude1"
                  type="number"
                ></b-form-input>
              </v-col>

              <v-col cols="6" md="3" class="px-1">
                <label :for="`longitude`">Long:</label>
                <b-form-input
                  size="sm"
                  id="longitude"
                  v-model="sample.longitude1"
                  type="number"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY, STRATIGRAPHY FREE and STRATIGRAPHY_BED -->
            <v-row no-gutters>
              <v-col cols="12" md="3" class="px-1">
                <label :for="`stratigraphy`"
                  >{{ $t("sample.stratigraphy") }}:</label
                >
                <vue-multiselect
                  v-model="sample.stratigraphy"
                  id="stratigraphy"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.stratigraphy"
                  :options="autocomplete.stratigraphy"
                  @search-change="autocompleteStratigraphySearch"
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
                  >{{ $t("sample.lithostratigraphy") }}:</label
                >
                <vue-multiselect
                  v-model="sample.lithostratigraphy"
                  id="lithostratigraphy"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.lithostratigraphy"
                  :options="autocomplete.lithostratigraphy"
                  @search-change="autocompleteLithostratigraphySearch"
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
                  >{{ $t("sample.stratigraphy_free") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="stratigraphy_free"
                  v-model="sample.stratigraphy_free"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="3" class="px-1">
                <label :for="`stratigraphy_bed`"
                  >{{ $t("sample.stratigraphy_bed") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="stratigraphy_bed"
                  v-model="sample.stratigraphy_bed"
                  type="text"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- AGENT COLLECTED, AGENT COLLECTED FREE, DATE COLLECTED and DATE COLLECTED FREE -->
            <v-row no-gutters>
              <v-col cols="12" md="3" class="px-1">
                <label :for="`agent_collected`"
                  >{{ $t("sample.agent_collected") }}:</label
                >
                <vue-multiselect
                  v-model="sample.agent_collected"
                  id="agent_collected"
                  label="agent"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.agent"
                  :options="autocomplete.agent"
                  @search-change="autocompleteAgentSearch"
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
                  >{{ $t("sample.agent_collected_free") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="agent_collected_free"
                  v-model="sample.agent_collected_free"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="3" class="px-1">
                <label :for="`date_collected`"
                  >{{ $t("sample.date_collected") }}:</label
                >
                <datepicker
                  id="date_collected"
                  v-model="sample.date_collected"
                  use-utc="true "
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                  input-class="form-control form-control-sm"
                ></datepicker>
              </v-col>

              <v-col cols="12" md="3" class="px-1">
                <label :for="`date_collected_free`"
                  >{{ $t("sample.date_collected_free") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="date_collected_free"
                  v-model="sample.date_collected_free"
                  type="text"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- CLASSIFICATION ROCK, ROCK and ROCK EN -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`classification_rock`"
                  >{{ $t("sample.classification_rock") }}:</label
                >
                <vue-multiselect
                  v-model="sample.classification_rock"
                  id="classification_rock"
                  :label="nameLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.rock"
                  :options="autocomplete.rock"
                  @search-change="autocompleteRockSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[nameLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`rock`">{{ $t("sample.rock") }}:</label>
                <b-form-input
                  size="sm"
                  id="rock"
                  v-model="sample.rock"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`rock_en`">{{ $t("sample.rock_en") }}:</label>
                <b-form-input
                  size="sm"
                  id="rock_en"
                  v-model="sample.rock_en"
                  type="text"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- FOSSILS -->
            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <label :for="`fossils`">{{ $t("sample.fossils") }}:</label>
                <b-form-input
                  size="sm"
                  id="fossils"
                  v-model="sample.fossils"
                  type="text"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- MASS, STORAGE and OWNER -->
            <v-row no-gutters>
              <v-col cols="12" md="3" class="px-1">
                <label :for="`mass`">{{ $t("sample.mass") }}:</label>
                <b-form-input
                  size="sm"
                  id="mass"
                  v-model="sample.mass"
                  type="number"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="3" class="px-1">
                <label :for="`storage`">{{ $t("sample.storage") }}:</label>
                <vue-multiselect
                  v-model="sample.storage"
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
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.location }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>

              <v-col cols="12" md="3" class="px-1">
                <label :for="`additional_storage`"
                  >{{ $t("sample.storage_additional") }}:</label
                >
                <vue-multiselect
                  v-model="sample.storage_additional"
                  id="storage_additional"
                  label="location"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.additional_storage"
                  :options="autocomplete.storage_additional"
                  @search-change="autocompleteAdditionalStorageSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.location }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>

              <v-col cols="12" md="3" class="px-1">
                <label :for="`owner`">{{ $t("sample.owner") }}:</label>
                <vue-multiselect
                  v-model="sample.owner"
                  id="owner"
                  label="agent"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.owner"
                  :options="autocomplete.agent"
                  @search-change="autocompleteOwnerSearch"
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
            </v-row>
          </div>
        </transition>
      </v-card>

      <!-- RELATIONS -->
      <v-card
        class="mt-2"
        id="block-details"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.relatedInfo = !block.relatedInfo"
          >
            <span>{{ $t("sample.relatedInfo") }}</span>
            <v-icon right>fas fa-project-diagram</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.relatedInfo = !block.relatedInfo"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.relatedInfo ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.relatedInfo" class="px-1 pt-1 pb-2">
            <!-- PARENT SAMPLE, PARENT SPECIMEN and SITE -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`parent_sample`"
                  >{{ $t("sample.parent_sample") }}:</label
                >
                <vue-multiselect
                  v-model="sample.parent_sample"
                  id="parent_sample"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`parent_specimen`"
                  >{{ $t("sample.parent_specimen") }}:</label
                >
                <vue-multiselect
                  v-model="sample.parent_specimen"
                  id="parent_specimen"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`site`">{{ $t("sample.parent_site") }}:</label>
                <vue-multiselect
                  v-model="sample.site"
                  id="site"
                  :custom-label="siteLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.site"
                  :options="autocomplete.site"
                  @search-change="autocompleteSiteSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ siteLabel(option) }}</strong>
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

      <!-- DESCRIPTION -->
      <v-card
        class="mt-2"
        id="block-description"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.description = !block.description"
          >
            <span>{{ $t("sample.description") }}</span>
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
            <!-- REMARKS_LOCATION-->
            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <label :for="`remarks_location`"
                  >{{ $t("locality.remarks") }}:</label
                >
                <b-form-textarea
                  id="remarks_location"
                  v-model="sample.remarks"
                  type="text"
                  size="sm"
                  :rows="1"
                  :max-rows="20"
                ></b-form-textarea>
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>
    </template>

    <template slot="simplified-form">
      <!-- GENERAL INFO SIMPLE -->
      <v-card
        class="mt-2"
        id="block-info"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div class="card-title--clickable" @click="block.info = !block.info">
            <span :class="validate('sample') ? 'green--text' : 'red--text'">{{
              $t("sample.generalInfo")
            }}</span>
            <v-icon
              right
              :class="validate('sample') ? 'green--text' : 'red--text'"
              >fas fa-project-diagram</v-icon
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.info = !block.info"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.info ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.info" class="px-1 pt-1 pb-2">
            <!-- NUMBER, NUMBER_FIELD and SAMPLE_PURPOSE -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`number`">{{ $t("sample.number") }}:</label>
                <b-form-input
                  size="sm"
                  id="number"
                  v-model="sample.number"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`number_field`"
                  >{{ $t("sample.number_field") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="number_field"
                  v-model="sample.number_field"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`sample_purpose`"
                  >{{ $t("sample.sample_purpose") }}:</label
                >
                <vue-multiselect
                  v-model="sample.sample_purpose"
                  id="type"
                  :options="autocomplete.purpose"
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

            <!-- SERIES, LOCALITY, DEPTH and DEPTH INTERVAL -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`series`">{{ $t("sample.series") }}:</label>
                <vue-multiselect
                  v-model="sample.series"
                  id="series"
                  label="name"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.series"
                  :options="autocomplete.series"
                  @search-change="autocompleteSampleSeriesSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.name }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`locality`">{{ $t("sample.locality") }}:</label>
                <vue-multiselect
                  v-model="sample.locality"
                  id="locality"
                  :label="localityLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.locality"
                  :options="autocomplete.locality"
                  @search-change="autocompleteLocalitySearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }"
                    ><strong> {{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>

              <v-col cols="6" md="2" class="px-1">
                <label :for="`depth`">{{ $t("sample.depth") }}:</label>
                <b-form-input
                  size="sm"
                  id="depth"
                  v-model="sample.depth"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </v-col>

              <v-col cols="6" md="2" class="px-1">
                <label :for="`depth_interval`"
                  >{{ $t("sample.depth_interval") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="depth_interval"
                  v-model="sample.depth_interval"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY and STRATIGRAPHY_FREE -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`stratigraphy`"
                  >{{ $t("sample.stratigraphy") }}:</label
                >
                <vue-multiselect
                  v-model="sample.stratigraphy"
                  id="stratigraphy"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.stratigraphy"
                  :options="autocomplete.stratigraphy"
                  @search-change="autocompleteStratigraphySearch"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`lithostratigraphy`"
                  >{{ $t("sample.lithostratigraphy") }}:</label
                >
                <vue-multiselect
                  v-model="sample.lithostratigraphy"
                  id="lithostratigraphy"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.lithostratigraphy"
                  :options="autocomplete.lithostratigraphy"
                  @search-change="autocompleteLithostratigraphySearch"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`stratigraphy_free`"
                  >{{ $t("sample.stratigraphy_free") }}:</label
                >
                <b-form-input
                  size="sm"
                  id="stratigraphy_free"
                  v-model="sample.stratigraphy_free"
                  type="text"
                ></b-form-input>
              </v-col>
            </v-row>

            <!-- AGENT_COLLECTED, DATE_COLLECTED and OWNER -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`agent_collected`"
                  >{{ $t("sample.agent_collected") }}:</label
                >
                <vue-multiselect
                  v-model="sample.agent_collected"
                  id="agent_collected"
                  label="agent"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.agent"
                  :options="autocomplete.agent"
                  @search-change="autocompleteAgentSearch"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`date_collected`"
                  >{{ $t("sample.date_collected") }}:</label
                >
                <datepicker
                  id="date_collected"
                  v-model="sample.date_collected"
                  use-utc="true "
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                  input-class="form-control form-control-sm"
                ></datepicker>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`owner`">{{ $t("sample.owner") }}:</label>
                <vue-multiselect
                  v-model="sample.owner"
                  id="owner"
                  label="agent"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.owner"
                  :options="autocomplete.agent"
                  @search-change="autocompleteOwnerSearch"
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
            </v-row>

            <!-- CLASSIFICATION_ROCK, ROCK and FOSSILS -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`classification_rock`"
                  >{{ $t("sample.classification_rock") }}:</label
                >
                <vue-multiselect
                  v-model="sample.classification_rock"
                  id="classification_rock"
                  :label="nameLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.rock"
                  :options="autocomplete.rock"
                  @search-change="autocompleteRockSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[nameLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`rock`">{{ $t("sample.rock") }}:</label>
                <b-form-input
                  size="sm"
                  id="rock"
                  v-model="sample.rock"
                  type="text"
                ></b-form-input>
              </v-col>

              <v-col cols="12" md="4" class="px-1">
                <label :for="`fossils`">{{ $t("sample.fossils") }}:</label>
                <b-form-input
                  size="sm"
                  id="fossils"
                  v-model="sample.fossils"
                  type="text"
                ></b-form-input>
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>

      <!-- RELATIONS -->
      <v-card
        class="mt-2"
        id="block-details"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.relatedInfo = !block.relatedInfo"
          >
            <span>{{ $t("sample.relatedInfo") }}</span>
            <v-icon right>fas fa-project-diagram</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.relatedInfo = !block.relatedInfo"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.relatedInfo ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.relatedInfo" class="px-1 pt-1 pb-2">
            <!-- PARENT SAMPLE, PARENT SPECIMEN and SITE -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="px-1">
                <label :for="`parent_sample`"
                  >{{ $t("sample.parent_sample") }}:</label
                >
                <vue-multiselect
                  v-model="sample.parent_sample"
                  id="parent_sample"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`parent_specimen`"
                  >{{ $t("sample.parent_specimen") }}:</label
                >
                <vue-multiselect
                  v-model="sample.parent_specimen"
                  id="parent_specimen"
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

              <v-col cols="12" md="4" class="px-1">
                <label :for="`site`">{{ $t("sample.parent_site") }}:</label>
                <vue-multiselect
                  v-model="sample.site"
                  id="site"
                  :custom-label="siteLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.site"
                  :options="autocomplete.site"
                  @search-change="autocompleteSiteSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ siteLabel(option) }}</strong>
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

      <!-- DESCRIPTION -->
      <v-card
        class="mt-2"
        id="block-description"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.description = !block.description"
          >
            <span>{{ $t("sample.description") }}</span>
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
            <!-- REMARKS_LOCATION-->
            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <label :for="`remarks_location`"
                  >{{ $t("locality.remarks") }}:</label
                >
                <b-form-textarea
                  id="remarks_location"
                  v-model="sample.remarks"
                  type="text"
                  size="sm"
                  :rows="1"
                  :max-rows="20"
                ></b-form-textarea>
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>
    </template>

    <template slot="privacy">
      <v-row class="my-3">
        <v-col>
          <!-- IS_PRIVATE -->
          <v-checkbox
            v-model="sample.is_private"
            id="is_private"
            :label="$t('specimen.is_private_text')"
            hide-details
            class="mt-0 vuetify-checkbox"
            :color="bodyActiveColor"
          ></v-checkbox>
        </v-col>
      </v-row>
    </template>

    <template slot="related-data">
      <v-card
        class="related-tabs mt-2"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4"
      >
        <v-tabs
          :background-color="bodyColor.split('-')[0] + '-3'"
          show-arrows
          grow
          prev-icon="fas fa-angle-left"
          next-icon="fas fa-angle-right"
          :active-class="bodyColor.split('-')[0] + '-5 black--text'"
          hide-slider
        >
          <v-tab
            v-for="tab in relatedTabs"
            :key="tab.name"
            @click.prevent="setTab(tab.name)"
          >
            <span>{{ $t("sample.relatedTables." + tab.name) }}</span>
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
            :color="bodyColor.split('-')[0] + '-5'"
          >
            <sample-analysis
              :related-data="relatedData"
              :autocomplete="autocomplete"
              :active-tab="activeTab"
              v-on:add-related-data="addRelatedData"
              v-on:set-default="setDefault"
              v-on:edit-row="editRow"
              v-on:remove-row="removeRow"
            />

            <sample-preparation
              :related-data="relatedData"
              :autocomplete="autocomplete"
              :active-tab="activeTab"
              v-on:add-related-data="addRelatedData"
              v-on:set-default="setDefault"
              v-on:edit-row="editRow"
              v-on:remove-row="removeRow"
            />

            <sample-taxon-list
              :related-data="relatedData"
              :autocomplete="autocomplete"
              :active-tab="activeTab"
              v-on:add-related-data="addRelatedData"
              v-on:set-default="setDefault"
              v-on:edit-row="editRow"
              v-on:remove-row="removeRow"
            />

            <sample-attachment
              :related-data="relatedData"
              :autocomplete="autocomplete"
              :active-tab="activeTab"
              v-on:add-related-data="addRelatedData"
              v-on:set-default="setDefault"
              v-on:edit-row="editRow"
              v-on:remove-row="removeRow"
            />

            <sample-reference
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
    </template>
  </sample-wrapper>
</template>

<script>
import Spinner from "vue-simple-spinner";
import {
  fetchSample,
  fetchSamplePurpose,
  fetchLSampleAttachment,
  fetchSampleReference,
  fetchSampleAnalysis,
  fetchAnalysisMethod,
  fetchFossilGroup,
  fetchSamplePreparation,
  fetchTaxonList,
  fetchLatestSampleInSite
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import Datepicker from "vue2-datepicker";
import formManipulation from "../../mixins/formManipulation";
import copyForm from "../../mixins/copyForm";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import SampleReference from "./relatedTables/SampleReference";
import SampleAttachment from "./relatedTables/SampleAttachment";
import SampleAnalysis from "./relatedTables/SampleAnalysis";
import SamplePreparation from "./relatedTables/SamplePreparation";
import SampleTaxonList from "./relatedTables/SampleTaxonList";
import SampleWrapper from "./SampleWrapper";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";

export default {
  name: "Sample",

  components: {
    SampleWrapper,
    SampleTaxonList,
    SamplePreparation,
    SampleAnalysis,
    SampleAttachment,
    SampleReference,
    Datepicker,
    Spinner
  },

  props: {
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

  mixins: [formManipulation, copyForm, autocompleteMixin, formSectionsMixin],

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
        searchHistory: "sampleSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_SAMPLES",
        title: "header.samples",
        object: "sample",
        field: "number",
        agent: this.currentUser,
        databaseId: this.databaseId,
        block: this.block
      });
    }

    // SIMPLE VIEW
    this.isSimpleView = this.$localStorage.get("sampleView", false);

    if (this.$route.query.site)
      this.addSiteDataToSampleObject(JSON.parse(this.$route.query.site));
    else if (this.$route.params.site)
      this.addSiteDataToSampleObject(this.$route.params.site);

    this.loadFullInfo();
  },

  beforeDestroy() {
    this.$root.$off(
      "add-new-sample-from-modal",
      this.handleUserChoiceFromModal
    );
  },

  beforeRouteUpdate(to, from, next) {
    this.$localStorage.set("sampleView", this.isSimpleView);
    next();
  },

  beforeRouteLeave(to, from, next) {
    this.$localStorage.set("sampleView", this.isSimpleView);
    if (this.$route.meta.isEdit) {
      this.$store.dispatch("setActiveSample", this.sample);
    }
    next();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
        this.isSimpleView = this.$localStorage.get("sampleView", false);
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
    ...mapState(["currentUser", "databaseId"]),

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
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
          { name: "analysis", iconClass: "far fa-chart-bar" },
          { name: "preparation", iconClass: "fas fa-vial" },
          { name: "taxon_list", iconClass: "fas fa-list" },
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "sample_reference", iconClass: "fas fa-book" }
        ],
        searchHistory: "sampleSearchHistory",
        activeTab: "analysis",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "number",
          "number_additional",
          "number_field",
          "series",
          "sample_purpose",
          "sample_type",
          "parent_sample",
          "parent_specimen",
          "depth",
          "depth_interval",
          "latitude1",
          "longitude1",
          "stratigraphy",
          "lithostratigraphy",
          "stratigraphy_free",
          "stratigraphy_bed",
          "agent_collected",
          "agent_collected_free",
          "date_collected",
          "date_collected_free",
          "classification_rock",
          "rock",
          "rock_en",
          "fossils",
          "mass",
          "storage",
          "storage_additional",
          "owner",
          "palaeontology",
          "analysis",
          "locality",
          "locality_free",
          "remarks",
          "is_private",
          "site"
        ],
        simplifiedFormCopyFields: [
          "number",
          "number_field",
          "sample_purpose",
          "series",
          "locality",
          "classification_rock",
          "rock",
          "site",
          "agent_collected",
          "date_collected",
          "owner",
          "remarks",
          "is_private"
        ],
        autocomplete: {
          loaders: {
            series: false,
            sample: false,
            specimen: false,
            locality: false,
            stratigraphy: false,
            lithostratigraphy: false,
            agent: false,
            rock: false,
            storage: false,
            additional_storage: false,
            owner: false,
            reference: false,
            attachment: false,
            analysis_method: false,
            fossil_group: false,
            analysis: false,
            taxon: false,
            preparation: false,
            site: false,
            purpose: false
          },
          series: [],
          purpose: [],
          sample: [],
          specimen: [],
          locality: [],
          stratigraphy: [],
          lithostratigraphy: [],
          agent: [],
          rock: [],
          storage: [],
          storage_additional: [],
          owner: [],
          reference: [],
          attachment: [],
          analysis_method: [],
          fossil_group: [],
          analysis: [],
          taxon: [],
          preparation: [],
          sampleAnalysis: [],
          samplePreparation: [],
          site: []
        },
        requiredFields: [],
        sample: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: { info: true, relatedInfo: true, description: true },
        isSimpleView: false,
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
        this.$emit("set-object", "sample");

        fetchSample(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.sample = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.sample);

            this.removeUnnecessaryFields(this.sample, this.copyFields);
            this.$emit("data-loaded", this.sample);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => {
          this.loadRelatedData(tab.name);
        });

        this.$on("tab-changed", this.setTab);

        this.$emit("related-data-info", this.relatedTabs.map(tab => tab.name));
      }

      if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
      else this.setTab("analysis");

      this.$root.$on(
        "add-new-sample-from-modal",
        this.handleUserChoiceFromModal
      );
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchSamplePurpose().then(
          response =>
            (this.autocomplete.purpose = this.handleResponse(response))
        );
      }

      if (relatedDataAutocompleteFields) {
        fetchAnalysisMethod().then(
          response =>
            (this.autocomplete.analysis_method = this.handleResponse(response))
        );
        fetchFossilGroup().then(
          response =>
            (this.autocomplete.fossil_group = this.handleResponse(response))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        sample_reference: [],
        attachment_link: [],
        analysis: [],
        preparation: [],
        taxon_list: [],
        copyFields: {
          sample_reference: ["reference", "remarks"],
          attachment_link: ["attachment"],
          analysis: [
            "analysis_method",
            "method_details",
            "mass",
            "date",
            "date_end",
            "date_free",
            "agent",
            "remarks",
            "location",
            "is_private"
          ],
          preparation: [
            "preparation_number",
            "taxon",
            "storage",
            "remarks",
            "analysis",
            "is_private"
          ],
          taxon_list: [
            "taxon",
            "name",
            "frequency",
            "agent_identified",
            "date_identified",
            "extra",
            "preparation",
            "is_private",
            "remarks"
          ]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          sample_reference: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          attachment_link: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          preparation: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_list: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          sample_reference: 0,
          attachment_link: 0,
          analysis: 0,
          preparation: 0,
          taxon_list: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        sample_reference: {},
        attachment_link: {},
        analysis: {},
        preparation: {},
        taxon_list: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.latitude1))
        uploadableObject.latitude1 = objectToUpload.latitude1.toFixed(6);
      if (this.isNotEmpty(objectToUpload.longitude1))
        uploadableObject.longitude1 = objectToUpload.longitude1.toFixed(6);
      if (this.isNotEmpty(objectToUpload.date_collected))
        uploadableObject.date_collected = this.formatDateForUpload(
          objectToUpload.date_collected
        );
      if (this.isNotEmpty(objectToUpload.depth))
        uploadableObject.depth = parseFloat(objectToUpload.depth);
      if (this.isNotEmpty(objectToUpload.depth_interval))
        uploadableObject.depth_interval = parseFloat(
          objectToUpload.depth_interval
        );

      //autocomplete fields
      if (this.isNotEmpty(objectToUpload.series))
        uploadableObject.series = objectToUpload.series.id;
      if (this.isNotEmpty(objectToUpload.sample_purpose))
        uploadableObject.sample_purpose = objectToUpload.sample_purpose.id;
      if (this.isNotEmpty(objectToUpload.parent_sample))
        uploadableObject.parent_sample = objectToUpload.parent_sample.id;
      if (this.isNotEmpty(objectToUpload.parent_specimen))
        uploadableObject.parent_specimen = objectToUpload.parent_specimen.id;
      if (this.isNotEmpty(objectToUpload.locality))
        uploadableObject.locality = objectToUpload.locality.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy))
        uploadableObject.stratigraphy = objectToUpload.stratigraphy.id;
      if (this.isNotEmpty(objectToUpload.lithostratigraphy))
        uploadableObject.lithostratigraphy =
          objectToUpload.lithostratigraphy.id;
      if (this.isNotEmpty(objectToUpload.agent_collected))
        uploadableObject.agent_collected = objectToUpload.agent_collected.id;
      if (this.isNotEmpty(objectToUpload.classification_rock))
        uploadableObject.classification_rock =
          objectToUpload.classification_rock.id;
      if (this.isNotEmpty(objectToUpload.owner))
        uploadableObject.owner = objectToUpload.owner.id;
      if (this.isNotEmpty(objectToUpload.storage))
        uploadableObject.storage = objectToUpload.storage.id;
      if (this.isNotEmpty(objectToUpload.storage_additional))
        uploadableObject.storage_additional =
          objectToUpload.storage_additional.id;
      if (this.isNotEmpty(objectToUpload.site))
        uploadableObject.site = objectToUpload.site.id;

      if (this.isNotEmpty(this.databaseId))
        uploadableObject.database = this.databaseId;

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
      this.sample.series = { name: obj.series__name, id: obj.series_id };
      this.sample.sample_purpose = {
        value: obj.sample_purpose__value,
        value_en: obj.sample_purpose__value_en,
        id: obj.sample_purpose__id
      };
      this.sample.parent_sample = {
        number: obj.parent_sample__number,
        id: obj.parent_sample
      };
      this.sample.parent_specimen = {
        specimen_id: obj.parent_specimen__specimen_id,
        id: obj.parent_specimen
      };
      this.sample.locality = {
        locality: obj.locality__locality,
        locality_en: obj.locality__locality_en,
        id: obj.locality__id
      };
      this.sample.stratigraphy = {
        stratigraphy: obj.stratigraphy__stratigraphy,
        stratigraphy_en: obj.stratigraphy__stratigraphy_en,
        id: obj.stratigraphy__id
      };
      this.sample.lithostratigraphy = {
        stratigraphy: obj.lithostratigraphy__stratigraphy,
        stratigraphy_en: obj.lithostratigraphy__stratigraphy_en,
        id: obj.lithostratigraphy_id
      };
      this.sample.agent_collected = {
        agent: obj.agent_collected__agent,
        id: obj.agent_collected__id
      };
      this.sample.classification_rock = {
        name: obj.classification_rock__name,
        name_en: obj.classification_rock__name_en,
        id: obj.classification_rock__id
      };
      this.sample.owner = { agent: obj.owner__agent, id: obj.owner__id };
      this.sample.storage = {
        location: obj.storage__location,
        id: obj.storage
      };
      this.sample.storage_additional = {
        location: obj.storage_additional__location,
        id: obj.storage_additional
      };
      this.sample.site = { id: obj.site, name: obj.site__name };
    },

    fillRelatedDataAutocompleteFields(obj) {
      obj.analysis_method = {
        analysis_method: obj.analysis_method__analysis_method,
        method_en: obj.analysis_method__method_en,
        id: obj.analysis_method
      };
      obj.agent = { agent: obj.agent__agent, id: obj.agent };
      obj.fossil_group = { taxon: obj.taxon__taxon, id: obj.taxon };
      obj.storage = { location: obj.storage__location, id: obj.storage };
      obj.analysis = { id: obj.analysis };
      obj.taxon = { taxon: obj.taxon__taxon, id: obj.taxon };
      obj.agent_identified = {
        agent: obj.agent_identified__agent,
        id: obj.agent_identified
      };
      obj.preparation = {
        id: obj.preparation,
        preparation_number: obj.preparation_number
      };
      obj.reference = {
        reference: obj.reference__reference,
        id: obj.reference
      };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.analysis_method)) {
        newObject.analysis_method = obj.analysis_method.id;
        newObject.analysis_method__analysis_method =
          obj.analysis_method.analysis_method;
        newObject.analysis_method__method_en = obj.analysis_method.method_en;
      }
      if (this.isNotEmpty(obj.agent)) {
        newObject.agent = obj.agent.id;
        newObject.agent__agent = obj.agent.agent;
      }
      if (this.isNotEmpty(obj.fossil_group)) {
        newObject.fossil_group = obj.fossil_group.id;
        newObject.fossil_group__taxon = obj.fossil_group.taxon;
      }
      if (this.isNotEmpty(obj.storage)) {
        newObject.storage = obj.storage.id;
        newObject.storage__location = obj.storage.location;
      }
      if (this.isNotEmpty(obj.analysis)) {
        newObject.analysis = obj.analysis.id;
      }
      if (this.isNotEmpty(obj.taxon)) {
        newObject.taxon = obj.taxon.id;
        newObject.taxon__taxon = obj.taxon.taxon;
      }
      if (this.isNotEmpty(obj.agent_identified)) {
        newObject.agent_identified = obj.agent_identified.id;
        newObject.agent_identified__agent = obj.agent_identified.agent;
      }
      if (this.isNotEmpty(obj.preparation)) {
        newObject.preparation = obj.preparation.id;
        newObject.preparation_number = obj.preparation.preparation_number;
      }
      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }
      if (this.isNotEmpty(obj.attachment)) {
        newObject.attachment = obj.attachment.id;
        newObject.attachment__original_filename =
          obj.attachment.original_filename;
      }

      return newObject;
    },

    loadRelatedData(object) {
      let query;

      if (object === "analysis") {
        query = fetchSampleAnalysis(
          this.$route.params.id,
          this.relatedData.searchParameters.analysis
        );
      } else if (object === "preparation") {
        query = fetchSamplePreparation(
          this.$route.params.id,
          this.relatedData.searchParameters.preparation
        );
      } else if (object === "taxon_list") {
        query = fetchTaxonList(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_list
        );
      } else if (object === "sample_reference") {
        query = fetchSampleReference(
          this.$route.params.id,
          this.relatedData.searchParameters.sample_reference
        );
      } else if (object === "attachment_link") {
        query = fetchLSampleAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
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
      uploadableObject.sample = this.sample.id;

      if (this.isNotEmpty(uploadableObject.attachment))
        uploadableObject.attachment = uploadableObject.attachment.id
          ? uploadableObject.attachment.id
          : uploadableObject.attachment;
      if (this.isNotEmpty(uploadableObject.reference))
        uploadableObject.reference = uploadableObject.reference.id
          ? uploadableObject.reference.id
          : uploadableObject.reference;
      if (this.isNotEmpty(uploadableObject.analysis_method))
        uploadableObject.analysis_method = uploadableObject.analysis_method.id;
      if (this.isNotEmpty(uploadableObject.agent))
        uploadableObject.agent = uploadableObject.agent.id;
      if (this.isNotEmpty(uploadableObject.agent_identified))
        uploadableObject.agent_identified =
          uploadableObject.agent_identified.id;
      if (this.isNotEmpty(uploadableObject.date))
        uploadableObject.date = this.formatDateForUpload(uploadableObject.date);
      if (this.isNotEmpty(uploadableObject.date_end))
        uploadableObject.date_end = this.formatDateForUpload(
          uploadableObject.date_end
        );
      if (this.isNotEmpty(uploadableObject.date_identified))
        uploadableObject.date_identified = this.formatDateForUpload(
          uploadableObject.date_identified
        );
      if (this.isNotEmpty(uploadableObject.taxon))
        uploadableObject.taxon = uploadableObject.taxon.id;
      if (this.isNotEmpty(uploadableObject.storage))
        uploadableObject.storage = uploadableObject.storage.id;
      if (this.isNotEmpty(uploadableObject.analysis))
        uploadableObject.analysis = uploadableObject.analysis.id;
      if (this.isNotEmpty(uploadableObject.preparation))
        uploadableObject.preparation = uploadableObject.preparation.id;

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    setDefaultSearchParameters() {
      return {
        locality: null,
        number: null,
        depth: null,
        stratigraphy: null,
        agent: null,
        storage: null,
        site: null,
        selectionId: null,
        selection: null,
        id: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    handleUserChoiceFromModal(choice) {
      console.log(choice);
      let vm = this;
      if (choice === "SAVE_AND_LEAVE") {
        this.add(false, "sample", true).then(() => {
          vm.$root.$emit("close-new-sample-modal");
        });
      } else if (choice === "SAVE") {
        this.add(true, "sample");
      }
    },
    siteLabel(option) {
      if (option.id === null) return;
      return `id: ${option.id} - ${option.name}`;
    },

    addSiteDataToSampleObject(site) {
      this.sample.locality = site.locality;
      this.sample.site = { id: site.id, name: site.name };
      this.sample.agent_collected = {
        id: this.currentUser.id,
        agent: this.currentUser.user
      };
      this.sample.date_collected = new Date();
      this.sample.owner = {
        id: this.currentUser.id,
        agent: this.currentUser.user
      };

      fetchLatestSampleInSite(site.id).then(response => {
        let sample = this.handleResponse(response)[0];
        this.sample.number = this.calculateNextName(sample.number);
        this.sample.number_field = this.calculateNextName(sample.number_field);
      });
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
</style>
