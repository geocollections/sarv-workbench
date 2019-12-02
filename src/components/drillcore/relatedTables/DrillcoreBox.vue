<template>
  <div
    class="drillcore-box tab-drillcore-box row"
    :class="{ active: activeTab === 'drillcore_box' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'drillcore_box'">
      <div class="table-responsive-sm">
        <table class="table table-hover related-table">
          <thead>
            <tr>
              <th>{{ $t("drillcore_box.number") }}</th>
              <th>{{ $t("drillcore_box.depth_start") }}</th>
              <th>{{ $t("drillcore_box.depth_end") }}</th>
              <th>{{ $t("drillcore_box.stratigraphy_base") }}</th>
              <th>{{ $t("drillcore_box.stratigraphy_top") }}</th>
              <th>{{ $t("drillcore_box.depth_other") }}</th>
              <th>{{ $t("drillcore_box.number_meters") }}</th>
              <th>{{ $t("drillcore_box.diameter") }}</th>
              <th>{{ $t("drillcore_box.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.drillcore_box"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">{{ entity.number }}</td>

              <td v-if="!entity.editMode">{{ entity.depth_start }}</td>

              <td v-if="!entity.editMode">{{ entity.depth_end }}</td>

              <td v-if="!entity.editMode">
                <span
                  v-translate="{
                    et: entity.stratigraphy_base__stratigraphy,
                    en: entity.stratigraphy_base__stratigraphy_en
                  }"
                ></span>
              </td>

              <td v-if="!entity.editMode">
                <span
                  v-translate="{
                    et: entity.stratigraphy_top__stratigraphy,
                    en: entity.stratigraphy_top__stratigraphy_en
                  }"
                ></span>
              </td>

              <td v-if="!entity.editMode">{{ entity.depth_other }}</td>

              <td v-if="!entity.editMode">{{ entity.number_meters }}</td>

              <td v-if="!entity.editMode">{{ entity.diameter }}</td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.number"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.depth_start"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.depth_end"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.stratigraphy_base"
                  id="stratigraphy_base"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.stratigraphy_base"
                  :options="autocomplete.stratigraphy_base"
                  @search-change="autocompleteStratigraphyBaseSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[stratigraphyLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.stratigraphy_top"
                  id="stratigraphy_top"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.stratigraphy_top"
                  :options="autocomplete.stratigraphy_top"
                  @search-change="autocompleteStratigraphyTopSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[stratigraphyLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.depth_other"
                  type="text"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.number_meters"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.diameter"
                  type="number"
                />
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
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_box.number"
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_box.depth_start"
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_box.depth_end"
                  type="number"
                />
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.drillcore_box.stratigraphy_base"
                  id="stratigraphy_base_insert"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.stratigraphy_base"
                  :options="autocomplete.stratigraphy_base"
                  @search-change="autocompleteStratigraphyBaseSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[stratigraphyLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.drillcore_box.stratigraphy_top"
                  id="stratigraphy_top_insert"
                  :label="stratigraphyLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.stratigraphy_top"
                  :options="autocomplete.stratigraphy_top"
                  @search-change="autocompleteStratigraphyTopSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[stratigraphyLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_box.depth_other"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_box.number_meters"
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_box.diameter"
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.drillcore_box.remarks"
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

export default {
  name: "DrillcoreBox",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
