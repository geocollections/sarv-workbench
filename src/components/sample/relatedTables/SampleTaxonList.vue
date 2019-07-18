<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'taxon_list'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'taxon_list'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered related-table">
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
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.taxon_list"  :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <td v-if="!entity.editMode">{{entity.taxon__taxon}}</td>
            <td v-if="!entity.editMode">{{entity.name}}</td>
            <td v-if="!entity.editMode">{{entity.frequency}}</td>
            <td v-if="!entity.editMode">{{entity.agent_identified__agent}}</td>
            <td v-if="!entity.editMode">{{entity.date_identified}}</td>
            <td v-if="!entity.editMode" class="text-center">{{ entity.extra === true ? '&#10003' : '' }}</td>
            <td v-if="!entity.editMode">{{entity.preparation}}</td>
            <td v-if="!entity.editMode" class="text-center">{{ entity.is_private === true ? '&#10003' : '' }}</td>
            <td v-if="!entity.editMode">{{entity.remarks}}</td>
            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.taxon" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.taxon" id="taxon1"  select-label=""
                               label="taxon" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.taxon" :searchable="true" @search-change="autcompleteTaxonSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'top'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.taxon}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.name" type="text"/></td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.frequency" type="number"/></td>
            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.agent_identified" deselect-label="Can't remove this value"
                               label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"  select-label=""
                               :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'top'">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect></td>
            <td v-if="entity.editMode">
              <datepicker id="date1"
                          v-model="entity.new.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"/>
            </td>
            <td v-if="entity.editMode" class="text-center"><b-form-checkbox v-model="entity.new.extra" :value="true" :unchecked-value="false"/></td>
            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.preparation" deselect-label=""
                               id="preparation"  select-label=""
                               label="id" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :custom-label="customPreparationLabel"
                               :options="relatedData.preparation"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'top'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.id}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-if="entity.editMode" class="text-center"><b-form-checkbox v-model="entity.new.is_private" :value="true" :unchecked-value="false"/></td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.remarks" type="text"/></td>

            <td style="padding: 0.6em!important;">
              <button  v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button  v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
            </td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.taxon_list.taxon" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.taxon" id="taxon"  select-label=""
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
                                      :loading="autocomplete.loaders.agent"  select-label=""
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
              <vue-multiselect class="align-middle" v-model="relatedData.insert.taxon_list.preparation" deselect-label=""
                               id="preparation"  select-label=""
                               :custom-label="customPreparationLabel"  track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="relatedData.preparation"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.id}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td class="text-center"><b-form-checkbox v-model="relatedData.insert.taxon_list.is_private" :value="true" :unchecked-value="false"/></td>
            <td><b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text"/></td>
            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.taxon_list = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

  import formManipulation  from '../../../mixins/formManipulation';
  import autocompleteFieldManipulation  from '../../../mixins/autocompleFormManipulation';
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

      mixins: [formManipulation,autocompleteFieldManipulation],

      methods: {
        customPreparationLabel(item) {
          return `${item.id} (${item.preparation_number})`
        }
      }
    }
</script>
<style scoped>

</style>
