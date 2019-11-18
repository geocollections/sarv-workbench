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
            color="blue"
          ></v-switch>
        </v-col>

        <v-col class="text-right">
          <v-btn
            dark
            color="blue"
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
      <fieldset class="border-top px-2 mb-2" id="block-info">
        <legend
          class="w-auto my-0"
          :class="{ 'text-primary': !block.info }"
          @click="block.info = !block.info"
        >
          {{ $t("sample.generalInfo") }}
          <i class="fas fa-project-diagram"></i>
        </legend>

        <transition name="fade">
          <div v-if="block.info">
            <!-- NUMBERS -->
            <div class="row">
              <div class="col-md-4">
                <label :for="`number`">{{ $t("sample.number") }}:</label>
                <b-form-input
                  id="number"
                  v-model="sample.number"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-4">
                <label :for="`number_additional`"
                  >{{ $t("sample.number_additional") }}:</label
                >
                <b-form-input
                  id="number_additional"
                  v-model="sample.number_additional"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-4">
                <label :for="`number_field`"
                  >{{ $t("sample.number_field") }}:</label
                >
                <b-form-input
                  id="number_field"
                  v-model="sample.number_field"
                  type="text"
                ></b-form-input>
              </div>
            </div>

            <!-- SAMPLE PURPOSE, TYPE and SERIES -->
            <div class="row">
              <div class="col-md-4">
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
              </div>

              <div class="col-md-4">
                <label :for="`sample_type`"
                  >{{ $t("sample.sample_type") }}:</label
                >
                <b-form-input
                  id="sample_type"
                  v-model="sample.sample_type"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-4">
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
              </div>
            </div>

            <!-- LOCALITY and DEPTH -->
            <div class="row">
              <div class="col-sm-6 mb-2">
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
              </div>

              <div class="col-6 col-sm-3">
                <label :for="`depth`">{{ $t("sample.depth") }}:</label>
                <b-form-input
                  id="depth"
                  v-model="sample.depth"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </div>

              <div class="col-6 col-sm-3">
                <label :for="`depth_interval`"
                  >{{ $t("sample.depth_interval") }}:</label
                >
                <b-form-input
                  id="depth_interval"
                  v-model="sample.depth_interval"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </div>
            </div>

            <!-- LOCALITY FREE, LATITUDE and LONGITUDE  -->
            <div class="row">
              <div class="col-sm-6">
                <label :for="`locality_free`"
                  >{{ $t("sample.locality_free") }}:</label
                >
                <b-form-input
                  id="locality_free"
                  v-model="sample.locality_free"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-6 col-sm-3">
                <label :for="`latitude`">Lat:</label>
                <b-form-input
                  id="latitude"
                  v-model="sample.latitude1"
                  type="number"
                ></b-form-input>
              </div>

              <div class="col-6 col-sm-3">
                <label :for="`longitude`">Long:</label>
                <b-form-input
                  id="longitude"
                  v-model="sample.longitude1"
                  type="number"
                ></b-form-input>
              </div>
            </div>

            <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY, STRATIGRAPHY FREE and STRATIGRAPHY_BED -->
            <div class="row">
              <div class="col-md-3">
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
              </div>

              <div class="col-md-3">
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
              </div>

              <div class="col-md-3">
                <label :for="`stratigraphy_free`"
                  >{{ $t("sample.stratigraphy_free") }}:</label
                >
                <b-form-input
                  id="stratigraphy_free"
                  v-model="sample.stratigraphy_free"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-3">
                <label :for="`stratigraphy_bed`"
                  >{{ $t("sample.stratigraphy_bed") }}:</label
                >
                <b-form-input
                  id="stratigraphy_bed"
                  v-model="sample.stratigraphy_bed"
                  type="text"
                ></b-form-input>
              </div>
            </div>

            <!-- AGENT COLLECTED, AGENT COLLECTED FREE, DATE COLLECTED and DATE COLLECTED FREE -->
            <div class="row">
              <div class="col-md-3">
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
              </div>

              <div class="col-md-3">
                <label :for="`agent_collected_free`"
                  >{{ $t("sample.agent_collected_free") }}:</label
                >
                <b-form-input
                  id="agent_collected_free"
                  v-model="sample.agent_collected_free"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-3">
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
                  input-class="form-control"
                ></datepicker>
              </div>

              <div class="col-md-3">
                <label :for="`date_collected_free`"
                  >{{ $t("sample.date_collected_free") }}:</label
                >
                <b-form-input
                  id="date_collected_free"
                  v-model="sample.date_collected_free"
                  type="text"
                ></b-form-input>
              </div>
            </div>

            <!-- CLASSIFICATION ROCK, ROCK and ROCK EN -->
            <div class="row">
              <div class="col-md-4">
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
              </div>

              <div class="col-md-4">
                <label :for="`rock`">{{ $t("sample.rock") }}:</label>
                <b-form-input
                  id="rock"
                  v-model="sample.rock"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-4">
                <label :for="`rock_en`">{{ $t("sample.rock_en") }}:</label>
                <b-form-input
                  id="rock_en"
                  v-model="sample.rock_en"
                  type="text"
                ></b-form-input>
              </div>
            </div>

            <!-- FOSSILS -->
            <div class="row">
              <div class="col-sm-12">
                <label :for="`fossils`">{{ $t("sample.fossils") }}:</label>
                <b-form-input
                  id="fossils"
                  v-model="sample.fossils"
                  type="text"
                ></b-form-input>
              </div>
            </div>

            <!-- MASS, STORAGE and OWNER -->
            <div class="row">
              <div class="col-md-3">
                <label :for="`mass`">{{ $t("sample.mass") }}:</label>
                <b-form-input
                  id="mass"
                  v-model="sample.mass"
                  type="number"
                ></b-form-input>
              </div>

              <div class="col-md-3">
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
              </div>

              <div class="col-md-3">
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
              </div>

              <div class="col-md-3">
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
              </div>
            </div>
          </div>
        </transition>
      </fieldset>

      <!-- RELATIONS -->
      <fieldset class="border-top px-2 mb-2" id="block-relatedInfo">
        <legend
          class="w-auto my-0"
          :class="{ 'text-primary': !block.relatedInfo }"
          @click="block.relatedInfo = !block.relatedInfo"
        >
          {{ $t("sample.relatedInfo") }}
          <i class="fas fa-project-diagram"></i>
        </legend>

        <transition name="fade">
          <div v-if="block.relatedInfo">
            <!-- PARENT SAMPLE, PARENT SPECIMEN and SITE -->
            <div class="row">
              <div class="col-md-4">
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
              </div>

              <div class="col-md-4">
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
              </div>

              <div class="col-md-4">
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
              </div>
            </div>
          </div>
        </transition>
      </fieldset>

      <!-- DESCRIPTION -->
      <fieldset class="border-top px-2 mb-2" id="block-description">
        <legend
          class="w-auto my-0"
          :class="{ 'text-primary': !block.description }"
          @click="block.description = !block.description"
        >
          {{ $t("sample.description") }}
          <i class="fas fa-pen-fancy"></i>
        </legend>

        <transition name="fade">
          <div v-if="block.description">
            <!-- REMARKS_LOCATION-->
            <div class="row">
              <div class="col-sm-12">
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
              </div>
            </div>
          </div>
        </transition>
      </fieldset>
    </template>

    <template slot="simplified-form">
      <!-- GENERAL INFO SIMPLE -->
      <fieldset class="border-top px-2 mb-2" id="block-info">
        <legend
          class="w-auto my-0"
          :class="{ 'text-primary': !block.info }"
          @click="block.info = !block.info"
        >
          {{ $t("sample.generalInfo") }}
          <i class="fas fa-project-diagram"></i>
        </legend>

        <transition name="fade">
          <div v-if="block.info">
            <!-- NUMBER, NUMBER_FIELD and SAMPLE_PURPOSE -->
            <div class="row">
              <div class="col-md-4">
                <label :for="`number`">{{ $t("sample.number") }}:</label>
                <b-form-input
                  id="number_simple"
                  v-model="sample.number"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-4">
                <label :for="`number_field_simple`"
                  >{{ $t("sample.number_field") }}:</label
                >
                <b-form-input
                  id="number_field_simple"
                  v-model="sample.number_field"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-4">
                <label :for="`sample_purpose_simple`"
                  >{{ $t("sample.sample_purpose") }}:</label
                >
                <vue-multiselect
                  v-model="sample.sample_purpose"
                  id="sample_purpose_simple"
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
              </div>
            </div>

            <!-- SERIES, LOCALITY, DEPTH and DEPTH INTERVAL -->
            <div class="row">
              <div class="col-md-4">
                <label :for="`series_simple`">{{ $t("sample.series") }}:</label>
                <vue-multiselect
                  v-model="sample.series"
                  id="series_simple"
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
              </div>

              <div class="col-md-4">
                <label :for="`locality_simple`"
                  >{{ $t("sample.locality") }}:</label
                >
                <vue-multiselect
                  v-model="sample.locality"
                  id="locality_simple"
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
                    ><strong> {{ option[localityLabel] }}</strong></template
                  >
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </div>

              <div class="col-6 col-md-2">
                <label style="white-space: nowrap;" :for="`depth_simple`"
                  >{{ $t("sample.depth") }}:</label
                >
                <b-form-input
                  id="depth_simple"
                  v-model="sample.depth"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </div>

              <div class="col-6 col-md-2">
                <label
                  style="white-space: nowrap;"
                  :for="`depth_interval_simple`"
                  >{{ $t("sample.depth") }}:</label
                >
                <b-form-input
                  id="depth_interval_simple"
                  v-model="sample.depth_interval"
                  type="number"
                  step="0.01"
                ></b-form-input>
              </div>
            </div>

            <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY and STRATIGRAPHY_FREE -->
            <div class="row">
              <div class="col-md-4">
                <label :for="`stratigraphy_simple`"
                  >{{ $t("sample.stratigraphy") }}:</label
                >
                <vue-multiselect
                  v-model="sample.stratigraphy"
                  id="stratigraphy_simple"
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
              </div>

              <div class="col-md-4">
                <label :for="`stratigraphy_simple`"
                  >{{ $t("sample.lithostratigraphy") }}:</label
                >
                <vue-multiselect
                  v-model="sample.lithostratigraphy"
                  id="lithostratigraphy_simple"
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
              </div>

              <div class="col-md-4">
                <label :for="`stratigraphy_free_simple`"
                  >{{ $t("sample.stratigraphy_free") }}:</label
                >
                <b-form-input
                  id="stratigraphy_free_simple"
                  v-model="sample.stratigraphy_free"
                  type="text"
                ></b-form-input>
              </div>
            </div>

            <!-- AGENT_COLLECTED, DATE_COLLECTED and OWNER -->
            <div class="row">
              <div class="col-md-4">
                <label :for="`agent_collected_simple`"
                  >{{ $t("sample.agent_collected") }}:</label
                >
                <vue-multiselect
                  v-model="sample.agent_collected"
                  id="agent_collected_simple"
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
              </div>

              <div class="col-md-4">
                <label :for="`date_collected_simple`"
                  >{{ $t("sample.date_collected") }}:</label
                >
                <datepicker
                  id="date_collected_simple"
                  v-model="sample.date_collected"
                  use-utc="true "
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                  input-class="form-control"
                ></datepicker>
              </div>

              <div class="col-md-4">
                <label :for="`owner_simple`">{{ $t("sample.owner") }}:</label>
                <vue-multiselect
                  v-model="sample.owner"
                  id="owner_simple"
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
              </div>
            </div>

            <!-- CLASSIFICATION_ROCK, ROCK and FOSSILS -->
            <div class="row">
              <div class="col-md-4">
                <label :for="`classification_rock_simple`"
                  >{{ $t("sample.classification_rock") }}:</label
                >
                <vue-multiselect
                  v-model="sample.classification_rock"
                  id="classification_rock_simple"
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
              </div>

              <div class="col-md-4">
                <label :for="`rock_simple`">{{ $t("sample.rock") }}:</label>
                <b-form-input
                  id="rock_simple"
                  v-model="sample.rock"
                  type="text"
                ></b-form-input>
              </div>

              <div class="col-md-4">
                <label :for="`fossils_simple`"
                  >{{ $t("sample.fossils") }}:</label
                >
                <b-form-input
                  id="fossils_simple"
                  v-model="sample.fossils"
                  type="text"
                ></b-form-input>
              </div>
            </div>
          </div>
        </transition>
      </fieldset>

      <!-- RELATIONS -->
      <fieldset class="border-top px-2 mb-2" id="block-relatedInfo">
        <legend
          class="w-auto my-0"
          :class="{ 'text-primary': !block.relatedInfo }"
          @click="block.relatedInfo = !block.relatedInfo"
        >
          {{ $t("sample.relatedInfo") }}
          <i class="fas fa-project-diagram"></i>
        </legend>

        <transition name="fade">
          <div v-if="block.relatedInfo">
            <!-- PARENT SAMPLE, PARENT SPECIMEN and SITE -->
            <div class="row">
              <div class="col-md-4">
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
              </div>

              <div class="col-md-4">
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
              </div>

              <div class="col-md-4">
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
              </div>
            </div>
          </div>
        </transition>
      </fieldset>

      <!-- DESCRIPTION SIMPLE -->
      <fieldset class="border-top px-2 mb-2" id="block-description">
        <legend
          class="w-auto my-0"
          :class="{ 'text-primary': !block.description }"
          @click="block.description = !block.description"
        >
          {{ $t("sample.description") }}
          <i class="fas fa-pen-fancy"></i>
        </legend>

        <transition name="fade">
          <div v-if="block.description">
            <!-- REMARKS -->
            <div class="row">
              <div class="col-sm-12">
                <b-form-textarea
                  id="remarks"
                  v-model="sample.remarks"
                  type="text"
                  size="sm"
                  :rows="2"
                  :max-rows="20"
                />
              </div>
            </div>
          </div>
        </transition>
      </fieldset>
    </template>

    <template slot="privacy">
      <!-- IS PRIVATE AND MASS-->
      <div class="row mb-3 mt-3">
        <div class="col">
          <!--<b-form-checkbox id="palaeontology" v-model="sample.palaeontology" :value="true" :unchecked-value="false">
            {{ $t('sample.palaeontology') }}
          </b-form-checkbox>

          <b-form-checkbox id="analysis" v-model="sample.analysis" :value="true" :unchecked-value="false">
            {{ $t('sample.analysis') }}
          </b-form-checkbox>-->

          <b-form-checkbox id="is_private" v-model="sample.is_private">
            {{ $t("sample.is_private") }}
          </b-form-checkbox>
        </div>
      </div>
    </template>

    <template slot="related-data">
      <!-- SHOWING RELATED_DATA -->
      <div class="row">
        <div class="col">
          <ul class="nav nav-tabs nav-fill mb-3">
            <li class="nav-item" v-for="tab in relatedTabs" :key="tab.name">
              <a
                href="#"
                @click.prevent="setTab(tab.name)"
                class="nav-link"
                :class="{ active: activeTab === tab.name }"
              >
                <span>{{ $t("sample.relatedTables." + tab.name) }}</span>

                <span>
                  <sup>
                    <b-badge pill variant="light"
                      >{{ relatedData[tab.name].length }}&nbsp;</b-badge
                    >
                  </sup>
                </span>

                <span><i :class="tab.iconClass"></i></span>
              </a>
            </li>
          </ul>

          <div class="row" v-if="$route.meta.isEdit">
            <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">
              <b-form-select
                v-model="relatedData.searchParameters[activeTab].paginateBy"
                class="mb-3"
                size="sm"
              >
                <option :value="10">{{
                  this.$t("main.pagination", { num: "10" })
                }}</option>
                <option :value="25">{{
                  this.$t("main.pagination", { num: "25" })
                }}</option>
                <option :value="50">{{
                  this.$t("main.pagination", { num: "50" })
                }}</option>
                <option :value="100">{{
                  this.$t("main.pagination", { num: "100" })
                }}</option>
                <option :value="250">{{
                  this.$t("main.pagination", { num: "250" })
                }}</option>
                <option :value="500">{{
                  this.$t("main.pagination", { num: "500" })
                }}</option>
                <option :value="1000">{{
                  this.$t("main.pagination", { num: "1000" })
                }}</option>
              </b-form-select>
            </div>

            <div class="col-sm-12 col-md-3 export-center">
              <!-- EXPORT BUTTON? -->
            </div>

            <div
              class="col-sm-12 col-md-6 pagination-center"
              v-if="
                relatedData[activeTab] !== null &&
                  relatedData[activeTab].length > 0
              "
            >
              <b-pagination
                size="sm"
                align="right"
                :limit="5"
                :hide-ellipsis="true"
                :total-rows="relatedData.count[activeTab]"
                v-model="relatedData.searchParameters[activeTab].page"
                :per-page="relatedData.searchParameters[activeTab].paginateBy"
              >
              </b-pagination>
            </div>
          </div>

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
        </div>
      </div>
    </template>

    <template slot="buttons">
      <div class="row mt-3 mb-3">
        <div class="col">
          <span>
            <button
              class="btn btn-primary mb-2"
              @click="$emit('save-as-new')"
              v-if="$route.meta.isCopyFormShown"
            >
              {{ $t("add.saveAsNew") }}
            </button>
          </span>
        </div>
      </div>
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

  updated() {
    this.$localStorage.set("activeSample", this.$data.sample.id);
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
        isSimpleView: false
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
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}
</style>
