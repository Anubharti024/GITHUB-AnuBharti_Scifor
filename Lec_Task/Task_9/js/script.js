function fetchStudent() {

    // Fetch user with ID 1
    fetch("https://dummyjson.com/users/1")
        .then(response => response.json())
        .then(user => {
            document.getElementById("student-info").innerHTML = `
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Class:</strong> ${user.company.department}</p>
          <p><strong>Roll Number:</strong> ${user.id}</p>
        `;
        })
        .catch(error => {
            document.getElementById("student-info").innerHTML = "Error fetching student info.";
            console.error(error);
        });
}