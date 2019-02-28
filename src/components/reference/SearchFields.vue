<template>
  <div class="search-fields">

    <div class="row">

      <!-- AUTHOR -->
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('editReference.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input v-model="searchParameters.author" id="author" type="text"></b-form-input>
      </div>

      <!-- YEAR-->
      <div class="col-sm-2">
        <label :for="`year`">{{ $t('editReference.year') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input v-model="searchParameters.year" id="year" type="number"></b-form-input>
      </div>
    </div>


    <div class="row">

      <!-- TITLE -->
      <div class="col-sm-2">
        <label :for="`title`">{{ $t('editReference.title') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="title" v-model="searchParameters.title" type="text"></b-form-input>
      </div>

      <!-- BOOK + JOURNAL -->
      <div class="col-sm-2">
        <label :for="`book_journal`">{{ $t('editReference.bookJournal') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="book_journal" v-model="searchParameters.bookJournal" type="text"></b-form-input>
      </div>
    </div>


    <div class="row">

      <!-- ABSTRACT + KEYWORDS + REMARKS -->
      <div class="col-sm-2">
        <label :for="`abstract_keywords_remarks`">{{ $t('editReference.abstractKeywordsRemarks') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="abstract_keywords_remarks" v-model="searchParameters.abstractKeywordsRemarks" type="text"></b-form-input>
      </div>

      <!-- ID -->
      <div class="col-sm-2">
        <label :for="`id`">{{ $t('editReference.id') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input v-model="searchParameters.id" id="id" type="number"></b-form-input>
      </div>
    </div>

    <!-- Removes search preferences like local storage and search parameters-->
    <div class="row mt-3">
      <div class="col">
        <b-button variant="danger" @click="deleteSearchPreferences">{{ $t('buttons.deletePreferences') }}</b-button>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: "SearchFields",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        searchParameters: {
          author: null,
          year: null,
          title: null,
          bookJournal: null,
          abstractKeywordsRemarks: null,
          id: null,
        },
      }
    },

    watch: {
      'searchParameters': {
        handler: function (newVal, oldVal) {
          console.log(newVal)
          const fields = this.buildFields(newVal)

          // Saves user preferences to local storage, in the future it should save it to API, #106
          this.$localStorage.set('referenceSearchHistory', newVal)

          this.$emit('search-data', fields)
        },
        deep: true
      }
    },

    created: function () {
      // Gets user preferences from local storage
      const referenceSearchHistory = this.$localStorage.get('referenceSearchHistory', 'fallbackValue')

      // Initial References.vue search is triggered here, if user has preferences
      // then search is emitted in watcher otherwise it is emitted here.
      if (referenceSearchHistory !== 'fallbackValue' && Object.keys(referenceSearchHistory).length !== 0 && referenceSearchHistory.constructor === Object) {
        // Checking if any of the search fields data is included in local storage, if it isn't then it shouldn't be added to this.searchParameters
        if (typeof referenceSearchHistory.author !== 'undefined') {
          this.searchParameters = referenceSearchHistory
        }
      } else {
        const fields = this.buildFields(this.searchParameters)
        this.$emit('search-data', fields)
      }
    },

    methods: {

      buildFields(data) {
        let fields = ''

        if (data.author !== null && data.author.trim().length > 0) {
          fields += 'author__icontains=' + data.author
        }

        if (data.year !== null && data.year.trim().length > 0) {
          fields += '&year__icontains=' + data.year
        }

        if (data.title !== null && data.title.trim().length > 0) {
          fields += '&multi_search=value:' + data.title + ';fields:title,title_original;lookuptype:icontains'
        }

        if (data.bookJournal !== null && data.bookJournal.trim().length > 0) {
          fields += '&multi_search=value:' + data.bookJournal + ';fields:book,journal__journal_name;lookuptype:icontains'
        }

        if (data.abstractKeywordsRemarks !== null && data.abstractKeywordsRemarks.trim().length > 0) {
          fields += '&multi_search=value:' + data.abstractKeywordsRemarks + ';fields:abstract,tags,remarks;lookuptype:icontains'
        }

        if (data.id !== null && data.id.trim().length > 0) {
          fields += '&id__icontains=' + data.id
        }

        if (fields.startsWith('&')) fields = fields.substring(1)

        return fields
      },

      // Deletes local storage value + resets search parameters to default
      deleteSearchPreferences() {
        this.$localStorage.remove('referenceSearchHistory')
        this.searchParameters = {
          author: null,
          year: null,
          title: null,
          bookJournal: null,
          abstractKeywordsRemarks: null,
          id: null,
        }
      }
    }
  }
</script>

<style scoped>

</style>
