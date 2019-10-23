import {autocompleteSearch} from "@/assets/js/api/apiCalls";
import {mapState} from "vuex";

const autocompleteMixin = {
  computed: {
    commonLabel() {
      return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
    },
    localityLabel() {
      return this.$i18n.locale === 'ee' ? 'locality' : 'locality_en'
    },
    stratigraphyLabel() {
      return this.$i18n.locale === 'ee' ? 'stratigraphy' : 'stratigraphy_en'
    },
    nameLabel() {
      return this.$i18n.locale === 'ee' ? 'name' : 'name_en'
    },
    analysisMethodLabel() {
      return this.$i18n.locale === 'ee' ? 'analysis_method' : 'method_en'
    },
    instrumentLabel() {
      return this.$i18n.locale === 'ee' ? 'instrument' : 'instrument_en'
    },
    labLabel() {
      return this.$i18n.locale === 'ee' ? 'lab' : 'lab_en'
    },
    licenceLabel() {
      return this.$i18n.locale === 'ee' ? 'licence' : 'licence_en'
    },
    classLabel() {
      return this.$i18n.locale === 'ee' ? 'class_field' : 'class_en'
    },
    keywordCategoryLabel() {
      return this.$i18n.locale === 'ee' ? 'keyword_category__name' : 'keyword_category__name_en'
    },
    libraryTitle() {
      return this.$i18n.locale === 'ee' ? 'library__title' : 'library__title_en'
    },
    rankLabel() {
      return this.$i18n.locale === 'ee' ? 'rank' : 'rank_en'
    },
    ...mapState(["currentUser"])
  },
  methods: {
    autocompleteAnalysisSearch(value) {
      this.$_autocompleteMixin_search(value, 'analysis', 'analysis')
    },
    autocompletePreparationSearch(value) {
      this.$_autocompleteMixin_search(value, 'preparation', 'preparation')
    },
    autocompleteParentProjectSearch(value) {
      this.$_autocompleteMixin_search(value, 'parent_project', 'parent_project')
    },
    autocompleteProjectSearch(value) {
      this.$_autocompleteMixin_search(value, 'project', 'project')
    },
    autocompleteLocalitySearch(value) {
      this.$_autocompleteMixin_search(value, 'locality', 'locality')
    },
    autocompleteLocalitySearch2(value) {
      this.$_autocompleteMixin_search(value, 'locality', 'locality')
    },
    autocompleteTaxonSearch(value) {
      this.$_autocompleteMixin_search(value, 'taxon', 'taxon')
    },
    autocompleteStratigraphySearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy', 'stratigraphy')
    },
    autocompleteStratigraphySearch2(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy', 'stratigraphy')
    },
    autocompleteLithostratigraphySearch(value) {
      this.$_autocompleteMixin_search(value, 'lithostratigraphy', 'lithostratigraphy')
    },
    autocompleteLithostratigraphySearch2(value) {
      this.$_autocompleteMixin_search(value, 'lithostratigraphy', 'lithostratigraphy')
    },
    autocompleteStorageSearch(value) {
      this.$_autocompleteMixin_search(value, 'storage', 'storage')
    },
    autocompleteAdditionalStorageSearch(value) {
      this.$_autocompleteMixin_search(value, 'storage_additional', 'storage_additional')
    },
    autocompleteStratigraphyTopSearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy_top', 'stratigraphy_top')
    },
    autocompleteStratigraphyBaseSearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy_base', 'stratigraphy_base')
    },
    autocompleteAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'agent', 'agent')
    },
    autocompleteOwnerSearch(value) {
      this.$_autocompleteMixin_search(value, 'owner', 'agent')
    },
    autocompleteCopyrightAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'copyright_agent', 'copyright_agent')
    },
    autocompleteAgentDigitisedSearch(value) {
      this.$_autocompleteMixin_search(value, 'agent_digitised', 'agent_digitised')
    },
    autocompleteProjectAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'projectagent', 'agent')
    },
    autocompleteLibraryAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'library_agent', 'library_agent', 1)
    },
    autocompleteLibraryAgentSearch2(value) {
      this.$_autocompleteMixin_search(value, 'library_agent_search', 'library', 1)
    },
    autocompleteRockSearch(value) {
      this.$_autocompleteMixin_search(value, 'rock', 'rock')
    },
    autocompleteSampleSeriesSearch(value) {
      this.$_autocompleteMixin_search(value, 'series', 'series')
    },
    autocompleteSampleSearch(value) {
      this.$_autocompleteMixin_search(value, 'sample', 'sample', 1)
    },
    autocompleteSpecimenSearch(value) {
      this.$_autocompleteMixin_search(value, 'specimen', 'specimen')
    },
    autocompleteSiteSearch(value) {
      this.$_autocompleteMixin_search(value, 'site', 'site')
    },
    autocompleteReferenceSearch(value) {
      this.$_autocompleteMixin_search(value, 'reference', 'reference')
    },
    autocompleteSynonymSearch(value) {
      this.$_autocompleteMixin_search(value, 'synonym', 'synonym')
    },
    autocompleteAttachmentSearch(value) {
      this.$_autocompleteMixin_search(value, 'attachment', 'attachment')
    },
    autocompleteAttachmentSearch2(value) {
      this.$_autocompleteMixin_search(value, 'attachment', 'attachment')
    },
    autocompleteAttachmentSearch3(value) {
      this.$_autocompleteMixin_search(value, 'attachment3', 'attachment')
    },
    autocompletePublicAttachmentSearch(value) {
      this.$_autocompleteMixin_search(value, 'attachment_public', 'attachment')
    },
    autocompleteJournalSearch(value) {
      this.$_autocompleteMixin_search(value, 'journals', 'journals', 1)
    },
    autocompleteLibrarySearch(value) {
      this.$_autocompleteMixin_search(value, 'library', 'library', 1)
    },
    autocompleteDoiReferenceSearch(value) {
      this.$_autocompleteMixin_search(value, 'reference', 'reference')
    },
    autocompleteDatasetSearch(value) {
      this.$_autocompleteMixin_search(value, 'dataset', 'dataset', 1)
    },
    autocompleteLabSearch(value) {
      this.$_autocompleteMixin_search(value, 'lab', 'lab', 1)
    },
    autocompleteInstrumentSearch(value) {
      this.$_autocompleteMixin_search(value, 'instrument', 'instrument', 1)
    },
    autocompleteDoiAgentSearch(value) {
      this.$_autocompleteMixin_search(value, 'doi_agent', 'doi_agent')
    },
    autocompleteCollSearch(value) {
      this.$_autocompleteMixin_search(value, 'coll', 'coll', 2)
    },
    autocompleteAgentCollectedSearch(value) {
      this.$_autocompleteMixin_search(value, 'agent_collected', 'agent_collected', 2)
    },
    autocompleteClassificationSearch(value) {
      this.$_autocompleteMixin_search(value, 'classification', 'classification', 2)
    },
    autocompleteKeywordSearch(value) {
      this.$_autocompleteMixin_search(value, 'keyword', 'keyword', 1, '', false)
      // this.$_autocompleteMixin_search(value, 'keyword_group_by', 'keyword', 1, this.keywordCategoryLabel)
    },
    autocompleteKeywordCategorySearch(value) {
      this.$_autocompleteMixin_search(value, 'keyword_category', 'keyword_category', 1)
    },
    autocompleteRelatedKeywordSearch(value) {
      this.$_autocompleteMixin_search(value, 'related_keyword', 'related_keyword', 1)
    },
    autocompleteAnalysisMethodSearch(value) {
      this.$_autocompleteMixin_search(value, 'analysis_method', 'analysis_method', 1)
    },
    autocompleteImagesetSearch(value) {
      this.$_autocompleteMixin_search(value, 'imageset', 'imageset', 2)
    },
    autocompleteRelatedDataSearch(value, id) {
      this.$_autocompleteMixin_search(value, 'attach_link__' + id, 'attach_link__' + id, 2)
    },

    /**
     * Initiates autocomplete search and sets results to autocomplete object.
     * @param value - User inputted search value
     * @param type - String which is used for building search queries
     * @param options - String which will toggle loader state and sets results to autocomplete object
     * @param minLength {Integer} - Minimum length needed to trigger search
     * @param groupByField {String} - Field used to group results
     * @param clearAutocomplete {Boolean} - If set to false then autocomplete won't get cleared when multiselect field is cleared (needed in reference keywords search)
     */
    $_autocompleteMixin_search(value, type, options, minLength = 3, groupByField, clearAutocomplete = true) {
      if (value.length < minLength) {
        if (clearAutocomplete) this.autocomplete[options] = [];
      } else if (value.length >= minLength) {
        let query = buildAutocompleteQuery(type, value, this.currentUser, groupByField);
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
 * @param groupByField - Field used with &group_by=
 * @returns {string} - Search string
 */
function buildAutocompleteQuery(type, value, currentUser, groupByField) {
  switch (type) {
    case 'analysis':
      return `analysis/?multi_search=value:${value};fields:id;lookuptype:icontains&fields=id,analysis_method__analysis_method,analysis_method__method_en`;
    case 'preparation':
      return `preparation/?multi_search=value:${value};fields:preparation_number,id;lookuptype:icontains&fields=id,preparation_number`;
    case 'locality':
      return `locality/?multi_search=value:${value};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en,longitude,latitude`;
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
    case 'agent_digitised':
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
      return `specimen/?multi_search=value:${value};fields:specimen_id,coll__number;lookuptype:icontains&fields=id,specimen_id,coll__number`;
    case 'reference':
      return `reference/?multi_search=value:${value};fields:reference,id;lookuptype:icontains&fields=id,reference,pages,figures,remarks`;
    case 'synonym':
      return `locality_synonym/?multi_search=value:${value};fields:synonym;lookuptype:icontains&fields=id,synonym,reference__reference,pages,remarks`;
    case 'attachment':
      return `attachment/?multi_search=value:${value};fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains&fields=id,author__agent,original_filename,description,description_en,remarks,uuid_filename`;
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
      return `agent/?multi_search=value:${value};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent,institution__institution_name_en,orcid`;
    case 'library_agent_search':
      return `library_agent/?agent=${currentUser.id}&multi_search=value:${value};fields:library__title,library__title_en;lookuptype:icontains&fields=library,library__title,library__title_en`;
    case 'coll':
      return `collection/?number__icontains=${value}&fields=id,number`;
    case 'classification':
      return `classification/?multi_search=value:${value};fields:id,class_field,class_en;lookuptype:icontains&fields=id,class_field,class_en`;
    case 'keyword':
      return `keyword/?multi_search=value:${value};fields:id,keyword;lookuptype:icontains`;
    case 'keyword_group_by':
      return `keyword/?multi_search=value:${value};fields:keyword,${groupByField};lookuptype:icontains&group_by=${groupByField}`;
    case 'keyword_category':
      return `keyword_category/?multi_search=value:${value};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en`;
    case 'related_keyword':
      return `keyword/?keyword__icontains=${value}&fields=id,keyword`;
    case 'analysis_method':
      return `analysis_method/?multi_search=value:${value};fields:analysis_method,method_en;lookuptype:icontains&fields=id,analysis_method,method_en`;
    case 'imageset':
      return `imageset/?imageset_number__icontains=${value}&or_search=user_added:${currentUser.forename};author__id:${currentUser.id}`;
    case 'attach_link__collection':
    case 'attach_link__dataset':
    case 'attach_link__project':
    case 'attach_link__site':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,name,name_en;lookuptype:icontains&fields=id,name,name_en`;
    case 'attach_link__specimen':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,specimen_id,coll__number;lookuptype:icontains&fields=id,specimen_id,coll__number`;
    case 'attach_link__sample':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,number;lookuptype:icontains&fields=id,number`;
    case 'attach_link__sample_series':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,name;lookuptype:icontains&fields=id,name`;
    case 'attach_link__analysis':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,sample__number;lookuptype:icontains&fields=id,sample__number`;
    case 'attach_link__doi':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,identifier;lookuptype:icontains&fields=id,identifier`;
    case 'attach_link__locality':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`;
    case 'attach_link__drillcore':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,drillcore,drillcore_en;lookuptype:icontains&fields=id,drillcore,drillcore_en`;
    case 'attach_link__drillcore_box':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,drillcore__drillcore,drillcore__drillcore_en,number;lookuptype:icontains&fields=id,drillcore__drillcore,drillcore__drillcore_en,number`;
    case 'attach_link__preparation':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,preparation_number;lookuptype:icontains&fields=id,preparation_number`;
    case 'attach_link__reference':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,reference;lookuptype:icontains&fields=id,reference`;
    case 'attach_link__storage':
      return `${type.split('__')[1]}/?multi_search=value:${value};fields:id,location,contents;lookuptype:icontains&fields=id,location,contents`;
    default:
      return ''
  }
}

export default autocompleteMixin
