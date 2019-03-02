<template>
  <div class="edit-reference">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('edit.overlay')"></spinner>

    <div class="row mt-4">
      <div class="col">
        <p class="h2">{{ $t('editReference.heading') }}: <b>{{id}}</b></p>
      </div>
    </div>


    <div v-if="reference !== null">
      <div v-if="isReference && isAttachment && isLocalityReference && isReferenceKeyword">
        <reference :data="reference" v-bind:attach="attachment" :loc="locality" :refkey="reference_keyword" v-on:edit-data="change"/>
      </div>

      <!-- LOGS -->
      <log table="reference" :data="reference"></log>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import Reference from '@/components/reference/edit/Reference.vue'
  import Log from '@/components/partial/Log.vue'

  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

  export default {
    components: {
      Spinner,
      Reference,
      Log,
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

    watch: {
      'id': function (newVal) {
        this.searchParameters.id = newVal
        this.resetData()
        this.getReference(this.searchParameters)
        this.getAttachment(this.searchParameters)
        this.getLocalityReference(this.searchParameters)
        this.getReferenceKeyword(this.searchParameters)
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
      }
    },

    methods: {

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

      // TODO: If admin then do not add or_search using author data
      getReference(params) {
        this.$http.get(this.apiUrl + 'reference/' + params.id, {
          params: {
            // user_added: params.author.user,
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

      // TODO: Also this should use the author field.
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

      // TODO: Also this should use the author field.
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

      // TODO: Also this should use the author field.
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

      resetData() {
        this.reference = null
        this.attachment = null
        this.locality = null
        this.reference_keyword = null
      }
    }
  }
</script>

<style scoped>

</style>
