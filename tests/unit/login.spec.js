import Vue from "vue";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import Vuetify from "vuetify";

import Login from "../../src/views/Login";

import { createLocalVue, shallowMount } from "@vue/test-utils";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VueI18n);
Vue.use(Vuetify);

describe("Login.vue", () => {
  const messages = {
    en: require("@/translations/en"),
    ee: require("@/translations/ee")
  };

  let router;
  let vuetify;
  let i18n;

  beforeEach(() => {
    router = new VueRouter();
    vuetify = new Vuetify();
    i18n = new VueI18n({
      locale: "ee", // Value from localStorage
      fallbackLocale: "en",
      silentTranslationWarn: process.env.NODE_ENV === "production",
      messages
    });
  });

  it("is a Vue instance", () => {
    const wrapper = shallowMount(Login, {
      localVue,
      vuetify,
      router,
      i18n
    });
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it("has username text field", () => {
    const wrapper = shallowMount(Login, {
      localVue,
      vuetify,
      router,
      i18n
    });
    expect(wrapper.find("#username-field").exists()).toBeTruthy();
  });

  it("has password text field", () => {
    const wrapper = shallowMount(Login, {
      localVue,
      vuetify,
      router,
      i18n
    });
    expect(wrapper.find("#password-field").exists()).toBeTruthy();
  });

  it("has ID login button", () => {
    const wrapper = shallowMount(Login, {
      localVue,
      vuetify,
      router,
      i18n
    });
    expect(wrapper.find("#login-id").text()).toEqual("LOGI SISSE");
  });

  it("has password login button", () => {
    const wrapper = shallowMount(Login, {
      localVue,
      vuetify,
      router,
      i18n
    });
    expect(wrapper.find("#login-pass").text()).toEqual("LOGI SISSE");
  });
});
