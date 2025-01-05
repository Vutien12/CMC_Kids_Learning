document.addEventListener("DOMContentLoaded", function() {
    // Lấy giá trị số tiền từ localStorage
    const amount = localStorage.getItem('selectedCoursePrice') || "0";
    console.log("Amount from localStorage:", amount);  // Kiểm tra giá trị

    // Hiển thị giá trị trong trường Số Tiền
    document.getElementById('amount').value = `${amount} VND`;

    // Gọi hàm generateQRCode() để tự động tạo mã QR
    generateQRCode(amount);
});

function generateQRCode(amount) {
    // Loại bỏ các ký tự không phải là số
    amount = amount.replace(/[^\d]/g, '');

    // Kiểm tra số tiền
    if (amount) {
        // Xóa mã QR cũ nếu có
        document.getElementById('qrcode').innerHTML = "";

        // Tạo mã QR với nội dung chỉ là số tiền
        new QRCode(document.getElementById("qrcode"), {
            text: amount, // chỉ mã hóa số tiền
            width: 250,
            height: 250
        });
    } else {
        alert("Số tiền không hợp lệ. Vui lòng kiểm tra lại.");
    }
}

function completePayment() {
    // Xử lý logic thanh toán ở đây
    localStorage.setItem('isPaymentComplete', 'true'); // Đánh dấu thanh toán hoàn tất

    // Chuyển người dùng về trang xác nhận hoặc trang chủ
    window.location.href = 'Home.html';
}