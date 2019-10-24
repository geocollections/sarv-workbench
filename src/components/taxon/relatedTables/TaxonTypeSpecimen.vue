<template>
  <div
    class="taxon_type_specimen row"
    :class="{ active: activeTab === 'taxon_type_specimen' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'taxon_type_specimen'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("taxon.type_type") }}</th>
              <th>{{ $t("taxon.repository") }}</th>
              <th>{{ $t("taxon.specimen_sarv") }}</th>
              <th>{{ $t("taxon.specimen_number") }}</th>
              <th>{{ $t("taxon.reference") }}</th>
              <th>{{ $t("taxon.locality") }}</th>
              <th>{{ $t("taxon.stratigraphy") }}</th>
              <th>{{ $t("taxon.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.taxon_type_specimen"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td
                v-if="!entity.editMode"
                v-translate="{
                  et: entity.type_type__value,
                  en: entity.type_type__value_en
                }"
              ></td>

              <td v-if="!entity.editMode">{{ entity.repository }}</td>

              <td v-if="!entity.editMode">
                {{ entity.specimen__specimen_id }}
              </td>

              <td v-if="!entity.editMode">{{ entity.specimen_number }}</td>

              <td v-if="!entity.editMode">
                <router-link
                  v-if="entity.reference"
                  :to="{ path: '/reference/' + entity.reference }"
                  target="ReferenceWindow"
                >
                  {{ entity.reference__reference }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">
                <router-link
                  v-if="entity.locality"
                  :to="{ path: '/locality/' + entity.locality }"
                  v-translate="{
                    et: entity.locality__locality,
                    en: entity.locality__locality_en
                  }"
                  target="LocalityWindow"
                >
                </router-link>
              </td>

              <td
                v-if="!entity.editMode"
                v-translate="{
                  et: entity.stratigraphy__stratigraphy,
                  en: entity.stratigraphy__stratigraphy_en
                }"
              ></td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <vue-multiselect v-model="entity.new.type_type"
                                 id="type"
                                 :options="autocomplete.taxon_type_type"
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

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.repository" type="text" />
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect v-model="entity.new.specimen"
                                 id="specimen"
                                 label="specimen_id"
                                 track-by="id"
                                 :placeholder="$t('add.inputs.autocomplete')"
                                 :loading="autocomplete.loaders.specimen"
                                 :options="autocomplete.specimen"
                                 @search-change="autocompleteSpecimenSearch"
                                 :internal-search="false"
                                 :preserve-search="true"
                                 :clear-on-select="false"
                                 :show-labels="false">
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.specimen_id }}</strong>
                  </template>
                  <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.specimen_number" type="text" />
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
                <vue-multiselect v-model="entity.new.locality"
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
                                 :show-labels="false">
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect v-model="entity.new.stratigraphy"
                                 id="stratigraphy"
                                 :label="stratigraphyLabel"
                                 track-by="id"
                                 :placeholder="$t('add.inputs.autocomplete')"
                                 :loading="autocomplete.loaders.stratigraphy"
                                 :options="autocomplete.stratigraphy"
                                 @search-change="autocompleteStratigraphySearch"
                                 :internal-search="false"
                                 :preserve-search="true"
                                 :clear-on-select="false"
                                 :show-labels="false">
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[stratigraphyLabel] }}</strong>
                  </template>
                  <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                </vue-multiselect>
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
                <vue-multiselect v-model="relatedData.insert.taxon_type_specimen.type_type"
                                 id="type_insert"
                                 :options="autocomplete.taxon_type_type"
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

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_type_specimen.repository"
                  type="text"
                />
              </td>

              <td>
                <vue-multiselect v-model="relatedData.insert.taxon_type_specimen.specimen"
                                 id="specimen_insert"
                                 label="specimen_id"
                                 track-by="id"
                                 :placeholder="$t('add.inputs.autocomplete')"
                                 :loading="autocomplete.loaders.specimen"
                                 :options="autocomplete.specimen"
                                 @search-change="autocompleteSpecimenSearch"
                                 :internal-search="false"
                                 :preserve-search="true"
                                 :clear-on-select="false"
                                 :show-labels="false">
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.specimen_id }}</strong>
                  </template>
                  <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                </vue-multiselect>
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_type_specimen.specimen_number"
                  type="text"
                />
              </td>

              <td>
                <vue-multiselect v-model="relatedData.insert.taxon_type_specimen.reference"
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
                <vue-multiselect v-model="relatedData.insert.taxon_type_specimen.locality"
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
                                 :show-labels="false">
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                </vue-multiselect>
              </td>

              <td>
                <vue-multiselect v-model="relatedData.insert.taxon_type_specimen.stratigraphy"
                                 id="stratigraphy_insert"
                                 :label="stratigraphyLabel"
                                 track-by="id"
                                 :placeholder="$t('add.inputs.autocomplete')"
                                 :loading="autocomplete.loaders.stratigraphy"
                                 :options="autocomplete.stratigraphy"
                                 @search-change="autocompleteStratigraphySearch"
                                 :internal-search="false"
                                 :preserve-search="true"
                                 :clear-on-select="false"
                                 :show-labels="false">
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[stratigraphyLabel] }}</strong>
                  </template>
                  <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                </vue-multiselect>
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_type_specimen.remarks"
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
  name: "TaxonTypeSpecimen",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
