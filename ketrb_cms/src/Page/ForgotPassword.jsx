import React, { useState } from "react";
import { Button } from "../Component/button";
import { Input } from "../Component/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../Component/card";
import { Label } from "../Component/label";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import bgImage from "../Asset/bg.png"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://ketrb-backend.onrender.com/users/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
        <Card className="w-[450px]">
          <CardHeader>
  <CardTitle className="text-2xl font-bold text-center text-gray-800">Notification Sent</CardTitle>
  <CardDescription>
    A notification to reset your password has been sent to the administrator.
  </CardDescription>
</CardHeader>
<CardContent>
  <p className="text-sm text-muted-foreground">
    Please wait for further instructions from the administrator.
  </p>
</CardContent>
<CardFooter>
  <Button className="w-full" onClick={() => window.location.href = '/login'}>
    Return to Login
  </Button>
</CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
  Forgot Password
</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button variant="black" className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="px-0" onClick={() => window.location.href = '/login'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
      }
