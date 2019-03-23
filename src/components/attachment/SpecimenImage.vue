<template>
  <div class="specimen-image">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- FILE -->
    <div class="row">
      <div class="col-sm-12 mb-2">
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

    <!-- AUTHOR and AUTHOR FREE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('specimenImage.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.author"
                         id="author"
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
                      v-model="upload.author_free"
                      :state="authorState"
                      type="text"></b-form-input>
        <b-form-text v-if="!authorState">{{ $t('add.errors.authorMultiple') }}.</b-form-text>
      </div>
    </div>

    <!-- SPECIMEN and SCALEBAR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`specimen`">{{ $t('specimenImage.specimen') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.specimen"
                         id="specimen"
                         :options="autocomplete.specimens"
                         :custom-label="customSpecimenLabel"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getSpecimens"
                         :loading="searchingSpecimens"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult">
            <b v-show="!specimenQuerySmall">{{ $t('messages.inputNoResults') }}</b>
            <b v-show="specimenQuerySmall">{{ $t('add.inputs.autocompleteSearch', { num: '3' }) }}</b>
          </template>
        </vue-multiselect>
        <!--<b-form-text v-if="!specimenState">{{ $t('add.errors.specimen') }}.</b-form-text>-->
      </div>


      <div class="col-sm-2">
        <label :for="`image_scalebar`">{{ $t('specimenImage.imageScalebar') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_scalebar" v-model="upload.image_scalebar" type="text"></b-form-input>
      </div>
    </div>

    <!-- DATE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_created`">{{ $t('specimenImage.dateCreated') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_created"
                    v-model="upload.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>


      <div class="col-sm-2">
        <label :for="`date_created_free`">{{ $t('specimenImage.dateCreatedFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_created_free" v-model="upload.date_created_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_description`">{{ $t('specimenImage.imageDescription') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="image_description" v-model="upload.image_description" type="text" size="sm"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>
      </div>


      <div class="col-sm-2">
        <label :for="`image_description_en`">{{ $t('specimenImage.imageDescriptionEn') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="image_description_en" v-model="upload.image_description_en" type="text" size="sm"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>
      </div>
    </div>

    <!-- KEYWORDS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`keywords`">{{ $t('specimenImage.keywords') }}:</label>
      </div>

      <div class="col-9 mb-2">
        <vue-multiselect v-model="upload.tags"
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
                @click="upload.tags = null">
          <font-awesome-icon icon="trash-alt"></font-awesome-icon>
        </button>
      </div>
    </div>

    <!-- LICENCE and COPYRIGHT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`licence`">{{ $t('specimenImage.licence') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.licence"
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
        <label :for="`copyright_agent`">{{ $t('specimenImage.copyrightAgent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.copyright_agent"
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

    <!-- IMAGE TYPE and DEVICE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_type`">{{ $t('specimenImage.imageType') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.image_type"
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
        <label :for="`device_txt`">{{ $t('specimenImage.deviceTxt') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="device_txt" v-model="upload.device_txt" type="text"></b-form-input>
      </div>
    </div>

    <!-- AGENT and DATE DIGITISED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_digitised`">{{ $t('specimenImage.agentDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.agent_digitised"
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
        <label :for="`date_digitised`">{{ $t('specimenImage.dateDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_digitised"
                    v-model="upload.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>
    </div>

    <!-- STARS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stars`">{{ $t('specimenImage.stars') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-select v-model="upload.stars">
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
        <!--<b-form-checkbox id="is_preferred" v-model="upload.is_preferred" value="1" unchecked-value="0">-->
        <!--{{ $t('specimenImage.preferred') }}-->
        <!--</b-form-checkbox>-->

        <b-form-checkbox id="is_private" v-model="upload.is_private" value="1" unchecked-value="0">
          {{ $t('specimenImage.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="upload.is_locked" value="1" unchecked-value="0">
          {{ $t('specimenImage.locked') }}
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


    <bottom-options :success-button="$t('add.buttons.add')"
                    :danger-button="$t('add.buttons.clearFields')" v-on:button-clicked="hoverButtonClicked"></bottom-options>

  </div>
</template>

<script>
  import formManipulation  from './../mixins/formManipulation'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'

  import Datepicker from 'vue2-datepicker'
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import cloneDeep from 'lodash/cloneDeep'
  import EXIF from 'exif-js'
  import { toastSuccess, toastError, toastInfo } from "@/assets/js/iziToast/iziToast";

  library.add(faTrashAlt)

  export default {
    components: {
      FontAwesomeIcon,
      VueMultiselect,
      Datepicker,
      Spinner,
    },
    name: "SpecimenImage",
    mixins: [formManipulation],
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
        files: null,
        fileMetaData: null,
        isDragging: false,
        specimenQuerySmall: false,
        autocomplete: {
          authors: [],
          specimens: [],
          agentsDigitised: [],
          copyrightAgents: [],
          imageTypes: [],
          licences: [],
        },
        searchingAuthors: false,
        searchingSpecimens: false,
        searchingImageTypes: false,
        searchingLicences: false,
        myKeywords: [],
        upload: {
          specimen_image_attachment: 1,
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
          specimen: null,
          image_width: null,
          image_height: null,
          type: 1,
          attachment_format: null,
          image_scalebar: null,
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
            // TODO: Get thumbnail
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
            this.upload.date_created = formattedDate.toDate()
          } else if (newVal.DateTime !== null && typeof newVal.DateTime !== 'undefined') {
            let formattedDate = this.$moment(newVal.DateTime, 'YYYY:MM:DD HH:mm:ss')
            this.upload.date_created = formattedDate.toDate()
          } else this.upload.date_created = new Date()

          // DESCRIPTION
          if (newVal.ImageDescription !== null && typeof newVal.ImageDescription !== 'undefined') {
            if (newVal.ImageDescription.trim().length > 0) {
              this.upload.image_description_en = newVal.ImageDescription.trim()
            }
          }

          // DEVICE_TXT
          if (newVal.Model !== null && typeof newVal.Model !== 'undefined') this.upload.device_txt = newVal.Model
          else if (newVal.Make !== null && typeof newVal.Make !== 'undefined') this.upload.device_txt = newVal.Make

          // IMAGE DIMENSIONS
          if (newVal.PixelXDimension !== null && typeof newVal.PixelXDimension !== 'undefined') {
            this.upload.image_width = newVal.PixelXDimension
          } else {
            this.upload.image_width = null
          }
          if (newVal.PixelYDimension !== null && typeof newVal.PixelYDimension !== 'undefined') {
            this.upload.image_height = newVal.PixelYDimension
          } else {
            this.upload.image_height = null
          }
        }
      }
    },

    computed: {
      filesState() {
        return this.files !== null && this.files.length > 0
      },

      authorState() {
        if (this.upload.author !== null) return true
        if (this.upload.author_free !== null) {
          return this.upload.author_free.length > 0
        }
        return false
      },

      // specimenState() {
      //   return this.upload.specimen !== null
      // },

      imageTypeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      isLocaleEst() {
        return this.$i18n.locale === 'ee'
      },

      removeKeywords() {
        if (this.upload.tags !== null) {
          return this.upload.tags.length > 0
        }
        return false
      },
    },

    created: function () {
      // Gets saved form values from local storage
      const specimenImage = this.$localStorage.get('specimenImage', 'fallbackValue')
      if (specimenImage !== 'fallbackValue' && Object.keys(specimenImage).length !== 0 && specimenImage.constructor === Object) {
        if (specimenImage.specimen_image_attachment === 1) {
          this.upload = specimenImage
        } else {
          // If specimen_image_attachment is not 1 then remove localStorage (can't be trusted). Someone changed it manually
          this.$localStorage.remove('specimenImage')
        }
      }

      // Gets keywords from local storage
      const specimenImageKeywords = this.$localStorage.get('specimenImageKeywords', 'fallbackValue')
      if (specimenImageKeywords !== 'fallbackValue' && specimenImageKeywords.length > 0) this.myKeywords = specimenImageKeywords

      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        const user = this.$session.get('authUser')
        this.upload.author = {
          id: user.agent_id,
          agent: null,
          forename: user.user,
          surename: null
        }
      }
    },
    methods: {

      hoverButtonClicked(choice) {
        if (choice === "SAVE") this.add(false)
        if (choice === "CANCEL") this.reset()
      },

      add(addAnother) {
        if (this.filesState && this.authorState && !this.sendingData) {

          this.sendingData = true
          this.loadingPercent = 0

          let formData = new FormData()

          const dataToUpload = this.formatDataForUpload(this.upload);
          formData.append('data', dataToUpload)

          if (this.files !== null) {
            for (let file in this.files) {
              // TODO: Only append 10 first files
              formData.append('file' + file, this.files[file])
            }
          }

          this.$localStorage.set('specimenImage', this.upload)
          this.$localStorage.set('specimenImageKeywords', this.myKeywords)

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
                console.log('Creating relation with' + this.$parent.createRelationWith.id + ' ' + response.body.attachment_id)
                //create relation with locality
                if(this.$parent.createRelationWith !== null ){
                  this.addRelationBetweenAnyObjectAndAttachment(response.body.attachment_id,'attachment_link');
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
        if (objectToUpload.specimen !== null) uploadableObject.specimen = objectToUpload.specimen.id
        if (objectToUpload.image_type !== null) uploadableObject.image_type = objectToUpload.image_type.id
        if (objectToUpload.agent_digitised !== null) uploadableObject.agent_digitised = objectToUpload.agent_digitised.id
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
        if (this.upload.tags === null) this.upload.tags = []
        this.upload.tags.push(keyword)
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

      getSpecimens(query) {
        if (query.length > 2) {
          this.specimenQuerySmall = false

          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'specimen/?multi_search=value:' + query + ';fields:id,specimen_id;lookuptype:icontains&fields=id,specimen_id,coll__number&format=json'

          this.searchingSpecimens = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.specimens = response.body.results
              else this.autocomplete.specimens = []
            }
            this.searchingSpecimens = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingSpecimens = false;
          })
        } else {
          this.specimenQuerySmall = true
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
            if (response.body.count > 0) {
              this.autocomplete.imageTypes = response.body.results;
            } else {
              this.autocomplete.imageTypes = []
            }
          }
          this.searchingImageTypes = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingImageTypes = false;
        })
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
            } else {
              this.autocomplete.licences = []
            }
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



      customLabelForAuthor(option) {
        if (option.agent === null && option.forename !== null && option.surename === null) return `${option.forename}`
        if (option.forename === null || option.surename === null) return `${option.agent}`
        else return `${option.agent} (${option.forename} ${option.surename})`
      },

      customSpecimenLabel(option) {
        if (option.coll__number !== null) {
          return `${option.coll__number.split(' ')[0]} ${option.specimen_id} (${option.id})`
        } else {
          return `${option.specimen_id} (${option.id})`
        }
      },

      clearFile() {
        this.$refs.fileinput.reset()
        this.resetMetaData()
      },

      reset() {
        this.clearFile()
        this.upload = {
          specimen_image_attachment: 1,
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
          specimen: null,
          image_width: null,
          image_height: null,
          type: 1,
          attachment_format: null,
          image_scalebar: null,
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
        // this.upload.date_created = null;
        // this.upload.description_en = null;
        // this.upload.device_txt = null;
        this.upload.image_width = null;
        this.upload.image_height = null;
      },

      clearLocalStorage() {
        this.$localStorage.remove('specimenImage')
        this.$localStorage.remove('specimenImageKeywords')
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
</style>
