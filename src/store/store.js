import Vue from 'vue'
import Vuex from 'vuex'
import { ajaxAddAllShops, ajaxFindSelectedShops } from '../services/ajax'
import { initialColumns, totalColumn } from '../data/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allShops: [],
    allShopsCopy: [],
    selectedShops: [],
    items: [],
    fields: [],
    stocksSelected: [],
    showSelector: false,
    showTable: false,
    loading: false
  },
  getters: {
    getAllShops(state) {
      return state.allShops
    },
    getAllShopsCopy(state) {
      return state.allShopsCopy
    },
    getSelectedShops(state) {
      return state.selectedShops
    },
    getStock(state) {
      return state.fields
    },
    getStocksSelected(state) {
      return state.stocksSelected
    },
    getShowTable(state) {
      return state.showTable
    },
    getLoading(state) {
      return state.loading
    }
  },
  mutations: {
    ADD_ALL_SHOPS(state, allShops) {
      state.allShops = allShops
      state.allShopsCopy = allShops
    },
    FIND_SELECTED_SHOPS(state, shopsInRadius) {
      if (!shopsInRadius.length) {
        state.stocksSelected = []
      }

      state.selectedShops = shopsInRadius
    },
    GET_STOCK(state, columns) {
      if (columns.stocksSelected.length) {
        state.fields = initialColumns.concat(totalColumn).concat(columns.stocksSelected)
      }
      else {
        state.fields = initialColumns.concat(columns.stocksSelected)
      }

      state.stocksSelected = columns.stocksSelected
    },
    TOGGLE_CHECKBOXES(state) {
      state.stocksSelected = []
    },
    SHOW_TABLE(state, bool) {
      state.fields = initialColumns
      state.showTable = bool
    },
    SHOW_LOADER(state, bool) {
      state.loading = bool
    }
  },
  actions: {
    addAllShops(context) {
      ajaxAddAllShops(context)
    },
    findSelectedShops(context, { homeData, radius, allShops }) {
      ajaxFindSelectedShops(context, { homeData, radius, allShops })
    },
    getStock(context, stocksSelected) {
      context.commit('GET_STOCK', { initialColumns, stocksSelected })
    },
    addTotal(context, shopsWithTotal) {
      context.commit('ADD_ALL_SHOPS', shopsWithTotal)
    },
    toggleCheckboxes(context) {
      context.commit('TOGGLE_CHECKBOXES')
    },
    showTable(context, bool) {
      context.commit('SHOW_TABLE', bool)
    },
    showLoader(context, bool) {
      context.commit('SHOW_LOADER', bool)
    }
  }

})
