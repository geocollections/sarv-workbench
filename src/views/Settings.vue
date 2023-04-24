<template>
  <div class="settings">
    <div class="row mt-4">
      <div class="col">
        <p class="table-title mb-2">{{ $t("header.settings") }}</p>
      </div>
    </div>

    <v-card
      class="mt-2"
      id="block-linked-accounts"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.linkedAccounts = !block.linkedAccounts"
        >
          <span>{{ $t("settings.linkedAccounts") }}</span>
          <v-icon right>fas fa-people-arrows</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.linkedAccounts = !block.linkedAccounts"
          :color="bodyActiveColor"
        >
          <v-icon>
            {{ block.linkedAccounts ? "fas fa-angle-up" : "fas fa-angle-down" }}
          </v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.linkedAccounts" class="px-1 pt-1 pb-2">
          <v-btn class="mb-2" :href="getOrcidConnectUrl()" color="#a6ce39" dark>
            <v-icon left>fab fa-orcid</v-icon>{{ $t("login.connectOrcid") }}
          </v-btn>
          <v-data-table
            mobile-breakpoint="0"
            :headers="linkedSocialAccountHeaders"
            :items="linkedSocialAccounts.results"
          >
            <template v-slot:top>
              <v-dialog v-model="dialogDisconnect" max-width="550px">
                <v-card>
                  <v-card-title class="text-h6">
                    {{ $t("login.disconnectDialogTitle") }}
                  </v-card-title>
                  <v-card-text>
                    <div class="mb-2 text-body-1">
                      <span class="mr-2">{{ disconnectItem.provider }}</span>
                      <span>{{ disconnectItem.uid }}</span>
                    </div>
                    <div class="font-weight-bold red--text">
                      {{ $t("login.disconnectDialogWarning") }}
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">
                      {{ $t("buttons.cancel") }}
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="disconnectSocialAccountConfirm"
                    >
                      {{ $t("buttons.ok") }}
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="disconnectSocialAccount(item)">
                fas fa-trash
              </v-icon>
            </template>
          </v-data-table>
        </div>
      </transition>
    </v-card>

    <!-- COLORS -->
    <v-card
      class="mt-2"
      id="block-colors"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.colors = !block.colors"
        >
          <span>{{ $t("settings.colors") }}</span>
          <v-icon right>fas fa-paint-roller</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.colors = !block.colors"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.colors ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.colors" class="px-1 pt-1 pb-2">
          <Colors />
        </div>
      </transition>
    </v-card>

    <!-- ACCESSIBILITY -->
    <v-card
      class="mt-2"
      id="block-accessibility"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.accessibility = !block.accessibility"
        >
          <span>{{ $t("settings.accessibility") }}</span>
          <v-icon right>fas fa-wrench</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.accessibility = !block.accessibility"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.accessibility ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.accessibility" class="px-1 pt-1 pb-2">
          <Accessibility
            :body-active-color="bodyActiveColor"
            :body-dark="bodyDark"
          />
        </div>
      </transition>
    </v-card>

    <!-- SHORTCUTS -->
    <v-card
      class="mt-2"
      id="block-shortcuts"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.shortcuts = !block.shortcuts"
        >
          <span>{{ $t("settings.shortcuts") }}</span>
          <v-icon right>fas fa-share-square</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.shortcuts = !block.shortcuts"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.shortcuts ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.shortcuts" class="pa-1">
          <shortcuts
            :bodyActiveColor="bodyActiveColor"
            :bodyActiveColorDark="bodyActiveColorDark"
          />
        </div>
      </transition>
    </v-card>

    <!-- SECURITY -->
    <v-card
      v-if="false"
      class="mt-2"
      id="block-security"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.security = !block.security"
        >
          <span>{{ $t("settings.security") }}</span>
          <v-icon right>fas fa-user-shield</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.security = !block.security"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.security ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-if="block.security">
          <Security />
        </div>
      </transition>
    </v-card>

    <!-- PERMISSIONS -->
    <v-card
      class="mt-2"
      id="block-permissions"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.permissions = !block.permissions"
        >
          <span>{{ $t("settings.permissions") }}</span>
          <v-icon right>fas fa-user-lock</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.permissions = !block.permissions"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.permissions ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-if="block.permissions">
          <PermissionsTable :perms="getPermissions" :body-color="bodyColor" />
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Shortcuts from "../components/partial/settings/Shortcuts";
import Accessibility from "../components/partial/settings/Accessibility";
import formSectionsMixin from "../mixins/formSectionsMixin";
import { mapGetters, mapState } from "vuex";
import Colors from "../components/partial/settings/Colors";
import PermissionsTable from "../components/partial/settings/PermissionsTable";
import Security from "../components/partial/settings/Security";
import axios from "axios";
export default {
  name: "Settings",
  components: { Security, PermissionsTable, Colors, Shortcuts, Accessibility },
  mixins: [formSectionsMixin],
  data() {
    return {
      block: {
        colors: false,
        accessibility: false,
        shortcuts: false,
        security: false,
        permissions: true,
        linkedAccounts: false,
      },
      linkedSocialAccounts: [],
      linkedSocialAccountHeaders: [
        { text: this.$t("header.provider"), value: "provider" },
        { text: this.$t("header.uid"), value: "uid" },
        { text: this.$t("common.actions"), value: "actions", sortable: false },
      ],
      dialogDisconnect: false,
      disconnectItem: { id: -1, provider: "", uid: "" },
    };
  },
  async mounted() {
    const res = await axios.get(
      "https://rwapi.geoloogia.info/accounts/dj-rest-auth/socialaccounts"
    );
    this.linkedSocialAccounts = res.data;
  },
  computed: {
    ...mapState("settings", [
      "bodyColor",
      "bodyDark",
      "bodyActiveColor",
      "bodyActiveColorDark",
      "showRecentUrls",
    ]),
    ...mapGetters("user", ["getPermissions"]),
  },
  methods: {
    getOrcidConnectUrl() {
      return process.env.VUE_APP_ORCID_CONNECT_URL;
    },
    disconnectSocialAccount(item) {
      this.disconnectItem = Object.assign({}, item);
      this.dialogDisconnect = true;
    },
    async disconnectSocialAccountConfirm() {
      const res = await axios.post(
        `https://rwapi.geoloogia.info/accounts/dj-rest-auth/socialaccounts/${this.disconnectItem.id}/disconnect/`
      );
    },
    closeDelete() {
      this.dialogDisconnect = false;
      this.$nextTick(() => {
        this.disconnectItem = { id: -1, provider: "", uid: "" };
      });
    },
  },
};
</script>

<style scoped>
.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

.table-title {
  font-size: 2rem;
  font-weight: 600;
}
</style>
