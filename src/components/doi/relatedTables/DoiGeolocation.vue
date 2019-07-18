<template>
  <div id="#tab-geolocation" class="tab-geolocation row" :class="{active: activeTab === 'doi_geolocation'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'doi_geolocation'">
      <div class="table-responsive-md">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('doi.locality') }}</th>
            <th>{{ $t('doi.place') }}</th>
            <th>{{ $t('doi.pointLongitude') }}</th>
            <th>{{ $t('doi.pointLatitude') }}</th>
            <th>{{ $t('doi.boxWLongitude') }}</th>
            <th>{{ $t('doi.boxELongitude') }}</th>
            <th>{{ $t('doi.boxSLatitude') }}</th>
            <th>{{ $t('doi.boxNLatitude') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.doi_geolocation"
              :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <!-- VIEW MODE -->
            <td v-if="!entity.editMode" v-translate="{ et: entity.locality__locality, en: entity.locality__locality_en }"></td>

            <td v-if="!entity.editMode">{{ entity.place }}</td>

            <td v-if="!entity.editMode">{{ entity.point_longitude }}</td>

            <td v-if="!entity.editMode">{{ entity.point_latitude }}</td>

            <td v-if="!entity.editMode">{{ entity.box_w_longitude }}</td>

            <td v-if="!entity.editMode">{{ entity.box_e_longitude }}</td>

            <td v-if="!entity.editMode">{{ entity.box_s_latitude }}</td>

            <td v-if="!entity.editMode">{{ entity.box_n_latitude }}</td>

            <!-- EDIT MODE -->
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
              <b-form-input v-model="entity.new.place" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.point_longitude" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.point_latitude" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.box_w_longitude" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.box_e_longitude" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.box_s_latitude" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.box_n_latitude" type="text"/>
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

          <tr class="related-input-data">
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
              <b-form-input v-model="relatedData.insert.doi_geolocation.place" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.point_longitude" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.point_latitude" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.box_w_longitude" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.box_e_longitude" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.box_s_latitude" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_geolocation.box_n_latitude" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)"
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
  import formManipulation from "../../../mixins/formManipulation";
  import autocompleteFieldManipulation from "../../../mixins/autocompleFormManipulation";

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

<style scoped>

</style>
