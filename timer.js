const getCurrentTimerDurationSeconds = (
  durationInputMinutes,
  durationInputSeconds,
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
  // Selects closest timer elem
  const timerElem = durationInputMinutes.closest(".timer");

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
  // add listeners for .timer
  let prevTime = null;
  let countdownIntervalId;

  const durationInputMinutes = timerElem
    .getElementsByClassName("time-remaining-minutes")[0];
  const durationInputSeconds = timerElem
    .getElementsByClassName("time-remaining-seconds")[0];
  const timerStartStopButton = timerElem
    .getElementsByClassName("start-stop-timer")[0];

  timerStartStopButton.addEventListener("click", () => {
    if (timerElem.dataset.running === "true") {
      stopTimer(timerElem, countdownIntervalId);
    } else {
      prevTime = new Date().getTime();

      const countdown = () => {
        const msElapsed = BigInt(new Date().getTime() - prevTime);
        const newTimeSeconds = getCurrentTimerDurationSeconds(durationInputMinutes,
          durationInputSeconds) - msElapsed / 1000n;

        updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
          newTimeSeconds, countdownIntervalId);

        if (msElapsed >= 1000n) {
          prevTime = new Date().getTime();
        }
      };

      // run once before setting interval to set prevTime and update UI
      countdown();
      countdownIntervalId = setInterval(countdown, 1);

      timerElem.dataset.running = "true";
    }

    updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
      getCurrentTimerDurationSeconds(durationInputMinutes, durationInputSeconds),
      countdownIntervalId);
  });


  // add listener for .timer-input-wrapper
  const timerInputWrapper = timerElem.getElementsByClassName("timer-input-wrapper")[0];
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


  // add listeners for input[type="text"]
  for (const timerInput of [durationInputMinutes, durationInputSeconds]) {
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

// Chess clock section
let chessTimer = document.getElementsByClassName("chess-timer")[0]
let buttonPanel = chessTimer.getElementsByClassName("button-panel")[0]
let swapButton = buttonPanel.getElementsByClassName("swap")[0]
let pauseButton = buttonPanel.getElementsByClassName("chess-clock-pause")[0]

swapButton.addEventListener("click", () => {
  console.log("swap at " + chessTimer)
  timerContainer = chessTimer.getElementsByClassName("chess-timer-internal-container")[0]
  timerLeft = timerContainer.querySelectorAll(".timer")[0]
  timerRight = timerContainer.querySelectorAll(".timer")[1]
  
  if(timerLeft.dataset.running === "true" && timerRight.dataset.running === "true"){
    console.log("Both are running")
  }
  else{
    console.log("Either one or none is running")
  }
  
})








// const addTimerInputWrapperEventListener = (timerInputWrapper) => {
//   timerInputWrapper.addEventListener("focusout", () => {
//     const [durationInputMinutes, durationInputSeconds] = timerInputWrapper
//       .querySelectorAll("input[type='text']");
//     let userInputMinutes;
//     let userInputSeconds;
//     try {
//       userInputMinutes = BigInt(durationInputMinutes.value);
//       userInputSeconds = BigInt(durationInputSeconds.value);
//     } catch {
//       userInputMinutes = 0n;
//       userInputSeconds = 0n;
//     }

//     const totalTimerDuration = userInputMinutes * 60n + userInputSeconds;
//     // no countdownIntervalId so pass 0 (interval/timeout IDs are always non-zero)
//     updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
//       totalTimerDuration, 0);
//   });
// };

// document.querySelectorAll(".timer .timer-input-wrapper")
//   .forEach((timerInputWrapper) => {
//     addTimerInputWrapperEventListener(timerInputWrapper);
//   });

// const addTimerInputEventListeners = (timerInput) => {
//   timerInput.addEventListener("keypress", (event) => {
//     if (event.key < "0" || event.key > "9") {
//       event.preventDefault();
//     }
//   });

//   timerInput.addEventListener("input", () => {
//     timerInput.style.transition = "border-bottom-color 0.2s";
//     timerInput.style.width = `${Math.max(timerInput.value.length, 1)}ch`;
//     setTimeout(() => {
//       timerInput.style.transition = "width 0.2s, border-bottom-color 0.2s";
//     }, 0);
//   });
// };

// document.querySelectorAll(".timer input[type='text']").forEach((timerInput) => {
//   addTimerInputEventListeners(timerInput);
// });

// [...document.getElementsByClassName("timer")].forEach((timerElem) => {
//   let countdownIntervalId;

//   const durationInputMinutes = timerElem
//     .getElementsByClassName("time-remaining-minutes")[0];
//   const durationInputSeconds = timerElem
//     .getElementsByClassName("time-remaining-seconds")[0];
//   const timerStartStopButton = timerElem
//     .getElementsByClassName("start-stop-timer")[0];

//   timerStartStopButton.addEventListener("click", () => {
//     if (!getDataAttribute(timerElem, "running", Boolean)) {
//       setDataAttribute(timerElem, "prevTime", new Date().getTime());

//       const countdown = () => {
//         const prevTime = getDataAttribute(timerElem, "prevTime", Number);
//         const msElapsed = BigInt(new Date().getTime() - prevTime);
//         const newTimeSeconds = getCurrentTimerDurationSeconds(durationInputMinutes,
//           durationInputSeconds) - msElapsed / 1000n;

//         updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
//           newTimeSeconds, countdownIntervalId);

//         if (msElapsed >= 1000n) {
//           setDataAttribute(timerElem, "prevTime", new Date().getTime());
//         }
//       };

//       // run once before setting interval to set prevTime and update UI
//       countdown();
//       countdownIntervalId = setInterval(countdown, 1);

//       setDataAttribute(timerElem, "running", true);
//     } else {
//       stopTimer(timerElem, countdownIntervalId);
//     }

//     updateUiAccordingToTimerState(durationInputMinutes, durationInputSeconds,
//       getCurrentTimerDurationSeconds(durationInputMinutes, durationInputSeconds),
//       countdownIntervalId);
//   });
// });
