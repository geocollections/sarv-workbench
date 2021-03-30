<template>
  <div class="doi">
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
            $t("common.requiredFields")
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
        <div v-show="block.requiredFields" class="pa-1">
          <!-- DOI, RESOURCE TYPE and RESOURCE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="doi.identifier"
                :color="bodyActiveColor"
                :label="$t('doi.identifier')"
                :placeholder="
                  $route.meta.isEdit ? '' : $t('doi.identifierPlaceholder')
                "
                disabled
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="doi.resource_type"
                :color="bodyActiveColor"
                :items="autocomplete.resource_type"
                :loading="autocomplete.loaders.resource_type"
                item-text="value"
                :label="$t('doi.resourceTypeGeneral')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="doi.resource"
                :color="bodyActiveColor"
                :label="$t('doi.resource')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- CREATORS, YEAR and PUBLISHER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <!--              <div class="d-flex">-->
              <!--                <div class="flex-fill">-->
              <v-tooltip top z-index="60000">
                <template v-slot:activator="{ on, attrs }">
                  <input-wrapper
                    v-on="on"
                    v-bind="attrs"
                    v-model="doi.creators"
                    :color="bodyActiveColor"
                    :label="$t('doi.creators')"
                    use-state
                    readonly
                  />
                </template>
                <span>{{ $t("doi.authorTooltip") }}</span>
              </v-tooltip>
              <!--                </div>-->

              <!--                <div-->
              <!--                  class="align-self-end pl-2"-->
              <!--                  v-if="!$route.meta.isEdit && isNotEmpty(doi.creators)"-->
              <!--                >-->
              <!--                  <v-btn-->
              <!--                    icon-->
              <!--                    :color="bodyActiveColor"-->
              <!--                    @click="addCreatorsToRelatedData"-->
              <!--                    :title="$t('doi.addCreators')"-->
              <!--                  >-->
              <!--                    <v-icon small>fas fa-user-plus</v-icon>-->
              <!--                  </v-btn>-->
              <!--                </div>-->
              <!--              </div>-->
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="doi.publication_year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="doi.publisher"
                :color="bodyActiveColor"
                :items="autocomplete.doi_publisher"
                :loading="autocomplete.loaders.doi_publisher"
                item-value="test"
                item-text="value"
                :label="$t('doi.publisher')"
                use-state
              />
              <!--              <input-wrapper-->
              <!--                v-model="doi.publisher"-->
              <!--                :color="bodyActiveColor"-->
              <!--                :label="$t('doi.publisher')"-->
              <!--                use-state-->
              <!--              />-->
            </v-col>
          </v-row>

          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="doi.title"
                :color="bodyActiveColor"
                :label="$t('doi.title')"
                use-state
              />
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
          <span>{{ $t("common.generalInfo") }}</span>
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
        <div v-show="block.info" class="pa-1">
          <!-- TITLE ALTERNATIVE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="doi.title_alternative"
                :color="bodyActiveColor"
                :label="$t('doi.title_alternative')"
              />
            </v-col>
          </v-row>

          <!-- TITLE TRANSLATED and TITLE TRANSLATED LANGUAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="doi.title_translated"
                :color="bodyActiveColor"
                :label="$t('doi.title_translated')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="doi.title_translated_language"
                :color="bodyActiveColor"
                :items="autocomplete.language"
                :loading="autocomplete.loaders.language"
                :item-text="commonLabel"
                :label="$t('doi.title_translated_language')"
              />
            </v-col>
          </v-row>

          <!-- LANGUAGE, VERSION, FORMATS and SIZES -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="doi.language"
                :color="bodyActiveColor"
                :items="autocomplete.language"
                :loading="autocomplete.loaders.language"
                :item-text="commonLabel"
                :label="$t('doi.language')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="doi.version"
                :color="bodyActiveColor"
                :label="$t('doi.version')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <v-tooltip top z-index="60000">
                <template v-slot:activator="{ on, attrs }">
                  <input-wrapper
                    v-on="on"
                    v-bind="attrs"
                    v-model="doi.formats"
                    :color="bodyActiveColor"
                    :label="$t('doi.formats')"
                  />
                </template>
                <span>{{ $t("doi.formatsTooltip") }}</span>
              </v-tooltip>
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="doi.sizes"
                :color="bodyActiveColor"
                :label="$t('doi.sizes')"
              />
            </v-col>
          </v-row>

          <!-- SUBJECTS and OWNER (agent)-->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="doi.subjects"
                :color="bodyActiveColor"
                :label="$t('doi.subjects')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="doi.owner"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('doi.copyright_agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- ABSTRACT -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="doi.abstract"
                :color="bodyActiveColor"
                :label="$t('doi.abstract')"
              />
            </v-col>
          </v-row>

          <!-- METHODS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="doi.methods"
                :color="bodyActiveColor"
                :label="$t('doi.methods')"
              />
            </v-col>
          </v-row>

          <!-- COPYRIGHT_AGENT (copyright) and LICENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="doi.copyright_agent"
                :color="bodyActiveColor"
                :items="autocomplete.copyright_agent"
                :loading="autocomplete.loaders.copyright_agent"
                item-text="agent"
                :label="$t('doi.copyright')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteCopyrightAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="doi.licence"
                :color="bodyActiveColor"
                :items="autocomplete.licence"
                :loading="autocomplete.loaders.licence"
                :item-text="licenceLabel"
                :label="$t('common.licence')"
              />
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
        <div v-show="block.referenceAndDataset" class="pa-1">
          <!-- REFERENCE and DATASET -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="relatedData.reference"
                :color="bodyActiveColor"
                :items="autocomplete.reference"
                :loading="autocomplete.loaders.reference"
                :item-text="customLabelForReference"
                :label="$t('doi.primaryReference')"
                is-link
                route-object="reference"
                is-searchable
                v-on:search:items="autocompleteDoiReferenceSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="relatedData.dataset"
                :color="bodyActiveColor"
                :items="autocomplete.dataset"
                :loading="autocomplete.loaders.dataset"
                :item-text="customLabelForDataset"
                :label="$t('doi.primaryDataset')"
                is-link
                route-object="dataset"
                is-searchable
                v-on:search:items="autocompleteDatasetSearch"
              />
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
          <span>{{ $t("common.remarks") }}</span>
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
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="doi.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
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
          <doi-agent-table
            v-show="activeTab === 'doi_agent'"
            :response="relatedData.doi_agent"
            :search-parameters="relatedData.searchParameters.doi_agent"
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

          <doi-related-identifier-table
            v-show="activeTab === 'doi_related_identifier'"
            :response="relatedData.doi_related_identifier"
            :search-parameters="
              relatedData.searchParameters.doi_related_identifier
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <doi-geolocation-table
            v-show="activeTab === 'doi_geolocation'"
            :response="relatedData.doi_geolocation"
            :search-parameters="relatedData.searchParameters.doi_geolocation"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <doi-date-table
            v-show="activeTab === 'doi_date'"
            :response="relatedData.doi_date"
            :search-parameters="relatedData.searchParameters.doi_date"
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
        <div v-show="block.datacite" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-if="doi.datacite_created"
                :value="doi.datacite_created | moment('YYYY-MM-DD hh:mm:ss')"
                :color="bodyActiveColor"
                :label="$t('doi.dataciteCreated')"
                :readonly="true"
              />
              <input-wrapper
                v-else
                v-model="doi.datacite_created"
                :color="bodyActiveColor"
                :label="$t('doi.dataciteCreated')"
                :readonly="true"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-if="doi.datacite_updated"
                :value="doi.datacite_updated | moment('YYYY-MM-DD hh:mm:ss')"
                :color="bodyActiveColor"
                :label="$t('doi.dataciteUpdated')"
                :readonly="true"
              />
              <input-wrapper
                v-else
                v-model="doi.datacite_updated"
                :color="bodyActiveColor"
                :label="$t('doi.dataciteUpdated')"
                :readonly="true"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE and IS_LOCKED -->
    <div class="d-flex flex-wrap mt-2">
      <checkbox-wrapper
        class="mr-1"
        v-model="doi.is_private"
        :color="bodyActiveColor"
        :label="$t('common.is_private')"
        @change="doi.is_private = !doi.is_private"
      />
      <checkbox-wrapper
        v-model="doi.is_locked"
        :color="bodyActiveColor"
        :label="$t('common.is_locked')"
        @change="doi.is_locked = !doi.is_locked"
      />
    </div>

    <!-- DOI METADATA REGISTER and UPDATE BUTTONS -->
    <div class="row mt-3">
      <div class="col">
        <v-btn
          v-if="
            $route.meta.isEdit &&
              showMetadataButton &&
              validate('doi') &&
              doiContainsFile
          "
          class="mr-2 mb-2 text-none"
          :disabled="loadingState"
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
          v-if="
            $route.meta.isEdit &&
              showDoiUrlButton &&
              validate('doi') &&
              doiContainsFile
          "
          class="mr-2 mb-2 text-none"
          :disabled="loadingState"
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

    <!-- DOI METADATA DIFF -->
    <v-card
      class="mt-2"
      id="block-dataciteDiff"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
      v-if="$route.meta.isEdit && showMetadataButton && doiContainsFile"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.dataciteDiff = !block.dataciteDiff"
        >
          <span>{{ $t("doi.dataciteDiff") }}</span>
          <v-icon right>fas fa-exchange-alt</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.dataciteDiff = !block.dataciteDiff"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.dataciteDiff ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.dataciteDiff" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <div>{{ this.$t("doi.diffComparison") }}:</div>
            </v-col>
          </v-row>

          <v-row no-gutters v-if="xmlDiff && xmlDiff.length > 0">
            <v-col cols="12" class="pa-1">
              <div class="d-flex flex-row flex-wrap justify-space-around">
                <v-card
                  @click="$scrollTo('.scroll-inserted')"
                  hover
                  class="diff-inserted py-1 px-3 ma-1"
                  >{{ $t("doi.diffAdded") }}</v-card
                >
                <v-card
                  @click="$scrollTo('.scroll-deleted')"
                  hover
                  class="diff-deleted py-1 px-3 ma-1"
                  >{{ $t("doi.diffDeleted") }}</v-card
                >
                <v-card
                  @click="$scrollTo('.scroll-equal')"
                  hover
                  class="diff-equal py-1 px-3 ma-1"
                  >{{ $t("doi.diffEqual") }}</v-card
                >
              </div>
            </v-col>

            <v-col
              cols="12"
              class="pa-1"
              v-for="(entity, index) in xmlDiff"
              :key="index"
            >
              <div
                class="pa-1 text-justify"
                :class="{
                  'diff-inserted scroll-inserted': entity[0] === 1,
                  'diff-deleted scroll-deleted': entity[0] === -1,
                  'diff-equal scroll-equal': entity[0] === 0
                }"
              >
                <span>{{ entity[1] }}</span>
              </div>
            </v-col>
          </v-row>

          <v-row v-else no-gutters>
            <v-col cols="12" class="pa-1 title">
              {{ $t("doi.diffNotFound") }}
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- DOI URL DIFF -->
    <v-card
      class="mt-2"
      id="block-dataciteUrlDiff"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
      v-if="$route.meta.isEdit && showDoiUrlButton && doiContainsFile"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.dataciteUrlDiff = !block.dataciteUrlDiff"
        >
          <span>{{ $t("doi.dataciteUrlDiff") }}</span>
          <v-icon right>fas fa-exchange-alt</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.dataciteUrlDiff = !block.dataciteUrlDiff"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.dataciteUrlDiff ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.dataciteUrlDiff" class="pa-1">
          <v-row no-gutters v-if="urlDiff">
            <v-col cols="12" class="pa-1">
              <div class="pa-1">
                DataCite URL ({{ $t("doi.currentUrl") }}):
                <a
                  :href="dataciteURL"
                  class="font-weight-bold red--text text-decoration-underline url-link"
                  target="OldDoi"
                  :title="$t('doi.currentUrl')"
                  >{{ dataciteURL }}</a
                >
              </div>

              <div class="pa-1">
                SARV URL ({{ $t("doi.newUrl") }}):
                <a
                  :href="doiURL"
                  class="font-weight-bold green--text text-decoration-underline url-link"
                  target="NewDoi"
                  :title="$t('doi.newUrl')"
                  >{{ doiURL }}</a
                >
              </div>
            </v-col>
          </v-row>

          <v-row v-else no-gutters>
            <v-col cols="12" class="pa-1 title">
              {{ $t("doi.diffNotFound") }}
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
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
  fetchDoiRelatedIdentifier,
  fetchDoiGeolocation,
  fetchDoiDate,
  fetchCheckMetadataInDataCite,
  fetchCheckDoiUrlInDataCite,
  fetchRegisterMetadataToDataCite,
  fetchRegisterDoiUrlToDataCite,
  fetchDoiUsingEGF,
  fetchAgentUsingName,
  fetchDoiPublisher
} from "@/assets/js/api/apiCalls";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapActions, mapState } from "vuex";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import FileInput from "../partial/inputs/FileInput";
import DoiRelatedIdentifierTable from "./relatedTables/DoiRelatedIdentifierTable";
import DoiGeolocationTable from "./relatedTables/DoiGeolocationTable";
import DoiAgentTable from "./relatedTables/DoiAgentTable";
import DoiDateTable from "./relatedTables/DoiDateTable";
import requestsMixin from "../../mixins/requestsMixin";
import toastMixin from "../../mixins/toastMixin";
import DiffMatchPatch from "diff-match-patch";
import Pagination from "@/components/partial/Pagination";

export default {
  components: {
    Pagination,
    DoiDateTable,
    DoiAgentTable,
    DoiGeolocationTable,
    DoiRelatedIdentifierTable,
    FileInput,
    CheckboxWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin,
    toastMixin
  ],

  name: "Doi",

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.doiSearchParameters,
        request: "FETCH_DOIS",
        title: "header.dois",
        object: "doi",
        field: "title"
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
    },
    "relatedData.doi_agent.results": {
      handler(newVal) {
        if (newVal && newVal.length > 0) this.updateDoiCreatorsField(newVal);
      },
      deep: true
    }
  },

  computed: {
    ...mapState("search", ["doiSearchParameters"]),

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
    },

    xmlDiff() {
      if (this.dataciteXML && this.sarvXML) {
        const dmp = new DiffMatchPatch();
        let diff = dmp.diff_main(this.dataciteXML, this.sarvXML);
        dmp.diff_cleanupSemantic(diff);
        dmp.diff_prettyHtml(diff);
        return diff;
      } else return null;
    },

    urlDiff() {
      return (
        this.dataciteURL && this.doiURL && this.dataciteURL !== this.doiURL
      );
    },

    doiContainsFile() {
      // return true;
      // Does not apply to egf #516
      if (this.doi.egf) return true;
      else return this.relatedData.attachment_link.count > 0;
    }
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
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
          "is_locked",
          "datacite_created",
          "datacite_updated",
          "egf"
        ],
        autocomplete: {
          loaders: {
            resource_type: false,
            doi_publisher: false,
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
          doi_publisher: [],
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
        block: {
          requiredFields: true,
          info: true,
          referenceAndDataset: false,
          description: true,
          datacite: true,
          dataciteDiff: false,
          dataciteUrlDiff: false
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

      if (!this.$route.meta.isEdit) {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        this.$emit("set-object", "doi");

        fetchDoi(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "doi", this.handleResponse(response)[0]);
            // this.doi = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.doi);

            // Loading REFERENCE and DATASET here because they don't need api request
            this.loadRelatedData("reference", this.doi);
            this.loadRelatedData("dataset", this.doi);

            this.removeUnnecessaryFields(this.doi, this.copyFields);
            this.$emit("data-loaded", this.doi);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }

          this.checkMetadata();
          this.checkDoiUrl();

          // Load Related Data which is in tabs
          this.relatedTabs.forEach(tab => {
            this.loadRelatedData(tab.name);
          });
        });
      } else if (this.$route.meta.isEGF && !this.$route.meta.isEdit) {
        fetchDoiUsingEGF(this.$route.params.id).then(response => {
          if (response?.data) this.assignEgfFieldsToDoiObject(response?.data);
          else
            this.toastError({
              text: `Couldn't fetch <b>Fond</b> with an ID: <b>${this.$route.params.id}</b>`
            });
        });
      } else {
        this.doi.version = "1.0";
      }

      if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
      else this.setTab("doi_agent");
    },

    loadAutocompleteFields() {
      fetchDoiResourceType().then(
        response =>
          (this.autocomplete.resource_type = this.handleResponse(response))
      );
      fetchDoiPublisher().then(response => {
        this.autocomplete.doi_publisher = [
          ...this.autocomplete.doi_publisher,
          ...this.handleResponse(response)
        ];
        if (
          !this.$route.meta.isEdit &&
          !this.doi.publisher &&
          this.autocomplete.doi_publisher.length > 0
        ) {
          if (this.$route.meta.isEGF)
            this.doi.publisher = this.autocomplete.doi_publisher[4].value;
          else this.doi.publisher = this.autocomplete.doi_publisher[0].value;
        }
      });
      fetchListLanguages().then(
        response => (this.autocomplete.language = this.handleResponse(response))
      );
      fetchListLicences().then(
        response => (this.autocomplete.licence = this.handleResponse(response))
      );
    },

    setDefaultRelatedData() {
      return {
        reference: null,
        dataset: null,
        attachment_link: { count: 0, results: [] },
        doi_agent: { count: 0, results: [] },
        doi_related_identifier: { count: 0, results: [] },
        doi_geolocation: { count: 0, results: [] },
        doi_date: { count: 0, results: [] },
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          doi_related_identifier: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          doi_geolocation: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          doi_agent: {
            page: 1,
            paginateBy: 25,
            sortBy: ["sort", "id"],
            sortDesc: [false, false]
          },
          doi_date: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          }
        },
        count: {
          reference: 0,
          dataset: 0
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (uploadableObject.egf) delete uploadableObject.egf;

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

      if (this.isNotEmpty(this.relatedData.reference)) {
        uploadableObject.reference = this.relatedData.reference.id;
      } else uploadableObject.reference = null;

      if (this.isNotEmpty(this.relatedData.dataset)) {
        uploadableObject.dataset = this.relatedData.dataset.id;
      } else uploadableObject.dataset = null;

      if (this.getDatabaseId) uploadableObject.database = this.getDatabaseId;

      if (this.$route.meta.isEGF) uploadableObject.egf = this.$route.params.id;

      // Adding related data
      uploadableObject.related_data = {};
      if (this.relatedData.attachment_link.results.length > 0) {
        uploadableObject.related_data.attachment = this.relatedData.attachment_link.results.map(
          item => {
            return {
              // ...item,
              id: item.id,
              is_locked: true
            };
          }
        );
      } else uploadableObject.related_data.attachment = null;

      if (!this.$route.meta.isEdit) {
        if (this.relatedData.doi_agent.results.length > 0) {
          let clonedData = cloneDeep(this.relatedData.doi_agent.results);
          uploadableObject.related_data.doi_agent = clonedData
            .filter(entity => this.isNotEmpty(entity.name))
            .map(entity => {
              return {
                affiliation: entity?.affiliation || null,
                agent: entity?.agent?.id || null,
                agent_type: entity?.agent_type?.id || null,
                name: entity?.name || null,
                orcid: entity?.orcid || null,
                sort: entity?.sort || null
              };
            });
          if (uploadableObject.related_data.doi_agent.length === 0)
            uploadableObject.related_data.doi_agent = null;
        } else uploadableObject.related_data.doi_agent = null;

        if (this.relatedData.doi_geolocation.results.length > 0) {
          let clonedData = cloneDeep(this.relatedData.doi_geolocation.results);
          uploadableObject.related_data.doi_geolocation = clonedData
            // .filter(entity => this.isNotEmpty(entity.locality))
            .map(entity => {
              return {
                polygon: entity?.polygon || null,
                locality: entity?.locality?.id || null,
                place: entity?.place || null,
                point_latitude: entity?.point_latitude || null,
                point_longitude: entity?.point_longitude || null
              };
            });
          if (uploadableObject.related_data.doi_geolocation.length === 0)
            uploadableObject.related_data.doi_geolocation = null;
        } else uploadableObject.related_data.doi_geolocation = null;

        if (this.relatedData.doi_related_identifier.results.length > 0) {
          let clonedData = cloneDeep(
            this.relatedData.doi_related_identifier.results
          );
          uploadableObject.related_data.doi_related_identifier = clonedData
            .filter(entity => this.isNotEmpty(entity.identifier_type))
            .map(entity => {
              return {
                identifier_type: entity?.identifier_type?.id || null,
                relation_type: entity?.relation_type?.id || null,
                remarks: entity?.remarks || null,
                value: entity?.value || null
              };
            });
          if (uploadableObject.related_data.doi_related_identifier.length === 0)
            uploadableObject.related_data.doi_related_identifier = null;
        } else uploadableObject.related_data.doi_related_identifier = null;

        if (this.relatedData.doi_date.results.length > 0) {
          let clonedData = cloneDeep(this.relatedData.doi_date.results);
          uploadableObject.related_data.doi_date = clonedData
            // .filter(entity => this.isNotEmpty(entity.date))
            .map(entity => {
              return {
                date: entity?.date || null,
                date_type: entity?.date_type?.id || null,
                remarks: entity?.remarks || null
              };
            });
          if (uploadableObject.related_data.doi_date.length === 0)
            uploadableObject.related_data.doi_date = null;
        } else uploadableObject.related_data.doi_date = null;
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

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
      if (this.isNotEmpty(obj.owner)) {
        this.doi.owner = { id: obj.owner, agent: obj.owner__agent };
        this.autocomplete.agent.push(this.doi.owner);
      }
      this.doi.language = {
        id: obj.language,
        value: obj.language__value,
        value_en: obj.language__value_en
      };
      if (this.isNotEmpty(obj.copyright_agent)) {
        this.doi.copyright_agent = {
          id: obj.copyright_agent,
          agent: obj.copyright_agent__agent
        };
        this.autocomplete.copyright_agent.push(this.doi.copyright_agent);
      }
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

      if (this.doi.publisher) {
        if (
          !this.autocomplete.doi_publisher.some(
            item => item.value === this.doi.publisher
          )
        ) {
          this.autocomplete.doi_publisher = [
            ...this.autocomplete.doi_publisher,
            { value: this.doi.publisher }
          ];
        }
      }
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
        this.autocomplete.reference.push(this.relatedData[object]);
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
        this.autocomplete.dataset.push(this.relatedData[object]);
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
      if (query && (object !== "dataset" && object !== "reference")) {
        query.then(response => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
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

    customLabelForReference(option) {
      return `${option.id} - (${option.reference})`;
    },

    customLabelForDataset(option) {
      if (this.$i18n.locale === "ee") return `${option.id} - (${option.name})`;
      return `${option.id} - (${option.name_en})`;
    },

    /**
     * Updates DOI creators field using persons (Creators) in doi_agent
     * Always overwrites creators field, because doi_agent is more reliable than user entered creators field!
     * @param doiAgent
     */
    updateDoiCreatorsField(doiAgent) {
      if (doiAgent.length > 0) {
        let creators = "";
        let creatorsLong = "";
        let moreThanOneAuthor = doiAgent.length > 1;

        doiAgent.forEach(agent => {
          // Only Creators are added (agent_type 1 === Creator)
          if (this.$route.meta.isEdit) {
            if (agent?.agent_type === 1) {
              if (agent?.agent__surename && agent?.agent__forename) {
                creatorsLong += `${
                  agent.agent__surename
                }, ${agent.agent__forename.charAt(0)}., `;
                creators += `${agent.agent__surename}, ${agent.agent__forename}; `;
              } else if (agent?.name) {
                creatorsLong += `${agent.name}; `;
                creators += `${agent.name}; `;
              }
            }
          } else {
            if (agent?.agent_type?.id === 1) {
              if (agent?.agent?.surename && agent?.agent?.forename) {
                creatorsLong += `${
                  agent.agent.surename
                }, ${agent.agent.forename.charAt(0)}., `;
                creators += `${agent.agent.surename}, ${agent.agent.forename}; `;
              } else if (agent?.name) {
                creators += `${agent.name}; `;
                creatorsLong += `${agent.name}; `;
              }
            }
          }
        });

        if (creators.length > 0) {
          creators = creators.trim().slice(0, -1);
          creatorsLong = creatorsLong.trim().slice(0, -1);

          if (moreThanOneAuthor) this.doi.creators = creatorsLong;
          else {
            if (this.doi.creators !== creatorsLong)
              this.doi.creators = creators;
          }
        }
      }
    },

    /**
     *
     */
    handleCheckDoiResponse(response) {
      if (response.status === 200) {
        let dataCiteResponse = response.data.results;

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
                this.toastInfo({
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
                this.toastInfo({
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
                this.toastInfo({
                  text: dataCiteResponse[0].error_et,
                  timeout: 7000
                });
              else
                this.toastInfo({
                  text: dataCiteResponse[0].error,
                  timeout: 7000
                });
            }
          } else {
            // Unsuccessful response and doi doesn't exist in sarv database (if not in sarv then it can't be in datacite)
            if (this.$i18n.locale === "ee")
              this.toastInfo({
                text: dataCiteResponse[0].error_et,
                timeout: 7000
              });
            else
              this.toastInfo({
                text: dataCiteResponse[0].error,
                timeout: 7000
              });
          }
        }
      }
    },

    /* DOI METADATA START */

    setCurrentTimeToDataCiteDateFields() {
      let currentDate = new Date().toISOString();
      if (!this.doi.datacite_created) this.doi.datacite_created = currentDate;
      this.doi.datacite_updated = currentDate;
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
          this.setLoadingState(true);
          this.setLoadingType("fetch");

          fetchRegisterMetadataToDataCite(this.$route.params.id).then(
            response => {
              if (response.status === 200) {
                if (
                  typeof response.data.results !== "undefined" &&
                  response.data.results.length > 0
                ) {
                  if (response.data.results[0].success) {
                    this.toastSuccess({
                      text:
                        this.$t("doi.dataciteMetadataUpdated") +
                        " DataCite response: " +
                        response.data.results[0].content,
                      timeout: 5000
                    });
                    this.setCurrentTimeToDataCiteDateFields();
                    this.showMetadataButton = false;
                    this.showMetadataUpdateMessage = false;
                    this.setLoadingState(false);
                    this.add(true, "doi");
                    this.checkDoiUrl();
                  } else {
                    this.toastError({
                      text: this.$t("doi.dataciteMetadataUpdateFailed")
                    });
                    this.setLoadingState(false);
                  }
                }
              }
            }
          );
        } else this.toastInfo({ text: this.$t("messages.userCancelled") });
      } else this.toastError({ text: this.$t("messages.checkForm") });
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
          this.setLoadingState(true);
          this.setLoadingType("fetch");

          fetchRegisterDoiUrlToDataCite(this.$route.params.id).then(
            response => {
              if (response.status === 200) {
                if (
                  typeof response.data.results !== "undefined" &&
                  response.data.results.length > 0
                ) {
                  if (response.data.results[0].success) {
                    this.toastSuccess({
                      text:
                        this.$t("doi.dataciteUrlUpdated") +
                        " DataCite response: " +
                        response.data.results[0].content,
                      timeout: 5000
                    });
                    this.showDoiUrlButton = false;
                    this.showDoiUrlUpdateMessage = false;
                  } else {
                    this.toastError({
                      text: this.$t("doi.dataciteUrlUpdateFailed")
                    });
                  }
                }
              }
              this.setLoadingState(false);
            }
          );
        } else this.toastInfo({ text: this.$t("messages.userCancelled") });
      } else this.toastError({ text: this.$t("messages.checkForm") });
    },

    // Checks metadata from DataCite
    checkMetadata() {
      fetchCheckMetadataInDataCite(this.$route.params.id).then(response => {
        if (response.status === 200) {
          if (
            typeof response.data.results !== "undefined" &&
            response.data.results.length > 0
          ) {
            if (response.data.results[0].success) {
              if (response.data.results[0].doi_metadata_needs_update) {
                this.showMetadataButton = true;
                this.showMetadataUpdateMessage = true;
                this.sarvXML = response.data.results[0].sarv_xml;
                this.dataciteXML = response.data.results[0].datacite_xml;
                this.toastInfo({
                  text: this.$t("doi.dataciteMetadataNeedsUpdate")
                });
              } else {
                this.showMetadataButton = false;
                this.showMetadataUpdateMessage = false;
                this.sarvXML = response.data.results[0].sarv_xml;
                this.dataciteXML = response.data.results[0].datacite_xml;
                if (
                  typeof response.data.results[0].error !== "undefined" &&
                  response.data.results[0].error_et !== "undefined"
                ) {
                  if (this.$i18n.locale === "ee")
                    this.toastInfo({ text: response.data.results[0].error_et });
                  else this.toastInfo({ text: response.data.results[0].error });
                }
              }
            } else if (response.data.results[0].error_code === 404) {
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
            typeof response.data.results !== "undefined" &&
            response.data.results.length > 0
          ) {
            if (response.data.results[0].success) {
              if (response.data.results[0].doi_url_needs_update) {
                this.showDoiUrlButton = true;
                this.showDoiUrlUpdateMessage = true;
                this.doiURL = response.data.results[0].doi_url;
                this.dataciteURL = response.data.results[0].datacite_url;
              }
            } else if (response.data.results[0].error_code === 204) {
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
          id: 3,
          licence: "CC BY 4.0",
          licence_en: "CC BY 4.0"
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
          if (creatorsList && creatorsList.length > 0) {
            creatorsList.forEach(creator => {
              let firstName = creator.substring(
                0,
                creator.lastIndexOf(".") + 1
              );
              let lastName = creator.substring(creator.lastIndexOf(".") + 1);
              let formattedName = `${lastName.trim()}, ${firstName.trim()}`;
              formattedCreatorsList.push(formattedName);

              this.relatedData.doi_agent.count++;
              this.relatedData.doi_agent.results.push({
                affiliation: "",
                orcid: "",
                name: formattedName,
                agent: null,
                agent_type: {
                  id: 1,
                  value: "Creator"
                }
                // agent_type__value: "Creator"
              });
            });

            this.doi.creators = formattedCreatorsList.join("; ");
          }
        }
        if (egfDoiObject.title) {
          this.doi.title = egfDoiObject.title;
          this.doi.language = {
            id: 4,
            value: "eesti",
            value_en: "Estonian"
          };
        }
        if (egfDoiObject.title_eng) {
          this.doi.title_tranlated = egfDoiObject.title_eng;
          this.doi.title_translated_language = {
            id: 1,
            value: "inglise",
            value_en: "English"
          };
        }
        if (
          egfDoiObject.title_orig &&
          egfDoiObject.title !== egfDoiObject.title_orig
        ) {
          this.doi.title_alternative = egfDoiObject.title_orig;
          const cyrillicPattern = /[а-яА-ЯЁё]/;
          if (egfDoiObject.title_orig.match(cyrillicPattern)) {
            this.doi.language = {
              id: 5,
              value: "vene",
              value_en: "Russian"
            };
          }
        }
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

          if (funderList && funderList.length > 0) {
            funderList.forEach(funder => {
              this.relatedData.doi_agent.count++;
              this.relatedData.doi_agent.results.push({
                affiliation: "",
                orcid: "",
                agent: null,
                name: funder,
                agent_type: {
                  id: 22,
                  value: "Sponsor"
                }
                // 22,
                // agent_type__value: "Sponsor"
              });
            });
          }
        }
        if (egfDoiObject.performer) {
          let performerList = [];
          if (egfDoiObject.performer.includes(","))
            performerList = egfDoiObject.performer.split(",");
          else performerList.push(egfDoiObject.performer);

          if (performerList && performerList.length > 0) {
            performerList.forEach(performer => {
              this.relatedData.doi_agent.count++;
              this.relatedData.doi_agent.results.push({
                affiliation: "",
                orcid: "",
                agent: null,
                name: performer,
                agent_type: {
                  id: 12,
                  value: "Producer"
                }
                // agent_type__value: "Producer"
              });
            });
          }
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

        if (
          egfDoiObject.min_resource &&
          egfDoiObject.min_resource.trim().length > 0
        )
          this.doi.subjects +=
            this.doi.subjects.length > 0
              ? ", " + egfDoiObject.min_resource
              : egfDoiObject.min_resource;

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
              this.swapCoordinates(egfDoiObject.geometry.coordinates[0]);

              let coordinates = JSON.stringify(
                egfDoiObject.geometry.coordinates[0]
              );
              this.relatedData.doi_geolocation.count++;
              this.relatedData.doi_geolocation.results.push({
                polygon: coordinates
              });
            } else if (egfDoiObject.geometry.type === "MultiPolygon") {
              egfDoiObject.geometry.coordinates.forEach(coordinates => {
                this.swapCoordinates(coordinates[0]);

                this.relatedData.doi_geolocation.count++;
                this.relatedData.doi_geolocation.results.push({
                  polygon: JSON.stringify(coordinates[0])
                });
              });
            }
          }
        }
      }
    },

    swapCoordinates(arr) {
      if (arr && arr.length > 0) {
        arr.forEach(el => this.swapArrayElements(el, 0, 1));
      }
    },

    swapArrayElements(arr, indexA, indexB) {
      if (arr && arr[indexA] && arr[indexB]) {
        let temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
      }
    },

    addCreatorsToRelatedData() {
      let creators = this.doi.creators;
      this.relatedData["doi_agent"] = { count: 0, results: [] };
      let listOfCreators = [];

      if (creators && creators.trim().length > 0) {
        if (creators.includes(";")) listOfCreators = creators.split(";");
        else listOfCreators.push(creators);
      }

      if (listOfCreators.length > 0) {
        listOfCreators.forEach((creator, index) => {
          let doiAgentObject = {};
          if (creator.trim().length > 0) {
            fetchAgentUsingName(creator.trim())
              .then(
                response => {
                  let agentObject = this.handleResponse(response)[0];

                  if (this.isNotEmpty(agentObject)) {
                    doiAgentObject.name = agentObject.agent;
                    doiAgentObject.orcid = agentObject.orcid;
                    doiAgentObject.affiliation =
                      agentObject.institution__institution_name_en;
                    doiAgentObject.agent = {
                      id: agentObject.id,
                      agent: agentObject.agent
                    };
                    doiAgentObject.agent_type = {
                      id: 1,
                      value: "Creator"
                    };
                    doiAgentObject.sort = index + 1;
                    if (
                      !this.relatedData["doi_agent"].results.find(
                        agent =>
                          agent.id === doiAgentObject.agent ||
                          agent.name === doiAgentObject.name
                      )
                    ) {
                      this.relatedData["doi_agent"].count++;
                      this.relatedData["doi_agent"].results.push(
                        doiAgentObject
                      );
                    } else
                      this.toastError({
                        text: `Author(s) with the same information already exists!`
                      });
                  } else {
                    doiAgentObject.name = creator.trim();
                    doiAgentObject.agent_type = {
                      id: 1,
                      value: "Creator"
                    };
                    doiAgentObject.sort = index + 1;
                    if (
                      !this.relatedData["doi_agent"].results.find(
                        agent => agent.name === doiAgentObject.name
                      )
                    ) {
                      this.relatedData["doi_agent"].count++;
                      this.relatedData["doi_agent"].results.push(
                        doiAgentObject
                      );
                    } else
                      this.toastError({
                        text: `Author(s) with the same name already exists!`
                      });
                  }
                },
                () => {
                  doiAgentObject.name = creator.trim();
                  doiAgentObject.sort = index + 1;
                  if (
                    !this.relatedData["doi_agent"].results.find(
                      agent => agent.name === doiAgentObject.name
                    )
                  ) {
                    this.relatedData["doi_agent"].count++;
                    this.relatedData["doi_agent"].results.push(doiAgentObject);
                  } else
                    this.toastError({
                      text: `Author(s) with the same name already exists!`
                    });
                }
              )
              .then(() => {
                if (this.relatedData["doi_agent"].count > 0) {
                  this.relatedData["doi_agent"].results.sort((a, b) =>
                    a.sort > b.sort ? 1 : -1
                  );
                }
              });
          }
        });
      } else {
        this.relatedData["doi_agent"].count = 0;
        this.relatedData["doi_agent"].results = [];
      }
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "doi", singleFileMetadata);
    },

    addExistingFiles(files) {
      // this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    }
  }
};
</script>

<style scoped>
.diff-inserted {
  background-color: rgba(76, 175, 80, 0.33);
}

.diff-deleted {
  background-color: rgba(244, 67, 54, 0.33);
}

.diff-equal {
  background-color: rgba(33, 150, 243, 0.33);
}

.url-link:hover {
  opacity: 0.7;
}
</style>
