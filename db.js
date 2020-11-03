/**
 * This module mimics some DB operations
 */

exports.getCustomerSync = function(id) {
    console.log('Reading customer from DB...');
    return { id: id, email: 'a', points: 11};
}

exports.getCustomer = function(id) {
    return new Promise((resolve, reject) => {
        console.log('Reading customer from DB...');
        resolve({ id: id, email: 'a', points: 11});
    });
}