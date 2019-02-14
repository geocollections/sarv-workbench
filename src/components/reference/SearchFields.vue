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
          const fields = this.buildFields(newVal)
          this.$emit('search-data', fields)
        },
        deep: true
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
    }
  }
</script>

<style scoped>

</style>
