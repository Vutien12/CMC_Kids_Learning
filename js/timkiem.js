async function searchCourses() {
    const searchTerm = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    const adCarousel = document.getElementById('adCarousel');
  
    try {
        const response = await fetch('https://localhost:7132/api/Course/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        });
  
        if (!response.ok) {
            throw new Error('Không thể kết nối tới API.');
        }
  
        const data = await response.json();
        displayResults(data.data.$values);
  
        adCarousel.classList.add('hide-ad'); // Làm mờ quảng cáo
        resultsDiv.style.display = 'flex'; // Hiển thị kết quả
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        resultsDiv.innerHTML = '<p>Lỗi khi tìm kiếm. Vui lòng thử lại.</p>';
        resultsDiv.style.display = 'block';
    }
  }
  
  function displayResults(courses) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
  
    if (courses.length === 0) {
        resultsDiv.innerHTML = '<p>Không tìm thấy khóa học nào.</p>';
        return;
    }
  
    courses.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-item';
        courseDiv.innerHTML = `
            <h3>${course.name}</h3>
        `;
  
        // Thêm sự kiện click để chuyển hướng tới trang chi tiết
        courseDiv.addEventListener('click', () => {
            let courseLink;
            if (course.id === 1) {
                courseLink = 'Toan1.html';
            } else if (course.id === 2) {
                courseLink = 'ToanNC.html';
            } else if (course.id === 4) {
                courseLink = 'English1.html';
            } else if (course.id === 5) {
                courseLink = 'Phonics.html';
            } else if (course.id === 7) {
                courseLink = 'Tiengviet1.html';
            } else if (course.id === 10) {
                courseLink = 'Laptrinh.html';
            } else {
                courseLink = 'DefaultCourse.html'; // Đường dẫn mặc định
            }
  
            window.location.href = courseLink; // Chuyển hướng tới trang chi tiết
        });
  
        resultsDiv.appendChild(courseDiv);
    });
  }
  
  document.addEventListener('click', function (event) {
    const resultsDiv = document.getElementById('results');
    const searchInput = document.getElementById('searchInput');
    const adCarousel = document.getElementById('adCarousel');
  
    // Kiểm tra nếu click không nằm trong vùng kết quả và ô tìm kiếm
    if (!resultsDiv.contains(event.target) && event.target !== searchInput) {
        resultsDiv.style.display = 'none'; // Ẩn kết quả
        adCarousel.classList.remove('hide-ad'); // Hiển thị lại quảng cáo nếu có
    }
  });
  