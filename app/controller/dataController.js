app.controller('dataController', ['$scope', '$location', '$http', '$rootScope', '$timeout', function ($scope, $location, $http, $rootScope, $timeout) {

  $scope.showModal = false;


  $scope.studentComponent;

  $scope.showDetails = function (student) {
    $scope.studentComponent = student;
  }


  var adminId = $rootScope.loggedAdminId;
  var url = 'http://localhost/AngularJS_Unit2_6/API/Api.php/getAllStudentsByAdminId?adminId=' + adminId;

  $scope.initFunction = function () {
    $http.get(url)
      .then(function (response) {
        // Handle the successful response here
        $scope.studentsData = response.data;
        console.log($scope.studentsData);
      })
      .catch(function (error) {
        // Handle any errors that occur during the request
        console.error(error);
      });
  }


  $scope.$watch('studentsData', function (newData, oldData) {
    if (newData && newData !== oldData) {
      // Initialize DataTables after data is loaded 
      initializeDataTable();
    }
  });


  var dataTable;

  function initializeDataTable() {
    $(document).ready(function () {
      // Check if the DataTable instance already exists
      if (!$.fn.DataTable.isDataTable('#example')) {


        // Initialize the DataTable
        dataTable = $('#example').DataTable({
          "dom": '<"custom-top">rt<"custom-bottom"ilp>',
          "paging": true,
          "pagingType": "simple_numbers",
          "language": {
            "info": "_START_-_END_ of _TOTAL_",
            "sLengthMenu": "Rows per page: _MENU_",
            "paginate": {
              "previous": "<",
              "next": "> "
            },
          },
          "pageLength": 10,
          "drawCallback": function (settings) {
            var api = this.api();
            var pageInfo = api.page.info();
            var paginationDiv = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');

            // Create a custom content for the pagination span
            var customPagination = '<span class="custom-pagination">' + (pageInfo.page + 1) + '/' + pageInfo.pages + '</span>';


            // Replace the content of the existing span with the custom content
            paginationDiv.find('span').replaceWith(customPagination);
          },
          "lengthMenu": [5, 10, 25, 50, 100],
          "columnDefs": [
            { "orderable": false, "targets": [0, 3, 4, 5, 6, 7, 8] } // Disable sorting for specified columns
          ],
          "order": [[1, 'asc']]
        });
      }

    });
  };



  // $('#customLengthDropdown').on('change', function () {
  //   table.page.len($(this).val()).draw();
  // });

  $('#customSearchInput').on('keyup', function () {
    var customSearchValue = $(this).val();
    dataTable.search(customSearchValue).draw();

  });




  $scope.onUpdate = function () {

    $scope.initFunction();
    $scope.$apply();

    $('#editModal').modal('hide');

  }





  $scope.studentPage = function () {
    $location.path('/studentRegistration');
    $location.replace();
  }


  $scope.editStudent = function (student) {
    $scope.selectedStudent = angular.copy(student);

    $rootScope.$broadcast('editStudent', $scope.selectedStudent);

    $jq('#editModal').modal('show'); // Show the edit modal



  };

  $scope.deleteStudent = function (studentId,studentName) {
    $http({
      method: 'DELETE',
      url: 'http://localhost/AngularJS_Unit2_6/API/Api.php',
      params: {
        id: studentId,
        name: studentName
    }
    }).then(function (response) {
      // Success callback
      console.log('Delete successful:', response.data);
      // Do something if needed
    }, function (error) {
      // Error callback
      console.error('Delete failed:', error.data);
      // Handle errors or show a message to the user
    });


  }

  // $scope.updateStudentData = function (updatedStudent) {
  //   // Implement logic to update the student data
  //   // For example, you can update the student in $scope.studentData
  //   // Find the student by ID and update its properties
  //   // Then, close the edit modal  
  //   $('#editModal').modal('hide');
  // };

}]);



app
  .filter('calculateAge', function () {
    return function (birthdate) {
      if (birthdate) {
        var today = new Date();
        var birthdateDate = new Date(birthdate);
        var age = today.getFullYear() - birthdateDate.getFullYear();
        var monthDiff = today.getMonth() - birthdateDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
          age--;
        }

        return age;
      } else {
        return null;
      }
    };
  });

app.component('viewModal', {
  templateUrl: 'app/view/view-modal.html',
  bindings: {
    student: '<'// Use one-way binding with '<' for read-only data
  },
  controller: 'ViewController',
  controllerAs: '$ctrl'
});

// app.component('editModal', {
//   templateUrl: 'app/view/edit-modal.html',

//   bindings: {
//     student: '=',
//     onUpdate: '&'
//   },
//   controller: 'EditController',
//   controllerAs: '$ctrl'
// });


app
  .filter('dateFormat', function () {
    return function (input) {
      if (input && input.length === 3) {
        var months = [
          'Jan', 'Feb', 'Mar', 'Apr',
          'May', 'Jun', 'Jul', 'Aug',
          'Sep', 'Oct', 'Nov', 'Dec'
        ];

        var year = input[0];
        var month = months[input[1] - 1];
        var day = input[2];

        return month + ' ' + day + ', ' + year;
      }
      return input;
    };
  });

app.controller('ViewController', function ($scope, $http) {

  var ctrl = this;
  ctrl.student = null;
  ctrl.generatePDF = function (student) {
    //concatenate first name and last name for better readablity in pdf 
    const fullName = student.firstName + ' ' + student.lastName;

    //student details in html format
    const studentDetailsHTML = `
        <div style="text-align: center;">
            <h1>Student Registration Details</h1>
        </div>
        <div>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Date of Birth:</strong> ${student.dateOfBirth}</p>
            <p><strong>Phone Number:</strong> ${student.phoneNumber}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Date of Birth:</strong> ${student.dateOfBirth}</p>
            <p><strong>Father Name:</strong> ${student.fatherName}</p>
            <p><strong>Mother Name:</strong> ${student.motherName}</p>
            <p><strong>Degree:</strong> ${student.degree}</p>
            <p><strong>Department:</strong> ${student.department}</p>
            <p><strong>Degree Type:</strong> ${student.degreeType}</p>
            <p><strong>Part Time Timing:</strong> ${student.partTimeTiming}</p>
            <p><strong>Current Address:</strong> ${student.currentAddress}</p>
            <p><strong>Permanent Address:</strong> ${student.permanentAddress}</p>
            <p><strong>Nationality:</strong> ${student.nationality}</p>
            <p><strong>Mother Tongue:</strong> ${student.motherTongue}</p>
        </div>
    `;

    //call the end point which generates pdf by providing html template.
    $http.post('http://localhost/AngularJS_Unit2_6/API/service/generate_pdf.php', studentDetailsHTML, {
      responseType: 'blob',
      headers: { 'Content-Type': 'text/html' },
    })
      .then(function (response) {
        // Create a blob URL for the PDF content
        const blob = new Blob([response.data], { type: 'application/pdf' });
        console.log(blob);
        const url = URL.createObjectURL(blob);

        // Open the PDF in a new tab
        window.open(url, '_blank');
      })
      .catch(function (error) {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };


});

app.controller('EditController', function ($scope, $http, $timeout) {


  var ctrl = this;
  ctrl.student = null;

  ctrl.selectedDate = "";

  ctrl.formSubmitted = false;

  $scope.$on('editStudent', function (event, student) {
    ctrl.student = student;
    ctrl.isDepartmentDisabled = (ctrl.student.degree === 'BCA');

    ctrl.handleDegreeChange = function () {
      ctrl.isDepartmentDisabled = (ctrl.student.degree === 'BCA');
      ctrl.student.department = "";
    };

    $scope.openDatePicker = function () {
      $jq('#datepicker-modal').datepicker('show');
    };

    $jq(document).ready(function () {
      $jq('#datepicker-modal').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,

      });
    });

  });



  ctrl.saveChanges = function (studentId) {
    if (ctrl.selectedDate) {
      ctrl.student.dateOfBirth = ctrl.selectedDate;
    }
    var url = 'http://localhost:8080/updateStudent/' + studentId;

    $http.put(url, ctrl.student, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      // Handle a successful response here
      if (response.data === true) {
        ctrl.formSubmitted = true;
        $timeout(function () {
          ctrl.formSubmitted = false;
          ctrl.onUpdate();
        }, 2000)
        console.log('Student updated successfully.');
      } else {
        console.error('Failed to update student.');
      }
    }, function (error) {
      console.error('Error updating student: ', error);
    });
  };
});

app.component('editModal', {
  templateUrl: 'app/view/edit-modal.html',

  bindings: {
    student: '=',
    onUpdate: '&'
  },
  controller: 'EditController',
  controllerAs: '$ctrl'
});








// const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = 'student_registration_details.pdf';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);