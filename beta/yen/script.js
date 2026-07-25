function sortProducts(){

    const option = document.getElementById("sortProduct").value;

    const productList = document.getElementById("productList");

    const products = Array.from(productList.getElementsByClassName("product-card"));

    products.sort(function(a,b){

        let nameA = a.querySelector("h3").innerText.toLowerCase();
        let nameB = b.querySelector("h3").innerText.toLowerCase();

        let priceA = parseInt(
            a.querySelector(".price").innerText
            .replace(/\./g,"")
            .replace("đ","")
        );

        let priceB = parseInt(
            b.querySelector(".price").innerText
            .replace(/\./g,"")
            .replace("đ","")
        );

        switch(option){

            case "low":
                return priceA-priceB;

            case "high":
                return priceB-priceA;

            case "az":
                return nameA.localeCompare(nameB);

            case "za":
                return nameB.localeCompare(nameA);

            default:
                return 0;

        }

    });

    productList.innerHTML = "";

    products.forEach(function(product){

        productList.appendChild(product);

    });

}
function chonMua(ten, gia){

    alert(
        "Đã thêm vào giỏ hàng!\n\n" +
        "Sản phẩm: " + ten +
        "\nGiá: " + gia.toLocaleString() + "đ"
    );

}
