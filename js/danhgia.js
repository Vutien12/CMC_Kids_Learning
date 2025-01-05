let currentPage = 0; // Biến lưu trang hiện tại
const reviewsPerPage = 4; // Số lượng đánh giá trên mỗi trang
let totalPages = 1; // Tổng số trang
let intervalId; // Biến để lưu ID của bộ đếm thời gian chuyển trang tự động

// Hàm lấy dữ liệu đánh giá và người dùng từ API
async function fetchReviews() {
  try {
    // Gọi API lấy danh sách đánh giá
    const response = await fetch('https://localhost:7132/api/CourseReview/list');
    const reviewData = await response.json();
    // Gọi API lấy danh sách người dùng
    const userResponse = await fetch('https://localhost:7132/api/AppUser/list');
    const userData = await userResponse.json();

    // Tạo một Map để lưu tên và ảnh của người dùng dựa trên userId
    const userMap = new Map();
    userData.data.$values.forEach(user => {
      const profilePictures = {
        1: 'https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/459/anh-avatar-fb-5.jpg',
        2: 'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-51-28-16-28-03.jpg',
        4: 'https://file.hstatic.net/200000503583/file/tao-dang-chup-anh-nam__23__335b6560a97b432f9816a5a9784c98dc.jpg',
        5: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/hinh-anh-avatar-ca-tinh-nu-6.jpg',
        6: 'https://i.pinimg.com/550x/a8/82/ed/a882ed74600147371beee3d8bb53fdca.jpg',
      };
      userMap.set(user.id, {
        name: user.name,
        profilePicture: profilePictures[user.id] || 'default-profile.jpg'
      });
    });

    const reviews = reviewData.data.$values; // Lấy danh sách đánh giá
    totalPages = reviews.length - reviewsPerPage + 1; // Tính tổng số trang

    // Tạo các chấm chuyển trang
    function createPaginationDots() {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = ''; // Xóa các chấm cũ
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => goToPage(i)); // Gán sự kiện click cho mỗi chấm
        pagination.appendChild(dot);
      }
      updatePaginationDots(); // Cập nhật chấm đang hoạt động
    }

    // Cập nhật trạng thái chấm hiện tại
    function updatePaginationDots() {
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPage);
      });
    }

    // Hiển thị các đánh giá dựa trên trang hiện tại
    function displayReviews() {
      const reviewContainer = document.getElementById('reviews');
      reviewContainer.innerHTML = ''; // Xóa các đánh giá cũ
      const start = currentPage;
      const end = start + reviewsPerPage;

      reviews.slice(start, end).forEach(review => {
        const user = userMap.get(review.userId) || { name: 'Người dùng ẩn danh', profilePicture: 'default-profile.jpg' };
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card';
        reviewElement.innerHTML = `
          <img src="${user.profilePicture}" alt="Profile Picture" class="profile-picture">
          <div class="name">${user.name}</div>
          <div class="reviewText">${review.reviewText}</div>
        `;
        reviewContainer.appendChild(reviewElement);
      });
      updatePaginationDots(); // Cập nhật chấm hiện tại
    }

    // Chuyển đến trang được chỉ định khi người dùng nhấp vào chấm
    function goToPage(page) {
      currentPage = page;
      displayReviews();
      resetAutoSwitch(); // Đặt lại bộ đếm thời gian tự động chuyển trang
    }

    // Tự động chuyển trang sau mỗi 5 giây
    function autoPageSwitch() {
      displayReviews();
      currentPage = (currentPage + 1) % totalPages;
    }

    // Đặt lại bộ đếm thời gian tự động chuyển trang
    function resetAutoSwitch() {
      clearInterval(intervalId);
      intervalId = setInterval(autoPageSwitch, 2500);
    }

    createPaginationDots(); // Tạo chấm chuyển trang
    displayReviews(); // Hiển thị đánh giá đầu tiên
    intervalId = setInterval(autoPageSwitch, 2500); // Bắt đầu tự động chuyển trang
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error); // Hiển thị lỗi nếu có
  }
}

// Gọi hàm fetchReviews khi tải trang
fetchReviews();