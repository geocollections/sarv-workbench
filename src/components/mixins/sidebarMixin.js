
const sidebarMixin = {
  methods: {
    handleSidebarUserAction(userAction, object) {
      console.log(userAction)
      console.log(object)
      if (userAction.action === 'addSample') this.addSample()
      else if (userAction.action === 'addSite') this.addOrEditSite()
      else if(userAction.action === 'navigate') {
        let element = this.$refs[userAction.choice];
        let sizeOfHeader = 60;
        if(element) window.scrollTo(0,  element.offsetTop-sizeOfHeader);
      } else if(userAction.action === 'save') {
        // this.saveAndNavigateBack(object)
        this.add(false, object,false,true).then(resp => {
          //
        })
      } else if(userAction.action === 'cancel') {
        this.back(object)
      } else if (userAction.action === 'addReferenceToLibrary') {
        console.log('Todo: Add reference to library')
      }
    },

    back(object) {
      if(object !== 'site') this.$router.push({path: '/'+object})
      else {
        //special case (SITE do not have LIST view)
        let activeProject = this.getActiveProject();
        activeProject === null ?
          this.$router.push({path: '/project'}) :
          this.$router.push({path: '/project/' + activeProject})
      }
    },

    // handleSidebarUserAction(userAction) {
    //   if (userAction.action === 'addSite') this.addOrEditSite()
    //   else if(userAction.action === 'navigate') {
    //     let element = this.$refs[userAction.choice];
    //     let sizeOfHeader = 60;
    //     if(element) window.scrollTo(0, element.offsetTop-sizeOfHeader);
    //   } else if(userAction.action === 'save') {
    //     this.hoverSaveOrCancelButtonClicked('SAVE_AND_LEAVE','project',true)
    //   } else if(userAction.action === 'cancel') {
    //     this.hoverSaveOrCancelButtonClicked('CANCEL','project',true)
    //   }
    // },
  }
};

export default sidebarMixin
