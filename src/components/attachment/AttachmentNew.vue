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

    <!-- TODO: ROUTE CHANGE/UPDATE MUST CLEAR INSERTED USER DATA!!! -->

    <template v-slot:file-input>
      <multimedia-component :record-options="recordOptions"
                            :record-image="recordImage"
                            :record-video="recordVideo"
                            :record-audio="recordAudio"
                            :acceptable-format="fileInputFormat"
                            :accept-multiple="acceptMultiple"/>
    </template>


    <template v-slot:photo-archive>
      <div class="photo-archive">

        <!-- REQUIRED INFO -->
        <fieldset class="border-top px-2 mb-2" id="block-requiredFields"
                  :style="!validate('attachment', 'photo_archive') ? 'border-color: #dc3545!important;' : ''">
          <legend class="w-auto my-0"
                  :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('attachment', 'photo_archive') }"
                  @click="block.requiredFields = !block.requiredFields">
            {{ $t('attachment.requiredFields') }}
            <font-awesome-icon v-if="validate('attachment', 'photo_archive')" color="#28a745" icon="check"/>
            <font-awesome-icon v-if="!validate('attachment', 'photo_archive')" color="#dc3545" icon="exclamation-triangle"/>
          </legend>

          <transition name="fade">
            <div v-show="block.requiredFields">

              <!-- AUTHOR, AUTHOR FREE and IMAGESET -->
              <div class="row">
                <div class="col-md-4">
                  <label :for="`author`">{{ $t('attachment.author') }}:</label>
                  <vue-multiselect v-model="attachment.author"
                                   id="author"
                                   label="agent"
                                   track-by="id"
                                   :placeholder="$t('add.inputs.autocomplete')"
                                   :loading="autocomplete.loaders.agent"
                                   :options="autocomplete.agent"
                                   :class="{ valid:  isNotEmpty(attachment.author) || isNotEmpty(attachment.author_free), invalid: !(isNotEmpty(attachment.author) || isNotEmpty(attachment.author_free)) }"
                                   @search-change="autocompleteAgentSearch"
                                   :internal-search="false"
                                   :preserve-search="true"
                                   :clear-on-select="false"
                                   :show-labels="false">
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option.agent }}</strong>
                    </template>
                    <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                  </vue-multiselect>
                </div>


                <div class="col-md-4">
                  <label :for="`author_free`">{{ $t('attachment.author_free') }}:</label>
                  <b-form-input id="author_free" v-model="attachment.author_free"
                                :state="isNotEmpty(attachment.author_free) || isNotEmpty(attachment.author)"
                                type="text"></b-form-input>
                </div>


                <div class="col-md-4">
                  <div class="d-flex">
                    <div class="flex-grow-1 mr-3">
                      <label :for="`imageset`">{{ $t('attachment.imageset') }}:</label>
                      <vue-multiselect v-model="attachment.imageset"
                                       id="imageset"
                                       label="imageset_number"
                                       track-by="id"
                                       :placeholder="$t('add.inputs.autocomplete')"
                                       :loading="autocomplete.loaders.imageset"
                                       :options="autocomplete.imageset"
                                       :class="{ valid: isNotEmpty(attachment.imageset), invalid: !isNotEmpty(attachment.imageset) }"
                                       @search-change="autocompleteImagesetSearch"
                                       :internal-search="false"
                                       :preserve-search="true"
                                       :clear-on-select="false"
                                       :show-labels="false">
                        <template slot="singleLabel" slot-scope="{ option }">
                          <strong>{{ option.imageset_number }}</strong>
                        </template>
                        <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                      </vue-multiselect>
                    </div>

                    <div class="align-self-end">
                      <router-link :to="{ path: '/imageset/add' }" class="btn btn-outline-info" :title="$t('add.inputs.newImageset')">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                      </router-link>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </transition>
        </fieldset>

        <!-- GENERAL INFO -->
        <fieldset class="border-top px-2 mb-2" id="block-info">
          <legend class="w-auto my-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
            {{ $t('attachment.info') }}
            <font-awesome-icon icon="project-diagram"/>
          </legend>

          <transition name="fade">
            <div v-show="block.info">

              <!-- DATE_CREATED and DATE_CREATED_FREE -->
              <div class="row">
                <div class="col-md-6">
                  <label :for="`date_created`">{{ $t('attachment.dateCreated') }}:</label>
                  <datepicker id="date_created"
                              v-model="attachment.date_created"
                              lang="en"
                              :first-day-of-week="1"
                              format="DD MMM YYYY"
                              input-class="form-control"></datepicker>
                </div>


                <div class="col-md-6">
                  <label :for="`date_created_free`">{{ $t('attachment.dateCreatedFree') }}:</label>
                  <b-form-input id="date_created_free" v-model="attachment.date_created_free" type="text"></b-form-input>
                </div>
              </div>

              <!-- LOCALITY -->
              <div class="row">
                <div class="col-md-6">
                  <label :for="`image_place`">{{ $t('attachment.imagePlace') }}:</label>
                  <b-form-input id="image_place" v-model="attachment.image_place" type="text"></b-form-input>
                </div>

                <div class="col-md-6">
                  <label :for="`locality`">{{ $t('attachment.locality') }}:</label>
                  <vue-multiselect v-model="attachment.locality"
                                   id="locality"
                                   :label="localityLabel"
                                   track-by="id"
                                   :placeholder="$t('add.inputs.autocomplete')"
                                   :loading="autocomplete.loaders.locality"
                                   :options="autocomplete.locality"
                                   @search-change="autocompleteLocalitySearch"
                                   :internal-search="false"
                                   :preserve-search="true"
                                   :clear-on-select="false"
                                   :show-labels="false">
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option[localityLabel] }}</strong>
                    </template>
                    <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                  </vue-multiselect>
                </div>
              </div>

            </div>
          </transition>
        </fieldset>


      </div>
    </template>


    <template v-slot:specimen-image>
      <div class="specimen-image">

        <!-- REQUIRED INFO -->
        <fieldset class="border-top px-2 mb-2" id="block-requiredFields"
                  :style="!validate('attachment', 'photo_archive') ? 'border-color: #dc3545!important;' : ''">
          <legend class="w-auto my-0"
                  :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('attachment', 'photo_archive') }"
                  @click="block.requiredFields = !block.requiredFields">
            {{ $t('attachment.requiredFields') }}
            <font-awesome-icon v-if="validate('attachment', 'photo_archive')" color="#28a745" icon="check"/>
            <font-awesome-icon v-if="!validate('attachment', 'photo_archive')" color="#dc3545" icon="exclamation-triangle"/>
          </legend>

          <transition name="fade">
            <div v-show="block.requiredFields">

              <!-- AUTHOR and AUTHOR FREE -->
              <div class="row">
                <div class="col-md-6">
                  <label :for="`author`">{{ $t('attachment.author') }}:</label>
                  <vue-multiselect v-model="attachment.author"
                                   id="author"
                                   label="agent"
                                   track-by="id"
                                   :placeholder="$t('add.inputs.autocomplete')"
                                   :loading="autocomplete.loaders.agent"
                                   :options="autocomplete.agent"
                                   :class="{ valid:  isNotEmpty(attachment.author) || isNotEmpty(attachment.author_free), invalid: !(isNotEmpty(attachment.author) || isNotEmpty(attachment.author_free)) }"
                                   @search-change="autocompleteAgentSearch"
                                   :internal-search="false"
                                   :preserve-search="true"
                                   :clear-on-select="false"
                                   :show-labels="false">
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option.agent }}</strong>
                    </template>
                    <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                  </vue-multiselect>
                </div>


                <div class="col-md-6">
                  <label :for="`author_free`">{{ $t('attachment.author_free') }}:</label>
                  <b-form-input id="author_free" v-model="attachment.author_free"
                                :state="isNotEmpty(attachment.author_free) || isNotEmpty(attachment.author)"
                                type="text"></b-form-input>
                </div>
              </div>

            </div>
          </transition>
        </fieldset>

      </div>
    </template>


    <template v-slot:other-file>
      <div class="other-file">

        <!-- REQUIRED INFO -->
        <fieldset class="border-top px-2 mb-2" id="block-requiredFields"
                  :style="!validate('attachment', 'photo_archive') ? 'border-color: #dc3545!important;' : ''">
          <legend class="w-auto my-0"
                  :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('attachment', 'photo_archive') }"
                  @click="block.requiredFields = !block.requiredFields">
            {{ $t('attachment.requiredFields') }}
            <font-awesome-icon v-if="validate('attachment', 'photo_archive')" color="#28a745" icon="check"/>
            <font-awesome-icon v-if="!validate('attachment', 'photo_archive')" color="#dc3545" icon="exclamation-triangle"/>
          </legend>

          <transition name="fade">
            <div v-show="block.requiredFields">

              <!-- AUTHOR and AUTHOR FREE -->
              <div class="row">
                <div class="col-md-6">
                  <label :for="`author`">{{ $t('attachment.author') }}:</label>
                  <vue-multiselect v-model="attachment.author"
                                   id="author"
                                   label="agent"
                                   track-by="id"
                                   :placeholder="$t('add.inputs.autocomplete')"
                                   :loading="autocomplete.loaders.agent"
                                   :options="autocomplete.agent"
                                   :class="{ valid:  isNotEmpty(attachment.author) || isNotEmpty(attachment.author_free), invalid: !(isNotEmpty(attachment.author) || isNotEmpty(attachment.author_free)) }"
                                   @search-change="autocompleteAgentSearch"
                                   :internal-search="false"
                                   :preserve-search="true"
                                   :clear-on-select="false"
                                   :show-labels="false">
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option.agent }}</strong>
                    </template>
                    <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                  </vue-multiselect>
                </div>


                <div class="col-md-6">
                  <label :for="`author_free`">{{ $t('attachment.author_free') }}:</label>
                  <b-form-input id="author_free" v-model="attachment.author_free"
                                :state="isNotEmpty(attachment.author_free) || isNotEmpty(attachment.author)"
                                type="text"></b-form-input>
                </div>
              </div>

              <!-- DESCRIPTION and DESCRIPTION_EN -->
              <div class="row">
                <div class="col-md-6">
                  <label :for="`description`">{{ $t('attachment.description') }}:</label>
                  <b-form-textarea id="description" :state="isNotEmpty(attachment.description)" v-model="attachment.description" type="text"
                                   :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>

                  <b-form-text v-if="!isNotEmpty(attachment.description)">{{ $t('add.errors.emptyField') }}.</b-form-text>
                </div>

                <div class="col-md-6">
                  <label :for="`description_en`">{{ $t('attachment.descriptionEn') }}:</label>
                  <b-form-textarea id="description_en" :state="isNotEmpty(attachment.description_en)" v-model="attachment.description_en" type="text"
                                   :no-resize="true" :rows="3" :max-rows="3"></b-form-textarea>

                  <b-form-text v-if="!isNotEmpty(attachment.description_en)">{{ $t('add.errors.emptyField') }}.</b-form-text>
                </div>
              </div>

            </div>
          </transition>
        </fieldset>

      </div>
    </template>


    <template v-slot:digitised-reference>
      <div class="digitised-reference">

        <!-- REQUIRED INFO -->
        <fieldset class="border-top px-2 mb-2" id="block-requiredFields"
                  :style="!validate('attachment', 'photo_archive') ? 'border-color: #dc3545!important;' : ''">
          <legend class="w-auto my-0"
                  :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('attachment', 'photo_archive') }"
                  @click="block.requiredFields = !block.requiredFields">
            {{ $t('attachment.requiredFields') }}
            <font-awesome-icon v-if="validate('attachment', 'photo_archive')" color="#28a745" icon="check"/>
            <font-awesome-icon v-if="!validate('attachment', 'photo_archive')" color="#dc3545" icon="exclamation-triangle"/>
          </legend>

          <transition name="fade">
            <div v-show="block.requiredFields">

              <!-- REFERENCE -->
              <div class="row">
                <div class="col-md-6">
                  <label :for="`reference`">{{ $t('attachment.reference') }}:</label>
                  <vue-multiselect v-model="attachment.reference"
                                   id="reference"
                                   label="reference"
                                   track-by="id"
                                   :placeholder="$t('add.inputs.autocomplete')"
                                   :loading="autocomplete.loaders.reference"
                                   :options="autocomplete.reference"
                                   :class="{ valid:  isNotEmpty(attachment.reference), invalid: !isNotEmpty(attachment.reference) }"
                                   @search-change="autocompleteReferenceSearch"
                                   :internal-search="false"
                                   :preserve-search="true"
                                   :clear-on-select="false"
                                   :show-labels="false">
                    <template slot="singleLabel" slot-scope="{ option }">
                      <strong>{{ option.reference }}</strong>
                    </template>
                    <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                  </vue-multiselect>
                </div>
              </div>

            </div>
          </transition>
        </fieldset>

      </div>
    </template>


    <template v-slot:checkbox>
      <div class="d-flex flex-wrap">

        {{attachment}}

        <vs-checkbox id="is_private" v-model="attachment.is_private" icon="fa-eye-slash" icon-pack="fas">
          {{ attachment.is_private ? $t('attachment.is_private_text') : $t('attachment.is_public_text') }}
        </vs-checkbox>

        <vs-checkbox id="is_locked" v-model="attachment.is_locked" icon="fa-lock" icon-pack="fas">
          {{ attachment.is_locked ? $t('attachment.is_locked_text') : $t('attachment.is_unlocked_text') }}
        </vs-checkbox>
      </div>
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

      recordOptions() {
        if (this.isPhotoArchive) return true;
        else if (this.isSpecimenImage) return true;
        else if (this.isOtherFile) return true;
        else if (this.isDigitisedReference) return false;
        else return true
      },

      recordImage() {
        if (this.isPhotoArchive) return true;
        else if (this.isSpecimenImage) return true;
        else if (this.isOtherFile) return true;
        else if (this.isDigitisedReference) return false;
        else return true
      },

      recordVideo() {
        if (this.isPhotoArchive) return false;
        else if (this.isSpecimenImage) return true;
        else if (this.isOtherFile) return true;
        else if (this.isDigitisedReference) return false;
        else return true
      },

      recordAudio() {
        if (this.isPhotoArchive) return false;
        else if (this.isSpecimenImage) return true;
        else if (this.isOtherFile) return true;
        else if (this.isDigitisedReference) return false;
        else return true
      },

      fileInputFormat() {
        if (this.isPhotoArchive) return 'image/*';
        else if (this.isSpecimenImage) return '*/*';
        else if (this.isOtherFile) return '*/*';
        else if (this.isDigitisedReference) return 'application/pdf';
        else return 'image/*'
      },

      acceptMultiple() {
        if (this.isPhotoArchive) return true;
        else if (this.isSpecimenImage) return true;
        else if (this.isOtherFile) return true;
        else if (this.isDigitisedReference) return true;
        else return true
      }
    },

    created() {
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory !== 'fallbackValue' && searchHistory.hasOwnProperty('filename') ? searchHistory : this.searchParameters;
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
        // Adding attachment default values from local storage
        const attachmentHistory = this.$localStorage.get('attachment', 'fallbackValue');
        if (attachmentHistory !== 'fallbackValue' && Object.keys(attachmentHistory).length !== 0 && attachmentHistory.constructor === Object) {
          this.attachment = attachmentHistory
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
          copyFields: ['id', 'specimen_image_attachment', 'author', 'author_free', 'imageset', 'is_private', 'is_locked'],
          autocomplete: {
            loaders: {
              agent: false,
              imageset: false,
              reference: false,
              locality: false,
            },
            agent: [],
            imageset: [],
            reference: [],
            locality: [],
          },
          requiredFields: {
            photo_archive: ['imageset'],
            specimen_image: [],
            other_file: ['description', 'description_en'],
            digitised_reference: ['reference']
          },
          optionalFields: {
            photo_archive: ['author', 'author_free'],
            specimen_image: ['author', 'author_free'],
            other_file: ['author', 'author_free'],
            digitised_reference: []
          },
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

          this.setTab('specimen_identification')
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

        // if (this.isNotEmpty(objectToUpload.date_collected)) uploadableObject.date_collected = this.formatDateForUpload(objectToUpload.date_collected);

        // Autocomplete fields
        if (this.isNotEmpty(objectToUpload.coll)) uploadableObject.coll = objectToUpload.coll.id;

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

        if (this.isNotEmpty(obj.taxon)) obj.taxon = { id: obj.taxon, taxon: obj.taxon__taxon };

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

      //check required fields for related data
      checkRequiredFields(type) {},

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.attachment = this.attachment.id;

        // Todo: Use foreach because DRY basically

        if (this.isNotEmpty(uploadableObject.taxon)) {
          uploadableObject.taxon = uploadableObject.taxon.id ? uploadableObject.taxon.id : uploadableObject.taxon;
        }
        if (this.isNotEmpty(uploadableObject.date_identified)) {
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
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
