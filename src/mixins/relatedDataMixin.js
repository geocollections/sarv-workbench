import { cloneDeep } from "lodash";

const relatedDataMixin = {
  data: () => ({
    dialog: false,
    deleteDialog: false,
    emitDeleteData: null,
    isNewItem: true,
  }),

  computed: {
    // Todo: This enforces component names to follow strict guideline
    tableName() {
      // Use component name to get table name for api
      let arr = this.$options.name.match(/[A-Z][a-z]+/g);
      arr.pop();
      let name = arr.join("_").toLowerCase();
      return name;
    },

    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        };
      });
    },
  },

  methods: {
    /******************
     *** ADD / EDIT ***
     ******************/

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: this.tableName,
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: this.tableName,
          item: formattedItem,
          rawItem: this.item,
        });
      }
      this.cancel();
    },

    editItem(item) {
      this.isNewItem = false;
      this.setItemFields(item);
      this.dialog = true;
    },

    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.resetItem();
    },

    /*************
     *** DELETE ***
     **************/

    deleteItem(item) {
      this.deleteDialog = true;
      this.emitDeleteData = {
        table: this.tableName,
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      };
    },

    cancelDeletion() {
      this.deleteDialog = false;
      this.emitDeleteData = null;
    },

    runDeletion() {
      this.deleteDialog = false;
      if (this.emitDeleteData)
        this.$emit("related:delete", this.emitDeleteData);
    },

    /***************
     *** HELPERS ***
     ***************/

    formatItem(item) {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        }
      });
      return item;
    },

    updateUserInputtedDate(fieldToBeUpdated, date) {
      if (typeof date !== "undefined" && date !== null && date.length > 0) {
        if (this.$moment(date, "YYYY-MM-DD", true).isValid()) {
          this.item[fieldToBeUpdated] = date;
        }
      }
    },
  },
};

export default relatedDataMixin;
