<template>
  <div>
    <b-dropdown variant="primary">
      <template slot="button-content">
        Export <i class="fas fa-file-export"></i>
      </template>

      <b-dropdown-item @click="exportTableByType('xlsx')"
        >Export to XLSX &nbsp;<i class="far fa-file-excel"></i
      ></b-dropdown-item>

      <b-dropdown-item @click="exportTableByType('csv')"
        >Export to CSV &nbsp;<i class="far fa-file"></i
      ></b-dropdown-item>

      <b-dropdown-item
        v-if="filename === 'reference'"
        @click="exportTableToRIS()"
        >Export to RIS &nbsp;<i class="fas fa-file-download"></i
      ></b-dropdown-item>

      <b-dropdown-item @click="copyToClipboard()"
        >Copy to Clipboard &nbsp;<i class="far fa-copy"></i
      ></b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import { toastSuccess } from "@/assets/js/iziToast/iziToast";
import TableExport from "tableexport";
import { toastError } from "../../../assets/js/iziToast/iziToast";

export default {
  props: {
    filename: {
      type: String,
      default: "Geocollections Data Management"
    },
    tableId: {
      type: String,
      default: "export-table"
    },
    tableData: {
      type: Array
    }
  },
  name: "ExportButtons",

  data() {
    return {
      table: this.tableId
    };
  },

  created: function() {
    if (typeof this.table === "undefined") {
      this.table = "export-table";
    }
  },

  methods: {
    exportTableByType(type) {
      /* Defaults */
      // TableExport(document.getElementsByTagName("table"), {
      //   headers: true,                      // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
      //   footers: true,                      // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
      //   formats: ["xlsx", "csv", "txt"],    // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
      //   filename: "id",                     // (id, String), filename for the downloaded file, (default: 'id')
      //   bootstrap: false,                   // (Boolean), style buttons using bootstrap, (default: true)
      //   exportButtons: true,                // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
      //   position: "bottom",                 // (top, bottom), position of the caption element relative to table, (default: 'bottom')
      //   ignoreRows: null,                   // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
      //   ignoreCols: null,                   // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
      //   trimWhitespace: true,               // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
      //   RTL: false,                         // (Boolean), set direction of the worksheet to right-to-left (default: false)
      //   sheetname: "id"                     // (id, String), sheet name for the exported spreadsheet, (default: 'id')
      // });

      let instance = new TableExport(document.getElementsByTagName("table"), {
        formats: [type],
        exportButtons: false,
        filename: this.filename,
        trimWhiteSpace: true
      });

      let exportTable = instance.getExportData()[this.table][type];

      instance.export2file(
        exportTable.data,
        exportTable.mimeType,
        exportTable.filename,
        exportTable.fileExtension
      );

      toastSuccess({
        text: "Exported to <strong>" + type.toUpperCase() + "</strong>"
      });
    },

    copyToClipboard() {
      const el = document.getElementById(this.table);
      let body = document.body,
        range,
        sel;
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

      toastSuccess({ text: "Copied to <strong>clipboard!</strong>" });
    },

    exportTableToRIS() {
      let risString = this.convertJsonToRis(this.tableData);

      if (risString.length === 0) {
        toastError({ text: "Download failed: Not enough data!" });
        return;
      }

      let file = new Blob([risString], { type: "text/plain" });

      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, this.filename + ".ris");
      else {
        // Others
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = this.filename + ".ris";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }

      toastSuccess({ text: "Exported to <strong>RIS</strong>" });
    },

    convertJsonToRis(jsonArray) {
      let risString = "";

      if (jsonArray && jsonArray.length > 0) {
        jsonArray.forEach(item => {
          // Only write to string if type exists
          if (item.type && item.type__ris_type) {
            risString += "TY  - " + item.type__ris_type + "\n";

            // Todo: Add certain fields to certain types --> if (item.type__ris_type === 'JOUR') {} etc.

            if (item.title) risString += "TI  - " + item.title.trim() + "\n";

            if (item.author) {
              if (item.author.includes(".,")) {
                // Multiple authors
                item.author.split(".,").forEach(author => {
                  if (author.charAt(author.length - 1) === ".")
                    risString += "AU  - " + author.trim() + "\n";
                  else risString += "AU  - " + author.trim() + ".\n";
                });
              } else if (item.author.includes("&")) {
                item.author
                  .split("&")
                  .forEach(
                    author => (risString += "AU  - " + author.trim() + "\n")
                  );
              } else risString += "AU  - " + item.author.trim() + "\n";
            }

            if (item.year) risString += "PY  - " + item.year.trim() + "\n";

            if (
              item.journal &&
              item.journal__journal_name &&
              item.type__ris_type === "JOUR"
            ) {
              risString += "T2  - " + item.journal__journal_name.trim() + "\n";
              risString += "JO  - " + item.journal__journal_name.trim() + "\n";
            }

            if (item.volume) risString += "VL  - " + item.volume.trim() + "\n";

            if (item.number) risString += "IS  - " + item.number.trim() + "\n";

            if (item.pages) {
              if (item.pages.includes("-")) {
                let startAndEndPage = item.pages.split("-");
                if (startAndEndPage[0])
                  risString += "SP  - " + startAndEndPage[0].trim() + "\n";
                if (startAndEndPage[1])
                  risString += "EP  - " + startAndEndPage[1].trim() + "\n";
              }
            }

            if (item.language && item.language__iso1)
              risString += "LA  - " + item.language__iso1.trim() + "\n";

            if (item.doi) risString += "DO  - " + item.doi.trim() + "\n";

            if (item.url) risString += "UR  - " + item.url.trim() + "\n";

            if (item.author_keywords) {
              if (item.author_keywords.includes(","))
                item.author_keywords
                  .split(",")
                  .forEach(
                    keyword => (risString += "KW  - " + keyword.trim() + "\n")
                  );
              else risString += "KW  - " + item.author_keywords.trim() + "\n";
            }

            if (item.abstract)
              risString += "AB  - " + item.abstract.trim() + "\n";
            risString += "ER  - \n";
          }
        });
      }
      return risString;
    }
  }
};
</script>

<style scoped></style>
