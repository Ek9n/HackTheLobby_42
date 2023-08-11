let video;
let mic;
let bgColor;
let xOffset = 0;
let xDirection = 1;
let xSpeed = 1; // Adjust this value to control the speed of the movement

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  mic = new p5.AudioIn();
  mic.start();
  bgColor = color(0);
}

function draw() {
  background(bgColor);
  video.loadPixels();

  let audioLevel = mic.getLevel();
  let asciiCharacters = getAsciiCharacters(audioLevel);

  for (let y = 0; y < video.height; y += 10) {
    for (let x = 0; x < video.width; x += 6) {
      const index = ((x + xOffset) + y * video.width) * 4; // Apply xOffset to the x position
      const r = video.pixels[index];
      const g = video.pixels[index + 1];
      const b = video.pixels[index + 2];
      const brightness = (r + g + b) / 3;
      const asciiIndex = floor(map(brightness, 0, 255, 0, asciiCharacters.length));

      const rColor = map(audioLevel * 10, 0, 1, 0, 255);
      const gColor = map(audioLevel * 10, 0, 1, 255, 0);
      const bColor = map(brightness * 10, 0, 255, 0, 255);
      const textColor = color(rColor, gColor, bColor);

      fill(textColor);
      textSize(7);
      text(asciiCharacters[asciiIndex], x, y);
    }
  }

  // Update xOffset to create the movement effect
  xOffset += xSpeed * xDirection;
  if (xOffset >= 10 || xOffset <= -10) {
    xDirection *= -1;
  }
}

function getAsciiCharacters(audioLevel) {
  if (audioLevel > 0.7) {
    return ['@', '#', '8', '&', 'o', ':', '*', '.', ' '];
  } else {
    return ['~', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '_', '+', '[', '{', ';', ':', ',', '<', '.', '/', '?', '\'', '"'];
  }
}
