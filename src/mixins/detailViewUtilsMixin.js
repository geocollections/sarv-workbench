import { isPlainObject } from "lodash";

const detailViewUtilsMixin = {
  methods: {
    fillAutocompleteFields(obj) {
      Object.entries(obj).forEach((entry) => {
        if (isPlainObject(entry[1])) this.autocomplete[entry[0]].push(entry[1]);
      });
    },

    loadAutocompleteFields(tables) {
      Promise.all(
        tables.map((table) =>
          this.$api.rw
            .get(table)
            .then((res) => (this.autocomplete[table] = res?.results ?? []))
            .catch((err) => (this.autocomplete[table] = []))
        )
      );
    },

    loadRelatedData(tables, module, moduleId) {
      Promise.all(
        tables.map((table) =>
          this.$api.rw
            .get(table, {
              defaultParams: {
                [module]: moduleId,
              },
              options: {
                ...this.relatedData.searchParameters[table],
              },
            })
            .then((res) => {
              this.relatedData[table].count = res?.count ?? 0;
              this.relatedData[table].results = res?.results ?? [];
            })
            .catch((err) => {
              this.relatedData[table].count = 0;
              this.relatedData[table].results = [];
            })
        )
      );
    },
  },
};

export default detailViewUtilsMixin;
