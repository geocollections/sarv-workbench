<template>
  <div class="tab-analysis row" :class="{active: activeTab === 'analysis'}">
    <div class="col-sm-12" v-if="activeTab === 'analysis'">
      <div class="table-responsive-sm">

        <table class="table table-hover related-table">
          <thead>
          <tr>
            <th>{{ $t('analysis.analysis_method') }}</th>
            <th>{{ $t('analysis.method_specification') }}</th>
            <th>{{ $t('analysis.mass') }}</th>
            <th>{{ $t('analysis.date') }}</th>
            <th>{{ $t('analysis.date_end') }}</th>
            <th>{{ $t('analysis.date_free') }}</th>
            <th>{{ $t('analysis.agent') }}</th>
            <th>{{ $t('analysis.remarks') }}</th>
            <th>{{ $t('analysis.storage') }}</th>
            <th><i class="fas fa-lock"></i></th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.analysis"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">
<!--              <router-link :to="{ path: '/analysis/' + entity.analysis_method }" :title="'analysis id: ' + entity.analysis_method">-->
                <span v-if="entity.analysis_method__analysis_method || entity.analysis_method__method_en"
                      v-translate="{ et: entity.analysis_method__analysis_method , en: entity.analysis_method__method_en }"></span>
                <span v-else>{{ entity.analysis_method }}</span>
<!--              </router-link>-->
            </td>

            <td v-if="!entity.editMode">{{ entity.method_details }}</td>

            <td v-if="!entity.editMode">{{ entity.mass }}</td>

            <td v-if="!entity.editMode">{{ entity.date }}</td>

            <td v-if="!entity.editMode">{{ entity.date_end }}</td>

            <td v-if="!entity.editMode">{{ entity.date_free }}</td>

            <td v-if="!entity.editMode">{{ entity.agent__agent }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>

            <td v-if="!entity.editMode">{{ entity.storage__location }}</td>

            <td class="is_private" v-if="!entity.editMode">
              <i v-if="entity.is_private" class="fas fa-check"></i>
            </td>


            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.analysis_method"
                               id="analysis_method"
                               :label="analysisMethodLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.analysis_method"
                               :options="autocomplete.analysis_method"
                               @search-change="autocompleteAnalysisMethodSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[analysisMethodLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.method_details" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.mass" type="number" step="0.01"/>
            </td>

            <td v-if="entity.editMode">
              <datepicker id="date"
                          class="date"
                          v-model="entity.new.date"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td v-if="entity.editMode">
              <datepicker id="date_end"
                          class="date"
                          v-model="entity.new.date_end"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.date_free" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.agent"
                               id="agent"
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
              <b-form-input v-model="entity.new.remarks" type="text"/>
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
                  <strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td style="vertical-align: middle" v-if="entity.editMode">
              <v-checkbox
                id="is_private"
                v-model="entity.new.is_private"
                hide-details
                class="mt-0 justify-center"
              ></v-checkbox>
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

          <!-- INSERT MODE -->
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.analysis.analysis_method"
                               id="analysis_method_insert"
                               :label="analysisMethodLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.analysis_method"
                               :options="autocomplete.analysis_method"
                               @search-change="autocompleteAnalysisMethodSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[analysisMethodLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis.method_details" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis.mass" type="number" step="0.01"/>
            </td>

            <td>
              <datepicker id="date_insert"
                          class="date"
                          v-model="relatedData.insert.analysis.date"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td>
              <datepicker id="date_end_insert"
                          class="date"
                          v-model="relatedData.insert.analysis.date_end"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis.date_free" type="text"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.analysis.agent"
                               id="agent_insert"
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
              <b-form-input v-model="relatedData.insert.analysis.remarks" type="text"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.analysis.storage"
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
                  <strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td style="vertical-align: middle">
              <v-checkbox
                id="is_private_insert"
                v-model="relatedData.insert.analysis.is_private"
                hide-details
                class="mt-0 justify-center"
              ></v-checkbox>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" :disabled="sendingData" @click="$emit('add-related-data', activeTab)">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="float-right btn btn-sm btn-danger" :disabled="sendingData" @click="$emit('set-default', activeTab)">
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
  import formManipulation from "../../../mixins/formManipulation";
  import autocompleteMixin from "../../../mixins/autocompleteMixin";
  import Datepicker from 'vue2-datepicker'

  export default {
    name: "SpecimenAnalysis",
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
  .is_private {
    text-align: center;
    vertical-align: middle;
    font-size: x-large;
    font-weight: 800;
  }

  .date >>> .mx-calendar-icon {
    height: unset;
  }
</style>
