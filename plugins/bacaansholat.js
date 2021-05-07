let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
  await m.reply(global.wait)
  let res = await fetch(global.API('xteam','/religi/bacaansholat', {}, 'APIKEY'))
  let json = await res.json()
  if (res.status != 200) throw json
  if (json.result.error) throw json.result.message
  let {
    name,
    id,
    latin,
    arabic,
    terjemahan
  } = json.result
  let caption = `
*「 Bacaan Sholat 」*

${id}. ${name}

${arabic}

${latin}

Artinya:
_"${terjemahan}"_
`.trim()
  await m.reply(caption)
}
handler.help = ['bacaansholat']
handler.tags = ['islamic']
handler.command = /^(bacaansholat)$/i
handler.register = true

handler.fail = null
handler.limit = false

module.exports = handler