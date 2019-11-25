<template>
  <attachment-wrapper
    :is-photo-archive="isPhotoArchive"
    :is-specimen-image="isSpecimenImage"
    :is-other-file="isOtherFile"
    :is-digitised-reference="isDigitisedReference"
    :is-locked="isAttachmentLocked"
  >
    <template v-slot:loader>
      <spinner
        v-show="sendingData"
        class="loading-overlay"
        size="massive"
        :message="
          $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
        "
      ></spinner>
    </template>

    <template v-slot:locked-info>
      <div class="locked-info">
        <b-alert show variant="info" class="text-center">{{
          $t("messages.lockedForm")
        }}</b-alert>
      </div>
    </template>

    <template v-slot:file-input>
      <v-card
        class="mt-2"
        id="block-fileInput"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4">
        <v-card-title class="pt-2 pb-1">
          <div class="card-title--clickable" @click="block.fileInput = !block.fileInput">
          <span>{{ $t("attachment.file") }}</span>
            <v-icon right>far fa-file</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="block.fileInput = !block.fileInput" :color="bodyActiveColor">
            <v-icon>{{
              block.fileInput ? "fas fa-angle-up" : "fas fa-angle-down"
              }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.fileInput" class="px-1 pt-1 pb-2">
            <multimedia-component
              :record-options="recordOptions"
              :record-image="recordImage"
              :record-video="recordVideo"
              :record-audio="recordAudio"
              :acceptable-format="fileInputFormat"
              :accept-multiple="acceptMultiple"
              :clear-files="clearFiles"
              v-on:file-uploaded="addFiles"
              v-on:metadata-loaded="updateFields"
              v-on:files-cleared="clearUploadedFiles"
              style="margin-right: -10px; margin-left: -10px"
            />
          </div>
        </transition>
      </v-card>
    </template>

    <template v-slot:file-output>
      <v-card
        class="mt-2"
        id="block-file"
        :color="bodyColor.split('-')[0] + '-5'"
        elevation="4">
        <v-card-title class="pt-2 pb-1">
          <div class="card-title--clickable" @click="block.file = !block.file">
            <span>{{ $t("attachment.file") }}</span>
            <v-icon right>far fa-file</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="block.file = !block.file" :color="bodyActiveColor">
            <v-icon>{{
              block.file ? "fas fa-angle-up" : "fas fa-angle-down"
              }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.file" class="px-1 pt-1 pb-2">
            <v-row no-gutters>
              <v-col cols="12" md="6" class="px-1">
                <file-preview :data="rawAttachment" object="attachment" />
              </v-col>

              <v-col cols="12" md="6" class="px-1">
                <file-information :data="rawAttachment" />
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>
    </template>

    <template v-slot:photo-archive>
      <div class="photo-archive">
        <!-- REQUIRED INFO -->
        <v-card
          class="mt-2"
          id="block-requiredFields"
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.requiredFields = !block.requiredFields">
          <span>{{
            $t("attachment.requiredFields")
          }}</span>
              <v-icon
                right
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
              <!-- AUTHOR, AUTHOR FREE and IMAGESET -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="px-1">
                  <label :for="`author`">{{ $t("attachment.author") }}:</label>
                  <vue-multiselect
                    v-model="attachment.author"
                    id="author"
                    label="agent"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.agent"
                    :options="autocomplete.agent"
                    :class="{
                      valid:
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free),
                      invalid: !(
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free)
                      )
                    }"
                    @search-change="autocompleteAgentSearch"
                    @input="resetImageset"
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

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`author_free`"
                  >{{ $t("attachment.author_free") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="author_free"
                    v-model="attachment.author_free"
                    :state="
                      isNotEmpty(attachment.author_free) ||
                        isNotEmpty(attachment.author)
                    "
                    type="text"
                  ></b-form-input>
                </v-col>

                <v-col cols="12" md="4" class="px-1">
                  <div class="d-flex">
                    <div class="flex-grow-1 mr-3">
                      <label :for="`imageset`"
                      >{{ $t("attachment.imageset") }}:</label
                      >
                      <vue-multiselect
                        v-model="attachment.imageset"
                        id="imageset"
                        label="imageset_number"
                        track-by="id"
                        :placeholder="$t('add.inputs.autocomplete')"
                        :loading="autocomplete.loaders.imageset"
                        :options="autocomplete.imageset"
                        :class="{
                          valid: isNotEmpty(attachment.imageset),
                          invalid: !isNotEmpty(attachment.imageset)
                        }"
                        @search-change="autocompleteImagesetSearch"
                        :internal-search="false"
                        :preserve-search="true"
                        :clear-on-select="false"
                        :show-labels="false"
                      >
                        <template slot="singleLabel" slot-scope="{ option }">
                          <strong>{{ option.imageset_number }}</strong>
                        </template>
                        <template slot="noResult"
                        ><b>{{ $t("messages.inputNoResults") }}</b></template
                        >
                      </vue-multiselect>
                    </div>

                    <div class="align-self-end">
                      <v-btn
                        icon
                        :to="{ path: '/imageset/add' }"
                        :title="$t('add.inputs.newImageset')"
                        color="green"
                      >
                        <v-icon>fas fa-plus</v-icon>
                      </v-btn>
                    </div>
                  </div>
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
            $t("attachment.info")
          }}</span>
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
              <!-- DATE_CREATED and DATE_CREATED_FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`date_created`"
                  >{{ $t("attachment.dateCreated") }}:</label
                  >
                  <datepicker
                    id="date_created"
                    v-model="attachment.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control form-control-sm"
                  ></datepicker>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`date_created_free`"
                  >{{ $t("attachment.dateCreatedFree") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="date_created_free"
                    v-model="attachment.date_created_free"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- IMAGE PLACE and LOCALITY -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_place`"
                  >{{ $t("attachment.imagePlace") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_place"
                    v-model="attachment.image_place"
                    type="text"
                  ></b-form-input>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`locality`"
                  >{{ $t("attachment.locality") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.locality"
                    id="locality"
                    :label="localityLabel"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.locality"
                    :options="autocomplete.locality"
                    @search-change="autocompleteLocalitySearch"
                    :internal-search="false"
                    :preserve-search="true"
                    :clear-on-select="false"
                    :show-labels="false"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option[localityLabel] }}</strong>
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

        <!-- MAP -->
        <v-card class="mt-2" id="block-map"
                :color="bodyColor.split('-')[0] + '-5'"
                elevation="4">
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.map = !block.map"
            >
          <span>{{ $t("attachment.map") }}</span>
              <v-icon right>fas fa-globe-americas</v-icon>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="block.map = !block.map"
              :color="bodyActiveColor"
            >
              <v-icon>{{
                block.map ? "fas fa-angle-up" : "fas fa-angle-down"
                }}</v-icon>
            </v-btn>
          </v-card-title>

          <transition>
            <div v-show="block.map" class="px-1 pt-1 pb-2">
              <!-- IMAGE LATITUDE and IMAGE LONGITUDE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_latitude`"
                  >{{ $t("attachment.imageLatitude") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_latitude"
                    v-model="attachment.image_latitude"
                    type="number"
                    step="0.000001"
                  ></b-form-input>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_longitude`"
                  >{{ $t("attachment.imageLongitude") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_longitude"
                    v-model="attachment.image_longitude"
                    type="number"
                    step="0.000001"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- MAP SWITCH -->
              <v-card
                class="d-flex flex-row justify-content-start mt-1 mx-3"
                flat
                tile
                :color="bodyColor.split('-')[0] + '-5'"
              >
                <v-card flat tile class="align-self-center mr-2"
                        :color="bodyColor.split('-')[0] + '-5'">
                  <v-switch
                    v-model="showCollapseMap"
                    hide-details
                    id="map-switch"
                    class="vuetify-switch my-1"
                  ></v-switch>
                </v-card>

                <v-card flat tile class="align-self-center"
                        :color="bodyColor.split('-')[0] + '-5'">
                  <label class="m-0" :for="`map-switch`">
                    <i class="far fa-map"></i>
                    {{
                    showCollapseMap
                    ? $t("site.mapEnabled")
                    : $t("site.mapDisabled")
                    }}
                  </label>
                </v-card>
              </v-card>

              <!-- MAP -->
              <transition enter-active-class="animated fadeIn faster">
                <v-row no-gutters v-show="showCollapseMap" class="mt-2">
                  <v-col cols="12" class="px-1">
                    <map-component
                      mode="single"
                      module="attachment"
                      v-bind:locations="[]"
                      v-bind:location="{
                          lat: attachment.image_latitude
                            ? attachment.image_latitude.toString()
                            : null,
                          lng: attachment.image_longitude
                            ? attachment.image_longitude.toString()
                            : null
                        }"
                      v-on:update-coordinates="updateLocation"
                    ></map-component>
                  </v-col>
                </v-row>
              </transition>


            </div>
          </transition>
        </v-card>

        <!-- IMAGE INFO -->
        <v-card
          class="mt-2"
          id="block-description"
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.description = !block.description"
            >
              <span>{{ $t("attachment.description") }}</span>
              <v-icon right>fas fa-image</v-icon>
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
              <!-- OBJECT and PEOPLE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_object`"
                  >{{ $t("attachment.imageObject") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_object"
                    v-model="attachment.image_object"
                    type="text"
                  ></b-form-input>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_people`"
                  >{{ $t("attachment.imagePeople") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_people"
                    v-model="attachment.image_people"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- DESCRIPTION -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_description`"
                  >{{ $t("attachment.imageDescription") }}:</label
                  >
                  <b-form-textarea
                    id="image_description"
                    v-model="attachment.image_description"
                    type="text"
                    size="sm"
                    :no-resize="true"
                    :rows="3"
                    :max-rows="3"
                  ></b-form-textarea>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_description_en`"
                  >{{ $t("attachment.imageDescriptionEn") }}:</label
                  >
                  <b-form-textarea
                    id="image_description_en"
                    v-model="attachment.image_description_en"
                    type="text"
                    size="sm"
                    :no-resize="true"
                    :rows="3"
                    :max-rows="3"
                  ></b-form-textarea>
                </v-col>
              </v-row>

              <!-- KEYWORDS -->
              <div class="d-flex justify-content-start flex-wrap px-1">
                <div class="mr-3 flex-grow-1">
                  <label :for="`keyword`"
                  >{{ $t("attachment.keywords") }}:</label
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
                    color="green"
                    :title="$t('add.new')"
                    :to="{
                      name: 'Keyword add',
                      query: { attachment: JSON.stringify(attachment) }
                    }"
                    target="newKeywordWindow"
                  >
                    <v-icon>fas fa-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`licence`"
                  >{{ $t("attachment.licence") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.licence"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`copyright_agent`"
                  >{{ $t("attachment.copyrightAgent") }}:</label
                  >
                  <vue-multiselect
                    id="copyright_agent"
                    v-model="attachment.copyright_agent"
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
              </v-row>

              <!-- IMAGE_TYPE and DEVICE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_type`"
                  >{{ $t("attachment.imageType") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.image_type"
                    id="image_type"
                    :options="autocomplete.image_type"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`device_txt`"
                  >{{ $t("attachment.deviceTxt") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="device_txt"
                    v-model="attachment.device_txt"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- AGENT, DATE DIGITISED and STARS -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="px-1">
                  <label :for="`agent_digitised`"
                  >{{ $t("attachment.agentDigitised") }}:</label
                  >
                  <vue-multiselect
                    id="agent_digitised"
                    v-model="attachment.agent_digitised"
                    label="agent"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.agent_digitised"
                    :options="autocomplete.agent_digitised"
                    @search-change="autocompleteAgentDigitisedSearch"
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

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`date_digitised`"
                  >{{ $t("attachment.dateDigitised") }}:</label
                  >
                  <datepicker
                    id="date_digitised"
                    v-model="attachment.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    :not-after="new Date()"
                    input-class="form-control form-control-sm"
                  ></datepicker>
                </v-col>

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`stars`">{{ $t("attachment.stars") }}:</label>
                  <b-form-select v-model="attachment.stars" size="sm">
                    <option :value="5">{{ $t("main.rating5") }}</option>
                    <option :value="4">{{ $t("main.rating4") }}</option>
                    <option :value="3">{{ $t("main.rating3") }}</option>
                    <option :value="2">{{ $t("main.rating2") }}</option>
                    <option :value="1">{{ $t("main.rating1") }}</option>
                    <option :value="0">{{ $t("main.rating0") }}</option>
                    <option :value="-1">{{ $t("main.rating-1") }}</option>
                    <option :value="-2">{{ $t("main.rating-2") }}</option>
                    <option :value="-3">{{ $t("main.rating-3") }}</option>
                    <option :value="-4">{{ $t("main.rating-4") }}</option>
                    <option :value="-5">{{ $t("main.rating-5") }}</option>
                  </b-form-select>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>
      </div>
    </template>

    <template v-slot:specimen-image>
      <div class="specimen-image">
        <!-- REQUIRED INFO -->
        <v-card
          class="mt-2"
          id="block-requiredFields"
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.requiredFields = !block.requiredFields">
          <span>{{
            $t("attachment.requiredFields")
          }}</span>
              <v-icon
                right
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
              <!-- AUTHOR and AUTHOR FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`author`">{{ $t("attachment.author") }}:</label>
                  <vue-multiselect
                    v-model="attachment.author"
                    id="author"
                    label="agent"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.agent"
                    :options="autocomplete.agent"
                    :class="{
                      valid:
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free),
                      invalid: !(
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free)
                      )
                    }"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`author_free`"
                  >{{ $t("attachment.author_free") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="author_free"
                    v-model="attachment.author_free"
                    :state="
                      isNotEmpty(attachment.author_free) ||
                        isNotEmpty(attachment.author)
                    "
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
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{
            $t("attachment.info")
          }}</span>
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
              <!-- SPECIMEN and SCALEBAR -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`specimen`"
                  >{{ $t("attachment.specimen") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.specimen"
                    id="specimen"
                    :custom-label="customSpecimenLabel"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.specimen"
                    :options="autocomplete.specimen"
                    :class="{
                      valid:
                        $route.meta.isEdit && isNotEmpty(attachment.specimen),
                      invalid:
                        $route.meta.isEdit && !isNotEmpty(attachment.specimen)
                    }"
                    @search-change="autocompleteSpecimenSearch"
                    :internal-search="false"
                    :preserve-search="true"
                    :clear-on-select="false"
                    :show-labels="false"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ customSpecimenLabel(option) }}</strong>
                    </template>
                    <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                    >
                  </vue-multiselect>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_scalebar`"
                  >{{ $t("attachment.imageScalebar") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_scalebar"
                    v-model="attachment.image_scalebar"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- DATE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`date_created`"
                  >{{ $t("attachment.dateCreated") }}:</label
                  >
                  <datepicker
                    id="date_created"
                    v-model="attachment.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control form-control-sm"
                  ></datepicker>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`date_created_free`"
                  >{{ $t("attachment.dateCreatedFree") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="date_created_free"
                    v-model="attachment.date_created_free"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- DESCRIPTION -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_description`"
                  >{{ $t("attachment.imageDescription") }}:</label
                  >
                  <b-form-textarea
                    id="image_description"
                    v-model="attachment.image_description"
                    type="text"
                    size="sm"
                    :no-resize="true"
                    :rows="3"
                    :max-rows="3"
                  ></b-form-textarea>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_description_en`"
                  >{{ $t("attachment.imageDescriptionEn") }}:</label
                  >
                  <b-form-textarea
                    id="image_description_en"
                    v-model="attachment.image_description_en"
                    type="text"
                    size="sm"
                    :no-resize="true"
                    :rows="3"
                    :max-rows="3"
                  ></b-form-textarea>
                </v-col>
              </v-row>

              <!-- KEYWORDS -->
              <div class="d-flex justify-content-start flex-wrap px-1">
                <div class="mr-3 flex-grow-1">
                  <label :for="`keyword`"
                  >{{ $t("attachment.keywords") }}:</label
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
                    color="green"
                    :title="$t('add.new')"
                    :to="{
                      name: 'Keyword add',
                      query: { attachment: JSON.stringify(attachment) }
                    }"
                    target="newKeywordWindow"
                  >
                    <v-icon>fas fa-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`licence`"
                  >{{ $t("attachment.licence") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.licence"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`copyright_agent`"
                  >{{ $t("attachment.copyrightAgent") }}:</label
                  >
                  <vue-multiselect
                    id="copyright_agent"
                    v-model="attachment.copyright_agent"
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
              </v-row>

              <!-- IMAGE_TYPE and DEVICE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_type`"
                  >{{ $t("attachment.imageType") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.image_type"
                    id="image_type"
                    :options="autocomplete.image_type"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`device_txt`"
                  >{{ $t("attachment.deviceTxt") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="device_txt"
                    v-model="attachment.device_txt"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- AGENT, DATE DIGITISED and STARS -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="px-1">
                  <label :for="`agent_digitised`"
                  >{{ $t("attachment.agentDigitised") }}:</label
                  >
                  <vue-multiselect
                    id="agent_digitised"
                    v-model="attachment.agent_digitised"
                    label="agent"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.agent_digitised"
                    :options="autocomplete.agent_digitised"
                    @search-change="autocompleteAgentDigitisedSearch"
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

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`date_digitised`"
                  >{{ $t("attachment.dateDigitised") }}:</label
                  >
                  <datepicker
                    id="date_digitised"
                    v-model="attachment.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    :not-after="new Date()"
                    input-class="form-control form-control-sm"
                  ></datepicker>
                </v-col>

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`stars`">{{ $t("attachment.stars") }}:</label>
                  <b-form-select v-model="attachment.stars" size="sm">
                    <option :value="5">{{ $t("main.rating5") }}</option>
                    <option :value="4">{{ $t("main.rating4") }}</option>
                    <option :value="3">{{ $t("main.rating3") }}</option>
                    <option :value="2">{{ $t("main.rating2") }}</option>
                    <option :value="1">{{ $t("main.rating1") }}</option>
                    <option :value="0">{{ $t("main.rating0") }}</option>
                    <option :value="-1">{{ $t("main.rating-1") }}</option>
                    <option :value="-2">{{ $t("main.rating-2") }}</option>
                    <option :value="-3">{{ $t("main.rating-3") }}</option>
                    <option :value="-4">{{ $t("main.rating-4") }}</option>
                    <option :value="-5">{{ $t("main.rating-5") }}</option>
                  </b-form-select>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>
      </div>
    </template>

    <template v-slot:other-file>
      <div class="other-file">
        <!-- REQUIRED INFO -->
        <v-card
          class="mt-2"
          id="block-requiredFields"
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.requiredFields = !block.requiredFields">
          <span>{{
            $t("attachment.requiredFields")
          }}</span>
              <v-icon
                right
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
              <!-- AUTHOR and AUTHOR FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`author`">{{ $t("attachment.author") }}:</label>
                  <vue-multiselect
                    v-model="attachment.author"
                    id="author"
                    label="agent"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.agent"
                    :options="autocomplete.agent"
                    :class="{
                      valid:
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free),
                      invalid: !(
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free)
                      )
                    }"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`author_free`"
                  >{{ $t("attachment.author_free") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="author_free"
                    v-model="attachment.author_free"
                    :state="
                      isNotEmpty(attachment.author_free) ||
                        isNotEmpty(attachment.author)
                    "
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- DESCRIPTION and DESCRIPTION_EN -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`description`"
                  >{{ $t("attachment.description") }}:</label
                  >
                  <b-form-textarea
                    size="sm"
                    id="description"
                    :state="isNotEmpty(attachment.description)"
                    v-model="attachment.description"
                    type="text"
                    :no-resize="true"
                    :rows="3"
                    :max-rows="3"
                  ></b-form-textarea>

                  <b-form-text v-if="!isNotEmpty(attachment.description)"
                  >{{ $t("add.errors.emptyField") }}.</b-form-text
                  >
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`description_en`"
                  >{{ $t("attachment.descriptionEn") }}:</label
                  >
                  <b-form-textarea
                    size="sm"
                    id="description_en"
                    :state="isNotEmpty(attachment.description_en)"
                    v-model="attachment.description_en"
                    type="text"
                    :no-resize="true"
                    :rows="3"
                    :max-rows="3"
                  ></b-form-textarea>

                  <b-form-text v-if="!isNotEmpty(attachment.description_en)"
                  >{{ $t("add.errors.emptyField") }}.</b-form-text
                  >
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
            $t("attachment.info")
          }}</span>
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
              <!-- DATE_CREATED, DATE_CREATED_FREE and TYPE -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="px-1">
                  <label :for="`date_created`"
                  >{{ $t("attachment.dateCreated") }}:</label
                  >
                  <datepicker
                    id="date_created"
                    v-model="attachment.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control form-control-sm"
                  ></datepicker>
                </v-col>

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`date_created_free`"
                  >{{ $t("attachment.dateCreatedFree") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="date_created_free"
                    v-model="attachment.date_created_free"
                    type="text"
                  ></b-form-input>
                </v-col>

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`type`">{{ $t("attachment.type") }}:</label>
                  <vue-multiselect
                    v-model="attachment.type"
                    id="type"
                    :options="autocomplete.type"
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
              </v-row>

              <!-- REMARKS -->
              <v-row no-gutters>
                <v-col cols="12" class="px-1">
                  <label :for="`remarks`"
                  >{{ $t("attachment.remarks") }}:</label
                  >
                  <b-form-textarea
                    size="sm"
                    id="remarks"
                    v-model="attachment.remarks"
                    type="text"
                    :no-resize="true"
                    :rows="3"
                    :max-rows="3"
                  ></b-form-textarea>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- MAP -->
        <v-card class="mt-2" id="block-map"
                :color="bodyColor.split('-')[0] + '-5'"
                elevation="4">
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.map = !block.map"
            >
              <span>{{ $t("attachment.map") }}</span>
              <v-icon right>fas fa-globe-americas</v-icon>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="block.map = !block.map"
              :color="bodyActiveColor"
            >
              <v-icon>{{
                block.map ? "fas fa-angle-up" : "fas fa-angle-down"
                }}</v-icon>
            </v-btn>
          </v-card-title>

          <transition>
            <div v-show="block.map" class="px-1 pt-1 pb-2">
              <!-- IMAGE LATITUDE and IMAGE LONGITUDE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_latitude`"
                  >{{ $t("attachment.imageLatitude") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_latitude"
                    v-model="attachment.image_latitude"
                    type="number"
                    step="0.000001"
                  ></b-form-input>
                </v-col>

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_longitude`"
                  >{{ $t("attachment.imageLongitude") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_longitude"
                    v-model="attachment.image_longitude"
                    type="number"
                    step="0.000001"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- MAP SWITCH -->
              <v-card
                class="d-flex flex-row justify-content-start mt-1 mx-3"
                flat
                tile
                :color="bodyColor.split('-')[0] + '-5'"
              >
                <v-card flat tile class="align-self-center mr-2"
                        :color="bodyColor.split('-')[0] + '-5'">
                  <v-switch
                    v-model="showCollapseMap"
                    hide-details
                    id="map-switch"
                    class="vuetify-switch my-1"
                  ></v-switch>
                </v-card>

                <v-card flat tile class="align-self-center"
                        :color="bodyColor.split('-')[0] + '-5'">
                  <label class="m-0" :for="`map-switch`">
                    <i class="far fa-map"></i>
                    {{
                    showCollapseMap
                    ? $t("site.mapEnabled")
                    : $t("site.mapDisabled")
                    }}
                  </label>
                </v-card>
              </v-card>

              <!-- MAP -->
              <transition enter-active-class="animated fadeIn faster">
                <v-row no-gutters v-show="showCollapseMap" class="mt-2">
                  <v-col cols="12" class="px-1">
                    <map-component
                      mode="single"
                      module="attachment"
                      v-bind:locations="[]"
                      v-bind:location="{
                          lat: attachment.image_latitude
                            ? attachment.image_latitude.toString()
                            : null,
                          lng: attachment.image_longitude
                            ? attachment.image_longitude.toString()
                            : null
                        }"
                      v-on:update-coordinates="updateLocation"
                    ></map-component>
                  </v-col>
                </v-row>
              </transition>


            </div>
          </transition>
        </v-card>

        <!-- FILE INFO -->
        <v-card
          class="mt-2"
          id="block-description"
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.description = !block.description"
            >
              <span>{{ $t("attachment.description") }}</span>
              <v-icon right>fas fa-image</v-icon>
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
              <!-- KEYWORDS -->
              <div class="d-flex justify-content-start flex-wrap px-1">
                <div class="mr-3 flex-grow-1">
                  <label :for="`keyword`"
                  >{{ $t("attachment.keywords") }}:</label
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
                    color="green"
                    :title="$t('add.new')"
                    :to="{
                      name: 'Keyword add',
                      query: { attachment: JSON.stringify(attachment) }
                    }"
                    target="newKeywordWindow"
                  >
                    <v-icon>fas fa-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`licence`"
                  >{{ $t("attachment.licence") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.licence"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`copyright_agent`"
                  >{{ $t("attachment.copyrightAgent") }}:</label
                  >
                  <vue-multiselect
                    id="copyright_agent"
                    v-model="attachment.copyright_agent"
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
              </v-row>

              <!-- IMAGE_TYPE and DEVICE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`image_type`"
                  >{{ $t("attachment.imageType") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.image_type"
                    id="image_type"
                    :options="autocomplete.image_type"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`device_txt`"
                  >{{ $t("attachment.deviceTxt") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="device_txt"
                    v-model="attachment.device_txt"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>

              <!-- AGENT and DATE DIGITISED -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`agent_digitised`"
                  >{{ $t("attachment.agentDigitised") }}:</label
                  >
                  <vue-multiselect
                    id="agent_digitised"
                    v-model="attachment.agent_digitised"
                    label="agent"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.agent_digitised"
                    :options="autocomplete.agent_digitised"
                    @search-change="autocompleteAgentDigitisedSearch"
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
                  <label :for="`date_digitised`"
                  >{{ $t("attachment.dateDigitised") }}:</label
                  >
                  <datepicker
                    id="date_digitised"
                    v-model="attachment.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    :not-after="new Date()"
                    input-class="form-control form-control-sm"
                  ></datepicker>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- RELATED DATA -->
        <v-card
          class="mt-2"
          id="block-relatedData"
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.relatedData = !block.relatedData"
            >
              <span>{{ $t("attachment.relatedData") }}</span>
              <v-icon right>fas fa-table</v-icon>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="block.relatedData = !block.relatedData"
              :color="bodyActiveColor"
            >
              <v-icon>{{
                block.relatedData ? "fas fa-angle-up" : "fas fa-angle-down"
                }}</v-icon>
            </v-btn>
          </v-card-title>

          <transition>
            <div v-show="block.relatedData" class="px-1 pt-1 pb-2">
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`related_data`"
                  >{{ $t("attachment.relatedData") }}:</label
                  >
                  <b-form-select
                    size="sm"
                    id="related_data"
                    v-model="selectedRelatedTable"
                    class="mb-3"
                  >
                    <option :value="null">{{
                      $t("attachment.relatedDataDefault")
                      }}</option>
                    <option
                      v-for="tab in relatedTabs"
                      :key="tab.name"
                      :value="tab.name.split('__')[1]"
                    >
                      {{
                      $t(
                      "attachment.relatedTables." + tab.name.split("__")[1]
                      )
                      }}
                    </option>
                  </b-form-select>
                </v-col>

                <v-col cols="12" md="6" class="px-1" v-if="selectedRelatedTable !== null">
                  <label :for="selectedRelatedTable"
                  >{{
                    $t("attachment.relatedTables." + selectedRelatedTable)
                    }}:</label
                  >
                  <vue-multiselect
                    v-model="
                      relatedData['attach_link__' + selectedRelatedTable]
                    "
                    :id="selectedRelatedTable"
                    :custom-label="customLabelForRelatedData"
                    track-by="id"
                    :multiple="true"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="
                      autocomplete.loaders[
                        'attach_link__' + selectedRelatedTable
                      ]
                    "
                    :options="
                      autocomplete['attach_link__' + selectedRelatedTable]
                    "
                    @search-change="autocompleteRelatedDataSearch"
                    :internal-search="false"
                    :preserve-search="true"
                    :close-on-select="false"
                    :show-labels="false"
                  >
                    <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                    >
                  </vue-multiselect>
                </v-col>
              </v-row>

              <!-- SHOWING RELATED_DATA -->
              <v-row no-gutters>
                <!-- COLLECTION -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__collection &&
                      relatedData.attach_link__collection.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.collection") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("collection.name") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__collection"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'collection',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>
                          {{
                          $i18n.locale === "ee"
                          ? entity.name
                          : entity.name_en
                          }}
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__collection.splice(
                                index,
                                1
                              )
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- SPECIMEN -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__specimen &&
                      relatedData.attach_link__specimen.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.specimen") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("specimen.specimenNumber") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__specimen"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'specimen',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>
                            <span v-if="entity.coll__number !== null"
                            >{{ entity.coll__number.split(" ")[0] }}
                              {{ entity.specimen_id }}</span
                            >
                          <span v-else>{{ entity.specimen_id }}</span>
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__specimen.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- SAMPLE -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__sample &&
                      relatedData.attach_link__sample.length > 0
                  "
                >
                  <p class="h4">{{ $t("attachment.relatedTables.sample") }}</p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("sample.number") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__sample"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'sample',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>{{ entity.number }}</td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__sample.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- SAMPLE_SERIES -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__sample_series &&
                      relatedData.attach_link__sample_series.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.sample_series") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("sample_series.name") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__sample_series"
                        :key="index"
                      >
                        <td>{{ entity.id }}</td>

                        <td>{{ entity.name }}</td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__sample_series.splice(
                                index,
                                1
                              )
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- ANALYSIS -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__analysis &&
                      relatedData.attach_link__analysis.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.analysis") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("analysis.sample") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__analysis"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'analysis',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>
                            <span
                              v-if="
                                entity.sample__number !== null &&
                                  entity.sample__number
                              "
                            >{{ entity.sample__number }}</span
                            >
                          <span v-else>{{ entity.sample__id }}</span>
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__analysis.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- DATASET -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__dataset &&
                      relatedData.attach_link__dataset.length > 0
                  "
                >
                  <p class="h4">{{ $t("attachment.relatedTables.dataset") }}</p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("dataset.name") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__dataset"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'dataset',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>
                          {{
                          $i18n.locale === "ee"
                          ? entity.name
                          : entity.name_en
                          }}
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__dataset.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- DOI -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__doi &&
                      relatedData.attach_link__doi.length > 0
                  "
                >
                  <p class="h4">{{ $t("attachment.relatedTables.doi") }}</p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("doi.identifier") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__doi"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'doi',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>{{ entity.identifier }}</td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__doi.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- LOCALITY -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__locality &&
                      relatedData.attach_link__locality.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.locality") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("locality.locality") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__locality"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'locality',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>
                          {{
                          $i18n.locale === "ee"
                          ? entity.locality
                          : entity.locality_en
                          }}
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__locality.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- DRILLCORE -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__drillcore &&
                      relatedData.attach_link__drillcore.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.drillcore") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("drillcore.drillcore") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__drillcore"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'drillcore',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>
                          {{
                          $i18n.locale === "ee"
                          ? entity.drillcore
                          : entity.drillcore_en
                          }}
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__drillcore.splice(
                                index,
                                1
                              )
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- DRILLCORE_BOX -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__drillcore_box &&
                      relatedData.attach_link__drillcore_box.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.drillcore_box") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("drillcore_box.drillcore") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__drillcore_box"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'corebox',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>
                          {{
                          $i18n.locale === "ee"
                          ? entity.drillcore__drillcore
                          : entity.drillcore__drillcore_en
                          }}
                          - {{ entity.number }}
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__drillcore_box.splice(
                                index,
                                1
                              )
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- PREPARATION -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__preparation !== null &&
                      relatedData.attach_link__preparation.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.preparation") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("preparation.number") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__preparation"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'preparation',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>{{ entity.preparation_number }}</td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__preparation.splice(
                                index,
                                1
                              )
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- REFERENCE -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__reference !== null &&
                      relatedData.attach_link__reference.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.reference") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("reference.reference") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__reference"
                        :key="index"
                      >
                        <td>
                          <a
                            href="javascript:void(0)"
                            @click="
                                openGeoInNewWindow({
                                  object: 'reference',
                                  id: entity.id
                                })
                              "
                          >
                            {{ entity.id }}
                          </a>
                        </td>

                        <td>{{ entity.reference }}</td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__reference.splice(
                                index,
                                1
                              )
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- STORAGE -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__storage !== null &&
                      relatedData.attach_link__storage.length > 0
                  "
                >
                  <p class="h4">{{ $t("attachment.relatedTables.storage") }}</p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("storage.storage") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__storage"
                        :key="index"
                      >
                        <td>{{ entity.id }}</td>

                        <td>
                            <span v-if="entity.contents !== null"
                            >{{ entity.location }} -
                              {{ entity.contents }}</span
                            >
                          <span v-else>{{ entity.location }}</span>
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__storage.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- PROJECT -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__project !== null &&
                      relatedData.attach_link__project.length > 0
                  "
                >
                  <p class="h4">{{ $t("attachment.relatedTables.project") }}</p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("project.name") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__project"
                        :key="index"
                      >
                        <td>
                          <router-link
                            :to="{ path: '/project/' + entity.id }"
                          >{{ entity.id }}</router-link
                          >
                        </td>

                        <td>
                          {{
                          $i18n.locale === "ee"
                          ? entity.name
                          : entity.name_en
                          }}
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__project.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- SITE -->
                <div
                  class="col-sm-6 px-1"
                  v-if="
                    relatedData.attach_link__site !== null &&
                      relatedData.attach_link__site.length > 0
                  "
                >
                  <p class="h4">{{ $t("attachment.relatedTables.site") }}</p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>{{ $t("site.name") }}</th>
                        <th></th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr
                        v-for="(entity,
                          index) in relatedData.attach_link__site"
                        :key="index"
                      >
                        <td>
                          <router-link :to="{ path: '/site/' + entity.id }">{{
                            entity.id
                            }}</router-link>
                        </td>

                        <td>
                          {{
                          $i18n.locale === "ee"
                          ? entity.name
                          : entity.name_en
                          }}
                        </td>

                        <td
                          class="text-center delete-relation"
                          @click="
                              relatedData.attach_link__site.splice(index, 1)
                            "
                        >
                          <i class="fas fa-times"></i>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-row>
            </div>
          </transition>
        </v-card>
      </div>
    </template>

    <template v-slot:digitised-reference>
      <div class="digitised-reference">
        <!-- REQUIRED INFO -->
        <v-card
          class="mt-2"
          id="block-requiredFields"
          :color="bodyColor.split('-')[0] + '-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.requiredFields = !block.requiredFields">
          <span>{{
            $t("attachment.requiredFields")
          }}</span>
              <v-icon
                right
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
              <!-- AUTHOR and AUTHOR FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`reference`"
                  >{{ $t("attachment.reference") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.reference"
                    id="reference"
                    label="reference"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.reference"
                    :options="autocomplete.reference"
                    :class="{
                      valid: isNotEmpty(attachment.reference),
                      invalid: !isNotEmpty(attachment.reference)
                    }"
                    @search-change="autocompleteReferenceSearch"
                    :internal-search="false"
                    :preserve-search="true"
                    :clear-on-select="false"
                    :show-labels="false"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option.reference }}</strong>
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
            $t("attachment.info")
          }}</span>
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
              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="px-1">
                  <label :for="`licence`"
                  >{{ $t("attachment.licence") }}:</label
                  >
                  <vue-multiselect
                    v-model="attachment.licence"
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

                <v-col cols="12" md="6" class="px-1">
                  <label :for="`copyright_agent`"
                  >{{ $t("attachment.copyrightAgent") }}:</label
                  >
                  <vue-multiselect
                    id="copyright_agent"
                    v-model="attachment.copyright_agent"
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
              </v-row>

              <!-- AGENT, DATE DIGITISED and DATE DIGITISED FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="px-1">
                  <label :for="`agent_digitised`"
                  >{{ $t("attachment.agentDigitised") }}:</label
                  >
                  <vue-multiselect
                    id="agent_digitised"
                    v-model="attachment.agent_digitised"
                    label="agent"
                    track-by="id"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :loading="autocomplete.loaders.agent_digitised"
                    :options="autocomplete.agent_digitised"
                    @search-change="autocompleteAgentDigitisedSearch"
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

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`date_digitised`"
                  >{{ $t("attachment.dateDigitised") }}:</label
                  >
                  <datepicker
                    id="date_digitised"
                    v-model="attachment.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    :not-after="new Date()"
                    input-class="form-control form-control-sm"
                  ></datepicker>
                </v-col>

                <v-col cols="12" md="4" class="px-1">
                  <label :for="`date_digitised_free`"
                  >{{ $t("attachment.dateDigitisedFree") }}:</label
                  >
                  <b-form-input
                    size="sm"
                    id="image_people"
                    v-model="attachment.date_digitised_free"
                    type="text"
                  ></b-form-input>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>
      </div>
    </template>

    <template v-slot:change-type>
      <div class="change-type">
        <fieldset class="border-top px-2 mb-2" id="block-changeType">
          <legend
            class="w-auto my-0"
            :class="{ 'text-primary': !block.changeType }"
            @click="block.changeType = !block.changeType"
          >
            {{ $t("attachment.changeType") }}
            <i class="fas fa-exchange-alt"></i>
          </legend>

          <transition name="fade">
            <div v-show="block.changeType">
              <!-- CHANGE TYPE -->
              <div class="row">
                <div class="col-md-6">
                  <label :for="`specimen_image_attachment`">
                    <span>{{ $t("attachment.changeType") }}: </span>
                    <span
                      v-if="
                        currentAttachmentType !==
                          getAttachmentTypeAsString(
                            attachment.specimen_image_attachment
                          )
                      "
                    >
                      <b>{{ $t("attachment." + currentAttachmentType) }} </b>
                      <i class="fas fa-long-arrow-alt-right"></i>
                      <b>
                        {{
                          $t(
                            "attachment." +
                              getAttachmentTypeAsString(
                                attachment.specimen_image_attachment
                              )
                          )
                        }}</b
                      >
                    </span>
                  </label>
                  <b-form-select
                    size="sm"
                    id="specimen_image_attachment"
                    v-model="attachment.specimen_image_attachment"
                    class="mb-3"
                  >
                    <option
                      :value="2"
                      :disabled="!isValidToChangeTo('photoArchive')"
                      >{{ $t("attachment.photoArchive") }}</option
                    >
                    <option
                      :value="1"
                      :disabled="!isValidToChangeTo('specimenImage')"
                      >{{ $t("attachment.specimenImage") }}</option
                    >
                    <option
                      :value="3"
                      :disabled="!isValidToChangeTo('otherFile')"
                      >{{ $t("attachment.otherFiles") }}</option
                    >
                    <option
                      :value="4"
                      :disabled="!isValidToChangeTo('digitisedReference')"
                      >{{ $t("attachment.digitisedReference") }}</option
                    >
                  </b-form-select>
                </div>
              </div>
            </div>
          </transition>
        </fieldset>
      </div>
    </template>

    <template v-slot:checkbox>
      <div class="d-flex flex-wrap mt-2">
        <v-checkbox
          v-model="attachment.is_private"
          id="is_private"
          :label="$t('specimen.is_private_text')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox mr-3"
        ></v-checkbox>

        <v-checkbox
          v-model="attachment.is_locked"
          id="is_locked"
          :label="$t('attachment.is_locked_text')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </div>
    </template>

    <template v-slot:local-storage>
      <div class="d-flex mt-3">
        <v-btn @click="clearLocalStorage" class="text-none" color="yellow">
          {{ $t("add.buttons.clearLocalStorage") }}
        </v-btn>
      </div>
    </template>

    <template v-slot:add-doi>
      <div class="d-flex justify-content-end mt-3">
        <new-doi-button
          v-if="
            attachment &&
              rawAttachment &&
              validate('attachment') &&
              isUserAllowedTo('add', 'doi')
          "
          object="attachment"
          :data="attachment"
          :raw-data="rawAttachment"
          :related-data="relatedData"
        />
      </div>
    </template>
  </attachment-wrapper>
</template>

<script>
import Spinner from "vue-simple-spinner";
import Datepicker from "vue2-datepicker";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapGetters, mapState } from "vuex";
import {
  fetchAttachment,
  fetchAttachmentKeyword,
  fetchAttachmentLinkAnalyses,
  fetchAttachmentLinkCollections,
  fetchAttachmentLinkDatasets,
  fetchAttachmentLinkDois,
  fetchAttachmentLinkDrillcoreBoxes,
  fetchAttachmentLinkDrillcores,
  fetchAttachmentLinkLocalities,
  fetchAttachmentLinkPreparations,
  fetchAttachmentLinkProjects,
  fetchAttachmentLinkReferences,
  fetchAttachmentLinkSamples,
  fetchAttachmentLinkSampleSeries,
  fetchAttachmentLinkSites,
  fetchAttachmentLinkSpecimens,
  fetchAttachmentLinkStorages,
  fetchListAttachmentType,
  fetchListImageType,
  fetchListLicences
} from "../../assets/js/api/apiCalls";
import AttachmentWrapper from "./AttachmentWrapper";
import MultimediaComponent from "../partial/MultimediaComponent";
import MapComponent from "../partial/MapComponent";
import { toastInfo } from "../../assets/js/iziToast/iziToast";
import FileInformation from "../partial/FileInformation";
import FilePreview from "../partial/FilePreview";
import NewDoiButton from "../partial/NewDoiButton";

export default {
  name: "AttachmentNew",

  components: {
    NewDoiButton,
    FilePreview,
    FileInformation,
    MultimediaComponent,
    AttachmentWrapper,
    Spinner,
    Datepicker,
    MapComponent
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

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapState(["databaseId", "currentUser"]),
    ...mapGetters(["isUserAllowedTo"]),

    isPhotoArchive() {
      return this.$route.meta.isEdit
        ? this.attachment.specimen_image_attachment === 2
        : this.$route.meta.child === "photo_archive";
    },

    isSpecimenImage() {
      return this.$route.meta.isEdit
        ? this.attachment.specimen_image_attachment === 1
        : this.$route.meta.child === "specimen_image";
    },

    isOtherFile() {
      return this.$route.meta.isEdit
        ? this.attachment.specimen_image_attachment === 3
        : this.$route.meta.child === "other_file";
    },

    isDigitisedReference() {
      return this.$route.meta.isEdit
        ? this.attachment.specimen_image_attachment === 4
        : this.$route.meta.child === "digitised_reference";
    },

    recordOptions() {
      if (this.isPhotoArchive) return true;
      else if (this.isSpecimenImage) return true;
      else if (this.isOtherFile) return true;
      else if (this.isDigitisedReference) return false;
      else return true;
    },

    recordImage() {
      if (this.isPhotoArchive) return true;
      else if (this.isSpecimenImage) return true;
      else if (this.isOtherFile) return true;
      else if (this.isDigitisedReference) return false;
      else return true;
    },

    recordVideo() {
      if (this.isPhotoArchive) return false;
      else if (this.isSpecimenImage) return true;
      else if (this.isOtherFile) return true;
      else if (this.isDigitisedReference) return false;
      else return true;
    },

    recordAudio() {
      if (this.isPhotoArchive) return false;
      else if (this.isSpecimenImage) return true;
      else if (this.isOtherFile) return true;
      else if (this.isDigitisedReference) return false;
      else return true;
    },

    fileInputFormat() {
      if (this.isPhotoArchive) return "image/*";
      else if (this.isSpecimenImage) return "*/*";
      else if (this.isOtherFile) return "*/*";
      else if (this.isDigitisedReference) return "application/pdf";
      else return "image/*";
    },

    acceptMultiple() {
      if (this.isPhotoArchive) return true;
      else if (this.isSpecimenImage) return true;
      else if (this.isOtherFile) return true;
      else if (this.isDigitisedReference) return true;
      else return true;
    },

    currentAttachmentType() {
      if (this.isAttachmentPhotoArchive) return "photoArchive";
      else if (this.isAttachmentSpecimenImage) return "specimenImage";
      else if (this.isAttachmentOtherFile) return "otherFiles";
      else if (this.isAttachmentDigitisedReference) return "digitisedReference";
      else return "otherFiles";
    },

    isImageFile() {
      if (this.rawAttachment) {
        if (this.rawAttachment.attachment_format__value) {
          return !!this.rawAttachment.attachment_format__value.includes(
            "image"
          );
        } else {
          let fileType = this.rawAttachment.uuid_filename.split(".")[1];
          // As of 18.09.2019 total of 1508 attachments are without attachment_format__value which 859 are jpg and 2 png
          return !!(fileType.includes("jpg") || fileType.includes("png"));
        }
      } else return false;
    },

    isPdfFile() {
      if (this.rawAttachment) {
        if (this.rawAttachment.attachment_format__value) {
          return !!this.rawAttachment.attachment_format__value.includes("pdf");
        } else {
          // As of 18.09.2019 total of 1508 attachments are without attachment_format__value which 635 are pdf
          return !!this.rawAttachment.uuid_filename
            .split(".")[1]
            .includes("pdf");
        }
      } else return false;
    }
  },

  created() {
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
        searchHistory: "attachmentSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_ATTACHMENTS",
        title: "header.attachments",
        object: "attachment",
        field: "original_filename",
        databaseId: this.databaseId,
        block: this.block
      });
    }
  },

  watch: {
    "$route.path": {
      handler: function(newVal, oldVal) {
        this.reloadData();
        if (!this.$route.meta.isEdit) {
          if (oldVal) this.clearFiles = true;

          let attachmentHistory;
          let keywords;
          let showMap;
          if (this.isPhotoArchive) {
            attachmentHistory = this.$localStorage.get(
              "photoArchive",
              "fallbackValue"
            );
            keywords = this.$localStorage.get(
              "photoArchiveKeywords",
              "fallbackValue"
            );
            showMap = this.$localStorage.get("mapComponent", "fallbackValue");
          } else if (this.isSpecimenImage) {
            attachmentHistory = this.$localStorage.get(
              "specimenImage",
              "fallbackValue"
            );
            keywords = this.$localStorage.get(
              "specimenImageKeywords",
              "fallbackValue"
            );
          } else if (this.isOtherFile) {
            attachmentHistory = this.$localStorage.get(
              "otherFiles",
              "fallbackValue"
            );
            keywords = this.$localStorage.get(
              "otherFilesKeywords",
              "fallbackValue"
            );
            showMap = this.$localStorage.get("mapComponent", "fallbackValue");
          } else if (this.isDigitisedReference)
            attachmentHistory = this.$localStorage.get(
              "digitisedReference",
              "fallbackValue"
            );

          if (
            this.isNotEmpty(attachmentHistory) &&
            attachmentHistory !== "fallbackValue"
          ) {
            this.attachment = attachmentHistory;
          }
          if (
            this.isNotEmpty(keywords) &&
            keywords !== "fallbackValue" &&
            keywords.length > 0
          )
            this.relatedData.keyword = keywords;
          if (this.isNotEmpty(showMap) && showMap !== "fallbackValue")
            this.showCollapseMap = showMap;

          if (this.isPhotoArchive) {
            if (this.$route.params.imageset) {
              this.attachment.imageset = this.$route.params.imageset;
            }
          }

          if (!this.isDigitisedReference) {
            this.attachment.author = {
              id: this.currentUser.id,
              agent: this.currentUser.agent,
              forename: this.currentUser.forename,
              surename: this.currentUser.surename
            };
          }

          // Universal attachment object
          // const attachmentHistory = this.$localStorage.get('attachment', 'fallbackValue');
          // if (attachmentHistory !== 'fallbackValue' && Object.keys(attachmentHistory).length !== 0 && attachmentHistory.constructor === Object) {
          //   this.attachment = attachmentHistory
          // }
        }
      },
      immediate: true
    },
    attachment: {
      handler: function(newVal) {
        if (this.isNotEmpty(newVal)) {
          this.isAttachmentLocked = newVal.is_locked;
          this.isAttachmentPhotoArchive =
            newVal.specimen_image_attachment === 2;
          this.isAttachmentSpecimenImage =
            newVal.specimen_image_attachment === 1;
          this.isAttachmentOtherFile = newVal.specimen_image_attachment === 3;
          this.isAttachmentDigitisedReference =
            newVal.specimen_image_attachment === 4;
        }
      }
    }
  },

  methods: {
    setInitialData() {
      return {
        relatedTabs: [
          { name: "attach_link__collection", iconClass: "fas fa-server" },
          { name: "attach_link__specimen", iconClass: "fas fa-flask" },
          { name: "attach_link__sample", iconClass: "fas fa-vial" },
          { name: "attach_link__sample_series", iconClass: "fas fa-vials" },
          { name: "attach_link__analysis", iconClass: "fas fa-chart-pie" },
          { name: "attach_link__dataset", iconClass: "fas fa-server" },
          { name: "attach_link__doi", iconClass: "fas fa-database" },
          { name: "attach_link__locality", iconClass: "fas fa-map-marker-alt" },
          { name: "attach_link__drillcore", iconClass: "fas fa-tools" },
          { name: "attach_link__drillcore_box", iconClass: "fas fa-boxes" },
          {
            name: "attach_link__preparation",
            iconClass: "fas fa-prescription-bottle"
          },
          { name: "attach_link__reference", iconClass: "fas fa-book" },
          { name: "attach_link__storage", iconClass: "fas fa-archive" },
          { name: "attach_link__project", iconClass: "fas fa-project-diagram" },
          { name: "attach_link__site", iconClass: "fas fa-map-pin" }
        ],
        searchHistory: "attachmentSearchHistory",
        activeTab: "specimen_identification",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "agent_digitised",
          "author",
          "author_free",
          "copyright_agent",
          "date_created",
          "date_created_free",
          "date_digitised",
          "date_digitised_free",
          "description",
          "description_en",
          "device_txt",
          "id",
          "image_description",
          "image_description_en",
          "image_latitude",
          "image_longitude",
          "image_object",
          "image_people",
          "image_place",
          "image_scalebar",
          "image_type",
          "imageset",
          "is_locked",
          "is_private",
          "licence",
          "locality",
          "reference",
          "remarks",
          "specimen",
          "specimen_image_attachment",
          "stars",
          "storage",
          "type"
        ],
        autocomplete: {
          loaders: {
            agent: false,
            imageset: false,
            reference: false,
            locality: false,
            licence: false,
            copyright_agent: false,
            image_type: false,
            agent_digitised: false,
            keyword: false,
            specimen: false,
            type: false,
            attach_link__collection: false,
            attach_link__specimen: false,
            attach_link__sample: false,
            attach_link__sample_series: false,
            attach_link__analysis: false,
            attach_link__dataset: false,
            attach_link__doi: false,
            attach_link__locality: false,
            attach_link__drillcore: false,
            attach_link__drillcore_box: false,
            attach_link__preparation: false,
            attach_link__reference: false,
            attach_link__storage: false,
            attach_link__project: false,
            attach_link__site: false
          },
          agent: [],
          imageset: [],
          reference: [],
          locality: [],
          licence: [],
          copyright_agent: [],
          image_type: [],
          agent_digitised: [],
          keyword: [],
          specimen: [],
          type: [],
          attach_link__collection: [],
          attach_link__specimen: [],
          attach_link__sample: [],
          attach_link__sample_series: [],
          attach_link__analysis: [],
          attach_link__dataset: [],
          attach_link__doi: [],
          attach_link__locality: [],
          attach_link__drillcore: [],
          attach_link__drillcore_box: [],
          attach_link__preparation: [],
          attach_link__reference: [],
          attach_link__storage: [],
          attach_link__project: [],
          attach_link__site: []
        },
        requiredFields: {
          photo_archive: ["imageset"],
          specimen_image: [this.$route.meta.isEdit ? "specimen" : "author"],
          other_file: ["description", "description_en"],
          digitised_reference: ["reference"]
        },
        optionalFields: {
          photo_archive: ["author", "author_free"],
          specimen_image: ["author", "author_free"],
          other_file: ["author", "author_free"],
          digitised_reference: []
        },
        attachment: this.setDefaultAttachmentFields(),
        rawAttachment: null,
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          fileInput: true,
          file: true,
          requiredFields: true,
          info: true,
          map: true,
          description: true,
          relatedData: true,
          changeType: false
        },
        showCollapseMap: null,
        clearFiles: false,
        files: [],
        selectedRelatedTable: null,
        isAttachmentLocked: false,
        isAttachmentPhotoArchive: false,
        isAttachmentSpecimenImage: false,
        isAttachmentOtherFile: false,
        isAttachmentDigitisedReference: false
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
        this.$emit("set-object", "attachment");
        fetchAttachment(this.$route.params.id, this.currentUser).then(
          response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.$emit("object-exists", true);
              this.attachment = this.handleResponse(response)[0];
              this.rawAttachment = cloneDeep(this.handleResponse(response)[0]);
              this.fillAutocompleteFields(this.attachment);

              this.removeUnnecessaryFields(this.attachment, this.copyFields);
              this.$emit("data-loaded", this.attachment);
              this.sendingData = false;
            } else {
              this.sendingData = false;
              this.$emit("object-exists", false);
            }
          }
        );

        this.loadAutocompleteFields(false, true);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(entity => entity.name)
        );
      }
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchListLicences().then(
          response =>
            (this.autocomplete.licence = this.handleResponse(response))
        );
        fetchListImageType().then(
          response =>
            (this.autocomplete.image_type = this.handleResponse(response))
        );
        fetchListAttachmentType().then(
          response => (this.autocomplete.type = this.handleResponse(response))
        );
      }

      if (relatedDataAutocompleteFields) {
        fetchAttachmentKeyword(this.$route.params.id).then(response => {
          let referenceKeyword = this.handleResponse(response);
          this.relatedData.keyword = referenceKeyword.map(entity => {
            return {
              keyword: entity.keyword__keyword,
              id: entity.keyword
            };
          });
        });

        fetchAttachmentLinkCollections(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__collection = collections.map(entity => {
            return {
              id: entity.collection,
              name: entity.collection__name,
              name_en: entity.collection__name_en
            };
          });
        });
        fetchAttachmentLinkSpecimens(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__specimen = collections.map(entity => {
            return {
              id: entity.specimen,
              specimen_id: entity.specimen_id,
              coll__number: entity.specimen__coll__number
            };
          });
        });
        fetchAttachmentLinkSamples(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__sample = collections.map(entity => {
            return {
              id: entity.sample,
              number: entity.sample__number
            };
          });
        });
        fetchAttachmentLinkSampleSeries(this.$route.params.id).then(
          response => {
            let collections = this.handleResponse(response);
            this.relatedData.attach_link__sample_series = collections.map(
              entity => {
                return {
                  id: entity.sample_series,
                  name: entity.sample_series__name
                };
              }
            );
          }
        );
        fetchAttachmentLinkAnalyses(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__analysis = collections.map(entity => {
            return {
              id: entity.analysis,
              sample__number: entity.analysis__sample__number
            };
          });
        });
        fetchAttachmentLinkDatasets(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__dataset = collections.map(entity => {
            return {
              id: entity.dataset,
              name: entity.dataset__name,
              name_en: entity.dataset__name_en
            };
          });
        });
        fetchAttachmentLinkLocalities(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__locality = collections.map(entity => {
            return {
              id: entity.locality,
              locality: entity.locality__locality,
              locality_en: entity.locality__locality_en
            };
          });
        });
        fetchAttachmentLinkDrillcores(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__drillcore = collections.map(entity => {
            return {
              id: entity.drillcore,
              drillcore: entity.drillcore__drillcore,
              drillcore_en: entity.drillcore__drillcore_en
            };
          });
        });
        fetchAttachmentLinkDrillcoreBoxes(this.$route.params.id).then(
          response => {
            let collections = this.handleResponse(response);
            this.relatedData.attach_link__drillcore_box = collections.map(
              entity => {
                return {
                  id: entity.drillcore_box,
                  drillcore__drillcore:
                    entity.drillcore_box__drillcore__drillcore,
                  drillcore__drillcore_en:
                    entity.drillcore_box__drillcore__drillcore_en
                };
              }
            );
          }
        );
        fetchAttachmentLinkPreparations(this.$route.params.id).then(
          response => {
            let collections = this.handleResponse(response);
            this.relatedData.attach_link__preparation = collections.map(
              entity => {
                return {
                  id: entity.preparation,
                  preparation_number: entity.preparation__preparation_number
                };
              }
            );
          }
        );
        fetchAttachmentLinkReferences(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__reference = collections.map(entity => {
            return {
              id: entity.reference,
              reference: entity.reference__reference
            };
          });
        });
        fetchAttachmentLinkDois(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__doi = collections.map(entity => {
            return {
              id: entity.doi,
              identifier: entity.doi_identifier
            };
          });
        });
        fetchAttachmentLinkStorages(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__storage = collections.map(entity => {
            return {
              id: entity.storage,
              location: entity.storage__location,
              contents: entity.storage__contents
            };
          });
        });
        fetchAttachmentLinkProjects(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__project = collections.map(entity => {
            return {
              id: entity.project,
              name: entity.project__name,
              name_en: entity.project__name_en
            };
          });
        });
        fetchAttachmentLinkSites(this.$route.params.id).then(response => {
          let collections = this.handleResponse(response);
          this.relatedData.attach_link__site = collections.map(entity => {
            return {
              id: entity.site,
              name: entity.site__name,
              name_en: entity.site__name_en
            };
          });
        });
      }
    },

    setDefaultRelatedData() {
      return {
        keyword: [],
        attach_link__collection: [],
        attach_link__specimen: [],
        attach_link__sample: [],
        attach_link__sample_series: [],
        attach_link__analysis: [],
        attach_link__dataset: [],
        attach_link__doi: [],
        attach_link__locality: [],
        attach_link__drillcore: [],
        attach_link__drillcore_box: [],
        attach_link__preparation: [],
        attach_link__reference: [],
        attach_link__storage: [],
        attach_link__project: [],
        attach_link__site: [],
        searchParameters: {
          keyword: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          keyword: 0
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Todo: Remove unnecessary fields from object which does not need them, for example only digitised reference needs reference field

      if (!this.$route.meta.isEdit) {
        if (this.isPhotoArchive) {
          this.$localStorage.set("photoArchive", objectToUpload);
          this.$localStorage.set(
            "photoArchiveKeywords",
            this.relatedData.keyword
          );
        } else if (this.isSpecimenImage) {
          this.$localStorage.set("specimenImage", objectToUpload);
          this.$localStorage.set(
            "specimenImageKeywords",
            this.relatedData.keyword
          );
        } else if (this.isOtherFile) {
          this.$localStorage.set("otherFiles", objectToUpload);
          this.$localStorage.set(
            "otherFilesKeywords",
            this.relatedData.keyword
          );
        } else if (this.isDigitisedReference)
          this.$localStorage.set("digitisedReference", objectToUpload);
        // this.$localStorage.set('attachment', objectToUpload);
      }

      // Autocomplete fields
      if (this.isNotEmpty(uploadableObject.agent_digitised))
        uploadableObject.agent_digitised = uploadableObject.agent_digitised.id;
      if (this.isNotEmpty(uploadableObject.author))
        uploadableObject.author = uploadableObject.author.id;
      if (this.isNotEmpty(uploadableObject.copyright_agent))
        uploadableObject.copyright_agent = uploadableObject.copyright_agent.id;
      if (this.isNotEmpty(uploadableObject.date_created))
        uploadableObject.date_created = this.formatDateForUpload(
          uploadableObject.date_created
        );
      if (this.isNotEmpty(uploadableObject.date_digitised))
        uploadableObject.date_digitised = this.formatDateForUpload(
          uploadableObject.date_digitised
        );
      if (this.isNotEmpty(uploadableObject.image_type))
        uploadableObject.image_type = uploadableObject.image_type.id;
      if (this.isNotEmpty(uploadableObject.imageset))
        uploadableObject.imageset = uploadableObject.imageset.id;
      if (this.isNotEmpty(uploadableObject.licence))
        uploadableObject.licence = uploadableObject.licence.id;
      if (this.isNotEmpty(uploadableObject.locality))
        uploadableObject.locality = uploadableObject.locality.id;
      if (this.isNotEmpty(uploadableObject.specimen))
        uploadableObject.specimen = uploadableObject.specimen.id;
      if (this.isNotEmpty(uploadableObject.reference))
        uploadableObject.reference = uploadableObject.reference.id;
      if (this.isNotEmpty(uploadableObject.type))
        uploadableObject.type = uploadableObject.type.id;
      if (this.isNotEmpty(uploadableObject.coll))
        uploadableObject.coll = uploadableObject.coll.id;

      /* Related Data START */
      uploadableObject.related_data = {};

      if (!this.isDigitisedReference) {
        if (this.isNotEmpty(this.relatedData.keyword))
          uploadableObject.related_data.keyword = this.relatedData.keyword.map(
            keyword => {
              return {
                id: keyword.id
              };
            }
          );
        else uploadableObject.related_data.keyword = null;
      }

      if (this.isOtherFile) {
        this.relatedTabs.forEach(tab => {
          if (
            this.relatedData[tab.name] &&
            this.relatedData[tab.name].length > 0
          ) {
            uploadableObject.related_data[tab.name] = this.relatedData[
              tab.name
            ].map(entity => {
              return {
                id: entity.id
              };
            });
          } else uploadableObject.related_data[tab.name] = null;
        });
      }
      /* Related Data END */

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.agent_digitised__id)) {
        this.$set(this.attachment, "agent_digitised", {
          id: obj.agent_digitised__id,
          agent: obj.agent_digitised__agent
        });
      }
      if (this.isNotEmpty(obj.author_id)) {
        this.$set(this.attachment, "author", {
          id: obj.author_id,
          agent: obj.author__agent
        });
      }
      if (this.isNotEmpty(obj.copyright_agent__id)) {
        this.$set(this.attachment, "copyright_agent", {
          id: obj.copyright_agent__id,
          agent: obj.copyright_agent__agent
        });
      }
      if (this.isNotEmpty(obj.image_type__id)) {
        this.$set(this.attachment, "image_type", {
          id: obj.image_type__id,
          value: obj.image_type__value,
          value_en: obj.image_type__value_en
        });
      }
      if (this.isNotEmpty(obj.imageset__id)) {
        this.$set(this.attachment, "imageset", {
          id: obj.imageset__id,
          imageset_number: obj.imageset__imageset_number
        });
      }
      if (this.isNotEmpty(obj.licence__id)) {
        this.$set(this.attachment, "licence", {
          id: obj.licence__id,
          licence: obj.licence__licence,
          licence_en: obj.licence__licence_en
        });
      }
      if (this.isNotEmpty(obj.locality)) {
        this.$set(this.attachment, "locality", {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        });
      }
      if (this.isNotEmpty(obj.specimen__id)) {
        this.$set(this.attachment, "specimen", {
          id: obj.specimen__id,
          specimen_id: obj.specimen_id,
          coll__number: obj.specimen__coll__number
        });
      }
      if (this.isNotEmpty(obj.reference)) {
        this.$set(this.attachment, "reference", {
          id: obj.reference,
          reference: obj.reference__reference
        });
      }
      if (this.isNotEmpty(obj.type)) {
        this.$set(this.attachment, "type", {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en
        });
      }
      if (this.isNotEmpty(obj.coll)) {
        this.$set(this.attachment, "coll", {
          id: obj.coll,
          number: obj.coll__number
        });
      }
    },

    /* MultimediaComponent Events START */
    addFiles(files) {
      this.files = files;
    },

    clearUploadedFiles() {
      this.clearFiles = false;
      this.files = [];
    },

    updateFields(metadata) {
      console.log("FILE METADATA: ");
      console.log(metadata);
      if (this.isPhotoArchive || this.isSpecimenImage || this.isOtherFile) {
        // DATE
        if (metadata.DateTimeOriginal) {
          let formattedDate = this.$moment(
            metadata.DateTimeOriginal,
            "YYYY:MM:DD HH:mm:ss"
          );
          this.attachment.date_created = formattedDate.toDate();
        } else if (metadata.DateTime) {
          let formattedDate = this.$moment(
            metadata.DateTime,
            "YYYY:MM:DD HH:mm:ss"
          );
          this.attachment.date_created = formattedDate.toDate();
        } else this.attachment.date_created = new Date();

        // DEVICE_TXT
        if (metadata.Model) this.attachment.device_txt = metadata.Model;
        else if (metadata.Make) this.attachment.device_txt = metadata.Make;

        // IMAGE DIMENSIONS
        if (metadata.PixelXDimension)
          this.attachment.image_width = metadata.PixelXDimension;
        else this.attachment.image_width = null;
        if (metadata.PixelYDimension)
          this.attachment.image_height = metadata.PixelYDimension;
        else this.attachment.image_height = null;

        if (this.isSpecimenImage) {
          // DESCRIPTION
          if (
            metadata.ImageDescription &&
            metadata.ImageDescription.trim().length > 0
          ) {
            this.attachment.image_description_en = metadata.ImageDescription.trim();
          }
        } else {
          // DESCRIPTION
          if (
            metadata.ImageDescription &&
            metadata.ImageDescription.trim().length > 0
          ) {
            this.attachment.description_en = metadata.ImageDescription.trim();
          }
        }

        if (this.isPhotoArchive) {
          // GPS DATA
          if (metadata.GPSLatitude) {
            const degrees =
              metadata.GPSLatitude[0].numerator /
              metadata.GPSLatitude[0].denominator;
            const minutes =
              metadata.GPSLatitude[1].numerator /
              metadata.GPSLatitude[1].denominator;
            const seconds =
              metadata.GPSLatitude[2].numerator /
              metadata.GPSLatitude[2].denominator;
            const latitude = this.convertExifGPSToDecimal(
              degrees,
              minutes,
              seconds,
              metadata.GPSLatitudeRef
            );

            this.attachment.image_latitude = latitude.toFixed(6);
          } else this.attachment.image_latitude = null;
          if (metadata.GPSLongitude) {
            const degrees =
              metadata.GPSLongitude[0].numerator /
              metadata.GPSLongitude[0].denominator;
            const minutes =
              metadata.GPSLongitude[1].numerator /
              metadata.GPSLongitude[1].denominator;
            const seconds =
              metadata.GPSLongitude[2].numerator /
              metadata.GPSLongitude[2].denominator;
            const longitude = this.convertExifGPSToDecimal(
              degrees,
              minutes,
              seconds,
              metadata.GPSLatitudeRef
            );

            this.attachment.image_longitude = longitude.toFixed(6);
          } else this.attachment.image_longitude = null;
        }
      }
    },

    convertExifGPSToDecimal(degrees, minutes, seconds, direction) {
      // Formula from https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#Coordinate_format_conversion
      let decimalDegrees = degrees + minutes / 60 + seconds / 3600;
      if (direction === "S" || direction === "W") {
        decimalDegrees = decimalDegrees * -1;
      }
      return decimalDegrees;
    },
    /* MultimediaComponent Events END */

    /* MapComponent Event START */
    updateLocation(location) {
      this.$set(this.attachment, "image_latitude", location.lat.toFixed(6));
      this.$set(this.attachment, "image_longitude", location.lng.toFixed(6));
    },
    /* MapComponent Event END */

    // This method is run if author field changes
    resetImageset() {
      this.attachment.imageset = null;
      this.autocomplete.imagesets = [];
    },

    isValidToChangeTo(changeTo) {
      if (changeTo === "specimenImage") {
        return true;
      } else if (changeTo === "photoArchive") {
        return this.isImageFile;
      } else if (changeTo === "otherFile") {
        return true;
      } else if (changeTo === "digitisedReference") {
        return this.isPdfFile;
      }
    },

    getAttachmentTypeAsString(type) {
      if (type === 2) return "photoArchive";
      else if (type === 1) return "specimenImage";
      else if (type === 3) return "otherFiles";
      else if (type === 4) return "digitisedReference";
    },

    clearLocalStorage() {
      if (this.isPhotoArchive) {
        this.$localStorage.remove("photoArchive");
        this.$localStorage.remove("photoArchiveKeywords");
      } else if (this.isSpecimenImage) {
        this.$localStorage.remove("specimenImage");
        this.$localStorage.remove("specimenImageKeywords");
      } else if (this.isOtherFile) {
        this.$localStorage.remove("otherFiles");
        this.$localStorage.remove("otherFilesKeywords");
      } else if (this.isDigitisedReference)
        this.$localStorage.remove("digitisedReference");

      toastInfo({ text: this.$t("messages.defaultsRemoved") });
    },

    customSpecimenLabel(option) {
      if (option.coll__number !== null) {
        return `${option.coll__number.split(" ")[0]} ${option.specimen_id} (${
          option.id
        })`;
      } else {
        return `${option.specimen_id} (${option.id})`;
      }
    },

    customLabelForRelatedData(option) {
      switch (this.selectedRelatedTable) {
        case "collection":
        case "dataset":
        case "project":
        case "site":
          if (this.$i18n.locale === "ee")
            return `${option.id} - (${option.name})`;
          return `${option.id} - (${option.name_en})`;
        case "specimen":
          if (option.coll__number === null)
            return `${option.specimen_id} (${option.id})`;
          else
            return `${option.coll__number.split(" ")[0]} ${
              option.specimen_id
            } (${option.id})`;
        case "sample":
          return `${option.id} - (${option.number})`;
        case "sample_series":
          return `${option.id} - (${option.name})`;
        case "analysis":
          if (option.sample__number)
            return `${option.id} - (${option.sample__number})`;
          else return `${option.id}`;
        case "doi":
          return `${option.id} - (${option.identifier})`;
        case "locality":
          if (this.$i18n.locale === "ee")
            return `${option.id} - (${option.locality})`;
          return `${option.id} - (${option.locality_en})`;
        case "drillcore":
          if (this.$i18n.locale === "ee")
            return `${option.id} - (${option.drillcore})`;
          return `${option.id} - (${option.drillcore_en})`;
        case "drillcore_box":
          if (this.$i18n.locale === "ee")
            return `${option.id} - (${option.drillcore__drillcore} - ${option.number})`;
          return `${option.id} - (${option.drillcore__drillcore_en} - ${option.number})`;
        case "preparation":
          return `${option.id} - (${option.preparation_number})`;
        case "reference":
          return `${option.id} - (${option.reference})`;
        case "storage":
          if (option.contents === null)
            return `${option.id} - (${option.location})`;
          else
            return `${option.id} - (${option.location} - ${option.contents})`;
        default:
          return `${option.id}`;
      }
    },

    setDefaultAttachmentFields() {
      let defaultFields = {
        date_created: new Date(),
        image_type: {
          id: 5,
          value: "digipilt",
          value_en: "digital image"
        },
        type: {
          id: 1,
          value: "foto",
          value_en: "image"
        },
        stars: 0
      };
      if (this.isPhotoArchive) defaultFields.specimen_image_attachment = 2;
      else if (this.isSpecimenImage)
        defaultFields.specimen_image_attachment = 1;
      else if (this.isOtherFile) defaultFields.specimen_image_attachment = 3;
      else if (this.isDigitisedReference) {
        defaultFields.specimen_image_attachment = 4;
        defaultFields.type = {
          id: 4,
          value: "publikatsioon",
          value_en: "publication"
        };
        defaultFields.stars = null;
      }
      return defaultFields;
    },

    setDefaultSearchParameters() {
      return {
        image_number: null,
        filename: null,
        specimen: null,
        imageInfo: null,
        locality: null,
        specimen_image_attachment: ["2", "1", "3", "4"],
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
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

.delete-relation {
  transition: background-color 500ms ease-in-out;
  vertical-align: middle;
}

.delete-relation:hover {
  cursor: pointer;
  background-color: rgba(220, 53, 69, 0.7);
}
</style>
