<template>
  <v-main
    class="login"
    :style="{
      backgroundImage: `url('${image}')`,
      transition: 'background 5s ease-in-out',
    }"
  >
    <lang-buttons v-if="$route.meta.isLogin" style="z-index: 3" />
    <div class="gradient"></div>
    <v-container fill-height style="padding-bottom: 80px">
      <v-row align="center" justify="center">
        <v-col sm="10" md="8" lg="6" xl="4" style="margin: 48px 0">
          <div class="sarv-title">{{ $t("header.title") }}</div>

          <v-btn style="z-index: 2" @click="doLogin">Login</v-btn>

          <GlobalAlertNotification />

          <DevNotification />

          <v-card
            :color="bodyColor.split('n-')[0] + 'n-5'"
            elevation="8"
            style="z-index: 3"
          >
            <v-tabs
              v-model="tab"
              grow
              :background-color="bodyColor.split('n-')[0] + 'n-3'"
              hide-slider
              :active-class="bodyColor.split('n-')[0] + 'n-5 black--text'"
            >
              <v-tabs-slider></v-tabs-slider>

              <v-tab class="font-weight-bold">{{ $t("login.idCard") }}</v-tab>

              <v-tab class="font-weight-bold">{{ $t("login.password") }}</v-tab>

              <v-tab class="font-weight-bold">{{ $t("login.socials") }}</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <!-- ID CARD -->
              <v-tab-item>
                <v-card flat :color="bodyColor.split('n-')[0] + 'n-5'">
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
                      @click="login('idcard')"
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

              <!-- PASSWORD -->
              <v-tab-item>
                <v-card flat :color="bodyColor.split('n-')[0] + 'n-5'">
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

                    <v-form v-model="isValid">
                      <v-text-field
                        id="username-field"
                        autocomplete="username"
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
                        autocomplete="current-password"
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
                          @click="login('password')"
                          :disabled="!isValid"
                          :loading="loggingIn"
                          color="green darken-3"
                          :dark="isValid"
                        >
                          {{ $t("login.loginButton") }}
                          <v-icon small right>fas fa-sign-in-alt</v-icon>
                        </v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <!-- SOCIALS -->
              <v-tab-item>
                <v-card flat :color="bodyColor.split('n-')[0] + 'n-5'">
                  <v-card-text
                    class="d-flex flex-column justify-center align-center"
                  >
                    <v-btn
                      class="my-1 white--text text-none"
                      width="250"
                      color="#ea4335"
                      @click="login('google')"
                      ><v-icon small left light>fab fa-google</v-icon
                      >{{ $t("login.signInWithGoogle") }}</v-btn
                    >
                    <v-btn
                      class="my-1 white--text text-none"
                      width="250"
                      color="#3b5998"
                      @click="login('facebook')"
                      ><v-icon small left light>fab fa-facebook-f</v-icon
                      >{{ $t("login.signInWithFacebook") }}</v-btn
                    >
                    <v-btn
                      class="my-1 white--text text-none"
                      width="250"
                      color="#a6ce39"
                      @click="login('orcid')"
                      ><v-icon small left light>fab fa-orcid</v-icon
                      >{{ $t("login.signInWithOrcid") }}</v-btn
                    >
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <site-icons style="z-index: 3"></site-icons>
    <img :src="image" alt="background_image_2" v-show="false" />
  </v-main>
</template>

<script>
import LangButtons from "../components/partial/LangButtons";
import { mapActions, mapState } from "vuex";
import SiteIcons from "@/components/partial/SiteIcons";
import GlobalAlertNotification from "@/components/partial/GlobalAlertNotification";
import DevNotification from "@/components/partial/DevNotification";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "Login",
  components: {
    DevNotification,
    GlobalAlertNotification,
    SiteIcons,
    LangButtons,
  },
  mixins: [toastMixin],
  data: () => ({
    tab: null,
    loggingIn: false,
    isValid: true,
    user: {
      username: "",
      password: null,
    },
    usernameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.trim().length > 0) || "Name cant be empty",
    ],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.trim().length > 0) || "Password cant be empty",
    ],
    showPassword: false,
    passMessage: null,
    passError: false,
    idMessage: null,
    idError: false,
  }),

  created() {
    window.addEventListener("keyup", this.handleKeyUp);
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyUp);
  },

  computed: {
    ...mapState("settings", ["bodyColor"]),
    image() {
      return `${this.$constants.IMAGE_URL}img/sarv-edit/background_2.jpg`;
    },
  },

  methods: {
    ...mapActions("user", ["setAuthUser", "removeAuthUser"]),

    doLogin() {
      let loginUrl = "https://rwapi.geoloogia.info/accounts/login/";
      if (location.origin.includes("localhost"))
        loginUrl = "http://localhost:7000/accounts/login/";
      if (location.origin.includes("-dev"))
        loginUrl = "https://rwapi-dev.geoloogia.info/accounts/login/";

      location.href = `${loginUrl}?from=${location.origin}`;
    },

    async login(type) {
      if (this.isValid && !this.loggingIn) {
        let response;
        const AVAILABLE_LOGIN_TYPES = [
          "password",
          "idcard",
          // "google",
          // "facebook",
          // "orcid",
        ];
        const UNAVAILABLE_LOGIN_TYPES = [
          // "password",
          // "idcard",
          "google",
          "facebook",
          "orcid",
        ];
        if (UNAVAILABLE_LOGIN_TYPES.includes(type)) {
          this.toastInfo({
            text: "Logging in using socials is still in progress!",
          });
          return;
        }

        if (AVAILABLE_LOGIN_TYPES.includes(type)) {
          if (type === "password") {
            const formData = new FormData();
            formData.set("login", this.user.username);
            formData.set("password", this.user.password);
            response = await this.$api.auth.login(formData);
          } else if (type === "idcard") {
            response = await this.$api.auth.loginIDCard();
          } else {
            response = await this.$api.auth.loginSocial(type);
          }

          console.log(response);
          if (response?.detail === "Login successful!") {
            this.setAuthUser(response);
            this.toastSuccess({ text: response.detail });
            await this.$router.push("Dashboard");
          } else this.toastError({ text: response.detail });
        }
      }
    },

    handleKeyUp(event) {
      if (this.tab === 1 && (event.key === "Enter" || event.keyCode === 13))
        this.login("password");
    },
  },
};
</script>

<style>
.gradient {
  background: linear-gradient(
    to top right,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1;
}
.login {
  background-size: cover;
}

.active-tab-color {
  background-color: #eceff1;
  color: #37474f !important;
}

.sarv-title {
  z-index: 2;
  color: white;
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
}
</style>
