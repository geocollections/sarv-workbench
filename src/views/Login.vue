<template>
  <v-content class="login">
    <lang-buttons v-if="$route.meta.isLogin" />

    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col sm="10" md="8" lg="6" style="margin: 48px 0;">
          <v-card
            :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
            elevation="8"
          >
            <v-tabs
              v-model="tab"
              grow
              :background-color="appSettings.bodyColor.split('n-')[0] + 'n-3'"
              hide-slider
              :active-class="
                appSettings.bodyColor.split('n-')[0] + 'n-5 black--text'
              "
            >
              <v-tabs-slider></v-tabs-slider>

              <v-tab class="font-weight-bold">{{ $t("login.idCard") }}</v-tab>

              <v-tab class="font-weight-bold">{{ $t("login.password") }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card
                  flat
                  :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
                >
                  <v-card-text>
                    <v-alert
                      class="mb-0"
                      border="right"
                      :colored-border="!idError"
                      :color="idError ? 'red' : 'green darken-3'"
                      elevation="3"
                      :icon="idError ? 'fas fa-exclamation' : 'fas fa-info'"
                      prominent
                      dense
                    >
                      <span v-if="!idMessage"
                        ><b>{{ $t("login.idCardMessage") }}</b></span
                      >
                      <b>{{ idMessage }}</b>
                    </v-alert>
                  </v-card-text>

                  <v-card-actions class="justify-center pa-4 pt-2">
                    <v-btn
                      id="login-id"
                      @click="authenticate('id')"
                      :loading="loggingIn"
                      color="green darken-3"
                      dark
                    >
                      {{ $t("login.loginButton") }}
                      <v-icon small right>fas fa-id-card</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>

              <v-tab-item>
                <v-card
                  flat
                  :color="appSettings.bodyColor.split('n-')[0] + 'n-5'"
                >
                  <v-card-text>
                    <v-alert
                      border="right"
                      :colored-border="!passError"
                      :color="passError ? 'red lighten-1' : 'green darken-3'"
                      elevation="3"
                      :icon="passError ? 'fas fa-exclamation' : 'fas fa-info'"
                      prominent
                      dense
                    >
                      <span v-if="!passMessage">
                        <b>{{ $t("login.passwordMessage") }}</b>
                      </span>
                      <b>{{ passMessage }}</b>
                    </v-alert>

                    <v-form v-model="valid">
                      <v-text-field
                        id="username-field"
                        v-model="user.username"
                        :rules="usernameRules"
                        :label="$t('login.username')"
                        placeholder=""
                        color="black"
                        outlined
                        dense
                        required
                      ></v-text-field>

                      <v-text-field
                        id="password-field"
                        v-model="user.password"
                        :rules="passwordRules"
                        :label="$t('login.password')"
                        placeholder=""
                        color="black"
                        outlined
                        dense
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="
                          showPassword ? 'far fa-eye' : 'far fa-eye-slash'
                        "
                        @click:append="showPassword = !showPassword"
                        required
                      ></v-text-field>

                      <div class="text-center mt-2">
                        <v-btn
                          id="login-pass"
                          @click="login"
                          :disabled="!valid"
                          :loading="loggingIn"
                          color="green darken-3"
                          :dark="valid"
                        >
                          {{ $t("login.loginButton") }}
                          <v-icon small right>fas fa-sign-in-alt</v-icon>
                        </v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import authenticationMixin from "../mixins/authenticationMixin";
import LangButtons from "../components/partial/LangButtons";
import { mapState } from "vuex";

export default {
  name: "Login",
  components: {
    LangButtons
  },
  mixins: [authenticationMixin],
  data: () => ({
    tab: null,
    loggingIn: false,
    valid: true,
    user: {
      username: "",
      password: null
    },
    usernameRules: [
      v => !!v || "Name is required",
      v => (v && v.trim().length > 0) || "Name cant be empty"
    ],
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.trim().length > 0) || "Password cant be empty"
    ],
    showPassword: false,
    passMessage: null,
    passError: false,
    idMessage: null,
    idError: false
  }),

  beforeCreate() {
    this.$store.dispatch("initialiseAppSettings");
  },

  created() {
    window.addEventListener("keyup", this.handleKeyUp);
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyUp);
  },

  computed: {
    ...mapState(["appSettings"])
  },

  methods: {
    login() {
      if (this.valid && !this.loggingIn) {
        this.authenticate("password", {
          user: this.user.username,
          pwd: this.user.password
        });
      }
    },

    handleKeyUp(event) {
      if (this.tab === 1 && (event.key === "Enter" || event.keyCode === 13))
        this.login();
    }
  }
};
</script>

<style>
.login {
  background-image: linear-gradient(
      to top right,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(0, 0, 0, 0.7) 100%
    ),
    url("https://files.geocollections.info/img/doi-header-bg.jpg");
  background-size: cover;
}

.active-tab-color {
  background-color: #eceff1;
  color: #37474f !important;
}
</style>
