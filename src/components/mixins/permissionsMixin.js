const permissionsMixin = {
  data() {
    return {
      currentUser: null,
      permissions: null,
      databaseId: null,
    }
  },
  created() {
    // Gets user data from session storage
    const authUser = this.$localStorage.get('authUser', null)
    if (typeof authUser !== 'undefined' && authUser !== null) {
      this.currentUser = {
        id: authUser.agent_id,
        agent: null,
        forename: authUser.name,
        surename: authUser.surname,
        user: authUser.user,
      }
      this.permissions = authUser.permissions
      this.databaseId = authUser.database_id
      // console.log(this.currentUser);
    }
  },

  methods: {
    isUserAllowedTo(action, table) {
      if (typeof this.permissions[table] !== 'undefined') {
        return this.permissions[table].includes(action)
      } else {
        // console.log('This table: ' + table + ' does not exist! (in permissions)')
        return false
      }
    }
  }
}

export default permissionsMixin
