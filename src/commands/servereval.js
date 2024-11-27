const util = require('util')
function execute(data) {
    const client = data.client
    const code = data.message.split(' ').join(' ')
    let result
    try {
        result = eval(code);
    } catch (e) {
        client.core.tellraw(
            new client.ChatMessage.MessageBuilder().setText(e.toString()).setColor(client.scheme.errorColor)
        )
    }
    const inspectedResult = util.inspect(result, { colors: true, depth: 0 });

    function ansiToHexSegments(str) {
        const ansiColors = {
            '30': '#000000', // Black
            '31': '#FF0000', // Red
            '32': '#00FF00', // Green
            '33': '#FFFF00', // Yellow
            '34': '#0000FF', // Blue
            '35': '#FF00FF', // Magenta
            '36': '#00FFFF', // Cyan
            '37': '#FFFFFF', // White
            '90': '#7F7F7F', // Bright Black (Gray)
            '91': '#FF7F7F', // Bright Red
            '92': '#7FFF7F', // Bright Green
            '93': '#FFFF7F', // Bright Yellow
            '94': '#7F7FFF', // Bright Blue
            '95': '#FF7FFF', // Bright Magenta
            '96': '#7FFFFF', // Bright Cyan
            '97': '#FFFFFF', // Bright White
            '40': '#000000', // Background Black
            '41': '#FF0000', // Background Red
            '42': '#00FF00', // Background Green
            '43': '#FFFF00', // Background Yellow
            '44': '#0000FF', // Background Blue
            '45': '#FF00FF', // Background Magenta
            '46': '#00FFFF', // Background Cyan
            '47': '#FFFFFF', // Background White
            '100': '#7F7F7F', // Bright Background Black (Gray)
            '101': '#FF7F7F', // Bright Background Red
            '102': '#7FFF7F', // Bright Background Green
            '103': '#FFFF7F', // Bright Background Yellow
            '104': '#7F7FFF', // Bright Background Blue
            '105': '#FF7FFF', // Bright Background Magenta
            '106': '#7FFFFF', // Bright Background Cyan
            '107': '#FFFFFF', // Bright Background White
        };

        const segments = [];
        let currentColor = '#FFFFFF'; // Default color
        str.replace(/\x1B\[(\d+)(;\d+)?m/g, (match, p1) => {
            if (ansiColors[p1]) {
                currentColor = ansiColors[p1];
            }
            return '';
        }).split('\x1B[0m').forEach(segment => {
            if (segment) {
                segments.push(new client.ChatMessage.MessageBuilder().setText(segment).setColor(currentColor));
            }
        });

        return segments;
    }

    const coloredSegments = ansiToHexSegments(inspectedResult);
    client.core.tellraw(coloredSegments);
}

module.exports = {
    name: "servereval",
    description: "Evaluates code on server :3 !!!",
    usage: [
        "servereval <code>"
    ],
    level: 'owner',
    aliases: [
        "se"
    ],
    execute: execute
}