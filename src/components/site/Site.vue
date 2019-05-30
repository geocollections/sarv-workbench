<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <b-alert show variant="warning" v-if="createRelationWith.data !== null && createRelationWith.object === 'project'">
      {{ createRelationWith.info }}
      <!--<a class="small" href="javascript:void(0)" @click="navigateBack">-->
      <!--<font-awesome-icon icon="external-link-alt"/>-->
      <!--</a>-->
    </b-alert>
    <!--<b-alert show variant="warning" v-if="isDefinedAndNotNull(editSite)"> Ava vaatluspunkti eraldi tabil-->
    <!--<a class="small" href="javascript:void(0)" @click="windowOpenNewTab('site','/site/'+site.id)">-->
    <!--<font-awesome-icon icon="external-link-alt"/>-->
    <!--</a>-->
    <!--</b-alert>-->
    <!-- STORAGE-->

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info">
      <legend class="w-auto" :class="{'text-primary': !block.info}" @click="block.info = !block.info">
        {{ $t('site.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.info">
          <div class="row">
            <div class="col-md-6">
              <label :for="`name`">{{ $t('site.name') }}:</label>
              <b-form-input id="name" v-model="site.name" type="text" maxlength="100"></b-form-input>
            </div>

            <div class="col-md-6">
              <!--<label class="p-0">{{ $t('site.name_en') }}:</label>-->
              <!--<b-form-input id="name_en" v-model="site.name_en" type="text" maxlength="100"></b-form-input>-->
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <label :for="`number`">{{ $t('site.number') }}:</label>
              <b-form-input id="number" v-model="site.number" type="text" maxlength="20"></b-form-input>
            </div>

            <div class="col-sm-6">
              <label :for="`project`">{{ $t('site.project') }}:</label>
              <vue-multiselect class="align-middle" v-model="site.project" select-label=""
                               id="project"
                               deselect-label="Can't remove this value"
                               :label="nameLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.project"
                               :options="autocomplete.project" :searchable="true"
                               @search-change="autcompleteProjectSearch"
                               :allow-empty="true" :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>
                  {{ $i18n.locale=== 'ee' ? option.name :option.name_en }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4">
              <label :for="`date_start`">{{ $t('site.date_start') }}:</label>
              <datepicker id="date_start"
                          v-model="site.date_start"
                          use-utc="true"
                          lang="en"
                          :first-day-of-week="1"
                          type="datetime" format="DD MMM YYYY [at] HH:mm"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-sm-4">
              <label :for="`date_end`">{{ $t('site.date_end') }}:</label>
              <datepicker id="date_end"
                          v-model="site.date_end"
                          use-utc="true "
                          lang="en"
                          :first-day-of-week="1"
                          type="datetime" format="DD MMM YYYY [at] HH:mm"
                          input-class="form-control"></datepicker>
            </div>
            <div class="col-sm-3">
              <label>&ensp;</label>
              <button class="btn btn-outline-primary form-control" @click="finishWork" v-b-tooltip.hover
                      title="Finish and close"
                      v-if="site.date_end === undefined || site.date_end === null"> Finish
              </button>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- LOCATION -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" :class="{'text-primary': !block.location}" @click="block.location = !block.location">
        {{ $t('site.location') }}
        <font-awesome-icon icon="globe"/>
      </legend>

      <transition name="fade">
        <div v-if="block.location">

          <div class="row">
            <div class="col-md-4">
              <label :for="`latitude`">{{ $t('site.latitude') }}:</label>
              <b-form-input id="latitude" v-model="site.latitude" :state="isDefinedAndNotNull(site.latitude)"
                            type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`longitude`">{{ $t('site.longitude') }}:</label>
              <b-form-input id="longitude" v-model="site.longitude" :state="isDefinedAndNotNull(site.longitude)"
                            type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`location_accuracy`">{{ $t('site.location_accuracy') }}:</label>
              <b-form-input id="location_accuracy" v-model="site.location_accuracy" type="number"
                            min="0"></b-form-input>
            </div>
          </div>

          <div class="row">
            <span class="col ml-3 mt-3 custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">
              <label class="custom-control-label"
                     for="customSwitch">{{showCollapseMap ? 'Map enabled' : 'Map disabled'}}</label>
            </span>
          </div>

          <div class="row mb-2">
            <div class="col-lg-12">
              <b-collapse v-model="showCollapseMap" id="collapseMap">
                <!--<map-component v-bind:locations="[]" v-bind:location="{ lat: site.latitude ? (site.latitude).toString() : null, lng: site.longitude ? (site.longitude).toString() : null }" v-on:get-location="updateLocation" />-->
                <map-component-2 :gps-coords="true" v-if="showCollapseMap && !isLatitudeUndefinedInEditView"
                                 mode="single" v-bind:locations="[]"
                                 v-bind:location="{ lat: site.latitude ? (site.latitude).toString() : null, lng: site.longitude ? (site.longitude).toString() : null }"
                                 v-on:get-location="updateLocation"></map-component-2>
              </b-collapse>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <label :for="`elevation`">{{ $t('site.elevation') }}:</label>
              <b-form-input id="elevation" v-model="site.elevation" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`elevation_accuracy`">{{ $t('site.elevation_accuracy') }}:</label>
              <b-form-input id="elevation_accuracy" v-model="site.elevation_accuracy" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`coord_det_method`">{{ $t('site.coord_det_method') }}:</label>
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
              <label :for="`extent`">{{ $t('site.extent') }}:</label>
              <b-form-input id="extent" v-model="site.extent" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`depth`">{{ $t('site.depth') }}:</label>
              <b-form-input id="depth" v-model="site.depth" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`locality`">{{ $t('site.locality') }}:</label>
              <vue-multiselect class="align-middle" v-model="site.locality" select-label=""
                               id="locality"
                               deselect-label="Can't remove this value"
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

          <div class="row">
            <div class="col-sm-12 mb-2">
              <label :for="`remarks_location`">{{ $t('site.remarks_location') }}:</label>
              <b-form-textarea id="remarks_location" v-model="site.remarks_location" type="text" size="sm" :rows="2"
                               :max-rows="20"/>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- DESCRIPTION -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" :class="{'text-primary': !block.description}" @click="block.description = !block.description">
        {{ $t('site.description') }} | {{ $t('site.remarks') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>
      <transition name="fade">
        <div v-if="block.description">
          <div class="row">
            <div class="col-sm-12 mb-2">
              <b-form-textarea id="description" v-model="site.description" type="text" size="sm" :rows="2" :max-rows="20"/>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12 mb-2">
              <b-form-textarea id="remarks" v-model="site.remarks" type="text" size="sm" :rows="2" :max-rows="20"/>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit && site.id" ref="files">
      <legend class="w-auto" @click="block.files = !block.files" :class="{'text-primary': !block.files}">
        {{ $t('site.files') }}
        <font-awesome-icon icon="folder-open"/>
      </legend>

      <transition name="fade">
        <div v-if="block.files">
          <multimedia-component v-on:file-uploaded="addFiles" :recordOptions="true"/>
          <file-table :attachments="relatedData.attachment_link" :object="'site'"
                      v-if="relatedData.attachment_link.length > 0"/>
        </div>
      </transition>
    </fieldset>

    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit && site.id" ref="samples">
      <legend class="w-auto" @click="block.samples = !block.samples" :class="{'text-primary': !block.samples}">
        {{ $t('site.relatedSamples') }}
        <font-awesome-icon icon="vial"/>
      </legend>
      <transition name="fade">
        <div class="row" v-if="block.samples">
          <add-new-sample :sendingData="sendingData"></add-new-sample>
          <div class="col-sm-12 mb-2">
            <span class="float-left">
              <button class="btn btn-outline-primary mb-2" @click="addSample">{{ $t('add.new') }}</button>
            </span>
            <div class="table-responsive-sm" v-if="routeId">
              <linked-sample-table :siteID="routeId+''"></linked-sample-table>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="saveAndNavigateBack('site')"
                :title="$t('edit.buttons.saveAndLeave') ">
          <font-awesome-icon icon="door-open"/>
          {{ $t('edit.buttons.saveAndLeave') }}
        </button>

        <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData" @click="add(true,'site',true)"
                :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">
          <font-awesome-icon icon="save"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
          <!--{{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}-->
        </button>

        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="navigateBack('site')"
                :title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">
          <font-awesome-icon icon="ban"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import Datepicker from 'vue2-datepicker'
  import formManipulation from './../mixins/formManipulation'
  import autocompleteFieldManipulation from './../mixins/autocompleFormManipulation'
  import localStorageMixin from './../mixins/localStorageMixin'
  import cloneDeep from 'lodash/cloneDeep'
  import {
    fetchSites,
    fetchSite,
    fetchListCoordinateMethod,
    fetchSiteAttachment,
    fetchLinkedSamples,
    fetchLastSiteName,
    fetchActiveProjects
  } from "../../assets/js/api/apiCalls";
  import FileInputComponent from "../partial/MultimediaComponent";
  import MultimediaComponent from "../partial/MultimediaComponent";
  import {toastError} from "../../assets/js/iziToast/iziToast";
  import GeocollectionsLink from "../partial/GeocollectionsLink";
  import MapComponent2 from "../partial/MapComponent2";
  import FileTable from "../partial/FileTable";
  import Sidebar from "../partial/Sidebar";
  import SaveButtons from "../partial/SaveButtons";
  import LinkedSampleTable from "../sample/LinkedSampleTable";
  import AddNewSample from "./addNewSampleModal";

  import sidebarMixin from './../mixins/sidebarMixin'

  export default {
    name: "Site",
    components: {
      AddNewSample,
      LinkedSampleTable,
      SaveButtons,
      Sidebar,
      FileTable,
      MapComponent2,
      GeocollectionsLink,
      MultimediaComponent,
      FileInputComponent,
      FontAwesomeIcon,
      Datepicker,
      VueMultiselect,
      Spinner,
    },
    mixins: [formManipulation, autocompleteFieldManipulation, localStorageMixin, sidebarMixin],
    // props:['editSite'], USED FOR MODAL
    data() {
      return this.setInitialData()
    },
    computed: {
      createRelationWith() {
        return this.lsPullCreateRelationWith();
        // return this.$store.state['createRelationWith']
      },
      sidebarUserAction() {
        return this.$store.state['sidebarUserAction']
      },
      routeId() {
        return this.isDefinedAndNotNull(this.editSite) ? this.editSite.id : this.$route.params.id
      },

      // Checks if site object has latitude key and is edit view, using this check while rendering mapComponent,
      // because I don't want mapComponent to render if site object is still empty (haven't got data from API yet)
      isLatitudeUndefinedInEditView() {
        return typeof this.site.latitude === 'undefined' && this.$route.meta.isEdit
      },
      // editSite() {
      //   return this.$store.state['createRelationWith'].edit
      // }

    },
    created() {
      this.activeObject = 'site';
      const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
      let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
      this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
        searchHistory: 'siteSearchHistory',
        defaultSearch: this.setDefaultSearchParameters(), search: params, request: 'FETCH_SITES', title: 'header.sites',
        object: this.activeObject, field: 'name'
      })

      this.loadFullInfo();

    },
    updated() {
      this.$localStorage.set('activeSite', this.$data.site.id);
    },
    methods: {
      setInitialData() {
        return {
          searchHistory: 'siteSearchHistory',
          relatedData: this.setDefaultRalatedData(),
          copyFields: ['id', 'name', 'name_en', 'number', 'project', 'date_start', 'date_end', 'coord_det_method',
            'locality', 'latitude', 'longitude', 'location_accuracy', 'elevation', 'elevation_accuracy', 'extent', 'depth',
            'remarks_location', 'description', 'remarks'
          ],
          autocomplete: {
            loaders: {
              project: false, attachment: false, coordMethod: false, locality: false
            },
            project: [], attachment: [], coordMethod: [], locality: []
          },
          requiredFields: ['latitude', 'longitude'],
          site: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          attachmentLinkSaved: -1,
          block: {
            info: !this.$route.meta.isEdit,
            location: this.$route.meta.isEdit,
            description: false,
            files: true,
            samples: true
          }
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        fetchListCoordinateMethod().then(response => {
          this.autocomplete.coordMethod = this.handleResponse(response);
        });

        if (this.$route.meta.isEdit && this.createRelationWith.data === null || this.isDefinedAndNotNull(this.createRelationWith.edit)) {
          this.sendingData = true;

          fetchSite(this.routeId).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.site = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.site)
              this.removeUnnecessaryFields(this.site, this.copyFields);
              // if (this.site.latitude === null && this.site.longitude === null) {
              //   this.setLocationDataIfExists();
              // }

              this.site.related_data = {};
              this.$emit('data-loaded', this.site)
              this.$emit('set-object', 'site');
              this.sendingData = false;
              this.getListRecords('site')

              //set relation object as site
              // let createRelationWith = { object: 'site', data: this.site };
              // this.$store.commit('CREATE_RELATION_OBJECT', { createRelationWith });

            } else {
              this.sendingData = false;
            }
          });

          this.loadRelatedData('attachment_link');
          // this.loadRelatedData('sample');
        } else {
          this.block.info = true
          this.setLocationDataIfExists();
          this.setSiteNameAndProjectIfPreviousExists();
          this.loadListOfExistingProjects();
        }
        this.$root.$on('add-or-edit-site-from-modal', this.handleUserChoiceFromModal);
      },

      setDefaultRalatedData() {
        return {
          new: {attachment_link: []},
          attachment_link: [], sample: [],
          page: {attachment_link: 1, sample: 1},
          count: {attachment_link: 0, sample: 0}
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload)

        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';
        if (this.isDefinedAndNotNull(objectToUpload.date_start)) uploadableObject.date_start = this.formatDateForUpload(objectToUpload.date_start, false);
        if (this.isDefinedAndNotNull(objectToUpload.date_end)) uploadableObject.date_end = this.formatDateForUpload(objectToUpload.date_end, false);

        if (this.isDefinedAndNotNull(objectToUpload.location_accuracy)) uploadableObject.location_accuracy =
          typeof uploadableObject.location_accuracy === 'string' ? parseInt(objectToUpload.location_accuracy).toFixed(2) : objectToUpload.location_accuracy.toFixed(2);

        if (this.isDefinedAndNotNull(objectToUpload.project)) uploadableObject.project = objectToUpload.project.id
        if (this.isDefinedAndNotNull(objectToUpload.coord_det_method)) uploadableObject.coord_det_method = objectToUpload.coord_det_method.id
        if (this.isDefinedAndNotNull(objectToUpload.locality)) uploadableObject.locality = objectToUpload.locality.id


        if (saveRelatedData) {
          uploadableObject.related_data = {}
          uploadableObject.related_data.attachment = this.relatedData.attachment_link
        }

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },
      fillAutocompleteFields(obj) {
        this.site.project = {name: obj.project__name, name_en: obj.project__name_en, id: obj.project}
        this.site.coord_det_method = {
          value: obj.coord_det_method__value,
          value_en: obj.coord_det_method__value_en,
          id: obj.coord_det_method
        }
        this.site.locality = {
          id: obj.locality__id,
          locality_en: obj.locality__locality_en,
          locality: obj.locality__locality
        }
      },

      fillRelatedDataAutocompleteFields(obj, type) {
        if (obj === undefined) return;
        let relatedData = cloneDeep(obj)
        obj = [];
        relatedData.forEach(entity => {
          if (type === 'attachment_link' || type === 'sample') obj.push(entity)
        });
        return obj
      },

      loadRelatedData(object) {
        let query;

        if (object === 'attachment_link') {
          query = fetchSiteAttachment(this.routeId, this.relatedData.page.attachment_link)
        } else if (object === 'sample') {
          query = fetchLinkedSamples(this.routeId, this.relatedData.page.sample)
        }
        return new Promise(resolve => {
          query.then(response => {
            //projectagent do not have count value
            if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results : [];

            this.relatedData.count[object] = response.body.count;
            this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);

            resolve(true)
          });
        });
      },

      //check required fields for related data
      checkRequiredFields(type) {
      },

      formatRelatedData(objectToUpload) {
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
          paginateBy: 8,
          orderBy: '-id',
        }
      },

      customLabelForAttachment(option) {
        return this.$i18n.locale === 'ee' ? `${option.id} - (${option.description}) (${option.author__agent})` :
          `${option.id} - (${option.description_en}) (${option.author__agent})`
      },

      addRelatedDataAttachment(option) {
        if (typeof this.relatedData.attachment_link === 'undefined') this.relatedData.attachment_link = [];
        this.relatedData.attachment_link.push(option)
      },

      setLocationDataIfExists() {
        this.getGPSLocation().then(currentGPSLocation => {
          if (currentGPSLocation === null) return;
          this.$set(this.site, 'latitude', currentGPSLocation.latitude === null ? null : currentGPSLocation.latitude.toFixed(6));
          this.$set(this.site, 'longitude', currentGPSLocation.longitude === null ? null : currentGPSLocation.longitude.toFixed(6));
          this.$set(this.site, 'location_accuracy', currentGPSLocation.accuracy);

          this.site.coord_det_method = {id: 6, value: 'GPS', value_en: 'GPS'};
        });
      },

      updateLocation(location) {
        this.site.latitude = location.lat.toFixed(6)
        this.site.longitude = location.lng.toFixed(6)
      },
      addFiles(data) {
        this.addFileAsRelatedData(data, 'site');
      },

      addSample() {
        //Because we open sample in separate window it has clean default storage. In this case store values in LocalStorage
        // let isFull = false
        // this.$store.commit('SET_SAMPLE_VIEW', {isFull});
        this.lsPushSampleView(false);
        let createRelationWith = {
          object: 'site', data: cloneDeep(this.site),
          relatedData: {isLastSampleExists: this.relatedData.sample.length > 0},
          info: this.$t('messages.siteSampleRelationInfo',
            {data: `ID: ${this.site.id} (${this.site.name})`})
        };
        this.$store.commit('CREATE_RELATION_OBJECT', {createRelationWith})
        // this.$emit('show-new-sample-modal')
        // this.$router.push({path: '/sample/add'});

        this.lsPushCreateRelationWith(createRelationWith);
        this.windowOpenNewTab('sample', '/sample/add')
        // let routeData = this.$router.resolve({ path:'/sample/add'});
        // window.open(routeData.href, '_blank', 'width=750,height=750');
      },

      setSiteNameAndProjectIfPreviousExists() {
        return new Promise(resolve => {
          if (this.createRelationWith.data === null) resolve(false)
          let project = this.createRelationWith.data
          fetchLastSiteName(project.id).then(response => {
            let resp = response.body.results
            if (resp && resp.length > 0) {
              let newName = this.calculateNextName(resp[0].name)
              this.$set(this.site, 'name', newName);
              this.$set(this.site, 'date_start', new Date());
              this.$set(this.site, 'project', {name: project.name, name_en: project.name_en, id: project.id});
              resolve(true)
            } else resolve(false)
          });
        });
      },

      finishWork() {
        // set finish time
        this.site.date_end = new Date();
        this.saveAndNavigateBack('site')
      },
      removeAttachmentRelation(idx) {
        this.relatedData.attachment_link.splice(idx, 1);
        this.add(true, 'site', true);
      },

      loadListOfExistingProjects() {
        let vm = this, currentActiveProjects = cloneDeep(this.$localStorage.get('activeProject', 'fallbackValue'));
        if (currentActiveProjects && currentActiveProjects !== 'fallbackValue' && currentActiveProjects.length > 0) {
          fetchActiveProjects(currentActiveProjects.join(", ")).then(response => {
            this.autocomplete.project = this.handleResponse(response)
            if (!this.isDefinedAndNotNull(this.site.project))
              this.$set(this.site, 'project', {
                name: this.autocomplete.project[0].name,
                name_en: this.autocomplete.project[0].name_en,
                id: this.autocomplete.project[0].id
              });
          })
        }
      },

      // handleSidebarUserAction(userAction) {
      //   console.log(userAction)
      //   if (userAction.action === 'addSample') this.addSample()
      //   else if(userAction.action === 'navigate') {
      //     let element = this.$refs[userAction.choice];
      //     let sizeOfHeader = 60;
      //     if(element) window.scrollTo(0,  element.offsetTop-sizeOfHeader);
      //   } else if(userAction.action === 'save') {
      //     this.saveAndNavigateBack('site')
      //   } else if(userAction.action === 'cancel') {
      //     this.navigateBack()
      //   }
      // },

      saveAndNavigateBack(object) {
        let vm = this
        this.add(false, object, false, true).then(resp => {
          vm.navigateBack()
        })
      },

      navigateBack() {
        if (this.createRelationWith.object !== null) {

          if (this.createRelationWith.data === null) {
            window.close();
          }

          if (this.createRelationWith.edit === null) {
            this.$router.push({path: '/' + this.createRelationWith.object + '/' + this.createRelationWith.data.id})
          } else {
            this.$root.$emit('close-new-site-modal')
          }
        } else {
          //special case (SITE do not have LIST view)
          let activeProject = this.getActiveProject();
          activeProject === null ?
            this.$router.push({path: '/project'}) :
            this.$router.push({path: '/project/' + activeProject})
        }
      },
      handleUserChoiceFromModal(choice) {
        console.log(choice)
        let vm = this
        if (choice === 'SAVE_AND_LEAVE') {
          this.add(false, 'site', false, true).then(resp => {
            vm.$root.$emit('close-new-site-modal')
          })
        } else if (choice === 'SAVE') {
          this.add(true, 'site', false, false)
        }
      },
    },

    beforeRouteLeave(to, from, next) {
      //Do not remove relation object in case user created new relation object for simplified sample form
      if (this.$store.state['sampleView'].isFull)
        this.$store.commit('REMOVE_RELATION_OBJECT');
      next()
    },

    watch: {
      'routeId': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      },
      'sidebarUserAction'(newval, oldval) {
        this.handleSidebarUserAction(newval, 'site')
      },
    }
  }
</script>

<style scoped>

  .tooltip .fade {
    background-color: red !important;
  }

  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
