<template>
  <div class="front-page">

    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t('frontPage.welcome') }}, <span class="text-capitalize">{{ user }}</span>!</p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col">
        <b-card class="p-3 border border-danger larger">
          See tarkavara on testimisjärgus. Kui mõni funktsioon siin ei tööta, siis proovi eelmist versiooni: <a href="https://edit.geocollections.info">https://edit.geocollections.info</a>.<br />
          Vigadest anna teada githubis: <a href="https://github.com/geocollections/sarv-edit">https://github.com/geocollections/sarv-edit</a> või kirjuta: olle.hints@taltech.ee, või helista: 5130157.
        </b-card>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-sm-6 mb-2">
        <p>{{ $t('frontPage.info') }}: <a href="https://geocollections.info" target="_blank">https://geocollections.info</a></p>


      </div>

      <div class="col-sm-6">

        <div class="row">
          <div class="col">

            <!-- FILES -->
            <div class="mb-2 toggle-collapse" @click="showCollapseFiles = !showCollapseFiles"
                 :class="showCollapseFiles ? 'collapsed' : null">
              {{ $t('frontPage.collapseFindFast') }}
              <font-awesome-icon v-if="showCollapseFiles" icon="chevron-up"></font-awesome-icon>
              <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
            </div>

            <b-collapse v-model="showCollapseFiles" id="collapseFiles">
              <b-card class="border-0 p-2">
                <!--<router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/attachment' }">{{
                  $t('frontPage.buttons.myFiles') }}
                </router-link>-->
                <router-link class="btn btn-outline-primary mr-2 mb-2" :to="{ path: '/attachment/add/photo_archive' }">{{
                  $t('frontPage.buttons.photoArchive') }}
                </router-link>
                <router-link class="btn btn-outline-primary mr-2 mb-2" :to="{ path: '/attachment/add/specimen_image' }">{{
                  $t('frontPage.buttons.specimenImage') }}
                </router-link>
                <router-link class="btn btn-outline-primary mr-2 mb-2" :to="{ path: '/attachment/add/other_file' }">{{
                  $t('frontPage.buttons.otherFiles') }}
                </router-link>
                <router-link class="btn btn-outline-primary mr-2 mb-2" :to="{ path: '/attachment/add/digitised_reference' }">{{
                  $t('frontPage.buttons.digitisedReference') }}
                </router-link>
                <br />
                <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/reference/add' }">{{
                    $t('frontPage.buttons.reference') }}
                </router-link>
              </b-card>
            </b-collapse>

          </div>
        </div>


        <div class="row">
          <div class="col-md-6">

            <!-- REFERENCE
            <div class="mt-3 mb-2 toggle-collapse" @click="showCollapseReference = !showCollapseReference"
                 :class="showCollapseReference ? 'collapsed' : null">
              {{ $t('frontPage.collapseReference') }}
              <font-awesome-icon v-if="showCollapseReference" icon="chevron-up"></font-awesome-icon>
              <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
            </div>

            <b-collapse v-model="showCollapseReference" id="collapseReference">
              <b-card class="border-0 p-2">
                <router-link class="btn btn-dark mr-2 mb-2" :to="{ path: '/reference' }">{{
                  $t('frontPage.buttons.myReferences') }}
                </router-link>
                <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/reference/add' }">{{
                  $t('frontPage.buttons.reference') }}
                </router-link>

              </b-card>
            </b-collapse>
            -->

          </div>

          <div class="col-md-6">

            <!-- LOCALITY
            <div class="mt-3 mb-2 toggle-collapse" @click="showCollapseLocality = !showCollapseLocality"
                 :class="showCollapseLocality ? 'collapsed' : null">
              {{ $t('frontPage.collapseLocality') }}
              <font-awesome-icon v-if="showCollapseLocality" icon="chevron-up"></font-awesome-icon>
              <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
            </div>

            <b-collapse v-model="showCollapseLocality" id="collapseReference">
              <b-card class="border-0">
                <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/locality/add' }">{{
                  $t('frontPage.buttons.locality') }}
                </router-link>
                <router-link class="btn btn-outline-info mr-2 mb-2" :to="{ path: '/locality' }">{{
                  $t('frontPage.buttons.localities') }}
                </router-link>
              </b-card>
            </b-collapse>
-->
          </div>
        </div>


        <div class="row">
          <div class="col-md-6">

            <!-- SAMPLE
            <div class="mt-3 mb-2 toggle-collapse" @click="showCollapseSample = !showCollapseSample"
                 :class="showCollapseSample ? 'collapsed' : null">
              {{ $t('frontPage.collapseSample') }}
              <font-awesome-icon v-if="showCollapseSample" icon="chevron-up"></font-awesome-icon>
              <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
            </div>

            <b-collapse v-model="showCollapseSample" id="collapseReference">
              <b-card class="border-0">
                <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/sample/add' }">{{
                  $t('frontPage.buttons.sample') }}
                </router-link>
                <router-link class="btn btn-outline-info mr-2 mb-2" :to="{ path: '/sample' }">{{
                  $t('frontPage.buttons.samples') }}
                </router-link>
              </b-card>
            </b-collapse>
-->
          </div>

          <div class="col-md-6">

            <!-- LIBRARY
            <div class="mt-3 mb-2 toggle-collapse" @click="showCollapseLibrary = !showCollapseLibrary"
                 :class="showCollapseLibrary ? 'collapsed' : null">
              {{ $t('frontPage.collapseLibrary') }}
              <font-awesome-icon v-if="showCollapseLibrary" icon="chevron-up"></font-awesome-icon>
              <font-awesome-icon v-else icon="chevron-down"></font-awesome-icon>
            </div>

            <b-collapse v-model="showCollapseLibrary" id="collapseReference">
              <b-card class="border-0">
                <router-link class="btn btn-outline-dark mr-2 mb-2" :to="{ path: '/library/add' }">{{
                  $t('frontPage.buttons.library') }}
                </router-link>
                <router-link class="btn btn-outline-info mr-2 mb-2" :to="{ path: '/library' }">{{
                  $t('frontPage.buttons.libraries') }}
                </router-link>
              </b-card>
            </b-collapse>
-->
          </div>
        </div>

      </div>

    </div>


    <recent-activity class="mt-2" :user="user"></recent-activity>


  </div>
</template>

<script>
  import Attachments from '@/views/Attachments.vue'
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
        showCollapseFiles: true,
        showCollapseReference: true,
        showCollapseLocality: false,
        showCollapseSample: false,
        showCollapseLibrary: false,
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
