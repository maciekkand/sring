<template src="./ShopsTable.html"></template>

<script>
export default {
  computed: {
    items() {
      return this.$store.getters.getSelectedShops
    },
    fields() {
      return this.$store.getters.getStock
    },
    loading() {
      return this.$store.getters.getLoading
    }
  },
  created() {
    this.$store.dispatch('addAllShops')
  },
  methods: {
    showTable() {
      return this.$store.getters.getShowTable
    }
  }
}
</script>

<style>
  #stockTable {
    background: url('../../assets/blur_7_dark_low_brightness_70procent.jpg') center center fixed;
    color: white
  }

  .table-hover tbody tr:hover {
    background-color: #616161;
    color: white
  }

  a {
    color: #abe5ff;
    text-decoration: none;
  }

</style>

