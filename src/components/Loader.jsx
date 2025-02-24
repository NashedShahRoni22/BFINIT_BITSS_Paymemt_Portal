import { LiaSpinnerSolid } from "react-icons/lia";

export default function Loader() {
  return (
    <div className="flex h-screen  w-full items-center justify-center">
      <LiaSpinnerSolid className="animate-spin text-4xl text-[#2d67b2]" />
    </div>
  );
}
