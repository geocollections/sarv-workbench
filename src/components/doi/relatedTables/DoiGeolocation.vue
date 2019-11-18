<template>
  <div
    id="#tab-geolocation"
    class="tab-geolocation row"
    :class="{ active: activeTab === 'doi_geolocation' }"
    role="tabpanel"
  >
    <div class="col-sm-12" v-if="activeTab === 'doi_geolocation'">
      <div class="table-responsive-md">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("doi.locality") }}</th>
              <th>{{ $t("doi.place") }}</th>
              <th>{{ $t("doi.pointLongitude") }}</th>
              <th>{{ $t("doi.pointLatitude") }}</th>
              <th>{{ $t("doi.polygon") }}</th>
              <!--            <th>{{ $t('doi.boxWLongitude') }}</th>-->
              <!--            <th>{{ $t('doi.boxELongitude') }}</th>-->
              <!--            <th>{{ $t('doi.boxSLatitude') }}</th>-->
              <!--            <th>{{ $t('doi.boxNLatitude') }}</th>-->
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.doi_geolocation"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td
                v-if="!entity.editMode"
                v-translate="{
                  et: entity.locality__locality,
                  en: entity.locality__locality_en
                }"
              ></td>

              <td v-if="!entity.editMode">{{ entity.place }}</td>

              <td v-if="!entity.editMode">{{ entity.point_longitude }}</td>

              <td v-if="!entity.editMode">{{ entity.point_latitude }}</td>

              <td v-if="!entity.editMode">{{ entity.polygon }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.locality"
                  :id="index"
                  :label="localityLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.locality"
                  :options="autocomplete.locality"
                  @search-change="autocompleteLocalitySearch"
                  @select="fillFieldsUsingLocality"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.place" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  v-model="entity.new.point_longitude"
                  type="text"
                />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.point_latitude" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  v-model="entity.new.polygon"
                  disabled
                  type="text"
                />
              </td>

              <td style="padding: 0.6em!important;">
                <button
                  class="float-left btn btn-sm"
                  :class="
                    entity.editMode ? 'btn-success' : 'btn-outline-success'
                  "
                  :disabled="sendingData"
                  @click="$emit('edit-row', entity, index)"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>

                <button
                  class="float-right btn btn-sm"
                  :class="
                    entity.allowRemove ? 'btn-danger' : 'btn-outline-danger'
                  "
                  :disabled="sendingData"
                  @click="$emit('remove-row', entity, index)"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>

            <tr class="related-input-data">
              <td>
                <vue-multiselect
                  v-model="relatedData.insert.doi_geolocation.locality"
                  id="locality_insert"
                  :label="localityLabel"
                  track-by="id"
                  :placeholder="$t('add.inputs.autocomplete')"
                  :loading="autocomplete.loaders.locality"
                  :options="autocomplete.locality"
                  @search-change="autocompleteLocalitySearch"
                  :internal-search="false"
                  :preserve-search="true"
                  :clear-on-select="false"
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option[localityLabel] }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.doi_geolocation.place"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.doi_geolocation.point_longitude"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.doi_geolocation.point_latitude"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.doi_geolocation.polygon"
                  disabled
                  type="text"
                />
              </td>

              <td style="padding: 0.6em!important;">
                <button
                  class="float-left btn btn-sm btn-success"
                  :disabled="sendingData"
                  @click="$emit('add-related-data', activeTab)"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button
                  class="float-right btn btn-sm btn-danger"
                  :disabled="sendingData"
                  @click="$emit('set-default', activeTab)"
                >
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
  name: "DoiGeolocation",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },
  mixins: [formManipulation, autocompleteMixin],
  watch: {
    "relatedData.insert.doi_geolocation.locality": {
      handler: function(newVal) {
        if (this.isNotEmpty(newVal)) {
          // Adding PLACE NAME, POINT LATITUDE and POINT LONGITUDE
          this.relatedData.insert.doi_geolocation.place =
            this.$i18n.locale === "ee" ? newVal.locality : newVal.locality_en;
          this.relatedData.insert.doi_geolocation.point_longitude =
            newVal.longitude;
          this.relatedData.insert.doi_geolocation.point_latitude =
            newVal.latitude;
        }
      },
      deep: true
    }
  },
  methods: {
    fillFieldsUsingLocality(selectedOption, id) {
      if (this.isNotEmpty(selectedOption)) {
        // Adding PLACE NAME, POINT LATITUDE and POINT LONGITUDE
        this.relatedData.doi_geolocation[id].new.place =
          this.$i18n.locale === "ee"
            ? selectedOption.locality
            : selectedOption.locality_en;
        this.relatedData.doi_geolocation[id].new.point_longitude =
          selectedOption.longitude;
        this.relatedData.doi_geolocation[id].new.point_latitude =
          selectedOption.latitude;
      }
    }
  }
};
</script>

<style scoped></style>
