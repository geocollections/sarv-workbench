<template>
  <div>
    {{searchParameters}}
    {{response}}

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faSort} from '@fortawesome/free-solid-svg-icons'
  import {faSortUp} from '@fortawesome/free-solid-svg-icons'
  import {faSortDown} from '@fortawesome/free-solid-svg-icons'


  library.add(faSort, faSortUp, faSortDown)

  export default {
    components: {
      FontAwesomeIcon,
      Spinner,
    },
    props: {
      apiCall: {
        type: Function
      },
      title: {
        type: String,
        default: null
      },
      searchParameters: {
        type: Object,
        default: null
      },
      searchHistory: {
        type: String,
        default: null
      },
      viewType: {
        type: String,
        default: null
      }
    },
    name: "ListModuleCore",
    data() {
      return {
        noResults: null,
        isLoading: false,
        response: {
          count: 0,
          results: []
        },
      }
    },

    metaInfo() {
      return {
        title: this.$t(this.title)
      }
    },

    computed: {
      sort() {
        return faSort
      },

      sortingDirection() {
        return this.searchParameters.orderBy.includes('-') ? faSortDown : faSortUp
      }
    },
    watch: {
      'searchParameters': {
        handler: function () {
          this.search(this.searchParameters)
        },
        deep: true
      },
      'isListView'(newVal, oldVal) {
        this.$localStorage.set(this.viewType, newVal)
      }
    },

    mounted: function () {
      const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue')
      if (searchHistory !== 'fallbackValue' && Object.keys(searchHistory).length !== 0 && searchHistory.constructor === Object) {
        this.$emit('search-params-changed',searchHistory);
      } else {
        this.search(this.searchParameters)
      }

      this.isListView = this.$localStorage.get(this.viewType, false)
    },

    methods: {
      search(searchParameters) {

        this.isLoading = true

        this.$localStorage.set(this.searchHistory, searchParameters)
        this.$emit('search-params-changed',searchParameters);

        this.apiCall().then(response => {
          if (response.status === 200) {
            if (response.body.count === 0) this.noResults = true
            if (response.body.count > 0) this.noResults = false
            this.response.count = response.body.count
            this.response.results = response.body.results
          }
          this.isLoading = false
        }, errResponse => {
          this.isLoading = false
        })
      },

      // Deletes local storage value + resets search parameters to default
      deleteSearchPreferences() {
        this.$localStorage.remove(this.searchHistory)
        this.$localStorage.remove(this.viewType)
        this.$emit('set-default-search-params',true);
        this.isListView = false
      }
    }
  }
</script>

<style scoped>

</style>
