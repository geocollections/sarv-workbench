<template>
  <div id="#tab-synonym" class="tab-pane row" :class="{active: activeTab === 'locality_synonym'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'locality_synonym'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('synonym.synonym') }}</th>
            <th>{{ $t('synonym.reference') }}</th>
            <th>{{ $t('synonym.pages') }}</th>
            <th>{{ $t('synonym.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.locality_synonym"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.synonym }}</td>

            <td v-if="!entity.editMode">
              <router-link :to="{ path: '/reference/' + entity.reference }" target="_blank">
                {{ entity.reference__reference }}
              </router-link>
            </td>

            <td v-if="!entity.editMode">{{ entity.pages }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}

              <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.synonym" type="text"/>
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
              <b-form-input v-model="entity.new.pages" type="text"/>
            </td>

            <td v-if="entity.editMode" style="min-width: 20em;">
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
              <b-form-input v-model="relatedData.insert.locality_synonym.synonym" type="text"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.locality_synonym.reference"
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
              <b-form-input v-model="relatedData.insert.locality_synonym.pages" type="text"/>
            </td>

            <td style="min-width: 20em;">
              <b-form-input v-model="relatedData.insert.locality_synonym.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" :disabled="sendingData"
                      @click="$emit('add-related-data', activeTab)">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="float-right btn btn-sm btn-danger" :disabled="sendingData"
                      @click="$emit('set-default', activeTab)">
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
  import formManipulation from '../../../mixins/formManipulation';
  import autocompleteMixin from '../../../mixins/autocompleteMixin';

  export default {
    name: "LocalitySynonym",
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },

    mixins: [formManipulation, autocompleteMixin]
  }
</script>

<style scoped>

</style>
