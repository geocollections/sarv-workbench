<template>
  <div id="#tab-stratygraphy" class="tab-pane row" :class="{active: activeTab === 'locality_stratigraphy'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'locality_stratigraphy'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('stratigraphy.stratigraphy') }}</th>
            <th>{{ $t('stratigraphy.base') }}</th>
            <th>{{ $t('stratigraphy.top') }}</th>
            <th>{{ $t('stratigraphy.reference') }}</th>
            <th>{{ $t('stratigraphy.author') }}</th>
            <th>{{ $t('stratigraphy.year') }}</th>
            <th>{{ $t('stratigraphy.is_preferred') }}</th>
            <th v-if="relatedData.insert.locality_stratigraphy.stratigraphy"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.locality_stratigraphy">
            <td>
              <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'stratigraphy', id: entity.stratigraphy_id})"
                 v-translate="{et:entity.stratigraphy__stratigraphy ,en:entity.stratigraphy__stratigraphy_en}"></a>
            </td>

            <td>{{ entity.depth_base }}</td>
            <td>{{ entity.depth_top }}</td>
            <td>
              <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.reference__id})">
                {{entity.reference__reference}}
              </a>
            </td>
            <td>{{ entity.agent__agent }}</td>
            <td>{{ entity.year }}</td>
            <td class="text-center">{{ entity.current === true ? '+' : '' }}</td>
            <td v-if="relatedData.insert.locality_stratigraphy.stratigraphy"></td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.locality_stratigraphy.stratigraphy" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.stratigraphy"
                               :label="stratigraphyLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.stratigraphy" :searchable="true" @search-change="autcompleteStratigraphySearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>
                  {{ $i18n.locale=== 'ee' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.locality_stratigraphy.depth_base" type="text"/></td>
            <td><b-form-input v-model="relatedData.insert.locality_stratigraphy.depth_top" type="text"/></td>
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.locality_stratigraphy.reference" deselect-label="Can't remove this value"
                               label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference" :searchable="true" @search-change="autcompleteReferenceSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.locality_stratigraphy.agent" deselect-label="Can't remove this value"
                               label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent" :searchable="true" @search-change="autcompleteAgentSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.locality_stratigraphy.year" type="text"/></td>
            <td class="text-center">
              <b-form-checkbox id="is_current" v-model="relatedData.insert.locality_stratigraphy.current" :value="true" :unchecked-value="false">
              </b-form-checkbox>
            </td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.locality_stratigraphy = {}"  v-if="relatedData.insert.locality_stratigraphy.stratigraphy">
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
        name: "LocalityStratigraphy",
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
    min-width: 10em!important
  }
</style>
