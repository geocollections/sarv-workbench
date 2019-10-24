<template>
  <div
    class="taxon-synonym row"
    :class="{ active: activeTab === 'taxon_synonym' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'taxon_synonym'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("taxon.synonym") }}</th>
              <th>{{ $t("taxon.author") }}</th>
              <th>{{ $t("taxon.year") }}</th>
              <th>{{ $t("taxon.pages") }}</th>
              <th>{{ $t("taxon.figures") }}</th>
              <th>{{ $t("taxon.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.taxon_synonym"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">{{ entity.taxon_synonym }}</td>

              <td v-if="!entity.editMode">{{ entity.author }}</td>

              <td v-if="!entity.editMode">{{ entity.year }}</td>

              <td v-if="!entity.editMode">{{ entity.pages }}</td>

              <td v-if="!entity.editMode">{{ entity.figures }}</td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.taxon_synonym" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.author" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.year" type="number" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.pages" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.figures" type="text" />
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
                  v-model="relatedData.insert.taxon_synonym.taxon_synonym"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_synonym.author"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_synonym.year"
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_synonym.pages"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_synonym.figures"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_synonym.remarks"
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

export default {
  name: "TaxonSynonym",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation]
};
</script>

<style scoped></style>
