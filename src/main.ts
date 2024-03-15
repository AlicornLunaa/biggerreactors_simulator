import GenericReactor from './simulation/GenericReactor';
import { Materials } from './simulation/Materials';
import './style.css'

// Global variables
const REACTOR_WALL_COLOR = "#202020";
const REACTOR_ELEMENT_COLOR = "#316B1F";
const REACTOR_ELEMENT_HOVER_COLOR = "#4FAE0B";
const REACTOR_ELEMENT_ACTIVE_COLOR = "#46A701";
const REACTOR_CELL_GAP = 3;

let reactor = new GenericReactor();
let selectedType: string|null = null;

// Config modal window
const setup_elements = () => {
  // Variables
  let elementsDiv = document.querySelector<HTMLDivElement>(".material-list")!;

  // Functions
  const select_type = (type: string) => {
    selectedType = type;
  };

  const populate = () => {
    // Load the reactor's version number into the elements
    elementsDiv.innerHTML = "";

    for(const mat of Materials[0]){
      // Create a button for each element
      let btn = document.createElement("button") as HTMLButtonElement;
      btn.innerHTML = mat.displayName;
      btn.addEventListener("click", () => select_type(mat.id));
      elementsDiv.appendChild(btn);
    }
  };

  // Run
  populate();

  // Return the refresh function
  return populate;
};

const setup_canvas = () => {
  // Variables
  let reactorCanvas = document.querySelector<HTMLCanvasElement>("#reactor-canvas")!;
  let ctx = reactorCanvas.getContext("2d")!;
  let selectedCellX = 0;
  let selectedCellY = 0;
  let clicking = false;

  // Functions
  const get_mouse_pos = (ev: MouseEvent) => {
    x:return {
      x: ev.clientX - reactorCanvas.getBoundingClientRect().left,
      y: ev.clientY - reactorCanvas.getBoundingClientRect().top
    };
  };

  const update_selected_cell = (ev: MouseEvent) => {
    let pos = get_mouse_pos(ev);
    selectedCellX = Math.floor(pos.x / (reactorCanvas.width / (reactor.width + 2)));
    selectedCellY = Math.floor(pos.y / (reactorCanvas.height / (reactor.height + 2)));
  };

  const resize_canvas = () => {
    // Resizes the canvas to fit its CSS scales
    reactorCanvas.style.aspectRatio = (reactor.width / reactor.height).toString();
    reactorCanvas.width = reactorCanvas.offsetWidth;
    reactorCanvas.height = reactorCanvas.offsetHeight;
  };

  const draw = () => {
    // Clear the canvas to prep a redraw
    ctx.clearRect(0, 0, reactorCanvas.width, reactorCanvas.height);

    // Reactor width is over-estimated by 2 to account for the walls of the reactor. They aren't real blocks.
    let cellWidth = reactorCanvas.width / (reactor.width + 2);
    let cellHeight = reactorCanvas.height / (reactor.height + 2);

    // Helper
    const fill_cell = (x: number, y: number, style: string, text?: string) => {
      // Fills in a cell given x and y
      let cellX = cellWidth * x + REACTOR_CELL_GAP / 2;
      let cellY = cellHeight * y + REACTOR_CELL_GAP / 2;
      let cellW = cellWidth - REACTOR_CELL_GAP;
      let cellH = cellHeight - REACTOR_CELL_GAP;
      ctx.fillStyle = style;
      ctx.fillRect(cellX, cellY, cellW, cellH);

      // Render text if requested
      if(text){
        ctx.font = `${30 * (cellWidth / 195)}px Arial`;
        ctx.textAlign = "center"
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, cellWidth * x + cellWidth / 2, cellHeight * y + cellHeight / 2 + 10);
      }
    };

    // Draw each cell or 'block' in the reactor, top-down
    for(let i = 0; i < reactor.width + 2; i++){
      for(let k = 0; k < reactor.height + 2; k++){
        // Draw a wall block and stop all other calculations
        if(i == 0 || i == reactor.width + 1 || k == 0 || k == reactor.height + 1){
          fill_cell(i, k, REACTOR_WALL_COLOR);
          continue;
        }
    
        if(selectedCellX == i && selectedCellY == k){
          // Draw a selected cell
          let color = clicking ? REACTOR_ELEMENT_ACTIVE_COLOR : REACTOR_ELEMENT_HOVER_COLOR;
          fill_cell(i, k, color, "Hello!");
        } else {
          // If it is not selected, it should use the default color
          fill_cell(i, k, REACTOR_ELEMENT_COLOR, "Hello!");
        }
      }
    }
  };

  // Runtime
  resize_canvas();
  draw();

  // Events
  window.addEventListener("resize", () => {
    resize_canvas();
    draw();
  });
  
  reactorCanvas.addEventListener("mousemove", (ev) => {
    update_selected_cell(ev);
    draw();
  });
  
  reactorCanvas.addEventListener("mousedown", (ev) => {
    clicking = true;
    update_selected_cell(ev);
    draw();
  });
  
  reactorCanvas.addEventListener("mouseup", (ev) => {
    clicking = false;
    update_selected_cell(ev);
    draw();
  });

  // Canvas refresher
  return draw;
};

const setup_modal = (refresh_elements: () => void, refresh_canvas: () => void) => {
  // Buttons
  let modalWindow = document.querySelector<HTMLButtonElement>("#reactor-modal")!;

  let openBtn = document.querySelector<HTMLButtonElement>("#new-reactor-btn")!;
  let closeBtn = document.querySelector<HTMLButtonElement>("#reactor-submit-btn")!;

  let versionSelect = document.querySelector<HTMLSelectElement>("#reactor-version-txt")!;
  let widthInput = document.querySelector<HTMLInputElement>("#reactor-width-txt")!;
  let depthInput = document.querySelector<HTMLInputElement>("#reactor-depth-txt")!;
  let heightInput = document.querySelector<HTMLInputElement>("#reactor-height-txt")!;

  // Functions
  const open_modal = () => {
    modalWindow.style.display = "block";
    widthInput.value = `${reactor.width}`;
    depthInput.value = `${reactor.depth}`;
    heightInput.value = `${reactor.height}`;
  };

  const close_modal = () => {
    modalWindow.style.display = "none";
  };

  const update_dimensions = () => {
    reactor.width = Number.parseInt(widthInput.value);
    reactor.depth = Number.parseInt(depthInput.value);
    reactor.height = Number.parseInt(heightInput.value);
    refresh_canvas();
  }

  const update_version = () => {
    reactor.clear();
    reactor.version = versionSelect.value;
    refresh_elements();
  };

  // Events
  versionSelect.addEventListener("change", update_version);
  widthInput.addEventListener("change", update_dimensions);
  depthInput.addEventListener("change", update_dimensions);
  heightInput.addEventListener("change", update_dimensions);
  openBtn.addEventListener("click", open_modal);
  closeBtn.addEventListener("click", close_modal);
  window.addEventListener("click", (ev) => { if(ev.target == modalWindow) close_modal(); });
};

// Init
const refresh_elements = setup_elements();
const refresh_canvas = setup_canvas();
setup_modal(refresh_elements, refresh_canvas);