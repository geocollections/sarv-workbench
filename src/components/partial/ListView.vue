<template>
  <div class="list-view" :class="bodyColor.split('n-')[0] + 'n-5'">
    <v-row no-gutters>
      <v-col class="list-view-column">
        <reference-list-view
          v-if="module === 'reference'"
          :data="data"
          :body-active-color="bodyActiveColor"
        />

        <sample-list-view v-if="module === 'sample'" :data="data" />

        <specimen-list-view v-if="module === 'specimen'" :data="data" />
        <location-list-view v-if="module === 'location'" :data="data" />
        <drillcore-box-list-view v-if="module === 'drillcore_box'" :data="data">
          <template v-slot:itemTitle="{ item }">
            <router-link
              :to="{ path: '/drillcore_box/' + item.drillcore_box }"
              :title="$t('editDrillcoreBox.editMessage')"
              class="sarv-link pt-3 ma-0"
              :class="`${bodyActiveColor}--text`"
            >
              <h5
                v-translate="{
                  et: `${item.drillcore_box__drillcore__drillcore}, Kast nr. ${
                    item.drillcore_box__number
                  } ${
                    !item.drillcore_box__depth_start &&
                    !item.drillcore_box__depth_end
                      ? ''
                      : `(${
                          item.drillcore_box__depth_start
                            ? item.drillcore_box__depth_start
                            : ''
                        } - ${
                          item.drillcore_box__depth_end
                            ? item.drillcore_box__depth_end
                            : ''
                        } m)`
                  }`,
                  en: `${
                    item.drillcore_box__drillcore__drillcore_en
                  }, Box nr. ${item.drillcore_box__number} ${
                    !item.drillcore_box__depth_start &&
                    !item.drillcore_box__depth_end
                      ? ''
                      : `(${
                          item.drillcore_box__depth_start
                            ? item.drillcore_box__depth_start
                            : ''
                        } - ${
                          item.drillcore_box__depth_end
                            ? item.drillcore_box__depth_end
                            : ''
                        } m)`
                  }`,
                }"
              />
            </router-link>
          </template>
        </drillcore-box-list-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ReferenceListView from "../reference/ReferenceListView";
import SampleListView from "../sample/SampleListView";
import SpecimenListView from "../specimen/SpecimenListView";
import LocationListView from "@/components/location/LocationListView";
import DrillcoreBoxListView from "@/components/drillcore_box/DrillcoreBoxListView";

export default {
  components: {
    DrillcoreBoxListView,
    LocationListView,
    ReferenceListView,
    SampleListView,
    SpecimenListView,
  },
  props: ["module", "data", "bodyColor", "bodyActiveColor"],
  name: "ListView",
};
</script>

<style>
@media print {
  @page {
    width: 297mm;
    height: 210mm;
    margin: 15mm 5mm;
  }

  html,
  body,
  #app,
  .v-application--wrap,
  .dashboard,
  .v-content,
  .v-content__wrap,
  .container,
  .list-module-core,
  .table-card,
  .v-card,
  .row,
  .col {
    all: unset !important;
  }
  a {
    text-decoration: none !important;
  }
  .list-view-column {
    padding: 0 !important;
  }

  .list-row {
    width: 100%;
    height: 100%;
  }
}

@media screen {
  .list-view-column {
    padding: 16px !important;
  }
}
</style>
