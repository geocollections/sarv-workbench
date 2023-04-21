<template>
  <v-row class="table-view-search d-print-none mt-0" v-if="filters.length > 0">
    <v-col>
      <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
        <v-card-title class="pb-0 pt-2">
          <div
            class="card-title--clickable"
            @click="$emit('update:showSearch', !showSearch)"
          >
            <v-icon left :color="bodyActiveColor">fas fa-search</v-icon>
            <span>{{ $t("edit.search") }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$emit('update:showSearch', !showSearch)"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              showSearch ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-0 pb-2">
          <div v-show="showSearch">
            <v-row no-gutters class="mb-2">
              <v-col
                class="pa-2"
                cols="12"
                :md="colSize"
                v-for="(field, index) in filters"
                :key="index"
              >
                <!-- DATEPICKER -->
                <v-row no-gutters v-if="field.isDate">
                  <v-col cols="12">
                    <v-menu
                      v-model="calendarMenus[field.id]"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          hide-details
                          :value="searchParameters[field.id]"
                          :label="$t(field.title)"
                          prepend-inner-icon="far fa-calendar-alt"
                          :color="bodyActiveColor"
                          clearable
                          @click:clear="
                            $emit('update:searchParameters', null, field.id)
                          "
                          clear-icon="fas fa-times"
                          readonly
                          :class="bodyActiveColor + '--text'"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :value="searchParameters[field.id]"
                        @input="updateDate($event, field.id)"
                        :color="bodyActiveColor"
                        :header-color="`${bodyActiveColor} darken-3`"
                        scrollable
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <!-- REGULAR SEARCH FIELD -->
                <v-row no-gutters v-else>
                  <v-col cols="3" xl="2" class="px-1">
                    <v-select
                      :value="
                        searchParameters[`${field.id}__lookuptype`] ||
                        'icontains'
                      "
                      :color="bodyActiveColor"
                      :item-color="bodyActiveColor"
                      disable-lookup
                      hide-details
                      :items="translatedLookUpTypes"
                      :label="$t('main.lookUpType')"
                      @input="
                        $emit(
                          'update:searchParameters',
                          $event,
                          `${field.id}__lookuptype`
                        )
                      "
                    >
                      <template v-slot:selection="{ item }">
                        <div class="font-weight-bold">
                          {{ item.symbol }}
                        </div>
                      </template>

                      <!--                        <template v-slot:item="{item}">-->
                      <!--                          <div class="v-list-item__content">-->
                      <!--                            <div class="v-list-item__title">-->
                      <!--                              <b>{{ item.text.split(" ")[0] }}</b>-->
                      <!--                              {{ item.text.split(" ")[1] }}-->
                      <!--                            </div>-->
                      <!--                          </div>-->
                      <!--                        </template>-->
                    </v-select>
                  </v-col>

                  <v-col cols="9" xl="10" class="px-1">
                    <v-text-field
                      :value="searchParameters[field.id]"
                      :label="$t(field.title)"
                      :color="bodyActiveColor"
                      hide-details
                      :class="bodyActiveColor + '--text'"
                      @input="
                        $emit('update:searchParameters', $event, field.id)
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
          </div>
        </v-card-text>
      </v-card>
      <!-- DYNAMIC SEARCH -->
      <DynamicSearch
        class="mt-4 mb-2"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
        :look-up-types="translatedLookUpTypes"
        :dynamic-search-fields="$_tableHeaderMixin_searchFields"
        :col-size="3"
        @update:dynamicSearchFields="updateDynamicSearchFieldsDebounced"
      />

      <!-- DYNAMIC FIELDS -->
      <v-row no-gutters class="mt-6 mb-4">
        <v-col cols="12">
          <v-select
            :items="$_tableHeaderMixin_allHeaders"
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
              $_tableHeaderMixin_updateTableHeaders({
                event: $event,
                table: $route.meta.object,
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
          <v-btn @click="resetSearch" :color="bodyActiveColor" dark>
            <v-icon left>fas fa-redo</v-icon>
            {{ $t("buttons.resetSearch") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
import DynamicSearch from "@/components/partial/table_view/DynamicSearch";
import { debounce } from "lodash";

export default {
  name: "TableViewSearch",
  components: { DynamicSearch },
  mixins: [tableHeaderMixin],
  props: {
    showSearch: {
      type: Boolean,
      required: true,
    },
    filters: {
      type: Array,
      default: function () {
        return [];
      },
    },
    searchParameters: {
      type: Object,
    },
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
    date_start: false,
    date_end: false,
    calendarMenus: ["date_start", "date_end"],
  }),
  methods: {
    updateDate(event, fieldId, index) {
      this.$emit("update:searchParameters", event, fieldId);
      this.calendarMenus[fieldId] = false;
    },

    resetSearch() {
      this.$emit("reset:searchParameters");
      this.$_tableHeaderMixin_setDefaultTableHeaders();
      this.$_tableHeaderMixin_resetDynamicSearchFields();
    },

    updateDynamicSearchFieldsDebounced: debounce(function (payload) {
      this.$_tableHeaderMixin_updateDynamicSearchField(payload);
      // }, 400) TODO: For Testing Purposes
    }, 0),
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
