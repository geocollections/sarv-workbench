<template>
  <div class="other-files">

    <div class="row" v-if="isAttachmentLocked">
      <div class="col-md-6">
        <div class="alert alert-info m-0 p-1">{{ $t('edit.locked') }}</div>
      </div>
    </div>

    <div class="row mt-4" v-if="attachment !== null">

      <!-- FILE -->
      <div class="col-sm-6 mb-4 text-center">
        <file-preview :data="data"/>
      </div>

      <!-- FILE INFORMATION -->
      <div class="col-sm-6">
        <file-information :data="data"/>
      </div>
    </div>

    <!-- AUTHOR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('otherFiles.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.author"
                         id="author"
                         track-by="id"
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
                      v-model="edit.author_free"
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
                    v-model="edit.date_created"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>


      <div class="col-sm-2">
        <label :for="`date_created_free`">{{ $t('otherFiles.dateCreatedFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_created_free" v-model="edit.date_created_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`description`">{{ $t('otherFiles.description') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="description" :state="descriptionState" v-model="edit.description" type="text"
                         :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>

        <b-form-text v-if="!descriptionState">{{ $t('add.errors.emptyField') }}.</b-form-text>
      </div>


      <div class="col-sm-2">
        <label :for="`description_en`">{{ $t('otherFiles.descriptionEn') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="description_en" :state="descriptionEnState" v-model="edit.description_en" type="text"
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
        <vue-multiselect v-model="edit.type"
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
                         v-model="edit.remarks"
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
        <i class="fas fa-globe-americas"></i>
      </legend>

      <!-- LOCATION -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`latitude`">{{ $t('otherFiles.latitude') }}:</label>
        </div>

        <div class="col-sm-4 mb-2">
          <b-form-input id="latitude" v-model="edit.image_latitude" type="number" step="0.000001"></b-form-input>
        </div>


        <div class="col-sm-2">
          <label :for="`longitude`">{{ $t('otherFiles.longitude') }}:</label>
        </div>

        <div class="col-sm-4 mb-2">
          <b-form-input id="longitude" v-model="edit.image_longitude" type="number" step="0.000001"></b-form-input>
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
            <map-component v-if="showCollapseMap"
                           mode="single"
                           v-bind:locations="[]"
                           v-bind:location="{ lat: edit.image_latitude ? (edit.image_latitude).toString() : null, lng: edit.image_longitude ? (edit.image_longitude).toString() : null }"
                           v-on:update-coordinates="updateLocation"/>
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
        <vue-multiselect v-model="edit.tags"
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
                @click="edit.tags = null">
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </div>

    <!-- LICENCE and COPYRIGHT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`licence`">{{ $t('otherFiles.licence') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.licence"
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
        <vue-multiselect v-model="edit.copyright_agent"
                         id="copyright_agent"
                         track-by="id"
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
        <vue-multiselect v-model="edit.image_type"
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
      <!--<div class="col-sm-2">-->
      <!--<label :for="`device`">{{ $t('otherFiles.device') }}:</label>-->
      <!--</div>-->

      <!--<div class="col-sm-4 mb-2">-->
      <!--<vue-multiselect v-model="edit.device"-->
      <!--id="device"-->
      <!--:options="autocomplete.devices"-->
      <!--@open="maybeGetDevices"-->
      <!--track-by="id"-->
      <!--label="name"-->
      <!--:loading="searchingDevices"-->
      <!--:placeholder="$t('add.inputs.autocomplete')"-->
      <!--:show-labels="false">-->
      <!--<template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
      <!--</vue-multiselect>-->
      <!--</div>-->


      <div class="col-sm-2">
        <label :for="`device_txt`">{{ $t('otherFiles.deviceTxt') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="device_txt" v-model="edit.device_txt" type="text"></b-form-input>
      </div>
    </div>

    <!-- AGENT and DATE DIGITISED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_digitised`">{{ $t('otherFiles.agentDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.agent_digitised"
                         id="agent_digitised"
                         track-by="id"
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
                    v-model="edit.date_digitised"
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
        <vue-multiselect v-model="edit.related_data['attach_link__' + relatedTable]"
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
      <div class="col-sm-6" v-if="edit.related_data.attach_link__collection !== null && edit.related_data.attach_link__collection.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__collection">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'collection', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__collection.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SPECIMEN -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__specimen !== null && edit.related_data.attach_link__specimen.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__specimen">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'specimen', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>
                <span v-if="entity.coll__number !== null">{{ entity.coll__number.split(' ')[0] }} {{ entity.specimen_id }}</span>
                <span v-else>{{ entity.specimen_id }}</span>
              </td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__specimen.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SAMPLE -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__sample !== null && edit.related_data.attach_link__sample.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__sample">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'sample', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.number }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__sample.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SAMPLE_SERIES -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__sample_series !== null && edit.related_data.attach_link__sample_series.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__sample_series">
              <td>{{ entity.id }}</td>

              <td>{{ entity.name }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__sample_series.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- ANALYSIS -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__analysis !== null && edit.related_data.attach_link__analysis.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__analysis">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'analysis', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>
                <span v-if="entity.sample__number !== null && entity.sample__number">{{ entity.sample__number }}</span>
                <span v-else>{{ entity.sample__id }}</span>
              </td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__analysis.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DATASET -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__dataset !== null && edit.related_data.attach_link__dataset.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__dataset">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'dataset', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__dataset.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DOI -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__doi !== null && edit.related_data.attach_link__doi.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__doi">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'doi', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.identifier }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__doi.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- LOCALITY -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__locality !== null && edit.related_data.attach_link__locality.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__locality">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'locality', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.locality : entity.locality_en }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__locality.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DRILLCORE -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__drillcore !== null && edit.related_data.attach_link__drillcore.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__drillcore">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'drillcore', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.drillcore : entity.drillcore_en }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__drillcore.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- DRILLCORE_BOX -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__drillcore_box !== null && edit.related_data.attach_link__drillcore_box.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__drillcore_box">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'corebox', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.drillcore__drillcore : entity.drillcore__drillcore_en }} - {{ entity.number }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__drillcore_box.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- PREPARATION -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__preparation !== null && edit.related_data.attach_link__preparation.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__preparation">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'preparation', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.preparation_number }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__preparation.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- REFERENCE -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__reference !== null && edit.related_data.attach_link__reference.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__reference">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ entity.reference }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__reference.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- STORAGE -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__storage !== null && edit.related_data.attach_link__storage.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__storage">
              <td>{{ entity.id }}</td>

              <td>
                <span v-if="entity.contents !== null">{{ entity.location }} - {{ entity.contents }}</span>
                <span v-else>{{ entity.location }}</span>
              </td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__storage.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- PROJECT -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__project !== null && edit.related_data.attach_link__project.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__project">
              <td>
                <router-link :to="{ path: '/project/' + entity.id }">{{ entity.id }}</router-link>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__project.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- SITE -->
      <div class="col-sm-6" v-if="edit.related_data.attach_link__site !== null && edit.related_data.attach_link__site.length > 0">

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
            <tr v-for="(entity, index) in edit.related_data.attach_link__site">
              <td>
                <router-link :to="{ path: '/site/' + entity.id }">{{ entity.id }}</router-link>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.name : entity.name_en }}</td>

              <td class="text-center delete-relation" @click="edit.related_data.attach_link__site.splice(index, 1)">
                <i class="fas fa-times"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>


    <!-- CHANGE TYPE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`specimen_image_attachment`">{{ $t('attachment.changeType') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-select id="specimen_image_attachment" v-model="edit.specimen_image_attachment" class="mb-3">
          <option :value="1" :disabled="!isValidToChangeTo('specimenImage')">{{ this.$t('attachment.specimenImage') }}</option>
          <option :value="2" :disabled="!isValidToChangeTo('photoArchive')">{{ this.$t('attachment.photoArchive') }}</option>
          <option :value="3" :disabled="!isValidToChangeTo('otherFile')">{{ this.$t('attachment.otherFiles') }}</option>
          <option :value="4" :disabled="!isValidToChangeTo('digitisedReference')">{{ this.$t('attachment.digitisedReference') }}</option>
        </b-form-select>
      </div>
    </div>

    <!-- IMAGESET -->
    <div class="row" v-if="edit.specimen_image_attachment === 2">
      <div class="col-sm-2" >
        <label :for="`imageset`">{{ $t('photoArchive.imagesetId') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.imageset"
                         id="imageset"
                         :options="autocomplete.imagesets"
                         :internal-search="false"
                         v-bind:class="{ valid: imagesetState, invalid: !imagesetState }"
                         @search-change="getImagesets"
                         label="imageset_number"
                         :loading="searchingImagesets"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
        <b-form-text v-if="!imagesetState">{{ $t('add.errors.imagesetId') }}.</b-form-text>
      </div>

      <div class="col-sm-1 mb-2">
        <a href="javascript:void(0)" @click="openInNewWindow({object: 'imageset', height: 500})" class="btn btn-outline-info" :title="$t('add.inputs.newImageset')">
          <i class="fas fa-plus"></i>
        </a>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="edit.is_private">
          {{ $t('otherFiles.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="edit.is_locked">
          {{ $t('otherFiles.locked') }}
        </b-form-checkbox>
      </div>
    </div>


<!--    <div class="row mt-3 mb-3">-->
<!--      <div class="col" v-if="!isAttachmentLocked">-->
<!--&lt;!&ndash;        <button class="btn btn-success mr-2 mb-2" @click="sendData(false)" >{{ $t('edit.buttons.save') }}</button>&ndash;&gt;-->
<!--&lt;!&ndash;        <button class="btn btn-success mr-2 mb-2" @click="sendData(true)" >{{ $t('edit.buttons.saveAndContinue') }}</button>&ndash;&gt;-->

<!--&lt;!&ndash;        <router-link class="btn btn-danger mr-2 mb-2" :to="{ path: '/attachment' }">{{ $t('edit.buttons.cancelWithoutSaving') }}</router-link>&ndash;&gt;-->

<!--        <new-doi-button v-if="isValidForDoiUpload()"-->
<!--                        :data="data"-->
<!--                        :form-data="edit"-->
<!--                        object="otherFiles"/>-->
<!--      </div>-->
<!--      <div class="col-sm-6" v-else>-->
<!--        <div class="alert alert-info">{{ $t('edit.locked') }}</div>-->
<!--      </div>-->
<!--    </div>-->


    <bottom-options v-if="$route.meta.isBottomOptionShown"
                    :object="$route.meta.object"
                    :is-navigation-shown="$route.meta.isNavigationShown"
                    v-on:button-clicked="hoverButtonClicked"></bottom-options>

  </div>
</template>

<script>
  import VueMultiselect from 'vue-multiselect'
  import Datepicker from 'vue2-datepicker'
  import cloneDeep from 'lodash/cloneDeep'
  import FileInformation from "@/components/partial/FileInformation.vue";
  import FilePreview from "@/components/partial/FilePreview.vue";
  import { toastError } from "@/assets/js/iziToast/iziToast";
  import BottomOptions from "../../partial/BottomOptions";
  import MapComponent from "../../partial/MapComponent";
  import NewDoiButton from "../../partial/NewDoiButton";
  import {toastInfo} from "../../../assets/js/iziToast/iziToast";

  export default {
    components: {
      NewDoiButton,
      BottomOptions,
      FileInformation,
      FilePreview,
      VueMultiselect,
      Datepicker,
      MapComponent
    },
    props:['data', 'attachLink'],
    name: "OtherFiles",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        attachment: this.data,
        localityQuerySmall: false,
        isFileLocked: this.data.is_locked,
        isChanged: false,
        showModal: false,
        showCollapseMap: true,
        autocomplete: {
          authors: [],
          types: [],
          agentsDigitised: [],
          copyrightAgents: [],
          imageTypes: [],
          // devices: [],
          localities: [],
          licences: [],
          imagesets: [],
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
        searchingTypes: false,
        searchingImagesets: false,
        searchingImageTypes: false,
        // searchingDevices: false,
        searchingLocalities: false,
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
        edit: {
          specimen_image_attachment: this.data.specimen_image_attachment,
          author: this.buildAuthor(),
          author_free: this.data.author_free,
          date_created: this.data.date_created,
          date_created_free: this.data.date_created_free,
          description: this.data.description,
          description_en: this.data.description_en,
          type: this.buildType(),
          remarks: this.data.remarks,
          image_latitude: this.data.image_latitude,
          image_longitude: this.data.image_longitude,
          imageset: null,
          tags: this.buildTags(),
          licence: this.buildLicence(),
          copyright_agent: this.buildCopyrightAgent(),
          // device: this.buildDevice(),
          device_txt: this.data.device_txt,
          agent_digitised: this.buildAgentDigitised(),
          // device_digitised: this.buildDeviceDigitised(),
          date_digitised: this.data.date_digitised,
          image_type: this.buildImageType(),
          // stars: this.data.stars,
          // is_preferred: this.data.is_preferred ? '1' : '0',
          is_private: this.data.is_private,
          is_locked: this.data.is_locked,
          related_data: {
            attach_link__collection: this.buildRelatedData(this.attachLink, 'collection'),
            attach_link__specimen: this.buildRelatedData(this.attachLink, 'specimen'),
            attach_link__sample: this.buildRelatedData(this.attachLink, 'sample'),
            attach_link__sample_series: this.buildRelatedData(this.attachLink, 'sample_series'),
            attach_link__analysis: this.buildRelatedData(this.attachLink, 'analysis'),
            attach_link__dataset: this.buildRelatedData(this.attachLink, 'dataset'),
            attach_link__doi: this.buildRelatedData(this.attachLink, 'doi'),
            attach_link__locality: this.buildRelatedData(this.attachLink, 'locality'),
            attach_link__drillcore: this.buildRelatedData(this.attachLink, 'drillcore'),
            attach_link__drillcore_box: this.buildRelatedData(this.attachLink, 'drillcore_box'),
            attach_link__preparation: this.buildRelatedData(this.attachLink, 'preparation'),
            attach_link__reference: this.buildRelatedData(this.attachLink, 'reference'),
            attach_link__storage: this.buildRelatedData(this.attachLink, 'storage'),
            attach_link__project: this.buildRelatedData(this.attachLink, 'project'),
            attach_link__site: this.buildRelatedData(this.attachLink, 'site'),
          }
        },
      }
    },

    watch: {
      'edit': {
        handler: function () {
          this.isChanged = true
        },
        deep: true
      },
      'showCollapseMap'(newval, oldval){
        this.$localStorage.set('mapComponent',  newval)
      },
    },

    computed: {
      authorState() {
        if (this.edit.author !== null) return true
        if (this.edit.author_free !== null) {
          return this.edit.author_free.length > 0
        }
        return false
      },

      descriptionState() {
        if (this.edit.description !== null) {
          return this.edit.description.trim().length > 0
        }
        return false
      },

      descriptionEnState() {
        if (this.edit.description_en !== null) {
          return this.edit.description_en.trim().length > 0
        }
        return false
      },

      typeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      imageTypeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      isAttachmentLocked() {
        return this.isFileLocked
      },

      removeKeywords() {
        if (this.edit.tags !== null) {
          return this.edit.tags.length > 0
        }
        return false
      },

      imagesetState() {
        return this.edit.imageset !== null
      },
    },

    created: function () {
      // Gets keywords from local storage
      const otherFilesKeywords = this.$localStorage.get('otherFilesKeywords', 'fallbackValue')
      if (otherFilesKeywords !== 'fallbackValue' && otherFilesKeywords.length > 0) this.myKeywords = otherFilesKeywords
    },

    beforeMount(){
      //localstorage settings
      let showCollapseMap = this.$localStorage.get('mapComponent', 'fallbackValue')
      if (typeof showCollapseMap === 'undefined' || showCollapseMap === 'fallbackValue') return
      this.showCollapseMap = showCollapseMap
    },

    methods: {

      hoverButtonClicked(choice, object) {
        if (choice === "SAVE_AND_LEAVE") this.sendData(false);
        if (choice === "SAVE") this.sendData(true)
        if (choice === "CANCEL") this.$router.push({path: '/' + object});
      },



      /******************
       *** SEND START ***
       ******************/

      sendData(continueEditing) {
        if (!this.isAttachmentLocked) {
          if (this.edit.specimen_image_attachment === 2) {
            if (this.authorState && this.descriptionState && this.descriptionEnState && this.imagesetState) {
              const formattedData = this.formatDataForEdit(this.edit)
              this.$emit('edit-data', formattedData, continueEditing)
            } else {
              toastError({text: this.$t('messages.checkForm')})
            }
          } else {
            if (this.authorState && this.descriptionState && this.descriptionEnState) {
              const formattedData = this.formatDataForEdit(this.edit)
              this.$emit('edit-data', formattedData, continueEditing)
            } else {
              toastError({text: this.$t('messages.checkForm')})
            }
          }
        } toastInfo({ text: this.$t('edit.locked') })
      },

      formatDataForEdit(unformattedData) {
        let uploadableData = cloneDeep(unformattedData)

        // Building correct fields
        if (unformattedData.author !== null && typeof unformattedData.author !== 'undefined') uploadableData.author = unformattedData.author.id
        if (unformattedData.type !== null && typeof unformattedData.type !== 'undefined') uploadableData.type = unformattedData.type.id
        if (unformattedData.image_type !== null && typeof unformattedData.image_type !== 'undefined') uploadableData.image_type = unformattedData.image_type.id
        // if (unformattedData.device !== null && typeof unformattedData.device !== 'undefined') uploadableData.device = unformattedData.device.id
        if (unformattedData.agent_digitised !== null && typeof unformattedData.agent_digitised !== 'undefined') uploadableData.agent_digitised = unformattedData.agent_digitised.id
        // if (unformattedData.device_digitised !== null && typeof unformattedData.device_digitised !== 'undefined') uploadableData.device_digitised = unformattedData.device_digitised.id
        if (unformattedData.licence !== null && typeof unformattedData.licence !== 'undefined') uploadableData.licence = unformattedData.licence.id
        if (unformattedData.copyright_agent !== null && typeof unformattedData.copyright_agent !== 'undefined') uploadableData.copyright_agent = unformattedData.copyright_agent.id
        if (unformattedData.tags !== null && typeof unformattedData.tags !== 'undefined') {
          if (unformattedData.tags.length !== 0) {
            let arrayOfKeywords = unformattedData.tags.map(function (word) {
              return word['name']
            })
            uploadableData.tags = arrayOfKeywords.join('|')
          } else {
            uploadableData.tags = null
          }
        }
        if (unformattedData.date_created !== null && typeof unformattedData.date_created !== 'undefined') {
          if (typeof unformattedData.date_created === 'string') uploadableData.date_created = unformattedData.date_created.split('T')[0]
          else {
            uploadableData.date_created = unformattedData.date_created
            uploadableData.date_created.setHours(0, -unformattedData.date_created.getTimezoneOffset(), 0, 0)

            uploadableData.date_created = unformattedData.date_created.toISOString().split('T')[0]
          }
        }
        if (unformattedData.date_digitised !== null && typeof unformattedData.date_digitised !== 'undefined') {
          if (typeof unformattedData.date_digitised === 'string') uploadableData.date_digitised = unformattedData.date_digitised.split('T')[0]
          else {
            uploadableData.date_digitised = unformattedData.date_digitised
            uploadableData.date_digitised.setHours(0, -unformattedData.date_digitised.getTimezoneOffset(), 0, 0)

            uploadableData.date_digitised = unformattedData.date_digitised.toISOString().split('T')[0]
          }
        }

        if (unformattedData.specimen_image_attachment === 2) {
          if (unformattedData.imageset !== null && typeof unformattedData.imageset !== 'undefined') uploadableData.imageset = unformattedData.imageset.id
        } else {
          uploadableData.imageset = null
        }



        /**************************
         *** RELATED DATA START ***
         **************************/

        if (unformattedData.related_data.attach_link__collection !== null && typeof unformattedData.related_data.attach_link__collection !== 'undefined') {
          if (unformattedData.related_data.attach_link__collection.length === 0) uploadableData.related_data.attach_link__collection = null
        }
        if (unformattedData.related_data.attach_link__specimen !== null && typeof unformattedData.related_data.attach_link__specimen !== 'undefined') {
          if (unformattedData.related_data.attach_link__specimen.length === 0) uploadableData.related_data.attach_link__specimen = null
        }
        if (unformattedData.related_data.attach_link__sample !== null && typeof unformattedData.related_data.attach_link__sample !== 'undefined') {
          if (unformattedData.related_data.attach_link__sample.length === 0) uploadableData.related_data.attach_link__sample = null
        }
        if (unformattedData.related_data.attach_link__sample_series !== null && typeof unformattedData.related_data.attach_link__sample_series !== 'undefined') {
          if (unformattedData.related_data.attach_link__sample_series.length === 0) uploadableData.related_data.attach_link__sample_series = null
        }
        if (unformattedData.related_data.attach_link__analysis !== null && typeof unformattedData.related_data.attach_link__analysis !== 'undefined') {
          if (unformattedData.related_data.attach_link__analysis.length === 0) uploadableData.related_data.attach_link__analysis = null
        }
        if (unformattedData.related_data.attach_link__dataset !== null && typeof unformattedData.related_data.attach_link__dataset !== 'undefined') {
          if (unformattedData.related_data.attach_link__dataset.length === 0) uploadableData.related_data.attach_link__dataset = null
        }
        if (unformattedData.related_data.attach_link__doi !== null && typeof unformattedData.related_data.attach_link__doi !== 'undefined') {
          if (unformattedData.related_data.attach_link__doi.length === 0) uploadableData.related_data.attach_link__doi = null
        }
        if (unformattedData.related_data.attach_link__locality !== null && typeof unformattedData.related_data.attach_link__locality !== 'undefined') {
          if (unformattedData.related_data.attach_link__locality.length === 0) uploadableData.related_data.attach_link__locality = null
        }
        if (unformattedData.related_data.attach_link__drillcore !== null && typeof unformattedData.related_data.attach_link__drillcore !== 'undefined') {
          if (unformattedData.related_data.attach_link__drillcore.length === 0) uploadableData.related_data.attach_link__drillcore= null
        }
        if (unformattedData.related_data.attach_link__drillcore_box !== null && typeof unformattedData.related_data.attach_link__drillcore_box !== 'undefined') {
          if (unformattedData.related_data.attach_link__drillcore_box.length === 0) uploadableData.related_data.attach_link__drillcore_box = null
        }
        if (unformattedData.related_data.attach_link__preparation !== null && typeof unformattedData.related_data.attach_link__preparation !== 'undefined') {
          if (unformattedData.related_data.attach_link__preparation.length === 0) uploadableData.related_data.attach_link__preparation = null
        }
        if (unformattedData.related_data.attach_link__reference !== null && typeof unformattedData.related_data.attach_link__reference !== 'undefined') {
          if (unformattedData.related_data.attach_link__reference.length === 0) uploadableData.related_data.attach_link__reference = null
        }
        if (unformattedData.related_data.attach_link__storage !== null && typeof unformattedData.related_data.attach_link__storage !== 'undefined') {
          if (unformattedData.related_data.attach_link__storage.length === 0) uploadableData.related_data.attach_link__storage = null
        }
        if (unformattedData.attach_link__project !== null && typeof unformattedData.attach_link__project !== 'undefined') {
          if (unformattedData.attach_link__project.length === 0) uploadableData.attach_link__project = null
        }
        if (unformattedData.attach_link__site !== null && typeof unformattedData.attach_link__site !== 'undefined') {
          if (unformattedData.attach_link__site.length === 0) uploadableData.attach_link__site = null
        }

        /**************************
         ***  RELATED DATA END  ***
         **************************/



        console.log('This object is sent in string format:')
        console.log(uploadableData)

        return JSON.stringify(uploadableData)
      },

      /******************
       ***  SEND END  ***
       ******************/



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
              if (response.body.count === 0) {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = []
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = []
                else this.autocomplete.authors = [];
              }
              else {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = response.body.results
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = response.body.results
                else this.autocomplete.authors = response.body.results;
              }
            }
            this.searchingAuthors = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingAuthors = false;
          })
        }
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
          }
          this.searchingLicences = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingLicences = false;
        })
      },

      // maybeGetDevices() {
      //   return this.autocomplete.devices.length <= 0 ? this.getDevices() : null
      // },

      // getDevices() {
      //   this.searchingDevices = true;
      //
      //   this.$http.get(this.apiUrl + 'device/', {params: {distinct: 'true', format: 'json'}}).then(response => {
      //     console.log(response)
      //     if (response.status === 200) {
      //       if (response.body.count > 0) {
      //
      //         // Skips null and empty values
      //         const devices = response.body.results
      //         for (let device in devices) {
      //           if (devices[device].name !== null && devices[device].name) {
      //             this.autocomplete.devices.push(devices[device])
      //           }
      //         }
      //
      //         // this.autocomplete.devices = response.body.results;
      //       }
      //     }
      //     this.searchingDevices = false;
      //   }, errResponse => {
      //     console.log('ERROR: ' + JSON.stringify(errResponse))
      //     this.searchingDevices = false;
      //   })
      // },

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
            }
          }
          this.searchingImageTypes = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingImageTypes = false;
        })
      },

      getImagesets(query) {
        if (query.length > 0) {
          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'imageset/'
          if (this.edit.author !== null) {
            url += '?or_search=user_added:' + this.edit.author.forename + ';author__id:' + this.edit.author.id + '&imageset_number__icontains=' + query + '&format=json'
          } else {
            url += '?imageset_number__icontains=' + query + '&format=json'
          }

          this.searchingImagesets = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.imagesets = response.body.results;
              else this.autocomplete.imagesets = []
            }
            this.searchingImagesets = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingImagesets = false;
          })
        }
      },

      getRelatedData(query, id) {
        if (query.length > 0) {

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
              search += 'multi_search=value:' + query + ';fields:id,location,contents;lookuptype:icontains'
              fields += ',location,contents'
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
              search += 'id__icontains=' + query
              fields += ''
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
       *** BUILD OBJECTS START ***
       ***************************/

      buildAuthor() {
        if (this.data.author_id !== null) {
          return {
            agent: this.data.author__agent,
            forename: this.data.author__forename,
            id: this.data.author_id,
            surename: this.data.author__surename
          }
        } else {
          return null
        }
      },

      buildType() {
        if (this.data.type__id !== null) {
          return {
            id: this.data.type__id,
            value: this.data.type__value,
            value_en: this.data.type__value_en,
          }
        } else {
          return null
        }
      },

      buildTags() {
        if (this.data.tags !== null) {
          let tagArray = this.data.tags.split('|')
          let tags = []

          for (let i = 0; i < tagArray.length; i++) {
            let tag = {}
            tag.name = tagArray[i]
            tags.push(tag)
          }
          return tags
        } else {
          return null
        }
      },

      buildLicence() {
        if (this.data.licence__id !== null) {
          return {
            id: this.data.licence__id,
            licence: this.data.licence__licence
          }
        } else {
          return null
        }
      },

      buildCopyrightAgent() {
        if (this.data.copyright_agent__id !== null) {
          return {
            agent: this.data.copyright_agent__agent,
            forename: this.data.copyright_agent__forename,
            id: this.data.copyright_agent__id,
            surename: this.data.copyright_agent__surename
          }
        } else {
          return null
        }
      },

      // buildDevice() {
      //   if (this.data.device__id !== null) {
      //     return {
      //       id: this.data.device__id,
      //       name: this.data.device__name
      //     }
      //   } else {
      //     return null
      //   }
      // },

      buildAgentDigitised() {
        if (this.data.agent_digitised__id !== null) {
          return {
            agent: this.data.agent_digitised__agent,
            forename: this.data.agent_digitised__forename,
            id: this.data.agent_digitised__id,
            surename: this.data.agent_digitised__surename
          }
        } else {
          return null
        }
      },

      // buildDeviceDigitised() {
      //   if (this.data.device_digitised__id !== null) {
      //     return {
      //       id: this.data.device_digitised__id,
      //       name: this.data.device_digitised__name
      //     }
      //   } else {
      //     return null
      //   }
      // },

      buildImageType() {
        if (this.data.image_type__id !== null) {
          return {
            id: this.data.image_type__id,
            value: this.data.image_type__value,
            value_en: this.data.image_type__value_en,
          }
        } else {
          return null
        }
      },

      buildRelatedData(relatedData, field) {
        let collections = []
        let specimens = []
        let samples = []
        let sample_series_s = []
        let analyzes = []
        let datasets = []
        let dois = []
        let localities = []
        let drillcores = []
        let drillcore_boxes = []
        let preparations = []
        let references = []
        let storages = []
        let projects = []
        let sites = []

        for (const data in relatedData) {
          let collection = {}
          let specimen = {}
          let sample = {}
          let sample_series = {}
          let analysis = {}
          let dataset = {}
          let doi = {}
          let locality = {}
          let drillcore = {}
          let drillcore_box =  {}
          let preparation = {}
          let reference = {}
          let storage = {}
          let project = {}
          let site = {}

          if (field === 'collection') {
            if (relatedData[data].collection !== null) {
              collection.id = relatedData[data].collection
              collection.name = relatedData[data].collection__name
              collection.name_en = relatedData[data].collection__name_en
              collections.push(collection)
            }
          }

          if (field === 'specimen') {
            if (relatedData[data].specimen !== null) {
              specimen.id = relatedData[data].specimen
              specimen.specimen_id = relatedData[data].specimen__specimen_id
              specimen.coll__number = relatedData[data].specimen__coll__number
              specimens.push(specimen)
            }
          }

          if (field === 'sample') {
            if (relatedData[data].sample !== null) {
              sample.id = relatedData[data].sample
              sample.number = relatedData[data].sample__number
              samples.push(sample)
            }
          }

          if (field === 'sample_series') {
            if (relatedData[data].sample_series !== null) {
              sample_series.id = relatedData[data].sample_series
              sample_series.name = relatedData[data].sample_series__name
              sample_series_s.push(sample_series)
            }
          }

          if (field === 'analysis') {
            if (relatedData[data].analysis !== null) {
              analysis.id = relatedData[data].analysis
              analysis.sample__id = relatedData[data].analysis__sample__id
              analysis.sample__number = relatedData[data].analysis__sample__number
              analyzes.push(analysis)
            }
          }

          if (field === 'dataset') {
            if (relatedData[data].dataset !== null) {
              dataset.id = relatedData[data].dataset
              dataset.name = relatedData[data].dataset__name
              dataset.name_en = relatedData[data].dataset__name_en
              datasets.push(dataset)
            }
          }

          if (field === 'doi') {
            if (relatedData[data].doi !== null) {
              doi.id = relatedData[data].doi
              doi.identifier = relatedData[data].doi__identifier
              dois.push(doi)
            }
          }

          if (field === 'locality') {
            if (relatedData[data].locality !== null) {
              locality.id = relatedData[data].locality
              locality.locality = relatedData[data].locality__locality
              locality.locality_en = relatedData[data].locality__locality_en
              localities.push(locality)
            }
          }

          if (field === 'drillcore') {
            if (relatedData[data].drillcore !== null) {
              drillcore.id = relatedData[data].drillcore
              drillcore.drillcore = relatedData[data].drillcore__drillcore
              drillcore.drillcore_en = relatedData[data].drillcore__drillcore_en
              drillcores.push(drillcore)
            }
          }

          if (field === 'drillcore_box') {
            if (relatedData[data].drillcore_box !== null) {
              drillcore_box.id = relatedData[data].drillcore_box
              drillcore_box.drillcore__drillcore = relatedData[data].drillcore_box__drillcore__drillcore
              drillcore_box.drillcore__drillcore_en = relatedData[data].drillcore_box__drillcore__drillcore_en
              drillcore_box.number = relatedData[data].drillcore_box__number
              drillcore_boxes.push(drillcore_box)
            }
          }

          if (field === 'preparation') {
            if (relatedData[data].preparation !== null) {
              preparation.id = relatedData[data].preparation
              preparation.preparation_number = relatedData[data].preparation__preparation_number
              preparations.push(preparation)
            }
          }

          if (field === 'reference') {
            if (relatedData[data].reference !== null) {
              reference.id = relatedData[data].reference
              reference.reference = relatedData[data].reference__reference
              references.push(reference)
            }
          }

          if (field === 'storage') {
            if (relatedData[data].storage !== null) {
              storage.id = relatedData[data].storage
              storage.contents = relatedData[data].storage__contents
              storage.location = relatedData[data].storage__location
              storages.push(storage)
            }
          }

          if (field === 'project') {
            if (relatedData[data].project !== null) {
              project.id = relatedData[data].project
              project.name = relatedData[data].project__name
              project.name_en = relatedData[data].project__name_en
              projects.push(project)
            }
          }

          if (field === 'site') {
            if (relatedData[data].site !== null) {
              site.id = relatedData[data].site
              site.name = relatedData[data].site__name
              site.name_en = relatedData[data].site__name_en
              sites.push(site)
            }
          }

        }

        if (field === 'collection' && collections.length > 0) return collections
        if (field === 'specimen' && specimens.length > 0) return specimens
        if (field === 'sample' && samples.length > 0) return samples
        if (field === 'sample_series' && sample_series_s.length > 0) return sample_series_s
        if (field === 'analysis' && analyzes.length > 0) return analyzes
        if (field === 'dataset' && datasets.length > 0) return datasets
        if (field === 'doi' && dois.length > 0) return dois
        if (field === 'locality' && localities.length > 0) return localities
        if (field === 'drillcore' && drillcores.length > 0) return drillcores
        if (field === 'drillcore_box' && drillcore_boxes.length > 0) return drillcore_boxes
        if (field === 'preparation' && preparations.length > 0) return preparations
        if (field === 'reference' && references.length > 0) return references
        if (field === 'storage' && storages.length > 0) return storages
        if (field === 'project' && projects.length > 0) return projects
        if (field === 'site' && sites.length > 0) return sites

        return null
      },


      /***************************
       ***  BUILD OBJECTS END  ***
       ***************************/



      /*********************
       *** HELPERS START ***
       *********************/

      addKeyword(newKeyword) {
        // let lowerCaseKeyword = newKeyword.toLowerCase()
        // const keyword = {name: lowerCaseKeyword}
        const keyword = {name: newKeyword}

        this.myKeywords.push(keyword)
        if (this.edit.tags === null) this.edit.tags = []
        this.edit.tags.push(keyword)
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
            else return `${option.id} - (${option.location} - ${option.contents})`
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

      updateLocation(location) {
        this.edit.image_latitude = location.lat.toFixed(6)
        this.edit.image_longitude = location.lng.toFixed(6)
      },

      isValidToChangeTo(changeTo) {
        if (changeTo === 'specimenImage') {
          // Todo
          return false
        } else if(changeTo === 'photoArchive') {
          return this.data.attachment_format__value.includes('image') || this.specimen_image_attachment === 2
        } else if (changeTo === 'otherFile') {
          return true
        } else if (changeTo === 'digitisedReference') {
          // Todo
          return false
        }
      },

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        if (typeof (params.height) === 'undefined') {
          params.height = 750;
        }
        window.open(location.origin + '/' + params.object + '/add', '', 'width=' + params.width + ',height=' + params.height)
      },

      isValidForDoiUpload() {
        if (this.edit.specimen_image_attachment === 2) return this.authorState && this.descriptionState && this.descriptionEnState && this.imagesetState;
        else return this.authorState && this.descriptionState && this.descriptionEnState;
      }

      /*********************
       *** HELPERS END ***
       *********************/



    }
  }
</script>

<style scoped>
  .delete-relation {
    transition: background-color 500ms ease-in-out;
    vertical-align: middle;
  }

  .delete-relation:hover {
    cursor: pointer;
    background-color: rgba(220,53,69, 0.7);
  }
</style>
