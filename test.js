const axios = require('axios')
const fs = require('fs')
const fileSave = './zabkiTylko.json'
const _ = require('lodash')

// let from = 418  // 6227
// let to = 509    // 6228

function getZabka(from, to) {
  const config = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'pl,en;q=0.9,la;q=0.8,ru;q=0.7',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Cookie': '__cfduid=d09a7146982e61d5b7de400c684b5a2511547030859',
      'Host': 'apkykk0pza-2.algolianet.com',
      'Pragma': 'no-cache',
      'Sec-Metadata': 'cause="forced", destination="document", site="cross-site"',
      'Sec-Origin-Policy': '0',
      'Upgrade-Insecure-Requests': '1'
    }
  }

  for (let index = from; index < to; index++) {  // do 6900
    console.log('index = ', index)
    const a = 'start'
    console.time(a)
    let times = Math.round(Math.random() * 3) + 1
    console.log('times = ', times)

    for (let i = times * 1e9; i > 0; i--)  { }  // pętla opóźniająca 3.6 sekundy
    console.timeEnd(a)

    let url = 'https://apkykk0pza-2.algolianet.com/1/indexes/prod_locator_prod_zabka/ID0' + index +
              '?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.22.1&x-algolia-application-id=APKYKK0PZA&x-algolia-api-key=71ca67cda813cec86431992e5e67ede2'

    //let url = 'https://apkykk0pza-2.algolianet.com/1/indexes/prod_locator_prod_zabka/ID01002?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.22.1&x-algolia-application-id=APKYKK0PZA&x-algolia-api-key=71ca67cda813cec86431992e5e67ede2'

    axios.get(url, config)
      .then(res => {
        let shop = {
          id: res.data.id,
          shopName: 'Żabka',
          city: res.data.city,
          address: res.data.address,
          lat: res.data._geoloc.lat,
          lon: res.data._geoloc.lng
        }

        console.log(index, shop)
        fs.appendFileSync (fileSave, JSON.stringify(shop) + ',')
      })
      .catch(err => console.log('Buont: ', index))
  }
}

const a = 6836
const b = a + 65

//console.log('a + b = ', a + 125)

//getZabka(a, b)   // 70 > 90 > 110 > 125



// Alianz Kupsztal1
// ZUS Kupasiku@1
// azure: kupasiku66

/*
heroku login

cd my-project/
git init
heroku git:remote -a shopsring

git add .
git commit -am "make it better"
git push heroku master


For existing repositories, simply add the heroku remote
heroku git:remote -a shopsring

*/





























