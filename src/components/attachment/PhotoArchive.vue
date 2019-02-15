<template>
  <div class="photo-archive">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- FILE -->
    <div class="row">
      <div class="col-sm-12 col-md-6 mb-2">
        <label :for="`files`"
               v-bind:class="{ dragging : isDragging }"
               v-on:dragover.stop.prevent="isDragging = true"
               v-on:dragleave.stop.prevent="isDragging = false"
               v-on:drop.stop.prevent="dropFile"
               class="btn btn-outline-primary btn-block">{{ $t('add.inputs.fileInput') }}
        </label>

        <div class="mt-2 alert alert-warning" v-if="files !== null && files.length >= 10">{{ $t('add.inputs.fileInputMaxError', { num: files.length }) }}</div>

        <div class="mt-2" v-if="files !== null && files.length > 0">
          <div v-if="files.length > 0" >

            <ul class="list-unstyled">
              <li class="mt-2" v-for="(file, key) in files">

                <span>
                  <img v-bind:ref="'image' + parseInt(key)" class="img-thumbnail thumbnail-preview" alt="Image preview..." />
                </span>

                <span><b>{{ file.name }}</b></span>

              </li>
            </ul>

          </div>
        </div>

        <!-- TODO: https://github.com/bootstrap-vue/bootstrap-vue/issues/1526, If multiple then accept does not take multiple formats. BUG -->
        <!-- TODO: BUG: If too many files or long filenames then breaks the input design -->
        <b-form-file v-model="files"
                     id="files"
                     :state="filesState"
                     multiple
                     plain
                     style="display: none"
                     ref="fileinput"
                     accept="image/*"
                     :placeholder="$t('add.inputs.fileInput')">
        </b-form-file>

        <b-form-text v-if="!filesState">{{ $t('add.errors.files') }}.</b-form-text>

      </div>

      <div class="col-sm-12 col-md-6 mb-2">
        <button class="btn btn-outline-danger" v-if="filesState" :disabled="sendingData" @click="clearFile">
          <span v-show="files.length === 1">{{ $tc('add.buttons.resetFile', 1) }}</span>
          <span v-show="files.length > 1">{{ $tc('add.buttons.resetFile', 2) }}</span>
        </button>
      </div>

    </div>

    <!-- AUTHOR and AUTHOR FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('photoArchive.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="photo_archive.author"
                         id="author"
                         :options="autocomplete.authors"
                         :internal-search="false"
                         :preserve-search="true"
                         v-bind:class="{ valid: authorState, invalid: !authorState }"
                         @search-change="getAuthors"
                         @input="resetImageset"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
        <b-form-text v-if="!authorState">{{ $t('add.errors.authorMultiple') }}.</b-form-text>
      </div>


      <div class="col-sm-2">
        <label :for="`author_free`">{{ $t('photoArchive.authorFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="author_free"
                      v-model="photo_archive.author_free"
                      :state="authorState"
                      type="text"></b-form-input>
        <b-form-text v-if="!authorState">{{ $t('add.errors.authorMultiple') }}.</b-form-text>
      </div>
    </div>

    <!-- IMAGESET -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`imageset`">{{ $t('photoArchive.imagesetId') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="photo_archive.imageset"
                         id="imageset"
                         :options="autocomplete.imagesets"
                         :internal-search="false"
                         v-bind:class="{ valid: imagesetState, invalid: !imagesetState }"
                         @search-change="getImagesets"
                         label="imageset_number"
                         :loading="searchingImagesets"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
        <b-form-text v-if="!imagesetState">{{ $t('add.errors.imagesetId') }}.</b-form-text>
      </div>

      <div class="col-sm-1 mb-2">
        <a href="javascript:void(0)" @click="openInNewWindow({object: 'imageset', height: 500})" class="btn btn-outline-info" :title="$t('add.inputs.newImageset')">
          <font-awesome-icon icon="plus"></font-awesome-icon>
        </a>
      </div>
    </div>

    <!-- DATE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_created`">{{ $t('photoArchive.dateCreated') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_created"
                    v-model="photo_archive.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>


      <div class="col-sm-2">
        <label :for="`date_created_free`">{{ $t('photoArchive.dateCreatedFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_created_free" v-model="photo_archive.date_created_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- LOCALITY -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_place`">{{ $t('photoArchive.imagePlace') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_place" v-model="photo_archive.image_place" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('photoArchive.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="photo_archive.locality"
                         id="locality"
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
        <b-form-input id="image_latitude" v-model="photo_archive.image_latitude" type="number" step="0.000001"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`image_longitude`">{{ $t('photoArchive.imageLongitude') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_longitude" v-model="photo_archive.image_longitude" type="number" step="0.000001"></b-form-input>
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
          <map-component v-bind:location="{ lat: photo_archive.image_latitude, lng: photo_archive.image_longitude }" v-on:get-location="updateLocation" />
        </b-collapse>
      </div>
    </div>

    <!-- OBJECT and PEOPLE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_object`">{{ $t('photoArchive.imageObject') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_object" v-model="photo_archive.image_object" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`image_people`">{{ $t('photoArchive.imagePeople') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_people" v-model="photo_archive.image_people" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_description`">{{ $t('photoArchive.imageDescription') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="image_description" v-model="photo_archive.image_description" type="text" size="sm"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>
      </div>


      <div class="col-sm-2">
        <label :for="`image_description_en`">{{ $t('photoArchive.imageDescriptionEn') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="image_description_en" v-model="photo_archive.image_description_en" type="text" size="sm"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>
      </div>
    </div>

    <!-- KEYWORDS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`keywords`">{{ $t('photoArchive.keywords') }}:</label>
      </div>

      <div class="col-9 mb-2">
        <vue-multiselect v-model="photo_archive.tags"
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
                @click="photo_archive.tags = null">
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
        <vue-multiselect v-model="photo_archive.licence"
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
        <vue-multiselect v-model="photo_archive.copyright_agent"
                         id="copyright_agent"
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

    <!-- IMAGE_TYPE and DEVICE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_type`">{{ $t('photoArchive.imageType') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="photo_archive.image_type"
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
        <b-form-input id="device_txt" v-model="photo_archive.device_txt" type="text"></b-form-input>
      </div>
    </div>

    <!-- AGENT and DATE DIGITISED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_digitised`">{{ $t('photoArchive.agentDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="photo_archive.agent_digitised"
                         id="agent_digitised"
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
                    v-model="photo_archive.date_digitised"
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
        <b-form-select v-model="photo_archive.stars">
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
        <!--<b-form-checkbox id="is_preferred" v-model="photo_archive.is_preferred" value="1" unchecked-value="0">-->
        <!--{{ $t('photoArchive.preferred') }}-->
        <!--</b-form-checkbox>-->

        <b-form-checkbox id="is_private" v-model="photo_archive.is_private" value="1" unchecked-value="0">
          {{ $t('photoArchive.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="photo_archive.is_locked" value="1" unchecked-value="0">
          {{ $t('photoArchive.locked') }}
        </b-form-checkbox>
      </div>
    </div>


    <div class="row mt-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false)">{{ $t('add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true)">{{ $t('add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset">{{ $t('add.buttons.clearFields') }}</button>
        <button class="btn btn-warning mr-2 mb-2" @click="clearLocalStorage">{{ $t('add.buttons.clearLocalStorage') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faPlus} from '@fortawesome/free-solid-svg-icons'
  import {faChevronUp} from '@fortawesome/free-solid-svg-icons'
  import {faChevronDown} from '@fortawesome/free-solid-svg-icons'
  import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'

  import Datepicker from 'vue2-datepicker'
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import MapComponent from '@/components/partial/MapComponent'
  import cloneDeep from 'lodash/cloneDeep'
  import EXIF from 'exif-js'
  import { toastSuccess, toastError, toastInfo } from "@/assets/js/iziToast/iziToast";

  library.add(faPlus, faChevronUp, faChevronDown, faTrashAlt)

  export default {
    components: {
      FontAwesomeIcon,
      VueMultiselect,
      Datepicker,
      Spinner,
      MapComponent,
    },
    name: "PhotoArchive",
    metaInfo: {
      link: [
        { rel: 'stylesheet', href: '/css/index.css' },
        // { rel: 'favicon', href: 'favicon.ico' }
      ]
    },
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
        files: null,
        fileMetaData: null,
        isDragging: false,
        showCollapseMap: true,
        localityQuerySmall: false,
        autocomplete: {
          authors: [],
          agentsDigitised: [],
          copyrightAgents: [],
          imagesets: [],
          imageTypes: [],
          localities: [],
          licences: [],
        },
        searchingAuthors: false,
        searchingImagesets: false,
        searchingImageTypes: false,
        searchingLocalities: false,
        searchingLicences: false,
        myKeywords: [],
        photo_archive: {
          specimen_image_attachment: 2,
          author: null,
          author_free: null,
          date_created: new Date(),
          date_created_free: null,
          image_type: {
            id: 5,
            value: 'digipilt',
            value_en: 'digital image'
          },
          // device: null,
          device_txt: null,
          agent_digitised: null,
          date_digitised: null,
          // device_digitised: null,
          imageset: null,
          // image_number: null,
          image_width: null,
          image_height: null,
          type: 1,
          attachment_format: null,
          image_place: null,
          locality: null,
          image_latitude: null,
          image_longitude: null,
          image_altitude: null,
          image_object: null,
          image_people: null,
          image_description: null,
          image_description_en: null,
          tags: null,
          stars: 0,
          licence: null,
          copyright_agent: null,
          // is_preferred: '1',
          is_private: '0',
          is_locked: '0',
          // user_added: null,
          // date_added: null,
          // user_changed: null,
          // date_changed: null,
          // database_id: null,
          // uuid: null,
          // uuid_filename: null,
          // filename: null,
        },
      }
    },

    watch: {
      'files': function (newVal) {

        this.resetMetaData()

        if (newVal.length > 0) {
          for (let i = 0; i < newVal.length; i++){
            let reader = new FileReader();

            reader.onload = (event) => {
              this.$refs['image' + parseInt(i)][0].src = event.target.result;
            }

            reader.readAsDataURL(this.files[i]);
          }
        }

        if (newVal.length === 1) {
          let fileReader = new FileReader()
          fileReader.readAsArrayBuffer(newVal[0])
          fileReader.onload = (event) => {
            this.fileMetaData = EXIF.readFromBinaryFile(event.target.result)
          }
        }
      },
      'fileMetaData': function (newVal) {
        console.log(newVal)
        if (newVal !== null && newVal !== false) {

          // DATE
          if (newVal.DateTimeOriginal !== null && typeof newVal.DateTimeOriginal !== 'undefined') {
            let formattedDate = this.$moment(newVal.DateTimeOriginal, 'YYYY:MM:DD HH:mm:ss')
            this.photo_archive.date_created = formattedDate.toDate()
          } else if (newVal.DateTime !== null && typeof newVal.DateTime !== 'undefined') {
            let formattedDate = this.$moment(newVal.DateTime, 'YYYY:MM:DD HH:mm:ss')
            this.photo_archive.date_created = formattedDate.toDate()
          } else this.photo_archive.date_created = new Date()

          // DESCRIPTION
          if (newVal.ImageDescription !== null && typeof newVal.ImageDescription !== 'undefined') {
            if (newVal.ImageDescription.trim().length > 0) {
              this.photo_archive.description_en = newVal.ImageDescription.trim()
            }
          }

          // DEVICE_TXT
          if (newVal.Model !== null && typeof newVal.Model !== 'undefined') this.photo_archive.device_txt = newVal.Model
          else if (newVal.Make !== null && typeof newVal.Make !== 'undefined') this.photo_archive.device_txt = newVal.Make

          // IMAGE DIMENSIONS
          if (newVal.PixelXDimension !== null && typeof newVal.PixelXDimension !== 'undefined') {
            this.photo_archive.image_width = newVal.PixelXDimension
          } else {
            this.photo_archive.image_width = null
          }
          if (newVal.PixelYDimension !== null && typeof newVal.PixelYDimension !== 'undefined') {
            this.photo_archive.image_height = newVal.PixelYDimension
          } else {
            this.photo_archive.image_height = null
          }

          // GPS DATA
          if (newVal.GPSLatitude !== null && typeof newVal.GPSLatitude !== 'undefined') {
            const degrees = newVal.GPSLatitude[0].numerator / newVal.GPSLatitude[0].denominator
            const minutes = newVal.GPSLatitude[1].numerator / newVal.GPSLatitude[1].denominator
            const seconds = newVal.GPSLatitude[2].numerator / newVal.GPSLatitude[2].denominator
            const latitude = this.convertExifGPSToDecimal(degrees, minutes, seconds, newVal.GPSLatitudeRef)

            this.photo_archive.image_latitude = latitude.toFixed(6)
          } else {
            this.photo_archive.image_latitude = null
          }
          if (newVal.GPSLongitude !== null && typeof newVal.GPSLongitude !== 'undefined') {
            const degrees = newVal.GPSLongitude[0].numerator / newVal.GPSLongitude[0].denominator
            const minutes = newVal.GPSLongitude[1].numerator / newVal.GPSLongitude[1].denominator
            const seconds = newVal.GPSLongitude[2].numerator / newVal.GPSLongitude[2].denominator
            const longitude = this.convertExifGPSToDecimal(degrees, minutes, seconds, newVal.GPSLatitudeRef)

            this.photo_archive.image_longitude = longitude.toFixed(6)
          } else {
            this.photo_archive.image_longitude = null
          }
        }
      }
    },

    computed: {
      filesState() {
        return this.files !== null && this.files.length > 0
      },

      authorState() {
        if (this.photo_archive.author !== null) return true
        if (this.photo_archive.author_free !== null) {
          return this.photo_archive.author_free.length > 0
        }
        return false
      },

      imagesetState() {
        return this.photo_archive.imageset !== null
      },

      imageTypeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      localityLabel() {
        return this.$i18n.locale === 'ee' ? 'locality' : 'locality_en'
      },

      isLocaleEst() {
        return this.$i18n.locale === 'ee'
      },

      removeKeywords() {
        if (this.photo_archive.tags !== null) {
          return this.photo_archive.tags.length > 0
        }
        return false
      },
    },

    created: function () {
      // Gets saved form values from local storage
      const photoArchive = this.$localStorage.get('photoArchive', 'fallbackValue')
      if (photoArchive !== 'fallbackValue' && Object.keys(photoArchive).length !== 0 && photoArchive.constructor === Object) {
        if (photoArchive.specimen_image_attachment === 2) {
          this.photo_archive = photoArchive
          console.log(photoArchive)
        } else {
          // If specimen_image_attachment is not 2 then remove localStorage (can't be trusted). Someone changed it manually
          this.$localStorage.remove('photoArchive')
        }
      }

      // Gets keywords from local storage
      const photoArchiveKeywords = this.$localStorage.get('photoArchiveKeywords', 'fallbackValue')
      if (photoArchiveKeywords !== 'fallbackValue' && photoArchiveKeywords.length > 0) this.myKeywords = photoArchiveKeywords

      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        const user = this.$session.get('authUser')
        this.photo_archive.author = {
          id: user.agent_id,
          agent: null,
          forename: user.user,
          surename: null
        }
      }
    },
    methods: {

      add(addAnother) {

        if (this.filesState && this.authorState && this.imagesetState && !this.sendingData) {

          this.sendingData = true
          this.loadingPercent = 0

          let formData = new FormData()

          const dataToUpload = this.formatDataForUpload(this.photo_archive);
          formData.append('data', dataToUpload)

          if (this.files !== null) {
            for (let file in this.files) {
              // TODO: Only append 10 first files
              formData.append('file' + file, this.files[file])
            }
          }

          this.$localStorage.set('photoArchive', this.photo_archive)
          this.$localStorage.set('photoArchiveKeywords', this.myKeywords)

          this.$http.post(this.apiUrl + 'add/attachment/', formData, {
            before(request) {
              this.previousRequest = request
            },
            progress: (e) => {
              if (e.lengthComputable) {
                // console.log("e.loaded: %o, e.total: %o, percent: %o", e.loaded, e.total, (e.loaded / e.total ) * 100);
                this.loadingPercent = Math.round((e.loaded / e.total) * 100)
              }
            }
          }).then(response => {
            console.log(response)
            this.sendingData = false
            if (response.status === 200) {
              if (typeof response.body.message !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                  toastSuccess({text: response.body.message_et});
                } else {
                  toastSuccess({text: response.body.message});
                }

                if (!addAnother) {
                  this.$router.push({ path: '/attachment' })
                } else {
                  this.clearFile()
                }
              }
              if (typeof response.body.error !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
                  toastError({text: response.body.error_et});
                } else {
                  toastError({text: response.body.error});
                }

              }
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.sendingData = false
            toastError({text: this.$t('messages.uploadError')})
          })

        } else if (this.sendingData) {
          // This shouldn't run unless user deletes html elements and tries to press 'add' button again
          toastError({text: this.$t('messages.easterEggError')})
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)

        // Building correct fields
        if (objectToUpload.author !== null) uploadableObject.author = objectToUpload.author.id
        if (objectToUpload.imageset !== null) uploadableObject.imageset = objectToUpload.imageset.id
        if (objectToUpload.image_type !== null) uploadableObject.image_type = objectToUpload.image_type.id
        if (objectToUpload.agent_digitised !== null) uploadableObject.agent_digitised = objectToUpload.agent_digitised.id
        if (objectToUpload.locality !== null) uploadableObject.locality = objectToUpload.locality.id
        if (objectToUpload.licence !== null) uploadableObject.licence = objectToUpload.licence.id
        if (objectToUpload.copyright_agent !== null) uploadableObject.copyright_agent = objectToUpload.copyright_agent.id
        if (objectToUpload.tags !== null) {
          if (objectToUpload.tags.length !== 0) {
            let arrayOfKeywords = objectToUpload.tags.map(function (word) {
              return word['name']
            })
            uploadableObject.tags = arrayOfKeywords.join('|')
          } else {
            uploadableObject.tags = null
          }
        }
        if (objectToUpload.date_created !== null) {
          if (typeof objectToUpload.date_created === 'string') uploadableObject.date_created = objectToUpload.date_created.split('T')[0]
          else uploadableObject.date_created = objectToUpload.date_created.toISOString().split('T')[0]
        }
        if (objectToUpload.date_digitised !== null) {
          if (typeof objectToUpload.date_digitised === 'string') uploadableObject.date_digitised = objectToUpload.date_digitised.split('T')[0]
          else uploadableObject.date_digitised = objectToUpload.date_digitised.toISOString().split('T')[0]
        }

        console.log('This object is sent in string format:')
        console.log(uploadableObject)

        return JSON.stringify(uploadableObject)
      },

      cancelRequest() {
        this.previousRequest.abort()
      },

      addKeyword(newKeyword) {
        // let lowerCaseKeyword = newKeyword.toLowerCase()
        // const keyword = {name: lowerCaseKeyword}
        const keyword = {name: newKeyword}

        this.myKeywords.push(keyword)
        if (this.photo_archive.tags === null) this.photo_archive.tags = []
        this.photo_archive.tags.push(keyword)
      },


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
              if (response.body.count > 0) {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = response.body.results
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = response.body.results
                else this.autocomplete.authors = response.body.results;
              }
              else {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = []
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = []
                else this.autocomplete.authors = [];
              }
            }
            this.searchingAuthors = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingAuthors = false;
          })
        }
      },

      getImagesets(query) {
        if (query.length > 0) {
          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'imageset/'
          if (this.photo_archive.author !== null) {
            url += '?or_search=user_added:' + this.photo_archive.author.forename + ';author__id:' + this.photo_archive.author.id + '&imageset_number__icontains=' + query + '&format=json'
          } else {
            url += '?imageset_number__icontains=' + query + '&format=json'
          }

          this.searchingImagesets = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.imagesets = response.body.results;
              else this.autocomplete.imagesets = []
            }
            this.searchingImagesets = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingImagesets = false;
          })
        }
      },

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
            if (response.body.count > 0) this.autocomplete.imageTypes = response.body.results;
            else this.autocomplete.imageTypes = []
          }
          this.searchingImageTypes = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingImageTypes = false;
        })
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
              if (response.body.count > 0) this.autocomplete.localities = response.body.results
              else this.autocomplete.localities = []
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
            if (response.body.count > 0) this.autocomplete.licences = response.body.results
            else this.autocomplete.licences = []
          }
          this.searchingLicences = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingLicences = false;
        })
      },

      /**************************
       ***  AUTOCOMPLETE END  ***
       **************************/



      /***************************
       *** FILE DROPPING START ***
       ***************************/

      dropFile(event) {
        let files = []
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          if (event.dataTransfer.files[i].type.includes('image')) {
            files.push(event.dataTransfer.files[i])
          } else {
            toastError({text: this.$t('messages.validFileFormat', { file: event.dataTransfer.files[i].name })})
          }
        }

        if (files.length > 0) {
          this.files = files
        }

        this.isDragging = false
      },

      /**************************
       *** FILE DROPPING END  ***
       **************************/



      convertExifGPSToDecimal(degrees, minutes, seconds, direction) {
        // Formula from https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#Coordinate_format_conversion
        let decimalDegrees = degrees + minutes/60 + seconds/3600;
        if (direction === "S" || direction === "W") {
          decimalDegrees = decimalDegrees * -1;
        }
        return decimalDegrees;
      },

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        if (typeof (params.height) === 'undefined') {
          params.height = 750;
        }
        window.open(location.origin + '/' + params.object + '/add', '', 'width=' + params.width + ',height=' + params.height)
      },

      customLabelForAuthor(option) {
        if (option.agent === null && option.forename !== null && option.surename === null) return `${option.forename}`
        if (option.forename === null || option.surename === null) return `${option.agent}`
        else return `${option.agent} (${option.forename} ${option.surename})`
      },

      clearFile() {
        this.$refs.fileinput.reset()
        this.resetMetaData()
      },

      updateLocation(location) {
        this.photo_archive.image_latitude = location.lat.toFixed(6)
        this.photo_archive.image_longitude = location.lng.toFixed(6)
      },

      // This method is run if author field changes
      resetImageset() {
        this.photo_archive.imageset = null
        this.autocomplete.imagesets = []
      },

      reset() {
        this.clearFile()
        this.photo_archive = {
          specimen_image_attachment: 2,
          author: null,
          author_free: null,
          date_created: new Date(),
          date_created_free: null,
          image_type: {
            id: 5,
            value: 'digipilt',
            value_en: 'digital image'
          },
          // device: null,
          device_txt: null,
          agent_digitised: null,
          date_digitised: null,
          // device_digitised: null,
          imageset: null,
          // image_number: null,
          image_width: null,
          image_height: null,
          type: 1,
          attachment_format: null,
          image_place: null,
          locality: null,
          image_latitude: null,
          image_longitude: null,
          image_altitude: null,
          image_object: null,
          image_people: null,
          image_description: null,
          image_description_en: null,
          tags: null,
          stars: 0,
          licence: null,
          copyright_agent: null,
          // is_preferred: '1',
          is_private: '0',
          is_locked: '0',
          // user_added: null,
          // date_added: null,
          // user_changed: null,
          // date_changed: null,
          // database_id: null,
          // uuid: null,
          // uuid_filename: null,
          // filename: null,
        }
      },

      resetMetaData() {
        // Because of #62 and #65 23.10.2018
        // this.photo_archive.date_created = null;
        // this.photo_archive.description_en = null;
        // this.photo_archive.device_txt = null;
        this.photo_archive.image_width = null;
        this.photo_archive.image_height = null;
      },

      clearLocalStorage() {
        this.$localStorage.remove('photoArchive')
        this.$localStorage.remove('photoArchiveKeywords')
        toastInfo({text: this.$t('messages.defaultsRemoved')})
      },
    }
  }
</script>

<style scoped>
  label {
    margin-bottom: 0.2rem;
  }

  .dragging {
    color: #fff;
    background-color: #007bff;
  }

  .thumbnail-preview {
    max-width: 100px;
    max-height: 200px;
  }

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
