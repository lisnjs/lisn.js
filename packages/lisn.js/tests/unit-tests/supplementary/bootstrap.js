require("./matchers");
require("./helpers");
require("./mock");

let LISN;
if (global.useMinVersion) {
  LISN = require("@lisn-bundle").LISN;
} else {
  LISN = require("@lisn/bundle-debug");
}
window.LISN = LISN;

require("./settings");
