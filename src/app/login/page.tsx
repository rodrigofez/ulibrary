import { getAuthSession } from "@/lib/nextauth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserAuthForm } from "./components/credentials-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailAuthForm } from "./components/email-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage() {
  const session = await getAuthSession();

  if (session?.user) redirect("/dashboard/me");

  return (
    <div className="container h-full flex-col items-center justify-center lg:grid max-w-none lg:grid-cols-2 px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          ULibrary
        </div>
        <div className="relative z-20 mt-auto"></div>
      </div>
      <div className="p-8 justify-center items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          </div>
          <Tabs defaultValue="account" className="w-auto text-center">
            <TabsList>
              <TabsTrigger value="account">Credentials</TabsTrigger>
              <TabsTrigger value="password">Send email</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <p className="mb-4 text-sm text-muted-foreground">
                Enter your credentials below to continue
              </p>
              <UserAuthForm className="text-left" />
            </TabsContent>
            <TabsContent value="password">
              <p className="mb-4 text-sm text-muted-foreground">
                Send a link to your email to sign in
              </p>
              <EmailAuthForm className="text-left" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
