<template>
  <div
    class="taxon-common-name row"
    :class="{ active: activeTab === 'taxon_common_name' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'taxon_common_name'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("taxon.name") }}</th>
              <th>{{ $t("taxon.language") }}</th>
              <th>{{ $t("taxon.is_preferred") }}</th>
              <th>{{ $t("taxon.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.taxon_common_name"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">{{ entity.name }}</td>

              <td
                v-if="!entity.editMode"
                v-translate="{
                  et: entity.language__value,
                  en: entity.language__value_en
                }"
              ></td>

              <td v-if="!entity.editMode" class="text-center" style="vertical-align: middle">
                <v-icon small color="blue" v-if="entity.is_preferred"
                  >fas fa-plus</v-icon
                >
                <v-icon small color="blue" v-else>fas fa-minus</v-icon>
              </td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.name" type="text" />
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.language"
                  id="language"
                  :options="autocomplete.language"
                  track-by="id"
                  :label="commonLabel"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[commonLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <v-checkbox
                  v-model="entity.new.is_preferred"
                  color="blue"
                  class="justify-center pt-0 mt-2"
                  hide-details
                ></v-checkbox>
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.remarks" type="text" />
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

            <!-- INSERT MODE -->
            <tr class="related-input-data">
              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_common_name.name"
                  type="text"
                />
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.taxon_common_name.language"
                  id="language_insert"
                  :options="autocomplete.language"
                  track-by="id"
                  :label="commonLabel"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[commonLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <v-checkbox
                  v-model="relatedData.insert.taxon_common_name.is_preferred"
                  color="blue"
                  class="justify-center pt-0 mt-2"
                  hide-details
                ></v-checkbox>
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_common_name.remarks"
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
  name: "TaxonCommonName",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
