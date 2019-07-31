<template>
  <div id="#tab-stratygraphy" class="tab-pane row" :class="{active: activeTab === 'locality_stratigraphy'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'locality_stratigraphy'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('stratigraphy.stratigraphy') }}</th>
            <th>{{ $t('stratigraphy.base') }}</th>
            <th>{{ $t('stratigraphy.top') }}</th>
            <th>{{ $t('stratigraphy.reference') }}</th>
            <th>{{ $t('stratigraphy.author') }}</th>
            <th>{{ $t('stratigraphy.year') }}</th>
            <th>{{ $t('stratigraphy.is_preferred') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.locality_stratigraphy">
            <td v-if="!entity.editMode">
              <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'stratigraphy', id: entity.stratigraphy_id})"
                 v-translate="{et:entity.stratigraphy__stratigraphy ,en:entity.stratigraphy__stratigraphy_en}"></a>
            </td>

            <td v-if="!entity.editMode">{{ entity.depth_base }}</td>
            <td v-if="!entity.editMode">{{ entity.depth_top }}</td>
            <td v-if="!entity.editMode">
              <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.reference__id})">
                {{entity.reference__reference}}
              </a>
            </td>
            <td v-if="!entity.editMode">{{ entity.agent__agent }}</td>
            <td v-if="!entity.editMode">{{ entity.year }}</td>
            <td v-if="!entity.editMode" class="text-center">{{ entity.current === true ? '&#10003' : '' }}</td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.stratigraphy"
                               id="startigraphy"
                               :loading="autocomplete.loaders.stratigraphy"
                               :label="stratigraphyLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.stratigraphy"
                               @search-change="autocompleteStratigraphySearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.depth_base" type="text"/></td>
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.depth_top" type="text"/></td>
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.reference"
                               id="reference"
                               label="reference"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference"
                               @search-change="autocompleteReferenceSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
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
            <td v-if="entity.editMode"><b-form-input v-model="entity.new.year" type="text"/></td>
            <td v-if="entity.editMode" class="text-center">
              <b-form-checkbox id="is_current2" v-model="entity.new.current" :value="true" :unchecked-value="false"/>
            </td>

            <td style="padding: 0.6em!important;">
              <button  v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button  v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
            </td>

          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.locality_stratigraphy.stratigraphy"
                               id="stratigraphy_insert"
                               :label="stratigraphyLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.stratigraphy"
                               :options="autocomplete.stratigraphy"
                               @search-change="autocompleteStratigraphySearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td><b-form-input v-model="relatedData.insert.locality_stratigraphy.depth_base" type="text"/></td>
            <td><b-form-input v-model="relatedData.insert.locality_stratigraphy.depth_top" type="text"/></td>
            <td>
              <vue-multiselect v-model="relatedData.insert.locality_stratigraphy.reference"
                               id="reference_insert"
                               label="reference"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference"
                               @search-change="autocompleteReferenceSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td>
              <vue-multiselect v-model="relatedData.insert.locality_stratigraphy.agent"
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
            <td><b-form-input v-model="relatedData.insert.locality_stratigraphy.year" type="text"/></td>
            <td class="text-center">
              <b-form-checkbox id="is_current" v-model="relatedData.insert.locality_stratigraphy.current" :value="true" :unchecked-value="false">
              </b-form-checkbox>
            </td>
            <td style="padding: 0.6em!important;">
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.locality_stratigraphy = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<script>
  import formManipulation  from '../../../mixins/formManipulation';
  import autocompleteMixin  from '../../../mixins/autocompleteMixin';
    export default {
        name: "LocalityStratigraphy",
      props: {
        relatedData: Object,
        autocomplete: Object,
        activeTab: String
      },

      mixins: [formManipulation, autocompleteMixin]
    }
</script>

<style scoped>

</style>
