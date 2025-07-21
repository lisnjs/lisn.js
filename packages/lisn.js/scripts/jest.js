// To change env vars, use e.g. npm run --verbosity=10 --coverage=false --use-min=false test:unit

import { execSync } from "child_process";

const verbosityLevel = process.env.npm_config_verbosity ?? "0";
const useMin = process.env.npm_config_use_min === "true";
const coverage = !useMin || process.env.npm_config_coverage === "true";

const command = `npx jest --globals='{"verbosityLevel": ${verbosityLevel}, "useMinVersion": ${useMin}}' --coverage=${coverage}`;

console.log(command);
execSync(command, { stdio: [0, 1, 2] });
