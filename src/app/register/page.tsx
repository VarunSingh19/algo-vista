// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// // Form validation schema
// const registerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string().min(1, 'Confirm your password'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ['confirmPassword'],
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// export default function RegisterPage() {
//   const { register, mergeGuestProgress } = useAuth();
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   // Initialize form
//   const form = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   // Handle form submission
//   const onSubmit = async (values: RegisterFormValues) => {
//     try {
//       setError(null);
//       await register(values.name, values.email, values.password);

//       // Merge guest progress on successful registration
//       await mergeGuestProgress();

//       // Redirect to dashboard
//       router.push('/');
//     } catch (err: any) {
//       setError(err.response?.data?.error || 'Registration failed');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
//           <CardDescription>
//             Enter your information to create a new account
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Your name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="your.email@example.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="••••••••" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Confirm Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="••••••••" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//                 {form.formState.isSubmitting ? 'Creating account...' : 'Register'}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>

//         <CardFooter className="flex justify-center">
//           <p className="text-sm text-muted-foreground">
//             Already have an account?{' '}
//             <Link href="/login" className="text-primary font-medium hover:underline">
//               Log in
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { useAuth } from "@/contexts/AuthContext"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Loader2, Mail, Shield, CheckCircle } from "lucide-react"

// // Form validation schemas
// const initialSchema = z
//   .object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(1, "Confirm your password"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   })

// const otpSchema = z.object({
//   otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
// })

// const finalSchema = initialSchema.and(otpSchema)

// type InitialFormValues = z.infer<typeof initialSchema>
// type OTPFormValues = z.infer<typeof otpSchema>
// type FinalFormValues = z.infer<typeof finalSchema>

// type RegistrationStep = "initial" | "otp" | "completed"

// export default function RegisterForm() {
//   const { mergeGuestProgress } = useAuth()
//   const router = useRouter()
//   const [step, setStep] = useState<RegistrationStep>("initial")
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [userEmail, setUserEmail] = useState("")
//   const [userName, setUserName] = useState("")
//   const [userPassword, setUserPassword] = useState("")
//   const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null)

//   // Initial form (name, email, password)
//   const initialForm = useForm<InitialFormValues>({
//     resolver: zodResolver(initialSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   })

//   // OTP form
//   const otpForm = useForm<OTPFormValues>({
//     resolver: zodResolver(otpSchema),
//     defaultValues: {
//       otp: "",
//     },
//   })

//   // Reset OTP form when transitioning to OTP step
//   useEffect(() => {
//     if (step === "otp") {
//       otpForm.reset({ otp: "" })
//     }
//   }, [step, otpForm])

//   // Handle initial form submission (send OTP)
//   const onInitialSubmit = async (values: InitialFormValues) => {
//     try {
//       setError(null)
//       setIsLoading(true)

//       const response = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: values.email,
//           name: values.name,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to send OTP")
//       }

//       // Store user data for final registration
//       setUserEmail(values.email)
//       setUserName(values.name)
//       setUserPassword(values.password)

//       setSuccess("OTP sent to your email! Please check your inbox.")
//       setStep("otp")
//     } catch (err: any) {
//       setError(err.message || "Failed to send OTP")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Handle OTP verification and final registration
//   const onOTPSubmit = async (values: OTPFormValues) => {
//     try {
//       setError(null)
//       setIsLoading(true)

//       // First verify OTP
//       const verifyResponse = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: userEmail,
//           otp: values.otp,
//         }),
//       })

//       const verifyData = await verifyResponse.json()

//       if (!verifyResponse.ok) {
//         if (verifyData.attemptsLeft !== undefined) {
//           setAttemptsLeft(verifyData.attemptsLeft)
//         }
//         throw new Error(verifyData.error || "OTP verification failed")
//       }

//       // If OTP is verified, proceed with registration
//       const registerResponse = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: userName,
//           email: userEmail,
//           password: userPassword,
//           otp: values.otp,
//         }),
//       })

//       const registerData = await registerResponse.json()

//       if (!registerResponse.ok) {
//         throw new Error(registerData.error || "Registration failed")
//       }

//       // Merge guest progress on successful registration
//       await mergeGuestProgress()

//       setSuccess("Registration successful! Welcome to VibeArmor!")
//       setStep("completed")

//       // Redirect after a short delay
//       setTimeout(() => {
//         router.push("/")
//       }, 2000)
//     } catch (err: any) {
//       setError(err.message || "Registration failed")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Resend OTP
//   const resendOTP = async () => {
//     try {
//       setError(null)
//       setIsLoading(true)

//       const response = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: userEmail,
//           name: userName,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to resend OTP")
//       }

//       setSuccess("New OTP sent to your email!")
//       setAttemptsLeft(null)
//       otpForm.reset()
//     } catch (err: any) {
//       setError(err.message || "Failed to resend OTP")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (step === "completed") {
//     return (
//       <div className="flex justify-center items-center min-h-[80vh]">
//         <Card className="w-full max-w-md">
//           <CardContent className="pt-6">
//             <div className="text-center space-y-4">
//               <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
//               <h2 className="text-2xl font-bold text-green-600">Welcome to VibeArmor!</h2>
//               <p className="text-muted-foreground">
//                 Your account has been created successfully. You'll be redirected to the dashboard shortly.
//               </p>
//               <div className="flex items-center justify-center space-x-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span className="text-sm">Redirecting...</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold flex items-center gap-2">
//             {step === "initial" ? (
//               <>
//                 <Shield className="h-6 w-6 text-orange-500" />
//                 Create an account
//               </>
//             ) : (
//               <>
//                 <Mail className="h-6 w-6 text-orange-500" />
//                 Verify your email
//               </>
//             )}
//           </CardTitle>
//           <CardDescription>
//             {step === "initial"
//               ? "Enter your information to create a new account"
//               : `We've sent a 6-digit code to ${userEmail}`}
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {step === "initial" ? (
//             <Form {...initialForm}>
//               <form onSubmit={initialForm.handleSubmit(onInitialSubmit)} className="space-y-4">
//                 <FormField
//                   control={initialForm.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Your name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={initialForm.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input placeholder="your.email@example.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={initialForm.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input type="password" placeholder="••••••••" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={initialForm.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl>
//                         <Input type="password" placeholder="••••••••" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {error && (
//                   <Alert variant="destructive">
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}

//                 {success && (
//                   <Alert>
//                     <AlertDescription className="text-green-600">{success}</AlertDescription>
//                   </Alert>
//                 )}

//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Sending OTP...
//                     </>
//                   ) : (
//                     "Send Verification Code"
//                   )}
//                 </Button>
//               </form>
//             </Form>
//           ) : (
//             <Form {...otpForm} key="otp-form">
//               <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
//                 <FormField
//                   control={otpForm.control}
//                   name="otp"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Verification Code</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           type="text"
//                           inputMode="numeric"
//                           pattern="[0-9]*"
//                           placeholder="Enter 6-digit code"
//                           maxLength={6}
//                           className="text-center text-lg tracking-widest font-mono"
//                           autoComplete="one-time-code"
//                           value={field.value || ""}
//                           onChange={(e) => {
//                             const value = e.target.value.replace(/\D/g, "").slice(0, 6)
//                             field.onChange(value)
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {error && (
//                   <Alert variant="destructive">
//                     <AlertDescription>
//                       {error}
//                       {attemptsLeft !== null && <div className="mt-2 text-sm">Attempts remaining: {attemptsLeft}</div>}
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {success && (
//                   <Alert>
//                     <AlertDescription className="text-green-600">{success}</AlertDescription>
//                   </Alert>
//                 )}

//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Verifying...
//                     </>
//                   ) : (
//                     "Verify & Create Account"
//                   )}
//                 </Button>

//                 <div className="text-center">
//                   <Button type="button" variant="ghost" onClick={resendOTP} disabled={isLoading} className="text-sm">
//                     Didn't receive the code? Resend OTP
//                   </Button>
//                 </div>

//                 <div className="text-center">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={() => setStep("initial")}
//                     disabled={isLoading}
//                     className="text-sm"
//                   >
//                     ← Back to registration
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           )}
//         </CardContent>

//         <CardFooter className="flex justify-center">
//           <p className="text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <Link href="/login" className="text-primary font-medium hover:underline">
//               Log in
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Shield, CheckCircle } from "lucide-react"

// Form validation schemas
const initialSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
})

const finalSchema = initialSchema.and(otpSchema)

type InitialFormValues = z.infer<typeof initialSchema>
type OTPFormValues = z.infer<typeof otpSchema>
type FinalFormValues = z.infer<typeof finalSchema>

type RegistrationStep = "initial" | "otp" | "completed"

export default function RegisterForm() {
  const { mergeGuestProgress } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<RegistrationStep>("initial")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null)

  // Initial form (name, email, password)
  const initialForm = useForm<InitialFormValues>({
    resolver: zodResolver(initialSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // OTP form
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  // Reset OTP form when transitioning to OTP step
  useEffect(() => {
    if (step === "otp") {
      otpForm.reset({ otp: "" })
    }
  }, [step, otpForm])

  // Handle initial form submission (send OTP)
  const onInitialSubmit = async (values: InitialFormValues) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      // Store user data for final registration
      setUserEmail(values.email)
      setUserName(values.name)
      setUserPassword(values.password)

      setSuccess("OTP sent to your email! Please check your inbox or spam folder.")
      setStep("otp")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to send OTP")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP verification and final registration
  const onOTPSubmit = async (values: OTPFormValues) => {
    try {
      setError(null)
      setIsLoading(true)

      // First verify OTP
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          otp: values.otp,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        if (verifyData.attemptsLeft !== undefined) {
          setAttemptsLeft(verifyData.attemptsLeft)
        }
        throw new Error(verifyData.error || "OTP verification failed")
      }

      // If OTP is verified, proceed with registration
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword,
          otp: values.otp,
        }),
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        throw new Error(registerData.error || "Registration failed")
      }

      // Merge guest progress on successful registration
      await mergeGuestProgress()

      setSuccess("Registration successful! Welcome to VibeArmor!")
      setStep("completed")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const resendOTP = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP")
      }

      setSuccess("New OTP sent to your email!")
      setAttemptsLeft(null)
      otpForm.reset()
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "completed") {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">Welcome to VibeArmor!</h2>
              <p className="text-muted-foreground">
                Your account has been created successfully. You'll be redirected to the dashboard shortly.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Redirecting...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            {step === "initial" ? (
              <>
                <Shield className="h-6 w-6 text-orange-500" />
                Create an account
              </>
            ) : (
              <>
                <Mail className="h-6 w-6 text-orange-500" />
                Verify your email
              </>
            )}
          </CardTitle>
          <CardDescription>
            {step === "initial"
              ? "Enter your information to create a new account"
              : `We've sent a 6-digit code to ${userEmail}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "initial" ? (
            <Form {...initialForm}>
              <form onSubmit={initialForm.handleSubmit(onInitialSubmit)} className="space-y-4">
                <FormField
                  control={initialForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={initialForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={initialForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={initialForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription className="text-green-600">{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm} key="otp-form">
              <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="text-center text-lg tracking-widest font-mono"
                          autoComplete="one-time-code"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error}
                      {attemptsLeft !== null && <div className="mt-2 text-sm">Attempts remaining: {attemptsLeft}</div>}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription className="text-green-600">{success}</AlertDescription>
                  </Alert>

                )}
                {success && (
                  //  Check spam for OTP
                  <Alert>
                    <AlertDescription className="text-red-600">
                      If you don't see the OTP, please check your spam folder.
                    </AlertDescription>
                  </Alert>

                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Create Account"
                  )}
                </Button>

                <div className="text-center">
                  <Button type="button" variant="ghost" onClick={resendOTP} disabled={isLoading} className="text-sm">
                    Didn't receive the code? Resend OTP
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("initial")}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    ← Back to registration
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
