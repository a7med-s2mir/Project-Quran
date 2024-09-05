// myLocalStorage

let colorStorage = localStorage.getItem("pageColor");

if (colorStorage !== null) {
  document.documentElement.style.setProperty("--main-color", colorStorage);

  document.querySelectorAll(".color li").forEach((li) => {
    li.classList.remove("active");

    if (colorStorage === li.dataset.color) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });
}

// localStorage for darkmode

let darkStorage = localStorage.getItem("darkStorage");

if (darkStorage !== null) {
  document.querySelectorAll(".darkOption span").forEach((span) => {
    span.classList.remove("active");
  });

  if (darkStorage === "true") {
    document.querySelector(".darkOption #yes").classList.add("active");
    document.body.classList.add("darkmode");
  } else {
    document.querySelector(".darkOption #no").classList.add("active");
    document.body.classList.remove("darkmode");
  }
}

// div append Boxes
let myRight = document.querySelector(".right-section");
let myLeft = document.querySelector(".left-section");

window.addEventListener("scroll", () => {
  if (window.scrollY >= 120) {
    myLeft.classList.add("fixed");
  } else {
    myLeft.classList.remove("fixed");
  }
});

// toggle

let toggle = document.getElementById("toggle");
let links = document.querySelector(".links");

toggle.onclick = function () {
  if (toggle.classList.contains("fa-bars")) {
    toggle.classList.replace("fa-bars", "fa-xmark");
  } else {
    toggle.classList.replace("fa-xmark", "fa-bars");
  }
  links.classList.toggle("show");
};

document.addEventListener("click", (e) => {
  e.stopPropagation();

  if (e.target !== toggle && e.target !== links) {
    links.classList.remove("show");
    if (links.classList.contains("show")) {
      toggle.classList.replace("fa-bars", "fa-xmark");
    } else {
      toggle.classList.replace("fa-xmark", "fa-bars");
    }
  }
});
links.addEventListener("click", (e) => {
  e.stopPropagation();
});

// audio player
let myAudio = document.querySelector(".myAudio");

// prev
let prev = document.querySelector(".prev"),
  //next
  next = document.querySelector(".next"),
  //play
  play = document.querySelector(".play");
// myP
let myP = document.querySelector(".myP");

// selector myLinks and toggle

document.getElementById("toggle").onclick = function () {
  if (this.classList.contains("fa-bars")) {
    this.classList.replace("fa-bars", "fa-xmark");
  } else {
    this.classList.replace("fa-xmark", "fa-bars");
  }
  document.querySelector(".links").classList.toggle("show");
};

function appearSurah() {
  fetch("https://api.quran.gading.dev/surah")
    .then((Response) => Response.json())
    .then((data) => {
      for (let surah in data.data) {
        myRight.innerHTML += `
        <div class="box" data-search="${data.data[surah].name.long}" data-search2="${data.data[surah].name.short}">
        <div class="text">
        <h2>${data.data[surah].name.long}</h2>
        <div class="style"></div>
        <p>${data.data[surah].name.transliteration.en}</p>
        </div>
        </div>
        `;
      }
      let myBoxes = document.querySelectorAll(".box");
      // slect input searh
      let mySearch = document.getElementById("input-search");
      mySearch.addEventListener("keyup", () => {
        let result = mySearch.value,
          myValue = result.toLowerCase();

        myBoxes.forEach((box) => {
          if (myValue === box.dataset.search) {
            box.style.display = "block";
          } else {
            box.style.display = "none";
          }
          if (myValue === box.dataset.search2) {
            box.style.display = "block";
          } else {
            box.style.display = "none";
          }
        });
        if (result !== "") {
          return false;
        } else {
          myBoxes.forEach((box) => {
            box.style.display = "block";
          });
        }
      });
      myBoxes.forEach((box) => {
        box.addEventListener("click", (e) => {
          myBoxes.forEach((box) => {
            box.classList.remove("active");
          });
          e.target.classList.add("active");
        });
      });
      // two vairbale's
      let audio;
      let audioText;
      // loop on myBoxes
      myBoxes.forEach((box, index) => {
        box.addEventListener("click", () => {
          fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
            .then((Response) => Response.json())
            .then((data) => {
              let verses = data.data.verses;
              audio = [];
              audioText = [];
              // loop on verse
              verses.forEach((verse) => {
                audio.push(verse.audio.primary);
                audioText.push(verse.text.arab);
              });
              let audioIndex = 0;
              myAudio.addEventListener("ended", () => {
                audioIndex++;
                if (audioIndex < audio.length) {
                  changeAyah(audioIndex);
                } else {
                  myAudio.pause();
                  audioIndex = 0;
                }
              });
              changeAyah(audioIndex);
              function changeAyah(index) {
                myAudio.src = audio[index];
                myP.innerHTML = `${audioText[index]}`;
              }
              prev.addEventListener("click", () => {
                if (audioIndex === 0) {
                  return false;
                } else {
                  audioIndex--;
                  changeAyah(audioIndex);
                }
              });
              // next
              next.addEventListener("click", () => {
                if (audioIndex === audio.length - 1) {
                  return false;
                } else {
                  audioIndex++;
                  changeAyah(audioIndex);
                }
              });
              // play
              let isPlaying = false;
              playButton();
              function playButton() {
                if (isPlaying) {
                  myAudio.pause();
                  play.innerHTML = `<i class="fa-solid fa-play">`;
                  isPlaying = false;
                } else {
                  myAudio.play();
                  play.innerHTML = `<i class="fa-solid fa-pause">`;
                  isPlaying = true;
                }
              }
              play.addEventListener("click", playButton);
            });
        });
      });
    });
}
// work function
appearSurah();

// setting box
let myIcon = document.querySelector(".fa-gear");
let mySetting = document.querySelector(".setting-box");

document.addEventListener("click", (e) => {
  if (e.target !== mySetting) {
    mySetting.classList.remove("open");
  }
  if (mySetting.classList.contains("open")) {
    return false;
  } else {
    myIcon.classList.remove("fa-spin");
  }
});
mySetting.addEventListener("click", (e) => {
  e.stopPropagation();
});

myIcon.onclick = function () {
  // add class to icon when i click
  this.classList.toggle("fa-spin");
  // toggle class to sectionSetting
  mySetting.classList.toggle("open");
};

// li => [Color's]

let liColor = document.querySelectorAll(".color li");

liColor.forEach((li) => {
  li.addEventListener("click", (e) => {
    // add color to --main-color by setProperty
    document.documentElement.style.setProperty(
      "--main-color",
      e.target.dataset.color
    );
    // remove classActive
    e.target.parentElement.querySelectorAll(".active").forEach((el) => {
      el.classList.remove("active");
    });
    // add active class on e.target
    e.target.classList.add("active");
    localStorage.setItem("pageColor", e.target.dataset.color);
  });
});

window.addEventListener("scroll", (e) => {
  if (window.scrollY !== mySetting) {
    mySetting.classList.remove("open");
  }

  if (mySetting.classList.contains("open")) {
    return false;
  } else {
    myIcon.classList.remove("fa-spin");
  }
});

// darkmode

let mySpans = document.querySelectorAll(".darkOption span");

mySpans.forEach((span) => {
  span.addEventListener("click", (e) => {
    if (e.target.dataset.option === "yes") {
      document.body.classList.add("darkmode");
      localStorage.setItem("darkStorage", true);
    } else {
      document.body.classList.remove("darkmode");
      localStorage.setItem("darkStorage", false);
    }
    e.target.parentElement.querySelectorAll(".active").forEach((spn) => {
      spn.classList.remove("active");
    });
    e.target.classList.add("active");
  });
});

// clear localStorage

document.querySelector(".clearStorage").onclick = function () {
  localStorage.clear();

  window.location.reload();
};
