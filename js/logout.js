document.addEventListener("DOMContentLoaded", function() {
    // Check if the user is logged in by looking for their phone number in localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loginLink = document.getElementById('loginLink');
    const logoutButton = document.getElementById('logoutButton');

    if (loggedInUser) {
        // Hiển thị tên người dùng thay cho "Đăng nhập"
        loginLink.innerHTML = `<i class="bi bi-person-circle"></i> ${loggedInUser}`;
        loginLink.href = "#"; // Thay đổi hành động của link
        logoutButton.style.display = 'block'; // Hiển thị nút đăng xuất
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem('loggedInUser');
            window.location.reload();
        });
    } else {
        // Nếu không có người dùng đăng nhập, hiển thị nút đăng nhập bình thường
        loginLink.innerHTML = `<i class="bi bi-person-circle"></i> Đăng nhập`;
        loginLink.href = "Login.html"; // Đảm bảo rằng link đến trang đăng nhập
        logoutButton.style.display = 'none'; // Ẩn nút đăng xuất
    }
});

// Tự động điều chỉnh chiều cao của iframe theo nội dung
document.getElementById("footer-iframe").onload = function() {
    const iframe = document.getElementById("footer-iframe");
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
};
document.addEventListener("DOMContentLoaded", function() {
    const iframe = document.getElementById("footer-iframe");

    // Hàm điều chỉnh chiều cao của iframe
    function adjustIframeHeight() {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
    }

    // Đảm bảo iframe điều chỉnh chiều cao khi nội dung thay đổi hoặc khi kích thước màn hình thay đổi
    iframe.onload = adjustIframeHeight;
    window.addEventListener("resize", adjustIframeHeight);
});
