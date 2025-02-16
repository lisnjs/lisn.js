import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

const reserved = "['LISN']";
const bundleDir = "../@lisn.js/bundles/";

const uglify = (build, useESM = false) => {
  const suffix = (build ? "." + build : "") + (useESM ? ".es" : "");
  const input = path.resolve(bundleDir, `lisn${suffix}.js`);
  if (!existsSync(input)) {
    console.log(`No ${input}`);
    return;
  }

  const output = path.resolve(bundleDir, `lisn${suffix}.min.js`);

  console.log(`Minifying ${input}`);
  execSync(
    `npx uglify-js ${input} ` +
      `--webkit ` +
      `--compress keep_infinity=true,passes=3 ` +
      `${useESM ? "--module" : ""} ` +
      `--mangle reserved=${reserved} ` +
      `--mangle-props regex='/^_/' ` +
      `--comments /^\\/\\*!/ ` +
      `--output ${output}`,
    { stdio: [0, 1, 2] },
  );
};

for (const build of ["", "debug", "essentials", "slim"]) {
  uglify(build);
  uglify(build, true);
}
