import {autocompleSearch} from "@/assets/js/api/apiCalls";
const autocompleteFieldManipulation = {
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
    rockLabel() {
      return this.$i18n.locale === 'ee' ? 'name' : 'name_en'
    },
    analysisMethodLabel() {
      return this.$i18n.locale === 'ee' ? 'analysis_method' : 'method_en'
    }
  },
  methods: {
    getAutocompleteQueryParameters(type, val) {
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
        case 'agent':
        case 'owner':
          query = `agent/?multi_search=value:${val};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent`;
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
          query = `reference/?multi_search=value:${val};fields:reference;lookuptype:icontains&fields=id,reference,pages,figures,remarks`;
          break;
        case 'synonym':
          query = `locality_synonym/?multi_search=value:${val};fields:synonym;lookuptype:icontains&fields=id,synonym,reference__reference,pages,remarks`;
          break;
        case 'attachment':
          query = `attachment/?multi_search=value:${val};fields:original_filename;lookuptype:icontains&fields=id,original_filename,remarks`;
          break;
        case 'taxon':
          query = `taxon/?multi_search=value:${val};fields:taxon;lookuptype:icontains&fields=id,taxon`;
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
    autcompleteLocalitySearch(value) {
      this.autocompliteSearch(value, 'locality', 'locality')
    },
    autcompleteTaxonSearch(value) {
      this.autocompliteSearch(value, 'taxon', 'taxon')
    },
    autcompleteStratigraphySearch(value) {
      this.autocompliteSearch(value, 'stratigraphy', 'stratigraphy')
    },
    autcompleteLithostratigraphySearch(value) {
      this.autocompliteSearch(value, 'lithostratigraphy', 'lithostratigraphy')
    },
    autcompleteStorageSearch(value) {
      this.autocompliteSearch(value, 'storage', 'storage')
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
    autcompleteReferenceSearch(value) {
      this.autocompliteSearch(value, 'reference', 'reference')
    },
    autcompleteSynonymSearch(value) {
      this.autocompliteSearch(value, 'synonym', 'synonym')
    },
    autcompleteAttachmentSearch(value) {
      this.autocompliteSearch(value, 'attachment', 'attachment')
    },
    autocompliteSearch(value, type, options, minLength = 3) {
      if (value.length < minLength) this.autocomplete[options] = [];
      if (value.length > minLength-1) {
        let query = this.getAutocompleteQueryParameters(type, value)
        if (query.length === 0) return
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
}


export default autocompleteFieldManipulation
