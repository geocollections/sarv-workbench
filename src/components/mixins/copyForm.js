import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

import cloneDeep from 'lodash/cloneDeep'
import Vue from 'vue'

const copyForm = {
  mounted(){
    this.$root.$on('save-object-as-new', this.saveAsNew);
  },

  methods: {

    saveAsNew(){},

    addCopyOfRelatedData(relatedData, idOfCopy, object = 'sample'){
      let type;

      Object.entries(relatedData).forEach(entry => {
        if(entry[1] === undefined || entry[1] === false) return;
        type = entry[0];
        if(!this.isEmptyObject(this.relatedData[type])) {
          this.relatedData[type].forEach(entry => {
            if(type === 'attachment_link') {
              entry['attachment'] = entry.id
            }

            let copy = this.removeUnnecessaryFields(cloneDeep(this.relatedData[type]),this.relatedData.copyFields[type]);
            copy[object] = idOfCopy;
            let formData = new FormData();
            formData.append('data', this.formatRelatedData(copy,true));

            this.saveData(type,formData,'add/'+type+'/');
          })
        }

      })
    },
  }
};

export default copyForm
