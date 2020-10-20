const http = require('http');

const express = require('express');

const app = express();

app.get("/", (request, response) => {

  response.sendStatus(200);

});

app.listen(process.env.PORT);

setInterval(() => {

  http.get(`http://bot--music--1.glitch.me/`);

}, 280000);

const Discord = require('discord.js');

const converter = require('number-to-words');

const moment = require('moment');

const dateformat = require('dateformat');

const ms = require('parse-ms')

const client = new Discord.Client({ disableEveryone: true});

const fs = require('fs');

const request = require('request');

const jimp = require('jimp')

const pretty = require("pretty-ms");

const prefix = process.env.PREFIX

const PREFIX = process.env.PREFIX

const ownerID = process.env.MYID

client.commands = new Discord.Collection();

client.aliases = new Discord.Collection();

let cmds = {

  play: { cmd: 'play', a: ['p'] },

  skip: { cmd: 'skip', a: ['s']},

  stop: { cmd: 'stop', a:['stop'] },

  pause: { cmd: 'pause', a:['pause'] },

  resume: { cmd: 'resume', a: ['r'] },

  volume: { cmd: 'volume', a: ['vol'] },

  queue: { cmd: 'queue', a: ['q'] },

  repeat: { cmd: 'repeat', a: ['re'] },

  forceskip: { cmd: 'forceskip', a: ['fs', 'fskip'] },

  skipto: { cmd: 'skipto', a: ['st'] },

  nowplaying: { cmd: 'Nowplaying', a: ['np'] }

};

Object.keys(cmds).forEach(key => {

var value = cmds[key];

  var command = value.cmd;

  client.commands.set(command, command);

  if(value.a) { // 14

    value.a.forEach(alias => {

    client.aliases.set(alias, command)

  })

  }

})

const ytdl = require('ytdl-core');

const getYoutubeID = require('get-youtube-id');

const fetchVideoInfo = require('youtube-info');

const YouTube = require('simple-youtube-api');

const youtube = new YouTube(process.env.YTkey);

 // 14

let active = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {

    console.log(`Created By:paijae`);

    console.log(`Guilds: ${client.guilds.size}`);

    console.log(`Users: ${client.users.size}`);

    client.user.setActivity(`${process.env.status.replace('[PREFIX]' ,PREFIX).replace('[SERVERS]',client.guilds.size).replace('[USERS]',client.users.size) || `Meu prefixo ${prefix}help`}`,{type: 'Playing'});

});

client.on('message', async msg => {

    if(msg.author.bot) return undefined;

  if(!msg.content.startsWith(prefix)) return undefined;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);

const command = args.shift().toLowerCase();

    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

    let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))

    let s;

    if(cmd === 'play') {

        const voiceChannel = msg.member.voiceChannel;

        if(!voiceChannel) return msg.channel.send(`:no_entry_sign: Você deve estar em um canal de voz para usar isso, Ou voce nao esta em nenhum canal de voz!`);

        const permissions = voiceChannel.permissionsFor(msg.client.user);

        if(!permissions.has('CONNECT')) {

            return msg.channel.send(`:no_entry_sign: Não posso entrar no seu canal de voz porque não tenho ` + '`' + '`CONNECT`' + '`' + ` permissão!`);

        }

        if(!permissions.has('SPEAK')) {

            return msg.channel.send(`:no_entry_sign: Não posso FALAR no seu canal de voz porque não tenho  ` + '`' + '`SPEAK`' + '`' + ` permissão!`);

        }

      voiceChannel.join()

      if(!args[0]) return msg.channel.send(`**> Jack Music | Music BOT

>    -play \`\`<song name>\`\`

>    -vol \`\`<volume>\`\`

>    -skip**`)

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

			const playlist = await youtube.getPlaylist(url);			const videos = await playlist.getVideos();

			for (const video of Object.values(videos)) {

				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop

				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop

			}

			return msg.channel.send(`Adicionado a: ${playlist.title}`);

		} else {

			try {

// كههربا

				var video = await youtube.getVideo(url);

			} catch (error) {

				try {

					var videos = await youtube.searchVideos(args, 1);

					// eslint-disable-next-line max-depth

					var video = await youtube.getVideoByID(videos[0].id);

				} catch (err) {

					console.error(err);

					return msg.channel.send('Não consigo encontrar nada');

				}

			}

			return handleVideo(video, msg, voiceChannel);

		}

        async function handleVideo(video, msg, voiceChannel, playlist = false) {

	const serverQueue = active.get(msg.guild.id);

//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));

// Kahrbaa كههربا

let hrs = video.duration.hours > 0 ? (video.duration.hours > 9 ? `${video.duration.hours}:` : `0${video.duration.hours}:`) : '';

let min = video.duration.minutes > 9 ? `${video.duration.minutes}:` : `0${video.duration.minutes}:`;

let sec = video.duration.seconds > 9 ? `${video.duration.seconds}` : `0${video.duration.seconds}`;

let dur = `${hrs}${min}${sec}`

  let ms = video.durationSeconds * 1000;

	const song = {  // 04

		id: video.id,

		title: video.title,

    duration: dur,

    msDur: ms,

		url: `https://www.youtube.com/watch?v=${video.id}`

	};

	if (!serverQueue) {

		const queueConstruct = {

			textChannel: msg.channel,

			voiceChannel: voiceChannel,

			connection: null,

			songs: [],

			volume: 50,

      requester: msg.author,

			playing: true,

      repeating: false

		};

		active.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {

			var connection = await voiceChannel.join();

			queueConstruct.connection = connection;

			play(msg.guild, queueConstruct.songs[0]);

		} catch (error) {

			console.error(`Não consegui entrar no canal de voz ${error}`);

			active.delete(msg.guild.id);

			return msg.channel.send(`Eu não posso entrar neste canal de voz`);

		} // 04

	} else {

		serverQueue.songs.push(song);

		if (playlist) return undefined;

		if(!args) return msg.channel.send('no results.');

		else return msg.channel.send(':watch: Loading... [`' + args + '`]').then(m => {

      setTimeout(() => {//:watch: Loading... [let]

        m.edit(`:notes: Adicionado **${song.title}**` + '(` ' + song.duration + ')`' + ` a fila na posição ` + `${serverQueue.songs.length}`);

      }, 500)

    }) 

	}

	return undefined;

}

function play(guild, song) {

	const serverQueue = active.get(guild.id);

	if (!song) {

		serverQueue.voiceChannel.leave();

		active.delete(guild.id);

		return;

	}

	//console.log(serverQueue.songs);

  if(serverQueue.repeating) {

	console.log('Repeating');

  } else {

	serverQueue.textChannel.send(':notes: Adicionado **' + song.title + '** (`' + song.duration + '`) para começar a tocar.');

}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))

		.on('end', reason => {

			//if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');

			//else console.log(reason);

      if(serverQueue.repeating) return play(guild, serverQueue.songs[0])

			serverQueue.songs.shift();

			play(guild, serverQueue.songs[0]);

		})

		.on('error', error => console.error(error));

	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

}

} else if(cmd === 'stop') {

        if(msg.guild.me.voiceChannel !== msg.member.voiceChannel) return msg.channel.send(`You must be in ${msg.guild.me.voiceChannel.name}`)

        if(!msg.member.hasPermission('ADMINISTRATOR')) {

          msg.react('❌')

          return msg.channel.send('Eu Não Tenho Permissão De `ADMINSTRATOR`');

        }

        let queue = active.get(msg.guild.id);

        if(queue.repeating) return msg.channel.send('O modo de repetição está ativado, você não pode parar a música, execute `'+` $ {prefix}repeat `+'` para desligá-lo.');

        queue.songs = [];

        queue.connection.dispatcher.end();

        return msg.channel.send('O usuário parou e a fila foi limpa.');

    } else if(cmd === 'skip') {

      let vCh = msg.member.voiceChannel;

      let queue = active.get(msg.guild.id);

        if(!vCh) return msg.channel.send('Desculpe, mas não consigo entrar no canal de voz');

        if(!queue) return msg.channel.send('Sem música tocando para pular');

        if(queue.repeating) return msg.channel.send('Você não pode pular, porque o modo de repetição está ativado, execute ' + `\`${prefix}forceskip\``);

        let req = vCh.members.size - 1;

        if(req == 1) {

            msg.channel.send('**:notes: Skipped **' + args);

            return queue.connection.dispatcher.end('Skipping ..')

        }

        if(!queue.votes) queue.votes = [];

        if(queue.votes.includes(msg.member.id)) return msg.say(`Você já votou para pular!`);

        queue.votes.push(msg.member.id);

        if(queue.votes.length >= req) {

            msg.channel.send('**:notes: Skipped **' + args);

            delete queue.votes;

            return queue.connection.dispatcher.end('Skipping ..')

        }

        msg.channel.send(`**Você votou com sucesso para pular! **`)

    } else if(cmd === 'pause') {

      let queue = active.get(msg.guild.id);

        let vCh = msg.member.voiceChannel;

        if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(`Você não está no canal de voz.`);

        if(!queue) {

            return msg.channel.send('Sem música tocando para pausar.')

        }

        if(!queue.playing) return msg.channel.send(':no_entry_sign: Deve haver música tocando para usar isso!');

        let disp = queue.connection.dispatcher;

        disp.pause('Pausing..')

        queue.playing = false;

        msg.channel.send(':notes: Pausado use ' + args + '`' + prefix + 'resume` para retomar a musica!')

    } else if (cmd === 'resume') {

      let queue = active.get(msg.guild.id);

        let vCh = msg.member.voiceChannel;

        if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(`Você não está no canal de voz.`);

        if(!queue) return msg.channel.send(':notes: Nenhuma música pausada para retomar')

        if(queue.playing) return msg.channel.send(':notes: nenhuma música pausada para retomar');

        let disp = queue.connection.dispatcher;

        disp.resume('Resuming..')

// 2-0-0-2

        queue.playing = true;

        msg.channel.send(':notes: Resumed.')

    } else if(cmd === 'volume') {

      let queue = active.get(msg.guild.id);

      if(!queue || !queue.songs) return msg.channel.send(':notes: Não há música tocando para definir o volume.');

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(':notes: Você não está no canal de voz');

      let disp = queue.connection.dispatcher;

      if(isNaN(args[0])) return msg.channel.send(':notes: Apenas números!');

      if(parseInt(args[0]) > 100) return msg.channel.send('Você não pode definir o volume para mais de 100.');

//:speaker: Volume changed from 20 to 20 ! The volume has been changed from ${queue.volume} to ${args[0]}

      msg.channel.send(':speaker: o volume foi **alterado** de (`' + queue.volume + '`) para (`' + args[0] + '`)');

      queue.volume = args[0];

      disp.setVolumeLogarithmic(queue.volume / 100);

    } else if (cmd === 'queue') {

      let queue = active.get(msg.guild.id);

      if(!queue) return msg.channel.send(':no_entry_sign: Deve haver música tocando para usar isso!');

      let embed = new Discord.RichEmbed()

      .setAuthor(`${client.user.username}`, client.user.displayAvatarURL)

      let text = '';

      for (var i = 0; i < queue.songs.length; i++) {

        let num;

        if((i) > 8) {

          let st = `${i+1}`

          let n1 = converter.toWords(st[0])

          let n2 = converter.toWords(st[1])

          num = `:${n1}::${n2}:`

        } else {

        let n = converter.toWords(i+1)

        num = `:${n}:`

      }

        text += `${num} ${queue.songs[i].title} [${queue.songs[i].duration}]\n`

      }

      embed.setDescription(`Songs Queue | ${msg.guild.name}\n\n ${text}`)

      msg.channel.send(embed)

    } else if(cmd === 'repeat') {

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send('Você não está no canal de voz');

      let queue = active.get(msg.guild.id);

      if(!queue || !queue.songs) return msg.channel.send('Não há música tocando para repeti-lo.');

      if(queue.repeating) {

        queue.repeating = false;

        return msg.channel.send(':arrows_counterclockwise: **Repeating Modo** (`False`)');

      } else {

        queue.repeating = true;

        return msg.channel.send(':arrows_counterclockwise: **Repeating Modo** (`True`)');

      }

    } else if(cmd === 'forceskip') {

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send('Você não está no canal de voz');

      let queue = active.get(msg.guild.id);

      if(queue.repeating) {

        queue.repeating = false;

        msg.channel.send('ForceSkipped, O modo de repetição está ativado.')

        queue.connection.dispatcher.end('ForceSkipping..')

// 2-0-0-2

        queue.repeating = true;

      } else {

        queue.connection.dispatcher.end('ForceSkipping..')

        msg.channel.send('ForceSkipped.')

      }

     } else if(cmd === 'skipto') {

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send('Não há música para pular.');

      let queue = active.get(msg.guild.id);

      if(!queue.songs || queue.songs < 2) return msg.channel.send('There is no music to skip to.');

    if(queue.repeating) return msg.channel.send('Você não pode pular, porque o modo de repetição está ativado, execute '+ `\` $ {prefix} repeat \ para desligar.`);

      if(!args[0] || isNaN(args[0])) return msg.channel.send('Por favor, insira o número da música para pular, corra ' + prefix + `queue` + ' para ver os números das músicas.');

      let sN = parseInt(args[0]) - 1;

      if(!queue.songs[sN]) return msg.channel.send('Não há nenhuma música com este número.');

                                                   

                                                   

                                                   

      let i = 1;

      msg.channel.send(`Skipped to: **${queue.songs[sN].title}[${queue.songs[sN].duration}]**`)

      while (i < sN) {

        i++;

        queue.songs.shift();

      }

      queue.connection.dispatcher.end('SkippingTo..')

    } else if(cmd === 'Nowplaying') {

      let q = active.get(msg.guild.id);

      let now = npMsg(q)

      msg.channel.send(now.mes, now.embed)

      .then(me => {

        setInterval(() => {

          let noww = npMsg(q)

          me.edit(noww.mes, noww.embed)

        }, 5000)

      })

      function npMsg(queue) {

        let m = !queue || !queue.songs[0] ? 'Nenhuma Musica Tocando.' : "Novo Play..."

      const eb = new Discord.RichEmbed();

      eb.setColor(msg.guild.me.displayHexColor)

      if(!queue || !queue.songs[0]){

// 04

        eb.setTitle("No music playing");

            eb.setDescription("\u23F9 "+bar(-1)+" "+volumeIcon(!queue?100:queue.volume));

      } else if(queue.songs) {

        if(queue.requester) {

          let u = msg.guild.members.get(queue.requester.id);

          if(!u)

            eb.setAuthor('Unkown (ID:' + queue.requester.id + ')')

          else

            eb.setAuthor(u.user.tag, u.user.displayAvatarURL)

        }

        if(queue.songs[0]) {

        try {

            eb.setTitle(queue.songs[0].title);

            eb.setURL(queue.songs[0].url);

        } catch (e) {

          eb.setTitle(queue.songs[0].title);

        }

}

        eb.setDescription(embedFormat(queue))

      }

      return {

        mes: m,

        embed: eb

      }

    }

      function embedFormat(queue) {

        if(!queue || !queue.songs) {

          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(100);

        } else if(!queue.playing) {

          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(queue.volume);

        } else { // 2-0-0-2

          let progress = (queue.connection.dispatcher.time / queue.songs[0].msDur);

          let prog = bar(progress);

          let volIcon = volumeIcon(queue.volume);

          let playIcon = (queue.connection.dispatcher.paused ? "\u23F8" : "\u25B6")

          let dura = queue.songs[0].duration;

          return playIcon + ' ' + prog + ' `[' + formatTime(queue.connection.dispatcher.time) + '/' + dura + ']`' + volIcon;

        }

      }

      function formatTime(duration) {

  var milliseconds = parseInt((duration % 1000) / 100),

    seconds = parseInt((duration / 1000) % 60),

    minutes = parseInt((duration / (1000 * 60)) % 60),

    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;

  minutes = (minutes < 10) ? "0" + minutes : minutes;

  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;

}

// -0-4-

      function bar(precent) {

        var str = '';

        for (var i = 0; i < 12; i++) {

          let pre = precent

          let res = pre * 12;

          res = parseInt(res)

          if(i == res){

            str+="\uD83D\uDD18";

          }

          else {

            str+="▬";

          }

        }

        return str;

      }

      function volumeIcon(volume) {

        if(volume == 0)

           return "\uD83D\uDD07";

       if(volume < 30)

           return "\uD83D\uDD08";

       if(volume < 70)

           return "\uD83D\uDD09";

       return "\uD83D\uDD0A";

      }

    }

});

client.on('message', message => {

// 2-0-0-2

    let argresult = message.content.split(` `).slice(1).join(' ');

    if (message.content.startsWith(prefix + 'setStreaming')) {

      if (!ownerID.includes(message.author.id)) return;

      message.delete();

      client.user.setGame(argresult, 'https://twitch.tv/Kahrbaa');

    } else if(message.content.startsWith(prefix + 'setWatching')) {

        client.user.setActivity(argresult,{type: 'WATCHING'});

      } else if(message.content.startsWith(prefix + 'setListening')) {

        client.user.setActivity(argresult,{type: 'LISTENING'});

      } else if(message.content.startsWith(prefix + 'setPlaying')) {

        client.user.setActivity(argresult,{type: 'PLAYING'});

      } else if(message.content.startsWith(prefix + 'setName')) {

        client.user.setUsername(argresult);

      } else if(message.content.startsWith(prefix + 'setAvatar')) {

        client.user.setAvatar(argresult);

      } else if(message.content.startsWith(prefix + 'setStatus')) {

        if(!argresult) return message.channel.send('`online`, `DND(Do not Distrub),` `idle`, `invisible(Offline)` :notes: أختر أحد الحالات');

		client.user.setStatus(argresult);

    }

  });

client.on('message', message => {

  var helplist = `**:notes:  comandos abaixo:

> Play : Reproduzir uma Música do YouTube.

> Pause : Pausar Uma Música.

> Resume : Tirar O Pause Da música

> Stop : Retirar Uma Música Que Esta Tocando

> forceskip : Forçar Skip de Uma Música.

> Queue : Adicionar Uma musica Na Lista.

> Skip : Pular Uma Música

> Volume : Aumentar Ou Abaixar O Volume Da Música.

> np : Ver A Musica Tocando [np]

> repeat : Repetir A Música.

Jack Music v1.6 - Codigo Feito Por : Pai Jae

- https://discord.gg/CbKHkfn

**`

  if(message.content === prefix + 'help') {

            message.delete(1000)

    let e = '** Mensagem Enviada Em Seu Privado .. :envelope_with_arrow: **'

	  message.reply(e).then(m => m.delete(1000))

	  message.author.send(helplist).catch(error => message.reply('** Não posso enviar pedidos para você, por favor abra seu Privado**'));

}

});

client.on('message', message => {

      if (!ownerID.includes(message.author.id)) return;

  var helplist = `

`

  if(message.content === prefix + 'help') {

    message.author.send(helplist);

  }

  });

//////////////comandos/menção/////////////////

client.on('message', message => {

  if(message.content.startsWith(`<@${client.user.id}>`)) {

    const embed = new Discord.RichEmbed()

    

    .setTitle(`** <a:alert:737811701994487910> Olá ${message.author.tag} Meu Prefixo Nesse Servidor é: j!**`)

    .setDescription(`<a:Loading:741482496973340805> **__Estou Rodando Na Versão 1.0__**

    <:js:741482565570920570> **__Fui Desenvolvida Em Discord.js__**

    <a:DiscordPiscaPiscaDS:741482626962948207> **__Para Mais Informações j!help__**

    <a:LN_:737757987292184647> **__Meu Criador: 𝙔𝙆 ραι נαε.js#0001__**

`)

    .setColor("RANDOM")

    

      message.channel.send(embed);

  }

});

let status = [

  

  { name: `Achou Um Erro? Denuncie Em Nosso Servidor De Suporte`, type: 'STREAMING', url: 'https://www.twitch.tv/stoonyfofo'},

  { name: `Para Mais Informações j!help`, type: 'STREAMING', url: 'https://www.twitch.tv/akatsugay'},

  { name: `Como Foi Seu Dia? [😀]`, type: 'STREAMING', url: 'https://www.twitch.tv/akatsugay'},

  { name: `Siga Seus Sonhos [💖]`, type: 'STREAMING', url: 'https://www.twitch.tv/akatsugay'},

  { name: `Meu Servidor De Suporte: https://discord.gg/CbKHkfn`, type: 'STREAMING', url: 'https://www.twitch.tv/akatsugay'},

 

  { name: `Meu Criador: 𝙔𝙆 ραι נαε.js#0001`, type: 'PLAYING', url: 'https://www.twitch.tv/akatsugay'},

 

  

  { name: `😢+💵=😁, Doe Para A Bot Continuar Online: https://donatebot.io/checkout/717913485111197697`, type: 'STREAMING', url: 'https://www.twitch.tv/akatsugay'},

];

  

  

setInterval(function() {

    let randomStatus = status[Math.floor(Math.random() * status.length)];

    client.user.setPresence({ game: randomStatus });

  }, 2 * 10000);

////////////////////////start bot token///////////////////////////

client.login(process.env.BOT_TOKEN).catch(err=> console.log("error console restart"));

