const courseImages = {
    1: '../Images/Hoctottoan1.jpg',
    2: '../Images/Toannangcao.jpg',
    3: '../Images/toansing.jpg',
    4: '../Images/english1.jpg',
    5: '../Images/phonics1.jpg',
    6: '../Images/english+.jpg',
    7: '../Images/TiengViet.jpg',
    8: '../Images/TiengVietKNTT.jpg',
    9: '../Images/TiengVietCTST.jpg',
    10: '../Images/Ltrinh.jpg',
    11: '../Images/LtrinhNC.jpg',
    12: '../Images/Python.jpg'

};

// Load courses from the API
$.getJSON('https://localhost:7132/api/Course/list', function(response) {
    const mathCourses = [];
    const englishCourses = [];
    const grammarCourses = [];
    const steamCourses = [];

    // Check if response is in the expected format
    if (Array.isArray(response)) {
        response.forEach(function(course) {
            const imageUrl = courseImages[course.id] || 'default-image.jpg';

            if (course.category === 'Toán') {
                mathCourses.push({ ...course, imageUrl });
            } else if (course.category === 'Tiếng anh') {
                englishCourses.push({ ...course, imageUrl });
            } else if (course.category === 'Tiếng việt') {
                grammarCourses.push({ ...course, imageUrl });
            } else if (course.category === 'Steam') {
                steamCourses.push({ ...course, imageUrl });
            }
        });
    } else if (response.data && response.data.$values) {
        // Process the response if it contains data in the expected structure
        $.each(response.data.$values, function(index, course) {
            const imageUrl = courseImages[course.id] || 'default-image.jpg';

            if (course.category === 'Toán') {
                mathCourses.push({ ...course, imageUrl });
            } else if (course.category === 'Tiếng anh') {
                englishCourses.push({ ...course, imageUrl });
            } else if (course.category === 'Tiếng việt') {
                grammarCourses.push({ ...course, imageUrl });
            } else if (course.category === 'Steam') {
                steamCourses.push({ ...course, imageUrl });
            }
        });
    }

    // Function to display courses
    function displayCourses(courses, containerId) {
        const courseContainer = $('<div class="row mb-5"></div>');
        courses.forEach(function(course) {
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
                courseLink = `course-details.html?id=${course.id}`;
            }

            courseContainer.append(`
                <div class="col-lg-4 col-md-6 col-12">
                    <div class="course-card p-3">
                        <a href="${courseLink}">
                            <img src="${course.imageUrl}" alt="${course.name}" class="course-image">
                        </a>
                        <div class="course-tag mt-2 text-muted">Loại: ${course.category || 'Bài giảng'}</div>
                        <h5 class="course-title">${course.name}</h5>
                        <p class="course-description">${course.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span class="course-price">${parseFloat(course.price).toFixed(3)} VND</span>
                            <span>${course.numberEnrolled} Enrolled</span>
                        </div>
                    </div>
                </div>
            `);
        });
        $(`#${containerId}`).append(courseContainer);
    }

    // Display math and English courses if they exist
    if (mathCourses.length > 0) {
        displayCourses(mathCourses, 'math-courses'); // Thay đổi đây
    }
    if (englishCourses.length > 0) {
        displayCourses(englishCourses, 'english-courses'); // Thay đổi đây
    }
    if (grammarCourses.length > 0) {
        displayCourses(grammarCourses, 'grammar-courses'); // Thay đổi đây
    }
    if (steamCourses.length > 0) {
        displayCourses(steamCourses, 'steam-courses'); // Thay đổi đây
    }
}).fail(function() {
    $('#course-list').append('<p>Failed to load courses. Please try again later.</p>');
});
