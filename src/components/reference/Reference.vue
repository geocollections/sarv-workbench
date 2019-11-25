<template>
  <div class="reference">
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
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.requiredFields = !block.requiredFields">
          <span :class="validate('reference') ? 'green--text' : 'red--text'">{{
            $t("specimen.requiredFields")
          }}</span>
          <v-icon
            right
            :class="validate('reference') ? 'green--text' : 'red--text'"
          >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.requiredFields = !block.requiredFields" :color="bodyActiveColor">
          <v-icon>{{
            block.requiredFields ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.requiredFields" class="px-1 pt-1 pb-2">
          <!-- REFERENCE and YEAR -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`reference`">{{ $t("reference.reference") }}:</label>
              <b-form-input
                size="sm"
                id="reference"
                v-model="reference.reference"
                :state="isNotEmpty(reference.reference)"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="2" class="px-1">
              <label :for="`year`">{{ $t("reference.year") }}:</label>
              <b-form-input
                size="sm"
                id="year"
                v-model="reference.year"
                :state="isNotEmpty(reference.year)"
                type="number"
              ></b-form-input>
            </v-col>

            <!-- AUTHOR -->
            <v-col cols="7" class="px-1">
              <label :for="`author`">{{ $t("reference.author") }}:</label>
              <b-form-input
                size="sm"
                id="author"
                v-model="reference.author"
                :state="isNotEmpty(reference.author)"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`title`">{{ $t("reference.title") }}:</label>
              <b-form-textarea
                size="sm"
                id="title"
                v-model="reference.title"
                :state="isNotEmpty(reference.title)"
                type="text"
                :rows="1"
                :max-rows="4"
              ></b-form-textarea>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{
            $t("specimen.generalInfo")
          }}</span>
          <v-icon
            right
          >fas fa-project-diagram</v-icon
          >
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
          <!-- TYPE, LANGUAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`type`">{{ $t("reference.type") }}:</label>
              <vue-multiselect
                v-model="reference.type"
                id="type"
                :options="autocomplete.types"
                track-by="id"
                :label="commonLabel"
                :loading="autocomplete.loaders.types"
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

            <v-col cols="12" md="4" class="px-1">
              <label :for="`language`">{{ $t("reference.language") }}:</label>
              <vue-multiselect
                v-model="reference.language"
                id="language"
                :options="autocomplete.languages"
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

            <v-col cols="12" md="4" class="px-1">
              <label :for="`pages`">{{ $t("reference.pages") }}:</label>
              <b-form-input
                size="sm"
                id="pages"
                v-model="reference.pages"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- JOURNAL -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`journal`">{{ $t("reference.journal") }}:</label>
              <vue-multiselect
                v-model="reference.journal"
                id="journal"
                label="journal_name"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.journals"
                :options="autocomplete.journals"
                @search-change="autocompleteJournalSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.journal_name }}</strong>
                </template>
                <template slot="noResult"
                ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`journal_additional`"
              >{{ $t("reference.journalAdditional") }}:</label
              >
              <b-form-input
                size="sm"
                id="journal_additional"
                v-model="reference.journal_additional"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="2" class="px-1">
              <label :for="`volume`">{{ $t("reference.volume") }}:</label>
              <b-form-input
                size="sm"
                id="volume"
                v-model="reference.volume"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="2" class="px-1">
              <label :for="`number`">{{ $t("reference.number") }}:</label>
              <b-form-input
                size="sm"
                id="number"
                v-model="reference.number"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- BOOK and BOOK ORIGINAL -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`book`">{{ $t("reference.book") }}:</label>
              <b-form-input
                size="sm"
                id="book"
                v-model="reference.book"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`book_editor`"
              >{{ $t("reference.book_editor") }}:</label
              >
              <b-form-input
                size="sm"
                id="book_editor"
                v-model="reference.book_editor"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`publisher`">{{ $t("reference.publisher") }}:</label>
              <b-form-input
                size="sm"
                id="publisher"
                v-model="reference.publisher"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`publisher_place`"
              >{{ $t("reference.publisherPlace") }}:</label
              >
              <b-form-input
                size="sm"
                id="publisher_place"
                v-model="reference.publisher_place"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- DOI and URL-->
          <div class="d-flex flex-wrap px-1">
            <!-- DOI -->
            <div class="flex-grow-1">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <label :for="`doi`">
                    DOI:
                    <a
                      v-if="reference.doi"
                      class="link text-primary"
                      :href="getDoiUrl(reference.doi)"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                  </label>
                  <b-form-input
                    size="sm"
                    id="doi"
                    v-model="reference.doi"
                    type="text"
                  ></b-form-input>
                </div>

                <div class="mx-3">
                  <label
                    :for="`check-doi`"
                    style="visibility: hidden; display: block;"
                  >DOI:</label
                  >
                  <v-btn
                    id="check-doi"
                    :disabled="!isNotEmpty(reference.doi)"
                    @click="checkDoi"
                    class="text-none"
                    :color="bodyActiveColor"
                  >
                    {{ $t('reference.checkDoi') }}
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- URL -->
            <div class="flex-grow-1">
              <label :for="`url`">
                URL:
                <a
                  v-if="reference.url && isValidUrl"
                  class="link text-primary"
                  :href="reference.url"
                  target="_blank"
                >
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </label>
              <b-form-input
                size="sm"
                id="url"
                v-model="reference.url"
                type="text"
                :state="isValidUrl"
              ></b-form-input>
              <b-form-text v-if="!isValidUrl"
              >{{ $t("add.errors.url") }}.</b-form-text
              >
            </div>
          </div>
        </div>
      </transition>
    </v-card>

    <!-- OTHER INFO -->
    <v-card
      class="mt-2"
      id="block-other"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.other = !block.other">
          <span>{{
            $t("reference.otherData")
          }}</span>
          <v-icon
            right
          >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.other = !block.other" :color="bodyActiveColor">
          <v-icon>{{
            block.other ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.other" class="px-1 pt-1 pb-2">
          <!-- ABSTRACT and AUTHOR KEYWORDS -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`abstract`">{{ $t("reference.abstract") }}:</label>
              <editor :data.sync="reference.abstract" />
            </v-col>

            <!-- AUTHOR KEYWORDS -->
            <v-col cols="12" class="px-1">
              <label :for="`author_keywords`"
              >{{ $t("reference.authorKeywords") }}:</label
              >
              <b-form-input
                size="sm"
                id="author_keywords"
                v-model="reference.author_keywords"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- TITLE ORIGINAL -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`title_original`"
              >{{ $t("reference.titleOriginal") }}:</label
              >
              <b-form-textarea
                size="sm"
                id="title_original"
                v-model="reference.title_original"
                type="text"
                :rows="1"
                :max-rows="4"
              ></b-form-textarea>
            </v-col>

            <!-- TITLE TRANSLATED -->
            <v-col cols="12" md="6" class="px-1">
              <label :for="`title_translated`"
              >{{ $t("reference.titleTranslated") }}:</label
              >
              <b-form-textarea
                size="sm"
                id="title_translated"
                v-model="reference.title_translated"
                type="text"
                :rows="1"
                :max-rows="4"
              ></b-form-textarea>
            </v-col>
          </v-row>

          <!-- TITLE TRANSLATED LANGUAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`title_translated_language`"
              >{{ $t("reference.titleTranslatedLanguage") }}:</label
              >
              <vue-multiselect
                v-model="reference.title_translated_language"
                id="title_translated_language"
                :options="autocomplete.languages"
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

            <!-- BOOK ORIGINAL -->
            <v-col cols="12" md="6" class="px-1">
              <label :for="`book_original`"
              >{{ $t("reference.bookOriginal") }}:</label
              >
              <b-form-input
                size="sm"
                id="book_original"
                v-model="reference.book_original"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- ISBN and ISSN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`isbn`">ISBN:</label>
              <b-form-input
                size="sm"
                id="isbn"
                v-model="reference.isbn"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`issn`">ISSN:</label>
              <b-form-input
                size="sm"
                id="issn"
                v-model="reference.issn"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS and REFERENCE KEYWORDS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.description = !block.description">
          <span>{{
            $t("reference.description")
          }}</span>
          <v-icon
            right
          >fas fa-pen-fancy</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.description = !block.description" :color="bodyActiveColor">
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <!-- REFERENCE KEYWORDS -->
          <div class="d-flex justify-content-start flex-wrap px-1">
            <div class="mr-3 flex-grow-1">
              <label :for="`keyword`"
              >{{ $t("reference.referenceKeyword") }}:</label
              >
              <vue-multiselect
                v-model="relatedData.keyword"
                id="keyword"
                label="keyword"
                track-by="id"
                :multiple="true"
                :placeholder="$t('add.inputs.keywords')"
                :loading="autocomplete.loaders.keyword"
                :options="autocomplete.keyword"
                @search-change="autocompleteKeywordSearch"
                :internal-search="false"
                :preserve-search="true"
                :close-on-select="false"
                :show-labels="true"
              >
                <template slot="noResult"
                ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="mr-3 my-1 align-self-end">
              <v-btn
                icon
                color="red"
                :title="$t('add.inputs.keywordsRemove')"
                :disabled="!isNotEmpty(relatedData.keyword)"
                @click="relatedData.keyword = null"
              >
                <v-icon>far fa-trash-alt</v-icon>
              </v-btn>
            </div>

            <div class="mr-2 my-1 align-self-end">
              <v-btn
                icon
                :title="$t('add.new')"
                :to="{
                  name: 'Keyword add',
                  query: { reference: JSON.stringify(reference) }
                }"
                target="newKeywordWindow"
                color="green"
              >
                <v-icon>fas fa-plus</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("reference.remarks") }}:</label>
              <b-form-input
                size="sm"
                id="remarks"
                v-model="reference.remarks"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- LOCATION TXT, LICENCE and IS OA -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`location_txt`"
              >{{ $t("reference.location_txt") }}:</label
              >
              <b-form-input
                size="sm"
                id="location_txt"
                v-model="reference.location_txt"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`licence`">{{ $t("reference.licence") }}:</label>
              <vue-multiselect
                v-model="reference.licence"
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

            <v-col cols="12" md="4" class="px-1">
              <label :for="`is_oa`"
              >{{ $t("reference.is_oa") }}:</label
              >
              <v-checkbox
                v-model="reference.is_oa"
                id="is_oa"
                :label="$t('reference.is_oa')"
                hide-details
                :color="bodyActiveColor"
                class="mt-0 pl-1 vuetify-checkbox"
              ></v-checkbox>
            </v-col>
          </v-row>

          <!-- IS ESTONIAN REFERENCE and IS ESTONIAN AUTHOR -->
          <div class="d-flex flex-row flex-wrap mt-2 px-2 pb-1">
            <div class="pr-2">
              <v-checkbox
                v-model="reference.is_estonian_reference"
                id="is_estonian_reference"
                :label="$t('reference.is_estonian_reference')"
                hide-details
                :color="bodyActiveColor"
                class="mt-0 vuetify-checkbox"
              ></v-checkbox>
            </div>

            <div class="pl-2">
              <v-checkbox
                v-model="reference.is_estonian_author"
                id="is_estonian_author"
                :label="$t('reference.is_estonian_author')"
                hide-details
                :color="bodyActiveColor"
                class="mt-0 vuetify-checkbox"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </transition>
    </v-card>

    <!-- DIGITAL VERSION (PDF) -->
    <v-card
      class="mt-2"
      id="block-digital"
      v-if="$route.meta.isEdit"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.digital = !block.digital">
          <span>{{
            $t("reference.relatedTables.attachmentDigital")
          }}</span>
          <v-icon
            right
          >fas fa-file-pdf</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.digital = !block.digital" :color="bodyActiveColor">
          <v-icon>{{
            block.digital ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.digital" class="px-1 pt-1 pb-2">
          <multimedia-component
            v-if="attachment.length === 0"
            v-on:file-uploaded="addPDF"
            :recordOptions="false"
            acceptable-format="application/pdf"
            style="margin-right: -10px; margin-left: -10px"
            :accept-multiple="false"
            :show-try-again-button="true"
          />
          <file-table
            :attachments="attachment"
            object="reference"
            v-if="attachment.length > 0"
          />
        </div>
      </transition>
    </v-card>

    <!-- RELATED FILES -->
    <v-card
      class="mt-2"
      id="block-files"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.files = !block.files">
          <span>{{
            $t("reference.relatedTables.attachment")
          }}</span>
          <v-icon
            right
          >fas fa-folder-open</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.files = !block.files" :color="bodyActiveColor">
          <v-icon>{{
            block.files ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.files" class="px-1 pt-1 pb-2">
          <div class="d-flex justify-content-between px-1">
            <div class="mr-3 flex-grow-1">
              <label :for="`attachment`"
              >{{ $t("reference.attachments") }}:</label
              >
              <vue-multiselect
                v-model="relatedData.attachment"
                id="attachment"
                :custom-label="customLabelForAttachment"
                track-by="id"
                :multiple="true"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.attachment3"
                :options="autocomplete.attachment"
                @search-change="autocompleteAttachmentSearch3"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :close-on-select="false"
                :show-labels="false"
              >
                <template slot="noResult"
                ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="align-self-end">
              <v-btn
                icon
                color="red"
                :disabled="!isNotEmpty(relatedData.attachment)"
                @click="relatedData.attachment = []"
              >
                <v-icon>far fa-trash-alt</v-icon>
              </v-btn>
            </div>
          </div>

          <file-table
            :attachments="relatedData.attachment"
            object="reference"
            v-if="relatedData.attachment.length > 0"
          />
        </div>
      </transition>
    </v-card>

    <!-- RELATED LIBRARIES -->
    <v-card
      class="mt-2"
      id="block-libraries"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.libraries = !block.libraries">
          <span>{{
            $t("reference.relatedTables.library")
          }}</span>
          <v-icon
            right
          >fas fa-book</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.libraries = !block.libraries" :color="bodyActiveColor">
          <v-icon>{{
            block.libraries ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.libraries" class="px-1 pt-1 pb-2">
          <div class="d-flex justify-content-between px-1">
            <div class="mr-3 flex-grow-1">
              <label :for="`library`">{{ $t("reference.libraries") }}:</label>
              <vue-multiselect
                v-model="relatedData.library"
                id="library"
                :custom-label="customLabelForLibrary"
                track-by="library"
                :multiple="true"
                :placeholder="$t('add.inputs.autocomplete')"
                :options="autocomplete.library"
                :loading="autocomplete.loaders.library"
                @search-change="autocompleteLibraryAgentSearch2"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :close-on-select="false"
                :show-labels="false"
              >
                <template slot="noResult"
                ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="align-self-end">
              <v-btn
                icon
                color="red"
                :disabled="!isNotEmpty(relatedData.library)"
                @click="relatedData.library = []"
              >
                <v-icon>far fa-trash-alt</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </transition>
    </v-card>

    <!-- SHOWING RELATED_DATA -->
    <v-card
      class="related-tabs mt-2"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-tabs
        :background-color="bodyColor.split('-')[0] + '-3'"
        show-arrows
        grow
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :active-class="bodyColor.split('-')[0] + '-5 black--text'"
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
            v-if="relatedData[tab.name].length > 0"
            class="font-weight-bold ml-2"
          >
            {{ relatedData[tab.name].length }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pt-3 px-1" flat :color="bodyColor.split('-')[0] + '-5'">
          <locality-reference
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
    <v-card no-gutters class="d-flex flex-row flex-wrap" flat tile :color="bodyColor">
      <v-card flat tile class="mr-4 mb-2" :color="bodyColor">
        <v-checkbox
          v-model="reference.is_private"
          id="is_private"
          :label="$t('reference.is_private')"
          hide-details
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-card>

      <v-card flat tile :color="bodyColor">
        <v-checkbox
          v-model="reference.is_locked"
          id="is_locked"
          :label="$t('reference.is_locked')"
          hide-details
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import sidebarMixin from "../../mixins/sidebarMixin";
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
  fetchJournalForReference
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import { toastError } from "@/assets/js/iziToast/iziToast";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import copyForm from "../../mixins/copyForm";
import LocalityReference from "./relatedTables/LocalityReference";
import FileTable from "../partial/FileTable";
import MultimediaComponent from "../partial/MultimediaComponent";
import { toastInfo } from "../../assets/js/iziToast/iziToast";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import Editor from "../partial/editor/Editor";
import { mapGetters, mapState } from "vuex";
import NewDoiButton from "../partial/NewDoiButton";

export default {
  name: "Reference",
  components: {
    NewDoiButton,
    Editor,
    MultimediaComponent,
    Spinner,
    LocalityReference,
    FileTable
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
    copyForm,
    autocompleteMixin,
    sidebarMixin,
    formSectionsMixin
  ],

  data() {
    return this.setInitialData();
  },

  computed: {
    sidebarUserAction() {
      return this.$store.state["sidebarUserAction"];
    },

    isValidUrl() {
      if (this.reference.url && this.reference.url.length > 0) {
        let regex = RegExp(
          "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$"
        );
        return regex.test(this.reference.url);
      } else return true;
    },

    ...mapState(["currentUser", "databaseId"]),
    ...mapGetters(["isUserAllowedTo"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
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
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    },
    // This value is changed in formManipulation.js when file upload is successful (value will be savedObjectsId)
    isFileAddedAsObject: {
      handler: function(newVal) {
        if (this.isNotEmpty(newVal))
          fetchAttachmentForReference(this.$route.params.id).then(
            response => (this.attachment = this.handleResponse(response))
          );
      }
    }
  },

  methods: {
    setTab(type) {
      this.activeTab = type;
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "locality_reference", iconClass: "fas fa-globe" }
        ],
        searchHistory: "referenceSearchHistory",
        activeTab: "locality_reference",
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
          "licence"
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
            licence: false
          },
          types: [],
          languages: [],
          journals: [],
          keyword: [],
          locality: [],
          attachment: [],
          library: [],
          locality_reference_type: [],
          licence: []
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
          description: true,
          digital: true,
          files: true,
          libraries: true,
          localities: true
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
        this.sendingData = true;
        this.$emit("set-object", "reference");

        fetchReference(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.reference = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.reference);

            this.removeUnnecessaryFields(this.reference, this.copyFields);
            this.$emit("data-loaded", this.reference);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        this.loadAutocompleteFields(false, true);

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => {
          this.loadRelatedData(tab.name);
        });

        this.$on("tab-changed", this.setTab);

        this.$emit("related-data-info", this.relatedTabs.map(tab => tab.name));

        this.setTab("locality_reference");
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
        // fetchListKeywords().then(response => this.autocomplete.keyword = this.handleResponse(response));
        // fetchListLibraries(this.currentUser.id).then(response => this.autocomplete.library = this.handleResponse(response));
        // Related data autocomplete list
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
        });

        fetchAttachmentForReference(this.$route.params.id).then(
          response => (this.attachment = this.handleResponse(response))
        );
        fetchLibrariesForReference(this.$route.params.id).then(
          response => (this.relatedData.library = this.handleResponse(response))
        );
        // fetchListLocalityReferenceType().then(response => this.autocomplete.locality_reference_type = this.handleResponse(response))
      }
    },

    setDefaultRelatedData() {
      return {
        locality_reference: [],
        attachment: [],
        keyword: [],
        locality: [],
        library: [],
        copyFields: {
          locality_reference: [
            "locality",
            "type",
            "pages",
            "figures",
            "remarks"
          ]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          locality_reference: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
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
          locality: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          locality_reference: 0,
          attachment: 0,
          keyword: 0,
          locality: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        locality_reference: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      if (this.isNotEmpty(objectToUpload.language))
        uploadableObject.language = objectToUpload.language.id;
      if (this.isNotEmpty(objectToUpload.journal))
        uploadableObject.journal = objectToUpload.journal.id;
      if (this.isNotEmpty(objectToUpload.title_translated_language))
        uploadableObject.title_translated_language =
          objectToUpload.title_translated_language.id;
      if (this.isNotEmpty(objectToUpload.licence))
        uploadableObject.licence = objectToUpload.licence.id;

      // Adding related data
      uploadableObject.related_data = {};

      if (this.isNotEmpty(this.relatedData.keyword))
        uploadableObject.related_data.keyword = this.relatedData.keyword;
      else uploadableObject.related_data.keyword = null;

      if (this.isNotEmpty(this.relatedData.attachment))
        uploadableObject.related_data.attachment = this.relatedData.attachment;
      else uploadableObject.related_data.attachment = null;

      if (this.isNotEmpty(this.relatedData.library)) {
        uploadableObject.related_data.library = cloneDeep(
          this.relatedData.library
        );
        uploadableObject.related_data.library.forEach((library, index) => {
          uploadableObject.related_data.library[index] = {
            id: library.library ? library.library : library.id
          };
        });
      } else uploadableObject.related_data.library = null;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        if (this.isNotEmpty(this.relatedData.locality_reference)) {
          let clonedLocalities = cloneDeep(this.relatedData.locality_reference);
          uploadableObject.related_data.locality = clonedLocalities
            .filter(entity => this.isNotEmpty(entity.locality))
            .map(loc_ref => {
              return {
                id: loc_ref.locality,
                pages: loc_ref.pages ? loc_ref.pages : null,
                figures: loc_ref.figures ? loc_ref.figures : null,
                remarks: loc_ref.remarks ? loc_ref.remarks : null
              };
            });
        } else uploadableObject.related_data.locality = null;
      }

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
      this.reference.journal = {
        id: obj.journal__id,
        journal_name: obj.journal__journal_name
      };
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

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.locality)) {
        obj.locality = {
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en,
          id: obj.locality
        };
      }
      if (this.isNotEmpty(obj.type)) {
        obj.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en
        };
      }
      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.locality)) {
        newObject.locality = obj.locality.id;
        newObject.locality__locality = obj.locality.locality;
        newObject.locality__locality_en = obj.locality.locality_en;
      }
      if (this.isNotEmpty(obj.type)) {
        newObject.type = obj.type.id;
        newObject.type__value = obj.type.value;
        newObject.type__value_en = obj.type.value_en;
      }

      return newObject;
    },

    // TODO: Put request here, which are currently in loadFullInfo method + blockVisibility
    loadRelatedData(object) {
      let query;

      if (object === "locality_reference") {
        query = fetchLocalityReferenceForReference(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_reference
        );
      }
      return new Promise(resolve => {
        query.then(response => {
          this.relatedData[object] = this.handleResponse(response);
          this.relatedData.count[object] = response.body.count;
          resolve(true);
        });
      });
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.reference = this.reference.id;

      if (this.isNotEmpty(uploadableObject.locality)) {
        uploadableObject.locality = uploadableObject.locality.id
          ? uploadableObject.locality.id
          : uploadableObject.locality;
      }
      if (this.isNotEmpty(uploadableObject.type)) {
        uploadableObject.type = uploadableObject.type.id
          ? uploadableObject.type.id
          : uploadableObject.type;
      }

      console.log("This object is sent in string format (related data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
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
      this.sendingData = true;
      fetchDoiCheck(this.reference.doi).then(
        response => {
          this.sendingData = false;
          if (response.status === 200) {
            if (response.body.status === "ok") {
              this.updateFieldsUsingDoi(response.body.message);
            }
          }
        },
        () => {
          // console.log(errResponse)
          this.sendingData = false;
          toastError({ text: this.$t("reference.doiCheckUnsuccessful") });
        }
      );
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
            this.$set(this.reference, "journal", {
              id: journal[0].id,
              journal_name: journal[0].journal_name
            });
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

      toastInfo({ text: this.$t("reference.doiCheckSuccessful") });
    },

    addPDF(fileData) {
      this.addFileAsObject(fileData, "reference");
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
</style>
