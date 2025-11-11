"use client";
import { ArrowLeft, Loader2, UserCog } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import type React from "react";
import {
  type PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";

import { CvBuilderSidebar } from "@/components/Layout/CvBuilderSidebar";
import TemplateWrapper from "@/components/Templates/TemplateWrapper";
import { Button } from "@/components/ui/button";
import { TEMPLATE_MOCK_DATA } from "@/constants";
import { Route } from "@/constants/route.constant";
import useCheckEditable from "@/hooks/useCheckEditable";
import useGetTemplates from "@/hooks/useGetTemplates";
import { resumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import { setUser, userSelector } from "@/stores/features/user.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const CvBuilderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { templateFormat, templates } = useGetTemplates();
  const templateSelected = useCheckEditable();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const resume = useAppSelector(resumeSelector);
  const { user } = useAppSelector(userSelector);
  const { data } = useSession();

  const Template = useMemo(() => {
    if (!templateSelected) return null;
    return templates[templateSelected];
  }, [templateSelected, templates]);

  useLayoutEffect(() => {
    const checkUser = async () => {
      if (data) {
        if (data.isExpired) {
          dispatch(setUser(null));
          router.replace(Route.SignIn);
        } else {
          dispatch(setUser(data.user));
        }
      }
    };

    void checkUser();
  }, [data, dispatch, router]);

  useEffect(() => {
    const fetchResumeData = async () => {
      const resumeRes = await resumeService.getResume();
      dispatch(setResume(resumeRes));
    };

    void fetchResumeData();
  }, [dispatch]);

  return resume ? (
    <>
      {Template && user && (
        <div className="flex h-screen">
          <CvBuilderSidebar />

          <div className="scrollbar-thin flex-1 overflow-y-auto py-10">
            <div className="container-full mx-auto max-w-7xl space-y-4">
              <Button
                variant={"link"}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeft /> Go Back
              </Button>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">{children}</div>

                <div className="relative col-span-1">
                  <div
                    className={`
                      sticky top-10 left-0 flex flex-col items-center gap-4
                    `}
                  >
                    <TemplateWrapper
                      document={
                        <Template
                          templateFormat={templateFormat}
                          data={TEMPLATE_MOCK_DATA}
                        />
                      }
                    />
                    <Button className="min-w-40">
                      <UserCog /> Config
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default CvBuilderLayout;
