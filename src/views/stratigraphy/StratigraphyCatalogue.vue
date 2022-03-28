<template>
  <div class="stratigraphy-catalogue">
    <SpinnerWrapper />

    <v-card class="mt-2">
      <v-card-title
        class="justify-center font-weight-bold text-h5 pb-1"
        style="word-break: break-word"
      >
        <span>{{ pageTitle }}</span>
      </v-card-title>

      <v-card-text class="text-center pb-0">
        <span v-for="(item, index) in catalogueSearch" :key="index">
          <v-btn
            @click="searchCatalogue(item)"
            :input-value="activeCatalogue.id === item.id"
            text
            small
            :color="bodyActiveColor"
            class="ma-1"
            :class="{
              'white--text': bodyActiveColorDark,
            }"
            >{{ $t(`stratigraphy_catalogue.${item.title}`) }}</v-btn
          >
        </span>
      </v-card-text>

      <StratigraphyCatalogueTable
        :response="response[activeCatalogue.title]"
        :body-color="bodyColor"
        :body-active-color="bodyActiveColor"
      />
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import StratigraphyCatalogueTable from "@/components/stratigraphy/StratigraphyCatalogueTable";
import {
  fetchStratigraphyCatalogue,
  fetchStratigraphyCatalogueReferences,
  fetchStratigraphyCatalogueStratotypes,
} from "@/assets/js/api/apiCalls";
import SpinnerWrapper from "@/components/partial/SpinnerWrapper";

export default {
  name: "StratigraphyCatalogue",
  components: { SpinnerWrapper, StratigraphyCatalogueTable },
  data: () => ({
    activeCatalogue: {
      title: "silur",
      id: 5,
      string: "1-109-6-7-40",
      stringLito: "1-110-291",
    },
    catalogueSearch: [
      {
        title: "cambrian",
        id: 3,
        string: "1-109-6-7-8",
        stringLito: "1-110-293",
      },
      {
        title: "ordovician",
        id: 4,
        string: "1-109-6-7-12",
        stringLito: "1-110-290",
      },
      {
        title: "silur",
        id: 5,
        string: "1-109-6-7-40",
        stringLito: "1-110-291",
      },
      {
        title: "devon",
        id: 6,
        string: "1-109-6-7-57",
        stringLito: "1-110-292",
      },
      { title: "all", id: 10, string: "1", stringLito: "1" },
    ],
    response: {
      cambrian: { count: 0, results: [], stratotypes: [], references: [] },
      ordovician: { count: 0, results: [], stratotypes: [], references: [] },
      silur: { count: 0, results: [], stratotypes: [], references: [] },
      devon: { count: 0, results: [], stratotypes: [], references: [] },
      all: { count: 0, results: [], stratotypes: [], references: [] },
    },
  }),

  computed: {
    ...mapState("settings", [
      "bodyColor",
      "bodyActiveColor",
      "bodyActiveColorDark",
    ]),

    pageTitle() {
      let parentheses = this.$t(
        `stratigraphy_catalogue.${this.activeCatalogue.title}`
      );
      return `${this.$t("stratigraphy_catalogue.title")} (${parentheses})`;
    },
  },

  created() {
    this.searchCatalogue();
  },

  methods: {
    ...mapActions("search", ["setLoadingState"]),

    async searchCatalogue(activeItem) {
      if (activeItem) this.activeCatalogue = activeItem;

      if (this.response[this.activeCatalogue.title].count === 0) {
        this.setLoadingState(true);

        const responseFromApi = await fetchStratigraphyCatalogue(
          this.activeCatalogue
        );

        // I don't want to show loader when adding stratotypes and references to table
        this.setLoadingState(false);

        if (responseFromApi?.data) {
          this.response[this.activeCatalogue.title].count =
            responseFromApi.data.count;
          this.response[this.activeCatalogue.title].results =
            responseFromApi.data.results;

          let listOfIds = this.response[this.activeCatalogue.title].results.map(
            (item) => item.id
          );

          const stratotypeResponse =
            await fetchStratigraphyCatalogueStratotypes(listOfIds);
          if (stratotypeResponse?.data?.results)
            this.response[this.activeCatalogue.title].stratotypes =
              stratotypeResponse.data.results;

          const referenceResponse = await fetchStratigraphyCatalogueReferences(
            listOfIds
          );

          if (referenceResponse?.data?.results)
            this.response[this.activeCatalogue.title].references =
              referenceResponse.data.results;
        }
      }
    },
  },
};
</script>
