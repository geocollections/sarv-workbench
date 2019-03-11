import {autocompleSearch} from "@/assets/js/api/apiCalls";
import formManipulation from "@/components/mixins/formManipulation";
const autocompleteFieldManipulation = {
  mixins:[formManipulation],
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
    }
  },
  methods: {
    getAutocompleteQueryParameters(type, val) {
      let query = '';
      switch (type) {
        case 'locality':
          query = `locality/?multi_search=value:${val};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`;
          break;
        case 'stratigraphy':
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
        default:
          break;
      }
      return query
    },
    autcompleteLocalitySearch(value) {
      this.autocompliteSearch(value, 'locality', 'locality')
    },
    autcompleteStratigraphySearch(value) {
      this.autocompliteSearch(value, 'stratigraphy', 'stratigraphy')
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
      this.autocompliteSearch(value, 'specimen', 'specimen',1)
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
  }
}


export default autocompleteFieldManipulation
