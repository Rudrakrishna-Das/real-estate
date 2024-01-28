const Loading = ({ height, width, top }) => {
  return (
    <div
      className={`w-${width} h-${height} border-4 border-blue-200 border-b-blue-950 border-t-blue-950 rounded-full mt-${top} animate-spin mx-auto`}
    ></div>
  );
};

export default Loading;
