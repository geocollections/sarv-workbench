const permissionsMixin = {
  data() {
    return {
      currentUser: null,
      permissions: null
    }
  },
  created() {
    // Gets user data from session storage
    if (this.$session.exists() && this.$session.get('authUser') !== null) {
      const user = this.$session.get('authUser')
      this.currentUser = {
        id: user.agent_id,
        agent: null,
        forename: user.user,
        surename: null,
        user: user.user,
      }
      this.permissions = user.permissions
      // console.log(this.currentUser);
    }
  },

  methods: {
    showMyPermissions() {
      // TODO: Should put that to settings view
      console.log(this.permissions)
    },

    isUserAllowedTo(action, table) {
      if (typeof this.permissions[table] !== 'undefined') {
        return this.permissions[table].includes(action)
      } else {
        console.log('This table: ' + table + ' does not exist! (in permissions)')
        return false
      }
    }
  }
}

export default permissionsMixin
