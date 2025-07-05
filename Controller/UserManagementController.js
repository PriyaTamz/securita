import User from "../Model/UserManagement.js";
import Admin from "../Model/Admin.js";
import Group from "../Model/Group.js";
import Organization from "../Model/Organization.js";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";

export const createOrganization = async (req, res) => {
  try {
    const { organization } = req.body;

    const existingOrg = await Organization.findOne({ organization });
    if (existingOrg) {
      return res.status(400).json({ message: "Organization already exists" });
    }

    const newOrg = new Organization({
      organization,
      createdBy: req.user.id,
    });

    await newOrg.save();
    res
      .status(201)
      .json({ message: "Organization created successfully", org: newOrg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrganization = async (req, res) => {
  try {
    const orgs = await Organization.find().select("-createdAt -updatedAt -__v");
    res.status(200).json({ orgs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const orgs = await Organization.findById(id);
    if (!orgs) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const users = await User.find({ organizations: id }).select("username");

    const userCount = users.length;

    const admins = await User.find({ adminOrganizations: id }).select(
      "username"
    );

    res.status(200).json({ orgs, userCount, users, admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      organizationIds,
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      timeZone,
      mfaEnabled,
    } = req.body;

    if (!Array.isArray(organizationIds) || organizationIds.length === 0) {
      return res
        .status(400)
        .json({ message: "organizationIds must be a non-empty array" });
    }

    const orgs = await Organization.find({ _id: { $in: organizationIds } });
    if (orgs.length !== organizationIds.length) {
      return res
        .status(400)
        .json({ message: "One or more organizations are invalid" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      organizations: organizationIds,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phone,
      role: "user",
      timeZone,
      mfaEnabled: false,
      mfaQrShown: false,
      createdBy: req.user.id,
    });

    // Generate MFA secret if MFA is requested
    if (mfaEnabled) {
      const secret = speakeasy.generateSecret({ name: `Securita (${email})` });
      newUser.mfaEnabled = true;
      newUser.mfaSecret = secret.base32;
      newUser.mfaQrShown = false;
    }

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        mfaEnabled: newUser.mfaEnabled,
      },
    });
  } catch (error) {
    console.error("createUser error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -mfaSecret")
      .populate("organizations");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersByOrganization = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const users = await User.find({ organizations: organizationId })
      .select(
        " -password -firstName -lastName -email -phone -mfaEnabled -mfaSecret -isLdapUser -isActive -adminOrganizations"
      )
      .populate("organizations");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password -mfaSecret")
      .populate("organizations");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      organizationIds,
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      timeZone,
      mfaEnabled,
    } = req.body;

    // Validate organization IDs if provided
    if (organizationIds) {
      const orgs = await Organization.find({ _id: { $in: organizationIds } });
      if (orgs.length !== organizationIds.length) {
        return res
          .status(400)
          .json({ message: "One or more organizations are invalid" });
      }
    }

    // Build update object
    const updateFields = {
      username,
      firstName,
      lastName,
      email,
      phone,
      timeZone,
      mfaEnabled,
      updatedAt: new Date(),
    };

    // Conditionally include optional fields
    if (organizationIds) updateFields.organizations = organizationIds; // or organizationIds if your schema uses that
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password -mfaSecret");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated (soft deleted)" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { organizationId, userId } = req.body;

    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(400).json({ message: "Invalid organization" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Inactive user cannot be made admin" });
    }

    // Add to adminOrganizations if not already added
    if (!user.adminOrganizations.includes(organizationId)) {
      user.adminOrganizations.push(organizationId);
    }

    // Update rolesByOrganization:
    const existingRoleIndex = user.rolesByOrganization.findIndex(
      (role) => role.organization.toString() === organizationId
    );

    if (existingRoleIndex !== -1) {
      // Update role to admin
      user.rolesByOrganization[existingRoleIndex].role = "admin";
    } else {
      // Add new entry
      user.rolesByOrganization.push({
        organization: organizationId,
        role: "admin",
      });
    }

    await user.save();

    res
      .status(200)
      .json({ message: "User assigned as admin successfully", user });
  } catch (error) {
    console.error("createAdmin error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAdminsByOrganization = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const admins = await User.find({ adminOrganizations: organizationId })
      .select(
        " -password -firstName -lastName -email -phone -mfaEnabled -mfaSecret -isLdapUser -isActive -organizations"
      )
      .populate("adminOrganizations");
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const { organizationId, userId } = req.body;

    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(400).json({ message: "Invalid organization" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.adminOrganizations.includes(organizationId)) {
      return res
        .status(400)
        .json({ message: "User is not an admin of this organization" });
    }

    // 1. Remove organizationId from adminOrganizations
    user.adminOrganizations = user.adminOrganizations.filter(
      (orgId) => orgId.toString() !== organizationId
    );

    // 2. Remove role from rolesByOrganization for this org *only if role is 'admin'*
    user.rolesByOrganization = user.rolesByOrganization.filter(
      (entry) =>
        !(
          entry.organization.toString() === organizationId &&
          entry.role === "admin"
        )
    );

    await user.save();

    res
      .status(200)
      .json({ message: "Admin rights removed successfully", user });
  } catch (error) {
    console.error("removeAdmin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "User account activated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enableMfaForUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.mfaEnabled) {
      return res
        .status(400)
        .json({ message: "MFA is already enabled for this user." });
    }

    const secret = speakeasy.generateSecret({
      name: `Securita (${user.email})`,
    });

    user.mfaEnabled = true;
    user.mfaSecret = secret.base32;
    await user.save();

    return res.status(200).json({ message: "MFA enabled successfully." });
  } catch (error) {
    console.error("Error enabling MFA:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, userIds, organizationId } = req.body;

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists" });
    }

    const usersExist = await User.find({ _id: { $in: userIds } });
    if (usersExist.length !== userIds.length) {
      return res.status(404).json({ message: "One or more users not found" });
    }

    const orgExists = await Organization.findById(organizationId);
    if (!orgExists) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Ensure all users belong to the given organization
    const invalidUsers = usersExist.filter(
      (user) =>
        !user.organizations.some((orgId) => orgId.toString() === organizationId)
    );

    if (invalidUsers.length > 0) {
      return res.status(400).json({
        message:
          "One or more users do not belong to the specified organization",
        invalidUserIds: invalidUsers.map((u) => u._id),
      });
    }

    const newGroup = new Group({
      name,
      users: userIds,
      organization: organizationId,
      createdBy: req.user.id,
    });

    await newGroup.save();

 
    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("users", "username email")
      .populate("organization", "organization");

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupsByOrg = async (req, res) => {
  try {
    const { organizationId } = req.params;

    console.log("Fetching groups for org:", organizationId);

    const groups = await Group.find({ organization: organizationId }) // ✅ correct key
      .populate("users", "username email")
      .populate("organization", "name");

    console.log("Groups found:", groups);

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, userIds, organizationId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Optional: check if new name already exists (exclude current group)
    const nameExists = await Group.findOne({ name, _id: { $ne: groupId } });
    if (nameExists) {
      return res.status(400).json({ message: "Group name already in use" });
    }

    const usersExist = await User.find({ _id: { $in: userIds } });
    if (usersExist.length !== userIds.length) {
      return res.status(404).json({ message: "One or more users not found" });
    }

    const orgExists = await Organization.findById(organizationId);
    if (!orgExists) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if all users belong to the organization
    const invalidUsers = usersExist.filter(
      (user) =>
        !user.organizations.some((orgId) => orgId.toString() === organizationId)
    );

    if (invalidUsers.length > 0) {
      return res.status(400).json({
        message:
          "One or more users do not belong to the specified organization",
        invalidUserIds: invalidUsers.map((u) => u._id),
      });
    }

    group.name = name;
    group.users = userIds;
    group.organization = organizationId;

    await group.save();

    res.status(200).json({ message: "Group updated successfully", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const deleted = await Group.findByIdAndDelete(groupId);

    if (!deleted) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
