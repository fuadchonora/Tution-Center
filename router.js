module.exports = function(app, connection) {
    require('./routes/admin')(app, connection);
    require('./routes/teacher')(app, connection);
    };