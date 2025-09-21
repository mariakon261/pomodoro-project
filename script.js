let timerDisplay = document.getElementById("timer-display");
let startBtn = document.getElementById("start-button");
let resetBtn = document.getElementById("reset-button");

let isBreak = false; //check if user is on short break
let isRunning = false; //ensure that new intervals will not start in case the user clicks on the start button multiple times.
let interval;
let totalDefaultTime = 25; //minutes
let shortBreakDefaultTime = 5;
let longBreakDefaultTime = 15;
let totalTime = totalDefaultTime*60; //1500 secs = 25 mins //60 secs * mins you want
let timeLeft = totalTime;

let repetitionCounterEl = document.getElementById("repetition-counter");
let repetitionCounter = 0;

let currentMode = "pomodoro" //default state

let progressBar = document.getElementById('progress-bar');
let progressBarStatus = document.getElementById('progress-bar-status');

let audio;

startBtn.addEventListener('click',() => {
    if (!isRunning) { 
        startTimer();
         handleBackgroundSoundChange();
        startBtn.textContent = "Pause";
        // console.log(ambientRainSounds.play());  debugging purposes
    }
    else {
        clearInterval(interval);
        isRunning = false;  
        if (audio) {
          audio.pause();
        }
        startBtn.textContent = "Start";
    }
});
resetBtn.addEventListener('click',resetTimer);

function startTimer() {
  if (isRunning) return;
  isRunning = true;
 
  interval = setInterval(() => {
    if (timeLeft === 0) {
      repetitionCounter += 1; 
      //allakse ton arithmo sto html
      repetitionCounterEl.textContent = repetitionCounter + "/2";
      console.log(repetitionCounter);
      if (repetitionCounter == 2 ) {
        console.log("YOU MADE IT!!");
        repetitionCounterEl.textContent = "0/2";
        alert("You have successfully completed 2 Pomodoro cycles!");
      }
      audio.pause();
      clearInterval(interval);
      isRunning = false;
      
      playAlarm();
      notifyMe();
      console.log("Pomo finished after ", totalTime, " seconds" );
      startBtn.textContent = "Start";
      resetTimer();
    } else {
      timeLeft--;
      updateTimer();
      console.log("Total time: ", totalDefaultTime, " Total time left: ",timeLeft);
    }
  }, 1000);
}
//YPARXEI BUG AN BALO DEKADIKOUS. NA TO FTIAKSO H NA MHN EPITREPO DEKADIKOUS STON XRONO
function updateTimer() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
    let formattedTime = [minutes,seconds]
                       .map(num => num.toString().padStart(2, '0'))
                    .join(":"); //putting mins and secs in an array to manipulate them using the map array method and format them like this -> mins:secs
    timerDisplay.textContent = formattedTime;
    //console.log(formattedTime);
    let totalDuration = getCurrentModeDuration();
   let progressBarPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
   progressBarStatus.textContent = Math.floor(progressBarPercent) + "%";
   progressBar.style.width = progressBarPercent + "%";
}


function playAlarm() {
  const audio =  new Audio('sounds/phone-ringtone-location-357393.mp3');
  audio.play();

  setInterval(() => {
    audio.pause();
    console.log("Notification sound will stop after 5 seconds");
  },4000);
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  if (audio) {
    audio.pause();
  }
  timeLeft = getCurrentModeDuration(); // Use current mode's totalTime
  startBtn.textContent = "Start"; // Reset button text
  updateTimer();
}
/*nav link active state switching */
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // prevents page reload if href="#"
    
    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('nav-link-active'));
    
    // Add active class to the clicked link
    link.classList.add('nav-link-active');
     if(link.classList.contains('nav-link-pomodoro')) {
      currentMode = "pomodoro"
        timeLeft = getCurrentModeDuration();
         updateTimer();
    } else if(link.classList.contains('nav-link-shortbreak')) {
      currentMode = "shortbreak"
        timeLeft = getCurrentModeDuration();
         updateTimer();
    } else if(link.classList.contains('nav-link-longbreak')) {
      currentMode = "longbreak"
        timeLeft = getCurrentModeDuration();
         updateTimer();
    }
   

    // Stop any running timer
    clearInterval(interval);
    isRunning = false;
    startBtn.textContent = "Start"; // reset start button text
  });
});

let tasksContainer = document.getElementById('tasks-container');
let newTaskInput = document.getElementById('new-task-input');
let addNewTaskButton = document.getElementById('add-new-task-button');
let tasksList = document.getElementById("tasks-list");

//TASKS - TODO LIST FOR POMODORO
function openTaskManager() {
    console.log("Editing icon has been clicked.");
    newTaskInput.classList.add('settings-headers-focus'); //ALLAKSE TO ONOMA KLASHS!!!!!!!!!!!!1
    tasksContainer.classList.toggle('hidden');
}

//click on add button or Enter -> add new task
addNewTaskButton.addEventListener('click',addNewTask);
newTaskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' ) {
        event.preventDefault();
        console.log("keydown pressed!");
        addNewTask();
    }
}) 
//to add a new task, we just take the value of the input field(string) and after creating an li element, append it to the tasksList 
function addNewTask() {
    if (newTaskInput.value.trim() === '') {
        console.log('String is empty');
        return;
    }
    const li = document.createElement('li');
    li.textContent = newTaskInput.value;

    //click on li -> delete it
    li.addEventListener('click', () => {
        removeTask(li);
    })
   

    tasksList.appendChild(li);
    newTaskInput.value = '';
}
function removeTask(item) {
    item.classList.toggle('completed-task');
    setTimeout(() => {
        item.remove();
    },2000);
}

//FULLSCREEN MODE
const fullscreenModeIcon = document.getElementById("fullscreen-mode-icon");
let elem = document.documentElement;

//open fullscreen mode
const requestFullscreen = () => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
};

//exit full screen mode 
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
};

fullscreenModeIcon.addEventListener('click', () => {
    if (isFullscreen()) {
        exitFullscreen();
    }
    else {
        requestFullscreen();
    }});


const isFullscreen = () => {
  return document.fullscreenElement || 
         document.mozFullScreenElement || 
         document.webkitFullscreenElement || 
         document.msFullscreenElement;
};

// Toggle fullscreen on button click
fullscreenModeIcon.addEventListener('click', () => {
  if (isFullscreen()) { //BRES GIATI DE LEITOURGEI TO SRC
    fullscreenModeIcon.src = 'C:/Users/maria/OneDrive/Desktop/maria_sxoli/projects/pomodoro/icons/dark-mode-icons/fullscreen_exit_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg';
    exitFullscreen();
    
  } else {
    requestFullscreen();
    fullscreenModeIcon.src = 'C:\Users/maria/OneDrive/Desktop/maria_sxoli/projects/pomodoro/icons/dark-mode-icons/fullscreen_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg';
  }
});

//DIALOG MODAL SETTINGS
const settingsIcon = document.getElementById('settings-icon');
const updateButton = document.getElementById("update-settings-modal-button");
const settingsModal = document.getElementById('settings-modal')

settingsIcon.addEventListener('click', () => {
  console.log("Settings were clicked.");
  //arxikopoio tis times ton inputs se empty strings.
  for (i=0; i<updateInputFields.length; i++) {
    updateInputFields[i].value ='';
  }
  
  settingsModal.showModal();
})

//close modal if user clicks anywhere outisde of the modal
document.addEventListener('click' ,(event) => {
  if (settingsModal.open && !settingsModal.contains(event.target) && event.target !== settingsIcon) { // check if the event (click) did NOT happen INSIDE the settingsModal
    settingsModal.close();
  }
}) 
//input fields for updating
let modifyTimerDurationInput = document.getElementById("modify-timer-duration-input");
let modifyShortBreakDuration = document.getElementById("modify-short-break-duration-input");
let modifyLongBreakDuration = document.getElementById("modify-long-break-duration-input");
let updateInputFields = document.querySelectorAll('.update-input');

function isNumber(value) {
  return !isNaN(Number(value));
}
function getCurrentModeDuration() {
  switch(currentMode) {
    case "pomodoro":
      return totalDefaultTime * 60;
    case "shortbreak":
      return shortBreakDefaultTime * 60;
    case "longbreak":
      return longBreakDefaultTime * 60;
    default:
      return totalDefaultTime * 60; // fallback to pomodoro
  }
}

function handleSettingsUpdate() {
  console.log("Updates changed.");

  const values = [totalDefaultTime, shortBreakDefaultTime, longBreakDefaultTime];
  let updated = false;

  updateInputFields.forEach((input, i) => {
    const rawValue = input.value.trim();

    if (rawValue === "") return; // skipping empty input fields

    if (isNumber(rawValue)) {
      const numericValue = Number(rawValue);

      if (numericValue !== values[i]) {
        // updating corresponding value
        if (i === 0) {
          totalDefaultTime = numericValue;
          if (currentMode === "pomodoro") {
            timeLeft = getCurrentModeDuration();
            console.log(timeLeft);
            updateTimer();
          }
        }
        else if (i === 1) {
          shortBreakDefaultTime = numericValue;
          if (currentMode === "shortbreak") {
            timeLeft = getCurrentModeDuration();
            console.log(timeLeft);
            updateTimer();
          }
        }
        else if (i === 2) {
          longBreakDefaultTime = numericValue;
          if (currentMode === "longbreak") {
            timeLeft = getCurrentModeDuration();
            console.log(timeLeft)
            updateTimer();
          }
        }

        updated = true;
      }
    } else {
      console.log(`Invalid input at index ${i}: Not a number.`);
    }

  });

  if (updated) {
    console.log("Timer settings updated.");
  } else {
    console.log("No valid changes made.");
  }

  settingsModal.close();
}
updateButton.addEventListener('click', handleSettingsUpdate);



//trigger the animation for showing which setting option (timers-sounds) is currently selected.
const settingsHeaders = document.querySelectorAll('#settings-options > h3');
let activeHeader = null;

settingsHeaders.forEach(header => {
  header.addEventListener('click', () => {
    //console.log("A setting header was clicked.");
    if (activeHeader) // an einai patimeno kapoio header
     {
      activeHeader.classList.remove('settings-headers-focus');
     }
    // and den einai patimeno kapoio header
    header.classList.add('settings-headers-focus');
    activeHeader = header;
  })
})

//SETTINGS SOUNDS CODE 
const tabButtons = document.querySelectorAll('.tab-button'); //for changing buttons
const tabContents = document.querySelectorAll('.tab-content'); //for changing different tab contents (timers-sounds)

tabButtons.forEach((button,index) => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    tabContents.forEach((tab,tabIndex) => {
      if (index === tabIndex) {
        tab.style.display = 'block';
      }
      else {
        tab.style.display = 'none';
      }
    })
  })
})

//change song depending on the dropdown menu 

const soundSelectEl = document.getElementById('sound');  



function handleBackgroundSoundChange() {

  if (audio) {
    audio.pause();
  }
  //create the new audio
  const selectedSound = soundSelectEl.value; 
  audio = new Audio(selectedSound);
  audio.play();
  audio.loop = true;

  console.log("Now playing ", selectedSound);
}
updateButton.addEventListener('click', handleBackgroundSoundChange);

const themeSwitchIcon = document.getElementById('theme-switch-icon');
const editTaskIcon = document.getElementById('edit-task-icon');

themeSwitchIcon.addEventListener('click' ,() => {
  const isLightMode = document.body.classList.toggle('light-mode'); 
  
  if (isLightMode) {
    //allakse ta icons 
    console.log("Change icons colors");
    themeSwitchIcon.src = 'icons/light-mode-icons/dark_mode_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';
    fullscreenModeIcon.src = 'icons/light-mode-icons/fullscreen_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';
    settingsIcon.src = 'icons/light-mode-icons/settings_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';
    editTaskIcon.src = 'icons/light-mode-icons/edit_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';
  }
  else {
    //allakse ta icons !!!!
    console.log("Change icons colors.");
    themeSwitchIcon.src = 'icons/dark-mode-icons/light_mode_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg';
    fullscreenModeIcon.src = 'icons/dark-mode-icons/fullscreen_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg';
    settingsIcon.src = 'icons/dark-mode-icons/settings_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'
    editTaskIcon.src = 'icons/dark-mode-icons/edit_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg '
  }
});



function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
   //if broswer has already granted permissions, send notification
    const notification = new Notification("Pomodoro ended!");
    // …
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification("Pomodoro ended");
        // …
      }
    });
  }
}