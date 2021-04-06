const saveTimers = () => {
  const timers = [];

  const timerSections = document.getElementById("timer-sections").children;

  for (const timerSection of timerSections) {
    const timer = {
      type: "",
      leftTimer: {
        name: "",
        duration: "0", // string because JSON.stringify can't serialize BigInt
      },
      rightTimer: {
        name: "",
        duration: "0", // string because JSON.stringify can't serialize BigInt
      },
    };

    const timerElems = [...timerSection.querySelectorAll(".timer")];

    if (timerSection.classList.contains("normal-timer")) {
      timer.type = "normal";

      const timerNames = timerElems.map((timerElem) => timerElem
        .previousElementSibling.value);
      [timer.leftTimer.name, timer.rightTimer.name] = timerNames;
    } else if (timerSection.classList.contains("chess-timer")) {
      timer.type = "chess";
    }

    // convert duration to string because JSON.stringify can't serialize BigInt
    // remember to convert back to BigInt during deserialization
    const timerDurations = timerElems.map((timerElem) =>
      String(getCurrentTimerDurationSeconds(timerElem)));
    [timer.leftTimer.duration, timer.rightTimer.duration] = timerDurations;

    timers.push(timer);
  }

  localStorage.setItem("timerConfiguration", JSON.stringify(timers));
};

const restoreTimers = () => {

};
