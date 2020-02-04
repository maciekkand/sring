<template src="./Search.html"></template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      city: '',
      street: '',
      streetNumber: '',
      radius: '',
      cities: [
        { text: 'Warszawa', value: 'warszawa' },
        { text: 'Kraków', value: 'krakow' },
        { text: 'Gdańsk', value: 'gdansk' },
      ],
      showAlert: false,
    }
  },
  computed: mapState({
    loading: state => state.loading,
    allShops: state => state.allShops

  }),
  created() {
    if (sessionStorage.getItem('homeData')) {
      const homeData = JSON.parse(sessionStorage.getItem('homeData'))
      this.city = homeData.city
      this.street = homeData.street
      this.streetNumber = homeData.streetNumber
    }
  },
  methods: {
    search() {
      if (!this.city) return this.$refs.modalCity.show()
      if (!this.street) return this.$refs.modalStreet.show()
      if (!this.radius) return this.$refs.modalRadius.show()

      this.$store.dispatch('addAllShops')

      const homeData = {
        city: this.city,
        street: this.street,
        streetNumber: this.streetNumber
      }

      sessionStorage.setItem('homeData', JSON.stringify(homeData))

      const radius = this.radius
      const allShops = this.$store.getters.getAllShops
      const selectedStocks = this.$store.getters.getStocksSelected

      this.$store.dispatch('findSelectedShops', { homeData, radius, allShops })
      this.$store.dispatch('showLoader', true)
      this.$store.dispatch('getStock', selectedStocks)

      const selectedShops = this.$store.getters.getSelectedShops
      this.$store.dispatch('addTotal', selectedShops)
    },
    hideModalCity() {
      this.$refs.modalCity.hide()
    },
    hideModalStreet() {
      this.$refs.modalStreet.hide()
    },
    hideModalRadius() {
      this.$refs.modalRadius.hide()
    },
    reset() {
      this.city = ''
      this.street = ''
      this.streetNumber = ''
      this.radius = 500

      this.$store.dispatch('toggleCheckboxes')
      this.$store.dispatch('showTable', false)
    }
  }
}
</script>
