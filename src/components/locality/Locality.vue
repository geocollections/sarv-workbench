<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- LOCALITY AND LOCALITY ENG -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('locality.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality" :state="isDefinedAndNotNull(locality.locality)" v-model="locality.locality" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`locality_en`">{{ $t('locality.locality_en') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality_en" v-model="locality.locality_en" type="text"></b-form-input>
      </div>
    </div>

    <!-- NUMBER AND OTHER NUMBER -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`number`">{{ $t('locality.number') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="number" v-model="locality.number" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`code`">{{ $t('locality.code') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="code" v-model="locality.code" type="text"></b-form-input>
      </div>
    </div>

    <!-- LOCALITY TYPE, LOCALITY BELONGS  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`type`">{{ $t('locality.type') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
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


      <div class="col-sm-2">
        <label :for="`parent`">{{ $t('locality.parent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="locality.parent" deselect-label="Can't remove this value"
                         :label="localityLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.locality"
                         :options="autocomplete.locality" :searchable="true" @search-change="autcompleteLocalitySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.locality :option.locality_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- LATITUDE AND LONGITUDE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`latitude`">Lat | Long:</label>
      </div>

      <div class="col-sm-3 mb-2">
        <b-form-input id="latitude" v-model="locality.latitude" type="number"></b-form-input>
      </div>

<!--
      <div class="col-sm-2">
        <label :for="`longitude`">{{ $t('locality.longitude') }}:</label>
      </div>
-->
      <div class="col-sm-3 mb-2">
        <b-form-input id="longitude" v-model="locality.longitude" type="number"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`elevation`">{{ $t('locality.elevation') }}:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="elevation" v-model="locality.elevation" type="number" step="0.01"></b-form-input>
      </div>

    </div>

    <!-- MAP -->
    <div class="row">
      <div class="col mb-1 toggle-collapse" @click="showCollapseMap = !showCollapseMap"
           :class="showCollapseMap ? 'collapsed' : null">
        {{ $t('photoArchive.collapseMap') }}
        <font-awesome-icon v-if="showCollapseMap" icon="chevron-up"></font-awesome-icon>
        <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
      </div>
    </div>

    <div class="row mb-2">
      <div class="col">
        <b-collapse v-model="showCollapseMap" id="collapseMap">
          <map-component v-bind:location="{ lat: locality.latitude ? (locality.latitude).toString() : null, lng: locality.longitude ? (locality.longitude).toString() : null }" v-on:get-location="updateLocation" />
        </b-collapse>
      </div>
    </div>

    <!-- ALTITUDE AND VERTICAL
    <div class="row">

    </div>-->

    <!-- COORDINATE X AND EXTENT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`extent`">{{ $t('locality.extent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
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
      <div class="col-sm-2">
        <label :for="`depth`">{{ $t('locality.depth') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="depth" v-model="locality.depth" type="number"></b-form-input>
      </div>
    </div>

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
    <!-- COORD PRECISION AND  COORD METHOD  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`coord_det_precision`">{{ $t('locality.coord_det_precision') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
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


      <div class="col-sm-2">
        <label :for="`coord_det_method`">{{ $t('locality.coord_det_method') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
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
    </div>

    <!-- ASSIGNER AND COUNTRY  -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`coord_det_agent`">{{ $t('locality.coord_det_agent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="locality.coord_det_agent" deselect-label="Can't remove this value"
                         label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.agent"
                         :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`coordMethod`">{{ $t('locality.country') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
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

    <!-- STRAT TOP AND STRAT TOP FREE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy_top`">{{ $t('locality.stratigraphy_top') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="locality.stratigraphy_top" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.stratigraphy_top"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.stratigraphy_top" :searchable="true" @search-change="autcompleteStratigraphyTopSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`stratigraphy_top_free`">{{ $t('locality.stratigraphy_top_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_top_free" v-model="locality.stratigraphy_top_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- STRAT LOWER AND STRAT LOWER FREE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy_base`">{{ $t('locality.stratigraphy_base') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="locality.stratigraphy_base" deselect-label="Can't remove this value"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.stratigraphy_base"
                         :options="autocomplete.stratigraphy_base" :searchable="true" @search-change="autcompleteStratigraphyBaseSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`stratigraphy_base_free`">{{ $t('locality.stratigraphy_base_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_base_free" v-model="locality.stratigraphy_base_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- MAAAMET PA AND EELIS ID -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`maaamet_pa_id`">{{ $t('locality.maaamet_pa_id') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="maaamet_pa_id" v-model="locality.maaamet_pa_id" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`eelis`">{{ $t('locality.eelis') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="eelis" v-model="locality.eelis" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`remarks_location`">{{ $t('locality.remarks_location') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="remarks_location" v-model="locality.remarks_location" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- ADDITIONAL INFO -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`remarks`">{{ $t('locality.remarks') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="remarks" v-model="locality.remarks" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="locality.is_private" :value="true" :unchecked-value="false">
          {{ $t('locality.private') }}
        </b-form-checkbox>
      </div>
    </div>

    <!-- SHOWING RELATED_DATA -->
    <div class="row">
      <div class="col mt-5 mb-5">
        <ul class="nav nav-tabs tab-links  mb-3" style="flex-wrap: nowrap !important">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_reference')" class="nav-link"  :class="{ active: activeTab === 'locality_reference' }">{{ $t('locality.relatedTables.reference') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_synonym')" class="nav-link"  :class="{ active: activeTab === 'locality_synonym' }">{{ $t('locality.relatedTables.synonym') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('attachment_link')" class="nav-link"  :class="{ active: activeTab === 'attachment_link' }">{{ $t('locality.relatedTables.attachment') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_stratigraphy')" class="nav-link"  :class="{ active: activeTab === 'locality_stratigraphy' }">{{ $t('locality.relatedTables.stratigraphy') }}</a>
          </li>
        </ul>
        <locality-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
        <locality-synonym :related-data="relatedData" :autocomplete="autocomplete"  :active-tab="activeTab"/>
        <locality-attachment :related-data="relatedData" :autocomplete="autocomplete"  :active-tab="activeTab"/>
        <locality-stratigraphy :related-data="relatedData" :autocomplete="autocomplete"  :active-tab="activeTab"/>
        <div class="row mb-4 pt-1">
          <div class="col">
            <button class="btn float-left btn-sm btn-outline-success mr-2 mb-2 pl-4 pr-4"
                    :disabled="sendingData" @click="addRelatedData(activeTab)">{{$t('add.newRelation')}}</button>
          </div>
          <div class="col pagination-center" v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]" v-model="relatedData.page[activeTab]" :per-page="10">
            </b-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'locality')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'locality')">
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('locality')">
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>
      </div>
    </div>

    <bottom-options :success-button="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add')"
                    :danger-button="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields')"
                    object="locality"
                    v-on:button-clicked="hoverSaveOrCancelButtonClicked"></bottom-options>
  </div>
</template>

<script>

  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faTimes, faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons'
  import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
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
    fetchLocalityStratigraphy
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
  import LocalityReference from "./relatedTables/LocalityReference";
  import LocalitySynonym from "./relatedTables/LocalitySynonym";
  import LocalityAttachment from "./relatedTables/LocalityAttachment";
  import LocalityStratigraphy from "./relatedTables/LocalityStratigraphy";
  import MapComponent from '@/components/partial/MapComponent'
  import BottomOptions from "../partial/BottomOptions";
  library.add(faTimes, faChevronUp, faChevronDown)
  export default {
    name: "Locality",
    components: {
      BottomOptions,
      LocalityStratigraphy,
      LocalityAttachment,
      LocalitySynonym,
      LocalityReference,
      BFormInput,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
      MapComponent,
    },
    mixins: [formManipulation,autocompleteFieldManipulation],
    data() {
      return {
        tabs:['locality_reference','locality_synonym','attachment_link','locality_stratigraphy'],
        activeTab: 'locality_reference',
        relatedData: this.setDefaultRalatedData(),
        copyFields : ['id','locality','locality_en','number','code','latitude','longitude','elevation','depth',
          'coordx','coordy','coord_system','stratigraphy_top_free','stratigraphy_base_free','maaamet_pa_id','eelis',
          'remarks_location','remarks','is_private', 'type','parent','extent','coord_det_precision','coord_det_method',
          'coord_det_agent','country','stratigraphy_top','stratigraphy_base'],
        autocomplete: {
          loaders: { locality:false, stratigraphy_top:false,stratigraphy_base:false, agent:false,
            reference:false, synonym:false, attachment:false, stratigraphy:false},
          localityTypes: [], locality: [], extent: [], coordPrecision: [], coordMethod: [],reference:[],
          agent: [], country: [], county: [], parish: [], stratigraphy_top: [], stratigraphy_base: [], synonym:[],
          attachment: [], stratigraphy: []
        },
        requiredFields: ['locality','locality_en'],
        locality: {},
        showCollapseMap: true,
      }
    },
    computed: {
      isLocalityDataLoaded(){
        return this.locality.latitude || this.locality.longitude
      }
    },
    created() {
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

      if(this.$route.meta.isEdit) {
        this.sendingData = true;
        fetchLocality(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if(handledResponse.length > 0) {
            this.locality = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.locality)
            this.removeUnnecessaryFields(this.locality,this.copyFields);
            this.$emit('data-loaded',this.locality)
            this.sendingData = false;
          } else {
            this.sendingData = false;
          }
        });
        //Manipulation with data itself should be done in class
        this.$on('tab-changed',this.setTab);

        this.$on('related-data-modified',this.editRelatedData);
        this.$on('related-data-added',this.addRelatedData);
        this.$on('edit-row',this.editRow);
        this.$on('allow-remove-row',this.allowRemove);

        // this.$emit('related-data-info',this.tabs);
        // FETCH FIRST TAB RELATED DATA
        this.tabs.forEach(entity => {
          this.loadRelatedData(entity);
        });
        // FETCH FIRST TAB RELATED DATA
        this.setActiveTab('locality_reference')
      }
    },

    methods: {

      setTab(type){ this.activeTab  = type },
      setDefaultRalatedData(){
        return {
          locality_reference:[], locality_synonym: [], attachment_link:[], locality_stratigraphy:[],
          copyFields: {
            locality_reference:['reference','pages','figures','remarks'],
            locality_synonym: ['synonym','reference','pages','remarks'],
            attachment_link: ['attachment','remarks'],
            locality_stratigraphy:['stratigraphy','depth_base','depth_top','reference','agent','year','current'],
          },
          insert: {locality_reference:{}, locality_synonym: {}, attachment_link:{}, locality_stratigraphy:{}},
          page : {locality_reference:1, locality_synonym: 1, attachment_link:1, locality_stratigraphy:1},
          count: {locality_reference:0, locality_synonym: 0, attachment_link:0, locality_stratigraphy:0}
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

      fillAutocompleteFields(obj){
        this.locality.type = {value:obj.type__value,value_en:obj.type__value_en,id:obj.type__id}
        this.locality.parent = {locality:obj.parent__locality,locality_en:obj.parent__locality_en,id:obj.parent__id}
        this.locality.extent = {value:obj.extent__value,value_en:obj.extent__value_en,id:obj.extent__id}
        this.locality.coord_det_precision = {value:obj.coord_det_precision__value,value_en:obj.coord_det_precision__value_en,id:obj.coord_det_precision__id}
        this.locality.coord_det_method = {value:obj.coord_det_method__value,value_en:obj.coord_det_method__value_en,id:obj.coord_det_method__id}
        this.locality.coord_det_agent = {agent:obj.coord_det_agent__agent,id:obj.coord_det_agent__id}
        this.locality.country = {value:obj.country__value,value_en:obj.country__value_en,id:obj.country__id}
        this.locality.stratigraphy_top = {stratigraphy:obj.stratigraphy_top__stratigraphy,stratigraphy_en:obj.stratigraphy_top__stratigraphy_en,id:obj.stratigraphy_top__id}
        this.locality.stratigraphy_base = {stratigraphy:obj.stratigraphy_base__stratigraphy,stratigraphy_en:obj.stratigraphy_base__stratigraphy_en,id:obj.stratigraphy_base__id}
      },


      fillRelatedDataAutocompleteFields(obj){
        obj.reference = { reference:obj.reference__reference, id:obj.reference}
        obj.stratigraphy = {stratigraphy:obj.stratigraphy__stratigraphy,stratigraphy_en:obj.stratigraphy__stratigraphy_en,id:obj.stratigraphy__id}
        obj.agent = {agent:obj.agent__agent,id:obj.agent}
        return obj
      },

      loadRelatedData(type){
        let query;
        if(type === 'locality_reference') {
          query = fetchLocalityReference(this.$route.params.id,this.relatedData.page.locality_reference)
        } else if(type === 'locality_synonym') {
          query = fetchLocalitySynonym(this.$route.params.id,this.relatedData.page.locality_synonym)
        } else if(type === 'attachment_link') {
          query = fetchLocalityAttachment(this.$route.params.id,this.relatedData.page.attachment_link)
        } else if(type === 'locality_stratigraphy') {
          query = fetchLocalityStratigraphy(this.$route.params.id,this.relatedData.page.locality_stratigraphy)
        }

        query.then(response => {
          this.relatedData[type] = this.handleResponse(response);
          this.relatedData.count[type] = response.body.count;
        });
      },
      checkRequiredFields(type,obj){
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
</style>
