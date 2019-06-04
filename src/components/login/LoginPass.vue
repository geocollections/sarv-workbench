<template>
  <div class="login-pass">

    <spinner v-show="loggingIn" class="loading-overlay" size="massive" :message="$t('login.overlay')"></spinner>

    <div class="alert" v-bind:class="{ 'alert-danger': error }">
      <span v-if="!message"><b>{{ $t('login.passwordMessage') }}</b></span>
      <b>{{message}}</b>
    </div>

    <b-form @submit.prevent="authenticate('password', {user: user.username, pwd: user.password})">
      <b-form-group label-for="username">
        <b-form-input
          id="username"
          type="text"
          v-model="user.username"
          required
          autocomplete="username"
          :placeholder="$t('login.username')" />
      </b-form-group>

      <b-form-group label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="user.password"
          required
          autocomplete="password"
          :placeholder="$t('login.password')" />
      </b-form-group>

      <b-button type="submit" variant="primary" v-bind:disabled="loggingIn">
        {{ $t('login.loginButton') }} <font-awesome-icon icon="sign-in-alt"></font-awesome-icon>
      </b-button>
    </b-form>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faSignInAlt} from '@fortawesome/free-solid-svg-icons'

  import authenticate from "../mixins/authenticate";

  library.add(faSignInAlt)

  export default {
    components: {
      Spinner,
      FontAwesomeIcon
    },
    name: "login-pass",
    mixins: [authenticate],
    data() {
      return {
        user: {
          username: '',
          password: null
        },
        message: null,
        error: false,
        loggingIn: false
      }
    },
    computed: {
      username: {
        get: function () {
          return this.user.username
        },

        set: function (newValue) {
          let name = newValue.toString()
          this.user.username = name.toLowerCase().trim()
        }
      }
    },
  }
</script>

<style scoped>
  .loading-overlay {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1020;
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    padding: 200% 0;
  }

  /* This overlays the component but other one the whole page */
  /*.loading-overlay {*/
  /*position: fixed;*/
  /*margin-left: auto;*/
  /*margin-right: auto;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 1;*/
  /*background: rgba(255, 255, 25, 0.5);*/
  /*height: 100%;*/
  /*}*/
</style>
