import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const rows = [
  {
    title: '一、看拼音写词语',
    pinyin: 'kàn pīn yīn xiě cí yǔ',
    character: '看拼音写词语'
  },
  {
    title: '二、反义词',
    pinyin: 'rì  huǒ  dì  lái',
    character: '日 火 地 来'
  },
  {
    title: '三、组词',
    pinyin: 'xuě  fēng',
    character: '雪 风'
  }
]
const col = 7
const deepCopy = obj => JSON.parse(JSON.stringify(obj))
// 初始化存储数据
const state = {
  rows,
  col
}

// 本地存储
const storage = window.localStorage
const storageKey = 'pinyin'

// 从storage加载state数据
Object.assign(state, JSON.parse(storage.getItem(storageKey)))

// 通过插件订阅state的每一次更改，在更改的时候保存我们感兴趣的mutations
const storagePlugin = store => {
  store.subscribe((mutation, state) => {
    storage.setItem(storageKey, JSON.stringify(state))
  })
}

const mutations = {
  rows (state, value) {
    state.rows = value
  },
  col (state, value) {
    state.col = value
  }
}
const getters = {
  rows (state) {
    return state.rows
  },
  col (state) {
    return state.col
  }
}

const actions = {
  restore ({commit}) {
    commit('rows', deepCopy(rows))
    commit('col', col)
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
