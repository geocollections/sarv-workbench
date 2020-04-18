<template>
  <div class="accessibility">
    <v-row no-gutters>
      <v-col class="mx-2 vuetify-checkbox">
        <v-checkbox
          hide-details
          class="mt-0 mb-2"
          :ripple="false"
          :color="bodyActiveColor"
          v-model="myRecentUrlsState"
        >
          <template v-slot:label>
            <span class="mr-1">{{ $t("settings.recentUrls") }}:</span>
            <span class="font-weight-bold">{{ myRecentUrlsState }}</span>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Accessibility",
  props: {
    bodyDark: {
      type: Boolean,
      required: false,
      default: false
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "black"
    }
  },
  computed: {
    ...mapState("settings", ["recentUrlsState"]),
    myRecentUrlsState: {
      get() {
        return this.recentUrlsState;
      },
      set(value) {
        this.updateRecentUrlsState(value);
      }
    }
  },

  methods: {
    ...mapActions("settings", ["updateRecentUrlsState"])
  }
};
</script>

<style scoped>
.zoom-radios >>> label {
  margin-bottom: 0 !important;
}
</style>
