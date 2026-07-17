/* Chờ toàn bộ HTML load xong rồi mới lấy phần tử & gắn sự kiện, 
tránh lỗi getElementById trả về null vì phần tử chưa tồn tại. */
document.addEventListener("DOMContentLoaded", function onDOMReady() {
  runSafely(initGallery, "initGallery"); // 1. Đổi ảnh chính khi bấm thumbnail
  runSafely(initSizeSelector, "initSizeSelector"); // 2. Đổi giá khi chọn size
  runSafely(initQuantityStepper, "initQuantityStepper"); // 3. Tăng/giảm số lượng
  runSafely(initAddToCart, "initAddToCart"); // 4. Bấm "Thêm vào giỏ hàng"
  runSafely(initRatingScroll, "initRatingScroll"); // 5. Cuộn xuống phần review
  runSafely(initRelatedScroll, "initRelatedScroll"); // 6. Nút cuộn trái/phải sản phẩm liên quan
  runSafely(initRelatedAddToCart, "initRelatedAddToCart"); // 7. "+ Thêm" trên thẻ liên quan
});

/* Ghi log lỗi và chuyển sang hàm tiếp theo nếu hàm hiện tại lỗi thay vì dừng cả script. */
function runSafely(initFn, label) {
  try {
    initFn();
  } catch (error) {
    console.error("[ctsp.js] Lỗi ở " + label + ":", error);
  }
}

//FUNCTION 1
/* Thay đổi ảnh mainImage khi người dùng bấm vào 1 ảnh trong thumbnails-list */
function initGallery() {
  const mainImage = document.getElementById("mainImage"); // <img id="mainImage">
  const thumbs = document.querySelectorAll(".thumb"); // NodeList <img class="thumb">

  if (!mainImage || thumbs.length === 0) return;

  // handleThumbClick mỗi khi có event 'click'.
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function handleThumbClick() {
      /* Gắn 1 callback riêng cho từng thumbnail */
      switchMainImage(thumb, mainImage, thumbs);
    });
  });
}

function switchMainImage(selectedThumb, mainImage, allThumbs) {
  const newSrc =
    selectedThumb.dataset.full; /* Lấy data-full trong image được chọn */
  mainImage.setAttribute(
    "src",
    newSrc,
  ); /* Gán cho attribute 'src' của main image */

  allThumbs.forEach(function (thumb) {
    thumb.classList.remove("thumb--active"); /* Bỏ active ở tất cả thumbnail */
  });
  selectedThumb.classList.add("thumb--active"); /* active lại cái vừa click */
}

//FUNCTION 2
/* Đổi giá tiền hiển thị theo size sản phẩm */
function initSizeSelector() {
  const sizeSelect = document.getElementById("sizeSelect"); // <select id="sizeSelect">
  const priceEl = document.querySelector(".product-price"); // <p class="product-price">

  if (!sizeSelect || !priceEl) return;

  /* Hiển thị đúng giá ngay khi trang vừa load (theo option đang selected) */
  updatePriceFromSelectedOption(sizeSelect, priceEl);

  /* Cập nhật lại giá tiền khi người dùng thay đổi lựa chọn
  (handleSizeChange khi có event 'change') */
  sizeSelect.addEventListener("change", function handleSizeChange() {
    updatePriceFromSelectedOption(sizeSelect, priceEl);
  });
}

// Đọc data-price / data-old-price của option đang chọn rồi ghi vào DOM.
function updatePriceFromSelectedOption(sizeSelect, priceEl) {
  const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
  const price = Number(
    selectedOption.dataset.price,
  ); /* Lấy data-price trong <option> */
  const oldPrice = Number(
    selectedOption.dataset.oldPrice,
  ); /* Lấy data-old-price trong <option> */

  if (!price) return;

  priceEl.textContent = "";

  priceEl.append(formatCurrency(price));

  if (oldPrice && oldPrice > price) {
    const oldPriceSpan = document.createElement("span");
    oldPriceSpan.className = "old-price";
    oldPriceSpan.textContent = formatCurrency(oldPrice);

    priceEl.append(" ", oldPriceSpan);
  }
}

function formatCurrency(number) {
  return number.toLocaleString("vi-VN") + "đ";
}

//FUNCTION 3
/* Tăng, giảm số lượng sản phẩm [1, 50] */
function initQuantityStepper() {
  const btnDown =
    document.getElementById("btnDown"); /* <button id="btnDown"> */
  const btnUp = document.getElementById("btnUp"); /* <button id="btnUp"> */
  const quantityDisplay =
    document.getElementById(
      "quantityDisplay",
    ); /* <span id="quantityDisplay"> */

  if (!btnDown || !btnUp || !quantityDisplay) return;

  const MIN_QTY = 1;
  const MAX_QTY = 50;

  /* handleDecrease khi có event 'click' (-1 số lượng)*/
  btnDown.addEventListener("click", function handleDecrease() {
    changeQuantity(quantityDisplay, -1, MIN_QTY, MAX_QTY);
  });

  /* handleIncrease khi có event 'click' (+1 số lượng)*/
  btnUp.addEventListener("click", function handleIncrease() {
    changeQuantity(quantityDisplay, 1, MIN_QTY, MAX_QTY);
  });
}

function clampQuantity(current, step, min, max) {
  const next = current + step;
  if (next < min) return min;
  if (next > max) return max;
  return next;
}

function changeQuantity(displayElmt, step, min, max) {
  const currentQty = parseInt(displayElmt.textContent, 10);
  displayElmt.textContent = clampQuantity(currentQty, step, min, max);
}

//FUNCTION 4
/* Hiệu ứng khi bấm "Thêm vào giỏ hàng" */
function initAddToCart() {
  const addBtn =
    document.getElementById("addToCartBtn"); /* <button id="addToCartBtn"> */

  if (!addBtn) return;

  const originalText = addBtn.textContent;

  /* handleAddToCart khi có event 'click' */
  addBtn.addEventListener("click", function handleAddToCart() {
    const quantity = document.getElementById("quantityDisplay").textContent;
    const size = document.getElementById("sizeSelect").value;
    const productName = document.querySelector(".product-title").textContent;

    showToast('Đã thêm "' + productName + '" vào giỏ hàng thành công!');

    showAddedFeedback(addBtn, originalText, function onFeedbackDone() {
      console.log(
        "Đã thêm " + quantity + " ly size " + size + " vào giỏ hàng.",
      );
    });
  });
}

function showAddedFeedback(button, originalText, callback) {
  button.textContent = "Đã thêm ✓";
  button.disabled = true;

  /* Đổi "Đã thêm✓" thành originalText sau 1,2s */
  setTimeout(function resetButton() {
    button.textContent = originalText;
    button.disabled = false;
    callback(); /* hàm được GỌI LẠI sau khi hiệu ứng kết thúc */
  }, 1200);
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add("toast-notification--show");
  });

  const displayDuration = 2500; // Thời gian hiển thị: 2.5 giây
  const fadeOutDuration = 300; // Thời gian mờ dần: 0.3 giây

  setTimeout(function hideToast() {
    toast.classList.remove("toast-notification--show");

    setTimeout(function removeToast() {
      toast.remove();
    }, fadeOutDuration);
  }, displayDuration);
}

//FUNCTION 5
/* Cuộn mượt xuống reviewsSection khi click vào cụm sao đánh giá */
function initRatingScroll() {
  const ratingBlock = document.getElementById("scrollToReviews");
  const reviewsSection = document.getElementById("reviewsSection");

  if (!ratingBlock || !reviewsSection) return;

  ratingBlock.addEventListener("click", function handleScrollToReviews() {
    reviewsSection.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

//FUNCTION 6
/* Nút cuộn trái/phải cho danh sách related products */
function initRelatedScroll() {
  const scrollLeftBtn = document.getElementById("scrollLeftBtn");
  const scrollRightBtn = document.getElementById("scrollRightBtn");
  const relatedList = document.getElementById("relatedList");

  if (!relatedList) return;

  const scrollAmount = 250;

  if (scrollRightBtn) {
    scrollRightBtn.addEventListener("click", function handleScrollRight() {
      relatedList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }
  if (scrollLeftBtn) {
    scrollLeftBtn.addEventListener("click", function handleScrollLeft() {
      relatedList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
}

//FUNCTION 7
/* Thêm sản phẩm liên quan vào giỏ hàng khi bấm "+ Thêm" trên từng thẻ */
function initRelatedAddToCart() {
  const addButtons = document.querySelectorAll(".btn-add");

  addButtons.forEach(function (button) {
    button.addEventListener("click", function handleRelatedAdd() {
      const name = button.getAttribute("data-name");
      const price = Number(button.getAttribute("data-price"));

      showToast('Đã thêm "' + name + '" vào giỏ hàng thành công!');

      showAddedFeedback(button, "+ Thêm", function onFeedbackDone() {
        console.log(
          'Đã thêm "' +
            name +
            '" (' +
            formatCurrency(price) +
            ") vào giỏ hàng.",
        );
      });
    });
  });
}
