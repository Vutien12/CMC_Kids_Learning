const featuredCourseImages = {
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

// Load top 6 featured courses from the API based on enrollments
$.getJSON('https://localhost:7132/api/Course/list', function(response) {
    let courses = [];

    // Process response to get the top courses by enrollment count
    if (Array.isArray(response)) {
        courses = response;
    } else if (response.data && response.data.$values) {
        courses = response.data.$values;
    }

    // Sort courses by enrollments in descending order and take the top 6
    const topCourses = courses.sort((a, b) => b.numberEnrolled - a.numberEnrolled).slice(0, 6);

    // Display all top courses in a single carousel item
    const carouselInner = $('#featured-courses');
    let slideContent = `<div class="carousel-item active">
                            <div class="row text-center">`;

    topCourses.forEach(function(course) {
        // Define specific links for certain courses
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
            courseLink = 'Tiengviet.html';
        } else {
            courseLink = `course-details.html?id=${course.id}`;
        }

        const imageUrl = featuredCourseImages[course.id] || 'default-image.jpg';

        slideContent += `
            <div class="col-md-2 course-card2"> <!-- 6 items in a row -->
                <a href="${courseLink}">
                    <img src="${imageUrl}" class="d-block w-100 featured-course-image" alt="${course.name}">
                </a>
                <h5 class="mt-3 featured-course-name">${course.name}</h5>
                <span>Số người đăng ký: ${course.numberEnrolled}</span>
            </div>`;
    });

    slideContent += `</div></div>`;
    carouselInner.append(slideContent);
}).fail(function() {
    console.error("Failed to load featured courses.");
});
