const Loading = () => {
  return (
    <div className="max-w-xs mx-auto my-24 p-4 flex justify-between items-center gap-4 border-4 border-blue-600 rounded-full">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full py-2 animate-spin"></div>
      <h1 className="mx-auto text-4xl font-extrabold text-blue-800">LOADING</h1>
    </div>
  );
};

export default Loading;
