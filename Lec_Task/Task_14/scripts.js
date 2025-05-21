
    document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault();

      // Get values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Error elements
      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");

      // Clear errors
      nameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";

      // Flags
      let isValid = true;

      // Validate Name
      if (name === "") {
        nameError.textContent = "Name cannot be empty.";
        isValid = false;
      }

      // Validate Email
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      if (!emailPattern.test(email)) {
        emailError.textContent = "Enter a valid email address.";
        isValid = false;
      }

      // Validate Password
      if (password.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters.";
        isValid = false;
      }

      if (isValid) {
        alert("Login successful!");
      
      }
    });
  