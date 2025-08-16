/**
 * @module Effects/Triggers
 *
 * @since v1.3.0
 */

export type FXTrigger = "XXX TODO";

// static createTrigger(): FXTriggerPair {
//   let resolve: (data: FXStateUpdate) => void;
//
//   const nextPromise = () =>
//     MH.newPromise<FXStateUpdate>((r) => (resolve = r));
//
//   const trigger: FXTrigger = async function* () {
//     while (true) {
//       yield await nextPromise();
//     }
//   };
//
//   const sendUpdate = (data: FXStateUpdate) => resolve(data);
//
//   return { trigger, sendUpdate };
// }
//
