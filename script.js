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

let step = 1;
inputA.disabled = true;
inputB.disabled = true;
countBtn.disabled = true;

// ---------- APPLE CREATION ----------
function createApple() {
  const apple = document.createElement("div");
  apple.className = "apple";
  apple.innerText = "🍎";
  return apple;
}

function fillGlass(glass, count) {
  glass.innerHTML = "";
  for (let i = 0; i < count; i++) {
    glass.appendChild(createApple());
  }
}

// ---------- STORY FLOW ----------

inputA.addEventListener("change", () => {
  const yayThankMom = document.getElementById("yayThankMom");
  const value = parseInt(inputA.value) || 0;
  fillGlass(glass1, value);

  if (value > 0) {
    const message = "Yay! Thank you Mom! Can I have some more apples please?";
    conversation.innerHTML = "👦 Kid: " + message;
    playLine("yayThankMom");
    inputA.disabled = true;
    step = 2;
    yayThankMom.onended = () => {
        inputB.disabled = false;
        inputB.focus();
    };
  }
});

inputB.addEventListener("change", () => {
  const appleCount = document.getElementById("appleCount");
  const value = parseInt(inputB.value) || 0;
  fillGlass(glass2, value);

  if (value > 0 && step === 2) {
    conversation.innerHTML =
      "👦 Kid: Wow! Now I have more apples! Let me count them!";
      playLine("appleCount");
      inputB.disabled = true;
      appleCount.onended = () => {
        countBtn.disabled = false;
    };
  }
});

countBtn.addEventListener("click", () => {
  const num1 = parseInt(inputA.value) || 0;
  const num2 = parseInt(inputB.value) || 0;
  const total = num1 + num2;

  resultGlass.innerHTML = "";

  conversation.innerHTML = "👦 Kid: Counting my apples...";

  setTimeout(() => {
    for (let i = 0; i < total; i++) {
      resultGlass.appendChild(createApple());
    }

    resultText.innerText = total;
    conversation.innerHTML =
      "🎉 Kid: I counted them! This is amazing! 👏👏🎉";
      playLine("countedThem");
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
for (let i = 0; i < 20; i++) {
  bucket.appendChild(createApple());
}

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