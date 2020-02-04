<template src="./Base.html" />

<script>
import Search from '../Search/Search.vue'
import ShopsTable from '../ShopsTable/ShopsTable.vue'
import StockSelector from '../StockSelector/StockSelector.vue'

export default {
  components: {
    'stock-selector': StockSelector,
    'search-bar': Search,
    'shops-table': ShopsTable,
  },
}
</script>
