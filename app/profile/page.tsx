"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/components/AuthProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="text-color3 text-center mt-20">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="mx-auto w-full xl:w-265 px-5 md:px-20 xl:px-5 mt-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-sm text-color2 font-bold">Signed in as</div>
            <div className="text-2xl md:text-3xl font-bold text-color4 font-raleway">
              {user.email}
            </div>
          </div>
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="h-10 px-4 rounded-xl bg-color1 text-color4 font-bold border-2 border-color2 hover:bg-color3 hover:text-color1 transition"
            aria-label="sign out"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
            Sign out
          </button>
        </div>

        <div className="text-2xl md:text-3xl font-bold text-color3 mb-3">
          Saved.
        </div>
        <div className="text-color2 mb-10">Nothing saved yet.</div>

        <div className="text-2xl md:text-3xl font-bold text-color3 mb-3">
          Watched.
        </div>
        <div className="text-color2 mb-10">Nothing watched yet.</div>
      </div>

      <Footer />
    </>
  );
}
