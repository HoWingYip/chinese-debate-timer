
// Global Variables

// allIntervals is a global object that stores all Intervals for reference to pausing later on, may help with modularisation
let allIntervals = new Object();

// Function to start the timer
// prev -> The initial starting Date() object
// displayedTimerDuration -> input the total time in seconds
// durationInputMinutes -> The HTML Input to use for minutes
// durationInputSeconds -> The HTML Input to use for seconds


let startTimer = (prev, displayedTimerDuration, durationInputMinutes, durationInputSeconds, id) => {

  // Variable timerInterval is given a unique interval ID
  // Stopping it later on : window.clearInterval(IntervalID)
  var timerInterval = setInterval(() => {

    // Allocate the Interval ID to a certain value
    allIntervals[id] = timerInterval;

    let tempTime = new Date().getTime();
    // If time interval is greater or equal to a second
    if ((tempTime - prev) >= 1000) {
      displayedTimerDuration--;
      durationInputMinutes.value = String(displayedTimerDuration / 60n);
      durationInputSeconds.value = String(displayedTimerDuration % 60n).padStart(2, "0");
      prev = prev + 1000;
    }

    // Stop the loop when reaches 0
    if (displayedTimerDuration <= 0) {
      stopTimer(timerInterval);
    }
  }, 100)

  
}

// Stops timer based on interval id
let stopTimer = (timerInterval) =>{
  window.clearInterval(timerInterval);
}

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
    const timerDurationMinutes = totalTimerDuration / 60n;
    const timerDurationSeconds = totalTimerDuration % 60n;

    // TODO: put below code into separate function
    durationInputMinutes.value = String(timerDurationMinutes);
    durationInputSeconds.value = String(timerDurationSeconds).padStart(2, "0");
    
    // changing value via JS doesn't trigger oninput, so manually change input width
    durationInputMinutes.style.width = `${durationInputMinutes.value.length}ch`;
    durationInputSeconds.style.width = `${durationInputSeconds.value.length}ch`;
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
  let prevTime = null;
  let countdownIntervalId;

  const durationInputMinutes = timerElem
      .getElementsByClassName("time-remaining-minutes")[0];
  const durationInputSeconds = timerElem
      .getElementsByClassName("time-remaining-seconds")[0];
  const timerStartStopButton = timerElem
      .getElementsByClassName("start-stop-timer")[0];

  const stopTimer = () => {
    timerElem.dataset.running = "false";
    clearInterval(countdownIntervalId);
    prevTime = null;

    // UI updates
    timerElem.classList.remove("timer-last-1-min");
  };

  const updateUiAccordingToTimerState = () => {
    if (timerElem.dataset.running === "false") {
      durationInputMinutes.readOnly = false;
      durationInputSeconds.readOnly = false;
    } else {
      durationInputMinutes.readOnly = true;
      durationInputSeconds.readOnly = true;
    }
  };

  const getCurrentTimerDurationSeconds = () =>
      BigInt(durationInputMinutes.value) * 60n + BigInt(durationInputSeconds.value);

  timerStartStopButton.addEventListener("click", () => {
    if (timerElem.dataset.running === "false") {
      prevTime = new Date().getTime();

      // START COUNTING DOWN
      const countdownFunction = () => {
        const msElapsed = BigInt(new Date().getTime() - prevTime);
        const newTimeSeconds = getCurrentTimerDurationSeconds() - msElapsed / 1000n;
        const timerDurationMinutes = newTimeSeconds / 60n;
        const timerDurationSeconds = newTimeSeconds % 60n;

        if (msElapsed >= 1000n) {
          // TODO: put below code into separate function
          durationInputMinutes.value = String(timerDurationMinutes);
          durationInputSeconds.value = String(timerDurationSeconds).padStart(2, "0");

          // changing value via JS doesn't trigger oninput, so manually change input width
          durationInputMinutes.style.width = `${durationInputMinutes.value.length}ch`;
          durationInputSeconds.style.width = `${durationInputSeconds.value.length}ch`;
          
          prevTime = new Date().getTime();
        }

        if (newTimeSeconds < 60n) {
          timerElem.classList.add("timer-last-1-min");
        }

        if (timerDurationMinutes === 0n && timerDurationSeconds === 0n) {
          stopTimer();
          updateUiAccordingToTimerState();
          return;
        }
      };

      // run once before setting interval to set prevTime and update UI
      countdownFunction();

      countdownIntervalId = setInterval(countdownFunction, 1);

      timerElem.dataset.running = "true";
    } else {
      stopTimer();
    }

    updateUiAccordingToTimerState();
  });
});
