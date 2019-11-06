import { toastSuccess, toastError } from "../assets/js/iziToast/iziToast";
import {
  fetchLogin,
  fetchLoginId,
  fetchLogout
} from "../assets/js/api/apiCalls";

const authenticationMixin = {
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

        if (authenticationType === "password") {
          fetchLogin(loginData).then(
            successfulResponse => {
              return this.$_authenticationMixin_handleSuccessfulAuthentication(
                successfulResponse,
                authenticationType
              );
            },
            () => {
              return this.$_authenticationMixin_handleAuthenticationError(
                authenticationType
              );
            }
          );
        } else if (authenticationType === "id") {
          fetchLoginId().then(
            successfulResponse => {
              return this.$_authenticationMixin_handleSuccessfulAuthentication(
                successfulResponse,
                authenticationType
              );
            },
            () => {
              return this.$_authenticationMixin_handleAuthenticationError(
                authenticationType
              );
            }
          );
        }
      } else {
        toastError({ text: this.$t("messages.easterEggError") });
      }
    },

    /**
     * Log out method, which logs user out of database.
     *
     * First of all user cookies and localStorage is deleted
     * and then log out request is initiated.
     */
    logOut() {
      this.$cookies.remove("csrftokenLocalhost", null, "localhost");
      this.$cookies.remove("csrftoken", null, "geocollections.info");
      this.$localStorage.remove("authUser");

      fetchLogout().then(response => {
        if (response.status === 200) {
          this.$router.push({
            name: "Geocollections Data Management",
            params: { dontShowSessionExpired: true }
          });
          toastSuccessMessage(response, this.$i18n.locale);
        } else getErrorMessage(response, this.$i18n.locale);
      });
    },

    /**
     * Handles successful authentication response. If login is successful then session
     * is created using localStorage and cookie (for localhost) and user is routed to home page using $router.
     *
     * @value message, String which is used in login components to show user a message what went wrong.
     * @value error, Boolean which is used in login components to show error element.
     * @value loggingIn, Boolean which is used in login components to trigger loading spinner element.
     *
     * @param response, Object
     * @param authenticationType, String value to know which message to show.
     */
    $_authenticationMixin_handleSuccessfulAuthentication(
      response,
      authenticationType
    ) {
      if (response.status === 200) {
        if (response.body.user != null) {
          let date = new Date();
          response.body.expires = date.setDate(date.getDate() + 7);

          // Cookie for localhost
          this.$cookies.set(
            "csrftokenLocalhost",
            "test token",
            "1d",
            null,
            "localhost"
          );
          this.$localStorage.set("authUser", response.body);

          if (this.$route.query.from) {
            this.$router.push({ path: this.$route.query.from });
          } else {
            this.$router.push({ path: "/dashboard" });
          }
          toastSuccessMessage(response, this.$i18n.locale);
        } else {
          if (authenticationType === "password") {
            this.passMessage = getErrorMessage(response, this.$i18n.locale);
            this.passError = true;
          } else if (authenticationType === "id") {
            this.idMessage = getErrorMessage(response, this.$i18n.locale);
            this.idError = true;
          }
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
    $_authenticationMixin_handleAuthenticationError(authenticationType) {
      if (authenticationType === "password") {
        this.passMessage = this.$t("messages.loginError");
        this.passError = true;
        toastError({ text: this.$t("messages.loginError") });
      } else if (authenticationType === "id") {
        this.idMessage = this.$t("messages.loginIdError");
        this.idError = true;
        toastError({ text: this.$t("messages.loginIdError") });
      }

      this.loggingIn = false;
    }
  }
};

/**
 * Toast success message.
 * @param response - Success response from request
 * @param locale - Current language preference
 */
function toastSuccessMessage(response, locale) {
  if (locale === "ee" && response.body.message_et)
    toastSuccess({ text: response.body.message_et });
  else toastSuccess({ text: response.body.message });
}

/**
 * Toasts and returns error message
 * @param response - Error response from request
 * @param locale - Current language preference
 * @returns {String} - Message to show why request failed
 */
function getErrorMessage(response, locale) {
  if (locale === "ee" && response.body.message_et) {
    toastError({ text: response.body.message_et });
    return response.body.message_et;
  } else {
    toastError({ text: response.body.message });
    return response.body.message;
  }
}

export default authenticationMixin;
