const topTenCryptoApi = "https://api.coincap.io/v2/assets?limit=10"
const elevenThroughTwentyCryptoApi="https://api.coincap.io/v2/assets?limit=10&offset=10"
fetch(topTenCryptoApi).then(r=>r.json()).then(crypto=>console.log(crypto))
fetch(elevenThroughTwentyCryptoApi).then(r=>r.json()).then(crypto=>console.log(crypto))