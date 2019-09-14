const crossfetch = require('cross-fetch');

const BASE_API_PATH = "https://api.countapi.xyz";
const validPattern = /^[A-Za-z0-9_\-.]{3,64}$/;
const validRegex = new RegExp(validPattern);

const validatePath = module.exports.validatePath = function(namespace, key) {
    if(typeof key === "undefined") {
        if(typeof namespace === "undefined") {
            return Promise.reject("Missing key");
        }
        key = namespace;
        namespace = undefined;
    }

    function validName(name) {
        return validRegex.test(name) || name === ':HOST:' || name === ':PATHNAME:';
    }

    return new Promise(function(resolve, reject) {
        if(!validName(key)) {
            reject(`Key must match ${validPattern}. Got '${namespace}'`);
            return;
        }
        if(!validName(namespace) && typeof namespace !== "undefined" && namespace !== null) {
            reject(`Namespace must match ${validPattern} or be empty. Got '${namespace}'`);
            return;
        }
        
        var path = '';
        if(typeof namespace !== "undefined")
            path += namespace + '/';
        path += key;
        
        resolve({
            path: path
        });
    });
}

const validateTuple = module.exports.validateTuple = function(namespace, key, value) {
    if(typeof value === "undefined") {
        if(typeof key === "undefined") {
            return Promise.reject("Missing key or value");
        }
        value = key;
        key = undefined;
    }
    if(typeof value !== "number") {
        return Promise.reject("Value is NaN");
    }

    return validatePath(namespace, key).then(function(result) {
        return Object.assign({}, { value: value }, result);
    });
}

function finalize(res) {
    const valid_responses = [200, 400, 403, 404];
    if (valid_responses.includes(res.status)) {
        return res.json().then(function(json) {
            if(res.status == 400)
                return Promise.reject(json.error);
            return Object.assign({}, {
                status: res.status,
                path: res.headers.get('X-Path')
            }, json);
        });
    }
    return Promise.reject("Response from server: " + res.status);
}

function queryParams(params) {
    return Object.keys(params || {})
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

module.exports.get = function(namespace, key) {
    return validatePath(namespace, key).then(function(result) {
        return crossfetch(`${BASE_API_PATH}/get/${result.path}`).then(finalize);
    });
};

module.exports.set = function(namespace, key, value) {
    return validateTuple(namespace, key, value).then(function(result) {
        return crossfetch(`${BASE_API_PATH}/set/${result.path}?value=${result.value}`).then(finalize);
    });
};

module.exports.update = function(namespace, key, amount) {
    return validateTuple(namespace, key, amount).then(function(result) {
        return crossfetch(`${BASE_API_PATH}/update/${result.path}?amount=${result.value}`).then(finalize);
    });
};

module.exports.hit = function(namespace, key) {
    return validatePath(namespace, key).then(function(result) {
        return crossfetch(`${BASE_API_PATH}/hit/${result.path}`).then(finalize);
    });
};

module.exports.info = function(namespace, key) {
    return validatePath(namespace, key).then(function(result) {
        return crossfetch(`${BASE_API_PATH}/info/${result.path}`).then(finalize);
    });
};

module.exports.create = function(options) {
    var params = queryParams(options);
    return crossfetch(`${BASE_API_PATH}/create${params.length > 0 ? '?' + params : ''}`).then(finalize);
};

module.exports.stats = function() {
    return crossfetch(`${BASE_API_PATH}/stats`).then(finalize);
};

module.exports.visits = function(page) {
    return this.hit(':HOST:', page ? page : ':PATHNAME:');
};

module.exports.event = function(name) {
    return this.hit(':HOST:', name);
};