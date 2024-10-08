<template>
  <!-- NOTE: Using activator now for v-menu.
    Using the #id based implementation broke BaseDataTableHeaderMenu when switching between tabs.
    Right now the button does not appear immediately when page is loading.
    This is something to do with transitions. https://github.com/vuetifyjs/vuetify/issues/10578
  -->
  <v-menu
    transition="slide-y-transition"
    offset-y
    z-index="4"
    :close-on-content-click="false"
  >
    <template #activator="menu">
      <slot name="activator" v-bind="menu">
        <v-tooltip bottom open-delay="500">
          <template #activator="tooltip">
            <v-btn
              icon
              class="mr-2"
              v-bind="{ ...menu.attrs, ...tooltip.attrs }"
              v-on="{ ...menu.on, ...tooltip.on }"
            >
              <v-icon>fas fa-table</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("table.tooltipConfig") }}</span>
        </v-tooltip>
      </slot>
    </template>
    <v-card>
      <v-list flat class="">
        <v-list-item-title class="px-2 montserrat align-center">
          {{ $t("common.headers") }}
          <v-tooltip bottom open-delay="500">
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on" @click="$emit('reset')">
                <v-icon>fas fa-redo</v-icon>
              </v-btn>
            </template>
            {{ $t("table.tooltipResetHeaders") }}
          </v-tooltip>

          <v-tooltip open-delay="500" bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                v-on="on"
                @click="onlyVisible = !onlyVisible"
              >
                <v-icon v-if="!onlyVisible">fas fa-eye</v-icon>
                <v-icon v-else>fas fa-eye-slash</v-icon>
              </v-btn>
            </template>
            <span v-if="!onlyVisible">
              {{ $t("table.tooltipShowActiveHeaders") }}
            </span>
            <span v-else>{{ $t("table.tooltipShowAllHeaders") }}</span>
          </v-tooltip>
          <v-text-field
            v-model="filter"
            class="py-2"
            dense
            hide-details
            :label="$t('common.filter')"
          />
        </v-list-item-title>
        <v-list-item-group :value="visibleHeaders" multiple>
          <v-virtual-scroll
            :items="
              (onlyVisible ? visibleHeaders : headers) | filterHeaders(filter)
            "
            height="500"
            item-height="35"
            width="300"
            :bench="20"
            multiple
          >
            <template #default="{ item }">
              <v-tooltip left :disabled="!sortBy.includes(item.value)">
                <template #activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-list-item
                      dense
                      :disabled="sortBy.includes(item.value)"
                      :value="item"
                      @click="$emit('change', item)"
                    >
                      <v-list-item-action class="my-2 mr-2">
                        <v-checkbox
                          dense
                          :disabled="sortBy.includes(item.value)"
                          :input-value="item.show"
                          :color="bodyActiveColor"
                        />
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </template>
                {{ $t("common.headerSelectDisabled") }}
              </v-tooltip>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "DataTableHeaderMenu",
  filters: {
    filterHeaders(headers, filter) {
      return headers.filter((header) => {
        if (header.hideable === false) return false;
        return header.text.toLowerCase().includes(filter.toLowerCase());
      });
    },
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    visibleHeaders: {
      type: Array,
      default: () => [],
    },
    sortBy: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      onlyVisible: false,
      filter: "",
    };
  },
  computed: {
    ...mapState("settings", ["bodyActiveColor"]),
  },
};
</script>
