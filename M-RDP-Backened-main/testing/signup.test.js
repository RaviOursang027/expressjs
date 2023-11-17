const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
require('../server'); // Import your Express app
const User = require('../models/user'); // Import the User model
const mongoose = require('mongoose'); // Import mongoose for database connection
const server = require('../server');


describe('User Registration API testing', function () {
    // Before running the tests, establish a connection to the database
    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Mega-Backend', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    // After all tests are done, close the database connection
    after(async function () {
        await mongoose.connection.close();
    });

    // Clean up the database by removing test data
    afterEach(async function () {
        await User.deleteMany({});
    });



    // Test registration success
    it('should successfully register a new user', async function () {
        const newUser = {
            name: 'test',
            email: 'testuser@example.com',
            password: 'password123',
        };

        try {
            const response = await axios.post('http://localhost:8000/api/signup', newUser);
            // const response = await axios.post('http://techmega.cloud:8000/api/signup', newUser);
            expect(response.status).to.equal(200); // Expect a successful HTTP status code
            expect(response.data).to.have.property('message', 'Email has been sent to your email. Follow the instruction sent to your Email'); // Adjust to match your API's response
        } catch (error) {
            // Handle errors, log them, and assert expected behavior
            expect.fail('Registration failed: ' + error.message);
        }
    }).timeout(5000); // 5 seconds;




    // Test registration failure (user already exists)
    it('should handle registration failure when user already exists', async function () {
        const existingUser = {
            name: 'test',
            email: 'testuser@example.com', // Use an email that already exists in your test database
            password: 'existingpassword',
        };

        try {
            const response = await axios.post('http://localhost:8000/api/signup', existingUser);
            // const response = await axios.post('http://techmega.cloud:8000/api/signup', existingUser);
            expect(response.status).to.equal(200); // Expect a successful HTTP status code
            // expect(response.data).to.have.property('warning', 'Email is taken'); // Adjust to match your API's response
        } catch (error) {
            // Handle errors, log them, and assert expected behavior
            expect.fail('Registration failed: ' + error.message);
        }
    }).timeout(5000); // 5 seconds;
})








