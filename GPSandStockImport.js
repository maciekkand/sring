/*
  Uzupełnianie listy sklepów o współrzędne GPS i listę towarów z cenami
  Można też uzupełnić je o same ceny, odpalając samą funkcję addPrices()

  1) Ściągnij ze strony www listę adresów sklepów

  2) Sformatuj ją do:

      [
      {
        "address": "Naruszewicza 30",
        "city": "Warszawa",
        "shopName": "Żabka"
      },
      (...)
      ]

   3) Podstaw jej nazwę pliku do zmiennej 'shops' poniżej

   4) Uruchom node'm ten plik, który odpali funckję addGPSAndPrices() - patrz dół pliku

   5) Skopiuj wynik czyli zawartość pliku pod zmienną shopsWithStockAndGPS do pliku
      db.json lub dbnew.json

   6) Odpal json-server db.json (lub dbnew.json)
*/

const fs = require('fs')
const _ = require('lodash')
const axios = require('axios')

const fileFrom = '../data/zabki_krakow.json'
const fileTo = '../data/zabki_krakow_final.json'
const key = '224e8e01cf8f43a0aabb1b68341904a1'

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
  obj.mineralna = _.random(1, 2)   // zmień na 'woda'

  return obj
}

function addGPSAndPrices() {
  //console.log('shops = ', shops)

  const shops = fs.readFileSync(fileFrom, 'utf8')
  const shopsObj = JSON.parse(shops)

  shopsObj.map(el => {
    const encodedAdres = encodeURI(el.address + ', ' + el.city)
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + encodedAdres + '&key=' + key + '&language=pl&pretty=1'

    axios.get(url)
      .then(res => {
        const obj = {
          shopName: el.shopName,
          city: el.city,
          address: el.address,
          lat: res.data.results[0].geometry.lat,
          lon: res.data.results[0].geometry.lng,
        }

        const fullObj = Object.assign({}, obj, prices())
        console.log('fullObj', fullObj)

        fs.appendFileSync(fileTo, JSON.stringify(fullObj) + ',')
      })
      .catch(err => console.log('Buont getGPS: ', err))
  })
}

function addPrices() {
  const shops = fs.readFileSync(fileFrom, 'utf8')
  const shopsObj = JSON.parse(shops)

  shopsObj.map(el => {
    const fullObj = Object.assign({}, el, prices())
    fs.appendFileSync (fileTo, JSON.stringify(fullObj) + ',')
  })
}

// addGPSAndPrices()
addPrices()
