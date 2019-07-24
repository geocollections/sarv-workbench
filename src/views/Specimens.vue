<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.specimens') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/specimen/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>

    <!-- SEARCH FIELDS START -->
    <fieldset class="border p-2" id="block-search">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.search }" @click="block.search = !block.search">
        <i class="fas fa-search"></i>
        {{ $t('edit.search') }}
      </legend>

      <transition name="fade">
        <div class="row" v-if="filters.length > 0 && block.search">
          <div class="col-md-4" v-for="field,idx in filters">

            <label :for="field.id">{{ $t(field.title) }}:</label>

            <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

          </div>
        </div>
      </transition>
    </fieldset>

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="specimen"
      title="titles.editSpecimen"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSpecimens"
      search-history="specimenSearchHistory"
      view-type="specimenViewType"
      :multi-ordering="true"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
      v-on:toggle-privacy-state="changeSpecimenPrivacyState"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchChangePrivacyState, fetchSpecimens} from "../assets/js/api/apiCalls";
  import {toastError, toastSuccess} from "../assets/js/iziToast/iziToast";
  import permissionsMixin from "../mixins/permissionsMixin";

  export default {
    components: {
      ListModuleCore
    },
    name: "Specimens",
    mixins: [permissionsMixin],

    data() {
      return {
        response: {},
        columns: [
          {id: "id", title: "specimen.id", type: "number"},
          {id: "coll__number", title: "specimen.coll__number", type: "text"},
          {id: "specimen_id", title: "specimen.number", type: "text"},
          {id: "specimen_nr", title: "specimen.specimen_nr", type: "text"},
          {id: "locality__locality_en", title: "specimen.locality", type: "text"},
          {id: "depth", title: "specimen.depth", type: "number"},
          {id: "stratigraphy__stratigraphy_en", title: "specimen.stratigraphy", type: "text"},
          {id: "agent_collected__agent", title: "specimen.agent_collected", type: "text"},
          {id: "storage__location", title: "specimen.storage", type: "text"},
          {id: "is_private", title: "specimen.is_private", type: "text", isPrivate: true},
          {id: "specimen", title: "specimen.specimen", type: "text", orderBy: false},
        ],
        filters: [
          {id: "idSpecimen", title: "specimen.idSpecimen", type: "text"},
          {id: "collNumber", title: "specimen.coll__number", type: "text"},
          {id: "classification", title: "specimen.class", type: "text"},
          {id: "fossil", title: "specimen.fossil", type: "text"},
          {id: "mineralRock", title: "specimen.mineralRock", type: "text"},
          {id: "locality", title: "specimen.locality", type: "text"},
          {id: "stratigraphy", title: "specimen.stratigraphy", type: "text"},
          {id: "agent_collected", title: "specimen.agent_collected", type: "text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    methods: {
      fetchSpecimens() {
        return new Promise((resolve) => {
          resolve(fetchSpecimens(this.searchParameters, this.databaseId))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          idSpecimen: null,
          collNumber: null,
          classification: null,
          fossil: null,
          mineralRock: null,
          locality: null,
          stratigraphy: null,
          agent_collected: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
      },

      changeSpecimenPrivacyState(state, id) {
        let formData = new FormData()
        formData.append('data', JSON.stringify({is_private: state}))

        fetchChangePrivacyState('specimen', id, formData).then(response => {
          if (typeof response.body.message !== 'undefined') {
            if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
              toastSuccess({text: response.body.message_et});
            } else {
              toastSuccess({text: response.body.message});
            }
          }
          if (typeof response.body.error !== 'undefined') {
            if (this.$i18n && this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
              toastError({text: response.body.error_et});
            } else {
              toastError({text: response.body.error});
            }
          }
        }, errResponse => {
          if (typeof errResponse.body.error !== 'undefined') toastError({text: errResponse.body.error})
          toastError({text: this.$t('messages.uploadError')})
        })
      }
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
