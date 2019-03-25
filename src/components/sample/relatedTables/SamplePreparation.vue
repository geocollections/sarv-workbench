<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'preparation'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'preparation'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('preparation.preparation_number') }}</th>
            <th>{{ $t('preparation.fossil_group') }}</th>
            <th>{{ $t('preparation.storage') }}</th>
            <th>{{ $t('preparation.remarks') }}</th>
            <th>{{ $t('preparation.method_id') }}</th>
            <th style="width: 5.7em"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.preparation"  :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <td v-if="!entity.editMode">{{entity.preparation_number}}</td>
            <td v-if="!entity.editMode">{{entity.taxon__taxon}}</td>
            <td v-if="!entity.editMode">{{entity.storage__location}}</td>
            <td v-if="!entity.editMode">{{entity.remarks}}</td>
            <td v-if="!entity.editMode">{{entity.analysis}}</td>

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.preparation_number" type="text"/></td>
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.taxon" v-if="isDefinedAndNotEmpty(autocomplete.fossil_group)"
                               :options="autocomplete.fossil_group"
                               track-by="id"
                               label="taxon"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.storage" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.storage" id="storage"
                               label="location" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.storage" :searchable="true" @search-change="autcompleteStorageSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect></td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.remarks" type="text"/></td>

            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.analysis" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.analysis" id="analysis"
                               label="id" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.analysis" :searchable="true" @search-change="autcompleteAnalysisSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.id}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td style="padding: 0.6em!important;">
              <button  v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$root.$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button  v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$root.$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$root.$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
            </td>
          </tr>
          <tr class="related-input-data">
            <td><b-form-input v-model="relatedData.insert.preparation.preparation_number" type="text"/></td>
            <td>
              <vue-multiselect v-model="relatedData.insert.preparation.taxon" v-if="isDefinedAndNotEmpty(autocomplete.fossil_group)"
                               :options="autocomplete.fossil_group"
                               track-by="id"
                               label="taxon"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.preparation.storage" deselect-label="Can't remove this value"
                                      :loading="autocomplete.loaders.storage" id="storage"
                                      label="location" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                                      :options="autocomplete.storage" :searchable="true" @search-change="autcompleteStorageSearch"
                                      :allow-empty="true"  :show-no-results="false" :max-height="600"
                                      :open-direction="'bottom'">
              <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
              <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
            </vue-multiselect></td>
            <td><b-form-input v-model="relatedData.insert.preparation.remarks" type="text"/></td>

            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.preparation.analysis" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.analysis" id="analysis"
                               label="id" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.analysis" :searchable="true" @search-change="autcompleteAnalysisSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.id}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="addRelatedData(activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.preparation = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

  import formManipulation  from './../../mixins/formManipulation';
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

      mixins: [formManipulation,autocompleteFieldManipulation]
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
