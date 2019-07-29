
const sidebarMixin = {

  methods: {

    $_sidebarMixin_handleUserAction(userAction, objectName, objectData) {
      this.$router.push({ name: userAction.userAction.choice + ' ' + userAction.userAction.action, params: { [objectName]: objectData } })
    },

  }
};

export default sidebarMixin
