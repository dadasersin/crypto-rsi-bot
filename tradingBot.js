
const ccxt = require('ccxt');
const config = require('./config.json');

class RSITradingBot {
  constructor() {
    this.exchange = new ccxt.binance({
      apiKey: process.env.API_KEY,
      secret: process.env.API_SECRET
    });
    this.config = config;
  }

  async start() {
    console.log("RSI Bot başlatıldı...");
    
    setInterval(async () => {
      for (const symbol of this.config.symbols) {
        await this.checkRSI(symbol);
      }
    }, 60000); // Her 1 dakikada kontrol
  }

  async checkRSI(symbol) {
    try {
      const candles = await this.exchange.fetchOHLCV(symbol, '1h', undefined, 100);
      const rsi = this.calculateRSI(candles);
      
      console.log(`${symbol} RSI: ${rsi.toFixed(2)}`);
      
      if (rsi < this.config.oversold) {
        console.log(`ALIM SİNYALİ: ${symbol} (RSI: ${rsi.toFixed(2)})`);
        await this.createOrder(symbol, 'buy');
      } else if (rsi > this.config.overbought) {
        console.log(`SATIM SİNYALİ: ${symbol} (RSI: ${rsi.toFixed(2)})`);
        await this.createOrder(symbol, 'sell');
      }
    } catch (error) {
      console.error(`Hata: ${symbol} - ${error.message}`);
    }
  }

  // ... Diğer fonksiyonlar
}

module.exports = RSITradingBot;
