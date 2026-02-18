"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateUser, getStoredUser } from "../../store/features/auth.slice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateUser(getStoredUser()));
  }, [dispatch]);

  return null;
}
