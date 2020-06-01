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
      item-value="id"
      return-object
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
          <span v-if="attachmentRelatedData">{{
            attachmentRelatedDataLabel(data, $attrs)
          }}</span>
          <span v-else>{{ data.item[$attrs["item-text"]] }}</span>
        </v-chip>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import {mapState} from "vuex";

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
    attachmentRelatedData: Boolean
  },
  data: () => ({
    search: null
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
    }
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
    }
  },
  methods: {
    attachmentRelatedDataLabel(option, attrs) {
      switch (attrs.label) {
        case "Collection":
        case "Kollektsioon":
        case "Dataset":
        case "Andmestik":
        case "Project":
        case "Projekt":
        case "Site":
        case "Vaatluspunkt":
          if (this.$i18n.locale === "ee")
            return `${option.item.id} - (${option.item.name})`;
          return `${option.item.id} - (${option.item.name_en})`;
        case "Specimen":
        case "Eksemplar":
          if (
            typeof option.item.coll__number !== "undefined" &&
            option.item.coll__number !== null
          ) {
            return `${option.item.coll__number.split(" ")[0]} ${
              option.item.specimen_id
            } (${option.item.id})`;
          } else return `${option.item.specimen_id} (${option.item.id})`;
        case "Sample":
        case "Proov":
          return `${option.item.id} - (${option.item.number})`;
        case "Sample series":
        case "Proovi seeria":
          return `${option.item.id} - (${option.item.name})`;
        case "Analysis":
        case "Analüüs":
          if (option.item.sample__number)
            return `${option.item.id} - (${option.item.sample__number})`;
          else return `${option.item.id}`;
        case "DOI":
          return `${option.item.id} - (${option.item.identifier})`;
        case "Locality":
        case "Lokaliteet":
          if (this.$i18n.locale === "ee")
            return `${option.item.id} - (${option.item.locality})`;
          return `${option.item.id} - (${option.item.locality_en})`;
        case "Drill core":
        case "Puursüdamik":
          if (this.$i18n.locale === "ee")
            return `${option.item.id} - (${option.item.drillcore})`;
          return `${option.item.id} - (${option.item.drillcore_en})`;
        case "Drill core box":
        case "Puursüdamiku kast":
          if (this.$i18n.locale === "ee")
            return `${option.item.id} - (${option.item.drillcore__drillcore} - ${option.item.number})`;
          return `${option.item.id} - (${option.item.drillcore__drillcore_en} - ${option.item.number})`;
        case "Preparation":
        case "Preparaat":
          return `${option.item.id} - (${option.item.preparation_number})`;
        case "Reference":
        case "Kirjandus":
          return `${option.item.id} - (${option.item.reference})`;
        case "Storage":
        case "Hoidla":
          if (option.item.contents === null)
            return `${option.item.id} - (${option.item.location})`;
          else
            return `${option.item.id} - (${option.item.location} - ${option.item.contents})`;
        default:
          return `${option.item.id}`;
      }
    },

    openInNewTab(object, id) {
      let routeData = this.$router.resolve({ path: `/${object}/${id}` });
      window.open(routeData.href, "AutocompleteWindow");
    },

    resetSearchInput() {
      if (this.search && this.search.length > 0) {
        this.search = null;
      }
    }
  }
};
</script>

<style scoped>
.input-class >>> .v-text-field--outlined {
  /*background-color: unset;*/
}

/* Adding margin right to chip content because delete button has absolute position and otherwise it would overlap */
.input-class >>> .v-chip__content {
  /*margin-right: 18px; !* delete icon width is 18px *!*/
}

/* Making delete button in chip absolute because overlapping issues */
.input-class >>> .v-chip__content > i {
  /*background: white;*/
  /*position: absolute;*/
  /*right: 4px;*/
  /*padding: 12px; !* Adding padding because now when user click near the delete then it deletes *!*/
}

/* Hover opacity fix, otherwise it would be hard to see  */
.input-class >>> .v-chip__content > i:hover {
  /*opacity: 1;*/
}

/* Adding margin auto to inner icon (close-icon) */
.input-class >>> .v-input__append-inner {
  /*margin: auto !important;*/
}

/* Small size to clear icon */
.input-class >>> .v-input__append-inner > .v-input__icon--clear > .v-icon {
  /*font-size: 20px;*/
}
</style>
