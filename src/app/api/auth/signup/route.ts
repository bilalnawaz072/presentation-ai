import { hashPassword } from "@/lib/auth-utils";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name / Username is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // Hash password & create user
    const hashedPassword = hashPassword(password);

    const newUser = await db.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        hasAccess: true,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hasAccess: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);

    const errorMessage =
      error?.code === "P1001" || error?.message?.includes("Can't reach database")
        ? "Database server is unreachable. Please make sure PostgreSQL is running on port 5432 or update DATABASE_URL in .env."
        : error?.message || "Failed to create account. Please try again later.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
