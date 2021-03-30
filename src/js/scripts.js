const HOST = 3002;
const baseUrl = `http://localhost:${HOST}`;

const fetchProducts = (
    page,
    amount,
    sort,
    filterCategory,
    filterPrice,
    rangePrice
) => {
    let sortBy = ["name", "price", "rate"];
    return axios.get(
        `${baseUrl}/products?_page=${page}&_limit=${amount}${
            sort.length ? `&_sort=${sortBy[sort]}` : ""
        }${+filterCategory === 0 ? "" : `&category=${filterCategory}`}${
            +filterPrice === 0
                ? ""
                : `&priceNew_gte=${rangePrice[+filterPrice - 1].min}`
        }${
            +filterPrice === 0
                ? ""
                : `&priceNew_lte=${rangePrice[+filterPrice - 1].max}`
        }`
    );
};

const getProductsPage = async ({ ...data }) => {
    const options = {
        page: data.sortByPage,
        amount: data.sortByAmount,
        view: data.viewByGrid,
        sort: data.sortBy,
        filterCategory: data.category,
        filterPrice: data.price,
        rangePrice: data.rangePrice,
    };
    console.log(options);

    // Fetch Data
    let response = [];
    try {
        response = await fetchProducts(
            options.page,
            options.amount,
            options.sort,
            options.filterCategory,
            options.filterPrice,
            options.rangePrice
        );
    } catch (err) {}
    let products = response.data;

    if (products.length === 0) {
        console.log("khoong co san pham nao het");
        productsElement[0].appendChild(loader().loading);
        productsElement[1].appendChild(loader().loading);
        setTimeout(() => {
            productsElement[0].appendChild(loader().loaderDirect);
            productsElement[1].appendChild(loader().loaderDirect);
        }, 4000);
        return;
    }

    // Preprocessing
    setTimeout(() => {
        document
            .querySelector("#products-page .breadcrumb")
            .scrollIntoView({ behavior: "smooth" });
    }, 500);
    btnGridView[0].href = `/products.html?_p${options.page}_a${options.amount}_v${options.view}_sb${options.sort}_fc${options.filterCategory}_fp${options.filterPrice}`;
    btnListView[0].href = `/products.html?_p${options.page}_a${options.amount}_v${options.view}_sb${options.sort}_fc${options.filterCategory}_fp${options.filterPrice}`;

    // Preprocessing pagination
    let currentPaginations = [];
    if (response.headers.link.length === 0) {
        paginationsElements[0].classList.add("disabled");
        paginationsElements[2].classList.remove("disabled");
        paginationsElements[2].parentNode.classList.add("active");
        paginationsElements[3].classList.add("disabled");
        paginationsElements[4].classList.add("disabled");
        paginationsElements[6].classList.add("disabled");
    }
    if (!(response.headers.link.length === 0)) {
        const responseHeaders = extractPaginationLinks(response.headers.link);
        responseHeaders.map((e) => {
            currentPaginations.push(getPageAndAmount(e[1], options.amount));
        });
        currentPaginations = currentPaginations.map(
            (e) => extractPagination(e)[0][0]
        );

        // Preprocessing pagination
        const currentPage = +options.page;
        const lastPage = extractPagination(
            currentPaginations[currentPaginations.length - 1]
        )[0][0];

        // Setting currentPaginations
        paginationsElements[0].href = `/products.html?_p1_a${options.amount}_v${options.view}_sb${options.sort}_fc${options.filterCategory}_fp${options.filterPrice}`;
        paginationsElements[6].href = `/products.html?_p${lastPage}_a${options.amount}_v${options.view}_fc${options.filterCategory}_fp${options.filterPrice}`;

        if (
            currentPaginations.length === 3 &&
            currentPage === 1 &&
            currentPaginations[1] === currentPaginations[2]
        ) {
            paginationsElements[0].classList.add("disabled");
            paginationsElements[4].classList.add("disabled");
            paginationsElements[2].parentNode.classList.add("active");
            setLinkPagination(
                paginationsElements,
                currentPaginations[1],
                3,
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
        }
        if (
            currentPaginations.length === 3 &&
            currentPage === 1 &&
            currentPaginations[1] != currentPaginations[2]
        ) {
            paginationsElements[0].classList.add("disabled");
            paginationsElements[2].parentNode.classList.add("active");
            setLinkPagination(
                paginationsElements,
                3,
                currentPaginations[1],
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
            setLinkPagination(
                paginationsElements,
                4,
                currentPage + 2,
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
        }
        if (
            currentPaginations.length === 3 &&
            currentPage === +lastPage &&
            currentPaginations[0] === currentPaginations[1]
        ) {
            paginationsElements[6].classList.add("disabled");
            paginationsElements[4].classList.add("disabled");
            paginationsElements[3].parentNode.classList.add("active");
            setLinkPagination(
                paginationsElements,
                2,
                currentPaginations[1],
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
        }
        if (
            currentPaginations.length === 3 &&
            currentPage === +lastPage &&
            currentPaginations[0] != currentPaginations[1]
        ) {
            paginationsElements[6].classList.add("disabled");
            paginationsElements[4].parentNode.classList.add("active");
            setLinkPagination(
                paginationsElements,
                2,
                currentPage - 2,
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
            setLinkPagination(
                paginationsElements,
                3,
                currentPaginations[1],
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
            setLinkPagination(
                paginationsElements,
                4,
                currentPaginations[2],
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
        }
        if (currentPaginations.length === 4) {
            paginationsElements[3].parentNode.classList.add("active");
            setLinkPagination(
                paginationsElements,
                2,
                currentPaginations[1],
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
            setLinkPagination(
                paginationsElements,
                3,
                (+currentPaginations[1] + +currentPaginations[2]) / 2,
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
            setLinkPagination(
                paginationsElements,
                4,
                currentPaginations[2],
                options.amount,
                options.view,
                options.sort,
                options.filterCategory,
                options.filterPrice
            );
        }
    }

    // Load products
    productsElement[0].appendChild(loader().loading);
    productsElement[1].appendChild(loader().loading);
    setTimeout(() => {
        productsElement[0].innerHTML = "";
        productsElement[1].innerHTML = "";
        for (let i = 0; i < products.length; i++) {
            let productHorizonNode = document.createElement("div");
            productHorizonNode.className = "col-md-4 col-sm-6 px-3 py-4 pt-0";
            productHorizonNode.innerHTML = `
            <div class="product">
                <div class="product__image">
                    <img src="../assets/images/${
                        products[i].image
                    }.png" alt="meow" />
                    <div class="status center ${
                        products[i].discount === "new"
                            ? "bg-green-200"
                            : products[i].discount === "-50%"
                            ? "bg-red-100"
                            : ""
                    }">
                        ${
                            products[i].discount != ""
                                ? `<p>${products[i].discount}</p>`
                                : ""
                        }  
                    </div>
                    <div class="btn-wrapper center">
                        <button class="btn-buy">
                            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                        </button>
                        <a class="btn-see center" href="/details-product.html" onclick="${() =>
                            seeDetails(products[i].id)}">
                            <i class="fas fa-search" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
                <div class="product__description">
                    <div class="title center">${products[i].name}</div>
                    <div class="rate center">
                        ${rate(products[i].rate)}
                    </div>
                    <div class="price center justify-content-center flex-column flex-sm-row">
                        <div class="price__new">
                            <p>${formatPrice(products[i].priceNew)} đ</p>
                        </div>
                        <div class="price__old">
                            <p>${formatPrice(products[i].priceNew)} đ</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            let productVerticalNode = document.createElement("div");
            productVerticalNode.className = "col-12 px-3 py-4 pt-0";
            productVerticalNode.innerHTML = `
            <div class="product-vertical">
                <div class="product-vertical__image">
                    <img src="../assets/images/${
                        products[i].image
                    }.png" alt="meow">
                </div>
                <div class="product-vertical__description">
                    <div class="title">
                        <p class="text-ellipsis">${products[i].name}</p>
                    </div>
                    <div class="rate">
                        ${rate(products[i].rate)}
                    </div>
                    <div class="content text-ellipsis-2line">Cây Ngọc Ngân là loại cây dành cho tình yêu! Đây là món quà bất ngờ để bạn "người ấy". Ngọc Ngân (valentine) không chỉ đẹp ở phiến là xanh đốm trắng.Cây Ngọc Ngân là loại cây dành cho tình yêu! Đây là món quà bất ngờ để bạn "người ấy". Ngọc Ngân (valentine) không chỉ đẹp ở phiến là xanh đốm trắng. </div>
                    <div class="price">
                        <div class="price__new">
                            <p>${formatPrice(products[i].priceNew)} đ</p>
                        </div>
                    </div>
                    <div class="btn-wrapper">
                        <button class="btn-buy d-md-inline d-none">MUA NGAY</button>
                        <button class="btn-buy d-md-none d-inline-block">
                            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                        </button>
                        <a class="btn-see my-1 center" href="/details-product.html"><i class="fas fa-search" aria-hidden="true"></i></a>
                        <button class="btn-like my-1">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            `;
            productsElement[0].appendChild(productHorizonNode);
            productsElement[1].appendChild(productVerticalNode);
        }
    }, 500);
};

function seeDetails(id) {
    console.log(id);
}

const currentUri = window.location;
const currentUriPath = currentUri.pathname;

const productsElement = document.querySelectorAll(
    "#products-page #products .row"
);
const paginationsElements = document.querySelectorAll(
    "#products-page #products .page-link"
);
const btnGridView = document.querySelectorAll("#products-page #products #grid");
const btnListView = document.querySelectorAll("#products-page #products #list");
const gridView = document.querySelectorAll(
    "#products-page #products #gridProducts"
);
const listView = document.querySelectorAll(
    "#products-page #products #listProducts"
);
const filterElements = document.querySelectorAll("#products-page #list_filter");

if (currentUriPath === "/products.html") {
    paginationsElements[0].classList.add("disabled");
    paginationsElements[2].classList.add("disabled");
    paginationsElements[3].classList.add("disabled");
    paginationsElements[4].classList.add("disabled");
    paginationsElements[6].classList.add("disabled");
    const currentSortByAmount = document.getElementById("select_amount");
    const currentSort = document.getElementById("select_sort");
    const filterByCategory = filterElements[0].getElementsByTagName("a");
    const filterByPrice = filterElements[1].getElementsByTagName("a");
    let currentUriSearch = extractPagination(currentUri.search);
    console.log(currentUriSearch);

    const sort = {
        sortByPage: currentUriSearch.length === 0 ? 1 : currentUriSearch[0][0],
        sortByAmount:
            currentUriSearch.length === 0 ? 6 : currentUriSearch[1][0],
        viewByGrid: currentUriSearch.length === 0 ? 1 : currentUriSearch[2][0],
        sortBy: currentUriSearch.length === 0 ? 0 : currentUriSearch[3][0],
    };
    const filter = {
        category: currentUriSearch.length === 0 ? 0 : currentUriSearch[4][0],
        price: currentUriSearch.length === 0 ? 0 : currentUriSearch[5][0],
        rangePrice: [
            { min: 200000, max: 400000 },
            { min: 400000, max: 600000 },
            { min: 600000, max: 800000 },
            { min: 800000, max: 1000000 },
            { min: 1000000, max: 2000000 },
        ],
    };

    // Preset template when change url
    if (!(currentUriSearch.length === 0)) {
        currentSortByAmount.innerHTML = `
                <select id="select_amount">
                    <option value="6" ${
                        +currentUriSearch[1][0] === 6 ? "selected" : ""
                    }>6</option>
                    <option value="9" ${
                        +currentUriSearch[1][0] === 9 ? "selected" : ""
                    }>9</option>
                    <option value="12" ${
                        +currentUriSearch[1][0] === 12 ? "selected" : ""
                    }>12</option>
                    <option value="15" ${
                        +currentUriSearch[1][0] === 15 ? "selected" : ""
                    }>15</option>
                </select>
            `;
        currentSort.innerHTML = `
                <select id="select_sort">
                    <option value="0" ${
                        +currentUriSearch[3][0] === 0 ? "selected" : ""
                    }>Tên sản phẩm</option>
                    <option value="1" ${
                        +currentUriSearch[3][0] === 1 ? "selected" : ""
                    }>Giá tiền</option>
                    <option value="2" ${
                        +currentUriSearch[3][0] === 2 ? "selected" : ""
                    }>Yêu thích</option>
                </select>
            `;
        if(+currentUriSearch[4][0]) {
            let i = currentUriSearch[4][0]
            filterByCategory[i].parentNode.classList.add('active');
        }
        if(+currentUriSearch[5][0]) {
            let i = currentUriSearch[5][0]
            filterByPrice[i].parentNode.classList.add('active');
        }
    }

    console.log(sort);

    // Set products
    getProductsPage({ ...sort, ...filter });

    // Set products when change amount
    document
        .getElementById("select_amount")
        .addEventListener("change", function () {
            currentUri.search = `?_p${sort.sortByPage}_a${this.value}_v${sort.viewByGrid}_sb${sort.sortBy}_fc${filter.category}_fp${filter.price}`;
            sort.sortByAmount = +this.value;
            productsElement[0].innerHTML = "";
            productsElement[1].innerHTML = "";
            getProductsPage({ ...sort, ...filter });
        });

    // Set products when change sort by
    document
        .getElementById("select_sort")
        .addEventListener("change", function () {
            currentUri.search = `?_p${sort.sortByPage}_a${sort.sortByAmount}_v${sort.viewByGrid}_sb${this.value}_fc${filter.category}_fp${filter.price}`;
            sort.sortBy = +this.value;
            productsElement[0].innerHTML = "";
            productsElement[1].innerHTML = "";
            getProductsPage({ ...sort, ...filter });
        });

    // Set products when change view
    if (+sort.viewByGrid === 1) {
        btnGridView[0].setAttribute("class", "active");
        gridView[0].setAttribute("class", "carousel-item active");
        listView[0].setAttribute("class", "carousel-item");
    }
    if (+sort.viewByGrid === 0) {
        btnListView[0].setAttribute("class", "active");
        listView[0].setAttribute("class", "carousel-item active");
        gridView[0].setAttribute("class", "carousel-item");
    }
    function changeViewGrid() {
        currentUri.search = `?_p${sort.sortByPage}_a${sort.sortByAmount}_v1_sb${sort.sortBy}_fc${filter.category}_fp${filter.price}`;
    }
    function changeViewList() {
        currentUri.search = `?_p${sort.sortByPage}_a${sort.sortByAmount}_v0_sb${sort.sortBy}_fc${filter.category}_fp${filter.price}`;
    }

    // Set link when filter
    for (let i = 0; i < filterByCategory.length; i++) {
        filterByCategory[i].href = `/products.html?_p${sort.sortByPage}_a${
            sort.sortByAmount
        }_v${sort.viewByGrid}_sb${sort.sortBy}_fc${i}_fp${filter.price}`;
    }
    for (let i = 0; i < filterByPrice.length; i++) {
        filterByPrice[i].href = `/products.html?_p${sort.sortByPage}_a${
            sort.sortByAmount
        }_v${sort.viewByGrid}_sb${sort.sortBy}_fc${filter.category}_fp${i}`;
    }
}
