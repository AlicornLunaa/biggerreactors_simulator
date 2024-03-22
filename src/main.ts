import GenericReactor from './simulation/GenericReactor';
import { Materials } from './simulation/Materials';
import "./styles/global.css"
import "./styles/control_panel.css"
import "./styles/control_rods.css"

// Global variables
const REACTOR_WALL_COLOR = "#202020";
const REACTOR_ELEMENT_COLOR = "#316B1F";
const REACTOR_ELEMENT_HOVER_COLOR = "#4FAE0B";
const REACTOR_ELEMENT_ACTIVE_COLOR = "#46A701";
const REACTOR_CELL_GAP = 1.5;

let reactor = new GenericReactor();
let selectedType: string|null = null;

// Config modal window
const setup_elements = () => {
  // Variables
  let elementsDiv = document.querySelector<HTMLDivElement>(".material-list")!;
  let lastActiveBtn: HTMLButtonElement|null = null;

  // Functions
  const select_type = (type: string) => {
    selectedType = type;
  };

  const populate = () => {
    // Load the reactor's version number into the elements
    elementsDiv.innerHTML = "";

    for(const key in Materials[reactor.version]){
      // Create a button for each element
      let mat = Materials[reactor.version][key];
      let btn = document.createElement("button") as HTMLButtonElement;
      btn.innerHTML = mat.displayName;

      btn.addEventListener("click", () => {
        if(lastActiveBtn){
          lastActiveBtn.className = "";
        }

        btn.className = 'selected-element-btn';
        lastActiveBtn = btn;

        select_type(mat.id)
      });

      elementsDiv.appendChild(btn);
    }
  };

  // Run
  populate();

  // Return the refresh function
  return populate;
};

const setup_simulation = () => {
  // Variables
  let reactorSimulation = reactor.get_simulation();

  let sizeTag = document.querySelector<HTMLParagraphElement>("#reactor-size-lbl")!;

  let tempStatLbl = document.querySelector<HTMLDivElement>("#temp-stat")!;
  let generationStatLbl = document.querySelector<HTMLDivElement>("#gen-stat")!;
  let fuelUseStatLbl = document.querySelector<HTMLDivElement>("#fuel-use-stat")!;
  let efficiencyStatLbl = document.querySelector<HTMLDivElement>("#rf-per-stat")!;
  let reactivityStatLbl = document.querySelector<HTMLDivElement>("#react-stat")!;
  let fuelStatLbl = document.querySelector<HTMLDivElement>("#fuel-stat")!;
  let wasteStatLbl = document.querySelector<HTMLDivElement>("#waste-stat")!;
  let batteryStatLbl = document.querySelector<HTMLDivElement>("#bat-stat")!;

  let fuelBar = document.querySelector<HTMLDivElement>("#fuel-bar")!;
  let wasteBar = document.querySelector<HTMLDivElement>("#waste-bar")!;
  let caseHeatBar = document.querySelector<HTMLDivElement>("#case-heat-bar")!;
  let fuelHeatBar = document.querySelector<HTMLDivElement>("#fuel-heat-bar")!;
  let batteryBar = document.querySelector<HTMLDivElement>("#battery-bar")!;

  let activeButton = document.querySelector<HTMLInputElement>("#reactor-active-toggle")!;
  let refuelButton = document.querySelector<HTMLButtonElement>("#reactor-refuel-btn")!;

  let controlRods = document.querySelector<HTMLDivElement>(".rods")!;
  let controlRodLock = document.querySelector<HTMLInputElement>("#control-rod-lock")!;

  // Functions
  const round = (val: number, places: number) => {
    return Math.round(val * places) / places;
  };

  const unit = (rf: number): [number, string] => {
    if(rf >= 1_000_000){
      return [round(rf / 1_000_000, 100), "MiRF/t"];
    } else if(rf >= 1000){
      return [round(rf / 1000, 100), "KiRF/t"];
    }

    return [Math.round(rf), "RF/t"];
  };

  const set_bar_height = (bar: HTMLDivElement, val: number) => {
    bar.style.top = `${(1 - val) * 100}%`;
    bar.style.height = `${val * 100}%`;
  };

  const create_new_sim = () => {
    reactorSimulation = reactor.get_simulation();
  };

  const update_rods = () => {
    controlRods.innerHTML = "";

    if(reactorSimulation.get_control_rod_count() == 0){
      controlRods.innerHTML = "No control rods";
      return;
    }

    const set_rod = (i: number, slider: HTMLInputElement, lbl: HTMLSpanElement) => {
      reactorSimulation.set_control_rod(i, Number.parseFloat(slider.value));
      lbl.innerHTML = `Rod ${i + 1} at ${slider.value}% insertion`;
    };

    // Create new sliders
    for(let i = 0; i < reactorSimulation.get_control_rod_count(); i++){
      let container = document.createElement("div");
      container.className = "control-rod-slider";

      let slider = document.createElement("input");
      slider.type = "range";
      slider.min = "0";
      slider.max = "100";
      slider.value = "0";
      slider.step = "0.1";

      let label = document.createElement("span");
      label.innerHTML = `Rod ${i + 1} at ${slider.value}% insertion`;

      slider.addEventListener("input", () => {
        set_rod(i, slider, label);

        if(controlRodLock.checked){
          // Update all others if its checked
          let sliderList = document.querySelectorAll<HTMLInputElement>(".control-rod-slider");
          
          sliderList.forEach((element, key) => {
            if(key == i) return;
            let otherSlider = element.querySelector<HTMLInputElement>("input")!;
            set_rod(key, otherSlider, element.querySelector<HTMLSpanElement>("span")!);
            otherSlider.value = slider.value;
          });
        }
      });

      container.appendChild(label);
      container.appendChild(slider);
      controlRods.appendChild(container);
    }
  };

  const update_tags = () => {
    sizeTag.innerHTML = `Inner Dimensions: ${reactor.width}x${reactor.depth}x${reactor.height}<br>Outer Dimensions: ${reactor.width + 2}x${reactor.depth + 2}x${reactor.height + 2}`;

    let [rfGenerated, rfUnit] = unit(reactorSimulation.get_generated());

    tempStatLbl.innerHTML = `Temperature: ${round(reactorSimulation.get_fuel_temperature(), 1)} K`;
    generationStatLbl.innerHTML = `Generation: ${rfGenerated} ${rfUnit}`;
    fuelUseStatLbl.innerHTML = `Fuel usage: ${round(reactorSimulation.get_fuel_burned(), 1000)} mB/t`;
    efficiencyStatLbl.innerHTML = `RF per fuel: ${reactorSimulation.get_fuel_burned() == 0 ? 0 : round(rfGenerated / reactorSimulation.get_fuel_burned(), 1000)} RF/mB/t`;
    reactivityStatLbl.innerHTML = `Reactivity: ${round(reactorSimulation.get_fertility() * 100, 10)}%`;
    fuelStatLbl.innerHTML = `Fuel: ${Math.round(reactorSimulation.get_fuel())}/${Math.round(reactorSimulation.get_fuel_capacity())}`;
    wasteStatLbl.innerHTML = `Waste: ${Math.round(reactorSimulation.get_waste())}/${Math.round(reactorSimulation.get_fuel_capacity())}`;
    batteryStatLbl.innerHTML = `Battery: ${Math.round(reactorSimulation.get_energy())}/${Math.round(reactorSimulation.get_energy_capacity())}`;

    set_bar_height(fuelBar, reactorSimulation.get_fuel() / reactorSimulation.get_fuel_capacity());
    set_bar_height(wasteBar, reactorSimulation.get_waste() / reactorSimulation.get_fuel_capacity());
    set_bar_height(caseHeatBar, Math.min(reactorSimulation.get_stack_temperature() / 2000, 1));
    set_bar_height(fuelHeatBar, Math.min(reactorSimulation.get_fuel_temperature() / 2000, 1));
    set_bar_height(batteryBar, (reactorSimulation.get_energy() / reactorSimulation.get_energy_capacity()));
  };

  const start_tick_loop = () => {
    setInterval(() => {
      reactorSimulation.tick(activeButton.checked);
      update_tags();
    }, 50);
  };

  // Events
  refuelButton.addEventListener("click", () => {
    reactorSimulation.refuel();
    update_tags();
  });

  // Runtime
  update_tags();
  start_tick_loop();

  // Returns
  return { update_tags, create_new_sim, update_rods };
};

const setup_canvas = (update_tags: () => void, create_new_sim: () => void, update_rods: () => void) => {
  // Variables
  let reactorCanvas = document.querySelector<HTMLCanvasElement>("#reactor-canvas")!;
  let ctx = reactorCanvas.getContext("2d")!;
  let selectedCellX = 0;
  let selectedCellY = 0;
  let clicking = false;

  // Functions
  const get_mat = (id: string) => {
    return Materials[reactor.version][id];
  }

  const get_mouse_pos = (ev: MouseEvent) => {
    x:return {
      x: ev.clientX - reactorCanvas.getBoundingClientRect().left,
      y: ev.clientY - reactorCanvas.getBoundingClientRect().top
    };
  };

  const update_selected_cell = (ev: MouseEvent) => {
    let pos = get_mouse_pos(ev);
    selectedCellX = Math.floor(pos.x / (reactorCanvas.width / (reactor.width + 2)));
    selectedCellY = Math.floor(pos.y / (reactorCanvas.height / (reactor.depth + 2)));
  };

  const refresh_canvas = () => {
    // Clear the canvas to prep a redraw
    ctx.clearRect(0, 0, reactorCanvas.width, reactorCanvas.height);

    // Reactor width is over-estimated by 2 to account for the walls of the reactor. They aren't real blocks.
    let cellWidth = reactorCanvas.width / (reactor.width + 2);
    let cellHeight = reactorCanvas.height / (reactor.depth + 2);

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
      for(let k = 0; k < reactor.depth + 2; k++){
        // Draw a wall block and stop all other calculations
        if(i == 0 || i == reactor.width + 1 || k == 0 || k == reactor.depth + 1){
          fill_cell(i, k, REACTOR_WALL_COLOR);
          continue;
        }

        let currentMaterial = reactor.get_block(i - 1, k - 1);
    
        if(selectedCellX == i && selectedCellY == k){
          // Draw a selected cell
          let color = clicking ? REACTOR_ELEMENT_ACTIVE_COLOR : REACTOR_ELEMENT_HOVER_COLOR;
          fill_cell(i, k, color, currentMaterial.displayName);
        } else {
          // If it is not selected, it should use the default color
          fill_cell(i, k, REACTOR_ELEMENT_COLOR, currentMaterial.displayName);
        }
      }
    }
  };

  const resize_canvas = () => {
    // Resizes the canvas to fit its CSS scales
    reactorCanvas.style.aspectRatio = (reactor.width / reactor.depth).toString();
    reactorCanvas.width = reactorCanvas.offsetWidth;
    reactorCanvas.height = reactorCanvas.offsetHeight;
    refresh_canvas();
  };

  const place_block = () => {
    if(selectedType == null){
      selectedType = "minecraft:air";
    }

    let updateRodsAfter = (reactor.get_block(selectedCellX - 1, selectedCellY - 1).id == "biggerreactors:fuel_rod");

    reactor.set_block(selectedCellX - 1, selectedCellY - 1, get_mat(selectedType));
    create_new_sim();
    update_tags();

    if(selectedType == "biggerreactors:fuel_rod" || updateRodsAfter){
      update_rods();
    }
  };

  // Runtime
  resize_canvas();

  // Events
  window.addEventListener("resize", () => {
    resize_canvas();
    refresh_canvas();
  });
  
  reactorCanvas.addEventListener("mousemove", (ev) => {
    update_selected_cell(ev);

    if(clicking && selectedType){
      place_block();
    }

    refresh_canvas();
  });
  
  reactorCanvas.addEventListener("mousedown", (ev) => {
    clicking = true;
    update_selected_cell(ev);

    if(selectedType){
      place_block();
    }

    refresh_canvas();
  });
  
  reactorCanvas.addEventListener("mouseup", (ev) => {
    clicking = false;
    update_selected_cell(ev);
    refresh_canvas();
  });

  // Canvas refresher
  return { refresh_canvas, resize_canvas };
};

const setup_modal = (refresh_elements: () => void, refresh_canvas: () => void, resize_canvas: () => void, update_tags: () => void, create_new_sim: () => void) => {
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
    resize_canvas();
    refresh_canvas();
    create_new_sim();
    update_tags();
  }

  const update_version = () => {
    reactor.clear();
    reactor.version = versionSelect.value;
    refresh_elements();
    refresh_canvas();
  };

  // Events
  versionSelect.addEventListener("change", update_version);
  widthInput.addEventListener("change", update_dimensions);
  depthInput.addEventListener("change", update_dimensions);
  heightInput.addEventListener("change", update_dimensions);
  openBtn.addEventListener("click", open_modal);
  closeBtn.addEventListener("click", close_modal);
  window.addEventListener("click", (ev) => { if(ev.target == modalWindow) close_modal(); });

  // Runtime
  update_version();
};

// Init
const refresh_elements = setup_elements();
const { update_tags, create_new_sim, update_rods } = setup_simulation();
const { refresh_canvas, resize_canvas } = setup_canvas(update_tags, create_new_sim, update_rods);
setup_modal(refresh_elements, refresh_canvas, resize_canvas, update_tags, create_new_sim);