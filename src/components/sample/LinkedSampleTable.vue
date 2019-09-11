<template>
  <div class="linked-sample-table row" v-if="samples.length > 0">
    <div class="col-sm-12">

      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>ID</th>
            <th>{{ $t('sample.number') }}</th>
            <th>{{ $t('sample.depth') }}</th>
            <th>{{ $t('sample.depth_interval') }}</th>
            <th>{{ $t('sample.stratigraphy') }}</th>
            <th>{{ $t('sample.lithostratigraphy') }}</th>
            <th>{{ $t('sample.rock') }}</th>
          </tr>

          <tr>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.id"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.number"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.depth"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.depth_interval"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.stratigraphy"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.lithostratigraphy"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.rock"
                            type="text"></b-form-input>
            </th>

          </tr>
          </thead>

          <tbody v-if="sample_results.length > 0">
          <tr v-for="sample in sample_results" :key="sample.id">
            <td>
              <router-link :to="{ path: '/sample/' + sample.id }" target="_blank">
                <i class="fas fa-eye"></i>
                {{sample.id}}
              </router-link>
            </td>
            <td>{{sample.number}}</td>
            <td>{{sample.depth}}</td>
            <td>{{sample.depth_interval}}</td>
            <td v-translate="{et: sample.stratigraphy__stratigraphy, en: sample.stratigraphy__stratigraphy_en}"></td>
            <td v-translate="{et: sample.lithostratigraphy__stratigraphy, en: sample.lithostratigraphy__stratigraphy_en}"></td>
            <td v-translate="{et: sample.rock, en: sample.rock_en}"></td>
          </tr>
          </tbody>

          <tbody v-else>
          <tr>
            <td colspan="7" class="text-center">
              <div class="d-flex justify-content-center">
                <div class="px-1">
                  <strong>{{ $t('messages.inputNoResults') }}</strong>
                </div>
                <div class="px-1 reset-search" @click="setDefaultSearchParameters" title="Reset search">
                  <i class="fas fa-redo-alt fa-spin-hover"></i>
                </div>
              </div>
            </td>
          </tr>
          </tbody>

        </table>
      </div>
    </div>

    <div class="col-sm-12 col-md-6" v-if="count > searchParameters.paginateBy">
      <b-pagination
        size="sm" align="left" :limit="5" :hide-ellipsis="true" :total-rows="count"
        v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
      </b-pagination>
    </div>
  </div>
</template>

<script>
  import { fetchLinkedSamples } from "../../assets/js/api/apiCalls";

  export default {
    name: "LinkedSampleTable",
    props: {
      siteID: {
        type: String
      },
      samples: {
        type: Array
      }
    },
    data() {
      return {
        sample_results: [],
        count: 0,
        searchParameters: {
          id: null,
          number: null,
          depth: null,
          depth_interval: null,
          stratigraphy: null,
          lithostratigraphy: null,
          rock: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      }
    },

    methods: {
      loadLinkedSamples() {
        fetchLinkedSamples(this.searchParameters, this.siteID).then(response => {
          this.count = response.body.count;
          this.sample_results = response.body.results ? response.body.results : [];
        });
      },

      setDefaultSearchParameters() {
        console.log(this.searchParameters)
        this.searchParameters = {
          id: null,
          number: null,
          depth: null,
          depth_interval: null,
          stratigraphy: null,
          lithostratigraphy: null,
          rock: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      }
    },
    watch: {
      'searchParameters': {
        handler: function (newVal, oldVal) {
          this.loadLinkedSamples()
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style scoped>
  .reset-search {
    color: #007bff;
  }

  .reset-search:hover {
    cursor: pointer;
  }

  .fa-spin-hover:hover {
    -webkit-animation: fa-spin 2s infinite linear;
    -moz-animation: fa-spin 2s infinite linear;
    -o-animation: fa-spin 2s infinite linear;
    animation: fa-spin 2s infinite linear;}
</style>
