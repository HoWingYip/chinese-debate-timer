const getCurrentTimerDurationSeconds = (
  durationInputMinutes,
  durationInputSeconds
) => BigInt(durationInputMinutes.value) * 60n + BigInt(durationInputSeconds.value);

const stopTimer = (timerElem, countdownIntervalId) => {
  setDataAttribute(timerElem, "running", false);
  clearInterval(countdownIntervalId);
  setDataAttribute(timerElem, "prevTime", -1);

  timerElem.classList.remove("timer-last-1-min");
};

const updateUiAccordingToTimerState = (
  durationInputMinutes,
  durationInputSeconds,
  newTimeSeconds,
  countdownIntervalId,
) => {
  const timerElem = durationInputMinutes.closest(".timer");

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
  
  if (!getDataAttribute(timerElem, "running", Boolean)) {
    durationInputMinutes.readOnly = false;
    durationInputSeconds.readOnly = false;
  } else {
    durationInputMinutes.readOnly = true;
    durationInputSeconds.readOnly = true;
  }
};

document.querySelectorAll(".timer .timer-input-wrapper").forEach((timerInputWrapper) => {
  const durationInputMinutes = timerInputWrapper
      .getElementsByClassName("time-remaining-minutes")[0];
  const durationInputSeconds = timerInputWrapper
      .getElementsByClassName("time-remaining-seconds")[0];

  timerInputWrapper.addEventListener("focusout", () => {
    let userInputMinutes;
    let userInputSeconds;
    try {
      userInputMinutes = BigInt(durationInputMinutes.value);
      userInputSeconds = BigInt(durationInputSeconds.value);
    } catch {
      userInputMinutes = 0n;
      userInputSeconds = 0n;
    }

    const totalTimerDuration = userInputMinutes * 60n + userInputSeconds;
    // no countdownIntervalId so pass 0 (interval/timeout IDs are always non-zero)
    updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
        totalTimerDuration, 0);
  });
});

document.querySelectorAll(".timer input").forEach((timerInput) => {
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
});

[...document.getElementsByClassName("timer")].forEach((timerElem) => {
  let countdownIntervalId;

  const durationInputMinutes = timerElem
      .getElementsByClassName("time-remaining-minutes")[0];
  const durationInputSeconds = timerElem
      .getElementsByClassName("time-remaining-seconds")[0];
  const timerStartStopButton = timerElem
      .getElementsByClassName("start-stop-timer")[0];

  timerStartStopButton.addEventListener("click", () => {
    if (!getDataAttribute(timerElem, "running", Boolean)) {
      setDataAttribute(timerElem, "prevTime", new Date().getTime());

      const countdown = () => {
        const prevTime = getDataAttribute(timerElem, "prevTime", Number);
        const msElapsed = BigInt(new Date().getTime() - prevTime);
        const newTimeSeconds = getCurrentTimerDurationSeconds(durationInputMinutes,
            durationInputSeconds) - msElapsed / 1000n;
        
        updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
            newTimeSeconds, countdownIntervalId);

        if (msElapsed >= 1000n) {
          setDataAttribute(timerElem, "prevTime", new Date().getTime());
        }
      };

      // run once before setting interval to set prevTime and update UI
      countdown();
      countdownIntervalId = setInterval(countdown, 1);

      setDataAttribute(timerElem, "running", true);
    } else {
      stopTimer(timerElem, countdownIntervalId);
    }

    updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
        getCurrentTimerDurationSeconds(durationInputMinutes, durationInputSeconds),
        countdownIntervalId);
  });
});
