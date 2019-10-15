<template>
  <v-row class="table-view-search" v-if="filters.length > 0">
    <v-col class="py-4">
      <v-card elevation="3">
        <v-card-title class="pb-0">
          <span>{{ $t("edit.search") }}&nbsp;</span>
          <v-icon color="deep-orange">fas fa-search</v-icon>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$emit('update:showSearch', !showSearch)"
            color="deep-orange"
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
                        dense
                        v-model="searchParameters[field.id]"
                        :label="$t(field.title)"
                        prepend-inner-icon="far fa-calendar-alt"
                        clearable
                        clear-icon="fas fa-times"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="searchParameters[field.id]"
                      @input="field.calendarState = false"
                      scrollable
                    ></v-date-picker>
                  </v-menu>

                  <v-text-field
                    v-else
                    dense
                    v-model="searchParameters[field.id]"
                    :label="$t(field.title)"
                    color="deep-orange"
                    :type="field.type"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row
                class="px-3 checkboxes"
                v-if="$route.meta.object === 'attachment'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.photoArchive')"
                      value="2"
                      class="mt-0 pr-6"
                      color="deep-orange"
                      hide-details
                    ></v-checkbox>
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.specimenImage')"
                      value="1"
                      class="mt-0 pr-6"
                      color="deep-orange"
                      hide-details
                    ></v-checkbox>
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.otherFiles')"
                      value="3"
                      class="mt-0 pr-6"
                      color="deep-orange"
                      hide-details
                    ></v-checkbox>
                    <v-checkbox
                      v-model="searchParameters.specimen_image_attachment"
                      :label="$t('attachment.digitisedReference')"
                      value="4"
                      class="mt-0"
                      color="deep-orange"
                      hide-details
                    ></v-checkbox>
                  </v-row>
                </v-col>
              </v-row>

              <v-row
                class="px-3 checkboxes"
                v-if="$route.meta.object === 'reference'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
                    <v-checkbox
                      v-model="searchParameters.isEstonianReference"
                      :label="$t('reference.is_estonian_reference')"
                      class="mt-0 pr-6"
                      color="deep-orange"
                      hide-details
                    ></v-checkbox>
                    <v-checkbox
                      v-model="searchParameters.isEstonianAuthor"
                      :label="$t('reference.is_estonian_author')"
                      class="mt-0"
                      color="deep-orange"
                      hide-details
                    ></v-checkbox>
                  </v-row>
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
  })
};
</script>

<style scoped>
.checkboxes >>> .v-label {
  margin-bottom: 0;
}
</style>
