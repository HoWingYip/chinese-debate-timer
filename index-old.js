[...document.getElementsByClassName("start-stop-timer")].forEach((button) => {
  button.addEventListener("click", (event) => {

    // Gets the side of which the button play was clicked
    timer_clicked = button.parentElement.parentElement.className;

    // If button was on "Play mode"
    class_list = Array.from(button.classList)

    if (class_list.includes("play")) {
      // Solicit the minutes and seconds
      minutes_given = document.querySelector(".".concat(timer_clicked.concat(" .time-remaining-minutes"))).value;
      seconds_given = document.querySelector(".".concat(timer_clicked.concat(" .time-remaining-seconds"))).value;

      // Hide the input
      document.querySelector(".".concat(timer_clicked.concat(" .time-remaining-minutes"))).style.display = "none";
      document.querySelector(".".concat(timer_clicked.concat(" .time-remaining-seconds"))).style.display = "none";

      button.classList.remove("play");
      button.classList.add("pause");
    }
    else if (class_list.includes("pause")) {
      // Hide the input
      document.querySelector(".".concat(timer_clicked.concat(" .time-remaining-minutes"))).style.display = "inline";
      document.querySelector(".".concat(timer_clicked.concat(" .time-remaining-seconds"))).style.display = "inline";
      button.classList.remove("pause");
      button.classList.add("play");
    }





  });
})



// Potentially a function to disable the opposite team's timer start button if the other timer is running (Low importance)

// Function to pause the timer when a click is made (to edit the time) (minor feature unimportant)

// Chess clock timer function: 

// Switch button to switch to the opposite team

// Pause button to pause the timer on either team

// Resume button to start the timer again 