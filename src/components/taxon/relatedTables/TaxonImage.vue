<template>
  <div class="taxon-image row" :class="{ active: activeTab === 'taxon_image' }">
    <div class="col-sm-12" v-if="activeTab === 'taxon_image'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("taxon.attachment") }}</th>
              <th>Link</th>
              <th>{{ $t("taxon.title") }}</th>
              <th>{{ $t("taxon.title_en") }}</th>
              <th>{{ $t("taxon.sort") }}</th>
              <th>{{ $t("taxon.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.taxon_image"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">
                <router-link
                  :to="{ path: '/attachment/' + entity.attachment }"
                  target="AttachmentWindow"
                >
                  {{ entity.attachment__original_filename }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">
                <a
                  v-if="entity.link"
                  :href="getFossilsUrl(entity.link)"
                  :title="getFossilsUrl(entity.link)"
                  target="FossilsWindow"
                >
                  {{ entity.link__taxon }}
                </a>
              </td>

              <td v-if="!entity.editMode">{{ entity.title }}</td>

              <td v-if="!entity.editMode">{{ entity.title_en }}</td>

              <td v-if="!entity.editMode">{{ entity.sort }}</td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.attachment"
                  id="attachment"
                  label="original_filename"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.attachment"
                  :options="autocomplete.attachment"
                  @search-change="autocompletePublicAttachmentSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.original_filename }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.link"
                  id="link"
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
                <b-form-input v-model="entity.new.title" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.title_en" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.sort" type="number" />
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
                  v-model="relatedData.insert.taxon_image.attachment"
                  id="attachment_insert"
                  label="original_filename"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.attachment"
                  :options="autocomplete.attachment"
                  @search-change="autocompletePublicAttachmentSearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.original_filename }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <vue-multiselect
                  v-model="relatedData.insert.taxon_image.link"
                  id="link_insert"
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
                <b-form-input
                  v-model="relatedData.insert.taxon_image.title"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_image.title_en"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_image.sort"
                  type="number"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.taxon_image.remarks"
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

    <div
      class="col-sm-12"
      v-if="activeTab === 'taxon_image' && $route.meta.isEdit"
    >
      <file-table
        :attachments="relatedData.taxon_image"
        object="taxon"
        prefix="attachment__"
        v-if="relatedData.taxon_image.length > 0"
      />
    </div>
  </div>
</template>

<script>
import formManipulation from "../../../mixins/formManipulation";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import FileTable from "../../partial/FileTable";

export default {
  name: "TaxonImage",
  components: {
    FileTable
  },
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
