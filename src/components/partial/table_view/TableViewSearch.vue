<template>
  <v-row class="table-view-search d-print-none" v-if="filters.length > 0">
    <v-col class="py-4">
      <v-card
        :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pb-0">
          <div
            class="card-title--clickable"
            @click="$emit('update:showSearch', !showSearch)"
          >
            <span>{{ $t("edit.search") }}</span>
            <v-icon right :color="appSettings.bodyActiveColor"
              >fas fa-search</v-icon
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$emit('update:showSearch', !showSearch)"
            :color="appSettings.bodyActiveColor"
          >
            <v-icon>{{
              showSearch ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-0">
          <transition enter-active-class="animated zoomIn faster">
            <div v-show="showSearch">
              <v-row>
                <v-col
                  cols="12"
                  :md="colSize"
                  v-for="(field, index) in filters"
                  :key="index"
                  class="py-0"
                >
                  <!-- DATEPICKER -->
                  <v-menu
                    v-if="field.isDate"
                    v-model="field.calendarState"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        hide-details
                        v-model="searchParameters[field.id]"
                        :label="$t(field.title)"
                        prepend-inner-icon="far fa-calendar-alt"
                        :color="appSettings.bodyActiveColor"
                        clearable
                        clear-icon="fas fa-times"
                        readonly
                        :class="appSettings.bodyActiveColor + '--text'"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="searchParameters[field.id]"
                      @input="field.calendarState = false"
                      :color="appSettings.bodyActiveColor"
                      :header-color="`${appSettings.bodyActiveColor} darken-3`"
                      scrollable
                    ></v-date-picker>
                  </v-menu>

                  <!-- REGULAR SEARCH FIELD -->
                  <v-text-field
                    v-else
                    v-model="searchParameters[field.id]"
                    :label="$t(field.title)"
                    :color="appSettings.bodyActiveColor"
                    hide-details
                    :class="appSettings.bodyActiveColor + '--text'"
                    :type="field.type"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- ATTACHMENT CHECKBOXES -->
              <v-row
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'attachment'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.photoArchive')"
                      value="2"
                      class="mt-0 pr-6"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    />
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.specimenImage')"
                      value="1"
                      class="mt-0 pr-6"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    />
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.otherFiles')"
                      value="3"
                      class="mt-0 pr-6"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    />
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.digitisedReference')"
                      value="4"
                      class="mt-0"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    />
                  </v-row>
                </v-col>
              </v-row>

              <!-- REFERENCE CHECKBOXES -->
              <v-row
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'reference'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
                    <v-checkbox
                      v-model="searchParameters.isEstonianReference"
                      :label="$t('reference.is_estonian_reference')"
                      class="mt-0 pr-6"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    ></v-checkbox>
                    <v-checkbox
                      v-model="searchParameters.isEstonianAuthor"
                      :label="$t('reference.is_estonian_author')"
                      class="mt-0"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    ></v-checkbox>
                  </v-row>
                </v-col>
              </v-row>

              <!-- ROCK CHECKBOXES -->
              <v-row
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'rock'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
                    <v-checkbox
                      v-model="searchParameters.in_portal"
                      :label="$t('rock.in_portal')"
                      class="mt-0 pr-6"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    ></v-checkbox>
                    <v-checkbox
                      v-model="searchParameters.in_estonia"
                      :label="$t('rock.in_estonia')"
                      class="mt-0"
                      :color="appSettings.bodyActiveColor"
                      hide-details
                    ></v-checkbox>
                  </v-row>
                </v-col>
              </v-row>

              <!-- RESET SEARCH PREFERENCES -->
              <v-row class="mt-3">
                <v-col cols="12">
                  <v-btn
                    @click="$emit('reset:searchPreferences', true)"
                    :color="appSettings.bodyActiveColor"
                    dark
                  >
                    <v-icon left>fas fa-filter</v-icon>
                    {{ $t("buttons.deletePreferences") }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TableViewSearch",
  props: {
    showSearch: {
      type: Boolean,
      required: true
    },
    filters: {
      type: Array,
      default: function() {
        return [];
      }
    },
    searchParameters: {
      type: Object
    },
    colSize: {
      type: Number,
      default: 6
    }
  },
  data: () => ({
    calendarMenu: false
  }),
  computed: {
    ...mapState(["appSettings"])
  }
};
</script>

<style scoped>
.checkboxes >>> .v-label {
  margin-bottom: 0;
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

.table-view-search >>> .v-text-field__slot input {
  color: unset;
  font-weight: bold;
}
</style>