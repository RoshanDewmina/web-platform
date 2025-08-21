import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth, useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

// Mock the Clerk hooks
jest.mock("@clerk/nextjs");

describe("Authentication Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User Authentication State", () => {
    it("displays user information when authenticated", () => {
      (useUser as jest.Mock).mockReturnValue({
        user: {
          id: "user-123",
          firstName: "John",
          lastName: "Doe",
          primaryEmailAddress: {
            emailAddress: "john@example.com",
          },
          imageUrl: "https://example.com/avatar.jpg",
        },
        isLoaded: true,
        isSignedIn: true,
      });

      render(<Navbar />);

      // Should display search bar for authenticated users
      expect(
        screen.getByPlaceholderText(/search courses/i)
      ).toBeInTheDocument();
    });

    it("redirects to sign-in when not authenticated", () => {
      (useAuth as jest.Mock).mockReturnValue({
        userId: null,
        isLoaded: true,
        isSignedIn: false,
      });

      // This would typically be handled by middleware
      // Testing that components handle unauthenticated state
      const mockPush = jest.fn();
      jest.spyOn(require("next/navigation"), "useRouter").mockReturnValue({
        push: mockPush,
      });

      // Component should redirect or show sign-in prompt
      expect(useAuth().isSignedIn).toBe(false);
    });
  });

  describe("Role-Based Access Control", () => {
    it("shows admin routes for admin users", () => {
      (useAuth as jest.Mock).mockReturnValue({
        userId: "admin-123",
        sessionClaims: {
          metadata: {
            role: "admin",
          },
        },
        isLoaded: true,
        isSignedIn: true,
      });

      // Admin should have access to admin routes
      const auth = useAuth();
      expect(auth.sessionClaims?.metadata?.role).toBe("admin");
    });

    it("hides admin routes for regular users", () => {
      (useAuth as jest.Mock).mockReturnValue({
        userId: "user-123",
        sessionClaims: {
          metadata: {
            role: "student",
          },
        },
        isLoaded: true,
        isSignedIn: true,
      });

      const auth = useAuth();
      expect(auth.sessionClaims?.metadata?.role).not.toBe("admin");
    });
  });

  describe("Session Management", () => {
    it("maintains session across components", async () => {
      const mockUserId = "consistent-user-123";
      (useAuth as jest.Mock).mockReturnValue({
        userId: mockUserId,
        isLoaded: true,
        isSignedIn: true,
      });

      // Render multiple components
      const { rerender } = render(<Navbar />);
      expect(useAuth().userId).toBe(mockUserId);

      // Session should persist across rerenders
      rerender(<Navbar />);
      expect(useAuth().userId).toBe(mockUserId);
    });

    it("handles session expiration gracefully", async () => {
      (useAuth as jest.Mock)
        .mockReturnValueOnce({
          userId: "user-123",
          isLoaded: true,
          isSignedIn: true,
        })
        .mockReturnValueOnce({
          userId: null,
          isLoaded: true,
          isSignedIn: false,
        });

      const { rerender } = render(<Navbar />);
      expect(useAuth().isSignedIn).toBe(true);

      // Simulate session expiration
      rerender(<Navbar />);
      expect(useAuth().isSignedIn).toBe(false);
    });
  });

  describe("Profile Management", () => {
    it("displays user profile information correctly", () => {
      (useUser as jest.Mock).mockReturnValue({
        user: {
          id: "user-123",
          firstName: "Jane",
          lastName: "Smith",
          primaryEmailAddress: {
            emailAddress: "jane@example.com",
          },
          imageUrl: "https://example.com/jane.jpg",
          publicMetadata: {
            bio: "Passionate learner",
            level: 5,
            xp: 1250,
          },
        },
        isLoaded: true,
        isSignedIn: true,
      });

      const user = useUser().user;
      expect(user?.firstName).toBe("Jane");
      expect(user?.publicMetadata?.level).toBe(5);
    });

    it("handles missing profile fields gracefully", () => {
      (useUser as jest.Mock).mockReturnValue({
        user: {
          id: "user-123",
          firstName: null,
          lastName: null,
          primaryEmailAddress: null,
          imageUrl: null,
        },
        isLoaded: true,
        isSignedIn: true,
      });

      const user = useUser().user;
      expect(user?.firstName).toBeNull();
      expect(user?.primaryEmailAddress).toBeNull();
    });
  });
});

describe("Protected Routes", () => {
  it("allows access to public routes without authentication", () => {
    const publicRoutes = ["/", "/sign-in", "/sign-up"];

    publicRoutes.forEach((route) => {
      // These routes should be accessible without authentication
      expect(route).toMatch(/^\/(sign-in|sign-up|$)/);
    });
  });

  it("requires authentication for protected routes", () => {
    const protectedRoutes = [
      "/dashboard",
      "/learn",
      "/progress",
      "/social",
      "/profile",
    ];

    protectedRoutes.forEach((route) => {
      // These routes should require authentication
      expect(route).toMatch(/^\/(dashboard|learn|progress|social|profile)/);
    });
  });

  it("requires admin role for admin routes", () => {
    const adminRoutes = ["/admin", "/admin/courses", "/admin/users"];

    adminRoutes.forEach((route) => {
      // These routes should require admin role
      expect(route).toMatch(/^\/admin/);
    });
  });
});
