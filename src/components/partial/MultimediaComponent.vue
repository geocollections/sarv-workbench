<template>

  <!-- FILE -->

  <div class="row">
    <div class="col-sm-12 mb-2">
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
      <button class="btn btn-outline-danger" v-if="filesState" :disabled="sendingData" @click="clearFile">
        <span v-show="files.length === 1">{{ $tc('add.buttons.resetFile', 1) }}</span>
        <span v-show="files.length > 1">{{ $tc('add.buttons.resetFile', 2) }}</span>
      </button>
    </div>


  </div>
</template>

<script>
  import formManipulation  from './../mixins/formManipulation'
  import EXIF from 'exif-js'
    export default {
      name: "multimedia-component",
      mixins: [formManipulation],
      data() {
        return {
          apiUrl: 'https://rwapi.geocollections.info/',
          loadingPercent: 0,
          sendingData: false,
          files: [],
          fileMetaData: null,
          isDragging: false,
          upload: {},
          recordedFile:null

        }
      },
      computed: {
        filesState() {
          return this.files !== null && this.files.length > 0
        },
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
                  this.$emit('file-uploaded',this.recordedFile);
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
        }
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
