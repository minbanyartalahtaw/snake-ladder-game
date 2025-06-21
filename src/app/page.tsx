import CustomButton from "@/components/CustomButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          🐍 Snake & Ladder
        </h1>
        <p className="text-slate-600 mb-12">Choose your game mode</p>

        <div className="grid grid-cols-2 gap-1">
          <Link href="/play/friend/1" className="block">
            <CustomButton className="w-full py-4 text-lg">
              1 Player
            </CustomButton>
          </Link>
          <Link href="/play/friend/2" className="block">
            <CustomButton className="w-full py-4 text-lg">
              2 Player
            </CustomButton>
          </Link>
          <Link href="/play/friend/3" className="block">
            <CustomButton className="w-full py-4 text-lg">
              3 Player
            </CustomButton>
          </Link>
          <Link href="/play/friend/4" className="block">
            <CustomButton className="w-full py-4 text-lg">
              4 Player
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
