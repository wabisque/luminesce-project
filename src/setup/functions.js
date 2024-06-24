/**
 * @param {boolean} condition
 * @param {Error} error
 */
globalThis.throwIf = function(condition, error) {
  if(condition) {
    throw error;
  }
};
