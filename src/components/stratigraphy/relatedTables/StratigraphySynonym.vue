<template>
  <div class="row" :class="{ active: activeTab === 'stratigraphy_synonym' }">
    <div class="col-sm-12" v-if="activeTab === 'stratigraphy_synonym'">
      <div class="table-responsive-sm">
        <table class="table table-hover related-table">
          <thead>
            <tr>
              <th>{{ $t("stratigraphy_synonym.synonym") }}</th>
              <th>{{ $t("stratigraphy_synonym.language") }}</th>
              <th>{{ $t("stratigraphy_synonym.reference") }}</th>
              <th>{{ $t("stratigraphy_synonym.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.stratigraphy_synonym"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">{{ entity.synonym }}</td>

              <td v-if="!entity.editMode">
                <span
                  v-translate="{
                    et: entity.language__value,
                    en: entity.language__value_en
                  }"
                ></span>
              </td>

              <td v-if="!entity.editMode">
                <router-link :to="{ path: '/reference/' + entity.reference }">
                  {{ entity.reference__reference }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.synonym"
                  type="text"
                />
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.language"
                  id="language"
                  :label="commonLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.list_language"
                  :options="autocomplete.list_language"
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
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_synonym.synonym"
                  type="text"
                />
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.stratigraphy_synonym.language"
                  id="language_insert"
                  :label="commonLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.list_language"
                  :options="autocomplete.list_language"
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
                <vue-multiselect
                  v-model="relatedData.insert.stratigraphy_synonym.reference"
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
                  v-model="relatedData.insert.stratigraphy_synonym.remarks"
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
  name: "StratigraphySynonym",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
