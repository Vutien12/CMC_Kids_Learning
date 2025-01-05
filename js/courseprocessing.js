 // Hàm lưu trữ thông tin khóa học vào localStorage khi nhấn "Đăng Ký Ngay"
 function storeCourseInfo(courseName, price) {
    localStorage.setItem('selectedCourseName', courseName);
    localStorage.setItem('selectedCoursePrice', price);
    localStorage.setItem('isPaymentComplete', 'false'); // Đặt trạng thái chưa thanh toán
}

document.addEventListener("DOMContentLoaded", function () {
    const courseCard = document.getElementById("courseCard");
    const isPaymentComplete = localStorage.getItem("isPaymentComplete");

    if (isPaymentComplete === "true") {
        // Ẩn phần course-card nếu đã thanh toán thành công
        courseCard.style.display = "none";
    } else {
        // Hiện phần course-card nếu chưa thanh toán
        courseCard.style.display = "block";
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');

    videoModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const videoUrl = button.getAttribute('data-video');
        videoFrame.src = videoUrl;
    });

    videoModal.addEventListener('hide.bs.modal', function() {
        videoFrame.src = "";
    });
    // Kiểm tra trạng thái thanh toán từ localStorage
    const isPaymentComplete = localStorage.getItem('isPaymentComplete') === 'true';

    // Tìm bài học bị khóa và xác định hành động dựa trên trạng thái thanh toán
    const lockedLesson = document.querySelector('.lesson-item[data-lesson="locked"]');
    if (isPaymentComplete) {
        // Nếu đã thanh toán, mở khóa bài học bằng cách đặt video modal
        lockedLesson.querySelector('.play-icon').dataset.bsTarget = '#videoModal';
        lockedLesson.querySelector('.play-icon').setAttribute('data-video');
    } else {
        // Nếu chưa thanh toán, giữ lại VIP modal
        lockedLesson.querySelector('.play-icon').dataset.bsTarget = '#vipModal';
    }

    // Sự kiện để mở video modal và tải video
    videoModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const videoUrl = button.getAttribute('data-video');
        videoFrame.src = videoUrl;
    });

    // Sự kiện để xóa video khi đóng modal
    videoModal.addEventListener('hide.bs.modal', function() {
        videoFrame.src = "";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const isPaymentComplete = localStorage.getItem('isPaymentComplete');

    if (isPaymentComplete === 'true') {
        // Thay thế liên kết VIP để mở video trực tiếp
        const vipItems = document.querySelectorAll("[data-bs-target='#vipModal']");

        vipItems.forEach(item => {
            const videoUrl = item.getAttribute('data-video');
            item.setAttribute('data-bs-target', '#videoModal');
            item.addEventListener('click', (e) => {
                document.getElementById('videoFrame').src = videoUrl;
            });
        });
    }
});
function redirectToExercises(courseName) {
    // Mã hóa tên khóa học để truyền qua URL
    const encodedCourseName = encodeURIComponent(courseName);
    // Chuyển hướng đến trang BTToan.html với tham số khóa học
    window.location.href = `Baitap.html?course=${encodedCourseName}`;
}