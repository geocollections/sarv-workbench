module.exports = {
  // Disable source viewing in production
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  parallel: import.meta.env.CI ? +import.meta.env.CIRCLE_NODE_TOTAL : undefined,
  devServer: {
    allowedHosts: "all",
  },
};
