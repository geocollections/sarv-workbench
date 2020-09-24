<template>
  <div class="loan-sample-table">
    <v-data-table
      :headers="translatedHeaders"
      hide-default-footer
      dense
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :search="filter"
      expand-icon="fas fa-caret-down"
      :sort-by.sync="searchParameters.sortBy"
      :sort-desc.sync="searchParameters.sortDesc"
      :server-items-length="response.count"
      :class="bodyColor.split('n-')[0] + 'n-5'"
      :disable-sort="!$route.meta.isEdit"
    >
      <template v-slot:item.action="{ item }">
        <v-btn
          icon
          @click="editItem(item)"
          color="green"
          :title="$t('buttons.edit')"
          small
        >
          <v-icon small>far fa-edit</v-icon>
        </v-btn>
        <v-btn
          v-if="$route.meta.isEdit"
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.sample="{ item }">
        <router-link
          v-if="$route.meta.isEdit"
          :to="{ path: '/sample/' + item.sample }"
          :title="$t('editSample.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.sample__number }}
        </router-link>
        <router-link
          v-else-if="item.sample"
          :to="{ path: '/sample/' + item.sample.id }"
          :title="$t('editSample.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.sample.number }}
        </router-link>
      </template>
    </v-data-table>

    <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-dialog v-model="dialog" max-width="500px" style="z-index: 50000">
        <template v-slot:activator="{ on }">
          <v-btn :color="bodyActiveColor" small dark v-on="on">{{
            $t("buttons.add_new")
          }}</v-btn>
        </template>
        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
          <v-card-title>
            <span class="headline">{{ $t("header.loan_sample") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.sample"
                    :color="bodyActiveColor"
                    :items="autocomplete.sample"
                    :loading="autocomplete.loaders.sample"
                    item-text="number"
                    :label="$t('loan.sample')"
                    use-state
                    is-link
                    route-object="sample"
                    is-searchable
                    v-on:search:items="autocompleteSampleSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('common.remarks')"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancel">{{
              $t("buttons.cancel")
            }}</v-btn>
            <v-btn
              :disabled="!isItemValid"
              color="green"
              text
              @click="addItem"
              >{{ isNewItem ? $t("buttons.add") : $t("buttons.edit") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <RelatedDataDeleteDialog
      :dialog="deleteDialog"
      @cancel="cancelDeletion"
      @delete="runDeletion"
    />
  </div>
</template>

<script>
import InputWrapper from "../../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "LoanSampleTable",

  components: {
    RelatedDataDeleteDialog,
    AutocompleteWrapper,
    InputWrapper
  },

  mixins: [autocompleteMixin, relatedDataMixin],

  props: {
    response: {
      type: Object
    },
    filter: {
      type: String,
      required: false
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function() {
        return {
          page: 1,
          paginateBy: 25
        };
      }
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },

  data: () => ({
    headers: [
      { text: "loan.sample", value: "sample" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    item: {
      sample: null,
      remarks: ""
    },
    autocomplete: {
      sample: [],
      loaders: {
        sample: false
      }
    }
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.sample !== "undefined" && this.item.sample !== null
      );
    }
  },

  methods: {
    resetItem() {
      this.item = {
        reference: null,
        pages: "",
        figures: "",
        remarks: ""
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (typeof item.sample !== "object" && item.sample !== null) {
        this.item.sample = {
          id: item.sample,
          number: item.sample__number
        };
        this.autocomplete.sample.push(this.item.sample);
      } else {
        this.item.sample = item.sample;
        this.autocomplete.sample.push(this.item.sample);
      }
      this.item.remarks = item.remarks;
    }
  }
};
</script>

<style scoped></style>
