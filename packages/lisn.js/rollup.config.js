import path from "path";

import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import strip from "@rollup/plugin-strip";
import resolve from "@rollup/plugin-node-resolve";

const projectRootDir = import.meta.dirname;
const customResolver = resolve({
  extensions: [".ts", ".js"],
});

const srcRoot = "src/ts";
const outDir = "../@lisn.js/bundles/";

import pkgJson from "./package.json" with { type: "json" };
const banner = `/*!
 * LISN.js v${pkgJson.version}
 * (c) ${new Date().getFullYear()} @AaylaSecura
 * Released under the MIT License.
 */`;

const getBabelConf = () => {
  return {
    presets: [
      ["@babel/preset-typescript"],
      [
        "@babel/preset-env",
        {
          modules: false,
          bugfixes: true,
          useBuiltIns: false,
        },
      ],
    ],
    plugins: [
      // for some reason when using the rollup babel plugin, this
      // needs to be explicitly added to babel plugins...
      [
        "@babel/plugin-transform-typescript",
        {
          allowDeclareFields: false,
        },
      ],
      ["@babel/plugin-transform-export-namespace-from", {}],
    ],
    babelHelpers: "bundled",
    extensions: [".ts"],
    sourceMaps: true,
  };
};

const getExternals = (isDev = false) => {
  if (!isDev) {
    return ["socket.io-client"];
  } else {
    return [];
  }
};

const getGlobals = (isDev = false) => {
  return isDev
    ? {}
    : {
        "socket.io-client": "{ io: null }",
      };
};

const getOutputOptions = ({ format, build, isDev } = {}) => {
  const suffix = `${build ? "." + build : ""}${format === "iife" ? "" : "." + format}`;
  return {
    name: "LISN",
    // Extend is needed so that LISN is assigned to the global object and so
    // JEST can "import" it from the IIFE bundle
    extend: isDev,
    sourcemap: true,
    globals: getGlobals(isDev),
    file: `${outDir}/lisn${suffix}.js`,
    format: format,
    inlineDynamicImports: true,
    banner,
  };
};

const getConfig = ({ format, build, isDev } = {}) => {
  return {
    input: `${srcRoot}/bundle${build ? "-" + build : ""}.ts`,
    output: getOutputOptions({ format, build, isDev }),
    external: getExternals(isDev),
    plugins: [
      alias({
        entries: [
          ...(isDev
            ? []
            : [
                {
                  find: "@lisn/debug/debug",
                  replacement: path.resolve(
                    projectRootDir,
                    "src/ts/debug/dummy.ts",
                  ),
                },
              ]),
          {
            find: "@lisn",
            replacement: path.resolve(projectRootDir, srcRoot),
          },
        ],
        customResolver,
      }),
      resolve({ browser: true }),
      babel(getBabelConf()),
      ...(isDev
        ? []
        : [
            strip({
              include: "**/*.(mjs|cjs|js|ts)",
              labels: ["debug"],
            }),
          ]),
    ],
  };
};

// ------------------------------

export default [
  getConfig({ format: "iife" }),
  getConfig({ format: "iife", build: "essentials" }),
  getConfig({ format: "iife", build: "slim" }),
  getConfig({ format: "iife", build: "debug", isDev: true }),
  getConfig({ format: "es" }),
  getConfig({ format: "es", build: "essentials" }),
  getConfig({ format: "es", build: "slim" }),
];
