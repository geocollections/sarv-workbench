<template>
  <div
    id="#tab-attachment"
    class="tab-attachment row"
    :class="{ active: activeTab === 'analysis_results' }"
    role="tabpanel"
  >
    <div class="col-sm-12" v-if="activeTab === 'analysis_results'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("analysis.relatedTables.result_name") }}</th>
              <th>{{ $t("analysis.relatedTables.result_value") }}</th>
              <th>{{ $t("analysis.relatedTables.result_max") }}</th>
              <th>{{ $t("analysis.relatedTables.result_min") }}</th>
              <th>{{ $t("analysis.relatedTables.result_bin") }}</th>
              <th>{{ $t("analysis.relatedTables.result_txt") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.analysis_results"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->

              <td v-if="!entity.editMode">{{ entity.name }}</td>

              <td v-if="!entity.editMode">{{ entity.value }}</td>

              <td v-if="!entity.editMode">{{ entity.value_max }}</td>
              <td v-if="!entity.editMode">{{ entity.value_min }}</td>
              <td v-if="!entity.editMode">{{ entity.value_bin }}</td>

              <td v-if="!entity.editMode">{{ entity.value_txt }}</td>

              <!-- EDIT MODE -->

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.name" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.value" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.value_max" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.value_min" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.value_bin" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.value_txt" type="text" />
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
              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis_results.name"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis_results.value"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis_results.value_max"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis_results.value_min"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis_results.value_bin"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.analysis_results.value_txt"
                  type="text"
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

export default {
  name: "AnalysisResults",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
