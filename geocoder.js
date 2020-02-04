/*
Apka koszyk ma wyświetlać sklepy w zadanym promieniu od zadanego miejsca zamieszkania
Podaje się miasto, ulice, nr domu i odległość w setkach metrów
Dostaje się tabelę sklepów z ceną do 20 wybranych towarów i ich sumą
Prócz tego linka do jakdojade i gugiel mapy z markerami

Lista sklepów ściągana jest juz po wybraniu nazwy miasta
Dalsze filtrowanie więc odbywa się we frontendzie

Instrukcja obsługi niniejszego pliku:
1. Wypełnij pola const city i const shopName
2. Odpal tylko filteredShops() i sprawdź shopsFiltered.json
3. Odpal tylko fillGaps() i sprawdź shopsFinal.json

Formatowanie JSONów: ctrl + shift + f
*/

/* TODO:
   Odfiltorwać po adresie (ulica + numer domu) zdublowane sklepy

  _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
   [{ 'x': 1 }, { 'x': 2 }]

  https://lodash.com/docs/4.17.11#uniq
*/

const fs = require('fs')
const _ = require('lodash')
const axios = require('axios')

const fileFrom = '../data/zabki_gdabsk.json'
const fileTo = '../data/zabki_gdansk_final.json'
const city = ''
const shopName = 'Żabka'

const key = '224e8e01cf8f43a0aabb1b68341904a1'
const fileShopsFromOverpass = './shopsFromOverpass.json'
const fileShopsFiltered = './shopsFiltered.json'
const fileShopsFinal = './shopsFinal.json'
const fileShopsFinalId = './shopsFinalId.json'

// Losowe ceny produktów dopisywane do każdego sklepu
const prices = () => {
  const obj = {}

  obj.chleb = _.random(4, 7)
  obj.maslo = _.random(4, 8)
  obj.ser = _.random(16, 32)
  obj.jajko = _.random(1, 2)
  obj.szynka = _.random(25, 40)
  obj.kielbasa = _.random(12, 20)
  obj.cukier = _.random(3, 6)
  obj.mleko = _.random(2, 5)
  obj.smietana = _.random(4, 8)
  obj.mineralna = _.random(1, 2)

  const total = Object.values(obj).reduce((previous, item) => {
    return previous + item
  }, 0)

  obj.total = total.toFixed(2)

  return obj
}

// Na podstawie lat i lon, znajdowany jest adres i całość zapisywana w gotoweSklepyBezAdresu.json
function getAddress(lat = 52.2472828, lon = 21.0568093) {
  const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + lon + '&key=' + key

  //console.log('url', url)
  //debugger;

  axios.get(url)
    .then(res => {
      const obj = {
        shopName,
        city,
        address: res.data.results[0].formatted,
        lat,
        lon,
      }

      const fullObj = Object.assign({}, obj, prices())
      //console.log('obj', obj)
      //console.log('fullObj', fullObj)

      fs.appendFileSync(fileShopsFinal, JSON.stringify(fullObj) + ',')
    })
    .catch(err => console.log('Buont getAddress: ', err))
}

// Na podstawie adresu, znajdowany jest lat i lon, a całość zapisywana jest w gotoweSklepyZGPS.json
function getGPS(address, city) {
  const encodedAdres = encodeURI(address + ', ' + city)
  const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + encodedAdres + '&key=' + key + '&language=pl&pretty=1'

  axios.get(url)
    .then(res => {
      const obj = {
        shopName,
        city,
        address,
        lat: res.data.results[0].geometry.lat,
        lon: res.data.results[0].geometry.lng,
      }

      const fullObj = Object.assign({}, obj, prices())
      //console.log('fullObj', fullObj)

      fs.appendFileSync(fileShopsFinal, JSON.stringify(fullObj) + ',')
    })
    .catch(err => console.log('Buont getGPS: ', err))
}

// Obiekt jest okrajany do zawartości: lat, lon, street, housenumber
function filteredShops() {
  let obj = {}
  const arr = []
  const shopsFromOverpass = fs.readFileSync(fileShopsFromOverpass, 'utf8')
  const shopsFromOverpassObj = JSON.parse(shopsFromOverpass)

  shopsFromOverpassObj.map((el) => {
    el.lat ? obj.lat = el.lat : null
    el.lon ? obj.lon = el.lon : null

    if (el.tags && el.tags['addr:street'] && el.tags['addr:housenumber']) {
      obj.address = el.tags['addr:street'] + ' ' + el.tags['addr:housenumber']
    }

    if (Object.keys(obj).length !== 0) {
      obj.shopName = shopName
      obj.city = city
      arr.push(obj)
    }

    obj = {}
  })

  const shopsList = JSON.stringify(arr)
  fs.writeFileSync(fileShopsFiltered, shopsList)
  //return shopsList
}

// Uzupełaniane jest brak adresu lub gps'ów
function fillGaps() {
  const shopsFiltered = fs.readFileSync(fileShopsFiltered, 'utf8')
  const shopsFilteredObj = JSON.parse(shopsFiltered)

  shopsFilteredObj.map(el => {
    if (Object.keys(el).length === 0) { }

    else if (!el.lat || !el.lon) {
      getGPS(el.address, el.city)
    }

    else if (!el.address) {
      getAddress(el.lat, el.lon)
    }

    else {
      const obj = {
        shopName,
        city,
        address: el.address,
        lat: el.lat,
        lon: el.lon
      }

      const fullObj = Object.assign({}, obj, prices())
      console.log('fullObj', fullObj)

      fs.appendFileSync(fileShopsFinal, JSON.stringify(fullObj) + ',')
    }
  })
}

function addId() {
  const shopsFinal = fs.readFileSync(fileShopsFinal, 'utf8')
  const shopsFinalObj = JSON.parse(shopsFinal)

  console.log('183. shopsFinalObj = ', shopsFinalObj)

  const shopsFinalId = shopsFinalObj.map((el, index) => {
    el.id = index
    return el
  })

  console.log('187. shopsFinalId', shopsFinalId)

  fs.appendFileSync(fileShopsFinalId, JSON.stringify(shopsFinalId))
}

function filtrujMiasto(miasto) {
  const shops = fs.readFileSync(fileFrom, 'utf8')
  const shopsObj = JSON.parse(shops)

  // console.log('shopsObj = ', shopsObj)

  const shopsFinal = shopsObj.filter(el => el.city === miasto )

  console.log('187. shopsFinal', shopsFinal)

  fs.appendFileSync(fileTo, JSON.stringify(shopsFinal))
}

//console.log(filteredShops())  // odpal najpierw ten, komentując kolejny
//filteredShops()  // odpal najpierw ten, komentując kolejny
//fillGaps()
//getAddress()

//addId()
filtrujMiasto('Gdańsk')
