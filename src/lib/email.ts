import sgMail from "@sendgrid/mail";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL!;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const msg = {
      to,
      from: FROM_EMAIL,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPEmailTemplate(name: string, otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your VibeArmor Account</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f0f; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">
            🛡️ VibeArmor
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #ffffff; opacity: 0.9;">
            Advance Your Career with Expert Guidance
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #ff6b35;">
            Verify Your Account
          </h2>
          
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
            Hi <strong style="color: #ffffff;">${name}</strong>,
          </p>
          
          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
            Welcome to VibeArmor! To complete your registration and start your journey to master Data Structures & Algorithms, please verify your email address using the OTP below:
          </p>

          <!-- OTP Box -->
          <div style="background-color: #2a2a2a; border: 2px solid #ff6b35; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #cccccc; text-transform: uppercase; letter-spacing: 1px;">
              Your Verification Code
            </p>
            <div style="font-size: 36px; font-weight: bold; color: #ff6b35; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #999999;">
              This code expires in 10 minutes
            </p>
          </div>

          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #999999;">
            If you didn't create an account with VibeArmor, please ignore this email.
          </p>

          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #333333;">
            <p style="margin: 0; font-size: 14px; color: #999999; text-align: center;">
              Ready to level up your coding skills? 🚀
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
            © 2024 VibeArmor. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 12px; color: #555555;">
            Master DSA • Expert Guidance • Top Coder Community
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getWelcomeEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to VibeArmor!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f0f; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">
            🛡️ VibeArmor
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #ffffff; opacity: 0.9;">
            Your Journey to Coding Excellence Begins Now!
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #ff6b35;">
            🎉 Welcome to the Community!
          </h2>
          
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
            Hi <strong style="color: #ffffff;">${name}</strong>,
          </p>
          
          <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
            Congratulations! 🎊 You've successfully joined <strong style="color: #ff6b35;">VibeArmor</strong> - your ultimate destination for mastering Data Structures & Algorithms and advancing your coding career.
          </p>

          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
            You're now part of a community of <strong style="color: #ff6b35;">4560+ learners</strong> who are transforming their coding skills and landing their dream jobs at top tech companies.
          </p>

          <!-- Features Box -->
          <div style="background-color: #2a2a2a; border-radius: 8px; padding: 30px; margin: 30px 0;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #ff6b35;">
              🚀 What's Available for You:
            </h3>
            
            <div style="margin-bottom: 15px;">
              <span style="color: #ff6b35; font-weight: bold;">📚 DSA Sheets:</span>
              <span style="color: #cccccc; margin-left: 10px;">Comprehensive problem sets curated by experts</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <span style="color: #ff6b35; font-weight: bold;">📝 Tech Blogs:</span>
              <span style="color: #cccccc; margin-left: 10px;">Latest technologies and coding concepts explained</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <span style="color: #ff6b35; font-weight: bold;">💻 Coding Problems:</span>
              <span style="color: #cccccc; margin-left: 10px;">Sharpen your problem-solving skills with challenges</span>
            </div>
            
            <div>
              <span style="color: #ff6b35; font-weight: bold;">🎯 Learning Paths:</span>
              <span style="color: #cccccc; margin-left: 10px;">Structured roadmaps to guide your journey</span>
            </div>
          </div>

          <!-- CTA Section -->
          <div style="text-align: center; margin: 40px 0;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #cccccc;">
              Ready to start your coding journey?
            </p>
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); display: inline-block; padding: 15px 30px; border-radius: 8px; text-decoration: none;">
              <span style="color: #ffffff; font-weight: bold; font-size: 16px;">
                🎯 Explore DSA Sheets
              </span>
            </div>
          </div>

          <div style="background-color: #2a2a2a; border-left: 4px solid #ff6b35; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; color: #cccccc; font-style: italic;">
              💡 <strong>Pro Tip:</strong> Start with our beginner-friendly DSA sheets and gradually work your way up. Consistency is key to mastering algorithms and landing your dream job!
            </p>
          </div>

          <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
            We're excited to see you grow and achieve your coding goals. If you have any questions, our community is here to help!
          </p>

          <p style="margin: 20px 0 0 0; font-size: 16px; color: #cccccc;">
            Happy Coding! 💻✨<br>
            <strong style="color: #ff6b35;">The VibeArmor Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #666666;">
            Follow us for daily coding tips and updates:
          </p>
          <div style="margin-bottom: 20px;">
            <span style="color: #ff6b35; margin: 0 10px;">🐦 Twitter</span>
            <span style="color: #ff6b35; margin: 0 10px;">💼 LinkedIn</span>
            <span style="color: #ff6b35; margin: 0 10px;">📱 Discord</span>
          </div>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
            © 2024 VibeArmor. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 12px; color: #555555;">
            Master DSA • Expert Guidance • Top Coder Community
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
