<template>
  <div id="#tab-identifier" class="tab-identifier row" :class="{active: activeTab === 'doi_related_identifier'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'doi_related_identifier'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('doi.relatedType') }}</th>
            <th>{{ $t('doi.identifierType') }}</th>
            <th>{{ $t('doi.value') }}</th>
            <th>{{ $t('doi.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.doi_related_identifier"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">
            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.identifier_type__value }}</td>

            <td v-if="!entity.editMode">{{ entity.relation_type__value }}</td>

            <td v-if="!entity.editMode">{{ entity.value }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>

            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.identifier_type"
                               id="identifier_type"
                               :options="autocomplete.doi_related_identifier_type"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.relation_type"
                               id="relation_type"
                               :options="autocomplete.doi_relation_type"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.value" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm"
                      :class="entity.editMode ? 'btn-success' : 'btn-outline-success'"
                      :disabled="sendingData"
                      @click="$emit('edit-row', entity, index)">
              <i class="fas fa-pencil-alt"></i>
            </button>

              <button class="float-right btn btn-sm"
                      :class="entity.allowRemove ? 'btn-danger' : 'btn-outline-danger'"
                      :disabled="sendingData"
                      @click="$emit('remove-row', entity, index)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>

          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.doi_related_identifier.identifier_type"
                               id="identifier_type_insert"
                               :options="autocomplete.doi_related_identifier_type"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.doi_related_identifier.relation_type"
                               id="relation_type_insert"
                               :options="autocomplete.doi_relation_type"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_related_identifier.value" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_related_identifier.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" :disabled="sendingData" @click="$emit('add-related-data', activeTab)">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="float-right btn btn-sm btn-danger" :disabled="sendingData" @click="$emit('set-default', activeTab)">
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
  import autocompleteMixin from "../../../mixins/autocompleteMixin";
  import formManipulation from "../../../mixins/formManipulation";

  export default {
    name: "DoiRelatedIdentifier",
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },
    mixins: [formManipulation, autocompleteMixin],
  }
</script>

<style scoped>

</style>
