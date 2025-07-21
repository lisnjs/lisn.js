/* eslint-disable @typescript-eslint/no-unused-vars */
const MY_IP_ADDRESS = window.location.hostname;
const MY_REMOTE_LOGGER_PORT = "9000";
LISN.settings.verbosityLevel = 10;
LISN.settings.remoteLoggerURL = `http://${MY_IP_ADDRESS}:${MY_REMOTE_LOGGER_PORT}`;
LISN.settings.remoteLoggerOnMobileOnly = false;
LISN.settings.scrollbarOnMobile = true;
