<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.libraries') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/library/add' }">{{ $t('add.new') }}</router-link>
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
          <div class="col">
            <div class="search-fields">
              <div class="d-flex flex-row flex-wrap">
                <div class="col-sm-6" v-for="field,idx in filters">
                  <label class="col-sm-4 p-0" :for="field.id">{{ $t(field.title) }}:</label>
                  <b-form-input style="display: inline !important; " class="col-sm-8 mb-2"
                                v-model="searchParameters[field.id]" :id="field.id" :type="field.type">
                  </b-form-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>
    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="library"
      title="titles.editLibrary"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchLibraries"
      search-history="librarySearchHistory"
      view-type="libraryViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchLibrariesFromLibraryAgent} from "../assets/js/api/apiCalls";

  export default {
    components: {
      ListModuleCore
    },
    name: "Libraries",
    data() {
      return {
        response: {},
        columns: [
          {id: "library", title: "library.id", type: "number"},
          {id: "library__title", title: "library.title", type: "text"},
          {id: "agent__agent", title: "library.author_txt", type: "text"},

          {id: "library__is_private", title: "library.isPrivate", type: "text"},
          {id: "reference", title: "library.reference", type: "text", orderBy: false},
        ],
        filters: [
          {id: "author_txt", title: "library.author_txt", type: "text"},
          {id: "year", title: "library.year", type: "number"},
          {id: "title", title: "library.title", type: "text"},
          {id: "reference", title: "library.reference", type: "text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    created: function () {
      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        const user = this.$session.get('authUser')
        this.agent = {
          id: user.agent_id,
          agent: null,
          forename: user.user,
          surename: null,
          user: user.user,
        }
        //console.log(this.agent);
      }
    },

    methods: {
      fetchLibraries() {
        return new Promise((resolve) => {
          resolve(fetchLibrariesFromLibraryAgent(this.searchParameters, this.agent))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          author_txt: null,
          year: null,
          title: null,
          reference: null,
          id: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-library',
        }
      },
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
      }
    }
  }
</script>

<style scoped>

</style>
