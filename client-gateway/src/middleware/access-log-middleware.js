module.exports = (logger =>
        function accessLog(sock, args, next){
            console.log('ACCESS: ' + JSON.stringify(args));
            next();
        }
);