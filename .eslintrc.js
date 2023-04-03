module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    "vue/valid-v-slot": "off",
    "vue/no-mutating-props": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/no-reserved-component-names": "off",
    "no-unused-vars": "off",
  },
};
