<template>
  <div>
    <!-- HEADER -->
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.attachments') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/attachment/add/other_file' }">{{ $t('add.new')
          }}
        </router-link>
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
                <div class="col-sm-6" v-for="field,idx in filters">

                  <label :for="field.id">{{ $t(field.title) }}:</label>

                  <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

                </div>

                <!-- CHECKBOXES -->
                <div class="col-6">
                  <label class="invisible">Checkbox:</label>

                  <b-form-checkbox-group v-model="searchParameters.specimen_image_attachment">

                    <b-form-checkbox value="2">
                      {{ $t('attachment.photoArchive') }}
                    </b-form-checkbox>

                    <b-form-checkbox value="1">
                      {{ $t('attachment.specimenImage') }}
                    </b-form-checkbox>

                    <b-form-checkbox value="3">
                      {{ $t('attachment.otherFiles') }}
                    </b-form-checkbox>

                    <b-form-checkbox value="4">
                      {{ $t('attachment.digitisedReference') }}
                    </b-form-checkbox>

                  </b-form-checkbox-group>
                </div>


        </div>
      </transition>
    </fieldset>
    <!-- SEARCH FIELDS END -->

    <list-module-core
      module="attachment"
      title="titles.editAttachment"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchAttachments"
      search-history="attachmentSearchHistory"
      view-type="attachmentViewType"
      :use-list-view="true"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchAttachments} from "../assets/js/api/apiCalls";
  import {mapState} from "vuex";

  export default {
    components: {
      ListModuleCore
    },
    name: "Attachments",

    data() {
      return {
        response: {},
        columns: [
          {id: "file", title: "attachment.file", type: "number", orderBy: false, showHeader: true},
          {id: "id", title: "attachment.id", type: "text"},
          {id: "format", title: "attachment.format", type: "text", orderBy: false, showHeader: true},
          {id: "image_number", title: "attachment.imageNumber", type: "text"},
          {id: "author__agent", title: "attachment.author", type: "text"},
          {id: "date_created", title: "attachment.date", type: "text"},
          {id: "specimen", title: "attachment.specimen", type: "text"},
          {id: "reference__reference", title: "attachment.reference", type: "text"},
          {id: "specimen_image_attachment", title: "attachment.specimenImageAttachment", type: "text"},
          {id: "attachment__filename", title: "", type: "text", orderBy: false},
        ],
        filters: [
          {id: "image_number", title: "attachment.imageNumber", type: "text"},
          {id: "filename", title: "attachment.filename", type: "text"},
          {id: "specimen", title: "attachment.specimen", type: "text"},
          {id: "imageInfo", title: "attachment.imageInfo", type: "text"},
          {id: "locality", title: "attachment.locality", type: "text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    computed: {
      ...mapState(["currentUser"])
    },

    methods: {
      fetchAttachments() {
        return new Promise((resolve) => {
          resolve(fetchAttachments(this.searchParameters, this.currentUser))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
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
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
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
