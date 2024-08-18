const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const app = express();
const port = 3000; // You can change this port number if needed

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const USERS_XML_PATH = path.join(__dirname, '..', 'Login', 'users.xml');

// Endpoint to handle registration
app.post('/register', (req, res) => {
    console.log('Registering new user: ');
    console.log(req.body); // Add this line for debugging
    const { username, password, email, confirmPassword } = req.body;

    // Check for required fields
    if (!username || !password || !email || !confirmPassword) {
        return res.status(400).send('All fields (username, password, email, confirm password) are required.');
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    fs.readFile(USERS_XML_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading XML file.');
        }

        xml2js.parseString(data, { trim: true }, (err, result) => {
            if (err) {
                return res.status(500).send('Error parsing XML.');
            }

            const users = result.users.user || [];
            const userExists = users.some(user => user.username[0] === username);

            if (userExists) {
                return res.status(400).send('User already exists.');
            }

            users.push({
                username: [username],
                password: [password],
                email: [email],
                role: ['user']  // Adjust role as needed
            });

            result.users.user = users;

            const builder = new xml2js.Builder();
            const updatedXml = builder.buildObject(result);

            fs.writeFile(USERS_XML_PATH, updatedXml, (err) => {
                if (err) {
                    return res.status(500).send('Error writing XML file.');
                }
                res.status(200).send('User registered successfully.');
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
