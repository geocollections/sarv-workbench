<template>
  <div class="front-page">
    <!-- NAME -->
    <v-row>
      <v-col class="pb-0">
        <v-card flat color="#fafafa">
          <v-card-title class="pl-0">
            <span class="h3 text-capitalize break-word">
              {{
                `${$t("frontPage.welcome")}, ${currentUser.forename} ${
                  currentUser.surename
                }!`
              }}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              :to="{ path: '/settings' }"
              color="deep-orange"
              :title="$t('header.settings')"
            >
              <v-icon>fas fa-user-cog</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- HELP -->
    <v-row id="block-help">
      <v-col>
        <v-card elevation="3">
          <v-card-title>
            <span>{{ $t("frontPage.help") }}&nbsp;</span>
            <v-icon color="blue darken-2">far fa-question-circle</v-icon>
            <v-spacer></v-spacer>
            <v-btn icon @click="block.help = !block.help" color="blue">
              <v-icon>{{
                block.help ? "fas fa-angle-up" : "fas fa-angle-down"
              }}</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <transition enter-active-class="animated zoomIn faster">
              <div v-show="block.help">
                <p>
                  Siinne kasutajaliides on aktiivses arenduses ja muutumises.
                  Kui mõni funktsioon ei tööta, siis on soovitav kasutada
                  eelmist stabiilsemat versiooni:
                  <a href="https://edit.geocollections.info" target="HelpLink"
                    >https://edit.geocollections.info</a
                  >.
                </p>
                <p>
                  Vigadest anna teada githubis:
                  <a
                    href="https://github.com/geocollections/sarv-edit"
                    target="HelpLink"
                    ><i class="fab fa-github"></i> https://github.com/geocollections/sarv-edit</a
                  >
                  või kirjuta:
                  <a href="mailto:olle.hints@taltech.ee"
                    ><i class="far fa-envelope"></i> olle.hints@taltech.ee</a
                  >, või helista:
                  <a href="tel:5130157"><i class="fas fa-phone"></i> 5130157</a
                  >.
                </p>
              </div>
            </transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <recent-activity :user="currentUser.user"></recent-activity>
  </div>
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

<style scoped>
#block-help a:hover {
  opacity: 0.8;
}
</style>
