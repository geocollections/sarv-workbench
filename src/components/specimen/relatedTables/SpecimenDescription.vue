<template>
  <div class="tab-description row" :class="{active: activeTab === 'specimen_description'}">
    <div class="col-sm-12" v-if="activeTab === 'specimen_description'">
      <div class="table-responsive-sm">

        <table class="table table-hover related-table">
          <thead>
          <tr>
            <th>{{ $t('specimen_description.length') }}</th>
            <th>{{ $t('specimen_description.width') }}</th>
            <th>{{ $t('specimen_description.height') }}</th>
            <th>{{ $t('specimen_description.unit') }}</th>
            <th>{{ $t('specimen_description.mass') }}</th>
            <th>{{ $t('specimen_description.description') }}</th>
            <th>{{ $t('specimen_description.agent') }}</th>
            <th>{{ $t('specimen_description.date') }}</th>
            <th>{{ $t('specimen_description.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.specimen_description"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.length }}</td>

            <td v-if="!entity.editMode">{{ entity.width }}</td>

            <td v-if="!entity.editMode">{{ entity.height }}</td>

            <td v-if="!entity.editMode">
              <span v-translate="{ et: entity.unit__value, en: entity.unit__value_en }"></span>
            </td>

            <td v-if="!entity.editMode">{{ entity.mass }}</td>

            <td v-if="!entity.editMode">{{ entity.description }}</td>

            <td v-if="!entity.editMode"> {{ entity.agent__agent }}</td>

            <td v-if="!entity.editMode">{{ entity.date }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>


            <!-- EDIT MODE -->
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.length" type="number"/></td>

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.width" type="number"/></td>

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.height" type="number"/></td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.unit"
                               id="unit"
                               :options="autocomplete.list_unit"
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

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.mass" type="number" step="0.1"/></td>

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.description" type="text"/></td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.agent"
                               id="agent"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="autocompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <datepicker id="date"
                          class="date"
                          v-model="entity.new.date"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.remarks" type="text"/></td>

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
            <td><b-form-input v-model="relatedData.insert.specimen_description.length" type="number"/></td>

            <td><b-form-input v-model="relatedData.insert.specimen_description.width" type="number"/></td>

            <td><b-form-input v-model="relatedData.insert.specimen_description.height" type="number"/></td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_description.unit"
                               id="unit_insert"
                               :options="autocomplete.list_unit"
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

            <td><b-form-input v-model="relatedData.insert.specimen_description.mass" type="number" step="0.1"/></td>

            <td><b-form-input v-model="relatedData.insert.specimen_description.description" type="text"/></td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_description.agent"
                               id="agent_insert"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="autocompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <datepicker id="date_insert"
                          class="date"
                          v-model="relatedData.insert.specimen_description.date"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td><b-form-input v-model="relatedData.insert.specimen_description.remarks" type="text"/></td>

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
  import Datepicker from 'vue2-datepicker'

  export default {
    name: "SpecimenDescription",
    components: {
      Datepicker
    },
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },
    mixins: [formManipulation, autocompleteMixin],

  }
</script>

<style scoped>
  .date >>> .mx-calendar-icon {
    height: unset;
  }
</style>
