const HOST = 3002;
const baseUrl = `http://localhost:${HOST}`;

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

let products = [];

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
    products = response.data;

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
        paginationsElements[0].classList.remove("disabled");
        paginationsElements[2].classList.remove("disabled");
        paginationsElements[2].parentNode.classList.remove("active");
        paginationsElements[3].classList.remove("disabled");
        paginationsElements[4].classList.remove("disabled");
        paginationsElements[6].classList.remove("disabled");
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
        paginationsElements[6].href = `/products.html?_p${lastPage}_a${options.amount}_v${options.view}_sb${options.sort}_fc${options.filterCategory}_fp${options.filterPrice}`;
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
                3,
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
    const productHorizon = productsElement[0];
    const productVertical = productsElement[1];
    productHorizon.appendChild(loader().loading);
    productVertical.appendChild(loader().loading);
    setTimeout(() => {
        productHorizon.innerHTML = "";
        productVertical.innerHTML = "";
        products.map((e) => {
            const productHorizonNode = document.createElement("div");
            productHorizonNode.className = "col-md-4 col-sm-6 px-3 py-4 pt-0";
            productHorizonNode.innerHTML = `
                <div class="product">
                    <div class="product__image">
                        <img src="../assets/images/${e.image}.png" alt="meow" />
                        <div class="status center ${
                            e.discount === "new"
                                ? "bg-green-200"
                                : e.discount === "-50%"
                                ? "bg-red-100"
                                : ""
                        }">
                            ${e.discount != "" ? `<p>${e.discount}</p>` : ""}  
                        </div>
                        <div class="btn-wrapper center">
                            <button class="btn-buy" onclick="addToCart(${
                                e.id
                            })">
                                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                            </button>
                            <a id="btn-details" class="btn-see center" href="details-product.html">
                                <i class="fas fa-search" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div class="product__description">
                        <div class="title center">${e.name}</div>
                        <div class="rate center">
                            ${rate(e.rate)}
                        </div>
                        <div class="price center justify-content-center flex-column flex-sm-row">
                            <div class="price__new">
                                <p>${formatPrice(e.priceNew)} đ</p>
                            </div>
                            <div class="price__old">
                                <p>${formatPrice(e.priceNew)} đ</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const productVerticalNode = document.createElement("div");
            productVerticalNode.className = "col-12 px-3 py-4 pt-0";
            productVerticalNode.innerHTML = `
            <div class="product-vertical">
                <div class="product-vertical__image">
                    <img src="../assets/images/${e.image}.png" alt="meow">
                </div>
                <div class="product-vertical__description">
                    <div class="title">
                        <p class="text-ellipsis">${e.name}</p>
                    </div>
                    <div class="rate">
                        ${rate(e.rate)}
                    </div>
                    <div class="content text-ellipsis-2line">Cây Ngọc Ngân là loại cây dành cho tình yêu! Đây là món quà bất ngờ để bạn "người ấy". Ngọc Ngân (valentine) không chỉ đẹp ở phiến là xanh đốm trắng.Cây Ngọc Ngân là loại cây dành cho tình yêu! Đây là món quà bất ngờ để bạn "người ấy". Ngọc Ngân (valentine) không chỉ đẹp ở phiến là xanh đốm trắng. </div>
                    <div class="price">
                        <div class="price__new">
                            <p>${formatPrice(e.priceNew)} đ</p>
                        </div>
                    </div>
                    <div class="btn-wrapper">
                        <button class="btn-buy d-md-inline d-none"  onclick="addToCart(${
                            e.id
                        })" > <a href="/cart.html">MUA NGAY </a></button>
                        <button class="btn-buy d-md-none d-inline-block" onclick="addToCart(${
                            e.id
                        })">
                            <a href="/cart.html"><i class="fas fa-shopping-cart" aria-hidden="true"></i></a>
                        </button>
                        <a class="btn-see my-1 center" href="/details-product.html"><i class="fas fa-search" aria-hidden="true"></i></a>
                        <button class="btn-like my-1" onclick="addToCart(${
                            e.id
                        })">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            `;
            productHorizon.appendChild(productHorizonNode);
            productVertical.appendChild(productVerticalNode);
        });
    }, 400);
};

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
        if (+currentUriSearch[4][0]) {
            let i = currentUriSearch[4][0];
            filterByCategory[i].parentNode.classList.add("active");
        }
        if (+currentUriSearch[5][0]) {
            let i = currentUriSearch[5][0];
            filterByPrice[i].parentNode.classList.add("active");
        }
    }

    console.log(sort);

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
        filterByCategory[
            i
        ].href = `/products.html?_p${sort.sortByPage}_a${sort.sortByAmount}_v${sort.viewByGrid}_sb${sort.sortBy}_fc${i}_fp${filter.price}`;
    }
    for (let i = 0; i < filterByPrice.length; i++) {
        filterByPrice[
            i
        ].href = `/products.html?_p${sort.sortByPage}_a${sort.sortByAmount}_v${sort.viewByGrid}_sb${sort.sortBy}_fc${filter.category}_fp${i}`;
    }
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
amountProductInCart(cart);
// console.log(localStorage);
function addToCart(id) {
    const toastElement = document.getElementById("toasts");
    const cartLength = cart.length;
    const product = {
        id: Number,
        name: String,
        price: Number,
        totalPrice: Number,
        quantity: 1,
    };
    const productFinded = products.find((e) => e.id === id);
    product.id = productFinded.id;
    product.name = productFinded.name;
    product.price = productFinded.priceNew;
    product.totalPrice = product.price * product.quantity;

    console.log(cart);
    if (cartLength === 0) {
        cart.push(product);
        amountProductInCart(cart);
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(cart);
        toastElement.appendChild(toast(product));
        setTimeout(() => {
            toastElement.removeChild(toastElement.childNodes[0]);
        }, 2000);
        return;
    }
    for (let i = 0; i < cartLength; i++) {
        if (cart[i].id === product.id) {
            cart[i].quantity += 1;
            cart[i].totalPrice = cart[i].price * cart[i].quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            toastElement.appendChild(toast(product));
            setTimeout(() => {
                toastElement.removeChild(toastElement.childNodes[0]);
            }, 2000);
            return;
        }
    }

    cart.push(product);
    amountProductInCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    toastElement.appendChild(toast(product));
    setTimeout(() => {
        toastElement.removeChild(toastElement.childNodes[0]);
    }, 2000);
    console.log(cart);
}
function amountProductInCart(cart) {
    const amount = cart?.length ? cart.length : 0;
    const amountElement = document.querySelector("#header #cart span");
    amountElement.innerText = `${amount} sản phẩm`;
}

const btnRemoveAll = document.querySelector("#cart-page #remove-all");
const btnPay = document.querySelector("#cart-page #pay");

if (currentUriPath === "/cart.html") {
    if (cart.length === 0) {
        addProductToCartTable();
        btnRemoveAll.className = "d-none";
        btnPay.className = "d-none";
    }
    cart.map((e, index) => {
        addProductToCartTable(e, index);
        changeQuantityProductInCartTable(e, index);
    });
    totalCart();
    console.log(cart);
}

function addProductToCartTable(product, index) {
    const tableElement = document.querySelector("#cart-page #table");
    const productElements = document.createElement("div");
    productElements.className = "row tr text-grey-100";
    if (cart.length === 0) {
        productElements.innerHTML = `
            <div class="empty-cart py-5">
                <p class="center py-3">Giỏ hàng của bạn trống trơn :(</p>
                <button class="btn-green m-auto center" type="button">
                    <a href="/products.html">Tiếp tục mua</a>
                </button>
            </div>
        `;
        tableElement.appendChild(productElements);
        return;
    }
    productElements.innerHTML = `
        <div class="col-2 center th"><img src="../assets/images/spx2-1.png"></div>
        <div class="col-3 center th">
            <p class="text-green-100 text-center">${product.name}</p>
        </div>
        <div class="col-2 center th text-center">
            <p>${formatPrice(product.price)} đ</p>
        </div>
        <form class="col-2 center th">
            <input class="quantity" type="number" id="quantity-${
                product.id
            }" name="quantity" min="0" max="9" value=${product.quantity}>
        </form>
        <div class="col-2 center th text-center">
            <div id="total-price-${product.id}">${formatPrice(
        product.totalPrice
    )} đ</div>
        </div>
        <div class="col-1 center th">
            <i onclick="removeProductInCartTable(${index})" class="fas fa-trash-alt" aria-hidden="true"></i>
        </div>
    `;
    tableElement.appendChild(productElements);
}

function changeQuantityProductInCartTable(product, index) {
    const quantity = document.getElementById(`quantity-${product.id}`);
    const totalPrice = document.getElementById(`total-price-${product.id}`);
    quantity.addEventListener("change", function () {
        if (+this.value === 0) {
            removeProductInCartTable(index);
            totalCart();
            if (cart.length === 0) {
                removeAllProductInCartTable();
                btnRemoveAll.className = "d-none";
                btnPay.className = "d-none";
            }
            return;
        }
        product.quantity = +this.value;
        product.totalPrice = product.price * product.quantity;
        totalPrice.innerText = `${formatPrice(product.totalPrice)} Đ`;
        totalCart();
        localStorage.setItem("cart", JSON.stringify(cart));
    });
}
function removeProductInCartTable(index) {
    const nodeListProducts = document.querySelectorAll(
        "#cart-page #table .row"
    );
    const tableElement = document.querySelector("#cart-page #table");
    cart.splice(index, 1);
    nodeListProducts[index + 1].innerHTML = ``;
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
    if (cart.length === 0) {
        removeAllProductInCartTable();
        btnRemoveAll.className = "d-none";
        btnPay.className = "d-none";
    }
    tableElement.innerHTML = ``;
    tableElement.innerHTML = `
        <div class="row bg-green-200 text-white-100 tr">
            <div class="col-2 center th">
            <p>Hình ảnh</p>
            </div>
            <div class="col-3 center th">
            <p>Tên sản phẩm</p>
            </div>
            <div class="col-2 center th">
            <p> Đơn giá</p>
            </div>
            <div class="col-2 center th">
            <p>Số lượng</p>
            </div>
            <div class="col-2 center th">
            <p>Thành tiền</p>
            </div>
            <div class="col-1 center th">
            <p>Xóa</p>
            </div>
        </div>
    `;
    cart.map((e, index) => {
        addProductToCartTable(e, index);
        changeQuantityProductInCartTable(e, index);
    });
    totalCart();
    amountProductInCart(cart);
}

function removeAllProductInCartTable() {
    btnRemoveAll.className = "d-none";
    btnPay.className = "d-none";
    localStorage.clear();
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tableElement = document.querySelector("#cart-page #table");
    tableElement.innerHTML = `
        <div class="row bg-green-200 text-white-100 tr">
            <div class="col-2 center th">
            <p>Hình ảnh</p>
            </div>
            <div class="col-3 center th">
            <p>Tên sản phẩm</p>
            </div>
            <div class="col-2 center th">
            <p> Đơn giá</p>
            </div>
            <div class="col-2 center th">
            <p>Số lượng</p>
            </div>
            <div class="col-2 center th">
            <p>Thành tiền</p>
            </div>
            <div class="col-1 center th">
            <p>Xóa</p>
            </div>
        </div>
    `;
    addProductToCartTable();
    totalCart();
    amountProductInCart();
}

function totalCart() {
    const caculatePrice = document.querySelectorAll("#cart-page #total p");
    const total = totalPrice(cart);
    const tax = total * 0.1;
    caculatePrice[0].innerText = `${formatPrice(total)} đ`;
    caculatePrice[1].innerText = `${formatPrice(tax)} đ`;
    caculatePrice[2].innerText = `${formatPrice(total + tax)} đ`;
}

if (currentUriPath === "/checkout.html") {
    // Define
    const progressElement = document.getElementById("progress");
    const emptyCartElement = document.getElementById("empty-cart");
    const inforInvoiceElement = document.getElementById("information-invoice");
    const confirmInvoiceElement = document.getElementById("confirm-invoice");
    const successElement = document.getElementById("success");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLength = cart.length;
    const total = totalPrice(cart);

    // Define information invoice
    const inputName = document.getElementById("name-infor");
    const validateName = document.getElementById("name-validate");
    const inputPhone = document.getElementById("phone-infor");
    const validatePhone = document.getElementById("phone-validate");
    const inputAddress = document.getElementById("address-infor");
    const validateAddress = document.getElementById("address-validate");
    const inputNote = document.getElementById("note-infor");
    const inputPayment = document.querySelectorAll("#payment-infor input");
    const totalPriceInforElement = document.getElementById("total-price-infor");

    // Define confirm information
    const nameConfirm = document.getElementById("name-confirm");
    const phoneConfirm = document.getElementById("phone-confirm");
    const addressConfirm = document.getElementById("address-confirm");
    const noteConfirm = document.getElementById("note-confirm");
    const paymentConfirm = document.getElementById("payment-confirm");
    const productsElement = document.getElementById("products");
    const totalPriceConfirmElement = document.getElementById(
        "total-price-confirm"
    );

    totalPriceInforElement.innerText = `${formatPrice(total)} đ`;
    const invoice = JSON.parse(localStorage.getItem("invoice")) || {
        name: "",
        phone: "",
        address: "",
        note: "",
        payment: "",
        cart: cart,
    };

    emptyCartElement.className = "d-none";
    inforInvoiceElement.className = "d-none";
    confirmInvoiceElement.className = "d-none";
    successElement.className = "d-none";
    if (cartLength === 0) {
        emptyCartElement.className = "d-block";
    }
    if (cartLength !== 0) {
        console.log(progressElement);
        progressElement.style = "width: 33%";
        inforInvoiceElement.className = "d-block";
    }

    console.log(invoice);
    if (invoice.name !== "" || invoice.length === 0) {
        inputName.value = invoice.name;
        inputPhone.value = invoice.phone;
        inputAddress.value = invoice.address;
        inputNote.value = invoice.note;
        for (let i = 0, length = inputPayment.length; i < length; i++) {
            if (inputPayment[i].value === invoice.payment) {
                inputPayment[i].checked = true;
                break;
            }
        }
    }
    cart.map((e) => {
        createProductsChoosesed(e);
    });
    inputName.addEventListener("keyup", function () {
        const regex = /^[^~!@#$%^&*()_+|{}[\]<>:=;,?/.]{6,}$/g;
        let check = regex.test(this.value);
        if (!check) {
            inputName.style = "border-color: red";
            validateName.style = "opacity: 1";
            invoice.name = "";
        }
        if (check) {
            inputName.style = "border-color: $white-250";
            validateName.style = "opacity: 0";
            invoice.name = this.value;
        }
    });
    inputPhone.addEventListener("keyup", function () {
        const regex = /^[0-9]{10}$/g;
        let check = regex.test(this.value);
        if (!check) {
            inputPhone.style = "border-color: red";
            validatePhone.style = "opacity: 1";
            invoice.phone = "";
        }
        if (check) {
            inputPhone.style = "border-color: $white-250";
            validatePhone.style = "opacity: 0";
            invoice.phone = this.value;
        }
    });
    inputAddress.addEventListener("keyup", function () {
        const regex = /^[^~!@#$%^&*()_+|{}[\]<>:=;?/.]{8,100}$/g;
        let check = regex.test(this.value);
        if (!check) {
            inputAddress.style = "border-color: red";
            validateAddress.style = "opacity: 1";
            invoice.address = "";
        }
        if (check) {
            inputAddress.style = "border-color: $white-250";
            validateAddress.style = "opacity: 0";
            invoice.address = this.value;
        }
    });

    function createProductsChoosesed(product) {
        const productsChoosesed = document.querySelectorAll(
            "#invoice-infor ul"
        );
        const productElements = document.createElement("li");
        productElements.className = "d-flex justify-content-between py-2";
        productElements.innerHTML = `
            <p>${product.name} <span>x${product.quantity}:</span></p>
            <p>${formatPrice(product.totalPrice)} đ</p>
        `;
        productsChoosesed[0].appendChild(productElements);
    }

    function submitInformation() {
        const data = getInformationFromForm(invoice);
        console.log(data);
        if (
            data.name === "" ||
            data.phone === "" ||
            data.address === "" ||
            data.payment === "" ||
            data.cart.length === 0
        ) {
            if (data.name === "") {
                inputName.style = "border-color: red";
                validateName.style = "opacity: 1";
            }
            if (data.phone === "") {
                inputPhone.style = "border-color: red";
                validatePhone.style = "opacity: 1";
            }
            if (data.address === "") {
                inputAddress.style = "border-color: red";
                validateAddress.style = "opacity: 1";
            }
            return;
        }
        localStorage.setItem("invoice", JSON.stringify(invoice));
        console.log(localStorage);
        inforInvoiceElement.className = "d-none";
        confirmInvoiceElement.className = "d-block";
        createInvoice();
    }
    function getInformationFromForm(invoice) {
        invoice.note = inputNote.value;
        console.log(inputPayment);
        for (let i = 0; i < inputPayment.length; i++) {
            if (inputPayment[i].checked) {
                invoice.payment = inputPayment[i].value;
                break;
            }
        }
        return invoice;
    }
    function goBack() {
        inforInvoiceElement.className = "d-block";
        confirmInvoiceElement.className = "d-none";
    }

    function createInvoice() {
        nameConfirm.innerText = invoice.name;
        phoneConfirm.innerText = invoice.phone;
        addressConfirm.innerText = invoice.address;
        noteConfirm.innerText = invoice.note;
        paymentConfirm.innerText = invoice.payment;
        totalPriceConfirmElement.innerText = `${formatPrice(
            total + total * 0.1
        )} đ`;
        progressElement.style = "width: 66%";
        document
            .querySelector(".breadcrumb")
            .scrollIntoView({ behavior: "smooth" });
        cart.forEach((e) => {
            const productElement = document.createElement("div");
            productElement.className = "d-flex product-invoice";
            productElement.innerHTML = `
                <div class="col-4 center py-3">
                    <p>${e.name}</p>
                </div>
                <div class="col-3 center py-3">
                    <p>${formatPrice(e.price)} đ</p>
                </div>
                <div class="col-2 center py-3">
                    <p>${e.quantity}</p>
                </div>
                <div class="col-3 center py-3">
                    <p>${formatPrice(e.totalPrice)} đ</p>
                </div>
            `;
            productsElement.appendChild(productElement);
        });
    }

    function confirmInvoice() {
        try {
            postInvoiceSuccessfully(invoice);
        } catch (err) {}
        localStorage.clear();
        confirmInvoiceElement.className = "d-none";
        successElement.className = "d-block";
        amountProductInCart([]);
        progressElement.style = "width: 100%";
        document
            .querySelector(".breadcrumb")
            .scrollIntoView({ behavior: "smooth" });
    }
}

function postInvoiceSuccessfully(invoice) {
    return axios.post(`${baseUrl}/invoices`, invoice);
}
