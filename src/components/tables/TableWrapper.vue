<template>
  <!-- HACK: line 28 'isLoading = !onlyTable is hacky.
      For some reason @update is getting called on created,
      because of that the loading indicator stayies perminantly active
      on tables where update function is not set.
      To fix this for now, tables that have onlyTable prop do not
      enable loading indicator when created.
' -->
  <v-card :flat="$attrs.flat">
    <v-data-table
      id="table"
      item-key="id"
      mobile-breakpoint="0"
      dense
      calculate-widths
      multi-sort
      :loading-text="$t('table.loading')"
      :loader-height="0"
      :loading="isLoading"
      :headers="visibleHeaders"
      :items="items"
      :options="options"
      :server-items-length="count"
      hide-default-footer
      :footer-props="footerProps"
      :show-expand="expandable"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      @click:row="handleRowClick"
      @update:options="updateTableOptions"
    >
      <template #no-data>{{ $t("table.noData") }}</template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-if="!onlyTable" #top="{ pagination, options }">
        <div class="table-top">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="auto"
              class="px-3 my-1 my-sm-3"
              align-self="center"
            >
              <!-- Currently using other export component -->
              <export-controls v-if="false" />
              <header-controls
                v-if="dynamicHeaders"
                :headers="headers"
                :visible-headers="visibleHeaders"
                :sort-by="options.sortBy"
                @change="$emit('change:headers', { value: $event.value })"
                @reset="$emit('reset:headers')"
              />
            </v-col>
            <v-col>
              <pagination-controls
                :options="options"
                :pagination="pagination"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="footerProps['items-per-page-text']"
                :page-select-text="
                  $t('common.pageSelect', {
                    current: options.page,
                    count: pagination.pageCount,
                  })
                "
                :go-to-text="$t('common.goTo')"
                :go-to-button-text="$t('common.goToBtn')"
                select-page-id="header-select-btn"
                @update:options="updateTableOptions($event)"
              />
            </v-col>
          </v-row>
        </div>
      </template>
      <template v-if="!onlyTable" #footer="{ props }">
        <pagination-controls
          class="py-3"
          :options="props.options"
          :pagination="props.pagination"
          :items-per-page-options="footerProps['items-per-page-options']"
          :items-per-page-text="footerProps['items-per-page-text']"
          :page-select-text="
            $t('common.pageSelect', {
              current: props.options.page,
              count: props.pagination.pageCount,
            })
          "
          :go-to-text="$t('common.goTo')"
          :go-to-button-text="$t('common.goToBtn')"
          select-page-id="footer-select-btn"
          @update:options="updateTableOptions($event)"
        />
      </template>
      <template
        v-if="expandable"
        #item.data-table-expand="{ expand, isExpanded, item }"
      >
        <v-btn
          v-if="item.canExpand"
          icon
          :class="{ active: isExpanded }"
          @click.stop="expand(!isExpanded)"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <template v-for="(_, slotName) in $scopedSlots" #[slotName]="context">
        <slot :name="slotName" v-bind="context" />
      </template>

      <template #item.date_added="{ item }">
        {{ $formatDate(item.date_added) }}
      </template>

      <template #item.date_changed="{ item }">
        {{ $formatDate(item.date_changed) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { debounce } from "lodash";
import HeaderControls from "./HeaderControls.vue";
import PaginationControls from "./PaginationControls.vue";
import ExportControls from "@/components/tables/ExportControls";
export default {
  name: "TableWrapper",
  components: { ExportControls, PaginationControls, HeaderControls },
  props: {
    onlyTable: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
    count: {
      type: Number,
      default: 0,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    expandable: {
      type: Boolean,
      default: false,
    },
    singleExpand: {
      type: Boolean,
      default: false,
    },
    dynamicHeaders: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: "",
      footerProps: {
        showFirstLastPage: true,
        "items-per-page-options": [10, 25, 50, 100, 250, 500, 1000],
        "items-per-page-text": this.$t("common.itemsPerPage"),
      },
      expanded: [],
    };
  },
  computed: {
    visibleHeaders() {
      return this.headers.filter((header) => header.show);
    },
  },
  methods: {
    updateTableOptions(options) {
      if (this.options.page !== options.page)
        this.$emit("update:options", {
          value: options.page,
          key: "page",
        });
      if (this.options.itemsPerPage !== options.itemsPerPage)
        this.$emit("update:options", {
          value: options.itemsPerPage,
          key: "itemsPerPage",
        });
      if (this.options.sortBy !== options.sortBy)
        this.$emit("update:options", {
          value: options.sortBy,
          key: "sortBy",
        });
      if (this.options.sortDesc !== options.sortDesc)
        this.$emit("update:options", {
          value: options.sortDesc,
          key: "sortDesc",
        });
    },
    handleRowClick(item, slot) {
      // HACK: This is added to handle propagation,
      // as this function does not have a event argument (https://vuetifyjs.com/en/api/v-data-table/#api-events)
      // .stop cannot be used to stop propagation.
      // Right now we check if the target has class 'text-link',
      // if does then we know that the user clicked a link and we do not expand the row.
      // Workaround found from: https://github.com/vuetifyjs/vuetify/issues/1538
      if (event.target.classList.contains("text-link")) return;
      slot.expand(!slot.isExpanded);
    },
  },
};
</script>
