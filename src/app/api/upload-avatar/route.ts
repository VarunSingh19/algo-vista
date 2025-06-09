// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import { uploadImage } from "@/lib/cloudinary";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// const JWT_SECRET =
//   process.env.JWT_SECRET || "your-fallback-secret-key-for-development";

// // Validation schema
// const uploadSchema = z.object({
//   image: z.string().min(1, "Image data is required"),
// });

// // Helper to check if user is authenticated
// function isAuthenticated(request: NextRequest) {
//   try {
//     const token = cookies().get("jwt")?.value;

//     if (!token) {
//       return false;
//     }

//     jwt.verify(token, JWT_SECRET);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Check if user is authenticated
//     if (!isAuthenticated(request)) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     // Parse and validate request body
//     const body = await request.json();
//     const validationResult = uploadSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         { error: validationResult.error.errors[0].message },
//         { status: 400 }
//       );
//     }

//     const { image } = validationResult.data;
//     const imageUrl = await uploadImage(image);

//     // Make sure imageUrl is the Cloudinary URL
//     console.log("Uploaded image URL:", imageUrl); // Debug log

//     return NextResponse.json({ url: imageUrl }, { status: 200 });
//   } catch (error) {
//     console.error("Upload avatar error:", error);
//     return NextResponse.json(
//       { error: "Failed to upload avatar" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadImage } from "@/lib/cloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-fallback-secret-key-for-development";

// Validation schema
const uploadSchema = z.object({
  image: z.string().min(1, "Image data is required"),
});

// Helper to check if user is authenticated
async function isAuthenticated(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      return false;
    }

    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    if (!(await isAuthenticated(request))) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = uploadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { image } = validationResult.data;

    // Add timeout and better error handling
    console.log("Starting image upload to Cloudinary...");
    const imageUrl = await uploadImage(image);
    console.log("Upload completed. Cloudinary URL:", imageUrl);

    // Validate that we got a proper Cloudinary URL
    if (!imageUrl || imageUrl.startsWith("data:")) {
      throw new Error("Invalid URL returned from Cloudinary");
    }

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload avatar error:", error);

    // Provide more specific error messages
    if (
      error instanceof Error &&
      (error.message.includes("timeout") || error.message.includes("Timeout"))
    ) {
      return NextResponse.json(
        {
          error:
            "Upload timeout. Please try with a smaller image or try again.",
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
