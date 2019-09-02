<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border-top px-2 mb-2" ref="info" id="block-info">
      <legend class="w-auto my-0" :class="{'text-primary': !block.info}" @click="block.info = !block.info">
        {{ $t('site.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-show="block.info">
          <div class="row">
            <div class="col-md-6">
              <label :for="`name`">{{ $t('site.name') }}:</label>
              <b-form-input id="name" v-model="site.name" type="text" maxlength="100"></b-form-input>
            </div>

            <div class="col-md-6">
              <!--<label class="p-0">{{ $t('site.name_en') }}:</label>-->
              <!--<b-form-input id="name_en" v-model="site.name_en" type="text" maxlength="100"></b-form-input>-->
              <label :for="`project`">{{ $t('site.project') }}:</label>
              <vue-multiselect v-model="site.project"
                               id="project"
                               :label="nameLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.project"
                               :options="autocomplete.project"
                               @search-change="autocompleteProjectSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4">
              <label :for="`date_start`">{{ $t('site.date_start') }} (yyyy-mm-dd hh:mm):</label>
              <datepicker id="date_start"
                          v-model="site.date_start"
                          :use-utc="true"
                          lang="en"
                          :first-day-of-week="1"
                          format="YYYY-MM-DD HH:mm"
                          confirm
                          type="datetime"
                          :typeable="true"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-sm-4">
              <label :for="`date_end`">{{ $t('site.date_end') }} (yyyy-mm-dd hh:mm):</label>
              <datepicker id="date_end"
                          v-model="site.date_end"
                          :use-utc="true"
                          lang="en"
                          :first-day-of-week="1"
                          format="YYYY-MM-DD HH:mm"
                          confirm
                          type="datetime"
                          :typeable="true"
                          input-class="form-control"></datepicker>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- LOCATION -->
    <fieldset class="border-top px-2 mb-2" id="block-location">
      <legend class="w-auto my-0" :class="{'text-primary': !block.location}" @click="block.location = !block.location">
        {{ $t('site.location') }}
        <font-awesome-icon icon="globe"/>
      </legend>

      <transition name="fade">
        <div v-show="block.location">

          <div class="row">
            <div class="col-md-4">
              <label :for="`latitude`">{{ $t('site.latitude') }}:</label>
              <b-form-input id="latitude" v-model="site.latitude" :state="isNotEmpty(site.latitude)"
                            type="number" step="0.000001" @input="handleCoordinateChange"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`longitude`">{{ $t('site.longitude') }}:</label>
              <b-form-input id="longitude" v-model="site.longitude" :state="isNotEmpty(site.longitude)"
                            type="number" step="0.000001" @input="handleCoordinateChange"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`location_accuracy`">{{ $t('site.location_accuracy') }}:</label>
              <b-form-input id="location_accuracy" v-model="site.location_accuracy" type="number"
                            min="0"></b-form-input>
            </div>
          </div>

<!--          <div class="row">-->
<!--            <span class="col ml-3 mt-3 custom-control custom-switch">-->
<!--              <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">-->
<!--              <label class="custom-control-label"-->
<!--                     for="customSwitch">{{showCollapseMap ? 'Map enabled' : 'Map disabled'}}</label>-->
<!--            </span>-->
<!--          </div>-->

          <div class="d-flex justify-content-start mt-3">
            <div class="align-self-center">
              <vs-switch id="map-switch" v-model="showCollapseMap">
              <span slot="on">ON</span>
              <span slot="off">OFF</span>
            </vs-switch>
            </div>
            <div class="align-self-center">
              <label class="m-0" :for="`map-switch`"><i class="far fa-map"></i> {{showCollapseMap ? $t('site.mapEnabled') : $t('site.mapDisabled')}}</label>
            </div>
          </div>

          <div class="row my-2" v-if="showCollapseMap">
            <div class="col-lg-12">
              <b-collapse v-model="showCollapseMap" id="collapseMap">
                <map-component v-if="showCollapseMap && !isLatitudeUndefinedInEditView"
                               :gps-coords="true"
                               mode="single"
                               module="site"
                               v-bind:locations="[]"
                               v-bind:location="{ lat: site.latitude ? (site.latitude).toString() : null, lng: site.longitude ? (site.longitude).toString() : null }"
                               v-on:update-coordinates="updateLocation"/>
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
                               class="high-z-index"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
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
              <vue-multiselect v-model="site.locality"
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
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }"><strong>
                  {{ $i18n.locale=== 'ee' ? option.locality :option.locality_en }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12 mb-2">
              <label :for="`remarks_location`">{{ $t('site.remarks_location') }}:</label>
              <editor :data.sync="site.remarks_location"/>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- DESCRIPTION -->
    <fieldset class="border-top px-2 mb-2" id="block-description">
      <legend class="w-auto my-0 mb-1" :class="{'text-primary': !block.description}" @click="block.description = !block.description">
        {{ $t('site.description') }} | {{ $t('site.remarks') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>
      <transition name="fade">
        <div v-show="block.description">
          <div class="row">
            <div class="col-sm-12 mb-2">
              <editor :data.sync="site.description"/>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12 mb-2">
              <editor :data.sync="site.remarks"/>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <fieldset class="border-top px-2 mb-2" v-if="$route.meta.isEdit && site.id" id="block-files" ref="files">
      <legend class="w-auto my-0 mb-1" @click="block.files = !block.files" :class="{'text-primary': !block.files}">
        {{ $t('site.files') }}
        <font-awesome-icon icon="folder-open"/>
      </legend>

      <transition name="fade">
        <div v-show="block.files">
          <multimedia-component v-on:file-uploaded="addFiles" :recordOptions="true"/>
          <file-table :attachments="relatedData.attachment_link" :object="'site'"
                      v-if="relatedData.attachment_link.length > 0"/>
        </div>
      </transition>
    </fieldset>

    <fieldset class="border-top px-2 mb-2" v-if="$route.meta.isEdit && site.id" id="block-samples" ref="samples">
      <legend class="w-auto my-0 mb-1" @click="block.samples = !block.samples" :class="{'text-primary': !block.samples}">
        {{ $t('site.relatedSamples') }}
        <font-awesome-icon icon="vial"/>
      </legend>

      <transition name="fade">
        <div class="row" v-show="block.samples">

          <add-new-sample :sendingData="sendingData"></add-new-sample>

          <div class="col-sm-12 mb-2">
            <div class="row">
              <div class="col">
                <router-link class="btn btn-outline-primary mb-2" :to="{ name: 'Sample add', query: { site: JSON.stringify(site) } }" target="_blank">
                  {{ $t('add.new') }}
                </router-link>
              </div>
            </div>

            <linked-sample-table :siteID="$route.params.id" :samples="relatedData.sample"></linked-sample-table>
          </div>
        </div>
      </transition>
    </fieldset>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import Datepicker from 'vue2-datepicker'
  import formManipulation from '../../mixins/formManipulation'
  import autocompleteMixin from '../../mixins/autocompleteMixin'
  import formSectionsMixin from '../../mixins/formSectionsMixin'
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
  import GeocollectionsLink from "../partial/GeocollectionsLink";
  import MapComponent from "../partial/MapComponent";
  import FileTable from "../partial/FileTable";
  import SaveButtons from "../partial/SaveButtons";
  import LinkedSampleTable from "../sample/LinkedSampleTable";
  import AddNewSample from "./addNewSampleModal";
  import sidebarMixin from "../../mixins/sidebarMixin";
  import Editor from "../partial/editor/Editor";

  export default {
    name: "Site",
    components: {
      Editor,
      AddNewSample,
      LinkedSampleTable,
      SaveButtons,
      FileTable,
      MapComponent,
      GeocollectionsLink,
      MultimediaComponent,
      FileInputComponent,
      FontAwesomeIcon,
      Datepicker,
      VueMultiselect,
      Spinner,
    },
    mixins: [formManipulation, autocompleteMixin, formSectionsMixin, sidebarMixin],
    // props:['editSite'], USED FOR MODAL
    data() {
      return this.setInitialData()
    },
    computed: {
      sidebarUserAction() {
        return this.$store.state['sidebarUserAction']
      },

      // Checks if site object has latitude key and is edit view, using this check while rendering mapComponent,
      // because I don't want mapComponent to render if site object is still empty (haven't got data from API yet)
      isLatitudeUndefinedInEditView() {
        return typeof this.site.latitude === 'undefined' && this.$route.meta.isEdit
      },

      activeProject() {
        return this.$store.state['activeProject']
      }

    },
    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'siteSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_SITES',
          title: 'header.sites',
          object: 'site',
          field: 'name',
          block: this.block
        })
      } else {
        // Add view
        this.$set(this.site, 'date_start', new Date());

        if (this.activeProject) {
          this.site.project = { id: this.activeProject.id, name: this.activeProject.name, name_en: this.activeProject.name_en };
          this.setSiteName(this.site.project.id)
        }
      }

      // Getting project (only from project view when user presses 'add site button' in detail view or in sidebar)
      if (this.$route.params.project) {
        const dataFromProject = this.$route.params.project;

        this.site.project = { id: dataFromProject.id, name: dataFromProject.name, name_en: dataFromProject.name_en };
        this.setSiteName(dataFromProject.id)
      }

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
          copyFields: ['id', 'name', 'name_en', 'project', 'date_start', 'date_end', 'coord_det_method',
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

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'site');

          fetchSite(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.site = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.site);
              this.removeUnnecessaryFields(this.site, this.copyFields);

              this.site.related_data = {};
              this.$emit('data-loaded', this.site);
              this.sendingData = false;
              // this.getListRecords('site')

            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
            }
          });

          this.loadRelatedData('attachment_link');
          this.loadRelatedData('sample');
        } else {
          // this.block.info = true
          // this.setLocationDataIfExists();
          // this.setSiteNameAndProjectIfPreviousExists();
          // this.loadListOfExistingProjects();
        }
        this.$root.$on('add-or-edit-site-from-modal', this.handleUserChoiceFromModal);
      },

      setDefaultRalatedData() {
        return {
          attachment_link: [],
          sample: [],
          new: {
            attachment_link: []
          },
          page: {
            attachment_link: 1,
          },
          count: {
            attachment_link: 0,
            sample: 0
          },
          // New format!!! I believe it is better for future updates
          searchParameters: {
            attachment_link: {
              page: 1,
              paginateBy: 25,
              orderBy: '-id'
            },
            sample: {
              page: 1,
              paginateBy: 25,
              orderBy: '-id'
            },
          }
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload);

        if (this.isNotEmpty(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';
        if (this.isNotEmpty(objectToUpload.date_start)) uploadableObject.date_start = this.formatDateForUpload(objectToUpload.date_start, false);
        if (this.isNotEmpty(objectToUpload.date_end)) uploadableObject.date_end = this.formatDateForUpload(objectToUpload.date_end, false);

        if (this.isNotEmpty(objectToUpload.location_accuracy)) uploadableObject.location_accuracy =
          typeof uploadableObject.location_accuracy === 'string' ? parseFloat(objectToUpload.location_accuracy).toFixed(2) : objectToUpload.location_accuracy.toFixed(2);

        if (this.isNotEmpty(objectToUpload.project)) uploadableObject.project = objectToUpload.project.id;
        if (this.isNotEmpty(objectToUpload.coord_det_method)) uploadableObject.coord_det_method = objectToUpload.coord_det_method.id;
        if (this.isNotEmpty(objectToUpload.locality)) uploadableObject.locality = objectToUpload.locality.id;
        if (this.isNotEmpty(objectToUpload.latitude)) uploadableObject.latitude = parseFloat(objectToUpload.latitude).toFixed(6);
        if (this.isNotEmpty(objectToUpload.longitude)) uploadableObject.longitude = parseFloat(objectToUpload.longitude).toFixed(6);


        if (saveRelatedData) {
          uploadableObject.related_data = {};
          uploadableObject.related_data.attachment = this.relatedData.attachment_link
        }

        console.log('This object is sent in string format:');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },
      fillAutocompleteFields(obj) {
        this.site.project = {name: obj.project__name, name_en: obj.project__name_en, id: obj.project};
        this.site.coord_det_method = {
          value: obj.coord_det_method__value,
          value_en: obj.coord_det_method__value_en,
          id: obj.coord_det_method
        };
        this.site.locality = {
          id: obj.locality__id,
          locality_en: obj.locality__locality_en,
          locality: obj.locality__locality
        }
      },

      fillRelatedDataAutocompleteFields(obj, type) {
        if (obj === undefined) return;
        let relatedData = cloneDeep(obj);
        obj = [];
        relatedData.forEach(entity => {
          if (type === 'attachment_link' || type === 'sample') obj.push(entity)
        });
        return obj
      },

      loadRelatedData(object) {
        let query;

        if (object === 'attachment_link') {
          // Todo: update to so that it would use searchParameters object
          query = fetchSiteAttachment(this.$route.params.id, this.relatedData.page.attachment_link)
        } else if (object === 'sample') {
          query = fetchLinkedSamples(this.relatedData.searchParameters.sample, this.$route.params.id)
        }
        return new Promise(resolve => {
          query.then(response => {
            this.relatedData.count[object] = response.body.count;
            this.relatedData[object] = this.handleResponse(response);
            // this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);
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
        let params = this.isNotEmpty(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
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

      updateLocation(location, method, GPSPosition) {
        this.$set(this.site, 'latitude', location.lat.toFixed(6))
        this.$set(this.site, 'longitude', location.lng.toFixed(6))
        // this.site.latitude = location.lat.toFixed(6);
        // this.site.longitude = location.lng.toFixed(6);

        // If user chooses coordinates from map by clicking or dragging the marker then reset gps accuracy and coord_det_method
        if (method === 'GPS') {
          this.$set(this.site, 'location_accuracy', GPSPosition.coords.accuracy);
          this.$set(this.site, 'coord_det_method', {id: 6, value: 'GPS', value_en: 'GPS'});
        } else {
          this.$set(this.site, 'location_accuracy', null);
          this.$set(this.site, 'coord_det_method', null);
        }
      },

      addFiles(files) {
        this.addFileAsRelatedDataNew(files, 'site');
      },

      setSiteName(projectId) {
        fetchLastSiteName(projectId).then(response => {
          if (response.body.results && response.body.results.length > 0) {
            let newName = this.calculateNextName(response.body.results[0].name);
            this.$set(this.site, 'name', newName);
          }
        })
      },

      setSiteNameAndProjectIfPreviousExists() {
        return new Promise(resolve => {
          if (this.createRelationWith.data === null) resolve(false);
          let project = this.createRelationWith.data;
          fetchLastSiteName(project.id).then(response => {
            let resp = response.body.results;
            if (resp && resp.length > 0) {
              let newName = this.calculateNextName(resp[0].name);
              this.$set(this.site, 'name', newName);
              this.$set(this.site, 'date_start', new Date());
              this.$set(this.site, 'project', {name: project.name, name_en: project.name_en, id: project.id});
              resolve(true)
            } else resolve(false)
          });
        });
      },

      removeAttachmentRelation(idx) {
        this.relatedData.attachment_link.splice(idx, 1);
        this.add(true, 'site', true);
      },

      loadListOfExistingProjects() {
        let vm = this, currentActiveProjects = cloneDeep(this.$localStorage.get('activeProject', 'fallbackValue'));
        if (currentActiveProjects && currentActiveProjects !== 'fallbackValue' && currentActiveProjects.length > 0) {
          fetchActiveProjects(currentActiveProjects.join(", ")).then(response => {
            this.autocomplete.project = this.handleResponse(response);
            if (!this.isNotEmpty(this.site.project))
              this.$set(this.site, 'project', {
                name: this.autocomplete.project[0].name,
                name_en: this.autocomplete.project[0].name_en,
                id: this.autocomplete.project[0].id
              });
          })
        }
      },

      handleUserChoiceFromModal(choice) {
        console.log(choice);
        let vm = this;
        if (choice === 'SAVE_AND_LEAVE') {
          this.add(false, 'site', false, true).then(resp => {
            vm.$root.$emit('close-new-site-modal')
          })
        } else if (choice === 'SAVE') {
          this.add(true, 'site', false, false)
        }
      },

      // Resetting accuracy and coord det method because user changed coordinates manually
      handleCoordinateChange(event) {
        this.site.location_accuracy = null;
        this.site.coord_det_method = null;
      },
    },

    watch: {
      '$route.params.id': {
        handler: function (newVal, oldVal) {
          this.reloadData()
        },
        deep: true
      },
      'sidebarUserAction'(newVal) {
        this.$_handleUserAction(newVal, 'site', this.site)
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
