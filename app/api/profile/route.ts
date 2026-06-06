import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../../models/user";
import Profile from "../../../models/profile";

// Helper function to ensure database connection
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

/**
 * GET - Fetch combined user and profile details by email
 * Example: GET /api/profile?email=user@example.com
 */

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    // 1. Find user by email (excluding soft-deleted users)
    // Extracting only name, email, and profilePicture (profileimg)
    const user = await User.findOne({ email, isDeleted: false }).select("name email profilePicture");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Find associated profile using the userId
    const profile = await Profile.findOne({ userId: user._id });

    // 3. Combine both datasets into a single object
    const combinedData = {
      userId: user._id,
      name: user.name,
      email: user.email,
      profileimg: user.profilePicture, // Aliased to match your prompt requirement
      department: profile?.department || "",
      semester: profile?.semester || "",
      institute: profile?.institute || "",
      dateOfBirth: profile?.dateOfBirth || null,
    };

    return NextResponse.json({ success: true, data: combinedData }, { status: 200 });

  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PUT - Update user and profile details
 * Example: PUT /api/profile?email=user@example.com
 */
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    const body = await req.json();
    
    // 1. Find user by email
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Update user collection fields if they are provided in the payload
    if (body.name !== undefined) user.name = body.name;
    if (body.profileimg !== undefined) user.profilePicture = body.profileimg;
    await user.save();

    // 3. Prepare profile collection fields
    const profileUpdates: any = {};
    if (body.department !== undefined) profileUpdates.department = body.department;
    if (body.semester !== undefined) profileUpdates.semester = body.semester;
    if (body.institute !== undefined) profileUpdates.institute = body.institute;

    // 4. Update or create the profile using upsert (creates if it doesn't exist)
    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: profileUpdates },
      { new: true, upsert: true }
    );

    // Return fresh payload indicating success
    // Re-uses GET logic essentially to return the unified state
    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
