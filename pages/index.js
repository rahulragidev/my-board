import Board from "@/components/Board";

export default function Home() {
  return (
    <div className="flex flex-wrap items-center justify-center w-full h-auto bg-gray-800 text-gray-200 overflow-hidden">
      <Board />
      <p className="text-gray-600 text-xs md:text-sm">Created by Rahul Ragi</p>
    </div>
  );
}
