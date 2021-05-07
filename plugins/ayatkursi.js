let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
  await m.reply(global.wait)
  let res = await fetch(global.API('xteam','/religi/ayatkursi', {}, 'APIKEY'))
  let json = await res.json()
  if (res.status != 200) throw json
  if (json.result.error) throw json.result.message
  let {
    tafsir,
    latin,
    arabic,
    translation
  } = json.result.data
  let caption = `
*「 Ayat Kursi 」*

${arabic}

${latin}

Artinya:
_"${translation}"_
`.trim()
  m.reply(caption)
  await m.reply(`Tafsir:\n\n${tafsir}`)
}
handler.help = ['ayatkursi']
handler.tags = ['islamic']
handler.command = /^(ayatkursi)$/i
handler.register = true

handler.fail = null
handler.limit = false

module.exports = handler