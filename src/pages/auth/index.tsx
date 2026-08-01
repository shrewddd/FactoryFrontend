import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthInput } from "./components/auth-input";
import { AuthSelect } from "./components/auth-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/AuthProvider";
import { useState } from "react";
import { useGetAllUsers } from "@/api/generated/user/user";
// import { useUsers } from "@/hooks/useUsers";

export const AuthenticationPage = () => {
  const { login } = useAuth();

  // const { data: users } = useUsers.getAll();
  const { data: users } = useGetAllUsers()

  const [identity, setIdentity] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [hasError, setHasError] = useState(false);

  const triggerError = () => {
    setHasError(true);
    setTimeout(() => setHasError(false), 1000); 
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="select">
            <TabsList>
              <TabsTrigger value="select">List</TabsTrigger>
              <TabsTrigger value="input">Input</TabsTrigger>
            </TabsList>
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>Enter your Identificator below to login to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!users) return;

                    const matchedUser = users.find((u) => u.code === identity || u.username === identity);

                    if (!matchedUser) {
                      triggerError()
                      return;
                    }

                    const isCode = matchedUser.code === identity;
                    login(identity, password, isCode).catch((e: Error) => {
                      console.log(e)
                      triggerError()
                    });
                  }}
                >
                  <FieldGroup>
                    <TabsContent value="select">
                      <AuthSelect value={identity} onChange={setIdentity} users={users ?? []} />
                    </TabsContent>
                    <TabsContent value="input">
                      <AuthInput value={identity} onChange={setIdentity} />
                    </TabsContent>
                    <Field>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        required
                      />
                    </Field>
                    <Field>
                      <Button variant={hasError ? "destructive" : "default"} className="transition-all duration-300" type="submit">{hasError ? "Invalid" : "Submit"}</Button>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
