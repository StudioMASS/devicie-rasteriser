let fileInput;
let exportButton;
let invertButton;
let invertImageButton;
let blackPointSlider;
let whitePointSlider;
let densitySlider;
let scaleSlider;
let minDotSizeSlider;
let img;
let app;

// Initial Values
let density = 25;
let backgroundColor = 255;
let foregroundColor = 0;
let blackPoint = 0;
let whitePoint = 255;
let scale = 1;
let limitSize = true;
let invertImage = false;
let minDotSize = 1;

function setup() {
  // Select elements
  fileInput = select("#fileInput");
  exportButton = select("#exportButton");
  invertButton = select("#invertButton");
  limitSizeButton = select("#limitSizeButton");
  blackPointSlider = select("#blackPointSlider");
  whitePointSlider = select("#whitePointSlider");
  densitySlider = select("#densitySlider");
  scaleSlider = select("#scaleSlider");
  minDotSizeSlider = select("#minDotSizeSlider");
  invertImageButton = select("#invertImageButton");
  app = select(".app");

  createCanvas(1600, 1600);

  fileInput.changed(handleFile);
  blackPointSlider.input(handleBlackPointChange);
  whitePointSlider.input(handleWhitePointChange);
  densitySlider.input(handleDensityChange);
  invertButton.mousePressed(invertColors);
  invertImageButton.mousePressed(handleInvertImage);
  limitSizeButton.mousePressed(handleLimitSize);
  scaleSlider.input(handleScaleChange);
  exportButton.mousePressed(exportCanvas);
  minDotSizeSlider.input(handleMinDotSizeChange);
}

function draw() {
  background(backgroundColor);
  noStroke();
  fill(foregroundColor);

  let tiles = density;
  // let tileSize = width / tiles;
  let tileSize = width / tiles;

  for (let i = 0; i < tiles; i++) {
    for (let j = 0; j < tiles; j++) {
      const posX = i * tileSize + tileSize / 2;
      const posY = j * tileSize + tileSize / 2;

      if (img) {
        let c = img.get(i * (tileSize / scale), j * (tileSize / scale));
        const avg = (c[0] + c[1] + c[3]) / 3;
        let circleSize = map(
          avg,
          invertImage ? whitePoint : blackPoint,
          invertImage ? blackPoint : whitePoint,
          minDotSize,
          tileSize,
          limitSize
        );

        circle(posX, posY, circleSize);
        // circle(posX, posY, circleSize);
      } else {
        circle(posX, posY, 1);
      }
    }
  }
}

function invertColors() {
  const prevBackground = backgroundColor;
  const prevForeground = foregroundColor;
  backgroundColor = prevForeground;
  foregroundColor = prevBackground;

  if (backgroundColor === 0) {
    app.addClass("inverted");
  } else {
    app.removeClass("inverted");
  }
}

function handleBlackPointChange(event) {
  blackPoint = event.target.value;
}

function handleWhitePointChange(event) {
  whitePoint = event.target.value;
}

function handleFile(event) {
  const file = event.target.files[0];
  console.log(file);

  if (file.type) {
    let urlOfImageFile = URL.createObjectURL(file);
    img = loadImage(urlOfImageFile);

    console.log("it ran");
    select(".controls").removeClass("disabled");
  } else {
    console.log("it failed");
    img = null;
  }
}

function handleLimitSize() {
  const prevValue = limitSize;
  limitSize = !prevValue;
}

function handleInvertImage() {
  const prevValue = invertImage;
  invertImage = !prevValue;
}

function exportCanvas() {
  saveCanvas("myCanvas", "png");
}

function handleDensityChange(event) {
  density = 12.5 * 2 ** event.target.value;
}

function handleScaleChange(event) {
  scale = event.target.value;
}

function handleMinDotSizeChange(event) {
  minDotSize = event.target.value;
}
