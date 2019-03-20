<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'taxon_list'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'taxon_list'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr class="text-center">
            <th>{{ $t('taxon.taxon') }}</th>
            <th>{{ $t('taxon.taxon_free') }}</th>
            <th>{{ $t('taxon.abundance') }}</th>
            <th>{{ $t('taxon.det_agent') }}</th>
            <th>{{ $t('taxon.det_date') }} <font-awesome-icon icon="calendar-alt" title="Date identified"/></th>
            <th>{{ $t('taxon.extra') }}</th>
            <th>{{ $t('taxon.preparation') }}</th>
            <th><font-awesome-icon icon="user-lock" :title="$t('taxon.is_private')"/></th>
            <th><font-awesome-icon icon="comment-alt" :title="$t('taxon.remarks')"/></th>
            <th v-if="relatedData.insert.taxon_list.taxon"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.taxon_list">
            <td>{{entity.taxon__taxon}}</td>
            <td>{{entity.name}}</td>
            <td>{{entity.frequency}}</td>
            <td>{{entity.agent_identified__agent}}</td>
            <td>{{entity.date_identified}}</td>
            <td class="text-center">{{ entity.extra === true ? '&#10003' : '' }}</td>
            <td>{{entity.preparation}}</td>
            <td class="text-center">{{ entity.is_private === true ? '&#10003' : '' }}</td>
            <td>{{entity.remarks}}</td>
            <td v-if="relatedData.insert.taxon_list.taxon"></td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.taxon_list.taxon" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.taxon" id="taxon"
                               label="taxon" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.taxon" :searchable="true" @search-change="autcompleteTaxonSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.taxon}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.name" type="text"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.frequency" type="number"/></td>
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.taxon_list.agent_identified" deselect-label="Can't remove this value"
                                      label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                                      :loading="autocomplete.loaders.agent"
                                      :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                                      :allow-empty="true"  :show-no-results="false" :max-height="600"
                                      :open-direction="'bottom'">
              <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
            </vue-multiselect></td>
            <td>
              <datepicker id="date"
                          v-model="relatedData.insert.taxon_list.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"/>
            </td>
            <td class="text-center"><b-form-checkbox v-model="relatedData.insert.taxon_list.extra" :value="true" :unchecked-value="false"/></td>
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.taxon_list.preparation" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.preparation" id="preparation"
                               label="id" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.preparation" :searchable="true" @search-change="autcompletePreparationSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.id}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td class="text-center"><b-form-checkbox v-model="relatedData.insert.taxon_list.is_private" :value="true" :unchecked-value="false"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text"/></td>
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
