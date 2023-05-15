const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const checkURL = '/api/check';
const solveURL = '/api/solve';

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST to /api/solve', () => {
        // Solve a puzzle with valid puzzle string: POST request to /api/solve
        test('Solve a puzzle with valid puzzle string', done => {
            let validPuzzle = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            };
            let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
            
            chai.request(server)
                .post(solveURL)
                .send(validPuzzle)
                .end((err, res) => {
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, solution);
                    done();
                });
        });

        // Solve a puzzle with missing puzzle string: POST request to /api/solve
        test('Solve a puzzle with missing puzzle string', done => {
            chai.request(server)
                .post(solveURL)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        // Solve a puzzle with invalid characters: POST request to /api/solve
        test('Solve a puzzle with invalid characters', done => {
            let invalidChars = {
                puzzle: '1.a..2.84..63.12.7.b..5.....9..1....8.2.367@.3.7.2..9.47...8..1..-6....926914.37.'
            };

            chai.request(server)
                .post(solveURL)
                .send(invalidChars)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        // Solve a puzzle with incorrect length: POST request to /api/solve
        test('Solve a puzzle with incorrect length', done => {
            let incorrectLength = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.367'
            };

            chai.request(server)
                .post(solveURL)
                .send(incorrectLength)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });
        
        // Solve a puzzle that cannot be solved: POST request to /api/solve
        test('Solve a puzzle that cannot be solved', done => {
            let unsolvable = {
                puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            };

            chai.request(server)
                .post(solveURL)
                .send(unsolvable)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });
    
    suite('POST to /api/check', () => {
        // Check a puzzle placement with all fields: POST request to /api/check
        test('Check a puzzle placement with all fields', done => {
            let body = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: 3
            };

            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'valid')
                    assert.equal(res.body.valid, true)
                    done();
                });
        });

        // Check a puzzle placement with single placement conflict: POST request to /api/check
        test('Check a puzzle placement with single placement conflict', done => {
            let body = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: 4
            };

            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    assert.equal(res.body.valid, false);
                    assert.deepEqual(res.body.conflict, ['row']);
                    done();
                });
        });

        // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
        test('Check a puzzle placement with multiple placement conflicts', done => {
            let body = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: 1
            };

            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    assert.equal(res.body.valid, false);
                    assert.deepEqual(res.body.conflict, ['row', 'region']);
                    done();
                });
        });

        // Check a puzzle placement with all placement conflicts: POST request to /api/check
        test('Check a puzzle placement with all placement conflicts', done => {
            let body = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: 2
            };

            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    assert.equal(res.body.valid, false);
                    assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
                    done();
                });
        });

        // Check a puzzle placement with missing required fields: POST request to /api/check
        test('Check a puzzle placement with missing required fields', done => {
            chai.request(server)
                .post(checkURL)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        // Check a puzzle placement with invalid characters: POST request to /api/check
        test('Check a puzzle placement with invalid characters', done => {
            let body = {
                puzzle: '1.a..2.84..63.12.7.b..5.....9..1....8.2.367@.3.7.2..9.47...8..1..-6....926914.37.',
                coordinate: 'A2',
                value: 3
            };
            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        // Check a puzzle placement with incorrect length: POST request to /api/check
        test('Check a puzzle placement with incorrect length', done => {
            let body = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.367',
                coordinate: 'A2',
                value: 3
            };
            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
        test('Check a puzzle placement with invalid placement coordinate', done => {
            let body = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: '2B',
                value: 3
            };

            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        // Check a puzzle placement with invalid placement value: POST request to /api/check
        test('Check a puzzle placement with invalid placement value', done => {
            let body = {
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: 0
            };

            chai.request(server)
                .post(checkURL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });

    });

});