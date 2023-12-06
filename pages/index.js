import Board from "@/components/Board";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800 text-gray-200 space-y-4">
      <h1 className="font-semibold text-4xl mt-5">Chess Board</h1>
      <Board />
      <p className="text-gray-600 text-lg md:text-xl">Created by Rahul Ragi</p>
    </div>
  );
}
