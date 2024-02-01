<<<<<<< HEAD
const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = function(e) {
  console.log("[open] Connection established");
};

socket.onmessage = function(event) {
  try {
    let data;
    if (event.data instanceof Blob) {
      // Handle Blob data
      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        try {
          data = JSON.parse(text);
          // Process the data
          processMessage(data);
        } catch (err) {
          console.error('Error parsing JSON from Blob', err);
        }
      };
      reader.readAsText(event.data);
    } else {
      // Handle non-Blob data
      data = JSON.parse(event.data);
      // Process the data
      console.log("Received message data:", data);
      processMessage(data);
    }
  } catch (err) {
    console.error('Error parsing received data', err);
    // Implement your fallback strategy here
  }
};

function processMessage(data) {
  console.log("[message] Data received from server:", data);
  // Update messageStore and display the message
  updateMessageStore(data.sender, data.chatBoxId, data.textMessage, data.imageData);
  displayMessage(data.chatBoxId, data.textMessage, data.imageData, data.sender !== sessionStorage.getItem("loggedInUser"), true);
  loadChatHistory(data.chatBoxId, true);
  console.log("Updated messageStore:", messageStore);
  console.log("Currently logged-in user:", sessionStorage.getItem("loggedInUser"));
}

function startChatRefresh(chatBoxId) {
  const refreshInterval = 500; // Refresh every 5000 milliseconds (5 seconds)
  setInterval(function() {
      loadChatHistory(chatBoxId, false);
  }, refreshInterval);
}

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
  console.log(`[error] ${error.message}`);
};

var messageStore = {}; // Object to store messages

=======
>>>>>>> parent of 3407065 (Final)
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.style.display = "none";
  });

  const activePage = document.getElementById(pageId);
  activePage.style.display = "block";
<<<<<<< HEAD
  if (pageId.startsWith('chat_')) {
    var chatBoxId = pageId.substring(5); // Extract chatBoxId from pageId
    loadChatHistory(chatBoxId, true);
    startChatRefresh(chatBoxId);
  }
}

document.getElementById("runCode").addEventListener("click", function () {
  fetch("/run-cpp-code")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("result").textContent = data;
    });
});

// Define a mapping of users to their friends
const userFriendsMapping = {
  "lucky@gatech.edu": ["user", "winnie"],
  "winnie@gatech.edu": ["user", "lucky"],
  "user@gatech.edu": ["lucky", "winnie"]
};

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Check if the username is in the mapping and password length > 6
  if (userFriendsMapping[username] && password.length > 6) {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("loggedInUser", username); // Store the logged-in user

    // Hide the login form and show the main content
    document.getElementById("login-form-container").style.display = "none";
    document.getElementById("main-content").style.display = "block";

    // Update the UI to show the friends of the logged-in user
    updateFriendsList(userFriendsMapping[username]);
    updateHomeList(username);
  } else {
    alert("Username and password are invalid.");
  }
});

function updateHomeList(home) {
  const homeListDiv = document.getElementById('home-list');
  homeListDiv.innerHTML = ''; // Clear existing content
  const homeDiv = document.createElement('div');
  homeDiv.className = 'profile-section';

  // Add conditional content based on the friend's name
  if (home === 'lucky@gatech.edu') {
    homeDiv.innerHTML = `
    <div id="profile-section">
      <div id="profile-image-container">
          <img src="lucky.jpg" alt="Profile Image" id="profile-image">
      </div>
      <div id="profile-info">
          <h3>Lucky</h3>
          <p>Major: Computer Science</p>
          <p>Year: Sophomore</p>
      </div>
    </div>
    `;
  } else if (home === 'winnie@gatech.edu') {
    homeDiv.innerHTML = `
    <div id="profile-section">
      <div id="profile-image-container">
          <img src="xjp.jpg" alt="Profile Image" id="profile-image">
      </div>
      <div id="profile-info">
          <h3>Winnie</h3>
          <p>Major: Politics</p>
          <p>Year: Freshmen</p>
      </div>
    </div>
    `;
  } else if (home === 'user@gatech.edu') {
    homeDiv.innerHTML = `
    <div id="profile-section">
      <div id="profile-image-container">
          <img src="user.jpg" alt="Profile Image" id="profile-image">
      </div>
      <div id="profile-info">
          <h3>User</h3>
          <p>Major: League of Legends</p>
          <p>Year: Phd</p>
      </div>
    </div>
    `;
  }

  homeListDiv.appendChild(homeDiv);
}

function updateFriendsList(friends) {
  const friendsListDiv = document.getElementById('friends-list');
  friendsListDiv.innerHTML = ''; // Clear existing content

  friends.forEach(friend => {
    // Create elements for each friend's profile
    const friendDiv = document.createElement('div');
    friendDiv.className = 'friend-profile';

    // Add conditional content based on the friend's name
    if (friend === 'lucky') {
      friendDiv.innerHTML = `

        <div class="profile-picture-container">
            <img src="lucky.jpg" alt="Friend One's Profile Picture" class="profile-picture">
        </div>
        <div class="profile-bio">
            <p>Name: Lucky</p>
            <p>Bio: A little cat. Cat food tasting expert at Georgia Tech</p>
        </div>
        <div class="profile-actions">
            <i class="fas fa-comment" onclick="showPage('chat_lucky')"></i> <!-- Chat Icon -->
            <i class="fas fa-video" id = "runCode"></i>   <!-- Video Icon -->
        </div>

      `;
    } else if (friend === 'winnie') {
      friendDiv.innerHTML = `

        <div class="profile-picture-container">
            <img src="xjp.jpg" alt="Friend Two's Profile Picture" class="profile-picture">
        </div>
        <div class="profile-bio">
            <p>Name: Winnie</p>
            <p>Bio: A political enthusiast. He majors in Electrical and Computer Engineering at Georgia Tech.</p>
        </div>
        <div class="profile-actions">
        <i class="fas fa-comment" onclick="showPage('chat_winnie')"></i> <!-- Chat Icon -->
            <i class="fas fa-video"></i>   <!-- Video Icon -->
        </div>

      `;
    } else if (friend === 'user') {
      friendDiv.innerHTML = `

        <div class="profile-picture-container">
            <img src="me.jpg" alt="Friend three's Profile Picture" class="profile-picture">
        </div>
        <div class="profile-bio">
            <p>Name: user</p>
            <p>Bio: A normal Georgia Tech student majored in League of Legends.</p>
        </div>
        <div class="profile-actions">
        <i class="fas fa-comment" onclick="showPage('chat_user')"></i> <!-- Chat Icon -->
            <i class="fas fa-video"></i>   <!-- Video Icon -->
        </div>

      `;
    }

    friendsListDiv.appendChild(friendDiv);
  });
}

function logout() {
  // Clear the stored login state
  sessionStorage.setItem("isLoggedIn", "false");

  // Optionally redirect to the login page or just show the login form again
  document.getElementById("login-form-container").style.display = "block";
  document.getElementById("main-content").style.display = "none";
}

// Add event listener to the logout button
document.getElementById("logout-button").addEventListener("click", logout);

window.onload = function () {
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    // Hide the login form
    document.getElementById("login-form-container").style.display = "none";

    // Show the main content
    document.getElementById("main-content").style.display = "block";

    // Update the friends list based on the logged-in user
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    updateFriendsList(userFriendsMapping[loggedInUser]);
  } else {
    // Show the login form
    document.getElementById("login-form-container").style.display = "block";

    // Hide the main content
    document.getElementById("main-content").style.display = "none";
  }
  fetchAndDisplayPosts();
};

document.getElementById("send-button-user").addEventListener("click", function() {
  sendMessage('user');
});
document.getElementById("send-button-lucky").addEventListener("click", function() {
  sendMessage('lucky');
});
document.getElementById("send-button-winnie").addEventListener("click", function() {
  sendMessage('winnie');
});

function getNameFromEmail(email) {
  return email.split('@')[0]; // Splits the email at '@' and returns the first part
}

// Function to send a message
function sendMessage(chatBoxId) {
  var input = document.getElementById("message-input-" + chatBoxId);
  var imageInput = document.getElementById("image-input-" + chatBoxId);
  var textMessage = input.value.trim();
  var sender = getNameFromEmail(sessionStorage.getItem("loggedInUser"));
  var imageData = null;

  if (imageInput.files.length > 0) {
    var file = imageInput.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      imageData = e.target.result; // Base64 encoded string
      const messageData = { sender, chatBoxId, textMessage, imageData };
      socket.send(JSON.stringify(messageData));
    };
    reader.readAsDataURL(file);
  } else if (textMessage) {
    const messageData = { sender, chatBoxId, textMessage, imageData: null };
    console.log("Sending message:", messageData); 
    socket.send(JSON.stringify(messageData));
  }

  input.value = ""; // Clear the input
  imageInput.value = ""; // Clear the image input
}

// Function to update messageStore
function updateMessageStore(sender, chatBoxId, message, imageData) {
  const chatPair = sender + "_" + chatBoxId;
  if (!messageStore[chatPair]) {
    messageStore[chatPair] = [];
  }
  var timestamp = new Date().getTime();
  messageStore[chatPair].push({ sender: sender, message: message, imageData: imageData, timestamp: timestamp });
}


function displayMessage(chatBoxId, message, imageData, notUser, isNewMessage) {

  var messageArea = document.getElementById("message-area-" + chatBoxId);
  var messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  var contentDiv = document.createElement("div"); // Create a container for content
  if (notUser) {
      messageDiv.classList.add("message-sent");
      contentDiv.classList.add("message-content-sent");
  } else {
      messageDiv.classList.add("message-received");
      contentDiv.classList.add("message-content-received");
  }

  if (imageData) {
      var img = document.createElement("img");
      img.src = imageData;
      img.style.maxWidth = "200px";
      img.style.maxHeight = "200px";
      contentDiv.appendChild(img); // Append image to contentDiv
  }

  if (message) {
      var messageContent = document.createElement("span");
      messageContent.textContent = message;
      contentDiv.appendChild(messageContent); // Append message to contentDiv
  }

  messageDiv.appendChild(contentDiv); // Append contentDiv to messageDiv
  messageArea.appendChild(messageDiv);

  if (isNewMessage) {
    messageArea.scrollTop = messageArea.scrollHeight;
  }
  

}

function loadChatHistory(chatBoxId, isNewMessage) {
  var loggedInUser = getNameFromEmail(sessionStorage.getItem("loggedInUser"));
  var chatPair1 = loggedInUser + "_" + chatBoxId;
  var chatPair2 = chatBoxId + "_" + loggedInUser;

  // Clear current messages in the chat box
  var messageArea = document.getElementById("message-area-" + chatBoxId);
  messageArea.innerHTML = '';

  // Load messages from both chat pairs and sort them by timestamp
  var messages = (messageStore[chatPair1] || []).concat(messageStore[chatPair2] || []);
  messages.sort((a, b) => a.timestamp - b.timestamp); // Sort messages by timestamp

  messages.forEach(msg => {
    displayMessage(chatBoxId, msg.message, msg.imageData, msg.sender === loggedInUser, isNewMessage);
  });
=======
>>>>>>> parent of 3407065 (Final)
}

function fetchAndDisplayPosts() {
  fetch('/posts')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(posts => {
      const postingList = document.getElementById("posting-list");
      postingList.innerHTML = ''; // Clear existing posts
      posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        // Create a container for text and delete icon
        const textContainer = document.createElement("div");
        textContainer.classList.add("post-text-container");

        const postText = document.createElement("p");
        postText.textContent = post.text;
        textContainer.appendChild(postText);

        // Add a trash bin icon for deletion
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash"); // Assuming you're using Font Awesome
        deleteIcon.style.cursor = "pointer";
        deleteIcon.onclick = function() { deletePost(post.id); };
        textContainer.appendChild(deleteIcon);

        postElement.appendChild(textContainer);


        if (post.image_path) {
          const postImage = document.createElement("img");
          postImage.src = post.image_path;
          postElement.appendChild(postImage);
        }

        postingList.appendChild(postElement);
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// delete post
function deletePost(postId) {
  fetch(`/delete-post/${postId}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchAndDisplayPosts(); // Refresh the posts after deletion
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

<<<<<<< HEAD
=======
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

>>>>>>> parent of 3407065 (Final)
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
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    fetchAndDisplayPosts(); // Refresh the posts after submission
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
