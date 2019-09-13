const crossfetch = require('cross-fetch');

const BASE_API_PATH = "https://api.countapi.xyz";
const validPattern = /^[A-Za-z0-9_\-.]{3,64}$/;
const validRegex = new RegExp(validPattern);

function validatePair(namespace, key) {
    if(typeof key === "undefined") {
        key = namespace;
        namespace = undefined;
    }

    return new Promise(function(resolve, reject) {
        if(!validRegex.test(key)) {
            reject(`Key must match ${validPattern}. Got '${namespace}'.`);
            return;
        }
        if(!validRegex.test(namespace) && typeof namespace !== "undefined" && namespace !== null) {
            reject(`Namespace must match ${validPattern} or be empty. Got '${namespace}'.`);
            return;
        }
        
        var path = '';
        if(typeof namespace !== "undefined")
            path += namespace + '/';
        path += key;
        
        resolve(path);
    });
}

module.exports.get = function(namespace, key) {
    return validatePair(namespace, key).then(function(path) {
        return crossfetch(`${BASE_API_PATH}/get/${path}`).then(res => {
            if (res.status == 200 ||
                res.status == 404) {
                return res.json();
            }
            throw new Error("Response from server: " + res.status);
        });
    });
};

module.exports.set = function(namespace, key, value) {
    if(typeof value === "undefined") {
        if(typeof key === "undefined") {
            return Promise.reject("No key or value provided.");
        }
        value = key;
        key = undefined;
    }
    if(typeof value !== "number") {
        return Promise.reject("Value is NaN.");
    }

    return validatePair(namespace, key).then(function(path) {
        return crossfetch(`${BASE_API_PATH}/set/${path}?value=${value}`, {
            qs: {
                value: value
            }
        }).then(res => {
            if (res.status == 200 ||
                res.status == 403 ||
                res.status == 404) {
                return res.json();
            }
            throw new Error("Response from server: " + res.status);
        });
    });
}