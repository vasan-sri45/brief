// src/store/hooks.js
"use client";

import { useDispatch, useSelector } from "react-redux";

// simple wrappers for convenience
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
