<template>
  <div id="editor">
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
    ></ckeditor>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import BalloonToolbar from "@ckeditor/ckeditor5-ui/src/toolbar/balloon/balloontoolbar";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";

import Heading from "@ckeditor/ckeditor5-heading/src/heading";

import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Blockquote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import List from "@ckeditor/ckeditor5-list/src/list";

import FontSize from "@ckeditor/ckeditor5-font/src/fontsize";
import FontFamily from "@ckeditor/ckeditor5-font/src/fontfamily";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor";

import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";

import Link from "@ckeditor/ckeditor5-link/src/link";

// import Image from '@ckeditor/ckeditor5-image/src/image'; // Todo: Error (https://github.com/ckeditor/ckeditor5-vue/issues/72)
// import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
// import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'; // Todo: Error (https://github.com/ckeditor/ckeditor5-vue/issues/72)
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'; // Todo: Error (https://github.com/ckeditor/ckeditor5-vue/issues/72)
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/base64uploadadapter'; // Todo: Error (https://github.com/ckeditor/ckeditor5-vue/issues/72)

import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";

// import Table from '@ckeditor/ckeditor5-table/src/table'; // Todo: Error (https://github.com/ckeditor/ckeditor5-vue/issues/72)
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";

export default {
  props: {
    data: {
      type: String,
      default: "<p></p>"
    }
  },
  name: "Editor",
  computed: {
    editorData: {
      get() {
        if (this.data && this.data.length > 0) return this.data;
        else return "<p></p>";
      },

      set(value) {
        if (value && value.length > 0) this.$emit("update:data", value);
        else this.$emit("update:data", "<p></p>");
      }
    }
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        plugins: [
          Essentials,
          Paragraph,
          Autoformat,
          PasteFromOffice,
          Bold,
          Code,
          Italic,
          Strikethrough,
          Subscript,
          Superscript,
          Underline,
          Blockquote,
          List,
          FontSize,
          FontFamily,
          FontColor,
          FontBackgroundColor,
          Heading,
          Alignment,
          Link,
          // Image,
          // ImageToolbar,
          ImageCaption,
          // ImageStyle,
          // ImageUpload,
          MediaEmbed,
          // Table,
          TableToolbar,
          BalloonToolbar
          // Base64UploadAdapter
        ],

        balloonToolbar: {
          items: [
            "bold",
            "italic",
            // 'underline',
            // 'strikethrough',
            "subscript",
            "superscript",
            "blockquote",
            "bulletedList",
            "numberedList",
            "|",
            "link",
            // 'imageUpload',
            "|",
            "undo",
            "redo"
          ]
        },

        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph"
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1"
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2"
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3"
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4"
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5"
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6"
            }
          ]
        },

        fontFamily: {
          options: [
            "default",
            "Ubuntu, Arial, sans-serif",
            "Ubuntu Mono, Courier New, Courier, monospace"
          ]
        },

        fontSize: {
          options: ["tiny", "default", "big"]
        },

        alignment: {
          options: ["left", "right", "center", "justify"]
        },

        // image: {
        //   toolbar: [ 'imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
        //   styles: [
        //     'full',
        //     'alignLeft',
        //     'alignCenter',
        //     'alignRight'
        //   ]
        // },

        // table: {
        //   contentToolbar: [
        //     'tableColumn',
        //     'tableRow',
        //     'mergeTableCells'
        //   ]
        // },

        toolbar: {
          items: [
            "bold",
            "italic",
            // 'underline',
            // 'strikethrough',
            // 'subscript',
            // 'superscript',
            // 'blockquote',
            "bulletedList",
            "numberedList",
            "|",
            "link",
            // 'imageUpload',
            "|",
            "undo",
            "redo"
          ]
          // items: [
          //   'heading',
          //   '|',
          //   'bold',
          //   'italic',
          //   'underline',
          //   'strikethrough',
          //   'subscript',
          //   'superscript',
          //   'code',
          //   'blockquote',
          //   'bulletedList',
          //   'numberedList',
          //   '|',
          //   'fontFamily',
          //   'fontSize',
          //   'fontColor',
          //   'fontBackgroundColor',
          //   // 'bulletedList',
          //   // 'numberedList',
          //   '|',
          //   'alignment',
          //   '|',
          //   'link',
          //   // 'imageUpload',
          //   'mediaEmbed',
          //   '|',
          //   'undo',
          //   'redo',
          // ]
        }
      }
    };
  }
};
</script>

<style>
body {
  overflow-x: hidden;
}

.ck-balloon-panel {
  z-index: 41000 !important;
}
</style>
