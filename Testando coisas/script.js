document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting

    // Get the entered username and password
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Load and parse the XML file
    fetch('Login.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');

            // Find the user in the XML
            const users = xmlDoc.getElementsByTagName('user');
            let isAuthenticated = false;

            for (let i = 0; i < users.length; i++) {
                const xmlUsername = users[i].getElementsByTagName('login')[0].textContent.trim();
                const xmlPassword = users[i].getElementsByTagName('password')[0].textContent.trim();

                if (username === xmlUsername && password === xmlPassword) {
                    isAuthenticated = true;
                    break;
                }
            }

            // Display result
            if (isAuthenticated) {
                document.getElementById('error-message').textContent = '';
                document.getElementById('screen_login').style.display = 'none';
                document.getElementById('screen_profile').style.display = 'block';
            } else {
                document.getElementById('error-message').textContent = 'Invalid username or password.';
            }
        })
        .catch(error => console.error('Error loading XML:', error));
});
document.addEventListener('DOMContentLoaded', function() {
    // Example dataset
    const data = [
        { name: "John", age: 28, occupation: "Engineer" },
        { name: "Jane", age: 32, occupation: "Doctor" },
        { name: "Mike", age: 25, occupation: "Designer" }
    ];

    // Function to generate a dynamic table
    function generateTable(data) {
        const container = document.getElementById('data-table-container');

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No data available</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'dynamic-table';

        // Generate the header row
        const headerRow = document.createElement('tr');
        const headers = Object.keys(data[0]);

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Generate the data rows
        data.forEach(rowData => {
            const row = document.createElement('tr');

            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = rowData[header];
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        // Clear any existing content in the container and append the table
        container.innerHTML = '';
        container.appendChild(table);
    }

    // Call the function to generate the table
    generateTable(data);
});
