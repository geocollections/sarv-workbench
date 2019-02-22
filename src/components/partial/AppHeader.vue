<template>
  <div class="header">

    <b-navbar type="light" variant="light" toggleable fixed="top">

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

          <b-nav-item class="d-none d-lg-block" :to="{ path: '/attachment/add/photo_archive' }" exact>{{ $t('header.addAttachment') }}</b-nav-item>
          <b-nav-item class="d-none d-lg-block" :to="{ path: '/attachment' }"exact>{{ $t('header.editAttachment') }}</b-nav-item>

          <b-nav-item class="d-none d-lg-block" :to="{ path: '/reference/add' }" exact>{{ $t('header.addReference') }}</b-nav-item>
          <b-nav-item class="d-none d-lg-block" :to="{ path: '/reference' }" exact>{{ $t('header.editReference') }}</b-nav-item>

          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.files')">
            <b-dropdown-item :to="{ path: '/attachment/add/photo_archive' }" exact>{{ $t('header.addAttachment') }}</b-dropdown-item>
            <b-dropdown-item :to="{ path: '/attachment' }"exact>{{ $t('header.editAttachment') }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.references')">
            <b-dropdown-item :to="{ path: '/reference/add' }" exact>{{ $t('header.addReference') }}</b-dropdown-item>
            <b-dropdown-item :to="{ path: '/reference' }" exact>{{ $t('header.editReference') }}</b-dropdown-item>
          </b-nav-item-dropdown>


        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item class="d-none d-lg-block" @click="changeLang('ee')">EST &nbsp;<span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></b-nav-item>
          <b-nav-item class="d-none d-lg-block" @click="changeLang('en')">ENG &nbsp;<span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></b-nav-item>

          <b-nav-item-dropdown class="d-lg-none d-xl-none" :text="$t('header.lang', { lang: this.$i18n.locale === 'ee' ? 'EST' : 'ENG' })" right>
            <b-dropdown-item @click="changeLang('ee')">EST &nbsp;<span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></b-dropdown-item>
            <b-dropdown-item @click="changeLang('en')">ENG &nbsp;<span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></b-dropdown-item>
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

  library.add(faSignOutAlt, faHome, faCog)

  export default {
    components: {
      FontAwesomeIcon
    },
    name: "app-header",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/logout/',
        user: ''
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
      }
    },
    methods: {

      logOut() {
        if (this.$session.exists() && this.$session.get('authUser') != null) {
          this.$session.remove('authUser');
          this.$session.destroy();
        }

        this.$http.get(this.apiUrl).then(response => {
          if (response.status === 200) {
            console.log(response)
            this.$router.push({path: '/'})

            if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
              this.toastSuccess(response.body.message_et);
            } else {
              this.toastSuccess(response.body.message);
            }

          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      changeLang(lang) {
        if (this.$localStorage.get('geocollectionsFileUploadLang') === lang) return;
        this.$localStorage.set('geocollectionsFileUploadLang', lang)
        this.$i18n.locale = lang

        lang === 'ee' ? this.$moment.locale('et') : this.$moment.locale(lang)

        this.toastInfo(this.$t('messages.langChange'))
      },

      toastSuccess(text) {
        this.$toast.success(text, 'OK', {
          position: 'bottomRight',
          timeout: 2000,
          pauseOnHover: false
        })
      },

      toastInfo(text) {
        this.$toast.info(text, 'Info', {
          position: 'bottomRight',
          timeout: 2000,
          pauseOnHover: false
        })
      },

    }
  }
</script>

<style scoped>
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
</style>
