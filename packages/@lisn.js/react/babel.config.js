const commonPresets = [
  [
    "@babel/preset-typescript",
    {
      allowDeclareFields: false,
    },
  ],
  [
    "@babel/preset-env",
    {
      modules: false,
      bugfixes: true,
      useBuiltIns: false,
    },
  ],
];
const commonPlugins = [["@babel/plugin-transform-export-namespace-from", {}]];
const commonOpts = {
  sourceMaps: true,
};

export default {
  env: {
    esm: {
      presets: [...commonPresets],
      plugins: commonPlugins,
      ...commonOpts,
    },
    cjs: {
      presets: [...commonPresets],
      plugins: [["@babel/plugin-transform-modules-commonjs"], ...commonPlugins],
      ...commonOpts,
    },
  },
};
