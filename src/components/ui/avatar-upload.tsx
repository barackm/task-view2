"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { toast } from "sonner";
import { uploadAvatar } from "@/lib/storage";

interface AvatarUploadProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  name?: string;
  fullName?: string;
  userId: string;
}

export function AvatarUpload({ value, onChange, name, fullName, userId }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    try {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPreview(base64);

        try {
          const publicUrl = await uploadAvatar(userId, base64);
          onChange?.(publicUrl);
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
          setPreview(value || null);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File reading error:", error);
      toast.error("Failed to process image");
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-20 w-20'>
          <AvatarImage src={preview || ""} />
          <AvatarFallback className='text-lg bg-primary/10 text-primary'>{getInitials(fullName)}</AvatarFallback>
        </Avatar>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <Button onClick={handleClick} type='button' variant='secondary' size='sm' disabled={isUploading}>
              {isUploading ? "Uploading..." : "Change"}
            </Button>
            {preview && (
              <Button onClick={handleRemove} type='button' variant='destructive' size='sm' disabled={isUploading}>
                Remove
              </Button>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>Recommended: Square image, max 5MB</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
        name={name}
        disabled={isUploading}
      />
    </div>
  );
}
