document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const usernameInput = document.querySelector('input[type="text"]').value;
    const passwordInput = document.querySelector('input[type="password"]').value;

    // Load the XML file
    fetch('users.xml')
        .then(response => response.text())
        .then(data => {
            // Parse the XML data
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');

            // Get all user elements
            const users = xmlDoc.getElementsByTagName('user');
            let isAuthenticated = false;

            // Loop through users and check credentials
            for (let i = 0; i < users.length; i++) {
                const username = users[i].getElementsByTagName('username')[0].textContent;
                const password = users[i].getElementsByTagName('password')[0].textContent;

                if (username === usernameInput && password === passwordInput) {
                    isAuthenticated = true;
                    break;
                }
            }

            // Display the login result
            if (isAuthenticated) {
                // alert('Login successful!');
                window.location.href = 'Dashboard/index_dashboard.html';
                // Redirect to another page or perform further actions
            } else {
                alert('Invalid username or password.');
            }
        })
        .catch(error => {
            console.error('Error loading the XML file:', error);
        });
});
