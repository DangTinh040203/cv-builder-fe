"use client";
import { getSession, SessionProvider } from "next-auth/react";
import { type PropsWithChildren, useLayoutEffect } from "react";

import { resumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import { setUser, userSelector } from "@/stores/features/user.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const UserSessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { resume } = useAppSelector(resumeSelector);
  const { user } = useAppSelector(userSelector);

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const session = await getSession();
        if (session && !session.isExpired && session.user) {
          dispatch(setUser(session.user));
        } else {
          dispatch(setUser(null));
        }
      }
    };

    void fetchUser();
  }, [dispatch, user]);

  useLayoutEffect(() => {
    const fetchUserResume = async () => {
      if (user && !resume) {
        const resumeRes = await resumeService.getResume();
        if (resumeRes) {
          dispatch(setResume(resumeRes));
        }
      }
    };

    void fetchUserResume();
  }, [dispatch, resume, user]);

  return <SessionProvider>{children}</SessionProvider>;
};

export default UserSessionProvider;
