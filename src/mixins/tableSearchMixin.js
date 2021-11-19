import { mapFields } from "vuex-map-fields";

const tableSearchMixin = {
  computed: {
    ...mapFields("journal", { journal: "searchFields.byIds.journal.value" }),
  },
};

export default tableSearchMixin;
