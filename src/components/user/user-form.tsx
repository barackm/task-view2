"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, UserFormValues } from "@/lib/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface UserFormProps {
  user: User;
  onSubmit: (data: UserFormValues) => void;
  isSubmitting?: boolean;
}

export function UserForm({ user, onSubmit, isSubmitting }: UserFormProps) {
  const [skillInput, setSkillInput] = useState("");
  const [skillsList, setSkillsList] = useState<string[]>(
    Array.isArray(user.skills)
      ? user.skills
      : user.skills
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [],
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: user.full_name!,
      email: user.email,
      avatar: user.avatar || "",
      skills: skillsList.join(","),
    },
  });

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!skillsList.includes(newSkill)) {
        const newSkills = [...skillsList, newSkill];
        setSkillsList(newSkills);
        form.setValue("skills", newSkills.join(","));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skillsList.filter((skill) => skill !== skillToRemove);
    setSkillsList(newSkills);
    form.setValue("skills", newSkills.join(","));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='avatar'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <AvatarUpload
                  value={field.value}
                  onChange={field.onChange}
                  fullName={user.full_name!}
                  userId={user.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='Your name...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='your.email@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='skills'
          render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <div className='space-y-2'>
                  <Input
                    placeholder='Type a skill and press Enter...'
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <div className='flex flex-wrap gap-2'>
                    {skillsList.map((skill) => (
                      <Badge key={skill} variant='secondary' className='py-1'>
                        {skill}
                        <button
                          type='button'
                          onClick={() => handleRemoveSkill(skill)}
                          className='ml-1 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormDescription>Type a skill and press Enter or comma to add it</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
