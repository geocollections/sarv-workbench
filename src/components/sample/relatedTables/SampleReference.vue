<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'sample_reference'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'sample_reference'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('reference.reference') }}<font-awesome-icon class="ml-2" icon="link"/></th>
            <th>{{ $t('reference.remarks') }}</th>
            <th style="width: 5.7em"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.sample_reference"  :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <td v-if="!entity.editMode">
              <router-link :to="{ path: '/reference/' + entity.reference }" target="_blank">
                {{ entity.reference__reference }}
              </router-link>
            </td>
            <td v-if="!entity.editMode">{{ entity.remarks }}</td>
            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.reference" deselect-label="Can't remove this value"
                               label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference" :searchable="true" @search-change="autcompleteReferenceSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.remarks" type="text"/>
            </td>
            <td style="padding: 0.6em!important;">
              <button  v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$root.$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button  v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$root.$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$root.$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
            </td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.sample_reference.reference" deselect-label="Can't remove this value"
                               label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference" :searchable="true" @search-change="autcompleteReferenceSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td>
              <b-form-input v-model="relatedData.insert.sample_reference.remarks" type="text"/>
              <!--<b-form-textarea max-rows="6" id="reference_remarks" v-model="relatedData.insert.reference.remarks" rows="2" />-->
            </td>
            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="addRelatedData(activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.sample_reference = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
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

    export default {
      name: "SampleReference",
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
