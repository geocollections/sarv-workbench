<template>
  <div class="imageset">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- NUMBER and AUTHOR -->
    <div class="row mt-4">
      <div class="col-sm-2">
        <label :for="`imageset`">{{ $t('imageset.imagesetNumber') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="imageset"
                      v-model="imageset.imageset_number"
                      :state="imagesetNumberState"
                      type="text"></b-form-input>
        <b-form-text v-if="!imagesetNumberState">
          <div v-if="imagesetNumberExists">{{ $t('add.errors.imagesetNumberExists') }}.</div>
          <div v-else>{{ $t('add.errors.imagesetNumber') }}.</div>
        </b-form-text>
      </div>


      <div class="col-sm-2">
        <label :for="`author`">{{ $t('imageset.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="imageset.author"
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
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`description`">{{ $t('imageset.description') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="image_description"
                         v-model="imageset.description"
                         :no-resize="true"
                         :rows="3"
                         :max-rows="3"
                         type="text"></b-form-textarea>
      </div>
    </div>


    <div class="row mt-3 mb-3">
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
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError, toastInfo } from "@/assets/js/iziToast/iziToast";


  export default {
    components: {
      VueMultiselect,
      Spinner,
    },
    name: "Imageset",
    data () {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
        imagesetNumberExists: false,
        autocomplete: {
          authors: [],
        },
        searchingAuthors: false,
        imageset: {
          imageset_number: null,
          author: null,
          description: null,
        }
      }
    },

    watch: {
      'upload.imageset_number': function (newVal) {
        if (newVal !== null) {
          if (newVal.trim().length > 0) {
            this.isInImagesetTable(newVal)
          }
        }
      }
    },

    computed: {
      imagesetNumberState() {
        return this.imageset.imageset_number !== null && this.imageset.imageset_number.length > 0 && !this.imagesetNumberExists
      },

      authorState() {
        return this.imageset.author !== null
      },
    },

    created: function () {
      // Gets saved form values from local storage
      const imageset = this.$localStorage.get('imageset', 'fallbackValue')
      if (imageset !== 'fallbackValue' && Object.keys(imageset).length !== 0 && imageset.constructor === Object) this.imageset = imageset

      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        const user = this.$session.get('authUser')
        this.imageset.author = {
          id: user.agent_id,
          agent: null,
          forename: user.user,
          surename: null
        }
      }
    },

    methods: {

      add(addAnother) {
        if (this.authorState && this.imagesetNumberState && !this.sendingData) {

          this.sendingData = true
          this.loadingPercent = 0

          let formData = new FormData()

          const dataToUpload = this.formatDataForUpload(this.imageset);
          formData.append('data', dataToUpload)

          this.$localStorage.set('imageset', this.imageset)

          this.$http.post(this.apiUrl + 'add/imageset/', formData, {
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
                  toastSuccess({text: response.body.message });
                }

                // TODO: Send new imageset to component
                // Closing window after successful imageset
                if (!addAnother) {
                  window.close()
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

        console.log('This object is sent in string format:')
        console.log(uploadableObject)

        return JSON.stringify(uploadableObject)
      },

      cancelRequest() {
        this.previousRequest.abort()
      },

      isInImagesetTable(query) {
        this.$http.get(this.apiUrl + 'imageset/', { params: {imageset_number: query} }).then(response => {
          console.log(response)
          if (response.status === 200) {
            this.imagesetNumberExists = response.body.count > 0
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      },

      getAuthors(query) {
        if (query.length > 0) {

          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'agent/?multi_search=value:' + query + ';fields:agent,forename,surename;lookuptype:icontains&format=json'

          this.searchingAuthors = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.authors = response.body.results;
              else this.autocomplete.authors = [];
            }
            this.searchingAuthors = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingAuthors = false;
          })
        }
      },

      customLabelForAuthor(option) {
        if (option.agent === null && option.forename !== null && option.surename === null) return `${option.forename}`
        if (option.forename === null || option.surename === null) return `${option.agent}`
        else return `${option.agent} (${option.forename} ${option.surename})`
      },

      reset() {
        this.imageset = {
          imageset_number: null,
          author: null,
          description: null,
        }
      },

      clearLocalStorage() {
        this.$localStorage.remove('imageset')
        toastInfo({text: this.$t('messages.defaultsRemoved')})
      },
    }
  }
</script>

<style scoped>

</style>
