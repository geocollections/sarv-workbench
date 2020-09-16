<template>
  <v-card flat>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="fas fa-search"
        :label="$t('edit.search')"
        single-line
        :color="bodyActiveColor"
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      class="stratigraphy-catalogue-table"
      :headers="translatedHeaders"
      dense
      disable-sort
      mobile-breakpoint="0"
      :search="search"
      :items="response.results"
      disable-pagination
      hide-default-footer
      expand-icon="fas fa-caret-down"
      :class="bodyColor.split('n-')[0] + 'n-5'"
    >
      <template v-slot:item.stratigraphy="{ item }">
        <router-link
          :to="{ path: '/stratigraphy/' + item.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{ et: item.stratigraphy, en: item.stratigraphy_en }"
          />
        </router-link>
      </template>

      <template v-slot:item.index_main="{ item }">
        <span v-if="item.index_main">{{ item.index_main }}</span>
        <span class="mx-1" v-if="item.index_main && item.index_additional"
          >|</span
        >
        <span v-if="item.index_additional">{{ item.index_additional }}</span>
      </template>

      <template v-slot:item.author_free="{ item }">
        <span v-if="item.author_free">{{ item.author_free }}</span>
        <span class="mr-1" v-if="item.author_free && item.year">,</span>
        <span v-if="item.year">{{ item.year }}</span>
      </template>

      <template v-slot:item.etymon="{ item }">
        <span v-translate="{ et: item.etymon, en: item.etymon_en }" />
      </template>

      <template v-slot:item.age="{ item }">
        <router-link
          v-if="item.age_chronostratigraphy"
          :to="{ path: '/stratigraphy/' + item.age_chronostratigraphy }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.age_chronostratigraphy__stratigraphy,
              en: item.age_chronostratigraphy__stratigraphy_en
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.parent="{ item }">
        <router-link
          v-if="item.parent"
          :to="{ path: '/stratigraphy/' + item.parent }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.parent__stratigraphy,
              en: item.parent__stratigraphy_en
            }"
          />
        </router-link>
      </template>

      <!-- Todo -->
      <template v-slot:item.stratotypes="{ item }">
        <ul class="text-small" v-if="getListOfTypes(item.id, 'stratotypes').length > 0">
          <li
            v-for="(item, index) in getListOfTypes(item.id, 'stratotypes')"
            :key="index"
          >
            <span
              class="font-weight-bold"
              v-translate="{
                et: item.stratotype_type__value,
                en: item.stratotype_type__value_en
              }"
            />:

            <span v-if="item.stratigraphy">
              <router-link
                :to="{ path: '/stratigraphy/' + item.stratigraphy }"
                :title="$t('editStratigraphy.editMessage')"
                class="sarv-link"
                :class="`${bodyActiveColor}--text`"
              >
                <span
                  v-translate="{
                    et: item.stratigraphy__stratigraphy,
                    en: item.stratigraphy__stratigraphy_en
                  }"
                />
              </router-link>
            </span>

            <span v-if="item.reference">
              <router-link
                :to="{ path: '/reference/' + item.reference }"
                :title="$t('editReference.editMessage')"
                class="sarv-link"
                :class="`${bodyActiveColor}--text`"
              >
                ({{ item.reference__reference }})
              </router-link>
            </span>

            <span v-if="item.remarks">
              {{ $t("common.remarks") }}: {{ item.remarks }}</span
            >
          </li>
        </ul>
      </template>

      <!-- Todo -->
      <template v-slot:item.references="{ item }">
        <ul class="text-small" v-if="getListOfTypes(item.id, 'references').length > 0">
          <li
            v-for="(item, index) in getListOfTypes(item.id, 'references')"
            :key="index"
          >
            <router-link
              v-if="item.reference"
              :to="{ path: '/reference/' + item.reference }"
              :title="$t('editReference.editMessage')"
              class="sarv-link"
              :class="`${bodyActiveColor}--text`"
            >
              {{ item.reference__reference }}
            </router-link>
          </li>
        </ul>
      </template>

      <template v-slot:item.status="{ item }">
        <span
          v-translate="{ et: item.status__value, en: item.status__value_en }"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "StratigraphyCatalogueTable",
  props: {
    response: {
      type: Object
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
    search: "",
    headers: [
      { text: "stratigraphy.unit", value: "stratigraphy" },
      { text: "stratigraphy.index", value: "index_main" },
      { text: "common.author", value: "author_free" },
      { text: "stratigraphy.etymon", value: "etymon" },
      { text: "stratigraphy.age", value: "age" },
      { text: "stratigraphy.parent_top", value: "parent" },
      { text: "stratigraphy.stratotypes", value: "stratotypes" },
      { text: "stratigraphy.references", value: "references" },
      { text: "common.remarks", value: "remarks" },
      { text: "stratigraphy.status", value: "status" }
    ]
  }),
  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    }
  },

  methods: {
    getListOfTypes(id, type) {
      return this.response[type].filter(item => item.stratigraphy === id);
    }
  }
};
</script>

<style scoped>
.stratigraphy-catalogue-table >>> td,
.stratigraphy-catalogue-table >>> th {
  padding: 0 4px !important;
}

.text-small {
  font-size: 0.625rem;
}

.stratigraphy-catalogue-table >>> .text-start {
  font-size: 0.75rem;
}
</style>
