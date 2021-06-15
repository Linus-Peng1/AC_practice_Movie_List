const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []
const MOVIES_PER_PAGE = 12
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginatorInput = document.querySelector('#paginator')


function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    // console.log(item)
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
              data-target="#movie-modal" data-id=${item.id}>More</button>
              <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  // send request to show api
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results

    modalTitle.innerText = data.title
    modalDate.innerText = 'release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `
      <img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">
    `
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  // console.log(movie) // 觀察用
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  // console.log(list) // 觀察用
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function getMoviesByPage(page) {
  // page 1 -> 0 ~ 11
  // page 2 -> 12 ~ 23
  // page 3 -> 24 ~ 35
  // ......
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  // 選擇電影清單 movies 或 filterMovies
  const data = filteredMovies.length ? filteredMovies : movies
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if ('.btn-add-favorite') {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  // console.log(page, typeof (page)) // 檢查用

  // 更新頁面
  renderMovieList(getMoviesByPage(page))
})

// send request to index api
axios.get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    // console.log(movies)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))

// listen to search submit
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  // console.log(event) // 觀察用
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  // 篩選電影清單

  // 作法1 for-of
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filterMovies.push(movie)
  //   }
  // }
  // renderMovieList(filteredMovies)

  // 作法2 用條件來迭代：filter
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})