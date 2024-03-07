const request = require('supertest');
// Instead of:
// const chai = require('chai');
// const assert = chai.assert;

// Use dynamic import:
import('chai').then(chai => {
    const assert = chai.assert;

    // Your test code here...
});

const app = require('./server'); // Assuming your Express application is exported as 'app'

describe('GET /claimants', function() {
    let server;

    before(function(done) {
        server = app.listen(8000, function() {
            console.log('Server started on port 8000');
            done();
        });
    });

    after(function(done) {
        server.close(function() {
            console.log('Server stopped');
            done();
        });
    });

    it('responds with status 200', function(done) {
        request(app)
            .get('/claimants')
            .expect(200, done);
    });

    // Add more tests as needed
});