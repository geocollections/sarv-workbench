<template>
  <div class="edit-reference">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('edit.overlay')"></spinner>

    <div class="row mt-4">
      <div class="col">
        <p class="h2">{{ $t('editReference.heading') }}: <b>{{id}}</b></p>
      </div>
    </div>

    <geocollection-link :attachment="attachment" :reference="reference" :formatted-data="formattedData"></geocollection-link>

    <div v-if="reference !== null">
      <div v-if="isReference && isAttachment && isLocalityReference && isReferenceKeyword && isAttachmentLink">
        <reference :data="reference"
                   v-bind:attach="attachment"
                   :loc="locality"
                   :keywords="reference_keyword"
                   :attach-link="attachment_link"
                   v-on:object-changed="changeValue"
                   v-on:edit-data="change"/>
      </div>

      <!-- LOGS -->
      <log table="reference" :data="reference" :formatted-data="formattedData"></log>
    </div>


    <confirmation-box title="reference.reference"
                      :title-extra="reference.reference"
                      v-if="isChanged"
                      table="reference"
                      v-on:user-choice="confirmationBox"></confirmation-box>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import Reference from '@/components/reference/edit/Reference.vue'
  import Log from '@/components/partial/Log.vue'
  import GeocollectionLink from '@/components/partial/GeocollectionsLink.vue'
  import ConfirmationBox from '@/components/partial/ConfirmationBox.vue'

  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
  import { fetchAttachmentLink } from "@/assets/js/api/apiCalls";

  export default {
    components: {
      Spinner,
      Reference,
      Log,
      GeocollectionLink,
      ConfirmationBox
    },
    name: "EditReference",
    props: ['id'],
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        sendingData: false,
        reference: null,
        attachment: null,
        locality: null,
        reference_keyword: null,
        attachment_link: null,
        formattedData: '',
        isChanged: false,
        userChoice: null,
        searchParameters: {
          id: this.id,
          author: null
        },
      }
    },

    metaInfo () {
      return {
        title: this.$t('titles.editReference') + ' ' + this.id
      }
    },

    beforeRouteLeave(to, from, next) {
      // TODO
      // if (this.isChanged) {
        // const answer = this.$root.$emit('bv::show::modal','confirmation')
        // console.log(answer)
        // const answer = window.confirm(this.$t('confirmation.question'))
        // if (answer) {
        //   next()
        // } else {
        //   next(false)
        // }
      // } else {
      //   next()
      // }
    },

    watch: {
      'id': function (newVal) {
        this.searchParameters.id = newVal
        this.resetData()
        this.getReference(this.searchParameters)
        this.getAttachment(this.searchParameters)
        this.getLocalityReference(this.searchParameters)
        this.getReferenceKeyword(this.searchParameters)
        this.getAttachmentLink(this.searchParameters)
      }
    },

    computed: {
      isReference() {
        return typeof this.reference.id === 'number'
      },

      isAttachment() {
        return this.attachment !== null
      },

      isLocalityReference() {
        return this.locality !== null
      },

      isReferenceKeyword() {
        return this.reference_keyword !== null
      },

      isAttachmentLink() {
        return this.attachment_link !== null
      }
    },

    created: function () {
      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        this.searchParameters.author = this.$session.get('authUser')
        this.getReference(this.searchParameters)
        this.getAttachment(this.searchParameters)
        this.getLocalityReference(this.searchParameters)
        this.getReferenceKeyword(this.searchParameters)
        this.getAttachmentLink(this.searchParameters)
      }
    },

    methods: {

      changeValue(value) {
        console.log(value)
        this.isChanged = value
      },

      confirmationBox(userChoice) {
        console.log('User Choice: ' + userChoice)
        this.userChoice = userChoice
        //
        if (userChoice === 'LEAVE') {
          this.$router.push({ path: '/reference' })
        }
        //
        // if (userChoice === 'CONTINUE') {
        //   // DO NOTHING
        // }
        //
        // if (userChoice === 'SAVE') {
        //   this.sendData(true)
        // }
      },

      change(data, continueEditing) {
        console.log(data)
        console.log(continueEditing)

        if (!this.sendingData) {
          this.sendingData = true;

          let formData = new FormData()
          formData.append('data', data)

          this.$http.post(this.apiUrl + 'change/reference/' + this.reference.id, formData).then(response => {
            console.log(response)
            this.sendingData = false
            if (response.status === 200) {
              if (typeof response.body.message !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                  toastSuccess({text: response.body.message_et});
                } else {
                  toastSuccess({text: response.body.message});
                }

                if (!continueEditing) {
                  this.$router.push({ path: '/reference' })
                } else {
                  // Changing this basically re-renders child components with new data.
                  this.formattedData = data
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
        } else {
          // This shouldn't run unless user deletes html elements and tries to press 'add' button again
          toastError({text: this.$t('messages.easterEggError')})
        }
      },

      cancelRequest() {
        this.previousRequest.abort()
      },

      getReference(params) {
        this.$http.get(this.apiUrl + 'reference/' + params.id, {
          params: {
            format: 'json',
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (typeof response.body.results === 'undefined') this.reference = []
            else this.reference = response.body.results[0]
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      },

      getAttachment(params) {
        this.$http.get(this.apiUrl + 'attachment/', {
          params: {
            reference: params.id,
            format: 'json',
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) this.attachment = response.body.results
            else this.attachment = []
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      },

      getLocalityReference(params) {
        this.$http.get(this.apiUrl + 'locality_reference/', {
          params: {
            reference_id: params.id,
            format: 'json',
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) this.locality = response.body.results
            else this.locality = []
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      },

      getReferenceKeyword(params) {
        this.$http.get(this.apiUrl + 'reference_keyword/', {
          params: {
            reference: params.id,
            format: 'json',
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) this.reference_keyword = response.body.results
            else this.reference_keyword = []
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      },

      getAttachmentLink(params) {
        fetchAttachmentLink({
          reference: params.id
        }).then(response => {
          if (response.status === 200) {
            if (response.body.count > 0) this.attachment_link = response.body.results
            else this.attachment_link = []
          }
        }, errResponse => {})
      },

      resetData() {
        this.reference = null
        this.attachment = null
        this.locality = null
        this.reference_keyword = null
        this.attachment_link = null
      }
    }
  }
</script>

<style scoped>

</style>
