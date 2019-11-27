<template>
  <div
    id="#tab-reference"
    class="tab-reference row"
    :class="{ active: activeTab === 'analysis' }"
    role="tabpanel"
  >
    <div class="col-sm-12" v-if="activeTab === 'analysis'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t("analysis.method") }}</th>
              <th>{{ $t("analysis.method_specification") }}</th>
              <th>{{ $t("analysis.mass") }}</th>
              <th class="date-th">{{ $t("analysis.date") }}</th>
              <th class="date-th">{{ $t("analysis.date_end") }}</th>
              <th>{{ $t("analysis.date_free") }}</th>
              <th>{{ $t("analysis.agent") }}</th>
              <th>{{ $t("analysis.remarks") }}</th>
              <th class="text-center">
                <i class="fas fa-lock" :title="$t('analysis.is_locked')"></i>
              </th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.analysis"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">
                <router-link :to="{ path: '/analysis/' + entity.id }">
                  {{ entity.id }}
                </router-link>
              </td>

              <td
                v-if="!entity.editMode"
                v-translate="{
                  et: entity.analysis_method__analysis_method,
                  en: entity.analysis_method__method_en
                }"
              ></td>

              <td v-if="!entity.editMode">{{ entity.method_details }}</td>

              <td v-if="!entity.editMode">{{ entity.mass }}</td>

              <td v-if="!entity.editMode">{{ entity.date }}</td>

              <td v-if="!entity.editMode">{{ entity.date_end }}</td>

              <td v-if="!entity.editMode">{{ entity.date_free }}</td>

              <td v-if="!entity.editMode">{{ entity.agent__agent }}</td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <td v-if="!entity.editMode" class="text-center">
                {{ entity.is_private ? "+" : "-" }}
              </td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <router-link :to="{ path: '/analysis/' + entity.id }">
                  {{ entity.id }}
                </router-link>
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.analysis_method"
                  id="analysis_method"
                  :options="autocomplete.analysis_method"
                  track-by="id"
                  :label="analysisMethodLabel"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[analysisMethodLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.method_details" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.mass" type="number" />
              </td>

              <td v-if="entity.editMode">
                <datepicker
                  id="date1"
                  v-model="entity.new.date"
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                />
              </td>

              <td v-if="entity.editMode">
                <datepicker
                  id="date_end1"
                  v-model="entity.new.date_end"
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                  input-class="form-control"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.date_free" type="text" />
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.agent"
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
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.agent }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.remarks" type="text" />
              </td>

              <td v-if="entity.editMode" class="text-center">
                <b-form-checkbox
                  v-model="entity.new.is_private"
                  :value="true"
                  :unchecked-value="false"
                />
              </td>

              <td style="padding: 0.6em!important;">
                <button
                  class="float-left btn btn-sm"
                  :class="
                    entity.editMode ? 'btn-success' : 'btn-outline-success'
                  "
                  :disabled="sendingData"
                  @click="$emit('edit-row', entity, index)"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>

                <button
                  class="float-right btn btn-sm"
                  :class="
                    entity.allowRemove ? 'btn-danger' : 'btn-outline-danger'
                  "
                  :disabled="sendingData"
                  @click="$emit('remove-row', entity, index)"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>

            <tr class="related-input-data">
              <td></td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.analysis.analysis_method"
                  id="analysis_method_insert"
                  :options="autocomplete.analysis_method"
                  track-by="id"
                  :label="analysisMethodLabel"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[analysisMethodLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis.method_details"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis.mass"
                  type="number"
                />
              </td>

              <td>
                <datepicker
                  id="date"
                  v-model="relatedData.insert.analysis.date"
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                />
              </td>

              <td>
                <datepicker
                  id="date_end"
                  v-model="relatedData.insert.analysis.date_end"
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis.date_free"
                  type="text"
                />
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.analysis.agent"
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
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.agent }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis.remarks"
                  type="text"
                />
              </td>

              <td class="text-center">
                <b-form-checkbox
                  v-model="relatedData.insert.analysis.is_private"
                  :value="true"
                  :unchecked-value="false"
                />
              </td>

              <td style="padding: 0.6em!important;">
                <button
                  class="float-left btn btn-sm btn-success"
                  :disabled="sendingData"
                  @click="$emit('add-related-data', activeTab)"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>

                <button
                  class="float-right btn btn-sm btn-danger"
                  :disabled="sendingData"
                  @click="$emit('set-default', activeTab)"
                >
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
import Datepicker from "vue2-datepicker";

export default {
  name: "SampleAnalysis",
  components: {
    Datepicker
  },
  mixins: [formManipulation, autocompleteMixin],
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  }
};
</script>
<style scoped></style>
