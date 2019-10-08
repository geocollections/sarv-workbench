<template>
  <div class="journal">

    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border-top px-2 mb-2" :style="!validate('journal') ? 'border-color: #dc3545!important;' : ''" id="block-requiredFields">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('journal') }"
              @click="block.requiredFields = !block.requiredFields">
        {{ $t('journal.requiredFields') }}
        <i v-if="validate('journal')" class="fas fa-check text-success"></i>
        <i v-if="!validate('journal')" class="fas fa-exclamation-triangle text-danger"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.requiredFields">

          <!-- JOURNAL NAME -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`journal_name`">{{ $t('journal.journalName') }}:</label>
              <b-form-input id="journal_name" v-model="journal.journal_name" :state="isNotEmpty(journal.journal_name)" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- GENERAL INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-info">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('journal.generalInfo') }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.info">

          <!-- JOURNAL SHORT and PUBLISHER -->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`journal_short`">{{ $t('journal.journalShort') }}:</label>
              <b-form-input id="journal_short" v-model="journal.journal_short" type="text"></b-form-input>
            </div>

            <div class="col-sm-6">
              <label :for="`publisher`">{{ $t('journal.publisher') }}:</label>
              <b-form-input id="publisher" v-model="journal.publisher" type="text"></b-form-input>
            </div>
          </div>

          <!-- REMARKS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t('journal.remarks') }}:</label>
              <b-form-textarea id="remarks" v-model="journal.remarks" type="text"
                               :no-resize="true" :rows="1" :max-rows="3"></b-form-textarea>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import formManipulation from "../../mixins/formManipulation";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {mapState} from "vuex";
  import {fetchJournal} from "../../assets/js/api/apiCalls";

  export default {
    name: "Journal",

    components: {
      Spinner,
    },

    mixins: [formManipulation, formSectionsMixin],

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('journal') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'journalSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_JOURNALS',
          title: 'header.journals',
          object: 'journal',
          field: 'journal_name',
          block: this.block,
          agent: this.currentUser
        });
      }

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function () {
          this.reloadData()
        },
        deep: true
      },
    },

    computed: {
      ...mapState(["currentUser"])
    },

    methods: {
      setInitialData() {
        return {
          searchHistory: 'journalSearchHistory',
          copyFields: ['id', 'journal_name', 'journal_short', 'publisher', 'remarks'],
          requiredFields: ['journal_name'],
          journal: {},
          block: {requiredFields: true, info: true},
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'journal');

          fetchJournal(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.journal = this.handleResponse(response)[0];

              this.removeUnnecessaryFields(this.journal, this.copyFields);
              this.$emit('data-loaded', this.journal);
              this.sendingData = false;
            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
            }
          });
        }
      },

      formatDataForUpload(objectToUpload) {
        console.log('This object is sent in string format:');
        console.log(objectToUpload);
        return JSON.stringify(objectToUpload)
      },

      setDefaultSearchParameters() {
        return {
          journal: null,
          publisher: null,
          remarks: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
    }
  }
</script>

<style scoped>
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
