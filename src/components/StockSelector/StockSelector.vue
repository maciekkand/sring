<template src="./StockSelector.html"></template>

<script>
import { stocksToBuy } from '../../data/data'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      selected: [],
      options: stocksToBuy,
    }
  },
  computed: mapState({
    showSelector: state => state.showTable,
    selectedShops: state => state.selectedShops,
    selectedStocks: state => state.selectedStocks
  }),
  methods: {
    resetStock() {
      console.log('resetStock')

      this.selected = []
      this.$store.dispatch('getStock', [])
    },
    stockSelected() {
      setTimeout(() => {
        let suma = 0
        this.$store.dispatch('getStock', this.selected)
        selectedShops.forEach(shop => {
          selectedStocks.forEach(stock => (suma += shop[stock]))
          shop.total = suma
          suma = 0
        })

        this.$store.dispatch('addTotal', selectedShops)
      }, 0)
    }
  }
}
</script>

<style scoped>
div {
  color: white
}
</style>
