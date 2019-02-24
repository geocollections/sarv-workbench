<template>
  <div class="login-id">

    <spinner v-show="loggingIn" class="loading-overlay" size="massive" :message="$t('login.overlay')"></spinner>

    <div class="alert" v-bind:class="{ 'alert-danger': error }">
      <span v-if="!message"><b>{{ $t('login.idCardMessage') }}</b></span>
      <b>{{message}}</b>
    </div>

    <div class="idcard-wrapper text-center">
      <button class="btn btn-primary" @click="logInId()" v-bind:disabled="loggingIn">
        {{ $t('login.loginButton') }} &nbsp;<font-awesome-icon icon="id-card"></font-awesome-icon>
      </button>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faIdCard} from '@fortawesome/free-solid-svg-icons'

  import { fetchLoginId } from "@/assets/js/api/apiCalls";

  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

  library.add(faIdCard)

  export default {
    components: {
      Spinner,
      FontAwesomeIcon
    },
    name: "login-id",
    data() {
      return {
        loggingIn: false,
        message: null,
        error: false
      }
    },
    computed: {
      icon() {
        return faIdCard
      }
    },
    methods: {

      logInId() {

        if (!this.loggingIn) {
          this.loggingIn = true;

          fetchLoginId().then(response => {
            if (response.status === 200) {
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
            this.message = this.$t('messages.loginIdError')
            toastError({text: this.$t('messages.loginIdError')})
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
</style>
