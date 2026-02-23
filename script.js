const bucket = document.getElementById("bucket");
const glass1 = document.getElementById("glass1");
const glass2 = document.getElementById("glass2");
const resultGlass = document.getElementById("resultGlass");
const resultText = document.getElementById("resultText");
const inputA = document.getElementById("num1");
const inputB = document.getElementById("num2");
const conversation = document.getElementById("conversation");
const countBtn = document.getElementById("countBtn");
const resetBtn = document.getElementById("resetBtn");
const startStoryBtn = document.getElementById("startStoryBtn");
const addModeBtn = document.getElementById("addMode");
const subModeBtn = document.getElementById("subMode");
const symbol = document.querySelector(".symbol");

let mode = "add"; // default mode
let step = 1;
inputA.disabled = true;
inputB.disabled = true;
countBtn.disabled = true;

// ---------- APPLE CREATION ----------
function createApple(number) {
  const apple = document.createElement("div");
  apple.className = "apple";

  apple.innerHTML = `
    <span class="apple-emoji">🍎</span>
    <span class="apple-number">${number}</span>
  `;

  return apple;
}

function fillGlass(glass, count) {
  glass.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    glass.appendChild(createApple(i));
  }
}

// ---------- STORY FLOW ----------

inputA.addEventListener("change", () => {
  const yayThankMom = document.getElementById("yayThankMom");
  const value = parseInt(inputA.value) || 0;
  fillGlass(glass1, value);

  if (value > 0) {
    if (mode === "add") {
      const message = "Yay! Thank you Mom! Can I have some more apples please?";
      conversation.innerHTML = "👦 Kid: " + message;
      playLine("yayThankMom");
      yayThankMom.onended = () => {
        inputB.disabled = false;
        inputB.focus();
    };
    } else {
      const message = "Yay! Thank you Mom! Let me give some apples to Didi.";
      conversation.innerHTML = "👦 Kid: " + message;
      playLine("letmegiveapple");
      inputB.disabled = false;
      inputB.focus();
    }
    inputA.disabled = true;
    step = 2;
  }
});

inputB.addEventListener("change", () => {
  const appleCount = document.getElementById("appleCount");
  const value = parseInt(inputB.value) || 0;
  fillGlass(glass2, value);

  if (value > 0 && step === 2) {
    if (mode === "add") {
      conversation.innerHTML =
      "👦 Kid: Wow! Now I have more apples! Let me count them!";
      playLine("appleCount");
      appleCount.onended = () => {
        countBtn.disabled = false;
      };
    } else {
      const valueA = parseInt(inputA.value) || 0;
      if (value > valueA) {
          conversation.innerHTML =
        "👩 Kid: Oops! We don’t have that many apples. Let me try a smaller number 😊";
        playLine("oopsNotThatManyApple");
        inputB.value = "";       // clear wrong input
        fillGlass(glass2, 0);    // reset second glass
        return;                  // stop further execution
      }
      conversation.innerHTML =
      "👦 Kid: Now Let me count how many apples I have left.";
      playLine("appleHaveLeft");
      countBtn.disabled = false;
    }
    
      inputB.disabled = true;
      
  }
});

countBtn.addEventListener("click", () => {
  countBtn.disabled = true;
  countBtn.innerHTML = '<span class="spinner"></span> Counting...';

  const num1 = parseInt(inputA.value) || 0;
  const num2 = parseInt(inputB.value) || 0;
  let total;

  if (mode === "add") {
    total = num1 + num2;
  } else {
    total = num1 - num2;

    if (total < 0) total = 0; // prevent negative apples
  }

  resultGlass.innerHTML = "";

  conversation.innerHTML = "👦 Kid: Counting my apples...";

  setTimeout(() => {
    for (let i = 1; i <= total; i++) {
      resultGlass.appendChild(createApple(i));
    }

    resultText.innerText = total;
    conversation.innerHTML =
      "🎉 Kid: I counted them! This is amazing! 👏👏🎉";
      playLine("countedThem");
      // 🟢 Restore button
    countBtn.innerHTML = "Count Apples 🍎";
    countBtn.disabled = false;
  }, 800);
});

// ---------- RESET ----------
resetBtn.addEventListener("click", () => {
  inputA.value = "";
  inputB.value = "";
  glass1.innerHTML = "";
  glass2.innerHTML = "";
  resultGlass.innerHTML = "";
  resultText.innerText = "0";
  countBtn.disabled = true
  conversation.innerHTML =
    "👦 Kid: Mom, can I have some apples please?";
  startStoryBtn.disabled = false;  // enable again
  inputA.disabled = true
  inputB.disabled = true
});

startStoryBtn.addEventListener("click", () => {
    const firstMessage = "Mom, can I have some apples please?";
    const momCanIApples = document.getElementById("MomCanIApples");
    conversation.innerHTML = "👦 Kid: " + firstMessage;
    playLine("MomCanIApples");
  
    startStoryBtn.disabled = true;  // disable after start
    // When audio finishes → enable first input
    momCanIApples.onended = () => {
        inputA.disabled = false;
        inputA.focus();
    };
  });
  
// ---------- INITIAL BUCKET ----------
// for (let i = 0; i < 20; i++) {
//   bucket.appendChild(createApple(i+1));
// }

// function speak(text) {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = 'en-US';           // language
//       utterance.rate = 0.9;               // speed (0.1 - 10)
//       utterance.pitch = 1.2;              // pitch (0 - 2)
//       window.speechSynthesis.speak(utterance);
//     } else {
//       console.warn("SpeechSynthesis not supported in this browser.");
//     }
//   }

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Pick a kid-like or friendly voice (you can adjust)
      // Example: female or child-sounding voice
      utterance.voice = voices.find(v =>
        v.lang.startsWith('en') && v.name.toLowerCase().includes('child') // try to find "child" voice
      ) || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) // fallback
      || voices[0]; // final fallback
  
      utterance.rate = 0.9;  // speaking speed
      utterance.pitch = 1.8; // higher pitch sounds more like a kid
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("SpeechSynthesis not supported in this browser.");
    }
  }

  function playLine(lineId) {
    const audio = document.getElementById(lineId);
    audio.currentTime = 0;  // restart if already played
    audio.play();
  }

  addModeBtn.addEventListener("click", () => {
    mode = "add";
  
    addModeBtn.classList.add("active");
    subModeBtn.classList.remove("active");
  
    symbol.innerText = "+";   // change symbol
  });
  
  subModeBtn.addEventListener("click", () => {
    mode = "sub";
  
    subModeBtn.classList.add("active");
    addModeBtn.classList.remove("active");
  
    symbol.innerText = "−";   // change symbol to minus
  });

  function setupIntegerInput(input) {

    input.addEventListener("keydown", (e) => {
      if ([".", "e", "-", "+"].includes(e.key)) {
        e.preventDefault();
      }
    });
  
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
    });
  }

  setupIntegerInput(inputA);
  setupIntegerInput(inputB);