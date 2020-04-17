<template>
  <div class="reference">
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
          <span :class="validate('reference') ? 'green--text' : 'red--text'">{{
            $t("common.requiredFields")
          }}</span>
          <v-icon
            right
            :class="validate('reference') ? 'green--text' : 'red--text'"
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
          <!-- AUTHOR, YEAR and REFERENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="7" class="pa-1">
              <input-wrapper
                v-model="reference.author"
                :color="bodyActiveColor"
                :label="$t('reference.author')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="2" class="pa-1">
              <input-wrapper
                v-model="reference.year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
                use-state
                type="number"
                @change="buildReferenceField"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="reference.reference"
                :color="bodyActiveColor"
                :label="$t('reference.reference')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="reference.title"
                :color="bodyActiveColor"
                :label="$t('reference.title')"
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
          <!-- TYPE, LANGUAGE and PAGES -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="reference.type"
                :color="bodyActiveColor"
                :items="autocomplete.types"
                :loading="autocomplete.loaders.types"
                :item-text="commonLabel"
                :label="$t('common.type')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="reference.language"
                :color="bodyActiveColor"
                :items="autocomplete.languages"
                :loading="autocomplete.loaders.languages"
                :item-text="commonLabel"
                :label="$t('reference.language')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.pages"
                :color="bodyActiveColor"
                :label="$t('reference.pages')"
              />
            </v-col>
          </v-row>

          <!-- JOURNAL -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="reference.journal"
                :color="bodyActiveColor"
                :items="autocomplete.journals"
                :loading="autocomplete.loaders.journals"
                item-text="journal_name"
                :label="$t('reference.journal')"
                is-link
                route-object="journal"
                is-searchable
                v-on:search:items="autocompleteJournalSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.journal_additional"
                :color="bodyActiveColor"
                :label="$t('reference.journalAdditional')"
              />
            </v-col>

            <v-col cols="12" md="2" class="pa-1">
              <input-wrapper
                v-model="reference.volume"
                :color="bodyActiveColor"
                :label="$t('reference.volume')"
              />
            </v-col>

            <v-col cols="12" md="2" class="pa-1">
              <input-wrapper
                v-model="reference.number"
                :color="bodyActiveColor"
                :label="$t('reference.number')"
              />
            </v-col>
          </v-row>

          <!-- BOOK and BOOK_EDITOR -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="reference.book"
                :color="bodyActiveColor"
                :label="$t('reference.book')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="reference.book_editor"
                :color="bodyActiveColor"
                :label="$t('reference.book_editor')"
              />
            </v-col>
          </v-row>

          <!-- PARENT_REFERENCE, PUBLISHER and PUBLISHER_PLACE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="reference.parent_reference"
                :color="bodyActiveColor"
                :items="autocomplete.reference"
                :loading="autocomplete.loaders.reference"
                item-text="reference"
                :label="$t('reference.parentReference')"
                is-link
                route-object="reference"
                is-searchable
                v-on:search:items="autocompleteReferenceSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.publisher"
                :color="bodyActiveColor"
                :label="$t('reference.publisher')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.publisher_place"
                :color="bodyActiveColor"
                :label="$t('reference.publisherPlace')"
              />
            </v-col>
          </v-row>

          <!-- DOI and URL-->
          <div class="d-flex flex-wrap">
            <!-- DOI -->
            <div class="flex-grow-1">
              <div class="d-flex flex-wrap">
                <div class="flex-grow-1 pa-1">
                  <input-wrapper
                    v-model="reference.doi"
                    :color="bodyActiveColor"
                    label="DOI:"
                  />
                </div>

                <div class="pa-1" v-if="reference.doi">
                  <v-btn
                    icon
                    :href="getDoiUrl(reference.doi)"
                    :title="getDoiUrl(reference.doi)"
                    target="DoiWindow"
                    :color="bodyActiveColor"
                  >
                    <v-icon>fas fa-external-link-alt</v-icon>
                  </v-btn>
                </div>

                <div class="pa-1 align-self-center">
                  <v-btn
                    id="check-doi"
                    :disabled="!isNotEmpty(reference.doi)"
                    @click="checkDoi"
                    class="text-none"
                    :color="bodyActiveColor"
                    dark
                  >
                    {{ $t("reference.checkDoi") }}
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- URL -->
            <div class="flex-grow-1 pa-1">
              <input-wrapper
                v-model="reference.url"
                :color="bodyActiveColor"
                label="URL:"
                use-custom-state
                :error="!isValidUrl"
              />
              <p class="m-0 caption" v-if="!isValidUrl">
                {{ $t("add.errors.url") }}. (e.g.,
                <b>https://www.google.com</b>)
              </p>
            </div>

            <div class="pa-1" v-if="reference.url && isValidUrl">
              <v-btn
                icon
                :href="reference.url"
                :title="reference.url"
                target="UrlWindow"
                :color="bodyActiveColor"
              >
                <v-icon>fas fa-external-link-alt</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- IS ESTONIAN REFERENCE, IS ESTONIAN AUTHOR, OPEN_ACCESS and LICENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="reference.is_estonian_reference"
                :color="bodyActiveColor"
                :label="$t('reference.is_estonian_reference')"
                @change="
                  reference.is_estonian_reference = !reference.is_estonian_reference
                "
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="reference.is_estonian_author"
                :color="bodyActiveColor"
                :label="$t('reference.is_estonian_author')"
                @change="
                  reference.is_estonian_author = !reference.is_estonian_author
                "
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="reference.is_oa"
                :color="bodyActiveColor"
                :label="$t('reference.is_oa')"
                @change="reference.is_oa = !reference.is_oa"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="reference.licence"
                :color="bodyActiveColor"
                :items="autocomplete.licence"
                :loading="autocomplete.loaders.licence"
                :item-text="licenceLabel"
                :label="$t('common.licence')"
              />
            </v-col>
          </v-row>

          <!-- REFERENCE KEYWORDS -->
          <div class="d-flex justify-content-start flex-wrap pa-1">
            <div class="mr-3 flex-grow-1">
              <autocomplete-wrapper
                v-model="relatedData.keyword"
                :color="bodyActiveColor"
                :items="autocomplete.keyword"
                :loading="autocomplete.loaders.keyword"
                item-text="keyword"
                :label="$t('reference.referenceKeyword')"
                is-link
                route-object="keyword"
                is-searchable
                v-on:search:items="autocompleteKeywordSearch"
                :multiple="true"
                v-on:chip:close="
                  relatedData.keyword.splice(
                    relatedData.keyword.indexOf($event),
                    1
                  )
                "
                :menu-props="{ maxHeight: 208 }"
              />
            </div>

            <div class="mr-2 my-1 align-self-end">
              <v-btn
                icon
                :title="$t('add.new')"
                @click="
                  windowOpenNewTab('/keyword/add', {
                    attachment: JSON.stringify(reference)
                  })
                "
                target="newKeywordWindow"
                color="green"
              >
                <v-icon>fas fa-plus</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </transition>
    </v-card>

    <!-- OTHER INFO -->
    <v-card
      class="mt-2"
      id="block-other"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.other = !block.other">
          <span>{{ $t("reference.otherData") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.other = !block.other"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.other ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.other" class="pa-1">
          <!-- AUTHOR_ORIGINAL -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="reference.author_original"
                :color="bodyActiveColor"
                :label="$t('reference.author_original')"
              />
            </v-col>
          </v-row>

          <!-- TITLE ORIGINAL, TITLE TRANSLATED and TITLE TRANSLATED LANGUAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="reference.title_original"
                :color="bodyActiveColor"
                :label="$t('reference.titleOriginal')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="reference.title_translated"
                :color="bodyActiveColor"
                :label="$t('reference.titleTranslated')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="reference.title_translated_language"
                :color="bodyActiveColor"
                :items="autocomplete.languages"
                :loading="autocomplete.loaders.languages"
                :item-text="commonLabel"
                :label="$t('reference.titleTranslatedLanguage')"
              />
            </v-col>
          </v-row>

          <!-- BOOK_ORIGINAL, BOOK_TRANSLATED and BOOK_TRANSLATED_LANGUAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.book_original"
                :color="bodyActiveColor"
                :label="$t('reference.bookOriginal')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.book_translated"
                :color="bodyActiveColor"
                :label="$t('reference.book_translated')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="reference.book_translated_language"
                :color="bodyActiveColor"
                :items="autocomplete.languages"
                :loading="autocomplete.loaders.languages"
                :item-text="commonLabel"
                :label="$t('reference.book_translated_language')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="reference.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS_PRIVATE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="reference.remarks_private"
                :color="bodyActiveColor"
                :label="$t('reference.remarksPrivate')"
              />
            </v-col>
          </v-row>

          <!-- LOCATION_TXT, ISBN and ISSN -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.location_txt"
                :color="bodyActiveColor"
                :label="$t('reference.location_txt')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.isbn"
                :color="bodyActiveColor"
                label="ISBN:"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="reference.issn"
                :color="bodyActiveColor"
                label="ISSN:"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- ABSTRACT -->
    <v-card
      class="mt-2"
      id="block-abstract"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.abstract = !block.abstract"
        >
          <span>{{ $t("reference.abstract") }}</span>
          <v-icon right>far fa-sticky-note</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.abstract = !block.abstract"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.abstract ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.abstract" class="pa-1">
          <!-- ABSTRACT and AUTHOR KEYWORDS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof reference.abstract !== 'undefined'"
                v-model="reference.abstract"
                :label="$t('reference.abstract')"
              />
            </v-col>

            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="reference.author_keywords"
                :color="bodyActiveColor"
                :label="$t('reference.authorKeywords')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- DIGITAL VERSION (PDF) -->
    <v-card
      class="mt-2"
      id="block-digital"
      v-if="$route.meta.isEdit"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.digital = !block.digital"
        >
          <span>{{ $t("reference.relatedTables.attachmentDigital") }}</span>
          <v-icon right>fas fa-file-pdf</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.digital = !block.digital"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.digital ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.digital" class="pa-1">
          <file-upload
            :files-from-object="attachment"
            v-on:file-uploaded="addPDF"
            acceptable-format="application/pdf"
            :is-clearable="false"
            :is-draggable="!(attachment && attachment.length > 0)"
            open-file
          />
        </div>
      </transition>
    </v-card>

    <!-- RELATED FILES -->
    <v-card
      class="mt-2"
      id="block-files"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.files = !block.files">
          <span>{{ $t("reference.relatedTables.attachment") }}</span>
          <v-icon right>fas fa-folder-open</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.files = !block.files"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.files ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.files" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <file-upload
                show-existing
                :files-from-object="relatedData.attachment"
                v-on:update:existing-files="addExistingFiles"
                v-on:file-uploaded="addFiles"
                accept-multiple
                :record-options="$route.meta.isEdit"
                open-file
                acceptable-format="*/*"
                :is-draggable="$route.meta.isEdit"
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
          <span>{{ $t("reference.relatedTables." + tab.name) }}</span>
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
          <v-row v-show="activeTab === 'library'" no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="relatedData.library.results"
                :color="bodyActiveColor"
                :items="autocomplete.library"
                :loading="autocomplete.loaders.library"
                :item-text="libraryTitle"
                :label="$t('reference.libraries')"
                is-link
                route-object="library"
                is-searchable
                v-on:search:items="autocompleteLibraryAgentSearch2"
                :multiple="true"
                v-on:chip:close="
                  relatedData.library.results.splice(
                    relatedData.library.results.indexOf($event),
                    1
                  )
                "
              />
            </v-col>
          </v-row>

          <div v-show="activeTab === 'stratigraphy'">
            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <stratigraphy-table
                  :response="stratigraphyList"
                  :search-parameters="relatedData.searchParameters.stratigraphy"
                  :body-active-color="bodyActiveColor"
                  :body-color="bodyColor"
                />
              </v-col>
            </v-row>

            <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
              <v-btn
                class="mr-2"
                small
                :to="{
                  name: 'Stratigraphy add',
                  query: { reference: JSON.stringify(reference) }
                }"
                target="newStratigraphyWindow"
                :color="bodyActiveColor"
                :dark="isBodyActiveColorDark"
                >{{ $t("add.new") }}</v-btn
              >
              <export-buttons
                v-if="relatedData.stratigraphy.count > 0"
                filename="stratigraphy"
                :table-data="relatedData.stratigraphy.results"
                clipboard-class="stratigraphy-table"
                :body-active-color="bodyActiveColor"
                small
              />
            </v-toolbar>
          </div>

          <div v-show="activeTab === 'taxon'">
            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <taxon-table
                  :response="relatedData.taxon"
                  :search-parameters="relatedData.searchParameters.taxon"
                  :body-active-color="bodyActiveColor"
                  :body-color="bodyColor"
                />
              </v-col>
            </v-row>

            <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
              <v-btn
                class="mr-2"
                small
                :to="{
                  name: 'Taxon add',
                  query: { reference: JSON.stringify(reference) }
                }"
                target="newTaxonWindow"
                :color="bodyActiveColor"
                :dark="isBodyActiveColorDark"
                >{{ $t("add.new") }}</v-btn
              >
              <export-buttons
                v-if="relatedData.taxon.count > 0"
                filename="taxon"
                :table-data="relatedData.taxon.results"
                clipboard-class="taxon-table"
                :body-active-color="bodyActiveColor"
                small
              />
            </v-toolbar>
          </div>

          <locality-reference-table
            v-show="activeTab === 'locality_reference'"
            :response="relatedData.locality_reference"
            :search-parameters="relatedData.searchParameters.locality_reference"
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

    <div class="d-flex justify-content-end mt-2" v-if="$route.meta.isEdit">
      <new-doi-button
        v-if="
          reference &&
            reference.type &&
            reference.type.id > 3 &&
            validate('reference') &&
            isUserAllowedTo('add', 'doi')
        "
        object="reference"
        :data="reference"
        :related-data="relatedData"
        :attachment="attachment"
      />
    </div>

    <!-- IS PRIVATE and IS LOCKED -->
    <div class="d-flex flex-row flex-wrap pa-1">
      <div class="pr-2">
        <checkbox-wrapper
          v-model="reference.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="reference.is_private = !reference.is_private"
        />
      </div>

      <div>
        <checkbox-wrapper
          v-model="reference.is_locked"
          :color="bodyActiveColor"
          :label="$t('reference.is_locked')"
          @change="reference.is_locked = !reference.is_locked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchReference,
  fetchListReferenceTypes,
  fetchListLanguages,
  fetchDoiCheck,
  fetchReferenceKeyword,
  fetchAttachmentLink,
  fetchLocalityReferenceForReference,
  fetchAttachmentForReference,
  fetchLibrariesForReference,
  fetchListLocalityReferenceType,
  fetchListLicences,
  fetchJournalForReference,
  fetchLinkedTaxonReference,
  fetchLinkedStratigraphyReference
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapGetters, mapState } from "vuex";
import NewDoiButton from "../partial/NewDoiButton";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import Editor from "../partial/inputs/Editor";
import FileUpload from "../partial/inputs/FileInput";
import ExportButtons from "../partial/export/ExportButtons";
import StratigraphyTable from "../stratigraphy/StratigraphyTable";
import TaxonTable from "../taxon/TaxonTable";
import LocalityReferenceTable from "./relatedTables/LocalityReferenceTable";
import requestsMixin from "../../mixins/requestsMixin";

export default {
  name: "Reference",
  components: {
    LocalityReferenceTable,
    TaxonTable,
    StratigraphyTable,
    ExportButtons,
    FileUpload,
    Editor,
    CheckboxWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    NewDoiButton
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
    requestsMixin
  ],

  data() {
    return this.setInitialData();
  },

  computed: {
    isValidUrl() {
      if (this.reference.url && this.reference.url.length > 0) {
        let regex = RegExp(
          "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$"
        );
        return regex.test(this.reference.url);
      } else return true;
    },

    ...mapState(["currentUser", "databaseId"]),
    ...mapGetters("user", ["isUserAllowedTo"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    },

    stratigraphyList() {
      let stratigraphy = this.relatedData.stratigraphy.results;
      if (stratigraphy && stratigraphy.length > 0) {
        let mappedList = stratigraphy.map(item => ({
          id: item.stratigraphy,
          stratigraphy: item.stratigraphy__stratigraphy,
          stratigraphy_en: item.stratigraphy__stratigraphy_en,
          type: item.stratigraphy__type,
          type__value: item.stratigraphy__type__value,
          type__value_en: item.stratigraphy__type__value_en,
          rank: item.stratigraphy__rank,
          rank__value: item.stratigraphy__rank__value,
          rank__value_en: item.stratigraphy__rank__value_en,
          scope: item.stratigraphy__scope,
          scope__value: item.stratigraphy__scope__value,
          scope__value_en: item.stratigraphy__scope__value_en
        }));
        return {
          count: this.relatedData.stratigraphy.count,
          results: mappedList
        };
      } else return this.relatedData.stratigraphy;
    }
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
        searchHistory: "referenceSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_REFERENCES",
        title: "header.references",
        object: "reference",
        field: "reference",
        block: this.block
      });
    } else {
      if (this.$route.params.journal) {
        this.reference.journal = this.$route.params.journal;
      }
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters": {
      handler: function() {
        if (this.$route.meta.isEdit) {
          this.loadRelatedData(this.activeTab);
        }
      },
      deep: true
    },
    // This value is changed in formManipulation.js when file upload is successful (value will be savedObjectsId)
    // Do not remember why was it done. Commenting it cause of #382 https://github.com/geocollections/sarv-edit/issues/382
    isFileAddedAsObject: {
      handler: function(newVal) {
        if (this.isNotEmpty(newVal)) {
          // fetchAttachmentForReference(this.$route.params.id).then(
          //   response => (this.attachment = this.handleResponse(response))
          // );
        }
      }
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
          { name: "library", iconClass: "fas fa-book" },
          { name: "stratigraphy", iconClass: "fas fa-layer-group" },
          { name: "taxon", iconClass: "fas fa-pastafarianism" },
          { name: "locality_reference", iconClass: "fas fa-globe" }
        ],
        searchHistory: "referenceSearchHistory",
        activeTab: "library",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "reference",
          "year",
          "author",
          "title",
          "title_original",
          "title_translated",
          "type",
          "language",
          "journal",
          "journal_additional",
          "volume",
          "number",
          "pages",
          "book_editor",
          "book",
          "book_original",
          "publisher",
          "publisher_place",
          "doi",
          "url",
          "isbn",
          "issn",
          "abstract",
          "author_keywords",
          "remarks",
          "remarks_private",
          "location_txt",
          "book_editor",
          "figures",
          "is_locked",
          "is_oa",
          "is_private",
          "is_estonian_reference",
          "is_estonian_author",
          "language",
          "title_translated_language",
          "licence",
          "author_original",
          "book_translated",
          "book_translated_language",
          "parent_reference"
        ],
        autocomplete: {
          loaders: {
            types: false,
            languages: false,
            journals: false,
            keyword: false,
            locality: false,
            attachment: false,
            attachment3: false, // For #158, regarding p-2
            library: false,
            locality_reference_type: false,
            licence: false,
            reference: false
          },
          types: [],
          languages: [],
          journals: [],
          keyword: [],
          locality: [],
          attachment: [],
          library: [],
          locality_reference_type: [],
          licence: [],
          reference: []
        },
        requiredFields: ["reference", "year", "author", "title"],
        reference: {
          year: "" // Adding it because of reactivity issue
        },
        previousRecord: {},
        nextRecord: {},
        searchParameters: this.setDefaultSearchParameters(),
        attachment: [],
        doi: {},
        block: {
          requiredFields: true,
          info: true,
          other: true,
          abstract: true,
          digital: true,
          files: true
        },
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
        fetchReference(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "reference", this.handleResponse(response)[0]);
            // this.reference = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.reference);

            this.removeUnnecessaryFields(this.reference, this.copyFields);
            this.$emit("data-loaded", this.reference);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        this.loadAutocompleteFields(false, true);

        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchListReferenceTypes().then(
          response => (this.autocomplete.types = this.handleResponse(response))
        );
        fetchListLanguages().then(
          response =>
            (this.autocomplete.languages = this.handleResponse(response))
        );
        fetchListLocalityReferenceType().then(
          response =>
            (this.autocomplete.locality_reference_type = this.handleResponse(
              response
            ))
        );
        fetchListLicences().then(
          response =>
            (this.autocomplete.licence = this.handleResponse(response))
        );
      }

      if (relatedDataAutocompleteFields) {
        fetchReferenceKeyword(this.$route.params.id).then(response => {
          let referenceKeyword = this.handleResponse(response);
          this.relatedData.keyword = referenceKeyword.map(entity => {
            return {
              keyword: entity.keyword__keyword,
              id: entity.keyword
            };
          });
          if (this.isNotEmpty(this.relatedData.keyword)) {
            this.autocomplete.keyword = this.relatedData.keyword;
          }
        });

        fetchAttachmentLink(this.$route.params.id).then(response => {
          let attachment = this.handleResponse(response);

          this.relatedData.attachment = attachment.map(entity => {
            return {
              id: entity.attachment,
              description: entity.attachment__description,
              description_en: entity.attachment__description_en,
              author__agent: entity.attachment__author__agent,
              uuid_filename: entity.attachment__uuid_filename,
              remarks: entity.attachment__remarks,
              original_filename: entity.attachment__original_filename
            };
          });
          if (this.isNotEmpty(this.relatedData.attachment)) {
            this.autocomplete.attachment = this.relatedData.attachment;
          }
        });

        fetchAttachmentForReference(this.$route.params.id).then(
          response => (this.attachment = this.handleResponse(response))
        );
        fetchLibrariesForReference(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          this.relatedData.library = {
            count: handledResponse.length,
            results: handledResponse
          };
          if (this.relatedData.library.count > 0) {
            this.autocomplete.library = this.relatedData.library.results;
          }
        });
        // fetchListLocalityReferenceType().then(response => this.autocomplete.locality_reference_type = this.handleResponse(response))
      }
    },

    setDefaultRelatedData() {
      return {
        attachment: [],
        keyword: [],
        library: {
          count: 0,
          results: []
        },
        stratigraphy: {
          count: 0,
          results: []
        },
        taxon: {
          count: 0,
          results: []
        },
        locality_reference: {
          count: 0,
          results: []
        },
        searchParameters: {
          locality_reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["locality"],
            sortDesc: [true]
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          keyword: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          stratigraphy: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

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

      // Adding related data
      uploadableObject.related_data = {};
      if (this.isNotEmpty(this.relatedData.keyword))
        uploadableObject.related_data.keyword = this.relatedData.keyword;
      else uploadableObject.related_data.keyword = null;

      if (this.isNotEmpty(this.relatedData.attachment))
        uploadableObject.related_data.attachment = this.relatedData.attachment;
      else uploadableObject.related_data.attachment = null;

      if (
        typeof this.relatedData.library.results !== "undefined" &&
        this.relatedData.library.results !== null &&
        this.relatedData.library.results.length > 0
      ) {
        uploadableObject.related_data.library = cloneDeep(
          this.relatedData.library.results
        );
        uploadableObject.related_data.library.forEach((lib, index) => {
          uploadableObject.related_data.library[index] = {
            id: lib.library ? lib.library : lib.id
          };
        });
      } else uploadableObject.related_data.library = null;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        if (this.relatedData.locality_reference.count > 0) {
          let clonedLocalities = cloneDeep(
            this.relatedData.locality_reference.results
          );
          uploadableObject.related_data.locality_reference = clonedLocalities
            .filter(entity => this.isNotEmpty(entity.locality))
            .map(loc_ref => {
              return {
                locality: loc_ref.locality.id,
                pages: loc_ref.pages ? loc_ref.pages : null,
                figures: loc_ref.figures ? loc_ref.figures : null,
                remarks: loc_ref.remarks ? loc_ref.remarks : null
              };
            });
        }
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.reference.type = {
        id: obj.type__id,
        value: obj.type__value,
        value_en: obj.type__value_en,
        ris_type: obj.type__ris_type
      };
      this.reference.language = {
        id: obj.language__id,
        value: obj.language__value,
        value_en: obj.language__value_en,
        iso1: obj.language__iso1
      };
      if (this.isNotEmpty(obj.journal__id)) {
        this.reference.journal = {
          id: obj.journal__id,
          journal_name: obj.journal__journal_name
        };
        this.autocomplete.journals.push(this.reference.journal);
      }
      if (this.isNotEmpty(obj.parent_reference)) {
        this.reference.parent_reference = {
          id: obj.parent_reference,
          reference: obj.parent_reference__reference
        };
        this.autocomplete.reference.push(this.reference.parent_reference);
      }
      this.reference.title_translated_language = {
        id: obj.title_translated_language,
        value: obj.title_translated_language__value,
        value_en: obj.title_translated_language__value_en
      };
      this.reference.licence = {
        id: obj.licence,
        licence: obj.licence__licence,
        licence_en: obj.licence__licence_en
      };
    },

    loadRelatedData(object) {
      let query;

      if (object === "library") {
        query = fetchLibrariesForReference(this.$route.params.id);
      } else if (object === "stratigraphy") {
        query = fetchLinkedStratigraphyReference(
          this.$route.params.id,
          this.relatedData.searchParameters.stratigraphy
        );
      } else if (object === "taxon") {
        query = fetchLinkedTaxonReference(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon
        );
      } else if (object === "locality_reference") {
        query = fetchLocalityReferenceForReference(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_reference
        );
      }

      query.then(response => {
        if (object === "library") {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        } else {
          this.$set(this.relatedData[object], "count", response.data.count);
          this.$set(
            this.relatedData[object],
            "results",
            this.handleResponse(response)
          );
        }
      });
    },

    setDefaultSearchParameters() {
      return {
        author: null,
        year: null,
        title: null,
        bookJournal: null,
        abstractRemarks: null,
        keywords: null,
        id: null,
        libraryAuthorIdTitle: null,
        userAdded: null,
        isEstonianReference: null,
        isEstonianAuthor: null,
        solrSearch: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    customLabelForAttachment(option) {
      if (this.$i18n.locale === "ee")
        return `${option.id} - (${option.description}) (${option.author__agent})`;
      return `${option.id} - (${option.description_en}) (${option.author__agent})`;
    },

    customLabelForLocality(option) {
      if (this.$i18n.locale === "ee")
        return `${option.id} - (${option.locality})`;
      return `${option.id} - (${option.locality_en})`;
    },

    customLabelForLibrary(option) {
      if (this.$i18n.locale === "ee")
        return `${option.library} - (${option.library__title})`;
      return `${option.library} - (${option.library__title_en})`;
    },

    checkDoi() {
      this.setLoadingState(true);
      this.setLoadingType("fetch");
      fetchDoiCheck(this.reference.doi).then(
        response => {
          this.setLoadingState(false);
          if (response.status === 200) {
            if (response.data.status === "ok") {
              this.updateFieldsUsingDoi(response.data.message);
            }
          }
        },
        () => {
          // console.log(errResponse)
          this.setLoadingState(false);
          this.toastError({ text: this.$t("reference.doiCheckUnsuccessful") });
        }
      );
    },

    buildReferenceField(year) {
      if (
        !this.$route.meta.isEdit &&
        year &&
        year.length > 2 &&
        this.reference.author &&
        this.reference.author.length > 0
      ) {
        let authorForReferenceField = "";
        let countOfCommas = this.reference.author.split(",").length - 1;

        if (countOfCommas === 1) {
          // Surname, F.,
          authorForReferenceField = this.reference.author + ",";
        } else if (countOfCommas === 3) {
          let authorList = this.reference.author.split(".,");
          // Surname & Surname,
          authorForReferenceField =
            authorList[0].split(",")[0] +
            " &" +
            authorList[1].split(",")[0] +
            ",";
        } else if (countOfCommas > 4) {
          // Surname et al.,
          authorForReferenceField =
            this.reference.author.split(",")[0] + " et al.,";
        }

        if (authorForReferenceField.length > 0) {
          this.reference.reference = `${authorForReferenceField} ${year}`;
        }
      }
    },

    updateFieldsUsingDoi(data) {
      let reference = "";

      /* YEAR */
      if (data["published-print"]) {
        if (data["published-print"]["date-parts"].length > 0) {
          this.reference.year =
            data["published-print"]["date-parts"][0][0] + "";
          reference = this.reference.year;
        }
      } else if (data.issued) {
        if (data.issued["date-parts"].length > 0) {
          this.reference.year = data.issued["date-parts"][0][0] + "";
          reference = this.reference.year;
        }
      }

      /* AUTHOR */
      if (data.author && data.author.length > 0) {
        let author = "";
        let authorForReferenceField = "";

        // Author for reference field
        if (data.author.length === 1)
          authorForReferenceField = data.author[0].family + ", ";
        else if (data.author.length === 2)
          authorForReferenceField =
            data.author[0].family + " & " + data.author[1].family + ", ";
        else if (data.author.length > 2)
          authorForReferenceField = data.author[0].family + " et al., ";

        for (let item in data.author) {
          if (
            typeof data.author[item].given !== "undefined" &&
            data.author[item].given.includes(" ")
          ) {
            let given = data.author[item].given.split(" ");
            let givenFormatted = given.map((name, index) =>
              given[index].charAt(0).toUpperCase()
            ); // ['Test', 'hello'] --> ['T', 'H']

            // If family is all caps then change it
            if (
              data.author[item].family ===
              data.author[item].family.toUpperCase()
            ) {
              // Todo: If caps contains '-' then add use case
              // First name is abbreviated
              author +=
                data.author[item].family.charAt(0).toUpperCase() +
                data.author[item].family.substring(1).toLowerCase() +
                ", " +
                givenFormatted.join(". ") +
                "., ";
            } else {
              // First name is abbreviated
              author +=
                data.author[item].family +
                ", " +
                givenFormatted.join(". ") +
                "., ";
            }
          } else {
            if (
              data.author[item].family ===
              data.author[item].family.toUpperCase()
            ) {
              author +=
                data.author[item].family.charAt(0).toUpperCase() +
                data.author[item].family.substring(1).toLowerCase() +
                ", " +
                data.author[item].given.charAt(0).toUpperCase() +
                "., ";
            } else {
              author +=
                data.author[item].family +
                ", " +
                data.author[item].given.charAt(0).toUpperCase() +
                "., ";
            }
          }
        }
        this.reference.author = author.trim().slice(0, -1);
        reference = authorForReferenceField + reference;
      }

      this.reference.reference = reference;

      this.reference.language = {
        id: 1,
        value: "inglise",
        value_en: "English"
      };

      if (data["container-title"] && data["container-title"].length > 0) {
        let journalName = data["container-title"][0];
        fetchJournalForReference(journalName).then(response => {
          let journal = this.handleResponse(response);
          if (journal.length === 1)
            this.reference.journal = {
              id: journal[0].id,
              journal_name: journal[0].journal_name
            };
        });
      }

      if (data.title && data.title.length > 0)
        this.reference.title = data.title[0];
      if (data.volume) this.reference.volume = data.volume;
      if (data.issue) this.reference.number = data.issue;
      if (data.page) {
        if (
          typeof this.reference.pages !== "undefined" &&
          this.reference.pages !== null
        ) {
          if (!this.reference.pages.includes("-"))
            this.reference.pages = data.page;
          else if (
            this.reference.pages.includes("-") &&
            data.page.includes("-")
          )
            this.reference.pages = data.page;
        } else {
          this.reference.pages = data.page;
        }
      }
      // if (data.URL) this.reference.url = data.URL
      if (data.publisher) {
        if (data.type !== "journal-article")
          this.reference.publisher = data.publisher;
      }
      if (data.type === "journal-article") {
        this.reference.type = {
          id: 1,
          value: "artikkel ajakirjas",
          value_en: "article in journal"
        };
      }

      this.toastInfo({ text: this.$t("reference.doiCheckSuccessful") });
    },

    addPDF(fileData) {
      this.addFileAsObject(fileData, "reference");
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "reference");
    },

    addExistingFiles(files) {
      this.relatedData.attachment = files;
    }
  }
};
</script>

<style scoped></style>
