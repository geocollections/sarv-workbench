<template>
  <div class="row" :class="{ active: activeTab === 'stratigraphy_reference' }">
    <div class="col-sm-12" v-if="activeTab === 'stratigraphy_reference'">
      <div class="table-responsive-sm">
        <table class="table table-hover related-table">
          <thead>
            <tr>
              <th>{{ $t("stratigraphy_reference.reference") }}</th>
              <th>{{ $t("stratigraphy_reference.content") }}</th>
              <th>{{ $t("stratigraphy_reference.content_en") }}</th>
              <th>{{ $t("stratigraphy_reference.age_base") }}</th>
              <th>{{ $t("stratigraphy_reference.age_base_error") }}</th>
              <th>{{ $t("stratigraphy_reference.age_top") }}</th>
              <th>{{ $t("stratigraphy_reference.is_preferred_age") }}</th>
              <th>{{ $t("stratigraphy_reference.pages") }}</th>
              <th>{{ $t("stratigraphy_reference.figures") }}</th>
              <th>{{ $t("stratigraphy_reference.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.stratigraphy_reference"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">
                <router-link :to="{ path: '/reference/' + entity.reference }">
                  {{ entity.reference__reference }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">{{ entity.content }}</td>

              <td v-if="!entity.editMode">{{ entity.content_en }}</td>

              <td v-if="!entity.editMode">{{ entity.age_base }}</td>

              <td v-if="!entity.editMode">{{ entity.age_base_error }}</td>

              <td v-if="!entity.editMode">{{ entity.age_top }}</td>

              <td v-if="!entity.editMode">
                {{ entity.is_preferred_age ? "+" : "-" }}
              </td>

              <td v-if="!entity.editMode">{{ entity.pages }}</td>

              <td v-if="!entity.editMode">{{ entity.figures }}</td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
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
                  v-model="entity.new.content"
                  type="text"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.content_en"
                  type="text"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.age_base"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.age_base_error"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.age_top"
                  type="number"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-checkbox
                  size="sm"
                  v-model="entity.new.is_preferred_age"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.pages"
                  type="text"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  size="sm"
                  v-model="entity.new.figures"
                  type="text"
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
                <vue-multiselect
                  v-model="relatedData.insert.stratigraphy_reference.reference"
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
                  v-model="relatedData.insert.stratigraphy_reference.content"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_reference.content_en"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_reference.age_base"
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="
                    relatedData.insert.stratigraphy_reference.age_base_error
                  "
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_reference.age_top"
                  type="number"
                />
              </td>

              <td>
                <b-form-checkbox
                  size="sm"
                  v-model="
                    relatedData.insert.stratigraphy_reference.is_preferred_age
                  "
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_reference.pages"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_reference.figures"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  size="sm"
                  v-model="relatedData.insert.stratigraphy_reference.remarks"
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
  name: "StratigraphyReference",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
