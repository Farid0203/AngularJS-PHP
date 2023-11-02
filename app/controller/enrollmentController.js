app.controller('enrollmentController', function ($scope) {
    // Static array of courses with availability status
    var courses = [
        { subject_id: 1, name: 'Mathematics', max_capacity: 30, total_enrolled: 29, isEnrolled: null },
        { subject_id: 2, name: 'Computer Science', max_capacity: 25, total_enrolled: 24, isEnrolled: true },
        { subject_id: 3, name: 'Physics', max_capacity: 40, total_enrolled: 40, isEnrolled: false },
        { subject_id: 4, name: 'Tamil', max_capacity: 25, total_enrolled: 25, isEnrolled: null },
        { subject_id: 5, name: 'English', max_capacity: 20, total_enrolled: 19, isEnrolled: false },
        { subject_id: 6, name: 'Chemistry', max_capacity: 10, total_enrolled: 9, isEnrolled: true },
        { subject_id: 7, name: 'Botany', max_capacity: 10, total_enrolled: 8, isEnrolled: null },
        { subject_id: 8, name: 'Zoology', max_capacity: 10, total_enrolled: 8, isEnrolled: null }
    ];

    // name - Describes the name of the subject.
    // max_capacity - Denotes the maximum capacity available for that particular subject enrollment.
    // total_enrolled - Denotes the total number of enrolled students in this particular subject.
    // isEnrolled - Denotes the student enrolled or not.


    $scope.courses = courses;

        $scope.enrollStudent = function (course) {

            //check if the enrolled is true but total enrolled is less than max capacity
            if(course.isEnrolled && course.total_enrolled < course.max_capacity){   
                course.isEnrolled=false;
            }
            //if the enrolled is greater than or equal to the max capacity, then the enroll button is disabled and isEnrolled is set to true
            if(course.total_enrolled >= course.max_capacity){
                course.isEnrolled=true  ;
                course.enrollmentButtonDisabled = true; 
            }

            /*when isEnrolled is false and total enrolled is less than the max capacity, then allow to enroll student
            as soon as enrolled the button is disabled coz a student should enroll only one time to a subject*/
            if (!course.isEnrolled && course.total_enrolled < course.max_capacity) {
                
                course.total_enrolled++;
                course.isEnrolled=true;
    
                // Disable the button after enrollment
                course.enrollmentButtonDisabled = true;
            }
        };

        // if the course enrolled is greater than or equal to max capacity, the enroll button is disabled
        $scope.isEnrollmentFull = function (course) {
            return course.total_enrolled >= course.max_capacity;
        };
    

});