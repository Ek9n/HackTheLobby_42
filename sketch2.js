
let video;
let mic;
let bgColor;
let textColor;

function setup() {
    createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  mic = new p5.AudioIn();
  mic.start();

  bgColor = color(0);
  textColor = color(255);
}

function draw() {
  background(bgColor);
  video.loadPixels();

  let audioLevel = mic.getLevel(); // Get audio input level (0 to 1)
  let asciiArt = "";
  const asciiCharacters = ['~', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '_', '+', '[', '{', ';', ':', ',', '<', '.', '/', '?', '\'', '"'];

  for (let y = 0; y < video.height; y += 10) {
    for (let x = 0; x < video.width; x += 6) {
      const index = (x + y * video.width) * 4;
      const r = video.pixels[index];
      const g = video.pixels[index + 1];
      const b = video.pixels[index + 2];
      const brightness = (r + g + b) / 3;
      const asciiIndex = floor(map(brightness, 0, 255, 0, asciiCharacters.length));

      const rColor = map(audioLevel * 20, 0, 1, 0, 255);
      const gColor = map(audioLevel * 20, 0, 1, 255, 0);
      const bColor = map(brightness * 20, 0, 255, 0, 255);
      const textColor = color(rColor, gColor, bColor);

      fill(textColor);
      textSize(8);
      text(asciiCharacters[asciiIndex], x, y);
    }
    asciiArt += '\n';
  }
}
