let currentPage = null

module.exports = {
  set: (page) => { currentPage = page },
  get: () => currentPage
}
