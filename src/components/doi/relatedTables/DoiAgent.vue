<template>
  <div id="#tab-agent" class="tab-agent row" :class="{active: activeTab === 'doi_agent'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'doi_agent'">
      <div class="table-responsive-sm">

        {{  relatedData.insert.doi_agent.name  }}
        <br>
        {{  relatedData.insert.doi_agent.affiliation  }}
        <br>
        {{  relatedData.insert.doi_agent.agent_type  }}
        <br>
        {{  relatedData.insert.doi_agent.agent  }}

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('doi.name') }}</th>
            <th>{{ $t('doi.affiliation') }}</th>
            <th>{{ $t('doi.agent_type') }}</th>
            <th>{{ $t('doi.agent') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.doi_agent" :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">{{ entity.name }}</td>

            <td v-if="!entity.editMode">{{ entity.affiliation }}</td>

            <td v-if="!entity.editMode">{{ entity.agent_type__value }}</td>

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
              <vue-multiselect class="align-middle"
                               v-model="entity.new.agent"
                               deselect-label="Can't remove this value"
                               label="name"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.doi_agent"
                               select-label=""
                               :options="autocomplete.doi_agent"
                               :searchable="true"
                               @search-change="autcompleteDoiAgentSearch"
                               :internal-search="false"
                               :allow-empty="true"
                               :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td style="padding: 0.6em!important;">
              <button v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$parent.$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$parent.$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$parent.$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
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
              <vue-multiselect class="align-middle"
                               v-model="relatedData.insert.doi_agent.agent"
                               deselect-label="Can't remove this value"
                               label="name"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.doi_agent"
                               select-label=""
                               :options="autocomplete.doi_agent"
                               :searchable="true"
                               @search-change="autcompleteDoiAgentSearch"
                               :internal-search="false"
                               :allow-empty="true"
                               :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$parent.$emit('related-data-added', activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
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
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteFieldManipulation from "../../mixins/autocompleFormManipulation";

  export default {
    name: "DoiAgent",
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },
    mixins: [formManipulation, autocompleteFieldManipulation],
    watch: {
      'relatedData.insert.doi_agent.agent': {
        handler: function (newVal, oldVal) {
          if (newVal !== null && !this.isEmptyObject(newVal)) {
            console.log('hi')
            console.log(newVal)
            //  Adding NAME, AFFILIATION and AGENT_TYPE__VALUE
            this.relatedData.insert.doi_agent.name = newVal.name
            this.relatedData.insert.doi_agent.affiliation = newVal.affiliation
            this.$set(this.relatedData.insert.doi_agent, 'agent_type', { id: newVal.agent_type, value: newVal.agent_type__value })
          }
        },
        deep: true
      },
    },
  }
</script>

<style src="../../../assets/css/relatedDataStyle.css"></style>
<style scoped>

</style>
