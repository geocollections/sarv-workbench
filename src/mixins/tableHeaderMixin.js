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
    }
  },

  methods: {
    ...mapActions("tableHeaders", ["updateTableHeaders", "getAllFieldNames"]),

    $_tableHeaderMixin_updateTableHeaders(payload) {
      this.updateTableHeaders(payload);
    },

    async $_tableHeaderMixin_getAllFieldNames(table = this.$route.meta.object) {
      await this.getAllFieldNames(table);
    }
  }
};

export default tableHeaderMixin;
