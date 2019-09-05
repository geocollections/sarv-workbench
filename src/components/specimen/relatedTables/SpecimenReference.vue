<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'specimen_reference'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'specimen_reference'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('specimen_reference.reference') }}</th>
            <th>{{ $t('specimen_reference.pages') }}</th>
            <th>{{ $t('specimen_reference.figures') }}</th>
            <th>{{ $t('specimen_reference.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.specimen_reference"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">


            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.reference }}</td>

            <td v-if="!entity.editMode">{{ entity.pages }}</td>

            <td v-if="!entity.editMode"> {{ entity.figures }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>


            <!-- EDIT MODE -->
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
              <b-form-input v-model="entity.new.pages" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.figures" type="text"/>
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

          <!-- INSERT MODE -->
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_reference.reference"
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

            <td><b-form-input v-model="relatedData.insert.specimen_reference.pages" type="text"/></td>

            <td><b-form-input v-model="relatedData.insert.specimen_reference.figures" type="text"/></td>

            <td><b-form-input v-model="relatedData.insert.specimen_reference.remarks" type="text"/></td>

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
  import formManipulation from "../../../mixins/formManipulation";
  import autocompleteMixin from "../../../mixins/autocompleteMixin";

  export default {
    name: "SpecimenReference",
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
