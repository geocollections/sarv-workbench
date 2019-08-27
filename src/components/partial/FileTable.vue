<template>
  <div class="d-flex flex-wrap justify-content-around align-items-center">

    <div class="align-self-center mx-3 mb-3" v-for="(file, key) in attachments" :key="file.id">

      <!-- FILES -->
      <div class="file-container" :title="composeFileUrl(file[prefix + 'uuid_filename'], 'original')">

        <!-- AUDIO -->
        <audio v-if="file[prefix + 'uuid_filename'] !== null && ['mp3','wav'].indexOf(file[prefix + 'uuid_filename'].split('.')[1]) > -1" controls>
          <source :src="composeFileUrl(file[prefix + 'uuid_filename'], 'original')" :type="file.attachment_format__value">
          Your browser does not support the audio element.
          <font-awesome-icon @click="openUrlInNewWindow({url: composeFileUrl(file[prefix + 'uuid_filename'], 'original')})"
                             style="max-height: 5rem" size="7x" icon="file-audio"/>
        </audio>

        <!-- VIDEO -->
        <video v-else-if="file[prefix + 'uuid_filename'] !== null && ['mp4'].indexOf(file[prefix + 'uuid_filename'].split('.')[1]) > -1"
               type="video" style="max-height: 12rem" controls>
          <source :src="composeFileUrl(file[prefix + 'uuid_filename'], 'original')" :type="file.attachment_format__value">
          Your browser does not support the video element.
          <font-awesome-icon @click="openUrlInNewWindow({url: composeFileUrl(file[prefix + 'uuid_filename'], 'original')})"
                             style="max-height: 5rem" size="7x" icon="file-video"/>
        </video>

        <!-- IMAGE -->
        <img v-else-if="file[prefix + 'uuid_filename'] !== null && ['png','jpeg','jpg'].indexOf(file[prefix + 'uuid_filename'].split('.')[1]) > -1"
             @click="openUrlInNewWindow({url: composeFileUrl(file[prefix + 'uuid_filename'], 'original')})"
             :src="composeFileUrl(file[prefix + 'uuid_filename'])"
             alt="Image preview..."
             class="img-thumbnail image"/>

        <!-- IF ABOVE FAILS THEN SHOW FILE ICON -->
        <font-awesome-icon v-else size="5x" icon="file"/>

        <div class="middle">
          <div class="hover-text-box">
            <div>{{file[prefix + 'original_filename']}}</div>
          </div>
        </div>

      </div>

      <!-- BUTTONS -->
      <div class="my-1">
        <div class="text-center py-1">
          <b-button squared
                    class="p-0 px-4 mr-1"
                    size="sm"
                    variant="info"
                    title="View file in Geocollections.info"
                    @click="openGeoInNewWindow({ object: 'file', id: file[tableId] })">
            <font-awesome-icon icon="eye"/>
          </b-button>

          <b-button squared
                    class="p-0 px-4 mr-1"
                    size="sm"
                    variant="primary"
                    title="Open file detail view"
                    @click="windowOpenNewTab('attachment','/attachment/'+file[tableId])">
            <font-awesome-icon icon="external-link-alt"/>
          </b-button>
        </div>
      </div>

    </div>

  </div>

</template>

<script>
  import formManipulation from '../../mixins/formManipulation'

  export default {
    name: "FileTable",
    props: {
      attachments: {
        type: Array,
        required: true
      },
      object: {
        type: String,
        required: true
      },
      prefix: {
        type: String,
        default: ''
      },
      tableId: {
        type: String,
        default: 'id'
      }
    },
    mixins: [formManipulation],
  }
</script>

<style scoped>
  .image {
    max-height: 12rem;
    -webkit-transition: .2s ease;
    transition: .2s ease;
  }

  .middle {
    opacity: 0;
    -webkit-transition: opacity .2s ease;
    transition: opacity .2s ease;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
  }

  .file-container {
    position: relative;
    cursor: pointer;
    text-align: center;
  }

  .file-container > .icon {
    text-align: center;
  }

  .file-container:hover .image {
    opacity: 0.5;
  }

  .file-container:hover .middle {
    opacity: 1;
  }

  .hover-text-box {
    background-color:#5e676a;
    color:white;
    width: 20vh;
    margin: auto;
    text-align: center;
    font-size: 12px;
    word-wrap: break-word;
  }
</style>
