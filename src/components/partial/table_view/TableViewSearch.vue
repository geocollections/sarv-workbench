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
                <!--  TODO  -->
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

                <!--  TODO: Checkboxes searchFields.byIds[field].isCheckbox  -->

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
                    :input-value="searchParameters.specimen_image_attachment"
                    :label="$t('attachment.photoArchive')"
                    value="2"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit(
                        'update:searchParameters',
                        $event,
                        'specimen_image_attachment'
                      )
                    "
                  />
                  <v-checkbox
                    :input-value="searchParameters.specimen_image_attachment"
                    :label="$t('attachment.specimenImage')"
                    value="1"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit(
                        'update:searchParameters',
                        $event,
                        'specimen_image_attachment'
                      )
                    "
                  />
                  <v-checkbox
                    :input-value="searchParameters.specimen_image_attachment"
                    :label="$t('attachment.otherFiles')"
                    value="3"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit(
                        'update:searchParameters',
                        $event,
                        'specimen_image_attachment'
                      )
                    "
                  />
                  <v-checkbox
                    :input-value="searchParameters.specimen_image_attachment"
                    :label="$t('attachment.digitisedReference')"
                    value="4"
                    class="mt-0"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit(
                        'update:searchParameters',
                        $event,
                        'specimen_image_attachment'
                      )
                    "
                  />
                </v-row>
              </v-col>
            </v-row>

            <!-- REFERENCE CHECKBOXES -->
            <v-row
              no-gutters
              class="checkboxes"
              v-if="$route.meta.object === 'reference'"
            >
              <v-col cols="12">
                <v-row no-gutters>
                  <v-checkbox
                    :input-value="searchParameters.isEstonianReference"
                    :label="$t('reference.is_estonian_reference')"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit(
                        'update:searchParameters',
                        $event,
                        'isEstonianReference'
                      )
                    "
                  ></v-checkbox>
                  <v-checkbox
                    :input-value="searchParameters.isEstonianAuthor"
                    :label="$t('reference.is_estonian_author')"
                    class="mt-0"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit(
                        'update:searchParameters',
                        $event,
                        'isEstonianAuthor'
                      )
                    "
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>

            <!-- TAXON_PAGE CHECKBOXES -->
            <v-row
              no-gutters
              class="checkboxes"
              v-if="$route.meta.object === 'taxon_pages'"
            >
              <v-col cols="12">
                <v-row no-gutters>
                  <v-checkbox
                    :input-value="searchParameters.on_frontpage"
                    :label="$t('taxon_page.on_frontpage')"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit('update:searchParameters', $event, 'on_frontpage')
                    "
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>

            <!-- ROCK CHECKBOXES -->
            <v-row
              no-gutters
              class="checkboxes"
              v-if="$route.meta.object === 'rock'"
            >
              <v-col cols="12">
                <v-row no-gutters>
                  <v-checkbox
                    :input-value="searchParameters.in_portal"
                    :label="$t('rock.in_portal')"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit('update:searchParameters', $event, 'in_portal')
                    "
                  ></v-checkbox>
                  <v-checkbox
                    :input-value="searchParameters.in_estonia"
                    :label="$t('rock.in_estonia')"
                    class="mt-0"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit('update:searchParameters', $event, 'in_estonia')
                    "
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>

            <!-- LOAN CHECKBOXES -->
            <v-row
              no-gutters
              class="checkboxes"
              v-if="$route.meta.object === 'loan'"
            >
              <v-col cols="12">
                <v-row no-gutters>
                  <v-checkbox
                    :input-value="searchParameters.isActive"
                    :label="$t('loan.isActive')"
                    class="mt-0 pr-6"
                    :color="bodyActiveColor"
                    hide-details
                    @change="
                      $emit('update:searchParameters', $event, 'isActive')
                    "
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>

            <!-- DYNAMIC SEARCH -->
            <dynamic-search
              class="mt-4 mb-2"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              :look-up-types="translatedLookUpTypes"
              :search-fields="$_tableViewMixin_searchFields"
              :col-size="3"
              @update:searchFields="updateSearchFieldsDebounced($event)"
            />

            <!-- TABLE HEADERS SELECT BOX -->
            <v-row no-gutters class="mt-6 mb-4">
              <v-col cols="12">
                <v-select
                  :items="$_tableHeaderMixin_translatedHeaders"
                  :value="$_tableHeaderMixin_shownHeaders"
                  chips
                  small-chips
                  deletable-chips
                  multiple
                  :color="bodyActiveColor"
                  :label="$t('common.fields')"
                  clearable
                  clear-icon="fas fa-times"
                  @change="
                    $_tableViewMixin_updateHeaders({
                      value: $event,
                    })
                  "
                  class="chips-select"
                  hide-details
                  dense
                />
              </v-col>
            </v-row>

            <!-- RESET SEARCH PREFERENCES -->
            <v-row no-gutters>
              <v-col cols="12">
                <v-btn
                  @click="$_tableViewMixin_resetState"
                  :color="bodyActiveColor"
                  dark
                >
                  <v-icon left>fas fa-filter</v-icon>
                  <!-- TODO: Rename to tühjenda/clear -->
                  {{ $t("buttons.resetSearch") }}
                </v-btn>
              </v-col>
            </v-row>
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
    updateSearchFieldsDebounced: debounce(function (payload) {
      this.$_tableViewMixin_updateSearchFields(payload);
    }, 400),
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
