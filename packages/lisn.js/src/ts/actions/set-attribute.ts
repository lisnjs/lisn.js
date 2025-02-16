/**
 * @module Actions
 *
 * @categoryDescription Setting/deleting attributes
 * {@link SetAttribute} sets or deletes an attribute on the given element.
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { waitForMutateTime } from "@lisn/utils/dom-optimize";
import { camelToKebabCase } from "@lisn/utils/text";
import { validateString } from "@lisn/utils/validation";

import { Action, registerAction } from "@lisn/actions/action";

import { WidgetConfigValidatorObject } from "@lisn/widgets/widget";

/**
 * Either sets or deletes an attribute, or toggles between two values of an
 * attribute, on the given element.
 *
 * **IMPORTANT:** When constructed, it sets all given attributes on the
 * element to their _OFF_ (undone) state as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "set-attribute".
 * - Accepted string arguments: name of attribute
 * - Accepted options:
 *   - `on`: A string value for the attribute. Can be blank. Omit this option
 *     in order to have the attribute deleted when the action is done.
 *   - `off`: A string value for the attribute. Can be blank. Omit this option
 *     in order to have the attribute deleted when the action is undone.
 *
 * Note that with the HTML API you can only specify one attribute per action.
 * But of course you can add the same action multiple times per trigger. See
 * examples below.
 *
 * @example
 * This is an overview of the various combinations that you can use to set an
 * attribute to a non-empty value, a blank value or delete the attribute when
 * the action is either done or undone:
 *
 * | Specification                         | Value when done | Value when undone |
 * | ------------------------------------- | --------------- | ----------------- |
 * | @set-attr: attr, on=onVal, off=offVal | "onVal"         | "offVal"          |
 * | @set-attr: attr, on=value             | "value"         | _deleted_         |
 * | @set-attr: attr, off=value            | _deleted_       | "value"           |
 * | @set-attr: attr, on=                  | ""              | _deleted_         |
 * | @set-attr: attr, off=                 | _deleted_       | ""                |
 * | @set-attr: attr, on=value, off=       | "value"         | ""                |
 * | @set-attr: attr, on= , off=value      | ""              | "value"           |
 *
 * @example
 * This will set attribute `attrA` to `valueA-ON` and `attrB` to `valueB-ON`
 * when the element enters the viewport and set `attrA` to `valueA-OFF` and
 * `attrB` to `valueB-OFF` when it leaves the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@set-attribute: attrA, on=valueA-ON, off=valueA-OFF
 *                         @set-attribute: attrB, on=valueB-ON, off=valueB-OFF"
 * ></div>
 * ```
 *
 * @example
 * This will set attribute `attr` to `value` when the element enters the
 * viewport and _delete_ the attribute when it leaves the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@set-attribute: attr, on=value"></div>
 * ```
 *
 * @example
 * This will _delete_ attribute `attr` when the element enters the viewport and
 * set it to `value` when it leaves the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@set-attribute: attr, off=value"></div>
 * ```
 *
 * @example
 * This will set attribute `attr` to a blank value when the element enters the
 * viewport and _delete_ the attribute when it leaves the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@set-attribute: attr, on="></div>
 * ```
 *
 * @example
 * This will _delete_ attribute `attr` when the element enters the viewport and
 * set it to a blank value when it leaves the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@set-attribute: attr, off="></div>
 * ```
 *
 * @example
 * This will set attribute `attr` to `value` when the element enters the
 * viewport and set it to a blank value when it leaves the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@set-attribute: attr, on=value, off="></div>
 * ```
 *
 * @example
 * This will set attribute `attr` to a blank value when the element enters the
 * viewport and set it to `value` when it leaves the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@set-attribute: attr, on=, off=value"></div>
 * ```
 *
 * @category Setting/deleting attributes
 */
export class SetAttribute implements Action {
  /**
   * Sets the attribute to its "ON" value, or deletes it if that value is null.
   */
  readonly do: () => Promise<void>;

  /**
   * Sets the attribute to its "OFF" value, or deletes it if that value is null.
   */
  readonly undo: () => Promise<void>;

  /**
   * Toggles the attribute from its "ON" to "OFF" value or vice versa.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction(
      "set-attribute",
      (element, args, config) => {
        return new SetAttribute(element, { [args[0]]: config || {} });
      },
      configValidator,
    );
  }

  constructor(element: Element, attributes: Attributes) {
    if (!attributes) {
      throw MH.usageError("Attributes are required");
    }

    let isOn = false;

    const setAttrs = async (on: boolean) => {
      isOn = on;

      await waitForMutateTime();

      for (const attr in attributes) {
        const value = attributes[attr][on ? "on" : "off"];
        const attrName = camelToKebabCase(attr);

        if (MH.isNullish(value)) {
          MH.delAttr(element, attrName);
        } else {
          MH.setAttr(element, attrName, value);
        }
      }
    };

    this.do = () => setAttrs(true);

    this.undo = () => setAttrs(false);

    this[MC.S_TOGGLE] = () => setAttrs(!isOn);

    this.undo(); // initial state
  }
}

/**
 * Each key in the object is an attribute name. The `on` value is set when the
 * action is done and the `off` value is set when the action is undone. To set
 * the attribute to an empty value, use an empty string. To _delete_ the
 * attribute, use `null` as the value or simply omit the relevant `on` or `off`
 * key.
 *
 * **IMPORTANT:** Attribute names in camelCase are converted to kebab-case.
 * E.g. `dataFooBar` will translate to `data-foo-bar`.
 *
 * @category Setting/deleting attributes
 */
export type Attributes = Record<
  string,
  { on?: string | null; off?: string | null }
>;

// --------------------

const configValidator: WidgetConfigValidatorObject<Attributes[string]> = {
  on: validateString,
  off: validateString,
};
