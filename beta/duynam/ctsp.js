/* Swap mainImage và thumnail-images*/
function swapImage(selectedImage, mainImage) {
    const elSrc = selectedImage.dataset.full; /* data-full */
    mainImage.setAttribute("src", elSrc);
}

const mainImage = document.getElementById('mainImage');
const listThumbs = document.querySelectorAll('.thumb');

const arrlistThumbs = Array.from(listThumbs);

arrlistThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        swapImage(thumb, mainImage);
        arrlistThumbs.forEach(item => { item.classList.remove('thumb--active') });
        thumb.classList.add('thumb--active');
    }, false);
});

/* Hiển thị giá sản phẩm */
function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
}

function updatePrice(sltPrice, elPrice) {
    const opt = sltPrice.options[sltPrice.selectedIndex];
    const curPrice = Number(opt.dataset.price);
    const oldPrice = Number(opt.dataset.oldPrice);

    elPrice.textContent = formatPrice(curPrice);

    if (oldPrice && oldPrice > curPrice) {
        const elSpan = document.createElement('span');
        elSpan.className = "old-price";
        elSpan.textContent = formatPrice(oldPrice);
        elPrice.appendChild(elSpan);
    }
}

const sltPrice = document.getElementById("sizeSelect");
const elPrice = document.querySelector(".product-price");

updatePrice(sltPrice, elPrice);

sltPrice.addEventListener('change', () => { updatePrice(sltPrice, elPrice) }, false);

/* Số lượng sản phẩm [1, 50] */
function changeQuantity(elQuantity, elNum) {
    let newValue = Number(elQuantity.textContent) + elNum;
    if (newValue > 50) newValue = 50;
    if (newValue < 1) newValue = 1;
    elQuantity.textContent = newValue;
}

const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
const elQuantity = document.getElementById("quantityDisplay");

btnUp.addEventListener('click', () => { changeQuantity(elQuantity, 1) }, false);
btnDown.addEventListener('click', () => { changeQuantity(elQuantity, -1) }, false);

/* Hiệu ứng thêm sản phẩm vào giỏ hàng */
const btnAdd = document.getElementById('addToCartBtn');

function changeTextButton(btn) {
    const originalBtn = btn.textContent;
    btn.textContent = "\u2714 Đã thêm";
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = originalBtn;
        btn.disabled = false;
    }, 2000);
}

function showToast(message) {
    ;
    const toast = document.createElement('div');
    toast.className = "toast-notification";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

/* Thêm sản phẩm vào giỏ hàng(local storage) */
const cartStorageKey = "cart-item";

function getCartFromStorage() {
    const rawData = localStorage.getItem(cartStorageKey);
    const parsed = rawData ? JSON.parse(rawData) : [];
    return Array.isArray(parsed) ? parsed : [];
}

function saveCartToStorage(cartItems) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    return true;
}

function findIndexInCart(item, arrCartItems) {
    return arrCartItems.findIndex(cartItem => cartItem.id === item.id);
}

function addItemToCart(item) {
    const cartItems = getCartFromStorage();
    const index = findIndexInCart(item, cartItems);

    if (index >= 0) {
        cartItems[index].quantity += item.quantity; // Có trong giỏ hàng
    } else {
        cartItems.push(item); // Chưa có
    }

    saveCartToStorage(cartItems);
    return cartItems;
}

function createDataToCart() {
    const productId = btnAdd.dataset.id; // data-id
    const productName = document.querySelector('.product-title');
    const sltOption = sltPrice.options[sltPrice.selectedIndex];
    const price = Number(sltOption.dataset.price);

    addItemToCart({
        id: productId,
        img: mainImage ? mainImage.getAttribute("src") : "",
        name: `${productName.textContent} (${sltPrice.value})`,
        quantity: Number(elQuantity.textContent),
        price: price,
    });
}

btnAdd.addEventListener('click', () => {
    const productName = document.querySelector('.product-title').textContent;

    createDataToCart();

    changeTextButton(btnAdd);
    showToast(`Đã thêm ${productName} vào giỏ hàng`);
}, false);

/* Cuộn sản phẩm liên quan */

const scrollLeftBtn = document.getElementById('scrollLeftBtn');
const scrollRightBtn = document.getElementById('scrollRightBtn');
const elRelatedProduct = document.getElementById('relatedList');

function scrollRelatedProduct(direction) {
    elRelatedProduct.scrollBy({ left: 250 * direction, behavior: 'smooth' });
}
scrollRightBtn.addEventListener('click', () => { scrollRelatedProduct(1) }, false);

scrollLeftBtn.addEventListener('click', () => { scrollRelatedProduct(-1) }, false);