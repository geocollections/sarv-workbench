<template>
  <div class="settings">
    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t("header.settings") }}</p>
      </div>
    </div>

    <!-- APP SETTINGS -->
    <floating-settings />

    <!-- ACCESSIBILITY -->
    <fieldset class="border p-2 mt-2">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.accessibility }"
        @click="block.accessibility = !block.accessibility"
      >
        {{ $t("settings.accessibility") }}
        <i class="fas fa-wrench"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.accessibility">
          <Accessibility />
        </div>
      </transition>
    </fieldset>

    <!-- SHORTCUTS -->
    <fieldset class="border p-2 mt-2">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.shortcuts }"
        @click="block.shortcuts = !block.shortcuts"
      >
        {{ $t("settings.shortcuts") }}
        <i class="far fa-share-square"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.shortcuts">
          <shortcuts />
        </div>
      </transition>
    </fieldset>

    <!-- PERMISSIONS -->
    <fieldset class="border p-2 mt-2">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.permissions }"
        @click="block.permissions = !block.permissions"
      >
        {{ $t("settings.permissions") }}
        <i class="fas fa-user-lock"></i>
      </legend>

      <transition
        name="fade"
        enter-active-class="animated fadeIn faster"
        leave-active-class="animated fadeOut faster"
      >
        <v-row v-show="block.permissions">
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
                <v-row v-for="(entity, entityIndex) in key" :key="entityIndex">
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
                        isTableInCorrectList(index, 'change') ? 'blue' : 'black'
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
                        isTableInCorrectList(index, 'delete') ? 'red' : 'black'
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
                        isTableInCorrectList(index, 'change') ? 'blue' : 'black'
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
      </transition>
    </fieldset>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.min.css";
import Shortcuts from "../components/partial/settings/Shortcuts";
import Accessibility from "../components/partial/settings/Accessibility";
import FloatingSettings from "../components/partial/settings/FloatingSettings";
import formSectionsMixin from "../mixins/formSectionsMixin";
import { mapState } from "vuex";
import { toastInfo } from "../assets/js/iziToast/iziToast";

export default {
  name: "Settings",
  components: { Shortcuts, Accessibility, FloatingSettings },
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
        "collection"
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
        "collection"
      ],
      deleteList: [],
      block: { shortcuts: true, permissions: true, accessibility: true }
    };
  },
  metaInfo() {
    return {
      title: this.$t("titles.settings")
    };
  },

  computed: {
    ...mapState(["permissions"])
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
</style>
