import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

import cloneDeep from 'lodash/cloneDeep'
import Vue from 'vue'

const copyForm = {
  mounted(){
    this.$root.$on('save-object-as-new', this.saveAsNew);
  },

  methods: {

    saveAsNew(){},

    addCopy(object, isCopy = false, data = {}, numberOfSave = 0) {
      if (this.validate(object) && !this.sendingData) {

        if(isCopy === true) {
          delete this[object]['id']
        }

        const dataToUpload = this.formatDataForUpload(this[object]);
        let formData = new FormData();
        formData.append('data', dataToUpload);

        this.saveData(object,formData,'add/'+object+'/', isCopy).then(savedObjectId => {
          if(isCopy === true && savedObjectId) { //
            this.addCopyOfRelatedData(data,savedObjectId,object,numberOfSave);
            return true;
          } else if (isCopy === true && savedObjectId === undefined) {
            return false;
          }

        }, errResponse => {
          return false;
        });

      } else if (this.sendingData) {
        // This shouldn't run unless user deletes html elements and tries to press 'add' button again
        toastError({text: this.$t('messages.easterEggError')})
      } else {
        toastError({text: this.$t('messages.checkForm')})
      }

    },
    handlePreparationDataBeforeSave(relatedData,data,numberOfSave) {
      relatedData.forEach(entity => {
        data.preparations.forEach(p => {
          entity.preparation_number = p.preparation_number+'_'+numberOfSave;
        });
      });
    },
    addCopyOfRelatedData(data, idOfCopy, object,numberOfSave){
      let type;

      Object.entries(data.relatedData).forEach(entry => {
        if(entry[1] === undefined || entry[1] === false) return;
        type = entry[0];
        if(!this.isEmptyObject(this.relatedData[type])) {
          this.relatedData[type].forEach(entry => {
            if(type === 'attachment_link') {
              entry['attachment'] = entry.id
            }

            let savedRelatedData = cloneDeep(entry);

            if(type === 'preparations') {
              savedRelatedData = this.handlePreparationDataBeforeSave(savedRelatedData,data, numberOfSave)
            }

            let copy = this.removeUnnecessaryFields(savedRelatedData ,this.relatedData.copyFields[type]);
            copy[object] = idOfCopy;

            let formData = new FormData();
            formData.append('data', JSON.stringify(copy));
            try {
              this.saveData(type,formData,'add/'+type+'/');
            } catch (e) {
              console.log('Related data type: ' + type +' cannot not be created')
              console.log(e)
            }

          })
        }

      })
    },
  }
};

export default copyForm
