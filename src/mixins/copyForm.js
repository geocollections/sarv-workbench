import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

import cloneDeep from 'lodash/cloneDeep'
import Vue from 'vue'
import findIndex from "lodash/findIndex";

const copyForm = {
  mounted(){
    this.$root.$on('save-object-as-new', this.saveAsNew);
  },
  beforeDestroy() {
    this.$root.$off('save-object-as-new', this.saveAsNew);
  },
  methods: {

    // waitUntilAllCopiesSaved(){
    //   this.$root.$emit('copied-data-saved','PROBLEM')
    // },

    saveAsNew(data) {
      let numberOfSaves = 0;
      console.log(data.numberOfCopies)

      for (let i = 1; i < parseInt(data.numberOfCopies)+1; i++ ){
        numberOfSaves += this.addCopy(data.object, data, i) === true ? 1 : 0;
        //stop loading after last data saved
        console.log('Number of saves ' + numberOfSaves)
        this.$root.$emit('copied-data-saved','SAVED')
        // if(i === data.numberOfCopies && numberOfSaves === data.numberOfCopies) {
        //
        // } else if(i === data.numberOfCopies && numberOfSaves !== data.numberOfCopies) {
        //   setTimeout(this.waitUntilAllCopiesSaved, 500)
        // }
      }
    },

    addCopy(object, data = {}, numberOfSave = 0) {
      if (this.validate(object) && !this.sendingData) {

        delete this[object]['id'];

        const dataToUpload = this.formatDataForUpload(this[object]);
        let formData = new FormData();
        formData.append('data', dataToUpload);

        this.saveData(object,formData,'add/'+object+'/', true).then(savedObjectId => {
           if(savedObjectId) {
             this.addCopyOfRelatedData(data,savedObjectId,object,numberOfSave);
             return true;
          } else {
            return false;
           }

        }, errResponse => { return false; });

      } else if (this.sendingData) {
        // This shouldn't run unless user deletes html elements and tries to press 'add' button again
        toastError({text: this.$t('messages.easterEggError')})
      } else {
        toastError({text: this.$t('messages.checkForm')})
      }

    },
    handlePreparationDataBeforeSave(relatedData,data,numberOfSave) {
      let changedRecordIdx = findIndex(data.preparations, function(item) { return item.id === relatedData.id });
      relatedData.preparation_number = data.preparations[changedRecordIdx].preparation_number+'_'+numberOfSave;
      return relatedData
    },
    addCopyOfRelatedData(data, idOfCopy, object,numberOfSave){
      let type;

      Object.entries(data.relatedData).forEach(entry => {
        if(entry[1] === undefined || entry[1] === false) return;
        type = entry[0];
        if(this.isNotEmpty(this.relatedData[type])) {
          this.relatedData[type].forEach(entry => {
            if(type === 'attachment_link') {
              entry['attachment'] = entry.id
            }

            let savedRelatedData = cloneDeep(entry);

            if(type === 'preparation') {
              savedRelatedData = this.handlePreparationDataBeforeSave(savedRelatedData,data, numberOfSave)
            }

            let copy = this.removeUnnecessaryFields(savedRelatedData ,this.relatedData.copyFields[type]);
            copy[object] = idOfCopy;

            let formData = new FormData();
            formData.append('data', JSON.stringify(copy));
            try {
              this.saveData(type,formData,'add/'+type+'/',true);
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
