const path = require("path");
const { inspect } = require("util");

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [
    //"../stories/2-qa/**/*.stories.@(ts|tsx)",
    // "../stories/Button.stories.@(ts|tsx)",
    "../stories/**/*.stories.@(ts|tsx)",
    // "../stories/**/*.stories.@(ts|tsx)"
    // "../stories/**/projectTester.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    {name: "storybook-addon-turbo-build", options: {optimizationLevel: 3}}
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of "DEVELOPMENT" or "PRODUCTION"
    // You can change the configuration based on that.
    // "PRODUCTION" is used when building the static version of storybook.
    //console.log(config, JSON.stringify(config.module.rules));
    return {
      ...config,
      output: {
        ...config.output,
        //Added for https://github.com/storybookjs/storybook/issues/13371#issuecomment-804030789
        filename: "[name].bundle.js"
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          { test: /\.s[ac]ss$/, use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"] },
          // {
          //   // Extract any CSS content and minimize
          //   test: /\.css$/,
          //   use: [
          //     "style-loader",
          //     { loader: 'css-loader', options: { importLoaders: 1 } },
          //     { loader: 'postcss-loader' }
          //   ]
          // },
          // { test: /\.(ts|tsx)$/, use: [{ loader: "ts-loader" }] },
          //https://github.com/privatenumber/esbuild-loader#readme
          { test: /\.(ts|tsx)$/, use: [{
              loader: "esbuild-loader",
              options: {loader: "tsx", target: "es2015"}
            }]
          },
        ]
      },
      resolve: {
        ...config.resolve,
        extensions: [...config.resolve.extensions, ".ts", ".tsx"],
        modules: [...config.resolve.modules, "/src"],
      },
      plugins: [
        ...config.plugins,
      ],
      node: {
        ...config.node,
      }
    };
  }
};
