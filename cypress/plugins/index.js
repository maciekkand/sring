const puppeteer = require('puppeteer')
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG
const fs = require('fs')

module.exports = (on) => {
  on('task', {
    doLogin: args => (async () => {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto('http://localhost:8080')
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
      })

      const timestamp = new Date().getTime()
      await page.screenshot({ path: `cypress/screenshots/${timestamp}.png` })
      await browser.close()
      let files = fs.readdirSync('cypress/screenshots')

      if (files.length < 2) return true

      files.map((el) => el.replace('.png', ''))
           .sort()
           .reverse()
           .map((el, ix) => {
             if (ix > 1) {
               console.log(`file being deleted: ${el}.png`)
               fs.unlinkSync(`cypress/screenshots/${el}.png`)
             }
           })

      files = fs.readdirSync('cypress/screenshots')
      console.log('files = ', files)

      const img1 = PNG.sync.read(fs.readFileSync(`cypress/screenshots/${files[0]}`))
      const img2 = PNG.sync.read(fs.readFileSync(`cypress/screenshots/${files[1]}`))
      const { width, height } = img1
      const diff = new PNG({ width, height })

      pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.01 })
      fs.writeFileSync('cypress/diff.png', PNG.sync.write(diff))

      const filename1 = `cypress/screenshots/${files[0]}`
      const filename2 = `cypress/screenshots/${files[1]}`

      return [filename1, filename2]
    })()
  })
}
