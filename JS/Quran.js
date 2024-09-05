// myLocalStorage
let colorStorage = localStorage.getItem("pageColor");
if (colorStorage !== null) {
  document.documentElement.style.setProperty("--main-color", colorStorage);
  document.querySelectorAll(".color li").forEach(li => {
    li.classList.remove("active");
    if (colorStorage === li.dataset.color) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  })
}

// localStorage for darkmode

let darkStorage = localStorage.getItem("darkStorage");

if (darkStorage !== null) {
  document.querySelectorAll(".darkOption span").forEach(span => {
    span.classList.remove("active")
  })
  if (darkStorage === 'true') {
    document.querySelector(".darkOption #yes").classList.add("active");
    document.body.classList.add("darkmode");
  } else {
    document.querySelector(".darkOption #no").classList.add("active");
    document.body.classList.remove("darkmode");
  }
}


// toggle

let toggle = document.getElementById("toggle");
let links = document.querySelector(".links");

toggle.onclick = function () {
  if (toggle.classList.contains("fa-bars")) {
    toggle.classList.replace("fa-bars", "fa-xmark");
  } else {
    toggle.classList.replace("fa-xmark", "fa-bars");
  }
  links.classList.toggle("show")
}

document.addEventListener("click", (e) => {

  e.stopPropagation();

  if (e.target !== toggle && e.target !== links) {

    links.classList.remove("show")
    if (links.classList.contains("show")) {
      toggle.classList.replace("fa-bars", "fa-xmark")
    } else {
      toggle.classList.replace("fa-xmark", "fa-bars")
    }
  }
})
links.addEventListener("click", (e) => {
  e.stopPropagation();
})

// left section add class

let myLeft = document.querySelector(".left-section");

window.addEventListener("scroll", () => {
  if (window.scrollY >= 120) {
    myLeft.classList.add("fixed")
  } else {
    myLeft.classList.remove("fixed")
  }
})


// rightSection

let rightSection = document.querySelector(".right-section");

// function

function getAyah() {

  // fetch

  fetch('https://api.quran.gading.dev/surah')
    .then(Response => Response.json())
    .then(data => {
      // for in
      for (let surah in data.data) {
        console.log(data.data[surah].name.long)
        rightSection.innerHTML +=
          `
        <div class="box" data-search="${data.data[surah].name.long}" data-search2="${data.data[surah].name.short}">
        <div class="text">
        <h2>${data.data[surah].name.long}</h2>
        <div class="style"></div>
        <p>${data.data[surah].name.transliteration.en}</p>
        </div>
        </div>  
          `
      }
      // select all boxes
      let myBoxes = document.querySelectorAll(".right-section .box");
      myBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
          myBoxes.forEach(box => {
            box.classList.remove("active");
          })
          e.target.classList.add("active");
        })
      })
      // select input searh
      let mySearch = document.getElementById("input-search");
      mySearch.addEventListener('keyup', () => {
        let result = mySearch.value,
          myValue = result.toLowerCase();
        myBoxes.forEach(box => {
          if (myValue === box.dataset.search) {
            box.style.display = 'block'
          } else {
            box.style.display = 'none'
          }
          if (myValue === box.dataset.search2) {
            box.style.display = 'block'
          } else {
            box.style.display = 'none'
          }
        })
        if (result !== "") {
          return false;
        } else {
          myBoxes.forEach(box => {
            box.style.display = "block";
          })
        }
      })
      // selector pop-up box
      let popBox = document.querySelector(".pop-box");
      // ayahcontent
      let ayahContent = document.querySelector(".aya-content");
      let exitButton = document.getElementById("close-button");
      myBoxes.forEach((box, index) => {
        box.addEventListener("click", () => {
          fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
            .then(Response => Response.json())
            .then(data => {
              let verses = data.data.verses;
              ayahContent.innerHTML = "";
              verses.forEach(verse => {
                popBox.classList.add("show")
                ayahContent.innerHTML +=
                  `
                  <div class="ayah-content">
                  <div class="info-ayah"> { ${verse.number.inSurah} } - ${verse.text.arab} </div>
                  <div>
                  <audio src="${verse.audio.primary}" controls></audio>
                  </div>
                  </div>
                  `
              })
              exitButton.addEventListener('click', () => {
                popBox.classList.remove("show")
              })
            })
        })
      })
    })
}

getAyah()


// setting box
let myIcon = document.querySelector(".fa-gear");
let mySetting = document.querySelector(".setting-box");


document.addEventListener('click', (e) => {
  if (e.target !== mySetting) {
    mySetting.classList.remove("open")
  }
  if (mySetting.classList.contains("open")) {
    return false;
  } else {
    myIcon.classList.remove("fa-spin")
  }
})
mySetting.addEventListener('click', (e) => {
  e.stopPropagation();
})



myIcon.onclick = function () {
  // add class to icon when i click
  this.classList.toggle("fa-spin");
  // toggle class to sectionSetting
  mySetting.classList.toggle("open")
}

// li => [Color's]

let liColor = document.querySelectorAll(".color li");

liColor.forEach(li => {
  li.addEventListener("click", (e) => {
    // add color to --main-color by setProperty
    document.documentElement.style.setProperty("--main-color", e.target.dataset.color);
    // remove classActive
    e.target.parentElement.querySelectorAll(".active").forEach(el => {
      el.classList.remove("active");
    })
    // add active class on e.target
    e.target.classList.add("active");
    localStorage.setItem('pageColor', e.target.dataset.color);
  })
})

window.addEventListener("scroll", (e) => {

  if (window.scrollY !== mySetting) {
    mySetting.classList.remove("open")
  }

  if (mySetting.classList.contains("open")) {
    return false;
  } else {
    myIcon.classList.remove("fa-spin")
  }
})

// darkmode

let mySpans = document.querySelectorAll(".darkOption span");

mySpans.forEach(span => {
  span.addEventListener("click", (e) => {

    if (e.target.dataset.option === "yes") {
      document.body.classList.add("darkmode")
      localStorage.setItem("darkStorage", "true")
    } else {
      document.body.classList.remove("darkmode")
      localStorage.setItem("darkStorage", "false")
    }
    e.target.parentElement.querySelectorAll(".active").forEach(spn => {
      spn.classList.remove("active")
    })
    e.target.classList.add("active")
  })
})
// clear Interval
document.querySelector(".clearStorage").onclick = function () {

  localStorage.clear();

  window.location.reload();

}