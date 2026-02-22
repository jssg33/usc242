  	function setuser()
    {
  	alert("setting user for trial usage");
    localStorage.setItem("uid", "1");
    localStorage.setItem("fullname", "Park Guest");
    localStorage.setItem("email", "parkguest@547bikes.info");
    localStorage.setItem("role", "registered");
    localStorage.setItem("status", "loggedin");
    localStorage.setItem("firstname", "Park");
    localStorage.setItem("lastname", "Guest");
    }

function checkpll()
  {
         const someuid = localStorage.getItem('uid');
         if (someuid === '901') 
         {
         window.location.href = 'loginerror.html';
		 }
  		 else if (!someuid)
         {
         localStorage.setItem("uid", "901");
         localStorage.setItem("fullname", "Park Guest");
         }
   }

 function displayProfilePicture()
    {
        var newSrc = './images/bluecircle.png'; 
        const imageElement = document.getElementById("profilephototarget");

      const tempSrc = localStorage.getItem("activepictureurl");
      if (tempSrc !== null) {
          newSrc = tempSrc;
          alert(newSrc);
        } 
      else {
            // Do Nothing.... Blue Circle will show.
        }
         imageElement.src = newSrc;
    }



function checkUserStatus() {
  var userId = localStorage.getItem("uid");
  var fullName = localStorage.getItem("fullname");
  var userRole = localStorage.getItem("role");

  var loginBtn = document.getElementById("loginBtn");
  var logoutBtn = document.getElementById("logoutBtn");

  if (userId && userId !== "901") {
    document.getElementById("userGreeting").innerHTML = "Welcome, " + fullName;
    document.getElementById("H3UserBanner").innerText = fullName;  
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    
    if (userRole === "admin") {
      window.open("adminhome.html", "_self");
    }
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    document.getElementById("userGreeting").innerHTML = "Welcome, Guest";
    document.getElementById("H3UserBanner").innerText = "Guest";
    document.getElementById("profilephototarget").src = "./images/bluecircle.png";
      }
  }

function logoutUser(event) {
  event.preventDefault();
  console.log("Logging out user...");

  localStorage.clear();
  localStorage.setItem("uid", "901");
  localStorage.setItem("fullname", "Guest");
  localStorage.setItem("role", "guest");

  console.log("Local storage after logout:", localStorage);
  clearUserSession();
  window.location.replace("login.html");
}

function clearUserSession() {
  let sometoken = localStorage.getItem('token');
  let logoutApiUrl = "https://api242.onrender.com/api/Users/logout/" + sometoken;

  $.post(logoutApiUrl)
    .done(function () {
      alert("SessionClosed.");
    })
    .fail(function (xhr, status, error) {
      console.error("Error closing session:", xhr.responseText);
    });
}

function loginUser(event) {
  event.preventDefault();
  console.log("Logging in user...");

  localStorage.clear();
  localStorage.setItem("uid", "901");
  localStorage.setItem("fullname", "Guest");
  localStorage.setItem("role", "guest");
  localStorage.setItem("isemployee", "0");
  window.open("login.html", "_self");
}

function fetchProfilePicture() {
  let uid = localStorage.getItem('uid');
  $.get(profilesApiUrl)
    .done(function (profiles) {
      let profile = profiles.find(p => p.userid == uid);
      if (profile && profile.activepictureurl) {
        $('.navbar .nav-right img').attr('src', profile.activepictureurl);
      }
    })
    .fail(function (xhr, status, error) {
      console.error("Error fetching profiles:", xhr.responseText);
    });
}

function fetchUser() {
  let uid = localStorage.getItem('uid');
  $.get(usersApiUrl)
    .done(function (users) {
      let user = users.find(u => u.id == uid);
      if (!user) {
        alert("User not found.");
        return;
      }
      $('#H3UserBanner').text(user.fullname);
    })
    .fail(function (xhr, status, error) {
      console.error("Error fetching user:", xhr.responseText);
    });
}

    function checkUserRole() {
      const userRole = localStorage.getItem("role");
      if (userRole != "superuser") {
        document.getElementById("manager").style.display = "none";
      }
    }

    function fetchProfilePicture() {
      const uid = localStorage.getItem("uid");
      $.get(
        "https://api242.onrender.com/api/Userlog"
        /api/Userprofile"
      )
        .done(function (profiles) {
          const profile = profiles.find((p) => p.userid == uid);
          if (profile && profile.activepictureurl) {
            $("#userProfilePic").attr("src", profile.activepictureurl);
          }
        })
        .fail(function (xhr) {
          console.error("Error fetching profiles:", xhr.responseText);
        });
    }

    function fetchSyslog() {
      $.get(
        "https://api242.onrender.com/api/Userlog"
      )
        .done((data) => $("#syslogDisplay").text(JSON.stringify(data, null, 2)))
        .fail(() => $("#syslogDisplay").text("Error fetching syslog"));
    }
    function fetchSessionlog() {
      $.get(
        "https://api242.onrender.com/api/Usersession"
      )
        .done((data) => $("#sessionlogDisplay").text(JSON.stringify(data, null, 2)))
        .fail(() => $("#sessionlogDisplay").text("Error fetching syslog"));
    }
    function fetchApilog() {
      $.get(
        "https://api242.onrender.com/api/Useraction"
      )
        .done((data) => $("#apilogDisplay").text(JSON.stringify(data, null, 2)))
        .fail(() => $("#apilogDisplay").text("Error fetching apilog"));
    }
    function fetchLearnlog() {
      $.get(
        "https://api242.onrender.com/api/Learndetail"
      )
        .done((data) =>
          $("#learnlogDisplay").text(JSON.stringify(data, null, 2))
        )
        .fail(() => $("#learnlogDisplay").text("Error fetching learnlog"));
    }
    
      
    function onLogout(event) {
      event.preventDefault();
      localStorage.clear();
      localStorage.setItem("uid", "901");
      localStorage.setItem("fullname", "Guest");
      localStorage.setItem("role", "guest");
      localStorage.setItem("isemployee", "0");
      closeUserSession();
      window.location.replace("../login.html");
    }

    //JOHNS ACCORDIAN SCRIPTS DO NOT TOUCH OR THIS WONT WORK.... 
    var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
 function writelocation()
    {
    const locElement = document.getElementById("locationbar");
    const ipElement = document.getElementById("ipbar");
    //var somelat = localStorage.getItem("LAT");
    //var somelong = localStorage.getItem("LONG");
    somefulllocation = localStorage.getItem("userlocation");
    someipaddress = localStorage.getItem("ipaddress");
    //var fulllocation = somelong + "," + somelat;

 if (somefulllocation) {
        //const fullLocation = `${somelat},${somelong}`;
        locElement.innerHTML = `Your Location is: ${somefulllocation}`;
        ipElement.innerHTML = `Your IP is: ${someipaddress}`;
    } else {
	 	const locElement = document.getElementById('locElement');
	 	const ipElement = document.getElementById('ipElement');
        locElement.innerHTML = "Location data not available.";
        ipElement.innerHTML = `Your IP address is not available.`;
    }
}

       function displayProfilePicture()
    {
        var newSrc = './images/bluecircle.png'; 
        const imageElement = document.getElementById("profilephototarget");

      const tempSrc = localStorage.getItem("activepictureurl");
      if (tempSrc !== null) {
          newSrc = tempSrc;
          //alert(newSrc);
        } 
      else {
            // Do Nothing.... Blue Circle will show.
        }
         imageElement.src = newSrc;
    }

function closeUserSession() {
  // Step 1: Get the user ID from localStorage
  const uid = localStorage.getItem('uid');
  if (!uid) {
    console.error('User ID not found in localStorage.');
    return;
  }

  // Step 2: Get current time in ISO format
  const sessionEndTime = new Date().toISOString();

  // Step 3: Construct the payload
  const payload = {
    sessionend: sessionEndTime
  };

  // Step 4: Send POST request to close the session
  fetch(`https://api242.onrender.com/Usersession/user/${uid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to close session');
      return response.json();
    })
    .then(data => {
      console.log('Session closed successfully:', data);
    })
    .catch(error => {
      console.error('Error closing session:', error);
    });
}
