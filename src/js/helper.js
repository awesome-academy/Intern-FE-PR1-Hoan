function formatPrice(price) {
    let i = price.toString();
    let j = i.length > 3 ? i.length % 3 : 0;
    return (
        (j ? i.substr(0, j) + "," : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ".")
    );
}

function totalPrice(arr) {
    return arr.reduce((acc, cur) => acc + cur.totalPrice, 0);
}

function rate(star) {
    let rate = "";
    for (let i = 1; i <= star; i++) {
        rate = rate.concat('<i class="fas fa-star" aria-hidden="true"></i>');
    }
    if ((star * 10) % 10) {
        rate = rate.concat(
            '<i class="fas fa-star-half-alt" aria-hidden="true"></i>'
        );
    }
    for (let i = Math.ceil(star); i < 5; i++) {
        rate = rate.concat('<i class="far fa-star" aria-hidden="true"></i>');
    }
    return rate;
}

function extractPaginationLinks(str) {
    const regex = /<([^<>]+)>/g;
    return [...str.matchAll(regex)];
}

function getPageAndAmount(pages, amount) {
    const res = pages.slice(37).split("").reverse();
    return res
        .slice(8 + amount.length)
        .reverse()
        .join("");
}

function extractPagination(str) {
    const regex = /\d+/g;
    return [...str.matchAll(regex)];
}

function setLinkPagination(
    paginationsElements,
    currentPaginations,
    page,
    amount,
    view,
    sort,
    filterCategory,
    filterPrice
) {
    paginationsElements[currentPaginations].innerText = page;
    paginationsElements[
        currentPaginations
    ].href = `/products.html?_p${page}_a${amount}_v${view}_sb${sort}_fc${filterCategory}_fp${filterPrice}`;
}

function loader() {
    const loader = {
        loading: "",
        loaderDirect: "",
    };
    function loading() {
        let loaderNode = document.createElement("div");
        loaderNode.className = "center py-5";
        loaderNode.innerHTML = `
            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        `;
        loader.loading = loaderNode;
    }
    function loaderDirect() {
        let UriSearch = extractPagination(currentUri.search);
        let loaderNode = document.createElement("div");
        loaderNode.className = "center py-5";
        if (UriSearch.length) {
            loaderNode.innerHTML = `
            <div class="loader-direct">
                <p class="title"> Trang hi???n kh??ng kh??? d???ng, quay v??? trang ?????u ti??n</p>
                <button class="btn-loader"> <a href= "/products.html?_p1_a${UriSearch[1][0]}_v${UriSearch[2][0]}_sb${UriSearch[3][0]}_fc${UriSearch[4][0]}_fp${UriSearch[5][0]}"> Trang ?????u </a> </button>
            </div>
            `;
        }
        loader.loaderDirect = loaderNode;
    }
    loading();
    loaderDirect();
    return loader;
}

function validation(regex, value) {
    return regex.test(value);
}

function toast(product) {
    const toast = document.createElement("div");
    toast.className = "toast show my-2";
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${product.name}</strong>
        </div>
        <div class="toast-body">???? th??m ${product.name} v??o gi??? h??ng</div>
    `;
    return toast;
}
