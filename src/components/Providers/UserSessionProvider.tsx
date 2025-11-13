"use client";
import { useSession } from "next-auth/react";
import { type PropsWithChildren, useLayoutEffect } from "react";

import { resumeService } from "@/services/resume.service";
import { resumeSelector, setResume } from "@/stores/features/resume.slice";
import { setUser, userSelector } from "@/stores/features/user.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const UserSessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { resume } = useAppSelector(resumeSelector);
  const { user } = useAppSelector(userSelector);

  const dispatch = useAppDispatch();
  const session = useSession();

  useLayoutEffect(() => {
    if (!session.data?.user || session.data.isExpired) {
      dispatch(setUser(null));
    } else {
      dispatch(setUser(session.data.user));
    }
  }, [dispatch, session]);

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

  return children;
};

export default UserSessionProvider;
