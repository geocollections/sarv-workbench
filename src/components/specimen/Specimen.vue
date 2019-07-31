<template>
  <div class="specimen">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border p-2 mb-2" :style="!validate('specimen') ? 'border-color: #dc3545!important;' : ''" id="block-requiredFields">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('specimen') }"
              @click="block.requiredFields = !block.requiredFields">
        {{ $t('specimen.requiredFields') }}
        <font-awesome-icon v-if="validate('specimen')" color="#28a745" icon="check"/>
        <font-awesome-icon v-if="!validate('specimen')" color="#dc3545" icon="exclamation-triangle"/>
      </legend>

      <transition name="fade">
        <div v-if="block.requiredFields">

          <!-- FOSSIL -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`fossil`">{{ $t('specimen.fossil') }}:</label>
              <vue-multiselect v-model="specimen.fossil"
                               id="fossil"
                               :options="autocomplete.specimen_kind"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :class="isDefinedAndNotNull(specimen.fossil) ? 'valid' : 'invalid'"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" id="block-info">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('specimen.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-show="block.info">

          <!-- SPECIMEN_ID, COLL, SPECIMEN_NR and NUMBER_FIELD -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`specimen_id`">{{ $t('specimen.specimen_id') }}:</label>
              <b-form-input id="specimen_id" v-model="specimen.specimen_id" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`coll`">{{ $t('specimen.coll') }}:</label>
              <vue-multiselect id="copyright_agent"
                               v-model="specimen.coll"
                               label="number"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.coll"
                               :options="autocomplete.coll"
                               @search-change="autocompleteCollSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`specimen_nr`">{{ $t('specimen.specimen_nr') }}:</label>
              <b-form-input id="specimen_nr" v-model="specimen.specimen_nr" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`number_field`">{{ $t('specimen.number_field') }}:</label>
              <b-form-input id="number_field" v-model="specimen.number_field" type="text"></b-form-input>
            </div>
          </div>

          <!-- TYPE, PART, CLASSIFICATION and PARENT -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`type`">{{ $t('specimen.type') }}:</label>
              <vue-multiselect v-model="specimen.type"
                               id="type"
                               :options="autocomplete.specimen_type"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`part`">{{ $t('specimen.part') }}:</label>
              <b-form-input id="part" v-model="specimen.part" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`classification`">{{ $t('specimen.classification') }}:</label>
              <vue-multiselect id="classification"
                               v-model="specimen.classification"
                               :label="classLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.classification"
                               :options="autocomplete.classification"
                               @search-change="autocompleteClassificationSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[classLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`parent`">{{ $t('specimen.related_specimen') }}:</label>
              <vue-multiselect id="parent"
                               v-model="specimen.parent"
                               label="specimen_id"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.specimen"
                               :options="autocomplete.specimen"
                               @search-change="autocompleteSpecimenSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.specimen_id }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- LOCALITY, LOCALITY_FREE, REMARKS_COLLECTING and LOCALITY_IS_PRIVATE -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`locality`">{{ $t('specimen.locality') }}:</label>
              <vue-multiselect v-model="specimen.locality"
                               id="locality"
                               track-by="id"
                               :label="localityLabel"
                               :options="autocomplete.locality"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               @search-change="autocompleteLocalitySearch2"
                               :loading="autocomplete.loaders.locality"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[localityLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`locality_free`">{{ $t('specimen.locality_free') }}:</label>
              <b-form-input id="locality_free" v-model="specimen.locality_free" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`remarks_collecting`">{{ $t('specimen.remarks_collecting') }}:</label>
              <b-form-input id="remarks_collecting" v-model="specimen.remarks_collecting" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`locality_is_private`">{{ $t('specimen.locality_is_private') }}:</label>
              <vs-checkbox class="justify-content-start" id="locality_is_private" v-model="specimen.locality_is_private" icon="fa-eye-slash" icon-pack="fas">
                {{ specimen.locality_is_private ? $t('specimen.is_private_text') : $t('specimen.is_public_text') }}
              </vs-checkbox>
            </div>
          </div>

          <!-- SAMPLE, SAMPLE_NUMBER, DEPTH and DEPTH_INTERVAL -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`sample`">{{ $t('specimen.sample') }}:</label>
              <vue-multiselect id="sample"
                               v-model="specimen.sample"
                               label="number"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.sample"
                               :options="autocomplete.sample"
                               @search-change="autocompleteSampleSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`sample_number`">{{ $t('specimen.sample_number') }}:</label>
              <b-form-input id="sample_number" v-model="specimen.sample_number" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`depth`">{{ $t('specimen.depth') }}:</label>
              <b-form-input id="depth" v-model="specimen.depth" type="number" step="0.01"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`depth_interval`">{{ $t('specimen.depth_interval') }}:</label>
              <b-form-input id="depth_interval" v-model="specimen.depth_interval" type="number" step="0.01"></b-form-input>
            </div>
          </div>

          <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY and STRATIGRAPHY_FREE -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`stratigraphy`">{{ $t('specimen.stratigraphy') }}:</label>
              <vue-multiselect v-model="specimen.stratigraphy"
                               id="stratigraphy"
                               :label="stratigraphyLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.stratigraphy"
                               :options="autocomplete.stratigraphy"
                               @search-change="autocompleteStratigraphySearch2"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`lithostratigraphy`">{{ $t('specimen.lithostratigraphy') }}:</label>
              <vue-multiselect v-model="specimen.lithostratigraphy"
                               id="lithostratigraphy"
                               :label="stratigraphyLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.lithostratigraphy"
                               :options="autocomplete.lithostratigraphy"
                               @search-change="autocompleteLithostratigraphySearch2"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`stratigraphy_free`">{{ $t('specimen.stratigraphy_free') }}:</label>
              <b-form-input id="stratigraphy_free" v-model="specimen.stratigraphy_free" type="text"></b-form-input>
            </div>

          </div>

          <!-- AGENT_COLLECTED, AGENT_COLLECTED_FREE, DATE_COLLECTED, DATE_COLLECTED_FREE -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`agent_collected`">{{ $t('specimen.agent_collected') }}:</label>
              <vue-multiselect id="agent"
                               v-model="specimen.agent_collected"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent_collected"
                               :options="autocomplete.agent_collected"
                               @search-change="autocompleteAgentCollectedSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`agent_collected_free`">{{ $t('specimen.agent_collected_free') }}:</label>
              <b-form-input id="agent_collected_free" v-model="specimen.agent_collected_free" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`date_collected`">{{ $t('specimen.date_collected') }}:</label>
              <datepicker id="date_start"
                          v-model="specimen.date_collected"
                          use-utc="true "
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-md-3">
              <label :for="`date_collected_free`">{{ $t('specimen.date_collected_free') }}:</label>
              <b-form-input id="date_collected_free" v-model="specimen.date_collected_free" type="text"></b-form-input>
            </div>
          </div>

          <!-- PRESENCE and STORAGE -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`presence`">{{ $t('specimen.presence') }}:</label>
              <vue-multiselect v-model="specimen.presence"
                               id="presence"
                               :options="autocomplete.specimen_presence"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label :for="`storage`">{{ $t('specimen.storage') }}:</label>
              <vue-multiselect v-model="specimen.storage"
                               id="storage"
                               label="location"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.storage"
                               :options="autocomplete.storage"
                               @search-change="autocompleteStorageSearch2"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- ACCESSION, DEACCESSION, STATUS and ORIGINAL_STATUS -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`accession`">{{ $t('specimen.accession') }}:</label>
              <vue-multiselect v-model="specimen.accession"
                               id="accession"
                               :options="autocomplete.accession"
                               track-by="id"
                               label="number"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`deaccession`">{{ $t('specimen.deaccession') }}:</label>
              <vue-multiselect v-model="specimen.deaccession"
                               id="deaccession"
                               :options="autocomplete.deaccession"
                               track-by="id"
                               label="number"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`status`">{{ $t('specimen.status') }}:</label>
              <vue-multiselect v-model="specimen.status"
                               id="status"
                               :options="autocomplete.specimen_status"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel]}}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`original_status`">{{ $t('specimen.original_status') }}:</label>
              <vue-multiselect v-model="specimen.original_status"
                               id="original_status"
                               :options="autocomplete.specimen_original_status"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2" id="block-description">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.description }" @click="block.description = !block.description">
        {{ $t('specimen.description') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <transition name="fade">
        <div v-show="block.description">

          <!-- REMARKS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t('specimen.remarks') }}:</label>
              <editor :data.sync="specimen.remarks" />
            </div>
          </div>

          <!-- REMARKS_INTERNAL -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks_internal`">{{ $t('specimen.remarks_internal') }}:</label>
              <editor :data.sync="specimen.remarks_internal" />
            </div>
          </div>

          <!-- TAGS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`tags`">{{ $t('specimen.tags') }}:</label>
              <b-form-input id="tags" v-model="specimen.tags" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- IS_PRIVATE -->
    <div class="row">
      <div class="col-sm-12">
        <label :for="`is_private`">{{ $t('specimen.is_private') }}:</label>
        <vs-checkbox class="justify-content-start" id="is_private" v-model="specimen.is_private" icon="fa-lock" icon-pack="fas">
          {{ specimen.is_private ? $t('specimen.is_private_text') : $t('specimen.is_public_text') }}
        </vs-checkbox>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import Editor from "../partial/editor/Editor";
  import Datepicker from 'vue2-datepicker'
  import cloneDeep from 'lodash/cloneDeep'
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteMixin from "../../mixins/autocompleteMixin";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {
    fetchAccession,
    fetchDeaccession,
    fetchListSpecimenKind,
    fetchListSpecimenOriginalStatus,
    fetchListSpecimenPresence,
    fetchListSpecimenStatus,
    fetchListSpecimenType,
    fetchSpecimen,
    fetchSpecimens
  } from "../../assets/js/api/apiCalls";
  import {mapState} from "vuex";

  export default {
    name: "Specimen",

    components: {
      Editor,
      Spinner,
      Datepicker
    },

    mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        console.log(this.searchHistory)
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'specimenSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_SPECIMENS',
          title: 'header.specimens',
          object: 'specimen',
          field: 'specimen_id',
          databaseId: this.databaseId,
          block: this.block
        });
      } else {
        // Adding specimen default values from local storage
        const specimenHistory = this.$localStorage.get('specimen', 'fallbackValue');
        if (specimenHistory !== 'fallbackValue' && Object.keys(specimenHistory).length !== 0 && specimenHistory.constructor === Object) {
          this.specimen = specimenHistory
        }
      }

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.setInitialData()
          this.reloadData()
        },
        deep: true
      },
      'relatedData.paginateBy': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
      'relatedData.page': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
    },

    computed: {
      ...mapState(["databaseId"])
    },

    methods: {
      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          tabs:[],
          searchHistory: 'specimenSearchHistory',
          activeTab: '',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'specimen_id', 'coll', 'specimen_nr', 'number_field', 'fossil', 'type', 'part', 'locality',
            'locality_free', 'depth', 'depth_interval', 'sample', 'sample_number', 'stratigraphy', 'lithostratigraphy',
            'agent_collected', 'agent_collected_free', 'date_collected', 'date_collected_free', 'agent_collected',
            'presence', 'storage', 'classification', 'locality_is_private', 'remarks_collecting', 'stratigraphy_free',
            'accession', 'deaccession', 'remarks', 'remarks_internal', 'is_private', 'tags', 'status',
            'original_status', 'parent'],
          autocomplete: {
            loaders: {
              coll: false,
              specimen_kind: false,
              specimen_original_status: false,
              specimen_presence: false,
              specimen_status: false,
              specimen_type: false,
              locality: false,
              sample: false,
              stratigraphy: false,
              lithostratigraphy: false,
              agent_collected: false,
              storage: false,
              classification: false,
              accession: false,
              deaccession: false,
              specimen: false,
            },
            coll: [],
            specimen_kind: [],
            specimen_original_status: [],
            specimen_presence: [],
            specimen_status: [],
            specimen_type: [],
            locality: [],
            sample: [],
            stratigraphy: [],
            lithostratigraphy: [],
            agent_collected: [],
            storage: [],
            classification: [],
            accession: [],
            deaccession: [],
            specimen: [],
          },
          requiredFields: ['fossil'],
          specimen: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          componentKey: 0,
          block: {requiredFields: true, info: true, description: true},
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        // fetching list autocompletes
        fetchListSpecimenKind().then(response => this.autocomplete.specimen_kind = this.handleResponse(response));
        fetchListSpecimenOriginalStatus().then(response => this.autocomplete.specimen_original_status = this.handleResponse(response));
        fetchListSpecimenPresence().then(response => this.autocomplete.specimen_presence = this.handleResponse(response));
        fetchListSpecimenStatus().then(response => this.autocomplete.specimen_status = this.handleResponse(response));
        fetchListSpecimenType().then(response => this.autocomplete.specimen_type = this.handleResponse(response));
        fetchAccession().then(response => this.autocomplete.accession = this.handleResponse(response));
        fetchDeaccession().then(response => this.autocomplete.deaccession = this.handleResponse(response));

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchSpecimen(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.specimen = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.specimen)

              this.removeUnnecessaryFields(this.specimen, this.copyFields);
              this.specimen.related_data = {};

              this.$emit('data-loaded', this.specimen)
              this.$emit('set-object', 'specimen')
              this.sendingData = false;
              this.getListRecords('specimen')
            } else {
              this.sendingData = false;
            }
          });

          // Fetching autocomplete fields for related data
          // fetchDoiAgentType().then(response => {
          //   this.autocomplete.doi_agent_type = this.handleResponse(response)
          // });
          // fetchDoiRelatedIdentifierType().then(response => {
          //   this.autocomplete.doi_related_identifier_type = this.handleResponse(response)
          // });
          // fetchDoiRelationType().then(response => {
          //   this.autocomplete.doi_relation_type = this.handleResponse(response)
          // });
          // fetchDoiDateType().then(response => {
          //   this.autocomplete.doi_date_type = this.handleResponse(response)
          // });

          // Load Related Data which is in tabs
          this.tabs.forEach(entity => {
            this.loadRelatedData(entity);
          });

          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.tabs);

          // this.setActiveTab('doi_agent')
        }
      },

      setDefaultRelatedData() {
        return {
          // doi_date: [],
          // new: {
          //   date_type: []
          // },
          // copyFields: {
          //   doi_date: ['date', 'date_type', 'remarks']
          // },
          // insert: {
          //   doi_date: {}
          // },
          // page: {
          //   doi_date: 1
          // },
          // paginateBy: {
          //   doi_date: 10
          // },
          // count: {
          //   doi_date: 0
          // }
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload);

        // Todo: Api doesn't save specimen_nr and throws error
        delete uploadableObject.specimen_nr
        if (!this.$route.meta.isEdit) this.$localStorage.set('specimen', objectToUpload)

        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === 1 ? '1' : '0';
        if (this.isDefinedAndNotNull(objectToUpload.date_collected)) uploadableObject.date_collected = this.formatDateForUpload(objectToUpload.date_collected);

        // Autocomplete fields
        if (this.isDefinedAndNotNull(objectToUpload.coll)) uploadableObject.coll = objectToUpload.coll.id;
        if (this.isDefinedAndNotNull(objectToUpload.fossil)) uploadableObject.fossil = objectToUpload.fossil.id;
        if (this.isDefinedAndNotNull(objectToUpload.type)) uploadableObject.type = objectToUpload.type.id;
        if (this.isDefinedAndNotNull(objectToUpload.locality)) uploadableObject.locality = objectToUpload.locality.id;
        if (this.isDefinedAndNotNull(objectToUpload.sample)) uploadableObject.sample = objectToUpload.sample.id;
        if (this.isDefinedAndNotNull(objectToUpload.stratigraphy)) uploadableObject.stratigraphy = objectToUpload.stratigraphy.id;
        if (this.isDefinedAndNotNull(objectToUpload.lithostratigraphy)) uploadableObject.lithostratigraphy = objectToUpload.lithostratigraphy.id;
        if (this.isDefinedAndNotNull(objectToUpload.presence)) uploadableObject.presence = objectToUpload.presence.id;
        if (this.isDefinedAndNotNull(objectToUpload.storage)) uploadableObject.storage = objectToUpload.storage.id;
        if (this.isDefinedAndNotNull(objectToUpload.classification)) uploadableObject.classification = objectToUpload.classification.id;
        if (this.isDefinedAndNotNull(objectToUpload.accession)) uploadableObject.accession = objectToUpload.accession.id;
        if (this.isDefinedAndNotNull(objectToUpload.deaccession)) uploadableObject.deaccession = objectToUpload.deaccession.id;
        if (this.isDefinedAndNotNull(objectToUpload.agent_collected)) uploadableObject.agent_collected = objectToUpload.agent_collected.id;
        if (this.isDefinedAndNotNull(objectToUpload.status)) uploadableObject.status = objectToUpload.status.id;
        if (this.isDefinedAndNotNull(objectToUpload.original_status)) uploadableObject.original_status = objectToUpload.original_status.id;
        if (this.isDefinedAndNotNull(objectToUpload.parent)) uploadableObject.parent = objectToUpload.parent.id;

        if (this.databaseId) uploadableObject.database = this.databaseId

        // Adding related data
        if (saveRelatedData) {
          uploadableObject.related_data = {}
        }

        console.log('This object is sent in string format:');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.specimen.coll = { id: obj.coll, number: obj.coll__number };
        this.specimen.fossil = { id: obj.fossil, value: obj.fossil__value, value_en: obj.fossil__value_en };
        this.specimen.type = { id: obj.type, value: obj.type__value, value_en: obj.type__value_en };
        this.specimen.locality = { id: obj.locality, locality: obj.locality__locality, locality_en: obj.locality__locality_en };
        this.specimen.sample = { id: obj.sample, number: obj.sample__number };
        this.specimen.stratigraphy = { id: obj.stratigraphy, stratigraphy: obj.stratigraphy__stratigraphy, stratigraphy_en: obj.stratigraphy__stratigraphy_en };
        this.specimen.lithostratigraphy = { id: obj.lithostratigraphy, stratigraphy: obj.lithostratigraphy__stratigraphy, stratigraphy_en: obj.lithostratigraphy__stratigraphy_en };
        this.specimen.agent_collected = { id: obj.agent_collected, agent: obj.agent_collected__agent };
        this.specimen.presence = { id: obj.presence, value: obj.presence__value, value_en: obj.presence__value_en };
        this.specimen.storage = { id: obj.storage, location: obj.storage__location };
        this.specimen.classification = { id: obj.classification, class_field: obj.classification__class_field, class_en: obj.classification__class_en };
        this.specimen.accession = { id: obj.accession, number: obj.accession__number };
        this.specimen.deaccession = { id: obj.deaccession, nnumber: obj.deaccession__number };
        this.specimen.status = { id: obj.status, value: obj.status__value, value_en: obj.status__value_en };
        this.specimen.original_status = { id: obj.original_status, value: obj.original_status__value, value_en: obj.original_status__value_en };
        this.specimen.parent = { id: obj.parent, specimen_id: obj.parent__specimen_id };


      },

      fillRelatedDataAutocompleteFields(obj, type) {
        if (obj === undefined) return;
        // console.log(obj)
        // console.log(type)

        // This goes for related data in tabs
        if (type === undefined) {
          console.log(obj)

          // if (this.isDefinedAndNotNull(obj.attachment)) obj.attachment = { id: obj.attachment, original_filename: obj.attachment__original_filename }
          // if (this.isDefinedAndNotNull(obj.agent_type)) obj.agent_type = { id: obj.agent_type, value: obj.agent_type__value }
          // if (this.isDefinedAndNotNull(obj.agent)) obj.agent = { id: obj.agent, agent: obj.agent__agent }
          // if (this.isDefinedAndNotNull(obj.identifier_type)) obj.identifier_type = { id: obj.identifier_type, value: obj.identifier_type__value }
          // if (this.isDefinedAndNotNull(obj.relation_type)) obj.relation_type = { id: obj.relation_type, value: obj.relation_type__value }
          // if (this.isDefinedAndNotNull(obj.locality)) obj.locality = { id: obj.locality, locality: obj.locality__locality, locality_en: obj.locality__locality_en }
          // if (this.isDefinedAndNotNull(obj.date_type)) obj.date_type = { id: obj.date_type, value: obj.date_type__value }

          return obj;
        }

        let relatedData = cloneDeep(obj)
        obj = [];
        relatedData.forEach(entity => obj.push(entity));
        return obj
      },

      loadRelatedData(object, doi = null) {
        let query;

        if (object === 'attachment_link') {
          // query = fetchDoiAttachment(this.$route.params.id, this.relatedData.page.attachment_link, this.relatedData.paginateBy.attachment_link)
          // Todo: Fossiili määrangud
        } else if (object === '') {
          // Todo: kivimi/mineraali nimed
        } else if (object === '') {
          // Todo: kirjandusviited
        } else if (object === '') {
          // Todo: kirjeldused
        } else if (object === '') {
          // Todo: pildid
        } else if (object === '') {
          // Todo: manused
        } else if (object === '') {
          // Todo: osised ja asukohad
        } else if (object === '') {
          // Todo: ajalugu ja protseduurid
        } else if (object === '') {
          // Todo: analüüsid
        }

        return new Promise(resolve => {
          query.then(response => {
            if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results : [];

            this.relatedData.count[object] = response.body.count;
            this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);

            resolve(true)
          });
        });
      },

      //check required fields for related data
      checkRequiredFields(type) {},

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.specimen = this.specimen.id;

        if (this.isDefinedAndNotNull(uploadableObject.attachment)) {
          uploadableObject.attachment = uploadableObject.attachment.id ? uploadableObject.attachment.id : uploadableObject.attachment;
        }
        if (this.isDefinedAndNotNull(uploadableObject.agent_type)) {
          uploadableObject.agent_type = uploadableObject.agent_type.id ? uploadableObject.agent_type.id : uploadableObject.agent_type;
        }
        if (this.isDefinedAndNotNull(uploadableObject.agent)) {
          uploadableObject.agent = uploadableObject.agent.id ? uploadableObject.agent.id : uploadableObject.agent;
        }
        if (this.isDefinedAndNotNull(uploadableObject.identifier_type)) {
          uploadableObject.identifier_type = uploadableObject.identifier_type.id ? uploadableObject.identifier_type.id : uploadableObject.identifier_type;
        }
        if (this.isDefinedAndNotNull(uploadableObject.relation_type)) {
          uploadableObject.relation_type = uploadableObject.relation_type.id ? uploadableObject.relation_type.id : uploadableObject.relation_type;
        }
        if (this.isDefinedAndNotNull(uploadableObject.locality)) {
          uploadableObject.locality = uploadableObject.locality.id ? uploadableObject.locality.id : uploadableObject.locality;
        }
        if (this.isDefinedAndNotNull(uploadableObject.date_type)) {
          uploadableObject.date_type = uploadableObject.date_type.id ? uploadableObject.date_type.id : uploadableObject.date_type;
        }

        console.log('This object is sent in string format (related_data):')
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchSpecimens(params, this.databaseId))
        });
      },

      setDefaultSearchParameters() {
        return {
          idSpecimen: null,
          collNumber: null,
          classification: null,
          fossil: null,
          mineralRock: null,
          locality: null,
          stratigraphy: null,
          agent_collected: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
    }

  }
</script>

<style scoped>
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
