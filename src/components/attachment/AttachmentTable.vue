<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="headers"
    :items="response.results"
    :count="response.count"
    :options="searchParameters"
    :show-search="false"
    expandable
    :show-select="!!activeSelectionSeries"
    @item-selected="
      $emit('toggle-item-in-selection-series', $event, 'attachment')
    "
    @toggle-select-all="$emit('toggle-select-all', $event, 'attachment')"
    expand-icon="fas fa-caret-down"
    :value="selected"
    @change:headers="$emit('change:headers', $event)"
    @reset:headers="$emit('reset:headers')"
    @update:options="$emit('update:options', $event)"
  >
    <template v-slot:item.uuid_filename="{ item }">
      <div style="max-width: 200px; max-height: 200px" class="text-center">
        <router-link
          v-if="item.uuid_filename"
          :title="$t('edit.editMessage')"
          :to="{ path: '/attachment/' + item.id }"
          class="image-link"
          style="max-width: 200px; max-height: 200px"
        >
          <v-img
            v-if="isAttachmentImage(item.attachment_format)"
            :src="getFileUrl(item.uuid_filename, 'small')"
            :lazy-src="getFileUrl(item.uuid_filename, 'small')"
            class="grey lighten-2 attachment-table-image-preview my-1"
            max-width="200"
            max-height="200"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>

          <v-icon v-else class="my-1" style="font-size: 3rem"
            >far fa-file</v-icon
          >
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

    <template v-slot:item.author="{ item }">
      <span v-if="item.author">{{ item.author.agent }}</span>
      <span v-else>{{ item.author_free }}</span>
    </template>

    <template v-slot:item.date_created="{ item }">
      <span v-if="item.date_created">{{ item.date_created }}</span>
      <span v-else>{{ item.date_created_free }}</span>
    </template>

    <template v-slot:item.specimen="{ item }">
      <router-link
        v-if="item.specimen"
        :to="{ path: '/specimen/' + item.specimen.id }"
        :title="$t('editSpecimen.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.specimen.specimen_full_number }}
      </router-link>
    </template>

    <template v-slot:item.reference="{ item }">
      <router-link
        v-if="item.reference"
        :to="{ path: '/reference/' + item.reference.id }"
        :title="$t('editReference.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.reference.reference }}
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
  </table-wrapper>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "AttachmentTable",
  components: { TableWrapper },
  mixins: [activeListMixin, tableViewMixin],
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

    isAttachmentImage(format) {
      return format?.value && format?.value.includes("image");
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
