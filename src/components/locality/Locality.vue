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
                         :options="autocomplete.parent" :searchable="true" @search-change="autcompleteLocalitySearch"
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
        <label :for="`latitude`">{{ $t('locality.latitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="latitude" v-model="locality.latitude" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`longitude`">{{ $t('locality.longitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="longitude" v-model="locality.longitude" type="number"></b-form-input>
      </div>
    </div>

    <!-- ALTITUDE AND VERTICAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`elevation`">{{ $t('locality.elevation') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="elevation" v-model="locality.elevation" type="number" step="0.01"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`depth`">{{ $t('locality.depth') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="depth" v-model="locality.depth" type="number"></b-form-input>
      </div>
    </div>

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
        <label :for="`coordx`">{{ $t('locality.coordx') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordx" v-model="locality.coordx" type="number"></b-form-input>
      </div>
    </div>

    <!-- COORDINATE Y AND COORD SYSTEM -->
    <div class="row">
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
                         :options="autocomplete.coord_det_agent" :searchable="true" @search-change="autcompleteAgentSearch"
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
        <ul class="nav nav-tabs tab-links  mb-3" style="flex-wrap: nowrap !important;">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('reference')" class="nav-link"  :class="{ active: activeTab === 'reference' }">{{ $t('locality.relatedTables.reference') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('synonym')" class="nav-link"  :class="{ active: activeTab === 'synonym' }">{{ $t('locality.relatedTables.synonym') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('attachment')" class="nav-link"  :class="{ active: activeTab === 'attachment' }">{{ $t('locality.relatedTables.attachment') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('stratigraphy')" class="nav-link"  :class="{ active: activeTab === 'stratigraphy' }">{{ $t('locality.relatedTables.stratigraphy') }}</a>
          </li>
        </ul>
        <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'reference'}" role="tabpanel">
          <div class="col-sm-8" v-if="activeTab === 'reference' && relatedData['reference'] !== null && relatedData['reference'].length > 0">
            <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead class="thead-light">
                <tr>
                  <th>{{ $t('reference.reference') }}</th>
                  <th>{{ $t('reference.pages') }}</th>
                  <th>{{ $t('reference.figures') }}</th>
                  <th>{{ $t('reference.remarks') }}</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="(entity, index) in relatedData.reference">
                  <td>
                    <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.id})">
                      {{ entity.reference__reference }}
                    </a>
                  </td>
                  <td>{{ entity.pages }}</td>
                  <td>{{ entity.figures }}</td>
                  <td>{{ entity.remarks }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="#tab-synonym" class="tab-pane row" :class="{active: activeTab === 'synonym'}" role="tabpanel">
          <div class="col-sm-8" v-if="activeTab === 'synonym'">
            <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead class="thead-light">
                <tr>
                  <th>{{ $t('synonym.synonym') }}</th>
                  <th>{{ $t('synonym.reference') }}</th>
                  <th>{{ $t('synonym.pages') }}</th>
                  <th>{{ $t('synonym.remarks') }}</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="(entity, index) in relatedData.synonym">
                  <td>{{ entity.synonym }}</td>
                  <td>{{ entity.reference__reference }}</td>
                  <td>{{ entity.pages }}</td>
                  <td>{{ entity.remarks }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="#tab-attachment" class="tab-pane row" :class="{active: activeTab === 'attachment'}" role="tabpanel">
          <div class="col-sm-8" v-if="activeTab === 'attachment'">
            <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead class="thead-light">
                <tr>
                  <th>{{ $t('attachments.link') }}</th>
                  <th>{{ $t('attachments.remarks') }}</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="(entity, index) in relatedData.attachment">
                  <td>{{ entity.original_filename }}</td>
                  <td>{{ entity.remarks }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="#tab-stratygraphy" class="tab-pane row" :class="{active: activeTab === 'stratigraphy'}" role="tabpanel">
          <div class="col-sm-8" v-if="activeTab === 'stratigraphy'">
            <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead class="thead-light">
                <tr>
                  <th>{{ $t('stratigraphy.stratigraphy') }}</th>
                  <th>{{ $t('stratigraphy.base') }}</th>
                  <th>{{ $t('stratigraphy.top') }}</th>
                  <th>{{ $t('stratigraphy.reference') }}</th>
                  <th>{{ $t('stratigraphy.author') }}</th>
                  <th>{{ $t('stratigraphy.year') }}</th>
                  <th>{{ $t('stratigraphy.is_preferred') }}</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="(entity, index) in relatedData.stratigraphy">
                  <td>
                    <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'stratigraphy', id: entity.stratigraphy_id})"
                    v-translate="{et:entity.stratigraphy__stratigraphy ,en:entity.stratigraphy__stratigraphy_en}"></a>
                  </td>

                  <td>{{ entity.depth_base }}</td>
                  <td>{{ entity.depth_top }}</td>
                  <td>
                    <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.reference__id})">
                      {{entity.reference__reference}}
                    </a>
                  </td>
                  <td>{{ entity.agent__agent }}</td>
                  <td>{{ entity.year }}</td>
                  <td>{{ entity.current === true ? '+' : '' }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row m-1" v-if="relatedData[activeTab] !== null && relatedData[activeTab].length === 0">
          <h4>{{$t('messages.inputNoResults')}}</h4>
        </div>
        <div class="col-xs-12 pagination-center">
          <b-pagination
            size="sm" align="left" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count" v-model="relatedData.page[activeTab]" :per-page="10">
          </b-pagination>
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
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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

  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'

  export default {
    name: "Locality",
    components: {
      BFormInput,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
    },
    mixins: [formManipulation,autocompleteFieldManipulation],
    data() {
      return {
        activeTab: 'reference',
        relatedData: {
          reference:[], synonym: [], attachment:[], stratigraphy:[],
          page : {reference:1, synonym: 1, attachment:1, stratigraphy:1},
          count: 0
        },
        autocomplete: {
          loaders: { locality:false, stratigraphy_top:false,stratigraphy_base:false, agent:false },
          localityTypes: [], parent: [], extent: [], coordPrecision: [], coordMethod: [],
          coord_det_agent: [], country: [], county: [], parish: [], stratigraphy_top: [], stratigraphy_base: []
        },
        requiredFields: ['locality'],
        locality: {}
      }
    },

    computed: {
      commonLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },
      localityLabel() {
        return this.$i18n.locale === 'ee' ? 'locality' : 'locality_en'
      },
      stratigraphyLabel() {
        return this.$i18n.locale === 'ee' ? 'stratigraphy' : 'stratigraphy_en'
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
            this.removeUnnecessaryFields();
            this.$emit('data-loaded',this.locality)
            this.sendingData = false;
          } else {
            this.sendingData = false;
          }
        });

        // FETCH FIRST TAB RELATED DATA
        this.setActiveTab('reference')
      }
    },

    methods: {
      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)
        console.log(objectToUpload)
        if (this.isDefinedAndNotNull(objectToUpload.elevation)) uploadableObject.elevation = objectToUpload.elevation.toFixed(1)
        if (this.isDefinedAndNotNull(objectToUpload.type)) uploadableObject.type = objectToUpload.type.id
        if (this.isDefinedAndNotNull(objectToUpload.parent)) uploadableObject.parent = objectToUpload.parent.id
        if (this.isDefinedAndNotNull(objectToUpload.extent)) uploadableObject.extent = objectToUpload.extent.id
        if (this.isDefinedAndNotNull(objectToUpload.coord_det_precision)) uploadableObject.coord_det_precision = objectToUpload.coord_det_precision.id
        if (this.isDefinedAndNotNull(objectToUpload.coord_det_method)) uploadableObject.coord_det_method = objectToUpload.coord_det_method.id
        if (this.isDefinedAndNotNull(objectToUpload.coord_det_agent)) uploadableObject.coord_det_agent = objectToUpload.coord_det_agent.id
        if (this.isDefinedAndNotNull(objectToUpload.country)) uploadableObject.country = objectToUpload.country.id
        if (this.isDefinedAndNotNull(objectToUpload.stratigraphy_top)) uploadableObject.stratigraphy_top = objectToUpload.stratigraphy_top.id
        if (this.isDefinedAndNotNull(objectToUpload.stratigraphy_base)) uploadableObject.stratigraphy_base = objectToUpload.stratigraphy_base.id
        console.log('This object is sent in string format:\n'+JSON.stringify(uploadableObject))
        return JSON.stringify(uploadableObject)
      },
      removeUnnecessaryFields(){
        let copyFields = ['id','locality','locality_en','number','code','latitude','longitude','elevation','depth',
          'coordx','coordy','coord_system','stratigraphy_top_free','stratigraphy_base_free','maaamet_pa_id','eelis',
          'remarks_location','remarks','is_private', 'type','parent','extent','coord_det_precision','coord_det_method',
          'coord_det_agent','country','stratigraphy_top','stratigraphy_base']

        let vm = this;
        //copy only certain fields
        Object.entries(this.locality).forEach(entry => {
          if (copyFields.indexOf(entry[0]) < 0) {
            delete vm.locality[entry[0]]
          }
        });
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

      setActiveTab(type){
        this.activeTab = type;

        let query;
        if(type === 'reference') {
          query = fetchLocalityReference(this.$route.params.id,this.relatedData.page.reference)
        } else if(type === 'synonym') {
          query = fetchLocalitySynonym(this.$route.params.id,this.relatedData.page.synonym)
        } else if(type === 'attachment') {
          query = fetchLocalityAttachment(this.$route.params.id,this.relatedData.page.attachment)
        } else if(type === 'stratigraphy') {
          query = fetchLocalityStratigraphy(this.$route.params.id,this.relatedData.page.stratigraphy)
        }

        query.then(response => {
          this.relatedData[type] = this.handleResponse(response);
          this.relatedData.count = response.body.count;
        });

      }

    },
    watch: {
      'relatedData.page': {
        handler: function (newVal) {
          this.setActiveTab(this.activeTab)
        },
        deep: true
      }
    }

  }

</script>

<style scoped>

</style>
