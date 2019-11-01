<template>
  <div class="shortcuts row">
    <div class="col-12 mb-3">
      <b-button-group size="sm" class="d-block">
        <b-button
          class="m-1"
          style="border-radius: 0.25rem"
          variant="outline-success"
          @click="addShortcut"
        >
          <i class="fa fa-plus"></i>
          {{ $t("settings.addShortcut") }}
        </b-button>

        <b-button
          class="m-1"
          v-if="this.shortcuts.length > 0"
          style="border-radius: 0.25rem"
          variant="outline-success"
          @click="saveShortcuts"
        >
          <i class="fa fa-save"></i>
          {{ $t("settings.saveShortcuts") }}
        </b-button>
      </b-button-group>
    </div>

    <div class="col-12" v-if="shortcuts.length > 0">
      <div class="row">
        <div class="col">
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
        </div>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead class="">
            <tr>
              <th>{{ $t("settings.handle") }}</th>
              <th>{{ $t("settings.title") }}</th>
              <th>{{ $t("settings.path") }}</th>
              <th>{{ $t("settings.isAlwaysVisible") }}</th>
              <th>{{ $t("settings.remove") }}</th>
            </tr>
          </thead>

          <draggable :list="shortcuts" tag="tbody" handle=".handle">
            <tr v-for="(entity, index) in shortcuts" :key="index">
              <td class="handle text-center" style="vertical-align: middle;">
                <v-icon color="black">fas fa-align-justify</v-icon>
              </td>

              <td>
                <v-text-field
                  hide-details
                  v-model="entity.title"
                  :label="$t('settings.title')"
                  class="mt-0"
                ></v-text-field>
              </td>

              <td>
                <v-text-field
                  hide-details
                  v-model="entity.path"
                  :label="$t('settings.path')"
                  class="mt-0"
                ></v-text-field>
              </td>

              <td class="vuetify-checkbox" style="vertical-align: middle;">
                <v-checkbox
                  v-model="entity.isAlwaysVisible"
                  hide-details
                  color="blue"
                  class="mt-0 justify-center"
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
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { toastSuccess } from "../../../assets/js/iziToast/iziToast";

export default {
  components: {
    draggable
  },
  name: "Shortcuts",
  data() {
    return {
      origin: "",
      // Max 7
      shortcuts: []
    };
  },
  beforeCreate: function() {
    this.$store.dispatch("GET_SHORTCUTS");
  },
  created: function() {
    this.origin = document.location.origin;
    this.shortcuts = this.$store.state["shortcuts"];
    console.log(this.$router.options.routes);
  },
  beforeDestroy: function() {
    this.$store.dispatch("SAVE_SHORTCUTS", this.shortcuts);
  },
  methods: {
    addShortcut() {
      this.shortcuts.push({ title: "", path: "", isAlwaysVisible: false });
    },

    removeShortcut(index) {
      this.shortcuts.splice(index, 1);
    },

    saveShortcuts() {
      this.$store.dispatch("SAVE_SHORTCUTS", this.shortcuts);
      toastSuccess({ text: this.$t("settings.shortcutsSaved") });
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
