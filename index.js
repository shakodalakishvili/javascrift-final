const header = document.querySelector(".header");

const hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function () {
  const nav = document.querySelector(".nav");
  nav.classList.toggle("active");
});

const pagination = document.querySelector(".pagination");
const detailCard = document.querySelector(".detailCard");
const allSection = document.querySelectorAll(".part");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
 
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSection.forEach((part) => {
  sectionObserver.observe(part);
  part.classList.add("section--hidden");
});

const Url = `https://dummyjson.com/products`;

const productsPerPage = 12;
let totalPosts = 100;
let currentPages = 1;
let posts = [];

const totalProducts = async function () {
  try {
    const response = await fetch(`https://dummyjson.com/products`);

    const json = await response.json();
    const totalProducts = json.total;

    return totalProducts;
  } catch (error) {
    console.error(`error fetching total products:`, error);
  }
};
totalProducts();

const cards = document.querySelector(".cards");
const card = document.getElementsByClassName("card");
const cardDetail = document.querySelector(".cardDetail");
const order_box = document.getElementsByClassName(".order_box");

const products = async function () {
  const skip = (currentPages - 1) * productsPerPage;
  try {
    const response = await fetch(
      `https://dummyjson.com/products?limit=${productsPerPage}&skip=${skip}`
    );
    if (response.ok) {
      const json = await response.json();
      const data = json.products;
      posts = data;
      cards.innerHTML = "";

      posts.forEach((product) => {
        const card = document.createElement("div");

        card.classList.add("card");

      
        const card_img = document.createElement("div");
        card_img.classList.add("card_img");
        card.append(card_img);

        const img_src = document.createElement("img");
        img_src.src = `${product.images[0]}`;
        img_src.classList.add("card_img_scr");
        card_img.appendChild(img_src);

        const title = document.createElement("h1");
        title.classList.add("card_heading");
        title.textContent = `${product.title}`;
        card.appendChild(title);
        const category = document.createElement("h2");
        category.classList.add("category");
        category.textContent = `  ${product.category}`;
        card.appendChild(category);
        const description = document.createElement("p");
        description.classList.add("card_Text");
        description.textContent = `  ${product.description}`;
        card.appendChild(description);

   

        const price = document.createElement("span");
        price.classList.add("highlited_span");
        price.textContent = `price: ${product.price} $ `;
        card.appendChild(price);

      

        const detail = document.createElement("button");
        detail.textContent = `Detail`;
        detail.classList.add("order_btn");
        card.appendChild(detail);
        cards.appendChild(card);
        detail.addEventListener("click", function () {
          const detailEndpoint = `https://dummyjson.com/products/${product.id}`;

          fetchDetail(detailEndpoint);
        });
      });
    }
  } catch (error) {
    console.error(`error fetching mobile products:`, error);
  }

};

async function fetchDetail(detailEndpoint) {
  try {
    const response = await fetch(detailEndpoint);
    const detailData = await response.json();
    console.log(detailData);

    const s1coords = header.getBoundingClientRect();
    window.scrollTo({
      left: s1coords.left + window.pageXOffset,
      top: s1coords.top + window.pageYOffset,
      behavior: "smooth",
    });
    pagination.classList.add("hidden");

    cards.style.display = "none";
    detailCard.classList.remove("hidden");

    let detailHtml = `
    <h1 class="detailTitle">${detailData.title}</h1>
    <p class="detailDescription">${detailData.description}</p>
    <div class="detailImg--0">
      <img class "detailImg" src="${detailData.images[0]}" alt="">
    </div>
    <p class="detailDescription2">${detailData.description}</p>

      <div class="detailImages">
        <div class="detailImgCont">
        <img class=" detailImg" src="${detailData.images[1]}" alt="">
      </div>
      <div class='detailImgCont'>
        <img class="detailImg"  src="${detailData.images[2]}" alt="">
      </div>
      </div>
      <p class='detailDescription2'>${detailData.description}</p>
  </div>
  
    `;

    
    const returnBtn = document.createElement("button");

    detailCard.innerHTML = detailHtml;
    returnBtn.classList.add("returnBtn");
    returnBtn.textContent = `Back `;
    detailCard.appendChild(returnBtn);
    returnBtn.addEventListener("click", function (e) {
      cards.style.display = "flex";
      const s1coords = header.getBoundingClientRect();
      window.scrollTo({
        left: s1coords.left + window.pageXOffset,
        top: s1coords.top + window.pageYOffset,
        behavior: "smooth",
      });

      detailCard.classList.add("hidden");
      pagination.classList.remove("hidden");
    });


  } catch (error) {
    console.error(`Error fetching product detail:`, error);
  }
}




const prevBtn = document.querySelector(".prev");
prevBtn.addEventListener("click", function () {
  if (currentPages > 1) {
    currentPages--;
    const s1coords = header.getBoundingClientRect();
    window.scrollTo({
      left: s1coords.left + window.pageXOffset,
      top: s1coords.top + window.pageYOffset,
      behavior: "smooth",
    });
    updatePagination();
    products();
  }
});

const nextBtn = document.querySelector(".next");
nextBtn.addEventListener("click", function () {
  const totalPages = Math.ceil(totalPosts / productsPerPage);
  if (currentPages < totalPages) {
    currentPages++;
    const s1coords = header.getBoundingClientRect();
    window.scrollTo({
      left: s1coords.left + window.pageXOffset,
      top: s1coords.top + window.pageYOffset,
      behavior: "smooth",
    });
    updatePagination();
    products();
  }
});

const pageBtns = document.querySelectorAll(".page");
pageBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    currentPages = Number(btn.dataset.tab);
    const s1coords = header.getBoundingClientRect();
    window.scrollTo({
      left: s1coords.left + window.pageXOffset,
      top: s1coords.top + window.pageYOffset,
      behavior: "smooth",
    });
    updatePagination();
    products();
  });
});

const updatePagination = function () {
  pageBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (Number(btn.dataset.tab) === currentPages) {
      btn.classList.add("active");
    }
  });

  if (currentPages === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  const totalPages = Math.ceil(totalPosts / productsPerPage);
  if (currentPages === totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
};

products();
updatePagination();


