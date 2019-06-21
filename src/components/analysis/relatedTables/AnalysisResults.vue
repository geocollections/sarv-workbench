<template>
  <div id="#tab-attachment" class="tab-attachment row" :class="{active: activeTab === 'analysis_results'}"
       role="tabpanel">


    <div class="col-sm-12" v-if="activeTab === 'analysis_results'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('analysis.relatedTables.result_name') }}</th>
            <th>{{ $t('analysis.relatedTables.result_value') }}</th>
            <th>{{ $t('analysis.relatedTables.result_max') }}</th>
            <th>{{ $t('analysis.relatedTables.result_min') }}</th>
            <th>{{ $t('analysis.relatedTables.result_bin') }}</th>
            <th>{{ $t('analysis.relatedTables.result_txt') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.analysis_results" :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <!-- VIEW MODE -->

            <td v-if="!entity.editMode">{{ entity.name }}</td>

            <td v-if="!entity.editMode">{{ entity.value }}</td>

            <td v-if="!entity.editMode">{{ entity.value_max }}</td>
            <td v-if="!entity.editMode">{{ entity.value_min }}</td>
            <td v-if="!entity.editMode">{{ entity.value_bin }}</td>

            <td v-if="!entity.editMode">{{ entity.value_txt }}</td>

            <!-- EDIT MODE -->

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.name" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.value" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.value_max" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.value_min" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.value_bin" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.value_txt" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
            </td>
          </tr>

          <tr class="related-input-data">

            <td>
              <b-form-input v-model="relatedData.insert.analysis_results.name" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis_results.value" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis_results.value_max" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis_results.value_min" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis_results.value_bin" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.analysis_results.value_txt" type="text"/>
            </td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.analysis_results = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
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
    components: {

    },
    name: "AnalysisResults",
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
