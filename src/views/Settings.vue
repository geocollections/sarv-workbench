<template>
  <div class="settings">
    <div class="row mt-4">
      <div class="col">
        <p class="h3 mb-2">{{ $t("header.settings") }}</p>
      </div>
    </div>

    <!-- COLORS -->
    <v-card
      class="mt-2"
      id="block-colors"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
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
          :color="appSettings.bodyActiveColor"
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
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
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
          :color="appSettings.bodyActiveColor"
        >
          <v-icon>{{
            block.accessibility ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.accessibility" class="px-1 pt-1 pb-2">
          <Accessibility
            :body-active-color="appSettings.bodyActiveColor"
            :body-dark="appSettings.bodyDark"
          />
        </div>
      </transition>
    </v-card>

    <!-- SHORTCUTS -->
    <v-card
      class="mt-2"
      id="block-shortcuts"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
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
          :color="appSettings.bodyActiveColor"
        >
          <v-icon>{{
            block.shortcuts ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.shortcuts" class="px-1 pt-1 pb-2">
          <shortcuts
            :bodyActiveColor="appSettings.bodyActiveColor"
            :bodyActiveColorDark="appSettings.bodyActiveColorDark"
          />
        </div>
      </transition>
    </v-card>

    <!-- PERMISSIONS -->
    <v-card
      class="mt-2"
      id="block-permissions"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
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
          :color="appSettings.bodyActiveColor"
        >
          <v-icon>{{
            block.permissions ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.permissions" class="px-1 pt-1 pb-2">
          <v-row class="px-1">
            <v-col
              cols="12"
              sm="6"
              md="4"
              xl="3"
              class="pb-7"
              v-for="(key, index) in permissions"
              :key="index"
            >
              <v-card>
                <v-card-title class="font-weight-bold px-3 py-1">
                  <span>
                    <v-icon small color="black">fas fa-table</v-icon>&nbsp;
                    <span style="font-size: 1rem">{{ index }}</span>
                  </span>
                </v-card-title>

                <v-divider class="m-0"></v-divider>

                <v-card-text class="px-3 py-1">
                  <v-row
                    v-for="(entity, entityIndex) in key"
                    :key="entityIndex"
                  >
                    <v-col>
                      <!-- ADD -->
                      <v-btn
                        v-if="entity === 'add'"
                        text
                        :color="
                          isTableInCorrectList(index, 'add') ? 'green' : 'black'
                        "
                        @click="goTo(index, 'add')"
                      >
                        <v-icon small left>far fa-plus-square</v-icon>
                        {{ entity }}
                      </v-btn>

                      <!-- CHANGE -->
                      <v-btn
                        v-else-if="entity === 'change'"
                        text
                        :color="
                          isTableInCorrectList(index, 'change')
                            ? 'blue'
                            : 'black'
                        "
                        @click="goTo(index, 'change')"
                      >
                        <v-icon small left>far fa-edit</v-icon>
                        {{ entity }}
                      </v-btn>

                      <!-- DELETE -->
                      <v-btn
                        v-else-if="entity === 'delete'"
                        text
                        :color="
                          isTableInCorrectList(index, 'delete')
                            ? 'red'
                            : 'black'
                        "
                        @click="goTo(index, 'delete')"
                      >
                        <v-icon small left>far fa-minus-square</v-icon>
                        {{ entity }}
                      </v-btn>

                      <!-- VIEW -->
                      <v-btn
                        v-else-if="entity === 'view'"
                        text
                        :color="
                          isTableInCorrectList(index, 'change')
                            ? 'blue'
                            : 'black'
                        "
                        @click="goTo(index, 'change')"
                      >
                        <v-icon small left>far fa-eye</v-icon>
                        {{ entity }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
import { mapState } from "vuex";
import { toastInfo } from "../assets/js/iziToast/iziToast";
import Colors from "../components/partial/settings/Colors";

export default {
  name: "Settings",
  components: { Colors, Shortcuts, Accessibility },
  mixins: [formSectionsMixin],
  data() {
    return {
      // Todo: Update lists according to routes this.$router.options.routes
      addList: [
        "attachment",
        "reference",
        "imageset",
        "journal",
        "locality",
        "sample",
        "project",
        "site",
        "library",
        "doi",
        "analysis",
        "specimen",
        "taxon",
        "collection",
        "selection_series"
      ],
      changeList: [
        "attachment",
        "reference",
        "locality",
        "sample",
        "project",
        "site",
        "library",
        "doi",
        "analysis",
        "specimen",
        "taxon",
        "collection",
        "selection_series"
      ],
      deleteList: [],
      block: {
        shortcuts: true,
        permissions: true,
        accessibility: true,
        colors: false
      }
    };
  },

  computed: {
    ...mapState(["permissions", "appSettings", "showRecentUrls"])
  },

  methods: {
    goTo(table, action) {
      if (this.isTableInCorrectList(table, action)) {
        if (action === "add")
          this.$router.push({ path: "/" + table + "/" + action });
        if (action === "change" || action === "delete")
          this.$router.push({ path: "/" + table });
      } else {
        toastInfo({
          text: `<b>${table}</b> doesn't have <b>${action}</b> view!`
        });
      }
    },

    /**
     * Checks if table is in either add, change or delete list and then returns boolean value.
     *
     * @param table, String value which is checked to see if it exists in list aka routes available in app
     * @param action, String value which action user wants, either add, change or, delete
     * @returns {boolean}, if table is in list correspondent to desired action
     */
    isTableInCorrectList(table, action) {
      if (action === "add") return this.addList.includes(table);
      if (action === "change") return this.changeList.includes(table);
      if (action === "delete") return this.deleteList.includes(table);
      return false;
    }
  }
};
</script>

<style scoped>
legend:hover {
  color: #007bff;
}

.list-link-add {
  color: #28a745;
}

.list-link-add:hover {
  cursor: pointer;
  font-weight: bold;
}

.list-link-change {
  color: #007bff;
}

.list-link-change:hover {
  cursor: pointer;
  font-weight: bold;
}

.list-link-delete {
  color: #dc3545;
}

.list-link-delete:hover {
  cursor: pointer;
  font-weight: bold;
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
