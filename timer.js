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

const addDeleteButtonListener = (normalTimer) => {
  const deleteButton = normalTimer.getElementsByClassName("delete-button-container")[0].getElementsByClassName("delete")[0];
  deleteButton.addEventListener("click", () => {
    normalTimer.remove();
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

const addChessTimerEventListeners = (chessTimer) => {

  const IntervalStorage = {};
  let prevTime = null;
  // FIXME: what is countdownIntervalId doing here? Isn't interval ID storage handled by IntervalStorage?
  let countdownIntervalId;

  const timerContainer = chessTimer.getElementsByClassName("chess-timer-internal-container")[0];
  const leftTimer = timerContainer.getElementsByClassName("timer")[0];
  const rightTimer = timerContainer.getElementsByClassName("timer")[1];
  const leftTimerButton = leftTimer.getElementsByClassName("start-stop-timer")[0];
  const rightTimerButton = rightTimer.getElementsByClassName("start-stop-timer")[0];
  const buttonPanel = chessTimer.getElementsByClassName("button-panel")[0];
  const swapButton = buttonPanel.getElementsByClassName("swap")[0];
  const pauseButton = buttonPanel.getElementsByClassName("chess-clock-pause")[0];
  const clearButton = buttonPanel.getElementsByClassName("clear")[0];
  const deleteButton = chessTimer.getElementsByClassName("delete-button-container")[0].getElementsByClassName("delete")[0];

  // Starting the initial timings
  const startClockInitialButton = (event) => {
    timerElem = event.target.closest(".timer");

    const otherTimerElem = [...timerContainer.getElementsByClassName("timer")]
      .filter((elem) => elem !== timerElem)[0];

    if (otherTimerElem.dataset.running === "true" || timerElem.dataset.running === "true") {
      stopTimer(otherTimerElem, IntervalStorage[otherTimerElem.parentElement.classList.item(0)]);
      stopTimer(timerElem, IntervalStorage[otherTimerElem.parentElement.classList.item(0)]);
    } else {
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
      side = timerElem.parentElement.classList.item(0);
      IntervalStorage[side] = countdownIntervalId;
      timerElem.dataset.running = "true";

    }
    updateUiAccordingToTimerState(timerElem, getCurrentTimerDurationSeconds(timerElem), countdownIntervalId);
  };

  const startClockFromTimerElem = (timerElem) => {
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
    if (rightTimer.dataset.running === "true") {
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

  const chessTimerDurationInputs = [
    ...getMinutesAndSecondsInputs(leftTimer),
    ...getMinutesAndSecondsInputs(rightTimer),
  ];
  for (const timerInput of chessTimerDurationInputs) {
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

  deleteButton.addEventListener("click", () => {
    pause();
    chessTimer.remove();
  });
};

for (const chessTimer of document.querySelectorAll(".chess-timer")) {
  addChessTimerEventListeners(chessTimer);
}
