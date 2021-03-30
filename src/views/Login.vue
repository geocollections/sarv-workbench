<template>
  <v-main
    class="login"
    :style="{
      backgroundImage: `url('${image}')`,
      transition: 'background 5s ease-in-out'
    }"
  >
    <lang-buttons v-if="$route.meta.isLogin" style="z-index: 3" />
    <div class="gradient"></div>
    <v-container fill-height style="padding-bottom: 80px;">
      <v-row align="center" justify="center">
        <v-col sm="10" md="8" lg="6" xl="4" style="margin: 48px 0;">
          <div class="sarv-title">{{ $t("header.title") }}</div>

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
            </v-tabs>

            <v-tabs-items v-model="tab">
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
    <site-icons style="z-index: 3"></site-icons>
    <!--  Load in background images  -->
    <!--    <img-->
    <!--      :src="`${$constants.IMAGE_URL}/img/sarv-edit/background_1.jpg`"-->
    <!--      alt="background_image_1"-->
    <!--      v-show="false"-->
    <!--    />-->
    <img
      :src="`${$constants.IMAGE_URL}/img/sarv-edit/background_2.jpg`"
      alt="background_image_2"
      v-show="false"
    />
    <!--    <img-->
    <!--      :src="`${$constants.IMAGE_URL}/img/sarv-edit/background_3.jpg`"-->
    <!--      alt="background_image_3"-->
    <!--      v-show="false"-->
    <!--    />-->
    <!--    <img-->
    <!--      :src="`${$constants.IMAGE_URL}/img/sarv-edit/background_4.jpg`"-->
    <!--      alt="background_image_4"-->
    <!--      v-show="false"-->
    <!--    />-->
  </v-main>
</template>

<script>
import authenticationMixin from "../mixins/authenticationMixin";
import LangButtons from "../components/partial/LangButtons";
import { mapState } from "vuex";
import SiteIcons from "@/components/partial/SiteIcons";
import GlobalAlertNotification from "@/components/partial/GlobalAlertNotification";
import DevNotification from "@/components/partial/DevNotification";

export default {
  name: "Login",
  components: {
    DevNotification,
    GlobalAlertNotification,
    SiteIcons,
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
    idError: false,
    imageId: 0,
    images: [
      // "/img/sarv-edit/background_1.jpg",
      "/img/sarv-edit/background_2.jpg"
      // "/img/sarv-edit/background_3.jpg",
      // "/img/sarv-edit/background_4.jpg"
    ],
    imageInterval: 60000
  }),

  created() {
    window.addEventListener("keyup", this.handleKeyUp);
    this.changeImage();
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyUp);
  },

  computed: {
    ...mapState("settings", ["bodyColor"]),
    image() {
      console.log(this.$constants.IMAGE_URL);
      return this.$constants.IMAGE_URL + this.images[this.imageId];
    }
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
    },
    changeImage() {
      if (this.images.length > 1) {
        setInterval(() => {
          if (this.imageId >= this.images.length - 1) this.imageId = 0;
          else this.imageId++;
        }, this.imageInterval);
      }
    }
  }
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
