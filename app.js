function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.style.display = "none";
  });

  const activePage = document.getElementById(pageId);
  activePage.style.display = "block";
}

function fetchAndDisplayPosts() {
  fetch('/posts')
    .then(response => response.json())
    .then(posts => {
      const postingList = document.getElementById("posting-list");
      postingList.innerHTML = ''; // Clear existing posts
      posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const postText = document.createElement("p");
        postText.textContent = post.text;
        postElement.appendChild(postText);

        if (post.image_path) {
          const postImage = document.createElement("img");
          postImage.src = post.image_path;
          postElement.appendChild(postImage);
        }

        postingList.appendChild(postElement);
      });
    });
}

document.getElementById("runCode").addEventListener("click", function () {
  fetch("/run-cpp-code")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("result").textContent = data;
    });
});

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username == "user@gatech.edu" && password.length > 6) {
      localStorage.setItem("isLoggedIn", "true");
      // Hide the login form
      document.getElementById("login-form-container").style.display = "none";

      // Show the main content
      document.getElementById("main-content").style.display = "block";
    } else {
      alert("Username and password are invalid.");
    }
  });

function logout() {
  // Clear the stored login state
  localStorage.setItem("isLoggedIn", "false");

  // Optionally redirect to the login page or just show the login form again
  document.getElementById("login-form-container").style.display = "block";
  document.getElementById("main-content").style.display = "none";
}

// Add event listener to the logout button
document.getElementById("logout-button").addEventListener("click", logout);

window.onload = function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
    // Hide the login form
    document.getElementById("login-form-container").style.display = "none";

    // Show the main content
    document.getElementById("main-content").style.display = "block";
  } else {
    // Show the login form
    document.getElementById("login-form-container").style.display = "block";

    // Hide the main content
    document.getElementById("main-content").style.display = "none";
  }
  fetchAndDisplayPosts(); // update the post
};

document.getElementById("send-button").addEventListener("click", sendMessage);

function sendMessage() {
  var input = document.getElementById("message-input");
  var message = input.value.trim();
  if (message) {
    displayMessage(message);
    input.value = ""; // Clear the input after sending
  }
}

function displayMessage(message) {
  var messageArea = document.getElementById("message-area");
  var messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "message-sent"); // Add classes for styling
  var messageContent = document.createElement("span");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;

  messageDiv.appendChild(messageContent);
  messageArea.appendChild(messageDiv);
  messageArea.scrollTop = messageArea.scrollHeight; // Scroll to the bottom
}

// Update the form submission handler to refresh the posts after submission
document.getElementById("post-form").addEventListener("submit", function(event) {
  event.preventDefault();

  var formData = new FormData();
  formData.append('text', document.getElementById("post-text").value);
  var imageFile = document.getElementById("post-image").files[0];
  if (imageFile) {
      formData.append('image', imageFile);
  }

  fetch('/post', {
      method: 'POST',
      body: formData
  })
  .then(response => response.text())
  .then(data => {
      fetchAndDisplayPosts(); // Refresh the posts after submission
  });
});
