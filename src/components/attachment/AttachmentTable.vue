<template>
  <v-data-table
    class="attachment-table"
    :headers="translatedHeaders"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    :show-select="!!activeSelectionSeries"
    @item-selected="
      $emit('toggle-item-in-selection-series', $event, 'attachment')
    "
    @toggle-select-all="$emit('toggle-select-all', $event, 'attachment')"
    expand-icon="fas fa-caret-down"
    :value="selected"
    :sort-by="searchParameters.sortBy"
    :sort-desc="searchParameters.sortDesc"
    @update:sort-by="$emit('update:sorting', { value: $event, key: 'sortBy' })"
    @update:sort-desc="
      $emit('update:sorting', { value: $event, key: 'sortDesc' })
    "
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.uuid_filename="{ item }">
      <router-link
        v-if="item.uuid_filename"
        :title="$t('edit.editMessage')"
        :to="{ path: '/attachment/' + item.id }"
      >
        <v-img
          v-if="isAttachmentImage(item.attachment_format__value)"
          :src="getFileUrl(item.uuid_filename, 'small')"
          :lazy-src="getFileUrl(item.uuid_filename, 'small')"
          class="grey lighten-2 attachment-table-image-preview my-1"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>

        <v-icon v-else class="my-1" style="font-size: 3rem">far fa-file</v-icon>
      </router-link>

      <router-link
        v-else
        :title="$t('edit.editMessage')"
        :to="{ path: '/attachment/' + item.id }"
      >
        <v-icon class="my-1" style="font-size: 3rem">far fa-file</v-icon>
      </router-link>
    </template>

    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/attachment/' + item.id }"
        :title="$t('edit.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.author="{ item }">
      <span v-if="item.author__agent">{{ item.author__agent }}</span>
      <span v-else>{{ item.author_free }}</span>
    </template>

    <template v-slot:item.date_created="{ item }">
      <span v-if="item.date_created">{{ item.date_created }}</span>
      <span v-else>{{ item.date_created_free }}</span>
    </template>

    <template v-slot:item.specimen="{ item }">
      <router-link
        :to="{ path: '/specimen/' + item.specimen }"
        :title="$t('editSpecimen.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.specimen }}
      </router-link>
    </template>

    <template v-slot:item.reference="{ item }">
      <router-link
        :to="{ path: '/reference/' + item.reference_id }"
        :title="$t('editReference.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.reference__reference }}
      </router-link>
    </template>

    <template v-slot:item.specimen_image_attachment="{ item }">
      <span v-if="item.specimen_image_attachment === 1">{{
        $t("attachment.specimenFile")
      }}</span>
      <span v-if="item.specimen_image_attachment === 2">{{
        $t("attachment.photoArchiveFile")
      }}</span>
      <span v-if="item.specimen_image_attachment === 3">{{
        $t("attachment.otherFile")
      }}</span>
      <span v-if="item.specimen_image_attachment === 4">{{
        $t("attachment.digitisedReferenceFile")
      }}</span>
    </template>

    <template v-slot:item.is_private="{ item }">
      <v-checkbox
        hide-details
        class="mt-0"
        v-model="item.is_private"
        @change="$emit('toggle-privacy-state', item.is_private, item.id)"
        :color="bodyActiveColor"
      />
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'file', id: item.id })"
        :title="$t('editAttachment.viewMessage')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";
import { mapGetters } from "vuex";

export default {
  name: "AttachmentTable",
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
  mixins: [activeListMixin],
  computed: {
    ...mapGetters("search", ["getAllShownTableHeaders"]),

    translatedHeaders() {
      return this.getAllShownTableHeaders(this.$route.meta.object).map(
        header => {
          return {
            ...header,
            text: this.$t(header.text)
          };
        }
      );
    }
  },
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },

    getFileUrl(uuid, size = null) {
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
    },

    isAttachmentImage(type) {
      return type && type.includes("image");
    }
  }
};
</script>

<style>
.attachment-table.v-data-table td,
.attachment-table.v-data-table th {
  padding: 0 8px;
}

.attachment-table-image-preview {
  max-height: 200px;
  max-width: 200px;
  border-radius: 0.25rem;
}
</style>
