<template>
  <v-row class="table-view-search d-print-none" v-if="filters.length > 0">
    <v-col class="py-4">
      <v-card :color="bodyColor.split('n-')[0] + 'n-5'" elevation="4">
        <v-card-title class="pb-0">
          <div
            class="card-title--clickable"
            @click="$emit('update:showSearch', !showSearch)"
          >
            <span>{{ $t("edit.search") }}</span>
            <v-icon right :color="bodyActiveColor">fas fa-search</v-icon>
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
                  <v-row v-if="field.isDate" class="pa-2">
                    <v-col cols="12" class="py-0 px-1">
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
                  <v-row v-else class="pa-2">
                    <v-col cols="3" xl="2" class="py-0 px-1">
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

                    <v-col cols="9" xl="10" class="py-0 px-1">
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
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'attachment'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
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
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'reference'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
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

              <v-row
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'taxon_pages'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
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
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'rock'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
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
                class="px-3 mt-3 checkboxes"
                v-if="$route.meta.object === 'loan'"
              >
                <v-col cols="12" class="py-0">
                  <v-row>
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

              <!-- RESET SEARCH PREFERENCES -->
              <v-row class="mt-3">
                <v-col cols="12">
                  <v-btn
                    @click="$emit('reset:searchParameters')"
                    :color="bodyActiveColor"
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
  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    ...mapState("search", ["lookUpTypes"]),

    translatedLookUpTypes() {
      return this.lookUpTypes.map(item => {
        return {
          ...item,
          text: this.$t(item.text)
        };
      });
    }
  },
  data: () => ({
    date_start: false,
    date_end: false,
    calendarMenus: ["date_start", "date_end"]
  }),
  methods: {
    updateDate(event, fieldId, index) {
      this.$emit("update:searchParameters", event, fieldId);
      this.calendarMenus[fieldId] = false;
    }
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
