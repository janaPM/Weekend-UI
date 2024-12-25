const mysql = require('mysql2');

const connection = mysql.createConnection({
host: 'localhost',
user: 'root', // Replace with your username
password: '12345678', // Replace with your password
database: 'chessy_database'
});

connection.connect((err) => {
if (err) {
console.error('Error connecting to MySQL:', err);
return;
}
console.log('Connected to MySQL.');
});


module.exports = connection;





