import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const rows = [
  {
    title: '一、看拼音写汉字',
    pinyin: 'ē é ě è ī í ǐ ì',
    character: '这里是汉字'
  }
]
const deepCopy = obj => JSON.parse(JSON.stringify(obj))
// 初始化存储数据
const state = {
  rows
}

// 本地存储
const storage = window.localStorage
const storageKey = 'pinyin'

// 从storage加载state数据
Object.assign(state, JSON.parse(storage.getItem(storageKey)))

// 通过插件订阅state的每一次更改，在更改的时候保存我们感兴趣的mutations
const storagePlugin = store => {
  store.subscribe((mutation, {dataLeft, dataRight, rows}) => {
    storage.setItem(storageKey, JSON.stringify({dataLeft, dataRight, rows}))
  })
}

const mutations = {
  saveData (state, {dataLeft, dataRight}) {
    Object.assign(state, {dataLeft, dataRight})
  },
  rows (state, value) {
    state.rows = value
  }
}
const getters = {
  rows (state) {
    return state.rows
  }
}

const actions = {
  restore ({commit}) {
    commit('rows', deepCopy(rows))
  },
  saveRows ({commit}, value) {
    commit('rows', value)
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  plugins: [storagePlugin],
  actions
})

export default store
