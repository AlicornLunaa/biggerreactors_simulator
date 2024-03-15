import { Materials } from './simulation/Materials';
import './style.css'

// Global variables
const REACTOR_WALL_COLOR = "#202020";
const REACTOR_ELEMENT_COLOR = "#316B1F";
const REACTOR_ELEMENT_HOVER_COLOR = "#4FAE0B";
const REACTOR_ELEMENT_ACTIVE_COLOR = "#46A701";

let reactorWidth = 3;
let reactorDepth = 3;
let reactorHeight = 3;

let mouseX = 0;
let mouseY = 0;
let selectedI = 0;
let selectedK = 0;
let clicking = false;

// Config modal window
let newBtn = document.querySelector<HTMLButtonElement>("#new-reactor-btn")!;
let modalWindow = document.querySelector<HTMLButtonElement>("#reactor-modal")!;
newBtn.addEventListener("click", () => {
  modalWindow.style.display = "block";
});

window.onclick = function(event) {
  if (event.target == modalWindow) {
    modalWindow.style.display = "none";
  }
}

// Populate element list
let elementsDiv = document.querySelector<HTMLDivElement>(".material-list")!;
elementsDiv.innerHTML = "";

for(const mat of Materials[0]){
  let btn = document.createElement("button") as HTMLButtonElement;
  btn.innerHTML = mat.displayName;
  
  btn.addEventListener("click", () => {
    alert(mat.id);
  });
  
  elementsDiv.appendChild(btn);
}

// Create canvas
let reactorCanvas = document.querySelector<HTMLCanvasElement>("#reactor-canvas")!;
reactorCanvas.width = reactorCanvas.offsetWidth;
reactorCanvas.height = reactorCanvas.offsetHeight;
let ctx = reactorCanvas.getContext("2d")!;

const draw_canvas = () => {
  ctx.clearRect(0, 0, reactorCanvas.width, reactorCanvas.height);

  for(let i = 0; i < reactorWidth + 2; i++) for(let k = 0; k < reactorWidth + 2; k++){
    let cellWidth = reactorCanvas.width / (reactorWidth + 2);
    let cellHeight = reactorCanvas.height / (reactorHeight + 2);
    let cellGap = 5;
    
    let cellX = cellWidth * i + cellGap;
    let cellY = cellHeight * k + cellGap;
    let cellW = cellWidth - cellGap / 2;
    let cellH = cellHeight - cellGap / 2;

    ctx.fillStyle = REACTOR_ELEMENT_COLOR;

    if(i == 0 || i == reactorWidth + 1 || k == 0 || k == reactorWidth + 1){
      ctx.fillStyle = REACTOR_WALL_COLOR;
      ctx.fillRect(cellX, cellY, cellW, cellH);
      continue;
    }

    if(selectedI == i && selectedK == k){
      ctx.fillStyle = clicking ? REACTOR_ELEMENT_ACTIVE_COLOR : REACTOR_ELEMENT_HOVER_COLOR;
    }
    
    ctx.fillRect(cellX, cellY, cellW, cellH);
    
    ctx.font = "20px Arial";
    ctx.textAlign = "center"
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Hello world", cellWidth * i + cellWidth / 2, cellHeight * k + cellHeight / 2 + 10);
  }
}
draw_canvas();

reactorCanvas.addEventListener("mousemove", (ev) => {
  const get_mouse_pos = () => { x:return { x: ev.clientX - reactorCanvas.getBoundingClientRect().left, y: ev.clientY - reactorCanvas.getBoundingClientRect().top }; };
  let pos = get_mouse_pos();
  mouseX = pos.x;
  mouseY = pos.y;
  selectedI = Math.floor(mouseX / (reactorCanvas.width / (reactorWidth + 2)));
  selectedK = Math.floor(mouseY / (reactorCanvas.height / (reactorHeight + 2)));
  draw_canvas();
});

reactorCanvas.addEventListener("mousedown", (ev) => {
  const get_mouse_pos = () => { x:return { x: ev.clientX - reactorCanvas.getBoundingClientRect().left, y: ev.clientY - reactorCanvas.getBoundingClientRect().top }; };
  let pos = get_mouse_pos();
  mouseX = pos.x;
  mouseY = pos.y;
  selectedI = Math.floor(mouseX / (reactorCanvas.width / (reactorWidth + 2)));
  selectedK = Math.floor(mouseY / (reactorCanvas.height / (reactorHeight + 2)));
  clicking = true;
  draw_canvas();
});

reactorCanvas.addEventListener("mouseup", (ev) => {
  const get_mouse_pos = () => { x:return { x: ev.clientX - reactorCanvas.getBoundingClientRect().left, y: ev.clientY - reactorCanvas.getBoundingClientRect().top }; };
  let pos = get_mouse_pos();
  mouseX = pos.x;
  mouseY = pos.y;
  selectedI = Math.floor(mouseX / (reactorCanvas.width / (reactorWidth + 2)));
  selectedK = Math.floor(mouseY / (reactorCanvas.height / (reactorHeight + 2)));
  clicking = false;
  draw_canvas();
});