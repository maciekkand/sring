import constants from '../data/constants'

export default (homeGPSAndAddress, radius, allShops) => {
  const toRad = x => x * Math.PI / 180

  const distance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const x1 = lat2 - lat1
    const dLat = toRad(x1)
    const x2 = lon2 - lon1
    const dLon = toRad(x2)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c * 1000)
  }

  const shopsInRadius = allShops.filter(el => {
    el.distance = distance(el.lat, el.lon, homeGPSAndAddress.lat, homeGPSAndAddress.lon)
    return el.distance < radius
  })

  const shopsInRadiusWithJakD = shopsInRadius.map(el => {
    let link = constants.JAKDOJADE
    link += `${homeGPSAndAddress.city}/trasa/?fn=`
    link += encodeURI(`${homeGPSAndAddress.street} ${homeGPSAndAddress.streetNumber}`)
    link += '&tn='
    link += encodeURI(el.address)
    link += '&tc='
    link += `${el.lat}:${el.lon}`
    link += '&fc='
    link += `${homeGPSAndAddress.lat}:${homeGPSAndAddress.lon}`
    link += '&ft=LOCATION_TYPE_ADDRESS&tt=LOCATION_TYPE_ADDRESS&d='
    link += `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear() - 2000}`
    link += '&h='
    link += `${new Date().getHours()}:${new Date().getMinutes()}`
    link += '&aro=1&t=1&rc=3&ri=1&r=0&stopsLayer=true'

    el.jakd = `<a href=${link} target="_blank">jakDojade</a>`
    return el
  })

  const shopsInRadiusWithJakDAndGmaps = shopsInRadiusWithJakD.map(el => {
    let link = constants.GOOGLE_MAPS
    link += encodeURI(`${homeGPSAndAddress.street}+${homeGPSAndAddress.streetNumber}+${homeGPSAndAddress.city}`)
    link += '/'
    link += encodeURI(`${el.address} ${el.city}`)

    el.gmaps = `<a href=${link} target="_blank">GMaps</a>`
    return el
  })

  return shopsInRadiusWithJakDAndGmaps
}

