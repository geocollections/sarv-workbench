<template>
  <div class="taxon">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border-top px-2 mb-2" :style="!validate('taxon') ? 'border-color: #dc3545!important;' : ''" id="block-info">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.info, 'text-danger': !validate('taxon') }"
              @click="block.info = !block.info">
        {{ $t('taxon.generalInfo') }}
        <i v-if="validate('taxon')" class="fas fa-project-diagram text-success"></i>
        <i v-if="!validate('taxon')" class="fas fa-project-diagram text-danger"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- TAXON, AUTHOR_YEAR and REFERENCE  -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`taxon`">{{ $t('taxon.taxon') }}:</label>
              <b-form-input id="taxon" v-model="taxon.taxon" type="text"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`author_year`">{{ $t('taxon.author_year') }}:</label>
              <b-form-input id="author_year" v-model="taxon.author_year" type="text"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`reference`">{{ $t('taxon.reference') }}:</label>
              <vue-multiselect id="reference"
                               v-model="taxon.reference"
                               label="reference"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference"
                               @search-change="autocompleteReferenceSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- RANK, PARENT and TAXON_EPITHET  -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`rank`">{{ $t('taxon.rank') }}:</label>
              <vue-multiselect v-model="taxon.rank"
                               id="rank"
                               :options="autocomplete.rank"
                               track-by="id"
                               :label="rankLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[rankLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`parent`">{{ $t('taxon.parent') }}:</label>
              <vue-multiselect id="parent"
                               v-model="taxon.parent"
                               label="taxon"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.parent"
                               :options="autocomplete.parent"
                               @search-change="autocompleteTaxonSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`taxon_epithet`">{{ $t('taxon.taxon_epithet') }}:</label>
              <b-form-input id="taxon_epithet" v-model="taxon.taxon_epithet" type="text"></b-form-input>
            </div>
          </div>

          <!-- HIERARCHY_STRING, FOSSIL_GROUP and IS_FOSSIL_GROUP  -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`hierarchy_string`">{{ $t('taxon.hierarchy_string') }}:</label>
              <b-form-input id="hierarchy_string" v-model="taxon.hierarchy_string" type="text"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`fossil_group`">{{ $t('taxon.fossil_group') }}:</label>
              <vue-multiselect id="fossil_group"
                               v-model="taxon.fossil_group"
                               label="taxon"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.fossil_group"
                               :options="autocomplete.fossil_group"
                               @search-change="autocompleteTaxonSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`is_fossil_group`">{{ $t('taxon.is_fossil_group') }}:</label>
              <v-checkbox v-model="taxon.is_fossil_group" hide-details></v-checkbox>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- TAXON INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-details">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.details }" @click="block.details = !block.details">
        {{ $t('taxon.details') }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.details">

          <!-- TAXON_ORIGINAL_NAME and RANK_ORIGINAL -->
          <div class="row">
            <div class="col-md-6">
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

            <div class="col-md-6">
              <label :for="`locality_free`">{{ $t('specimen.locality_free') }}:</label>
              <b-form-input id="locality_free" v-model="specimen.locality_free" type="text"></b-form-input>
            </div>
          </div>

          <!-- TYPE_TAXON_ID and TYPE_TAXON -->
          <div class="row">
            <div class="col-md-6">
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

            <div class="col-md-6">
              <label :for="`locality_free`">{{ $t('specimen.locality_free') }}:</label>
              <b-form-input id="locality_free" v-model="specimen.locality_free" type="text"></b-form-input>
            </div>
          </div>

          <!-- IS_FOSSIL, IS_VALID, IN_ESTONIA and IN_BALTOSCANDIA -->
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
          </div>

          <!-- STRATIGRAPHY_TOP and STRATIGRAPHY_BASE -->
          <div class="row">
            <div class="col-md-6">
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

            <div class="col-md-6">
              <label :for="`locality_free`">{{ $t('specimen.locality_free') }}:</label>
              <b-form-input id="locality_free" v-model="specimen.locality_free" type="text"></b-form-input>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- ADDITIONAL INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-additionalInfo">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.additionalInfo }" @click="block.additionalInfo = !block.additionalInfo">
        {{ $t('taxon.additionalInfo') }}
        <i class="fas fa-info"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.additionalInfo">

          <!-- TAXON_ID_PBDB, TAXON_ID_PLUTOF, TAXON_ID_TOL, TAXON_ID_EOL and TAXON_ID_NRM -->
          <div class="row">
            <div class="col-md-2">
              <label :for="`part`">{{ $t('specimen.part') }}:</label>
              <b-form-input id="part" v-model="specimen.part" type="text"></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`part`">{{ $t('specimen.part') }}:</label>
              <b-form-input id="part" v-model="specimen.part" type="text"></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`part`">{{ $t('specimen.part') }}:</label>
              <b-form-input id="part" v-model="specimen.part" type="text"></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`part`">{{ $t('specimen.part') }}:</label>
              <b-form-input id="part" v-model="specimen.part" type="text"></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`part`">{{ $t('specimen.part') }}:</label>
              <b-form-input id="part" v-model="specimen.part" type="text"></b-form-input>
            </div>
          </div>

          <!-- OWNER, IS_AUTHORIZED, USER_AUTHORIZED, SORT -->
          <div class="row">
            <div class="col-md-3">
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

            <div class="col-md-3">
              <label :for="`storage`">{{ $t('specimen.storage') }}:</label>
              <vue-multiselect v-model="specimen.storage"
                               id="storage"
                               label="location"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.storage"
                               :options="autocomplete.storage"
                               @search-change="autocompleteStorageSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3">
              <label :for="`storage`">{{ $t('specimen.storage') }}:</label>
              <vue-multiselect v-model="specimen.storage"
                               id="storage"
                               label="location"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.storage"
                               :options="autocomplete.storage"
                               @search-change="autocompleteStorageSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border-top px-2 mb-2" id="block-description">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.description }" @click="block.description = !block.description">
        {{ $t('specimen.description') }}
        <i class="fas fa-pen-fancy"></i>
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
        </div>
      </transition>
    </fieldset>

    <!-- RELATED DATA TABS -->
    <div class="row mb-2">
      <div class="col mt-2">
        <ul class="nav nav-tabs nav-fill mb-3">

          <li class="nav-item" v-for="tab in computedRelatedTabs" :key="tab.name">
            <a href="#" @click.prevent="setTab(tab.name)" class="nav-link" :class="{ active: activeTab === tab.name }">
              <span>{{ $t('specimen.relatedTables.' + tab.name) }}</span>

              <v-chip v-if="relatedData[tab.name].length > 0" class="ml-1" color="blue lighten-2" dark outlined>
                <v-icon left small>{{ tab.iconClass }}</v-icon>
                <b style="color: black; font-size: larger;">
                  {{ relatedData[tab.name].length }}
                </b>
              </v-chip>

              <!--              <span>-->
              <!--                <sup>-->
              <!--                  <b-badge pill variant="light">{{ relatedData[tab.name].length }}&nbsp;</b-badge>-->
              <!--                </sup>-->
              <!--              </span>-->

              <!--              <span><i :class="tab.iconClass"></i></span>-->
            </a>
          </li>
        </ul>

        <div class="row" v-if="$route.meta.isEdit">
          <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">
            <b-form-select v-model="relatedData.searchParameters[activeTab].paginateBy" class="mb-3" size="sm">
              <option :value="10">{{ this.$t('main.pagination', { num: '10' }) }}</option>
              <option :value="25">{{ this.$t('main.pagination', { num: '25' }) }}</option>
              <option :value="50">{{ this.$t('main.pagination', { num: '50' }) }}</option>
              <option :value="100">{{ this.$t('main.pagination', { num: '100' }) }}</option>
              <option :value="250">{{ this.$t('main.pagination', { num: '250' }) }}</option>
              <option :value="500">{{ this.$t('main.pagination', { num: '500' }) }}</option>
              <option :value="1000">{{ this.$t('main.pagination', { num: '1000' }) }}</option>
            </b-form-select>
          </div>

          <div class="col-sm-12 col-md-3 export-center">
            <!-- EXPORT BUTTON? -->
          </div>

          <div class="col-sm-12 col-md-6 pagination-center"
               v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.searchParameters[activeTab].page" :per-page="relatedData.searchParameters[activeTab].paginateBy">
            </b-pagination>
          </div>
        </div>

        <specimen-identification v-if="specimen.fossil && (specimen.fossil.id === 1 || specimen.fossil.id === 7)"
                                 :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                                 v-on:add-related-data="addRelatedData"
                                 v-on:set-default="setDefault"
                                 v-on:edit-row="editRow"
                                 v-on:remove-row="removeRow" />

        <specimen-identification-geology v-if="specimen.fossil && (specimen.fossil.id === 1 || specimen.fossil.id === 7)"
                                         :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                                         v-on:add-related-data="addRelatedData"
                                         v-on:set-default="setDefault"
                                         v-on:edit-row="editRow"
                                         v-on:remove-row="removeRow" />

        <specimen-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                            v-on:add-related-data="addRelatedData"
                            v-on:set-default="setDefault"
                            v-on:edit-row="editRow"
                            v-on:remove-row="removeRow" />

        <specimen-description :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                              v-on:add-related-data="addRelatedData"
                              v-on:set-default="setDefault"
                              v-on:edit-row="editRow"
                              v-on:remove-row="removeRow" />

        <specimen-attachment :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                             v-on:add-related-data="addRelatedData"
                             v-on:set-default="setDefault"
                             v-on:edit-row="editRow"
                             v-on:remove-row="removeRow" />

        <specimen-location :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                           v-on:add-related-data="addRelatedData"
                           v-on:set-default="setDefault"
                           v-on:edit-row="editRow"
                           v-on:remove-row="removeRow" />

        <specimen-history :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                          v-on:add-related-data="addRelatedData"
                          v-on:set-default="setDefault"
                          v-on:edit-row="editRow"
                          v-on:remove-row="removeRow" />

        <specimen-analysis :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                           v-on:add-related-data="addRelatedData"
                           v-on:set-default="setDefault"
                           v-on:edit-row="editRow"
                           v-on:remove-row="removeRow" />

      </div>
    </div>

    <!-- IS_PRIVATE -->
    <div class="row">
      <div class="col">
        <vs-checkbox class="justify-content-start" id="is_private" v-model="specimen.is_private" icon="fa-lock" icon-pack="fas">
          {{ $t('specimen.is_private_text') }}
        </vs-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteMixin from "../../mixins/autocompleteMixin";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {mapState} from "vuex";

  export default {
    name: "Taxon",

    mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory !== 'fallbackValue' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'taxonSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_TAXA',
          title: 'header.taxa',
          object: 'taxon',
          field: 'taxon',
          databaseId: this.databaseId,
          block: this.block
        });
      } else {
        // Adding specimen default values from local storage
        const taxonHistory = this.$localStorage.get('taxon', 'fallbackValue');
        if (taxonHistory !== 'fallbackValue' && Object.keys(taxonHistory).length !== 0 && taxonHistory.constructor === Object) {
          this.taxon = taxonHistory
        }
      }

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function (newVal, oldVal) {
          this.setInitialData();
          this.reloadData()
        },
        deep: true
      },
      'relatedData.searchParameters': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
    },

    computed: {
      ...mapState(["databaseId"]),

      activeRelatedDataTab() {
        let tabObject = this.$store.state.activeRelatedDataTab;
        if (tabObject && tabObject[this.$route.meta.object]) {
          return tabObject[this.$route.meta.object];
        } else return null;
      }
    },

    methods: {
      setTab(type) {
        if (type) {
          this.$store.dispatch("updateActiveTab", { tab: type, object: this.$route.meta.object });
          this.activeTab = type
        }
      },

      setInitialData() {
        return {
          relatedTabs: [
            { name: 'specimen_identification', iconClass: 'fas fa-atlas' },
            { name: 'specimen_identification_geology', iconClass: 'far fa-gem' },
            { name: 'specimen_reference', iconClass: 'fas fa-book' },
            { name: 'specimen_description', iconClass: 'fas fa-info' },
            { name: 'attachment', iconClass: 'far fa-folder-open' },
            { name: 'specimen_location', iconClass: 'fas fa-globe-europe' },
            { name: 'specimen_history', iconClass: 'fas fa-history' },
            { name: 'analysis', iconClass: 'far fa-chart-bar' }
          ],
          searchHistory: 'taxonSearchHistory',
          activeTab: 'specimen_identification',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id'],
          autocomplete: {
            loaders: {
              coll: false,
            },
            coll: [],
          },
          requiredFields: ['taxon'],
          specimen: {},
          searchParameters: this.setDefaultSearchParameters(),
          block: {info: true, details: true, additionalInfo: true, description: true},
        }
      },
    }
  }
</script>

<style scoped>

</style>
