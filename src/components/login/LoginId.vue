<template>
  <div class="login-id">

    <spinner v-show="loggingIn" class="loading-overlay" size="massive" :message="$t('login.overlay')"></spinner>

    <div class="alert" v-bind:class="{ 'alert-danger': error }">
      <span v-if="!message"><b>{{ $t('login.idCardMessage') }}</b></span>
      <b>{{message}}</b>
    </div>

    <div class="idcard-wrapper text-center">
      <button class="btn btn-primary" @click="authenticate('id')" v-bind:disabled="loggingIn">
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
  import authenticate from "../../mixins/authenticate";

  library.add(faIdCard)

  export default {
    components: {
      Spinner,
      FontAwesomeIcon
    },
    name: "login-id",
    mixins: [authenticate],
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
