require("dotenv").config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { describe, it } = require('mocha');
const User = require('../models/user');
const expect = require('chai').expect;
require('../server');

console.log("hioiooooo")
console.log(process.env.JWT_SECRET)



// Define the test suite
describe('Signin API', () => {
    it('should sign in a user with valid credentials', async () => {
        // Create a sample user with data
        const sampleUser = {
            _id:'125aa',
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
        };
        // Authenticate the user and generate a JWT token

        const token = jwt.sign({ _id: sampleUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d', // Token expires in 7 days
        });

        try {
            // Send a POST request to the signin route with valid credentials
            const response = await axios.post('http://techmega.cloud:8000/api/signin', {
                email: sampleUser.email,
                password: sampleUser.password,
            });

            // Assert that the response status code is 200
            expect(response.status).to.equal(200);

            // Assert that the response contains a success message
            // expect(response.data).to.have.property('success').to.be.true;

            // Assert that the response contains a JWT token
            //   expect(response.data).to.have.property('token').to.equal(token);

        } catch (error) {
            throw error;
        }
    });

    // Add more test cases for handling other scenarios (e.g., incorrect credentials, non-existent user, etc.)
    it('should handle signin with incorrect password', async () => {
        // Create a sample user with data
        const sampleUser = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
        };

        // Create the user in the database or mock the user creation process

        try {
            // Send a POST request to the signin route with incorrect password
            const response = await axios.post('http://techmega.cloud:8000/api/signin', {
                email: sampleUser.email,
                password: 'czvcx',
            });

            // Assert that the response status code is 200
            expect(response.status).to.equal(200);

            // Assert that the response contains a warning message
            // expect(response.data).to.have.property('warning');
            // expect(response.data.warning).to.equal('Email and password do not match');
            // expect(response.data).to.have.property('warning', 'User with that email does not exist. Please signup'); // Adjust to match your API's response

        } catch (error) {
            throw error;
        }
    });

    it('should handle signin with non-existent email', async () => {
        // Provide a non-existent email
        const nonExistentEmail = 'nonexistent@example.com';

        try {
            // Send a POST request to the signin route with a non-existent email
            const response = await axios.post('http://techmega.cloud:8000/api/signin', {
                email: nonExistentEmail,
                password: 'ggsdfg', 
            });

            // Assert that the response status code is 200
            expect(response.status).to.equal(200);

            // Assert that the response contains a warning message
            expect(response.data).to.have.property('warning');
            expect(response.data.warning).to.equal('User with that email does not exist. Please signup');
        } catch (error) {
            throw error;
        }
    });
});
