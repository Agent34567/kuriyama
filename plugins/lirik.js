const axios = require('axios')

let handler = async(m, { conn, text, usedPrefix }) => {
        let user = global.DATABASE._data.users[m.sender]
    if (!text) return conn.reply(m.chat, '_Masukkan yang dicari_', m)
    await m.reply('Searching...')
    new Promise((resolve, reject) => {
        axios.get(`https://videfikri.com/api/liriklagu/?query=` + encodeURIComponent(text))
            .then((res) => {
                      
                const ardi = `*• Lirik Lagu ${text} :*\n\n ${res.data.result.lirik}`
                conn.reply(m.chat, ardi, m)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
handler.help = ['lirik <judul lagu>']
handler.tags = ['internet']
handler.command = /^(lirik)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = true

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.limit = true

module.exports = handler
