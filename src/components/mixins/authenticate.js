import { toastSuccess, toastError } from "../../assets/js/iziToast/iziToast";
import { fetchLogin, fetchLoginId, fetchLogout } from "../../assets/js/api/apiCalls";

const authenticate = {

  methods: {

    /**
     * Authenticates user according to the information entered.
     *
     * @value loggingIn, Boolean which is used in login components to trigger loading spinner element.
     * @param authenticationType, String value of user preferred authentication type, currently either 'password' or 'id'.
     * @todo In the future possible to add more options e.g., 'mobile'
     * @param loginData, Object value of data user entered in login form
     */
    authenticate(authenticationType, loginData) {
      if (!this.loggingIn) {
        this.loggingIn = true;

        if (authenticationType === 'password') {
          fetchLogin(loginData).then(successfulResponse => {
              return this.handleSuccessfulAuthentication(successfulResponse);
            }, errResponse => {
              return this.handleAuthenticationError(authenticationType);
            });
        } else if (authenticationType === 'id') {
          fetchLoginId().then(successfulResponse => {
            return this.handleSuccessfulAuthentication(successfulResponse);
            }, errResponse => {
            return this.handleAuthenticationError(authenticationType);
          });
        }
      } else {
        toastError({text: this.$t('messages.easterEggError')})
      }
    },

    /**
     * Log out method, which logs user out of database.
     *
     * First of all user session is deleted using $session
     * and then log out request is initiated.
     */
    logOut() {
      if (this.$session.exists() && this.$session.get('authUser') != null) {
        this.$session.remove('authUser');
        this.$session.destroy();
      }

      fetchLogout().then(response => {
        if (response.status === 200) {
          this.$router.push({path: '/'});
          this.showSuccessToast(response);
        } else this.showErrorToast(response)

      }, errResponse => {})
    },

    /**
     * Handles successful authentication response. If login is successful then session
     * is created using $session and user is routed to home page using $router.
     *
     * @value message, String which is used in login components to show user a message what went wrong.
     * @value error, Boolean which is used in login components to show error element.
     * @value loggingIn, Boolean which is used in login components to trigger loading spinner element.
     *
     * @param response, Object
     */
    handleSuccessfulAuthentication(response) {
      if (response.status === 200) {
        if (response.body.user != null) {
          this.$session.start()
          this.$session.set('authUser', response.body)
          this.$router.push({ path: '/dashboard' })
          this.showSuccessToast(response)

        } else {
          this.showErrorToast(response)
          this.error = true;
        }
        this.loggingIn = false;
      }
    },

    /**
     * Handles unsuccessful authentication response.
     *
     * @value message, String which is used in login components to show user a message what went wrong.
     * @value error, Boolean which is used in login components to show error element.
     * @value loggingIn, Boolean which is used in login components to trigger loading spinner element.
     *
     * @param authenticationType, String value to know which message to show.
     *
     */
    handleAuthenticationError(authenticationType) {
      if (authenticationType === 'password') {
        this.message = this.$t('messages.loginError')
        toastError({text: this.$t('messages.loginError')})
      } else if (authenticationType === 'id') {
        this.message = this.$t('messages.loginIdError')
        toastError({text: this.$t('messages.loginIdError')})
      }

      this.error = true;
      this.loggingIn = false;
    },

    /**
     * Toasts success message.
     *
     * @param response, Object from successful request
     */
    showSuccessToast(response) {
      if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
        toastSuccess({text: response.body.message_et});
      } else {
        toastSuccess({text: response.body.message});
      }
    },

    /**
     * Toasts error message.
     *
     * @param response, Object from unsuccessful request
     */
    showErrorToast(response) {
      if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
        this.message = response.body.message_et;
        toastError({text: response.body.message_et})
      } else {
        this.message = response.body.message;
        toastError({text: response.body.message})
      }
    },
  }

};

export default authenticate;
