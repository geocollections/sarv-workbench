<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'preparation'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'preparation'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('preparation.preparation_number') }}</th>
            <th>{{ $t('preparation.fossil_group') }}</th>
            <th>{{ $t('preparation.storage') }}</th>
            <th>{{ $t('preparation.remarks') }}</th>
<!--            <th>{{ $t('preparation.method_id') }}</th>-->
            <th>
              <i class="fas fa-user-lock" :title="$t('taxon.is_private')"></i>
            </th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.preparation"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{entity.preparation_number}}</td>
            <td v-if="!entity.editMode">{{entity.taxon__taxon}}</td>
            <td v-if="!entity.editMode">{{entity.storage__location}}</td>
            <td v-if="!entity.editMode">{{entity.remarks}}</td>
<!--            <td v-if="!entity.editMode">{{entity.analysis}}</td>-->
            <td v-if="!entity.editMode" class="text-center">{{ entity.is_private === true ? '&#10003' : '' }}</td>

            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.preparation_number" type="text"/>
            </td>
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.taxon"
                               id="taxon"
                               :options="autocomplete.fossil_group"
                               track-by="id"
                               label="taxon"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.storage"
                               id="storage"
                               label="location"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.storage"
                               :options="autocomplete.storage"
                               @search-change="autocompleteStorageSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{option.location}}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.remarks" type="text"/>
            </td>

<!--            <td v-if="entity.editMode">-->
<!--              <vue-multiselect v-model="entity.new.storage"-->
<!--                               id="analysis"-->
<!--                               :label="analysisMethodLabel"-->
<!--                               track-by="id"-->
<!--                               :placeholder="$t('add.inputs.autocomplete')"-->
<!--                               :loading="autocomplete.loaders.analysis"-->
<!--                               :options="autocomplete.analysis"-->
<!--                               @search-change="autocompleteAnalysisSearch"-->
<!--                               :internal-search="false"-->
<!--                               :preserve-search="true"-->
<!--                               :clear-on-select="false"-->
<!--                               :show-labels="false">-->
<!--                <template slot="singleLabel" slot-scope="{ option }">-->
<!--                  <strong>{{option[analysisMethodLabel]}}</strong>-->
<!--                </template>-->
<!--                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
<!--              </vue-multiselect>-->
<!--            </td>-->
            <td v-if="entity.editMode" class="text-center">
              <b-form-checkbox v-model="entity.new.is_private" :value="true" :unchecked-value="false"/>
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
              <b-form-input v-model="relatedData.insert.preparation.preparation_number" type="text"/>
            </td>
            <td>
              <vue-multiselect v-model="relatedData.insert.preparation.taxon"
                               id="taxon_insert"
                               :options="autocomplete.fossil_group"
                               track-by="id"
                               label="taxon"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td>
              <vue-multiselect v-model="relatedData.insert.preparation.storage"
                               id="storage_insert"
                               label="location"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.storage"
                               :options="autocomplete.storage"
                               @search-change="autocompleteStorageSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{option.location}}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td>
              <b-form-input v-model="relatedData.insert.preparation.remarks" type="text"/>
            </td>

<!--            <td>-->
<!--              <vue-multiselect v-model="relatedData.insert.preparation.analysis"-->
<!--                               id="analysis_insert"-->
<!--                               :label="analysisMethodLabel"-->
<!--                               track-by="id"-->
<!--                               :placeholder="$t('add.inputs.autocomplete')"-->
<!--                               :loading="autocomplete.loaders.analysis"-->
<!--                               :options="autocomplete.analysis"-->
<!--                               @search-change="autocompleteAnalysisSearch"-->
<!--                               :internal-search="false"-->
<!--                               :preserve-search="true"-->
<!--                               :clear-on-select="false"-->
<!--                               :show-labels="false">-->
<!--                <template slot="singleLabel" slot-scope="{ option }">-->
<!--                  <strong>{{option[analysisMethodLabel]}}</strong>-->
<!--                </template>-->
<!--                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
<!--              </vue-multiselect>-->
<!--            </td>-->

            <td class="text-center">
              <b-form-checkbox v-model="relatedData.insert.preparation.is_private" :value="true"
                               :unchecked-value="false"/>
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
    name: "SamplePreparation",
    components: {
      Datepicker
    },
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String,
    },

    mixins: [formManipulation, autocompleteMixin],

    methods: {
      customAnalysisLabel(item) {
        return this.$i18n.locale === 'ee' ? `${item.id} (${item.analysis_method__analysis_method})` : `${item.id} (${item.analysis_method__method_en})`
      }
    }
  }
</script>
<style scoped>

</style>
