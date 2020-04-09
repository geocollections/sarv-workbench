<template>
  <sample-wrapper :simple-view="isSimpleView">
    <template v-slot:switch>
      <v-row>
        <v-col>
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
        </v-col>

        <v-col class="text-right">
          <v-btn
            dark
            :color="bodyActiveColor"
            :to="{
              name: 'Analysis add',
              params: { sample: { id: sample.number, number: sample.number } }
            }"
          >
            <v-icon left small>fas fa-chart-pie</v-icon>
            {{ $t("sample.addAnalysis") }}
          </v-btn>
        </v-col>
      </v-row>
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
                  :items="autocomplete.purpose"
                  :loading="autocomplete.loaders.purpose"
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

            <!-- LOCALITY FREE and SITE  -->
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pa-1">
                <input-wrapper
                  v-model="sample.locality_free"
                  :color="bodyActiveColor"
                  :label="$t('sample.locality_free')"
                />
              </v-col>

              <v-col cols="12" md="6" class="pa-1">
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
                  v-on:search:items="autocompleteStratigraphySearch"
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
                  :items="autocomplete.purpose"
                  :loading="autocomplete.loaders.purpose"
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
                  v-on:search:items="autocompleteStratigraphySearch"
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

            <!-- AGENT_COLLECTED, DATE_COLLECTED and SITE -->
            <v-row no-gutters>
              <v-col cols="12" md="4" class="pa-1">
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

              <v-col cols="12" md="4" class="pa-1">
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
            <sample-analysis-table
              v-show="activeTab === 'analysis'"
              :response="relatedData.analysis"
              :search-parameters="relatedData.searchParameters.analysis"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              v-on:related:add="addRelatedItem"
              v-on:related:edit="editRelatedItem"
              v-on:related:delete="deleteRelatedItem"
            />

            <sample-preparation-table
              v-show="activeTab === 'preparation'"
              :response="relatedData.preparation"
              :search-parameters="relatedData.searchParameters.preparation"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              v-on:related:add="addRelatedItem"
              v-on:related:edit="editRelatedItem"
              v-on:related:delete="deleteRelatedItem"
            />

            <sample-taxon-list-table
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
              <file-upload
                show-existing
                :files-from-object="relatedData.attachment_link.results"
                v-on:update:existing-files="addExistingFiles"
                v-on:file-uploaded="addFiles"
                accept-multiple
                :record-options="$route.meta.isEdit"
                :is-draggable="$route.meta.isEdit"
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
            <div
              v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
              class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none pa-1 mt-2"
            >
              <div class="mr-3 mb-3">
                <v-select
                  v-model="relatedData.searchParameters[activeTab].paginateBy"
                  :color="bodyActiveColor"
                  dense
                  :items="paginateByOptionsTranslated"
                  :item-color="bodyActiveColor"
                  label="Paginate by"
                  hide-details
                />
              </div>

              <div>
                <v-pagination
                  v-model="relatedData.searchParameters[activeTab].page"
                  :color="bodyActiveColor"
                  circle
                  prev-icon="fas fa-angle-left"
                  next-icon="fas fa-angle-right"
                  :length="
                    Math.ceil(
                      relatedData[activeTab].count /
                        relatedData.searchParameters[activeTab].paginateBy
                    )
                  "
                  :total-visible="5"
                />
              </div>
            </div>
          </v-card>
        </v-tabs-items>
      </v-card>
    </template>
  </sample-wrapper>
</template>

<script>
import {
  fetchSample,
  fetchSamplePurpose,
  fetchLSampleAttachment,
  fetchSampleReference,
  fetchSampleAnalysis,
  fetchSamplePreparation,
  fetchTaxonList,
  fetchLatestSampleInSite
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import SampleWrapper from "./SampleWrapper";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import DateWrapper from "../partial/inputs/DateWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import FileUpload from "../partial/inputs/FileInput";
import SampleAnalysisTable from "./relatedTables/SampleAnalysisTable";
import requestsMixin from "../../mixins/requestsMixin";
import SamplePreparationTable from "./relatedTables/SamplePreparationTable";
import SampleTaxonListTable from "./relatedTables/SamplesTaxonListTable";
import SampleReferenceTable from "./relatedTables/SampleReferenceTable";

export default {
  name: "Sample",

  components: {
    SampleReferenceTable,
    SampleTaxonListTable,
    SamplePreparationTable,
    SampleAnalysisTable,
    FileUpload,
    TextareaWrapper,
    DateWrapper,
    AutocompleteWrapper,
    InputWrapper,
    CheckboxWrapper,
    SampleWrapper
  },

  props: {
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      const searchHistory = this.$localStorage.get(
        this.searchHistory,
        "fallbackValue"
      );
      let params =
        this.isNotEmpty(searchHistory) && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "sampleSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_SAMPLES",
        title: "header.samples",
        object: "sample",
        field: "number",
        agent: this.currentUser,
        databaseId: this.databaseId,
        block: this.block
      });
    }

    // SIMPLE VIEW
    this.isSimpleView = this.$localStorage.get("sampleView", false);

    if (this.$route.query.site)
      this.addSiteDataToSampleObject(JSON.parse(this.$route.query.site));
    else if (this.$route.params.site)
      this.addSiteDataToSampleObject(this.$route.params.site);

    this.loadFullInfo();
  },

  beforeDestroy() {
    this.$root.$off(
      "add-new-sample-from-modal",
      this.handleUserChoiceFromModal
    );
  },

  beforeRouteUpdate(to, from, next) {
    this.$localStorage.set("sampleView", this.isSimpleView);
    next();
  },

  beforeRouteLeave(to, from, next) {
    this.$localStorage.set("sampleView", this.isSimpleView);
    if (this.$route.meta.isEdit) {
      this.$store.dispatch("setActiveSample", this.sample);
    }
    next();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
        this.isSimpleView = this.$localStorage.get("sampleView", false);
      },
      deep: true
    },
    "relatedData.searchParameters": {
      handler: function() {
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["currentUser", "databaseId"]),

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  },

  methods: {
    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object
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
          { name: "sample_reference", iconClass: "fas fa-book" }
        ],
        searchHistory: "sampleSearchHistory",
        activeTab: "analysis",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "number",
          "number_additional",
          "number_field",
          "series",
          "sample_purpose",
          "sample_type",
          "parent_sample",
          "parent_specimen",
          "depth",
          "depth_interval",
          "stratigraphy",
          "lithostratigraphy",
          "stratigraphy_free",
          "stratigraphy_bed",
          "agent_collected",
          "agent_collected_free",
          "date_collected",
          "date_collected_free",
          "classification_rock",
          "rock",
          "rock_en",
          "fossils",
          "mass",
          "storage",
          "storage_additional",
          "owner",
          "palaeontology",
          "analysis",
          "locality",
          "locality_free",
          "remarks",
          "is_private",
          "site"
        ],
        simplifiedFormCopyFields: [
          "number",
          "number_field",
          "sample_purpose",
          "series",
          "locality",
          "classification_rock",
          "rock",
          "site",
          "agent_collected",
          "date_collected",
          "owner",
          "remarks",
          "is_private"
        ],
        autocomplete: {
          loaders: {
            series: false,
            sample: false,
            specimen: false,
            locality: false,
            stratigraphy: false,
            lithostratigraphy: false,
            agent: false,
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
            purpose: false
          },
          series: [],
          purpose: [],
          sample: [],
          specimen: [],
          locality: [],
          stratigraphy: [],
          lithostratigraphy: [],
          agent: [],
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
          site: []
        },
        requiredFields: [],
        sample: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: { info: true, relatedInfo: true, description: true },
        isSimpleView: false,
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ]
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        this.$emit("set-object", "sample");

        fetchSample(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "sample", this.handleResponse(response)[0]);
            // this.sample = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.sample);

            this.removeUnnecessaryFields(this.sample, this.copyFields);
            this.$emit("data-loaded", this.sample);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => {
          this.loadRelatedData(tab.name);
        });

        this.$on("tab-changed", this.setTab);
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }

      if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
      else this.setTab("analysis");
    },

    loadAutocompleteFields() {
      fetchSamplePurpose().then(
        response => (this.autocomplete.purpose = this.handleResponse(response))
      );
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
            sortDesc: [true]
          },
          attachment_link: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          preparation: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_list: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.latitude1))
        uploadableObject.latitude1 = objectToUpload.latitude1.toFixed(6);
      else uploadableObject.latitude1 = null;
      if (this.isNotEmpty(objectToUpload.longitude1))
        uploadableObject.longitude1 = objectToUpload.longitude1.toFixed(6);
      else uploadableObject.longitude1 = null;
      if (this.isNotEmpty(objectToUpload.depth))
        uploadableObject.depth = parseFloat(objectToUpload.depth);
      else uploadableObject.depth = null;
      if (this.isNotEmpty(objectToUpload.depth_interval))
        uploadableObject.depth_interval = parseFloat(
          objectToUpload.depth_interval
        );
      else uploadableObject.depth_interval = null;

      Object.keys(uploadableObject).forEach(key => {
        if (
          typeof uploadableObject[key] === "object" &&
          uploadableObject[key] !== null
        ) {
          uploadableObject[key] = uploadableObject[key].id
            ? uploadableObject[key].id
            : null;
        } else if (typeof uploadableObject[key] === "undefined") {
          uploadableObject[key] = null;
        }
      });

      // Adding related data only on add view
      uploadableObject.related_data = {};
      if (!this.$route.meta.isEdit) {
        if (this.isNotEmpty(this.databaseId))
          uploadableObject.database = this.databaseId;

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            if (tab.name === "attachment_link") {
              uploadableObject.related_data.attachment = this.relatedData.attachment_link.results;
            } else {
              uploadableObject.related_data[tab.name] = this.relatedData[
                tab.name
              ].results;
            }
        });
      } else {
        if (this.relatedData.attachment_link.results.length > 0) {
          uploadableObject.related_data.attachment = this.relatedData.attachment_link.results;
        } else uploadableObject.related_data.attachment = null;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.series_id)) {
        this.sample.series = { name: obj.series__name, id: obj.series_id };
        this.autocomplete.series.push(this.sample.series);
      }
      this.sample.sample_purpose = {
        value: obj.sample_purpose__value,
        value_en: obj.sample_purpose__value_en,
        id: obj.sample_purpose__id
      };
      if (this.isNotEmpty(obj.parent_sample)) {
        this.sample.parent_sample = {
          number: obj.parent_sample__number,
          id: obj.parent_sample
        };
        this.autocomplete.sample.push(this.sample.parent_sample);
      }
      if (this.isNotEmpty(obj.parent_specimen)) {
        this.sample.parent_specimen = {
          specimen_id: obj.parent_specimen__specimen_id,
          id: obj.parent_specimen
        };
        this.autocomplete.specimen.push(this.sample.parent_specimen);
      }
      if (this.isNotEmpty(obj.locality__id)) {
        this.sample.locality = {
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en,
          id: obj.locality__id
        };
        this.autocomplete.locality.push(this.sample.locality);
      }
      if (this.isNotEmpty(obj.stratigraphy__id)) {
        this.sample.stratigraphy = {
          stratigraphy: obj.stratigraphy__stratigraphy,
          stratigraphy_en: obj.stratigraphy__stratigraphy_en,
          id: obj.stratigraphy__id
        };
        this.autocomplete.stratigraphy.push(this.sample.stratigraphy);
      }
      if (this.isNotEmpty(obj.lithostratigraphy_id)) {
        this.sample.lithostratigraphy = {
          stratigraphy: obj.lithostratigraphy__stratigraphy,
          stratigraphy_en: obj.lithostratigraphy__stratigraphy_en,
          id: obj.lithostratigraphy_id
        };
        this.autocomplete.lithostratigraphy.push(this.sample.lithostratigraphy);
      }
      if (this.isNotEmpty(obj.agent_collected__id)) {
        this.sample.agent_collected = {
          agent: obj.agent_collected__agent,
          id: obj.agent_collected__id
        };
        this.autocomplete.agent.push(this.sample.agent_collected);
      }
      if (this.isNotEmpty(obj.classification_rock__id)) {
        this.sample.classification_rock = {
          name: obj.classification_rock__name,
          name_en: obj.classification_rock__name_en,
          id: obj.classification_rock__id
        };
        this.autocomplete.rock.push(this.sample.classification_rock);
      }
      if (this.isNotEmpty(obj.owner__id)) {
        this.sample.owner = { agent: obj.owner__agent, id: obj.owner__id };
        this.autocomplete.agent.push(this.sample.owner);
      }
      if (this.isNotEmpty(obj.storage)) {
        this.sample.storage = {
          location: obj.storage__location,
          id: obj.storage
        };
        this.autocomplete.storage.push(this.sample.storage);
      }
      if (this.isNotEmpty(obj.storage_additional)) {
        this.sample.storage_additional = {
          location: obj.storage_additional__location,
          id: obj.storage_additional
        };
        this.autocomplete.storage_additional.push(
          this.sample.storage_additional
        );
      }
      if (this.isNotEmpty(obj.site)) {
        this.sample.site = { id: obj.site, name: obj.site__name };
        this.autocomplete.site.push(this.sample.site);
      }
    },

    loadRelatedData(object) {
      let query;

      if (object === "analysis") {
        query = fetchSampleAnalysis(
          this.$route.params.id,
          this.relatedData.searchParameters.analysis
        );
      } else if (object === "preparation") {
        query = fetchSamplePreparation(
          this.$route.params.id,
          this.relatedData.searchParameters.preparation
        );
      } else if (object === "taxon_list") {
        query = fetchTaxonList(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_list
        );
      } else if (object === "sample_reference") {
        query = fetchSampleReference(
          this.$route.params.id,
          this.relatedData.searchParameters.sample_reference
        );
      } else if (object === "attachment_link") {
        query = fetchLSampleAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      }
      query.then(response => {
        this.relatedData[object].results = this.handleResponse(response);
        this.relatedData[object].count = response.data.count;
      });
    },

    setDefaultSearchParameters() {
      return {
        locality: null,
        number: null,
        depth: null,
        stratigraphy: null,
        agent: null,
        storage: null,
        site: null,
        selectionId: null,
        selection: null,
        id: null,
        loan: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    siteLabel(option) {
      console.log(option)
      return `id: ${option.id} - ${option.name}`;
    },

    addSiteDataToSampleObject(site) {
      this.sample.locality = site.locality;
      if (typeof site.id !== "undefined" && site.id !== null) {
        this.sample.site = { id: site.id, name: site.name };
        this.autocomplete.site.push(this.sample.site);
      }
      this.sample.agent_collected = {
        id: this.currentUser.id,
        agent: this.currentUser.user
      };
      this.autocomplete.agent.push(this.sample.agent_collected);
      this.sample.date_collected = this.getCurrentFormattedDate("YYYY-MM-DD");
      this.sample.owner = {
        id: this.currentUser.id,
        agent: this.currentUser.user
      };
      this.autocomplete.agent.push(this.sample.owner);

      fetchLatestSampleInSite(site.id).then(response => {
        let sample = this.handleResponse(response)[0];
        if (sample) {
          this.sample.number = this.calculateNextName(sample.number);
          this.sample.number_field = this.calculateNextName(
            sample.number_field
          );
        }
      });
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "sample");
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    }
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
