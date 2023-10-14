import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()
const usdrTokenAddress = '0x40379a439d4f6795b6fc9aa5687db461677a2dba'
const discordWebhook = process.env.DISCORD_WEBHOOK_URL
const targetPrice = Number(process.env.TARGET_PRICE)
const coingeckoUrl =
  'https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=0x40379a439d4f6795b6fc9aa5687db461677a2dba&vs_currencies=usd'

async function start() {
  while (true) {
    await checkPrices()
    await sleep(10)
  }
}

async function sleep(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}

async function checkPrices() {
  const priceResp = await axios.get(coingeckoUrl)
  console.log('resp', priceResp.status)
  if (priceResp.status == 200) {
    console.log('data', priceResp.data[usdrTokenAddress])
    if (priceResp.data[usdrTokenAddress]['usd']) {
      const price = Number(priceResp.data[usdrTokenAddress]['usd'])
      console.log('price : ', price)
      if (price >= targetPrice) {
        console.log('Price target triggered... Sending message')
        const message = {
          token: '$USDR',
          price,
        }

        const params = {
          username: 'Alerts',
          avatar_url: '',
          content: `@everyone ${JSON.stringify(message)}`,
        }

        axios.post(discordWebhook, JSON.stringify(params), {
          headers: { 'Content-type': 'application/json' },
        })
      }
    }
  }
}

start()
