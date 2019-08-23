<template>
  <div id="#tab-analysis" class="tab-analysis row" :class="{active: activeTab === 'analysis'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'analysis'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('analysis.analysis_method') }}</th>
            <th>{{ $t('analysis.method') }}</th>
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
          <tr v-for="entity in relatedData.analysis"
              :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">
              <span v-translate="{ et: entity.analysis_method__analysis_method , en: entity.analysis_method__method_en }"></span>
            </td>

            <td v-if="!entity.editMode">
              <span v-translate="{ et: entity.method_details , en: entity.method_details_en }"></span>
            </td>

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
              <vue-multiselect v-model="entity.new.reference"
                               id="reference"
                               label="reference"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference"
                               @search-change="autocompleteReferenceSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <datepicker id="date_identified"
                          class="date"
                          v-model="entity.new.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.type"
                               id="type"
                               :options="autocomplete.list_identification_type"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td class="align-middle" v-if="entity.editMode">
              <vs-checkbox id="is_private" v-model="entity.new.is_private" icon="fa-check" icon-pack="fas"></vs-checkbox>
            </td>

            <td style="padding: 0.6em!important;">
              <button v-show="entity.editMode" class="float-left btn btn-sm btn-success"
                      @click="$emit('related-data-modified', entity)" :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)"
                      :disabled="sendingData">
                <font-awesome-icon icon="trash-alt"/>
              </button>

              <button v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success"
                      @click="$emit('edit-row', entity)" :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger"
                      @click="$emit('allow-remove-row', entity)" :disabled="sendingData">
                <font-awesome-icon icon="trash-alt"/>
              </button>
            </td>
          </tr>

          <!-- INSERT MODE -->
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_identification.taxon"
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

            <td><b-form-input v-model="relatedData.insert.specimen_identification.name" type="text"/></td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_identification.agent"
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
              <vue-multiselect v-model="relatedData.insert.specimen_identification.reference"
                               id="reference_insert"
                               label="reference"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference"
                               @search-change="autocompleteReferenceSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <datepicker id="date_identified_insert"
                          class="date"
                          v-model="relatedData.insert.specimen_identification.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_identification.type"
                               id="type_insert"
                               :options="autocomplete.list_identification_type"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td class="align-middle">
              <vs-checkbox id="is_private_insert" v-model="relatedData.insert.specimen_identification.is_private" icon="fa-check" icon-pack="fas"></vs-checkbox>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.doi_date = {}"
                      :disabled="sendingData">
                <font-awesome-icon icon="times"/>
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
