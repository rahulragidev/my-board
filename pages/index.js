import Board from "@/components/Board";

export default function Home() {
  return (
    <div className="flex flex-wrap items-center justify-center w-screen h-screen bg-gray-800 text-gray-200 overflow-x-auto overflow-y-auto">
      <Board />
      <p className="text-gray-600 font-extrabold text-xs md:text-sm">
        Created by Rahul Ragi
      </p>
    </div>
  );
}
