<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="headers"
    :items="response.results"
    :count="response.count"
    :options="searchParameters"
    :show-search="false"
    @change:headers="$emit('change:headers', $event)"
    @reset:headers="$emit('reset:headers')"
    @update:options="$emit('update:options', $event)"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/dataset/' + item.id }"
        :title="$t('editDataset.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.title="{ item }">
      <router-link
        :to="{ path: '/dataset/' + item.id }"
        :title="$t('editDataset.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.title }}
      </router-link>
    </template>

    <template v-slot:item.date="{ item }">
      <span v-if="item.date">{{ item.date }}</span>
      <span v-else>{{ item.date_txt }}</span>
    </template>

    <template v-slot:item.creators="{ item }">
      <span v-if="item.creators">{{ item.creators }}</span>
      <span v-else>{{ item.owner_txt || item.owner__agent }}</span>
    </template>

    <template v-slot:item.publication_year="{ item }">
      <span v-if="item.publication_year">{{ item.publication_year }}</span>
      <span v-else-if="item.date">{{
        item.date | moment("YYYY-MM-DD HH:mm")
      }}</span>
      <span v-else>{{ item.date_txt }}</span>
    </template>

    <!--    <template v-slot:item.owner="{ item }">-->
    <!--      <router-link-->
    <!--        :to="{ path: '/agent/' + item.owner }"-->
    <!--        :title="$t('editAgent.editMessage')"-->
    <!--        class="sarv-link"-->
    <!--        :class="`${bodyActiveColor}&#45;&#45;text`"-->
    <!--        v-if="item.owner"-->
    <!--      >-->
    <!--        {{ item.owner__agent }}-->
    <!--      </router-link>-->
    <!--      <span v-else>{{ item.owner_txt }}</span>-->
    <!--    </template>-->

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'dataset', id: item.id })"
        :title="$t('editDataset.viewMessage')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </table-wrapper>
</template>

<script>
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "DatasetTable",
  components: { TableWrapper },
  mixins: [tableViewMixin],
  props: {
    response: {
      type: Object,
    },
    filter: {
      type: String,
      required: false,
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function () {
        return {
          page: 1,
          paginateBy: 25,
        };
      },
    },
    headers: {
      type: Array,
      required: true,
      default: () => [],
    },
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
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },
  },
};
</script>
