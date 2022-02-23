<template>
  <v-data-table
    :headers="headers"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
    :disable-sort="!$route.meta.isEdit || response.results.length === 0"
  >
    <template v-slot:item.specimen="{ item }">
      <router-link
        v-if="item.specimen"
        :to="{ path: '/specimen/' + item.specimen.id }"
        :title="$t('editSpecimen.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.specimen.specimen_full_number || item.specimen.id }}
      </router-link>
    </template>

    <template v-slot:item.attachment="{ item }">
      <router-link
        v-if="item.attachment && item.attachment.uuid_filename"
        :title="$t('edit.editMessage')"
        :to="{ path: '/attachment/' + item.attachment.id }"
      >
        <!-- 1 is jpg and 2 is png -->
        <v-img
          v-if="
            item.attachment.uuid_filename.endsWith('png') ||
            item.attachment.uuid_filename.endsWith('jpg') ||
            item.attachment.uuid_filename.endsWith('jpeg')
          "
          :src="getFileUrl(item.attachment.uuid_filename, 'small')"
          :lazy-src="getFileUrl(item.attachment.uuid_filename, 'small')"
          class="grey lighten-2 attachment-table-image-preview my-1 mx-auto"
          max-width="200"
          max-height="200"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>

        <v-icon v-else class="my-1" style="font-size: 3rem">far fa-file</v-icon>
      </router-link>
    </template>

    <template v-slot:item.sample="{ item }">
      <router-link
        v-if="item.sample"
        :to="{ path: '/sample/' + item.sample.id }"
        :title="$t('editSample.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.sample.number }}
      </router-link>
    </template>

    <template #item.locality="{ item }">
      <router-link
        v-if="item.locality"
        :to="{ path: '/locality/' + item.locality.id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.locality.locality,
            en: item.locality.locality_en,
          }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.taxon.id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.taxon.taxon }}
      </router-link>
    </template>

    <template #item.analysis="{ item }">
      <router-link
        v-if="item.analysis"
        :to="{ path: '/analysis/' + item.analysis.id }"
        :title="$t('editAnalysis.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.analysis.id }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SelectionSeriesDataTable",

  props: {
    response: {
      type: Object,
    },
    headers: {
      type: Array,
    },
    object: {
      type: String,
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function () {
        return {
          page: 1,
          itemsPerPage: 25,
        };
      },
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
    getFileUrl(uuid, size = null) {
      if (uuid) {
        if (size) {
          return `${this.$constants.IMAGE_URL}${size}/${uuid.substring(
            0,
            2
          )}/${uuid.substring(2, 4)}/${uuid}`;
        } else {
          return `${this.$constants.IMAGE_URL}${uuid.substring(
            0,
            2
          )}/${uuid.substring(2, 4)}/${uuid}`;
        }
      }
    },
  },
};
</script>
