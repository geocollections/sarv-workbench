<template>

  <!-- FILE -->

  <div class="row">
    <div class="col-sm-12 mb-2">
      <label :for="`files`"
             v-bind:class="isDragging ? 'dragging upload-icon py-3' : 'py-4'"
             v-on:dragover.stop.prevent="isDragging = true"
             v-on:dragleave.stop.prevent="isDragging = false"
             v-on:drop.stop.prevent="dropFile"
             class="d-flex justify-content-center align-items-center file-upload">
        <span :class="{ 'hide-text': isDragging }">
          {{ $t('add.inputs.fileInput') }}
        </span>
      </label>

      <div class="mt-2 alert alert-warning" v-if="files !== null && files.length >= 10">{{ $t('add.inputs.fileInputMaxError', { num: files.length }) }}</div>

      <!-- TODO: https://github.com/bootstrap-vue/bootstrap-vue/issues/1526, If multiple then accept does not take multiple formats. BUG -->
      <!-- TODO: BUG: If too many files or long filenames then breaks the input design -->
      <b-form-file v-model="files"
                   id="files"
                   :state="filesState"
                   :multiple="acceptMultiple"
                   plain
                   style="display: none"
                   ref="fileinput"
                   :accept="acceptableFormat"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>

      <b-form-text v-if="!filesState">
        <div v-if="acceptMultiple">{{ $t('add.errors.files') }}.</div>
        <div v-else>{{ $t('add.errors.files2') }}.</div>
      </b-form-text>

    </div>

    <div class="col-sm-12 mb-2 record-options" v-if="recordOptions">
      <label :for="`photo-upload`" class="btn btn-outline-primary p-2 mr-2">
        <font-awesome-icon icon="camera-retro"/> {{ $t('add.inputs.photoInput') }}
      </label>

      <b-form-file v-model="recordedFile" accept="image/*;capture=camera"
                   id="photo-upload"
                   plain
                   style="display: none"
                   ref="fileinput"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>

      <label :for="`video-upload`" class="btn btn-outline-primary p-2 mr-2">
        <font-awesome-icon icon="video"/> {{ $t('add.inputs.videoInput') }}
      </label>
      <b-form-file v-model="recordedFile" accept="video/*;capture=camcorder"
                   id="video-upload"
                   plain
                   style="display: none"
                   ref="fileinput"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>

      <label :for="`audio-upload`" class="btn btn-outline-primary p-2 mr-2">
        <font-awesome-icon icon="microphone"/> {{ $t('add.inputs.audioInput') }}
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

      <div class="mt-2" v-if="files !== null && arrayOfFiles.length > 0">
        <div class="d-flex flex-row  flex-wrap" v-if="arrayOfFiles.length > 0" >
          <div class="mt-2" v-for="(file, key) in arrayOfFiles">

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
        <span v-show="arrayOfFiles.length === 1">{{ $tc('add.buttons.resetFile', 1) }}</span>
        <span v-show="arrayOfFiles.length > 1">{{ $tc('add.buttons.resetFile', 2) }}</span>
      </button>
    </div>

  </div>
</template>

<script>
  import fontAwesomeLib  from '../../mixins/fontAwasomeLib'
  import EXIF from 'exif-js'
  import {toastError, toastInfo} from "../../assets/js/iziToast/iziToast";
    export default {
      name: "multimedia-component",
      mixins:[fontAwesomeLib],
      props:{
        recordOptions: {
          type:Boolean
        },
        acceptableFormat: {
          type: String,
          default: 'image/*'
        },
        acceptMultiple: {
          type: Boolean,
          default: true
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
          recordedFile:[],
          arrayOfFiles: []

        }
      },
      computed: {
        filesState() {
          return this.files !== null && this.arrayOfFiles.length > 0
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

          this.arrayOfFiles = []
          if (Array.isArray(newVal)) {
            this.arrayOfFiles = newVal
          } else {
            // Adding File object to array
            // because for single file upload only File object is returned
            if (newVal !== null) { // null check because 'cancel' returns null for single upload
              this.arrayOfFiles.push(newVal)
            }
          }

          if (this.arrayOfFiles.length > 0) {
            for (let i = 0; i < this.arrayOfFiles.length; i++){
              console.log(this.arrayOfFiles[i])
              if (this.arrayOfFiles[i].type.includes('image') || this.arrayOfFiles[i].type.includes('video') || this.arrayOfFiles[i].type.includes('audio')) {
                let reader = new FileReader();

                reader.onload = (event) => {
                  this.$emit('file-uploaded',this.recordedFile.length > 0 ? this.recordedFile : this.arrayOfFiles);

                  // console.log(event.target.result)
                  this.$refs['image' + parseInt(i)][0].src = event.target.result;
                };
                reader.readAsDataURL(this.files[i]);
              } else if (this.arrayOfFiles[i].type.includes('pdf')) {
                this.$emit('file-uploaded',this.recordedFile.length > 0 ? this.recordedFile : this.arrayOfFiles);
              }
            }
          }

          if (this.arrayOfFiles.length === 1) {
            let fileReader = new FileReader()
            fileReader.readAsArrayBuffer(this.arrayOfFiles[0]);
            fileReader.onload = (event) => {
              // TODO: Get thumbnail
              this.fileMetaData = EXIF.readFromBinaryFile(event.target.result)
            }
          }
        },

      },
      methods: {
        clearFile() {
          if(this.$refs.fileinput)
            this.$refs.fileinput.reset();
          this.files=[]
        },

        dropFile(event) {
          let files = []
          for (let i = 0; i < event.dataTransfer.files.length; i++) {
            // TODO: Make type checking more efficient, it's not perfect atm.
            console.log(event.dataTransfer.files[i])
            let fileType = event.dataTransfer.files[i].type.split('/')[0]

            if (this.acceptMultiple) {
              // Type check
              // Todo: Fix that check!!!
              if (this.acceptableFormat.includes(fileType)) {
                files.push(event.dataTransfer.files[i])
              } else {
                toastError({text: this.$t('messages.validFileFormatUniversal', { file: event.dataTransfer.files[i].name })})
                toastInfo({text: this.$t('messages.useCorrectFormat', { format: this.acceptableFormat }), timeout: 5000})
                break;
              }
            } else {
              // Length check
              if (event.dataTransfer.files.length > 1) {
                toastError({ text: this.$t('messages.onlyOneFile') })
                break;
              } else {
                // Type check
                if (this.acceptableFormat.includes(fileType)) {
                  files.push(event.dataTransfer.files[i])
                } else {
                  toastError({text: this.$t('messages.validFileFormatUniversal', { file: event.dataTransfer.files[i].name })})
                  toastInfo({text: this.$t('messages.useCorrectFormat', { format: this.acceptableFormat }), timeout: 5000})
                  break;
                }
              }
            }
          }

          if (files.length > 0) {
            this.files = files
          }

          this.isDragging = false
        },
      }
    }
</script>

<style scoped>
  .file-upload {
    padding: 1.5rem 1rem;
    white-space: nowrap;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 2px;
    outline: dashed 2px rgba(0, 123, 255, .8);
    color: #007bff;
    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
    transition: outline-offset .15s ease-in-out, background-color .15s linear;
  }

  .file-upload:hover {
    cursor: pointer;
    color: #fff;
    outline: dashed 2px #fff;
    outline-offset: -10px;
    background-color: rgba(0, 123, 255, 0.5);
    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
    transition: outline-offset .15s ease-in-out, background-color .15s linear;
  }

  .dragging {
    color: #fff;
    outline: dashed 2px #fff;
    outline-offset: -10px;
    background-color: rgba(0, 123, 255, 0.5);
    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
    transition: outline-offset .15s ease-in-out, background-color .15s linear;
  }

  .upload-icon::before {
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-size: 1.7rem;
    content: "\f093";
    padding: unset;
  }

  .hide-text {
    display: none;
  }

  .record-options > label:hover {
    cursor: pointer;
  }
</style>
