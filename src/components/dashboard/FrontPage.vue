<template>
  <div class="front-page">

    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t('frontPage.welcome') }}, <span class="text-capitalize">{{ currentUser.forename }} {{ currentUser.surename }}</span>!</p>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col">
        <b-card class="p-3 border border-danger larger">
          Siinne kasutajaliides on aktiivses arenduses ja muutumises. Kui mõni funktsioon ei tööta, siis on soovitav kasutada eelmist stabiilsemat versiooni: <a href="https://edit.geocollections.info">https://edit.geocollections.info</a>.<br />
          Vigadest anna teada githubis: <a href="https://github.com/geocollections/sarv-edit">https://github.com/geocollections/sarv-edit</a> või kirjuta: olle.hints@taltech.ee, või helista: 5130157.
        </b-card>
      </div>
    </div>

    <recent-activity class="mt-4" :user="currentUser.user"></recent-activity>


  </div>
</template>

<script>
  import Attachments from '@/views/AttachmentsOld.vue'
  import RecentActivity from "./RecentActivity";
  import permissionsMixin from "../mixins/permissionsMixin";


  export default {
    components: {
      RecentActivity,
      Attachments,
    },
    name: "front-page",
    mixins: [permissionsMixin],

    metaInfo () {
      return {
        title: this.$t('titles.dashboard')
      }
    },
  }
</script>

<style scoped>

</style>
