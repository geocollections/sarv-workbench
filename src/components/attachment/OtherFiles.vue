<template>
  <div class="other-files">
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- FILE -->
    <div class="row">
      <div class="col-sm-12 mb-2">
        <label :for="`files`"
               v-bind:class="{ dragging : isDragging }"
               v-on:dragover.stop.prevent="isDragging = true"
               v-on:dragleave.stop.prevent="isDragging = false"
               v-on:drop.stop.prevent="dropFile"
               class="btn btn-outline-primary btn-block">{{ $t('add.inputs.fileInput') }}
        </label>

        <div class="mt-2 alert alert-warning" v-if="files !== null && files.length >= 10">{{ $t('add.inputs.fileInputMaxError', { num: files.length }) }}</div>

        <div class="mt-2" v-if="files !== null && files.length > 0">
          <div v-if="files.length > 0" >

            <ul class="list-unstyled">
              <li class="mt-2" v-for="(file, key) in files">

                <span v-if="file.type.includes('image')">
                  <img v-bind:ref="'image' + parseInt(key)" class="img-thumbnail thumbnail-preview" alt="Image preview..." />
                </span>
                <span v-else>
                  <font-awesome-icon icon="file"></font-awesome-icon>&nbsp;
                </span>

                <span><b>{{ file.name }}</b></span>

              </li>
            </ul>

          </div>
        </div>

        <!-- TODO: https://github.com/bootstrap-vue/bootstrap-vue/issues/1526, If multiple then accept does not take multiple formats. BUG -->
        <!-- TODO: BUG: If too many files or long filenames then breaks the input design -->
        <b-form-file v-model="files"
                     id="files"
                     :state="filesState"
                     multiple
                     plain
                     style="display: none"
                     ref="fileinput"
                     :placeholder="$t('add.inputs.fileInput')">
        </b-form-file>

        <b-form-text v-if="!filesState">{{ $t('add.errors.files') }}.</b-form-text>

      </div>

      <div class="col-sm-12 col-md-6 mb-2">
        <button class="btn btn-outline-danger" v-if="filesState" :disabled="sendingData" @click="clearFile">
          <span v-show="files.length === 1">{{ $tc('add.buttons.resetFile', 1) }}</span>
          <span v-show="files.length > 1">{{ $tc('add.buttons.resetFile', 2) }}</span>
        </button>
      </div>

    </div>

    <!-- AUTHOR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('otherFiles.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.author"
                         id="author"
                         :options="autocomplete.authors"
                         :internal-search="false"
                         :preserve-search="true"
                         v-bind:class="{ valid: authorState, invalid: !authorState }"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
        <b-form-text v-if="!authorState">{{ $t('add.errors.authorMultiple') }}.</b-form-text>
      </div>


      <div class="col-sm-2">
        <label :for="`author_free`">{{ $t('otherFiles.authorFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="author_free"
                      v-model="upload.author_free"
                      :state="authorState"
                      type="text"></b-form-input>
        <b-form-text v-if="!authorState">{{ $t('add.errors.authorMultiple') }}.</b-form-text>
      </div>

    </div>

    <!-- DATE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_created`">{{ $t('otherFiles.dateCreated') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_created"
                    v-model="upload.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>

      <div class="col-sm-2">
        <label :for="`date_created_free`">{{ $t('otherFiles.dateCreatedFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_created_free" v-model="upload.date_created_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`description`">{{ $t('otherFiles.description') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="description" :state="descriptionState" v-model="upload.description" type="text"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>

        <b-form-text v-if="!descriptionState">{{ $t('add.errors.emptyField') }}.</b-form-text>
      </div>


      <div class="col-sm-2">
        <label :for="`description_en`">{{ $t('otherFiles.descriptionEn') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="description_en" :state="descriptionEnState" v-model="upload.description_en" type="text"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>

        <b-form-text v-if="!descriptionEnState">{{ $t('add.errors.emptyField') }}.</b-form-text>
      </div>
    </div>

    <!-- TYPE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`type`">{{ $t('otherFiles.type') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.type"
                         id="type"
                         :options="autocomplete.types"
                         @open="maybeGetTypes"
                         track-by="id"
                         :label="typeLabel"
                         :loading="searchingTypes"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- REMARKS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`remarks`">{{ $t('otherFiles.remarks') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="remarks"
                         v-model="upload.remarks"
                         type="text"
                         :no-resize="true"
                         :rows="3"
                         :max-rows="3"></b-form-textarea>
      </div>
    </div>

    <!-- MAP -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto">
        {{ $t('photoArchive.collapseMap') }}
        <font-awesome-icon icon="globe-americas"/>
      </legend>

      <!-- LOCATION -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`latitude`">{{ $t('otherFiles.latitude') }}:</label>
        </div>

        <div class="col-sm-4 mb-2">
          <b-form-input id="latitude" v-model="upload.image_latitude" type="number" step="0.000001"></b-form-input>
        </div>


        <div class="col-sm-2">
          <label :for="`longitude`">{{ $t('otherFiles.longitude') }}:</label>
        </div>

        <div class="col-sm-4 mb-2">
          <b-form-input id="longitude" v-model="upload.image_longitude" type="number" step="0.000001"></b-form-input>
        </div>
      </div>

      <div class="row">
        <span class="col ml-3 mt-3 custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">
            <label class="custom-control-label" for="customSwitch">{{showCollapseMap ? 'Map enabled' : 'Map disabled'}}</label>
          </span>
      </div>

      <div class="row mb-2">
        <div class="col">
          <b-collapse v-model="showCollapseMap" id="collapseMap">
            <map-component-2 v-if="showCollapseMap" mode="single" v-bind:locations="[]"
                             v-bind:location="{ lat: upload.image_latitude ? (upload.image_latitude).toString() : null, lng: upload.image_longitude ? (upload.image_longitude).toString() : null }" v-on:get-location="updateLocation"></map-component-2>
          </b-collapse>
        </div>
      </div>
    </fieldset>

    <!-- KEYWORDS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`keywords`">{{ $t('otherFiles.keywords') }}:</label>
      </div>

      <div class="col-9 mb-2">
        <vue-multiselect v-model="upload.tags"
                         id="keywords"
                         :tag-placeholder="$t('add.inputs.keywordsAdd')"
                         :placeholder="$t('add.inputs.keywords')"
                         label="name"
                         track-by="name"
                         :options="myKeywords"
                         :multiple="true"
                         :taggable="true"
                         :show-labels="false"
                         @tag="addKeyword"></vue-multiselect>
      </div>

      <div class="col-1 mb-2">
        <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')" :disabled="!removeKeywords"
                @click="upload.tags = null">
          <font-awesome-icon icon="trash-alt" />
<!--          <i class="fas fa-trash-alt"></i>-->
        </button>
      </div>
    </div>

    <!-- LICENCE and COPYRIGHT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`licence`">{{ $t('otherFiles.licence') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.licence"
                         id="licence"
                         :options="autocomplete.licences"
                         @open="maybeGetLicences"
                         track-by="id"
                         label="licence"
                         :loading="searchingLicences"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false"></vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`copyright_agent`">{{ $t('otherFiles.copyrightAgent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.copyright_agent"
                         id="copyright_agent"
                         :options="autocomplete.copyrightAgents"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- IMAGE TYPE and DEVICE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`image_type`">{{ $t('otherFiles.imageType') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.image_type"
                         id="image_type"
                         :options="autocomplete.imageTypes"
                         @open="maybeGetImageType"
                         track-by="id"
                         :label="imageTypeLabel"
                         :loading="searchingImageTypes"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`device_txt`">{{ $t('otherFiles.deviceTxt') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="device_txt" v-model="upload.device_txt" type="text"></b-form-input>
      </div>
    </div>

    <!-- AGENT and DATE DIGITISED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_digitised`">{{ $t('otherFiles.agentDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="upload.agent_digitised"
                         id="agent_digitised"
                         :options="autocomplete.agentsDigitised"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`date_digitised`">{{ $t('otherFiles.dateDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_digitised"
                    v-model="upload.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>
    </div>

    <!-- RELATED DATA -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`related_data`">{{ $t('otherFiles.relatedData') }}:</label>
      </div>

      <div class="col-sm-4">
        <b-form-select id="related_data" v-model="relatedTable" class="mb-3">
          <option :value="null">{{ this.$t('otherFiles.relatedDataDefault') }}</option>
          <option value="collection">{{ this.$t('otherFiles.relatedTables.collection') }}</option>
          <option value="specimen">{{ this.$t('otherFiles.relatedTables.specimen') }}</option>
          <option value="sample">{{ this.$t('otherFiles.relatedTables.sample') }}</option>
          <option value="sample_series">{{ this.$t('otherFiles.relatedTables.sample_series') }}</option>
          <option value="analysis">{{ this.$t('otherFiles.relatedTables.analysis') }}</option>
          <option value="dataset">{{ this.$t('otherFiles.relatedTables.dataset') }}</option>
          <option value="doi">{{ this.$t('otherFiles.relatedTables.doi') }}</option>
          <option value="locality">{{ this.$t('otherFiles.relatedTables.locality') }}</option>
          <option value="drillcore">{{ this.$t('otherFiles.relatedTables.drillcore') }}</option>
          <option value="drillcore_box">{{ this.$t('otherFiles.relatedTables.drillcore_box') }}</option>
          <option value="preparation">{{ this.$t('otherFiles.relatedTables.preparation') }}</option>
          <option value="reference">{{ this.$t('otherFiles.relatedTables.reference') }}</option>
          <option value="storage">{{ this.$t('otherFiles.relatedTables.storage') }}</option>
          <option value="project">{{ this.$t('otherFiles.relatedTables.project') }}</option>
          <option value="site">{{ this.$t('otherFiles.relatedTables.site') }}</option>
        </b-form-select>
      </div>


      <div class="col-sm-2" v-if="relatedTable !== null">
        <label :for="relatedTable">{{ this.$t('otherFiles.relatedTables.' + relatedTable) }}:</label>
      </div>

      <div class="col-sm-4" v-if="relatedTable !== null">
        <vue-multiselect v-model="upload.related_data['attach_link__' + relatedTable]"
                         :id="relatedTable"
                         :multiple="true"
                         track-by="id"
                         :options="autocomplete.relatedData[relatedTable]"
                         :internal-search="false"
                         @search-change="getRelatedData"
                         :custom-label="customLabelForRelatedData"
                         :loading="searchingRelatedData[relatedTable]"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- SHOWING RELATED_DATA -->
    <div class="row">

      <!-- COLLECTION -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__collection !== null && upload.related_data.attach_link__collection.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.collection') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('collection.name') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__collection">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'collection', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__collection.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SPECIMEN -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__specimen !== null && upload.related_data.attach_link__specimen.length > 0">

        <p class="h4">{{ this.$t('otherFiles.relatedTables.specimen') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('specimen.specimenNumber') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__specimen">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'specimen', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>
                <span v-if="entity.coll__number !== null">{{ entity.coll__number.split(' ')[0] }} {{ entity.specimen_id }}</span>
                <span v-else>{{ entity.specimen_id }}</span>
              </td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__specimen.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SAMPLE -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__sample !== null && upload.related_data.attach_link__sample.length > 0">

        <p class="h4">{{ this.$t('otherFiles.relatedTables.sample') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('sample.number') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__sample">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'sample', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.number }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__sample.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SAMPLE_SERIES -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__sample_series !== null && upload.related_data.attach_link__sample_series.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.sample_series') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('sample_series.name') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__sample_series">
              <td>{{ entity.id }}</td>

              <td>{{ entity.name }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__sample_series.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- ANALYSIS -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__analysis !== null && upload.related_data.attach_link__analysis.length > 0">

        <p class="h4">{{ this.$t('otherFiles.relatedTables.analysis') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('analysis.sample') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__analysis">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'analysis', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>
                <span v-if="entity.sample__number !== null && entity.sample__number">{{ entity.sample__number }}</span>
                <span v-else>{{ entity.sample__id }}</span>
              </td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__analysis.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DATASET -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__dataset !== null && upload.related_data.attach_link__dataset.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.dataset') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('dataset.name') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__dataset">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'dataset', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__dataset.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DOI -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__doi !== null && upload.related_data.attach_link__doi.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.doi') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('doi.identifier') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__doi">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'doi', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.identifier }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__doi.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- LOCALITY -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__locality !== null && upload.related_data.attach_link__locality.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.locality') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('locality.locality') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__locality">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'locality', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.locality : entity.locality_en }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__locality.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DRILLCORE -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__drillcore !== null && upload.related_data.attach_link__drillcore.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.drillcore') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('drillcore.drillcore') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__drillcore">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'drillcore', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.drillcore : entity.drillcore_en }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__drillcore.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DRILLCORE_BOX -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__drillcore_box !== null && upload.related_data.attach_link__drillcore_box.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.drillcore_box') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('drillcore_box.drillcore') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__drillcore_box">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'corebox', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.drillcore__drillcore : entity.drillcore__drillcore_en }} - {{ entity.number }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__drillcore_box.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- PREPARATION -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__preparation !== null && upload.related_data.attach_link__preparation.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.preparation') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('preparation.number') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__preparation">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'preparation', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.preparation_number }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__preparation.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- REFERENCE -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__reference !== null && upload.related_data.attach_link__reference.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.reference') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('reference.reference') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__reference">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.reference }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__reference.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- STORAGE -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__storage !== null && upload.related_data.attach_link__storage.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.storage') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('storage.storage') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__storage">
              <td>{{ entity.id }}</td>

              <td>
                <span v-if="entity.contents !== null">{{ entity.location }} - {{ entity.contents }}</span>
                <span v-else>{{ entity.location }}</span>
              </td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__storage.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- PROJECT -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__project !== null && upload.related_data.attach_link__project.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.project') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('project.name') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__project">
              <td>
                <router-link :to="{ path: '/project/' + entity.id }">{{ entity.id }}</router-link>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__project.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SITE -->
      <div class="col-sm-6" v-if="upload.related_data.attach_link__site !== null && upload.related_data.attach_link__site.length > 0">

        <p class="h4">{{ $t('otherFiles.relatedTables.site') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('site.name') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in upload.related_data.attach_link__site">
              <td>
                <router-link :to="{ path: '/site/' + entity.id }">{{ entity.id }}</router-link>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="upload.related_data.attach_link__site.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <!--<b-form-checkbox id="is_preferred" v-model="upload.is_preferred" value="1" unchecked-value="0">-->
        <!--{{ $t('otherFiles.preferred') }}-->
        <!--</b-form-checkbox>-->

        <b-form-checkbox id="is_private" v-model="upload.is_private" value="1" unchecked-value="0">
          {{ $t('otherFiles.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="upload.is_locked" value="1" unchecked-value="0">
          {{ $t('otherFiles.locked') }}
        </b-form-checkbox>
      </div>
    </div>


    <div class="row mt-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false)">{{ $t('add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true)">{{ $t('add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset">{{ $t('add.buttons.clearFields') }}</button>
        <button class="btn btn-warning mr-2 mb-2" @click="clearLocalStorage">{{ $t('add.buttons.clearLocalStorage') }}</button>
      </div>
    </div>


    <bottom-options :success-button="$t('add.buttons.add')"
                    :danger-button="$t('add.buttons.clearFields')"
                    object="attachment"
                    v-on:button-clicked="hoverButtonClicked"></bottom-options>

  </div>
</template>

<script>
  import formManipulation  from './../mixins/formManipulation'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faFile} from '@fortawesome/free-solid-svg-icons'
  import Datepicker from 'vue2-datepicker'
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import cloneDeep from 'lodash/cloneDeep'
  import EXIF from 'exif-js'
  import { toastSuccess, toastError, toastInfo } from "@/assets/js/iziToast/iziToast";
  import BottomOptions from '@/components/partial/BottomOptionsOld.vue'
  import MapComponent2 from "../partial/MapComponent2";

  library.add(faFile)
  import Vue from 'vue'
  import fontAwesomeLib from "../mixins/fontAwasomeLib";
  import permissionsMixin from "../mixins/permissionsMixin";
  export default {
    components: {
      FontAwesomeIcon,
      VueMultiselect,
      Datepicker,
      Spinner,
      BottomOptions,
      MapComponent2
    },
    name: "OtherFiles",
    mixins: [formManipulation, fontAwesomeLib, permissionsMixin],
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
        files: null,
        fileMetaData: null,
        isDragging: false,
        showCollapseMap: true,
        autocomplete: {
          authors: [],
          agentsDigitised: [],
          copyrightAgents: [],
          imageTypes: [],
          types: [],
          licences: [],
          relatedData: {
            collection: [],
            specimen: [],
            sample: [],
            sample_series: [],
            analysis: [],
            dataset: [],
            doi: [],
            locality: [],
            drillcore: [],
            drillcore_box: [],
            preparation: [],
            reference: [],
            storage: [],
            project: [],
            site: [],
          },
        },
        searchingAuthors: false,
        searchingImageTypes: false,
        searchingTypes: false,
        searchingLicences: false,
        searchingRelatedData: {
          collection: false,
          specimen: false,
          sample: false,
          sample_series: false,
          analysis: false,
          dataset: false,
          doi: false,
          locality: false,
          drillcore: false,
          drillcore_box: false,
          preparation: false,
          reference: false,
          storage: false,
          project: false,
          site: false,
        },
        myKeywords: [],
        relatedTable: null,
        upload: {
          specimen_image_attachment: 3,
          author: null,
          author_free: null,
          date_created: new Date(),
          date_created_free: null,
          description: null,
          description_en: null,
          image_type: {
            id: 5,
            value: 'digipilt',
            value_en: 'digital image'
          },
          // device: null,
          device_txt: null,
          agent_digitised: null,
          date_digitised: null,
          // device_digitised: null,
          image_width: null,
          image_height: null,
          attachment_format: null,
          type: {
            id: 1,
            value: 'foto',
            value_en: 'image'
          },
          tags: null,
          // stars: null,
          licence: null,
          copyright_agent: null,
          // is_preferred: '1',
          is_private: '0',
          is_locked: '0',
          remarks: null,
          image_latitude: null,
          image_longitude: null,
          related_data: {
            attach_link__collection: null,
            attach_link__specimen: null,
            attach_link__sample: null,
            attach_link__sample_series: null,
            attach_link__analysis: null,
            attach_link__dataset: null,
            attach_link__doi: null,
            attach_link__locality: null,
            attach_link__drillcore: null,
            attach_link__drillcore_box: null,
            attach_link__preparation: null,
            attach_link__reference: null,
            attach_link__storage: null,
            attach_link__project: null,
            attach_link__site: null,
          }
          // user_added: null,
          // date_added: null,
          // user_changed: null,
          // date_changed: null,
          // database_id: null,
          // uuid: null,
          // uuid_filename: null,
          // filename: null,
        },
      }
    },

    watch: {
      'files': function (newVal) {

        this.resetMetaData()

        if (newVal.length > 0) {
          for (let i = 0; i < newVal.length; i++){
            if (newVal[i].type.includes('image')) {
              let reader = new FileReader();

              reader.onload = (event) => {
                console.log(event.target.result)
                this.$refs['image' + parseInt(i)][0].src = event.target.result;
              }

              reader.readAsDataURL(this.files[i]);
            }
          }
        }

        if (newVal.length === 1) {
          let fileReader = new FileReader()
          fileReader.readAsArrayBuffer(newVal[0])
          fileReader.onload = (event) => {
            // TODO: Get thumbnail
            this.fileMetaData = EXIF.readFromBinaryFile(event.target.result)
          }
        }
      },
      'fileMetaData': function (newVal) {
        console.log(newVal)
        if (newVal !== null && newVal !== false) {

          // DATE
          if (newVal.DateTimeOriginal !== null && typeof newVal.DateTimeOriginal !== 'undefined') {
            let formattedDate = this.$moment(newVal.DateTimeOriginal, 'YYYY:MM:DD HH:mm:ss')
            this.upload.date_created = formattedDate.toDate()
          } else if (newVal.DateTime !== null && typeof newVal.DateTime !== 'undefined') {
            let formattedDate = this.$moment(newVal.DateTime, 'YYYY:MM:DD HH:mm:ss')
            this.upload.date_created = formattedDate.toDate()
          } else this.upload.date_created = new Date()

          // DESCRIPTION
          if (newVal.ImageDescription !== null && typeof newVal.ImageDescription !== 'undefined') {
            if (newVal.ImageDescription.trim().length > 0) {
              this.upload.description_en = newVal.ImageDescription.trim()
            }
          }

          // DEVICE_TXT
          if (newVal.Model !== null && typeof newVal.Model !== 'undefined') this.upload.device_txt = newVal.Model
          else if (newVal.Make !== null && typeof newVal.Make !== 'undefined') this.upload.device_txt = newVal.Make

          // IMAGE DIMENSIONS
          if (newVal.PixelXDimension !== null && typeof newVal.PixelXDimension !== 'undefined') {
            this.upload.image_width = newVal.PixelXDimension
          } else {
            this.upload.image_width = null
          }
          if (newVal.PixelYDimension !== null && typeof newVal.PixelYDimension !== 'undefined') {
            this.upload.image_height = newVal.PixelYDimension
          } else {
            this.upload.image_height = null
          }
        }
      },
      'showCollapseMap'(newval, oldval){
        this.$localStorage.set('mapComponent',  newval)
      },
    },

    computed: {
      filesState() {
        return this.files !== null && this.files.length > 0
      },

      authorState() {
        if (this.upload.author !== null) return true
        if (this.upload.author_free !== null) {
          return this.upload.author_free.length > 0
        }
        return false
      },

      descriptionState() {
        if (this.upload.description !== null) {
          return this.upload.description.trim().length > 0
        }
        return false
      },

      descriptionEnState() {
        if (this.upload.description_en !== null) {
          return this.upload.description_en.trim().length > 0
        }
        return false
      },

      imageTypeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      typeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      isLocaleEst() {
        return this.$i18n.locale === 'ee'
      },

      removeKeywords() {
        if (this.upload.tags !== null) {
          return this.upload.tags.length > 0
        }
        return false
      },
    },
    created: function () {
      // Gets saved form values from local storage
      const otherFiles = this.$localStorage.get('otherFiles', 'fallbackValue')
      if (otherFiles !== 'fallbackValue' && Object.keys(otherFiles).length !== 0 && otherFiles.constructor === Object) {
        if (otherFiles.specimen_image_attachment === 3) {
          this.upload = otherFiles
        } else {
          // If specimen_image_attachment is not 1 then remove localStorage (can't be trusted). Someone changed it manually
          this.$localStorage.remove('otherFiles')
        }
      }

      // Gets keywords from local storage
      const otherFilesKeywords = this.$localStorage.get('otherFilesKeywords', 'fallbackValue')
      if (otherFilesKeywords !== 'fallbackValue' && otherFilesKeywords.length > 0) this.myKeywords = otherFilesKeywords

      this.upload.author = {
        id: this.currentUser.id,
        agent: this.currentUser.agent,
        forename: this.currentUser.forename,
        surename: this.currentUser.surename
      }
    },
    beforeMount(){
      //localstorage settings
      let showCollapseMap = this.$localStorage.get('mapComponent', 'fallbackValue')
      if (typeof showCollapseMap === 'undefined' || showCollapseMap === 'fallbackValue') return
      this.showCollapseMap = showCollapseMap
    },
    methods: {

      hoverButtonClicked(choice, object) {
        if (choice === "SAVE") this.add(false)
        if (choice === "CANCEL") this.reset()
      },

      add(addAnother) {
        if (this.filesState && this.descriptionState && this.descriptionEnState && this.authorState && !this.sendingData) {

          this.sendingData = true
          this.loadingPercent = 0

          let formData = new FormData()

          const dataToUpload = this.formatDataForUpload(this.upload);
          formData.append('data', dataToUpload)

          if (this.files !== null) {
            for (let file in this.files) {
              // TODO: Only append 10 first files
              console.log(this.files[file])
              formData.append('file' + file, this.files[file])
            }
          }

          const dataToStorage = this.setRelatedDataToNull(this.upload)
          this.$localStorage.set('otherFiles', dataToStorage)
          this.$localStorage.set('otherFilesKeywords', this.myKeywords)

          this.$http.post(this.apiUrl + 'add/attachment/', formData, {
            before(request) {
              this.previousRequest = request
            },
            progress: (e) => {
              if (e.lengthComputable) {
                // console.log("e.loaded: %o, e.total: %o, percent: %o", e.loaded, e.total, (e.loaded / e.total ) * 100);
                this.loadingPercent = Math.round((e.loaded / e.total) * 100)
              }
            }
          }).then(response => {
            console.log(response)
            this.sendingData = false
            if (response.status === 200) {
              if (typeof response.body.message !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                  toastSuccess({text: response.body.message_et});
                } else {
                  toastSuccess({text: response.body.message});
                }
                //create relation with locality
                try{
                  if(this.$parent.createRelationWith !== null ){
                    this.addRelationBetweenAnyObjectAndAttachment(response.body.attachment_id,'attachment_link');
                  }
                } catch (e) { console.log(e)}


                if (!addAnother) {
                  this.$router.push({ path: '/attachment' })
                } else {
                  this.clearFile()
                }
              }
              if (typeof response.body.error !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
                  toastError({text: response.body.error_et});
                } else {
                  toastError({text: response.body.error});
                }

              }
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.sendingData = false
            toastError(this.$t('messages.uploadError'))
          })

        } else if (this.sendingData) {
          // This shouldn't run unless user deletes html elements and tries to press 'add' button again
          toastError({text: this.$t('messages.easterEggError')})
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)

        // Building correct fields
        if (objectToUpload.author !== null && typeof objectToUpload.author !== 'undefined') uploadableObject.author = objectToUpload.author.id
        if (objectToUpload.image_type !== null && typeof objectToUpload.image_type !== 'undefined') uploadableObject.image_type = objectToUpload.image_type.id
        if (objectToUpload.agent_digitised !== null && typeof objectToUpload.agent_digitised !== 'undefined') uploadableObject.agent_digitised = objectToUpload.agent_digitised.id
        if (objectToUpload.type !== null && typeof objectToUpload.type !== 'undefined') uploadableObject.type = objectToUpload.type.id
        if (objectToUpload.licence !== null && typeof objectToUpload.licence !== 'undefined') uploadableObject.licence = objectToUpload.licence.id
        if (objectToUpload.copyright_agent !== null && typeof objectToUpload.copyright_agent !== 'undefined') uploadableObject.copyright_agent = objectToUpload.copyright_agent.id
        if (objectToUpload.tags !== null && typeof objectToUpload.tags !== 'undefined') {
          if (objectToUpload.tags.length !== 0) {
            let arrayOfKeywords = objectToUpload.tags.map(function (word) {
              return word['name']
            })
            uploadableObject.tags = arrayOfKeywords.join('|')
          } else {
            uploadableObject.tags = null
          }
        }
        if (objectToUpload.date_created !== null && typeof objectToUpload.date_created !== 'undefined') {
          if (typeof objectToUpload.date_created === 'string') uploadableObject.date_created = objectToUpload.date_created.split('T')[0]
          else uploadableObject.date_created = objectToUpload.date_created.toISOString().split('T')[0]
        }
        if (objectToUpload.date_digitised !== null && typeof objectToUpload.date_digitised !== 'undefined') {
          if (typeof objectToUpload.date_digitised === 'string') uploadableObject.date_digitised = objectToUpload.date_digitised.split('T')[0]
          else uploadableObject.date_digitised = objectToUpload.date_digitised.toISOString().split('T')[0]
        }


        /**************************
         *** RELATED DATA START ***
         **************************/

        if (objectToUpload.attach_link__collection !== null && typeof objectToUpload.attach_link__collection !== 'undefined') {
          if (objectToUpload.attach_link__collection.length === 0) uploadableObject.attach_link__collection = null
        }
        if (objectToUpload.attach_link__specimen !== null && typeof objectToUpload.attach_link__specimen !== 'undefined') {
          if (objectToUpload.attach_link__specimen.length === 0) uploadableObject.attach_link__specimen = null
        }
        if (objectToUpload.attach_link__sample !== null && typeof objectToUpload.attach_link__sample !== 'undefined') {
          if (objectToUpload.attach_link__sample.length === 0) uploadableObject.attach_link__sample = null
        }
        if (objectToUpload.attach_link__sample_series !== null && typeof objectToUpload.attach_link__sample_series !== 'undefined') {
          if (objectToUpload.attach_link__sample_series.length === 0) uploadableObject.attach_link__sample_series = null
        }
        if (objectToUpload.attach_link__analysis !== null && typeof objectToUpload.attach_link__analysis !== 'undefined') {
          if (objectToUpload.attach_link__analysis.length === 0) uploadableObject.attach_link__analysis = null
        }
        if (objectToUpload.attach_link__dataset !== null && typeof objectToUpload.attach_link__dataset !== 'undefined') {
          if (objectToUpload.attach_link__dataset.length === 0) uploadableObject.attach_link__dataset = null
        }
        if (objectToUpload.attach_link__doi !== null && typeof objectToUpload.attach_link__doi !== 'undefined') {
          if (objectToUpload.attach_link__doi.length === 0) uploadableObject.attach_link__doi = null
        }
        if (objectToUpload.attach_link__locality !== null && typeof objectToUpload.attach_link__locality !== 'undefined') {
          if (objectToUpload.attach_link__locality.length === 0) uploadableObject.attach_link__locality = null
        }
        if (objectToUpload.attach_link__drillcore !== null && typeof objectToUpload.attach_link__drillcore !== 'undefined') {
          if (objectToUpload.attach_link__drillcore.length === 0) uploadableObject.attach_link__drillcore= null
        }
        if (objectToUpload.attach_link__drillcore_box !== null && typeof objectToUpload.attach_link__drillcore_box !== 'undefined') {
          if (objectToUpload.attach_link__drillcore_box.length === 0) uploadableObject.attach_link__drillcore_box = null
        }
        if (objectToUpload.attach_link__preparation !== null && typeof objectToUpload.attach_link__preparation !== 'undefined') {
          if (objectToUpload.attach_link__preparation.length === 0) uploadableObject.attach_link__preparation = null
        }
        if (objectToUpload.attach_link__reference !== null && typeof objectToUpload.attach_link__reference !== 'undefined') {
          if (objectToUpload.attach_link__reference.length === 0) uploadableObject.attach_link__reference = null
        }
        if (objectToUpload.attach_link__storage !== null && typeof objectToUpload.attach_link__storage !== 'undefined') {
          if (objectToUpload.attach_link__storage.length === 0) uploadableObject.attach_link__storage = null
        }
        if (objectToUpload.attach_link__project !== null && typeof objectToUpload.attach_link__project !== 'undefined') {
          if (objectToUpload.attach_link__project.length === 0) uploadableObject.attach_link__project = null
        }
        if (objectToUpload.attach_link__site !== null && typeof objectToUpload.attach_link__site !== 'undefined') {
          if (objectToUpload.attach_link__site.length === 0) uploadableObject.attach_link__site = null
        }

        /**************************
         ***  RELATED DATA END  ***
         **************************/


        console.log('This object is sent in string format:')
        console.log(uploadableObject)

        return JSON.stringify(uploadableObject)
      },

      cancelRequest() {
        this.previousRequest.abort()
      },

      addKeyword(newKeyword) {
        // let lowerCaseKeyword = newKeyword.toLowerCase()
        // const keyword = {name: lowerCaseKeyword}
        const keyword = {name: newKeyword}

        this.myKeywords.push(keyword)
        if (this.upload.tags === null) this.upload.tags = []
        this.upload.tags.push(keyword)
      },

      setRelatedDataToNull(data) {
        let copyOfData = cloneDeep(data)

        copyOfData.related_data.attach_link__collection = null
        copyOfData.related_data.attach_link__specimen = null
        copyOfData.related_data.attach_link__sample = null
        copyOfData.related_data.attach_link__sample_series = null
        copyOfData.related_data.attach_link__analysis = null
        copyOfData.related_data.attach_link__dataset = null
        copyOfData.related_data.attach_link__doi = null
        copyOfData.related_data.attach_link__locality = null
        copyOfData.related_data.attach_link__drillcore = null
        copyOfData.related_data.attach_link__drillcore_box = null
        copyOfData.related_data.attach_link__preparation = null
        copyOfData.related_data.attach_link__reference = null
        copyOfData.related_data.attach_link__storage = null
        copyOfData.related_data.attach_link__project = null
        copyOfData.related_data.attach_link__site = null

        return copyOfData
      },



      /**************************
       *** AUTOCOMPLETE START ***
       **************************/

      getAuthors(query, id) {
        if (query.length > 0) {

          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'agent/?multi_search=value:' + query + ';fields:agent,forename,surename;lookuptype:icontains&format=json'

          this.searchingAuthors = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = response.body.results
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = response.body.results
                else this.autocomplete.authors = response.body.results;
              }
              else {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = []
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = []
                else this.autocomplete.authors = [];
              }
            }
            this.searchingAuthors = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingAuthors = false;
          })
        }
      },

      maybeGetImageType() {
        return this.autocomplete.imageTypes.length <= 0 ? this.getImageType() : null
      },

      getImageType() {
        this.searchingImageTypes = true;

        this.$http.get(this.apiUrl + 'list_image_type/', {
          params: {
            value__isnull: 'false',
            value_en__isnull: 'false',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.imageTypes = response.body.results;
            } else {
              this.autocomplete.imageTypes = []
            }
          }
          this.searchingImageTypes = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingImageTypes = false;
        })
      },

      maybeGetTypes() {
        return this.autocomplete.types.length <= 0 ? this.getTypes() : null
      },

      getTypes() {
        this.searchingTypes = true;

        this.$http.get(this.apiUrl + 'list_attachment_type/', {
          params: {
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) this.autocomplete.types = response.body.results;
            else this.autocomplete.types = []
          }
          this.searchingTypes = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingTypes = false;
        })
      },

      maybeGetLicences() {
        return this.autocomplete.licences.length <= 0 ? this.getLicences() : null
      },

      getLicences() {
        this.searchingLicences = true;

        this.$http.get(this.apiUrl + 'list_licence/', {
          params: {
            fields: 'id,licence',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.licences = response.body.results
            }
            else this.autocomplete.licences = []
          }
          this.searchingLicences = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingLicences = false;
        })
      },

      getRelatedData(query, id) {
        if (query.length > 0) {

          // TODO: Fields according to relatedTable(id)
          let search = ''
          let fields = 'id'
          switch(id) {
            case 'collection':
            case 'dataset':
              search += 'multi_search=value:' + query + ';fields:id,name,name_en;lookuptype:icontains'
              fields += ',name,name_en'
              break
            case 'specimen':
              search += 'multi_search=value:' + query + ';fields:id,specimen_id,coll__number;lookuptype:icontains'
              fields += ',specimen_id,coll__number'
              break
            case 'sample':
              search += 'multi_search=value:' + query + ';fields:id,number;lookuptype:icontains'
              fields += ',number'
              break
            case 'sample_series':
              search += 'multi_search=value:' + query + ';fields:id,name;lookuptype:icontains'
              fields += ',name'
              break
            case 'analysis':
              search += 'multi_search=value:' + query + ';fields:id,sample__number;lookuptype:icontains'
              fields += ',sample__number,sample__id'
              break
            case 'doi':
              search += 'multi_search=value:' + query + ';fields:id,identifier;lookuptype:icontains'
              fields += ',identifier'
              break
            case 'locality':
              search += 'multi_search=value:' + query + ';fields:id,locality,locality_en;lookuptype:icontains'
              fields += ',locality,locality_en'
              break
            case 'drillcore':
              search += 'multi_search=value:' + query + ';fields:id,drillcore,drillcore_en;lookuptype:icontains'
              fields += ',drillcore,drillcore_en'
              break
            case 'drillcore_box':
              search += 'multi_search=value:' + query + ';fields:id,drillcore__drillcore,drillcore__drillcore_en,number;lookuptype:icontains'
              fields += ',drillcore__drillcore,drillcore__drillcore_en,number'
              break
            case 'preparation':
              search += 'multi_search=value:' + query + ';fields:id,preparation_number;lookuptype:icontains'
              fields += ',preparation_number'
              break
            case 'reference':
              search += 'multi_search=value:' + query + ';fields:id,reference;lookuptype:icontains'
              fields += ',reference'
              break
            case 'storage':
              search += 'multi_search=value:' + query + ';fields:id,location,contents;lookuptype:icontains';
              fields += ',location,contents';
              break;
            case 'project':
              search += 'multi_search=value:' + query + ';fields:id,name,name_en;lookuptype:icontains';
              fields += ',name,name_en';
              break;
            case 'site':
              search += 'multi_search=value:' + query + ';fields:id,name,name_en;lookuptype:icontains';
              fields += ',name,name_en';
              break;
            default:
              search += 'id__icontains=' + query;
              fields += '';
              break;
          }

          console.log(search)

          let url = this.apiUrl
          if (id === 'storage') url += 'location/?' + search + '&fields=' + fields + '&format=json'
          else url += id + '/?' + search + '&fields=' + fields + '&format=json'

          this.searchingRelatedData[id] = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) {
                this.autocomplete.relatedData[id] = response.body.results;
              }
              else {
                this.autocomplete.relatedData[id] = [];
              }
            }
            this.searchingRelatedData[id] = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingRelatedData[id] = false;
          })
        }
      },

      /**************************
       ***  AUTOCOMPLETE END  ***
       **************************/



      /***************************
       *** FILE DROPPING START ***
       ***************************/

      dropFile(event) {
        let files = []
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          files.push(event.dataTransfer.files[i])
        }

        if (files.length > 0) {
          this.files = files
        }

        this.isDragging = false
      },

      /**************************
       *** FILE DROPPING END  ***
       **************************/



      openGeoInNewWindow(params) {
        let width = 600;
        switch (params.object) {
          case "specimen":
            width = 1050;
            break;
          case "locality":
            width = 1025;
            break;
          case "doi":
            width = 1000;
        }
        window.open('http://geocollections.info/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750')
      },

      customLabelForAuthor(option) {
        if (option.agent === null && option.forename !== null && option.surename === null) return `${option.forename}`
        if (option.forename === null || option.surename === null) return `${option.agent}`
        else return `${option.agent} (${option.forename} ${option.surename})`
      },

      customLabelForRelatedData(option) {
        switch(this.relatedTable) {
          case 'collection':
          case 'dataset':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.name})`
            return `${option.id} - (${option.name_en})`
          case 'specimen':
            if (option.coll__number === null) return `${option.specimen_id} (${option.id})`
            else return `${option.coll__number.split(' ')[0]} ${option.specimen_id} (${option.id})`
          case 'sample':
            return `${option.id} - (${option.number})`
          case 'sample_series':
            return `${option.id} - (${option.name})`
          case 'analysis':
            if (option.sample__number !== null) return `${option.id} - (${option.sample__number})`
            else return `${option.id}`
          case 'doi':
            return `${option.id} - (${option.identifier})`
          case 'locality':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.locality})`
            return `${option.id} - (${option.locality_en})`
          case 'drillcore':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.drillcore})`
            return `${option.id} - (${option.drillcore_en})`
          case 'drillcore_box':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.drillcore__drillcore} - ${option.number})`
            return `${option.id} - (${option.drillcore__drillcore_en} - ${option.number})`
          case 'preparation':
            return `${option.id} - (${option.preparation_number})`
          case 'reference':
            return `${option.id} - (${option.reference})`
          case 'storage':
            if (option.contents === null) return `${option.id} - (${option.location})`
            else return `${option.id} - (${option.location} - ${option.contents})`;
          case 'project':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.name})`
            return `${option.id} - (${option.name_en})`;
          case 'site':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.name})`
            return `${option.id} - (${option.name_en})`;
          default:
            return `${option.id}`
        }
      },

      clearFile() {
        this.$refs.fileinput.reset()
        this.resetMetaData()
      },

      updateLocation(location) {
        this.upload.image_latitude = location.lat.toFixed(6)
        this.upload.image_longitude = location.lng.toFixed(6)
      },

      reset() {
        this.clearFile()
        this.upload = {
          specimen_image_attachment: 3,
          author: null,
          author_free: null,
          date_created: new Date(),
          date_created_free: null,
          description: null,
          description_en: null,
          image_type: {
            id: 5,
            value: 'digipilt',
            value_en: 'digital image'
          },
          // device: null,
          device_txt: null,
          agent_digitised: null,
          date_digitised: null,
          // device_digitised: null,
          image_width: null,
          image_height: null,
          attachment_format: null,
          type: {
            id: 1,
            value: 'foto',
            value_en: 'image'
          },
          tags: null,
          // stars: null,
          licence: null,
          copyright_agent: null,
          // is_preferred: '1',
          is_private: '0',
          is_locked: '0',
          remarks: null,
          related_data: {
            attach_link__collection: null,
            attach_link__specimen: null,
            attach_link__sample: null,
            attach_link__sample_series: null,
            attach_link__analysis: null,
            attach_link__dataset: null,
            attach_link__doi: null,
            attach_link__locality: null,
            attach_link__drillcore: null,
            attach_link__drillcore_box: null,
            attach_link__preparation: null,
            attach_link__reference: null,
            attach_link__storage: null,
            attach_link__project: null,
            attach_link__site: null,
          }
          // user_added: null,
          // date_added: null,
          // user_changed: null,
          // date_changed: null,
          // database_id: null,
          // uuid: null,
          // uuid_filename: null,
          // filename: null,
        }
      },

      resetMetaData() {
        // Because of #62 and #65 23.10.2018
        // this.upload.date_created = null;
        // this.upload.description_en = null;
        // this.upload.device_txt = null;
        this.upload.image_width = null;
        this.upload.image_height = null;
      },

      clearLocalStorage() {
        this.$localStorage.remove('otherFiles')
        this.$localStorage.remove('otherFilesKeywords')
        toastInfo({text: this.$t('messages.defaultsRemoved')})
      }
    }
  }
</script>

<style scoped>
  label {
    margin-bottom: 0.2rem;
  }

  .dragging {
    color: #fff;
    background-color: #007bff;
  }

  .thumbnail-preview {
    max-width: 100px;
    max-height: 200px;
  }

  .delete-relation {
    transition: background-color 500ms ease-in-out;
    vertical-align: middle;
  }

  .delete-relation:hover {
    cursor: pointer;
    background-color: rgba(220,53,69, 0.7);
  }
</style>
