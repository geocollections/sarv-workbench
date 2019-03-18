<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'locality_reference'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'locality_reference'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('reference.reference') }}</th>
            <th>{{ $t('reference.pages') }}</th>
            <th>{{ $t('reference.figures') }}</th>
            <th>{{ $t('reference.remarks') }}</th>
            <th v-if="relatedData.insert.locality_reference.reference"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.locality_reference">
            <td>
              <!--<a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.reference})">
                {{ entity.reference__reference }}
              </a>
              -->
              <router-link :to="{ path: '/reference/' + entity.reference }" target="_blank">
  				{{ entity.reference__reference }}
			  </router-link>
            </td>
            <td>{{ entity.pages }}</td>
            <td>{{ entity.figures }}</td>
            <td>{{ entity.remarks }}</td>
            <td v-if="relatedData.insert.locality_reference.reference"></td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.locality_reference.reference" deselect-label="Can't remove this value"
                               label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference" :searchable="true" @search-change="autcompleteReferenceSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.locality_reference.pages" type="text"/></td>
            <td><b-form-input v-model="relatedData.insert.locality_reference.figures" type="text"/></td>
            <td>
              <b-form-input v-model="relatedData.insert.locality_reference.remarks" type="text"/>
              <!--<b-form-textarea max-rows="6" id="reference_remarks" v-model="relatedData.insert.reference.remarks" rows="2" />-->
            </td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.locality_reference = {}" v-if="relatedData.insert.locality_reference.reference">
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
      name: "LocalityReference",
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
