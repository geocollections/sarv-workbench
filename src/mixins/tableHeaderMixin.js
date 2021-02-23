import { mapActions, mapState } from "vuex";

const tableHeaderMixin = {
  computed: {
    ...mapState("tableHeaders", {
      tableHeaders: function(state) {
        return state[this.$route.meta.object];
      }
    }),

    $_tableHeaderMixin_allHeaders() {
      return this.tableHeaders.map(item => {
        return {
          ...item,
          text: this.$t(item.text)
        };
      });
    },

    $_tableHeaderMixin_shownHeaders() {
      return this.$_tableHeaderMixin_allHeaders.filter(item => item.show);
    },

    $_tableHeaderMixin_shownHeadersAsStringList() {
      return this.$_tableHeaderMixin_shownHeaders
        .filter(item => typeof item.sortable === "undefined" || item.sortable)
        .map(item => item.value);
    }
  },

  methods: {
    ...mapActions("tableHeaders", [
      "updateTableHeaders",
      "getAllFieldNames",
      "setDefaultTableHeaders"
    ]),

    async $_tableHeaderMixin_getAllFieldNames(table = this.$route.meta.object) {
      await this.getAllFieldNames(table);
    },

    $_tableHeaderMixin_updateTableHeaders(payload) {
      this.updateTableHeaders(payload);
    },

    $_tableHeaderMixin_setDefaultTableHeaders(table = this.$route.meta.object) {
      this.setDefaultTableHeaders(table);
    }
  }
};

export default tableHeaderMixin;
