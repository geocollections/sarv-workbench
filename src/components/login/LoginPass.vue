<template>
  <div class="login-pass">

    <spinner v-show="loggingIn" class="loading-overlay" size="massive" :message="$t('login.overlay')"></spinner>

    <div class="alert" v-bind:class="{ 'alert-danger': error }">
      <span v-if="!message"><b>{{ $t('login.passwordMessage') }}</b></span>
      <b>{{message}}</b>
    </div>

    <div class="form-group">
      <input type="text" @keyup.enter="logIn()" class="form-control" :placeholder="$t('login.username')" v-model="user.username" v-bind:disabled="loggingIn"/>
    </div>

    <div class="form-group">
      <input type="password" @keyup.enter="logIn()" class="form-control" :placeholder="$t('login.password')" v-model="user.password" v-bind:disabled="loggingIn"/>
    </div>

    <button class="btn btn-primary" @click="logIn()" v-bind:disabled="loggingIn">
      {{ $t('login.loginButton') }} <font-awesome-icon icon="sign-in-alt"></font-awesome-icon>
    </button>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faSignInAlt} from '@fortawesome/free-solid-svg-icons'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

  library.add(faSignInAlt)

  export default {
    components: {
      Spinner,
      FontAwesomeIcon
    },
    name: "login-pass",
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
    methods: {

      logIn() {

        if (!this.loggingIn) {
          this.loggingIn = true;

          this.$http.post('https://rwapi.geocollections.info/login/',
            {
              user: this.user.username,
              pwd: this.user.password
            },
            {
              emulateJSON: true
            }
          ).then(response => {
            if (response.status === 200) {
              console.log(response);
              if (response.body.user != null) {
                this.$session.start()
                this.$session.set('authUser', response.body)
                this.$router.push({ path: '/dashboard' })

                if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                  toastSuccess({text: response.body.message_et})
                } else {
                  toastSuccess({text: response.body.message})
                }

              } else {

                if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                  this.message = response.body.message_et;
                  toastError({text: response.body.message_et})
                } else {
                  this.message = response.body.message;
                  toastError({text: response.body.message})
                }

                this.error = true;
              }
              this.loggingIn = false;
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
            this.message = this.$t('messages.loginError');
            toastError({text: this.$t('messages.loginError')})
            this.error = true;
            this.loggingIn = false;
          })
        } else {
          console.log('What are you trying to do?')
        }
      },

    }
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

  /* This overlays the component but other one whole page */
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
