document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://localhost:7132/api/News/list";

    // Lấy container để hiển thị tin tức
    const newsContainer = document.createElement("div");
    newsContainer.className = "container my-5";

    document.body.insertBefore(newsContainer, document.getElementById("footer-iframe"));

    // Gọi API và xử lý dữ liệu
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const newsList = data.data.$values;

            if (newsList.length === 0) {
                newsContainer.innerHTML = "<p>Không có tin tức nào để hiển thị.</p>";
                return;
            }

            // Duyệt qua từng bài viết và hiển thị
            newsList.forEach(news => {
                const newsRow = document.createElement("div");
                newsRow.className = "row mb-4 align-items-center"; // Bootstrap classes for alignment and spacing

                // Thêm hình ảnh phù hợp với id của bài viết
                let imageSrc = "";
                switch (news.id) {
                    case 1:
                        imageSrc = "https://images.tuyensinh247.com/picture/2018/0523/700-368-chung.png"; // Hình ảnh bài viết id 1
                        break;
                    case 2:
                        imageSrc = "https://i.ytimg.com/vi/R1KObPHKaCA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCN5in_woc-ohVxRDWJKt-JRDdk7Q"; // Hình ảnh bài viết id 2
                        break;
                    default:
                        imageSrc = "images/default.jpg"; // Hình ảnh mặc định
                        break;
                }

                newsRow.innerHTML = `
                    <div class="col-md-4">
                        <img src="${imageSrc}" class="img-fluid rounded" alt="${news.title}">
                    </div>
                    <div class="col-md-8">
                        <h5 class="card-title" style="font-size: 1.8rem; font-weight: bold;">${news.title}</h5>
                        <p class="card-text" style="font-size: 1.3rem;">${news.content}</p>
                        <p class="text-muted" style="font-size: 1.1rem;"><small>Đăng vào: ${new Date(news.createdAt).toLocaleDateString()}</small></p>
                    </div>
                `;

                newsContainer.appendChild(newsRow);
            });
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu từ API:", error);
            newsContainer.innerHTML = "<p>Không thể tải tin tức. Vui lòng thử lại sau.</p>";
        });
});
