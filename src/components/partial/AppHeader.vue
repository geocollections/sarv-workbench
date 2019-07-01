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

          <!-- NAVBAR ITEMS -->
          <b-nav-item v-if="$store.state['shortcuts'].length > 0" class="d-none d-lg-block" v-for="entity in $store.state['shortcuts']" :to="{ path: entity.path }" exact>
            {{ entity.title }}
          </b-nav-item>

        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item class="d-none d-lg-block" @click="changeLang('ee')">EST &nbsp;<span class="flag flag-ee flag-squared flag-circle"></span></b-nav-item>
          <b-nav-item class="d-none d-lg-block" @click="changeLang('en')">ENG &nbsp;<span class="flag flag-en flag-squared flag-circle"></span></b-nav-item>

          <b-nav-item v-if="$store.state['shortcuts'].length > 0" class="d-lg-none d-xl-none" v-for="entity in $store.state['shortcuts']" :to="{ path: entity.path }" exact>
            {{ entity.title }}
          </b-nav-item>

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
    beforeCreate: function() {
      this.$store.dispatch('GET_SHORTCUTS')
    },
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

  .navbar-brand:hover {
    opacity: 0.75;
  }
</style>
