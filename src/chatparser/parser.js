const lang = require('./storage/en_us.json'); // translate message
const regex = /^(.+):\s*\/(.+)$/;

function parseCommand(message) {
    const match = message.match(regex);
    return match ? { username: match[1], command: match[2] } : undefined;
}

function inject(client) {
client.on('systemChat', (packet) => {
  const jsonmsg = JSON.parse(packet.formattedMessage);
  const msg = parseMinecraftMessage(packet.formattedMessage);
  const nocolormsg = parseMinecraftMessageNoColor(packet.formattedMessage);
  const cspy = parseCommand(nocolormsg);
  if (cspy) client.emit('custom_Commandspy', msg);
  if (msg !== undefined) {
    client.emit('custom_systemChat', msg, nocolormsg, jsonmsg !== undefined ? jsonmsg : false);
  }
});

client.on('playerChat', (packet) => {
  client.setMaxListeners(100);

  const uuid = packet.sender;
  const plainMessage = packet.plainMessage;
  const SenderName = packet.senderName ? parseMinecraftMessage(packet.senderName) : undefined;
  const TargetName = packet.targetName ? parseMinecraftMessage(packet.targetName) : undefined;
  const formattedMessage = packet.formattedMessage ? parseMinecraftMessage(packet.formattedMessage) : undefined;
  const unsignedContent = packet.unsignedContent ? parseMinecraftMessage(packet.unsignedContent) : undefined;
  const NoColorSenderName = packet.senderName ? parseMinecraftMessageNoColor(packet.senderName) : undefined;
  const NoColorTargetName = packet.targetName ? parseMinecraftMessageNoColor(packet.targetName) : undefined;
  const NoColorformattedMessage = packet.formattedMessage ? parseMinecraftMessageNoColor(packet.formattedMessage) : undefined;
  const NoColorunsignedContent = packet.unsignedContent ? parseMinecraftMessageNoColor(packet.unsignedContent) : undefined;

  let msg, vmsg, nocolorplayermsg, nocolormsg;

  switch (packet.type) {
    case 1: // /me text
      msg = `* ${SenderName} ${formattedMessage}`;
      nocolorplayermsg = `* ${NoColorSenderName} ${NoColorformattedMessage}`;
      break;
    case 2: // someone /tell you text
      msg = `${SenderName} whispers to you: ${formattedMessage}`;
      nocolorplayermsg = `${NoColorSenderName} whispers to you: ${NoColorformattedMessage}`;	
      break;
    case 3: // you /tell someone text
      msg = `You whisper to ${TargetName}: ${formattedMessage}`;
      nocolorplayermsg = `You whisper to ${NoColorTargetName}: ${NoColorformattedMessage}`;
      break;
    case 4: // player chat
      vmsg = formattedMessage;
      nocolormsg = NoColorformattedMessage;
      msg = unsignedContent;
      nocolorplayermsg = NoColorunsignedContent;
      break;
    case 5: // /say text
      msg = `[${SenderName}] ${plainMessage || formattedMessage}`;
      nocolorplayermsg = `[${NoColorSenderName}] ${plainMessage || NoColorformattedMessage}`;
      break;
    case 6: // /minecraft:teammsg text
      msg = `${TargetName} <${SenderName}> ${plainMessage}`;
      nocolorplayermsg = `${NoColorTargetName} <${NoColorSenderName}> ${plainMessage}`;
      break;
    default:
      console.log(`Unknown player_chat packet. Type: ${packet.type}`);
      console.log(packet);
      return;
  }

  if (!msg || !plainMessage) return;

  client.emit('custom_noplayerchat', plainMessage, uuid, NoColorSenderName);

  const datab = { msg, uuid, plainMessage, SenderName, TargetName, formattedMessage, unsignedContent, NoColorSenderName, NoColorTargetName, NoColorformattedMessage, NoColorunsignedContent, nocolorplayermsg, packet };
  client.emit('packet_playerChat', datab);
  client.emit('parsedchat', { username: NoColorSenderName, message: plainMessage, uuid: uuid, rawMessage: datab.msg }, packet);
  client.emit('custom_playerChat', msg, uuid, plainMessage, SenderName, TargetName, formattedMessage, unsignedContent, NoColorSenderName, NoColorTargetName, NoColorformattedMessage, NoColorunsignedContent, nocolorplayermsg, packet.type);

  if (vmsg !== undefined) {
    const datac = { vmsg, nocolormsg, type: packet.type };
    client.emit('packet_systemChat', datac);
    client.emit('custom_systemChat', vmsg, nocolormsg, "");
  }
});

const ansiColorCodes = {
  '§0': '\x1B[30m', '§1': '\x1B[34m', '§2': '\x1B[32m', '§3': '\x1B[36m', 
  '§4': '\x1B[31m', '§5': '\x1B[35m', '§6': '\x1B[33m', '§7': '\x1B[37m', 
  '§8': '\x1B[30m', '§9': '\x1B[34m', '§a': '\x1B[32m', '§b': '\x1B[36m', 
  '§c': '\x1B[31m', '§d': '\x1B[35m', '§e': '\x1B[33m', '§f': '\x1B[37m', 
  'black': '\x1B[30m', 'dark_blue': '\x1B[34m', 'dark_green': '\x1B[32m', 
  'dark_aqua': '\x1B[36m', 'dark_red': '\x1B[31m', 'dark_purple': '\x1B[35m', 
  'gold': '\x1B[33m', 'gray': '\x1B[37m', 'dark_gray': '\x1B[30m', 'blue': '\x1B[34m', 
  'green': '\x1B[32m', 'aqua': '\x1B[36m', 'red': '\x1B[31m', 'light_purple': '\x1B[35m', 
  'yellow': '\x1B[33m', 'white': '\x1B[37m'
};

const ansiFormatCodes = {
  '§l': '\x1B[1m',  '§o': '\x1B[3m',  '§n': '\x1B[4m',  '§m': '\x1B[9m', '§k': '\x1B[5m',  '§r': '\x1B[0m',
  'bold': '\x1B[1m', 'italic': '\x1B[3m', 'underlined': '\x1B[4m', 'strikethrough': '\x1B[9m', 'obfuscated': '\x1B[5m', 'reset': '\x1B[0m',
};

function parseMinecraftMessage(component) {
  let jsonComponent;
  try {
    jsonComponent = JSON.parse(component);
  } catch (e) {
    console.error("Invalid JSON format:", component);
    return '';
  }

  function extractText(comp) {
    if (typeof comp === 'string' || typeof comp === 'number') {
      return comp.toString();
    }

    let text = comp.text || comp[""] || '';

    if (comp.extra) {
      text += comp.extra.map(subComp => formatfunction(comp, extractText(subComp))).join('');
    }

    if (comp.translate) {
      let translateString = lang[comp.translate] || comp.translate;
      if (comp.with) {
        const withArgs = comp.with.map(arg => extractText(arg));
        withArgs.forEach((arg, index) => {
          if (arg.length > 2048) return translateString = '';
          translateString = translateString.replace('%s', formatfunction(comp, arg));
          const placeholder = new RegExp(`%${index + 1}\\$s`, 'g');
          translateString = translateString.replace(placeholder, formatfunction(comp, arg));
        });
      }
      text += formatfunction(comp, translateString);
    }

    return parseMinecraftColor(comp.color) + parseMinecraftFormat(comp) + text + ansiFormatCodes['reset'];
  }

  return extractText(jsonComponent) + ansiFormatCodes['reset'];
}

function formatfunction(comp, text) {
  if (text === undefined) return '';
  return parseMinecraftColor(comp.color) + parseMinecraftFormat(comp) + text + parseMinecraftColor(comp.color) + parseMinecraftFormat(comp);
}

function parseMinecraftColor(color) {
  if (color && ansiColorCodes[color] && !color.startsWith('#')) {
    return ansiColorCodes[color];
  } else if (color && color.startsWith('#')) {
    const hexRegex = /#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})/;
    const hexCodes = hexRegex.exec(color);
    if (hexCodes) {
      const [, r, g, b] = hexCodes;
      return `\u001b[38;2;${parseInt(r, 16)};${parseInt(g, 16)};${parseInt(b, 16)}m`;
    }
  }
  return '';
}

function parseMinecraftFormat(format) {
  return Object.entries(ansiFormatCodes)
    .filter(([key]) => format[key] === 1)
    .map(([, value]) => value)
    .join('');
}

function parseMinecraftMessageNoColor(component) {
  let jsonComponent;
  try {
    jsonComponent = JSON.parse(component);
  } catch (e) {
    console.error("Invalid JSON format:", component);
    return '';
  }

  function extractText(comp) {
    if (typeof comp === 'string' || typeof comp === 'number') {
      return comp.toString();
    }

    let text = comp.text || comp[""] || '';

    if (comp.extra) {
      text += comp.extra.map(extractText).join('');
    }

    if (comp.translate) {
      let translateString = lang[comp.translate] || comp.translate;
      if (comp.with) {
        const withArgs = comp.with.map(extractText);
        withArgs.forEach((arg, index) => {
          if (arg.length > 10000) return translateString = '';
          translateString = translateString.replace('%s', arg);
          const placeholder = new RegExp(`%${index + 1}\\$s`, 'g');
          translateString = translateString.replace(placeholder, arg);
        });
      }
      text += translateString;
    }

    return text;
  }

  return extractText(jsonComponent);
}

}

module.exports = { inject };

