# SECURITA Gateway API Documentation

**Base URL:**  `http://localhost:3001`

## Super Admin

### 1. Superadmin Login

**Endpoint:** POST `/api/role/admin/login`

**Request Body**
```json
{
    "username": "superadmin",
    "password": "superadmin",
}
```

**Response**
```json
{
    "message": "Login successful for superadmin",
    "id": "680dfc807b767d30080caf05",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGRmYzgwN2I3NjdkMzAwODBjYWYwNSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzQ2NTk4MDIzLCJleHAiOjE3NDY2ODQ0MjN9.KiVpscR0svJc_xa61dSiNfsXPyecigd9FzImrdtoPPQ",
    "role": "superadmin"
}
```

### 2. Superadmin Create Organization

**Endpoint:** POST `/api/user/create/organization`

**Request Body**
```json
{
    "organization": "Google"
}
```

**Response**
```json
{
    "message": "Organization created successfully",
    "org": {
        "organization": "Google",
        "createdBy": "680dfc807b767d30080caf05",
        "_id": "6815bc59f4a13469e2689c5c",
        "createdAt": "2025-05-07T06:12:42.288Z",
        "updatedAt": "2025-05-07T06:12:42.288Z",
        "__v": 0
    }
}
```

### 3. Superadmin Get All Organization

**Endpoint:** GET `/api/user/organization`

**Response**
```json
{
    "orgs": [
        {
            "_id": "68146decea661f7de5eb87a0",
            "organization": "UPS",
            "createdBy": "680dfc807b767d30080caf05"
        },
        {
            "_id": "6815bc59f4a13469e2689c5c",
            "organization": "Google",
            "createdBy": "680dfc807b767d30080caf05"
        },
        {
            "_id": "68186cb34b0390bdc27f1f8c",
            "organization": "TCS",
            "createdBy": "680dfc807b767d30080caf05"
        }
    ]
}
```

### 4. Superadmin Get Organization By ID

**Endpoint:** GET `/api/user/get/organization/681c85fa32378bb216a125c3`

**Response**
```json
{
    "orgs": {
        "_id": "681c85fa32378bb216a125c3",
        "organization": "UPS",
        "createdBy": "680dfc807b767d30080caf05",
        "createdAt": "2025-05-08T10:22:50.756Z",
        "updatedAt": "2025-05-08T10:22:50.756Z",
        "__v": 0
    },
    "userCount": 2,
    "admins": [
        {
            "_id": "681c863932378bb216a125ca",
            "username": "Priya"
        }
    ]
}
```

### 5. Superadmin Create Admin

**Endpoint:** POST `/api/user/create/admin`

**Request Body**
```json
{
    "organizationId": "681c85fa32378bb216a125c3", 
    "username": "Priya", 
    "password": "123456"
}
```

**Response**
```json
{
    "message": "Admin created successfully",
    "admin": {
        "username": "Priya",
        "password": "<hashed_password>",
        "role": "admin",
        "organization": "68146decea661f7de5eb87a0",
        "_id": "681afc42ca5f923eb4424b8c",
        "createdAt": "2025-05-07T06:22:58.858Z",
        "updatedAt": "2025-05-07T06:22:58.858Z",
        "__v": 0
    }
}
```

### 6. Superadmin Create User

**Endpoint:** POST `/api/user/create`

**Request Body**
```json
{
    "organizationId": "68146decea661f7de5eb87a0",
    "username": "Vishnu",
    "password": "123456",
    "firstName": "Vishnu",
    "lastName": "Priya",
    "email": "priya@gmail.com",
    "phone": "9940995669"
}
```

**Response**
```json
{
    "message": "User created successfully",
    "user": {
        "username": "Vishnu",
        "password": "$2b$10$m/oJjTc8LT/KOIJ8fsG4Nu7M4QDeTznQNOaE6R5PxpJzDitKe4Jmq",
        "firstName": "Vishnu",
        "lastName": "Priya",
        "email": "priya@gmail.com",
        "phone": "9940995669",
        "mfaSecret": null,
        "mfaEnabled": false,
        "isLdapUser": false,
        "isActive": true,
        "organization": "68146decea661f7de5eb87a0",
        "createdBy": "680dfc807b767d30080caf05",
        "_id": "681afcd5ca5f923eb4424b90",
        "createdAt": "2025-05-07T06:25:25.321Z",
        "updatedAt": "2025-05-07T06:25:25.321Z",
        "__v": 0
    }
}
```

### 7. Superadmin Get All User

**Endpoint:** GET `/api/user/get`

**Response**
```json
{
    "users": [
        {
            "_id": "6819c1742507c487f7b972c6",
            "username": "Saranya",
            "firstName": "Saranya",
            "lastName": "Raj",
            "email": "sarnya@gmail.com",
            "phone": "9940995669",
            "mfaEnabled": false,
            "isLdapUser": false,
            "isActive": true,
            "organization": {
                "_id": "68146decea661f7de5eb87a0",
                "organization": "UPS",
                "createdBy": "680dfc807b767d30080caf05",
                "createdAt": "2025-05-02T07:02:04.851Z",
                "updatedAt": "2025-05-02T07:02:04.852Z",
                "__v": 0
            },
            "createdBy": "680dfc807b767d30080caf05",
            "createdAt": "2025-05-06T07:59:48.840Z",
            "updatedAt": "2025-05-06T07:59:48.840Z",
            "__v": 0
        },
        {
            "_id": "6819c1a82507c487f7b972ca",
            "username": "Dharshni",
            "firstName": "Dharshni",
            "lastName": "Raj",
            "email": "dhars@gmail.com",
            "phone": "9940995669",
            "mfaEnabled": true,
            "isLdapUser": false,
            "isActive": true,
            "organization": {
                "_id": "68146decea661f7de5eb87a0",
                "organization": "UPS",
                "createdBy": "680dfc807b767d30080caf05",
                "createdAt": "2025-05-02T07:02:04.851Z",
                "updatedAt": "2025-05-02T07:02:04.852Z",
                "__v": 0
            },
            "createdBy": "680dfc807b767d30080caf05",
            "createdAt": "2025-05-06T08:00:40.723Z",
            "updatedAt": "2025-05-06T08:00:40.723Z",
            "__v": 0
        },
        {
            "_id": "681afcd5ca5f923eb4424b90",
            "username": "Vishnu",
            "firstName": "Vishnu",
            "lastName": "Priya",
            "email": "priya@gmail.com",
            "phone": "9940995669",
            "mfaEnabled": false,
            "isLdapUser": false,
            "isActive": true,
            "organization": {
                "_id": "68146decea661f7de5eb87a0",
                "organization": "UPS",
                "createdBy": "680dfc807b767d30080caf05",
                "createdAt": "2025-05-02T07:02:04.851Z",
                "updatedAt": "2025-05-02T07:02:04.852Z",
                "__v": 0
            },
            "createdBy": "680dfc807b767d30080caf05",
            "createdAt": "2025-05-07T06:25:25.321Z",
            "updatedAt": "2025-05-07T06:25:25.321Z",
            "__v": 0
        }
    ]
}
```

### 8. Superadmin Get All User By ID

**Endpoint:** GET `/api/user/getbyId/6819c1a82507c487f7b972ca`

**Response**
```json
{
    "user": {
        "_id": "6819c1a82507c487f7b972ca",
        "username": "Dharshni",
        "firstName": "Dharshni",
        "lastName": "Raj",
        "email": "dhars@gmail.com",
        "phone": "9940995669",
        "mfaEnabled": true,
        "isLdapUser": false,
        "isActive": true,
        "organization": {
            "_id": "68146decea661f7de5eb87a0",
            "organization": "UPS",
            "createdBy": "680dfc807b767d30080caf05",
            "createdAt": "2025-05-02T07:02:04.851Z",
            "updatedAt": "2025-05-02T07:02:04.852Z",
            "__v": 0
        },
        "createdBy": "680dfc807b767d30080caf05",
        "createdAt": "2025-05-06T08:00:40.723Z",
        "updatedAt": "2025-05-06T08:00:40.723Z",
        "__v": 0
    }
}
```

### 9. Superadmin Update User

**Endpoint:** PUT `/api/user/update/681afcd5ca5f923eb4424b90`

**Request Body**
```json
{
    "username": "Vishnu",
    "password": "123456",
    "firstName": "Vishnu",
    "lastName": "Priya",
    "email": "vishnupriya@gmail.com",
    "phone": "9940995669"
}
```

**Response**
```json
{
    "message": "User updated successfully",
    "user": {
        "_id": "681afcd5ca5f923eb4424b90",
        "username": "Vishnu",
        "firstName": "Vishnu",
        "lastName": "Priya",
        "email": "vishnupriya@gmail.com",
        "phone": "9940995669",
        "mfaEnabled": false,
        "isLdapUser": false,
        "isActive": true,
        "organization": {
            "_id": "68146decea661f7de5eb87a0",
            "organization": "UPS",
            "createdBy": "680dfc807b767d30080caf05",
            "createdAt": "2025-05-02T07:02:04.851Z",
            "updatedAt": "2025-05-02T07:02:04.852Z",
            "__v": 0
        },
        "createdBy": "680dfc807b767d30080caf05",
        "createdAt": "2025-05-07T06:25:25.321Z",
        "updatedAt": "2025-05-07T06:42:11.884Z",
        "__v": 0
    }
}
```

### 10. Superadmin Delete or Deactivate User

**Endpoint:** DELETE `/api/user/delete/681afcd5ca5f923eb4424b90`

**Response**
```json
{
    "message": "User deactivated (soft deleted)"
}
```

### 11. Superadmin Activate User

**Endpoint:** PATCH `/api/user/activate/681afcd5ca5f923eb4424b90`

**Response**
```json
{
    "message": "User account activated"
}
```

### 12. Superadmin Generate Multi-factor Authentication for User

**Endpoint:** POST `/api/user/generate-mfa/681afcd5ca5f923eb4424b90`

**Response**
```json
{
    "message": "MFA enabled successfully.",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAADECAYAAADApo5rAAAAAklEQVR4......",
    "secret": "KM7FIVR4HAXTOVBKONRFQN3PGRBTAUDVKNXHWOZREVWXSKCVKJRA"
}
```

## Organization Admin

### 13. Admin Login 

**Endpoint:** POST `/api/admin/login`

**Request Body**
```json
{
    "username": "Mohan",
    "password": "123456",
    "role": "admin"
}
```

**Response**
```json
{
    "message": "Admin logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWFlNWUwMzFlMjAwN2ZmNDhjYTU4ZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjYwMDgxMywiZXhwIjoxNzQ2Njg3MjEzfQ.x3kIeRUTptBwJIASkj4Nw30sOm29BDsc2YLb0sWm4vs",
    "adminId": "681ae5e031e2007ff48ca58d"
}
```

### 14. Admin Create Group for User 

**Endpoint:** POST `/api/admin/create/group`

**Request Body**
```json
{
  "name": "TestGroup",
  "userIds": ["6819c1a82507c487f7b972ca", "681a0108ecbc3af727b9bc53"],
  "organizationId": "68146decea661f7de5eb87a0"
}
```

**Response**
```json
{
    "message": "Group created successfully",
    "group": {
        "name": "TestGroup",
        "users": [
            "6819c1a82507c487f7b972ca",
            "681a0108ecbc3af727b9bc53"
        ],
        "organization": "68146decea661f7de5eb87a0",
        "_id": "681b0411ca5f923eb4424bb0",
        "createdAt": "2025-05-07T06:56:17.890Z",
        "__v": 0
    }
}
```

### 15. Admin Get All User Group

**Endpoint:** GET `/api/admin/group`

**Response**
```json
{
    "groups": [
        {
            "_id": "681b0411ca5f923eb4424bb0",
            "name": "TestGroup",
            "users": [
                "6819c1a82507c487f7b972ca",
                "681a0108ecbc3af727b9bc53"
            ],
            "organization": "68146decea661f7de5eb87a0",
            "createdAt": "2025-05-07T06:56:17.890Z",
            "__v": 0
        }
    ]
}
```

## User

### 16. user Login (MFA not enable)

**Endpoint**: POST `/api/auth/user/login`

**Request Body**
```json
{
    "username": "Saranya",
    "password": "123456"
}
```

**Response**
```json
{
    "message": "User logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTljMTc0MjUwN2M0ODdmN2I5NzJjNiIsImlhdCI6MTc0NjYwMTMwMn0.-fl6o5YVmoQeyGCghCl4KVvsPGcscbY4H0rn9YLNJ_E",
    "userId": "6819c1742507c487f7b972c6"
}
```

### 17. user Login (MFA enable)

**Endpoint**: POST `/api/auth/user/login`

**Request Body**
```json
{
    "username": "Saranya",
    "password": "123456"
}
```

**Response**
```json
{
    "message": "MFA required",
    "userId": "6819c1742507c487f7b972c6"
}
```

### 18. User Verify MFA (MFA enable)

**Endpoint**: POST `/api/auth/user/verify-mfa`

**Request Body**
```json
{
  "userId": "6819c1742507c487f7b972c6",
  "token": "529646" 
}
```

**Response**
```json
{
    "message": "MFA verification successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTljMTc0MjUwN2M0ODdmN2I5NzJjNiIsImlhdCI6MTc0NjYwMjEwOSwiZXhwIjoxNzQ2Njg4NTA5fQ.4QpxubXRb5s2dwPpl7TLnfPvIvhox2SppwXE8nJqfi8"
}
```