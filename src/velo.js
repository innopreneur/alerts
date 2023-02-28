import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()
const veloTokenAddress = '0x3c8b650257cfb5f272f799f5e2b4e65093a11a05'
const discordWebhook = process.env.DISCORD_WEBHOOK_URL
const targetPrice = Number(process.env.TARGET_PRICE)
const coingeckoUrl =
  'https://api.coingecko.com/api/v3/simple/token_price/optimistic-ethereum?contract_addresses=0x3c8b650257cfb5f272f799f5e2b4e65093a11a05&vs_currencies=usd'
console.log(discordWebhook)

async function checkPrices() {
  const priceResp = await axios.get(coingeckoUrl)
  console.log('resp', priceResp.status)
  if (priceResp.status == 200) {
    console.log('data', priceResp.data[veloTokenAddress])
    if (priceResp.data[veloTokenAddress]['usd']) {
      const price = Number(priceResp.data[veloTokenAddress]['usd'])
      console.log('price : ', price)
      if (price >= targetPrice) {
        console.log('Price target triggered... Sending message')
        const message = {
          token: '$VELO',
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

checkPrices()
