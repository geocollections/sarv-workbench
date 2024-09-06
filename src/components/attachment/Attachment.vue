<template>
  <attachment-wrapper
    :is-photo-archive="isPhotoArchive"
    :is-specimen-image="isSpecimenImage"
    :is-other-file="isOtherFile"
    :is-digitised-reference="isDigitisedReference"
    :is-locked="isAttachmentLocked"
  >
    <template v-slot:locked-info>
      <div class="locked-info">
        <v-alert
          class="text-center mb-0"
          border="left"
          elevation="3"
          prominent
          :color="bodyColor.split('n-')[0] + 'n-2'"
        >
          <b>{{ $t("messages.lockedForm") }}</b>
        </v-alert>
      </div>
    </template>

    <template v-slot:file-input>
      <v-card
        class="mt-2"
        id="block-fileInput"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.fileInput = !block.fileInput"
          >
            <span>{{ $t("attachment.file") }}</span>
            <v-icon right>far fa-file</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.fileInput = !block.fileInput"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.fileInput ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.fileInput" class="pa-1">
            <file-input
              show-new-files-immediately
              accept-multiple
              :record-options="recordOptions"
              :record-image="recordImage"
              :record-video="recordVideo"
              :record-audio="recordAudio"
              :acceptable-format="fileInputFormat"
              v-on:file-uploaded="addFiles"
              v-on:metadata-loaded="onMetadataLoaded"
              v-on:files-cleared="clearUploadedFiles"
            />
          </div>
        </transition>
      </v-card>
    </template>

    <template v-slot:file-output>
      <v-card
        class="mt-2"
        id="block-file"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div class="card-title--clickable" @click="block.file = !block.file">
            <span>{{ $t("attachment.file") }}</span>
            <v-icon right>far fa-file</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.file = !block.file"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.file ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.file" class="pa-1">
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pa-1">
                <attachment-file
                  :data="rawAttachment"
                  :rotation-degrees="imageRotationDegrees"
                  :key="filePreviewKey"
                  @rotate="imageRotationDegrees = $event"
                />
              </v-col>

              <v-col cols="12" md="6" class="pa-1">
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
          :color="bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.requiredFields = !block.requiredFields"
            >
              <span>{{ $t("common.requiredFields") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- AUTHOR, AUTHOR FREE and IMAGESET -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.author"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('attachment.author__agent')"
                    use-custom-state
                    :error="
                      !(
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free)
                      )
                    "
                    :success="
                      isNotEmpty(attachment.author) ||
                      isNotEmpty(attachment.author_free)
                    "
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <input-wrapper
                    v-model="attachment.author_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.author_free')"
                    use-custom-state
                    :error="
                      !(
                        isNotEmpty(attachment.author_free) ||
                        isNotEmpty(attachment.author)
                      )
                    "
                    :success="
                      isNotEmpty(attachment.author_free) ||
                      isNotEmpty(attachment.author)
                    "
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <div class="d-flex">
                    <div class="flex-grow-1 mr-3">
                      <autocomplete-wrapper
                        v-model="attachment.imageset"
                        :color="bodyActiveColor"
                        :items="autocomplete.imageset"
                        :loading="autocomplete.loaders.imageset"
                        item-text="imageset_number"
                        :label="$t('attachment.imageset')"
                        use-state
                        is-link
                        route-object="imageset"
                        is-searchable
                        v-on:search:items="autocompleteImagesetSearch"
                      />
                    </div>

                    <div class="align-self-end">
                      <v-btn
                        icon
                        :to="{ path: '/imageset/add' }"
                        :title="$t('header.addImageset')"
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
          :color="bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.info = !block.info"
            >
              <span>{{ $t("attachment.info") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- DATE_CREATED and DATE_CREATED_FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <date-wrapper
                    v-model="attachment.date_created"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateCreated')"
                    v-on:date:clear="attachment.date_created = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_created', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.date_created_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateCreatedFree')"
                  />
                </v-col>
              </v-row>

              <!-- IMAGE PLACE and LOCALITY -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_place"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imagePlace')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.locality"
                    :color="bodyActiveColor"
                    :items="autocomplete.locality"
                    :loading="autocomplete.loaders.locality"
                    :item-text="localityLabel"
                    :label="$t('attachment.locality__locality')"
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
                    @change="updateLocationUsingLocality"
                  />
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- MAP -->
        <v-card
          class="mt-2"
          id="block-map"
          :color="bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.map = !block.map">
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
            <div v-show="block.map" class="pa-1">
              <!-- IMAGE LATITUDE and IMAGE LONGITUDE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_latitude"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageLatitude')"
                    type="number"
                    step="0.000001"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_longitude"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageLongitude')"
                    type="number"
                    step="0.000001"
                  />
                </v-col>
              </v-row>

              <!-- MAP SWITCH -->
              <v-card
                class="d-flex flex-row justify-start mb-1 mx-3"
                flat
                tile
                :color="bodyColor.split('n-')[0] + 'n-5'"
              >
                <v-card
                  flat
                  tile
                  class="align-self-center mr-2"
                  :color="bodyColor.split('n-')[0] + 'n-5'"
                >
                  <v-switch
                    v-model="myShowMap"
                    hide-details
                    id="map-switch"
                    class="vuetify-switch my-1"
                  ></v-switch>
                </v-card>

                <v-card
                  flat
                  tile
                  class="align-self-center flex-grow-1"
                  :color="bodyColor.split('n-')[0] + 'n-5'"
                >
                  <label class="m-0" :for="`map-switch`">
                    <i class="far fa-map"></i>
                    {{
                      myShowMap ? $t("site.mapEnabled") : $t("site.mapDisabled")
                    }}
                  </label>
                </v-card>

                <v-btn
                  class="align-self-center ml-2"
                  v-if="attachment.image_latitude || attachment.image_longitude"
                  small
                  @click="resetLocation"
                  color="error"
                  >Reset location
                  <v-icon right small>fas fa-map-marker-alt</v-icon>
                </v-btn>
              </v-card>

              <!-- MAP -->
              <v-row no-gutters v-show="myShowMap" class="mt-1">
                <v-col cols="12" class="pa-1">
                  <map-component
                    :show-map="myShowMap && block.map"
                    mode="single"
                    module="attachment"
                    v-bind:locations="[]"
                    v-bind:location="{
                      lat: attachment.image_latitude
                        ? attachment.image_latitude.toString()
                        : null,
                      lng: attachment.image_longitude
                        ? attachment.image_longitude.toString()
                        : null,
                    }"
                    v-on:update-coordinates="updateLocation"
                  ></map-component>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- IMAGE INFO -->
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
            <div v-show="block.description" class="pa-1">
              <!-- OBJECT and PEOPLE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_object"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageObject')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_people"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imagePeople')"
                  />
                </v-col>
              </v-row>

              <!-- DESCRIPTION -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.image_description"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageDescription')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.image_description_en"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageDescriptionEn')"
                  />
                </v-col>
              </v-row>

              <!-- KEYWORDS -->
              <div class="d-flex justify-start flex-wrap pa-1">
                <div class="mr-3 flex-grow-1">
                  <autocomplete-wrapper
                    v-model="relatedData.keyword"
                    :color="bodyActiveColor"
                    :items="autocomplete.keyword"
                    :loading="autocomplete.loaders.keyword"
                    item-text="keyword"
                    :label="$t('attachment.keywords')"
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
                  />
                </div>

                <div class="mr-2 my-1 align-self-end">
                  <v-btn
                    icon
                    color="green"
                    :title="$t('add.new')"
                    @click="windowOpenNewTab('/keyword/add')"
                    target="newKeywordWindow"
                  >
                    <v-icon>fas fa-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.licence"
                    :color="bodyActiveColor"
                    :items="autocomplete.licence"
                    :loading="autocomplete.loaders.licence"
                    :item-text="licenceLabel"
                    :label="$t('common.licence')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.copyright_agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.copyright_agent"
                    :loading="autocomplete.loaders.copyright_agent"
                    item-text="agent"
                    :label="$t('attachment.copyrightAgent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteCopyrightAgentSearch"
                  />
                </v-col>
              </v-row>

              <!-- IMAGE_TYPE and DEVICE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.image_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.image_type"
                    :loading="autocomplete.loaders.image_type"
                    :item-text="commonLabel"
                    :label="$t('attachment.imageType')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.device_txt"
                    :color="bodyActiveColor"
                    :label="$t('attachment.deviceTxt')"
                  />
                </v-col>
              </v-row>

              <!-- AGENT, DATE DIGITISED and STARS -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.agent_digitised"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent_digitised"
                    :loading="autocomplete.loaders.agent_digitised"
                    item-text="agent"
                    :label="$t('attachment.agentDigitised')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentDigitisedSearch"
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <date-wrapper
                    v-model="attachment.date_digitised"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateDigitised')"
                    v-on:date:clear="attachment.date_digitised = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_digitised', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <select-wrapper
                    v-model="attachment.stars"
                    :color="bodyActiveColor"
                    :label="$t('attachment.stars')"
                    :items="ratings"
                    item-text="value"
                    translation-prefix="main.rating"
                    :clearable="false"
                  />
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- RELATED DATA -->
        <v-card
          class="mt-2"
          id="block-relatedData"
          :color="bodyColor.split('n-')[0] + 'n-5'"
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
            <div v-show="block.relatedData" class="pa-1">
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <select-wrapper
                    v-model="selectedRelatedTable"
                    :color="bodyActiveColor"
                    :label="$t('attachment.relatedData')"
                    :items="relatedTabs"
                    item-text="name_short"
                    translation-prefix="attachment.relatedTables.attachment_link__"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                  class="pa-1"
                  v-if="selectedRelatedTable"
                >
                  <autocomplete-wrapper
                    v-model="
                      relatedData['attachment_link__' + selectedRelatedTable]
                    "
                    :color="bodyActiveColor"
                    :items="
                      autocomplete['attachment_link__' + selectedRelatedTable]
                    "
                    :loading="
                      autocomplete.loaders[
                        'attachment_link__' + selectedRelatedTable
                      ]
                    "
                    :item-text="customLabelForRelatedData"
                    :label="
                      $t(
                        'attachment.relatedTables.attachment_link__' +
                          selectedRelatedTable
                      )
                    "
                    is-link
                    is-searchable
                    :route-object="selectedRelatedTable"
                    v-on:search:items="
                      autocompleteRelatedDataSearch(
                        $event,
                        selectedRelatedTable
                      )
                    "
                    attachment-related-data
                    :multiple="true"
                    v-on:chip:close="
                      relatedData[
                        'attachment_link__' + selectedRelatedTable
                      ].splice(
                        relatedData[
                          'attachment_link__' + selectedRelatedTable
                        ].indexOf($event),
                        1
                      )
                    "
                  />
                </v-col>
              </v-row>

              <!-- SHOWING RELATED_DATA -->
              <v-row no-gutters>
                <!-- COLLECTION -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__collection &&
                    relatedData.attachment_link__collection.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__collection")
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__collection"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'collection',
                                  id: entity.id,
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
                              relatedData.attachment_link__collection.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__specimen &&
                    relatedData.attachment_link__specimen.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__specimen")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__specimen"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'specimen',
                                  id: entity.id,
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
                              relatedData.attachment_link__specimen.splice(
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

                <!-- SAMPLE -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__sample &&
                    relatedData.attachment_link__sample.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.attachment_link__sample") }}
                  </p>

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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__sample"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'sample',
                                  id: entity.id,
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
                              relatedData.attachment_link__sample.splice(
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

                <!-- SAMPLE_SERIES -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__sample_series &&
                    relatedData.attachment_link__sample_series.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t(
                        "attachment.relatedTables.attachment_link__sample_series"
                      )
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__sample_series"
                          :key="index"
                        >
                          <td>{{ entity.id }}</td>

                          <td>{{ entity.name }}</td>

                          <td
                            class="text-center delete-relation"
                            @click="
                              relatedData.attachment_link__sample_series.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__analysis &&
                    relatedData.attachment_link__analysis.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__analysis")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__analysis"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'analysis',
                                  id: entity.id,
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
                              relatedData.attachment_link__analysis.splice(
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

                <!-- DATASET -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__dataset &&
                    relatedData.attachment_link__dataset.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__dataset")
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__dataset"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'dataset',
                                  id: entity.id,
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
                              relatedData.attachment_link__dataset.splice(
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

                <!-- DOI -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__doi &&
                    relatedData.attachment_link__doi.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.attachment_link__doi") }}
                  </p>

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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__doi"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'doi',
                                  id: entity.id,
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
                              relatedData.attachment_link__doi.splice(index, 1)
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__locality &&
                    relatedData.attachment_link__locality.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__locality")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__locality"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'locality',
                                  id: entity.id,
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
                              relatedData.attachment_link__locality.splice(
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

                <!-- DRILLCORE -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__drillcore &&
                    relatedData.attachment_link__drillcore.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__drillcore")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__drillcore"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'drillcore',
                                  id: entity.id,
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
                              relatedData.attachment_link__drillcore.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__drillcore_box &&
                    relatedData.attachment_link__drillcore_box.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t(
                        "attachment.relatedTables.attachment_link__drillcore_box"
                      )
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__drillcore_box"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'corebox',
                                  id: entity.id,
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
                              relatedData.attachment_link__drillcore_box.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__preparation !== null &&
                    relatedData.attachment_link__preparation.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t(
                        "attachment.relatedTables.attachment_link__preparation"
                      )
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__preparation"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'preparation',
                                  id: entity.id,
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
                              relatedData.attachment_link__preparation.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__reference !== null &&
                    relatedData.attachment_link__reference.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("common.reference") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.reference") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__reference"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'reference',
                                  id: entity.id,
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
                              relatedData.attachment_link__reference.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__storage !== null &&
                    relatedData.attachment_link__storage.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__storage")
                    }}
                  </p>

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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__storage"
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
                              relatedData.attachment_link__storage.splice(
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

                <!-- PROJECT -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__project !== null &&
                    relatedData.attachment_link__project.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__project")
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__project"
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
                              relatedData.attachment_link__project.splice(
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

                <!-- SITE -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__site !== null &&
                    relatedData.attachment_link__site.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.attachment_link__site") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__site"
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
                              relatedData.attachment_link__site.splice(index, 1)
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

    <template v-slot:specimen-image>
      <div class="specimen-image">
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
              <span>{{ $t("common.requiredFields") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- AUTHOR and AUTHOR FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.author"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('attachment.author__agent')"
                    use-custom-state
                    :error="
                      !(
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free)
                      )
                    "
                    :success="
                      isNotEmpty(attachment.author) ||
                      isNotEmpty(attachment.author_free)
                    "
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.author_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.author_free')"
                    use-custom-state
                    :error="
                      !(
                        isNotEmpty(attachment.author_free) ||
                        isNotEmpty(attachment.author)
                      )
                    "
                    :success="
                      isNotEmpty(attachment.author_free) ||
                      isNotEmpty(attachment.author)
                    "
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
            <div
              class="card-title--clickable"
              @click="block.info = !block.info"
            >
              <span>{{ $t("attachment.info") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- SPECIMEN and SCALEBAR -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.specimen"
                    :color="bodyActiveColor"
                    :items="autocomplete.specimen"
                    :loading="autocomplete.loaders.specimen"
                    :item-text="customLabelForSpecimen"
                    :label="$t('attachment.specimen__specimen_id')"
                    use-state
                    is-link
                    route-object="specimen"
                    is-searchable
                    v-on:search:items="autocompleteSpecimenSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_scalebar"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageScalebar')"
                  />
                </v-col>
              </v-row>

              <!-- DATE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <date-wrapper
                    v-model="attachment.date_created"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateCreated')"
                    v-on:date:clear="attachment.date_created = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_created', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.date_created_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateCreatedFree')"
                  />
                </v-col>
              </v-row>

              <!-- DESCRIPTION -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.image_description"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageDescription')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.image_description_en"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageDescriptionEn')"
                  />
                </v-col>
              </v-row>

              <!-- IMAGE SIZE MM -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.image_width_mm"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageWidthMm')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.image_height_mm"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageHeightMm')"
                  />
                </v-col>
              </v-row>

              <!-- KEYWORDS -->
              <div class="d-flex justify-start flex-wrap pa-1">
                <div class="mr-3 flex-grow-1">
                  <autocomplete-wrapper
                    v-model="relatedData.keyword"
                    :color="bodyActiveColor"
                    :items="autocomplete.keyword"
                    :loading="autocomplete.loaders.keyword"
                    item-text="keyword"
                    :label="$t('attachment.keywords')"
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
                  />
                </div>

                <div class="mr-2 my-1 align-self-end">
                  <v-btn
                    icon
                    :title="$t('add.new')"
                    @click="windowOpenNewTab('/keyword/add')"
                    target="newKeywordWindow"
                    color="green"
                  >
                    <v-icon>fas fa-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.licence"
                    :color="bodyActiveColor"
                    :items="autocomplete.licence"
                    :loading="autocomplete.loaders.licence"
                    :item-text="licenceLabel"
                    :label="$t('common.licence')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.copyright_agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.copyright_agent"
                    :loading="autocomplete.loaders.copyright_agent"
                    item-text="agent"
                    :label="$t('attachment.copyrightAgent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteCopyrightAgentSearch"
                  />
                </v-col>
              </v-row>

              <!-- IMAGE_TYPE and DEVICE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.image_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.image_type"
                    :loading="autocomplete.loaders.image_type"
                    :item-text="commonLabel"
                    :label="$t('attachment.imageType')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.device_txt"
                    :color="bodyActiveColor"
                    :label="$t('attachment.deviceTxt')"
                  />
                </v-col>
              </v-row>

              <!-- AGENT, DATE DIGITISED and STARS -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.agent_digitised"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent_digitised"
                    :loading="autocomplete.loaders.agent_digitised"
                    item-text="agent"
                    :label="$t('attachment.agentDigitised')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentDigitisedSearch"
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <date-wrapper
                    v-model="attachment.date_digitised"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateDigitised')"
                    v-on:date:clear="attachment.date_digitised = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_digitised', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <select-wrapper
                    v-model="attachment.stars"
                    :color="bodyActiveColor"
                    :label="$t('attachment.stars')"
                    :items="ratings"
                    item-text="value"
                    translation-prefix="main.rating"
                    :clearable="false"
                  />
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
          :color="bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.requiredFields = !block.requiredFields"
            >
              <span>{{ $t("common.requiredFields") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- AUTHOR and AUTHOR FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.author"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('attachment.author__agent')"
                    use-custom-state
                    :error="
                      !(
                        isNotEmpty(attachment.author) ||
                        isNotEmpty(attachment.author_free)
                      )
                    "
                    :success="
                      isNotEmpty(attachment.author) ||
                      isNotEmpty(attachment.author_free)
                    "
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.author_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.author_free')"
                    use-custom-state
                    :error="
                      !(
                        isNotEmpty(attachment.author_free) ||
                        isNotEmpty(attachment.author)
                      )
                    "
                    :success="
                      isNotEmpty(attachment.author_free) ||
                      isNotEmpty(attachment.author)
                    "
                  />
                </v-col>
              </v-row>

              <!-- DESCRIPTION and DESCRIPTION_EN -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.description"
                    :color="bodyActiveColor"
                    :label="$t('common.description')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.description_en"
                    :color="bodyActiveColor"
                    :label="$t('common.description_en')"
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
            <div
              class="card-title--clickable"
              @click="block.info = !block.info"
            >
              <span>{{ $t("attachment.info") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- DATE_CREATED, DATE_CREATED_FREE and TYPE -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="pa-1">
                  <date-wrapper
                    v-model="attachment.date_created"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateCreated')"
                    v-on:date:clear="attachment.date_created = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_created', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <input-wrapper
                    v-model="attachment.date_created_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateCreatedFree')"
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.type"
                    :color="bodyActiveColor"
                    :items="autocomplete.type"
                    :loading="autocomplete.loaders.type"
                    :item-text="commonLabel"
                    :label="$t('common.type')"
                  />
                </v-col>
              </v-row>

              <!-- REMARKS -->
              <v-row no-gutters>
                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="attachment.remarks"
                    :color="bodyActiveColor"
                    :label="$t('common.remarks')"
                  />
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- MAP -->
        <v-card
          class="mt-2"
          id="block-map"
          :color="bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div class="card-title--clickable" @click="block.map = !block.map">
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
            <div v-show="block.map" class="pa-1">
              <!-- IMAGE LATITUDE and IMAGE LONGITUDE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_latitude"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageLatitude')"
                    type="number"
                    step="0.000001"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.image_longitude"
                    :color="bodyActiveColor"
                    :label="$t('attachment.imageLongitude')"
                    type="number"
                    step="0.000001"
                  />
                </v-col>
              </v-row>

              <!-- MAP SWITCH -->
              <v-card
                class="d-flex flex-row justify-start mb-1 mx-3"
                flat
                tile
                :color="bodyColor.split('n-')[0] + 'n-5'"
              >
                <v-card
                  flat
                  tile
                  class="align-self-center mr-2"
                  :color="bodyColor.split('n-')[0] + 'n-5'"
                >
                  <v-switch
                    v-model="myShowMap"
                    hide-details
                    id="map-switch"
                    class="vuetify-switch my-1"
                  ></v-switch>
                </v-card>

                <v-card
                  flat
                  tile
                  class="align-self-center flex-grow-1"
                  :color="bodyColor.split('n-')[0] + 'n-5'"
                >
                  <label class="m-0" :for="`map-switch`">
                    <i class="far fa-map"></i>
                    {{
                      myShowMap ? $t("site.mapEnabled") : $t("site.mapDisabled")
                    }}
                  </label>
                </v-card>

                <v-btn
                  class="align-self-center ml-2"
                  v-if="attachment.image_latitude || attachment.image_longitude"
                  small
                  @click="resetLocation"
                  color="error"
                  >Reset location
                  <v-icon right small>fas fa-map-marker-alt</v-icon>
                </v-btn>
              </v-card>

              <!-- MAP -->
              <v-row no-gutters v-show="myShowMap" class="mt-1">
                <v-col cols="12" class="pa-1">
                  <map-component
                    :show-map="myShowMap && block.map"
                    mode="single"
                    module="attachment"
                    v-bind:locations="[]"
                    v-bind:location="{
                      lat: attachment.image_latitude
                        ? attachment.image_latitude.toString()
                        : null,
                      lng: attachment.image_longitude
                        ? attachment.image_longitude.toString()
                        : null,
                    }"
                    v-on:update-coordinates="updateLocation"
                  ></map-component>
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- FILE INFO -->
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
            <div v-show="block.description" class="pa-1">
              <!-- KEYWORDS -->
              <div class="d-flex justify-start flex-wrap pa-1">
                <div class="mr-3 flex-grow-1">
                  <autocomplete-wrapper
                    v-model="relatedData.keyword"
                    :color="bodyActiveColor"
                    :items="autocomplete.keyword"
                    :loading="autocomplete.loaders.keyword"
                    item-text="keyword"
                    :label="$t('attachment.keywords')"
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
                  />
                </div>

                <div class="mr-2 my-1 align-self-end">
                  <v-btn
                    icon
                    :title="$t('add.new')"
                    @click="windowOpenNewTab('/keyword/add')"
                    target="newKeywordWindow"
                    color="green"
                  >
                    <v-icon>fas fa-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.licence"
                    :color="bodyActiveColor"
                    :items="autocomplete.licence"
                    :loading="autocomplete.loaders.licence"
                    :item-text="licenceLabel"
                    :label="$t('common.licence')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.copyright_agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.copyright_agent"
                    :loading="autocomplete.loaders.copyright_agent"
                    item-text="agent"
                    :label="$t('attachment.copyrightAgent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteCopyrightAgentSearch"
                  />
                </v-col>
              </v-row>

              <!-- IMAGE_TYPE and DEVICE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.image_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.image_type"
                    :loading="autocomplete.loaders.image_type"
                    :item-text="commonLabel"
                    :label="$t('attachment.imageType')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.device_txt"
                    :color="bodyActiveColor"
                    :label="$t('attachment.deviceTxt')"
                  />
                </v-col>
              </v-row>

              <!-- AGENT and DATE DIGITISED -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.agent_digitised"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent_digitised"
                    :loading="autocomplete.loaders.agent_digitised"
                    item-text="agent"
                    :label="$t('attachment.agentDigitised')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentDigitisedSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <date-wrapper
                    v-model="attachment.date_digitised"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateDigitised')"
                    v-on:date:clear="attachment.date_digitised = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_digitised', $event)
                    "
                  />
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>

        <!-- RELATED DATA -->
        <v-card
          class="mt-2"
          id="block-relatedData"
          :color="bodyColor.split('n-')[0] + 'n-5'"
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
            <div v-show="block.relatedData" class="pa-1">
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <select-wrapper
                    v-model="selectedRelatedTable"
                    :color="bodyActiveColor"
                    :label="$t('attachment.relatedData')"
                    :items="relatedTabs"
                    item-text="name_short"
                    translation-prefix="attachment.relatedTables.attachment_link__"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                  class="pa-1"
                  v-if="selectedRelatedTable"
                >
                  <autocomplete-wrapper
                    v-model="
                      relatedData['attachment_link__' + selectedRelatedTable]
                    "
                    :color="bodyActiveColor"
                    :items="
                      autocomplete['attachment_link__' + selectedRelatedTable]
                    "
                    :loading="
                      autocomplete.loaders[
                        'attachment_link__' + selectedRelatedTable
                      ]
                    "
                    :item-text="customLabelForRelatedData"
                    :label="
                      $t(
                        'attachment.relatedTables.attachment_link__' +
                          selectedRelatedTable
                      )
                    "
                    is-link
                    is-searchable
                    :route-object="selectedRelatedTable"
                    v-on:search:items="
                      autocompleteRelatedDataSearch(
                        $event,
                        selectedRelatedTable
                      )
                    "
                    attachment-related-data
                    :multiple="true"
                    v-on:chip:close="
                      relatedData[
                        'attachment_link__' + selectedRelatedTable
                      ].splice(
                        relatedData[
                          'attachment_link__' + selectedRelatedTable
                        ].indexOf($event),
                        1
                      )
                    "
                  />
                </v-col>
              </v-row>

              <!-- SHOWING RELATED_DATA -->
              <v-row no-gutters>
                <!-- COLLECTION -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__collection &&
                    relatedData.attachment_link__collection.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__collection")
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__collection"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'collection',
                                  id: entity.id,
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
                              relatedData.attachment_link__collection.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__specimen &&
                    relatedData.attachment_link__specimen.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__specimen")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__specimen"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'specimen',
                                  id: entity.id,
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
                              relatedData.attachment_link__specimen.splice(
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

                <!-- SAMPLE -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__sample &&
                    relatedData.attachment_link__sample.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.attachment_link__sample") }}
                  </p>

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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__sample"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'sample',
                                  id: entity.id,
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
                              relatedData.attachment_link__sample.splice(
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

                <!-- SAMPLE_SERIES -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__sample_series &&
                    relatedData.attachment_link__sample_series.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t(
                        "attachment.relatedTables.attachment_link__sample_series"
                      )
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__sample_series"
                          :key="index"
                        >
                          <td>{{ entity.id }}</td>

                          <td>{{ entity.name }}</td>

                          <td
                            class="text-center delete-relation"
                            @click="
                              relatedData.attachment_link__sample_series.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__analysis &&
                    relatedData.attachment_link__analysis.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__analysis")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__analysis"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'analysis',
                                  id: entity.id,
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
                              relatedData.attachment_link__analysis.splice(
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

                <!-- DATASET -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__dataset &&
                    relatedData.attachment_link__dataset.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__dataset")
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__dataset"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'dataset',
                                  id: entity.id,
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
                              relatedData.attachment_link__dataset.splice(
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

                <!-- DOI -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__doi &&
                    relatedData.attachment_link__doi.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.attachment_link__doi") }}
                  </p>

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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__doi"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'doi',
                                  id: entity.id,
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
                              relatedData.attachment_link__doi.splice(index, 1)
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__locality &&
                    relatedData.attachment_link__locality.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__locality")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__locality"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'locality',
                                  id: entity.id,
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
                              relatedData.attachment_link__locality.splice(
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

                <!-- DRILLCORE -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__drillcore &&
                    relatedData.attachment_link__drillcore.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__drillcore")
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__drillcore"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'drillcore',
                                  id: entity.id,
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
                              relatedData.attachment_link__drillcore.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__drillcore_box &&
                    relatedData.attachment_link__drillcore_box.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t(
                        "attachment.relatedTables.attachment_link__drillcore_box"
                      )
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__drillcore_box"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'corebox',
                                  id: entity.id,
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
                              relatedData.attachment_link__drillcore_box.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__preparation !== null &&
                    relatedData.attachment_link__preparation.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t(
                        "attachment.relatedTables.attachment_link__preparation"
                      )
                    }}
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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__preparation"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'preparation',
                                  id: entity.id,
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
                              relatedData.attachment_link__preparation.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__reference !== null &&
                    relatedData.attachment_link__reference.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("common.reference") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.reference") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__reference"
                          :key="index"
                        >
                          <td>
                            <a
                              href="javascript:void(0)"
                              @click="
                                openGeoInNewWindow({
                                  object: 'reference',
                                  id: entity.id,
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
                              relatedData.attachment_link__reference.splice(
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
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__storage !== null &&
                    relatedData.attachment_link__storage.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__storage")
                    }}
                  </p>

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
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__storage"
                          :key="index"
                        >
                          <td>
                            <router-link
                              :to="{ path: '/location/' + entity.id }"
                              >{{ entity.id }}</router-link
                            >
                          </td>

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
                              relatedData.attachment_link__storage.splice(
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

                <!-- PROJECT -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__project !== null &&
                    relatedData.attachment_link__project.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t("attachment.relatedTables.attachment_link__project")
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__project"
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
                              relatedData.attachment_link__project.splice(
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

                <!-- SITE -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__site !== null &&
                    relatedData.attachment_link__site.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.attachment_link__site") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.name") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__site"
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
                              relatedData.attachment_link__site.splice(index, 1)
                            "
                          >
                            <i class="fas fa-times"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- LOCALITY_DESCRIPTION -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__locality_description !==
                      null &&
                    relatedData.attachment_link__locality_description.length > 0
                  "
                >
                  <p class="h4">
                    {{
                      $t(
                        "attachment.relatedTables.attachment_link__locality_description"
                      )
                    }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("common.description") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__locality_description"
                          :key="index"
                        >
                          <td>{{ entity.id }}</td>

                          <td>
                            {{ entity.description }}
                          </td>

                          <td
                            class="text-center delete-relation"
                            @click="
                              relatedData.attachment_link__locality_description.splice(
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

                <!-- TAXON -->
                <div
                  class="col-sm-6 pa-1"
                  v-if="
                    relatedData.attachment_link__taxon !== null &&
                    relatedData.attachment_link__taxon.length > 0
                  "
                >
                  <p class="h4">
                    {{ $t("attachment.relatedTables.attachment_link__taxon") }}
                  </p>

                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>{{ $t("taxon.taxon") }}</th>
                          <th>{{ $t("taxon.author_year") }}</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            entity, index
                          ) in relatedData.attachment_link__taxon"
                          :key="index"
                        >
                          <td>
                            <router-link
                              :to="{ path: '/taxon/' + entity.id }"
                              >{{ entity.id }}</router-link
                            >
                          </td>

                          <td>
                            {{ entity.taxon }}
                          </td>

                          <td>
                            {{ entity.author_year }}
                          </td>

                          <td
                            class="text-center delete-relation"
                            @click="
                              relatedData.attachment_link__taxon.splice(
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
          :color="bodyColor.split('n-')[0] + 'n-5'"
          elevation="4"
        >
          <v-card-title class="pt-2 pb-1">
            <div
              class="card-title--clickable"
              @click="block.requiredFields = !block.requiredFields"
            >
              <span>{{ $t("common.requiredFields") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- REFERENCE and AUTHOR FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    :item-text="customLabelForReference"
                    :label="$t('attachment.reference__reference')"
                    use-state
                    is-link
                    route-object="reference"
                    is-searchable
                    v-on:search:items="autocompleteReferenceSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="attachment.author_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.author_free')"
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
            <div
              class="card-title--clickable"
              @click="block.info = !block.info"
            >
              <span>{{ $t("attachment.info") }}</span>
              <v-icon right>fas fa-project-diagram</v-icon>
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
              <!-- LICENCE and COPYRIGHT -->
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.licence"
                    :color="bodyActiveColor"
                    :items="autocomplete.licence"
                    :loading="autocomplete.loaders.licence"
                    :item-text="licenceLabel"
                    :label="$t('common.licence')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.copyright_agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.copyright_agent"
                    :loading="autocomplete.loaders.copyright_agent"
                    item-text="agent"
                    :label="$t('attachment.copyrightAgent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteCopyrightAgentSearch"
                  />
                </v-col>
              </v-row>

              <!-- AGENT, DATE DIGITISED and DATE DIGITISED FREE -->
              <v-row no-gutters>
                <v-col cols="12" md="4" class="pa-1">
                  <autocomplete-wrapper
                    v-model="attachment.agent_digitised"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent_digitised"
                    :loading="autocomplete.loaders.agent_digitised"
                    item-text="agent"
                    :label="$t('attachment.agentDigitised')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentDigitisedSearch"
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <date-wrapper
                    v-model="attachment.date_digitised"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateDigitised')"
                    v-on:date:clear="attachment.date_digitised = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_digitised', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="4" class="pa-1">
                  <input-wrapper
                    v-model="attachment.date_digitised_free"
                    :color="bodyActiveColor"
                    :label="$t('attachment.dateDigitisedFree')"
                  />
                </v-col>
              </v-row>
            </div>
          </transition>
        </v-card>
      </div>
    </template>

    <template v-slot:change-type>
      <v-card
        class="mt-2"
        id="block-changeType"
        :color="bodyColor.split('n-')[0] + 'n-5'"
        elevation="4"
      >
        <v-card-title class="pt-2 pb-1">
          <div
            class="card-title--clickable"
            @click="block.changeType = !block.changeType"
          >
            <span>{{ $t("attachment.changeType") }}</span>
            <v-icon right>fas fa-exchange-alt</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="block.changeType = !block.changeType"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              block.changeType ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <transition>
          <div v-show="block.changeType" class="pa-1">
            <!-- CHANGE TYPE -->
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pa-1">
                <select-wrapper
                  v-model="attachment.specimen_image_attachment"
                  :color="bodyActiveColor"
                  :label="$t('attachment.changeType')"
                  :items="computedChangeType"
                  item-text="name"
                  item-value="value"
                  translation-prefix="attachment."
                  :clearable="false"
                />
              </v-col>

              <v-col cols="12" md="6" class="pa-1 align-self-center">
                <span
                  class="subtitle-1"
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
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-card>
    </template>

    <template v-slot:checkbox>
      <div class="d-flex flex-wrap mt-2">
        <div class="pr-2">
          <checkbox-wrapper
            v-model="attachment.is_private"
            :color="bodyActiveColor"
            :label="$t('common.is_private')"
            @change="attachment.is_private = !attachment.is_private"
          />
        </div>

        <div>
          <checkbox-wrapper
            v-model="attachment.is_locked"
            :color="bodyActiveColor"
            :label="$t('attachment.is_locked')"
            @change="attachment.is_locked = !attachment.is_locked"
          />
        </div>
        <autocomplete-wrapper
          class="ml-auto"
          v-model="attachment.database"
          :color="bodyActiveColor"
          :items="autocomplete.database"
          :loading="autocomplete.loaders.database"
          :item-text="nameLabel"
          :label="$t('common.institution')"
        />
      </div>
      <v-row no-gutters class="mt-2">
        <v-col>
          <object-permissions-create
            v-if="!$route.meta.isEdit"
            @change="handlePermissionsChange"
          />
        </v-col>
      </v-row>
    </template>

    <template v-slot:local-storage>
      <div class="d-flex mt-3">
        <v-btn @click="clearSavedFields" class="text-none" color="yellow">
          {{ $t("buttons.clearLocalStorageAndFields") }}
        </v-btn>
      </div>
    </template>

    <!--    NOTE: Removed new doi button #644 https://github.com/geocollections/sarv-workbench/issues/644-->
    <template v-slot:add-doi>
      <div class="d-flex justify-end mt-3" v-if="false">
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
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapActions, mapGetters, mapState } from "vuex";
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
  fetchAttachmentLinkLocalityDescriptions,
  fetchAttachmentLinkPreparations,
  fetchAttachmentLinkProjects,
  fetchAttachmentLinkReferences,
  fetchAttachmentLinkSamples,
  fetchAttachmentLinkSampleSeries,
  fetchAttachmentLinkSites,
  fetchAttachmentLinkSpecimens,
  fetchAttachmentLinkStorages,
  fetchAttachmentLinkTaxa,
  fetchListAttachmentType,
  fetchListImageType,
  fetchListLicences,
  fetchDatabase,
  fetchObjectPermissions,
} from "../../assets/js/api/apiCalls";
import AttachmentWrapper from "./AttachmentWrapper";
import MapComponent from "../partial/MapComponent";
import FileInformation from "../partial/FileInformation";
import AttachmentFile from "../partial/AttachmentFile";
import NewDoiButton from "../partial/NewDoiButton";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import DateWrapper from "../partial/inputs/DateWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import SelectWrapper from "../partial/inputs/SelectWrapper";
import FileInput from "../partial/inputs/FileInput";
import toastMixin from "../../mixins/toastMixin";
import ObjectPermissionsCreate from "../partial/ObjectPermissionsCreate.vue";

export default {
  name: "Attachment",

  components: {
    FileInput,
    SelectWrapper,
    TextareaWrapper,
    DateWrapper,
    InputWrapper,
    AutocompleteWrapper,
    CheckboxWrapper,
    NewDoiButton,
    AttachmentFile,
    FileInformation,
    AttachmentWrapper,
    MapComponent,
    ObjectPermissionsCreate,
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
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

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin, toastMixin],

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapState("search", ["attachmentSearchParameters"]),
    ...mapState("map", ["showMap"]),
    ...mapState("detail", [
      "photoArchive",
      "photoArchiveKeywords",
      "specimenImage",
      "specimenImageKeywords",
      "otherFiles",
      "otherFilesKeywords",
      "digitisedReference",
      "digitisedReferenceKeywords",
    ]),
    ...mapGetters("user", ["isUserAllowedTo", "getDatabaseId"]),

    myShowMap: {
      get() {
        return this.showMap;
      },
      set(value) {
        this.updateShowMap(value);
      },
    },

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
    },

    computedChangeType() {
      this.changeType.forEach(
        (type) => (type.disabled = !this.isValidToChangeTo(type.name))
      );
      return this.changeType;
    },

    imageRotationState() {
      return Math.abs(this.imageRotationDegreesForApi) !== 0;
    },

    imageRotationDegreesForApi() {
      let rotationForApi = Math.abs(this.imageRotationDegrees) % 360;
      if (this.imageRotationDegrees < 0)
        rotationForApi = Math.abs(rotationForApi);
      else rotationForApi = -rotationForApi;
      return rotationForApi;
    },
  },

  created() {
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.attachmentSearchParameters,
        request: "FETCH_ATTACHMENTS",
        title: "header.attachments",
        object: "attachment",
        field: "original_filename",
      });
    }
  },

  watch: {
    "$route.path": {
      handler: function (newVal, oldVal) {
        this.reloadData();
        if (!this.$route.meta.isEdit) {
          if (oldVal) this.clearUploadedFiles();

          let attachmentHistory;
          let keywords;
          if (this.isPhotoArchive) {
            attachmentHistory = cloneDeep(this.photoArchive);
            keywords = cloneDeep(this.photoArchiveKeywords);
          } else if (this.isSpecimenImage) {
            attachmentHistory = cloneDeep(this.specimenImage);
            keywords = cloneDeep(this.specimenImageKeywords);
          } else if (this.isOtherFile) {
            attachmentHistory = cloneDeep(this.otherFiles);
            keywords = cloneDeep(this.otherFilesKeywords);
          } else if (this.isDigitisedReference)
            attachmentHistory = cloneDeep(this.digitisedReference);
          keywords = cloneDeep(this.digitisedReferenceKeywords);

          if (attachmentHistory) {
            this.attachment = attachmentHistory;
            this.removeUnnecessaryFields(this.attachment, this.copyFields);
            if (this.isNotEmpty(this.attachment.specimen)) {
              this.autocomplete.specimen.push(this.attachment.specimen);
            }
            if (this.isNotEmpty(this.attachment.agent_digitised)) {
              this.autocomplete.agent_digitised.push(
                this.attachment.agent_digitised
              );
            }
            if (this.isNotEmpty(this.attachment.copyright_agent)) {
              this.autocomplete.copyright_agent.push(
                this.attachment.copyright_agent
              );
            }
            if (this.isNotEmpty(this.attachment.imageset)) {
              this.autocomplete.imageset.push(this.attachment.imageset);
            }
            if (this.isNotEmpty(this.attachment.locality)) {
              this.autocomplete.locality.push(this.attachment.locality);
            }
            if (this.isNotEmpty(this.attachment.reference)) {
              this.autocomplete.reference.push(this.attachment.reference);
            }
          }
          if (keywords && keywords.length > 0) {
            this.relatedData.keyword = keywords;
            this.autocomplete.keyword = this.relatedData.keyword;
          }

          if (this.isPhotoArchive) {
            if (this.$route.params.imageset) {
              this.$set(
                this.attachment,
                "imageset",
                this.$route.params.imageset
              );
              this.autocomplete.imageset.push(this.attachment.imageset);
            }
          }

          if (!this.isDigitisedReference) {
            this.$set(this.attachment, "author", {
              id: this.getCurrentUser.id,
              agent: this.getCurrentUser.agent,
              forename: this.getCurrentUser.forename,
              surename: this.getCurrentUser.surename,
            });
            this.autocomplete.agent.push(this.attachment.author);
          }
        }
      },
      immediate: true,
    },
    attachment: {
      handler: function (newVal) {
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
      },
    },
  },

  methods: {
    ...mapActions("map", ["updateShowMap"]),
    handlePermissionsChange(perms) {
      this.initialPermissions = perms;
    },
    setInitialData() {
      return {
        imageRotationDegrees: 0,
        filePreviewKey: Date.now(),
        relatedTabs: [
          {
            name: "attachment_link__collection",
            name_short: "collection",
            iconClass: "fas fa-server",
          },
          {
            name: "attachment_link__specimen",
            name_short: "specimen",
            iconClass: "fas fa-flask",
          },
          {
            name: "attachment_link__sample",
            name_short: "sample",
            iconClass: "fas fa-vial",
          },
          {
            name: "attachment_link__sample_series",
            name_short: "sample_series",
            iconClass: "fas fa-vials",
          },
          {
            name: "attachment_link__analysis",
            name_short: "analysis",
            iconClass: "fas fa-chart-pie",
          },
          {
            name: "attachment_link__dataset",
            name_short: "dataset",
            iconClass: "fas fa-server",
          },
          {
            name: "attachment_link__doi",
            name_short: "doi",
            iconClass: "fas fa-database",
          },
          {
            name: "attachment_link__locality",
            name_short: "locality",
            iconClass: "fas fa-map-marker-alt",
          },
          {
            name: "attachment_link__drillcore",
            name_short: "drillcore",
            iconClass: "fas fa-tools",
          },
          {
            name: "attachment_link__drillcore_box",
            name_short: "drillcore_box",
            iconClass: "fas fa-boxes",
          },
          {
            name: "attachment_link__preparation",
            name_short: "preparation",
            iconClass: "fas fa-prescription-bottle",
          },
          {
            name: "attachment_link__reference",
            name_short: "reference",
            iconClass: "fas fa-book",
          },
          {
            name: "attachment_link__storage",
            name_short: "storage",
            iconClass: "fas fa-archive",
          },
          {
            name: "attachment_link__project",
            name_short: "project",
            iconClass: "fas fa-project-diagram",
          },
          {
            name: "attachment_link__site",
            name_short: "site",
            iconClass: "fas fa-map-pin",
          },
          {
            name: "attachment_link__locality_description",
            name_short: "locality_description",
            iconClass: "fas fa-align-left",
          },
          {
            name: "attachment_link__taxon",
            name_short: "taxon",
            iconClass: "fas fa-pastafarianism",
          },
        ],
        ratings: [
          { value: 5 },
          { value: 4 },
          { value: 3 },
          { value: 2 },
          { value: 1 },
          { value: 0 },
          { value: -1 },
          { value: -2 },
          { value: -3 },
          { value: -4 },
          { value: -5 },
        ],
        changeType: [
          { name: "specimenImage", value: 1, disabled: false },
          { name: "photoArchive", value: 2, disabled: false },
          { name: "otherFile", value: 3, disabled: false },
          { name: "digitisedReference", value: 4, disabled: false },
        ],
        relatedData: this.setDefaultRelatedData(),
        initialPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        currentPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
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
          "image_width_mm",
          "image_height_mm",
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
          "type",
          "database",
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
            database: false,
            attachment_link__collection: false,
            attachment_link__specimen: false,
            attachment_link__sample: false,
            attachment_link__sample_series: false,
            attachment_link__analysis: false,
            attachment_link__dataset: false,
            attachment_link__doi: false,
            attachment_link__locality: false,
            attachment_link__drillcore: false,
            attachment_link__drillcore_box: false,
            attachment_link__preparation: false,
            attachment_link__reference: false,
            attachment_link__storage: false,
            attachment_link__project: false,
            attachment_link__site: false,
            attachment_link__locality_description: false,
            attachment_link__taxon: false,
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
          database: [],
          attachment_link__collection: [],
          attachment_link__specimen: [],
          attachment_link__sample: [],
          attachment_link__sample_series: [],
          attachment_link__analysis: [],
          attachment_link__dataset: [],
          attachment_link__doi: [],
          attachment_link__locality: [],
          attachment_link__drillcore: [],
          attachment_link__drillcore_box: [],
          attachment_link__preparation: [],
          attachment_link__reference: [],
          attachment_link__storage: [],
          attachment_link__project: [],
          attachment_link__site: [],
          attachment_link__locality_description: [],
          attachment_link__taxon: [],
        },
        requiredFields: {
          photo_archive: ["imageset"],
          specimen_image: [this.$route.meta.isEdit ? "specimen" : "author"],
          other_file: ["description", "description_en"],
          digitised_reference: ["reference"],
        },
        optionalFields: {
          photo_archive: ["author", "author_free"],
          specimen_image: ["author", "author_free"],
          other_file: ["author", "author_free"],
          digitised_reference: [],
        },
        attachment: this.setDefaultAttachmentFields(),
        rawAttachment: null,
        block: {
          fileInput: true,
          file: true,
          requiredFields: true,
          info: true,
          map: true,
          description: true,
          relatedData: true,
          changeType: false,
        },
        files: [],
        selectedRelatedTable: null,
        isAttachmentLocked: false,
        isAttachmentPhotoArchive: false,
        isAttachmentSpecimenImage: false,
        isAttachmentOtherFile: false,
        isAttachmentDigitisedReference: false,
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
        // fetchAttachment(this.$route.params.id).then(
        fetchAttachment(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "attachment", this.handleResponse(response)[0]);
            // this.attachment = this.handleResponse(response)[0];
            this.rawAttachment = cloneDeep(this.attachment);
            this.fillAutocompleteFields(this.attachment);

            this.removeUnnecessaryFields(this.attachment, this.copyFields);
            this.$emit("data-loaded", this.attachment);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        fetchObjectPermissions(this.$route.params.id, "attachment").then(
          (res) => {
            this.currentPermissions.groups_change =
              res.data.group
                ?.filter(
                  (perm) => perm.permission__codename === "change_attachment"
                )
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.groups_view =
              res.data.group
                ?.filter(
                  (perm) => perm.permission__codename === "view_attachment"
                )
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.users_change =
              res.data.user
                ?.filter(
                  (perm) => perm.permission__codename === "change_attachment"
                )
                .map((perm) => perm.user_id) ?? [];
            this.currentPermissions.users_view =
              res.data.user
                ?.filter(
                  (perm) => perm.permission__codename === "view_attachment"
                )
                .map((perm) => perm.user_id) ?? [];
          }
        );
        this.loadAutocompleteFields(false, true);
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);

        if (this.getDatabaseId !== null) {
          this.attachment.database = {
            id: this.getDatabaseId,
          };
        }
      }
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchListLicences().then(
          (response) =>
            (this.autocomplete.licence = this.handleResponse(response))
        );
        fetchListImageType().then(
          (response) =>
            (this.autocomplete.image_type = this.handleResponse(response))
        );
        fetchListAttachmentType().then(
          (response) => (this.autocomplete.type = this.handleResponse(response))
        );
      }
      fetchDatabase().then(
        (response) =>
          (this.autocomplete.database = this.handleResponse(response))
      );

      if (relatedDataAutocompleteFields) {
        fetchAttachmentKeyword(this.$route.params.id).then((response) => {
          let referenceKeyword = this.handleResponse(response);
          this.relatedData.keyword = referenceKeyword.map((entity) => {
            return {
              keyword: entity.keyword__keyword,
              id: entity.keyword,
            };
          });
          this.autocomplete.keyword = this.relatedData.keyword;
        });

        fetchAttachmentLinkCollections(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__collection = collections.map(
              (entity) => {
                return {
                  id: entity.collection,
                  name: entity.collection__name,
                  name_en: entity.collection__name_en,
                };
              }
            );
            this.autocomplete.attachment_link__collection =
              this.relatedData.attachment_link__collection;
          }
        );
        fetchAttachmentLinkSpecimens(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__specimen = collections.map(
            (entity) => {
              return {
                id: entity.specimen,
                specimen_id: entity.specimen_id,
                coll__number: entity.specimen__coll__number,
              };
            }
          );
          this.autocomplete.attachment_link__specimen =
            this.relatedData.attachment_link__specimen;
        });
        fetchAttachmentLinkSamples(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__sample = collections.map(
            (entity) => {
              return {
                id: entity.sample,
                number: entity.sample__number,
              };
            }
          );
          this.autocomplete.attachment_link__sample =
            this.relatedData.attachment_link__sample;
        });
        fetchAttachmentLinkSampleSeries(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__sample_series = collections.map(
              (entity) => {
                return {
                  id: entity.sample_series,
                  name: entity.sample_series__name,
                };
              }
            );
            this.autocomplete.attachment_link__sample_series =
              this.relatedData.attachment_link__sample_series;
          }
        );
        fetchAttachmentLinkAnalyses(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__analysis = collections.map(
            (entity) => {
              return {
                id: entity.analysis,
                sample__number: entity.analysis__sample__number,
              };
            }
          );
          this.autocomplete.attachment_link__analysis =
            this.relatedData.attachment_link__analysis;
        });
        fetchAttachmentLinkDatasets(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__dataset = collections.map(
            (entity) => {
              return {
                id: entity.dataset,
                name: entity.dataset__name,
                name_en: entity.dataset__name_en,
              };
            }
          );
          this.autocomplete.attachment_link__dataset =
            this.relatedData.attachment_link__dataset;
        });
        fetchAttachmentLinkLocalities(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__locality = collections.map(
              (entity) => {
                return {
                  id: entity.locality,
                  locality: entity.locality__locality,
                  locality_en: entity.locality__locality_en,
                };
              }
            );
            this.autocomplete.attachment_link__locality =
              this.relatedData.attachment_link__locality;
          }
        );
        fetchAttachmentLinkDrillcores(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__drillcore = collections.map(
              (entity) => {
                return {
                  id: entity.drillcore,
                  drillcore: entity.drillcore__drillcore,
                  drillcore_en: entity.drillcore__drillcore_en,
                };
              }
            );
            this.autocomplete.attachment_link__drillcore =
              this.relatedData.attachment_link__drillcore;
          }
        );
        fetchAttachmentLinkDrillcoreBoxes(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__drillcore_box = collections.map(
              (entity) => {
                return {
                  id: entity.drillcore_box,
                  drillcore__drillcore:
                    entity.drillcore_box__drillcore__drillcore,
                  drillcore__drillcore_en:
                    entity.drillcore_box__drillcore__drillcore_en,
                };
              }
            );
            this.autocomplete.attachment_link__drillcore_box =
              this.relatedData.attachment_link__drillcore_box;
          }
        );
        fetchAttachmentLinkPreparations(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__preparation = collections.map(
              (entity) => {
                return {
                  id: entity.preparation,
                  preparation_number: entity.preparation__preparation_number,
                };
              }
            );
            this.autocomplete.attachment_link__preparation =
              this.relatedData.attachment_link__preparation;
          }
        );
        fetchAttachmentLinkReferences(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__reference = collections.map(
              (entity) => {
                return {
                  id: entity.reference,
                  reference: entity.reference__reference,
                };
              }
            );
            this.autocomplete.attachment_link__reference =
              this.relatedData.attachment_link__reference;
          }
        );
        fetchAttachmentLinkDois(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__doi = collections.map((entity) => {
            return {
              id: entity.doi,
              identifier: entity.doi__identifier,
            };
          });
          this.autocomplete.attachment_link__doi =
            this.relatedData.attachment_link__doi;
        });
        fetchAttachmentLinkStorages(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__storage = collections.map(
            (entity) => {
              return {
                id: entity.storage,
                location: entity.storage__location,
                contents: entity.storage__contents,
              };
            }
          );
          this.autocomplete.attachment_link__storage =
            this.relatedData.attachment_link__storage;
        });
        fetchAttachmentLinkProjects(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__project = collections.map(
            (entity) => {
              return {
                id: entity.project,
                name: entity.project__name,
                name_en: entity.project__name_en,
              };
            }
          );
          this.autocomplete.attachment_link__project =
            this.relatedData.attachment_link__project;
        });
        fetchAttachmentLinkSites(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__site = collections.map((entity) => {
            return {
              id: entity.site,
              name: entity.site__name,
              name_en: entity.site__name_en,
            };
          });
          this.autocomplete.attachment_link__site =
            this.relatedData.attachment_link__site;
        });
        fetchAttachmentLinkLocalityDescriptions(this.$route.params.id).then(
          (response) => {
            let collections = this.handleResponse(response);
            this.relatedData.attachment_link__locality_description =
              collections.map((entity) => {
                return {
                  id: entity.locality_description,
                  description: entity.locality_description__description,
                };
              });
            this.autocomplete.attachment_link__locality_description =
              this.relatedData.attachment_link__locality_description;
          }
        );
        fetchAttachmentLinkTaxa(this.$route.params.id).then((response) => {
          let collections = this.handleResponse(response);
          this.relatedData.attachment_link__taxon = collections.map(
            (entity) => {
              return {
                id: entity.taxon,
                taxon: entity.taxon__taxon,
                author_year: entity.taxon__author_year,
              };
            }
          );
          this.autocomplete.attachment_link__taxon =
            this.relatedData.attachment_link__taxon;
        });
      }
    },

    setDefaultRelatedData() {
      return {
        keyword: [],
        attachment_link__collection: [],
        attachment_link__specimen: [],
        attachment_link__sample: [],
        attachment_link__sample_series: [],
        attachment_link__analysis: [],
        attachment_link__dataset: [],
        attachment_link__doi: [],
        attachment_link__locality: [],
        attachment_link__drillcore: [],
        attachment_link__drillcore_box: [],
        attachment_link__preparation: [],
        attachment_link__reference: [],
        attachment_link__storage: [],
        attachment_link__project: [],
        attachment_link__site: [],
        attachment_link__locality_description: [],
        attachment_link__taxon: [],
        searchParameters: {
          keyword: {
            page: 1,
            paginateBy: 10,
            orderBy: "id",
          },
        },
        count: {
          keyword: 0,
        },
      };
    },

    formatDataForUpload(objectToUpload, saveAsNew = false) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (!this.$route.meta.isEdit) {
        if (this.isPhotoArchive) {
          this.saveFields({ key: "photoArchive", value: objectToUpload });
          this.saveFields({
            key: "photoArchiveKeywords",
            value: objectToUpload,
          });
        } else if (this.isSpecimenImage) {
          this.saveFields({ key: "specimenImage", value: objectToUpload });
          this.saveFields({
            key: "specimenImageKeywords",
            value: objectToUpload,
          });
        } else if (this.isOtherFile) {
          this.saveFields({ key: "otherFiles", value: objectToUpload });
          this.saveFields({ key: "otherFilesKeywords", value: objectToUpload });
        } else if (this.isDigitisedReference)
          this.saveFields({ key: "digitisedReference", value: objectToUpload });
      }

      if (this.isNotEmpty(uploadableObject.image_latitude))
        uploadableObject.image_latitude = parseFloat(
          uploadableObject.image_latitude
        ).toFixed(6);
      else uploadableObject.image_latitude = null;
      if (this.isNotEmpty(uploadableObject.image_longitude))
        uploadableObject.image_longitude = parseFloat(
          uploadableObject.image_longitude
        ).toFixed(6);
      else uploadableObject.image_longitude = null;

      if (this.isNotEmpty(uploadableObject.image_width_mm))
        uploadableObject.image_width_mm = parseFloat(
          uploadableObject.image_width_mm
        );
      else uploadableObject.image_width_mm = null;

      if (this.isNotEmpty(uploadableObject.image_height_mm))
        uploadableObject.image_height_mm = parseFloat(
          uploadableObject.image_height_mm
        );
      else uploadableObject.image_height_mm = null;

      Object.keys(uploadableObject).forEach((key) => {
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

      /* Related Data START */
      uploadableObject.related_data = {};

      if (!this.isDigitisedReference) {
        if (this.isNotEmpty(this.relatedData.keyword))
          uploadableObject.related_data.keyword = this.relatedData.keyword.map(
            (keyword) => {
              return {
                id: keyword.id,
              };
            }
          );
        else uploadableObject.related_data.keyword = null;
      }

      if (this.isPhotoArchive || this.isOtherFile) {
        this.relatedTabs.forEach((tab) => {
          if (
            this.relatedData[tab.name] &&
            this.relatedData[tab.name].length > 0
          ) {
            uploadableObject.related_data[tab.name] = this.relatedData[
              tab.name
            ].map((entity) => {
              return {
                id: entity.id,
              };
            });
          } else uploadableObject.related_data[tab.name] = null;
        });
      }
      /* Related Data END */

      if (!this.$route.meta.isEdit) {
        uploadableObject.initial_permissions = this.initialPermissions;
      }

      if (saveAsNew) delete uploadableObject.related_data;

      if (saveAsNew) {
        uploadableObject.initial_permissions = this.currentPermissions;
      }
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.agent_digitised__id)) {
        this.attachment.agent_digitised = {
          id: obj.agent_digitised__id,
          agent: obj.agent_digitised__agent,
        };
        this.autocomplete.agent_digitised.push(this.attachment.agent_digitised);
      }
      if (this.isNotEmpty(obj.author_id)) {
        this.attachment.author = {
          id: obj.author_id,
          agent: obj.author__agent,
        };
        this.autocomplete.agent.push(this.attachment.author);
      }
      if (this.isNotEmpty(obj.copyright_agent__id)) {
        this.attachment.copyright_agent = {
          id: obj.copyright_agent__id,
          agent: obj.copyright_agent__agent,
        };
        this.autocomplete.copyright_agent.push(this.attachment.copyright_agent);
      }
      if (this.isNotEmpty(obj.image_type__id)) {
        this.attachment.image_type = {
          id: obj.image_type__id,
          value: obj.image_type__value,
          value_en: obj.image_type__value_en,
        };
      }
      if (this.isNotEmpty(obj.imageset__id)) {
        this.attachment.imageset = {
          id: obj.imageset__id,
          imageset_number: obj.imageset__imageset_number,
        };
        this.autocomplete.imageset.push(this.attachment.imageset);
      }
      if (this.isNotEmpty(obj.licence__id)) {
        this.attachment.licence = {
          id: obj.licence__id,
          licence: obj.licence__licence,
          licence_en: obj.licence__licence_en,
        };
      }
      if (this.isNotEmpty(obj.locality)) {
        this.attachment.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en,
        };
        this.autocomplete.locality.push(this.attachment.locality);
      }
      if (this.isNotEmpty(obj.specimen__id)) {
        this.attachment.specimen = {
          id: obj.specimen__id,
          specimen_id: obj.specimen_id,
          coll__number: obj.specimen__coll__number,
        };
        this.autocomplete.specimen.push(this.attachment.specimen);
      }
      if (this.isNotEmpty(obj.reference)) {
        this.attachment.reference = {
          id: obj.reference,
          reference: obj.reference__reference,
        };
        this.autocomplete.reference.push(this.attachment.reference);
      }
      if (this.isNotEmpty(obj.type)) {
        this.attachment.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en,
        };
      }
      if (this.isNotEmpty(obj.coll)) {
        this.attachment.coll = {
          id: obj.coll,
          number: obj.coll__number,
        };
      }
      this.attachment.database = {
        id: obj.database,
        value: obj.database__name,
        value_en: obj.database__name_en,
      };
    },

    /* FileInput Events START */
    addFiles(files) {
      this.files = files;
    },

    clearUploadedFiles() {
      this.files = [];
    },

    onMetadataLoaded(metadata) {
      if (
        metadata &&
        (this.isPhotoArchive || this.isSpecimenImage || this.isOtherFile)
      ) {
        // DATE
        if (metadata.DateTimeOriginal) {
          this.attachment.date_created = this.formatMetadataDate(
            metadata.DateTimeOriginal.description
          );
        } else if (metadata.DateTime) {
          this.attachment.date_created = this.formatMetadataDate(
            metadata.DateTime.description
          );
        }

        // DEVICE_TXT
        if (metadata.Model)
          this.attachment.device_txt = metadata.Model.description;
        else if (metadata.Make)
          this.attachment.device_txt = metadata.Make.description;

        // IMAGE DIMENSIONS
        if (metadata.PixelXDimension)
          this.attachment.image_width = metadata.PixelXDimension.description;
        if (metadata.PixelYDimension)
          this.attachment.image_height = metadata.PixelYDimension.description;

        // DESCRIPTION
        if (this.isSpecimenImage) {
          if (
            metadata.ImageDescription &&
            metadata.ImageDescription.description.trim().length > 0
          ) {
            this.attachment.image_description_en =
              metadata.ImageDescription.description.trim();
          }
        } else {
          if (
            metadata.ImageDescription &&
            metadata.ImageDescription.description.trim().length > 0
          ) {
            this.attachment.description_en =
              metadata.ImageDescription.description.trim();
          }
        }

        // GPS DATA
        if (this.isPhotoArchive || this.isSpecimenImage || this.isOtherFile) {
          if (metadata.GPSLatitude) {
            this.attachment.image_latitude =
              metadata.GPSLatitude.description.toFixed(6);
          }
          if (metadata.GPSLongitude) {
            this.attachment.image_longitude =
              metadata.GPSLongitude.description.toFixed(6);
          }
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
    /* FileInput Events END */

    /* MapComponent Event START */
    updateLocation(location) {
      this.attachment.image_latitude = location.lat.toFixed(6);
      this.attachment.image_longitude = location.lng.toFixed(6);
    },

    resetLocation() {
      this.attachment.image_latitude = null;
      this.attachment.image_longitude = null;
    },

    updateLocationUsingLocality(event) {
      if (
        event &&
        event.latitude &&
        event.longitude &&
        !this.attachment.image_latitude &&
        !this.attachment.image_longitude
      ) {
        this.attachment.image_latitude = event.latitude.toFixed(6);
        this.attachment.image_longitude = event.longitude.toFixed(6);
      }
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

    clearSavedFields() {
      if (this.isPhotoArchive) {
        this.resetFields("photoArchive");
        this.resetFields("photoArchiveKeywords");
      } else if (this.isSpecimenImage) {
        this.resetFields("specimenImage");
        this.resetFields("specimenImageKeywords");
      } else if (this.isOtherFile) {
        this.resetFields("otherFiles");
        this.resetFields("otherFilesKeywords");
      } else if (this.isDigitisedReference)
        this.resetFields("digitisedReference");

      this.attachment = this.setDefaultAttachmentFields();

      this.toastInfo({
        text: this.$t("messages.defaultsRemovedAndFieldsCleared"),
      });
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

    customLabelForReference(option) {
      return `${option.id} - (${option.reference})`;
    },

    customLabelForSpecimen(option) {
      return `ID: ${option.id} - (${option.coll__number} ${option.specimen_id})`;
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
          if (
            typeof option.coll__number !== "undefined" &&
            option.coll__number !== null
          ) {
            return `${option.coll__number.split(" ")[0]} ${
              option.specimen_id
            } (${option.id})`;
          } else return `${option.specimen_id} (${option.id})`;
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
        case "taxon":
          return `${option.id} - (${option.taxon})`;
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
        date_created: this.getCurrentFormattedDate("YYYY-MM-DD"),
        image_type: {
          id: 5,
          value: "digipilt",
          value_en: "digital image",
        },
        type: {
          id: 1,
          value: "foto",
          value_en: "image",
        },
        stars: 0,
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
          value_en: "publication",
        };
        defaultFields.stars = null;
      }
      return defaultFields;
    },

    formatMetadataDate(dateFromMetadata) {
      if (dateFromMetadata && dateFromMetadata.length > 0) {
        // Metadata format: YYYY:MM:DD hh:mm:ss
        let date = dateFromMetadata.split(" ")[0];
        let dateList = date.split(":");

        let year = dateList[0];
        let month = dateList[1];
        let day = dateList[2];

        return year + "-" + month + "-" + day;
      }
      return null;
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

.delete-relation {
  transition: background-color 500ms ease-in-out;
  vertical-align: middle;
}

.delete-relation:hover {
  cursor: pointer;
  background-color: rgba(220, 53, 69, 0.7);
}
</style>
