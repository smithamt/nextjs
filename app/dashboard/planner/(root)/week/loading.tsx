"use client";
import ProfileLoading from "@/components/loadings/profile";

function Loading() {
 
  return (
    <div className="h-full border-l">
      <ProfileLoading />
      <ProfileLoading />
      <ProfileLoading />
    </div>
  );
}

export default Loading;
