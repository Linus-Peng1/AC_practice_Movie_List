const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')

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
              <button class="btn btn-danger btn-remove-favorite" data-id=${item.id}>X</button>
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

function removeFromFavorite(id) {
  if (!movies) return

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return

  //刪除該筆電影
  movies.splice(movieIndex, 1)
  
  //存回 local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  //更新頁面
  renderMovieList(movies)
}

// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if ('.btn-remove-favorite') {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

// show the data panel at the beginning
renderMovieList(movies)