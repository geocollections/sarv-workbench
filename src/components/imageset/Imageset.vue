<template>
  <div class="imageset">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border-top px-2 mb-2" :style="!validate('imageset') ? 'border-color: #dc3545!important;' : ''" id="block-requiredFields">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('imageset') }"
              @click="block.requiredFields = !block.requiredFields">
        {{ $t('imageset.requiredFields') }}
        <font-awesome-icon v-if="validate('imageset')" color="#28a745" icon="check"/>
        <font-awesome-icon v-if="!validate('imageset')" color="#dc3545" icon="exclamation-triangle"/>
      </legend>

      <transition name="fade">
        <div v-if="block.requiredFields">

          <!-- NUMBER and AUTHOR -->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`imageset`">{{ $t('imageset.imagesetNumber') }}:</label>
              <b-form-input id="imageset"
                            v-model="imageset.imageset_number"
                            :state="(isNotEmpty(imageset.imageset_number) && !imagesetNumberExists)"
                            type="text"></b-form-input>
              <b-form-text v-if="!(isNotEmpty(imageset.imageset_number) && !imagesetNumberExists)">
                <div v-if="imagesetNumberExists">{{ $t('add.errors.imagesetNumberExists') }}.</div>
                <div v-else>{{ $t('add.errors.imagesetNumber') }}.</div>
              </b-form-text>
            </div>


            <div class="col-sm-6">
              <label :for="`author`">{{ $t('imageset.author') }}:</label>
              <vue-multiselect v-model="imageset.author"
                               id="author"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="autocompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               v-bind:class="{ valid: isNotEmpty(imageset.author), invalid: !isNotEmpty(imageset.author) }"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
              <b-form-text v-if="!isNotEmpty(imageset.author)">{{ $t('add.errors.author') }}.</b-form-text>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- GENERAL INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-info">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('imageset.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-show="block.info">

          <!-- DESCRIPTION -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`description`">{{ $t('imageset.description') }}:</label>
              <b-form-textarea id="image_description"
                               v-model="imageset.description"
                               :no-resize="true"
                               :rows="3"
                               :max-rows="3"
                               type="text"></b-form-textarea>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- CLEAR LOCAL STORAGE -->
    <div class="row mt-3">
      <div class="col">
        <button class="btn btn-outline-warning" @click="clearLocalStorage">{{ $t('add.buttons.clearLocalStorage') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import cloneDeep from 'lodash/cloneDeep'
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteMixin from "../../mixins/autocompleteMixin";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {mapState} from "vuex";
  import {toastInfo} from "../../assets/js/iziToast/iziToast";
  import {fetchIsImagesetNumberInImageset} from "../../assets/js/api/apiCalls";

  export default {
    name: "Imageset",

    components: {
      Spinner,
    },

    mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

    data() {
      return this.setInitialData()
    },

    computed: {
      ...mapState(["currentUser"])
    },

    created() {
      // Gets saved form values from local storage
      const imageset = this.$localStorage.get('imageset', 'fallbackValue');
      if (this.isNotEmpty(imageset) && imageset !== 'fallbackValue') this.imageset = imageset;

      this.imageset.author = {
        id: this.currentUser.id,
        agent: this.currentUser.agent,
        forename: this.currentUser.forename,
        surename: this.currentUser.surename
      }
    },

    watch: {
      'imageset.imageset_number': function (newVal) {
        if (newVal && newVal.trim().length > 0) {
          this.isInImagesetTable(newVal)
        }
      }
    },

    methods: {
      setInitialData() {
        return {
          autocomplete: {
            loaders: {
              agent: false,
            },
            agent: [],
          },
          requiredFields: ['imageset_number', 'author'],
          imageset: {},
          imagesetNumberExists: false,
          block: {requiredFields: true, info: true},
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)

        if (!this.$route.meta.isEdit) this.$localStorage.set('imageset', uploadableObject)

        if (this.isNotEmpty(uploadableObject.author)) uploadableObject.author = uploadableObject.author.id ? uploadableObject.author.id : uploadableObject.author;

        console.log('This object is sent in string format:')
        console.log(uploadableObject)

        return JSON.stringify(uploadableObject)
      },

      isInImagesetTable(query) {
        fetchIsImagesetNumberInImageset(query).then(response => {
          if (response.status === 200) {
            console.log(response.body.count > 0)
            this.imagesetNumberExists = response.body.count > 0
          }
        })
      },

      clearLocalStorage() {
        this.$localStorage.remove('imageset');
        toastInfo({text: this.$t('messages.defaultsRemoved')})
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
