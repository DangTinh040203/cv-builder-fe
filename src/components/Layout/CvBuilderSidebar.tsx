"use client";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Route, SIDEBAR_ROUTES } from "@/constants/route.constant";

export const CvBuilderSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`
        sticky top-0 left-0 h-screen space-y-14 bg-[#07142b] p-8 text-white
        lg:w-72
      `}
    >
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
            <div className="relative">
              <div
                className={clsx(
                  `
                    relative z-50 flex size-8 items-center justify-center
                    rounded-full bg-white font-bold text-[#07142b]
                  `,
                  String(item.href) === pathname &&
                    "border-3 border-primary scale-120 transition-all relative z-50",
                )}
              >
                {index}
              </div>

              {index < SIDEBAR_ROUTES.length - 1 && (
                <div
                  className={`
                    absolute bottom-0 left-1/2 z-0 h-10 w-1 -translate-x-1/2
                    translate-y-full bg-white
                  `}
                />
              )}
            </div>

            <p
              className={clsx(
                `
                  hidden text-lg
                  lg:block
                `,
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
