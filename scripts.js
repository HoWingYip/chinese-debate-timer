
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
    let timerDurationMinutes;
    let timerDurationSeconds;
    try {
      timerDurationMinutes = BigInt(durationInputMinutes.value);
      timerDurationSeconds = BigInt(durationInputSeconds.value);
    } catch {
      timerDurationMinutes = 0n;
      timerDurationSeconds = 0n;
    }

    const totalTimerDuration = timerDurationMinutes * 60n + timerDurationSeconds;
    timerInputWrapper.parentNode.dataset.duration = totalTimerDuration;

    durationInputMinutes.value = String(totalTimerDuration / 60n);
    durationInputSeconds.value = String(totalTimerDuration % 60n).padStart(2, "0");
    
    // changing value via JS doesn't trigger oninput, so manually change input width
    durationInputMinutes.style.width = `${durationInputMinutes.value.length}ch`;
    durationInputSeconds.style.width = `${durationInputSeconds.value.length}ch`;
    
  });
});

document.querySelectorAll(".timer input").forEach((timerInput) => {
  timerInput.addEventListener("keypress", (event) => {
    if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
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
  timerElem.getElementsByClassName("start-stop-timer")[0]
      .addEventListener("click", (event) => {
        const durationInputMinutes = timerElem
            .getElementsByClassName("time-remaining-minutes")[0];
        const durationInputSeconds = timerElem
            .getElementsByClassName("time-remaining-seconds")[0];

        // unique identifier (can be improved during modularisation)
        let identifier = timerElem.parentElement.className.split(" ")[0];

        if (timerElem.dataset.paused === "true") {
          // START COUNTING DOWN

          timerElem.classList.add("timer-running");
          durationInputMinutes.readOnly = true;
          durationInputSeconds.readOnly = true;
          event.target.textContent = "Pause";
          timerElem.dataset.paused = "false";


          
          
          // Timer
          // Starting referrence
          let prev = new Date().getTime();
          // Total time
          let displayedTimerDuration = BigInt(durationInputMinutes.value) * 60n + BigInt(durationInputSeconds.value);
          startTimer(prev, displayedTimerDuration, durationInputMinutes, durationInputSeconds, identifier);


        } else {
          // STOP COUNTING DOWN
          
          stopTimer(allIntervals[identifier]);

          timerElem.classList.remove("timer-running");
          durationInputMinutes.readOnly = false;
          durationInputSeconds.readOnly = false;
          event.target.textContent = "Start";
          timerElem.dataset.paused = "true";
        }
      });
})
