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

for (const timerElem of document.getElementsByClassName("timer")) {
  addTimerEventListeners(timerElem);
}
