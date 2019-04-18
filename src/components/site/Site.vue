<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>
    <b-alert show variant="warning" v-if="createRelationWith.data !== null">
      {{ createRelationWith.info }}
      <a class="small" href="javascript:void(0)" @click="navigateBack">
        <font-awesome-icon icon="external-link-alt"/>
      </a>
    </b-alert>
    <!-- STORAGE-->
    <fieldset class="border p-2 mb-2" ref="info">
      <legend class="w-auto" style="font-size: large;" :style="!block.info ? {'color':'blue'} : ''">Üldinfo
        <font-awesome-icon icon="project-diagram" @click="block.info = !block.info"/>
      </legend>
      <transition name="fade">
        <div v-if="block.info">
          <div class="row">
            <div class="col-md-6">
              <label class="p-0">{{ $t('site.name') }}:</label>
              <b-form-input id="name" v-model="site.name" type="text" maxlength="100"></b-form-input>
            </div>

            <div class="col-md-6">
              <!--<label class="p-0">{{ $t('site.name_en') }}:</label>-->
              <!--<b-form-input id="name_en" v-model="site.name_en" type="text" maxlength="100"></b-form-input>-->
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label class="p-0">{{ $t('site.number') }}:</label>
              <b-form-input id="name" v-model="site.number" type="text" maxlength="20"></b-form-input>
            </div>

            <div class="col-sm-6">
              <label class="p-0">{{ $t('site.project') }}:</label>
              <vue-multiselect class="align-middle" v-model="site.project" select-label=""
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
              <label :for="`date_start`" class="p-0">{{ $t('site.date_start') }}:</label>
              <datepicker id="date_start"
                          v-model="site.date_start"
                          use-utc="true"
                          lang="en"
                          :first-day-of-week="1"
                          type="datetime" format="DD MMM YYYY [at] HH:mm"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-sm-4">
              <label :for="`date_end`" class="p-0">{{ $t('site.date_end') }}:</label>
              <datepicker id="date_end"
                          v-model="site.date_end"
                          use-utc="true "
                          lang="en"
                          :first-day-of-week="1"
                          type="datetime" format="DD MMM YYYY [at] HH:mm"
                          input-class="form-control"></datepicker>
            </div>
            <div class="col-sm-3">
              <label class="p-0">&ensp;</label>
              <button class="btn btn-outline-primary form-control" @click="finishWork"
                      v-if="site.date_end === undefined || site.date_end === null"> Finish and close
              </button>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;" :style="!block.location ? {'color':'blue'} : ''">{{
        $t('site.location') }}
        <font-awesome-icon icon="globe" @click="block.location = !block.location"/>
      </legend>
      <transition name="fade">
        <div v-if="block.location">
          <div class="row">
            <div class="col-md-4">
              <label class="p-0">{{ $t('site.latitude') }}:</label>
              <b-form-input id="latitude" v-model="site.latitude" :state="isDefinedAndNotNull(site.latitude)"
                            type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label class="p-0">{{ $t('site.longitude') }}:</label>
              <b-form-input id="longitude" v-model="site.longitude" :state="isDefinedAndNotNull(site.longitude)"
                            type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label class="p-0">{{ $t('site.location_accuracy') }}:</label>
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
                <map-component-2 :gps-coords="true" v-if="showCollapseMap " mode="single" v-bind:locations="[]"
                                 v-bind:location="{ lat: site.latitude ? (site.latitude).toString() : null, lng: site.longitude ? (site.longitude).toString() : null }"
                                 v-on:get-location="updateLocation"></map-component-2>
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
              <vue-multiselect class="align-middle" v-model="site.locality" select-label=""
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
              <label class="p-0">{{ $t('site.remarks_location') }}:</label>
              <b-form-textarea id="remarks_location" v-model="site.remarks_location" type="text" size="sm" :rows="2"
                               :max-rows="20"/>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;" :style="!block.description ? {'color':'blue'} : ''">{{
        $t('site.description') }} | {{ $t('site.remarks') }}
        <font-awesome-icon icon="pen-fancy" @click="block.description = !block.description"/>
      </legend>
      <transition name="fade">
        <div v-if="block.description">
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
        </div>
      </transition>
    </fieldset>

    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit" ref="files">
      <legend class="w-auto" style="font-size: large;" :style="!block.files ? {'color':'blue'} : ''">Files
        <font-awesome-icon icon="folder-open" @click="block.files = !block.files"/>
      </legend>
      <transition name="fade">
        <div v-if="block.files">
          <multimedia-component v-on:file-uploaded="addFileAsRelatedData"/>
          <file-table :attachments="relatedData.attachment_link" :object="'site'"
                      v-if="relatedData.attachment_link.length > 0"/>
        </div>
      </transition>
    </fieldset>

    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit" ref="samples">
      <legend class="w-auto" style="font-size: large;" :style="!block.samples ? {'color':'blue'} : ''">Related samples
        <font-awesome-icon icon="vial" @click="block.samples = !block.samples"/>
      </legend>
      <transition name="fade">
        <div class="row" v-if="block.samples">
          <div class="col-sm-12 mb-2">
          <span class="float-right">
            <button class="btn btn-outline-primary mb-2" @click="addSample">{{ $t('add.new') }}</button>
          </span>
            <div class="table-responsive-sm">
              <linked-sample-table :siteID="$route.params.id"></linked-sample-table>
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


  export default {
    name: "Site",
    components: {
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
    mixins: [formManipulation, autocompleteFieldManipulation, localStorageMixin],

    data() {
      return this.setInitialData()
    },
    computed: {
      createRelationWith() {
        return this.$store.state['createRelationWith']
      }
    },
    created() {
      this.loadFullInfo();
    },
    mounted() {
      this.$root.$on('sidebar-user-action', this.handleSidebarUserAction);
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
          shortcuts: [
            {
              text: 'Today',
              onClick: () => {
                this.time3 = [new Date(), new Date()]
              }
            }
          ],
          block: {info: true, location: true, description: true, files: true, samples: true}

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
          fetchSite(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.site = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.site)
              this.removeUnnecessaryFields(this.site, this.copyFields);
              if (this.site.latitude === null && this.site.longitude === null) {
                this.setLocationDataIfExists();
              }

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
          this.setLocationDataIfExists();
          this.setSiteNameAndProjectIfPreviousExists();
          this.loadListOfExistingProjects();
        }

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
          query = fetchSiteAttachment(this.$route.params.id, this.relatedData.page.attachment_link)
        } else if (object === 'sample') {
          query = fetchLinkedSamples(this.$route.params.id, this.relatedData.page.sample)
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
          paginateBy: 10,
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
      addFileAsRelatedData(data) {
        console.log('file uploaded');

        let formData = new FormData();

        formData.append('data', JSON.stringify({
          description: data.type + ' for site: ' + this.site.id,
          author: this.currentUser.id,
          date_created: this.formatDateForUpload(new Date()),
          is_private: 1
        }));
        console.log(formData.data)
        formData.append('file0', data);

        try {
          this.saveData('attachment', formData, 'add/attachment/', false).then(savedObjectId => {
            console.log(savedObjectId)
            if (savedObjectId === undefined || savedObjectId === false) return;
            this.addRelationBetweenAnyObjectAndAttachment(savedObjectId, 'attachment_link', {
              object: 'site',
              id: this.site.id
            }).then(response => {
              this.$root.$emit('attachment-loading-status', true)
              this.loadRelatedData('attachment_link')
            });
          });
        } catch (e) {
          console.log('Attachment cannot not be added')
          console.log(e)
        }

      },

      addSample() {
        let isFull = false
        this.$store.commit('SET_SAMPLE_VIEW', {isFull});
        // relationObject.locality =
        let createRelationWith = {
          object: 'site', data: cloneDeep(this.site),
          relatedData: {isLastSampleExists: this.relatedData.sample.length > 0},
          info: this.$t('messages.siteSampleRelationInfo',
            {data: `ID: ${this.site.id} (${this.site.name})`})
        };
        this.$store.commit('CREATE_RELATION_OBJECT', {createRelationWith})
        this.$router.push({path: '/sample/add'});
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
      handleSidebarUserAction(userAction) {
        if (userAction.action === 'addSample') this.addSample()
      },

      saveAndNavigateBack(object) {
        this.add(true, object)
        this.navigateBack(object)
      },

      navigateBack(object) {
        if (this.createRelationWith.object !== null) this.$router.push({path: '/' + this.createRelationWith.object + '/' + this.createRelationWith.data.id})

        //special case (SITE do not have LIST view)
        let activeProject = this.getActiveProject();
        console.log(activeProject)
        activeProject === null ?
          this.$router.push({path: '/project'}) :
          this.$router.push({path: '/project/' + activeProject})

      },
    },
    beforeRouteLeave(to, from, next) {
      //Do not remove relation object in case user created new relation object for simplified sample form
      if (this.$store.state['sampleView'].isFull)
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


</style>
