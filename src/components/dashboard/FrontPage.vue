<template>
  <div class="front-page">

    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t('frontPage.welcome') }}, <span class="text-capitalize">{{ name }} {{ surname }}</span>!</p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col">
        <b-card class="p-3 border border-danger larger">
          Siinne kasutajaliides on aktiivses arenduses ja muutumises. Kui mõni funktsioon ei tööta, siis on soovitav kasutada eelmist stabiilsemat versiooni: <a href="https://edit.geocollections.info">https://edit.geocollections.info</a>.<br />
          Vigadest anna teada githubis: <a href="https://github.com/geocollections/sarv-edit">https://github.com/geocollections/sarv-edit</a> või kirjuta: olle.hints@taltech.ee, või helista: 5130157.
        </b-card>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12">
        <h4>{{ $t('frontPage.collapseFindFast') }}:</h4>
      </div>
      
      <div class="col-6">
        <b-card class="p-3 border border-warning larger">
        <!-- FILES -->
        <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/attachment' }">{{ $t('frontPage.buttons.myFiles') }} </router-link>
        <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/photo_archive' }">{{ $t('frontPage.buttons.photoArchive') }} </router-link>
        <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/specimen_image' }">{{ $t('frontPage.buttons.specimenImage') }} </router-link>
        <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/other_file' }">{{ $t('frontPage.buttons.otherFiles') }} </router-link> 
        <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/attachment/add/digitised_reference' }">{{ $t('frontPage.buttons.digitisedReference') }} </router-link>
        <br />
        
        <!-- REFERENCE -->
        <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/reference' }">{{ $t('frontPage.buttons.myReferences') }} </router-link>
        <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/reference/add' }">{{ $t('frontPage.buttons.reference') }} </router-link>
        <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/library' }">{{ $t('frontPage.buttons.libraries') }} </router-link>
        <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/library/add' }">{{ $t('frontPage.buttons.library') }} </router-link>
        
        <br />
        
        <div v-if="permissions.attachment" >
          <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/doi' }"> DOI </router-link>
          <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/doi/add' }">Add DOI </router-link>
          <br />
        </div>
        </b-card>
      </div>
      <div class="col-6">
        <b-card class="p-3 border border-warning larger">
        <!-- PROJECT -->
        <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/project' }"> Projects </router-link>
        <span v-if="activeProject>0"><router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/project/' + activeProject }">My active project: {{ activeProject }} </router-link></span>
        <span v-if="activeSite>0"><router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/site/' + activeSite }">Last visited site: {{ activeSite }}</router-link></span>
        </br >
        
        <!-- LOCALITY -->
        <div v-if="permissions.locality" >
          <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/locality' }">{{ $t('frontPage.buttons.localities') }} </router-link>
          <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/locality/add' }">{{ $t('frontPage.buttons.locality') }} </router-link>
        </br >
        </div>

        <!-- SAMPLE -->
        <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/sample' }">{{ $t('frontPage.buttons.samples') }} </router-link>
        <span v-if="activeSample>0"><router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/sample/' + activeSample }"> My last sample: {{ activeSample }} </router-link></span>
        <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/sample/add' }">{{ $t('frontPage.buttons.sample') }}</router-link>
        <br />
        </b-card>
      </div>
      
    </div>
    </br >

    <recent-activity class="mt-2" :user="user"></recent-activity>


  </div>
</template>

<script>
  import Attachments from '@/views/AttachmentsOld.vue'
  import RecentActivity from "./RecentActivity";
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faChevronUp} from '@fortawesome/free-solid-svg-icons'
  import {faChevronDown} from '@fortawesome/free-solid-svg-icons'

  library.add(faChevronUp, faChevronDown)

  export default {
    components: {
      RecentActivity,
      Attachments,
      FontAwesomeIcon
    },
    name: "front-page",

    data() {
      return {
        user: '',
        name: '',
        surname: '',
        activeProject:'',
        showCollapseFiles: true,
        showCollapseReference: true,
        showCollapseLocality: false,
        showCollapseSample: false,
        showCollapseLibrary: false,
        permissions: '',
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
        this.user = this.$session.get('authUser').user;
        this.name = this.$session.get('authUser').name;
        this.surname = this.$session.get('authUser').surname;
      }
      this.activeProject = this.$localStorage.get('activeProject')[0];
      this.activeSite = this.$localStorage.get('activeSite');
      this.activeSample = this.$localStorage.get('activeSample');
      this.permissions = this.$session.get('authUser').permissions
    },
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
