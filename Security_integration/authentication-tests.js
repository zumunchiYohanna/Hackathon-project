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
function testCustomerAccessToRiderEndpoint(userRole) {
    if (userRole !== 'rider') {
        return {
            success: false,
            message: 'Access denied: Customer cannot access rider endpoint.'
        };
    }

    return {
        success: true,
        message: 'Rider endpoint access granted.'
    };
}
function testRiderAccessToCustomerEndpoint(userRole) {
    if (userRole !== 'customer') {
        return {
            success: false,
            message: 'Access denied: Rider cannot access customer endpoint.'
        };
    }

    return {
        success: true,
        message: 'Customer endpoint access granted.'
    };
}
function testBusinessAccessToOtherBusinessData(userBusinessId, requestedBusinessId) {
    if (userBusinessId !== requestedBusinessId) {
        return {
            success: false,
            message: 'Access denied: Business cannot access another business data.'
        };
    }

    return {
        success: true,
        message: 'Business data access granted.'
    };
}
function testAdminAccess(userRole) {
    if (userRole !== 'admin') {
        return {
            success: false,
            message: 'Access denied: Admin authorization required.'
        };
    }

    return {
        success: true,
        message: 'Admin access granted.'
    };
}

module.exports = {
    testIncorrectPassword,
    testMissingCredentials,
    testInvalidAuthentication,
    testUnauthorizedAccess,
    testCustomerAccessToRiderEndpoint,
    testRiderAccessToCustomerEndpoint,
    testBusinessAccessToOtherBusinessData,
    testAdminAccess
};