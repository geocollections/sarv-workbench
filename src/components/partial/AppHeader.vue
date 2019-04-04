<template>
  <div class="header">

    <b-navbar type="dark" variant="dark" toggleable="lg" fixed="top">

      <!-- TODO: If small screen change header to icon -->
      <b-navbar-brand :to="{ path: '/dashboard' }">
        <span class="only-big-screen">{{ $t('header.title') }}</span>
        <span class="only-small-screen"><font-awesome-icon icon="home"/></span>
      </b-navbar-brand>

      <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>

      <b-collapse is-nav id="nav_dropdown_collapse" class="text-center">


        <b-navbar-nav>

          <!-- class="d-none d-lg-block" visible-lg and up  (hidden-md and down) -->
          <!-- class="d-lg-none d-xl-none" visible-md and down (hidden-lg and up) -->

          <b-nav-item v-if="permissions.project" class="d-none d-lg-block" :to="{ path: '/project' }"exact>{{ $t('header.projects') }}</b-nav-item>
          
          <b-nav-item v-if="permissions.attachment" class="d-none d-lg-block" :to="{ path: '/attachment' }"exact>{{ $t('header.editAttachment') }}</b-nav-item>
          <b-nav-item v-if="permissions.attachment" class="d-none d-lg-block" :to="{ path: '/attachment/add/other_file' }" exact>{{ $t('header.addAttachment') }}</b-nav-item>

          <b-nav-item v-if="permissions.reference" class="d-none d-lg-block" :to="{ path: '/reference' }" exact>{{ $t('header.editReference') }}</b-nav-item>
          <!-- <b-nav-item v-if="permissions.reference" class="d-none d-lg-block" :to="{ path: '/reference/add' }" exact>{{ $t('header.addReference') }}</b-nav-item>-->

          <b-nav-item v-if="permissions.locality" class="d-none d-lg-block" :to="{ path: '/locality' }" exact>{{ $t('header.editLocality') }}</b-nav-item>
          <!-- <b-nav-item v-if="permissions.locality" class="d-none d-lg-block" :to="{ path: '/locality/add' }" exact>{{ $t('header.addLocality') }}</b-nav-item> -->

          <b-nav-item v-if="permissions.sample" class="d-none d-lg-block" :to="{ path: '/sample' }" exact>{{ $t('header.samples') }}</b-nav-item>

          <b-nav-item-dropdown v-if="permissions.attachment" class="d-lg-none d-xl-none" :text="$t('header.files')">
            <b-dropdown-item :to="{ path: '/attachment/add/photo_archive' }" exact>{{ $t('header.addAttachment') }}</b-dropdown-item>
            <b-dropdown-item :to="{ path: '/attachment' }"exact>{{ $t('header.editAttachment') }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="permissions.reference" class="d-lg-none d-xl-none" :text="$t('header.references')">
            <b-dropdown-item :to="{ path: '/reference/add' }" exact>{{ $t('header.addReference') }}</b-dropdown-item>
            <b-dropdown-item :to="{ path: '/reference' }" exact>{{ $t('header.editReference') }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="permissions.locality" class="d-lg-none d-xl-none" :text="$t('header.localities')">
            <b-dropdown-item :to="{ path: '/locality/add' }" exact>{{ $t('header.addLocality') }}</b-dropdown-item>
            <b-dropdown-item :to="{ path: '/locality' }" exact>{{ $t('header.editLocality') }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="permissions.sample" class="d-lg-none d-xl-none" :text="$t('header.samples')">
            <b-dropdown-item :to="{ path: '/sample/add' }" exact>{{ $t('header.addSample') }}</b-dropdown-item>
            <b-dropdown-item :to="{ path: '/sample' }" exact>{{ $t('header.editSample') }}</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item class="d-none d-lg-block" @click="changeLang('ee')">EST &nbsp;<span class="flag flag-ee flag-squared flag-circle"></span></b-nav-item>
          <b-nav-item class="d-none d-lg-block" @click="changeLang('en')">ENG &nbsp;<span class="flag flag-en flag-squared flag-circle"></span></b-nav-item>

          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.lang', { lang: this.$i18n.locale === 'ee' ? 'EST' : 'ENG' })" right>
            <b-dropdown-item @click="changeLang('ee')">EST &nbsp;<span class="flag flag-ee flag-squared flag-circle"></span></b-dropdown-item>
            <b-dropdown-item @click="changeLang('en')">ENG &nbsp;<span class="flag flag-en flag-squared flag-circle"></span></b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="userFirstLetterUpperCase" right>
            <b-dropdown-item :to="{ path: '/settings' }">{{ $t('header.settings') }} &nbsp;<font-awesome-icon icon="cog"/></b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logOut()">{{ $t('header.logOut') }} &nbsp;<font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
  import {faHome} from '@fortawesome/free-solid-svg-icons'
  import {faCog} from '@fortawesome/free-solid-svg-icons'

  import { toastSuccess, toastInfo } from "@/assets/js/iziToast/iziToast";
  import { fetchLogout } from "@/assets/js/api/apiCalls";

  library.add(faSignOutAlt, faHome, faCog)

  export default {
    components: {
      FontAwesomeIcon
    },
    name: "app-header",
    data() {
      return {
        user: '',
        permissions: ''
      }
    },
    computed: {
      userFirstLetterUpperCase() {
        if (typeof this.user !== 'undefined') return this.user[0].toUpperCase() + this.user.substring(1)
      }
    },
    created: function () {
      if (this.$session.exists() && this.$session.get('authUser') != null) {
        this.user = this.$session.get('authUser').user
        this.permissions = this.$session.get('authUser').permissions
        //console.log(this.permissions['reference'].includes('add'))
      }
    },
    methods: {

      logOut() {
        // Deleting data from Session Storage...
        if (this.$session.exists() && this.$session.get('authUser') != null) {
          this.$session.remove('authUser');
          this.$session.destroy();
        }

        // Initiates a logout request to api
        fetchLogout().then(response => {
          if (response.status === 200) {
            this.$router.push({path: '/'})

            if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
              toastSuccess({text: response.body.message_et});
            } else {
              toastSuccess({text: response.body.message});
            }

          }
        }, errResponse => {})
      },

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
