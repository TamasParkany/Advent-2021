const grid = document.getElementById("grid");
const toggleLinesButton = document.getElementById("toggle-lines");
const resetGridButton = document.getElementById("reset-grid");
const colorPickerButton = document.getElementById("color-picker");
const gridSizeButton = document.getElementById("grid-size");
const gridSizeInfo = document.getElementById("grid-size-info");

window.addEventListener("load", createGrid(64));
window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);
colorPickerButton.addEventListener("input", colorPicker);
toggleLinesButton.addEventListener("click", toggleLines);
resetGridButton.addEventListener("click", clearGrid);
gridSizeButton.addEventListener("input", updateOutput);
gridSizeButton.addEventListener("change", updateGridSize);

let color = "black";
let mouseActive = false;

function createGrid(size) {
  let gridSize = size * size;

  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 1; i <= gridSize; i++) {
    let gridChunk = document.createElement("div");
    gridChunk.classList.add("grid-chunk", "grid-chunk-lines");
    gridChunk.addEventListener("mousedown", gridClick);
    gridChunk.addEventListener("mouseenter", gridHover);
    grid.appendChild(gridChunk);
  }
}

function mouseDown() {
  mouseActive = true;
}

function mouseUp() {
  mouseActive = false;
}

function gridClick() {
  this.style.backgroundColor = color;
}

function gridHover() {
  if (mouseActive) {
    this.style.backgroundColor = color;
  }
}

function colorPicker() {
  color = this.value;
}

function toggleLines() {
  let gridChunks = grid.querySelectorAll("div");
  gridChunks.forEach((chunk) => chunk.classList.toggle("grid-chunk-lines"));
}

function clearGrid() {
  let gridChunks = grid.querySelectorAll("div");
  gridChunks.forEach((chunk) => (chunk.style.backgroundColor = "white"));
}

function updateOutput() {
  gridSizeInfo.innerText = `Grid size: ${this.value} x ${this.value}`;
}

function updateGridSize() {
  let gridChunks = grid.querySelectorAll("div");
  gridChunks.forEach((chunk) => chunk.remove());
  createGrid(this.value);
}
