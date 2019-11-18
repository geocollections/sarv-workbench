<template>
  <div
    id="#tab-reference"
    class="tab-reference row"
    :class="{ active: activeTab === 'library_reference' }"
    role="tabpanel"
  >
    <div class="col-sm-12" v-if="activeTab === 'library_reference'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered  related-table">
          <thead class="thead-light">
            <tr :class="{ 'th-sort': $route.meta.isEdit }">
              <th v-show="isDraggable">{{ $t("settings.handle") }}</th>

              <th
                class="nowrap"
                v-for="(field, index) in thFields"
                :key="index"
              >
                <span v-if="$route.meta.isEdit" @click="changeOrder(field)">
                  <i
                    class="fas fa-sort"
                    v-if="
                      relatedData.searchParameters.library_reference.orderBy !==
                        field &&
                        relatedData.searchParameters.library_reference
                          .orderBy !==
                          '-' + field
                    "
                  ></i>
                  <i v-else :class="'fas fa-sort-' + sortingDirection"></i>
                  {{ $t("reference." + field) }}

                  <i v-if="field === 'reference'" class="fas fa-link"></i>
                </span>

                <span v-else>
                  {{ $t("reference." + field) }}
                  <i v-if="field === 'reference'" class="fas fa-link"></i>
                </span>
              </th>

              <th class="btn-th"></th>
            </tr>
          </thead>

          <!--          <tbody>-->
          <draggable
            v-model="relatedData.library_reference"
            tag="tbody"
            handle=".middle-handle"
            v-bind="dragOptions"
            @change="handleElementChange"
          >
            <tr
              v-for="(entity, index) in relatedData.library_reference"
              :key="entity.id"
              :class="{
                'allow-remove': entity.allowRemove,
                'edit-mode': entity.editMode
              }"
            >
              <td v-show="isDraggable" class="middle-handle">
                <i class="fas fa-align-justify fa-lg"></i>
              </td>
              <!-- VIEW MODE -->
              <td v-if="!entity.editMode">
                <router-link
                  :to="{ path: '/reference/' + entity.reference }"
                  target="_blank"
                >
                  {{ entity.reference__reference }}
                </router-link>
              </td>

              <td v-if="!entity.editMode">{{ entity.keywords }}</td>

              <td v-if="!entity.editMode">{{ entity.remarks }}</td>

              <td v-if="!entity.editMode">{{ entity.sort }}</td>

              <!-- EDIT MODE -->
              <td v-if="entity.editMode">
                <vue-multiselect
                  v-model="entity.new.reference"
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
                  :show-labels="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <strong>{{ option.reference }}</strong>
                  </template>
                  <template slot="noResult"
                    ><b>{{ $t("messages.inputNoResults") }}</b></template
                  >
                </vue-multiselect>
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.keywords" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input v-model="entity.new.remarks" type="text" />
              </td>

              <td v-if="entity.editMode">
                <b-form-input
                  v-model="entity.new.sort"
                  type="number"
                  :min="0"
                  :max="relatedData.count.library_reference"
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
          </draggable>

          <!--          <tbody>-->
          <tr class="related-input-data">
            <td v-show="isDraggable"></td>
            <td>
              <vue-multiselect
                v-model="relatedData.insert.library_reference.reference"
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
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </td>
            <td>
              <b-form-input
                v-model="relatedData.insert.library_reference.keywords"
                type="text"
              />
            </td>
            <td>
              <b-form-input
                v-model="relatedData.insert.library_reference.remarks"
                type="text"
              />
            </td>
            <td>
              <b-form-input
                v-model="relatedData.insert.library_reference.sort"
                type="number"
                :min="0"
                :max="relatedData.count.library_reference"
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
          <!--          </tbody>-->
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import formManipulation from "../../../mixins/formManipulation";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import draggable from "vuedraggable";
import cloneDeep from "lodash/cloneDeep";

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
  mixins: [formManipulation, autocompleteMixin],
  data() {
    return {
      thFields: ["reference", "keywords", "remarks", "sort"]
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },

    isDraggable() {
      return (
        this.$route.meta.isEdit &&
        this.relatedData.library_reference &&
        this.relatedData.library_reference &&
        this.relatedData.library_reference.length <= 25
      );
    },

    sortingDirection() {
      return this.relatedData.searchParameters.library_reference.orderBy.includes(
        "-"
      )
        ? "down"
        : "up";
    }
  },
  methods: {
    // There are total of 3 events: 'added', 'removed' and 'moved'
    handleElementChange(event) {
      if (typeof event.moved !== "undefined") {
        this.handleMovedEvent(event.moved);
      }
    },

    handleMovedEvent() {
      this.relatedData.library_reference.forEach((reference, index) => {
        // Every index has a certain sort number corresponding to amount of references in library i.e. 43 references then sort is from 0 - 43
        this.$set(reference, "new", cloneDeep(reference));
        reference.new.sort = this.relatedData.count.library_reference - index;

        // Updating only if sort changed
        if (reference.sort !== reference.new.sort) {
          this.$emit("related-data-modified", reference);
        }
      });
    },

    changeOrder(orderValue) {
      if (
        this.relatedData.searchParameters.library_reference.orderBy ===
        orderValue
      ) {
        if (orderValue.charAt(0) !== "-") {
          orderValue = "-" + orderValue;
        } else {
          orderValue = orderValue.substring(1);
        }
      }
      this.$emit("order-by-changed", {
        tab: "library_reference",
        orderBy: orderValue
      });
    }
  }
};
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

.nowrap {
  white-space: nowrap;
}

.th-sort > th > span {
  cursor: pointer;
}

.th-sort > th > span:hover {
  color: #000;
}

.fa-sort-up,
.fa-sort-down {
  color: #007bff;
}
</style>
