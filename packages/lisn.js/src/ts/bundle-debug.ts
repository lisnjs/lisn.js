/**
 * @module
 * @ignore
 * @internal
 */

import "@lisn/bundle"; // side effects

import { settings } from "@lisn/globals/settings";
settings.verbosityLevel = 10;

export * from "@lisn/bundle";
export * as debug from "@lisn/debug/index";
export * as utils from "@lisn/utils/index";
export * as effects from "@lisn/effects/index";
export * as modules from "@lisn/modules/index";
