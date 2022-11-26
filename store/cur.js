import { BASE_KEY, BASE_URL } from '~/static/api'
import curIconArr from '~/static/currency-icon'
export const state = () => ({
  curData: [],
  errorMessage: ''
})

export const getters = {
  getCurData (state) {
    return state.curData
  },
  getErrorMessage (state) {
    return state.errorMessage
  }
}

export const mutations = {
  setCurData (state, data) {
    state.curData = data
  },
  setErrorMessage (state, error) {
    state.errorMessage = `${error}`
  }
}

export const actions = {
  async loadCurData ({ commit }) {
    try {
      const curObj = {
        date: '',
        curArr: [],
        curPairArr: [],
        curValue: {}
      }

      let res = await this.$axios.$get(
        `${BASE_URL}api/`, {
          params: {
            get: 'currency_list',
            key: BASE_KEY
          }
        }
      )
      if (res.status !== '200' && res.status !== 200) { throw new TypeError(res.message) }
      curObj.curPairArr = res.data

      for (const item of curObj.curPairArr) {
        curObj.curArr.push(item.slice(0, 3))
        curObj.curArr.push(item.slice(3))
      }
      curObj.curArr = Array.from(new Set(curObj.curArr)).sort()
      curObj.curArr = curObj.curArr.map((e) => {
        const obg = {
          name: e
        }
        const icon = curIconArr.find(cur => cur.curName === obg.name.toLowerCase())
        if (icon) { obg.icon = icon.curIcon }
        return obg
      })
      res = await this.$axios.$get(
        `${BASE_URL}api/`, {
          params: {
            get: 'rates',
            key: BASE_KEY,
            pairs: curObj.curPairArr.join(',')
          }
        }
      )
      if (res.status !== '200' && res.status !== 200) { throw new TypeError(res.message) }
      curObj.curValue = res.data
      for (const key in curObj.curValue) {
        curObj.curValue[key] = Number(curObj.curValue[key])
      }
      const date = new Date()
      curObj.date = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
      commit('setCurData', curObj)
      return true
    } catch (e) {
      console.log('ОШИБКА В ЗАПРОСЕ БАЗЫ ДАННЫХ', e)
      commit('setErrorMessage', e)
      return false
    }
  }
}
