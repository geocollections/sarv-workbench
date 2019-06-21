<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-info">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('locality.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- LOCALITY and LOCALITY ENG -->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`locality`">{{ $t('locality.locality') }}:</label>
              <b-form-input id="locality" :state="isDefinedAndNotNull(locality.locality)" v-model="locality.locality"
                            type="text"></b-form-input>
            </div>

            <div class="col-sm-6">
              <label :for="`locality_en`">{{ $t('locality.locality_en') }}:</label>
              <b-form-input id="locality_en" v-model="locality.locality_en" type="text"></b-form-input>
            </div>
          </div>

          <!-- NUMBER, OTHER NUMBER, LOCALITY TYPE and LOCALITY BELONGS-->
          <div class="row">
            <div class="col-md-3">
              <label :for="`number`">{{ $t('locality.number') }}:</label>
              <b-form-input id="number" v-model="locality.number" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`code`">{{ $t('locality.code') }}:</label>
              <b-form-input id="code" v-model="locality.code" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`type`">{{ $t('locality.type') }}:</label>
              <vue-multiselect v-model="locality.type" v-if="isDefinedAndNotEmpty(autocomplete.localityTypes)"
                               id="type"
                               :options="autocomplete.localityTypes"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`parent`">{{ $t('locality.parent') }}:</label>
              <vue-multiselect class="align-middle" v-model="locality.parent" deselect-label="Can't remove this value"
                               :label="localityLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.locality"
                               :options="autocomplete.locality" :searchable="true"
                               @search-change="autcompleteLocalitySearch"
                               :allow-empty="true" :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>
                  {{ $i18n.locale=== 'ee' ? option.locality :option.locality_en }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- MAP -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-map">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.map }" @click="block.map = !block.map">
        {{ $t('locality.map') }}
        <font-awesome-icon icon="map"/>
      </legend>

      <transition name="fade">
        <div v-if="block.map">

          <!-- LATITUDE, LONGITUDE and ELEVATION -->
          <div class="row">
            <div class="col-6 col-sm-4">
              <label :for="`latitude`">{{ $t('locality.longitude') }}:</label>
              <b-form-input id="latitude" v-model="locality.latitude" type="number"></b-form-input>
            </div>

            <div class="col-6 col-sm-4">
              <label :for="`longitude`">{{ $t('locality.longitude') }}:</label>
              <b-form-input id="longitude" v-model="locality.longitude" type="number"></b-form-input>
            </div>

            <div class="col-sm-4">
              <label :for="`elevation`">{{ $t('locality.elevation') }}:</label>
              <b-form-input id="elevation" v-model="locality.elevation" type="number" step="0.01"></b-form-input>
            </div>
          </div>

          <!-- MAP -->
          <div class="row">
            <span class="col ml-3 mt-3 custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">
            <label class="custom-control-label"
                   for="customSwitch">{{showCollapseMap ? 'Map enabled' : 'Map disabled'}}</label>
          </span>
          </div>

          <div class="row mb-2">
            <div class="col">
              <b-collapse v-model="showCollapseMap" id="collapseMap">
                <!--<map-component v-bind:locations="[]" v-bind:location="{ lat: site.latitude ? (site.latitude).toString() : null, lng: site.longitude ? (site.longitude).toString() : null }" v-on:get-location="updateLocation" />-->
                <map-component-2 v-if="showCollapseMap " mode="single" v-bind:locations="[]"
                                 v-bind:location="{ lat: locality.latitude ? (locality.latitude).toString() : null, lng: locality.longitude ? (locality.longitude).toString() : null }"
                                 v-on:get-location="updateLocation"></map-component-2>
              </b-collapse>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- ADDITIONAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-additionalInfo">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.additionalInfo }" @click="block.additionalInfo = !block.additionalInfo">
        {{ $t('locality.additionalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.additionalInfo">

          <!-- COORDINATE X, EXTENT and COUNTRY-->
          <div class="row">
            <div class="col-md-4">
              <label :for="`extent`">{{ $t('locality.extent') }}:</label>
              <vue-multiselect v-model="locality.extent"
                               id="extent"
                               :options="autocomplete.extent"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`depth`">{{ $t('locality.depth') }}:</label>
              <b-form-input id="depth" v-model="locality.depth" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`country`">{{ $t('locality.country') }}:</label>
              <vue-multiselect v-model="locality.country"
                               id="country"
                               :options="autocomplete.country"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- COORD PRECISION, COORD METHOD and COORD AGENT -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`coord_det_precision`">{{ $t('locality.coord_det_precision') }}:</label>
              <vue-multiselect v-model="locality.coord_det_precision"
                               id="coord_det_precision"
                               :options="autocomplete.coordPrecision"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`coord_det_method`">{{ $t('locality.coord_det_method') }}:</label>
              <vue-multiselect v-model="locality.coord_det_method"
                               id="coord_det_method"
                               :options="autocomplete.coordMethod"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`coord_det_agent`">{{ $t('locality.coord_det_agent') }}:</label>
              <vue-multiselect class="align-middle" v-model="locality.coord_det_agent"
                               deselect-label="Can't remove this value" id="coord_det_agent"
                               label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                               :allow-empty="true" :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- STRAT TOP AND STRAT TOP FREE-->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`stratigraphy_top`">{{ $t('locality.stratigraphy_top') }}:</label>
              <vue-multiselect class="align-middle" v-model="locality.stratigraphy_top"
                               deselect-label="Can't remove this value" id="stratigraphy_top"
                               :loading="autocomplete.loaders.stratigraphy_top"
                               :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.stratigraphy_top" :searchable="true"
                               @search-change="autcompleteStratigraphyTopSearch"
                               :allow-empty="true" :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>
                  {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-sm-6">
              <label :for="`stratigraphy_top_free`">{{ $t('locality.stratigraphy_top_free') }}:</label>
              <b-form-input id="stratigraphy_top_free" v-model="locality.stratigraphy_top_free" type="text"></b-form-input>
            </div>
          </div>

          <!-- STRAT LOWER AND STRAT LOWER FREE-->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`stratigraphy_base`">{{ $t('locality.stratigraphy_base') }}:</label>
              <vue-multiselect class="align-middle" v-model="locality.stratigraphy_base"
                               deselect-label="Can't remove this value" id="stratigraphy_base"
                               :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.stratigraphy_base"
                               :options="autocomplete.stratigraphy_base" :searchable="true"
                               @search-change="autcompleteStratigraphyBaseSearch"
                               :allow-empty="true" :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>
                  {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-sm-6">
              <label :for="`stratigraphy_base_free`">{{ $t('locality.stratigraphy_base_free') }}:</label>
              <b-form-input id="stratigraphy_base_free" v-model="locality.stratigraphy_base_free" type="text"></b-form-input>
            </div>
          </div>

          <!-- MAAAMET PA AND EELIS ID -->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`maaamet_pa_id`">{{ $t('locality.maaamet_pa_id') }}:</label>
              <b-form-input id="maaamet_pa_id" v-model="locality.maaamet_pa_id" type="number"></b-form-input>
            </div>

            <div class="col-sm-6">
              <label :for="`eelis`">{{ $t('locality.eelis') }}:</label>
              <b-form-input id="eelis" v-model="locality.eelis" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- DESCRIPTION -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-description">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.description }" @click="block.description = !block.description">
        {{ $t('locality.description') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <transition name="fade">
        <div v-if="block.description">

          <!-- DESCRIPTION -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks_location`">{{ $t('locality.remarks_location') }}:</label>
              <b-form-textarea id="remarks_location" v-model="locality.remarks_location" type="text" size="sm"
                               :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- ADDITIONAL INFO -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t('locality.remarks') }}:</label>
              <b-form-textarea id="remarks" v-model="locality.remarks" type="text" size="sm"
                               :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- COORDINATE Y AND COORD SYSTEM -->
    <!--
    <div class="row">

      <div class="col-sm-2">
        <label :for="`coordx`">{{ $t('locality.coordx') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordx" v-model="locality.coordx" type="number"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`coordy`">{{ $t('locality.coordy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordy" v-model="locality.coordy" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`coord_system`">{{ $t('locality.coord_system') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coord_system" v-model="locality.coord_system" type="text"></b-form-input>
      </div>
    </div>
    -->


    <!-- CHECKBOXES -->
    <div class="row mt-3 mb-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="locality.is_private" :value="true" :unchecked-value="false">
          {{ $t('locality.private') }}
        </b-form-checkbox>
      </div>
    </div>

    <!-- SHOWING RELATED_DATA -->
    <div class="row" v-if="$route.meta.isEdit">
      <div class="col">
        <ul class="nav nav-tabs tab-links  mb-3" style="flex-wrap: nowrap !important">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_reference')" class="nav-link"
               :class="{ active: activeTab === 'locality_reference' }">{{
              $t('locality.relatedTables.locality_reference') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_synonym')" class="nav-link"
               :class="{ active: activeTab === 'locality_synonym' }">{{ $t('locality.relatedTables.locality_synonym')
              }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('attachment_link')" class="nav-link"
               :class="{ active: activeTab === 'attachment_link' }">{{ $t('locality.relatedTables.attachment_link')
              }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_stratigraphy')" class="nav-link"
               :class="{ active: activeTab === 'locality_stratigraphy' }">{{
              $t('locality.relatedTables.locality_stratigraphy') }}</a>
          </li>
        </ul>

        <div class="row" v-if="activeTab !== 'attachment_link'">
          <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">
            <b-form-select v-model="relatedData.paginateBy[activeTab]" class="mb-3" size="sm">
              <option :value="10">{{ this.$t('main.pagination', { num: '10' }) }}</option>
              <option :value="25">{{ this.$t('main.pagination', { num: '25' }) }}</option>
              <option :value="50">{{ this.$t('main.pagination', { num: '50' }) }}</option>
              <option :value="100">{{ this.$t('main.pagination', { num: '100' }) }}</option>
              <option :value="250">{{ this.$t('main.pagination', { num: '250' }) }}</option>
              <option :value="500">{{ this.$t('main.pagination', { num: '500' }) }}</option>
              <option :value="1000">{{ this.$t('main.pagination', { num: '1000' }) }}</option>
            </b-form-select>
          </div>

          <div class="col-sm-12 col-md-3 export-center">
            <!-- EXPORT BUTTON? -->
          </div>

          <div class="col-sm-12 col-md-6 pagination-center"
               v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.page[activeTab]" :per-page="relatedData.paginateBy[activeTab]">
            </b-pagination>
          </div>
        </div>

        <locality-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                            v-on:related-data-added="addRelatedData"
                            v-on:related-data-modified="editRelatedData"
                            v-on:edit-row="editRow"
                            v-on:allow-remove-row="allowRemove"/>

        <locality-synonym :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                          v-on:related-data-added="addRelatedData"
                          v-on:related-data-modified="editRelatedData"
                          v-on:edit-row="editRow"
                          v-on:allow-remove-row="allowRemove"/>

        <locality-attachment :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                             v-on:related-data-added="addRelatedData"
                             v-on:related-data-modified="editRelatedData"
                             v-on:edit-row="editRow"
                             v-on:allow-remove-row="allowRemove"/>

        <locality-stratigraphy :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                               v-on:related-data-added="addRelatedData"
                               v-on:related-data-modified="editRelatedData"
                               v-on:edit-row="editRow"
                               v-on:allow-remove-row="allowRemove"/>

      </div>
    </div>

    <!-- BUTTONS -->
    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'locality', true)"
                :title="$t('edit.buttons.saveAndLeave') ">
          <font-awesome-icon icon="door-open"/>
          {{ $t('edit.buttons.saveAndLeave') }}
        </button>

        <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData" @click="add(true, 'locality', true)"
                :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">
          <font-awesome-icon icon="save"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        </button>

        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('locality', $route.meta.isEdit)"
                :title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">
          <font-awesome-icon icon="ban"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}
        </button>

        <span class="float-right">
            <button class="btn btn-primary mb-2" @click="$parent.saveAsNew" v-if="$route.meta.isCopyFormShown">{{ $t('add.saveAsNew') }}</button>
          </span>
      </div>
    </div>

  </div>
</template>

<script>

  import Spinner from 'vue-simple-spinner'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import VueMultiselect from 'vue-multiselect'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faTimes, faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'
  import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
  import copyForm from './../mixins/copyForm'
  import {
    fetchListLocalityTypes,
    fetchListLocalityExtent,
    fetchListCoordinateMethod,
    fetchListCoordinatePrecision,
    fetchListCountry,
    fetchLocality,
    fetchLocalityReference,
    fetchLocalitySynonym,
    fetchLocalityAttachment,
    fetchLocalityStratigraphy,
    fetchLocalities
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import {toastSuccess, toastError} from "@/assets/js/iziToast/iziToast";
  import formManipulation from './../mixins/formManipulation'
  import autocompleteFieldManipulation from './../mixins/autocompleFormManipulation'
  import LocalityReference from "./relatedTables/LocalityReference";
  import LocalitySynonym from "./relatedTables/LocalitySynonym";
  import LocalityAttachment from "./relatedTables/LocalityAttachment";
  import LocalityStratigraphy from "./relatedTables/LocalityStratigraphy";
  import MapComponent from '@/components/partial/MapComponent'
  import MapComponent2 from "../partial/MapComponent2";
  import localStorageMixin from "../mixins/localStorageMixin";

  library.add(faTimes, faChevronUp, faChevronDown)
  export default {
    name: "Locality",
    components: {
      MapComponent2,
      LocalityStratigraphy,
      LocalityAttachment,
      LocalitySynonym,
      LocalityReference,
      BFormInput,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
      MapComponent
    },
    mixins: [formManipulation, copyForm, autocompleteFieldManipulation, localStorageMixin],

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'localitySearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_LOCALITIES',
          title: 'header.localities',
          object: 'locality',
          field: 'locality_en',
          block: this.block,
        });
      }
      this.loadFullInfo()
    },

    methods: {

      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          tabs: ['locality_reference', 'locality_synonym', 'attachment_link', 'locality_stratigraphy'],
          searchHistory: 'localitySearchHistory',
          activeTab: 'locality_reference',
          relatedData: this.setDefaultRalatedData(),
          copyFields: ['id', 'locality', 'locality_en', 'number', 'code', 'latitude', 'longitude', 'elevation', 'depth',
            'coordx', 'coordy', 'coord_system', 'stratigraphy_top_free', 'stratigraphy_base_free', 'maaamet_pa_id', 'eelis',
            'remarks_location', 'remarks', 'is_private', 'type', 'parent', 'extent', 'coord_det_precision', 'coord_det_method',
            'coord_det_agent', 'country', 'stratigraphy_top', 'stratigraphy_base'],
          autocomplete: {
            loaders: {
              locality: false, stratigraphy_top: false, stratigraphy_base: false, agent: false,
              reference: false, synonym: false, attachment: false, stratigraphy: false
            },
            localityTypes: [], locality: [], extent: [], coordPrecision: [], coordMethod: [], reference: [],
            agent: [], country: [], county: [], parish: [], stratigraphy_top: [], stratigraphy_base: [], synonym: [],
            attachment: [], stratigraphy: []
          },
          requiredFields: ['locality', 'locality_en'],
          locality: {},
          showCollapseMap: true,
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          block: {info: true, map: true, additionalInfo: true, description: true}
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        fetchListLocalityTypes().then(response => {
          this.autocomplete.localityTypes = this.handleResponse(response);
        });
        fetchListLocalityExtent().then(response => {
          this.autocomplete.extent = this.handleResponse(response);
        });
        fetchListCoordinateMethod().then(response => {
          this.autocomplete.coordMethod = this.handleResponse(response);
        });
        fetchListCoordinatePrecision().then(response => {
          this.autocomplete.coordPrecision = this.handleResponse(response);
        });
        fetchListCountry().then(response => {
          this.autocomplete.country = this.handleResponse(response);
        });

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchLocality(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.locality = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.locality)
              this.removeUnnecessaryFields(this.locality, this.copyFields);
              this.$emit('data-loaded', this.locality)
              this.$emit('set-object', 'locality')
              this.sendingData = false;
              this.getListRecords('locality')
            } else {
              this.sendingData = false;
            }
          });
          //Manipulation with data itself should be done in class
          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.tabs);
          // FETCH FIRST TAB RELATED DATA
          this.tabs.forEach(entity => {
            this.loadRelatedData(entity);
          });
          // FETCH FIRST TAB RELATED DATA
          this.setActiveTab('locality_reference')
        }
      },

      setDefaultRalatedData() {
        return {
          locality_reference: [], locality_synonym: [], attachment_link: [], locality_stratigraphy: [],
          copyFields: {
            locality_reference: ['reference', 'pages', 'figures', 'remarks'],
            locality_synonym: ['synonym', 'reference', 'pages', 'remarks'],
            attachment_link: ['attachment', 'remarks'],
            locality_stratigraphy: ['stratigraphy', 'depth_base', 'depth_top', 'reference', 'agent', 'year', 'current'],
          },
          insert: {locality_reference: {}, locality_synonym: {}, attachment_link: {}, locality_stratigraphy: {}},
          page: {locality_reference: 1, locality_synonym: 1, attachment_link: 1, locality_stratigraphy: 1},
          paginateBy: {locality_reference: 25, locality_synonym: 25, attachment_link: 25, locality_stratigraphy: 25},
          count: {locality_reference: 0, locality_synonym: 0, attachment_link: 0, locality_stratigraphy: 0}
        }
      },
      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)
        if (this.isDefinedAndNotNull(objectToUpload.elevation))
          uploadableObject.elevation = objectToUpload.elevation.toFixed(1)
        if (objectToUpload.latitude === '')
          uploadableObject.latitude = this.isDefinedAndNotNull(objectToUpload.latitude) ? objectToUpload.latitude.toFixed(6) : null
        if (objectToUpload.longitude === '')
          uploadableObject.longitude = this.isDefinedAndNotNull(objectToUpload.longitude) ? objectToUpload.longitude.toFixed(6) : null
        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';
        if (this.isDefinedAndNotNull(objectToUpload.type)) uploadableObject.type = objectToUpload.type.id
        if (this.isDefinedAndNotNull(objectToUpload.parent)) uploadableObject.parent = objectToUpload.parent.id
        if (this.isDefinedAndNotNull(objectToUpload.extent)) uploadableObject.extent = objectToUpload.extent.id
        if (this.isDefinedAndNotNull(objectToUpload.coord_det_precision)) uploadableObject.coord_det_precision = objectToUpload.coord_det_precision.id
        if (this.isDefinedAndNotNull(objectToUpload.coord_det_method)) uploadableObject.coord_det_method = objectToUpload.coord_det_method.id
        if (this.isDefinedAndNotNull(objectToUpload.coord_det_agent)) uploadableObject.coord_det_agent = objectToUpload.coord_det_agent.id
        if (this.isDefinedAndNotNull(objectToUpload.country)) uploadableObject.country = objectToUpload.country.id
        if (this.isDefinedAndNotNull(objectToUpload.stratigraphy_top)) uploadableObject.stratigraphy_top = objectToUpload.stratigraphy_top.id
        if (this.isDefinedAndNotNull(objectToUpload.stratigraphy_base)) uploadableObject.stratigraphy_base = objectToUpload.stratigraphy_base.id

        // console.log('This object is sent in string format:\n'+JSON.stringify(uploadableObject))
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.locality.type = {value: obj.type__value, value_en: obj.type__value_en, id: obj.type__id}
        this.locality.parent = {
          locality: obj.parent__locality,
          locality_en: obj.parent__locality_en,
          id: obj.parent__id
        }
        this.locality.extent = {value: obj.extent__value, value_en: obj.extent__value_en, id: obj.extent__id}
        this.locality.coord_det_precision = {
          value: obj.coord_det_precision__value,
          value_en: obj.coord_det_precision__value_en,
          id: obj.coord_det_precision__id
        }
        this.locality.coord_det_method = {
          value: obj.coord_det_method__value,
          value_en: obj.coord_det_method__value_en,
          id: obj.coord_det_method__id
        }
        this.locality.coord_det_agent = {agent: obj.coord_det_agent__agent, id: obj.coord_det_agent__id}
        this.locality.country = {value: obj.country__value, value_en: obj.country__value_en, id: obj.country__id}
        this.locality.stratigraphy_top = {
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en,
          id: obj.stratigraphy_top__id
        }
        this.locality.stratigraphy_base = {
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en,
          id: obj.stratigraphy_base__id
        }
      },


      fillRelatedDataAutocompleteFields(obj) {
        obj.reference = {reference: obj.reference__reference, id: obj.reference}
        obj.stratigraphy = {
          stratigraphy: obj.stratigraphy__stratigraphy,
          stratigraphy_en: obj.stratigraphy__stratigraphy_en,
          id: obj.stratigraphy__id
        }
        obj.agent = {agent: obj.agent__agent, id: obj.agent}
        return obj
      },

      loadRelatedData(type) {
        let query;
        if (type === 'locality_reference') {
          query = fetchLocalityReference(this.$route.params.id, this.relatedData.page.locality_reference)
        } else if (type === 'locality_synonym') {
          query = fetchLocalitySynonym(this.$route.params.id, this.relatedData.page.locality_synonym)
        } else if (type === 'attachment_link') {
          query = fetchLocalityAttachment(this.$route.params.id, this.relatedData.page.attachment_link)
        } else if (type === 'locality_stratigraphy') {
          query = fetchLocalityStratigraphy(this.$route.params.id, this.relatedData.page.locality_stratigraphy)
        }

        return new Promise(resolve => {
          query.then(response => {
            this.relatedData[type] = this.handleResponse(response);
            this.relatedData.count[type] = response.body.count;
            resolve(true)
          });
        });
      },
      checkRequiredFields(type, obj) {
        // if(type === 'locality_reference') return obj.reference === undefined;
        // if(type === 'locality_synonym') return obj.synonym === undefined;
        // if(type === 'attachment_link') return obj.attachment === undefined;
        // if(type === 'locality_stratigraphy') return obj.stratigraphy === undefined;
      },
      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.locality = this.locality.id;
        if (this.isDefinedAndNotNull(uploadableObject.reference)) uploadableObject.reference = uploadableObject.reference.id;
        if (this.isDefinedAndNotNull(uploadableObject.attachment)) uploadableObject.attachment = uploadableObject.attachment.id;
        if (this.isDefinedAndNotNull(uploadableObject.stratigraphy)) uploadableObject.stratigraphy = uploadableObject.stratigraphy.id;
        if (this.isDefinedAndNotNull(uploadableObject.agent)) uploadableObject.agent = uploadableObject.agent.id;
        return JSON.stringify(uploadableObject)
      },

      updateLocation(location) {
        this.locality.latitude = location.lat.toFixed(6)
        this.locality.longitude = location.lng.toFixed(6)
      },
      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchLocalities(params))
        });
      },

      setDefaultSearchParameters() {
        return {
          locality: null,
          number: null,
          county: null,
          country: null,
          agent: null,
          id: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      }
    }


  }

</script>

<style scoped>
  .toggle-collapse {
    font-weight: bold;
    /*font-size: large;*/
  }

  .toggle-collapse:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  /* Map height */
  #collapseMap {
    height: 50vh;
  }

  .vue2leaflet-map, .leaflet-container {
    cursor: crosshair;
  }

  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
