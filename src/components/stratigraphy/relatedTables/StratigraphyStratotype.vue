<template>
  <div class="row" :class="{ active: activeTab === 'stratigraphy_stratotype' }">
    <div class="col-sm-12" v-if="activeTab === 'stratigraphy_stratotype'">
      <div class="table-responsive-sm">
        <table class="table table-hover related-table">
          <thead>
            <tr>
              <th>{{ $t("stratigraphy_stratotype.locality") }}</th>
              <th>{{ $t("stratigraphy_stratotype.stratotype_type") }}</th>
              <th>{{ $t("stratigraphy_stratotype.depth_base") }}</th>
              <th>{{ $t("stratigraphy_stratotype.depth_top") }}</th>
              <th>{{ $t("stratigraphy_stratotype.reference") }}</th>
              <th>{{ $t("stratigraphy_stratotype.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.stratigraphy_stratotype"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">
                <router-link :to="{ path: '/locality/' + entity.locality }">
                  <span
                    v-translate="{
                      et: entity.locality__locality,
                      en: entity.locality__locality_en
                    }"
                  ></span>
                </router-link>
              </td>

              <td v-if="!entity.editMode">
                <span
                  v-translate="{
                    et: entity.stratotype_type__value,
                    en: entity.stratotype_type__value_en
                  }"
                ></span>
              </td>

              <td v-if="!entity.editMode">{{ entity.depth_base }}</td>

              <td v-if="!entity.editMode">{{ entity.depth_top }}</td>

              <td v-if="!entity.editMode">
                <router-link :to="{ path: '/reference/' + entity.reference }">
                  {{ entity.reference__reference }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.locality"
                  id="locality"
                  :label="localityLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.locality"
                  :options="autocomplete.locality"
                  @search-change="autocompleteLocalitySearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.stratotype_type"
                  id="stratotype_type"
                  :label="commonLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.list_stratotype_type"
                  :options="autocomplete.list_stratotype_type"
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
                <b-form-input
                  size="sm"
                  v-model="entity.new.depth_base"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.depth_top"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.reference"
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
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.reference }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
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
                <vue-multiselect
                  v-model="relatedData.insert.stratigraphy_stratotype.locality"
                  id="locality_insert"
                  :label="localityLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.locality"
                  :options="autocomplete.locality"
                  @search-change="autocompleteLocalitySearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <vue-multiselect
                  v-model="
                    relatedData.insert.stratigraphy_stratotype.stratotype_type
                  "
                  id="stratotype_type_insert"
                  :label="commonLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.list_stratotype_type"
                  :options="autocomplete.list_stratotype_type"
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
                <b-form-input
                  size="sm"
                  v-model="
                    relatedData.insert.stratigraphy_stratotype.depth_base
                  "
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_stratotype.depth_top"
                  type="number"
                />
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.stratigraphy_stratotype.reference"
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
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.reference }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_stratotype.remarks"
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
  name: "StratigraphyStratotype",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
