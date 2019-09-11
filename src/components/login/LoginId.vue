<template>
  <div class="login-id">

    <spinner v-show="loggingIn" class="loading-overlay" size="massive" :message="$t('login.overlay')"></spinner>

    <div class="alert" v-bind:class="{ 'alert-danger': error }">
      <span v-if="!message"><b>{{ $t('login.idCardMessage') }}</b></span>
      <b>{{message}}</b>
    </div>

    <div class="idcard-wrapper text-center">
      <button class="btn btn-primary" @click="$_authenticate('id')" v-bind:disabled="loggingIn">
        {{ $t('login.loginButton') }} &nbsp;<i class="fas fa-id-card"></i>
      </button>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import authenticationMixin from "../../mixins/authenticationMixin";

  export default {
    components: {
      Spinner,
    },
    name: "login-id",
    mixins: [authenticationMixin],
    data() {
      return {
        loggingIn: false,
        message: null,
        error: false
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
