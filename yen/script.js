function sortProducts() {
    const option = document.getElementById("sortProduct").value;
    const productList = document.getElementById("productList");

    const products = Array.from(
        productList.getElementsByClassName("product-card")
    );

    products.sort(function (a, b) {
        const nameA = a.querySelector("h3").textContent.trim().toLowerCase();
        const nameB = b.querySelector("h3").textContent.trim().toLowerCase();

        const priceA = parseInt(
            a.querySelector(".price").textContent.replace(/\D/g, "")
        );
        const priceB = parseInt(
            b.querySelector(".price").textContent.replace(/\D/g, "")
        );
        switch (option) {
            case "low":
                return priceA - priceB;
            case "high":
                return priceB - priceA;
            case "az":
                return nameA.localeCompare(nameB, "vi");
            case "za":
                return nameB.localeCompare(nameA, "vi");
            default:
                return 0;
        }
    });

    while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
    }
    for (let i = 0; i < products.length; i++) {
        productList.appendChild(products[i]);
    }
}
