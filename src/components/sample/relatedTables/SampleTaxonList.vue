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
            <th>{{ $t('taxon.det_date') }}
              <i class="fas fa-calendar-alt" title="Date identified"></i>
            </th>
            <th>{{ $t('taxon.extra') }}</th>
            <th>{{ $t('taxon.preparation') }}</th>
            <th>
              <i class="fas fa-user-lock" :title="$t('taxon.is_private')"></i>
            </th>
            <th>
              <i class="fas fa-comment-alt" :title="$t('taxon.remarks')"></i>
            </th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.taxon_list"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{entity.taxon__taxon}}</td>
            <td v-if="!entity.editMode">{{entity.name}}</td>
            <td v-if="!entity.editMode">{{entity.frequency}}</td>
            <td v-if="!entity.editMode">{{entity.agent_identified__agent}}</td>
            <td v-if="!entity.editMode">{{entity.date_identified}}</td>
            <td v-if="!entity.editMode" class="text-center">{{ entity.extra === true ? '&#10003' : '' }}</td>
            <td v-if="!entity.editMode">{{entity.preparation_number}}</td>
            <td v-if="!entity.editMode" class="text-center">{{ entity.is_private === true ? '&#10003' : '' }}</td>
            <td v-if="!entity.editMode">{{entity.remarks}}</td>

            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.taxon"
                               id="taxon"
                               label="taxon"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.taxon"
                               :options="autocomplete.taxon"
                               @search-change="autocompleteTaxonSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.name" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.frequency" type="number"/>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.agent_identified"
                               id="agent_identified"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="autocompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <datepicker id="date1"
                          v-model="entity.new.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"/>
            </td>

            <td v-if="entity.editMode" class="text-center">
              <b-form-checkbox v-model="entity.new.extra" :value="true" :unchecked-value="false"/>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.preparation"
                               id="preparation"
                               label="preparation_number"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.preparation"
                               :options="autocomplete.preparation"
                               @search-change="autocompletePreparationSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.preparation_number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode" class="text-center">
              <b-form-checkbox v-model="entity.new.is_private" :value="true" :unchecked-value="false"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm"
                      :class="entity.editMode ? 'btn-success' : 'btn-outline-success'"
                      :disabled="sendingData"
                      @click="$emit('edit-row', entity, index)">
                <i class="fas fa-pencil-alt"></i>
              </button>

              <button class="float-right btn btn-sm"
                      :class="entity.allowRemove ? 'btn-danger' : 'btn-outline-danger'"
                      :disabled="sendingData"
                      @click="$emit('remove-row', entity, index)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>

          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.taxon_list.taxon"
                               id="taxon_insert"
                               label="taxon"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.taxon"
                               :options="autocomplete.taxon"
                               @search-change="autocompleteTaxonSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.taxon_list.name" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.taxon_list.frequency" type="number"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.taxon_list.agent_identified"
                               id="agent_identified_insert"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="autocompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <datepicker id="date"
                          v-model="relatedData.insert.taxon_list.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"/>
            </td>

            <td class="text-center">
              <b-form-checkbox v-model="relatedData.insert.taxon_list.extra" :value="true" :unchecked-value="false"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.taxon_list.preparation"
                                 id="preparation_insert"
                                 label="preparation_number"
                                 track-by="id"
                                 :placeholder="$t('add.inputs.autocomplete')"
                                 :loading="autocomplete.loaders.preparation"
                                 :options="autocomplete.preparation"
                                 @search-change="autocompletePreparationSearch"
                                 :internal-search="false"
                                 :preserve-search="true"
                                 :clear-on-select="false"
                                 :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.preparation_number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td class="text-center">
              <b-form-checkbox v-model="relatedData.insert.taxon_list.is_private" :value="true"
                               :unchecked-value="false"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.taxon_list.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" :disabled="sendingData"
                      @click="$emit('add-related-data', activeTab)">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="float-right btn btn-sm btn-danger" :disabled="sendingData"
                      @click="$emit('set-default', activeTab)">
                <i class="fas fa-times"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import formManipulation from '../../../mixins/formManipulation';
  import autocompleteMixin from '../../../mixins/autocompleteMixin';
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

    mixins: [formManipulation, autocompleteMixin],
  }
</script>
<style scoped>

</style>
