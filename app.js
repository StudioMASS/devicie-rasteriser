let fileInput;
let exportButton;
let blackPointSlider;
let whitePointSlider;
let densitySlider;
let imageScaleSlider;
let minDotSizeSlider;
let flipColorsCheckbox;
let invertImageCheckbox;
let limitDotSizeCheckbox;
let img;
let app;

// Initial Values
let density = 25;
let backgroundColor = 255;
let foregroundColor = 0;
let blackPoint = 0;
let whitePoint = 255;
let imageScale = 1;
let limitSize = true;
let invertImage = false;
let minDotSize = 1;

function setup() {
  // Select elements
  fileInput = select("#fileInput");
  exportButton = select("#exportButton");
  blackPointSlider = select("#blackPointSlider");
  whitePointSlider = select("#whitePointSlider");
  densitySlider = select("#densitySlider");
  imageScaleSlider = select("#imageScaleSlider");
  minDotSizeSlider = select("#minDotSizeSlider");
  flipColorsCheckbox = select("#flipColors");
  invertImageCheckbox = select("#invertImage");
  limitDotSizeCheckbox = select("#limitDotSize");
  app = select(".app");

  createCanvas(1600, 1600);

  fileInput.changed(handleFile);
  blackPointSlider.input(handleBlackPointChange);
  whitePointSlider.input(handleWhitePointChange);
  densitySlider.input(handleDensityChange);
  imageScaleSlider.input(handleimageScaleChange);
  exportButton.mousePressed(exportCanvas);
  minDotSizeSlider.input(handleMinDotSizeChange);
  flipColorsCheckbox.changed(handleFlipColors);
  invertImageCheckbox.changed(handleInvertImage);
  limitDotSizeCheckbox.changed(handleLimitSize);
}

function draw() {
  background(backgroundColor);
  noStroke();
  fill(foregroundColor);

  let tiles = density;
  let tileSize = width / tiles;

  for (let i = 0; i < tiles; i++) {
    for (let j = 0; j < tiles; j++) {
      const posX = i * tileSize + tileSize / 2;
      const posY = j * tileSize + tileSize / 2;

      if (img) {
        let c = img.get(
          i * (tileSize / imageScale),
          j * (tileSize / imageScale)
        );
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
      } else {
        circle(posX, posY, 1);
      }
    }
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

function handleLimitSize(e) {
  if (e.target.checked) {
    limitSize = true;
  } else {
    limitSize = false;
  }
}

function handleInvertImage(e) {
  if (e.target.checked) {
    invertImage = true;
  } else {
    invertImage = false;
  }
}

function exportCanvas() {
  saveCanvas("Devicie-Image", "png");
}

function handleDensityChange(event) {
  density = 12.5 * 2 ** event.target.value;
}

function handleimageScaleChange(event) {
  imageScale = 1 + event.target.value / 10;
  console.log(1 + event.target.value / 10);
}

function handleMinDotSizeChange(event) {
  minDotSize = event.target.value;
}

function handleFlipColors(e) {
  if (e.target.checked) {
    backgroundColor = 0;
    foregroundColor = 255;
    app.addClass("inverted");
  } else {
    backgroundColor = 255;
    foregroundColor = 0;
    app.removeClass("inverted");
  }
}
