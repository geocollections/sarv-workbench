import {autocompleteSearch} from "@/assets/js/api/apiCalls";
import {mapState} from "vuex";

const autocompleteMixin = {
  computed: {
    $_commonLabel() {
      return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
    },
    $_localityLabel() {
      return this.$i18n.locale === 'ee' ? 'locality' : 'locality_en'
    },
    $_stratigraphyLabel() {
      return this.$i18n.locale === 'ee' ? 'stratigraphy' : 'stratigraphy_en'
    },
    $_nameLabel() {
      return this.$i18n.locale === 'ee' ? 'name' : 'name_en'
    },
    $_analysisMethodLabel() {
      return this.$i18n.locale === 'ee' ? 'analysis_method' : 'method_en'
    },
    $_instrumentLabel() {
      return this.$i18n.locale === 'ee' ? 'instrument' : 'instrument_en'
    },
    $_labLabel() {
      return this.$i18n.locale === 'ee' ? 'lab' : 'lab_en'
    },
    $_licenceLabel() {
      return this.$i18n.locale === 'ee' ? 'licence' : 'licence_en'
    },
    ...mapState(["currentUser"])
  },
  methods: {
    $_autocompleteAnalysisSearch(value) {
      this.$_autocompleteMixin_search(value, 'analysis', 'analysis')
    },
    $_autocompletePreparationSearch(value) {
      this.$_autocompleteMixin_search(value, 'preparation', 'preparation')
    },
    $_autocompleteParentProjectSearch(value) {
      this.$_autocompleteMixin_search(value, 'parent_project', 'parent_project')
    },
    $_autocompleteProjectSearch(value) {
      this.$_autocompleteMixin_search(value, 'project', 'project')
    },
    $_autocompleteLocalitySearch(value) {
      this.$_autocompleteMixin_search(value, 'locality', 'locality')
    },
    $_autocompleteLocalitySearch2(value) {
      this.$_autocompleteMixin_search(value, 'locality', 'locality')
    },
    $_autocompleteTaxonSearch(value) {
      this.$_autocompleteMixin_search(value, 'taxon', 'taxon')
    },
    $_autocompleteStratigraphySearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy', 'stratigraphy')
    },
    $_autocompleteStratigraphySearch2(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy', 'stratigraphy')
    },
    $_autocompleteLithostratigraphySearch(value) {
      this.$_autocompleteMixin_search(value, 'lithostratigraphy', 'lithostratigraphy')
    },
    $_autocompleteLithostratigraphySearch2(value) {
      this.$_autocompleteMixin_search(value, 'lithostratigraphy', 'lithostratigraphy')
    },
    $_autocompleteStorageSearch(value) {
      this.$_autocompleteMixin_search(value, 'storage', 'storage')
    },
    $_autocompleteStorageSearch2(value) {
      this.$_autocompleteMixin_search(value, 'storage', 'storage',)
    },
    $_autocompleteAdditionalStorageSearch(value) {
      this.$_autocompleteMixin_search(value, 'storage_additional', 'storage_additional')
    },
    $_autocompleteStratigraphyTopSearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy_top', 'stratigraphy_top')
    },
    $_autocompleteStratigraphyBaseSearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy_base', 'stratigraphy_base')
    },
    $_autocompleteAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'agent', 'agent')
    },
    $_autocompleteOwnerSearch(value) {
      this.$_autocompleteMixin_search(value, 'owner', 'agent')
    },
    $_autocompleteCopyrightAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'copyright_agent', 'copyright_agent')
    },
    $_autocompleteProjectAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'projectagent', 'agent')
    },
    $_autocompleteLibraryAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'library_agent', 'library_agent', 1)
    },
    $_autocompleteLibraryAgentSearch2(value) {
      this.$_autocompleteMixin_search(value, 'library_agent_search', 'library', 1)
    },
    $_autocompleteRockSearch(value) {
      this.$_autocompleteMixin_search(value, 'rock', 'rock')
    },
    $_autocompleteSampleSeriesSearch(value) {
      this.$_autocompleteMixin_search(value, 'series', 'series')
    },
    $_autocompleteSampleSearch(value) {
      this.$_autocompleteMixin_search(value, 'sample', 'sample',1)
    },
    $_autocompleteSpecimenSearch(value) {
      this.$_autocompleteMixin_search(value, 'specimen', 'specimen')
    },
    $_autocompleteSiteSearch(value) {
      this.$_autocompleteMixin_search(value, 'site', 'site')
    },
    $_autocompleteReferenceSearch(value) {
      this.$_autocompleteMixin_search(value, 'reference', 'reference')
    },
    $_autocompleteSynonymSearch(value) {
      this.$_autocompleteMixin_search(value, 'synonym', 'synonym')
    },
    $_autocompleteAttachmentSearch(value) {
      this.$_autocompleteMixin_search(value, 'attachment', 'attachment')
    },
    $_autocompleteAttachmentSearch2(value) {
      this.$_autocompleteMixin_search(value, 'attachment', 'attachment')
    },
    $_autocompleteAttachmentSearch3(value) {
      this.$_autocompleteMixin_search(value, 'attachment3', 'attachment')
    },
    $_autocompletePublicAttachmentSearch(value) {
      this.$_autocompleteMixin_search(value, 'attachment_public', 'attachment')
    },
    $_autocompleteJournalSearch(value) {
      this.$_autocompleteMixin_search(value, 'journals', 'journals', 1)
    },
    $_autocompleteLibrarySearch(value) {
      this.$_autocompleteMixin_search(value, 'library', 'library', 1)
    },
    $_autocompleteDoiReferenceSearch(value) {
      this.$_autocompleteMixin_search(value, 'reference', 'reference')
    },
    $_autocompleteDatasetSearch(value) {
      this.$_autocompleteMixin_search(value, 'dataset', 'dataset', 1)
    },
    $_autocompleteLabSearch(value) {
      this.$_autocompleteMixin_search(value, 'lab', 'lab', 1)
    },
    $_autocompleteInstrumentSearch(value) {
      this.$_autocompleteMixin_search(value, 'instrument', 'instrument', 1)
    },
    $_autocompleteDoiAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'doi_agent', 'doi_agent')
    },
    $_autocompleteCollSearch(value) {
      this.$_autocompleteMixin_search(value, 'coll', 'coll', 2)
    },
    $_autocompleteAgentCollectedSearch(value) {
      this.$_autocompleteMixin_search(value, 'agent_collected', 'agent_collected', 2)
    },
    $_autocompleteClassificationSearch(value) {
      this.$_autocompleteMixin_search(value, 'classification', 'classification', 2)
    },

    /**
     * Initiates autocomplete search and sets results to autocomplete object.
     * @param value - User inputted search value
     * @param type - String which is used for building search queries
     * @param options - String which will toggle loader state and sets results to autocomplete object
     * @param minLength {Integer} - Minimum length needed to trigger search
     */
    $_autocompleteMixin_search(value, type, options, minLength = 3) {
      if (value.length < minLength) this.autocomplete[options] = [];
      else if (value.length >= minLength) {
        let query = buildAutocompleteQuery(type, value, this.currentUser);
        if (query.length === 0) return;

        this.autocomplete.loaders[options] = true;
        autocompleteSearch(query).then((response) => {
          this.autocomplete.loaders[options] = false;
          this.autocomplete[options] = handleResponse(response)
        });
      }
    },

  }
};

/**
 * Handles API response and returns list of items.
 * @param response - Response from API
 * @returns {List} - List of results or if count is 0 then empty list.
 */
function handleResponse(response) {
  if (response.status === 200) return (response.body.count > 0) ? response.body.results : []
}

/**
 *
 * @param type - Search type of which query is built
 * @param value - User search input
 * @param currentUser - Current logged in user
 * @returns {string} - Search string
 */
function buildAutocompleteQuery(type, value, currentUser) {
  switch (type) {
    case 'analysis':
      return `analysis/?multi_search=value:${value};fields:id;lookuptype:icontains&fields=id,analysis_method__analysis_method,analysis_method__method_en`;
    case 'preparation':
      return `preparation/?multi_search=value:${value};fields:preparation_number,id;lookuptype:icontains&fields=id,preparation_number`;
    case 'locality':
      return `locality/?multi_search=value:${value};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`;
    case 'storage_additional':
    case 'storage':
      return `location/?multi_search=value:${value};fields:location;lookuptype:icontains&fields=id,location`;
    case 'stratigraphy':
      return `stratigraphy/?multi_search=value:${value};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&type__value_en=chronostratigraphy&fields=id,stratigraphy,stratigraphy_en`;
    case 'lithostratigraphy':
      return `stratigraphy/?multi_search=value:${value};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&type__value_en=lithostratigraphy&fields=id,stratigraphy,stratigraphy_en`;
    case 'stratigraphy_top':
    case 'stratigraphy_base':
      return `stratigraphy/?multi_search=value:${value};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&fields=id,stratigraphy,stratigraphy_en`;
    case 'projectagent':
    case 'library_agent':
    case 'agent':
    case 'owner':
    case 'agent_collected':
    case 'copyright_agent':
      return `agent/?multi_search=value:${value};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent,forename,surename`;
    case 'rock':
      return `rock/?multi_search=value:${value};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en`;
    case 'sample':
      return `sample/?multi_search=value:${value};fields:number;lookuptype:icontains&fields=id,number`;
    case 'series': //sample series
      return `sample_series/?multi_search=value:${value};fields:name;lookuptype:icontains&fields=id,name`;
    case 'specimen':
      return `specimen/?multi_search=value:${value};fields:specimen_id;lookuptype:icontains&fields=id,specimen_id`;
    case 'reference':
      return `reference/?multi_search=value:${value};fields:reference,id;lookuptype:icontains&fields=id,reference,pages,figures,remarks`;
    case 'synonym':
      return `locality_synonym/?multi_search=value:${value};fields:synonym;lookuptype:icontains&fields=id,synonym,reference__reference,pages,remarks`;
    case 'attachment':
      return`attachment/?multi_search=value:${value};fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains&fields=id,author__agent,original_filename,description,description_en,remarks,uuid_filename`;
    case 'attachment_public':
      return `attachment/?multi_search=value:${value};fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains&is_private=0&fields=id,author__agent,original_filename,description,description_en,remarks,uuid_filename`;
    case 'attachment3':
      return `attachment/?multi_search=value:${value};fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains&or_search=user_added__iexact:${currentUser.user};is_private__iexact:0&fields=id,author__agent,original_filename,description,description_en,remarks,uuid_filename`;
    case 'taxon':
      return `taxon/?multi_search=value:${value};fields:taxon;lookuptype:icontains&fields=id,taxon`;
    case 'project':
    case 'parent_project':
      return `project/?multi_search=value:${value};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en`;
    case 'library':
      return `library/?multi_search=value:${value};fields:id,title,title_en;lookuptype:icontains&author=${currentUser.id}&fields=id,title,title_en`;
    case 'journals':
      return `journal/?multi_search=value:${value};fields:id,journal_name,journal_short;lookuptype:icontains`;
    case 'site':
      return `site/?multi_search=value:${value};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en`;
    case 'dataset':
      return `dataset/?multi_search=value:${value};fields:id,name,name_en;lookuptype:icontains&fields=id,name,name_en`;
    case 'doi_agent':
      return `agent/?multi_search=value:${value};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent,institution__institution_name_en`;
    case 'library_agent_search':
      return `library_agent/?agent=${currentUser.id}&multi_search=value:${value};fields:library__title,library__title_en;lookuptype:icontains&fields=library,library__title,library__title_en`;
    case 'coll':
      return `collection/?number__icontains=${value}&fields=id,number`;
    case 'classification':
      return `classification/?multi_search=value:${value};fields:id,class_field,class_en;lookuptype:icontains&fields=id,class_field,class_en`;
    default:
      return ''
  }
}

export default autocompleteMixin
