var fontFace = new FontFace(
  "Poppins",
  "url(https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap)"
);

document.fonts.add(fontFace);

const newImage = new Image(100, 100);
newImage.src = "../images/albums/911.jpg";
const song = [
  {
    nombre: "Baila baila baila - Remix",
    foto: newImage,
    artista: "Justin Quiles, Natti Natasha, Darrell, Sech, Becky G",
  },
];
const canvas = document.querySelector("#testcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#f3f3f2";
roundedImage(20, 20, 286, 375, 30, 3);
ctx.fill();

ctx.save();
roundedImage(50, 110, 226, 226, 15);
ctx.clip();
let imgWidth = 226;
let imgHeight = 226;
ctx.drawImage(song[0].foto, 50, 110, imgWidth, imgHeight);
ctx.restore();

ctx.fillStyle = "black";
ctx.textBaseline = "hanging";
ctx.font = 'bold 48px "Poppins"';
ctx.textAlign = "center";
ctx.fillText(song[0].nombre, 163, 50, 246);

ctx.font = 'italic 16px "Poppins"';
ctx.textAlign = "left";
let lines = getLines(ctx, song[0].artista, 261);
for (let i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i], 35, 350 + 20 * i, 261);
}

function roundedImage(x, y, width, height, radius, lineWidth = 2) {
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.stroke();
}

function getLines(ctx, text, maxWidth) {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
