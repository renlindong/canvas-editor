import Vue from 'vue'
import Vuex from 'vuex'

import psd from "./modules/psd";


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    psd
  }
})
