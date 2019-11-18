<template>
  <div
    id="#tab-attachment"
    class="tab-pane row"
    :class="{ active: activeTab === 'attachment_link' }"
    role="tabpanel"
  >
    <div class="col-md-6" v-if="activeTab === 'attachment_link'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("attachments.link") }}</th>
              <th>{{ $t("attachments.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.attachment_link"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">
                <router-link :to="{ path: '/attachment/' + entity.id }">
                  {{ entity.original_filename }}
                </router-link>
              </td>

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
                <b-form-input v-model="entity.new.remarks" type="text" />
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

            <tr class="related-input-data">
              <td>
                <vue-multiselect
                  v-model="relatedData.insert.attachment_link.attachment"
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
                <b-form-input
                  v-model="relatedData.insert.attachment_link.remarks"
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
      class="col-md-6"
      v-if="activeTab === 'attachment_link' && $route.meta.isEdit"
    >
      <file-table
        :attachments="relatedData.attachment_link"
        :object="'locality'"
        v-if="relatedData.attachment_link.length > 0"
      />
    </div>
  </div>
</template>

<script>
import formManipulation from "../../../mixins/formManipulation";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import FileTable from "../../partial/FileTable";

export default {
  name: "LocalityAttachment",
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
