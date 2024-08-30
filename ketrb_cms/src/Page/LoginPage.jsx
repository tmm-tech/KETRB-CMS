import React from "react";
import bgImage from "../Asset/bg.png";
const LoginPage = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
        <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">Enter your credentials to access the CRM.</p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
  type="submit"
  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
>
  Sign in
</button>
<a
  href="#"
  className="text-sm font-medium underline underline-offset-4 text-primary hover:text-primary/90 text-center block w-full"
>
  Forgot password?
</a>

          </form>
          
        </div>
      </div>
  );
}

export default LoginPage;
