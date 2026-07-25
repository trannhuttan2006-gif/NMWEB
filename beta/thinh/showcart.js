
function dinhDangTien(soTien) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(soTien);
}

// HÀM TẠO HTML CHO MỘT SẢN PHẨM
// Tham số:
//   id       - mã sản phẩm
//   anhSP    - đường dẫn ảnh sản phẩm
//   tenSP    - tên sản phẩm
//   soLuong  - số lượng
//   donGia   - đơn giá (số nguyên, ví dụ: 85000)
function taoHtmlSanPham(id, anhSP, tenSP, soLuong, donGia) {

    // Tạo thẻ div bọc ngoài cho sản phẩm
    var divSanPham = document.createElement('div');
    divSanPham.className = 'item';
    divSanPham.dataset.id = id; // lưu id vào thẻ để xóa sau này

    //  Cột 1: Checkbox
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'item-check';
    divSanPham.appendChild(checkbox);

    //  Cột 2: Ảnh + Tên sản phẩm 
    var divTrai = document.createElement('div');
    divTrai.className = 'item-left';

    var anh = document.createElement('img');        
    anh.src = anhSP;
    anh.className = 'item-img';
    divTrai.appendChild(anh);

    var divTen = document.createElement('div');
    divTen.className = 'item-name';
    divTen.textContent = tenSP;
    divTrai.appendChild(divTen);

    divSanPham.appendChild(divTrai);

    // Cột 3: Đơn giá 
    var divDonGia = document.createElement('div');
    divDonGia.className = 'item-unit-price';
    divDonGia.textContent = dinhDangTien(donGia);
    divDonGia.dataset.dongia = donGia; // lưu số nguyên để tính toán sau này
    divSanPham.appendChild(divDonGia);

    // Cột 4: Số lượng
    var divSoLuong = document.createElement('div');
    divSoLuong.className = 'item-quantity';
    divSoLuong.textContent = soLuong;
    divSanPham.appendChild(divSoLuong);

    // Cột 5: Số tiền = đơn giá × số lượng 
    var divSoTien = document.createElement('div');
    divSoTien.className = 'item-total-price';
    divSoTien.textContent = dinhDangTien(donGia * soLuong);
    divSanPham.appendChild(divSoTien);

    //  Cột 6: Nút Xóa 
    var nutXoa = document.createElement('button');
    nutXoa.className = 'delete-item';
    nutXoa.textContent = 'Xóa';
    divSanPham.appendChild(nutXoa);

    return divSanPham;
}


function hienThiGioHang() {
    // Lấy thẻ .main-list để thêm sản phẩm vào
    var mainList = document.getElementsByClassName('main-list')[0];

    
    var danhSachSP = JSON.parse(localStorage.getItem('cart-item'));

    // Nếu giỏ hàng rỗng hoặc chưa có dữ liệu
    if (!danhSachSP || danhSachSP.length === 0) {
        var thongBao = document.createElement('div');
        thongBao.className = 'no-item';
        thongBao.textContent = 'Giỏ hàng của bạn đang trống.';
        mainList.appendChild(thongBao);
        return; // dừng hàm tại đây
    }

    // Duyệt qua từng sản phẩm và tạo HTML
    for (var i = 0; i < danhSachSP.length; i++) {
        var sp = danhSachSP[i];
        var htmlSP = taoHtmlSanPham(sp.id, sp.img, sp.name, sp.quantity, sp.price);
        mainList.appendChild(htmlSP);
    }
}



function capNhatTongTien() {

    let cacCheckboxDaChon = document.querySelectorAll('.item-check:checked');
    //lấy các sản phẩm trong cart đang được check để  thanh toán 

    let tongSoLuong = 0;
    let tongTien = 0;

    // Duyệt qua các sản phẩm được chọn để tính tổng
    for (let i = 0; i < cacCheckboxDaChon.length; i++) {
        const checkbox = cacCheckboxDaChon[i];

        //Lấy thẻ cha chứa sản phẩm có class item
        const divSanPham = checkbox.closest('.item');
        

        // Lấy số lượng từ cột .item-quantity
        let soLuong = parseInt(divSanPham.querySelector('.item-quantity').textContent);

        // Lấy đơn giá từ data-dongia (lưu số nguyên để tính toán chính xác)
        let donGia = parseFloat(divSanPham.querySelector('.item-unit-price').dataset.dongia);

        tongSoLuong += soLuong;
        tongTien = tongTien + (donGia * soLuong);
    }

    // Sau khi lặp qua hết các sản phẩm được checked thì cập nhật hiển thị lên trang(sL,total)
    document.getElementById('total-items-count').textContent = tongSoLuong;

    if (tongSoLuong > 0) {
        document.getElementById('total-price-value').textContent = dinhDangTien(tongTien);
    } else {
        document.getElementById('total-price-value').textContent = '0 đ';
    }
}


function xoaSanPham(e) {
    // Kiểm tra xem người dùng có bấm vào nút Xóa không
    if (!e.target.classList.contains('delete-item')) {
        return; // không phải nút Xóa thì bỏ qua
    }

    // Lấy thẻ .item cha chứa sản phẩm bị xóa
    var divSanPham = e.target.closest('.item');
    var idCanXoa = divSanPham.dataset.id;

    // Cập nhật lại localStorage (loại bỏ sản phẩm có id tương ứng)
    var danhSachSP = JSON.parse(localStorage.getItem('cart-item')) || [];
    var danhSachMoi = [];

    for (var i = 0; i < danhSachSP.length; i++) {
        if (String(danhSachSP[i].id) !== String(idCanXoa)) {
            danhSachMoi.push(danhSachSP[i]); // giữ lại các sản phẩm khác
        }
    }

    localStorage.setItem('cart-item', JSON.stringify(danhSachMoi));

    // Xóa thẻ sản phẩm khỏi giao diện
    divSanPham.remove();

    // Tính lại tổng tiền sau khi xóa
    capNhatTongTien();
}



// Hiển thị danh sách sản phẩm trong giỏ hàng
hienThiGioHang();

// Gán sự kiện cho khu vực .main-list
// (dùng delegation vì các sản phẩm được tạo động bằng JS)
var mainList = document.querySelector('.main-list');
var payment = document.querySelector('.buy-button');

// Khi tick/bỏ tick checkbox → cập nhật tổng tiền
mainList.addEventListener('change', function(e) {
    if (e.target.classList.contains('item-check')) {
        capNhatTongTien();
    }
});


mainList.addEventListener('click', xoaSanPham);

payment.addEventListener('click',() => {
    let hopLe = parseInt(document.getElementById('total-items-count').textContent);
    //Lấy số lượng sản phẩm đang checked 
    if(hopLe > 0 ) {//nếu sản phẩm đang checked > 0 . Thì xóa các sản phẩm đã thanh toán khỏi cart
        alert('Thanh toán thành công!');
        let cacSPDaChon = document.querySelectorAll('.item-check:checked');
        
        let id = [];
        for (let a = 0; a < cacSPDaChon.length; a++) {
         let sanPham = cacSPDaChon[a].closest('.item');
         id.push(sanPham.dataset.id);//lấy các id của các sản phẩm đang được checked 
         sanPham.remove();//xóa các phẩm đang đã được thanh toán khỏi cây DOM
        }
        let dsSP = JSON.parse(localStorage.getItem('cart-item')) || [];
        let dsMoi = [];
        //Cập nhật lại localStorage
    for (let  x = 0; x < dsSP.length; x++) {
        if (!isExist(dsSP[x].id,id)) {
            dsMoi.push(dsSP[x]); // giữ lại các sản phẩm khác các sản phẩm đã  thanh toán 
        }
    }

    localStorage.setItem('cart-item', JSON.stringify(dsMoi));
    capNhatTongTien();
    }else {
        alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán')
    }
})

function isExist(a, b) {

  for (let i = 0; i < b.length; i++) {
    if (b[i] === a) {
      return true; 
    }
  }
  
  return false; 
}
