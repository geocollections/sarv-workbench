<template>
  <div class="digitised-reference">

    <div class="row mt-4" v-if="attachment !== null">

      <!-- FILE -->
      <div class="col-sm-6 mb-4 text-center">
        <file-preview :data="data"/>
      </div>

      <!-- FILE INFORMATION -->
      <div class="col-sm-6">
        <file-information :data="data"/>
      </div>
    </div>

    <!-- REFERENCE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`reference`">{{ $t('digitisedReference.reference') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.reference"
                         id="reference"
                         :options="autocomplete.references"
                         :internal-search="false"
                         :preserve-search="true"
                         v-bind:class="{ valid: referenceState, invalid: !referenceState }"
                         @search-change="getReferences"
                         track-by="id"
                         label="reference"
                         :loading="searchingReferences"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false"></vue-multiselect>
      </div>
    </div>

    <!-- LICENCE and COPYRIGHT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`licence`">{{ $t('photoArchive.licence') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.licence"
                         id="licence"
                         :options="autocomplete.licences"
                         @open="maybeGetLicences"
                         track-by="id"
                         label="licence"
                         :loading="searchingLicences"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false"></vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`copyright_agent`">{{ $t('photoArchive.copyrightAgent') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.copyright_agent"
                         id="copyright_agent"
                         :options="autocomplete.copyrightAgents"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- AGENT and DATE DIGITISED -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`agent_digitised`">{{ $t('photoArchive.agentDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.agent_digitised"
                         id="agent_digitised"
                         :options="autocomplete.agentsDigitised"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getAuthors"
                         :custom-label="customLabelForAuthor"
                         :loading="searchingAuthors"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`date_digitised`">{{ $t('photoArchive.dateDigitised') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <datepicker id="date_digitised"
                    v-model="edit.date_digitised"
                    lang="en"
                    :first-day-of-week="1"
                    format="DD MMM YYYY"
                    input-class="form-control"></datepicker>
      </div>
    </div>

    <!-- DATE DIGITISED FREE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`date_digitised_free`">{{ $t('digitisedReference.dateDigitisedFree') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="date_digitised_free" v-model="edit.date_digitised_free" type="text"></b-form-input>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <!--<b-form-checkbox id="is_preferred" v-model="edit.is_preferred" value="1" unchecked-value="0">-->
        <!--{{ $t('specimenImage.preferred') }}-->
        <!--</b-form-checkbox>-->

        <b-form-checkbox id="is_private" v-model="edit.is_private" value="1" unchecked-value="0">
          {{ $t('specimenImage.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="edit.is_locked" value="1" unchecked-value="0">
          {{ $t('specimenImage.locked') }}
        </b-form-checkbox>
      </div>
    </div>


    <div class="row mt-3 mb-3">
      <div class="col" v-if="!isAttachmentLocked">
        <button class="btn btn-success mr-2 mb-2" @click="sendData(false)" >{{ $t('edit.buttons.save') }}</button>
        <button class="btn btn-success mr-2 mb-2" @click="sendData(true)" >{{ $t('edit.buttons.saveAndContinue') }}</button>

        <button v-if="isChanged" @click="showModal = !showModal" class="btn btn-danger mr-2 mb-2" >{{ $t('edit.buttons.cancelWithoutSaving') }}</button>
        <router-link v-else class="btn btn-danger mr-2 mb-2" :to="{ path: '/attachment' }">{{ $t('edit.buttons.cancelWithoutSaving') }}</router-link>
      </div>
      <div class="col-sm-6" v-else>
        <div class="alert alert-info">{{ $t('edit.locked') }}</div>
      </div>
    </div>

    <confirmation-box title="edit.digitisedReference"
                      :title-extra="edit.eference"
                      v-if="isChanged && showModal"
                      table="attachment"
                      v-on:user-choice="confirmationBox"></confirmation-box>


  </div>
</template>

<script>
  import VueMultiselect from 'vue-multiselect'
  import Datepicker from 'vue2-datepicker'
  import cloneDeep from 'lodash/cloneDeep'
  import FileInformation from "@/components/partial/FileInformation.vue";
  import FilePreview from "@/components/partial/FilePreview.vue";
  import ConfirmationBox from "../../partial/ConfirmationBox";
  import { toastError } from "@/assets/js/iziToast/iziToast";

  export default {
    components: {
      FilePreview,
      FileInformation,
      VueMultiselect,
      Datepicker,
      ConfirmationBox
    },
    name: "DigitisedReference",
    props:['data'],
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        attachment: this.data,
        isFileLocked: this.data.is_locked,
        isChanged: false,
        showModal: false,
        autocomplete: {
          references: [],
          copyrightAgents: [],
          agentsDigitised: [],
          licences: [],
        },
        searchingReferences: false,
        searchingAuthors: false,
        searchingLicences: false,
        edit: {
          reference: this.buildReference(),
          licence: this.buildLicence(),
          copyright_agent: this.buildCopyrightAgent(),
          agent_digitised: this.buildAgentDigitised(),
          date_digitised: this.data.date_digitised,
          date_digitised_free: this.data.date_digitised_free,
          // is_preferred: this.data.is_preferred ? '1' : '0',
          is_private: this.data.is_private ? '1' : '0',
          is_locked: this.data.is_locked ? '1' : '0'
        }
      }
    },

    watch: {
      'edit': {
        handler: function () {
          this.isChanged = true
        },
        deep: true
      }
    },

    computed: {
      referenceState() {
        return this.edit.reference !== null
      },

      isAttachmentLocked() {
        return this.isFileLocked
      },
    },

    methods: {

      confirmationBox(userChoice) {
        this.showModal = false

        if (userChoice === 'LEAVE') {
          this.$router.push({ path: '/attachment' })
        }

        if (userChoice === 'CONTINUE') {
          // DO NOTHING
        }

        if (userChoice === 'SAVE') {
          this.sendData(true)
        }
      },



      /******************
       *** SEND START ***
       ******************/

      sendData(continueEditing) {
        if (this.referenceState) {
          const formattedData = this.formatDataForEdit(this.edit)
          this.$emit('edit-data', formattedData, continueEditing)
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }
      },

      formatDataForEdit(unformattedData) {
        let uploadableData = cloneDeep(unformattedData)

        console.log(unformattedData)

        // Building correct fields
        if (unformattedData.reference !== null) uploadableData.reference = unformattedData.reference.id
        if (unformattedData.licence !== null) uploadableData.licence = unformattedData.licence.id
        if (unformattedData.copyright_agent !== null) uploadableData.copyright_agent = unformattedData.copyright_agent.id
        if (unformattedData.agent_digitised !== null) uploadableData.agent_digitised = unformattedData.agent_digitised.id
        if (unformattedData.date_digitised !== null) {
          if (typeof unformattedData.date_digitised === 'string') uploadableData.date_digitised = unformattedData.date_digitised.split('T')[0]
          else uploadableData.date_digitised = unformattedData.date_digitised.toISOString().split('T')[0]
        }

        console.log('This object is sent in string format:')
        console.log(uploadableData)

        return JSON.stringify(uploadableData)
      },

      /******************
       ***  SEND END  ***
       ******************/



      /**************************
       *** AUTOCOMPLETE START ***
       **************************/

      getReferences(query) {
        if (query.length > 0) {
          this.searchingReferences = true

          let url = this.apiUrl + 'reference/?reference__icontains=' + query + '&fields=id,reference&format=json'

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.references = response.body.results
              else this.autocomplete.references = []
            }
            this.searchingReferences = false
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingReferences = false
          })
        }
      },

      getAuthors(query, id) {
        if (query.length > 0) {

          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'agent/?multi_search=value:' + query + ';fields:agent,forename,surename;lookuptype:icontains&format=json'

          this.searchingAuthors = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count === 0) {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = []
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = []
                else this.autocomplete.authors = [];
              }
              else {
                if (id === 'agent_digitised') this.autocomplete.agentsDigitised = response.body.results
                else if (id === 'copyright_agent') this.autocomplete.copyrightAgents = response.body.results
                else this.autocomplete.authors = response.body.results;
              }
            }
            this.searchingAuthors = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingAuthors = false;
          })
        }
      },

      maybeGetLicences() {
        return this.autocomplete.licences.length <= 0 ? this.getLicences() : null
      },

      getLicences() {
        this.searchingLicences = true;

        this.$http.get(this.apiUrl + 'list_licence/', {
          params: {
            fields: 'id,licence',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.licences = response.body.results
            }
          }
          this.searchingLicences = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingLicences = false;
        })
      },

      /**************************
       ***  AUTOCOMPLETE END  ***
       **************************/



      /***************************
       *** BUILD OBJECTS START ***
       ***************************/

      buildReference() {
        if (this.data.reference__id !== null) {
          return {
            id: this.data.reference__id,
            reference: this.data.reference__reference
          }
        } else {
          return null
        }
      },

      buildLicence() {
        if (this.data.licence__id !== null) {
          return {
            id: this.data.licence__id,
            licence: this.data.licence__licence
          }
        } else {
          return null
        }
      },

      buildCopyrightAgent() {
        if (this.data.copyright_agent__id !== null) {
          return {
            agent: this.data.copyright_agent__agent,
            forename: this.data.copyright_agent__forename,
            id: this.data.copyright_agent__id,
            surename: this.data.copyright_agent__surename
          }
        } else {
          return null
        }
      },

      buildAgentDigitised() {
        if (this.data.agent_digitised__id !== null) {
          return {
            agent: this.data.agent_digitised__agent,
            forename: this.data.agent_digitised__forename,
            id: this.data.agent_digitised__id,
            surename: this.data.agent_digitised__surename
          }
        } else {
          return null
        }
      },

      /***************************
       ***  BUILD OBJECTS END  ***
       ***************************/



      /*********************
       *** HELPERS START ***
       *********************/

      customLabelForAuthor(option) {
        if (option.agent === null && option.forename !== null && option.surename === null) return `${option.forename}`
        if (option.forename === null || option.surename === null) return `${option.agent}`
        else return `${option.agent} (${option.forename} ${option.surename})`
      },

      /*********************
       *** HELPERS END ***
       *********************/



    }
  }
</script>

<style scoped>

</style>
