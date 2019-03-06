import {autocompleSearch} from "@/assets/js/api/apiCalls";
import formManipulation from "@/components/mixins/formManipulation";
const autocompleteFieldManipulation = {
  mixins:[formManipulation],
  methods: {
    getAutocompleteQueryParameters(type, val) {
      let query = '';
      switch (type) {
        case 'locality':
          query = `locality/?multi_search=value:${val};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`;
          break;
        case 'stratigraphy_top':
        case 'stratigraphy_base':
          query = `stratigraphy/?multi_search=value:${val};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&fields=id,stratigraphy,stratigraphy_en`;
          break;
        case 'agent':
          query = `agent/?multi_search=value:${val};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent`;
          break;
        default:
          break;
      }
      return query
    },

    autcompleteLocalitySearch(value) {
      this.autocompliteSearch(value, 'locality', 'parent')
    },
    autcompleteStratigraphyTopSearch(value) {
      this.autocompliteSearch(value, 'stratigraphy_top', 'stratigraphy_top')
    },
    autcompleteStratigraphyBaseSearch(value) {
      this.autocompliteSearch(value, 'stratigraphy_base', 'stratigraphy_base')
    },
    autcompleteAgentSearch(value) {
      this.autocompliteSearch(value, 'agent', 'coord_det_agent')
    },
    autocompliteSearch(value, type, options) {
      if (value.length < 3) this.autocomplete[options] = [];
      if (value.length > 2) {
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
