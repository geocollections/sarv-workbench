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

      <div class="mt-2" v-if="files !== null && files.length > 0">
        <div v-if="files.length > 0" >

          <ul class="list-unstyled">
            <li class="mt-2" v-for="(file, key) in files">

                <span v-if="file.type.includes('image')">
                  <img v-bind:ref="'image' + parseInt(key)" class="img-thumbnail thumbnail-preview" alt="Image preview..." />
                </span>
              <span v-else>
                  <font-awesome-icon icon="file"></font-awesome-icon>&nbsp;
                </span>

              <span><b>{{ file.name }}</b></span>

            </li>
          </ul>

        </div>
      </div>

      <!-- TODO: https://github.com/bootstrap-vue/bootstrap-vue/issues/1526, If multiple then accept does not take multiple formats. BUG -->
      <!-- TODO: BUG: If too many files or long filenames then breaks the input design -->
      <b-form-file v-model="files"
                   id="files"
                   :state="filesState"
                   multiple
                   plain
                   style="display: none"
                   ref="fileinput"
                   :placeholder="$t('add.inputs.fileInput')">
      </b-form-file>

      <b-form-text v-if="!filesState">{{ $t('add.errors.files') }}.</b-form-text>

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
    export default {
      name: "file-input-component",
      data() {
        return {
          apiUrl: 'https://rwapi.geocollections.info/',
          loadingPercent: 0,
          sendingData: false,
          files: null,
          fileMetaData: null,
          isDragging: false,
          upload: {}
        }
      },
      computed: {
        filesState() {
          return this.files !== null && this.files.length > 0
        },
      },

      watch: {
        'files': function (newVal) {

          this.resetMetaData()

          if (newVal.length > 0) {
            for (let i = 0; i < newVal.length; i++){
              if (newVal[i].type.includes('image')) {
                let reader = new FileReader();

                reader.onload = (event) => {
                  console.log(event.target.result)
                  this.$refs['image' + parseInt(i)][0].src = event.target.result;
                }

                reader.readAsDataURL(this.files[i]);
              }
            }
          }

          if (newVal.length === 1) {
            let fileReader = new FileReader()
            fileReader.readAsArrayBuffer(newVal[0])
            fileReader.onload = (event) => {
              // TODO: Get thumbnail
              this.fileMetaData = EXIF.readFromBinaryFile(event.target.result)
            }
          }
        },
        'fileMetaData': function (newVal) {
          console.log(newVal)
          if (newVal !== null && newVal !== false) {

            // DATE
            if (newVal.DateTimeOriginal !== null && typeof newVal.DateTimeOriginal !== 'undefined') {
              let formattedDate = this.$moment(newVal.DateTimeOriginal, 'YYYY:MM:DD HH:mm:ss')
              this.upload.date_created = formattedDate.toDate()
            } else if (newVal.DateTime !== null && typeof newVal.DateTime !== 'undefined') {
              let formattedDate = this.$moment(newVal.DateTime, 'YYYY:MM:DD HH:mm:ss')
              this.upload.date_created = formattedDate.toDate()
            } else this.upload.date_created = new Date()

            // DESCRIPTION
            if (newVal.ImageDescription !== null && typeof newVal.ImageDescription !== 'undefined') {
              if (newVal.ImageDescription.trim().length > 0) {
                this.upload.description_en = newVal.ImageDescription.trim()
              }
            }

            // DEVICE_TXT
            if (newVal.Model !== null && typeof newVal.Model !== 'undefined') this.upload.device_txt = newVal.Model
            else if (newVal.Make !== null && typeof newVal.Make !== 'undefined') this.upload.device_txt = newVal.Make

            // IMAGE DIMENSIONS
            if (newVal.PixelXDimension !== null && typeof newVal.PixelXDimension !== 'undefined') {
              this.upload.image_width = newVal.PixelXDimension
            } else {
              this.upload.image_width = null
            }
            if (newVal.PixelYDimension !== null && typeof newVal.PixelYDimension !== 'undefined') {
              this.upload.image_height = newVal.PixelYDimension
            } else {
              this.upload.image_height = null
            }
          }
        }
      },
      methods: {
        clearFile() {
          this.$refs.fileinput.reset()
          this.resetMetaData()
        },
        resetMetaData() {
          this.upload.image_width = null;
          this.upload.image_height = null;
        },
      }
    }
</script>

<style scoped>

</style>
