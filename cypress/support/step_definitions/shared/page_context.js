let currentPage = null

module.exports = {
  set: (page) => { currentPage = page },
  get: () => {
    if (!currentPage) throw new Error('Nenhum Page Object ativo. Chame context.set(page) no step Dado.')
    return currentPage
  }
}
