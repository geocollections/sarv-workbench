<template>
  <div class="photo-archive">

    <div class="row mt-4" v-if="attachment !== null">

      <!-- FILE -->
      <div class="col-sm-6 mb-4 text-center">
        <file-preview :data="data"/>
      </div>

      <!-- FILE INFORMATION -->
      <div class="col-sm-6">
        <file-information :data="data"/>
      </div>
    </div>

    <!-- AUTHOR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('specimenImage.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.author"
                         id="author"
                         track-by="id"
                         :options="autocomplete.authors"
                         :internal-search="false"
                         :preserve-search="true"
                         v-bind:class="{ valid: authorState, invalid: !authorState }"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
        <b-form-text v-if="!authorState">{{ $t('add.errors.author') }}.</b-form-text>
      </div>


      <div class="col-sm-2">
        <label :for="`author_free`">{{ $t('photoArchive.authorFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="author_free"
                      v-model="edit.author_free"
                      :state="authorState"
                      type="text"></b-form-input>
        <b-form-text v-if="!authorState">{{ $t('add.errors.authorMultiple') }}.</b-form-text>
      </div>
    </div>

    <!-- DATE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_created`">{{ $t('photoArchive.dateCreated') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_created"
                    v-model="edit.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>


      <div class="col-sm-2">
        <label :for="`date_created_free`">{{ $t('photoArchive.dateCreatedFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_created_free" v-model="edit.date_created_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- LOCALITY -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_place`">{{ $t('photoArchive.imagePlace') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_place" v-model="edit.image_place" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('photoArchive.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.locality"
                         id="locality"
                         track-by="id"
                         :options="autocomplete.localities"
                         :label="localityLabel"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getLocalities"
                         :loading="searchingLocalities"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult">
            <b v-show="!localityQuerySmall">{{ $t('messages.inputNoResults') }}</b>
            <b v-show="localityQuerySmall">{{ $t('add.inputs.autocompleteSearch', { num: '3' }) }}</b>
          </template>
        </vue-multiselect>
      </div>
    </div>

    <!-- LOCATION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_latitude`">{{ $t('photoArchive.imageLatitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_latitude" v-model="edit.image_latitude" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`image_longitude`">{{ $t('photoArchive.imageLongitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_longitude" v-model="edit.image_longitude" type="number"></b-form-input>
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
      <div class="col-md-6 offset-md-3">
        <b-collapse v-model="showCollapseMap" id="collapseMap">
          <map-component v-bind:location="{ lat: edit.image_latitude, lng: edit.image_longitude }" v-on:get-location="updateLocation" />
        </b-collapse>
      </div>
    </div>

    <!-- OBJECT and PEOPLE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_object`">{{ $t('photoArchive.imageObject') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_object" v-model="edit.image_object" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`image_people`">{{ $t('photoArchive.imagePeople') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_people" v-model="edit.image_people" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_description`">{{ $t('photoArchive.imageDescription') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="image_description" v-model="edit.image_description" type="text" size="sm"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>
      </div>


      <div class="col-sm-2">
        <label :for="`image_description_en`">{{ $t('photoArchive.imageDescriptionEn') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="image_description_en" v-model="edit.image_description_en" type="text" size="sm"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>
      </div>
    </div>

    <!-- KEYWORDS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`keywords`">{{ $t('photoArchive.keywords') }}:</label>
      </div>

      <div class="col-9 mb-2">
        <vue-multiselect v-model="edit.tags"
                         id="keywords"
                         :tag-placeholder="$t('add.inputs.keywordsAdd')"
                         :placeholder="$t('add.inputs.keywords')"
                         label="name"
                         track-by="name"
                         :options="myKeywords"
                         :multiple="true"
                         :taggable="true"
                         :show-labels="false"
                         @tag="addKeyword"></vue-multiselect>
      </div>

      <div class="col-1 mb-2">
        <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')" :disabled="!removeKeywords"
                @click="edit.tags = null">
          <font-awesome-icon icon="trash-alt"></font-awesome-icon>
        </button>
      </div>
    </div>

    <!-- LICENCE and COPYRIGHT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`licence`">{{ $t('photoArchive.licence') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.licence"
                         id="licence"
                         :options="autocomplete.licences"
                         @open="maybeGetLicences"
                         track-by="id"
                         label="licence"
                         :loading="searchingLicences"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false"></vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`copyright_agent`">{{ $t('photoArchive.copyrightAgent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.copyright_agent"
                         id="copyright_agent"
                         track-by="id"
                         :options="autocomplete.copyrightAgents"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- IMAGE TYPE and DEVICE -->
    <div class="row">
      <!--<div class="col-sm-2">-->
      <!--<label :for="`device`">{{ $t('photoArchive.device') }}:</label>-->
      <!--</div>-->

      <!--<div class="col-sm-4 mb-2">-->
      <!--<vue-multiselect v-model="edit.device"-->
      <!--id="device"-->
      <!--:options="autocomplete.devices"-->
      <!--@open="maybeGetDevices"-->
      <!--track-by="id"-->
      <!--label="name"-->
      <!--:loading="searchingDevices"-->
      <!--:placeholder="$t('add.inputs.autocomplete')"-->
      <!--:show-labels="false">-->
      <!--<template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
      <!--</vue-multiselect>-->
      <!--</div>-->

      <div class="col-sm-2">
        <label :for="`image_type`">{{ $t('photoArchive.imageType') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.image_type"
                         id="image_type"
                         :options="autocomplete.imageTypes"
                         @open="maybeGetImageType"
                         track-by="id"
                         :label="imageTypeLabel"
                         :loading="searchingImageTypes"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`device_txt`">{{ $t('photoArchive.deviceTxt') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="device_txt" v-model="edit.device_txt" type="text"></b-form-input>
      </div>
    </div>

    <!-- AGENT and DATE DIGITISED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_digitised`">{{ $t('photoArchive.agentDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.agent_digitised"
                         id="agent_digitised"
                         track-by="id"
                         :options="autocomplete.agentsDigitised"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`date_digitised`">{{ $t('photoArchive.dateDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_digitised"
                    v-model="edit.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>
    </div>

    <!-- STARS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stars`">{{ $t('photoArchive.stars') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-select v-model="edit.stars">
          <option :value="5">{{ this.$t('main.rating5') }}</option>
          <option :value="4">{{ this.$t('main.rating4') }}</option>
          <option :value="3">{{ this.$t('main.rating3') }}</option>
          <option :value="2">{{ this.$t('main.rating2') }}</option>
          <option :value="1">{{ this.$t('main.rating1') }}</option>
          <option :value="0">{{ this.$t('main.rating0') }}</option>
          <option :value="-1">{{ this.$t('main.rating-1') }}</option>
          <option :value="-2">{{ this.$t('main.rating-2') }}</option>
          <option :value="-3">{{ this.$t('main.rating-3') }}</option>
          <option :value="-4">{{ this.$t('main.rating-4') }}</option>
          <option :value="-5">{{ this.$t('main.rating-5') }}</option>
        </b-form-select>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <!--<b-form-checkbox id="is_preferred" v-model="edit.is_preferred" value="1" unchecked-value="0">-->
        <!--{{ $t('photoArchive.preferred') }}-->
        <!--</b-form-checkbox>-->

        <b-form-checkbox id="is_private" v-model="edit.is_private" value="1" unchecked-value="0">
          {{ $t('photoArchive.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="edit.is_locked" value="1" unchecked-value="0">
          {{ $t('photoArchive.locked') }}
        </b-form-checkbox>
      </div>
    </div>


    <div class="row mt-3 mb-3">
      <div class="col" v-if="!isAttachmentLocked">
        <button class="btn btn-success mr-2 mb-2" @click="sendData(false)" >{{ $t('edit.buttons.save') }}</button>
        <button class="btn btn-success mr-2 mb-2" @click="sendData(true)" >{{ $t('edit.buttons.saveAndContinue') }}</button>
      </div>
      <div class="col-sm-6" v-else>
        <div class="alert alert-info">{{ $t('edit.locked') }}</div>
      </div>
    </div>

    <!-- LOGS -->
    <log table="attachment" :id="data.id"></log>


  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faChevronUp} from '@fortawesome/free-solid-svg-icons'
  import {faChevronDown} from '@fortawesome/free-solid-svg-icons'
  import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'

  import VueMultiselect from 'vue-multiselect'
  import Datepicker from 'vue2-datepicker'
  import cloneDeep from 'lodash/cloneDeep'
  import FileInformation from "@/components/partial/FileInformation.vue";
  import FilePreview from "@/components/partial/FilePreview.vue";
  import MapComponent from '@/components/partial/MapComponent'
  import Log from '@/components/partial/Log.vue'
  import { toastError } from "@/assets/js/iziToast/iziToast";

  library.add(faChevronUp, faChevronDown, faTrashAlt)

  export default {
    components: {
      FontAwesomeIcon,
      FilePreview,
      FileInformation,
      VueMultiselect,
      Datepicker,
      MapComponent,
      Log,
    },
    props:['data'],
    name: "PhotoArchive",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        attachment: this.data,
        localityQuerySmall: false,
        isFileLocked: this.data.is_locked,
        showCollapseMap: true,
        autocomplete: {
          authors: [],
          agentsDigitised: [],
          copyrightAgents: [],
          imageTypes: [],
          // devices: [],
          localities: [],
          licences: [],
        },
        searchingAuthors: false,
        searchingImageTypes: false,
        // searchingDevices: false,
        searchingLocalities: false,
        searchingLicences: false,
        myKeywords: [],
        edit: {
          author: this.buildAuthor(),
          author_free: this.data.author_free,
          date_created: this.data.date_created,
          date_created_free: this.data.date_created_free,
          image_place: this.data.image_place,
          locality: this.buildLocality(),
          image_latitude: this.data.image_latitude,
          image_longitude: this.data.image_longitude,
          image_object: this.data.image_object,
          image_people: this.data.image_people,
          image_description: this.data.image_description,
          image_description_en: this.data.image_description_en,
          tags: this.buildTags(),
          licence: this.buildLicence(),
          copyright_agent: this.buildCopyrightAgent(),
          // device: this.buildDevice(),
          device_txt: this.data.device_txt,
          agent_digitised: this.buildAgentDigitised(),
          // device_digitised: this.buildDeviceDigitised(),
          date_digitised: this.data.date_digitised,
          image_type: this.buildImageType(),
          stars: this.data.stars,
          // is_preferred: this.data.is_preferred ? '1' : '0',
          is_private: this.data.is_private ? '1' : '0',
          is_locked: this.data.is_locked ? '1' : '0'
        }
      }
    },

    computed: {
      authorState() {
        if (this.edit.author !== null) return true
        if (this.edit.author_free !== null) {
          return this.edit.author_free.length > 0
        }
        return false
      },

      localityLabel() {
        return this.$i18n.locale === 'ee' ? 'locality' : 'locality_en'
      },

      imageTypeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      isAttachmentLocked() {
        return this.isFileLocked
      },

      removeKeywords() {
        if (this.edit.tags !== null) {
          return this.edit.tags.length > 0
        }
        return false
      },
    },

    created: function () {
      // Gets keywords from local storage
      const photoArchiveKeywords = this.$localStorage.get('photoArchiveKeywords', 'fallbackValue')
      if (photoArchiveKeywords !== 'fallbackValue' && photoArchiveKeywords.length > 0) this.myKeywords = photoArchiveKeywords
    },

    methods: {

      /******************
       *** SEND START ***
       ******************/

      sendData(continueEditing) {
        if (true) {
          const formattedData = this.formatDataForEdit(this.edit)
          this.$emit('edit-data', formattedData, continueEditing)
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }
      },

      formatDataForEdit(unformattedData) {
        let uploadableData = cloneDeep(unformattedData)

        // Building correct fields
        if (unformattedData.author !== null) uploadableData.author = unformattedData.author.id
        if (unformattedData.image_type !== null) uploadableData.image_type = unformattedData.image_type.id
        // if (unformattedData.device !== null) uploadableData.device = unformattedData.device.id
        if (unformattedData.agent_digitised !== null) uploadableData.agent_digitised = unformattedData.agent_digitised.id
        // if (unformattedData.device_digitised !== null) uploadableData.device_digitised = unformattedData.device_digitised.id
        if (unformattedData.locality !== null) uploadableData.locality = unformattedData.locality.id
        if (unformattedData.licence !== null) uploadableData.licence = unformattedData.licence.id
        if (unformattedData.copyright_agent !== null) uploadableData.copyright_agent = unformattedData.copyright_agent.id
        if (unformattedData.tags !== null) {
          if (unformattedData.tags.length !== 0) {
            let arrayOfKeywords = unformattedData.tags.map(function (word) {
              return word['name']
            })
            uploadableData.tags = arrayOfKeywords.join('|')
          } else {
            uploadableData.tags = null
          }
        }
        if (unformattedData.date_created !== null) {
          if (typeof unformattedData.date_created === 'string') uploadableData.date_created = unformattedData.date_created.split('T')[0]
          else uploadableData.date_created = unformattedData.date_created.toISOString().split('T')[0]
        }
        if (unformattedData.date_digitised !== null) {
          if (typeof unformattedData.date_digitised === 'string') uploadableData.date_digitised = unformattedData.date_digitised.split('T')[0]
          else uploadableData.date_digitised = unformattedData.date_digitised.toISOString().split('T')[0]
        }

        console.log('This object is sent in string format:')
        console.log(uploadableData)

        return JSON.stringify(uploadableData)
      },

      /******************
       ***  SEND END  ***
       ******************/



      /**************************
       *** AUTOCOMPLETE START ***
       **************************/

      getAuthors(query, id) {
        if (query.length > 0) {

          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'agent/?multi_search=value:' + query + ';fields:agent,forename,surename;lookuptype:icontains&format=json'

          this.searchingAuthors = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count === 0) {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = []
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = []
                else this.autocomplete.authors = [];
              }
              else {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = response.body.results
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = response.body.results
                else this.autocomplete.authors = response.body.results;
              }
            }
            this.searchingAuthors = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingAuthors = false;
          })
        }
      },

      getLocalities(query) {
        if (query.length > 2) {
          this.localityQuerySmall = false

          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'locality/?multi_search=value:' + query + ';fields:locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en&format=json'

          this.searchingLocalities = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count === 0) {
                this.autocomplete.localities = []
              } else {
                this.autocomplete.localities = response.body.results
              }
            }
            this.searchingLocalities = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingLocalities = false;
          })
        } else {
          this.localityQuerySmall = true
        }
      },

      maybeGetLicences() {
        return this.autocomplete.licences.length <= 0 ? this.getLicences() : null
      },

      getLicences() {
        this.searchingLicences = true;

        this.$http.get(this.apiUrl + 'list_licence/', {
          params: {
            fields: 'id,licence',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.licences = response.body.results
            }
          }
          this.searchingLicences = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingLicences = false;
        })
      },

      // maybeGetDevices() {
      //   return this.autocomplete.devices.length <= 0 ? this.getDevices() : null
      // },

      // getDevices() {
      //   this.searchingDevices = true;
      //
      //   this.$http.get(this.apiUrl + 'device/', {params: {distinct: 'true', format: 'json'}}).then(response => {
      //     console.log(response)
      //     if (response.status === 200) {
      //       if (response.body.count > 0) {
      //
      //         // Skips null and empty values
      //         const devices = response.body.results
      //         for (let device in devices) {
      //           if (devices[device].name !== null && devices[device].name) {
      //             this.autocomplete.devices.push(devices[device])
      //           }
      //         }
      //
      //         // this.autocomplete.devices = response.body.results;
      //       }
      //     }
      //     this.searchingDevices = false;
      //   }, errResponse => {
      //     console.log('ERROR: ' + JSON.stringify(errResponse))
      //     this.searchingDevices = false;
      //   })
      // },

      maybeGetImageType() {
        return this.autocomplete.imageTypes.length <= 0 ? this.getImageType() : null
      },

      getImageType() {
        this.searchingImageTypes = true;

        this.$http.get(this.apiUrl + 'list_image_type/', {
          params: {
            value__isnull: 'false',
            value_en__isnull: 'false',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.imageTypes = response.body.results;
            }
          }
          this.searchingImageTypes = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingImageTypes = false;
        })
      },

      /**************************
       ***  AUTOCOMPLETE END  ***
       **************************/



      /***************************
       *** BUILD OBJECTS START ***
       ***************************/

      buildAuthor() {
        if (this.data.author_id !== null) {
          return {
            agent: this.data.author__agent,
            forename: this.data.author__forename,
            id: this.data.author_id,
            surename: this.data.author__surename
          }
        } else {
          return null
        }
      },

      buildLocality() {
        if (this.data.locality__id !== null) {
          return {
            id: this.data.locality__id,
            locality: this.data.locality__locality,
            locality_en: this.data.locality__locality_en,
          }
        } else {
          return null
        }
      },

      buildTags() {
        if (this.data.tags !== null) {
          let tagArray = this.data.tags.split('|')
          let tags = []

          for (let i = 0; i < tagArray.length; i++) {
            let tag = {}
            tag.name = tagArray[i]
            tags.push(tag)
          }
          return tags
        } else {
          return null
        }
      },

      buildLicence() {
        if (this.data.licence__id !== null) {
          return {
            id: this.data.licence__id,
            licence: this.data.licence__licence
          }
        } else {
          return null
        }
      },

      buildCopyrightAgent() {
        if (this.data.copyright_agent__id !== null) {
          return {
            agent: this.data.copyright_agent__agent,
            forename: this.data.copyright_agent__forename,
            id: this.data.copyright_agent__id,
            surename: this.data.copyright_agent__surename
          }
        } else {
          return null
        }
      },

      // buildDevice() {
      //   if (this.data.device__id !== null) {
      //     return {
      //       id: this.data.device__id,
      //       name: this.data.device__name
      //     }
      //   } else {
      //     return null
      //   }
      // },

      buildAgentDigitised() {
        if (this.data.agent_digitised__id !== null) {
          return {
            agent: this.data.agent_digitised__agent,
            forename: this.data.agent_digitised__forename,
            id: this.data.agent_digitised__id,
            surename: this.data.agent_digitised__surename
          }
        } else {
          return null
        }
      },

      // buildDeviceDigitised() {
      //   if (this.data.device_digitised__id !== null) {
      //     return {
      //       id: this.data.device_digitised__id,
      //       name: this.data.device_digitised__name
      //     }
      //   } else {
      //     return null
      //   }
      // },

      buildImageType() {
        if (this.data.image_type__id !== null) {
          return {
            id: this.data.image_type__id,
            value: this.data.image_type__value,
            value_en: this.data.image_type__value_en,
          }
        } else {
          return null
        }
      },

      /***************************
       ***  BUILD OBJECTS END  ***
       ***************************/



      /*********************
       *** HELPERS START ***
       *********************/

      addKeyword(newKeyword) {
        // let lowerCaseKeyword = newKeyword.toLowerCase()
        // const keyword = {name: lowerCaseKeyword}
        const keyword = {name: newKeyword}

        this.myKeywords.push(keyword)
        if (this.edit.tags === null) this.edit.tags = []
        this.edit.tags.push(keyword)
      },

      customLabelForAuthor(option) {
        if (option.agent === null && option.forename !== null && option.surename === null) return `${option.forename}`
        if (option.forename === null || option.surename === null) return `${option.agent}`
        else return `${option.agent} (${option.forename} ${option.surename})`
      },

      updateLocation(location) {
        this.edit.image_latitude = location.lat.toFixed(6)
        this.edit.image_longitude = location.lng.toFixed(6)
      },

      /*********************
       *** HELPERS END ***
       *********************/


    }
  }
</script>

<style scoped>
  /* Map height */
  #collapseMap {
    height: 50vh;
  }

  .remove-rating:hover {
    color: #dc3545;
    cursor: pointer;
  }

  .remove-rating:active {
    box-shadow: 0 0 10px 0.2rem rgba(220, 53, 69, 0.25);
    border-radius: 100%;
  }

  .margin-left-rating {
    margin-left: 0.45rem;
  }

  /* FIX: so that datepicker won't go under map in photo archive */
  .vue2leaflet-map {
    z-index: 950;
  }
</style>
