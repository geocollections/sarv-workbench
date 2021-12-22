<template>
  <sample-wrapper :simple-view="isSimpleView">
    <template v-slot:switch>
      <div
        class="d-flex flex-sm-row flex-wrap justify-space-between flex-column"
      >
        <div class="mr-0 mr-sm-2 mb-2">
          <v-switch
            class="vuetify-switch mt-0"
            inset
            v-model="isSimpleView"
            :label="
              isSimpleView
                ? 'Current view: ' + $t('sample.simpleForm')
                : 'Current view: ' + $t('sample.basicForm')
            "
            hide-details
            :color="bodyActiveColor"
          />
        </div>

        <div
          class="
            d-flex
            flex-sm-row flex-wrap flex-column
            justify-end
            flex-grow-1
          "
        >
          <v-btn
            class="mr-0 mb-2 mb-sm-0"
            :class="{ 'mr-sm-2': $route.meta.isEdit }"
            dark
            :color="bodyActiveColor"
            :to="{
              name: 'Analysis add',
              params: { sample: { id: sample.number, number: sample.number } },
            }"
          >
            <v-icon left small>fas fa-chart-pie</v-icon>
            {{ $t("sample.addAnalysis") }}
          </v-btn>

          <v-btn
            v-if="$route.meta.isEdit"
            dark
            :color="bodyActiveColor"
            @click="saveAsNew($route.meta.object, 'specimen')"
          >
            <v-icon left small>fas fa-fish</v-icon>
            {{ $t("sample.save_as_new_specimen") }}
          </v-btn>
        </div>
      </div>
    </template>

    <template v-slot:basic-form>
      <!-- GENERAL INFO -->
      <v-card
        class="mt-2"
        id="block-info"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div class="card-title--clickable" @click="block.info = !block.info">
            <span :class="validate('sample') ? 'green--text' : 'red--text'">{{
              $t("common.generalInfo")
            }}</span>
            <v-icon
              right
              :class="validate('sample') ? 'green--text' : 'red--text'"
              >fas fa-project-diagram</v-icon
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.info = !block.info"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.info ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.info" class="pa-1">
            <!-- NUMBERS -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.number"
                  :color="bodyActiveColor"
                  :label="$t('sample.number')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.number_additional"
                  :color="bodyActiveColor"
                  :label="$t('sample.number_additional')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.number_field"
                  :color="bodyActiveColor"
                  :label="$t('sample.number_field')"
                />
              </v-col>
            </v-row>

            <!-- SAMPLE PURPOSE, TYPE and SERIES -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.sample_purpose"
                  :color="bodyActiveColor"
                  :items="autocomplete.list_sample_purpose"
                  :loading="autocomplete.loaders.list_sample_purpose"
                  :item-text="commonLabel"
                  :label="$t('sample.sample_purpose')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.sample_type"
                  :color="bodyActiveColor"
                  :label="$t('sample.sample_type')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.series"
                  :color="bodyActiveColor"
                  :items="autocomplete.series"
                  :loading="autocomplete.loaders.series"
                  item-text="name"
                  :label="$t('sample.series')"
                  is-searchable
                  v-on:search:items="autocompleteSampleSeriesSearch"
                />
              </v-col>
            </v-row>

            <!-- LOCALITY, DEPTH and DEPTH_INTERVAL -->
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.locality"
                  :color="bodyActiveColor"
                  :items="autocomplete.locality"
                  :loading="autocomplete.loaders.locality"
                  :item-text="localityLabel"
                  :label="$t('sample.locality')"
                  is-link
                  route-object="locality"
                  is-searchable
                  v-on:search:items="autocompleteLocalitySearch"
                />
              </v-col>

              <v-col cols="6" md="3" class="pa-1">
                <input-wrapper
                  v-model="sample.depth"
                  :color="bodyActiveColor"
                  :label="$t('common.depth')"
                  type="number"
                  step="0.01"
                />
              </v-col>

              <v-col cols="6" md="3" class="pa-1">
                <input-wrapper
                  v-model="sample.depth_interval"
                  :color="bodyActiveColor"
                  :label="$t('common.depth_interval')"
                  type="number"
                  step="0.01"
                />
              </v-col>
            </v-row>

            <!-- LOCALITY FREE, SITE and PROJECT  -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.locality_free"
                  :color="bodyActiveColor"
                  :label="$t('sample.locality_free')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.project"
                  :color="bodyActiveColor"
                  :items="autocomplete.project"
                  :loading="autocomplete.loaders.project"
                  :item-text="nameLabel"
                  :label="$t('site.project')"
                  is-link
                  route-object="project"
                  is-searchable
                  v-on:search:items="autocompleteProjectSearch"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.site"
                  :color="bodyActiveColor"
                  :items="autocomplete.site"
                  :loading="autocomplete.loaders.site"
                  item-text="name"
                  :label="$t('sample.site')"
                  is-link
                  route-object="site"
                  is-searchable
                  v-on:search:items="autocompleteSiteSearch"
                />
              </v-col>
            </v-row>

            <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY, STRATIGRAPHY FREE and STRATIGRAPHY_BED -->
            <v-row no-gutters>
              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.stratigraphy"
                  :color="bodyActiveColor"
                  :items="autocomplete.stratigraphy"
                  :loading="autocomplete.loaders.stratigraphy"
                  :item-text="stratigraphyLabel"
                  :label="$t('common.stratigraphy')"
                  is-searchable
                  v-on:search:items="autocompleteChronostratigraphySearch"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.lithostratigraphy"
                  :color="bodyActiveColor"
                  :items="autocomplete.lithostratigraphy"
                  :loading="autocomplete.loaders.lithostratigraphy"
                  :item-text="stratigraphyLabel"
                  :label="$t('sample.lithostratigraphy')"
                  is-searchable
                  v-on:search:items="autocompleteLithostratigraphySearch"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <input-wrapper
                  v-model="sample.stratigraphy_free"
                  :color="bodyActiveColor"
                  :label="$t('sample.stratigraphy_free')"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <input-wrapper
                  v-model="sample.stratigraphy_bed"
                  :color="bodyActiveColor"
                  :label="$t('sample.stratigraphy_bed')"
                />
              </v-col>
            </v-row>

            <!-- AGENT COLLECTED, AGENT COLLECTED FREE, DATE COLLECTED and DATE COLLECTED FREE -->
            <v-row no-gutters>
              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.agent_collected"
                  :color="bodyActiveColor"
                  :items="autocomplete.agent"
                  :loading="autocomplete.loaders.agent"
                  item-text="agent"
                  :label="$t('sample.agent_collected')"
                  is-link
                  route-object="agent"
                  is-searchable
                  v-on:search:items="autocompleteAgentSearch"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <input-wrapper
                  v-model="sample.agent_collected_free"
                  :color="bodyActiveColor"
                  :label="$t('sample.agent_collected_free')"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <date-wrapper
                  v-model="sample.date_collected"
                  :color="bodyActiveColor"
                  :label="$t('sample.date_collected')"
                  v-on:date:clear="sample.date_collected = null"
                  v-on:date:update="
                    updateUserInputtedDate('date_collected', $event)
                  "
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <input-wrapper
                  v-model="sample.date_collected_free"
                  :color="bodyActiveColor"
                  :label="$t('sample.date_collected_free')"
                />
              </v-col>
            </v-row>

            <!-- CLASSIFICATION ROCK, ROCK and ROCK EN -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.classification_rock"
                  :color="bodyActiveColor"
                  :items="autocomplete.rock"
                  :loading="autocomplete.loaders.rock"
                  :item-text="nameLabel"
                  :label="$t('sample.classification_rock')"
                  is-searchable
                  v-on:search:items="autocompleteRockSearch"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.rock"
                  :color="bodyActiveColor"
                  :label="$t('sample.rock')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.rock_en"
                  :color="bodyActiveColor"
                  :label="$t('sample.rock_en')"
                />
              </v-col>
            </v-row>

            <!-- FOSSILS -->
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">
                <input-wrapper
                  v-model="sample.fossils"
                  :color="bodyActiveColor"
                  :label="$t('sample.fossils')"
                />
              </v-col>
            </v-row>

            <!-- MASS, STORAGE, STORAGE_ADDITIONAL and OWNER -->
            <v-row no-gutters>
              <v-col cols="12" md="3" class="pa-1">
                <input-wrapper
                  v-model="sample.mass"
                  :color="bodyActiveColor"
                  :label="$t('sample.mass')"
                  type="number"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.storage"
                  :color="bodyActiveColor"
                  :items="autocomplete.storage"
                  :loading="autocomplete.loaders.storage"
                  item-text="location"
                  :label="$t('common.storage')"
                  is-searchable
                  v-on:search:items="autocompleteStorageSearch"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.storage_additional"
                  :color="bodyActiveColor"
                  :items="autocomplete.storage_additional"
                  :loading="autocomplete.loaders.storage_additional"
                  item-text="location"
                  :label="$t('sample.storage_additional')"
                  is-searchable
                  v-on:search:items="autocompleteAdditionalStorageSearch"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.owner"
                  :color="bodyActiveColor"
                  :items="autocomplete.agent"
                  :loading="autocomplete.loaders.owner"
                  item-text="agent"
                  :label="$t('common.owner')"
                  is-link
                  route-object="agent"
                  is-searchable
                  v-on:search:items="autocompleteOwnerSearch"
                />
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>

      <!-- RELATIONS -->
      <v-card
        class="mt-2"
        id="block-details"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.relatedInfo = !block.relatedInfo"
          >
            <span>{{ $t("sample.relatedInfo") }}</span>
            <v-icon right>fas fa-project-diagram</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.relatedInfo = !block.relatedInfo"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.relatedInfo ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.relatedInfo" class="pa-1">
            <!-- PARENT SAMPLE and PARENT SPECIMEN -->
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.parent_sample"
                  :color="bodyActiveColor"
                  :items="autocomplete.parent_sample"
                  :loading="autocomplete.loaders.parent_sample"
                  item-text="number"
                  :label="$t('sample.parent_sample')"
                  is-link
                  route-object="sample"
                  is-searchable
                  v-on:search:items="autocompleteSampleSearch"
                />
              </v-col>

              <v-col cols="12" md="6" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.parent_specimen"
                  :color="bodyActiveColor"
                  :items="autocomplete.parent_specimen"
                  :loading="autocomplete.loaders.parent_specimen"
                  item-text="specimen_id"
                  :label="$t('sample.parent_specimen')"
                  is-link
                  route-object="specimen"
                  is-searchable
                  v-on:search:items="autocompleteSpecimenSearch"
                />
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>

      <!-- DESCRIPTION -->
      <v-card
        class="mt-2"
        id="block-description"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.description = !block.description"
          >
            <span>{{ $t("common.description") }}</span>
            <v-icon right>fas fa-pen-fancy</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.description = !block.description"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.description ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.description" class="pa-1">
            <!-- REMARKS_LOCATION-->
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">
                <textarea-wrapper
                  v-model="sample.remarks"
                  :color="bodyActiveColor"
                  :label="$t('common.remarks')"
                />
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>
    </template>

    <template v-slot:simplified-form>
      <!-- GENERAL INFO SIMPLE -->
      <v-card
        class="mt-2"
        id="block-info"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div class="card-title--clickable" @click="block.info = !block.info">
            <span :class="validate('sample') ? 'green--text' : 'red--text'">{{
              $t("common.generalInfo")
            }}</span>
            <v-icon
              right
              :class="validate('sample') ? 'green--text' : 'red--text'"
              >fas fa-project-diagram</v-icon
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.info = !block.info"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.info ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.info" class="pa-1">
            <!-- NUMBER, NUMBER_FIELD and SAMPLE_PURPOSE -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.number"
                  :color="bodyActiveColor"
                  :label="$t('sample.number')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.number_field"
                  :color="bodyActiveColor"
                  :label="$t('sample.number_field')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.sample_purpose"
                  :color="bodyActiveColor"
                  :items="autocomplete.list_sample_purpose"
                  :loading="autocomplete.loaders.list_sample_purpose"
                  :item-text="commonLabel"
                  :label="$t('sample.sample_purpose')"
                />
              </v-col>
            </v-row>

            <!-- SERIES, LOCALITY, DEPTH and DEPTH INTERVAL -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.series"
                  :color="bodyActiveColor"
                  :items="autocomplete.series"
                  :loading="autocomplete.loaders.series"
                  item-text="name"
                  :label="$t('sample.series')"
                  is-searchable
                  v-on:search:items="autocompleteSampleSeriesSearch"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.locality"
                  :color="bodyActiveColor"
                  :items="autocomplete.locality"
                  :loading="autocomplete.loaders.locality"
                  :item-text="localityLabel"
                  :label="$t('sample.locality')"
                  is-link
                  route-object="locality"
                  is-searchable
                  v-on:search:items="autocompleteLocalitySearch"
                />
              </v-col>

              <v-col cols="6" md="2" class="pa-1">
                <input-wrapper
                  v-model="sample.depth"
                  :color="bodyActiveColor"
                  :label="$t('common.depth')"
                  type="number"
                  step="0.01"
                />
              </v-col>

              <v-col cols="6" md="2" class="pa-1">
                <input-wrapper
                  v-model="sample.depth_interval"
                  :color="bodyActiveColor"
                  :label="$t('common.depth_interval')"
                  type="number"
                  step="0.01"
                />
              </v-col>
            </v-row>

            <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY and STRATIGRAPHY_FREE -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.stratigraphy"
                  :color="bodyActiveColor"
                  :items="autocomplete.stratigraphy"
                  :loading="autocomplete.loaders.stratigraphy"
                  :item-text="stratigraphyLabel"
                  :label="$t('common.stratigraphy')"
                  is-searchable
                  v-on:search:items="autocompleteChronostratigraphySearch"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.lithostratigraphy"
                  :color="bodyActiveColor"
                  :items="autocomplete.lithostratigraphy"
                  :loading="autocomplete.loaders.lithostratigraphy"
                  :item-text="stratigraphyLabel"
                  :label="$t('sample.lithostratigraphy')"
                  is-searchable
                  v-on:search:items="autocompleteLithostratigraphySearch"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.stratigraphy_free"
                  :color="bodyActiveColor"
                  :label="$t('sample.stratigraphy_free')"
                />
              </v-col>
            </v-row>

            <!-- AGENT_COLLECTED, DATE_COLLECTED, PROJECT and SITE -->
            <v-row no-gutters>
              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.agent_collected"
                  :color="bodyActiveColor"
                  :items="autocomplete.agent_collected"
                  :loading="autocomplete.loaders.agent_collected"
                  item-text="agent"
                  :label="$t('sample.agent_collected')"
                  is-link
                  route-object="agent"
                  is-searchable
                  v-on:search:items="autocompleteAgentSearch($event, 'agent_collected')"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <date-wrapper
                  v-model="sample.date_collected"
                  :color="bodyActiveColor"
                  :label="$t('sample.date_collected')"
                  v-on:date:clear="sample.date_collected = null"
                  v-on:date:update="
                    updateUserInputtedDate('date_collected', $event)
                  "
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.project"
                  :color="bodyActiveColor"
                  :items="autocomplete.project"
                  :loading="autocomplete.loaders.project"
                  :item-text="nameLabel"
                  :label="$t('site.project')"
                  is-link
                  route-object="project"
                  is-searchable
                  v-on:search:items="autocompleteProjectSearch"
                />
              </v-col>

              <v-col cols="12" md="3" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.site"
                  :color="bodyActiveColor"
                  :items="autocomplete.site"
                  :loading="autocomplete.loaders.site"
                  item-text="name"
                  :label="$t('sample.site')"
                  is-link
                  route-object="site"
                  is-searchable
                  v-on:search:items="autocompleteSiteSearch"
                />
              </v-col>
            </v-row>

            <!-- CLASSIFICATION_ROCK, ROCK and FOSSILS -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.classification_rock"
                  :color="bodyActiveColor"
                  :items="autocomplete.rock"
                  :loading="autocomplete.loaders.rock"
                  :item-text="nameLabel"
                  :label="$t('sample.classification_rock')"
                  is-searchable
                  v-on:search:items="autocompleteRockSearch"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.rock"
                  :color="bodyActiveColor"
                  :label="$t('sample.rock')"
                />
              </v-col>

              <v-col cols="12" md="4" class="pa-1">
                <input-wrapper
                  v-model="sample.fossils"
                  :color="bodyActiveColor"
                  :label="$t('sample.fossils')"
                />
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>

      <!-- RELATIONS -->
      <v-card
        class="mt-2"
        id="block-details"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.relatedInfo = !block.relatedInfo"
          >
            <span>{{ $t("sample.relatedInfo") }}</span>
            <v-icon right>fas fa-project-diagram</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.relatedInfo = !block.relatedInfo"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.relatedInfo ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.relatedInfo" class="pa-1">
            <!-- PARENT SAMPLE and PARENT SPECIMEN -->
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.parent_sample"
                  :color="bodyActiveColor"
                  :items="autocomplete.sample"
                  :loading="autocomplete.loaders.sample"
                  item-text="number"
                  :label="$t('sample.parent_sample')"
                  is-link
                  route-object="sample"
                  is-searchable
                  v-on:search:items="autocompleteSampleSearch"
                />
              </v-col>

              <v-col cols="12" md="6" class="pa-1">
                <autocomplete-wrapper
                  v-model="sample.parent_specimen"
                  :color="bodyActiveColor"
                  :items="autocomplete.specimen"
                  :loading="autocomplete.loaders.specimen"
                  item-text="specimen_id"
                  :label="$t('sample.parent_specimen')"
                  is-link
                  route-object="specimen"
                  is-searchable
                  v-on:search:items="autocompleteSpecimenSearch"
                />
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>

      <!-- DESCRIPTION -->
      <v-card
        class="mt-2"
        id="block-description"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.description = !block.description"
          >
            <span>{{ $t("common.description") }}</span>
            <v-icon right>fas fa-pen-fancy</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.description = !block.description"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.description ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.description" class="pa-1">
            <!-- REMARKS_LOCATION-->
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">
                <textarea-wrapper
                  v-model="sample.remarks"
                  :color="bodyActiveColor"
                  :label="$t('common.remarks')"
                />
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>
    </template>

    <template v-slot:privacy>
      <v-row class="my-2">
        <v-col>
          <checkbox-wrapper
            v-model="sample.is_private"
            :color="bodyActiveColor"
            :label="$t('common.is_private')"
            @change="sample.is_private = !sample.is_private"
          />
        </v-col>
      </v-row>
    </template>

    <template v-slot:related-data>
      <v-card
        class="related-tabs mt-2"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-tabs
          :background-color="bodyColor.split('n-')[0] + 'n-3'"
          show-arrows
          grow
          prev-icon="fas fa-angle-left"
          next-icon="fas fa-angle-right"
          :active-class="bodyColor.split('n-')[0] + 'n-5 black--text'"
          hide-slider
        >
          <v-tab
            v-for="tab in relatedTabs"
            :key="tab.name"
            @click.prevent="setTab(tab.name)"
          >
            <span>{{ $t("sample.relatedTables." + tab.name) }}</span>
            <span class="ml-1">
              <v-icon small>{{ tab.iconClass }}</v-icon>
            </span>
            <span
              v-if="relatedData[tab.name].count > 0"
              class="font-weight-bold ml-2"
              :class="`${bodyActiveColor}--text`"
            >
              {{ relatedData[tab.name].count }}
            </span>
          </v-tab>
        </v-tabs>

        <v-tabs-items>
          <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
            <analysis-table
              v-show="activeTab === 'analysis'"
              :response="relatedData.analysis"
              :search-parameters="relatedData.searchParameters.analysis"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              v-on:related:add="addRelatedItem"
              v-on:related:edit="editRelatedItem"
              v-on:related:delete="deleteRelatedItem"
            />

            <preparation-table
              v-show="activeTab === 'preparation'"
              :response="relatedData.preparation"
              :search-parameters="relatedData.searchParameters.preparation"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              v-on:related:add="addRelatedItem"
              v-on:related:edit="editRelatedItem"
              v-on:related:delete="deleteRelatedItem"
            />

            <taxon-list-table
              v-show="activeTab === 'taxon_list'"
              :response="relatedData.taxon_list"
              :search-parameters="relatedData.searchParameters.taxon_list"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              v-on:related:add="addRelatedItem"
              v-on:related:edit="editRelatedItem"
              v-on:related:delete="deleteRelatedItem"
            />

            <div v-show="activeTab === 'attachment_link'">
              <file-input
                show-existing
                :files-from-object="relatedData.attachment_link.results"
                v-on:update:existing-files="addExistingFiles"
                v-on:file-uploaded="addFiles"
                accept-multiple
                :record-options="$route.meta.isEdit"
                :is-draggable="$route.meta.isEdit"
                show-attachment-link
              />
            </div>

            <sample-reference-table
              v-show="activeTab === 'sample_reference'"
              :response="relatedData.sample_reference"
              :search-parameters="relatedData.searchParameters.sample_reference"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              v-on:related:add="addRelatedItem"
              v-on:related:edit="editRelatedItem"
              v-on:related:delete="deleteRelatedItem"
            />

            <!-- PAGINATION -->
            <pagination
              v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
              class="pa-1"
              :body-active-color="bodyActiveColor"
              :count="relatedData[activeTab].count"
              :paginate-by="relatedData.searchParameters[activeTab].paginateBy"
              :options="paginateByOptionsTranslated"
              :page="relatedData.searchParameters[activeTab].page"
              v-on:update:page="
                relatedData.searchParameters[activeTab].page = $event
              "
              v-on:update:paginateBy="
                relatedData.searchParameters[activeTab].paginateBy = $event
              "
            />
          </v-card>
        </v-tabs-items>
      </v-card>
    </template>
  </sample-wrapper>
</template>

<script>
import { fetchLatestSampleInSite } from "@/assets/js/api/apiCalls";
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import SampleWrapper from "@/components/sample/SampleWrapper";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import { mapActions, mapState } from "vuex";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import DateWrapper from "@/components/partial/inputs/DateWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import AnalysisTable from "@/components/sample/relatedTables/AnalysisTable";
import requestsMixin from "@/mixins/requestsMixin";
import PreparationTable from "@/components/sample/relatedTables/PreparationTable";
import TaxonListTable from "@/components/sample/relatedTables/TaxonListTable";
import SampleReferenceTable from "@/components/sample/relatedTables/SampleReferenceTable";
import saveAsNewMixin from "@/mixins/saveAsNewMixin";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Sample",

  components: {
    Pagination,
    SampleReferenceTable,
    TaxonListTable,
    PreparationTable,
    AnalysisTable,
    FileInput,
    TextareaWrapper,
    DateWrapper,
    AutocompleteWrapper,
    InputWrapper,
    CheckboxWrapper,
    SampleWrapper,
  },

  props: {
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin,
    saveAsNewMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    if (this.$route.query.site)
      this.addSiteDataToSampleObject(JSON.parse(this.$route.query.site));
    else if (this.$route.params.site)
      this.addSiteDataToSampleObject(this.$route.params.site);
    else if (this.$route.query.storage) {
      let storage = JSON.parse(this.$route.query.storage);
      this.sample.storage = {
        id: storage.id,
        location: storage.location,
      };
      this.autocomplete.storage.push(this.sample.storage);
    }

    this.loadFullInfo();
  },

  beforeRouteLeave(to, from, next) {
    if (this.$route.meta.isEdit) {
      this.setActiveSample(this.sample);
    }
    next();
  },

  watch: {
    "relatedData.searchParameters": {
      handler: function () {
        this.loadRelatedData(this.activeTab);
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("search", ["isSampleSimpleView"]),

    isSimpleView: {
      get() {
        return this.isSampleSimpleView;
      },

      set(value) {
        this.updateIsSampleSimpleView(value);
      },
    },

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },
  },

  methods: {
    ...mapActions("search", [
      "updateActiveTab",
      "updateIsSampleSimpleView",
      "setActiveSample",
    ]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "analysis", iconClass: "far fa-chart-bar" },
          { name: "preparation", iconClass: "fas fa-vial" },
          { name: "taxon_list", iconClass: "fas fa-list" },
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "sample_reference", iconClass: "fas fa-book" },
        ],
        activeTab: "analysis",
        relatedData: this.setDefaultRelatedData(),
        simplifiedFormCopyFields: [
          "number",
          "number_field",
          "sample_purpose",
          "series",
          "locality",
          "classification_rock",
          "rock",
          "site",
          "project",
          "agent_collected",
          "date_collected",
          "owner",
          "remarks",
          "is_private",
        ],
        listOfAutocompleteTables: ["list_sample_purpose"],
        autocomplete: {
          loaders: {
            series: false,
            parent_sample: false,
            parent_specimen: false,
            locality: false,
            stratigraphy: false,
            lithostratigraphy: false,
            agent: false,
            agent_collected: false,
            rock: false,
            storage: false,
            additional_storage: false,
            owner: false,
            reference: false,
            attachment: false,
            analysis_method: false,
            fossil_group: false,
            analysis: false,
            taxon: false,
            preparation: false,
            site: false,
            project: false,
            list_sample_purpose: false,
          },
          series: [],
          list_sample_purpose: [],
          parent_sample: [],
          parent_specimen: [],
          locality: [],
          stratigraphy: [],
          lithostratigraphy: [],
          agent: [],
          agent_collected: [],
          rock: [],
          storage: [],
          storage_additional: [],
          owner: [],
          reference: [],
          attachment: [],
          analysis_method: [],
          fossil_group: [],
          analysis: [],
          taxon: [],
          preparation: [],
          sampleAnalysis: [],
          samplePreparation: [],
          site: [],
          project: [],
        },
        requiredFields: [],
        sample: {
          id: null,
          number: null,
          number_additional: null,
          number_field: null,
          series: null,
          sample_purpose: null,
          sample_type: null,
          parent_sample: null,
          parent_specimen: null,
          depth: null,
          depth_interval: null,
          stratigraphy: null,
          lithostratigraphy: null,
          stratigraphy_free: null,
          stratigraphy_bed: null,
          agent_collected: null,
          agent_collected_free: null,
          date_collected: null,
          date_collected_free: null,
          classification_rock: null,
          rock: null,
          rock_en: null,
          fossils: null,
          mass: null,
          storage: null,
          storage_additional: null,
          owner: null,
          palaeontology: null,
          analysis: null,
          locality: null,
          locality_free: null,
          remarks: null,
          is_private: null,
          site: null,
          project: null,
        },
        block: { info: true, relatedInfo: true, description: true },
      };
    },

    setDefaultRelatedData() {
      return {
        sample_reference: { count: 0, results: [] },
        attachment_link: { count: 0, results: [] },
        analysis: { count: 0, results: [] },
        preparation: { count: 0, results: [] },
        taxon_list: { count: 0, results: [] },
        searchParameters: {
          sample_reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          attachment_link: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          preparation: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_list: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    addSiteDataToSampleObject(site) {
      this.sample.locality = site.locality;
      if (typeof site.id !== "undefined" && site.id !== null) {
        this.sample.site = { id: site.id, name: site.name };
        this.autocomplete.site.push(this.sample.site);
      }
      this.sample.agent_collected = {
        id: this.getCurrentAgent.id,
        agent: this.getCurrentAgent.user,
      };
      this.autocomplete.agent.push(this.sample.agent_collected);
      this.sample.date_collected = this.getCurrentFormattedDate("YYYY-MM-DD");
      this.sample.owner = {
        id: this.getCurrentAgent.id,
        agent: this.getCurrentAgent.user,
      };
      this.autocomplete.agent.push(this.sample.owner);

      fetchLatestSampleInSite(site.id).then((response) => {
        let sample = this.handleResponse(response)[0];
        if (sample) {
          this.sample.number = this.calculateNextName(sample.number);
          this.sample.number_field = this.calculateNextName(
            sample.number_field
          );
        }
      });
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "sample", singleFileMetadata);
    },

    addExistingFiles(files) {
      // this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    },
  },
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
