let img;
let glyphs;
let chars =
  "`~01234567890!@#$%^&*()-=_+[{;:,<./?'\"|abcdefghijklmnopqrstuvwxyzABCDEFGHJIKLMNOPQRSTUVWXYZ";
let sz = 10;
let mic;
let vol;

function preload() {
  img = loadImage("source.png", (_img) => _img.loadPixels());
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  glyphs = generateIntensities(chars);
  mic = new p5.AudioIn();
  mic.start();

  video = createCapture(VIDEO); // Create webcam capture
  video.size(width, height);
  video.hide();
}

function draw() {
  background(0);

  audioLevel = mic.getLevel();
  let asciiCharacters = getAsciiCharacters(audioLevel);
  
  //image(video, 0, 0, width, height);
  textSize(1);
  push();

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let e = E.easeInOutQuint(
        noise(x * 0.01 + 9 + frameCount / 60, y * 0.01 + frameCount / 5)
      );
      let len = e * glyphs.length;
      len = max(1, len);
      const idx = (x + y * img.width) * 4;
      //let idx = (y*img.width +x) * 4;
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      const brightness = (r + g + b) / 3;
      const asciiIndex = floor(
        map(brightness, 0, 255, 0, asciiCharacters.length)
      );
      // brightness isn't really good at getting the grey scale value.
      //let br = brightness(color(r,g,b));
      let br = r;

      // normalize and put into index space
      let glyphIdx = floor((br / 255) * len);
      let glyph = glyphs[glyphIdx].char;

      const rColor = map(audioLevel * 10, 0, 1, 0, 255);
      const gColor = map(audioLevel * 10, 0, 1, 255, 0);
      const bColor = map(brightness * 10, 0, 255, 0, 255);
      const textColor = color(rColor, gColor, bColor);

      textSize(map(br * 1.5, 0, 255, 5, 10));
      fill(textColor);
      //fill(br*1.5);
     text(glyph, x * sz, y * sz);
	 // text(asciiCharacters[asciiIndex], x, y);
    }
  }
  pop();

  textSize(100);
  fill(255, 0, 0);
  // text(floor(frameRate()), 150, 150);
}

function generateIntensities(str) {
  const cellSz = 32;
  const fontSz = 22;
  let font = null;
  let gfx;

  // array of objects containing the glyph and associated brightness/intensity
  let glyphData = [];

  let calcIntensity = function (ctx) {
    let b = 0;

    ctx.loadPixels();
    let pxCnt = ctx.pixels.length;

    for (let i = 0; i < pxCnt; i += 4) {
      b += ctx.pixels[i];
    }

    return b / pxCnt;
  };

  let setupCtx = function (g) {
    g.textFont("monospace");
    if (font) {
      g.textFont(font);
    }
    g.textAlign(LEFT, TOP);
    g.textSize(fontSz);
    g.fill(255);
    g.noStroke();
    g.background(0);
  };

  let glyphCtx = createGraphics(cellSz, cellSz);
  setupCtx(glyphCtx);

  for (let c = 0; c < str.length; c++) {
    let char = str[c];

    glyphCtx.background(0);
    glyphCtx.text(char, 0, 0);

    if (font) {
      glyphCtx.textFont(font);
    }

    let intensity = calcIntensity(glyphCtx);
    glyphData.push({ char, intensity });
  }

  glyphData = glyphData.sort((a, b) => a.intensity - b.intensity);

  return glyphData;
}

function getAsciiCharacters(audioLevel) {
	if (audioLevel > 0.7) {
	  return ['@', '#', '8', '&', 'o', ':', '*', '.', ' ']; // Characters for high audio levels
	} else {
	  return ['~', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '_', '+', '[', '{', ';', ':', ',', '<', '.', '/', '?', '\'', '"']; // Characters for low audio levels
	}
  }

// src
// https://gist.github.com/gre/1650294
let E = {
  // no easing, no acceleration
  linear: function (t) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function (t) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function (t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: function (t) {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: function (t) {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: function (t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: function (t) {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function (t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function (t) {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  },

  // elastic bounce effect at the beginning
  easeInElastic: function (t) {
    return (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
  },
  // elastic bounce effect at the end
  easeOutElastic: function (t) {
    return ((0.04 * t) / --t) * Math.sin(25 * t);
  },
  // elastic bounce effect at the beginning and end
  easeInOutElastic: function (t) {
    return (t -= 0.5) < 0
      ? (0.02 + 0.01 / t) * Math.sin(50 * t)
      : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
  },
};

E.easeOutBack = function (t, b, c, d, s) {
  if (s == undefined) s = 1.70158;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

E.easeOutExpo = function (t, b, c, d) {
  return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
};

E.outElastic = function (n) {
  var s,
    a = 0.1,
    p = 0.4;
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (!a || a < 1) {
    a = 1;
    s = p / 4;
  } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
  return a * Math.pow(2, -10 * n) * Math.sin(((n - s) * (2 * Math.PI)) / p) + 1;
};
