<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'taxon_list'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'taxon_list'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>Taxon</th>
            <th>Taxon txt</th>
            <th>Abundance</th>
            <th>Det.</th>
            <th>Det. date</th>
            <th>Extra</th>
            <th>Preparation</th>
            <th>Is private</th>
            <th>Remarks</th>
            <th v-if="relatedData.insert.taxon_list.taxon"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.taxon_list">
            <td v-translate="{et: entity.analysis_method__analysis_method, en: entity.analysis_method__analysis_method_en}"></td>
            <td>{{entity.fossil_group}}</td>
            <td>{{entity.storage}}</td>
            <td>{{entity.remarks}}</td>
            <td>{{entity.fossil_group}}</td>
            <td>{{entity.storage}}</td>
            <td>{{entity.remarks}}</td>
            <td v-if="relatedData.insert.taxon_list.taxon"></td>
          </tr>
          <tr class="related-input-data">
            <td><b-form-input v-model="relatedData.insert.taxon_list.taxon" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.storage" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text" :disabled="true"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text" :disabled="true"/></td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.taxon_list = {}" v-if="relatedData.insert.taxon_list.taxon">
              <font-awesome-icon icon="times"></font-awesome-icon>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import autocompleteFieldManipulation  from './../../mixins/autocompleFormManipulation';
  import Datepicker from 'vue2-datepicker'
    export default {
      name: "SampleTaxonList",
      components: {
        Datepicker
      },
      props: {
        relatedData: Object,
        autocomplete: Object,
        activeTab: String
      },

      mixins: [autocompleteFieldManipulation]
    }
</script>

<style scoped>
  .table { 
	font-size: 0.9rem; 
  }
  .table td, .table th {
	padding: 0.25rem 0.4rem;  
  }
  .related-input-data td{
    /*min-width: 10em !important;*/
    padding: 0.2em!important;
  }
  .multiselect {
    line-height: 1;
    z-index: 999 !important;
    width: 100%;
    min-width: 10em!important;
  
  }
  .multiselect__tags {
	border: none;
 font-size: 0.8rem;
  }
  input, .multiselect__single, .multiselect__input, .multiselect__tags, .multiselect__tag-icon:after, .multiselect__option:after, .multiselect__option--selected  {
	font-size: 0.9rem !important;
    font-weight: light;
  padding:0.25rem;
  } 
  input {
	border: none;
  }
</style>
