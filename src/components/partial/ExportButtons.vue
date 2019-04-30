<template>
  <div>
    <b-dropdown variant="primary">
      <template slot="button-content">
        Export <font-awesome-icon icon="file-export" />
      </template>

      <b-dropdown-item @click="exportTableByType('xlsx')">Export to XLSX &nbsp;<font-awesome-icon :icon="['far', 'file-excel']" /></b-dropdown-item>

      <b-dropdown-item @click="exportTableByType('csv')">Export to CSV &nbsp;<font-awesome-icon :icon="['far', 'file']" /></b-dropdown-item>

      <b-dropdown-item @click="copyToClipboard()" >Copy to Clipboard &nbsp;<font-awesome-icon :icon="['far', 'copy']" /></b-dropdown-item>

    </b-dropdown>
  </div>
</template>

<script>
  import { toastSuccess } from "@/assets/js/iziToast/iziToast";
  import TableExport from 'tableexport'
  import fontAwesomeLib from "../mixins/fontAwasomeLib";

  export default {
    // components: {
    //   FontAwesomeIcon,
    // },
    props: {
      filename: {
        type: String,
        default: 'Geocollections Data Management'
      },
      tableId: {
        type: String,
        default: 'export-table'
      }
    },
    name: "ExportButtons",
    mixins: [fontAwesomeLib],

    data() {
      return {
        table: this.tableId
      }
    },

    created: function () {
      if (typeof(this.table) === 'undefined') {
        this.table = 'export-table'
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

        instance.export2file(exportTable.data, exportTable.mimeType, exportTable.filename, exportTable.fileExtension)

        toastSuccess({text: 'Exported to <strong>' + type.toUpperCase() + '</strong>'});
      },

      copyToClipboard() {
        const el = document.getElementById(this.table);
        let body = document.body, range, sel;
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
        document.execCommand('Copy');
        sel.removeAllRanges();

        toastSuccess({text: 'Copied to <strong>clipboard!</strong>'});
      },
    }
  }
</script>

<style scoped>

</style>
