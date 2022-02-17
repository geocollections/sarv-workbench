<template>
  <v-row class="table-view-search d-print-none mt-0">
    <v-col>
      <v-card :color="bodyColor.split('n-')[0] + 'n-5'" elevation="4">
        <v-card-title class="pb-0">
          <div class="card-title--clickable" @click="showSearch = !showSearch">
            <span>{{ $t("edit.search") }}</span>
            <v-icon right :color="bodyActiveColor">fas fa-search</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showSearch = !showSearch"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              showSearch ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-0">
          <div v-show="showSearch">
            <v-row no-gutters class="mb-2">
              <v-col
                class="pa-2"
                cols="12"
                :md="colSize"
                v-for="(field, index) in $_tableViewMixin_searchFields.mainIds"
                :key="index"
              >
                <!-- DATEPICKER -->
                <v-row
                  no-gutters
                  v-if="$_tableViewMixin_searchFields.byIds[field].isDate"
                >
                  <v-col cols="12">
                    <v-menu
                      v-model="calendarMenus[field]"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          hide-details
                          :value="
                            $_tableViewMixin_searchFields.byIds[field].value
                          "
                          :label="
                            $t($_tableViewMixin_searchFields.byIds[field].title)
                          "
                          prepend-inner-icon="far fa-calendar-alt"
                          :color="bodyActiveColor"
                          clearable
                          @click:clear="
                            updateSearchFieldsDebounced({
                              field,
                              key: 'value',
                              value: null,
                            })
                          "
                          clear-icon="fas fa-times"
                          readonly
                          :class="bodyActiveColor + '--text'"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :value="
                          $_tableViewMixin_searchFields.byIds[field].value
                        "
                        @input="
                          updateSearchFieldsDebounced({
                            field,
                            key: 'value',
                            value: $event,
                          })
                        "
                        :color="bodyActiveColor"
                        :header-color="`${bodyActiveColor} darken-3`"
                        scrollable
                        show-adjacent-months
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <!-- CHECKBOX -->
                <v-row
                  no-gutters
                  v-else-if="
                    $_tableViewMixin_searchFields.byIds[field].isCheckbox
                  "
                >
                  <v-col cols="12">
                    <v-checkbox
                      :input-value="
                        $_tableViewMixin_searchFields.byIds[field].value
                      "
                      :label="
                        $t($_tableViewMixin_searchFields.byIds[field].title)
                      "
                      class="mt-0 pr-6"
                      :color="bodyActiveColor"
                      hide-details
                      @change="
                        updateSearchFieldsDebounced({
                          field,
                          key: 'value',
                          value: $event,
                        })
                      "
                    />
                  </v-col>
                </v-row>

                <!-- REGULAR SEARCH FIELD -->
                <v-row no-gutters v-else>
                  <v-col cols="3" xl="2" class="px-1">
                    <v-select
                      :value="
                        $_tableViewMixin_searchFields.byIds[field].lookUpType
                      "
                      :color="bodyActiveColor"
                      :item-color="bodyActiveColor"
                      disable-lookup
                      hide-details
                      :items="translatedLookUpTypes"
                      :label="$t('main.lookUpType')"
                      @input="
                        updateSearchFieldsDebounced({
                          field,
                          key: 'lookUpType',
                          value: $event,
                        })
                      "
                    >
                      <template v-slot:selection="{ item }">
                        <div class="font-weight-bold">
                          {{ item.symbol }}
                        </div>
                      </template>
                    </v-select>
                  </v-col>

                  <v-col cols="9" xl="10" class="px-1">
                    <v-text-field
                      :value="$_tableViewMixin_searchFields.byIds[field].value"
                      :label="
                        $t($_tableViewMixin_searchFields.byIds[field].title)
                      "
                      :color="bodyActiveColor"
                      hide-details
                      :class="bodyActiveColor + '--text'"
                      @input="
                        updateSearchFieldsDebounced({
                          field,
                          key: 'value',
                          value: $event,
                        })
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- ATTACHMENT CHECKBOXES -->
            <v-row
              no-gutters
              class="checkboxes"
              v-if="$route.meta.object === 'attachment'"
            >
              <v-col cols="12">
                <v-row no-gutters>
                  <v-checkbox
                    :input-value="
                      $_tableViewMixin_searchFields.byIds[
                        'specimen_image_attachment'
                      ].value
                    "
                    :label="$t('attachment.photoArchive')"
                    value="2"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      updateSearchFieldsDebounced({
                        field: 'specimen_image_attachment',
                        key: 'value',
                        value: $event,
                      })
                    "
                  />
                  <v-checkbox
                    :input-value="
                      $_tableViewMixin_searchFields.byIds[
                        'specimen_image_attachment'
                      ].value
                    "
                    :label="$t('attachment.specimenImage')"
                    value="1"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      updateSearchFieldsDebounced({
                        field: 'specimen_image_attachment',
                        key: 'value',
                        value: $event,
                      })
                    "
                  />
                  <v-checkbox
                    :input-value="
                      $_tableViewMixin_searchFields.byIds[
                        'specimen_image_attachment'
                      ].value
                    "
                    :label="$t('attachment.otherFiles')"
                    value="3"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      updateSearchFieldsDebounced({
                        field: 'specimen_image_attachment',
                        key: 'value',
                        value: $event,
                      })
                    "
                  />
                  <v-checkbox
                    :input-value="
                      $_tableViewMixin_searchFields.byIds[
                        'specimen_image_attachment'
                      ].value
                    "
                    :label="$t('attachment.digitisedReference')"
                    value="4"
                    class="mt-0"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      updateSearchFieldsDebounced({
                        field: 'specimen_image_attachment',
                        key: 'value',
                        value: $event,
                      })
                    "
                  />
                </v-row>
              </v-col>
            </v-row>

            <!-- DYNAMIC SEARCH -->
            <dynamic-search
              class="my-4"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              :look-up-types="translatedLookUpTypes"
              :search-fields="$_tableViewMixin_filteredSearchFields"
              :col-size="3"
              @update:searchFields="updateSearchFieldsDebounced($event)"
            />

            <!-- RESET SEARCH PREFERENCES -->
            <div class="d-flex flex-column flex-sm-row align-center">
              <div class="mr-2 mb-2 mb-sm-0">
                <v-btn
                  @click="handleResetButton"
                  :color="bodyActiveColor"
                  dark
                  outlined
                >
                  <v-icon left>fas fa-eraser</v-icon>
                  {{ $t("buttons.clear") }}
                </v-btn>
              </div>
              <div>
                <v-btn @click="$root.$emit('table-search')" color="green" dark>
                  <v-icon left>fas fa-search</v-icon>
                  {{ $t("buttons.search") }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import tableViewMixin from "@/mixins/tableViewMixin";
import DynamicSearch from "@/components/partial/table_view/DynamicSearch";
import { debounce } from "lodash";

export default {
  name: "TableViewSearch",
  components: { DynamicSearch },
  mixins: [tableViewMixin],
  props: {
    colSize: {
      type: Number,
      default: 6,
    },
  },
  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    ...mapState("search", ["lookUpTypes"]),

    translatedLookUpTypes() {
      return this.lookUpTypes.map((item) => {
        return {
          ...item,
          text: this.$t(item.text),
        };
      });
    },
  },
  data: () => ({
    calendarMenus: ["date_start", "date_end"],
    showSearch: true,
  }),
  methods: {
    updateSearchFieldsDebounced(payload) {
      this.$_tableViewMixin_updateSearchFields(payload);
    },

    handleResetButton() {
      this.$_tableViewMixin_resetState();
      this.$root.$emit("table-search");
    },
  },
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

.chips-select >>> .v-select__selections {
  padding: 8px 0;
}

.chips-select >>> .v-chip {
  margin: 3px !important;
}

.chips-select >>> .v-label {
  font-weight: bold;
}
</style>
