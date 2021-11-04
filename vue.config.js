module.exports = {
  // Disable source viewing in production
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  parallel: process.env.CI ? +process.env.CIRCLE_NODE_TOTAL : undefined,
};
