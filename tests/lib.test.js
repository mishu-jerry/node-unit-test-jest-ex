/**
 * Jest documentation
 * https://jestjs.io/docs/en/api
 */

const { describe, it, expect } = require('@jest/globals');
const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

/* Simple example */
// test('Mock Test', () => {
//     // code to assert
// });

/* With describe() and it() */
// describe() : test suite (container of multiple tests)
// it() : test
// ======================== //

describe('abs', () => {
    it('should return a positive number if input is positive', () => {
        const result = lib.abs(1);
        expect(result).toBe(1);
    });

    it('should return a positive number if input is negative', () => {
        const result = lib.abs(-1);
        expect(result).toBe(1);
    });

    it('should return 0 number if input is 0', () => {
        const result = lib.abs(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return a greeting message', () => {
        const result = lib.greet('Jerry');

        expect(result).toBe('Welcome Jerry'); // too specific
        expect(result).toMatch(/Jerry/);
        expect(result).toContain('Jerry');
    });
});

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();

        // Too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        // Too specific
        expect(result[0]).toBe('BDT');
        expect(result[1]).toBe('RS');
        expect(result[2]).toBe('USD');

        expect(result.length).toBe(3);

        // Proper way
        expect(result).toContain('BDT');
        expect(result).toContain('RS');
        expect(result).toContain('USD');

        // Ideal way
        expect(result).toEqual(expect.arrayContaining(['BDT', 'RS', 'USD']));
    });
});

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = lib.getProduct(1);

        // expect(result).toBe({ id: 1, price: 1000 }); // bad assertion,
        // as 2 objects are never same or equal

        // expect(result).toEqual({ id: 1, price: 1000 });
        // result should have the specified properties strictly

        expect(result).toMatchObject({ id: 1, price: 1000 }); // Ideal way
        // result can have more properties (but must contain the specified ones)

        // expect(result).toHaveProperty('id', 1); // value type must be same
    });
});

describe('registerUser', () => {
    it('should throw Error if username is falsy', () => {

        //expect(() => { lib.registerUser(null) } ).toThrow();

        const args = [null, undefined, NaN, '', 0, false];

        args.forEach(arg => {
            expect(() => { lib.registerUser(arg) }).toThrow();
        });
    });

    it('should return an user object if username is not falsy', () => {
        const result = lib.registerUser('Jerry');

        expect(result).toMatchObject({ username: 'Jerry' });
        expect(result.id).toBeGreaterThan(0);
    });
});

describe('FizzBuzz', () => {
    it('should throw if input is NaN', () => {
        expect(() => { lib.fizzBuzz('a') }).toThrow();
        expect(() => { lib.fizzBuzz(null) }).toThrow();
        expect(() => { lib.fizzBuzz(undefined) }).toThrow();
        expect(() => { lib.fizzBuzz({}) }).toThrow();
    });

    it('should return "FizzBuzz" if input is divisible by both 3 and 5', () => {
        const result = lib.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });

    it('should return "Fizz" if input is divisible by 3', () => {
        const result = lib.fizzBuzz(3);
        expect(result).toBe('Fizz');
    });

    it('should return "Buzz" if input is divisible by 5', () => {
        const result = lib.fizzBuzz(5);
        expect(result).toBe('Buzz');
    });

    it('should return input if it is a number and not divisible by 3 or 5', () => {
        const result = lib.fizzBuzz(1);
        expect(result).toBe(1);
    });
});

describe('applyDiscount', () => {
    // replace db.getCustomerSync() with a fake function
    // to remove dependency ( in lib.applyDiscount() )
    db.getCustomerSync = function (id) {
        console.log('(FAKE) Reading customer from DB...');
        return { id: id, email: 'a', points: 11 };
        // only 'id' and 'points' is required in this test, 
        // 'email' can be ommitted
    }

    const order = { customerId: 1, totalPrice: 100 };

    it('should apply 10% discount if the customer has more than 10 points', () => {
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(90);
    });
});

describe('notifyCustomer', () => {

    /* Aproach 1 */
    // ========= //

    // it('should send an email to the customer', () => {
    //     // Dependency 1
    //     // replace db.getCustomerSync() with a fake function
    //     // to remove dependency ( in lib.notifyCustomer() )
    //     db.getCustomerSync = function (id) {
    //         console.log('(FAKE) Reading customer from DB...');
    //         return { id: id, email: 'a', points: 11 };
    //         // only 'email' is required in this test, 
    //         // 'id' and 'points' can be ommitted
    //     }

    //     let mailSentFakeFlag = false;

    //     // Dependency 2
    //     // replace mail.send() with a fake function
    //     // to remove dependency ( in lib.notifyCustomer() )
    //     mail.send = function (emailAddress, message) {
    //         mailSentFakeFlag = true;
    //         console.log(`(FAKE) Sending email to ${emailAddress} ...`);
    //     }

    //     lib.notifyCustomer({ customerId: 1 });
    //     // only order.customerId is required for this test

    //     expect(mailSentFakeFlag).toBe(true);
    // });

    /* Aproach 2: Using Jest mock functions */
    // ==================================== //

    it('should send an email to the customer', () => {
        
        /* Simple example */

        // const mockFunction = jest.fn();

        // mockFunction.mockReturnValue(1); // mockFunction() will return 1
        // const result = mockFunction();

        // mockFunction.mockResolvedValue(1); // will return a Promise resolved with 1
        // mockFunction.mockRejectedValue(new Error('Failed...')); // a rejected Promise
        // const result = await mockFunction();

        // expect(result).toBe(1);

        // ================================================ //

        // Dependency 1
        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
        // Dependency 2
        mail.send = jest.fn().mockReturnValue();

        lib.notifyCustomer({ customerId: 1 });

        // expect(mail.send).toBeCalled();

        // too specific
        // expect(mail.send).toBeCalledWith('a', 'Your order was placed successfully.');

        // Ideal
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order was placed/);
    });
});