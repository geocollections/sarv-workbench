<template>
  <div
    class="taxon-opinion row"
    :class="{ active: activeTab === 'taxon_opinion' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'taxon_opinion'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("taxon.opinion") }}</th>
              <th>{{ $t("taxon.other_taxon") }}</th>
              <th>{{ $t("taxon.opinion_reference") }}</th>
              <th>{{ $t("taxon.pages") }}</th>
              <th>{{ $t("taxon.author") }}</th>
              <th>{{ $t("taxon.year") }}</th>
              <th>{{ $t("taxon.is_preferred_opinion") }}</th>
              <th>{{ $t("taxon.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.taxon_opinion"
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
                  et: entity.opinion_type__value,
                  en: entity.opinion_type__value_en
                }"
              ></td>

              <td v-if="!entity.editMode">{{ entity.other_taxon__taxon }}</td>

              <td v-if="!entity.editMode">
                <router-link
                  v-if="entity.reference"
                  :to="{ path: '/reference/' + entity.reference }"
                  target="ReferenceWindow"
                >
                  {{ entity.reference__reference }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">{{ entity.pages }}</td>

              <td v-if="!entity.editMode">{{ entity.author }}</td>

              <td v-if="!entity.editMode">{{ entity.year }}</td>

              <td v-if="!entity.editMode" class="text-center">
                <v-icon small color="blue" v-if="entity.is_preferred"
                  >fas fa-plus</v-icon
                >
                <v-icon small color="blue" v-else>fas fa-minus</v-icon>
              </td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.opinion_type"
                  id="opinion_type"
                  :options="autocomplete.opinion_type"
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
                <vue-multiselect
                  v-model="entity.new.other_taxon"
                  id="other_taxon"
                  label="taxon"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.taxon"
                  :options="autocomplete.taxon"
                  @search-change="autocompleteTaxonSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.taxon }}</strong>
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
                <b-form-input v-model="entity.new.pages" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.author" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.year" type="text" />
              </td>

              <td v-if="entity.editMode" class="middle">
                <v-checkbox
                  v-model="entity.new.is_preferred"
                  color="blue"
                  class="justify-center pt-0 mt-0"
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
                <vue-multiselect
                  v-model="relatedData.insert.taxon_opinion.opinion_type"
                  id="opinion_type_insert"
                  :options="autocomplete.opinion_type"
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
                <vue-multiselect
                  v-model="relatedData.insert.taxon_opinion.other_taxon"
                  id="other_taxon_insert"
                  label="taxon"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.taxon"
                  :options="autocomplete.taxon"
                  @search-change="autocompleteTaxonSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.taxon }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.taxon_opinion.reference"
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
                  v-model="relatedData.insert.taxon_opinion.pages"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_opinion.author"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_opinion.year"
                  type="text"
                />
              </td>

              <td class="middle">
                <v-checkbox
                  v-model="relatedData.insert.taxon_opinion.is_preferred"
                  color="blue"
                  class="justify-center pt-0 mt-0"
                  hide-details
                ></v-checkbox>
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_opinion.remarks"
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
  name: "TaxonOpinion",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped>
.middle {
  vertical-align: middle;
}
</style>
