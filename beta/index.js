const siteHeader = document.querySelector(".site-header");
const headerTop = document.querySelector(".header-top");
const headerActions = document.querySelector(".header-actions");
const searchToggle = document.querySelector(".search-toggle");
const searchInput = document.querySelector(".search-input");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const productDropdown = document.querySelector(".nav-dropdown");
const productDropdownToggle = document.querySelector(".nav-dropdown-toggle");

// =========================================
// XỬ LÝ HEADER & MENU
// =========================================

function updateHeaderPosition() {
    siteHeader.classList.toggle("main-fixed", window.scrollY >= headerTop.offsetHeight);
}
window.addEventListener("scroll", updateHeaderPosition);
window.addEventListener("resize", updateHeaderPosition);
updateHeaderPosition();

searchToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = headerActions.classList.toggle("search-open");
    searchToggle.setAttribute("aria-expanded", isOpen);
    if (isOpen) searchInput.focus();
});

menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", isOpen);
});

productDropdownToggle.addEventListener("click", (event) => {
    event.stopPropagation(); 
    const isOpen = productDropdown.classList.toggle("is-open");
    productDropdownToggle.setAttribute("aria-expanded", isOpen);
});

document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
    if (!productDropdown.contains(event.target)) {
        productDropdown.classList.remove("is-open");
        productDropdownToggle.setAttribute("aria-expanded", "false");
    }
    if (!headerActions.contains(event.target)) {
        headerActions.classList.remove("search-open");
        searchToggle.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const wasMenuOpen = mainNav.classList.contains("is-open");
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        productDropdown.classList.remove("is-open");
        productDropdownToggle.setAttribute("aria-expanded", "false");
        headerActions.classList.remove("search-open");

        if (wasMenuOpen) {
            menuToggle.focus();
        } else {
            productDropdownToggle.focus();
        }
    }
});

// =========================================
// XỬ LÝ BANNER SLIDER
// =========================================
const bannerTrack = document.querySelector(".banner-track");
const bannerSlides = document.querySelectorAll(".banner-slide");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

// Kiểm tra xem trang hiện tại có banner không (tránh lỗi trên các trang con)
if (bannerTrack && bannerSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = bannerSlides.length;
    let slideInterval;

    // Hàm cập nhật vị trí thẻ chứa ảnh banner
    const updateSlide = () => {
        bannerTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    // Chuyển sang banner tiếp theo
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    };

    // Chuyển về banner trước đó
    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide();
    };

    // Tự động chạy mỗi 5 giây
    const startAutoSlide = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    // Khởi động lại vòng lặp 5s nếu người dùng tự bấm (chống trượt loạn nhịp)
    const resetAutoSlide = () => {
        clearInterval(slideInterval);
        startAutoSlide();
    };

    // Lắng nghe sự kiện click trên nút bấm
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
    });

    // Kích hoạt auto chạy khi load xong JS
    startAutoSlide();
}

// =========================================
// XỬ LÝ SLIDER SẢN PHẨM (Kéo tự do & Dấu chấm) - BẢN ĐA NĂNG
// =========================================
function initProductSlider(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);

    if (!track || !dotsContainer) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // Kéo thả chuột
    track.addEventListener("mousedown", (e) => {
        isDown = true;
        track.style.scrollBehavior = "auto";
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });

    track.addEventListener("mouseleave", () => {
        isDown = false;
        track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mouseup", () => {
        isDown = false;
        track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
    });

    // Tính toán dấu chấm
    const calculateDots = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) {
            dotsContainer.innerHTML = ''; 
            return; 
        }

        // Tự động nhận diện class của thẻ sản phẩm trong track này
        const card = track.querySelector(".product-card") || track.querySelector(".product-card-static");
        const cardWidth = card.offsetWidth + 20; 
        const pages = Math.ceil(maxScroll / cardWidth) + 1;
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("active");
            
            dot.addEventListener("click", () => {
                track.scrollLeft = i * cardWidth;
            });
            dotsContainer.appendChild(dot);
        }
    };

    calculateDots();
    window.addEventListener("resize", calculateDots);

    // Đồng bộ Dấu chấm khi cuộn
    track.addEventListener("scroll", () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) return;

        const scrollPercentage = track.scrollLeft / maxScroll;
        const dots = dotsContainer.querySelectorAll(".dot");
        
        if (dots.length > 0) {
            let activeIndex = Math.round(scrollPercentage * (dots.length - 1));
            dots.forEach(dot => dot.classList.remove("active"));
            if (dots[activeIndex]) {
                dots[activeIndex].classList.add("active");
            }
        }
    });
}

// Khởi chạy hệ thống Slider cho cả 2 phần
initProductSlider("featured-track", "featured-dots");
initProductSlider("bestseller-track", "bestseller-dots");

// =========================================
// XỬ LÝ CHỨC NĂNG LỌC SẢN PHẨM (FILTER TABS)
// =========================================
const filterTabs = document.querySelectorAll(".product-tabs .tab-btn");
const filterProducts = document.querySelectorAll("#filterable-product-grid .product-card-static");

if (filterTabs.length > 0 && filterProducts.length > 0) {
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            
            // 1. Gỡ bỏ class "active" (nền xanh) ở tất cả các nút tab
            filterTabs.forEach(t => t.classList.remove("active"));
            
            // 2. Thêm class "active" vào nút tab vừa được bấm
            tab.classList.add("active");

            // 3. Lấy ra từ khóa lọc (ví dụ: "sale", "nuoc-ep", "all")
            const filterValue = tab.getAttribute("data-filter");

            // 4. Quét qua toàn bộ sản phẩm
            filterProducts.forEach(product => {
                // Nếu bấm nút "Tất cả" HOẶC thẻ sản phẩm có chứa class trùng với tên filter
                if (filterValue === "all" || product.classList.contains(filterValue)) {
                    // Xóa class ẩn đi -> Sản phẩm sẽ hiện ra
                    product.classList.remove("hide-product");
                } else {
                    // Thêm class ẩn đi -> Sản phẩm sẽ biến mất
                    product.classList.add("hide-product");
                }
            });
        });
    });
}
