<template>
  <div
    id="#tab-locality"
    class="tab-locality row"
    :class="{ active: activeTab === 'locality_reference' }"
    role="tabpanel"
  >
    <div class="col-sm-12" v-if="activeTab === 'locality_reference'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr>
              <th>{{ $t("locality.locality") }}</th>
              <!--            <th>{{ $t('locality.type') }}</th>-->
              <th>{{ $t("reference.pages") }}</th>
              <th>{{ $t("reference.figures") }}</th>
              <th>{{ $t("reference.remarks") }}</th>
              <th class="btn-th"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entity, index) in relatedData.locality_reference"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <!-- VIEW MODE -->
              <td v-show="!entity.editMode">
                <router-link
                  :to="{ path: '/locality/' + entity.locality }"
                  target="_blank"
                >
                  <span
                    v-translate="{
                      et: entity.locality__locality,
                      en: entity.locality__locality_en
                    }"
                  ></span>
                </router-link>
              </td>

              <!--            <td v-show="!entity.editMode">-->
              <!--              <span v-translate="{ et: entity.type__value, en: entity.type__value_en}"></span>-->
              <!--            </td>-->

              <td v-show="!entity.editMode">{{ entity.pages }}</td>

              <td v-show="!entity.editMode">{{ entity.figures }}</td>

              <td v-show="!entity.editMode">{{ entity.remarks }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.locality"
                  id="locality"
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

              <!--            <td v-if="entity.editMode">-->
              <!--              <vue-multiselect v-model="entity.new.type"-->
              <!--                               id="type"-->
              <!--                               :options="autocomplete.locality_reference_type"-->
              <!--                               track-by="id"-->
              <!--                               :label="commonLabel"-->
              <!--                               :placeholder="$t('add.inputs.autocomplete')"-->
              <!--                               :show-labels="false">-->
              <!--                <template slot="singleLabel" slot-scope="{ option }">-->
              <!--                  <strong>{{ option[commonLabel] }}</strong>-->
              <!--                </template>-->
              <!--                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
              <!--              </vue-multiselect>-->
              <!--            </td>-->

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.pages" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.figures" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.remarks" type="text" />
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
                  v-model="relatedData.insert.locality_reference.locality"
                  id="locality_insert"
                  label="locality"
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

              <!--            <td>-->
              <!--              <vue-multiselect v-model="relatedData.insert.locality_reference.type"-->
              <!--                               id="type_insert"-->
              <!--                               :options="autocomplete.locality_reference_type"-->
              <!--                               track-by="id"-->
              <!--                               :label="commonLabel"-->
              <!--                               :placeholder="$t('add.inputs.autocomplete')"-->
              <!--                               :show-labels="false">-->
              <!--                <template slot="singleLabel" slot-scope="{ option }">-->
              <!--                  <strong>{{ option[commonLabel] }}</strong>-->
              <!--                </template>-->
              <!--                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
              <!--              </vue-multiselect>-->
              <!--            </td>-->

              <td>
                <b-form-input
                  v-model="relatedData.insert.locality_reference.pages"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.locality_reference.figures"
                  type="text"
                />
              </td>

              <td>
                <b-form-input
                  v-model="relatedData.insert.locality_reference.remarks"
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
  name: "LocalityReference",
  props: {
    relatedData: Object,
    autocomplete: Object,
    activeTab: String
  },

  mixins: [formManipulation, autocompleteMixin]
};
</script>

<style scoped></style>
