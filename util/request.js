const request = require('request');


module.exports = function (requestObject) {
    return new Promise((resolve, reject) => {
        request(requestObject, (err, res, body) => {
            if (err) {
                reject(err)
            } else if (res.statusCode >= 400) {
                const error = new Error(`Received status: ${res.statusCode}`);
                error.statusCode = res.statusCode;
                reject(error);
            } else {
                let parsedBody;

                try {
                    parsedBody = JSON.parse(body);
                    resolve(parsedBody);
                } catch (exc) {
                    // reject(exc);
                    resolve(body);
                }
            }
        });
    });
}