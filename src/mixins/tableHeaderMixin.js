import { mapActions, mapGetters, mapState } from "vuex";

const tableHeaderMixin = {
  computed: {
    ...mapState("search", ["tableHeaders"]),
    ...mapGetters("search", ["getAllShownTableHeaders"]),

    $_tableHeaderMixin_allHeaders() {
      return this.tableHeaders[this.$route.meta.object].map(item => {
        return {
          ...item,
          text: this.$t(item.text)
        };
      });
    },

    $_tableHeaderMixin_shownHeaders() {
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
    ...mapActions("search", [
      "updateTableHeaders",
      "getAllFieldNames",
      "initTableHeaders"
    ]),

    $_tableHeaderMixin_updateTableHeaders(payload) {
      this.updateTableHeaders(payload);
    },

    async $_tableHeaderMixin_getAllFieldNames(table) {
      await this.getAllFieldNames(table);
    },

    $_tableHeaderMixin_initTableHeaders(payload) {
      this.initTableHeaders(payload);
    }
  }
};

export default tableHeaderMixin;
