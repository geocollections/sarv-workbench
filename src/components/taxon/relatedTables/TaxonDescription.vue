<template>
  <div
    class="taxon-description row"
    :class="{ active: activeTab === 'taxon_description' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'taxon_description'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("taxon.reference") }}</th>
              <th>{{ $t("taxon.author") }}</th>
              <th>{{ $t("taxon.author") }}</th>
              <th>{{ $t("taxon.year") }}</th>
              <th>{{ $t("taxon.language") }}</th>
              <th>{{ $t("taxon.description") }}</th>
              <th>{{ $t("taxon.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.taxon_description"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">
                <router-link
                  v-if="entity.reference"
                  :to="{ path: '/reference/' + entity.reference }"
                  target="ReferenceWindow"
                >
                  {{ entity.reference__reference }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">{{ entity.agent__agent }}</td>

              <td v-if="!entity.editMode">{{ entity.author_free }}</td>

              <td v-if="!entity.editMode">{{ entity.date_free }}</td>

              <td
                v-if="!entity.editMode"
                v-translate="{
                  et: entity.language__value,
                  en: entity.language__value_en
                }"
              ></td>

              <td v-if="!entity.editMode" v-html="entity.description"></td>

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
                <b-form-input v-model="entity.new.author_free" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.date_free" type="text" />
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
                <b-form-input v-model="entity.new.description" type="text" />
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
                <vue-multiselect
                  v-model="relatedData.insert.taxon_description.reference"
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
                <vue-multiselect
                  v-model="relatedData.insert.taxon_description.agent"
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
                  v-model="relatedData.insert.taxon_description.author_free"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_description.date_free"
                  type="text"
                />
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.taxon_description.language"
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
                <b-form-input
                  v-model="relatedData.insert.taxon_description.description"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_description.remarks"
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
  name: "TaxonDescription",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
