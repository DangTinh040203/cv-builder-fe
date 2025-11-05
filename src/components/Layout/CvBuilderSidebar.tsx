"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Route, SIDEBAR_ROUTES } from "@/constants/route.constant";

export const CvBuilderSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="h-full w-72 space-y-14 bg-[#07142b] p-8 text-white">
      <div className="flex items-center justify-center">
        <Link href={Route.Home}>Logo</Link>
      </div>

      <div className="space-y-10">
        {SIDEBAR_ROUTES.map((item, index) => (
          <div
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex cursor-pointer items-center gap-4"
          >
            <div
              className={clsx(
                `
                  relative flex size-10 items-center justify-center rounded-full
                  bg-white font-bold text-[#07142b]
                `,
                String(item.href) === pathname &&
                  "border-2 border-gray-400 scale-120 transition-all",
              )}
            >
              {index}

              {index < SIDEBAR_ROUTES.length - 1 && (
                <div
                  className={`
                    absolute bottom-0 left-1/2 h-10 w-1 -translate-x-1/2
                    translate-y-full bg-white
                  `}
                />
              )}
            </div>

            <p
              className={clsx(
                "text-lg",
                String(item.href) === pathname && "font-semibold",
              )}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
