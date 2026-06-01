"use client";
import { useRef } from "react";
import { useUploadProfileImage } from "../../hooks/useEmployeeAuthMutations";
import { useSelector } from "react-redux";

const ProfileImage = () => {
  const fileRef = useRef(null);
  const uploadImage = useUploadProfileImage();
  const user = useSelector((state) => state.auth.user);

  // 👉 click image → open file picker
  const handleImageClick = () => {
    fileRef.current.click();
  };

  console.log(user)

  // 👉 upload file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage.mutate(file);
    }
  };

  return (
    <div>
      {/* 🔥 CLICKABLE IMAGE */}
      <img
        onClick={handleImageClick}
        src={
          user?.profileImage?.url ||
          "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
        }
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
      />

      {/* 🔒 HIDDEN INPUT */}
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