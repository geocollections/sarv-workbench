<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- STORAGE-->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Üldinfo
        <font-awesome-icon icon="project-diagram"/></legend>

      <div class="row">
        <div class="col-md-6">
          <label class="p-0">{{ $t('site.name') }}:</label>
          <b-form-input id="name" v-model="site.name" :state="isDefinedAndNotNull(site.name)" type="text" maxlength="100"></b-form-input>
        </div>

        <div class="col-md-6">
          <label class="p-0">{{ $t('site.name_en') }}:</label>
          <b-form-input id="name_en" v-model="site.name_en" type="text" maxlength="100"></b-form-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label class="p-0">{{ $t('site.number') }}:</label>
          <b-form-input id="name" v-model="site.number" type="text" maxlength="20"></b-form-input>
        </div>

        <div class="col-sm-6">
          <label class="p-0">{{ $t('site.project') }}:</label>
          <vue-multiselect class="align-middle" v-model="site.project" select-label="" deselect-label="Can't remove this value"
                           :label="nameLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                           :loading="autocomplete.loaders.project"
                           :options="autocomplete.project" :searchable="true" @search-change="autcompleteProjectSearch"
                           :allow-empty="true"  :show-no-results="false" :max-height="600"
                           :open-direction="'bottom'">
            <template slot="singleLabel" slot-scope="{ option }"><strong>
              {{ $i18n.locale=== 'ee' ? option.name :option.name_en }}</strong> </template>
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <label :for="`date_start`" class="p-0">{{ $t('site.date_start') }}:</label>
          <datepicker id="date_start"
                      v-model="site.date_start"
                      use-utc="true "
                      lang="en"
                      :first-day-of-week="1"
                      format="DD MMM YYYY"
                      input-class="form-control"></datepicker>
        </div>

        <div class="col-sm-4">
          <label :for="`date_end`"  class="p-0">{{ $t('site.date_end') }}:</label>
          <datepicker id="date_end"
                      v-model="site.date_end"
                      use-utc="true "
                      lang="en"
                      :first-day-of-week="1"
                      format="DD MMM YYYY"
                      input-class="form-control"></datepicker>
        </div>
      </div>
    </fieldset>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">{{ $t('site.location') }}
        <font-awesome-icon icon="globe"/></legend>

      <div class="row">
        <div class="col-md-4">
          <label class="p-0">{{ $t('site.latitude') }}:</label>
          <b-form-input id="latitude" v-model="site.latitude" type="number"></b-form-input>
        </div>

        <div class="col-md-4">
          <label class="p-0">{{ $t('site.longitude') }}:</label>
          <b-form-input id="longitude" v-model="site.longitude" type="number"></b-form-input>
        </div>

        <div class="col-md-4">
          <label class="p-0">{{ $t('site.location_accuracy') }}:</label>
          <b-form-input id="longitude" v-model="site.location_accuracy" type="number"></b-form-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <label class="p-0">{{ $t('site.elevation') }}:</label>
          <b-form-input id="elevation" v-model="site.elevation" type="number"></b-form-input>
        </div>

        <div class="col-md-4">
          <label class="p-0">{{ $t('site.elevation_accuracy') }}:</label>
          <b-form-input id="elevation_accuracy" v-model="site.elevation_accuracy" type="number"></b-form-input>
        </div>

        <div class="col-md-4">
          <label class="p-0">{{ $t('site.coord_det_method') }}:</label>
          <vue-multiselect v-model="site.coord_det_method"
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
      <div class="row">
        <div class="col-md-4">
          <label class="p-0">{{ $t('site.extent') }}:</label>
          <b-form-input id="extent" v-model="site.extent" type="number"></b-form-input>
        </div>

        <div class="col-md-4">
          <label class="p-0">{{ $t('site.depth') }}:</label>
          <b-form-input id="depth" v-model="site.depth" type="number"></b-form-input>
        </div>

        <div class="col-md-4">
          <label class="p-0">{{ $t('site.locality') }}:</label>
          <vue-multiselect class="align-middle" v-model="site.locality" select-label="" deselect-label="Can't remove this value"
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

      <div class="row">
        <div class="col-sm-12 mb-2">
          <label class="p-0">{{ $t('site.remarks_location') }}:</label>
          <b-form-textarea id="remarks_location" v-model="site.remarks_location" type="text" size="sm" :rows="2" :max-rows="20"/>
        </div>
      </div>
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
            <map-component v-bind:location="{ lat: site.latitude ? (site.latitude).toString() : null, lng: site.longitude ? (site.longitude).toString() : null }" v-on:get-location="updateLocation" />
          </b-collapse>
        </div>
      </div>

    </fieldset>
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">{{ $t('site.description') }} | {{ $t('site.remarks') }}
        <font-awesome-icon icon="pen-fancy"/></legend>

      <div class="row">
        <div class="col-sm-12 mb-2">
          <b-form-textarea id="remarks" v-model="site.description" type="text" size="sm" :rows="2" :max-rows="20"/>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 mb-2">
          <b-form-textarea id="remarks" v-model="site.remarks" type="text" size="sm" :rows="2" :max-rows="20"/>
        </div>
      </div>
    </fieldset>


    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'site')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'site')">
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('site')">
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import Datepicker from 'vue2-datepicker'
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
  import cloneDeep from 'lodash/cloneDeep'
  import {
    fetchSites,
    fetchSite,
    fetchListCoordinateMethod,
    fetchProjectAttachment
  } from "../../assets/js/api/apiCalls";
  import MapComponent from "../partial/MapComponent";



    export default {
      name: "Site",
      components: {
        MapComponent,
        FontAwesomeIcon,
        Datepicker,
        VueMultiselect,
        Spinner,
      },
      mixins: [formManipulation,autocompleteFieldManipulation],

      data() { return this.setInitialData() },

      created() {
        this.loadFullInfo();
      },

      methods: {
        setInitialData() {
          return {
            searchHistory:'siteSearchHistory',
            relatedData: this.setDefaultRalatedData(),
            copyFields : ['id','name','name_en','number','project','date_start','date_end','coord_det_method',
              'locality','latitude','longitude','location_accuracy','elevation','elevation_accuracy','extent','depth',
              'remarks_location','description','remarks'
            ],
            autocomplete: {
              loaders: { project:false,attachment:false,coordMethod:false,locality:false
              },
              project: [],attachment:[],coordMethod:[],locality:[]
            },
            requiredFields: ['name'],
            site: {},
            previousRecord: {},
            nextRecord: {},
            searchParameters: this.setDefaultSearchParameters(),
            showCollapseMap: true
          }
        },

        reloadData(){
          Object.assign(this.$data, this.setInitialData());
          this.loadFullInfo()
        },

        loadFullInfo() {
          fetchListCoordinateMethod().then(response => {
            this.autocomplete.coordMethod = this.handleResponse(response);
          });

          if(this.$route.meta.isEdit) {
            this.sendingData = true;
            fetchSite(this.$route.params.id).then(response => {
              let handledResponse = this.handleResponse(response);
              if(handledResponse.length > 0) {
                this.site = this.handleResponse(response)[0];
                this.fillAutocompleteFields(this.site)
                this.removeUnnecessaryFields(this.site, this.copyFields);

                this.site.related_data = {};
                this.$emit('data-loaded', this.site)
                this.$emit('set-object','site');
                this.sendingData = false;
                this.getListRecords('site')
              } else {
                this.sendingData = false;
              }
            });
            // this.loadRelatedData('attachment_link');
          } else{
            this.setLocationDataIfExists();
          }

        },

        setDefaultRalatedData(){
          return {
            attachment_link:[],
            page : {attachment_link:1},
            count: {attachment_link:0}
          }
        },

        formatDataForUpload(objectToUpload) {
          let uploadableObject = cloneDeep(objectToUpload)

          if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';
          if (this.isDefinedAndNotNull(objectToUpload.date_start)) uploadableObject.date_start = this.formatDateForUpload(objectToUpload.date_start);
          if (this.isDefinedAndNotNull(objectToUpload.date_end)) uploadableObject.date_end = this.formatDateForUpload(objectToUpload.date_end);

          //autocomplete fields
          if (this.isDefinedAndNotNull(objectToUpload.project)) uploadableObject.project = objectToUpload.project.id
          if (this.isDefinedAndNotNull(objectToUpload.coord_det_method)) uploadableObject.coord_det_method = objectToUpload.coord_det_method.id
          if (this.isDefinedAndNotNull(objectToUpload.locality)) uploadableObject.locality = objectToUpload.locality.id
          //add related data
          // uploadableObject.related_data = {}
          // if(this.isDefinedAndNotEmpty(this.relatedData.attachment_link)) uploadableObject.related_data.attachment = this.relatedData.attachment_link

          console.log(uploadableObject)
          return JSON.stringify(uploadableObject)
        },
        fillAutocompleteFields(obj){
          this.site.project = {name:obj.project__name, name_en:obj.project__name_en,id:obj.project}
          this.site.coord_det_method = {value:obj.coord_det_method__value, value_en:obj.coord_det_method__value_en,id:obj.coord_det_method}
        },

        fillRelatedDataAutocompleteFields(obj,type){
          let relatedData = cloneDeep(obj)
          obj = [];
          relatedData.forEach(entity => {
            if(type === 'attachment_link') obj.push(entity)
          });
          return obj
        },

        loadRelatedData(object){
          let query;

          if(object === 'attachment_link') {
            query = fetchProjectAttachment(this.$route.params.id,this.relatedData.page.attachment_link)
          }
          return new Promise(resolve => {
            query.then(response => {
              //projectagent do not have count value
              if (response.status === 200) this.relatedData[object] = response.body.results;

              this.relatedData.count[object] = response.body.count;
              this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object],object);
              resolve(true)
            });
          });
        },

        //check required fields for related data
        checkRequiredFields(type){ },

        formatRelatedData(objectToUpload)  {
          let uploadableObject = cloneDeep(objectToUpload);
          uploadableObject.site = this.site.id;

          // console.log(JSON.stringify(uploadableObject));
          return JSON.stringify(uploadableObject)
        },


        fetchList(localStorageData) {
          let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
          return new Promise((resolve) => {
            resolve(fetchSites(params))
          });
        },

        setDefaultSearchParameters() {
          return {
            id: null,
            page: 1,
            paginateBy: 50,
            orderBy: '-id',
          }
        },

        customLabelForAttachment(option) {
          return this.$i18n.locale === 'ee' ? `${option.id} - (${option.description}) (${option.author__agent})` :
            `${option.id} - (${option.description_en}) (${option.author__agent})`
        },

        addRelatedDataAttachment(option){
          if(typeof this.relatedData.attachment_link === 'undefined') this.relatedData.attachment_link = [];
          this.relatedData.attachment_link.push(option)
        },

        setLocationDataIfExists(){
          this.getGPSLocation().then(currentGPSLocation => {
            if(currentGPSLocation === null) return;
            this.$set(this.site,'latitude', currentGPSLocation.latitude);
            this.$set(this.site,'longitude', currentGPSLocation.longitude);
            this.$set(this.site,'location_accuracy', currentGPSLocation.accuracy);

            this.site.coord_det_method = {id:6,value:'GPS',value_en:'GPS' };
          });
        },

        updateLocation(location) {
          this.site.latitude = location.lat.toFixed(6)
          this.site.longitude = location.lng.toFixed(6)
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

  /* Map height */
  #collapseMap {
    height: 50vh;
  }
</style>
