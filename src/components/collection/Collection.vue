<template>
  <div class="collection">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('collection') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('collection') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- NUMBER, COLLECTION_ID, TYPE  -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="collection.number"
                :color="bodyActiveColor"
                :label="$t('collection.number_detail')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="collection.collection_id"
                :color="bodyActiveColor"
                :label="$t('collection.collection_id')"
                type="number"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.type"
                :color="bodyActiveColor"
                :items="autocomplete.type"
                :loading="autocomplete.loaders.type"
                :item-text="commonLabel"
                :label="$t('common.type')"
              />
            </v-col>
          </v-row>

          <!-- NAME and NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name_en"
                :color="bodyActiveColor"
                :label="$t('common.name_en')"
              />
            </v-col>
          </v-row>

          <!-- NAME_LONG and NAME_LONG_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name_long"
                :color="bodyActiveColor"
                :label="$t('collection.name_long')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name_long_en"
                :color="bodyActiveColor"
                :label="$t('collection.name_long_en')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED INFO -->
    <v-card
      class="mt-2"
      id="block-relatedInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.relatedInfo = !block.relatedInfo"
        >
          <span>{{ $t("collection.relatedInfo") }}</span>
          <v-icon right>fas fa-sitemap</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.relatedInfo = !block.relatedInfo"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.relatedInfo ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.relatedInfo" class="pa-1">
          <!-- CLASSIFICATION and AGENT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.classification"
                :color="bodyActiveColor"
                :items="autocomplete.classification"
                :loading="autocomplete.loaders.classification"
                :item-text="classLabel"
                :label="$t('collection.classification')"
                is-searchable
                v-on:search:items="autocompleteClassificationSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('collection.agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- LOCALITY, STRATIGRAPHY and REFERENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.locality"
                :color="bodyActiveColor"
                :items="autocomplete.locality"
                :loading="autocomplete.loaders.locality"
                :item-text="localityLabel"
                :label="$t('common.locality')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.stratigraphy"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy"
                :loading="autocomplete.loaders.stratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('common.stratigraphy')"
                is-searchable
                v-on:search:items="autocompleteStratigraphySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.reference"
                :color="bodyActiveColor"
                :items="autocomplete.reference"
                :loading="autocomplete.loaders.reference"
                item-text="reference"
                :label="$t('common.reference')"
                is-link
                route-object="reference"
                is-searchable
                v-on:search:items="autocompleteReferenceSearch"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.description = !block.description"
        >
          <span>{{ $t("common.description") }}</span>
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.description = !block.description"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="pa-1">
          <!-- REMARKS  -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="collection.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- NUMBER_OBJECTS and NUMBER_TYPES -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.number_objects"
                :color="bodyActiveColor"
                :label="$t('collection.number_objects')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.number_types"
                :color="bodyActiveColor"
                :label="$t('collection.number_types')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
    <v-row no-gutters class="mt-2">
      <v-col class="d-flex">
        <autocomplete-wrapper
          class="ml-auto"
          v-model="collection.database"
          :color="bodyActiveColor"
          :items="autocomplete.database"
          :loading="autocomplete.loaders.database"
          :item-text="nameLabel"
          :label="$t('common.institution')"
        />
      </v-col>
    </v-row>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-specimen"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
      v-if="$route.meta.isEdit && specimens.count > 0"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.specimen = !block.specimen"
        >
          <span>{{ $t("collection.specimen") }}</span>
          <v-icon right>fas fa-fish</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.specimen = !block.specimen"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.specimen ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.specimen" class="pb-1">
          <!-- PAGINATION -->
          <div
            v-if="specimens.count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between mt-3 d-print-none pa-1 mt-2"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="specimenSearchParameters.paginateBy"
                :color="bodyActiveColor"
                dense
                :items="paginateByOptionsTranslated"
                :item-color="bodyActiveColor"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="specimenSearchParameters.page"
                :color="bodyActiveColor"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    specimens.count / specimenSearchParameters.paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>

          <v-card
            class="table-card my-1"
            flat
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <!--            <v-card-title class="d-print-none">-->
            <!--              <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>-->
            <!--              <span id="table-title" class="text-uppercase">-->
            <!--                {{ $t("collection.specimen") }}-->
            <!--                <sup>-->
            <!--                  <v-chip-->
            <!--                      :color="bodyActiveColor"-->
            <!--                      small-->
            <!--                      text-color="#ffffff"-->
            <!--                      class="font-weight-bold"-->
            <!--                  >{{ specimens.count }}</v-chip-->
            <!--                  >-->
            <!--                </sup>-->
            <!--              </span>-->
            <!--              <div class="flex-grow-1"></div>-->
            <!--              <v-text-field-->
            <!--                  v-model="filterSpecimens"-->
            <!--                  append-outer-icon="fas fa-search"-->
            <!--                  label="Filter records"-->
            <!--                  clear-icon="fas fa-times"-->
            <!--                  clearable-->
            <!--                  :color="bodyActiveColor"-->
            <!--              ></v-text-field>-->
            <!--            </v-card-title>-->

            <specimen-table
              :response="specimens"
              :search-parameters="specimenSearchParameters"
              :filter="filterSpecimens"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
            />
          </v-card>
        </div>
      </transition>
    </v-card>
    <v-row no-gutters class="mt-2">
      <v-col>
        <object-permissions-create
          v-if="!$route.meta.isEdit"
          @change="handlePermissionsChange"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchCollection,
  fetchListCollectionType,
  fetchSpecimens,
  fetchDatabase,
  fetchObjectPermissions,
} from "@/assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import SpecimenTable from "../specimen/SpecimenTable";
import { mapActions, mapState, mapGetters } from "vuex";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import ObjectPermissionsCreate from "../partial/ObjectPermissionsCreate.vue";

export default {
  name: "Collection",

  components: {
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    SpecimenTable,
    ObjectPermissionsCreate,
  },

  props: {
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapGetters("user", ["getDatabaseId"]),
    ...mapState("search", ["collectionSearchParameters"]),
    ...mapState("detail", ["collectionDetail"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.collectionSearchParameters,
        request: "FETCH_COLLECTIONS",
        title: "header.collections",
        object: "collection",
        field: "number",
      });
    } else {
      // Adding collection default values from local storage
      const collectionHistory = cloneDeep(this.collectionDetail);
      if (collectionHistory) {
        this.collection = collectionHistory;
      }
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true,
    },

    specimenSearchParameters: {
      handler() {
        this.getSpecimensBelongingToCollection();
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions("detail", ["saveFields"]),
    handlePermissionsChange(perms) {
      this.initialPermissions = perms;
    },

    setInitialData() {
      return {
        initialPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        currentPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        copyFields: [
          "id",
          "number",
          "collection_id",
          "type",
          "name",
          "name_long",
          "name_en",
          "name_long_en",
          "classification",
          "agent",
          "locality",
          "stratigraphy",
          "reference",
          "remarks",
          "number_objects",
          "number_types",
          "database",
        ],
        autocomplete: {
          loaders: {
            type: false,
            classification: false,
            agent: false,
            locality: false,
            stratigraphy: false,
            reference: false,
            database: false,
          },
          type: [],
          classification: [],
          agent: [],
          locality: [],
          stratigraphy: [],
          reference: [],
          database: [],
        },
        requiredFields: ["collection_id", "number"],
        collection: {},
        block: {
          info: true,
          relatedInfo: true,
          description: true,
          specimen: true,
        },
        filterSpecimens: "",
        databaseAcronym: "",
        specimens: {
          count: 0,
          results: [],
        },
        specimenSearchParameters: {
          idSpecimen: null,
          collNumber: null,
          collNumber__lookuptype: "iexact",
          fossil: null,
          mineralRock: null,
          locality: null,
          stratigraphy: null,
          agent_collected: null,
          page: 1,
          paginateBy: 25,
          orderBy: "-id",
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 },
        ],
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        this.$emit("set-object", "collection");
        fetchCollection(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "collection", this.handleResponse(response)[0]);
            // this.collection = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.collection);

            // Needs to be before fields are removed
            this.specimenSearchParameters.collNumber = this.collection.number;

            this.removeUnnecessaryFields(this.collection, this.copyFields);
            this.$emit("data-loaded", this.collection);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
          fetchObjectPermissions(this.collection.id, "collection").then(
            (res) => {
              this.currentPermissions.groups_change =
                res.data.group
                  ?.filter(
                    (perm) => perm.permission__codename === "change_collection"
                  )
                  .map((perm) => perm.group_id) ?? [];
              this.currentPermissions.groups_view =
                res.data.group
                  ?.filter(
                    (perm) => perm.permission__codename === "view_collection"
                  )
                  .map((perm) => perm.group_id) ?? [];
              this.currentPermissions.users_change =
                res.data.user
                  ?.filter(
                    (perm) => perm.permission__codename === "change_collection"
                  )
                  .map((perm) => perm.user_id) ?? [];
              this.currentPermissions.users_view =
                res.data.user
                  ?.filter(
                    (perm) => perm.permission__codename === "view_collection"
                  )
                  .map((perm) => perm.user_id) ?? [];
            }
          );
        });
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
        if (this.getDatabaseId !== null) {
          this.collection.database = {
            id: this.getDatabaseId,
          };
        }
      }
    },

    getSpecimensBelongingToCollection() {
      fetchSpecimens(this.specimenSearchParameters).then((response) => {
        if (response.status === 200) {
          this.specimens.count = response.data.count;
          this.specimens.results = response.data.results;
        }
      });
    },

    loadAutocompleteFields(regularAutocompleteFields = true) {
      if (regularAutocompleteFields) {
        fetchListCollectionType().then(
          (response) => (this.autocomplete.type = this.handleResponse(response))
        );
        fetchDatabase().then(
          (response) =>
            (this.autocomplete.database = this.handleResponse(response))
        );
      }
    },

    formatDataForUpload(objectToUpload, saveAsNew = false) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (!this.$route.meta.isEdit) {
        this.saveFields({ key: "collectionDetail", value: objectToUpload });
      }

      Object.keys(uploadableObject).forEach((key) => {
        if (
          typeof uploadableObject[key] === "object" &&
          uploadableObject[key] !== null
        ) {
          uploadableObject[key] = uploadableObject[key].id
            ? uploadableObject[key].id
            : null;
        } else if (typeof uploadableObject[key] === "undefined") {
          uploadableObject[key] = null;
        }
      });
      if (!this.$route.meta.isEdit) {
        uploadableObject.initial_permissions = this.initialPermissions;
      }
      if (saveAsNew) {
        uploadableObject.initial_permissions = this.currentPermissions;
      }

      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.type)) {
        this.collection.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en,
        };
      }
      if (this.isNotEmpty(obj.classification)) {
        this.collection.classification = {
          id: obj.classification,
          class_field: obj.classification__class_field,
          class_en: obj.classification__class_en,
        };
        this.autocomplete.classification.push(this.collection.classification);
      }
      if (this.isNotEmpty(obj.agent)) {
        this.collection.agent = { id: obj.agent, agent: obj.agent__agent };
        this.autocomplete.agent.push(this.collection.agent);
      }
      if (this.isNotEmpty(obj.locality)) {
        this.collection.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en,
        };
        this.autocomplete.locality.push(this.collection.locality);
      }
      if (this.isNotEmpty(obj.stratigraphy)) {
        this.collection.stratigraphy = {
          id: obj.stratigraphy,
          stratigraphy: obj.stratigraphy__stratigraphy,
          stratigraphy_en: obj.stratigraphy__stratigraphy_en,
        };
        this.autocomplete.stratigraphy.push(this.collection.stratigraphy);
      }
      if (this.isNotEmpty(obj.reference)) {
        this.collection.reference = {
          id: obj.reference,
          reference: obj.reference__reference,
        };
        this.autocomplete.reference.push(this.collection.reference);
      }
      this.collection.database = {
        id: obj.database,
        value: obj.database__name,
        value_en: obj.database__name_en,
      };
    },
  },
};
</script>

<style scoped></style>
