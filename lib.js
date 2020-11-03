const db = require('./db');
const mail = require('./mail');

exports.abs = number => (number < 0) ? -number : number;

exports.greet = name => 'Welcome ' + name;

exports.getCurrencies = () => ['BDT', 'RS', 'USD'];

exports.getProduct = productId => { 
    return { id: productId, price: 1000 } 
}

exports.registerUser = function(username) {
    if (!username) throw new Error('Username is required.');

    return { id: new Date().getMilliseconds(), username: username };
}

exports.fizzBuzz = function(input) {
    if (typeof input !== 'number') throw new Error('Input should be a number');
    if ((input % 3 === 0) && (input % 5 === 0)) return 'FizzBuzz';
    if (input % 3 === 0) return 'Fizz';
    if (input % 5 === 0) return 'Buzz';
    return input;
}

exports.applyDiscount = function(order) {
    const customer = db.getCustomerSync(order.customerId);

    if (customer.points > 10) {
        order.totalPrice *= 0.9; // apply 10% discount
    }
}

exports.notifyCustomer = function(order) {
    const customer = db.getCustomerSync(order.customerId);

    mail.send(customer.email, "Your order was placed successfully.");
}