function grow() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(`${i } - ${ new Date().toTimeString()}`));
    frag.appendChild(div);
  }
  document.getElementById('nodes').appendChild(frag);
}

function startGrowing() {
  window.int1 = setInterval(grow, 1000);
}

function stopGrowing() {
  clearInterval(window.int1);
}

document.getElementById("start_button").addEventListener("click", startGrowing);
document.getElementById("stop_button").addEventListener("click", stopGrowing);
