import CustomButton from "@/components/CustomButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl md:text-5xl  text-slate-800 mb-4">
          🐍 Snake & Ladder
        </h1>
        <p className="text-slate-600 mb-12">Choose your game mode</p>

        <div className="grid grid-cols-2 gap-4 p-4">
          <Link
            href="/play/friend/1"
            className="transform transition-transform hover:scale-105">
            <CustomButton className="w-full py-6 text-lg bg-[#00a3c4]  shadow-lg  rounded-xl">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">👤</span>
                <span>1 Player</span>
              </div>
            </CustomButton>
          </Link>
          <Link
            href="/play/friend/2"
            className="transform transition-transform hover:scale-105">
            <CustomButton className="w-full py-6 text-lg bg-[#f56565] shadow-lg rounded-xl">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">👤👤</span>
                <span>2 Players</span>
              </div>
            </CustomButton>
          </Link>
          <Link
            href="/play/friend/3"
            className="transform transition-transform hover:scale-105">
            <CustomButton
              className="w-full py-6 text-lg bg-[#805ad5] shadow-lg  rounded-xl"
              variant="primary">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">👤👤👤</span>
                <span>3 Players</span>
              </div>
            </CustomButton>
          </Link>
          <Link
            href="/play/friend/4"
            className="transform transition-transform hover:scale-105">
            <CustomButton className="w-full py-6 text-lg bg-[#1a202c] shadow-lg  rounded-xl">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">👤👤👤👤</span>
                <span>4 Players</span>
              </div>
            </CustomButton>
          </Link>
        </div>
        {/* Copyright Footer */}
        <div className="py-3 text-center w-full fixed bottom-0 left-0 shadow-inner z-10">
          <p className="text-sm text-slate-600">
            Lovely developed by{" "}
            <Link
              className="underline"
              href={"https://github.com/minbanyartalahtaw"}>
              dumark
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
