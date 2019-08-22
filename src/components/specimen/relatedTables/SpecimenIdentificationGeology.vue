<template>
  <div id="#tab-identification-geology" class="tab-identification-geology row" :class="{active: activeTab === 'specimen_identification_geology'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'specimen_identification_geology'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('specimen_identification_geology.rock') }}</th>
            <th>{{ $t('specimen_identification_geology.name') }}</th>
            <th>{{ $t('specimen_identification_geology.name_en') }}</th>
            <th>{{ $t('specimen_identification_geology.agent') }}</th>
            <th>{{ $t('specimen_identification_geology.reference') }}</th>
            <th>{{ $t('specimen_identification_geology.date') }}</th>
            <th>{{ $t('specimen_identification_geology.type') }}</th>
            <th>{{ $t('specimen_identification_geology.current') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="entity in relatedData.specimen_identification_geology"
              :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">

            <!-- VIEW MODE -->
            <td v-if="!entity.editMode">
              <span v-translate="{ et: entity.rock__name, en: entity.rock__name_en }"></span>
            </td>

            <td v-if="!entity.editMode">{{ entity.name }}</td>

            <td v-if="!entity.editMode">{{ entity.name_en }}</td>

            <td v-if="!entity.editMode"> {{ entity.agent__agent }}</td>

            <td v-if="!entity.editMode">
              <router-link :to="{ path: '/reference/' + entity.reference}" target="_blank">{{ entity.reference__reference }}</router-link>
            </td>

            <td v-if="!entity.editMode">{{ entity.date_identified }}</td>

            <td v-if="!entity.editMode">
              <span v-translate="{ et: entity.type__value, en: entity.type__value_en }"></span>
            </td>

            <td class="current" v-if="!entity.editMode">{{ entity.current ? '+' : '-' }}</td>


            <!-- EDIT MODE -->
            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.rock"
                               id="rock"
                               :label="nameLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.rock"
                               :options="autocomplete.rock"
                               @search-change="autocompleteRockSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.name" type="text"/>
            </td>

            <td v-if="entity.editMode">
              <b-form-input v-model="entity.new.name_en" type="text"/>
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
              <datepicker id="date_identified"
                          class="date"
                          v-model="entity.new.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.type"
                               id="type"
                               :options="autocomplete.list_identification_type"
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

            <td class="align-middle" v-if="entity.editMode">
              <vs-checkbox id="current" v-model="entity.new.current" icon="fa-check" icon-pack="fas"></vs-checkbox>
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

          <!-- INSERT MODE -->
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_identification_geology.rock"
                               id="rock_insert"
                               :label="nameLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.rock"
                               :options="autocomplete.rock"
                               @search-change="autocompleteRockSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>

            <td><b-form-input v-model="relatedData.insert.specimen_identification_geology.name" type="text"/></td>

            <td><b-form-input v-model="relatedData.insert.specimen_identification_geology.name_en" type="text"/></td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_identification_geology.agent"
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
              <vue-multiselect v-model="relatedData.insert.specimen_identification_geology.reference"
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
              <datepicker id="date_identified_insert"
                          class="date"
                          v-model="relatedData.insert.specimen_identification_geology.date_identified"
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"/>
            </td>

            <td>
              <vue-multiselect v-model="relatedData.insert.specimen_identification_geology.type"
                               id="type_insert"
                               :options="autocomplete.list_identification_type"
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

            <td class="align-middle">
              <vs-checkbox id="current_insert"
                           v-model="relatedData.insert.specimen_identification_geology.current"
                           icon="fa-check"
                           icon-pack="fas"></vs-checkbox>
            </td>

            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.doi_date = {}"
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
    name: "SpecimenIdentificationGeology",
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
  .current {
    text-align: center;
    vertical-align: middle;
    font-size: x-large;
    font-weight: 800;
  }

  .date >>> .mx-calendar-icon {
    height: unset !important;
  }
</style>
