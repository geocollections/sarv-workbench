<template>
  <div id="#tab-geolocation" class="tab-geolocation row" :class="{active: activeTab === 'doi_geolocation'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'doi_geolocation'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('doi.point') }}</th>
            <th>{{ $t('doi.box') }}</th>
            <th>{{ $t('doi.place') }}</th>
            <th>{{ $t('doi.locality') }}</th>
            <th>{{ $t('doi.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.doi_geolocation"
              :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.point }}</td>

            <td v-if="!entity.editMode">{{ entity.box }}</td>

            <td v-if="!entity.editMode">{{ entity.place }}</td>

            <td v-if="!entity.editMode" v-translate="{ et: entity.locality__locality, en: entity.locality__locality_en }"></td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>

            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.point" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.box" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.place" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect class="align-middle"
                               v-model="entity.new.locality"
                               deselect-label="Can't remove this value"
                               :label="localityLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.locality"
                               select-label=""
                               :options="autocomplete.locality"
                               :searchable="true"
                               @search-change="autcompleteLocalitySearch"
                               :internal-search="false"
                               :allow-empty="true"
                               :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong v-translate="{ et: option.locality, en: option.locality_en }"></strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
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
              <b-form-input v-model="relatedData.insert.doi_geolocation.point" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.box" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.place" type="text"/>
            </td>

            <td>
              <vue-multiselect class="align-middle"
                               v-model="relatedData.insert.doi_geolocation.locality"
                               deselect-label="Can't remove this value"
                               :label="localityLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.locality"
                               select-label=""
                               :options="autocomplete.locality"
                               :searchable="true"
                               @search-change="autcompleteLocalitySearch"
                               :internal-search="false"
                               :allow-empty="true"
                               :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong v-translate="{ et: option.locality, en: option.locality_en }"></strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.remarks" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$parent.$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.doi_geolocation = {}"
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
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteFieldManipulation from "../../mixins/autocompleFormManipulation";

  export default {
    name: "DoiGeolocation",
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },
    mixins: [formManipulation, autocompleteFieldManipulation],
  }
</script>

<style src="../../../assets/css/relatedDataStyle.css"></style>
<style scoped>

</style>
