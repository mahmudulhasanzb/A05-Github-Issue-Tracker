const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signInBtn = document.getElementById('sign-in-btn');

// sign in function
const signIn = () => {
  // get the value of username and password
  const username = usernameInput.value;
  const password = passwordInput.value;

  // check if the username and password is correct
  if (username !== "admin") {
    alert("Invalid username");
    return;
  }
  if (password !== "admin123") {
    alert("Invalid password");
    return;
  }
  if (username === "admin" && password === "admin123") {
    window.location.replace("main.html");
  }
}
