import { BASE_KEY } from '~/static/api'

export const state = () => ({
  curData: []
})

export const getters = {
  getCurData (state) {
    return state.curData
  }
}

export const mutations = {
  setCurData (state, data) {
    console.log('пришедшая инфа')
    console.log(data)
    console.log('до')
    console.log(state.curData)
    state.curData = data
    console.log('в итоге')
    console.log(state.curData)
  }
}

export const actions = {
  async loadCurData ({ commit }) {
    try {
      const res = await this.$axios.$get(
        `https://currate.ru/api/?get=currency_list&key=${BASE_KEY}`
      )

      if (res.status === '200') {
        commit('setCurData', res.data)
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('ОШИБКА В ЗАПРОСЕ', e.message)
      return false
    }
  }
}
