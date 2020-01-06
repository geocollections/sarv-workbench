const sidebarMixin = {
  methods: {
    /**
     * Routes user to desired location with current location's object data.
     *
     * @param userAction {Object} - Fixed object which contains 'choice' and 'action'.
     * Choice is location's name where user wants to go e.g., 'Sample', 'Site' etc.
     * Action can be either 'add' or 'edit', possible to add more options in the future, e.g., 'delete'.
     * @param objectName {String} - Data's name which will be sent e.g., 'sample'
     * @param objectData {Object} - Data to be sent e.g., 'sample' object.
     */
    handleUserAction(userAction, objectName, objectData) {
      this.$router.push({
        name: userAction.userAction.choice + " " + userAction.userAction.action,
        params: { [objectName]: objectData }
      });
    }
  }
};

export default sidebarMixin;
