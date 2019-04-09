<template>
  <div class="col-sm-12 p-0 ">
    <div class="d-flex flex-row flex-wrap mt-2">
      <div class="mt-2 mr-1" v-for="(file, key) in attachments"  style="align-self: flex-end;">
        <div class="img-container p-1">
          <font-awesome-icon v-if="file.uuid_filename !== null && ['mp3','wav'].indexOf(file.uuid_filename.split('.')[1]) > -1"  style="max-height: 5rem" size="7x" icon="file-audio"/>
          <font-awesome-icon v-else-if="file.uuid_filename !== null && ['mp4'].indexOf(file.uuid_filename.split('.')[1]) > -1"  style="max-height: 5rem" size="7x" icon="file-video"/>
          <img v-else-if="file.uuid_filename !== null && ['png','jpeg','jpg'].indexOf(file.uuid_filename.split('.')[1]) > -1" :src="composeFileUrl(file.uuid_filename)" alt="Image preview..." class="img-thumbnail thumbnail-preview responsive image" style="max-height: 12rem">
          <font-awesome-icon v-else="file.uuid_filename === null"  style="max-height: 5rem" size="7x" icon="file"/>
          <div class="middle flex flex-inline">
            <button class="btn btn-primary mb-2 mr-1 btn-sm"  @click="windowOpenNewTab('attachment','/attachment/'+file.id)"><font-awesome-icon icon="external-link-alt"/></button>
            <button class="btn btn-danger mb-2 btn-sm" @click="removeAttachmentRelation(file)"><font-awesome-icon icon="trash-alt"/></button>
            <div style="background-color:#5e676a;color:white; width: 20vh">
              <span style="font-size: small">{{file.date_created}}<br/>{{file.author__agent}}</span>
            </div>

          </div>

        </div>
        <div class="mt-1 p-1" style="background-color:#056384;color:white; width: 25vh;min-height:10vh">
          <span style="font-size: small;word-wrap: break-word;">{{file.original_filename}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import formManipulation  from './../mixins/formManipulation'
    export default {
      name: "FileTable",
      props: {
        attachments: {
          type: Array,
          required: true
        }
      },
      mixins: [formManipulation]

    }
</script>

<style scoped>

  .img-container {
    position: relative;
    width: 25vh;
    text-align: center;
  }

  .image {
    opacity: 1;
    display: block;
    width: 100%;
    height: auto;
    transition: .2s ease;
    backface-visibility: hidden;
  }

  .middle {
    transition: .2s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
  }

  .img-container:hover .image {
    opacity: 0.3;
  }

  .img-container:hover .middle {
    opacity: 1;
  }
</style>
