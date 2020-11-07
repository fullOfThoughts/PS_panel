import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    list: [
      { name: "AI", type: 'primary', router: "/home" },
      { name: "magnify", type: 'info', router: "/magnify" },
      { name: "corona", type: "info", router: "/corona" },
      { name: "CD", type: 'info', router: "/cd" }

    ]
  },
  mutations: {
    change (state, path) {
      state.list.forEach(item => {
        if (path === item.router) {
          item.type = 'primary'
        } else {
          item.type = 'info'
        }
      })
    }
  },
  actions: {

  }
})