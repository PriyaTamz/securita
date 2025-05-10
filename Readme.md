# Role-Based Hierarchy Diagram

SuperAdmin
├── Creates Organizations
│   └── Organization Admin
│       └── Creates Users
├── Creates Global Users
│   ├── Can Be Activated/Deactivated
│   └── MFA Can Be Enabled
└── Login (Hardcoded Credentials)

Organization Admin
├── Login (Credentials from SuperAdmin)
├── Creates Users (within Organization)
├── Creates Groups
│   └── Adds Users to Groups
└── Get All Groups

Users
├── Login (Credentials from SuperAdmin or Org Admin)
│   ├── If MFA Disabled → Proceed with JWT
│   └── If MFA Enabled → Verify MFA and Proceed with JWT
└── View Own Groups

---

### Role-Based Access in the Securita

**1. Superadmin**

**Purpose** - Master controller. Manages entire system including organizations and admins. 

**Can Create** - Admins, Organizations, Users

**Can Access** - All organizations, All user management operation: create, update, delete, activate, MFA setup 

**Notes** - Top-level access. Only role that can create other admins.

**2. Organization Admin**

**Purpose** - Organization-level manager. Manages users within assigned organization.

**Can Create** - Users, Groups

**Can Access** - Their organization's users, Their organization details, Groups they created, All user management operation: create, update, delete, activate, MFA setup

**Notes** - Limited to their organization. Cannot create other admins or organizations. Can log in and access their own profile and data.

**3. user**

**Purpose** - A standard user who belongs to an organization.

**Can Create** -

**Can Access** - MFA login  

**Notes** - Cannot create anything. Operates within limits defined by admin/superadmin.     

---

# SECURITA - Clientless Remote Desktop Gateway

**SECURITA** is a role-based remote desktop gateway system. It provides secure access and management features with a clear user role hierarchy and MFA support.

# Securita Backend & Database Documentation

## Database Name: Autointelli

## Database: MongoDB

### Collection: `role`

| Field     | Type   | Required | Default  | Description                      |
| --------- | ------ | -------- | -------- | -------------------------------- |
| username  | String | Yes      |          | Username of the role             |
| password  | String | Yes      |          | Hashed password                  |
| role      | String | Yes      |          | Role type (superadmin/admin/...) |
| createdAt | Date   | No       | Date.now | Record creation timestamp        |
| updatedAt | Date   | No       | Date.now | Record last update timestamp     |

---

### Collection: `user`

| Field        | Type     | Required | Default  | Description                  |
| ------------ | -------- | -------- | -------- | ---------------------------- |
| username     | String   | Yes      |          | Unique user login ID         |
| password     | String   | Yes      |          | Hashed password              |
| firstName    | String   | Yes      |          | First name                   |
| lastName     | String   | Yes      |          | Last name                    |
| email        | String   | Yes      |          | Email address                |
| phone        | String   | Yes      |          | Phone number                 |
| timeZone     | String   | No       |          | User time zone               |
| mfaSecret    | String   | No       | null     | MFA secret if 2FA is enabled |
| mfaEnabled   | Boolean  | No       | false    | MFA status                   |
| isLdapUser   | Boolean  | No       | false    | Is user LDAP-based           |
| isActive     | Boolean  | No       | true     | Active/inactive status       |
| organization | ObjectId | Yes      |          | Ref to `organization`        |
| createdBy    | ObjectId | Yes      |          | Ref to creator in `role`     |
| createdAt    | Date     | No       | Date.now | Created timestamp            |
| updatedAt    | Date     | No       | Date.now | Last updated                 |

---

### Collection: `admins`

| Field        | Type     | Required | Default  | Description                         |
| ------------ | -------- | -------- | -------- | ----------------------------------- |
| username     | String   | Yes      |          | Admin's username                    |
| password     | String   | Yes      |          | Hashed password                     |
| role         | String   | Yes      |          | Admin role                          |
| organization | ObjectId | Yes      |          | Ref to `organization` collection    |
| createdBy    | ObjectId | No       |          | Ref to creator in `role` collection |
| createdAt    | Date     | No       | Date.now | Timestamp of creation               |
| updatedAt    | Date     | No       | Date.now | Timestamp of update                 |

---

### Collection: `group`

| Field        | Type        | Required | Default  | Description                      |
| ------------ | ----------- | -------- | -------- | -------------------------------- |
| name         | String      | Yes      |          | Name of the group (unique)       |
| users        | [ObjectId]  | No       |          | Array of user IDs (ref: `User`)  |
| organization | ObjectId    | No       |          | Ref to `organization` collection |
| createdAt    | Date        | No       | Date.now | Timestamp of group creation      |

---

### Collection: `organization`

| Field        | Type     | Required | Default  | Description                         |
| ------------ | -------- | -------- | -------- | ----------------------------------- |
| organization | String   | Yes      |          | Organization name (unique)          |
| createdBy    | ObjectId | Yes      |          | Ref to creator in `role` collection |
| createdAt    | Date     | No       | Date.now | Creation timestamp                  |
| updatedAt    | Date     | No       | Date.now | Last updated                        |

---

## Authentication Middleware Used

* `isAuthenticated`: Checks login status via token
* `authorizeRoles("roles")`: Grants access based on roles

---

## Role Hierarchy

1. **SuperAdmin**
2. **Organization Admin**
3. **User**

---

## SuperAdmin Credentials (Hardcoded)

- **Username:** `superadmin`
- **Password:** `superadmin@123`
 
---

## API Documentation

### SuperAdmin Capabilities

- **Login**
  - `POST /api/role/admin/login` → SuperAdmin Login (Hardcoded)

- **Organization Management**
  - `POST /api/user/create/organization` → Create Organization
  - `GET /api/user/organization` → Get All Organizations
  - `GET /api/user/get/organization/:id` → Get Organization by ID

- **Admin Management**
  - `POST /api/user/create/admin` → Create Admin

- **User Management**
  - `POST /api/user/create` → Create User
  - `GET /api/user/get` → Get All Users
  - `GET /api/user/getbyId/:id` → Get User by ID
  - `PUT /api/user/update/:id` → Update User
  - `DELETE /api/user/delete/:id` → Deactivate User (`isActive: false`)
  - `PATCH /api/user/activate/:id` → Activate User (`isActive: true`)
  - `POST /api/user/generate-mfa/:id` → Generate MFA for User

---

### Organization Admin Capabilities

- **Login**
  - `POST /api/admin/login` → Organization Admin Login (credentials from SuperAdmin)

- **Group Management**
  - `POST /api/admin/create/group` → Create Group (Add User to Group)
  - `GET /api/admin/group` → Get All Groups

---

### User Capabilities

- **Login**
  - `POST /api/auth/user/login` → User Login (credentials from SuperAdmin or Admin)

- **MFA Verification**
  - `POST /api/auth/user/verify-mfa` → Verify MFA (if MFA enabled)

---

## Technologies Used

- Node.js
- MongoDB
- Express.js
- JWT for Authentication
- Role-based Access Control
- Google Authenticator-compatible MFA (TOTP)

---

