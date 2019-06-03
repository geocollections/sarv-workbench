<template>
  <div class="edit-attachment">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('edit.overlay')"></spinner>

    <div class="row mt-4">
      <div class="col">
        <p class="h2">{{ $t('edit.heading') }}: <b>{{id}}</b></p>
      </div>
    </div>


    <div v-if="attachment !== null && attachment_link !== null">
      <div v-if="isPhotoArchive">
        <!-- TODO: Same component like in photo_archive adding??? -->
        <photo-archive :data="attachment" v-on:edit-data="change"/>
      </div>

      <div v-if="isSpecimenImage">
        <specimen-image :data="attachment" v-on:edit-data="change"/>
      </div>

      <div v-if="isOtherFile">
        <other-files :data="attachment" :attach-link="attachment_link" v-on:edit-data="change"/>
      </div>

      <div v-if="isDigitisedReference">
        <digitised-reference :data="attachment" v-on:edit-data="change"/>
      </div>

      <!-- TODO: Enable if attachment components are updated -->
<!--      <bottom-options object="attachment" :is-navigation-shown="$route.meta.isNavigationShow" v-if="$route.meta.isBottomOptionShown"/>-->

      <!-- LOGS -->
      <log table="attachment" :data="attachment" :formatted-data="formattedData"></log>
    </div>

  </div>
</template>

<script>
  import PhotoArchive from '@/components/attachment/edit/PhotoArchive.vue'
  import SpecimenImage from '@/components/attachment/edit/SpecimenImage.vue'
  import OtherFiles from '@/components/attachment/edit/OtherFiles.vue'
  import DigitisedReference from '@/components/attachment/edit/DigitisedReference.vue'
  import BottomOptions from "@/components/partial/BottomOptions";
  import Spinner from 'vue-simple-spinner'
  import Log from '@/components/partial/Log.vue'

  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

  export default {
    components: {
      PhotoArchive,
      SpecimenImage,
      OtherFiles,
      DigitisedReference,
      Spinner,
      Log,
      BottomOptions
    },
    props: ['id'],
    name: "EditAttachment",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        sendingData: false,
        attachment: null,
        attachment_link: null,
        specimenImageAttachment: null,
        formattedData: '',
        searchParameters: {
          id: this.id,
          author: null
        },
      }
    },

    metaInfo () {
      return {
        title: this.$t('titles.editAttachment') + ' ' + this.id
      }
    },

    watch: {
      'id': function (newVal) {
        this.searchParameters.id = newVal
        console.log(this.attachment)
        console.log(this.attachment_link)
        this.resetData()
        console.log(this.attachment)
        console.log(this.attachment_link)
        this.getAttachment(this.searchParameters)
        this.getAttachmentLink(newVal)
      }
    },

    computed: {
      isPhotoArchive() {
        return this.attachment.specimen_image_attachment === 2
      },

      isSpecimenImage() {
        return this.attachment.specimen_image_attachment === 1
      },

      isOtherFile() {
        return this.attachment.specimen_image_attachment === 3
      },

      isDigitisedReference() {
        return this.attachment.specimen_image_attachment === 4
      },
    },

    created: function () {
      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        this.searchParameters.author = this.$session.get('authUser')
        this.getAttachment(this.searchParameters)
        this.getAttachmentLink(this.id)
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

          this.$http.post(this.apiUrl + 'change/attachment/' + this.attachment.id, formData).then(response => {
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
                  this.$router.push({ path: '/attachment' })
                } else {
                  // Changing this initiates new log request
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

      // TODO: If admin then do not add or_search using author data
      getAttachment(params) {
        this.$http.get(this.apiUrl + 'attachment/' + params.id, {
          params: {
            or_search: 'author_id:' + params.author.agent_id + ';user_added:' + params.author.user + ';user_changed:' + params.author.user,
            format: 'json',
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (typeof response.body.results === 'undefined') this.attachment = []
            else this.attachment = response.body.results[0]
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      },

      // TODO: Also should use that author field so no one else should get the request's results.
      getAttachmentLink(id) {
        this.$http.get(this.apiUrl + 'attachment_link/', {
          params:{
            attachment: id,
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) this.attachment_link = response.body.results
            else this.attachment_link = []
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      },

      resetData() {
        this.attachment = null
        this.attachment_link = null
      }
    }
  }
</script>

<style scoped>
</style>
