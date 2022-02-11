<template>
  <div class="input-class">
    <v-autocomplete
      background-color="white"
      :class="bodyColor.split('n-')[0] + 'n-5'"
      clearable
      clear-icon="fas fa-times"
      dense
      hide-details
      hide-no-data
      outlined
      :placeholder="$t('add.autocomplete')"
      :item-color="$attrs.color"
      :item-value="$attrs['item-value'] ? $attrs['item-value'] : 'id'"
      :return-object="!$attrs['item-value']"
      :cache-items="noCache ? false : isSearchable"
      v-bind="$attrs"
      v-on="$listeners"
      :search-input.sync="search"
      :title="$attrs.value ? $attrs.value[this.$attrs['item-text']] : ''"
      :error="useCustomState ? $attrs.error : useState ? !$attrs.value : false"
      :success="
        useCustomState ? $attrs.success : useState ? !!$attrs.value : false
      "
      :small-chips="!!$attrs.multiple"
      :deletable-chips="!!$attrs.multiple"
      @change="resetSearchInput"
      autocomplete="off"
    >
      <template v-slot:append-outer>
        <v-btn
          v-if="isValidLink && $attrs.value && $attrs.value.id"
          :to="{ path: `/${routeObject}/${$attrs.value.id}` }"
          :title="`Go to /${routeObject}/${$attrs.value.id}`"
          icon
          :color="$attrs.color"
          small
        >
          <v-icon>fas fa-external-link-square-alt</v-icon>
        </v-btn>
      </template>

      <template v-if="!!$attrs.multiple" v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          small
          :color="isValidLink ? $attrs.color : ''"
          outlined
          @click="
            isValidLink
              ? openInNewTab(routeObject, data.item.id)
              : data.selected
          "
          @click:close="$emit('chip:close', data.item)"
        >
          <span>{{ data.item[$attrs["item-text"]] }}</span>
        </v-chip>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AutocompleteWrapper",
  inheritAttrs: false,
  props: {
    isLink: Boolean,
    routeObject: String,
    isSearchable: Boolean,
    method: Function,
    useState: Boolean,
    useCustomState: Boolean,
    noCache: Boolean,
  },
  data: () => ({
    search: null,
  }),
  computed: {
    ...mapState("settings", ["bodyColor"]),

    isValidLink() {
      if (this.isLink) {
        if (this.routeObject && this.routeObject.trim().length > 0) {
          return true;
        } else {
          console.error("route-object prop must be string!");
          return false;
        }
      } else return false;
    },
  },
  watch: {
    search(newVal, oldVal) {
      let currentValue =
        this.$attrs.value && this.$attrs.value[this.$attrs["item-text"]];

      if (
        this.isSearchable &&
        newVal &&
        newVal.length > 0 &&
        newVal !== currentValue &&
        newVal !== oldVal
      ) {
        this.$emit("search:items", newVal);
      }
    },
  },
  methods: {
    openInNewTab(object, id) {
      let routeData = this.$router.resolve({ path: `/${object}/${id}` });
      window.open(routeData.href, "AutocompleteWindow");
    },

    resetSearchInput() {
      if (this.search && this.search.length > 0) {
        this.search = null;
      }
    },
  },
};
</script>
