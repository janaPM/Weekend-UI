const mysql = require('mysql2');

const connection = mysql.createConnection({
host: 'weekend.ct0u60y6o314.ap-south-1.rds.amazonaws.com',
user: 'Weekend', // Replace with your username
password: 'Jana123Ajan123', // Replace with your password
database: 'Weekend'
});

connection.connect((err) => {
if (err) {
console.error('Error connecting to MySQL:', err);
return;
}
console.log('Connected to MySQL.');
});


module.exports = connection;





