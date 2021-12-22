<template>
  <div class="site">
    <!-- CONVERT TO LOCALITY -->
    <v-row v-if="$route.meta.isEdit">
      <v-col cols="12" class="text-right">
        <v-btn
          :color="bodyActiveColor"
          dark
          @click="$parent.$emit('button-clicked', 'COPY_TO_LOCALITY')"
        >
          <v-icon left small>fas fa-map-marked-alt</v-icon>
          {{ $t("site.copyToLocality") }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span
            :class="validate('site_groundwater') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            :class="validate('site_groundwater') ? 'green--text' : 'red--text'"
            right
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer />
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- SITE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="site_groundwater.site"
                :color="bodyActiveColor"
                :items="autocomplete.site"
                :loading="autocomplete.loaders.site"
                item-text="name"
                :label="$t('sample.site')"
                is-link
                route-object="site"
                is-searchable
                v-on:search:items="autocompleteSiteSearch"
                use-state
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SITE_GROUNDWATER -->
    <v-card
      class="mt-2"
      id="block-groundwater"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.groundwater = !block.groundwater"
        >
          <span>{{ $t("site.groundwater") }}</span>
          <v-icon right>fas fa-water</v-icon>
        </div>
        <v-spacer />
        <v-btn
          icon
          @click="block.groundwater = !block.groundwater"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.groundwater ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.groundwater" class="pa-1">
          <!-- TYPE_TXT, AQUIFER_STSTEM and AQUIFER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.type_txt"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.type_txt')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.aquifer_system"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.aquifer_system')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.aquifer"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.aquifer')"
              />
            </v-col>
          </v-row>

          <!-- WELL_DEPTH and FILTER_TYPE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.well_depth"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.well_depth')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_type"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_type')"
              />
            </v-col>
          </v-row>

          <!-- FILTER_TOP, FILTER_BOTTOM, FILTER_TOP_Z, FILTER_BOTTOM_Z -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_top"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_top')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_bottom"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_bottom')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_top_z"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_top_z')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_bottom_z"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_bottom_z')"
                type="number"
                step="0.01"
              />
            </v-col>
          </v-row>

          <!-- KATASTER_ID, KESKONNAREGISTER_ID and URL_VEKA -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.kataster_id"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.kataster_id')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.keskkonnaregister_id"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.keskkonnaregister_id')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.url_veka"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.url_veka')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "Site",
  components: {
    AutocompleteWrapper,
    InputWrapper,
  },
  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
  },
  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    detailViewUtilsMixin,
  ],
  data() {
    return this.setInitialData();
  },
  created() {
    this.loadFullInfo();
  },

  methods: {
    setInitialData() {
      return {
        autocomplete: {
          loaders: {
            site: false,
          },
          site: [],
        },
        requiredFields: ["site"],
        site_groundwater: {
          id: null,
          site: null,
          aquifer_system: null,
          aquifer: null,
          well_depth: null,
          type_txt: null,
          filter_type: null,
          filter_top: null,
          filter_top_z: null,
          filter_bottom: null,
          filter_bottom_z: null,
          url_veka: null,
          remarks: null,
          kataster_id: null,
          keskkonnaregister_id: null,
        },
        block: {
          info: true,
          groundwater: true,
        },
      };
    },
  },
};
</script>
