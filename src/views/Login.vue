<template>
  <v-main class="login" :style="mainCss">
    <lang-buttons v-if="$route.meta.isLogin" style="z-index: 3" />
    <div class="gradient"></div>
    <v-container fill-height style="padding-bottom: 80px">
      <v-row align="center" justify="center">
        <v-col sm="10" md="8" lg="6" xl="4" style="margin: 48px 0">
          <div class="sarv-title">{{ $t("header.title") }}</div>

          <GlobalAlertNotification />

          <!-- <DevNotification /> -->

          <v-card color="grey lighten-4" style="z-index: 3">
            <v-card-text>
              <v-btn
                id="login-id"
                class="text-none"
                block
                @click="authenticate('id')"
                :loading="loggingInIdCard"
                color="#003168"
                dark
                elevation="0"
              >
                <v-icon left>fas fa-id-card</v-icon>
                {{ $t("login.signInIdCard") }}
              </v-btn>
              <v-btn
                class="mt-2 text-none"
                block
                :href="getOrcidLoginUrl()"
                color="#a6ce39"
                dark
                elevation="0"
              >
                <v-icon left>fab fa-orcid</v-icon>
                {{ $t("login.signInOrcid") }}
              </v-btn>
            </v-card-text>
            <div class="d-flex align-center my-2 px-2">
              <div
                style="flex-grow: 1; border-bottom: 1px solid lightgray"
              ></div>
              <div class="mx-3" style="color: darkgray">
                {{ $t("common.or") }}
              </div>
              <div
                style="flex-grow: 1; border-bottom: 1px solid lightgray"
              ></div>
            </div>
            <v-card-text>
              <v-form v-model="valid" @submit.prevent="login">
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
                />

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
                  required
                >
                  <template v-slot:append>
                    <v-icon tabindex="-1" @click="showPassword = !showPassword">
                      {{ showPassword ? "far fa-eye" : "far fa-eye-slash" }}
                    </v-icon>
                  </template>
                </v-text-field>

                <v-btn
                  type="submit"
                  block
                  id="login-pass"
                  class="text-none"
                  color="green darken-3"
                  elevation="0"
                  :disabled="!valid"
                  :loading="loggingIn"
                  :dark="valid"
                >
                  <v-icon left>fas fa-sign-in-alt</v-icon>
                  {{ $t("login.loginButton") }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <site-icons style="z-index: 3"></site-icons>
  </v-main>
</template>

<script>
import authenticationMixin from "../mixins/authenticationMixin";
import LangButtons from "../components/partial/LangButtons";
import { mapState } from "vuex";
import SiteIcons from "@/components/partial/SiteIcons";
import GlobalAlertNotification from "@/components/partial/GlobalAlertNotification";
import config from "@/config";
export default {
  name: "Login",
  components: {
    GlobalAlertNotification,
    SiteIcons,
    LangButtons,
  },
  mixins: [authenticationMixin],
  data() {
    return {
      tab: null,
      loggingIn: false,
      loggingInIdCard: false,
      valid: true,
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
      imageId: 0,
      config,
    };
  },

  created() {
    window.addEventListener("keyup", this.handleKeyUp);
    this.changeImage();
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyUp);
  },

  computed: {
    ...mapState("settings", ["bodyColor"]),
    mainCss() {
      return {
        backgroundImage: `linear-gradient(
    to top right,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(0, 0, 0, 0.5) 100%
  ),url(${require("../assets/img/login_background.jpg")})`,
        transition: "background 5s ease-in-out",
      };
    },
  },

  methods: {
    login() {
      if (this.valid && !this.loggingIn) {
        this.authenticate("password", {
          user: this.user.username,
          pwd: this.user.password,
        });
      }
    },
    handleKeyUp(event) {
      if (this.tab === 1 && (event.key === "Enter" || event.keyCode === 13))
        this.login();
    },
    changeImage() {
      if (this.images.length > 1) {
        setInterval(() => {
          if (this.imageId >= this.images.length - 1) this.imageId = 0;
          else this.imageId++;
        }, this.imageInterval);
      }
    },
    getOrcidLoginUrl() {
      return process.env.VUE_APP_ORCID_LOGIN_URL;
    },
  },
};
</script>

<style>
.gradient {
  /* height: 100%; */
  /* width: 100%; */
  /* position: absolute; */
  /* z-index: 1; */
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
  font-size: 3.5rem;
  font-weight: 600;
  /* text-shadow: 1px 1px 2px #000; */
}
</style>
