-- 1. Tạo cơ sở dữ liệu
CREATE DATABASE online_learning2;
GO

USE online_learning2;
GO

-- 2. Tạo bảng app_user
CREATE TABLE app_user (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID người dùng
    username NVARCHAR(255) NOT NULL UNIQUE, -- Tên đăng nhập (phải duy nhất)
    password NVARCHAR(255) NOT NULL, -- Mật khẩu
    email NVARCHAR(255) NOT NULL UNIQUE, -- Địa chỉ email (phải duy nhất)
    name NVARCHAR(255) NOT NULL, -- Tên người dùng
    telephone NVARCHAR(15), -- Số điện thoại
    disabled BIT NOT NULL DEFAULT 0, -- Trạng thái kích hoạt (0: kích hoạt, 1: vô hiệu hóa)
    created_at DATETIME DEFAULT GETDATE(), -- Thời gian tạo tài khoản
    modified_at DATETIME NULL -- Thời gian sửa đổi tài khoản
);
GO

-- 3. Tạo bảng user_roles
CREATE TABLE user_roles (	
    user_id INT NOT NULL, -- ID người dùng
    role_name NVARCHAR(50) NOT NULL, -- Tên vai trò (e.g., 'student', 'instructor', 'admin')
    PRIMARY KEY (user_id, role_name), -- Khóa chính
    FOREIGN KEY (user_id) REFERENCES app_user(id) 
        ON DELETE CASCADE -- Xóa các role khi người dùng bị xóa
);
GO

-- 5. Tạo bảng courses
CREATE TABLE courses (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID khóa học
    name NVARCHAR(500) NOT NULL, -- Tên khóa học
    image NVARCHAR(255), -- Đường dẫn hình ảnh của khóa học
    description NVARCHAR(MAX), -- Mô tả khóa học
    price DECIMAL(10, 2) NOT NULL, -- Giá khóa học
    number_enrolled INT DEFAULT 0, -- Số lượng người tham gia khóa học
    category NVARCHAR(255), -- Danh mục của khóa học
    created_at DATETIME DEFAULT GETDATE(), -- Thời gian tạo khóa học
    modified_at DATETIME NULL, -- Thời gian sửa đổi khóa học
    modified_by INT NULL, -- ID người sửa đổi (admin)
    disabled BIT NOT NULL DEFAULT 0, -- Trạng thái khóa học (0: hoạt động, 1: vô hiệu hóa)
    FOREIGN KEY (modified_by) REFERENCES app_user(id) 
        ON DELETE SET NULL -- Đặt NULL khi người sửa đổi bị xóa
);
GO


-- 6. Tạo bảng lessons --- Bổ sung thêm bài tập (id, tiêu đề, nội dung bài tập, hạn nộp)
CREATE TABLE lessons (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID bài học
    course_id INT NOT NULL, -- ID khóa học
    title NVARCHAR(500) NOT NULL, -- Tiêu đề bài học
    description NVARCHAR(MAX), -- Mô tả bài học
    lesson_type NVARCHAR(50), -- Loại bài học
    created_at DATETIME NOT NULL DEFAULT GETDATE(), -- Thời gian tạo bài học -- Ngày tạo và ngày kết thúc
    is_disabled BIT DEFAULT 0, -- Trạng thái bài học (0: hoạt động, 1: vô hiệu hóa)
    FOREIGN KEY (course_id) REFERENCES courses(id) 
        ON DELETE CASCADE -- Xóa bài học khi khóa học bị xóa
);
GO

-- 7. Tạo bảng course_materials
CREATE TABLE course_materials (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID tài liệu
    lesson_id INT NOT NULL, -- ID bài học
    material_type NVARCHAR(50) NOT NULL CHECK (material_type IN ('video', 'document')), -- Loại tài liệu (video hoặc tài liệu)
    material_name NVARCHAR(255), -- Tên tài liệu
    material_link NVARCHAR(MAX), -- Đường dẫn tài liệu
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) 
        ON DELETE CASCADE -- Xóa tài liệu khi bài học bị xóa
);
GO

-- 8. Tạo bảng course_reviews
CREATE TABLE course_reviews (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID đánh giá khóa học
    user_id INT NOT NULL, -- ID người dùng
    course_id INT NOT NULL, -- ID khóa học
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- Đánh giá từ 1 đến 5
    review_text NVARCHAR(MAX), -- Nội dung đánh giá
    created_at DATETIME NOT NULL DEFAULT GETDATE(), -- Thời gian tạo đánh giá
    FOREIGN KEY (course_id) REFERENCES courses(id) 
        ON DELETE CASCADE -- Xóa đánh giá khi khóa học bị xóa
);
GO
-- Tạo bảng enrollments với khóa ngoại đến bảng payments
CREATE TABLE enrollments (
    course_id INT NOT NULL, -- ID khóa học
    price DECIMAL(10, 2) NOT NULL, -- Giá tham gia khóa học
    payment_id INT NULL, -- ID thanh toán, có thể để trống
    enrolled_at DATETIME NOT NULL DEFAULT GETDATE(), -- Thời gian đăng ký
    PRIMARY KEY (course_id), -- Khóa chính
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE, -- Xóa đăng ký khi khóa học bị xóa
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE NO ACTION -- Không tự động xóa đăng ký khi thanh toán bị xóa
);
GO

-- Tạo bảng payments
CREATE TABLE payments (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID thanh toán
    user_id INT NOT NULL, -- ID người dùng
    amount DECIMAL(10, 2) NOT NULL, -- Số tiền thanh toán
    payment_date DATETIME NOT NULL DEFAULT GETDATE(), -- Thời gian thanh toán
    payment_method NVARCHAR(50), -- Phương thức thanh toán  
    description NVARCHAR(500) -- Mô tả thanh toán
);
GO


-- 11. Sửa bảng assignments để liên kết nhiều bài tập với cùng 1 khóa học
CREATE TABLE assignments (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID bài tập
    course_id INT NOT NULL, -- ID khóa học liên kết
    title NVARCHAR(255) NOT NULL, -- Tiêu đề bài tập
    content NVARCHAR(MAX) NOT NULL, -- Nội dung bài tập
    assigned_date DATETIME NOT NULL, -- Ngày giao bài
    due_date DATETIME NOT NULL, -- Hạn nộp bài
    FOREIGN KEY (course_id) REFERENCES courses(id) 
        ON DELETE CASCADE -- Xóa bài tập khi khóa học bị xóa
);
GO



--12. Tạo bảng assignment_submissions
CREATE TABLE assignment_submissions (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID nộp bài
    assignment_id INT NOT NULL, -- ID bài tập
    user_id INT NOT NULL, -- ID người dùng (học viên)
    submission_content NVARCHAR(MAX), -- Nội dung nộp bài
    submission_date DATETIME NOT NULL DEFAULT GETDATE(), -- Ngày nộp bài
    grade DECIMAL(5,2) NULL, -- Điểm số
    feedback NVARCHAR(MAX) NULL, -- Phản hồi từ giảng viên
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) 
        ON DELETE CASCADE, -- Xóa nộp bài khi bài tập bị xóa
    FOREIGN KEY (user_id) REFERENCES app_user(id) 
        ON DELETE CASCADE -- Xóa nộp bài khi người dùng bị xóa
);
GO

-- 13. Tạo bảng news
CREATE TABLE news (
    id INT IDENTITY(1,1) PRIMARY KEY, -- ID tin tức
    title NVARCHAR(255) NOT NULL, -- Tiêu đề tin tức
    content NVARCHAR(MAX) NOT NULL, -- Nội dung tin tức
    image NVARCHAR(255), -- Đường dẫn hình ảnh tin tức
    created_at DATETIME DEFAULT GETDATE(), -- Thời gian tạo tin tức
    updated_at DATETIME NULL -- Thời gian cập nhật tin tức
);
GO


select * from app_user
-- 1. Thêm dữ liệu mẫu vào bảng app_user
INSERT INTO app_user (username, password, email, name, telephone)
VALUES 
    (N'nguoidung1', N'password123', N'nguoidung1@email.com', N'Vũ Văn Tiến', N'0912345678'),
    (N'nguoidung2', N'password456', N'nguoidung2@email.com', N'Vũ Thanh Toàn', N'0987654321'),
	(N'nguoidung3', N'password789', N'nguoidung3@email.com', N'Nguyễn Văn A', N'0911122233'),
    (N'nguoidung4', N'password012', N'nguoidung4@email.com', N'Nguyễn Văn B', N'0922233344'),
    (N'nguoidung5', N'password345', N'nguoidung5@email.com', N'Trần Thị C', N'0933344455'),
    (N'nguoidung6', N'password678', N'nguoidung6@email.com', N'Trần Văn A', N'0944455566'),
    (N'nguoidung7', N'password901', N'nguoidung7@email.com', N'Võ Thanh T', N'0955566677');

select * from user_roles
-- 2. Thêm dữ liệu mẫu vào bảng user_roles
INSERT INTO user_roles (user_id, role_name)
VALUES 
    (1, N'student'),
    (2, N'instructor'),
    (3, N'instructor'),
    (4, N'student'),
    (5, N'student'),
    (6, N'instructor'),
    (7, N'student'),
    (7, N'admin');

select * from courses
-- 3. Thêm dữ liệu mẫu vào bảng courses
INSERT INTO courses (name, image, description, price, category, number_enrolled)
VALUES 
      (N'Học Tốt Toán 1', 'image/Hoctottoan1.jpg', N'Hệ thống kiến thức trực quan giúp con tự tin học môn Toán.', 349.000, N'Toán', 45),
      (N'Toán Nâng Cao 1', 'Toannangcao.jpg', N'Chủ đề và dạng toán với cấp độ khó cao, giúp học sinh nhạy bén và phát triển não bộ.', 399.000, N'Toán', 50),
	  (N'Toán IQ Singapore 1', 'Toansing1.jpg', N'Phát triển tư duy và nâng cao chỉ số IQ cho trẻ em qua các chủ đề đa dạng.', 449.000, N'Toán', 38),
	  (N'Tiếng anh 1', 'English1.jpg', N'Chương trình tiếng anh quốc gia giúp các bé làm quen với Tiếng Anh lớp 1 của bộ Giáo dục và Đào tạo', 449.000, N'Tiếng anh', 70),
	  (N'Phonics', 'Phonics.jpg', N'Khóa học luyện phát âm chuẩn giúp cho bé tư tin giao tiếp trên hành trình học tiếng Anh.', 299.000, N'Tiếng anh', 75),
	  (N'English Cambridge', 'English+.jpg', N'cung cấp cho các em học sinh những kiến thức trọng tâm đầy đủ để chuẩn bị cho kì thi Cambridge English.', 449.000, N'Tiếng anh', 50),
	  (N'Tiếng Việt 1 - CD', 'Tiengviet.jpg', N'Bám sát SGK mới của bộ Cánh Diều. Hình ảnh sinh động và mang những bài học cuộc sống vào giảng dạy', 399.000, N'Tiếng việt', 20),
	  (N'Tiếng Việt 1 - KNTT', 'TiengVietKNTT.jpg', N'Phát triển nhanh về kĩ năng giao tiếp, khả năng quan sát, tưởng tượng, suy luận. Phát triển tư duy ngôn ngữ cho học sinh. ', 399.000, N'Tiếng việt', 30),
	  (N'Tiếng Việt 1 - CTST', 'TiengVietCTST.jpg', N'Khám phá các con chữ đầu đời thông qua các video bài học âm và vần, hình ảnh sinh động, thu hút học sinh.', 399.000, N'Tiếng việt', 25),
	  (N'Lập trình Scratch', 'Ltrinh.jpg', N'Tiếp cận ngôn ngữ lập trình thông qua bài giảng trực quan và chi tiết. Bài giảng hướng dẫn cụ thể giúp trẻ hiểu bản chất và vận dụng vào các dự án cá nhân. ', 399.000, N'Steam', 45),
	  (N'Lập trình Scratch Nâng Cao', 'LtrinhNC.jpg', N'Thông qua các dự án lập trình nâng cao giúp trẻ tăng khả năng tư tin về bản thân và hiểu bản chất các câu lệnh dễ và khó, vận dụng cao vào các dự án lập trình cá nhân.', 449.000, N'Steam', 40),
	  (N'Lập trình Python', 'Python.jpg', N'Chuyển các ngôn ngữ lập trình Python trở nên trực quan sinh động và gần gũi với học sinh tiểu học. Hình thành ước mơ lập trình viên từ sớm cho học sinh.', 399.000, N'Steam', 23);
UPDATE Courses
SET 
    Name = N'Tiếng Việt 1 - KNTT',
    Image = 'TiengVietCTST.jpg',
    Description = N'Khám phá các con chữ đầu đời thông qua các video bài học âm và vần, hình ảnh sinh động, thu hút học sinh.',
    Price = 399.000,
    Category = N'Tiếng việt'
WHERE
    Id = 9; -- Thay @CourseId bằng ID thực tế của khóa học bạn muốn cập nhật

--------------------------------------------Chưa thêm dữ liệu
select * from lessons
-- 5. Thêm dữ liệu mẫu vào bảng lessons
INSERT INTO lessons (course_id, title, description, lesson_type)
VALUES 
    (1, N'Làm Quen Với Một Số Hình', N'Vị trí', N'video');


-- 6. Thêm dữ liệu mẫu vào bảng course_materials
INSERT INTO course_materials (lesson_id, material_type, material_name, material_link)
VALUES 
    (1, N'video', N'Bài giảng 1: SQL là gì?', N'videos/sql_intro.mp4'),
    (2, N'document', N'Tài liệu về cấu trúc dữ liệu', N'docs/data_structures_java.pdf');

select * from course_reviews
-- 7. Thêm dữ liệu mẫu vào bảng course_reviews
INSERT INTO course_reviews (user_id, course_id, rating, review_text)
VALUES 
    (1, 1, 5, N'Web này hay quá, thiết kế bài giảng trực quan, thầy cô giảng bài cuốn hút, bé Phúc con tôi rất thích học trên app này.'),
    (4, 2, 5, N'Web rất tốt. Sau mỗi bài có phần luyện tập giúp con tôi có thể ôn lại kiến thức bài giảng đã học và nhớ lâu hơn..'),
	(2, 5, 5, N'Con tôi rất thích học các khoá học trên App này, bé chủ động học và hứng thú học. Tôi rất tin tưởng App.'),
	(5, 3, 5, N'Con thích học Toán IQ Singapor trên App, Lập trình Scratch nữa, rất nhiều dự án thú vị. Các bạn đăng kí học cùng mình nha. '),
	(6, 4, 5, N'Con rất thích học trên App này vì video bài giảng là các hình ảnh hoạt hình vui nhộn, giúp con dễ nhớ bài hơn rất nhiều');
UPDATE course_reviews
SET 
    user_id = N'2',
    course_id = '5',
    rating = 5,
    review_text = N'Con tôi rất thích học các khoá học trên App này, bé chủ động học và hứng thú học với các bài giảng. Tôi rất tin tưởng web'
WHERE
    Id = 3; -- Thay @CourseId bằng ID thực tế của khóa học bạn muốn cập nhật
-- 8. Thêm dữ liệu mẫu vào bảng payments
INSERT INTO payments (user_id, amount, payment_method, description)
VALUES 
    (1, 349000, N'Credit Card', N'Học Tốt Toán Lớp 1');
select * from payments

UPDATE enrollments
SET payment_id = 1
WHERE course_id = 1;

-- 9. Thêm dữ liệu mẫu vào bảng enrollments
INSERT INTO enrollments (course_id, price)
VALUES 
    (1, 349000);
select * from enrollments
--------------------------------------------------------------------------Chưa thêm dữ liệu
-- 10. Thêm dữ liệu mẫu vào bảng assignments
INSERT INTO assignments (course_id, title, content, assigned_date, due_date)
VALUES 
    (1, N'Bài tập SQL', N'Viết câu lệnh SQL để tạo bảng và chèn dữ liệu.', '2024-11-09','2024-11-10'),
    (2, N'Bài tập Java', N'Viết chương trình Java để quản lý sinh viên.','2024-11-10','2024-11-15');
UPDATE assignments
SET 
    course_id = 7
WHERE
    Id = 5; -- Thay @CourseId bằng ID thực tế của khóa học bạn muốn cập nhật
select * from assignments
INSERT INTO assignments (course_id, title, content, assigned_date, due_date)
VALUES 
    (7, N'Nghe và đọc lại các phát âm từ của bài 1 và bài 2', N'Hướng dẫn cho bé cách nhận biết và cách đọc chuẩn', '2024-11-09','2024-11-10'),
	(7, N'Cho trẻ nghe lại câu chuyện Hai con dê', N'Từ đó ba mẹ và bé hãy rút ra bài học trong câu chuyện', '2024-11-09','2024-11-10');
-- 11. Thêm dữ liệu mẫu vào bảng assignment_submissions
INSERT INTO assignment_submissions (assignment_id, user_id, submission_content, grade, feedback)
VALUES 
    (1, 1, N'Tôi đã hoàn thành bài tập tạo bảng.', 9.5, N'Bài làm tốt, cần thêm chú thích cho các cột.'),
    (2, 2, N'Chương trình quản lý sinh viên đã hoàn thành.', 8.0, N'Cần tối ưu mã nguồn.');

-- 12. Thêm dữ liệu mẫu vào bảng news
INSERT INTO news (title, content, image)
VALUES 
    (N'Chào mừng ngày 20 tháng 11', N'Giảm giá 30% cho tất cả khóa học trong ngày 20 tháng 11.', N'images/new_course.jpg'),
    (N'Chương trình giảm giá tháng 11', N'Giảm giá 20% cho tất cả các khóa học trong tháng 11.', N'images/discount.jpg');
