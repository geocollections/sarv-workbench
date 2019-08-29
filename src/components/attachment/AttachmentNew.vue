<template>
  <attachment-wrapper :is-photo-archive="isPhotoArchive"
                      :is-specimen-image="isSpecimenImage"
                      :is-other-file="isOtherFile"
                      :is-digitised-reference="isDigitisedReference"
  >
    <template v-slot:loader>
      <spinner v-show="sendingData" class="loading-overlay" size="massive"
               :message="$route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')"></spinner>
    </template>

    <template v-slot:file-input>
      {{fileInputFormat}}
      <multimedia-component :record-options="true"
                            :acceptable-format="fileInputFormat"
                            :accept-multiple="true"/>
    </template>

  </attachment-wrapper>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import Editor from "../partial/editor/Editor";
  import Datepicker from 'vue2-datepicker'
  import cloneDeep from 'lodash/cloneDeep'
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteMixin from "../../mixins/autocompleteMixin";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {mapState} from "vuex";
  import {fetchAttachment} from "../../assets/js/api/apiCalls";
  import AttachmentWrapper from "./AttachmentWrapper";
  import MultimediaComponent from "../partial/MultimediaComponent";

  export default {
    name: "AttachmentNew",

    components: {
      MultimediaComponent,
      AttachmentWrapper,
      Editor,
      Spinner,
      Datepicker
    },

    mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

    data() {
      return this.setInitialData()
    },

    computed: {
      ...mapState(["databaseId", "currentUser"]),

      isPhotoArchive() {
        return this.$route.meta.isEdit ? this.attachment.specimen_image_attachment === 2 : this.$route.meta.child === 'photo_archive';
      },

      isSpecimenImage() {
        return this.$route.meta.isEdit ? this.attachment.specimen_image_attachment === 1 : this.$route.meta.child === 'specimen_image';
      },

      isOtherFile() {
        return this.$route.meta.isEdit ? this.attachment.specimen_image_attachment === 3 : this.$route.meta.child === 'other_file';
      },

      isDigitisedReference() {
        return this.$route.meta.isEdit ? this.attachment.specimen_image_attachment === 4 : this.$route.meta.child === 'digitised_reference';
      },

      fileInputFormat() {
        if (this.isPhotoArchive) return 'image/*';
        else if (this.isSpecimenImage) return '*';
        else if (this.isOtherFile) return '*';
        else if (this.isDigitisedReference) return '.pdf';
        else return 'image/*'
      }
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('filename') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'attachmentSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_ATTACHMENTS',
          title: 'header.attachments',
          object: 'attachment',
          field: 'original_filename',
          databaseId: this.databaseId,
          block: this.block
        });
      } else {
        // Adding specimen default values from local storage
        const attachmentHistory = this.$localStorage.get('attachment', 'fallbackValue');
        if (attachmentHistory !== 'fallbackValue' && Object.keys(attachmentHistory).length !== 0 && attachmentHistory.constructor === Object) {
          this.specimen = attachmentHistory
        }
      }

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.setInitialData();
          this.reloadData()
        },
        deep: true
      },
      'relatedData.searchParameters': {
        handler: function (newVal, oldVal) {
          // this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
    },

    methods: {
      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          relatedTabs: [
            { name: 'specimen_identification', iconClass: 'fas fa-atlas' },
          ],
          searchHistory: 'attachmentSearchHistory',
          activeTab: 'specimen_identification',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'specimen_image_attachment'],
          autocomplete: {
            loaders: {
              coll: false,
            },
            coll: [],
          },
          requiredFields: ['id'],
          attachment: {},
          searchParameters: this.setDefaultSearchParameters(),
          block: {requiredFields: true, info: true, description: true},
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        // fetching list autocompletes
        // fetchListSpecimenKind().then(response => this.autocomplete.specimen_kind = this.handleResponse(response));

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'attachment');
          fetchAttachment(this.$route.params.id).then(response => {
            // Todo: Uncomment in production
            // fetchAttachment(this.$route.params.id, this.currentUser).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.attachment = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.attachment);

              this.removeUnnecessaryFields(this.attachment, this.copyFields);
              this.attachment.related_data = {};

              this.$emit('data-loaded', this.attachment);
              this.sendingData = false;
            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
            }
          });

          // Fetching autocomplete fields for related data
          // fetchListIdentificationType().then(response => this.autocomplete.list_identification_type = this.handleResponse(response));

          // Load Related Data which is in tabs
          this.relatedTabs.forEach(entity => {
            // this.loadRelatedData(entity.name);
          });

          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.relatedTabs.map(entity => entity.name));

          this.setActiveTab('specimen_identification')
        }
      },

      setDefaultRelatedData() {
        return {
          specimen_identification: [],
          new: {
            specimen_identification: [],
          },
          copyFields: {
            specimen_identification: ['taxon', 'name', 'agent', 'reference', 'date_identified', 'type', 'current'],
            },
          insert: {
            specimen_identification: {},
            },
          searchParameters: {
            specimen_identification: {
              page: 1,
              paginateBy: 10,
              orderBy: 'taxon__taxon,current'
            },
          },
          count: {
            specimen_identification: 0,
          }
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload);

        if (!this.$route.meta.isEdit) this.$localStorage.set('attachment', objectToUpload)

        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === 1 ? '1' : '0';
        // if (this.isDefinedAndNotNull(objectToUpload.date_collected)) uploadableObject.date_collected = this.formatDateForUpload(objectToUpload.date_collected);

        // Autocomplete fields
        if (this.isDefinedAndNotNull(objectToUpload.coll)) uploadableObject.coll = objectToUpload.coll.id;

        if (this.databaseId) uploadableObject.database = this.databaseId;

        // Adding related data
        if (saveRelatedData) {
          uploadableObject.related_data = {}
        }

        console.log('This object is sent in string format:');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.attachment.coll = { id: obj.coll, number: obj.coll__number };
      },

      fillRelatedDataAutocompleteFields(obj) {

        if (this.isDefinedAndNotNull(obj.taxon)) obj.taxon = { id: obj.taxon, taxon: obj.taxon__taxon };

        return obj
      },

      loadRelatedData(object) {
        let query;

        if (object === 'specimen_identification') {
          // query = fetchSpecimenIdentifications(this.$route.params.id, this.relatedData.searchParameters.specimen_identification)
        }

        return new Promise(resolve => {
          query.then(response => {
            this.relatedData[object] = this.handleResponse(response);
            this.relatedData.count[object] = response.body.count;
            resolve(true)
          });
        });
      },

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.attachment = this.attachment.id;

        // Todo: Use foreach because DRY basically

        if (this.isDefinedAndNotNull(uploadableObject.taxon)) {
          uploadableObject.taxon = uploadableObject.taxon.id ? uploadableObject.taxon.id : uploadableObject.taxon;
        }
        if (this.isDefinedAndNotNull(uploadableObject.date_identified)) {
          uploadableObject.date_identified = this.formatDateForUpload(uploadableObject.date_identified);
        }

        console.log('This object is sent in string format (related_data):');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      setDefaultSearchParameters() {
        return {
          image_number: null,
          filename: null,
          specimen: null,
          imageInfo: null,
          locality: null,
          specimen_image_attachment: ['2', '1', '3', '4'],
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
    }
  }
</script>

<style scoped>

</style>
