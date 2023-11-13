<template>
  <v-data-table
    mobile-breakpoint="0"
    :headers="$_tableHeaderMixin_shownHeaders"
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
      <div class="text-center">
        <router-link
          v-if="item.uuid_filename"
          :title="$t('edit.editMessage')"
          :to="{ path: '/attachment/' + item.id }"
          class="image-link my-1"
          style="max-width: 150px; max-height: 150px; display: block"
        >
          <file-preview :attachment="item" />
        </router-link>
        <router-link
          v-else
          :title="$t('edit.editMessage')"
          :to="{ path: '/attachment/' + item.id }"
        >
          <v-icon class="my-1" style="font-size: 3rem">far fa-file</v-icon>
        </router-link>
      </div>
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

    <template v-slot:item.author__agent="{ item }">
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

    <template v-slot:item.reference__reference="{ item }">
      <router-link
        :to="{ path: '/reference/' + item.reference }"
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
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
import FilePreview from "@/components/FilePreview.vue";

export default {
  name: "AttachmentTable",
  components: { FilePreview },
  mixins: [activeListMixin, tableHeaderMixin],
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

<style>
.attachment-table-image-preview {
  max-height: 200px;
  max-width: 200px;
  border-radius: 0.25rem;
}

.image-link {
  transition: opacity 200ms ease-in;
}
.image-link:hover {
  opacity: 0.8;
}
</style>
