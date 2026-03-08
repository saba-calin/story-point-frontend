import {useNavigate} from "react-router-dom";
import {type ChangeEvent, useContext, useRef, useState} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import userApi from "../api/userApi.ts";
import {ALLOWED_IMAGE_TYPES, type AvatarUploadUrlResponse} from "../util/types.ts";
import axios from "axios";

const UserProfile = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {user, setUser} = useContext(AuthContext)!;

  const uploadImage = async (image: File) => {
    try {
      setErrorMessage("");

      if (!ALLOWED_IMAGE_TYPES[image.type]) {
        setErrorMessage("Unsupported image type.");
        return;
      }
      if (image.size > 1024 * 1024) {
        setErrorMessage("Image size exceeds 1MB limit.");
        return;
      }

      setIsUploadingImage(true);
      const response = await userApi.getAvatarUploadUrl(image.type, image.size);
      const data = response.data as AvatarUploadUrlResponse;

      await axios.put(data.uploadUrl, image, {
        headers: { 'Content-Type': image.type }
      });

      setIsImageLoading(true);
      setUser({...user!, profilePictureKey: data.profilePictureKey});
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUploadProfilePicture = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    if (!image) return;
    await uploadImage(image);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const image = e.dataTransfer.files?.[0];
    if (!image) return;
    await uploadImage(image);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>

      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <span className="text-sm font-semibold tracking-tight text-gray-800">Profile</span>
        </div>
        <div className="w-8 h-8" />
      </header>

      <main className="flex-1 px-8 py-10 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your account details.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-100 flex items-center gap-6">
            <div className="relative w-16 h-16 flex-shrink-0">
              {user?.profilePictureKey ? (
                <>
                  {isImageLoading && (
                    <svg
                      className="absolute inset-0 w-full h-full animate-spin"
                      viewBox="0 0 64 64"
                      fill="none"
                    >
                      <circle cx="32" cy="32" r="30" stroke="#e5e7eb" strokeWidth="3"/>
                      <path d="M 32 2 A 30 30 0 0 1 62 32" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  )}
                  <img
                    src={`${import.meta.env.VITE_CDN_BASE_URL}/${user.profilePictureKey}`}
                    className={`w-full h-full rounded-full object-cover border border-gray-200 transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsImageLoading(false)}
                  />
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              <p className="text-base font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-400 mt-0.5">@{user?.username}</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleUploadProfilePicture}
            />

            <div className="flex-1 flex flex-col gap-2">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition-all
                  ${isUploadingImage
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : isDraggingOver
                    ? 'border-gray-600 bg-gray-50 cursor-copy'
                    : errorMessage
                      ? 'border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100 cursor-pointer'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {isUploadingImage ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <p className="text-xs text-gray-400">Uploading...</p>
                  </>
                ) : errorMessage ? (
                  <>
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                    </svg>
                    <p className="text-xs font-medium text-red-500">{errorMessage}</p>
                    <p className="text-xs text-red-300">Click to try again</p>
                  </>
                ) : (
                  <>
                    <svg className={`w-5 h-5 transition-colors ${isDraggingOver ? 'text-gray-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                    <p className={`text-xs font-medium transition-colors ${isDraggingOver ? 'text-gray-700' : 'text-gray-400'}`}>
                      {isDraggingOver ? 'Drop to upload' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-gray-300">PNG, JPEG or JPG (max 1MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">First name</span>
              <span className="text-sm text-gray-900 font-medium">{user?.firstName}</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last name</span>
              <span className="text-sm text-gray-900 font-medium">{user?.lastName}</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</span>
              <span className="text-sm text-gray-900 font-medium">@{user?.username}</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</span>
              <span className="text-sm text-gray-900 font-medium">{user?.email}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;