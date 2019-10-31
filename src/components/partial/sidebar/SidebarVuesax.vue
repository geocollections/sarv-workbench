<template>
  <vs-sidebar :parent="$refs.parentSidebar" default-index="1" color="primary" class="sidebarx"
              :hidden-background="hideBackground"
              spacer v-model="active">

    <!--    <div class="header-sidebar" slot="header"> This makes it fixed  -->
    <div class="header-sidebar">
      <vs-avatar @click="$router.push({ path: '/settings' })" title="Go to settings"/>

      <h6 @click="$router.push({ path: '/settings' })" title="Go to settings">{{ currentUser.forename }} {{ currentUser.surename }}</h6>
    </div>

    <vs-divider class="mt-0 mb-1"></vs-divider>

    <vs-sidebar-item index="1" icon="fa-home" icon-pack="fas" :to="{ path: '/dashboard' }">
      {{ $t('buttons.homePage') }}
    </vs-sidebar-item>

    <!-- STATIC LINKS -->
    <vs-sidebar-group :open="!$route.meta.isEdit" :title="$t('header.title')" id="sidebar-navigation-links">

      <!-- PROJECTS -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'project')" :title="$t('header.projects')">
        <vs-sidebar-item index="2.1" icon="fa-table" icon-pack="fas" :to="{ path: '/project' }">
          {{ $t('header.editProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="2.2" icon="fa-plus-square" icon-pack="far" :to="{ path: '/project/add' }">
          {{ $t('header.addProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeProject" index="2.3" icon="fa-globe-americas" icon-pack="fas"
                         :to="{ path: '/project/' + activeProject.id }">
          {{ $t('frontPage.buttons.activeProject') }}: {{ activeProject.id }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- SITES -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'site')" :title="$t('header.sites')">
        <vs-sidebar-item index="3.1" icon="fa-globe" icon-pack="fas" :to="{ path: '/site' }">
          {{ $t('header.editSite') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.2" icon="fa-map-pin" icon-pack="fas" :to="{ path: '/site/add' }">
          {{ $t('header.addSite') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSite > 0" index="3.3" icon="fa-map-marker-alt" icon-pack="fas"
                         :to="{ path: '/site/' + activeSite }">
          {{ $t('frontPage.buttons.activeSite') }}: {{ activeSite }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- ATTACHMENTS -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'attachment') || isUserAllowedTo('add', 'imageset')"
                        :title="$t('header.files')">
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'attachment')" index="4.1" icon="fa-folder" icon-pack="far"
                         :to="{ path: '/attachment' }">
          {{ $t('frontPage.buttons.myFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'attachment')" index="4.2" icon="fa-image" icon-pack="far"
                         :to="{ path: '/attachment/add/photo_archive' }">
          {{ $t('frontPage.buttons.photoArchive') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'attachment')" index="4.3" icon="fa-image" icon-pack="fas"
                         :to="{ path: '/attachment/add/specimen_image' }">
          {{ $t('frontPage.buttons.specimenImage') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'attachment')" index="4.4" icon="fa-file" icon-pack="far"
                         :to="{ path: '/attachment/add/other_file' }">
          {{ $t('frontPage.buttons.otherFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'attachment')" index="4.5" icon="fa-file-pdf" icon-pack="far"
                         :to="{ path: '/attachment/add/digitised_reference' }">
          {{ $t('frontPage.buttons.digitisedReference') }}
        </vs-sidebar-item>

        <vs-sidebar-item v-if="isUserAllowedTo('add', 'imageset')" index="4.6" icon="fa-images" icon-pack="far"
                         :to="{ path: '/imageset/add' }">
          {{ $t('frontPage.buttons.imageset') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- REFERENCES -->
      <vs-sidebar-group
        v-if="isUserAllowedTo('add', 'reference') || isUserAllowedTo('add', 'library') || isUserAllowedTo('add', 'journal')"
        :title="$t('header.references')">
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'reference')" index="5.1" icon="fa-book" icon-pack="fas"
                         :to="{ path: '/reference' }">
          {{ $t('frontPage.buttons.myReferences') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'reference')" index="5.2" icon="fa-book-open" icon-pack="fas"
                         :to="{ path: '/reference/add' }">
          {{ $t('frontPage.buttons.reference') }}
        </vs-sidebar-item>

        <vs-sidebar-item v-if="isUserAllowedTo('add', 'library')" index="5.3" icon="fa-list-alt" icon-pack="far"
                         :to="{ path: '/library' }">
          {{ $t('frontPage.buttons.libraries') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'library')" index="5.4" icon="fa-edit" icon-pack="far"
                         :to="{ path: '/library/add' }">
          {{ $t('frontPage.buttons.library') }}
        </vs-sidebar-item>

        <vs-sidebar-item v-if="isUserAllowedTo('add', 'journal')" index="5.5" icon="fa-newspaper" icon-pack="fas"
                         :to="{ path: '/journal' }">
          {{ $t('frontPage.buttons.journals') }}
        </vs-sidebar-item>

        <vs-sidebar-item v-if="isUserAllowedTo('add', 'journal')" index="5.6" icon="fa-newspaper" icon-pack="far"
                         :to="{ path: '/journal/add' }">
          {{ $t('frontPage.buttons.journal') }}
        </vs-sidebar-item>

        <vs-sidebar-item v-if="isUserAllowedTo('add', 'keyword')" index="5.7" icon="fa-scroll" icon-pack="fas"
                         :to="{ path: '/keyword' }">
          {{ $t('frontPage.buttons.keywords') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="isUserAllowedTo('add', 'keyword')" index="5.8" icon="fa-stream" icon-pack="fas"
                         :to="{ path: '/keyword/add' }">
          {{ $t('frontPage.buttons.keyword') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- LOCALITIES -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'locality')" :title="$t('header.localities')">
        <vs-sidebar-item index="6.1" icon="fa-map-marked-alt" icon-pack="fas" :to="{ path: '/locality' }">
          {{ $t('frontPage.buttons.localities') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="6.2" icon="fa-map-marker-alt" icon-pack="fas" :to="{ path: '/locality/add' }">
          {{ $t('frontPage.buttons.locality') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- SAMPLES -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'sample')" :title="$t('header.samples')">
        <vs-sidebar-item index="7.1" icon="fa-vials" icon-pack="fas" :to="{ path: '/sample' }">
          {{ $t('frontPage.buttons.samples') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="7.2" icon="fa-vial" icon-pack="fas" :to="{ path: '/sample/add' }">
          {{ $t('frontPage.buttons.sample') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSample > 0" index="7.3" icon="fa-fill-drip" icon-pack="fas"
                         :to="{ path: '/sample/' + activeSample }">
          {{ $t('frontPage.buttons.activeSample') }}: {{ activeSample }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- ANALYSIS -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'analysis')" :title="$t('header.analyses')">
        <vs-sidebar-item index="8.1" icon="fa-chart-bar" icon-pack="far" :to="{ path: '/analysis' }">
          {{ $t('header.editAnalysis') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="8.2" icon="fa-chart-pie" icon-pack="fas" :to="{ path: '/analysis/add' }">
          {{ $t('header.addAnalysis') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- DOI -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'doi')" :title="$t('header.dois')">
        <vs-sidebar-item index="9.1" icon="fa-database" icon-pack="fas" :to="{ path: '/doi' }">
          {{ $t('header.dois') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="9.2" icon="fa-plus-circle" icon-pack="fas" :to="{ path: '/doi/add' }">
          {{ $t('frontPage.buttons.doi') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- SPECIMEN -->
      <vs-sidebar-group v-if="isUserAllowedTo('add', 'specimen')" :title="$t('header.specimens')">
        <vs-sidebar-item index="10.1" icon="fa-flask" icon-pack="fas" :to="{ path: '/specimen' }">
          {{ $t('header.specimens') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="10.2" icon="fa-plus-circle" icon-pack="fas" :to="{ path: '/specimen/add' }">
          {{ $t('frontPage.buttons.specimen') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

    </vs-sidebar-group>


    <!-- SITES only for Project -->
    <vs-sidebar-group v-if="$route.meta.isEdit && $route.meta.table === 'project'"
                      :title="$t('header.sites').toUpperCase()">
      <vs-sidebar-item icon="fa-plus-square" icon-pack="far" @click="setAction('add', 'Site')">
        {{ $t('header.addSite') }}
      </vs-sidebar-item>
    </vs-sidebar-group>

    <!-- SAMPLES only for Site -->
    <vs-sidebar-group v-if="$route.meta.isEdit && $route.meta.table === 'site'"
                      :title="$t('header.samples').toUpperCase()">
      <vs-sidebar-item icon="fa-plus-square" icon-pack="far" @click="setAction('add', 'Sample')">
        {{ $t('header.addSample') }}
      </vs-sidebar-item>
    </vs-sidebar-group>

    <!-- LIBRARIES only for Reference table view -->
    <vs-sidebar-group v-if="$route.meta.isTableView && $route.meta.table === 'reference'"
                      :title="$t('sidebar.library.active').toUpperCase()"
                      :open="$route.meta.isTableView && $route.meta.table === 'reference'">
      <div class="vs-list--item router-list-link"
           :class="{ active: activeLibrary.library === entity.library }"
           :title=" activeLibrary.library === entity.library ? $t('sidebar.library.inactiveTitle') : $t('sidebar.library.activeTitle')"
           v-for="entity in sidebarList.results"
           @click="makeActive(entity)">

        <div class="list-titles">
          <div class="vs-list--subtitle">
            {{ entity.library + ' - ' + entity[activeSearchParams.field] }}
            {{ entity.library === activeLibrary.library ? '(' + $t('sidebar.library.isActive') + ')' : '' }}
          </div>
        </div>
      </div>

      <!-- PAGINATION BUTTONS -->
      <vs-row class="sidebar-pagination">
        <vs-col vs-type="flex" vs-justify="center" vs-w="2">
          <vs-button radius class="mt-1" icon="fa-angle-double-left" icon-pack="fas" color="primary" type="line"
                     @click="previousPage"
                     v-if="sidebarList.totalPages && activeSearchParams.search.page > 1"></vs-button>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-w="8">
          <span class="page-info">
            {{ sidebarList.page }}
          </span>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-w="2">
          <vs-button radius class="mt-1" icon="fa-angle-double-right" icon-pack="fas" color="primary" type="line"
                     @click="nextPage"
                     v-if="sidebarList.totalPages  && activeSearchParams.search.page < sidebarList.totalPages"></vs-button>
        </vs-col>
      </vs-row>
    </vs-sidebar-group>

    <vs-divider v-if="$route.meta.isEdit && activeSearchParams !== null" class="mt-1 mb-2" icon="fa-list-ul" icon-pack="fas" position="left">
      List
    </vs-divider>

    <!-- DYNAMIC DATA -->
    <vs-sidebar-group v-if="$route.meta.isEdit && activeSearchParams !== null"
                      :open="$route.meta.isEdit"
                      :title="$t(activeSearchParams.title).toUpperCase()">

      <!-- ROUTER LINKS -->
      <div class="vs-list--item router-list-link"
           v-for="entity in sidebarList.results"
           :key="$route.meta.table !== 'library' ? entity.id : entity.library"
           v-if="sidebarList.results && sidebarList.results.length > 0"
           @click="$route.meta.table !== 'library' ? $router.push({ path: '/' + $route.meta.table + '/' + entity.id }) : $router.push({ path: '/' + $route.meta.table + '/' + entity.library })"
           :class="$route.meta.table !== 'library' ? { active: $route.params.id == entity.id } : { active: $route.params.id == entity.library }">
        <div class="list-titles">
          <div class="vs-list--subtitle">
            {{ $route.meta.table !== 'library' ? entity.id + ' - ' + entity[activeSearchParams.field] : entity.library
            + ' - ' + entity[activeSearchParams.field] }}
          </div>
        </div>
      </div>

      <!-- PAGINATION BUTTONS -->
      <vs-row class="sidebar-pagination">
        <vs-col vs-type="flex" vs-justify="center" vs-w="2">
          <vs-button radius class="mt-1" icon="fa-angle-double-left" icon-pack="fas" color="primary" type="line"
                     @click="previousPage"
                     v-if="sidebarList.totalPages && activeSearchParams.search.page > 1"></vs-button>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-w="8">
          <span class="page-info">
            {{ sidebarList.page }}
          </span>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-w="2">
          <vs-button radius class="mt-1" icon="fa-angle-double-right" icon-pack="fas" color="primary" type="line"
                     @click="nextPage"
                     v-if="sidebarList.totalPages  && activeSearchParams.search.page < sidebarList.totalPages"></vs-button>
        </vs-col>
      </vs-row>
    </vs-sidebar-group>


    <div class="footer-sidebar d-none d-md-block d-lg-block d-xl-none" slot="footer">
      <vs-button class="thumbstack" :class="{ active : thumbstackState }" icon="fa-thumbtack" icon-pack="fas" color="primary" type="line" @click="$emit('thumbstack-button-clicked')"></vs-button>

      <!--      <vs-button icon="fa-sign-out-alt" icon-pack="fas" color="danger" type="border" @click="logOut()">{{ $t('header.logOut') }}</vs-button>-->
    <!--      <vs-button icon="fa-cog" icon-pack="fas" color="primary" type="border" :title="$t('header.settings')" :to="{ path: '/settings' }"></vs-button>-->
    </div>

  </vs-sidebar>

</template>

<script>
  import SidebarToggleButton from "./SidebarToggleButton";
  import {mapGetters, mapState} from "vuex";

  export default {
    name: "SidebarVuesax",
    components: {SidebarToggleButton},
    props: {
      sidebarState: {
        type: Boolean,
      },
      hideBackground: {
        type: Boolean,
      },
      thumbstackState: {
        type: Boolean,
      }
    },
    data() {
      return {
        user: '',
        name: '',
        surname: '',
        activeSite: '',
        activeSample: '',
        active: this.sidebarState,
        isReduced: false,
        hiddenBackground: this.hideBackground,
      }
    },

    computed: {
      activeSearchParams() {
        return this.$store.state['activeSearchParams']
      },

      sidebarList() {
        return this.$store.state['sidebarList']
      },

      activeLibrary() {
        if (this.$store.state['activeLibrary'] !== null) return this.$store.state['activeLibrary'];
        else return '';
      },

      activeProject() {
        if (this.$store.state['activeProject'] !== null) return this.$store.state['activeProject'];
        else return '';
      },

      ...mapState(["currentUser"]),
      ...mapGetters(['isUserAllowedTo'])
    },

    created: function () {
      if (this.$store.state['activeSearchParams'] !== null) {
        this.$store.dispatch(this.$store.state['activeSearchParams'].request)
      }

      this.activeSite = this.$localStorage.get('activeSite');
      this.activeSample = this.$localStorage.get('activeSample');
    },

    watch: {
      'activeSearchParams.search.page': {
        handler: function (newVal, oldVal) {
          if (newVal && this.activeSearchParams && this.activeSearchParams.request) {
            this.$store.dispatch(this.activeSearchParams.request)
          }
        },
        deep: true
      },
      'sidebarList': {
        handler: function (newVal, oldVal) {

        },
        deep: true
      },


    },

    methods: {
      nextPage() {
        this.$store.state.activeSearchParams.search.page += 1
      },

      previousPage() {
        this.$store.state.activeSearchParams.search.page -= 1
      },

      setAction(action, choice) {
        this.$store.dispatch('SIDEBAR_USER_ACTION', {
          userAction: { action: action, choice: choice }
        })
      },

      makeActive(library) {
        if (this.activeLibrary.id === library.id) {
          this.$store.dispatch('ACTIVE_LIBRARY', null)
        } else {
          this.$store.dispatch('ACTIVE_LIBRARY', library)
        }
      },
    },

  }
</script>

<style>
  .header-sidebar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }

  .footer-sidebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .footer-sidebar > button {
    border: 0 solid rgba(0, 0, 0, 0) !important;
    border-left: 1px solid rgba(0, 0, 0, .07) !important;
    border-radius: 0 !important;
  }

  .sidebar-pagination {
    padding-right: 10px;
  }

  .page-info {
    padding-top: 10px;
  }

  .router-list-link {
    /*-webkit-transition: color 200ms ease-out, font-weight 200ms ease-out;*/
    /*-moz-transition: color 200ms ease-out, font-weight 200ms ease-out;*/
    /*-o-transition: color 200ms ease-out, font-weight 200ms ease-out;*/
    /*-ms-transition: color 200ms ease-out, font-weight 200ms ease-out;*/
    /*transition: color 200ms ease-out, font-weight 200ms ease-out;*/
  }

  .router-list-link.active {
    box-shadow: -3px 0 #007bff;
    color: #1F74FF;
    font-weight: bold;
    /*-webkit-transition: color 200ms ease-in, font-weight 200ms ease-in;*/
    /*-moz-transition: color 200ms ease-in, font-weight 200ms ease-in;*/
    /*-o-transition: color 200ms ease-in, font-weight 200ms ease-in;*/
    /*-ms-transition: color 200ms ease-in, font-weight 200ms ease-in;*/
    /*transition: color 200ms ease-in, font-weight 200ms ease-in;*/
  }

  .router-list-link:hover {
    color: #1F74FF;
    /*font-weight: bold;*/
    cursor: pointer;
  }

  .vs-sidebar--item {
    transition: unset !important;
    -webkit-transition: unset !important;
  }

  .vs-sidebar--item > a {
    transition: unset !important;
    -webkit-transition: unset !important;
  }

  .vs-sidebar--item-active > a {
    transition: unset !important;
    -webkit-transition: unset !important;
  }

  .vs-sidebar--item:hover {
    color: #1F74FF;
  }

  .vs-sidebar-group h4 {
    font-size: .95rem !important;
  }

  .header-sidebar > h6:hover {
    cursor: pointer;
  }

  .thumbstack {
    float: right !important;
  }

  .thumbstack.active .vs-icon {
    transform: unset;
  }

  .thumbstack > .vs-icon {
    transform: rotateZ(45deg);
  }

  .thumbstack:hover .vs-icon {
    transform: unset;
  }
</style>
