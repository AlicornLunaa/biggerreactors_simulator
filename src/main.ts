import './style.css'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

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