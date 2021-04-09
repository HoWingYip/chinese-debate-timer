const playBellSound = () => {
  new Audio("ding.mp3").play();
};

const playBellSoundTwice = () => {
  new Audio("ding-twice.mp3").play();
};

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

  if (newTimeSeconds === 0n) {
    stopTimer(timerElem, countdownIntervalId);
  }

  const timerDurationMinutes = newTimeSeconds / 60n;
  const timerDurationSeconds = newTimeSeconds % 60n;
  durationInputMinutes.value = String(timerDurationMinutes);
  durationInputSeconds.value = String(timerDurationSeconds).padStart(2, "0");

  // changing value via JS doesn't trigger oninput, so manually change input width
  durationInputMinutes.style.width = `${durationInputMinutes.value.length}ch`;
  durationInputSeconds.style.width = `${durationInputSeconds.value.length}ch`;

  durationInputMinutes.readOnly = durationInputSeconds.readOnly =
    (timerElem.dataset.running === "true");

  saveTimers();
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
      let shouldPlayBellAt30s = true;
      prevTime = new Date().getTime();

      const countdown = () => {
        const msElapsed = BigInt(new Date().getTime() - prevTime);
        const newTimeSeconds = getCurrentTimerDurationSeconds(timerElem) -
          msElapsed / 1000n;

        updateUiAccordingToTimerState(timerElem, newTimeSeconds,
          countdownIntervalId);

        if (newTimeSeconds === 30n && shouldPlayBellAt30s) {
          playBellSound();
          // prevents bell from continuously ringing when time is 30s
          shouldPlayBellAt30s = false;
        }
        if (newTimeSeconds !== 30n) {
          shouldPlayBellAt30s = true;
        }

        if (newTimeSeconds === 0n) {
          playBellSoundTwice();
        }

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

const addDeleteButtonListener = (timerSection) => {
  const deleteButton = timerSection.getElementsByClassName("delete-button-container")[0].getElementsByClassName("delete")[0];
  deleteButton.addEventListener("click", () => {
    timerSection.remove();
    saveTimers();
  });
};


// Adds only to normal Timer set
for (const normalTimer of document.getElementsByClassName("normal-timer")) {
  addDeleteButtonListener(normalTimer);
  for (const timerElem of normalTimer.getElementsByClassName("timer")) {
    addTimerEventListeners(timerElem);
  }
}

// Chess clock section
const IntervalStorage = {};
const addChessTimerEventListeners = (chessTimerElem) => {
  let prevTime = null;
  let countdownIntervalId;

  const timerContainer = chessTimerElem.getElementsByClassName("chess-timer-internal-container")[0];
  const leftTimer = timerContainer.getElementsByClassName("timer")[0];
  const rightTimer = timerContainer.getElementsByClassName("timer")[1];
  const leftTimerButton = leftTimer.getElementsByClassName("start-stop-timer")[0];
  const rightTimerButton = rightTimer.getElementsByClassName("start-stop-timer")[0];
  const buttonPanel = chessTimerElem.getElementsByClassName("button-panel")[0];
  const swapButton = buttonPanel.getElementsByClassName("swap")[0];
  const pauseButton = buttonPanel.getElementsByClassName("chess-clock-pause")[0];
  const clearButton = buttonPanel.getElementsByClassName("clear")[0];

  // Starting the initial timings
  const startClockInitialButton = (event) => {

    timerElem = event.target.closest(".timer");
    

    const otherTimerElem = [...timerContainer.getElementsByClassName("timer")]
      .filter((elem) => elem !== timerElem)[0];

    if((timerElem.dataset.running === "false" && otherTimerElem.dataset.running === "false")){
      const classOfElementToUpdate = Object.keys(IntervalStorage).find((key) => IntervalStorage[key] === countdownIntervalId);
      let timerElemToUpdate;
      if (typeof classOfElementToUpdate === "undefined") {
        timerElemToUpdate = timerElem;
      } else {
        timerElemToUpdate = document.getElementsByClassName(classOfElementToUpdate)[0].getElementsByClassName("timer")[0];
      }

      let shouldPlayBellAt30s = true;
      prevTime = new Date().getTime();
      const countdown = () => {
        const msElapsed = BigInt(new Date().getTime() - prevTime);
        const newTimeSeconds = getCurrentTimerDurationSeconds(timerElem) - msElapsed / 1000n;
        side = timerElem.parentElement.classList.item(0);

        updateUiAccordingToTimerState(timerElem, newTimeSeconds, IntervalStorage[side]);
        

        if (newTimeSeconds === 30n && shouldPlayBellAt30s) {

          playBellSound();
          // prevents bell from continuously ringing when time is 30s
          shouldPlayBellAt30s = false;
        }
        if (newTimeSeconds !== 30n) {
          shouldPlayBellAt30s = true;
        }

        if (newTimeSeconds === 0n) {
          playBellSoundTwice();
        }

        if (msElapsed >= 1000n) {
          prevTime = new Date().getTime();
        }
      };

      countdown();
      countdownIntervalId = setInterval(countdown, 1);
      side = timerElem.parentElement.classList.item(0);
      IntervalStorage[side] = countdownIntervalId;
      timerElem.dataset.running = "true";
    }

    else if (timerElem.dataset.running === "true" || otherTimerElem.dataset.running === "true") {
      if (timerElem.dataset.running === "true") {
        side = timerElem.parentElement.classList.item(0);
        stopTimer(timerElem, IntervalStorage[side]);
      }
      if (otherTimerElem.dataset.running === "true") {
        side = otherTimerElem.parentElement.classList.item(0);
        stopTimer(otherTimerElem, IntervalStorage[side]);
      }
    }
    updateUiAccordingToTimerState(timerElem, getCurrentTimerDurationSeconds(timerElem), countdownIntervalId);
  };

  const startClockFromTimerElem = (timerElem) => {
    let shouldPlayBellAt30s = true;
    console.log("Hi")
    prevTime = new Date().getTime();
    const countdown = () => {
      const msElapsed = BigInt(new Date().getTime() - prevTime);
      const newTimeSeconds = getCurrentTimerDurationSeconds(timerElem) - msElapsed / 1000n;

      updateUiAccordingToTimerState(timerElem, newTimeSeconds, countdownIntervalId);

      if (newTimeSeconds === 30n && shouldPlayBellAt30s) {
        playBellSound();
        // prevents bell from continuously ringing when time is 30s
        shouldPlayBellAt30s = false;
      }
      if (newTimeSeconds !== 30n) {
        shouldPlayBellAt30s = true;
      }

      if (newTimeSeconds === 0n) {
        playBellSoundTwice();
      }

      if (msElapsed >= 1000n) {
        prevTime = new Date().getTime();
      }
    };

    countdown();
    countdownIntervalId = setInterval(countdown, 1);
    side = timerElem.parentElement.classList.item(0);
    IntervalStorage[side] = countdownIntervalId;
    timerElem.dataset.running = "true";
  };

  leftTimerButton.addEventListener("click", startClockInitialButton);
  rightTimerButton.addEventListener("click", startClockInitialButton);

  swapButton.addEventListener("click", () => {
    if (leftTimer.dataset.running === "true" && rightTimer.dataset.running === "false") {
      side = leftTimer.parentElement.classList.item(0);
      stopTimer(leftTimer, IntervalStorage[side]);
      leftTimer.dataset.running = "false";
      startClockFromTimerElem(rightTimer);

    } else if (leftTimer.dataset.running === "false" && rightTimer.dataset.running === "true") {
      side = rightTimer.parentElement.classList.item(0);
      stopTimer(rightTimer, IntervalStorage[side]);
      rightTimer.dataset.running = "false";
      startClockFromTimerElem(leftTimer);
    }
  });

  const pause = () => {
    if (leftTimer.dataset.running === "true" && rightTimer.dataset.running === "false") {
      side = leftTimer.parentElement.classList.item(0);
      stopTimer(leftTimer, IntervalStorage[side]);
      leftTimer.dataset.running = "false";
    }
    if (rightTimer.dataset.running === "true" && leftTimer.dataset.running === "false") {
      side = rightTimer.parentElement.classList.item(0);
      stopTimer(rightTimer, IntervalStorage[side]);
      rightTimer.dataset.running = "false";
    }
  };
  pauseButton.addEventListener("click", () => {
    pause();
  });

  clearButton.addEventListener("click", () => {
    pause();
    updateUiAccordingToTimerState(leftTimer, 0n, IntervalStorage[leftTimer.parentElement.classList.item(0)]);
    updateUiAccordingToTimerState(rightTimer, 0n, IntervalStorage[rightTimer.parentElement.classList.item(0)]);
  });

  const leftTimerWrapper = leftTimer.getElementsByClassName("timer-input-wrapper")[0];
  leftTimerWrapper.addEventListener("focusout", () => {
    updateUiAccordingToTimerState(leftTimer, getCurrentTimerDurationSeconds(leftTimer), 0);
  });

  const rightTimerWrapper = rightTimer.getElementsByClassName("timer-input-wrapper")[0];
  rightTimerWrapper.addEventListener("focusout", () => {
    updateUiAccordingToTimerState(rightTimer, getCurrentTimerDurationSeconds(rightTimer), 0);
  });

  for (const timerInput of [
    ...getMinutesAndSecondsInputs(leftTimer),
    ...getMinutesAndSecondsInputs(rightTimer),
  ]) {
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

  addDeleteButtonListener(chessTimerElem);
};

for (const chessTimerElem of document.getElementsByClassName("chess-timer")) {
  addChessTimerEventListeners(chessTimerElem);
}
