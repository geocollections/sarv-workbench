<template>
  <div id="#tab-history" class="tab-history row" :class="{active: activeTab === 'specimen_history'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'specimen_history'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('specimen_history.type') }}</th>
            <th>{{ $t('specimen_history.value_old') }}</th>
            <th>{{ $t('specimen_history.value_new') }}</th>
            <th>{{ $t('specimen_history.date') }}</th>
            <th>{{ $t('specimen_history.remarks') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.specimen_history"
              :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">


            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">
              <span v-translate="{ et: entity.type__value, en: entity.type__value_en }"></span>
            </td>

            <td v-if="!entity.editMode">{{ entity.value_old }}</td>

            <td v-if="!entity.editMode">{{ entity.value_new }}</td>

            <td v-if="!entity.editMode">{{ entity.date }}</td>

            <td v-if="!entity.editMode">{{ entity.remarks }}</td>


            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.type"
                               id="type"
                               :options="autocomplete.list_history_type"
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

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.value_old" type="text"/></td>

            <td v-if="entity.editMode"><b-form-input v-model="entity.new.value_new" type="text"/></td>

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

          <!-- INSERT MODE -->
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_history.type"
                               id="type_insert"
                               :options="autocomplete.list_history_type"
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

            <td><b-form-input v-model="relatedData.insert.specimen_history.value_old" type="text"/></td>

            <td><b-form-input v-model="relatedData.insert.specimen_history.value_new" type="text"/></td>

            <td>
              <datepicker id="date_insert"
                          class="date"
                          v-model="relatedData.insert.specimen_history.date"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td><b-form-input v-model="relatedData.insert.specimen_history.remarks" type="text"/></td>

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.specimen_history = {}"
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
  import autocompleteMixin from "../../../mixins/autocompleteMixin";
  import Datepicker from 'vue2-datepicker'

  export default {
    name: "SpecimenHistory",
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

</style>
