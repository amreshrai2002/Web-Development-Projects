'use strict'

//add Event on multiple element

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback)
  }
}

//PRELOADING

const loadingElement = document.querySelector('[data-loading]')

window.addEventListener('load', () => {
  loadingElement.classList.add('loaded')
  document.body.classList.remove('active')
})

//Mobile NAV TOGGLE
const [navTogglers, navLinks, navbar, overlay] = [
  document.querySelectorAll('[data-nav-toggler]'),
  document.querySelectorAll('[data-nav-link]'),
  document.querySelector('[data-navbar]'),
  document.querySelector('[data-overlay]'),
]

const togglerNav = function () {
  navbar.classList.toggle('active')
  overlay.classList.toggle('active')
  document.body.classList.toggle('active')
}

addEventOnElements(navTogglers, 'click', togglerNav)

const closeNav = function () {
  navbar.classList.toggle('active')
  overlay.classList.toggle('active')
  document.body.classList.toggle('active')
}

addEventOnElements(navLinks, 'click', closeNav)

// HEADER

const header = document.querySelector('[data-header]')

const activeElementOnScroll = function () {
  if (window.scrollY > 50) {
    header.classList.add('active')
  } else {
    header.classList.remove('active')
  }
}
window.addEventListener('scroll', activeElementOnScroll)

// TEXT ANIMATION EFFECT FOR HERO EFFECT

const letterBoxes = document.querySelectorAll('[data-letter-effect]')

let activeLetterBoxIndex = 0
let lastActiveLetterBoxIndex = 0
let totalLetterBoxDelay = 0

const setLetterEffect = function () {
  // loop through all letter boxes
  for (let i = 0; i < letterBoxes.length; i++) {
    //set intial animation delay
    let letterAnimationDelay = 0

    // get all character from current letter box
    const letters = letterBoxes[i].textContent.trim()
    // remove all characters from the current letter box
    letterBoxes[i].textContent = ''

    // loop through all letters
    for (let j = 0; j < letters.length; j++) {
      // create a span
      const span = document.createElement('span')

      // set animation delay on span
      span.style.animationDelay = `${letterAnimationDelay}s`

      // set the "in" class on the span if current letter box is active
      // otherwise class is out
      if (i === activeLetterBoxIndex) {
        span.classList.add('in')
      } else {
        span.classList.add('out')
      }

      // pass the current letter into span
      span.textContent = letters[j]

      // add spaces class on span , when current letter contains space
      if (letters[j] === ' ') span.classList.add('space')

      // pass the span on current letter box
      letterBoxes[i].appendChild(span)

      // skip letterAnimationDelay when loop is in the last index
      if (j >= letters.length - 1) break
      // otherwise update

      letterAnimationDelay += 0.5
    }

    // get total delay of active letter box
    if (i === activeLetterBoxIndex) {
      totalLetterBoxDelay = Number(letterAnimationDelay.toFixed(2))
    }

    // add active class on last active letter box
    if (i === lastActiveLetterBoxIndex) {
      letterBoxes[i].classList.add('active')
    } else {
      letterBoxes[i].classList.remove('active')
    }
  }

  setTimeout(function () {
    lastActiveLetterBoxIndex = activeLetterBoxIndex

    // update activeLetterBoxIndex based on total letter boxes
    activeLetterBoxIndex >= letterBoxes.length - 1
      ? (activeLetterBoxIndex = 0)
      : activeLetterBoxIndex++
    setLetterEffect()
  }, totalLetterBoxDelay * 1000 + 4000)
}

// call the letter effect function after a window loaded
window.addEventListener('load', setLetterEffect)

// Back to top Button
const backTopBtn = document.querySelector('[data-back-top-btn]')

window.addEventListener('scroll', function () {
  const bodyHeight = document.body.scrollHeight
  const windowHeight = window.innerHeight
  const scrollEndPos = bodyHeight - windowHeight
  const totalScrollPercent = (window.scrollY / scrollEndPos) * 100

  backTopBtn.textContent = `${totalScrollPercent.toFixed(0)}%`

  //visible back top button when scrolled 5% of the page
  if (totalScrollPercent > 5) {
    backTopBtn.classList.add('show')
  } else {
    backTopBtn.classList.remove('show')
  }
})

// SCROLL REVEAL

const revealElements = document.querySelectorAll('[data-reveal]')

const scrollReveal = function () {
  for (let i = 0; i < revealElements.length; i++) {
    const elementIsInScreen =
      revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15

    if (elementIsInScreen) {
      revealElements[i].classList.add('revealed')
    } else {
      revealElements[i].classList.remove('revealed')
    }
  }
}

window.addEventListener('scroll', scrollReveal)
scrollReveal()

// CUSTOM CURSOR

const cursor = document.querySelector('[data-cursor]')
const anchorElements = document.querySelectorAll('a')
const buttons = document.querySelectorAll('button')

//change cursorElement position on cursor move
document.body.addEventListener('mousemove', function (event) {
  setTimeout(function () {
    cursor.style.top = `${event.clientY}px`
    cursor.style.left = `${event.clientX}px`
  }, 100)
})

// add cursor hovered class
const hoverActive = function () {
  cursor.classList.add('hovered')
}

// remove cursor hovered class
const hoverDeactive = function () {
  cursor.classList.remove('hovered')
}

// add hover effect on cursor , when hover on any button or hyperlink
addEventOnElements(anchorElements, 'mouseover', hoverActive)
addEventOnElements(anchorElements, 'mouseout', hoverDeactive)
addEventOnElements(buttons, 'mouseover', hoverActive)
addEventOnElements(buttons, 'mouseout', hoverDeactive)

// add disabled class on cursorElement ,when mouse is out of body
document.body.addEventListener('mouseout', function () {
  cursor.classList.add('disabled')
})

// remove disabled class on cursorElement , when mouse in the body
document.body.addEventListener('mouseover', function () {
  cursor.classList.remove('disabled')
})
