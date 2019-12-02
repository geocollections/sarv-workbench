<template>
  <div
    class="tab-description row"
    :class="{ active: activeTab === 'drillcore_study' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'drillcore_study'">
      <div class="table-responsive-sm">
        <table class="table table-hover related-table">
          <thead>
            <tr>
              <th>{{ $t("drillcore_study.date") }}</th>
              <th>{{ $t("drillcore_study.agent") }}</th>
              <th>{{ $t("drillcore_study.aim") }}</th>
              <th>{{ $t("drillcore_study.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.drillcore_study"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">{{ entity.date }}</td>

              <td v-if="!entity.editMode">{{ entity.agent__agent }}</td>

              <td v-if="!entity.editMode">{{ entity.aim }}</td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <datepicker
                  id="date"
                  class="date"
                  input-class="form-control form-control-sm"
                  v-model="entity.new.date"
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                />
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
                <b-form-input size="sm" v-model="entity.new.aim" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.remarks"
                  type="text"
                />
              </td>

              <td class="px-2">
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

            <!-- INSERT MODE -->
            <tr class="related-input-data">
              <td>
                <datepicker
                  id="date_insert"
                  class="date"
                  input-class="form-control form-control-sm"
                  v-model="relatedData.insert.drillcore_study.date"
                  lang="en"
                  :first-day-of-week="1"
                  format="DD MMM YYYY"
                />
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.drillcore_study.agent"
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
                  size="sm"
                  v-model="relatedData.insert.drillcore_study.aim"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_study.remarks"
                  type="text"
                />
              </td>

              <td class="px-2">
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
  name: "DrillcoreStudy",
  components: {
    Datepicker
  },
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped>
.date >>> .mx-calendar-icon {
  height: unset;
}
</style>
