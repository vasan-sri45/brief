"use client";

import Image from "next/image";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useUploadProfileImage } from "../../hooks/useEmployeeAuthMutations";

const FALLBACK_PROFILE_IMAGE =
  "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png";

const ProfileImage = () => {
  const fileRef = useRef(null);
  const uploadImage = useUploadProfileImage();
  const user = useSelector((state) => state.auth.user);

  const handleImageClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage.mutate(file);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleImageClick}
        className="relative h-14 w-14 overflow-hidden rounded-full transition hover:opacity-80 sm:h-16 sm:w-16"
        aria-label="Upload profile image"
      >
        <Image
          src={user?.profileImage?.url || FALLBACK_PROFILE_IMAGE}
          alt={`${user?.name || "User"} profile`}
          fill
          sizes="64px"
          className="object-cover"
        />
      </button>

      <input
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ProfileImage;
