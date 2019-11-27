<template>
  <div class="doi">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

    <!-- REQUIRED INFO -->
    <v-card
      class="mt-2"
      id="block-requiredFields"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.requiredFields = !block.requiredFields"
        >
          <span :class="validate('doi') ? 'green--text' : 'red--text'">{{
            $t("doi.requiredFields")
          }}</span>
          <v-icon right :class="validate('doi') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.requiredFields = !block.requiredFields"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.requiredFields ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.requiredFields" class="px-1 pt-1 pb-2">
          <!-- DOI, RESOURCE TYPE and RESOURCE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`identifier`">{{ $t("doi.identifier") }}:</label>
              <b-form-input
                size="sm"
                id="identifier"
                v-model="doi.identifier"
                type="text"
                :placeholder="
                  $route.meta.isEdit ? '' : $t('doi.identifierPlaceholder')
                "
                :disabled="true"
              ></b-form-input>
            </v-col>

            <!-- TODO: Find a way to change vue-multiselect size like b-form-input size -->
            <v-col cols="12" md="4" class="px-1">
              <label :for="`resource_type`"
                >{{ $t("doi.resourceTypeGeneral") }}:</label
              >
              <vue-multiselect
                v-model="doi.resource_type"
                id="resource_type"
                :options="autocomplete.resource_type"
                track-by="id"
                label="value"
                :class="isNotEmpty(doi.resource_type) ? 'valid' : 'invalid'"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`resource`">{{ $t("doi.resource") }}:</label>
              <b-form-input
                size="sm"
                id="resource"
                :state="isNotEmpty(doi.resource)"
                v-model="doi.resource"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- CREATORS, YEAR and PUBLISHER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <div class="d-flex">
                <div class="flex-fill">
                  <label :for="`creators`">{{ $t("doi.creators") }}:</label>
                  <b-form-input
                    size="sm"
                    id="creators"
                    :state="isNotEmpty(doi.creators)"
                    v-model="doi.creators"
                    type="text"
                  ></b-form-input>
                </div>

                <div
                  class="align-self-end pl-2"
                  v-if="!this.$route.meta.isEdit && isNotEmpty(doi.creators)"
                >
                  <v-btn
                    icon
                    :color="bodyActiveColor"
                    @click="addCreatorsToRelatedData"
                    :title="$t('doi.addCreators')">
                    <v-icon small>fas fa-user-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`publication_year`">{{ $t("doi.year") }}:</label>
              <b-form-input
                size="sm"
                id="publication_year"
                :state="isNotEmpty(doi.publication_year)"
                v-model="doi.publication_year"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`publisher`">{{ $t("doi.publisher") }}:</label>
              <b-form-input
                size="sm"
                id="publisher"
                :state="isNotEmpty(doi.publisher)"
                v-model="doi.publisher"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`title`">{{ $t("doi.title") }}:</label>
              <b-form-input
                size="sm"
                id="title"
                :state="isNotEmpty(doi.title)"
                v-model="doi.title"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("doi.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- TITLE ALTERNATIVE -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`title_alternative`"
                >{{ $t("doi.title_alternative") }}:</label
              >
              <b-form-input
                size="sm"
                id="title_alternative"
                v-model="doi.title_alternative"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- TITLE TRANSLATED and TITLE TRANSLATED LANGUAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`title_translated`"
                >{{ $t("doi.title_translated") }}:</label
              >
              <b-form-input
                size="sm"
                id="title_translated"
                v-model="doi.title_translated"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`title_translated_language`"
                >{{ $t("doi.title_translated_language") }}:</label
              >
              <vue-multiselect
                v-model="doi.title_translated_language"
                id="title_translated_language"
                :options="autocomplete.language"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{
                    $i18n.locale === "ee" ? option.value : option.value_en
                  }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- LANGUAGE, VERSION, FORMATS and SIZES -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`language`">{{ $t("doi.language") }}:</label>
              <vue-multiselect
                v-model="doi.language"
                id="language"
                :options="autocomplete.language"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`version`">{{ $t("doi.version") }}:</label>
              <b-form-input
                size="sm"
                id="version"
                v-model="doi.version"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`formats`">{{ $t("doi.formats") }}:</label>
              <b-form-input
                size="sm"
                id="formats"
                v-model="doi.formats"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`sizes`">{{ $t("doi.sizes") }}:</label>
              <b-form-input
                size="sm"
                id="sizes"
                v-model="doi.sizes"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- SUBJECTS and OWNER (agent)-->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`subjects`">{{ $t("doi.subjects") }}:</label>
              <b-form-input
                size="sm"
                id="subjects"
                v-model="doi.subjects"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`agent`">{{ $t("doi.copyright_agent") }}:</label>
              <vue-multiselect
                id="agent"
                v-model="doi.owner"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.agent"
                :options="autocomplete.agent"
                @search-change="autocompleteAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- ABSTRACT -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`abstract`">{{ $t("doi.abstract") }}:</label>
              <b-form-textarea
                id="abstract"
                v-model="doi.abstract"
                type="text"
                :rows="1"
                :max-rows="20"
                size="sm"
              ></b-form-textarea>
            </v-col>
          </v-row>

          <!-- METHODS -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`methods`">{{ $t("doi.methods") }}:</label>
              <b-form-textarea
                id="methods"
                v-model="doi.methods"
                type="text"
                :rows="1"
                :max-rows="20"
                size="sm"
              ></b-form-textarea>
            </v-col>
          </v-row>

          <!-- COPYRIGHT_AGENT (copyright) and LICENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`copyright_agent`">{{ $t("doi.copyright") }}:</label>
              <vue-multiselect
                id="copyright_agent"
                v-model="doi.copyright_agent"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.copyright_agent"
                :options="autocomplete.copyright_agent"
                @search-change="autocompleteCopyrightAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`licence`">{{ $t("doi.licence") }}:</label>
              <vue-multiselect
                v-model="doi.licence"
                id="licence"
                :options="autocomplete.licence"
                track-by="id"
                :label="licenceLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[licenceLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REFERENCE and DATASET -->
    <v-card
      class="mt-2"
      id="block-referenceAndDataset"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.referenceAndDataset = !block.referenceAndDataset"
        >
          <span>{{ $t("doi.primaryRefAndDat") }}</span>
          <v-icon right>fas fa-book</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.referenceAndDataset = !block.referenceAndDataset"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.referenceAndDataset ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.referenceAndDataset" class="px-1 pt-1 pb-2">
          <!-- REFERENCE and DATASET -->
          <v-row no-gutters>
            <v-col cols="11" md="5" class="px-1">
              <vue-multiselect
                v-model="relatedData.reference"
                id="reference"
                track-by="id"
                :options="autocomplete.reference"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :close-on-select="true"
                @search-change="autocompleteDoiReferenceSearch"
                :custom-label="customLabelForReference"
                :loading="autocomplete.loaders.reference"
                placeholder="reference search..."
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong
                    >{{ option.id + " - (" + option.reference + ")" }}
                  </strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="1" class="px-1">
              <v-btn
                v-if="relatedData.reference !== null"
                icon
                @click="
                  windowOpenNewTab(
                    'reference',
                    '/reference/' + relatedData.reference.id
                  )
                "
                :color="bodyActiveColor"
              >
                <v-icon>fas fa-link</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="11" md="5" class="px-1">
              <vue-multiselect
                v-model="relatedData.dataset"
                id="dataset"
                track-by="id"
                :options="autocomplete.dataset"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :close-on-select="true"
                @search-change="autocompleteDatasetSearch"
                :custom-label="customLabelForDataset"
                :loading="autocomplete.loaders.dataset"
                placeholder="dataset search..."
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.id }} - (</strong>
                  <strong
                    v-translate="{ et: option.name, en: option.name_en }"
                  ></strong>
                  <strong>) </strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="1" class="px-1">
              <v-btn
                v-if="relatedData.dataset !== null"
                icon
                @click="
                  openGeoInNewWindow({
                    object: 'dataset',
                    id: relatedData.dataset.id
                  })
                "
                :color="bodyActiveColor"
              >
                <v-icon>fas fa-link</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
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
          <span>{{ $t("doi.remarks") }}</span>
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
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("doi.remarks") }}:</label>
              <b-form-textarea
                id="remarks"
                v-model="doi.remarks"
                type="text"
                :rows="1"
                :max-rows="20"
                size="sm"
              ></b-form-textarea>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SHOWING RELATED_DATA -->
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
          <span>{{ $t("doi.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].length > 0"
            class="font-weight-bold ml-2"
          >
            {{ relatedData[tab.name].length }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pt-3 px-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <doi-files
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <doi-related-identifier
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <doi-geolocation
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <doi-agent
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <doi-date
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData.count[activeTab] > 0"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none px-1"
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
                    relatedData.count[activeTab] /
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

    <!-- DATACITE CREATED and UPDATED -->
    <v-card
      class="mt-2"
      id="block-datacite"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
      v-if="$route.meta.isEdit"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.datacite = !block.datacite"
        >
          <span>{{ $t("doi.datacite") }}</span>
          <v-icon right>fas fa-sitemap</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.datacite = !block.datacite"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.datacite ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.datacite" class="px-1 pt-1 pb-2">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="mt-0" :for="`datacite_created`"
                >{{ $t("doi.dataciteCreated") }}:</label
              >
              <b-form-input
                size="sm"
                v-if="doi.datacite_created"
                id="datacite_created"
                :value="
                  doi.datacite_created | moment('ddd, MMM Do YYYY, HH:mm:ss')
                "
                type="text"
                disabled
              ></b-form-input>
              <b-form-input
                size="sm"
                v-else
                v-model="doi.datacite_created"
                type="text"
                disabled
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="mt-0" :for="`datacite_updated`"
                >{{ $t("doi.dataciteUpdated") }}:</label
              >
              <b-form-input
                size="sm"
                v-if="doi.datacite_updated"
                id="datacite_updated"
                :value="
                  doi.datacite_updated | moment('ddd, MMM Do YYYY, HH:mm:ss')
                "
                type="text"
                disabled
              ></b-form-input>
              <b-form-input
                size="sm"
                v-else
                v-model="doi.datacite_updated"
                type="text"
                disabled
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <v-checkbox
          v-model="doi.is_private"
          id="is_private"
          :label="$t('doi.private')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-col>
    </v-row>

    <!-- DOI METADATA REGISTER and UPDATE BUTTONS -->
    <div class="row mt-3">
      <div class="col">
        <v-btn
          v-if="$route.meta.isEdit && showMetadataButton && validate('doi')"
          class="mr-2 mb-2 text-none"
          :disabled="sendingData"
          @click="registerMetadata"
          :color="bodyActiveColor"
          :dark="isBodyActiveColorDark"
          :title="
            showMetadataUpdateMessage
              ? $t('edit.buttons.updateMetadata')
              : $t('edit.buttons.registerMetadata')
          "
        >
          <v-icon left>fas fa-server</v-icon>
          {{
            showMetadataUpdateMessage
              ? $t("edit.buttons.updateMetadata")
              : $t("edit.buttons.registerMetadata")
          }}
        </v-btn>

        <v-btn
          v-if="$route.meta.isEdit && showDoiUrlButton && validate('doi')"
          class="mr-2 mb-2 text-none"
          :disabled="sendingData"
          @click="registerDoiUrl"
          :color="bodyActiveColor"
          :dark="isBodyActiveColorDark"
          :title="
            showDoiUrlUpdateMessage
              ? $t('edit.buttons.updateUrl')
              : $t('edit.buttons.registerUrl')
          "
        >
          <v-icon left>fas fa-server</v-icon>
          {{
            showDoiUrlUpdateMessage
              ? $t("edit.buttons.updateUrl")
              : $t("edit.buttons.registerUrl")
          }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchDoi,
  fetchDoiResourceType,
  fetchListLanguages,
  fetchListLicences,
  fetchDoiAttachment,
  fetchDoiAgent,
  fetchDoiAgentType,
  fetchDoiRelatedIdentifier,
  fetchDoiGeolocation,
  fetchDoiDate,
  fetchDoiRelatedIdentifierType,
  fetchDoiRelationType,
  fetchDoiDateType,
  fetchCheckMetadataInDataCite,
  fetchCheckDoiUrlInDataCite,
  fetchRegisterMetadataToDataCite,
  fetchRegisterDoiUrlToDataCite,
  fetchDoiUsingEGF,
  fetchAgentUsingName
} from "../../assets/js/api/apiCalls";
import DoiAgent from "./relatedTables/DoiAgent";
import DoiFiles from "./relatedTables/DoiFiles";
import DoiRelatedIdentifier from "./relatedTables/DoiRelatedIdentifier";
import DoiGeolocation from "./relatedTables/DoiGeolocation";
import DoiDate from "./relatedTables/DoiDate";
import {
  toastSuccess,
  toastError,
  toastInfo
} from "../../assets/js/iziToast/iziToast";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";

export default {
  components: {
    DoiDate,
    DoiGeolocation,
    DoiRelatedIdentifier,
    DoiFiles,
    DoiAgent,
    Spinner
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
    },
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

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

  name: "Doi",

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
        searchHistory: "doiSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_DOIS",
        title: "header.dois",
        object: "doi",
        field: "title",
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
      }
    },
    "relatedData.searchParameters": {
      handler: function() {
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["databaseId"]),

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
          { name: "doi_agent", iconClass: "fas fa-user-friends" },
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "doi_geolocation", iconClass: "fas fa-globe-americas" },
          {
            name: "doi_related_identifier",
            iconClass: "fas fa-project-diagram"
          },
          { name: "doi_date", iconClass: "far fa-calendar-alt" }
        ],
        searchHistory: "doiSearchHistory",
        activeTab: "doi_agent",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "identifier",
          "creators",
          "publisher",
          "publication_year",
          "title",
          "title_alternative",
          "title_translated",
          "title_translated_language",
          "abstract",
          "resource_type",
          "resource",
          "methods",
          "version",
          "sizes",
          "formats",
          "language",
          "subjects",
          "copyright_agent",
          "licence",
          "remarks",
          "owner",
          "is_private",
          "datacite_created",
          "datacite_updated"
        ],
        autocomplete: {
          loaders: {
            resource_type: false,
            agent: false,
            language: false,
            copyright_agent: false,
            licence: false,
            reference: false,
            dataset: false,
            doi_agent_type: false,
            doi_related_identifier_type: false,
            doi_relation_type: false,
            doi_agent: false,
            locality: false,
            doi_date_type: false,
            attachment_public: false
          },
          resource_type: [],
          agent: [],
          language: [],
          copyright_agent: [],
          licence: [],
          reference: [],
          dataset: [],
          doi_agent_type: [],
          doi_related_identifier_type: [],
          doi_relation_type: [],
          doi_agent: [],
          locality: [],
          doi_date_type: [],
          attachment: []
        },
        requiredFields: [
          "resource_type",
          "resource",
          "creators",
          "publication_year",
          "publisher",
          "title"
        ],
        doi: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          requiredFields: true,
          info: true,
          referenceAndDataset: false,
          description: true,
          datacite: true
        },
        showMetadataButton: false,
        showDoiUrlButton: false,
        showMetadataUpdateMessage: false,
        showDoiUrlUpdateMessage: false,
        sarvXML: null,
        dataciteXML: null,
        doiURL: null,
        dataciteURL: null,
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
      this.loadAutocompleteFields(true, true);

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "doi");

        fetchDoi(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.doi = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.doi);

            // Loading REFERENCE and DATASET here because they don't need api request
            this.loadRelatedData("reference", this.doi);
            this.loadRelatedData("dataset", this.doi);

            this.removeUnnecessaryFields(this.doi, this.copyFields);
            this.$emit("data-loaded", this.doi);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        this.checkMetadata();
        this.checkDoiUrl();

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => {
          this.loadRelatedData(tab.name);
        });

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(tab => tab.name)
        );
      } else if (this.$route.meta.isEGF && !this.$route.meta.isEdit) {
        fetchDoiUsingEGF(this.$route.params.id).then(response => {
          if (response) this.assignEgfFieldsToDoiObject(response);
          else
            toastError({
              text: `Couldn't fetch <b>Fond</b> with an ID: <b>${this.$route.params.id}</b>`
            });
        });
      }

      if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
      else this.setTab("doi_agent");
    },

    // TODO: Optimization possible, i.e., fetch requests only if user has clicked certain related data TAB.
    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchDoiResourceType().then(
          response =>
            (this.autocomplete.resource_type = this.handleResponse(response))
        );
        fetchListLanguages().then(
          response =>
            (this.autocomplete.language = this.handleResponse(response))
        );
        fetchListLicences().then(
          response =>
            (this.autocomplete.licence = this.handleResponse(response))
        );
      }

      if (relatedDataAutocompleteFields) {
        fetchDoiAgentType().then(
          response =>
            (this.autocomplete.doi_agent_type = this.handleResponse(response))
        );
        fetchDoiRelatedIdentifierType().then(
          response =>
            (this.autocomplete.doi_related_identifier_type = this.handleResponse(
              response
            ))
        );
        fetchDoiRelationType().then(
          response =>
            (this.autocomplete.doi_relation_type = this.handleResponse(
              response
            ))
        );
        fetchDoiDateType().then(
          response =>
            (this.autocomplete.doi_date_type = this.handleResponse(response))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        reference: null,
        dataset: null,
        attachment_link: [],
        doi_agent: [],
        doi_related_identifier: [],
        doi_geolocation: [],
        doi_date: [],
        new: {
          attachment: [],
          agent_type: [],
          identifier_type: [],
          relation_type: [],
          locality: [],
          date_type: []
        },
        copyFields: {
          attachment_link: ["attachment", "remarks"],
          doi_related_identifier: [
            "identifier_type",
            "relation_type",
            "value",
            "remarks"
          ],
          doi_geolocation: [
            "locality",
            "place",
            "point_longitude",
            "point_latitude",
            "polygon"
          ],
          doi_agent: ["name", "affiliation", "agent_type", "orcid", "agent"],
          doi_date: ["date", "date_type", "remarks"]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          doi_related_identifier: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          doi_geolocation: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          doi_agent: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          doi_date: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          reference: 0,
          dataset: 0,
          attachment_link: 0,
          doi_related_identifier: 0,
          doi_geolocation: 0,
          doi_agent: 0,
          doi_date: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        attachment_link: {},
        doi_related_identifier: {},
        doi_geolocation: {},
        doi_agent: {
          agent_type: {
            id: 1,
            value: "Creator"
          }
        },
        doi_date: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.resource_type))
        uploadableObject.resource_type = objectToUpload.resource_type.id;
      if (this.isNotEmpty(objectToUpload.title_translated_language))
        uploadableObject.title_translated_language =
          objectToUpload.title_translated_language.id;
      if (this.isNotEmpty(objectToUpload.owner))
        uploadableObject.owner = objectToUpload.owner.id;
      if (this.isNotEmpty(objectToUpload.language))
        uploadableObject.language = objectToUpload.language.id;
      if (this.isNotEmpty(objectToUpload.copyright_agent))
        uploadableObject.copyright_agent = objectToUpload.copyright_agent.id;
      if (this.isNotEmpty(objectToUpload.licence))
        uploadableObject.licence = objectToUpload.licence.id;
      if (this.isNotEmpty(this.relatedData.reference))
        uploadableObject.reference = this.relatedData.reference.id;
      if (this.isNotEmpty(this.relatedData.dataset))
        uploadableObject.dataset = this.relatedData.dataset.id;

      if (this.databaseId) uploadableObject.database = this.databaseId;

      if (this.$route.meta.isEGF) uploadableObject.egf = this.$route.params.id;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        if (this.isNotEmpty(this.relatedData.doi_agent)) {
          let clonedData = cloneDeep(this.relatedData.doi_agent);
          uploadableObject.related_data.doi_agent = clonedData
            .filter(entity => this.isNotEmpty(entity.name))
            .map(entity => {
              return {
                affiliation: entity.affiliation ? entity.affiliation : null,
                agent: entity.agent ? entity.agent : null,
                agent_type: entity.agent_type ? entity.agent_type : null,
                name: entity.name,
                orcid: entity.orcid ? entity.orcid : null
              };
            });
          if (uploadableObject.related_data.doi_agent.length === 0)
            uploadableObject.related_data.doi_agent = null;
        } else uploadableObject.related_data.doi_agent = null;

        if (this.isNotEmpty(this.relatedData.attachment_link)) {
          let clonedData = cloneDeep(this.relatedData.attachment_link);
          uploadableObject.related_data.attachment = clonedData
            .filter(entity => this.isNotEmpty(entity.attachment))
            .map(entity => {
              return {
                id: entity.attachment,
                remarks: entity.remarks ? entity.remarks : null
              };
            });
          if (uploadableObject.related_data.attachment.length === 0)
            uploadableObject.related_data.attachment = null;
        } else uploadableObject.related_data.attachment = null;

        if (this.isNotEmpty(this.relatedData.doi_geolocation)) {
          let clonedData = cloneDeep(this.relatedData.doi_geolocation);
          uploadableObject.related_data.doi_geolocation = clonedData
            // .filter(entity => this.isNotEmpty(entity.locality))
            .map(entity => {
              return {
                polygon: entity.polygon ? entity.polygon : null,
                locality: entity.locality ? entity.locality : null,
                place: entity.place ? entity.place : null,
                point_latitude: entity.point_latitude
                  ? entity.point_latitude
                  : null,
                point_longitude: entity.point_longitude
                  ? entity.point_longitude
                  : null
              };
            });
          if (uploadableObject.related_data.doi_geolocation.length === 0)
            uploadableObject.related_data.doi_geolocation = null;
        } else uploadableObject.related_data.doi_geolocation = null;

        if (this.isNotEmpty(this.relatedData.doi_related_identifier)) {
          let clonedData = cloneDeep(this.relatedData.doi_related_identifier);
          uploadableObject.related_data.doi_related_identifier = clonedData
            .filter(entity => this.isNotEmpty(entity.identifier_type))
            .map(entity => {
              return {
                identifier_type: entity.identifier_type,
                relation_type: entity.relation_type
                  ? entity.relation_type
                  : null,
                remarks: entity.remarks ? entity.remarks : null,
                value: entity.value ? entity.value : null
              };
            });
          if (uploadableObject.related_data.doi_related_identifier.length === 0)
            uploadableObject.related_data.doi_related_identifier = null;
        } else uploadableObject.related_data.doi_related_identifier = null;

        if (this.isNotEmpty(this.relatedData.doi_date)) {
          let clonedData = cloneDeep(this.relatedData.doi_date);
          uploadableObject.related_data.doi_date = clonedData
            // .filter(entity => this.isNotEmpty(entity.date))
            .map(entity => {
              return {
                date: entity.date,
                date_type: entity.date_type ? entity.date_type : null,
                remarks: entity.remarks ? entity.remarks : null
              };
            });
          if (uploadableObject.related_data.doi_date.length === 0)
            uploadableObject.related_data.doi_date = null;
        } else uploadableObject.related_data.doi_date = null;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.doi.resource_type = {
        id: obj.resource_type,
        value: obj.resource_type__value
      };
      this.doi.title_translated_language = {
        id: obj.title_translated_language,
        value: obj.title_translated_language__value,
        value_en: obj.title_translated_language__value_en
      };
      this.doi.owner = { id: obj.owner, agent: obj.owner__agent };
      this.doi.language = {
        id: obj.language,
        value: obj.language__value,
        value_en: obj.language__value_en
      };
      this.doi.copyright_agent = {
        id: obj.copyright_agent,
        agent: obj.copyright_agent__agent
      };
      this.doi.licence = {
        id: obj.licence,
        licence: obj.licence__licence,
        licence_en: obj.licence__licence_en
      };

      // Filling related data, doing it here because there is only 1 reference and 1 dataset
      // Reference and Dataset are direct links and should be added without relatedData object.
      this.doi.reference = {
        id: obj.reference,
        reference: obj.reference__reference
      };
      this.doi.dataset = {
        id: obj.dataset,
        name: obj.dataset__name,
        name_en: obj.dataset__name_en
      };
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.attachment))
        obj.attachment = {
          id: obj.attachment,
          original_filename: obj.attachment__original_filename
        };
      if (this.isNotEmpty(obj.agent_type))
        obj.agent_type = { id: obj.agent_type, value: obj.agent_type__value };
      if (this.isNotEmpty(obj.agent))
        obj.agent = { id: obj.agent, agent: obj.agent__agent };
      if (this.isNotEmpty(obj.identifier_type))
        obj.identifier_type = {
          id: obj.identifier_type,
          value: obj.identifier_type__value
        };
      if (this.isNotEmpty(obj.relation_type))
        obj.relation_type = {
          id: obj.relation_type,
          value: obj.relation_type__value
        };
      if (this.isNotEmpty(obj.locality))
        obj.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        };
      if (this.isNotEmpty(obj.date_type))
        obj.date_type = { id: obj.date_type, value: obj.date_type__value };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.attachment)) {
        newObject.attachment = obj.attachment.id;
        newObject.attachment__original_filename =
          obj.attachment.original_filename;
      }

      if (this.isNotEmpty(obj.agent_type)) {
        newObject.agent_type = obj.agent_type.id;
        newObject.agent_type__value = obj.agent_type.value;
      }

      if (this.isNotEmpty(obj.agent)) {
        newObject.agent = obj.agent.id;
        newObject.agent__agent = obj.agent.agent;
      }
      if (this.isNotEmpty(obj.identifier_type)) {
        newObject.identifier_type = obj.identifier_type.id;
        newObject.identifier_type__value = obj.identifier_type.value;
      }
      if (this.isNotEmpty(obj.relation_type)) {
        newObject.relation_type = obj.relation_type.id;
        newObject.relation_type__value = obj.relation_type.value;
      }
      if (this.isNotEmpty(obj.locality)) {
        newObject.locality = obj.locality.id;
        newObject.locality__locality = obj.locality.locality;
        newObject.locality__locality_en = obj.locality.locality_en;
      }
      if (this.isNotEmpty(obj.date_type)) {
        newObject.date_type = obj.date_type.id;
        newObject.date_type__value = obj.date_type.value;
      }

      return newObject;
    },

    loadRelatedData(object, doi = null) {
      let query;

      if (
        object === "reference" &&
        doi !== null &&
        doi.reference !== null &&
        doi.reference.id !== null
      ) {
        this.relatedData.count[object] = 1;
        this.relatedData[object] = {
          id: doi.reference__id,
          reference: doi.reference__reference
        };
        this.setBlockVisibility(object, this.relatedData.count[object]);
        return;
      } else if (
        object === "dataset" &&
        doi !== null &&
        doi.dataset !== null &&
        doi.dataset.id !== null
      ) {
        this.relatedData.count[object] = 1;
        this.relatedData[object] = {
          id: doi.dataset__id,
          name: doi.dataset__name,
          name_en: doi.dataset__name_en
        };
        this.setBlockVisibility(object, this.relatedData.count[object]);
        return;
      } else if (object === "attachment_link") {
        query = fetchDoiAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      } else if (object === "doi_related_identifier") {
        query = fetchDoiRelatedIdentifier(
          this.$route.params.id,
          this.relatedData.searchParameters.doi_related_identifier
        );
      } else if (object === "doi_geolocation") {
        query = fetchDoiGeolocation(
          this.$route.params.id,
          this.relatedData.searchParameters.doi_geolocation
        );
      } else if (object === "doi_agent") {
        query = fetchDoiAgent(
          this.$route.params.id,
          this.relatedData.searchParameters.doi_agent
        );
      } else if (object === "doi_date") {
        query = fetchDoiDate(
          this.$route.params.id,
          this.relatedData.searchParameters.doi_date
        );
      }

      // Dataset and Reference are direct links and do not need extra request.
      if (object !== "dataset" && object !== "reference") {
        return new Promise(resolve => {
          query.then(response => {
            this.relatedData.count[object] = response.body.count;
            this.relatedData[object] = this.handleResponse(response);
            resolve(true);
          });
        });
      }
    },

    setBlockVisibility(object, count) {
      if (object === "reference" || object === "dataset")
        this.block.referenceAndDataset = count > 0;
    },

    //check required fields for related data
    checkRequiredFields(tab, tabData) {
      if (tab === "doi_agent") {
        return !this.isNotEmpty(tabData.name);
      }
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.doi = this.doi.id;

      if (this.isNotEmpty(uploadableObject.attachment)) {
        uploadableObject.attachment = uploadableObject.attachment.id
          ? uploadableObject.attachment.id
          : uploadableObject.attachment;
      }
      if (this.isNotEmpty(uploadableObject.agent_type)) {
        uploadableObject.agent_type = uploadableObject.agent_type.id
          ? uploadableObject.agent_type.id
          : uploadableObject.agent_type;
      }
      if (this.isNotEmpty(uploadableObject.agent)) {
        uploadableObject.agent = uploadableObject.agent.id
          ? uploadableObject.agent.id
          : uploadableObject.agent;
      }
      if (this.isNotEmpty(uploadableObject.identifier_type)) {
        uploadableObject.identifier_type = uploadableObject.identifier_type.id
          ? uploadableObject.identifier_type.id
          : uploadableObject.identifier_type;
      }
      if (this.isNotEmpty(uploadableObject.relation_type)) {
        uploadableObject.relation_type = uploadableObject.relation_type.id
          ? uploadableObject.relation_type.id
          : uploadableObject.relation_type;
      }
      if (this.isNotEmpty(uploadableObject.locality)) {
        uploadableObject.locality = uploadableObject.locality.id
          ? uploadableObject.locality.id
          : uploadableObject.locality;
      }
      if (this.isNotEmpty(uploadableObject.date_type)) {
        uploadableObject.date_type = uploadableObject.date_type.id
          ? uploadableObject.date_type.id
          : uploadableObject.date_type;
      }
      if (this.isNotEmpty(uploadableObject.datacite_updated))
        uploadableObject.datacite_updated = this.formatDateForUpload(
          objectToUpload.datacite_updated,
          false
        );

      if (this.isNotEmpty(uploadableObject.datacite_created))
        uploadableObject.datacite_created = this.formatDateForUpload(
          objectToUpload.datacite_created,
          false
        );

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    customLabelForReference(option) {
      return `${option.id} - (${option.reference})`;
    },

    customLabelForDataset(option) {
      if (this.$i18n.locale === "ee") return `${option.id} - (${option.name})`;
      return `${option.id} - (${option.name_en})`;
    },

    setDefaultSearchParameters() {
      return {
        identifier: null,
        creators: null,
        publication_year: null,
        title: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    /**
     * Updates DOI creators field using persons (Creators) in doi_agent
     * Always overwrites creators field, because doi_agent is more reliable than user entered creators field!
     * @param doiAgent
     */
    updateDoiCreatorsField(doiAgent) {
      if (doiAgent.length > 0) {
        let creators = "";

        doiAgent.forEach(agent => {
          // Only Creators are added (agent_type 1 === Creator)
          if (agent.agent_type === 1) {
            if (typeof agent.agent !== "undefined" && agent.agent !== null) {
              creators +=
                agent.agent__surename + ", " + agent.agent__forename + "; ";
            }
          }
        });

        if (creators.length > 0) {
          creators = creators.trim().slice(0, -1);
          this.doi.creators = creators;
        }
      }
    },

    /**
     *
     */
    handleCheckDoiResponse(response) {
      if (response.status === 200) {
        let dataCiteResponse = response.body.results;

        if (
          typeof dataCiteResponse !== "undefined" &&
          dataCiteResponse.length > 0
        ) {
          // SUCCESSFUL RESPONSE
          if (dataCiteResponse[0].success) {
            // Checking if metadata needs an update
            if (
              typeof dataCiteResponse[0].update_datacite_metadata !==
              "undefined"
            ) {
              if (dataCiteResponse[0].update_datacite_metadata) {
                this.showDataCiteButton = true;
                this.showUpdateMessage = true;
                toastInfo({
                  text: this.$t("doi.dataCiteNeedsUpdate"),
                  timeout: 7000
                });
              }
            }

            // Checking if url needs an update
            if (
              typeof dataCiteResponse[0].update_datacite_url !== "undefined"
            ) {
              if (dataCiteResponse[0].update_datacite_url) {
                this.showDataCiteUrlButton = true;
                toastInfo({
                  text: this.$t("doi.dataCiteUrlNeedsUpdate"),
                  timeout: 7000
                });
              }
            }
            // UNSUCCESSFUL RESPONSE, but DOI is in SARV database
          } else if (dataCiteResponse[0].is_in_sarv) {
            // Checking if DOI is not in DataCite database (can be registered)
            if (!dataCiteResponse[0].is_in_datacite) {
              this.showDataCiteButton = true;
              this.showUpdateMessage = false;
              if (this.$i18n.locale === "ee")
                toastInfo({
                  text: dataCiteResponse[0].error_et,
                  timeout: 7000
                });
              else
                toastInfo({ text: dataCiteResponse[0].error, timeout: 7000 });
            }
          } else {
            // Unsuccessful response and doi doesn't exist in sarv database (if not in sarv then it can't be in datacite)
            if (this.$i18n.locale === "ee")
              toastInfo({ text: dataCiteResponse[0].error_et, timeout: 7000 });
            else toastInfo({ text: dataCiteResponse[0].error, timeout: 7000 });
          }
        }
      }
    },

    /* DOI METADATA START */

    setCurrentTimeToDataCiteDateFields() {
      let ISOString = new Date().toISOString();
      if (!this.doi.datacite_created) this.doi.datacite_created = ISOString;
      this.doi.datacite_updated = ISOString;
    },

    /**
     * Register/Update metadata to/in DataCite server. Basically just send 'register' function to API and then API updates or registers DOI
     */
    registerMetadata() {
      if (this.validate("doi")) {
        if (
          confirm(
            this.showUpdateMessage
              ? this.$t("doi.doiDataCiteUpdateConfirmation")
              : this.$t("doi.doiDataCiteRegisterConfirmation")
          )
        ) {
          this.sendingData = true;

          fetchRegisterMetadataToDataCite(this.$route.params.id).then(
            response => {
              if (response.status === 200) {
                if (
                  typeof response.body.results !== "undefined" &&
                  response.body.results.length > 0
                ) {
                  if (response.body.results[0].success) {
                    toastSuccess({
                      text:
                        this.$t("doi.dataciteMetadataUpdated") +
                        " DataCite response: " +
                        response.body.results[0].content,
                      timeout: 5000
                    });
                    this.setCurrentTimeToDataCiteDateFields();
                    this.showMetadataButton = false;
                    this.showMetadataUpdateMessage = false;
                    this.checkDoiUrl();
                  } else {
                    toastError({
                      text: this.$t("doi.dataciteMetadataUpdateFailed")
                    });
                  }
                }
              }
              this.sendingData = false;
            }
          );
        } else toastInfo({ text: this.$t("messages.userCancelled") });
      } else toastError({ text: this.$t("messages.checkForm") });
    },

    registerDoiUrl() {
      if (this.validate("doi")) {
        if (
          confirm(
            this.showUpdateMessage
              ? this.$t("doi.doiDataCiteUpdateConfirmation")
              : this.$t("doi.doiDataCiteRegisterConfirmation")
          )
        ) {
          this.sendingData = true;

          fetchRegisterDoiUrlToDataCite(this.$route.params.id).then(
            response => {
              if (response.status === 200) {
                if (
                  typeof response.body.results !== "undefined" &&
                  response.body.results.length > 0
                ) {
                  if (response.body.results[0].success) {
                    toastSuccess({
                      text:
                        this.$t("doi.dataciteUrlUpdated") +
                        " DataCite response: " +
                        response.body.results[0].content,
                      timeout: 5000
                    });
                    this.showDoiUrlButton = false;
                    this.showDoiUrlUpdateMessage = false;
                  } else {
                    toastError({
                      text: this.$t("doi.dataciteUrlUpdateFailed")
                    });
                  }
                }
              }
              this.sendingData = false;
            }
          );
        } else toastInfo({ text: this.$t("messages.userCancelled") });
      } else toastError({ text: this.$t("messages.checkForm") });
    },

    // Checks metadata from DataCite
    checkMetadata() {
      fetchCheckMetadataInDataCite(this.$route.params.id).then(response => {
        if (response.status === 200) {
          if (
            typeof response.body.results !== "undefined" &&
            response.body.results.length > 0
          ) {
            if (response.body.results[0].success) {
              if (response.body.results[0].doi_metadata_needs_update) {
                this.showMetadataButton = true;
                this.showMetadataUpdateMessage = true;
                this.sarvXML = response.body.results[0].sarv_xml;
                this.dataciteXML = response.body.results[0].datacite_xml;
                toastInfo({ text: this.$t("doi.dataciteMetadataNeedsUpdate") });
              } else {
                this.showMetadataButton = false;
                this.showMetadataUpdateMessage = false;
                this.sarvXML = response.body.results[0].sarv_xml;
                this.dataciteXML = response.body.results[0].datacite_xml;
                if (
                  typeof response.body.results[0].error !== "undefined" &&
                  response.body.results[0].error_et !== "undefined"
                ) {
                  if (this.$i18n.locale === "ee")
                    toastInfo({ text: response.body.results[0].error_et });
                  else toastInfo({ text: response.body.results[0].error });
                }
              }
            } else if (response.body.results[0].error_code === 404) {
              this.showMetadataButton = true;
              this.showMetadataUpdateMessage = false;
            } else {
              this.showMetadataButton = false;
              this.showMetadataUpdateMessage = false;
            }
          }
        }
      });
    },

    // Checks DOI url from DataCite
    checkDoiUrl() {
      fetchCheckDoiUrlInDataCite(this.$route.params.id).then(response => {
        if (response.status === 200) {
          if (
            typeof response.body.results !== "undefined" &&
            response.body.results.length > 0
          ) {
            if (response.body.results[0].success) {
              if (response.body.results[0].doi_url_needs_update) {
                this.showDoiUrlButton = true;
                this.showDoiUrlUpdateMessage = true;
                this.doiURL = response.body.results[0].doi_url;
                this.dataciteURL = response.body.results[0].datacite_url;
              }
            } else if (response.body.results[0].error_code === 204) {
              this.showDoiUrlButton = true;
              this.showDoiUrlUpdateMessage = false;
            } else {
              this.showDoiUrlButton = false;
              this.showDoiUrlUpdateMessage = false;
            }
          }
        }
      });
    },

    /* DOI METADATA END */

    assignEgfFieldsToDoiObject(egfDoiObject) {
      if (this.isNotEmpty(egfDoiObject)) {
        this.doi.resource_type = { id: 12, value: "Text" };
        this.doi.resource = "Report";
        this.doi.publisher = "Geoloogiafond";
        this.doi.version = "1.0";
        this.doi.licence = {
          id: 4,
          licence: "CC BY-SA",
          licence_en: "CC BY-SA"
        };
        this.doi.subjects = ""; // Needed because otherwise undefined will be written also.
        this.doi.remarks = ""; // Needed because otherwise undefined will be written also.

        if (egfDoiObject.creator) {
          let creatorsList = [];
          if (egfDoiObject.creator.includes(",")) {
            // this.doi.creators = egfDoiObject.creator.replace(/,/g, ';');
            creatorsList = egfDoiObject.creator.split(",");
          } else {
            // this.doi.creators = egfDoiObject.creator;
            creatorsList.push(egfDoiObject.creator);
          }

          let formattedCreatorsList = [];
          creatorsList.forEach(creator => {
            let firstName = creator.substring(0, creator.lastIndexOf(".") + 1);
            let lastName = creator.substring(creator.lastIndexOf(".") + 1);
            let formattedName = `${lastName.trim()}, ${firstName.trim()}`;
            formattedCreatorsList.push(formattedName);

            this.relatedData.doi_agent.push({
              name: formattedName,
              agent_type: 1,
              agent_type__value: "Creator"
            });
          });

          this.doi.creators = formattedCreatorsList.join("; ");
        }
        if (egfDoiObject.title) {
          this.doi.title_translated = egfDoiObject.title;
          this.doi.title_translated_language = {
            id: 4,
            value: "eesti",
            value_en: "Estonian"
          };
        }
        if (egfDoiObject.title_eng)
          this.doi.title_alternative = egfDoiObject.title_eng;
        if (egfDoiObject.title_orig) this.doi.title = egfDoiObject.title_orig;
        if (egfDoiObject.date) this.doi.publication_year = egfDoiObject.date;
        if (egfDoiObject.tags && egfDoiObject.tags.trim().length > 0)
          this.doi.subjects += egfDoiObject.tags;
        if (egfDoiObject.field && egfDoiObject.field.trim().length > 0)
          this.doi.subjects +=
            this.doi.subjects.length > 0
              ? ", " + egfDoiObject.field
              : egfDoiObject.field;
        if (egfDoiObject.deposit && egfDoiObject.deposit.trim().length > 0)
          this.doi.subjects +=
            this.doi.subjects.length > 0
              ? ", " + egfDoiObject.deposit
              : egfDoiObject.deposit;
        if (
          egfDoiObject.deposit_code &&
          egfDoiObject.deposit_code.trim().length > 0
        )
          this.doi.subjects +=
            this.doi.subjects.length > 0
              ? ", " + egfDoiObject.deposit_code
              : egfDoiObject.deposit_code;
        if (egfDoiObject.description)
          this.doi.abstract = egfDoiObject.description;
        if (egfDoiObject.funder) {
          let funderList = [];
          if (egfDoiObject.funder.includes(","))
            funderList = egfDoiObject.funder.split(",");
          else funderList.push(egfDoiObject.funder);

          funderList.forEach(funder => {
            this.relatedData.doi_agent.push({
              name: funder,
              agent_type: 22,
              agent_type__value: "Sponsor"
            });
          });
        }
        if (egfDoiObject.performer) {
          let performerList = [];
          if (egfDoiObject.performer.includes(","))
            performerList = egfDoiObject.performer.split(",");
          else performerList.push(egfDoiObject.performer);

          performerList.forEach(performer => {
            this.relatedData.doi_agent.push({
              name: performer,
              agent_type: 12,
              agent_type__value: "Producer"
            });
          });
        }
        if (
          egfDoiObject.emk_protocol &&
          egfDoiObject.emk_protocol.trim().length > 0
        )
          this.doi.subjects +=
            this.doi.subjects.length > 0
              ? ", " + egfDoiObject.emk_protocol
              : egfDoiObject.emk_protocol;
        if (
          egfDoiObject.evpk_protocol &&
          egfDoiObject.evpk_protocol.trim().length > 0
        )
          this.doi.subjects +=
            this.doi.subjects.length > 0
              ? ", " + egfDoiObject.evpk_protocol
              : egfDoiObject.evpk_protocol;
        if (egfDoiObject.note && egfDoiObject.note.trim().length > 0)
          this.doi.remarks += egfDoiObject.note;
        if (
          egfDoiObject.restricted_untill &&
          egfDoiObject.restricted_untill.trim().length > 0
        )
          this.doi.remarks +=
            this.doi.remarks.length > 0
              ? ", " + egfDoiObject.restricted_untill
              : egfDoiObject.restricted_untill;
        if (
          egfDoiObject.restricted_reason &&
          egfDoiObject.restricted_reason.trim().length > 0
        )
          this.doi.remarks +=
            this.doi.remarks.length > 0
              ? ", " + egfDoiObject.restricted_reason
              : egfDoiObject.restricted_reason;
        if (egfDoiObject.geometry) {
          if (
            egfDoiObject.geometry.coordinates &&
            egfDoiObject.geometry.coordinates.length > 0
          ) {
            if (egfDoiObject.geometry.type === "Polygon") {
              let coordinates = JSON.stringify(
                egfDoiObject.geometry.coordinates[0]
              );
              this.relatedData.doi_geolocation.push({
                polygon: coordinates
              });
            } else if (egfDoiObject.geometry.type === "MultiPolygon") {
              egfDoiObject.geometry.coordinates.forEach(coordinates => {
                this.relatedData.doi_geolocation.push({
                  polygon: JSON.stringify(coordinates[0])
                });
              });
            }
          }
        }
      }
    },

    addCreatorsToRelatedData() {
      let creators = this.doi.creators;
      let listOfCreators = [];

      if (creators && creators.trim().length > 0) {
        if (creators.includes(";")) listOfCreators = creators.split(";");
        else listOfCreators.push(creators);
      }

      if (listOfCreators.length > 0) {
        listOfCreators.forEach(creator => {
          let doiAgentObject = {};
          if (creator.trim().length > 0) {
            fetchAgentUsingName(creator.trim()).then(
              response => {
                let agentObject = this.handleResponse(response)[0];

                if (this.isNotEmpty(agentObject)) {
                  doiAgentObject.name = agentObject.agent;
                  doiAgentObject.orcid = agentObject.orcid;
                  doiAgentObject.affiliation =
                    agentObject.institution__institution_name_en;
                  doiAgentObject.agent = agentObject.id;
                  doiAgentObject.agent__agent = agentObject.agent;
                  doiAgentObject.agent_type = 1;
                  doiAgentObject.agent_type__value = "Creator";
                  if (
                    !this.relatedData["doi_agent"].find(
                      agent =>
                        agent.id === doiAgentObject.agent ||
                        agent.name === doiAgentObject.name
                    )
                  ) {
                    this.relatedData["doi_agent"].push(doiAgentObject);
                  } else
                    toastError({
                      text: `Author(s) with the same information already exists!`
                    });
                } else {
                  doiAgentObject.name = creator.trim();
                  doiAgentObject.agent_type = 1;
                  doiAgentObject.agent_type__value = "Creator";
                  if (
                    !this.relatedData["doi_agent"].find(
                      agent => agent.name === doiAgentObject.name
                    )
                  ) {
                    this.relatedData["doi_agent"].push(doiAgentObject);
                  } else
                    toastError({
                      text: `Author(s) with the same name already exists!`
                    });
                }
              },
              () => {
                doiAgentObject.name = creator.trim();
                if (
                  !this.relatedData["doi_agent"].find(
                    agent => agent.name === doiAgentObject.name
                  )
                ) {
                  this.relatedData["doi_agent"].push(doiAgentObject);
                } else
                  toastError({
                    text: `Author(s) with the same name already exists!`
                  });
              }
            );
          }
        });
      } else {
        this.relatedData["doi_agent"] = [];
      }
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

.link:hover {
  cursor: pointer;
}

@media (min-width: 768px) {
  .px-15px {
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
