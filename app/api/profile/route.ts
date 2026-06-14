import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../../models/user";
import Profile from "../../../models/profile";

// ─── DB Connection ────────────────────────────────────────────────────────────

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

// ─── Helper: Build combined response object ───────────────────────────────────

function buildCombinedData(user: any, profile: any) {
  return {
    userId: user._id,
    name: user.name ?? null,
    email: user.email,
    profileimg: user.profilePicture ?? null,
    department: profile?.department ?? null,
    semester: profile?.semester ?? null,
    institute: profile?.institute ?? null,
    dateOfBirth: profile?.dateOfBirth ?? null,
  };
}

// ─── Helper: Save FCM token if provided ──────────────────────────────────────

async function saveFcmToken(user: any, fcmToken?: string, device?: string) {
  if (!fcmToken) return;
  try {
    await user.addFcmToken(fcmToken, device ?? "unknown");
  } catch (err) {
    // Non-fatal — log and continue
    console.warn("FCM token save failed:", err);
  }
}

// ─── POST /api/profile ────────────────────────────────────────────────────────
// Called after Google Sign-In.
// If user exists → return their data.
// If user does not exist → create user + profile.

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, username, profileimg, fcmToken, device } = body; // ← ADD fcmToken, device

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (user.isDeleted) {
        return NextResponse.json(
          { success: false, error: "This account has been deleted." },
          { status: 403 }
        );
      }

      // ── Update FCM token on every login (token can rotate) ────────────
      await saveFcmToken(user, fcmToken, device);
      // ──────────────────────────────────────────────────────────────────

      const profile = await Profile.findOne({ userId: user._id });

      return NextResponse.json(
        {
          success: true,
          isNewUser: false,
          message: "User found.",
          data: buildCombinedData(user, profile),
        },
        { status: 200 }
      );
    }

    // Create new user
    user = await User.create({
      email: normalizedEmail,
      name: username ?? null,
      profilePicture: profileimg ?? null,
    });

    // ── Save FCM token for newly created user ──────────────────────────
    await saveFcmToken(user, fcmToken, device);
    // ──────────────────────────────────────────────────────────────────

    // Create blank profile
    const profile = await Profile.create({
      userId: user._id,
      department: null,
      semester: null,
      institute: null,
      dateOfBirth: null,
    });

    return NextResponse.json(
      {
        success: true,
        isNewUser: true,
        message: "New user created.",
        data: buildCombinedData(user, profile),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ─── GET /api/profile?email=user@example.com ──────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isDeleted: false,
    }).select("name email profilePicture");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    const profile = await Profile.findOne({ userId: user._id });

    return NextResponse.json(
      {
        success: true,
        data: buildCombinedData(user, profile),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/profile?email=user@example.com ──────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, profileimg, department, semester, institute, fcmToken, device } = body; // ← ADD fcmToken, device

    if (
      name === undefined &&
      profileimg === undefined &&
      department === undefined &&
      semester === undefined &&
      institute === undefined &&
      fcmToken === undefined // ← ADD
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No updatable fields provided. Allowed: name, profileimg, department, semester, institute, fcmToken.",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isDeleted: false,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    // Update user fields
    if (name !== undefined) user.name = name.trim();
    if (profileimg !== undefined) user.profilePicture = profileimg;
    await user.save();

    // ── Update FCM token if provided (e.g. token refresh) ─────────────
    await saveFcmToken(user, fcmToken, device);
    // ──────────────────────────────────────────────────────────────────

    const profileUpdates: Record<string, any> = {};
    if (department !== undefined) profileUpdates.department = department.trim();
    if (semester !== undefined) profileUpdates.semester = semester;
    if (institute !== undefined) profileUpdates.institute = institute.trim();

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: profileUpdates },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        data: buildCombinedData(user, profile),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
