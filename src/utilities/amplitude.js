import amplitude from "amplitude-js";

const API_KEY = 'd63e5936e1eda3b8d5a64cc3737a856e';

amplitude.getInstance().init(API_KEY, null, {
// optional configuration options
  includeUtm: true,
  includeGclid: true,
  includeReferrer: true,
});
export { amplitude };