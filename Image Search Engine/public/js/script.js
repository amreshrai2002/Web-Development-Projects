const accessKey = 'yDee-oEAD_Z1CW9KA5ow8q86qvzFylev-PcWRvEraXM'
const secretKey = 'Yb2c_D_0viSpCHqUa9YBESzSFlJxoJnJjIz2akypWVs'

const API_KEY = `6ca1ece92b3b4dc48eded265c85e858826f2edb436e5d2e4a8cb9056daa1bf55`
const cursor = document.querySelector('.custom-cursor')

// Navbar functionality
const navbar = document.querySelector('.navbar')
const header = document.querySelector('.header')
const openNav = document.querySelector('.open-nav-btn')
const closeNav = document.querySelector('.close-nav-btn')
const navShadow = document.querySelector('.navbar-shadow')
const categories = document.querySelectorAll('.categories-item')
const navToggle = async () => {
  navbar.classList.toggle('active')
  navShadow.classList.toggle('active')
}

openNav.addEventListener('click', navToggle)

navShadow.addEventListener('click', navToggle)

closeNav.addEventListener('click', navToggle)

categories.forEach((category) => {
  category.addEventListener('click', () => {
    navToggle()
    selectedImage = false
    inputData = category.innerText
    searchImagesCmp()
  })
})
// const searchContainer = document.querySelectorAll('.search-result-container')
const searchResults = document.querySelector('.search-results')
const searchBtn = document.querySelector('.search-button')
const searchInput = document.querySelector('.search-input')
const searchFile = document.querySelector('.search-file')
const typeOfInput = document.querySelectorAll('.type-of-input')
const search = document.querySelector('.search')
let imagesDataText = []
let imagesDataImg = []
let searchContainer = []
let inputData = ''
let page = 0
let count = 0
let noDiv = 1
let lockScroll = false
let selectedImage = false

const searchImagesCmp = async () => {
  imagesDataText = []
  imagesDataImg = []
  for (let i = 0; i < noDiv; i++) {
    searchContainer[i].innerHTML = ''
  }
  page = 0
  searchImages()
}

search.addEventListener('click', () => {
  if (typeOfInput[1].checked) {
    searchFile.style.display = 'block'
    searchInput.style.display = 'none'
  } else {
    searchInput.style.display = 'block'
    searchFile.style.display = 'none'
  }
})

searchBtn.addEventListener('mouseover', () => {
  searchInput.classList.add('active')
})

searchBtn.addEventListener('mouseout', () => {
  searchInput.addEventListener('mouseout', () => {
    setInterval(() => {
      searchInput.classList.remove('active')
    }, 10000)
  })
})

const searchImageByText = async function () {
  searchInput.value = ''
  if (inputData == '') inputData = 'random'
  page++
  console.log(page)
  const url =
    'https://api.unsplash.com/search/photos?page=' +
    page +
    '&query=' +
    inputData +
    '&client_id=' +
    accessKey

  const response = await fetch(url)
  const data = await response.json()
  const results = await data.results

  count = imagesDataText.length
  results.map((result) => {
    imagesDataText.push(result)
  })

  if (page == 1) makeContainer()
  else alignTextImg(count)

  lockScroll = false
}

const alignTextImg = async function (pos) {
  for (let i = pos; i < imagesDataText.length; i++) {
    setTimeout(() => {
      const result = imagesDataText[i]
      const resultElement = `
    <div class="search-result">
      <div class="loading-bar"
      >
      </div>
      <div
        class="search-result-bg"
        style="
          background: url('${result.urls.small}');
        "
      ></div>
      <a
        class="search-result-title"
        href='${result.links.html}'
        target="_blank"
        >${result.alt_description.slice(0, 20) + '...'}</a
      ><img
        class="search-img"
        onclick=Expand('${i}')
        src='${result.urls.small}'
        loading="lazy"
      />
      <div class="user">
        <div class="user-img-bg"
          style="
              background: url('${result.urls.small}');
              "
        >
        </div>
        <img
          class="user-img"
          src='${result.user.profile_image.small}'
          decoding="async"
        />
        <p class="user-name">${result.user.name}</p>
        </div>
    </div>`

      searchContainer[i % noDiv].innerHTML += resultElement
    }, 0)
  }
}

const searchImageByImage = async function () {
  const file = selectedImage
  const formData = new FormData()
  formData.append('image', file)
  const temp = formData
  console.log(temp)

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      imagesDataImg = data.visual_matches
      makeContainer()
    })
    .catch((err) => console.log(err))
}

const alignImgImg = function () {
  for (let i = 0; i < imagesDataImg.length; i++) {
    setTimeout(() => {
      const result = imagesDataImg[i]
      const resultElement = `
    <div class="search-result">
      <div class="loading-bar"
      >
      </div>
      <div
        class="search-result-bg"
        style="
          background: url('${result.thumbnail}');
        "
      ></div>
      <a
        class="search-result-title"
        href='${result.link}'
        target="_blank"
        >${result.title.slice(0, 20) + '...'}</a
      ><img
        class="search-img"
        onclick=Expand('${i}')
        src='${result.thumbnail}'
        loading="lazy"
      />
      <div class="user">
        <div class="user-img-bg"
          style="
              background: url('${result.thumbnail}');
              "
        >
        </div>
        <img
          class="user-img"
          src='${result.source_icon}'
          decoding="async"
        />
        <p class="user-name">${result.source}</p>
        </div>
    </div>`

      searchContainer[i % noDiv].innerHTML += resultElement
    }, 0)
  }
}

const searchImages = async (val) => {
  lockScroll = true
  console.log('Get the Value and Type')
  if (selectedImage) {
    searchImageByImage(val)
  } else {
    searchImageByText(val)
  }
}

async function makeContainer() {
  noDiv = Math.ceil(window.innerWidth / 400)
  searchResults.innerHTML = ''
  searchResults.style.gridTemplateColumns = 'repeat(' + noDiv + ',1fr)'

  for (let i = 0; i < noDiv; i++) {
    const createEl = document.createElement('div')
    createEl.className = 'search-result-container'
    searchContainer.push(createEl)
  }

  if (selectedImage) alignImgImg()
  else alignTextImg(0)

  for (let i = 0; i < noDiv; i++) {
    searchResults.appendChild(searchContainer[i])
  }
}

window.addEventListener('resize', () => {
  console.log(imagesDataText.length)
  let temp = Math.ceil(window.innerWidth / 400)
  if (temp != noDiv) {
    searchContainer = []
    makeContainer()
  }
})

searchFile.addEventListener('change', (event) => {
  selectedImage = event.target.files[0]
})

searchBtn.addEventListener('click', (event) => {
  event.preventDefault()
  if (typeOfInput[1].checked == 'image') {
    selectedImage = false
  }
  inputData = searchInput.value
  searchImagesCmp()
})

searchImages()

const closeButton = document.querySelector('.close')
const imgBox = document.querySelector('.image-box')

const Expand = (val) => {
  const num = Number(val)
  let box
  if (imagesDataImg.length == 0) {
    box = `
    <button class="close" onclick="closedBox()">Close</button>
    <h3>${imagesDataText[val].alt_description}r</h3>
    <img
      src='${imagesDataText[val].urls.small}'
      alt='${imagesDataText[val].alt_description}'
      loading="lazy"
      decoding="async"
    />`
  } else {
    box = `
    <button class="close" onclick="closedBox()">Close</button>
    <h3>${imagesDataImg[val].title}</h3>
    <img
      src='${imagesDataImg[val].thumbnail}'
      alt='${imagesDataImg[val].title}'
      loading="lazy"
      decoding="async"
    />`
  }

  imgBox.innerHTML = box
  imgBox.classList.add('active')
  console.log(imgBox)
}

function closedBox() {
  imgBox.classList.remove('active')
  console.log('Closed')
}

window.addEventListener('scroll', () => {
  const bodyHeight = document.body.scrollHeight
  const windowHeight = window.innerHeight
  const scrollEndPos = bodyHeight - windowHeight
  const totalScrollPercent = (window.scrollY / scrollEndPos) * 100
  if (window.scrollY > 10) {
    document.querySelector('.header').classList.add('active')
  } else {
    document.querySelector('.header').classList.remove('active')
  }
  if (totalScrollPercent > 70 && lockScroll == false) {
    searchImages(inputData)
  }
})

window.addEventListener('mouseover', () => {
  cursor.classList.add('active')
})
window.addEventListener('mousemove', () => {
  cursor.style.top = event.clientY + 'px'
  cursor.style.left = event.clientX + 'px'
})
window.addEventListener('mouseout', () => {
  cursor.classList.remove('active')
})

const dummyDivsContainer = () => {
  for (let i = 0; i < noDiv * 5; i++) {
    const resultElement = `
    <div class="search-result">
      <div class="loading-bar">
      </div>
    </div>`
    searchContainer[i % div].innerHTML += resultElement
  }
}
