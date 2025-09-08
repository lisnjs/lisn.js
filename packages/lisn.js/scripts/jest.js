// To change env vars, use e.g. npm run --verbosity=10 --debug-filter='regex' --coverage=false --use-min=false test:unit

import { execSync } from "child_process";

const verbosity = process.env.npm_config_verbosity ?? "0";
const debugFilter = process.env.npm_config_debug_filter ?? "";
const useMin = process.env.npm_config_use_min === "true";
const coverage = !useMin || process.env.npm_config_coverage === "true";

const command = `npx jest --globals='{"verbosity": ${verbosity}, "debugFilter": "${debugFilter}", "useMinVersion": ${useMin}}' --coverage=${coverage}`;

console.log(command);
execSync(command, { stdio: [0, 1, 2] });
