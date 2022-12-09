const isValidRequestBody = (val) => {
    return Object.keys(val)
}

const isValidField = function (val) {
    if (typeof val === 'undefined' || val === null) return false;
    if (typeof val === 'string' && val.trim().length === 0) return false;
    return true
}

const isValidName = function (val) {
    return (/^[a-z A-Z ]{2,30}$/.test(val.trim()))
}

const isValidMobile = function (val) {
    return (/^[6-9]{1}[0-9]{9}$/.test(val))
}

const isValidEmail = function (val) {
    return (/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(val.trim()))
}

const isValidPassword = (val) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,15}$/.test(val.trim())
}

module.exports = {isValidRequestBody, isValidField, isValidName, isValidMobile, isValidEmail, isValidPassword}