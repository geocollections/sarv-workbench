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
        <span class="col ml-3 mt-3 custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">
            <label class="custom-control-label" for="customSwitch">{{showCollapseMap ? 'Map enabled' : 'Map disabled'}}</label>
          </span>
      </div>
      <div class="row mb-2">
        <div class="col">
          <b-collapse v-model="showCollapseMap" id="collapseMap">
            <map-component  v-bind:locations="[]" v-bind:location="{ lat: site.latitude ? (site.latitude).toString() : null, lng: site.longitude ? (site.longitude).toString() : null }" v-on:get-location="updateLocation" />
          </b-collapse>
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

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Files
        <font-awesome-icon icon="folder-open"/></legend>

        <multimedia-component v-on:file-uploaded="addFileAsRelatedData"/>
        <div class="col-sm-12">
          <div class="d-flex flex-row  flex-wrap mt-2" v-if="relatedData.attachment_link.length > 0">
              <div class="mt-2" v-for="(file, key) in relatedData.attachment_link">
                <div class="img-container p-1">
                  <font-awesome-icon v-if="file.uuid_filename !== null && ['mp3','wav'].indexOf(file.uuid_filename.split('.')[1]) > -1"  style="height: 10rem" size="7x" icon="file-audio"/>
                  <font-awesome-icon v-if="file.uuid_filename !== null && ['mp4'].indexOf(file.uuid_filename.split('.')[1]) > -1"  style="height: 10rem" size="7x" icon="file-video"/>
                  <img v-if="file.uuid_filename !== null && ['mp4'].indexOf(file.uuid_filename.split('.')[1]) === -1" :src="composeFileUrl(file.uuid_filename)" alt="Image preview..." class="img-thumbnail thumbnail-preview responsive image" style="width:100%;margin-top: 3vh">
                  <font-awesome-icon v-if="file.uuid_filename === null"  style="height: 10rem" size="7x" icon="file"/>
                  <div class="middle flex flex-inline">
                    <button class="btn btn-primary mb-2 mr-1 btn-sm" @click="openGeoInNewWindow({object:'attachment',id:file.id})"><font-awesome-icon icon="external-link-alt"/></button>
                    <button class="btn btn-danger mb-2 btn-sm" @click="relatedData.attachment_link.splice(key,1)"><font-awesome-icon icon="trash-alt"/></button>
                    <div style="background-color:#5e676a;color:white; width: 20vh">
                      <span style="font-size: small">{{file.date_created}}<br/>{{file.author__agent}}</span>
                    </div>

                  </div>
                  <div class="mt-1" style="background-color:#056384;color:white; width: 23.5vh;min-height:10vh">
                    <span class="p-1" style="font-size: small">{{file.original_filename}}</span>
                  </div>
                </div>
              </div>

          </div>
        </div>
    </fieldset>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Related samples
        <font-awesome-icon icon="vial"/></legend>

      <div class="row">
        <div class="col-sm-12 mb-2">
          <span class="float-right">
            <button class="btn btn-primary mb-2" @click="openSampleModal">{{ $t('add.new') }}</button>
          </span>
          <div class="table-responsive-sm" v-if="relatedData.sample.length > 0">
            <table class="table table-hover table-bordered">
              <thead class="thead-light">
                <tr>
                  <th>ID</th>
                  <th>{{ $t('sample.number') }}</th>
                  <th>{{ $t('sample.locality') }}</th>
                  <th>{{ $t('sample.agent_collected') }}</th>
                </tr>
              </thead>
            <tbody>
              <tr v-for="(sample,idx) in relatedData.sample">
                <td @click="windowOpenNewTab('sample','/sample/'+sample.id)">
                  <font-awesome-icon size="1x" icon="eye"/> {{sample.id}}
                </td>
                <td>{{sample.number}}</td>
                <td v-translate="{et:sample.locality__locality,en:sample.locality__locality_en}"></td>
                <td>{{sample.agent_collected__agent}}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </fieldset>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false,'site')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true,'site')">
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
    fetchSiteAttachment,
    fetchLinkedSamples,
    fetchLastSiteName
  } from "../../assets/js/api/apiCalls";
  import MapComponent from "../partial/MapComponent";
  import FileInputComponent from "../partial/MultimediaComponent";
  import MultimediaComponent from "../partial/MultimediaComponent";
  import {toastError} from "../../assets/js/iziToast/iziToast";
  import GeocollectionsLink from "../partial/GeocollectionsLink";


    export default {
      name: "Site",
      components: {
        GeocollectionsLink,
        MultimediaComponent,
        FileInputComponent,
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
            requiredFields: [],
            site: {},
            previousRecord: {},
            nextRecord: {},
            searchParameters: this.setDefaultSearchParameters(),
            showCollapseMap: true,

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
                if(this.site.latitude !== null && this.site.longitude !== null) {
                  this.setLocationDataIfExists();
                }
                this.site.related_data = {};
                this.$emit('data-loaded', this.site)
                this.$emit('set-object','site');
                this.sendingData = false;
                this.getListRecords('site')

                //set relation object as site
                let createRelationWith = { object: 'site', data: this.site };
                this.$store.commit('CREATE_RELATION_OBJECT', { createRelationWith });

              } else {
                this.sendingData = false;
              }
            });

            this.loadRelatedData('attachment_link');
            this.loadRelatedData('sample');
          } else{
            this.setLocationDataIfExists();
            this.setSiteNameIfPreviousExists()
          }

        },

        setDefaultRalatedData(){
          return {
            new : {attachment_link:[]},
            attachment_link:[], sample:[],
            page : {attachment_link:1,sample:1},
            count: {attachment_link:0,sample:0}
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
          uploadableObject.related_data = {}
          // if(this.isDefinedAndNotEmpty(this.relatedData.new.attachment_link) && this.relatedData.attachment_link) {
          //   console.log(this.relatedData)
          //   this.relatedData.attachment_link = this.relatedData.attachment_link.concat(cloneDeep(this.relatedData.new.attachment_link))
          // }
          if(this.isDefinedAndNotEmpty(this.relatedData.attachment_link)) uploadableObject.related_data.attachment = this.relatedData.attachment_link

          console.log(uploadableObject)
          return JSON.stringify(uploadableObject)
        },
        fillAutocompleteFields(obj){
          this.site.project = {name:obj.project__name, name_en:obj.project__name_en,id:obj.project}
          this.site.coord_det_method = {value:obj.coord_det_method__value, value_en:obj.coord_det_method__value_en,id:obj.coord_det_method}
        },

        fillRelatedDataAutocompleteFields(obj,type){
          if(obj === undefined) return;
          let relatedData = cloneDeep(obj)
          obj = [];
          relatedData.forEach(entity => {
            if(type === 'attachment_link' || type === 'sample') obj.push(entity)
          });
          return obj
        },

        loadRelatedData(object){
          let query;

          if(object === 'attachment_link') {
            query = fetchSiteAttachment(this.$route.params.id,this.relatedData.page.attachment_link)
          } else if(object === 'sample') {
              query = fetchLinkedSamples(this.$route.params.id,this.relatedData.page.sample)
          }
          return new Promise(resolve => {
            query.then(response => {
              //projectagent do not have count value
              if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results: [];

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
            name: null,
            project: null,
            projectId: null,
            page: 1,
            paginateBy: 10,
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
        addFileAsRelatedData(data) {
          console.log('file uploaded');

          let formData = new FormData();
          formData.append('data', JSON.stringify({
            description:data.type +' for site: ' +this.site.id,
            author:this.currentUser.id,
            date_created:this.formatDateForUpload(new Date()),
            // attach_link__site: this.site.id ? this.site.id : null
          }));

          formData.append('file0', data);

          try {
            this.saveData('attachment',formData,'add/attachment/',false).then(savedObjectId => {
              if(savedObjectId === undefined || savedObjectId === false) return;
              this.addRelationBetweenAnyObjectAndAttachment(savedObjectId,'attachment_link').then(response => {
                this.$root.$emit('attachment-loading-status',true)
                this.loadRelatedData('attachment_link')
              });
            });
          } catch (e) {
            console.log('Attachment cannot not be added')
            console.log(e)
          }

        },

        openSampleModal(){

        },

        setSiteNameIfPreviousExists(){
          fetchLastSiteName(this.$route.params.id).then(name => {
            let tokenize = this.site.name.split(/[^0-9]/g);
            if(!isNaN(tokenize[tokenize.length-1]))
              this.site.name = parseInt(tokenize[tokenize.length-1])+1;
          });
        }
      },
      beforeRouteLeave(to, from, next) {
        this.$store.commit('REMOVE_RELATION_OBJECT');
        next()
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

  .img-container {
    position: relative;
    width: 25vh;
    text-align: center;
  }

  .image {
    opacity: 1;
    display: block;
    width: 100%;
    height: auto;
    transition: .2s ease;
    backface-visibility: hidden;
  }

  .middle {
    transition: .2s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
  }

  .img-container:hover .image {
    opacity: 0.3;
  }

  .img-container:hover .middle {
    opacity: 1;
  }

  .text {
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    padding: 16px 32px;
  }
</style>
