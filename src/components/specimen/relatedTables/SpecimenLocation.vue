<template>
  <div id="#tab-location" class="tab-location row" :class="{active: activeTab === 'specimen_location'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'specimen_location'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('specimen_location.number') }}</th>
            <th>{{ $t('specimen_location.type') }}</th>
            <th>{{ $t('specimen_location.part') }}</th>
            <th>{{ $t('specimen_location.storage') }}</th>
            <th>{{ $t('specimen_location.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.specimen_location"
              :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">


            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.number }}</td>

            <td v-if="!entity.editMode">
              <span v-translate="{ et: entity.type__value, en: entity.type__value_en }"></span>
            </td>

            <td v-if="!entity.editMode">{{ entity.part }}</td>

            <td v-if="!entity.editMode">{{ entity.storage__location }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>


            <!-- EDIT MODE -->
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.number" type="text"/></td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.type"
                               id="type"
                               :options="autocomplete.list_specimen_type"
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

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.part" type="text"/></td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.storage"
                               id="storage"
                               label="location"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.storage"
                               :options="autocomplete.storage"
                               @search-change="autocompleteStorageSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.remarks" type="text"/></td>

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
            <td><b-form-input v-model="relatedData.insert.specimen_location.number" type="text"/></td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_location.type"
                               id="type_insert"
                               :options="autocomplete.list_specimen_type"
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

            <td><b-form-input v-model="relatedData.insert.specimen_location.part" type="text"/></td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_location.storage"
                               id="storage_insert"
                               label="location"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.storage"
                               :options="autocomplete.storage"
                               @search-change="autocompleteStorageSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td><b-form-input v-model="relatedData.insert.specimen_location.remarks" type="text"/></td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.specimen_location = {}"
                      :disabled="sendingData">
                <font-awesome-icon icon="times"/>
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
    name: "SpecimenLocation",
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
