<template>
  <div id="#tab-synonym" class="tab-pane row" :class="{active: activeTab === 'locality_synonym'}" role="tabpanel">
    <div class="col-sm-8" v-if="activeTab === 'locality_synonym'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('synonym.synonym') }}</th>
            <th>{{ $t('synonym.reference') }}</th>
            <th>{{ $t('synonym.pages') }}</th>
            <th>{{ $t('synonym.remarks') }}</th>
            <th  v-if="relatedData.insert.locality_synonym.synonym"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.locality_synonym">
            <td>{{ entity.synonym }}</td>
            <td>{{ entity.reference__reference }}</td>
            <td>{{ entity.pages }}</td>
            <td>{{ entity.remarks }}</td>
            <td  v-if="relatedData.insert.locality_synonym.synonym"></td>
          </tr>
          <tr class="related-input-data">
            <td><b-form-input v-model="relatedData.insert.locality_synonym.synonym" type="text"/></td>
            <td>
              <vue-multiselect style="min-width: 300px!important" class="align-middle" v-model="relatedData.insert.locality_synonym.reference" deselect-label="Can't remove this value"
                               label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference" :searchable="true" @search-change="autcompleteReferenceSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.locality_synonym.pages" type="text"/></td>
            <td style="min-width: 20em;">
              <b-form-input v-model="relatedData.insert.locality_synonym.remarks" type="text"/>
            </td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.locality_synonym = {}"  v-if="relatedData.insert.locality_synonym.synonym">
              <font-awesome-icon icon="times"></font-awesome-icon>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import autocompleteFieldManipulation  from './../../mixins/autocompleFormManipulation';

  export default {
      name: "LocalitySynonym",
      props: {
        relatedData: Object,
        autocomplete: Object,
        activeTab: String
      },

      mixins: [autocompleteFieldManipulation]
    }
</script>

<style scoped>
  .related-input-data td{
    /*min-width: 10em !important;*/
    padding: 0.2em!important;
  }

  .multiselect {
    line-height: 1;
    z-index: 999 !important;
    width: 100%;
    min-width: 20em!important
  }
</style>
