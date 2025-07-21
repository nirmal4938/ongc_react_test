export const NoDataFound = () => {
  return (
    <>
      <div className="py-4 text-center  rounded-10px border border-black/[0.08]">
        <img
          src={`https://cdn-icons-png.flaticon.com/512/7486/7486754.png `}
          className="w-[100px] m-auto mb-4"
          alt=""
        />
        <span className="text-black">No Data Found</span>
      </div>
    </>
  );
};
