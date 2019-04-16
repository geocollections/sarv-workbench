<template>
  <div class="col-sm-12 p-0 ">
    <div class="d-flex flex-row flex-wrap mt-2">
      <div class="mt-2 mr-2" v-for="(file, key) in attachments"  style="align-self: flex-end;">
        <div class="img-container p-1">
          <font-awesome-icon v-if="file.uuid_filename !== null && ['mp3','wav'].indexOf(file.uuid_filename.split('.')[1]) > -1"  style="max-height: 5rem" size="7x" icon="file-audio"/>
          <font-awesome-icon v-else-if="file.uuid_filename !== null && ['mp4'].indexOf(file.uuid_filename.split('.')[1]) > -1"  style="max-height: 5rem" size="7x" icon="file-video"/>
          <img v-else-if="file.uuid_filename !== null && ['png','jpeg','jpg'].indexOf(file.uuid_filename.split('.')[1]) > -1" :src="composeFileUrl(file.uuid_filename)" alt="Image preview..." class="img-thumbnail thumbnail-preview responsive image">
          <font-awesome-icon v-else="file.uuid_filename === null"  style="max-height: 5rem" size="7x" icon="file"/>
          <div class="middle flex flex-inline">
            <!--<button class="btn btn-danger mb-2 btn-sm" @click="$parent.removeAttachmentRelation(key)"><font-awesome-icon icon="trash-alt"/></button>-->
            <div style="background-color:#5e676a;color:white; width: 20vh">
              <span style="font-size: small;word-wrap: break-word;">{{file.original_filename}}
                <!--{{file.date_created}}<br/>{{file.author__agent}}-->
              </span>
            </div>

          </div>

        </div>
        <div class="mt-1 pb-1" style="width: 25vh;min-height:5vh"><!--background-color:#056384;color:white;-->
          <!--<div style="font-size: small;word-wrap: break-word;">{{file.original_filename}}</div>-->
          <div class="p-0 pt-1 pb-1" style="text-align: center;">
            <button class="btn btn-info mr-1 p-0 pr-4 pl-4  btn-sm no-rounded-btn" @click="openGeoInNewWindow({object:'file',id:file.id})"><font-awesome-icon icon="eye"/></button>
            <button class="btn btn-primary p-0 pr-4 pl-4 btn-sm no-rounded-btn"  @click="windowOpenNewTab('attachment','/attachment/'+file.id)"><font-awesome-icon icon="external-link-alt"/></button>
          </div>
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
        },
        object: {
          type: String,
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
    text-align: center!important;
  }

  .image {
    opacity: 1;
    display: block;
    /*width: 100%;*/
    max-height: 12rem;

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

  .no-rounded-btn{
    border-radius: 0 !important;
  }
</style>
