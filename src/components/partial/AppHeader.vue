<template>
  <div class="header">

    <b-navbar type="dark" variant="dark" toggleable="lg" fixed="top" style="z-index: 40001">

      <!-- TODO: If small screen change header to icon -->
      <b-navbar-brand :to="{ path: '/dashboard' }">
        <span>{{ $t('header.title') }}</span>
<!--        <span class="only-big-screen">{{ $t('header.title') }}</span>-->
<!--        <span class="only-small-screen"><font-awesome-icon icon="home"/></span>-->
      </b-navbar-brand>

      <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>

      <b-collapse is-nav id="nav_dropdown_collapse" class="text-center">


        <b-navbar-nav>

          <!-- class="d-none d-lg-block" visible-lg and up  (hidden-md and down) -->
          <!-- class="d-lg-none d-xl-none" visible-md and down (hidden-lg and up) -->


          <!-- NAVBAR ITEMS -->
<!--          <b-nav-item v-if="isUserAllowedTo('add', 'project')" class="d-none d-lg-block" :to="{ path: '/project' }"exact>{{ $t('header.projects') }}</b-nav-item>-->

<!--          <b-nav-item v-if="permissions.attachment" class="d-none d-lg-block" :to="{ path: '/attachment' }"exact>{{ $t('header.editAttachment') }}</b-nav-item>-->
<!--          &lt;!&ndash; <b-nav-item v-if="permissions.attachment" class="d-none d-lg-block" :to="{ path: '/attachment/add/other_file' }" exact>{{ $t('header.addAttachment') }}</b-nav-item> &ndash;&gt;-->

<!--          <b-nav-item-dropdown v-if="permissions.attachment" variant="dark" class="d-none d-lg-block dark" :text="$t('header.addAttachment')">-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/photo_archive' }" exact>{{ $t('add.photoArchive') }}</b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/specimen_image' }" exact>{{ $t('add.specimenImage') }}</b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/other_file' }" exact>{{ $t('add.otherFiles') }}</b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/digitised_reference' }" exact>{{ $t('add.digitisedReference') }}</b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

<!--          <b-nav-item v-if="permissions.reference" class="d-none d-lg-block" :to="{ path: '/reference' }" exact>{{ $t('header.editReference') }}</b-nav-item>-->

<!--          <b-nav-item v-if="permissions.library" class="d-none d-lg-block" :to="{ path: '/library' }" exact>{{ $t('header.editLibrary') }}</b-nav-item>-->

<!--          <b-nav-item v-if="permissions.locality" class="d-none d-lg-block" :to="{ path: '/locality' }" exact>{{ $t('header.editLocality') }}</b-nav-item>-->

<!--          <b-nav-item v-if="permissions.sample" class="d-none d-lg-block" :to="{ path: '/sample' }" exact>{{ $t('header.samples') }}</b-nav-item>-->

<!--          <b-nav-item v-if="permissions.doi" class="d-none d-lg-block" :to="{ path: '/doi' }" exact>{{ $t('header.dois') }}</b-nav-item>-->


          <!-- DROPDOWN START -->
<!--          <b-nav-item-dropdown v-if="permissions.project" class="d-lg-none d-xl-none" :text="$t('header.projects')">-->
<!--            <b-dropdown-item :to="{ path: '/project' }" exact>-->
<!--              <font-awesome-icon icon="table" />-->
<!--              {{ $t('header.editProject') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/project/add' }"exact>-->
<!--              <font-awesome-icon icon="plus-square" />-->
<!--              {{ $t('header.addProject') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

          <!-- TODO: Site not in permissions atm -->
<!--          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.sites')">-->
<!--            &lt;!&ndash;          <b-nav-item-dropdown v-if="permissions.sites" class="d-lg-none d-xl-none" :text="$t('header.sites')">&ndash;&gt;-->
<!--            <b-dropdown-item :to="{ path: '/site/' }" exact>-->
<!--              <font-awesome-icon icon="globe" />-->
<!--              {{ $t('header.editSite') }}-->
<!--            </b-dropdown-item>-->

<!--            <b-dropdown-item :to="{ path: '/site/add' }" exact>-->
<!--              <font-awesome-icon icon="map-pin" />-->
<!--              {{ $t('header.addSite') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

<!--          <b-nav-item-dropdown v-if="permissions.attachment" class="d-lg-none d-xl-none" :text="$t('header.files')">-->
<!--            <b-dropdown-item :to="{ path: '/attachment' }"exact>-->
<!--              <font-awesome-icon :icon="['far', 'folder']" />-->
<!--              {{ $t('frontPage.buttons.myFiles') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-divider></b-dropdown-divider>-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/photo_archive' }" exact>-->
<!--              <font-awesome-icon :icon="['far', 'file-image']" />-->
<!--              {{ $t('frontPage.buttons.photoArchive') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/specimen_image' }" exact>-->
<!--              <font-awesome-icon icon="file-image" />-->
<!--              {{ $t('frontPage.buttons.specimenImage') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/other_file' }" exact>-->
<!--              <font-awesome-icon :icon="['far', 'file']" />-->
<!--              {{ $t('frontPage.buttons.otherFiles') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/attachment/add/digitised_reference' }" exact>-->
<!--              <font-awesome-icon :icon="['far', 'file-pdf']" />-->
<!--              {{ $t('frontPage.buttons.digitisedReference') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

          <!--      <vs-sidebar-group v-if="permissions.imageset" :title="$t('header.imagesets')">-->
<!--          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.imagesets')">-->
<!--            <b-dropdown-item :to="{ path: '/imageset/add' }">-->
<!--              <i class="far fa-images"></i>-->
<!--              {{ $t('frontPage.buttons.imageset') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

          <!--      <vs-sidebar-group v-if="permissions.journal" :title="$t('header.journals')">-->
<!--          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.journals')">-->
<!--            <b-dropdown-item :to="{ path: '/journal/add' }">-->
<!--              <i class="far fa-newspaper"></i>-->
<!--              {{ $t('frontPage.buttons.journal') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

<!--          <b-nav-item-dropdown v-if="permissions.reference" class="d-lg-none d-xl-none" :text="$t('header.references')">-->
<!--            <b-dropdown-item :to="{ path: '/reference' }" exact>-->
<!--              <font-awesome-icon icon="book" />-->
<!--              {{ $t('frontPage.buttons.myReferences') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/reference/add' }" exact>-->
<!--              <font-awesome-icon icon="book-open" />-->
<!--              {{ $t('frontPage.buttons.reference') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

<!--          <b-nav-item-dropdown v-if="permissions.library" class="d-lg-none d-xl-none" :text="$t('header.libraries')">-->
<!--            <b-dropdown-item :to="{ path: '/library' }" exact>-->
<!--              <font-awesome-icon :icon="['far', 'list-alt']" />-->
<!--              {{ $t('frontPage.buttons.libraries') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/library/add' }" exact>-->
<!--              <font-awesome-icon :icon="['far', 'edit']" />-->
<!--              {{ $t('frontPage.buttons.library') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

<!--          <b-nav-item-dropdown v-if="permissions.locality" class="d-lg-none d-xl-none" :text="$t('header.localities')">-->
<!--            <b-dropdown-item :to="{ path: '/locality' }" exact>-->
<!--              <font-awesome-icon icon="map-marked-alt" />-->
<!--              {{ $t('frontPage.buttons.localities') }}-->
<!--            </b-dropdown-item>-->
<!--            <b-dropdown-item :to="{ path: '/locality/add' }" exact>-->
<!--              <font-awesome-icon icon="map-marker-alt" />-->
<!--              {{ $t('frontPage.buttons.locality') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

<!--          <b-nav-item-dropdown v-if="permissions.sample" class="d-lg-none d-xl-none" :text="$t('header.samples')">-->
<!--            <b-dropdown-item :to="{ path: '/sample/' }" exact>-->
<!--              <font-awesome-icon icon="vials" />-->
<!--              {{ $t('frontPage.buttons.samples') }}-->
<!--            </b-dropdown-item>-->

<!--            <b-dropdown-item :to="{ path: '/sample/add' }" exact>-->
<!--              <font-awesome-icon icon="vial" />-->
<!--              {{ $t('frontPage.buttons.sample') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

          <!-- TODO: Analysis not in permissions atm -->
<!--          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.analyses')">-->
<!--&lt;!&ndash;          <b-nav-item-dropdown v-if="permissions.analysis" class="d-lg-none d-xl-none" :text="$t('header.analysis')">&ndash;&gt;-->
<!--            <b-dropdown-item :to="{ path: '/analysis/' }" exact>-->
<!--              <font-awesome-icon :icon="['far', 'chart-bar']" />-->
<!--              {{ $t('header.editAnalysis') }}-->
<!--            </b-dropdown-item>-->

<!--            <b-dropdown-item :to="{ path: '/analysis/add' }" exact>-->
<!--              <font-awesome-icon icon="chart-pie" />-->
<!--              {{ $t('header.addAnalysis') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

<!--          <b-nav-item-dropdown v-if="permissions.doi" class="d-lg-none d-xl-none" :text="$t('header.dois')">-->
<!--            <b-dropdown-item :to="{ path: '/doi' }" exact>-->
<!--              <font-awesome-icon icon="database" />-->
<!--              {{ $t('header.dois') }}-->
<!--            </b-dropdown-item>-->

<!--            <b-dropdown-item :to="{ path: '/doi/add' }" exact>-->
<!--              <font-awesome-icon icon="plus-circle" />-->
<!--              {{ $t('frontPage.buttons.doi') }}-->
<!--            </b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->

        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item class="d-none d-lg-block" @click="changeLang('ee')">EST &nbsp;<span class="flag flag-ee flag-squared flag-circle"></span></b-nav-item>
          <b-nav-item class="d-none d-lg-block" @click="changeLang('en')">ENG &nbsp;<span class="flag flag-en flag-squared flag-circle"></span></b-nav-item>

          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.lang', { lang: this.$i18n.locale === 'ee' ? 'EST' : 'ENG' })" right>
            <b-dropdown-item @click="changeLang('ee')">EST &nbsp;<span class="flag flag-ee flag-squared flag-circle"></span></b-dropdown-item>
            <b-dropdown-item @click="changeLang('en')">ENG &nbsp;<span class="flag flag-en flag-squared flag-circle"></span></b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="currentUser.forename" right>
            <b-dropdown-item :to="{ path: '/settings' }">
              <font-awesome-icon icon="cog"/>
              {{ $t('header.settings') }}
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logOut()">
              <font-awesome-icon icon="sign-out-alt"/>
              {{ $t('header.logOut') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

  </div>
</template>

<script>
  import { toastInfo } from "@/assets/js/iziToast/iziToast";
  import fontAwesomeLib from "../mixins/fontAwasomeLib";
  import authenticate from "../mixins/authenticate";
  import permissionsMixin from "../mixins/permissionsMixin";

  export default {
    name: "app-header",
    mixins: [fontAwesomeLib, authenticate, permissionsMixin],
    methods: {

      // Changes application's language
      changeLang(lang) {
        if (this.$localStorage.get('geocollectionsFileUploadLang') === lang) return;
        this.$localStorage.set('geocollectionsFileUploadLang', lang)
        this.$i18n.locale = lang

        lang === 'ee' ? this.$moment.locale('et') : this.$moment.locale(lang)

        toastInfo({text: this.$t('messages.langChange')})
      },

    }
  }
</script>

<style scoped>
  nav {
    box-shadow: 0 -4px 10px #000;
  }

  .circle-flag {
    border-radius: 100%;
  }

  .only-small-screen {
    display: none;
  }

  @media (max-width: 575px) {
    .only-small-screen {
      display: block;
    }

    .only-big-screen {
      display: none;
    }
  }

  .flag {
    position: relative;
    display: inline-block;
    width: 1.33333333em;
    line-height: 1em;
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
  }

  .flag:before {
    content: "\A0";
  }

  .flag-ee {
    background-image: url("../../assets/ee.svg");
  }

  .flag-en {
    background-image: url("../../assets/en.svg");
  }

  .flag-squared {
    width: 1em;
  }

  .flag-circle {
    border-radius: 100%;
  }
</style>
