<template>
  <div class="front-page">
    <!-- NAME -->
    <v-row>
      <v-col class="pb-0">
        <v-card flat color="transparent">
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
              :color="appSettings.bodyActiveColor"
              :title="$t('header.settings')"
            >
              <v-icon>fas fa-user-cog</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- MAP -->
    <v-row>
      <v-col class="pb-0">
        <v-card
          :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.map = !block.map">
              <span>{{ $t("frontPage.sitesMap") }}</span>
              <v-icon right color="purple lighten-2"
                >fas fa-map-marked-alt</v-icon
              >
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="block.map = !block.map"
              :color="appSettings.bodyActiveColor"
            >
              <v-icon>{{
                block.map ? "fas fa-angle-up" : "fas fa-angle-down"
              }}</v-icon>
            </v-btn>
          </v-card-title>

          <transition enter-active-class="animated zoomIn faster">
            <div v-show="block.map">
              <sites-map />
            </div>
          </transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- IMAGES/FILES -->
    <v-row class="py-6">
      <v-col class="pb-0">
        <v-card
          :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.files = !block.files"
            >
              <span>{{ $t("frontPage.files") }}</span>
              <v-icon right color="teal lighten-1">far fa-folder-open</v-icon>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="block.files = !block.files"
              :color="appSettings.bodyActiveColor"
            >
              <v-icon>{{
                block.files ? "fas fa-angle-up" : "fas fa-angle-down"
              }}</v-icon>
            </v-btn>
          </v-card-title>

          <transition enter-active-class="animated zoomIn faster">
            <div v-show="block.files">
              <v-row no-gutters class="mx-3">
                <v-col cols="12" class="pa-1">
                  <v-radio-group
                    v-model="recentFilesPaginateBy"
                    row
                    dense
                    hide-details
                    label="Number of recent files: "
                    class="mt-0 radio-buttons"
                  >
                    <v-radio
                      label="6"
                      :value="6"
                      :color="appSettings.bodyActiveColor"
                    />
                    <v-radio
                      label="12"
                      :value="12"
                      :color="appSettings.bodyActiveColor"
                    />
                    <v-radio
                      label="24"
                      :value="24"
                      :color="appSettings.bodyActiveColor"
                    />
                    <v-radio
                      label="36"
                      :value="36"
                      :color="appSettings.bodyActiveColor"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>

              <image-view-wrapper
                class="pb-3"
                :data="recentFiles"
                :body-active-color="appSettings.bodyActiveColor"
                :body-color="appSettings.bodyColor"
                clear-item-background
              />
            </div>
          </transition>
        </v-card>
      </v-col>
    </v-row>

    <recent-activity
      :user="currentUser.user"
      :body-color="appSettings.bodyColor"
      :body-active-color="appSettings.bodyActiveColor"
    />

    <!-- HELP -->
    <v-row id="block-help">
      <v-col class="py-6">
        <v-card
          :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.help = !block.help"
            >
              <span>{{ $t("frontPage.help") }}</span>
              <v-icon right color="blue darken-2"
                >far fa-question-circle</v-icon
              >
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="block.help = !block.help"
              :color="appSettings.bodyActiveColor"
            >
              <v-icon>{{
                block.help ? "fas fa-angle-up" : "fas fa-angle-down"
              }}</v-icon>
            </v-btn>
          </v-card-title>

          <transition enter-active-class="animated zoomIn faster">
            <v-card-text v-show="block.help">
              <p>
                Siinne kasutajaliides on aktiivses arenduses ja muutumises. Kui
                mõni funktsioon ei tööta, siis on soovitav kasutada eelmist
                stabiilsemat versiooni:
                <a href="https://edit.geocollections.info" target="HelpLink"
                  >https://edit.geocollections.info</a
                >.
              </p>
              <p>
                Vigadest anna teada githubis:
                <a
                  href="https://github.com/geocollections/sarv-edit"
                  target="HelpLink"
                  ><i class="fab fa-github"></i>
                  https://github.com/geocollections/sarv-edit</a
                >
                või kirjuta:
                <a href="mailto:olle.hints@taltech.ee"
                  ><i class="far fa-envelope"></i> olle.hints@taltech.ee</a
                >, või helista:
                <a href="tel:5130157"><i class="fas fa-phone"></i> 5130157</a>.
              </p>
            </v-card-text>
          </transition>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RecentActivity from "./RecentActivity";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import SitesMap from "./SitesMap";
import ImageViewWrapper from "../partial/imageView/ImageViewWrapper";
import { fetchRecentFiles } from "../../assets/js/api/apiCalls";

export default {
  components: {
    ImageViewWrapper,
    RecentActivity,
    SitesMap
  },
  name: "front-page",
  mixins: [formSectionsMixin],

  data: () => ({
    block: { map: true, help: true, files: true },
    recentFilesPaginateBy: 12,
    recentFiles: null
  }),

  computed: {
    ...mapState(["currentUser", "appSettings"])
  },

  watch: {
    recentFilesPaginateBy: {
      handler(newVal) {
        this.getRecentFiles(newVal);
      },
      immediate: true
    }
  },

  methods: {
    getRecentFiles(paginateBy) {
      fetchRecentFiles(this.currentUser.id, paginateBy).then(response => {
        if (response.status === 200) {
          if (response.data.count > 0) this.recentFiles = response.data.results;
          else this.recentFiles = [];
        }
      });
    }
  }
};
</script>

<style scoped>
#block-help a:hover {
  opacity: 0.8;
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

.radio-buttons >>> label {
  margin-bottom: 0;
}
</style>
