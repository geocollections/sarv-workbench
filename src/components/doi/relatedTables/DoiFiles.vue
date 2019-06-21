<template>
  <div id="#tab-attachment" class="tab-attachment row" :class="{active: activeTab === 'attachment_link'}"
       role="tabpanel">
    <div class="col-md-6" v-if="activeTab === 'attachment_link'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('doi.link') }}<font-awesome-icon class="ml-2" icon="link"/></th>
            <th>{{ $t('doi.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.attachment_link"
              :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.attachment__original_filename }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>

            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle"
                               v-model="entity.new.attachment"
                               deselect-label="Can't remove this value"
                               label="original_filename"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.attachment_public"
                               select-label=""
                               :options="autocomplete.attachment"
                               :searchable="true"
                               @search-change="autcompletePublicAttachmentSearch"
                               :internal-search="false"
                               :allow-empty="true"
                               :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.original_filename }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button v-show="entity.editMode" class="float-left btn btn-sm btn-success"
                      @click="$emit('related-data-modified', entity)" :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)"
                      :disabled="sendingData">
                <font-awesome-icon icon="trash-alt"/>
              </button>

              <button v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success"
                      @click="$emit('edit-row', entity)" :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger"
                      @click="$emit('allow-remove-row', entity)" :disabled="sendingData">
                <font-awesome-icon icon="trash-alt"/>
              </button>
            </td>
          </tr>

          <!-- INSERT MODE -->
          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle"
                               v-model="relatedData.insert.attachment_link.attachment"
                               deselect-label="Can't remove this value"
                               label="original_filename"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.attachment_public"
                               select-label=""
                               :options="autocomplete.attachment"
                               :searchable="true"
                               @search-change="autcompletePublicAttachmentSearch"
                               :internal-search="false"
                               :allow-empty="true"
                               :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.original_filename }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.attachment_link.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.attachment_link = {}"
                      :disabled="sendingData">
                <font-awesome-icon icon="times"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-md-6" v-if="activeTab === 'attachment_link'">
      <file-table :attachments="relatedData.attachment_link" :object="'doi'"
                  prefix="attachment__"
                  table-id="attachment"
                  v-if="relatedData.attachment_link.length > 0"/>
    </div>
  </div>
</template>

<script>
  import FileTable from "../../partial/FileTable";
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteFieldManipulation from "../../mixins/autocompleFormManipulation";

  export default {
    components: {
      FileTable
    },
    name: "DoiFiles",
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },
    mixins: [formManipulation, autocompleteFieldManipulation],
  }
</script>

<style scoped>

</style>
