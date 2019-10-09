<template>
  <v-content class="front-page">

    <!-- NAME -->
    <v-row>
      <v-col>
        <v-card flat color="#fafafa">
          <v-card-title>
            <span class="h3">{{ $t("frontPage.welcome") }}</span>
            <span class="text-capitalize h3">{{
              `, ${currentUser.forename} ${currentUser.surename}!`
            }}</span>
            <v-spacer></v-spacer>
            <v-btn icon :to="{ path: '/settings' }" color="deep-orange">
              <v-icon>fas fa-user-cog</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- HELP -->
    <v-row>
      <v-col>
        <v-card elevation="3">
          <v-card-title>
            <span>{{ $t("frontPage.help") }}</span>
            <span><v-icon>far fa-question-circle</v-icon></span>
            <v-spacer></v-spacer>
            <v-btn icon @click="block.help = !block.help" color="blue">
              <v-icon>{{ block.help ? 'fas fa-angle-up' : 'fas fa-angle-down' }}</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <fieldset class="border p-2 mt-3" id="block-help">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.help }"
        @click="block.help = !block.help"
      >
        {{ $t("frontPage.help") }}
        <i class="far fa-question-circle"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.help">
          <p>
            Siinne kasutajaliides on aktiivses arenduses ja muutumises. Kui mõni
            funktsioon ei tööta, siis on soovitav kasutada eelmist stabiilsemat
            versiooni:
            <a href="https://edit.geocollections.info"
              >https://edit.geocollections.info</a
            >.
          </p>
          <p>
            Vigadest anna teada githubis:
            <a href="https://github.com/geocollections/sarv-edit"
              >https://github.com/geocollections/sarv-edit</a
            >
            või kirjuta:
            <a href="mailto:olle.hints@taltech.ee"
              ><i class="far fa-envelope"></i> olle.hints@taltech.ee</a
            >, või helista:
            <a href="tel:5130157"><i class="fas fa-phone"></i> 5130157</a>.
          </p>
        </div>
      </transition>
    </fieldset>

    <recent-activity class="mt-4" :user="currentUser.user"></recent-activity>
  </v-content>
</template>

<script>
import RecentActivity from "./RecentActivity";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";

export default {
  components: {
    RecentActivity
  },
  name: "front-page",
  mixins: [formSectionsMixin],

  metaInfo() {
    return {
      title: this.$t("titles.dashboard")
    };
  },

  data() {
    return {
      block: { help: true }
    };
  },

  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style scoped></style>
