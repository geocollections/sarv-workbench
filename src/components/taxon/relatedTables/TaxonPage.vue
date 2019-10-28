<template>
  <div
    class="taxon-page row"
    :class="{ active: activeTab === 'taxon_page' }"
  >
    <div class="col-sm-12" v-if="activeTab === 'taxon_page'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("taxon.language") }}</th>
              <th>{{ $t("taxon.frontpage") }}</th>
              <th>{{ $t("taxon.frontpage_title") }}</th>
              <th>{{ $t("taxon.title") }}</th>
              <th>{{ $t("taxon.author") }}</th>
              <th>{{ $t("taxon.author_txt") }}</th>
              <th>{{ $t("taxon.year") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.taxon_page"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">{{ entity.language }}</td>

              <td v-if="!entity.editMode">{{ entity.frontpage }}</td>

              <td v-if="!entity.editMode">{{ entity.frontpage_title }}</td>

              <td v-if="!entity.editMode">{{ entity.title }}</td>

              <td v-if="!entity.editMode">{{ entity.author }}</td>

              <td v-if="!entity.editMode">{{ entity.author_txt }}</td>

              <td v-if="!entity.editMode">{{ entity.date_txt }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.language" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.frontpage" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.frontpage_title" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.title" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.author" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.author_txt" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.date_txt" type="text" />
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
                  v-model="relatedData.insert.taxon_page.language"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_page.frontpage"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_page.frontpage_title"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_page.title"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_page.author"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_page.author_txt"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_page.date_txt"
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
  name: "TaxonPage",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
