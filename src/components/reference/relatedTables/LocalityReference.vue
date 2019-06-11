<template>
  <div id="#tab-locality" class="tab-locality row" :class="{active: activeTab === 'locality_reference'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'locality_reference'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('locality.locality') }}</th>
            <th>{{ $t('locality.type') }}</th>
            <th>{{ $t('reference.pages') }}</th>
            <th>{{ $t('reference.figures') }}</th>
            <th>{{ $t('reference.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.locality_reference">
            <td v-show="!entity.editMode">
              <router-link :to="{ path: '/locality/' + entity.locality}" target="_blank">
                <span v-translate="{ et: entity.locality__locality, en: entity.locality__locality_en}"></span>
              </router-link>
            </td>
            <td v-show="!entity.editMode">{{ entity.type }}</td>
            <td v-show="!entity.editMode">{{ entity.pages }}</td>
            <td v-show="!entity.editMode">{{ entity.figures }}</td>
            <td v-show="!entity.editMode">{{ entity.remarks }}</td>

            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle" v-model="entity.new.locality"
                               deselect-label="Can't remove this value"
                               :label="localityLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.locality" select-label=""
                               :options="autocomplete.locality" :searchable="true"
                               @search-change="autcompleteLocalitySearch"
                               :allow-empty="true" :show-no-results="false"
                               :open-direction="'top'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.locality }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.type" type="text"/>
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
              <button v-show="entity.editMode" class="float-left btn btn-sm btn-success"
                      @click="$parent.$emit('related-data-modified', entity)" :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)"
                      :disabled="sendingData">
                <font-awesome-icon icon="trash-alt"/>
              </button>

              <button v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success"
                      @click="$parent.$emit('edit-row', entity)" :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger"
                      @click="$parent.$emit('allow-remove-row', entity)" :disabled="sendingData">
                <font-awesome-icon icon="trash-alt"/>
              </button>
            </td>
          </tr>

          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.locality_reference.locality"
                               deselect-label="Can't remove this value"
                               label="locality" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.locality" select-label=""
                               :options="autocomplete.locality" :searchable="true"
                               @search-change="autcompleteLocalitySearch"
                               :allow-empty="true" :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.locality }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.locality_reference.type" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.locality_reference.pages" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.locality_reference.figures" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.locality_reference.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" @click="$parent.$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.locality_reference = {}"
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
  import formManipulation  from './../../mixins/formManipulation';
  import autocompleteFieldManipulation  from './../../mixins/autocompleFormManipulation';

  export default {
    name: "LocalityReference",
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
