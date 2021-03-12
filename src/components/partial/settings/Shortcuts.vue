<template>
  <v-row no-gutters class="shortcuts">
    <v-col cols="12" class="px-1">
      <v-btn
        small
        @click="addShortcut"
        class="ma-1"
        :color="bodyActiveColor"
        :dark="bodyActiveColorDark"
      >
        <v-icon left small>fa fa-plus</v-icon>
        {{ $t("settings.addShortcut") }}
      </v-btn>

      <v-btn
        small
        @click="saveShortcuts"
        class="ma-1"
        :color="bodyActiveColor"
        :dark="bodyActiveColorDark"
      >
        <v-icon left small>fa fa-save</v-icon>
        {{ $t("settings.saveShortcuts") }}
      </v-btn>
    </v-col>

    <v-col cols="12" class="px-1" v-if="myShortcuts.length > 0">
      <v-row>
        <v-col cols="12">
          <p>
            {{ $t("settings.pathInfo1") }} <b class="text-info">{{ origin }}</b
            >, {{ $t("settings.pathInfo2") }} {{ origin
            }}<b class="text-info">/attachment</b
            >{{ $t("settings.pathInfo3") }}
            <b class="text-info">/attachment</b> {{ $t("settings.pathInfo4") }}.
          </p>

          <p>
            <b class="text-info">{{ $t("settings.isAlwaysVisible") }}</b>
            {{ $t("settings.isAlwaysVisibleInfo") }}.
          </p>
        </v-col>
      </v-row>

      <v-card elevation="2" class="mb-2 pb-2 mx-1">
        <table class="table" style="width: 100%">
          <thead class="">
            <tr>
              <th>{{ $t("settings.handle") }}</th>
              <th>{{ $t("settings.title") }}</th>
              <th>{{ $t("settings.path") }}</th>
              <th>{{ $t("settings.isAlwaysVisible") }}</th>
              <th>{{ $t("settings.remove") }}</th>
            </tr>
          </thead>

          <draggable v-model="myShortcuts" tag="tbody" handle=".handle">
            <tr v-for="(entity, index) in myShortcuts" :key="index">
              <td class="handle text-center" style="vertical-align: middle;">
                <v-icon color="black">fas fa-align-justify</v-icon>
              </td>

              <td>
                <v-text-field
                  hide-details
                  :value="entity.title"
                  :label="$t('settings.title')"
                  class="mt-0"
                  :color="bodyActiveColor"
                  @input="updateTitle($event, index)"
                ></v-text-field>
              </td>

              <td>
                <v-text-field
                  hide-details
                  :value="entity.path"
                  :label="$t('settings.path')"
                  class="mt-0"
                  :color="bodyActiveColor"
                  @input="updatePath($event, index)"
                ></v-text-field>
              </td>

              <td class="vuetify-checkbox" style="vertical-align: middle;">
                <v-checkbox
                  :input-value="entity.isAlwaysVisible"
                  hide-details
                  :color="bodyActiveColor"
                  class="mt-0 justify-center"
                  @change="updateIsAlwaysVisible($event, index)"
                ></v-checkbox>
              </td>

              <td class="text-center" style="vertical-align: middle;">
                <v-btn
                  icon
                  :title="$t('settings.removeShortcut')"
                  @click="removeShortcut(index)"
                  color="red"
                >
                  <v-icon>fa fa-times</v-icon>
                </v-btn>
              </td>
            </tr>
          </draggable>
        </table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import draggable from "vuedraggable";
import { mapActions, mapState } from "vuex";
import toastMixin from "../../../mixins/toastMixin";

export default {
  components: {
    draggable
  },

  name: "Shortcuts",

  props: {
    bodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "black"
    }
  },

  mixins: [toastMixin],

  data() {
    return {
      origin: ""
    };
  },

  computed: {
    ...mapState("settings", ["shortcuts"]),

    myShortcuts: {
      get() {
        return this.shortcuts;
      },
      set(value) {
        this.setShortcuts(value);
      }
    }
  },

  created() {
    this.origin = document.location.origin;
  },

  beforeDestroy() {
    this.setShortcuts(this.myShortcuts);
  },

  methods: {
    ...mapActions("settings", [
      "setShortcuts",
      "addShortcut",
      "removeShortcut",
      "shortcutUpdateTitle",
      "shortcutUpdatePath",
      "shortcutUpdateIsAlwaysVisible"
    ]),

    updateTitle(event, index) {
      this.shortcutUpdateTitle({ event: event, index: index });
    },

    updatePath(event, index) {
      this.shortcutUpdatePath({ event: event, index: index });
    },

    updateIsAlwaysVisible(event, index) {
      this.shortcutUpdateIsAlwaysVisible({ event: event, index: index });
    },

    saveShortcuts() {
      this.setShortcuts(this.myShortcuts);
      this.toastSuccess({ text: this.$t("settings.shortcutsSaved") });
    }
  }
};
</script>

<style scoped>
.handle:hover {
  cursor: grab;
}

.handle:active {
  cursor: grabbing;
}
</style>
