const getMinutesAndSecondsInputs = (timerElem) => timerElem
  .querySelectorAll("input[type='text']");

const getCurrentTimerDurationSeconds = (timerElem) => {
  const [durationInputMinutes, durationInputSeconds] =
    getMinutesAndSecondsInputs(timerElem);

  return BigInt(durationInputMinutes.value) * 60n +
    BigInt(durationInputSeconds.value);
};

const stopTimer = (timerElem, countdownIntervalId) => {
  timerElem.dataset.running = "false";
  clearInterval(countdownIntervalId);

  timerElem.classList.remove("timer-last-1-min");
};

const updateUiAccordingToTimerState = (
  timerElem,
  newTimeSeconds,
  countdownIntervalId,
) => {
  const [durationInputMinutes, durationInputSeconds] =
    getMinutesAndSecondsInputs(timerElem);

  if (newTimeSeconds < 60n) {
    timerElem.classList.add("timer-last-1-min");
  } else {
    timerElem.classList.remove("timer-last-1-min");
  }

  // Stops
  if (newTimeSeconds === 0n) {
    stopTimer(timerElem, countdownIntervalId);
  }

  // Changes the timer values
  const timerDurationMinutes = newTimeSeconds / 60n;
  const timerDurationSeconds = newTimeSeconds % 60n;
  durationInputMinutes.value = String(timerDurationMinutes);
  durationInputSeconds.value = String(timerDurationSeconds).padStart(2, "0");

  // changing value via JS doesn't trigger oninput, so manually change input width
  durationInputMinutes.style.width = `${durationInputMinutes.value.length}ch`;
  durationInputSeconds.style.width = `${durationInputSeconds.value.length}ch`;

  durationInputMinutes.readOnly = durationInputSeconds.readOnly =
    (timerElem.dataset.running === "true");
};

const addTimerEventListeners = (timerElem) => {
  let prevTime = null;
  let countdownIntervalId;

  const timerStartStopButton = timerElem
    .getElementsByClassName("start-stop-timer")[0];

  timerStartStopButton.addEventListener("click", () => {
    if (timerElem.dataset.running === "true") {
      stopTimer(timerElem, countdownIntervalId);
    } else {
      prevTime = new Date().getTime();

      const countdown = () => {
        const msElapsed = BigInt(new Date().getTime() - prevTime);
        const newTimeSeconds = getCurrentTimerDurationSeconds(timerElem) -
          msElapsed / 1000n;

        updateUiAccordingToTimerState(timerElem, newTimeSeconds,
          countdownIntervalId);

        if (msElapsed >= 1000n) {
          prevTime = new Date().getTime();
        }
      };

      // run once before setting interval to set prevTime and update UI
      countdown();
      countdownIntervalId = setInterval(countdown, 1);

      timerElem.dataset.running = "true";
    }

    updateUiAccordingToTimerState(timerElem,
      getCurrentTimerDurationSeconds(timerElem),
      countdownIntervalId);
  });


  const timerInputWrapper = timerElem
    .getElementsByClassName("timer-input-wrapper")[0];
  timerInputWrapper.addEventListener("focusout", () => {
    updateUiAccordingToTimerState(timerElem,
      getCurrentTimerDurationSeconds(timerElem), 0);
  });


  for (const timerInput of getMinutesAndSecondsInputs(timerElem)) {
    timerInput.addEventListener("keypress", (event) => {
      if (event.key < "0" || event.key > "9") {
        event.preventDefault();
      }
    });

    timerInput.addEventListener("input", () => {
      timerInput.style.transition = "border-bottom-color 0.2s";
      timerInput.style.width = `${Math.max(timerInput.value.length, 1)}ch`;
      setTimeout(() => {
        timerInput.style.transition = "width 0.2s, border-bottom-color 0.2s";
      }, 0);
    });
  }
};


// Adds only to normal Timer set
for(const normalTimer of document.getElementsByClassName("normal-timer")){
  for (const timerElem of normalTimer.getElementsByClassName("timer")) {
    addTimerEventListeners(timerElem);
  }
}


// Chess clock section



// swapButton.addEventListener("click", () => {
//   console.log("swap at " + chessTimer);
//   timerContainer = chessTimer.getElementsByClassName("chess-timer-internal-container")[0];
//   timerLeft = timerContainer.querySelectorAll(".timer")[0];
//   timerRight = timerContainer.querySelectorAll(".timer")[1];

//   if (timerLeft.dataset.running === "true" && timerRight.dataset.running === "true") {
//     console.log("Both are running");
//   } else {
//     console.log("Either one or none is running");
//   }
// });

const addChessTimerEventListeners = (chessTimerElem) => {

  let IntervalStorage = {}
  let prevTime = null;
  let countdownIntervalId;

  const timerContainer = chessTimerElem.getElementsByClassName("chess-timer-internal-container")[0];
  const leftTimer = timerContainer.getElementsByClassName("timer")[0];
  const rightTimer = timerContainer.getElementsByClassName("timer")[1];
  const leftTimerButton = leftTimer.getElementsByClassName("start-stop-timer")[0]
  const rightTimerButton = rightTimer.getElementsByClassName("start-stop-timer")[0]
  const buttonPanel = chessTimerElem.getElementsByClassName("button-panel")[0];
  const swapButton = buttonPanel.getElementsByClassName("swap")[0];
  const pauseButton = buttonPanel.getElementsByClassName("chess-clock-pause")[0];

  // Starting the initial timings
  const startClock = (button) => {

    timerElem = button.srcElement.closest(".timer");

    const otherTimerElem = Array.from(timerContainer.getElementsByClassName("timer")).filter((elem) =>  elem != timerElem)[0]

    if(otherTimerElem.dataset.running === "true" || timerElem.dataset.running === "true"){
      stopTimer(otherTimerElem, countdownIntervalId);
      stopTimer(timerElem, countdownIntervalId);
    }
    else{
      prevTime = new Date().getTime();
      const countdown = () => {
        const msElapsed = BigInt(new Date().getTime() - prevTime);
        const newTimeSeconds = getCurrentTimerDurationSeconds(timerElem) - msElapsed / 1000n;
        updateUiAccordingToTimerState(timerElem, newTimeSeconds, countdownIntervalId);
        if (msElapsed >= 1000n) {
          prevTime = new Date().getTime();
        }
      };

      countdown();
      countdownIntervalId = setInterval(countdown, 1);
      // OH NO MY QUEEN
      side = 
      console.log(side);
      IntervalStorage[side] = countdownIntervalId;
      timerElem.dataset.running="true";

    }
    updateUiAccordingToTimerState(timerElem, getCurrentTimerDurationSeconds(timerElem), countdownIntervalId);
  }

  leftTimerButton.addEventListener("click", startClock);
  rightTimerButton.addEventListener("click", startClock);

  // Implementing swapping mechanics
  swapButton.addEventListener("click", () => {
    if(leftTimer.dataset.running === "true" && rightTimer.dataset.running === "false"){
      console.log("Left");
      // console.log(IntervalStorage["left"])
    }
    else if(leftTimer.dataset.running === "false" && rightTimer.dataset.running === "true"){
      console.log("right")
    }
  })






  // Wrapping code
  const leftTimerWrapper = leftTimer.getElementsByClassName("timer-input-wrapper")[0];
  leftTimerWrapper.addEventListener("focusout", () => {
    updateUiAccordingToTimerState(leftTimer, getCurrentTimerDurationSeconds(leftTimer), 0);
  });

  const rightTimerWrapper = rightTimer.getElementsByClassName("timer-input-wrapper")[0];
  rightTimerWrapper.addEventListener("focusout", () => {
    updateUiAccordingToTimerState(rightTimer, getCurrentTimerDurationSeconds(rightTimer), 0);
  });
  
  for (const timerInput of getMinutesAndSecondsInputs(chessTimerElem)) {
    timerInput.addEventListener("keypress", (event) => {
      if (event.key < "0" || event.key > "9") {
        event.preventDefault();
      }
    });

    timerInput.addEventListener("input", () => {
      timerInput.style.transition = "border-bottom-color 0.2s";
      timerInput.style.width = `${Math.max(timerInput.value.length, 1)}ch`;
      setTimeout(() => {
        timerInput.style.transition = "width 0.2s, border-bottom-color 0.2s";
      }, 0);
    });
  }
};

for(const chessTimerElem of document.getElementsByClassName("chess-timer")){
  addChessTimerEventListeners(chessTimerElem);
}