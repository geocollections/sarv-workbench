import { isPlainObject } from "lodash";

const detailViewUtilsMixin = {
  methods: {
    fillAutocompleteFields(obj) {
      Object.entries(obj).forEach((entry) => {
        if (isPlainObject(entry[1])) {
          // If autocomplete field doesn't exist then creates it (better to initialise it in data and remove the creation here)
          if (!this.autocomplete?.[entry[0]]) this.autocomplete[entry[0]] = [];
          this.autocomplete[entry[0]].push(entry[1]);
        }
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

    formatDataForUpload(object) {
      let uploadableObject = { ...object };
      uploadableObject = cleanObject(uploadableObject);
      return uploadableObject;
    },
  },
};

function cleanObject(obj) {
  for (let i in obj) {
    if (typeof obj[i] === "object") obj[i] = obj[i]?.id;
    if (obj[i] === null || obj[i] === undefined) delete obj[i];
  }
  return obj;
}

export default detailViewUtilsMixin;
