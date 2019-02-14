<template>
  <div class="journal">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- JOURNAL NAME and JOURNAL SHORT -->
    <div class="row mt-4">
      <div class="col-sm-2">
        <label :for="`journal_name`">{{ $t('journal.journalName') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="journal_name" v-model="journal.journal_name" :state="journalNameState" type="text"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`journal_short`">{{ $t('journal.journalShort') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="journal_short" v-model="journal.journal_short" type="text"></b-form-input>
      </div>
    </div>

    <!-- PUBLISHER and REMARKS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`publisher`">{{ $t('journal.publisher') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="publisher" v-model="journal.publisher" type="text"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`remarks`">{{ $t('journal.remarks') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="remarks" v-model="journal.remarks" type="text"
                         :no-resize="true" :rows="1" :max-rows="3"></b-form-textarea>
      </div>
    </div>


    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false)">{{ $t('add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true)">{{ $t('add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset">{{ $t('add.buttons.clearFields') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

  export default {
    components: {
      Spinner,
    },
    name: "Journal",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
        journal: {
          journal_name: null,
          journal_short: null,
          publisher: null,
          remarks: null,
        }
      }
    },

    computed: {
      journalNameState() {
        return this.journal.journal_name !== null
      }
    },

    methods: {

      add(addAnother) {
        if (this.journalNameState && !this.sendingData) {

          this.sendingData = true
          this.loadingPercent = 0

          let formData = new FormData()

          // const dataToUpload = this.formatDataForUpload(this.journal);
          formData.append('data', this.journal)

          this.$http.post(this.apiUrl + 'add/journal/', formData, {
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

                // TODO: Send new journal to component
                // Closing window after successful journal
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

      cancelRequest() {
        this.previousRequest.abort()
      },

      reset() {
        this.journal = {
          journal_name: null,
          journal_short: null,
          publisher: null,
          remarks: null,
        }
      },
    }
  }
</script>

<style scoped>

</style>
