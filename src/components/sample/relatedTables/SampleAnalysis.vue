<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'analysis'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'analysis'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('analysis.method') }}</th>
            <th>{{ $t('analysis.method_specification') }}</th>
            <th>{{ $t('analysis.mass') }}</th>
            <th>{{ $t('analysis.date') }}</th>
            <th>{{ $t('analysis.date_end') }}</th>
            <th>{{ $t('analysis.date_free') }}</th>
            <th>{{ $t('analysis.agent') }}</th>
            <th>{{ $t('analysis.remarks') }}</th>
            <th>{{ $t('analysis.location') }}</th>
            <th class="text-center"><font-awesome-icon icon="lock" :title="$t('analysis.is_locked')"/></th>
            <th style="width: 5.7em"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.analysis" :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }" >
            <td v-show="!entity.editMode" v-translate="{et: entity.analysis_method__analysis_method, en: entity.analysis_method__analysis_method_en}"></td>
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.analysis_method"
                               :options="autocomplete.analysisMethod"
                               track-by="id"
                               :label="analysisMethodLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-show="!entity.editMode">{{entity.method_details}}</td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.method_details" type="text"/></td>
            <td v-show="!entity.editMode">{{entity.mass}}</td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.mass" type="number"/></td>
            <td v-show="!entity.editMode">{{entity.date}}</td>
            <td v-if="entity.editMode"><datepicker id="date1"
                            v-model="entity.new.date"
                            lang="en"
                            :first-day-of-week="1"
                            format="DD MMM YYYY"
                            input-class="form-control"/></td>
            <td v-show="!entity.editMode">{{entity.date_end}}</td>
            <td v-if="entity.editMode"><datepicker id="date_end1"
                            v-model="entity.new.date_end"
                            lang="en"
                            :first-day-of-week="1"
                            format="DD MMM YYYY"
                            input-class="form-control"/></td>
            <td v-show="!entity.editMode">{{entity.date_free}}</td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.date_free" type="text"/></td>
            <td v-show="!entity.editMode">{{entity.agent__agent}}</td>
            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.agent" deselect-label="Can't remove this value"
                               label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-show="!entity.editMode">{{entity.remarks}}</td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.remarks" type="text"/></td>
            <td v-show="!entity.editMode">{{entity.location}}</td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.location" type="text"/></td>
            <td v-show="!entity.editMode" class="text-center">{{ entity.is_private === true ? '&#10003' : '' }}</td>
            <td v-if="entity.editMode" class="text-center"><b-form-checkbox v-model="entity.new.is_private" :value="true" :unchecked-value="false"/></td>

            <td style="padding: 0.6em!important;">
              <button  v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$root.$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button  v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$root.$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$root.$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
            </td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.analysis.analysis_method" v-if="isDefinedAndNotEmpty(autocomplete.analysisMethod)"
                               :options="autocomplete.analysisMethod"
                               track-by="id"
                               :label="analysisMethodLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.analysis.method_details" type="text"/></td>
            <td><b-form-input v-model="relatedData.insert.analysis.mass" type="number"/></td>
            <td><datepicker id="date"
                                   v-model="relatedData.insert.analysis.date"
                                   lang="en"
                                   :first-day-of-week="1"
                                   format="DD MMM YYYY"
                                   input-class="form-control"/></td>
            <td><datepicker id="date_end"
                            v-model="relatedData.insert.analysis.date_end"
                            lang="en"
                            :first-day-of-week="1"
                            format="DD MMM YYYY"
                            input-class="form-control"/></td>
            <td><b-form-input v-model="relatedData.insert.analysis.date_free" type="text"/></td>
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.analysis.agent" deselect-label="Can't remove this value"
                               label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.analysis.remarks" type="text"/></td>
            <td><b-form-input v-model="relatedData.insert.analysis.location" type="text"/></td>
            <td class="text-center"><b-form-checkbox v-model="relatedData.insert.analysis.is_private" :value="true" :unchecked-value="false"/></td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$root.$emit('related-data-added', activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.analysis = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
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
  import autocompleteFieldManipulation  from './../../mixins/autocompleFormManipulation'
  import Datepicker from 'vue2-datepicker'
    export default {
      name: "SampleAnalysis",
      components: {
        Datepicker
      },

      mixins: [formManipulation,autocompleteFieldManipulation],

      props: {
        relatedData: Object,
        autocomplete: Object,
        activeTab: String
      }
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
