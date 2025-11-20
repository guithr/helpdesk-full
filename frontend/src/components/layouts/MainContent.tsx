import type React from "react";
import { tv } from "tailwind-variants";

export const MainContentVariants = tv({
  base: `flex-1 
         pt-7 px-6 rounded-t-[20px] 
         md:pt-13 md:px-12 md:mt-3 md:rounded-tl-[20px] md:rounded-tr-none
         overflow-y-auto bg-gray-600`,
});

interface MainContentProps extends React.ComponentProps<"main"> {
  className?: string;
}

export function MainContent({
  className,
  children,
  ...props
}: MainContentProps) {
  return (
    <main className={MainContentVariants({ className })} {...props}>
      {children}
    </main>
  );
}
