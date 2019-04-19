<template>

  <!-- FILE -->

  <div class="row">
    <div class="col-sm-12 mb-2">
      <label :for="`files`"
             v-bind:class="{ dragging : isDragging }"
             v-on:dragover.stop.prevent="isDragging = true"
             v-on:dragleave.stop.prevent="isDragging = false"
             v-on:drop.stop.prevent="dropFile"
             class="btn btn-outline-primary btn-block">{{ $t('add.inputs.fileInput') }}
      </label>

      <div class="mt-2 alert alert-warning" v-if="files !== null && files.length >= 10">{{ $t('add.inputs.fileInputMaxError', { num: files.length }) }}</div>

      <!-- TODO: https://github.com/bootstrap-vue/bootstrap-vue/issues/1526, If multiple then accept does not take multiple formats. BUG -->
      <!-- TODO: BUG: If too many files or long filenames then breaks the input design -->
      <b-form-file v-model="files"
                   id="files"
                   :state="filesState"
                   multiple
                   plain
                   style="display: none"
                   ref="fileinput"
                   accept="image/*"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>

      <b-form-text v-if="!filesState">{{ $t('add.errors.files') }}.</b-form-text>

    </div>

    <div class="col-sm-12 mb-2" v-if="recordOptions">
      <label for="photo-upload" class="btn btn-outline-primary p-2 mr-2">
        <font-awesome-icon icon="camera-retro"/> Add photo
      </label>

      <b-form-file v-model="recordedFile" accept="image/*;capture=camera"
                   id="photo-upload"
                   plain
                   style="display: none"
                   ref="fileinput"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>

      <label for="video-upload" class="btn btn-outline-primary  p-2 mr-2">
        <font-awesome-icon icon="video"/> Add video
      </label>
      <b-form-file v-model="recordedFile" accept="video/*;capture=camcorder"
                   id="video-upload"
                   plain
                   style="display: none"
                   ref="fileinput"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>

      <label for="audio-upload" class="btn btn-outline-primary  p-2 mr-2">
        <font-awesome-icon icon="microphone"/> Add audio
      </label>
      <b-form-file v-model="recordedFile" accept="audio/*;capture=microphone"
                   id="audio-upload"
                   plain
                   style="display: none"
                   ref="fileinput"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>
    </div>

    <div class="col-sm-12 mb-2">

      <div class="mt-2" v-if="files !== null && files.length > 0">
        <div class="d-flex flex-row  flex-wrap" v-if="files.length > 0" >
          <div class="mt-2" v-for="(file, key) in files">

            <span v-if="file.type.includes('image')">
              <img style="height: 10rem" onerror="this.style.display='none'" v-bind:ref="'image' + parseInt(key)" class="img-thumbnail thumbnail-preview responsive" alt="Image preview..." />
            </span>

            <span v-else >
               <font-awesome-icon  style="height: 10rem" size="7x" icon="file"></font-awesome-icon>&nbsp;
            </span>

            <div style="width: 12rem; font-size: small"><b>{{ file.name }}</b></div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-12 col-md-6 mb-2">
      <button class="btn btn-outline-danger ml-1" v-if="filesState" :disabled="sendingData" @click="clearFile" :title="$tc('add.buttons.resetFile', 1)">
        <!--<font-awesome-icon icon="trash-alt"/>-->
        <span v-show="files.length === 1">{{ $tc('add.buttons.resetFile', 1) }}</span>
        <span v-show="files.length > 1">{{ $tc('add.buttons.resetFile', 2) }}</span>
      </button>
    </div>

  </div>
</template>

<script>
  import fontAwesomeLib  from './../mixins/fontAwasomeLib'
  import EXIF from 'exif-js'
    export default {
      name: "multimedia-component",
      mixins:[fontAwesomeLib],
      props:{
        recordOptions: {
          type:Boolean
        }
      },
      data() {
        return {
          apiUrl: 'https://rwapi.geocollections.info/',
          loadingPercent: 0,
          sendingData: false,
          files: [],
          fileMetaData: null,
          isDragging: false,
          upload: {},
          recordedFile:[]

        }
      },
      computed: {
        filesState() {
          return this.files !== null && this.files.length > 0
        },
      },
      created(){
        this.$root.$on('attachment-loading-status',this.clearFile)
      },
      watch: {
        'recordedFile':function (newVal) {
          this.files.push(newVal)
        },
        'files': function (newVal) {

          if (newVal.length > 0) {
            for (let i = 0; i < newVal.length; i++){
              if (newVal[i].type.includes('image') || newVal[i].type.includes('video') || newVal[i].type.includes('audio')) {
                let reader = new FileReader();

                reader.onload = (event) => {
                  this.$emit('file-uploaded',this.recordedFile.length > 0 ? this.recordedFile : this.files);

                  // console.log(event.target.result)
                  this.$refs['image' + parseInt(i)][0].src = event.target.result;
                };
                reader.readAsDataURL(this.files[i]);
              }
            }
          }

          if (newVal.length === 1) {
            let fileReader = new FileReader()
            fileReader.readAsArrayBuffer(newVal[0]);
            fileReader.onload = (event) => {
              // TODO: Get thumbnail
              this.fileMetaData = EXIF.readFromBinaryFile(event.target.result)
            }
          }
        },

      },
      methods: {
        clearFile() {
          this.$refs.fileinput.reset();
          this.files=[]
        },
      }
    }
</script>

<style scoped>

</style>
