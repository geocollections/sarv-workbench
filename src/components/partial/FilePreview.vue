<template>
  <div class="file-preview d-flex flex-column justify-content-center align-items-center h-100" v-if="data">

    <div class="align-self-center my-2">

      <!-- AUDIO -->
      <audio v-if="isAudioFile" controls>
        <source :src="getFileLink({filename: data.uuid_filename})" :type="data.attachment_format__value">
        Your browser does not support the audio element.
        <i class="far fa-file-audio fa-5x"></i>
      </audio>

      <!-- VIDEO -->
      <video v-else-if="isVideoFile"
             type="video" controls>
        <source :src="getFileLink({filename: data.uuid_filename})" :type="data.attachment_format__value">
        Your browser does not support the video element.
        <i class="far fa-file-video fa-5x"></i>
      </video>

      <!-- IMAGE -->
      <img v-else-if="isImageFile"
           :src="getFileLink({filename: data.uuid_filename})"
           @click="openUrlInNewWindow({url: getFileLink({filename: data.uuid_filename})})"
           alt="Image preview..."
           class="img-thumbnail image"/>

      <!-- IF ABOVE FAILS THEN SHOW FILE ICON -->
      <i v-else class="far fa-5x link"
         @click="openUrlInNewWindow({url: getFileLink({filename: data.uuid_filename})})"
         :title="getFileLink({filename: data.uuid_filename})"
         :class="getAttachmentIcon(data)"></i>

    </div>

    <div class="align-self-end" v-if="isAudioFile || isVideoFile">
      <div class="btn btn-outline-primary btn-sm link"
           @click="openUrlInNewWindow({url: getFileLink({filename: data.uuid_filename})})"
           :title="getFileLink({filename: data.uuid_filename})">
        <i class="fas fa-external-link-alt"></i>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      data: {
        required: true
      }
    },
    name: "FilePreview",
    computed: {
      isAudioFile() {
        return !!(this.data.attachment_format__value && this.data.attachment_format__value.includes('audio'));
      },

      isVideoFile() {
        if (this.data.attachment_format__value) {
           return !!this.data.attachment_format__value.includes('video');
        } else {
          // As of 18.09.2019 total of 1508 attachments are without attachment_format__value and only 1 is webm
          return !!this.data.uuid_filename.split('.')[1].includes('webm');
        }
      },

      isImageFile() {
        if (this.data.attachment_format__value) {
          return !!this.data.attachment_format__value.includes('image');
        } else {
          let fileType = this.data.uuid_filename.split('.')[1];
          // As of 18.09.2019 total of 1508 attachments are without attachment_format__value which 859 are jpg and 2 png
          return !!(fileType.includes('jpg') || fileType.includes('png'));
        }
      }
    },
    methods: {
      getAttachmentIcon(attachment) {
        if (attachment.attachment_format__value) {
          let fileType = attachment.attachment_format__value;
          if (fileType.includes('application')) {
            if (fileType.includes('docx')) return 'fa-file-word';
            else if (fileType.includes('pdf')) return 'fa-file-pdf';
            else if (fileType.includes('xlsx') || fileType.includes('ods')) return 'fa-file-excel';
            else if (fileType.includes('zip')) return 'fa-file-archive';
            else return 'fa-file'
          } else if (fileType.includes('audio')) return 'fa-file-audio';
          else if (fileType.includes('image')) return 'fa-file-image';
          else if (fileType.includes('text')) return 'fa-file-alt';
          else if (fileType.includes('video')) return 'fa-file-video';
          else return 'fa-file'
        } else {
          let fileType = attachment.uuid_filename.split('.')[1];
          // As of 18.09.2019 total of 1508 attachments are without attachment_format__value
          if (fileType.includes('jpg') || fileType.includes('png')) return 'fa-file-image'; // 859 jpg and 2 png
          else if (fileType.includes('pdf')) return 'fa-file-pdf'; // 635 pdf
          else if (fileType.includes('xls') || fileType.includes('ods')) return 'fa-file-excel'; // 4 xls and 2 ods
          else if (fileType.includes('txt')) return 'fa-file-alt'; // 1 txt
          else if (fileType.includes('webm')) return 'fa-file-video'; // 1 webm
          else return 'fa-file'; // 4 hz1
        }
      },

      getFileLink(params) {
        if (params.size) {
          return 'https://files.geocollections.info/' + params.size
            + '/' + params.filename.substring(0, 2)
            + '/' + params.filename.substring(2, 4)
            + '/' + params.filename;
        } else {
          return 'https://files.geocollections.info/' + params.filename.substring(0, 2)
            + '/' + params.filename.substring(2, 4)
            + '/' + params.filename;
        }
      },

      openUrlInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        if (typeof (params.height) === 'undefined') {
          params.height = 750;
        }
        window.open(params.url, '', 'width=' + params.width + ',height=' + params.height);
      },
    }
  }
</script>

<style scoped>
  video {
    max-width: 100%;
    vertical-align: middle;
  }

  .link:hover {
    cursor: pointer;
  }
</style>
