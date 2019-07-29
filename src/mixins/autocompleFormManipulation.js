import {autocompleSearch} from "@/assets/js/api/apiCalls";
import permissionsMixin from "./permissionsMixin";
const autocompleteFieldManipulation = {
  mixins: [permissionsMixin],
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
    }
  },
  methods: {
    getAutocompleteQueryParameters(type, val, isPrivate = 0) {
      let query = '';
      switch (type) {
        case 'analysis':
          query = `analysis/?multi_search=value:${val};fields:id;lookuptype:icontains&fields=id,analysis_method__analysis_method,analysis_method__method_en`;
          break;
        case 'preparation':
          query = `preparation/?multi_search=value:${val};fields:preparation_number,id;lookuptype:icontains&fields=id,preparation_number`;
          break;
        case 'locality':
          query = `locality/?multi_search=value:${val};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`;
          break;
        case 'storage_additional':
        case 'storage':
          query = `location/?multi_search=value:${val};fields:location;lookuptype:icontains&fields=id,location`;
          break;
        case 'stratigraphy':
          query = `stratigraphy/?multi_search=value:${val};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&type__value_en=chronostratigraphy&fields=id,stratigraphy,stratigraphy_en`;
          break;
        case 'lithostratigraphy':
          query = `stratigraphy/?multi_search=value:${val};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&type__value_en=lithostratigraphy&fields=id,stratigraphy,stratigraphy_en`;
          break;
        case 'stratigraphy_top':
        case 'stratigraphy_base':
          query = `stratigraphy/?multi_search=value:${val};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&fields=id,stratigraphy,stratigraphy_en`;
          break;
        case 'projectagent':
        case 'library_agent':
        case 'agent':
        case 'owner':
        case 'agent_collected':
        case 'copyright_agent':
          query = `agent/?multi_search=value:${val};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent,forename,surename`;
          break;
        case 'rock':
          query = `rock/?multi_search=value:${val};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en`;
          break;
        case 'sample':
          query = `sample/?multi_search=value:${val};fields:number;lookuptype:icontains&fields=id,number`;
          break;
        case 'series': //sample series
          query = `sample_series/?multi_search=value:${val};fields:name;lookuptype:icontains&fields=id,name`;
          break;
        case 'specimen':
          query = `specimen/?multi_search=value:${val};fields:specimen_id;lookuptype:icontains&fields=id,specimen_id`;
          break;
        case 'reference':
          query = `reference/?multi_search=value:${val};fields:reference,id;lookuptype:icontains&fields=id,reference,pages,figures,remarks`;
          break;
        case 'synonym':
          query = `locality_synonym/?multi_search=value:${val};fields:synonym;lookuptype:icontains&fields=id,synonym,reference__reference,pages,remarks`;
          break;
        case 'attachment':
          query = `attachment/?multi_search=value:${val};fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains&fields=id,author__agent,original_filename,description,description_en,remarks,uuid_filename`;
          break;
        case 'attachment_public':
          query = `attachment/?multi_search=value:${val};fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains&is_private=${isPrivate}&fields=id,author__agent,original_filename,description,description_en,remarks,uuid_filename`;
          break;
        case 'attachment3':
          query = `attachment/?multi_search=value:${val};fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains&or_search=user_added__iexact:${this.currentUser.user};is_private__iexact:0&fields=id,author__agent,original_filename,description,description_en,remarks,uuid_filename`;
          break;
        // case 'attachment':
        //   query = `attachment/?multi_search=value:${val};fields:original_filename;lookuptype:icontains&fields=id,original_filename,remarks`;
        //   break;
        case 'taxon':
          query = `taxon/?multi_search=value:${val};fields:taxon;lookuptype:icontains&fields=id,taxon`;
          break;
        case 'project':
        case 'parent_project':
          query = `project/?multi_search=value:${val};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en`;
          break;
        case 'library':
          query = `library/?multi_search=value:${val};fields:id,title,title_en;lookuptype:icontains&author=${this.currentUser.id}&fields=id,title,title_en`;
          break;
        case 'journals':
          query = `journal/?multi_search=value:${val};fields:id,journal_name,journal_short;lookuptype:icontains`;
          break;
        case 'site':
          query = `site/?multi_search=value:${val};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en`;
          break;
        case 'dataset':
          query += `dataset/?multi_search=value:${val};fields:id,name,name_en;lookuptype:icontains&fields=id,name,name_en`;
          break;
        case 'doi_agent':
          query += `agent/?multi_search=value:${val};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent,institution__institution_name_en`;
          break;
        case 'library_agent_search':
          query = `library_agent/?agent=${this.currentUser.id}&multi_search=value:${val};fields:library__title,library__title_en;lookuptype:icontains&fields=library,library__title,library__title_en`;
          break;
        case 'coll':
          query = `collection/?number__icontains=${val}&fields=id,number`;
          break;
        case 'classification':
          query = `classification/?multi_search=value:${val};fields:id,class_field,class_en;lookuptype:icontains&fields=id,class_field,class_en`;
          break;
        default:
          break;
      }
      return query
    },
    autcompleteAnalysisSearch(value) {
      this.autocompliteSearch(value, 'analysis', 'analysis')
    },
    autcompletePreparationSearch(value) {
      this.autocompliteSearch(value, 'preparation', 'preparation')
    },
    autcompleteParentProjectSearch(value) {
      this.autocompliteSearch(value, 'parent_project', 'parent_project')
    },
    autcompleteProjectSearch(value) {
      this.autocompliteSearch(value, 'project', 'project')
    },
    autcompleteLocalitySearch(value) {
      this.autocompliteSearch(value, 'locality', 'locality')
    },
    autcompleteLocalitySearch2(value) {
      this.autocompliteSearch(value, 'locality', 'locality', 3, false)
    },
    autcompleteTaxonSearch(value) {
      this.autocompliteSearch(value, 'taxon', 'taxon')
    },
    autcompleteStratigraphySearch(value) {
      this.autocompliteSearch(value, 'stratigraphy', 'stratigraphy')
    },
    autcompleteStratigraphySearch2(value) {
      this.autocompliteSearch(value, 'stratigraphy', 'stratigraphy', 3, false)
    },
    autcompleteLithostratigraphySearch(value) {
      this.autocompliteSearch(value, 'lithostratigraphy', 'lithostratigraphy')
    },
    autcompleteLithostratigraphySearch2(value) {
      this.autocompliteSearch(value, 'lithostratigraphy', 'lithostratigraphy', 3, false)
    },
    autcompleteStorageSearch(value) {
      this.autocompliteSearch(value, 'storage', 'storage')
    },
    autcompleteStorageSearch2(value) {
      this.autocompliteSearch(value, 'storage', 'storage', 3, false)
    },
    autcompleteAdditionalStorageSearch(value) {
      this.autocompliteSearch(value, 'storage_additional', 'storage_additional')
    },
    autcompleteStratigraphyTopSearch(value) {
      this.autocompliteSearch(value, 'stratigraphy_top', 'stratigraphy_top')
    },
    autcompleteStratigraphyBaseSearch(value) {
      this.autocompliteSearch(value, 'stratigraphy_base', 'stratigraphy_base')
    },
    autcompleteAgentSearch(value) {
      this.autocompliteSearch(value, 'agent', 'agent')
    },
    autcompleteOwnerSearch(value) {
      this.autocompliteSearch(value, 'owner', 'agent')
    },
    autcompleteCopyrightAgentSearch(value) {
      this.autocompliteSearch(value, 'copyright_agent', 'copyright_agent')
    },
    autcompleteProjectAgentSearch(value) {
      this.autocompliteSearch(value, 'projectagent', 'agent')
    },
    autcompleteLibraryAgentSearch(value) {
      this.autocompliteSearch(value, 'library_agent', 'library_agent', 1)
    },
    autcompleteLibraryAgentSearch2(value) {
      this.autocompliteSearch(value, 'library_agent_search', 'library', 1)
    },
    autcompleteRockSearch(value) {
      this.autocompliteSearch(value, 'rock', 'rock')
    },
    autcompleteSampleSeriesSearch(value) {
      this.autocompliteSearch(value, 'series', 'series')
    },
    autcompleteSampleSearch(value) {
      this.autocompliteSearch(value, 'sample', 'sample',1)
    },
    autcompleteSpecimenSearch(value) {
      this.autocompliteSearch(value, 'specimen', 'specimen')
    },
    autcompleteSiteSearch(value) {
      this.autocompliteSearch(value, 'site', 'site')
    },
    autcompleteReferenceSearch(value) {
      this.autocompliteSearch(value, 'reference', 'reference')
    },
    autcompleteSynonymSearch(value) {
      this.autocompliteSearch(value, 'synonym', 'synonym')
    },
    autcompleteAttachmentSearch(value) {
      this.autocompliteSearch(value, 'attachment', 'attachment')
    },
    autcompleteAttachmentSearch2(value) {
      this.autocompliteSearch(value, 'attachment', 'attachment',3, false)
    },
    autcompleteAttachmentSearch3(value) {
      this.autocompliteSearch(value, 'attachment3', 'attachment',3, false)
    },
    autcompletePublicAttachmentSearch(value) {
      this.autocompliteSearch(value, 'attachment_public', 'attachment',3, false)
    },
    autcompleteJournalSearch(value) {
      this.autocompliteSearch(value, 'journals', 'journals', 1)
    },
    autcompleteLibrarySearch(value) {
      this.autocompliteSearch(value, 'library', 'library', 1, false)
    },
    autcompleteDoiReferenceSearch(value) {
      this.autocompliteSearch(value, 'reference', 'reference', 3, false)
    },
    autcompleteDatasetSearch(value) {
      this.autocompliteSearch(value, 'dataset', 'dataset', 1, false)
    },
    autcompleteLabSearch(value) {
      this.autocompliteSearch(value, 'lab', 'lab', 1, false)
    },
    autcompleteInstrumentSearch(value) {
      this.autocompliteSearch(value, 'instrument', 'instrument', 1, false)
    },
    autcompleteDoiAgentSearch(value) {
      this.autocompliteSearch(value, 'doi_agent', 'doi_agent', 3, false)
    },
    autcompleteCollSearch(value) {
      this.autocompliteSearch(value, 'coll', 'coll', 2, false)
    },
    autcompleteAgentCollectedSearch(value) {
      this.autocompliteSearch(value, 'agent_collected', 'agent_collected', 2, false)
    },
    autcompleteClassificationSearch(value) {
      this.autocompliteSearch(value, 'classification', 'classification', 2, false)
    },
    autocompliteSearch(value, type, options, minLength = 3, resetIfLessThanMinLength = true) {
      if (value.length < minLength) {
        if (resetIfLessThanMinLength) this.autocomplete[options] = [];
      } else if (value.length >= minLength) {
        let query = this.getAutocompleteQueryParameters(type, value)
        if (query.length === 0) return;
        this.autocomplete.loaders[type] = true;
        autocompleSearch(query).then((response) => {
          this.autocomplete.loaders[type] = false;
          this.autocomplete[options] = this.handleResponse(response)
        });
      }
    },

    handleResponse(response){
      if (response.status === 200) {
        return (response.body.count > 0) ? response.body.results : []
      }
    },
  }
};

export default autocompleteFieldManipulation
