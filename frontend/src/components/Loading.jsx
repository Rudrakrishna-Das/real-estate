const Loading = () => {
  return (
    <div className="max-w-xs mx-auto my-24 p-4 flex items-center gap-4 border-4 border-blue-600 rounded-full">
      <h1 className="mx-auto text-4xl font-extrabold text-blue-800">LOADING</h1>
      <div className="w-10 h-10 border-4 border-blue-700 rounded-full py-2 absolute">
        <div className="w-9 h-1 bg-blue-950 my-2 animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
