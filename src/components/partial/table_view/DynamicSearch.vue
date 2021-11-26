<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card :color="bodyColor.split('n-')[0] + 'n-4'" elevation="2">
        <v-card-title class="pb-0 pt-2">
          <div class="card-title--clickable" @click="showSearch = !showSearch">
            <span>{{ $t("edit.dynamicSearch") }}</span>
            <v-icon right :color="bodyActiveColor">fas fa-search-plus</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showSearch = !showSearch"
            :color="bodyActiveColor"
          >
            <v-icon>{{
              showSearch ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-0 pb-2">
          <div v-show="showSearch">
            <v-row no-gutters>
              <v-col
                class="pa-2"
                cols="12"
                :md="colSize"
                v-for="(field, index) in searchFields.extraIds"
                :key="index"
              >
                <v-row no-gutters>
                  <v-col cols="3" xl="2" class="px-1">
                    <v-select
                      :value="searchFields.byIds[field].lookUpType"
                      :color="bodyActiveColor"
                      :item-color="bodyActiveColor"
                      disable-lookup
                      hide-details
                      :items="lookUpTypes"
                      :label="$t('main.lookUpType')"
                      @input="
                        $emit('update:searchFields', {
                          field,
                          key: 'lookUpType',
                          value: $event,
                          table: $route.meta.object,
                        })
                      "
                    >
                      <template v-slot:selection="{ item }">
                        <div class="font-weight-bold">
                          {{ item.symbol }}
                        </div>
                      </template>
                    </v-select>
                  </v-col>

                  <v-col cols="9" xl="10" class="px-1">
                    <v-text-field
                      :value="searchFields.byIds[field].value"
                      :label="$t(searchFields.byIds[field].title)"
                      :color="bodyActiveColor"
                      hide-details
                      :class="bodyActiveColor + '--text'"
                      @input="
                        $emit('update:searchFields', {
                          field,
                          key: 'value',
                          value: $event,
                          table: $route.meta.object,
                        })
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "DynamicSearch",
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
    lookUpTypes: {
      type: Array,
      required: true,
    },
    searchFields: {
      type: Object,
      required: true,
      default: () => {},
    },
    colSize: {
      type: Number,
      default: 6,
    },
  },
  data: () => ({
    showSearch: false,
  }),
  mounted() {
    this.showSearch = this.isOpenAtStart();
  },
  methods: {
    isOpenAtStart() {
      return this.searchFields.extraIds.some(
        (field) => this.searchFields.byIds[field]?.value?.length > 0
      );
    },
  },
};
</script>

<style scoped></style>
