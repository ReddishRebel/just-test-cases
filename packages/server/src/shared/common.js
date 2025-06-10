/** @param {String} path */
const isModuleAvailable = path => {
  try {
    require.resolve(path);
    return true;
  } catch {
    return false;
  }
};

module.exports = { isModuleAvailable };
