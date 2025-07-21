import { VITE_APP_API_URL } from "@/config";
import { userSelector } from "@/redux/slices/userSlice";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector(userSelector);
  return (
    <div className="profile-main-wrapper">
      <div className="grid grid-cols-1 gap-5">
        <div className="">
          <div className="flex flex-col gap-3 mb-30px">
            <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
              <h4 className="text-base/5 text-black font-semibold">Overview</h4>
            </div>
            <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
              <div className="flex flex-wrap items-center">
                <div className="w-[150px] h-[150px] mx-auto">
                  <img
                    src={
                      user?.loginUserData?.profileImage
                        ? String(
                            VITE_APP_API_URL +
                              "/profilePicture/" +
                              user?.loginUserData?.profileImage
                          )
                        : "/assets/images/user.jpg"
                    }
                    width={150}
                    height={150}
                    className="rounded-10 w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="max-w-full 768:max-w-[calc(100%_-_150px)] w-full md:pl-4">
                  <ul className="grid grid-cols-1 768:grid-cols-2 gap-4">
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Name
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {user?.loginUserData?.firstName &&
                        user?.loginUserData?.lastName
                          ? user?.loginUserData?.firstName +
                            " " +
                            user?.loginUserData?.lastName
                          : user?.loginUserData?.name ?? "-"}
                      </span>
                    </li>

                    {/* <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Last name
                      </span>
                      <span className="text-sm/18px text-black font-medium w-1/2 text-left break-words">
                        {user?.loginUserData?.lastName}
                      </span>
                    </li> */}
                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Email
                      </span>
                      <span className="text-sm/18px  font-medium w-1/2 text-left cursor-pointer underline text-primaryRed underline-offset-4">
                        {user?.loginUserData?.email ?? "-"}
                      </span>
                    </li>

                    {user?.userSegmentList &&
                      user.userSegmentList.length > 0 &&
                      user.userSegmentList.map((data) => (
                        <>
                          <li className="flex justify-between">
                            <span className="text-sm/18px text-black font-bold w-1/2">
                              Segment
                            </span>
                            <span className="text-sm/18px  font-medium w-1/2 text-left  text-primaryRed ">
                              {data?.segmentData?.name ?? "-"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sm/18px text-black font-bold w-1/2">
                              SubSegment
                            </span>
                            <span className="text-sm/18px  font-medium w-1/2 text-left  text-primaryRed">
                              {data.subSegmentData?.name ?? "-"}
                            </span>
                          </li>
                        </>
                      ))}

                    <li className="flex justify-between">
                      <span className="text-sm/18px text-black font-bold w-1/2">
                        Client
                      </span>
                      <span className="text-sm/18px  font-medium w-1/2 text-left text-primaryRed">
                        {(user?.userClientList &&
                          user?.userClientList.length > 0 &&
                          user?.userClientList[0]?.clientData?.loginUserData
                            ?.name) ||
                          "-"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
