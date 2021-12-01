import XLSX from "xlsx";

export default {
  methods: {
    filterItemsByKeys(items, keys) {
      const filteredItems = items.map((item) => {
        const res = {};

        Object.keys(item).forEach((key) => {
          if (keys.includes(key)) {
            res[key] = item[key];
          }
        });
        return res;
      });
      return filteredItems;
    },
    removeSortIndicators(table) {
      const tableCopy = table.cloneNode(true);
      const sortIndicators = tableCopy.querySelectorAll(
        "thead > tr > th > .v-data-table-header__sort-badge"
      );
      sortIndicators.forEach((indicator) => {
        indicator.parentElement.removeChild(indicator);
      });
      return tableCopy;
    },
    createWorkbook(table) {
      const tableCopy = this.removeSortIndicators(table);
      const wb = XLSX.utils.table_to_book(tableCopy);
      return wb;
    },
    handleExportCsv() {
      try {
        const wb = this.createWorkbook(document.querySelector("#table table"));

        XLSX.writeFile(wb, "GeoCASe.csv", { bookType: "csv" });
        this.toastSuccess({
          text: this.$t("search.export.exportSuccessful", { type: "CSV" }),
        });
      } catch (err) {
        console.error(err);
        this.toastError({ text: this.$t("search.export.downloadFailed") });
      }
    },
    handleExportExcel() {
      try {
        const wb = this.createWorkbook(document.querySelector("#table table"));

        XLSX.writeFile(wb, "GeoCASe.xlsx", { bookType: "xlsx" });
        this.toastSuccess({
          text: this.$t("search.export.exportSuccessful", { type: "XLSX" }),
        });
      } catch (err) {
        console.error(err);
        this.toastError({ text: this.$t("search.export.downloadFailed") });
      }
    },
    handleClipboard() {
      const el = document
        .getElementById("table")
        .getElementsByTagName("table")[0];

      const body = document.body;
      let range;
      let sel;
      if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
          range.selectNodeContents(el);
          sel.addRange(range);
        } catch (e) {
          range.selectNode(el);
          sel.addRange(range);
        }
      } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
      }
      document.execCommand("Copy");
      sel.removeAllRanges();

      this.toastSuccess({ text: this.$t("search.export.copySuccessful") });
    },
  },
};
