# SECURITA - Clientless Remote Desktop Gateway

**SECURITA** is a role-based remote desktop gateway system. It provides secure access and management features with a clear user role hierarchy and MFA support.

## Role-Based Hierarchy Diagram

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

