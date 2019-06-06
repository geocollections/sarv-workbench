<template>
<!-- TODO: Drop Material Icons and get font awesome icons working -->
  <vs-sidebar :parent="$refs.parentSidebar" default-index="1" color="primary" class="sidebarx"
              :hidden-background="true"
              spacer v-model="active">

<!--    <div class="header-sidebar" slot="header"> This makes it fixed  -->
    <div class="header-sidebar">
      <vs-avatar/>

      <h6>{{ name }} {{ surname }}</h6>
    </div>

    <vs-divider class="mt-0 mb-1"></vs-divider>

    <!-- STATIC LINKS -->
    <vs-sidebar-group :open="!$route.meta.isEdit" :title="$t('header.title')" id="sidebar-navigation-links">
      <vs-sidebar-item index="1" icon="fa-home" icon-pack="fas" :to="{ path: '/dashboard' }">
        {{ $t('buttons.homePage') }}
      </vs-sidebar-item>

      <vs-sidebar-group v-if="permissions.project" :title="$t('header.projects')">
        <vs-sidebar-item index="2.1" icon="fa-table" icon-pack="fas" :to="{ path: '/project' }">
          {{ $t('header.editProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="2.2" icon="fa-plus-square" icon-pack="far" :to="{ path: '/project/add' }">
          {{ $t('header.addProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeProject > 0" index="2.3" icon="fa-globe-americas" icon-pack="fas" :to="{ path: '/project/' + activeProject }">
          {{ $t('frontPage.buttons.activeProject') }}: {{ activeProject }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSite > 0" index="2.4" icon="fa-map-marker-alt" icon-pack="fas" :to="{ path: '/site/' + activeSite }">
          {{ $t('frontPage.buttons.activeSite') }}: {{ activeSite }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- TODO: Site not in permissions atm -->
<!--      <vs-sidebar-group v-if="permissions.site" :title="$t('header.sites')">-->
      <vs-sidebar-group :title="$t('header.sites')">
        <vs-sidebar-item index="2.1" icon="fa-globe" icon-pack="fas" :to="{ path: '/site' }">
          {{ $t('header.editSite') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="2.2" icon="fa-map-pin" icon-pack="fas" :to="{ path: '/site/add' }">
          {{ $t('header.addSite') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.attachment" :title="$t('header.files')">
        <vs-sidebar-item index="3.1" icon="fa-folder" icon-pack="far" :to="{ path: '/attachment' }">
          {{ $t('frontPage.buttons.myFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.2" icon="fa-image" icon-pack="far" :to="{ path: '/attachment/add/photo_archive' }">
          {{ $t('frontPage.buttons.photoArchive') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.3" icon="fa-image" icon-pack="fas" :to="{ path: '/attachment/add/specimen_image' }">
          {{ $t('frontPage.buttons.specimenImage') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.4" icon="fa-file" icon-pack="far" :to="{ path: '/attachment/add/other_file' }">
          {{ $t('frontPage.buttons.otherFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.5" icon="fa-file-pdf" icon-pack="far" :to="{ path: '/attachment/add/digitised_reference' }">
          {{ $t('frontPage.buttons.digitisedReference') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.reference" :title="$t('header.references')">
        <vs-sidebar-item index="4.1" icon="fa-book" icon-pack="fas" :to="{ path: '/reference' }">
          {{ $t('frontPage.buttons.myReferences') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="4.2" icon="fa-book-open" icon-pack="fas" :to="{ path: '/reference/add' }">
          {{ $t('frontPage.buttons.reference') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.library" :title="$t('header.libraries')">
        <vs-sidebar-item index="5.1" icon="fa-list-alt" icon-pack="far" :to="{ path: '/library' }">
          {{ $t('frontPage.buttons.libraries') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="5.2" icon="fa-edit" icon-pack="far" :to="{ path: '/library/add' }">
          {{ $t('frontPage.buttons.library') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.locality" :title="$t('header.localities')">
        <vs-sidebar-item index="6.1" icon="fa-map-marked-alt" icon-pack="fas" :to="{ path: '/locality' }">
          {{ $t('frontPage.buttons.localities') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="6.2" icon="fa-map-marker-alt" icon-pack="fas" :to="{ path: '/locality/add' }">
          {{ $t('frontPage.buttons.locality') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.sample" :title="$t('header.samples')">
        <vs-sidebar-item index="7.1" icon="fa-vials" icon-pack="fas" :to="{ path: '/sample' }">
          {{ $t('frontPage.buttons.samples') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="7.2" icon="fa-vial" icon-pack="fas" :to="{ path: '/sample/add' }">
          {{ $t('frontPage.buttons.sample') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSample > 0" index="7.3" icon="fa-fill-drip" icon-pack="fas" :to="{ path: '/sample/' + activeSample }">
          {{ $t('frontPage.buttons.activeSample') }}: {{ activeSample }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <!-- TODO: Analysis not in permissions atm -->
<!--      <vs-sidebar-group v-if="permissions.analysis" :title="$t('header.analyses')">-->
      <vs-sidebar-group :title="$t('header.analyses')">
        <vs-sidebar-item index="2.1" icon="fa-chart-bar" icon-pack="far" :to="{ path: '/analysis' }">
          {{ $t('header.editAnalysis') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="2.2" icon="fa-chart-pie" icon-pack="fas" :to="{ path: '/analysis/add' }">
          {{ $t('header.addAnalysis') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.doi" :title="$t('header.dois')">
        <vs-sidebar-item index="8.1" icon="fa-database" icon-pack="fas" :to="{ path: '/doi' }">
          {{ $t('header.dois') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="8.2" icon="fa-plus-circle" icon-pack="fas" :to="{ path: '/doi/add' }">
          {{ $t('frontPage.buttons.doi') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

    </vs-sidebar-group>


    <!-- SCROLL TO LINKS -->
    <div class="sidebar-scroll-to" v-if="$route.meta.isEdit && activeSearchParams !== null && typeof activeSearchParams.block !== 'undefined' && activeSearchParams.block !== null">
      <vs-divider class="mt-0 mb-1"></vs-divider>

      <vs-sidebar-item v-for="(value, name, index) in activeSearchParams.block"
                       :key="name"
                       :index="'9' + index" v-scroll-to="'#block-' + name"
                       :icon="getIcon(name)"
                       :icon-pack="getIconPack(name)">
        {{ $t('sidebar.' + $route.meta.table + '.' + name) }}
      </vs-sidebar-item>

      <vs-divider class="mt-1 mb-1"></vs-divider>
    </div>

    <!-- SITES only for Project -->
    <vs-sidebar-group v-if="$route.meta.isEdit && $route.meta.table === 'project'" :title="$t('header.sites').toUpperCase()">
      <vs-sidebar-item icon="fa-plus-square" icon-pack="far" @click="setAction('addSite')">
        {{ $t('header.addSite') }}
      </vs-sidebar-item>
    </vs-sidebar-group>

    <!-- SAMPLES only for Site -->
    <vs-sidebar-group v-if="$route.meta.isEdit && $route.meta.table === 'site'" :title="$t('header.samples').toUpperCase()">
      <vs-sidebar-item icon="fa-plus-square" icon-pack="far" @click="setAction('addSample')">
        {{ $t('header.addSample') }}
      </vs-sidebar-item>
    </vs-sidebar-group>

    <!-- DYNAMIC DATA -->
    <vs-sidebar-group v-if="$route.meta.isEdit && activeSearchParams !== null" :open="$route.meta.isEdit" :title="$t(activeSearchParams.title).toUpperCase()">

      <!-- ROUTER LINKS -->
      <vs-list-item v-for="entity in sidebarList.results"
                    :key="$route.meta.table !== 'library' ? entity.id : entity.library"
                    v-if="sidebarList.results && sidebarList.results.length > 0"
                    @click="test"
                    class="router-list-link"
                    :class="$route.meta.table !== 'library' ? { active: $route.params.id == entity.id } : { active: $route.params.id == entity.library }"
                    :subtitle="$route.meta.table !== 'library' ? entity.id + ' - ' + entity[activeSearchParams.field] : entity.library + ' - ' + entity[activeSearchParams.field]">
        <router-link :to="$route.meta.table !== 'library' ? { path: '/' + $route.meta.table + '/' + entity.id } : { path: '/' + $route.meta.table + '/' + entity.library }">
          <vs-button radius icon="fa-long-arrow-alt-right" icon-pack="fas" color="dark" type="line"></vs-button>
        </router-link>
      </vs-list-item>


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


<!--    <vs-divider icon="fa-user" icon-pack="fas" position="left"></vs-divider>-->


<!--    <div class="footer-sidebar" slot="footer">-->
<!--      <vs-button icon="fa-sign-out-alt" icon-pack="fas" color="danger" type="border" @click="logOut()">{{ $t('header.logOut') }}</vs-button>-->
<!--      <vs-button icon="fa-cog" icon-pack="fas" color="primary" type="border" :title="$t('header.settings')" :to="{ path: '/settings' }"></vs-button>-->
<!--    </div>-->

  </vs-sidebar>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import authenticate from "../mixins/authenticate";

  export default {
    name: "SidebarVuesax",
    mixins: [authenticate],
    data() {
      return {
        user: '',
        name: '',
        surname: '',
        activeProject:'',
        activeSite:'',
        activeSample:'',
        permissions: '',
        active: true,
        isReduced: false,
      }
    },

    computed: {
      activeSearchParams() {
        return this.$store.state['activeSearchParams']
      },

      sidebarList() {
        return this.$store.state['sidebarList']
      }
    },

    created: function () {
      // Gets user's data
      if (this.$session.exists() && this.$session.get('authUser') != null) {
        this.user = this.$session.get('authUser').user;
        this.name = this.$session.get('authUser').name;
        this.surname = this.$session.get('authUser').surname;
        this.permissions = this.$session.get('authUser').permissions
      }

      if(this.$store.state['activeSearchParams'] !== null) {
        this.$store.dispatch(this.$store.state['activeSearchParams'].request)
      }

      this.activeProject = this.$localStorage.get('activeProject')[0];
      this.activeSite = this.$localStorage.get('activeSite');
      this.activeSample = this.$localStorage.get('activeSample');
    },

    watch: {
      'activeSearchParams': {
        handler: function (newval, oldval) {
          if(newval === null) return
          this.$store.dispatch(newval.request)
        },
        deep: true
      },
      'sidebarList': {
        handler: function (newval, oldval) {

        },
        deep: true
      },


    },

    methods: {
      test() {
        console.log('test')
      },

      nextPage() {
        this.$store.state.activeSearchParams.search.page += 1
      },

      previousPage() {
        this.$store.state.activeSearchParams.search.page -= 1
      },

      getIcon(name) {
        if (name === 'info') return 'fa-project-diagram'
        if (name === 'description') return 'fa-pen-fancy'
        if (name === 'members') return 'fa-user-friends'
        if (name === 'files') return 'fa-folder-open'
        if (name === 'sites') return 'fa-globe-americas'
        if (name === 'location') return 'fa-globe'
        if (name === 'samples') return 'fa-vial'
        if (name === 'digital') return 'fa-file-pdf'
        if (name === 'libraries') return 'fa-book'
        if (name === 'localities') return 'fa-map-marked'
        if (name === 'requiredFields') return 'fa-check'
        if (name === 'referenceAndDataset') return 'fa-book'
        if (name === 'datacite') return 'fa-sitemap'
      },

      getIconPack(name) {
        return 'fas'
      },

      setAction(action, choice) {
        // Look sidebarMixin.js for more info
        // Todo: Should update it
        this.$store.commit("SET_SIDEBAR_USER_ACTION", {userAction: {action: action, choice:choice} })
      },

    },

  }
</script>

<style scoped>
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

  .vs-sidebar--item {
    transition: unset;
    -webkit-transition: unset;
  }

  .vs-sidebar-item-active > a {
    transition: unset;
    -webkit-transition: unset;
  }

  .vs-sidebar--item:hover {
    color: #1F74FF;
  }
</style>
