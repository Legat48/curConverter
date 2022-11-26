export default function ({ store, app }) {
  let errorMessage = app.$cookies.get('error')
  if (!errorMessage) { errorMessage = 'Ошибок нет или она не опознана' }
  store.commit('cur/setErrorMessage', errorMessage)
  app.$cookies.remove('error')
}
