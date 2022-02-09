import { isPlainObject } from "lodash";
import { fetchDoiUsingEGF } from "@/assets/js/api/apiCalls";

const detailViewUtilsMixin = {
  methods: {
    fillAutocompleteFields(obj) {
      Object.entries(obj).forEach((entry) => {
        if (entry[0] !== "ids") {
          if (isPlainObject(entry[1])) {
            // console.log(entry[0]);
            // If autocomplete field doesn't exist then creates it (better to initialise it in data and remove the creation here)
            if (!this.autocomplete?.[entry[0]])
              this.autocomplete[entry[0]] = [];
            this.autocomplete[entry[0]].push(entry[1]);
          } else if (Array.isArray(entry[1])) {
            this.autocomplete[entry[0]] = entry[1];
          }
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
      // Exception for location / storage naming
      if (module === "location") module = "storage";
      if (module === "sample_series") module = "series";
      Promise.all(
        tables.map((table) => {
          // Exception for library_reference_list, could be fixed better with ids etc. but this is a fast fix
          let urlTable = table;
          if (urlTable === "library_reference_list")
            urlTable = "library_reference";
          return this.$api.rw
            .get(urlTable, {
              defaultParams: {
                [module]: moduleId,
                nest: 1, // Todo: Should drop nest for performance issues
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
            });
        })
      );
    },

    formatDataForUpload(object) {
      let uploadableObject = { ...object };
      uploadableObject = cleanObject(uploadableObject);
      return uploadableObject;
    },

    async reloadData() {
      Object.assign(this.$data, this.setInitialData());
      await this.loadFullInfo();
      if (this.$route.meta.object === "reference") this.loadPDF();
    },

    async loadFullInfo() {
      const module = this.$route.meta.object;

      if (this?.listOfAutocompleteTables)
        this?.loadAutocompleteFields(this.listOfAutocompleteTables);

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);

        const res = await this.$api.rw.getDetail(
          module,
          this.$route.params.id,
          { nest: 1 }
        );

        if (res?.id) {
          this.$emit("object-exists", true);
          this.$set(this, module, res);
          this.fillAutocompleteFields(this[module]);
          this.$emit("data-loaded", this[module]);
        } else this.$emit("object-exists", false);
        this.setLoadingState(false);

        if (this?.relatedTabs?.length > 0)
          this.loadRelatedData(
            this.relatedTabs.map((tab) => tab.name),
            module,
            res.id
          );
      } else if (this.$route.meta.isEGF && !this.$route.meta.isEdit) {
        // DOI special case
        fetchDoiUsingEGF(this.$route.params.id).then((response) => {
          if (response?.data) this.assignEgfFieldsToDoiObject(response?.data);
          else
            this.toastError({
              text: `Couldn't fetch <b>Fond</b> with an ID: <b>${this.$route.params.id}</b>`,
            });
        });
      }
    },

    // RELATED DATA
    async addRelatedItem(payload, connectionField = null) {
      let table = payload.table;
      if (table === "taxon_subclass") table = "taxon";

      let url = `${table}`;
      let formData = new FormData();
      let uploadableObject = this.formatDataForUpload(payload.item);

      let mainObjectKey = this.$route.meta.object;
      if (connectionField) mainObjectKey = connectionField;
      if (payload.table === "taxon_subclass" && table === "taxon") {
        mainObjectKey = "parent";
        uploadableObject.taxon = payload.rawItem.taxon;
      }

      uploadableObject[mainObjectKey] = this[this.$route.meta.object].id;

      Object.keys(uploadableObject).forEach((key) =>
        formData.set(key, uploadableObject[key])
      );

      const response = await this.$api.rw.post(url, formData);

      if (response?.id && this?.[this.$route.meta.object]?.id) {
        this.loadRelatedData(
          [table],
          this.$route.meta.object,
          this[this.$route.meta.object].id
        );
      }
    },

    async editRelatedItem(payload) {
      console.log(payload);
      let table = payload.table;
      if (table === "taxon_subclass") table = "taxon";

      let formData = new FormData();
      let uploadableObject = this.formatDataForUpload(payload.item);
      delete uploadableObject.id;

      if (payload.table === "taxon_subclass" && table === "taxon") {
        uploadableObject.parent = this[this.$route.meta.object].id;
        uploadableObject.taxon = payload.rawItem.taxon;
      } else {
        uploadableObject[this.$route.meta.object] =
          this[this.$route.meta.object].id;
      }

      Object.keys(uploadableObject).forEach((key) =>
        formData.set(key, uploadableObject[key])
      );

      const response = await this.$api.rw.put(table, payload.item.id, formData);

      if (response?.id && this?.[this.$route.meta.object]?.id) {
        this.loadRelatedData(
          [table],
          this.$route.meta.object,
          this[this.$route.meta.object].id
        );
      }
    },

    async deleteRelatedItem(payload) {
      console.log(payload);
      let table = payload.table;

      const response = await this.$api.rw.delete(table, payload.item.id);

      if (response && this?.[this.$route.meta.object]?.id) {
        this.loadRelatedData(
          [table],
          this.$route.meta.object,
          this[this.$route.meta.object].id
        );
      }
    },
  },

  watch: {
    "$route.params.id"() {
      this.reloadData();
    },
    "relatedData.searchParameters": {
      handler: function () {
        if (this.$route.meta.isEdit && this?.activeTab) {
          this.loadRelatedData(
            [this.activeTab],
            this.$route.meta.object,
            this[this.$route.meta.object].id
          );
        }
      },
      deep: true,
    },
  },
};

function cleanObject(obj) {
  for (let i in obj) {
    // if (typeof obj[i] === "object") obj[i] = obj[i]?.id;
    if (isPlainObject(obj[i])) obj[i] = obj[i]?.id;
    else if (Array.isArray(obj[i]) && obj[i].length > 0)
      obj[i] = obj[i].map((item) => item.id);
    if (
      obj[i] === null ||
      obj[i] === undefined ||
      (Array.isArray(obj[i]) && obj[i].length === 0)
    )
      delete obj[i];
  }
  console.log(obj);
  return obj;
}

export default detailViewUtilsMixin;
