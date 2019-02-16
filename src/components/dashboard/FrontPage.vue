<template>
  <div class="front-page">

    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t('frontPage.welcome') }} <b class="text-capitalize">{{ user }}</b></p>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-sm-6 mb-2">
        <p>{{ $t('frontPage.info') }}: <a href="http://geocollections.info" target="_blank">http://geocollections.info</a></p>

        <!-- TODO: Delete in production -->
        <!--<button class="btn btn-outline-danger mt-3 mb-3" @click="removeAllLocalStorage" :title="$t('frontPage.developmentSettings.message')">{{ $t('frontPage.developmentSettings.button') }}</button>-->
      </div>

      <div class="col-sm-6">

        <!-- FILES -->
        <div class="mb-2 toggle-collapse" @click="showCollapseFiles = !showCollapseFiles"
             :class="showCollapseFiles ? 'collapsed' : null">
          {{ $t('frontPage.collapseFiles') }}
          <font-awesome-icon v-if="showCollapseFiles" icon="chevron-up" ></font-awesome-icon>
          <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
        </div>

        <b-collapse v-model="showCollapseFiles" id="collapseFiles">
          <b-card class="border-0">
            <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/photo_archive' }">{{ $t('frontPage.buttons.photoArchive') }}</router-link>
            <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/specimen_image' }">{{ $t('frontPage.buttons.specimenImage') }}</router-link>
            <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/other_file' }">{{ $t('frontPage.buttons.otherFiles') }}</router-link>
            <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/digitised_reference' }">{{ $t('frontPage.buttons.digitisedReference') }}</router-link>
            <router-link class="btn btn-outline-info mr-2 mb-2" :to="{ path: '/attachment' }">{{ $t('frontPage.buttons.myFiles') }}</router-link>
          </b-card>
        </b-collapse>

        <!-- REFERENCE -->
        <div class="mt-3 mb-2 toggle-collapse" @click="showCollapseReference = !showCollapseReference"
             :class="showCollapseReference ? 'collapsed' : null">
          {{ $t('frontPage.collapseReference') }}
          <font-awesome-icon v-if="showCollapseReference" icon="chevron-up" ></font-awesome-icon>
          <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
        </div>

        <b-collapse v-model="showCollapseReference" id="collapseReference">
          <b-card class="border-0">
            <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/reference/add' }">{{ $t('frontPage.buttons.reference') }}</router-link>
            <router-link class="btn btn-outline-info mr-2 mb-2" :to="{ path: '/reference' }">{{ $t('frontPage.buttons.myReferences') }}</router-link>
          </b-card>
        </b-collapse>

      </div>
    </div>
<!--
    <div class="row">
      <div class="col">
        <attachments :show-search="false" />
      </div>
    </div>
-->
  </div>
</template>

<script>
  import Attachments from '@/views/Attachments.vue'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faChevronUp} from '@fortawesome/free-solid-svg-icons'
  import {faChevronDown} from '@fortawesome/free-solid-svg-icons'

  library.add(faChevronUp, faChevronDown)

  export default {
    components: {
      Attachments,
      FontAwesomeIcon
    },
    name: "front-page",

    data() {
      return {
        user: '',
        showCollapseFiles: true,
        showCollapseReference: true,
        // developmentSetting: true, // TODO: Delete in production
      }
    },

    metaInfo () {
      return {
        title: this.$t('titles.dashboard')
      }
    },

    created: function () {
      // Gets user's name
      if (this.$session.exists() && this.$session.get('authUser') != null) {
        this.user = this.$session.get('authUser').user
      }

      // TODO: Remove this method when sure if all these fields are deleted on all users
      // this.deleteUnusedFieldsFromLocalStorage()

    },

    methods: {

      // TODO: Delete in production
      // removeAllLocalStorage() {
      //   this.$localStorage.remove('photoArchive')
      //   this.$localStorage.remove('photoArchiveKeywords')
      //   this.$localStorage.remove('specimenImage')
      //   this.$localStorage.remove('specimenImageKeywords')
      //   this.$localStorage.remove('otherFiles')
      //   this.$localStorage.remove('otherFilesKeywords')
      //   this.$localStorage.remove('imageset')
      //   this.$localStorage.remove('digitisedReference')
      //   this.toastInfo(this.$t('messages.defaultsRemoved'))
      // },

      // TODO: Delete in production
      // toastInfo(text) {
      //   this.$toast.info(text, 'Info', {
      //     position: 'bottomRight',
      //     timeout: 2000,
      //     pauseOnHover: false
      //   })
      // },

      // TODO: Remove this method when sure if all these fields are deleted on all users
      // deleteUnusedFieldsFromLocalStorage() {
      //   const photoArchive = this.$localStorage.get('photoArchive', 'fallbackValue')
      //   const specimenImage = this.$localStorage.get('specimenImage', 'fallbackValue')
      //   const otherFiles = this.$localStorage.get('otherFiles', 'fallbackValue')
      //
      //   if (photoArchive !== 'fallbackValue' && Object.keys(photoArchive).length !== 0 && photoArchive.constructor === Object) {
      //     if (typeof photoArchive.is_preferred !== 'undefined') this.$localStorage.remove('photoArchive')
      //     if (typeof photoArchive.device !== 'undefined') this.$localStorage.remove('photoArchive')
      //     if (typeof photoArchive.device_digitised !== 'undefined') this.$localStorage.remove('photoArchive')
      //   }
      //   if (specimenImage !== 'fallbackValue' && Object.keys(specimenImage).length !== 0 && specimenImage.constructor === Object) {
      //     if (typeof specimenImage.is_preferred !== 'undefined') this.$localStorage.remove('specimenImage')
      //     if (typeof specimenImage.device !== 'undefined') this.$localStorage.remove('specimenImage')
      //     if (typeof specimenImage.device_digitised !== 'undefined') this.$localStorage.remove('specimenImage')
      //   }
      //   if (otherFiles !== 'fallbackValue' && Object.keys(otherFiles).length !== 0 && otherFiles.constructor === Object) {
      //     if (typeof otherFiles.is_preferred !== 'undefined') this.$localStorage.remove('otherFiles')
      //     if (typeof otherFiles.device !== 'undefined') this.$localStorage.remove('otherFiles')
      //     if (typeof otherFiles.device_digitised !== 'undefined') this.$localStorage.remove('otherFiles')
      //   }
      // }
    }
  }
</script>

<style scoped>
  .toggle-collapse {
    font-weight: bold;
    font-size: large;
  }

  .toggle-collapse:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  /* Overrides bootstrap card padding */
  .card-body {
    padding: 0;
  }
</style>
