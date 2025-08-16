import { ComponentProps } from "react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  name?: string;
  avatar?: string;
}

type AvatarSize = "sm" | "default" | "md" | "lg" | "xl";

interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  user?: User;
  size?: AvatarSize;
}

const UserAvatar = ({
  user,
  size = "default",
  className,
  ...props
}: UserAvatarProps) => {
  // Size variants
  const sizeVariants: Record<AvatarSize, string> = {
    sm: "h-6 w-6",
    default: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <Avatar
      className={cn(sizeVariants[size], "rounded-lg", className)}
      {...props}
    >
      <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
      <AvatarFallback className="rounded-lg">
        {getInitials(user?.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
