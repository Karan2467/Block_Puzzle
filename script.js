const COLORS = ["Red", "Orange", "Yellow", "Blue", "Green", "Purple"];
let operatorSequence = [];
let userSequence = [];
let attempts = 0;

const userSequenceDiv = document.getElementById("userSequence");
const operatorSequenceDiv = document.getElementById("operatorSequence");
const blockCountSelect = document.getElementById("blockCount");
const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkBtn");
const matchResult = document.getElementById("matchResult");
const attemptsDisplay = document.getElementById("attempts");
const congratsMessage = document.getElementById("congratsMessage");
const replayBtn = document.getElementById("replayBtn");
const revealBtn = document.getElementById("revealBtn");

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createBlock(color) {
  const div = document.createElement("div");
  div.className = "block";
  div.textContent = color;
  div.style.backgroundColor = color.toLowerCase();
  div.draggable = true;

  // Desktop drag events
  div.addEventListener("dragstart", dragStart);
  div.addEventListener("dragover", dragOver);
  div.addEventListener("drop", drop);
  div.addEventListener("dragenter", (e) => e.preventDefault());

  // Mobile touch events
  div.addEventListener("touchstart", (e) => {
    touchSrcEl = div;
    div.classList.add("picked");
  });

  div.addEventListener("touchend", (e) => {
    if (touchSrcEl) {
      touchSrcEl.classList.remove("picked");

      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList.contains("block") && touchSrcEl !== target) {
        const srcIndex = Array.from(userSequenceDiv.children).indexOf(touchSrcEl);
        const targetIndex = Array.from(userSequenceDiv.children).indexOf(target);

        const blocks = Array.from(userSequenceDiv.children);
        const parent = userSequenceDiv;

        const temp = document.createElement("div");
        parent.replaceChild(temp, blocks[srcIndex]);
        parent.replaceChild(blocks[srcIndex], blocks[targetIndex]);
        parent.replaceChild(blocks[targetIndex], temp);
      }

      touchSrcEl = null;
    }
  });

  return div;
}

let dragSrcEl = null;

function dragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (dragSrcEl !== this) {
    const srcIndex = Array.from(userSequenceDiv.children).indexOf(dragSrcEl);
    const targetIndex = Array.from(userSequenceDiv.children).indexOf(this);

    // Swap the elements in the DOM
    const blocks = Array.from(userSequenceDiv.children);
    const parent = userSequenceDiv;

    const temp = document.createElement("div");
    parent.replaceChild(temp, blocks[srcIndex]);
    parent.replaceChild(blocks[srcIndex], blocks[targetIndex]);
    parent.replaceChild(blocks[targetIndex], temp);
  }
}

// Touch event handlers
let touchSrcEl = null;

function touchStart(e) {
  touchSrcEl = e.target;
  if (touchSrcEl.classList.contains("block")) {
    touchSrcEl.classList.add("picked");
  }
}

function touchMove(e) {
  e.preventDefault(); // Prevent scrolling
}

function touchEnd(e) {
  if (touchSrcEl && touchSrcEl.classList.contains("block")) {
    touchSrcEl.classList.remove("picked");
  }

  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (touchSrcEl && target && target.classList.contains("block") && touchSrcEl !== target) {
    const srcIndex = Array.from(userSequenceDiv.children).indexOf(touchSrcEl);
    const targetIndex = Array.from(userSequenceDiv.children).indexOf(target);

    const blocks = Array.from(userSequenceDiv.children);
    const parent = userSequenceDiv;

    const temp = document.createElement("div");
    parent.replaceChild(temp, blocks[srcIndex]);
    parent.replaceChild(blocks[srcIndex], blocks[targetIndex]);
    parent.replaceChild(blocks[targetIndex], temp);
  }

  touchSrcEl = null;
}

function renderSequences(n) {
  userSequenceDiv.innerHTML = "";
  operatorSequenceDiv.innerHTML = "";

  operatorSequence = shuffleArray(COLORS.slice(0, n));

  userSequence = shuffleArray([...operatorSequence]);

  userSequence.forEach((color) => {
    const block = createBlock(color);
    userSequenceDiv.appendChild(block);
  });

  operatorSequence.forEach((color) => {
    const block = createBlock(color);
    block.draggable = false;
    operatorSequenceDiv.appendChild(block);
  });
}

startBtn.addEventListener("click", () => {
  const n = parseInt(blockCountSelect.value);
  renderSequences(n);
  matchResult.textContent = "";
  attempts = 0;
  attemptsDisplay.textContent = "";
  congratsMessage.classList.add("hidden");
  operatorSequenceDiv.classList.add("hidden");
});

checkBtn.addEventListener("click", () => {
  const userBlocks = [...userSequenceDiv.children];
  let match = 0;
  userBlocks.forEach((block, idx) => {
    if (block.textContent === operatorSequence[idx]) {
      match++;
    }
  });
  attempts++;
  if (match === 1) {
	matchResult.textContent = `${match} block is aligned correctly.`;
  } else {
    matchResult.textContent = `${match} blocks are aligned correctly.`;
  }
  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  if (match === operatorSequence.length) {
    congratsMessage.classList.remove("hidden");
  }
});

revealBtn.addEventListener("click", () => {
  const pwd = prompt("Enter password to reveal operator sequence:");
  if (pwd === "1234") {
    operatorSequenceDiv.classList.toggle("hidden");
  } else {
    alert("Incorrect password.");
  }
});

replayBtn.addEventListener("click", () => {
  renderSequences(operatorSequence.length);
  matchResult.textContent = "";
  attempts = 0;
  attemptsDisplay.textContent = "";
  congratsMessage.classList.add("hidden");
  operatorSequenceDiv.classList.add("hidden");
});

const instructionsBtn = document.getElementById("instructionsBtn");
const instructionsModal = document.getElementById("instructionsModal");
const closeBtn = document.querySelector(".close-btn");

instructionsBtn.addEventListener("click", () => {
  instructionsModal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  instructionsModal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === instructionsModal) {
    instructionsModal.classList.add("hidden");
  }
});