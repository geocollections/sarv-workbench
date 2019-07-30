<template>
  <div class="front-page">

    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t('frontPage.welcome') }}, <span class="text-capitalize">{{ currentUser.forename }} {{ currentUser.surename }}</span>!</p>
      </div>
    </div>

    <fieldset class="border p-2 mt-3" id="block-help">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.help }" @click="block.help = !block.help">
        {{ $t('frontPage.help') }}
        <i class="far fa-question-circle"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.help">

          <p>
            Siinne kasutajaliides on aktiivses arenduses ja muutumises.
            Kui mõni funktsioon ei tööta, siis on soovitav kasutada eelmist stabiilsemat versiooni:
            <a href="https://edit.geocollections.info">https://edit.geocollections.info</a>.
          </p>
          <p>
            Vigadest anna teada githubis:
            <a href="https://github.com/geocollections/sarv-edit">https://github.com/geocollections/sarv-edit</a>
            või kirjuta: <a href="mailto:olle.hints@taltech.ee"><i class="far fa-envelope"></i> olle.hints@taltech.ee</a>,
            või helista: <a href="tel:5130157"><i class="fas fa-phone"></i> 5130157</a>.
          </p>

        </div>
      </transition>
    </fieldset>

    <recent-activity class="mt-4" :user="currentUser.user"></recent-activity>

  </div>
</template>

<script>
  import Attachments from '@/views/AttachmentsOld.vue'
  import RecentActivity from "./RecentActivity";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {mapState} from "vuex";

  export default {
    components: {
      RecentActivity,
      Attachments,
    },
    name: "front-page",
    mixins: [formSectionsMixin],

    metaInfo () {
      return {
        title: this.$t('titles.dashboard')
      }
    },

    data() {
      return {
        block: { help: true }
      }
    },

    computed: {
      ...mapState(["currentUser"])
    }
  }
</script>

<style scoped>

</style>
