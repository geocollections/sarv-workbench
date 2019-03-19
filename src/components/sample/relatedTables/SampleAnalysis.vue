<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'sample_analysis'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'sample_analysis'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('reference.reference') }}</th>
            <th>{{ $t('reference.remarks') }}</th>
            <th v-if="relatedData.insert.sample_analysis.reference"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.sample_analysis">
            <td>
              <router-link :to="{ path: '/reference/' + entity.reference }" target="_blank">
                {{ entity.reference__reference }}
              </router-link>
            </td>
            <td>{{ entity.remarks }}</td>
            <td v-if="relatedData.insert.sample_analysis.reference"></td>
          </tr>
          <tr class="related-input-data">
            <td>

            </td>
            <td>
              <b-form-input v-model="relatedData.insert.sample_analysis.remarks" type="text"/>
              <!--<b-form-textarea max-rows="6" id="reference_remarks" v-model="relatedData.insert.reference.remarks" rows="2" />-->
            </td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.sample_analysis = {}" v-if="relatedData.insert.sample_analysis.reference">
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

    export default {
      name: "SampleReference",
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
