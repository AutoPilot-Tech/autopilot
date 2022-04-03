import amplitude from "amplitude-js";

const API_KEY = 'xd';

amplitude.getInstance().init(API_KEY, null, {
// optional configuration options
  includeUtm: true,
  includeGclid: true,
  includeReferrer: true,
});
export { amplitude };