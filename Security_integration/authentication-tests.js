// Authentication Security Testing Module

function testIncorrectPassword(correctPassword, providedPassword) {
    if (providedPassword !== correctPassword) {
        return {
            success: false,
            message: 'Login rejected: Incorrect password.'
        };
    }

    return {
        success: true,
        message: 'Login successful.'
    };
}

function testMissingCredentials(username, password) {
    if (!username || !password) {
        return {
            success: false,
            message: 'Login rejected: Username and password are required.'
        };
    }

    return {
        success: true,
        message: 'Credentials provided.'
    };
}
function testInvalidAuthentication(token) {
    if (!token || token === 'invalid' || token === 'expired') {
        return {
            success: false,
            message: 'Authentication rejected: Invalid or expired token.'
        };
    }

    return {
        success: true,
        message: 'Authentication successful.'
    };
}
function testUnauthorizedAccess(isAuthenticated) {
    if (!isAuthenticated) {
        return {
            success: false,
            message: 'Access denied: Authentication required.'
        };
    }

    return {
        success: true,
        message: 'Access granted.'
    };
}

module.exports = {
    testIncorrectPassword,
    testMissingCredentials,
    testInvalidAuthentication,
    testUnauthorizedAccess
};