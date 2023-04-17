var currentPage = 1;
var totalPageToDisplay = 1;

$("#page-group").on('click', '#next', function () {
  const tbody = $("#tbody");
  let key = $("#search").val()

  currentPage = parseInt(currentPage) + 1;

  $(".page").removeClass('active')
  $(`#${currentPage}`).addClass("active")

  if (currentPage == totalPageToDisplay) {
    $('#next').attr('disabled', 'disabled');
  }
  if (currentPage == 1) {
    $("#prev").attr('disabled', 'disabled');
  } else {
    $('#prev').removeAttr("disabled");
  }

  $.ajax({
    type: "GET",
    url: `http://localhost:3005/search?page=${currentPage}&key=${key}`,
    success: function (data) {
      totalPageToDisplay = data['totolPage'];
      $("#tbody tr").remove();

      let body = ``;
      data.user.forEach(user => {
        body = body + `<tr>
      <td></td>
      <td><img src="uploads/${user.profile}" class="profile" alt="profile pic" height="29px" ></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.number}</td>
      <td>
        <a href="#" class="edit button" onclick="editUser(this)" user-id="${user._id}">
          Edit
        </a>
        <a href="#" class="delete button" onclick="deleteUser(this)" user-id="${user._id}">
          Delete
        </a>
      </td>
      </tr> `
      });
      tbody.append(body);

    },
    error: function (error, s) {
      console.log("Error while getting users");
    }
  })

})

$("#page-group").on('click', '#prev', function () {
  const tbody = $("#tbody");
  let key = $("#search").val()

  currentPage = parseInt(currentPage) - 1;
  $(".page").removeClass('active')
  $(`#${currentPage}`).addClass("active")

  if (currentPage == 0) {
    currentPage = 1
  }
  if (currentPage == 1) {
    $('#prev').attr('disabled', 'disabled');
  }
  if (currentPage == 1) {
    $("#next").removeAttr("disabled");
  } else {
    $('#prev').removeAttr("disabled");
  }

  $.ajax({
    type: "GET",
    url: `http://localhost:3005/search?page=${currentPage}&key=${key}`,
    success: function (data) {
      totalPageToDisplay = data['totolPage'];
      $("#tbody tr").remove();
      let body = ``;
      let i = 0;
      data.user.forEach(user => {
        body = body + `<tr>
      <td></td>
      <td><img src="uploads/${user.profile}" class="profile" alt="profile pic" height="29px" ></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.number}</td>
      <td>
        <a href="#" class="edit button" onclick="editUser(this)" user-id="${user._id}">
          Edit
        </a>
        <a href="#" class="delete button" onclick="deleteUser(this)" user-id="${user._id}">
          Delete
        </a>
      </td>
      </tr> `
      });

      tbody.append(body);

    },
    error: function (error, s) {
      console.log("Error while getting users");
    }
  })

})


function getUsers(page) {
  page = parseInt(currentPage)

  const tbody = $("#tbody");
  const pagination = $("#page-group")
  $("#tbody tr").remove();
  $('#page-group button').remove()

  $.ajax({
    type: "GET",
    url: `http://localhost:3005/users/page?page=${page}`,
    success: function (data) {
      $(`#${currentPage}`).addClass("active")
      if (currentPage == 1) {
        $("#prev").attr('disabled', 'disabled');
      }

      totalPageToDisplay = parseInt(data['totolPage']);
      if (totalPageToDisplay == 1) {
        $("#next").attr('disabled', 'disabled');
      }

      let body = ``;
      let pages = ``;
      let totalPage = parseInt(data['totolPage']);
      data.user.forEach(user => {
        body = body + `<tr>
      <td></td>
      <td><img src="uploads/${user.profile}" class="profile" alt="profile pic" height="29px" ></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.number}</td>
      <td>
        <a href="#" class="edit button" onclick="editUser(this)" user-id="${user._id}">
          Edit
        </a>
        <a href="#" class="delete button" onclick="deleteUser(this)" user-id="${user._id}">
          Delete
        </a>
      </td>
      </tr> `
      });
      // pages = pages + `<button id="prev" class="page-btn" disabled>Prev</button>`
      // for (let i = 1; i <= totalPage; i++) {
      //   if (i == currentPage) {
      //     pages = pages + `<span class="page active" page-no="${i}" id="${i}">${i}</span>`
      //   } else {
      //     pages = pages + `<span class="page" page-no="${i}" id="${i}">${i}</span>`
      //   }
      // }
      // pages = pages + `<button id="next" class="page-btn">Next</button>`

      if (totalPageToDisplay == 1 || totalPageToDisplay == 0) {
        pages = pages + `<button id="prev" class="page-btn" disabled>Prev</button>`
        for (let i = 1; i <= totalPage; i++) {
          pages = pages + `<span class="page active" page-no="${i}" id="${i}">${i}</span>`
        }
        pages = pages + `<button id="next" class="page-btn" disabled>Next</button>`
      } else {
        pages = pages + `<button id="prev" class="page-btn" disabled>Prev</button>`
        for (let i = 1; i <= totalPage; i++) {
          if (i == currentPage) {
            pages = pages + `<span class="page active" page-no="${i}" id="${i}">${i}</span>`
          } else {
            pages = pages + `<span class="page" page-no="${i}" id="${i}">${i}</span>`
          }
        }
        pages = pages + `<button id="next" class="page-btn">Next</button>`
      }
      tbody.append(body);
      pagination.append(pages)

    },
    error: function (error, s) {
      console.log("Error while getting users");
    }
  })
}


function ValidateEmail(inputText, number = '') {
  var mailformat = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!inputText.match(mailformat)) {
    $(`#erroremail${number}`).html("*You have entered an invalid email address!")
    $('#email1').focus();
    return false;
  }
  else {
    $(`#erroremail${number}`).html("")
    return true;
  }
}

function ValidateNumber(inputText, number = '') {
  if (inputText.match(/\d/g).length === 10) {
    $(`#errornumber${number}`).html("")
    return true
  }
  else {
    $(`#errornumber${number}`).html("*Enter 10 digit number")
    $('#number1').focus();
    return false
  }
}

function ValidateName(name, number = '') {
  if (name == '') {
    $(`#errorname${number}`).html('*This should not be empty')
    return false
  } 
  else if(name.length < 3){
    $(`#errorname${number}`).html('*Name must be 3 character.')
  }
  else {
    $(`#errorname${number}`).html('')
    return true
  }
}


$('.update-user').submit(function (event) {
  event.preventDefault()
})

function add_user_form() {
  $('#update-con').addClass('hidden')
  $('#add-con').removeClass('hidden')
}

function cancle() {
  $('#add-con').addClass('hidden')
}

function cancle1() {
  $('#update-con').addClass('hidden')
}

//for search
$("#search").change(function () {

  currentPage = 1;
  totalPageToDisplay = 1;
  let key = $("#search").val()
  const tbody = $("#tbody");
  const pagination = $("#page-group")

  $("#tbody tr").remove();
  $("#page-group span").remove()
  $("#page-group button").remove()

  $.ajax({
    type: "GET",
    url: `http://localhost:3005/search/?key=${key}`,
    success: function (data) {
      if (currentPage == 1) {
        $("#prev").attr('disabled', 'disabled');
      }

      totalPageToDisplay = parseInt(data['totolPage']);

      let body = ``;
      let pages = ``;
      let totalPage = parseInt(data['totolPage']);

      data.user.forEach(user => {
        body = body + `<tr>
      <td></td>
      <td><img src="uploads/${user.profile}" class="profile" alt="profile pic" height="29px" ></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.number}</td>
      <td>
        <a href="#" class="edit button" onclick="editUser(this)" user-id="${user._id}">
          Edit
        </a>
        <a href="#" class="delete button" onclick="deleteUser(this)" user-id="${user._id}">
          Delete
        </a>
      </td>
      </tr> `
      });

      if (totalPageToDisplay == 1 || totalPageToDisplay == 0) {
        pages = pages + `<button id="prev" class="page-btn" disabled>Prev</button>`
        for (let i = 1; i <= totalPage; i++) {
          pages = pages + `<span class="page active" page-no="${i}" id="${i}">${i}</span>`
        }
        pages = pages + `<button id="next" class="page-btn" disabled>Next</button>`
      } else {
        pages = pages + `<button id="prev" class="page-btn" disabled>Prev</button>`
        for (let i = 1; i <= totalPage; i++) {
          if (i == 1) {
            pages = pages + `<span class="page active" page-no="${i}" id="${i}">${i}</span>`
          } else {
            pages = pages + `<span class="page" page-no="${i}" id="${i}">${i}</span>`
          }
        }
        pages = pages + `<button id="next" class="page-btn">Next</button>`
      }

      tbody.append(body);
      pagination.append(pages)

    },
    error: function (error, s) {
      console.log("Error while getting users");
    }
  })

})




//update in update form
var user_id
function editUser(element) {
  let id = $(element).attr("user-id")
  user_id = id
  const tr = element.closest("tr");
  let tds = $($(tr)[0].cells)

  let name = $(tds[2]).html()
  let email = $(tds[3]).html()
  let number = $(tds[4]).html()

  $("#name").val(name)
  $("#email").val(email)
  $("#number").val(number)
  $("#update-con").removeClass('hidden')
  $("#add-con").addClass('hidden')
}

//Update User
$('#update-user').submit(function (event) {
  let isValid = false;
  event.preventDefault()
  let name = $("#name").val()
  if (!name) {
    name = ''
    isValid = ValidateName(name, 1);
  }
  isValid = ValidateName(name, 1);


  let email = $("#email").val()
  if (!email) {
    isValid = ValidateEmail(email, 1)
  }
  if (isValid) {
    isValid = ValidateEmail(email, 1)
  }

  let number = $('#number').val()
  if (!number) {
    number = "1"
    isValid = ValidateNumber(number, 1);
  }
  if (isValid) {
    isValid = ValidateNumber(number, 1);
  }

  if (isValid) {
    let data = new FormData();
    const nameVal = document.getElementById("name").value
    const emailVal = document.getElementById("email").value
    const numberVal = document.getElementById("number").value
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];

    data.append("name", nameVal);
    data.append("email", emailVal),
      data.append("number", numberVal);
    if (file) {
      data.append("profile", file);
    }

    data._id = user_id;
    $.ajax({
      url: `http://localhost:3005/users/${user_id}`,
      type: "POST",
      data,
      processData: false,
      contentType: false,
      success: function (resultData) {
        $("#tbody tr").remove();
        alert(`User : ${resultData.name} updated succefully!!!!`);
        $("#search").val('')
        // $('#update-user').trigger("reset");
        const tbody = $("#tbody");
        $('#update-user').trigger('reset')
        $('#update-con').addClass('hidden')
        $('#page-group span').remove()
        getUsers()
      },
      error: function (error, s) {
        if (error.responseJSON.value === "email") {
          alert(error.responseJSON.message)
          $("#erroremail1").html('*' + error.responseJSON.message)
        }
        if (error.responseJSON.value === "number") {
          alert(error.responseJSON.message)
          $("#errornumber1").html('*' + error.responseJSON.message)
        }
        if (!(error.responseJSON.value === "email") && !(error.responseJSON.value === "number")) {
          alert("Internal server error")
        }
      }
    });
  }

})

//Add user
$('#form-user').submit(function (event) {
  let isValid = false;
  event.preventDefault()
  let name = $("#name1").val()
  if (!name) {
    name = ''
    isValid = ValidateName(name);
  }
  isValid = ValidateName(name);

  let email = $("#email1").val()
  if (!email) {
    isValid = ValidateEmail(email)
  }
  if (isValid) {
    isValid = ValidateEmail(email)
  }

  let number = $('#number1').val()
  if (!number) {
    number = "1"
    isValid = ValidateNumber(number);
  }
  if (isValid) {
    isValid = ValidateNumber(number);
  }

  if (isValid) {
    let tbody = $("#tbody")
    let data = new FormData();

    const nameVal = document.getElementById("name1").value
    const emailVal = document.getElementById("email1").value
    const numberVal = document.getElementById("number1").value
    const fileInput = document.getElementById('image1');
    const file = fileInput.files[0];

    data.append("name", nameVal);
    data.append("email", emailVal),
      data.append("number", numberVal);
    data.append("profile", file);

    $.ajax({
      type: "POST",
      url: `http://localhost:3005/users/add`,
      data,
      processData: false,
      contentType: false,
      success: function (resultData) {
        alert(`User : ${resultData.name} added succefully!!!!`);
        $("#search").val('')
        $('#add-con').addClass('hidden')
        let body = `<tr>
  <td></td>
  <td><img src="uploads/${resultData.profile}" class="profile" alt="profile pic" height="29px" ></td>
  <td>${resultData.name}</td>
  <td>${resultData.email}</td>
  <td>${resultData.number}</td>
  <td>
    <a href="#" class="edit button" onclick="editUser(this)" user-id="${resultData._id}">
      Edit
    </a>
    <a href="#" class="delete button" onclick="deleteUser(this)" user-id="${resultData._id}">
      Delete
    </a>
  </td>
</tr>`
        let page = parseInt(currentPage);
        $('#page-group span').show()
        $('#page-group button').show()

        // page = page;
        // getUsers()
        tbody.prepend(body);

        $('#form-user').trigger("reset")
      },
      error: function (error) {
        if (error.responseJSON.value === "email") {
          alert(error.responseJSON.message)
          $("#erroremail").html('*' + error.responseJSON.message)
        }
        if (error.responseJSON.value === "number") {
          alert(error.responseJSON.message)
          $("#errornumber").html('*' + error.responseJSON.message)
        }
        if (!(error.responseJSON.value === "email") && !(error.responseJSON.value === "number")) {
          alert("Internal server error")
        }
      }
    });
  }

})

// Delete User
function deleteUser(element) {
  const tr = element.closest("tr");
  const id = $(element).attr("user-id")

  if (confirm(`Do you want to delete user?`)) {
    $.ajax({
      type: "DELETE",
      url: `http://localhost:3005/users/${id}`,

      success: function (resultData) {
        $("#search").val('')
        let page = currentPage;
        alert(`User deleted succefully!!!!`);
        $(tr).remove();
        $("#page-group span").remove()
        $('#update-con').addClass('hidden')
        getUsers()
      },
      error: function (error, s) {
        alert(s + " Something went wrong!!")
      }
    });
  }

}

// Document Ready
$(document).ready(function () {
  const tbody = $("#tbody");
  const pagination = $("#page-group")
  $("#tbody tr").remove();


  //Gets Users
  getUsers()

  $("#page-group").on('click', '.page', function () {
    let page = $(this).attr('page-no')
    $(".page").removeClass('active')
    $(this).addClass('active')
    currentPage = parseInt(page);
    // let key = ''
    let key = $("#search").val()

    if (currentPage == totalPageToDisplay) {
      // $('#next').removeAttr('disabled');
      $('#next').attr('disabled', 'disabled');
    }
    if (!(currentPage == totalPageToDisplay)) {
      $('#next').removeAttr("disabled");
    }
    if (currentPage == 1) {
      $("#prev").attr('disabled', 'disabled');
    } else {
      $('#prev').removeAttr("disabled");
    }

    $.ajax({
      type: "GET",
      url: `http://localhost:3005/search?page=${page}&key=${key}`,
      success: function (data) {
        $("#tbody tr").remove();
        let body = ``;
        let i = 0;
        data.user.forEach(user => {
          body = body + `<tr>
      <td></td>
      <td><img src="uploads/${user.profile}" class="profile" alt="profile pic" height="29px" ></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.number}</td>
      <td>
        <a href="#" class="edit button" onclick="editUser(this)" user-id="${user._id}">
          Edit
        </a>
        <a href="#" class="delete button" onclick="deleteUser(this)" user-id="${user._id}">
          Delete
        </a>
      </td>
      </tr> `
        });
        tbody.append(body);
      },
      error: function (error, s) {
        console.log("Error while getting users");
      }
    })
  })

});



