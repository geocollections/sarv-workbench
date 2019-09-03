<template>
  <div class="row" :class="{active: activeTab === 'doi_agent'}">
    <div class="col-sm-12" v-if="activeTab === 'doi_agent'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('doi.name') }}</th>
            <th>{{ $t('doi.affiliation') }}</th>
            <th>{{ $t('doi.agent_type') }}</th>
            <th>ORCID</th>
            <th>{{ $t('doi.agent') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.doi_agent"
              :key="entity.id"
              :class="{ 'allow-remove': entity.allowRemove, 'edit-mode': entity.editMode }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.name }}</td>

            <td v-if="!entity.editMode">{{ entity.affiliation }}</td>

            <td v-if="!entity.editMode">{{ entity.agent_type__value }}</td>

            <td v-if="!entity.editMode">{{ entity.orcid }}</td>

            <td v-if="!entity.editMode">{{ entity.agent__agent }}</td>

            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.name" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.affiliation" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.agent_type"
                               id="agent_type"
                               :options="autocomplete.doi_agent_type"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.orcid" type="text"/>
            </td>
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.agent"
                               id="agent"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.doi_agent"
                               :options="autocomplete.doi_agent"
                               @search-change="autocompleteDoiAgentSearch"
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

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm"
                      :class="entity.editMode ? 'btn-success' : 'btn-outline-success'"
                      @click="$emit('edit-row', entity, index)"
                      :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm"
                      :class="entity.allowRemove ? 'btn-danger' : 'btn-outline-danger'"
                      @click="$emit('remove-row', entity, index)"
                      :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <!--              <button v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>-->
<!--              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="$emit('remove-row', entity, index)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>-->

<!--              <button v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>-->
<!--              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>-->
            </td>
          </tr>

          <tr class="related-input-data">
            <td>
              <b-form-input v-model="relatedData.insert.doi_agent.name" type="text"/>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_agent.affiliation" type="text"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.doi_agent.agent_type"
                               id="agent_type_insert"
                               :options="autocomplete.doi_agent_type"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td>
              <b-form-input v-model="relatedData.insert.doi_agent.orcid" type="text"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.doi_agent.agent"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.doi_agent"
                               :options="autocomplete.doi_agent"
                               :searchable="true"
                               @search-change="autocompleteDoiAgentSearch"
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

            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" @click="$emit('add-related-data', activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.doi_agent = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
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
    name: "DoiAgent",
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },
    mixins: [formManipulation, autocompleteMixin],
    watch: {
      // 'relatedData.insert.doi_agent.agent': {
      //   handler: function (newVal, oldVal) {
      //     if (this.isNotEmpty(newVal)) {
      //       //  Adding NAME, AFFILIATION and AGENT_TYPE__VALUE
      //       console.log(newVal)
      //       this.relatedData.insert.doi_agent.name = newVal.agent
      //       this.relatedData.insert.doi_agent.affiliation = newVal.institution__institution_name_en
      //       this.$set(this.relatedData.insert.doi_agent, 'agent_type', { id: 1, value: 'Creator' })
      //     }
      //   },
      //   deep: true
      // },
    },
  }
</script>

<style scoped>
  .allow-remove {
    background-color: rgba(220, 53, 69, 0.2);
  }

  .allow-remove:hover {
    background-color: rgba(220, 53, 69, 0.2);
  }

  .edit-mode {
    background-color: rgba(40, 167, 69, 0.2);
  }

  .edit-mode:hover {
    background-color: rgba(40, 167, 69, 0.2);
  }

</style>
