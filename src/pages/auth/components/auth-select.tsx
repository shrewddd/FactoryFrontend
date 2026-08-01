import type { User } from "@/api/generated/models";
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import type { User } from "@/types/users";

// import { fuzzySearch } from "@/helpers/fuzzyfind";
// import { useEffect, useState } from "react";
// import { Input } from "../ui/input"
// import { Button } from "../ui/button";
// import { cn } from "@/lib/utils";

interface AuthSelectProps {
  value: string;
  onChange: (value: string) => void;
  users: User[]
}

export const AuthSelect = ({ value, onChange, users }: AuthSelectProps) => {
  // const [placeholder, setPlaceholder] = useState("")
  // const [matchUsers, setMatchUsers] = useState<string[]>(users ? users.map(user => user.fullName) : [])
  // const [query, setQuery] = useState<string>("");
  //
  // useEffect(() => {
  //   if (query.trim() != "")
  //     setMatchUsers(fuzzySearch(users ? users.map((user) => user.fullName) : [], query))
  //   else {
  //     setMatchUsers(users ? users.map(user => user.fullName) : [])
  //   }
  // }, [users, query])
  //
  console.log(value);

  return (
    <Field>
      <FieldLabel htmlFor="id">Profile</FieldLabel>
      <Select onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select your login"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {users && users.map((item) => {
              return (
                <SelectItem key={item.id} value={(item.code ? String(item.code) : item.username) || ""}>{item.fullName}</SelectItem> 
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* <FieldLabel htmlFor="id">Profile</FieldLabel> */}
      {/* <div> */}
      {/*   <Input */}
      {/*     id="userId" */}
      {/*     type="text" */}
      {/*     placeholder={placeholder} */}
      {/*     className={cn("text-semibold text-lg active border-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0", matchUsers.length > 0 && "rounded-b-none")} */}
      {/*     onChange={e => setQuery(e.target.value)} */}
      {/*     value={query} */}
      {/*     required */}
      {/*   /> */}
      {/*   <ScrollArea className={cn("text-semibold text-lg rounded-b-md border text-left transition-[height] duration-500 ease-out", matchUsers.length == 0 && "h-0 border-none", matchUsers.length >= 3 ? "h-30" : `h-${matchUsers.length * 10}`)}> */}
      {/*     {matchUsers.map((user) => <Button variant="ghost" onMouseEnter={() => setPlaceholder(user)} onClick={() => setQuery(user)} className="h-10 w-full rounded-none text-left justify-start">{user}</Button>)} */}
      {/*   </ScrollArea> */}
      {/* </div> */}
    </Field>
  )
}
