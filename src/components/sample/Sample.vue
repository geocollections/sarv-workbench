<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <div class="row">
      <div class="col-sm-2">
        <label :for="`number`">{{ $t('sample.number') }}:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="number" v-model="sample.number" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`number_additional`">{{ $t('sample.number_additional') }}:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="number_additional" v-model="sample.number_additional" type="text"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`number_field`">{{ $t('sample.number_field') }}:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="number_field" v-model="sample.number_field" type="text"></b-form-input>
      </div>

    </div>

    <!-- FIELD NUMBER AND SERIES  -->
    <div class="row">

    <!-- SAMPLE PURPOSE AND TYPE  -->
      <div class="col-sm-2">
        <label :for="`sample_purpose`">{{ $t('sample.sample_purpose') }}:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <vue-multiselect v-model="sample.sample_purpose" v-if="isDefinedAndNotEmpty(autocomplete.purpose)"
                         id="type"
                         :options="autocomplete.purpose"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-1">
        <label :for="`sample_type`">{{ $t('sample.sample_type') }}:</label>
      </div>

      <div class="col-sm-3 mb-2">
        <b-form-input id="sample_type" v-model="sample.sample_type" type="text"></b-form-input>
      </div>

      <div class="col-sm-1">
        <label :for="`series`">{{ $t('sample.series') }}:</label>
      </div>

      <div class="col-sm-3 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.series" deselect-label="Can't remove this value"
                         label="name" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.series"
                         :options="autocomplete.series" :searchable="true" @search-change="autcompleteSampleSeriesSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- LOCALITY AND LOCALITY FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('sample.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.locality" deselect-label="Can't remove this value"
                         :label="localityLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.locality"
                         :options="autocomplete.locality" :searchable="true" @search-change="autcompleteLocalitySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.locality :option.locality_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
      <div class="col-sm-2">
        <label :for="`depth`">{{ $t('sample.depth') }}:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="depth" v-model="sample.depth" type="number"></b-form-input>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="depth_interval" v-model="sample.depth_interval" type="number"></b-form-input>
      </div>
    </div>

    <!-- DEPTH AND DEPTH INTERVAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`locality_free`">{{ $t('sample.locality_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality_free" v-model="sample.locality_free" type="text"></b-form-input>
      </div>

    <!-- LATITUDE AND LONGITUDE -->
      <div class="col-sm-2">
        <label :for="`latitude`">Lat/Long:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="latitude" v-model="sample.latitude1" type="number"></b-form-input>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="longitude" v-model="sample.longitude1" type="number"></b-form-input>
      </div>
    </div>

    <!-- STRATIGRAPHY AND LITHOSTRATIGRAPHY -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy`">{{ $t('sample.stratigraphy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.stratigraphy" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.stratigraphy"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.stratigraphy" :searchable="true" @search-change="autcompleteStratigraphySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`lithostratigraphy`">{{ $t('sample.lithostratigraphy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.lithostratigraphy" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.lithostratigraphy"
                         :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.lithostratigraphy" :searchable="true" @search-change="autcompleteLithostratigraphySearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- STRATIGRAPHY FREE AND STRATIGRAPHY_BED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`stratigraphy_free`">{{ $t('sample.stratigraphy_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_free" v-model="sample.stratigraphy_free" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`stratigraphy_bed`">{{ $t('sample.stratigraphy_bed') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="stratigraphy_bed" v-model="sample.stratigraphy_bed" type="text"></b-form-input>
      </div>
    </div>

    <!-- AGENT COLLECTED AND AGENT COLLECTED FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_collected`">{{ $t('sample.agent_collected') }}:</label>
      </div>

      <div class="col-sm-3 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.agent_collected" deselect-label="Can't remove this value"
                         label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.agent"
                         :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>

      <div class="col-sm-3 mb-2">
        <b-form-input id="agent_collected_free" v-model="sample.agent_collected_free" type="text" placeholder="coll. txt"></b-form-input>
      </div>
      <div class="col-sm-1">
        <label :for="`owner`">{{ $t('sample.owner') }}:</label>
      </div>

      <div class="col-sm-3 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.owner" deselect-label="Can't remove this value"
                         label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.owner"
                         :options="autocomplete.agent" :searchable="true" @search-change="autcompleteOwnerSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>

    </div>
    <!-- DATE COLLECTED AND DATE COLLECTED FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_collected`">{{ $t('sample.date_collected') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_collected"
                    v-model="sample.date_collected"
                    use-utc="true "
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>


      <div class="col-sm-2">
        <label :for="`date_collected_free`">{{ $t('sample.date_collected_free') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_collected_free" v-model="sample.date_collected_free" type="text"></b-form-input>
      </div>
    </div>
    <!-- CLASSIFICATION ROCK AND ROCK -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`classification_rock`">{{ $t('sample.classification_rock') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">

        <vue-multiselect class="align-middle" v-model="sample.classification_rock" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.rock"
                         :label="rockLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.rock" :searchable="true" @search-change="autcompleteRockSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>
            {{ $i18n.locale=== 'ee' ? option.name :option.name_en }}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`rock`">{{ $t('sample.rock') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="rock" v-model="sample.rock" type="text"></b-form-input>
      </div>
    </div>
    <!-- ROCK EN AND FOSSILS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`rock_en`">{{ $t('sample.rock_en') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="rock_en" v-model="sample.rock_en" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`fossils`">{{ $t('sample.fossils') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="fossils" v-model="sample.fossils" type="text"></b-form-input>
      </div>
    </div>
    <!-- STORAGE-->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`mass`">{{ $t('sample.mass') }}:</label>
      </div>

      <div class="col-sm-2 mb-2">
        <b-form-input id="mass" v-model="sample.mass" type="number"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`storage`">{{ $t('sample.storage') }}:</label>
      </div>

      <div class="col-sm-3 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.storage" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.storage" id="storage"
                         label="location" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.storage" :searchable="true" @search-change="autcompleteStorageSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
      <div class="col-sm-3 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.storage_additional" deselect-label="Can't remove this value"
                         :loading="autocomplete.loaders.additional_storage" id="storage_additional"
                         label="location" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :options="autocomplete.storage_additional" :searchable="true" @search-change="autcompleteAdditionalStorageSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- SAMPLE PARENT AND SPECIMEN -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`parent_sample`">{{ $t('sample.parent_sample') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.parent_sample" deselect-label="Can't remove this value"
                         label="number" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.sample"
                         :options="autocomplete.sample" :searchable="true" @search-change="autcompleteSampleSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.number}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`parent_specimen`">{{ $t('sample.parent_specimen') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect class="align-middle" v-model="sample.parent_specimen" deselect-label="Can't remove this value"
                         label="specimen_id" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                         :loading="autocomplete.loaders.specimen"
                         :options="autocomplete.specimen" :searchable="true" @search-change="autcompleteSpecimenSearch"
                         :allow-empty="true"  :show-no-results="false" :max-height="600"
                         :open-direction="'bottom'">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.specimen_id}}</strong> </template>
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`remarks_location`">{{ $t('locality.remarks') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="remarks_location" v-model="sample.remarks" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- IS PRIVATE AND MASS-->
    <div class="row mb-3 mt-3">
      <div class="col">
        <!--<b-form-checkbox id="palaeontology" v-model="sample.palaeontology" :value="true" :unchecked-value="false">
          {{ $t('sample.palaeontology') }}
        </b-form-checkbox>

        <b-form-checkbox id="analysis" v-model="sample.analysis" :value="true" :unchecked-value="false">
          {{ $t('sample.analysis') }}
        </b-form-checkbox>-->

        <b-form-checkbox id="is_private" v-model="sample.is_private" :value="true" :unchecked-value="false">
          {{ $t('sample.is_private') }}
        </b-form-checkbox>
      </div>
    </div>
    <!-- SHOWING RELATED_DATA -->
    <div class="row">
      <div class="col mt-5 mb-5">
        <ul class="nav nav-tabs tab-links  mb-3" style="flex-wrap: nowrap !important">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('analysis')" class="nav-link"  :class="{ active: activeTab === 'analysis' }">{{ $t('sample.relatedTables.analysis') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('preparation')" class="nav-link"  :class="{ active: activeTab === 'preparation' }">{{ $t('sample.relatedTables.preparation') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('taxon_list')" class="nav-link"  :class="{ active: activeTab === 'taxon_list' }">{{ $t('sample.relatedTables.taxon_list') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('attachment_link')" class="nav-link"  :class="{ active: activeTab === 'attachment_link' }">{{ $t('sample.relatedTables.attachment_link') }}</a>
          </li>
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('sample_reference')" class="nav-link"  :class="{ active: activeTab === 'sample_reference' }">{{ $t('sample.relatedTables.sample_reference') }}</a>
          </li>
        </ul>
        <sample-analysis :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
        <sample-preparation :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"  :parentId="getParentId"/>
        <sample-taxon-list :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"  :parentId="getParentId"/>
        <sample-attachment :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
        <sample-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
        <div class="row mb-4 pt-1">
          <!--<div class="col">-->
            <!--<button class="btn float-left btn-sm btn-outline-success mr-2 mb-2 pl-4 pr-4"-->
                    <!--:disabled="sendingData" @click="addRelatedData(activeTab)">{{$t('add.newRelation')}}</button>-->
          <!--</div>-->
          <div class="col pagination-center" v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]" v-model="relatedData.page[activeTab]" :per-page="10">
            </b-pagination>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'sample')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'sample')">
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('sample')">
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
  import {
    fetchSample,
    fetchSamplePurpose,
    fetchLSampleAttachment,
    fetchSampleReference,
    fetchSampleAnalysis,
    fetchAnalysisMethod,
    fetchFossilGroup,
    fetchSamplePreparation,
    fetchTaxonList,
    fetchSampleRelatedAnalysis,
    fetchSampleRelatedPreparation
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import Datepicker from 'vue2-datepicker'
  import formManipulation  from './../mixins/formManipulation'
  import copyForm  from './../mixins/copyForm'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
  import SampleReference from "./relatedTables/SampleReference";
  import SampleAttachment from "./relatedTables/SampleAttachment";
  import SampleAnalysis from "./relatedTables/SampleAnalysis";
  import SamplePreparation from "./relatedTables/SamplePreparation";
  import SampleTaxonList from "./relatedTables/SampleTaxonList";

    export default {
      name: "Sample",
      components: {

        SampleTaxonList,
        SamplePreparation,
        SampleAnalysis,
        SampleAttachment,
        SampleReference,
        BFormInput,
        FontAwesomeIcon,
        Datepicker,
        VueMultiselect,
        Spinner,
      },
      mixins: [formManipulation,copyForm,autocompleteFieldManipulation],
      computed: {
        getParentId() { return this.sample.id}
      },
      data() {
        return {
          tabs:['analysis','preparation','taxon_list','attachment_link','sample_reference'],
          activeTab: 'analysis',
          relatedData: this.setDefaultRalatedData(),
          copyFields : ['id','number','number_additional','number_field','series','sample_purpose','sample_type',
            'parent_sample','parent_specimen','depth','depth_interval','latitude1','longitude1','stratigraphy','lithostratigraphy',
            'stratigraphy_free','stratigraphy_bed','agent_collected','agent_collected_free','date_collected','date_collected_free',
            'classification_rock','rock','rock_en','fossils','mass','storage','storage_additional','owner',
            'palaeontology','analysis','locality','locality_free','remarks','is_private'
          ],
          autocomplete: {
            loaders: { series:false, sample:false,specimen:false, locality:false, stratigraphy:false,
              lithostratigraphy:false, agent:false, rock:false, storage:false, additional_storage:false, owner:false,
              reference:false,  attachment:false, analysis_method: false,fossil_group:false, analysis:false, taxon:false,
              preparation:false
            },
            series: [],purpose: [],sample:[],specimen:[],locality:[],stratigraphy:[],lithostratigraphy:[],agent:[],
            rock:[],storage:[],storage_additional:[],owner:[], reference: [], attachment: [], analysis_method: [],
            fossil_group:[], analysis: [],taxon:[],preparation:[],sampleAnalysis:[],samplePreparation:[]
          },
          requiredFields: ['number'],
          sample: {}
        }
      },
      created() {
        fetchAnalysisMethod().then(response => {
          this.autocomplete.analysisMethod = this.handleResponse(response);
        });

        fetchSamplePurpose().then(response => {
          this.autocomplete.purpose = this.handleResponse(response);
        });

        fetchFossilGroup().then(response => {
          this.autocomplete.fossil_group = this.handleResponse(response);
        });

        if(this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchSample(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if(handledResponse.length > 0) {
              this.sample = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.sample)
              this.removeUnnecessaryFields(this.sample, this.copyFields);
              this.$emit('data-loaded',this.sample)
              this.$emit('set-object','sample')
              this.sendingData = false;
            } else {
              this.sendingData = false;
            }
          });
        }
        this.$on('tab-changed',this.setTab);

        this.$on('related-data-modified',this.editRelatedData);
        this.$on('related-data-added',this.addRelatedData);
        this.$on('edit-row',this.editRow);
        this.$on('allow-remove-row',this.allowRemove);

        this.$emit('related-data-info',this.tabs);
        // FETCH FIRST TAB RELATED DATA
        this.tabs.forEach(entity => {
          this.loadRelatedData(entity);
        });
        this.setActiveTab('analysis')

      },

      methods: {
        setTab(type){ this.activeTab  = type },

        setDefaultRalatedData(){
          return {
            sample_reference:[], attachment_link: [], analysis: [], preparation:[], taxon_list:[],
            copyFields: {
              sample_reference:['reference','remarks'],
              attachment_link: ['attachment'],
              analysis: ['analysis_method','method_details','mass','date','date_end','date_free','agent','remarks','location','is_private'],
              preparation:['taxon','storage','remarks','analysis','id_private'],
              taxon_list:['taxon','name','frequency','agent_identified','date_identified','extra','preparation','is_private','remarks']
            },
            insert: {sample_reference:{},attachment_link:{},analysis:{},preparation:{}, taxon_list:{}},
            page : {sample_reference:1,attachment_link:1,analysis:1,preparation:1, taxon_list:1},
            count: {sample_reference:0,attachment_link:0,analysis:0,preparation:0, taxon_list:0}
          }
        },

        formatDataForUpload(objectToUpload) {
          let uploadableObject = cloneDeep(objectToUpload)

          if (objectToUpload.latitude1 === '')
            uploadableObject.latitude1 = this.isDefinedAndNotNull(objectToUpload.latitude1) ? objectToUpload.latitude1.toFixed(6) : null
          if (objectToUpload.longitude1 === '')
            uploadableObject.longitude1 = this.isDefinedAndNotNull(objectToUpload.longitude1) ? objectToUpload.longitude1.toFixed(6) : null
          if (this.isDefinedAndNotNull(objectToUpload.palaeontology)) uploadableObject.palaeontology = objectToUpload.palaeontology === true ? '1' : '0';
          if (this.isDefinedAndNotNull(objectToUpload.analysis)) uploadableObject.analysis = objectToUpload.analysis === true ? '1' : '0';
          if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';

          if (this.isDefinedAndNotNull(objectToUpload.date_collected)) uploadableObject.date_collected = this.formatDateForUpload(objectToUpload.date_collected);

          //autocomplete fields

          if (this.isDefinedAndNotNull(objectToUpload.series)) uploadableObject.series = objectToUpload.series.id
          if (this.isDefinedAndNotNull(objectToUpload.sample_purpose)) uploadableObject.sample_purpose = objectToUpload.sample_purpose.id
          if (this.isDefinedAndNotNull(objectToUpload.parent_sample)) uploadableObject.parent_sample = objectToUpload.parent_sample.id
          if (this.isDefinedAndNotNull(objectToUpload.parent_specimen)) uploadableObject.parent_specimen = objectToUpload.parent_specimen.id
          if (this.isDefinedAndNotNull(objectToUpload.locality)) uploadableObject.locality = objectToUpload.locality.id
          if (this.isDefinedAndNotNull(objectToUpload.stratigraphy)) uploadableObject.stratigraphy = objectToUpload.stratigraphy.id
          if (this.isDefinedAndNotNull(objectToUpload.lithostratigraphy)) uploadableObject.lithostratigraphy = objectToUpload.lithostratigraphy.id
          if (this.isDefinedAndNotNull(objectToUpload.agent_collected)) uploadableObject.agent_collected = objectToUpload.agent_collected.id
          if (this.isDefinedAndNotNull(objectToUpload.classification_rock)) uploadableObject.classification_rock = objectToUpload.classification_rock.id
          if (this.isDefinedAndNotNull(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id
          if (this.isDefinedAndNotNull(objectToUpload.storage)) uploadableObject.storage = objectToUpload.storage.id
          if (this.isDefinedAndNotNull(objectToUpload.storage_additional)) uploadableObject.storage_additional = objectToUpload.storage_additional.id
          // console.log('This object is sent in string format:\n'+JSON.stringify(uploadableObject))
          return JSON.stringify(uploadableObject)
        },
        fillAutocompleteFields(obj){
          this.sample.series = {name:obj.series__name,id:obj.series_id}
          this.sample.sample_purpose = {value:obj.sample_purpose__value,value_en:obj.sample_purpose__value_en,id:obj.sample_purpose__id}
          this.sample.parent_sample = {number:obj.parent_sample__number,id:obj.parent_sample}
          this.sample.parent_specimen = {specimen_id:obj.parent_specimen__specimen_id,id:obj.parent_specimen}
          this.sample.locality = {locality:obj.locality__locality,locality_en:obj.locality__locality_en,id:obj.locality__id}
          this.sample.stratigraphy = {stratigraphy:obj.stratigraphy__stratigraphy,stratigraphy_en:obj.stratigraphy__stratigraphy_en,id:obj.stratigraphy__id}
          this.sample.lithostratigraphy = {stratigraphy:obj.lithostratigraphy__stratigraphy,stratigraphy_en:obj.lithostratigraphy__stratigraphy_en,id:obj.lithostratigraphy_id}
          this.sample.agent_collected = {agent:obj.agent_collected__agent,id:obj.agent_collected__id}
          this.sample.classification_rock = {name:obj.classification_rock__name,name_en:obj.classification_rock__name_en,id:obj.classification_rock__id}
          this.sample.owner = {agent:obj.owner__agent,id:obj.owner__id}
          this.sample.storage = {location:obj.storage__location,id:obj.storage}
          this.sample.storage_additional = {location:obj.storage_additional__location,id:obj.storage_additional}
        },

        fillRelatedDataAutocompleteFields(obj){
          obj.analysis_method = {analysis_method:obj.analysis_method__analysis_method, method_en:obj.analysis_method__method_en,id:obj.analysis_method}
          obj.agent = {agent:obj.agent__agent,id:obj.agent}
          obj.fossil_group = {taxon:obj.taxon__taxon,id:obj.taxon}
          obj.storage = {location:obj.storage__location,id:obj.storage}
          obj.analysis = {id:obj.analysis}
          obj.taxon = {taxon:obj.taxon__taxon, id:obj.taxon}
          obj.agent_identified = {agent:obj.agent_identified__agent, id:obj.agent_identified}
          obj.preparation = { id:obj.preparation}

          obj.reference = { reference:obj.reference__reference, id:obj.reference}
          return obj
        },

        loadRelatedData(object){
          let query;

          if(object === 'analysis') {
            query = fetchSampleAnalysis(this.$route.params.id,this.relatedData.page.analysis)
          } else if(object === 'preparation') {
            query = fetchSamplePreparation(this.$route.params.id,this.relatedData.page.preparation)
          } else if(object === 'taxon_list') {
            query = fetchTaxonList(this.$route.params.id,this.relatedData.page.taxon_list)
          } else if(object === 'sample_reference') {
            query = fetchSampleReference(this.$route.params.id,this.relatedData.page.sample_reference)
          } else if(object === 'attachment_link') {
            query = fetchLSampleAttachment(this.$route.params.id,this.relatedData.page.attachment_link)
          }
          return new Promise(resolve => {
            query.then(response => {
              this.relatedData[object] = this.handleResponse(response);
              this.relatedData.count[object] = response.body.count;
              resolve(true)
            });
          });
        },

        //check required fields for related data
        checkRequiredFields(type){
          // if(type === 'sample_attachment') return this.relatedData.insert[type].attachment === undefined;
          // if(type === 'sample_reference') return this.relatedData.insert[type].reference === undefined;
          // if(type === 'analysis') return this.relatedData.insert[type].reference === undefined;
          // if(type === 'preparation') return this.relatedData.insert[type].reference === undefined;
          // if(type === 'taxon_list') return this.relatedData.insert[type].reference === undefined;
        },

        formatRelatedData(objectToUpload, idOfCopy = false)  {
          let uploadableObject = cloneDeep(objectToUpload);

          if(idOfCopy === false) uploadableObject.sample = this.sample.id;

          if (this.isDefinedAndNotNull(uploadableObject.attachment)) uploadableObject.attachment = uploadableObject.attachment.id ? uploadableObject.attachment.id : uploadableObject.attachment;
          if (this.isDefinedAndNotNull(uploadableObject.reference)) uploadableObject.reference = uploadableObject.reference.id ? uploadableObject.reference.id : uploadableObject.reference;
          if (this.isDefinedAndNotNull(uploadableObject.analysis_method)) uploadableObject.analysis_method = uploadableObject.analysis_method.id;
          if (this.isDefinedAndNotNull(uploadableObject.agent)) uploadableObject.agent = uploadableObject.agent.id;
          if (this.isDefinedAndNotNull(uploadableObject.agent_identified)) uploadableObject.agent_identified = uploadableObject.agent_identified.id;
          if (this.isDefinedAndNotNull(uploadableObject.date)) uploadableObject.date = this.formatDateForUpload(uploadableObject.date)
          if (this.isDefinedAndNotNull(uploadableObject.date_end)) uploadableObject.date_end = this.formatDateForUpload(uploadableObject.date_end)
          if (this.isDefinedAndNotNull(uploadableObject.date_identified)) uploadableObject.date_identified = this.formatDateForUpload(uploadableObject.date_identified)
          if (this.isDefinedAndNotNull(uploadableObject.taxon)) uploadableObject.taxon = uploadableObject.taxon.id;
          if (this.isDefinedAndNotNull(uploadableObject.storage)) uploadableObject.storage = uploadableObject.storage.id;
          if (this.isDefinedAndNotNull(uploadableObject.analysis)) uploadableObject.analysis = uploadableObject.analysis.id;
          if (this.isDefinedAndNotNull(uploadableObject.preparation)) uploadableObject.preparation = uploadableObject.preparation.id;



          return JSON.stringify(uploadableObject)
        },
        waitUntilAllCopiesSaved(){
          this.$root.$emit('copied-data-saved','PROBLEM')
        },

        saveAsNew(data) {
          let numberOfSaves = 0;

          for (let i = 0; i < parseInt(data.numberOfCopies); i++ ){
            console.log('saving copy #' +(i+1));
            numberOfSaves += this.add(true, 'sample', true, data.relatedData) === true ? 1 : 0;
            //stop loading after last data saved
            if(i === data.numberOfCopies-1 && numberOfSaves === data.numberOfCopies) {
              this.$root.$emit('copied-data-saved','SAVED')
            } else if(i === data.numberOfCopies-1 && numberOfSaves !== data.numberOfCopies) {
              setTimeout(this.waitUntilAllCopiesSaved, 500)
            }
          }
        }
      },


    }
</script>

<style scoped>

</style>
