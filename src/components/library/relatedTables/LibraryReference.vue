<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'library_reference'}"
       role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'library_reference'">
      <div class="table-responsive-sm">

        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('settings.handle') }}</th>
            <th>{{ $t('reference.reference') }}
              <font-awesome-icon class="ml-2" icon="link"/>
            </th>
            <th>{{ $t('reference.keywords') }}</th>
            <th>{{ $t('reference.remarks') }}</th>
            <th>{{ $t('reference.sort') }}</th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <!--          <tbody>-->
          <draggable v-model="relatedData.library_reference"
                     tag="tbody"
                     handle=".middle-handle"
                     v-bind="dragOptions"
                     @change="handleElementChange">
              <tr v-for="entity in relatedData.library_reference" :key="entity.id"
                  :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
                <td class="middle-handle">
                  <i class="fas fa-align-justify fa-lg"></i>
                </td>
                <!-- VIEW MODE -->
                <td v-if="!entity.editMode">
                  <router-link :to="{ path: '/reference/' + entity.reference }" target="_blank">
                    {{ entity.reference__reference }}
                  </router-link>
                </td>

                <td v-if="!entity.editMode">{{ entity.keywords }}</td>

                <td v-if="!entity.editMode">{{ entity.remarks }}</td>

                <td v-if="!entity.editMode">{{ entity.sort}}</td>

                <!-- EDIT MODE -->
                <td v-if="entity.editMode">
                  <vue-multiselect class="align-middle" v-model="entity.new.reference"
                                   deselect-label="Can't remove this value"
                                   label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                                   :loading="autocomplete.loaders.reference" select-label=""
                                   :options="autocomplete.reference" :searchable="true"
                                   @search-change="autcompleteReferenceSearch"
                                   :allow-empty="true" :show-no-results="false"
                                   :open-direction="'top'">
                    <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong>
                    </template>
                    <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                  </vue-multiselect>
                </td>

                <td v-if="entity.editMode">
                  <b-form-input v-model="entity.new.keywords" type="text"/>
                </td>

                <td v-if="entity.editMode">
                  <b-form-input v-model="entity.new.remarks" type="text"/>
                </td>

                <td v-if="entity.editMode">
                  <b-form-input v-model="entity.new.sort" type="number" :min="0" :max="relatedData.count.library_reference"/>
                </td>
                <td style="padding: 0.6em!important;">
                  <button v-show="entity.editMode" class="float-left btn btn-sm btn-success"
                          @click="$emit('related-data-modified', entity)" :disabled="sendingData">
                    <font-awesome-icon icon="pencil-alt"/>
                  </button>
                  <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger"
                          @click="removeRow(entity)" :disabled="sendingData">
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
          </draggable>

          <!--          <tbody>-->
          <tr class="related-input-data">
            <td>
              <vue-multiselect class="align-middle" v-model="relatedData.insert.library_reference.reference"
                               deselect-label="Can't remove this value"
                               label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference" select-label=""
                               :options="autocomplete.reference" :searchable="true"
                               @search-change="autcompleteReferenceSearch"
                               :allow-empty="true" :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td>
              <b-form-input v-model="relatedData.insert.library_reference.keywords" type="text"/>
            </td>
            <td>
              <b-form-input v-model="relatedData.insert.library_reference.remarks" type="text"/>
            </td>
            <td>
              <b-form-input v-model="relatedData.insert.library_reference.sort" type="number" :min="0" :max="relatedData.count.library_reference"/>
            </td>
            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)"
                      :disabled="sendingData">
                <font-awesome-icon icon="pencil-alt"/>
              </button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.library_reference = {}"
                      :disabled="sendingData">
                <font-awesome-icon icon="times"/>
              </button>
            </td>
          </tr>
          <!--          </tbody>-->
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import formManipulation from './../../mixins/formManipulation';
  import autocompleteFieldManipulation from './../../mixins/autocompleFormManipulation';
  import draggable from 'vuedraggable'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    components: {
      draggable
    },
    name: "LibraryReference",
    props: {
      relatedData: Object,
      autocomplete: Object,
      activeTab: String
    },
    mixins: [formManipulation, autocompleteFieldManipulation],
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }
    },
    methods: {
      // There are total of 3 events: 'added', 'removed' and 'moved'
      handleElementChange(event) {
        if (typeof event.moved !== 'undefined') {
          this.handleMovedEvent(event.moved)
        }
      },

      handleMovedEvent(movedEvent) {
        this.relatedData.library_reference.forEach((reference, index) => {
          // Every index has a certain sort number corresponding to amount of references in library i.e. 43 references then sort is from 0 - 43
          this.$set(reference, 'new', cloneDeep(reference));
          reference.new.sort = this.relatedData.count.library_reference - index

          // Updating only if sort changed
          if (reference.sort !== reference.new.sort) {
            this.$emit('related-data-modified', reference)
          }
        })

      }
    },
  }
</script>

<style scoped>
  .ghost {
    opacity: 0.5;
    background: #dee2e6;
  }

  .middle-handle {
    text-align: center;
    vertical-align: middle;
  }

  .middle-handle:hover {
    cursor: grab;
  }
</style>
