<template>
  <div class="digitised-reference">
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
                  <font-awesome-icon icon="file"></font-awesome-icon>&nbsp;
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
                     accept=".pdf"
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

    <!-- REFERENCE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`reference`">{{ $t('digitisedReference.reference') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.reference"
                         id="reference"
                         :options="autocomplete.references"
                         :internal-search="false"
                         :preserve-search="true"
                         v-bind:class="{ valid: referenceState, invalid: !referenceState }"
                         @search-change="getReferences"
                         track-by="id"
                         label="reference"
                         :loading="searchingReferences"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false"></vue-multiselect>
      </div>
    </div>

    <!-- LICENCE and COPYRIGHT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`licence`">{{ $t('photoArchive.licence') }}:</label>
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
        <label :for="`copyright_agent`">{{ $t('photoArchive.copyrightAgent') }}:</label>
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

    <!-- AGENT and DATE DIGITISED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_digitised`">{{ $t('photoArchive.agentDigitised') }}:</label>
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
        <label :for="`date_digitised`">{{ $t('photoArchive.dateDigitised') }}:</label>
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

    <!-- DATE DIGITISED FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_digitised_free`">{{ $t('digitisedReference.dateDigitisedFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_digitised_free" v-model="upload.date_digitised_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <!--<b-form-checkbox id="is_preferred" v-model="upload.is_preferred" value="1" unchecked-value="0">-->
        <!--{{ $t('photoArchive.preferred') }}-->
        <!--</b-form-checkbox>-->

        <b-form-checkbox id="is_private" v-model="upload.is_private" value="1" unchecked-value="0">
          {{ $t('photoArchive.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="upload.is_locked" value="1" unchecked-value="0">
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


    <bottom-options :success-button="$t('add.buttons.add')"
                    :danger-button="$t('add.buttons.clearFields')" v-on:button-clicked="hoverButtonClicked"></bottom-options>

  </div>
</template>

<script>
  import formManipulation  from './../mixins/formManipulation'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faFile} from '@fortawesome/free-solid-svg-icons'

  import Datepicker from 'vue2-datepicker'
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError, toastInfo } from "@/assets/js/iziToast/iziToast";
  import BottomOptions from "../partial/BottomOptions";

  library.add(faFile)

  export default {
    components: {
      BottomOptions,
      VueMultiselect,
      Datepicker,
      Spinner,
    },
    name: "DigitisedReference",
    mixins: [formManipulation],
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
        files: null,
        isDragging: false,
        autocomplete: {
          references: [],
          copyrightAgents: [],
          agentsDigitised: [],
          licences: [],
        },
        searchingReferences: false,
        searchingAuthors: false,
        searchingLicences: false,
        upload: {
          specimen_image_attachment: 4,
          reference: null,
          licence: null,
          copyright_agent: null,
          agent_digitised: null,
          date_digitised: null,
          date_digitised_free: null,
          // is_preferred: '1',
          is_private: '0',
          is_locked: '0',
        }
      }
    },

    computed: {
      filesState() {
        return this.files !== null && this.files.length > 0
      },

      referenceState() {
        return this.upload.reference !== null
      }
    },

    created: function () {
      // Gets saved form values from local storage
      const digitisedReference = this.$localStorage.get('digitisedReference', 'fallbackValue')
      if (digitisedReference !== 'fallbackValue' && Object.keys(digitisedReference).length !== 0 && digitisedReference.constructor === Object) {
        if (digitisedReference.specimen_image_attachment === 4) {
          this.upload = digitisedReference
          console.log(digitisedReference)
        } else {
          // If specimen_image_attachment is not 4 then remove localStorage (can't be trusted). Someone changed it manually
          this.$localStorage.remove('digitisedReference')
        }
      }
    },

    methods: {

      hoverButtonClicked(choice) {
        if (choice === "SAVE") this.add(false)
        if (choice === "CANCEL") this.reset()
      },

      add(addAnother) {

        if (this.filesState && this.referenceState && !this.sendingData) {

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

          this.$localStorage.set('digitisedReference', this.upload)

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
        if (objectToUpload.reference !== null) uploadableObject.reference = objectToUpload.reference.id
        if (objectToUpload.licence !== null) uploadableObject.licence = objectToUpload.licence.id
        if (objectToUpload.copyright_agent !== null) uploadableObject.copyright_agent = objectToUpload.copyright_agent.id
        if (objectToUpload.agent_digitised !== null) uploadableObject.agent_digitised = objectToUpload.agent_digitised.id
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


      /**************************
       *** AUTOCOMPLETE START ***
       **************************/

      getReferences(query) {
        if (query.length > 0) {
          this.searchingReferences = true

          let url = this.apiUrl + 'reference/?reference__icontains=' + query + '&fields=id,reference&format=json'

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.references = response.body.results
              else this.autocomplete.references = []
            }
            this.searchingReferences = false
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingReferences = false
          })
        }
      },

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
          if (event.dataTransfer.files[i].type.includes('pdf')) {
            files.push(event.dataTransfer.files[i])
          } else {
            toastError({text: this.$t('messages.validFileFormatPDF', { file: event.dataTransfer.files[i].name })})
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

      clearFile() {
        this.$refs.fileinput.reset()
      },

      reset() {
        this.clearFile()
        this.upload = {
          specimen_image_attachment: 4,
          reference: null,
          licence: null,
          copyright_agent: null,
          agent_digitised: null,
          date_digitised: null,
          date_digitised_free: null,
          type: 4,
          // is_preferred: '1',
          is_private: '0',
          is_locked: '0',
        }
      },

      clearLocalStorage() {
        this.$localStorage.remove('digitisedReference')
        toastInfo({text: this.$t('messages.defaultsRemoved')})
      },
    },
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
</style>
