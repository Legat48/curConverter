export default async function ({ store, redirect, app }) {
  // используются куки для ограничения кол-ва запросов в достаточно кривое API
  let date = new Date()
  date = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
  const cookieRes = app.$cookies.get('curDate')
  if (cookieRes) {
    if (date === cookieRes) {
      const curObj = {
        date: cookieRes,
        curArr: [],
        curPairArr: [],
        curValue: {}
      }
      curObj.curArr = app.$cookies.get('curArr')
      curObj.curPairArr = app.$cookies.get('curPairArr')
      curObj.curValue = app.$cookies.get('curValue')
      store.commit('cur/setCurData', curObj)
      return
    }
  }
  const res = await store.dispatch('cur/loadCurData')
  if (!res) {
    // передача ошибки идет через куки, так как стор обновляется при редиректе в SSR из мидлваров
    // пока это лучшее решение, ищу другое
    app.$cookies.set('error', JSON.stringify(store.getters['cur/getErrorMessage']))
    redirect('/error')
    return
  }
  const curData = store.getters['cur/getCurData']
  app.$cookies.setAll([
    {
      name: 'curDate',
      value: JSON.stringify(curData.date)
    },
    {
      name: 'curArr',
      value: JSON.stringify(curData.curArr)
    },
    {
      name: 'curPairArr',
      value: JSON.stringify(curData.curPairArr)
    },
    {
      name: 'curValue',
      value: JSON.stringify(curData.curValue)
    }
  ])
}
