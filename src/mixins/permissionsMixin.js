const permissionsMixin = {
  data() {
    return {
      currentUser: null,
      permissions: null,
      databaseId: null,
    }
  },
  created() {
    const authUser = this.$localStorage.get('authUser', null);
    if (typeof authUser !== 'undefined' && authUser !== null) {
      this.currentUser = {
        id: authUser.agent_id,
        agent: null,
        forename: authUser.name,
        surename: authUser.surname,
        user: authUser.user,
      };
      this.permissions = authUser.permissions;
      this.databaseId = authUser.database_id
    }
  },

  computed: {
    $_permissionsMixin_currentUser() { return this.currentUser },
    $_permissionsMixin_permissions() { return this.permissions },
    $_permissionsMixin_databaseId() { return this.databaseId },
  },

  methods: {
    $_permissionsMixin_isUserAllowedTo(action, table) {
      if (typeof this.permissions[table] !== 'undefined') return this.permissions[table].includes(action)
      else return false
    }
  }
};

export default permissionsMixin
