module.exports = Ferdi => class icloudnotes extends Ferdi {
  modifyRequestHeaders() {
    return [{
      // Adding an origin header for all http requests from this recipe
      headers: { 'origin': 'https://www.icloud.com' },
      requestFilters: {
        urls: ['*://*/*']
      }
    }]
  }
};
