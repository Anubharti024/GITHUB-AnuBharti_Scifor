// <-- 00000000 Search btn 00000000 -->

searchform = document.querySelector('.search-form');

document.querySelector("#search-btn").onclick = () => {
  searchform.classList.toggle('active');
}


// <-- 00000000 Login form 00000000 -->

var loginForm = document.querySelector('.login-form-container');

document.querySelector('#login-btn').onclick = () => {
  loginForm.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () => {
  loginForm.classList.remove('active');
}


// <--0000000000 Swipper home Section 0000000000 -->

// ......Google Book Api list in (home-section)...

async function loadBooks() {
  const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=education');
  const data = await response.json();
  const books = data.items;
  const wrapper = document.getElementById('book-swiper-wrapper');

  books.forEach(book => {
    const img = book.volumeInfo.imageLinks?.thumbnail;
    const title = book.volumeInfo.title;
    const link = book.volumeInfo.previewLink;

    if (img && title) {
      const slide = document.createElement('a');
      slide.href = link;
      slide.target = "_blank";
      slide.className = 'swiper-slide';
      slide.innerHTML = `
                <img src="${img}" alt="${title}">
            `;
      wrapper.appendChild(slide);
    }
  })
};

var Swipper = new Swiper('.book-list', {
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    }
  },
});
loadBooks()      // function call




// <!--00000000 Featured section  000000-->

//......Google Book Api list in  (feature section).......

const container = document.getElementById("book-container");
const searchInput = document.getElementById("searchInput");

var swiper = new Swiper(".featured-slider", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    450: {
      slidesPerView: 3
    },
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 4
    }
  }
});

//---------  for random price--------- :
function getRandomPrice() {
  const price = (Math.random() * (30 - 10) + 10).toFixed(2);
  const oldPrice = (parseFloat(price) + (Math.random() * 5 + 5)).toFixed(2);
  return { price: `$${price}`, oldPrice: `$${oldPrice}` };
}

//------ favourite  --------
function isFavorited(id) {
  return localStorage.getItem(`fav-${id}`) !== null;
}

function toggleFavorite(el, id) {
  const key = `fav-${id}`;
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    el.classList.remove("favorited");
  } else {
    localStorage.setItem(key, "true");
    el.classList.add("favorited");
  }
}


//   ------book feach api -------
async function fetchBooks(query = "bestsellers") {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6`);
  const data = await res.json();

  container.innerHTML = "";

  if (!data.items) {
    container.innerHTML = "<p>No books found.</p>";
    swiper.update();
    return;
  }

  data.items.forEach(book => {
    const info = book.volumeInfo;
    const id = book.id;

    const thumbnail = info.imageLinks?.thumbnail || "./placeholder.jpg";
    const title = info.title || "Untitled";

    //----- add Book_target link -------
    const previewLink = info.previewLink || "#";  // Google Books preview link

    // ----- random price ------
    const { price, oldPrice } = getRandomPrice();

    const favorited = isFavorited(id) ? "favorited" : "";

    const slide = document.createElement("div");
    slide.className = "swiper-slide box";
    slide.innerHTML = `
        <div class="icons">
          <a href="${previewLink}" class="fas fa-search" target="_blank"  aria-label="Preview Book "></a>
          <a href="#" class="fas fa-heart  ${favorited}" data-id="${id}" aria-label="Add to Favorites"></a>
          <a href="${previewLink}" class="fas fa-eye" target="_blank" aria-label="View Details"></a>
        </div>
        <div class="image">
          <img src="${thumbnail}" alt="Book cover of ${title}">
        </div>
        <div class="content">
          <h3>${title}</h3>
          <div class="price">${price} <span>${oldPrice}</span></div>
          <a href="#" class="btn">Add to cart</a>
        </div>
      `;
    container.appendChild(slide);
  });

  swiper.update();    // Reinitialize Swiper


  // ------ Attach favorite toggle listeners -----

  document.querySelectorAll(".fa-heart").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.getAttribute("data-id");
      toggleFavorite(this, id);
    });
  });
}

fetchBooks();    // Initial fetch

//-------- Search handler ------

searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    fetchBooks(searchInput.value.trim());
  }
});




// <!--0000000 new letter section 0000000 -->

document.querySelector(".newletter form").addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = this.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  //---- Save to localStorage (mock backend) ----
  localStorage.setItem("subscribedEmail", email);

  //---- Show success message ----
  this.innerHTML = `
      <h3>You're Subscribed!</h3>
      <p>Thank you for subscribing. Stay tuned for updates.</p>
    `;
});

function validateEmail(email) {
  //---- Simple regex for email validation ----
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email);
}




// <!--0000000 Arrivals section 0000000 -->

const arrivalsContainer = document.getElementById("arrivals-container");

function getRandomRating() {
  return Math.floor(Math.random() * 2) + 4; // Random 4 or 5 stars
}


async function fetchArrivals(containerId, swiperInstance, query = "new books") {

  const arrivalsContainer = document.getElementById(containerId);
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8`);
  const data = await res.json();

  arrivalsContainer.innerHTML = "";

  if (!data.items) {
    arrivalsContainer.innerHTML = "<p>No arrivals found.</p>";
    return;
  }

  data.items.forEach(book => {
    const info = book.volumeInfo;
    const title = info.title || "Untitled";
    const thumbnail = info.imageLinks?.thumbnail || "./placeholder.jpg";
    const previewLink = info.previewLink || "#";
    const { price, oldPrice } = getRandomPrice();
    const stars = getRandomRating();

    const slide = document.createElement("a");
    slide.href = previewLink;
    slide.target = "_blank";
    slide.className = "swiper-slide box";
    slide.innerHTML = `
      <div class="image">
        <img src="${thumbnail}" alt="Book cover of ${title}">
      </div>
      <div class="content">
        <h3>${title}</h3>
        <div class="price">${price} <span>${oldPrice}</span></div>
        <div class="star">
          ${'<i class="fas fa-star"></i>'.repeat(stars)}
        </div>
      </div>
    `;
    arrivalsContainer.appendChild(slide);
  });

  swiperInstance.update(); // Update swiper after content is loaded
}


// ----- swiper ----
var arrivalsSwiper1 = new Swiper(".arrivals-slider:nth-of-type(1)", {
  spaceBetween: 10,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

var arrivalsSwiper2 = new Swiper(".arrivals-slider:nth-of-type(2)", {
  spaceBetween: 10,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

// ------ Function call --------
fetchArrivals("arrivals-container-1", arrivalsSwiper1, "fiction");
fetchArrivals("arrivals-container-2", arrivalsSwiper2, "nonfiction");




// ------ Deal Section -------

async function fetchRandomDeal(query = "books") {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`);
  const data = await res.json();

  if (!data.items || data.items.length === 0) return;

  const randomBook = data.items[Math.floor(Math.random() * data.items.length)];
  const info = randomBook.volumeInfo;

  const title = info.title || "Untitled";
  const description = info.description?.slice(0, 150) + "..." || "No description available.";
  const thumbnail = info.imageLinks?.thumbnail || "./placeholder.jpg";
  const previewLink = info.previewLink || "#";

  // Update DOM
  document.getElementById("deal-title").textContent = title;
  document.getElementById("deal-description").textContent = description;
  document.getElementById("deal-link").href = previewLink;
  document.getElementById("deal-image").src = thumbnail;
  document.getElementById("deal-image").alt = `Cover of ${title}`;
}
// ---- function call ----
fetchRandomDeal();



// <!--00000000 Review section  00000000-->

const reviewContainer = document.getElementById("review-container");

const reviewerNames = [
  "Alice", "John", "Maya", "Ravi", "Fatima", "Liam", "Ava", "Noah", "Sophia", "Ethan", "Anu", "Aklesh"
];

function getRandomStars() {
  const full = Math.floor(Math.random() * 3) + 3; // 3 to 5 stars
  const half = Math.random() < 0.3;
  return { full, half };
}

function getRandomReviewer() {
  return reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
}

async function fetchBookReviews(query = "popular books") {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`);
  const data = await res.json();

  reviewContainer.innerHTML = "";

  if (!data.items || data.items.length === 0) {
    reviewContainer.innerHTML = "<p>No reviews found.</p>";
    return;
  }

  data.items.forEach(book => {
    const info = book.volumeInfo;
    const title = info.title || "Unknown Title";
    const image = info.imageLinks?.thumbnail || "./placeholder.jpg";
    const reviewText = info.description?.slice(0, 120) + "..." || "This book is very engaging and well-written!";
    const reviewer = getRandomReviewer();
    const { full, half } = getRandomStars();

    const starsHTML =
      '<i class="fas fa-star"></i>'.repeat(full) +
      (half ? '<i class="fas fa-star-half-alt"></i>' : '');

    const slide = document.createElement("div");
    slide.className = "swiper-slide box";
    slide.innerHTML = `
      <img src="${image}" alt="Book cover">
      <h3>${reviewer}</h3>
      <p>${reviewText}</p>
      <div class="stars">${starsHTML}</div>
    `;

    reviewContainer.appendChild(slide);
  });

  reviewSwiper.update();
}

fetchBookReviews();



const reviewSwiper = new Swiper(".review-slider", {
  spaceBetween: 10,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    450: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  },
});



// <!--00000000 blogs section  00000000-->

var swiper = new Swiper(".blog-slider", {
  spaceBetween: 10,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  navigation: {
    nextE1: ".swiper-button-next",
    prevE1: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});


