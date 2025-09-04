#!/usr/bin/env node

const CLERK_SECRET_KEY = "sk_test_aRkqvGQ6cfUPFlax3rj0tFqXR9dvXNtcy8YlPVxCZH";

async function setAdminRole(userId) {
  try {
    console.log(`Setting admin role for user: ${userId}`);

    const response = await fetch(
      `https://api.clerk.com/v1/users/${userId}/metadata`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicMetadata: {
            role: "admin",
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Error:", error);
      return false;
    }

    const result = await response.json();
    console.log("Success! User updated:", result);
    return true;
  } catch (error) {
    console.error("Error setting admin role:", error);
    return false;
  }
}

// Get user ID from command line argument
const userId = process.argv[2];

if (!userId) {
  console.log("Usage: node scripts/set-admin.js <userId>");
  console.log("Example: node scripts/set-admin.js user_2abc123def456");
  process.exit(1);
}

setAdminRole(userId).then((success) => {
  if (success) {
    console.log("✅ Admin role set successfully!");
  } else {
    console.log("❌ Failed to set admin role");
    process.exit(1);
  }
});
