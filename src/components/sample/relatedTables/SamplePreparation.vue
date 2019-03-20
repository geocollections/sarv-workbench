<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'preparation'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'preparation'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>Prep. number</th>
            <th>Fossiilirühm</th>
            <th>Hoiukoht</th>
            <th>Märkused</th>
            <th>Metoodika ID</th>
            <th v-if="relatedData.insert.preparation.preparation_number"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.preparation">
            <td v-translate="{et: entity.analysis_method__analysis_method, en: entity.analysis_method__analysis_method_en}"></td>
            <td>{{entity}}</td>
            <td>{{entity.fossil_group}}</td>
            <td>{{entity.storage}}</td>
            <td>{{entity.remarks}}</td>
            <td>{{entity.date_free}}</td>
            <td v-if="relatedData.insert.preparation.preparation_number"></td>
          </tr>
          <tr class="related-input-data">
            <td><b-form-input v-model="relatedData.insert.preparation.preparation_number" type="text"/></td>
            <td>
              <vue-multiselect v-model="relatedData.insert.preparation.fossil_group" v-if="isDefinedAndNotEmpty(autocomplete.fossil_group)"
                               :options="autocomplete.fossil_group"
                               track-by="id"
                               label="fossil_group__taxon"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.preparation.storage" type="text"/></td>
            <td><b-form-input v-model="relatedData.insert.preparation.remarks" type="text"/></td>

            <td>
              <vue-multiselect v-model="relatedData.insert.preparation.analysis_method" v-if="isDefinedAndNotEmpty(autocomplete.analysisMethod)"
                               :options="autocomplete.analysisMethod"
                               track-by="id"
                               :label="analysisMethodLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.preparation = {}" v-if="relatedData.insert.preparation.preparation_number">
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
      name: "SamplePreparation",
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
