let fs = require ('fs')
let path = require('path')
let levelling = require('../lib/levelling')
let tags = {
  'main': 'Main',
  'xp': 'Exp & Limit',
  'sticker': 'Sticker',
  //'islamic': 'Islamic',
  'weebs': 'Weebs',
  //'nsfw': 'NSFW 🔞',
  'game': 'Game',
  'fun': 'Fun',
  'anonymous': 'Anonymous Chat',
  'kerang': 'Kerang Ajaib',
  'quotes': 'Quotes',
  'primbon': 'Primbon Menu',
  'nulis': 'MagerNulis',
  'creator': 'Creator',
  'videomaker': 'Videomaker',
  'internet': 'Internet',
  'downloader': 'Downloader',
  'admin': 'Admin',
  'group': 'Group',
  'tools': 'Tools',
  'jadibot': 'Jadi Bot',
  'premium': 'Premium Menu',
  'owner': 'Owner',
  'host': 'Host',
  'database': 'Database',
  'advanced': 'Advanced',
  'info': 'Info',
  '': 'No Category',
}
const defaultMenu = {
  before: `
┏ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━
┇       *「 %me 」*
┣ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━
┃
┃ ❖ Hai @${elu.split`@`[0]}!
┃
┃ ❖ *Name:* %name
┃ ❖ *Level:* %level (%exp / %maxexp)
┃ ❖ *EXP:* %totalexp XP
┃ ❖ *Saldo:* Rp%saldo
┃ ❖ *Limit:* %limit
┃ ❖ *Premium:* ${premium ? 'Yes':'No'}
┃
┃ ❖ *Hari:* %week %weton
┃ ❖ *Tanggal:* %date
┃ ❖ *Tanggal Islam:* %dateIslamic
┃ ❖ *Waktu:* %time WIB
┃
┃ ❖ *Uptime:* _%uptime_ (%muptime)
┃ ❖ *Database:* %rtotalreg of %totalreg
┃ ❖ *Contact:*
┃     _${kokoronationz}_
┗ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━
%readmore
┏ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━
┇       *「 Thanks to 」*
┣ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━
┃ ❖ Nurutomo
┃ ❖ St4rz
┃ ❖ DrawlNag
┃ ❖ Ariffb
┃ ❖ RC047
┃ ❖ Dan Kawan-kawan
┗ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━
`.trimStart(),
  header: '┏ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━\n┇       *「 %category 」*\n┣ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━',
  body  : '┃ ❖  %cmd %islimit %isPremium',
  footer: '┗ ┅ ━━━━━━━━━━━━━━━━━━━━ ┅ ━\n',
  after : `
*%npmname@^%version*
${'```%npmdesc```'}
`,
}
let handler  = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let kuriyama = './src/photo/kuriyama.png'
    let elu = m.sender
    let { name, exp, limit, level } = global.DATABASE.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let kokoronationz = 'https://bit.ly/Kokoronationz'
    let premium = global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    //let name = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.DATABASE._data.users).length
    let rtotalreg = Object.values(global.DATABASE._data.users).filter(user => user.registered == true).length
    for (let plugin of Object.values(global.plugins))
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!tag in  tags) tags[tag] = tag
    let help = Object.values(global.plugins).map(plugin => {
      return {
        help: plugin.help,
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        enabled: !plugin.disabled,
      }
    })
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body   = conn.menu.body   || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after  = conn.menu.after  || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text  = before + '\n'
    for (let tag in tags) {
      let group = []
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag) && menu.help) group.push(menu)
      _text += header.replace(/%category/g, tags[tag]) + '\n'
      for (let menu of groups) {
        for (let help of menu.help)
          _text += body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
            .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
            .replace(/%isPremium/g, menu.limit ? '(Premium)' : '')
            .trim() + '\n'
      }
      _text += footer + '\n'
    }
    _text += after
    text =  typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      saldo: uang,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      name, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => ''+replace[name])
    //conn.reply(m.chat, text.trim(), m)
    conn.sendFile(m.chat, kuriyama, 'kuriyama.jpg', text.trim(), { 
      key: { 
        remoteJid: 'status@broadcast', 
        participant: '0@s.whatsapp.net', 
        fromMe: false 
      }, 
      message: { 
        "imageMessage": { "mimetype": "image/jpeg", 
        "caption": `${conn.user.name} Verified Bot`, 
        "jpegThumbnail": fs.readFileSync(`./src/photo/mirai.png`)
        } 
      }
    }, m, { contextInfo: { mentionedJid: [m.sender] } })
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu','help','?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = true

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
