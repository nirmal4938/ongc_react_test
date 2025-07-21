import { RightCheck } from "@/components/svgIcons";
import { VITE_APP_API_URL } from "@/config";
import { IMedicalRequestDetail } from "@/interface/medicalRequest/MedicalRequestInterface";
import { IMedicalTypeData } from "@/interface/medicalType/MedicalTypeInterface";
import moment from "moment";

const MedicalPDF = ({
  data,
  medicalTypeData,
}: {
  data: IMedicalRequestDetail;
  medicalTypeData?: IMedicalTypeData[];
}) => {
  return (
    <>
      {data?.status === "CANCELLED" && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-primaryRed font-bold font-sans text-5xl z-10">
          CANCELLED
        </div>
      )}
      {/* Common */}
      {/* <div className="flex flex-wrap w-full">
        <div className="w-1/2">
          <img
            src={`/assets/images/lred-logo-small.png`}
            width={150}
            height={60}
            alt="pdfLogo"
          />
        </div>
        <div className="w-1/2">
          <p
            className="text-10px text-right leading-normal font-medium text-black"
            style={{ fontFamily: "sans-serif" }}
          >
            SARL LRED Algerie
            <br />
            18, Rue Hadj Ahmed Mohamed
            <br />
            Hydra, Alger 16000
            <br />
            Algerie
            <br />
            Mob: +213 (0) 658 450 505
          </p>
        </div>
      </div> */}
      {/* <div className="mt-3 border-t-2 border-solid border-primaryRed w-full"></div> */}
      {/* Common End  */}

      <div className="img-wrapper">
        <img
          src={`/assets/images/new-logo.png`}
          width="100%"
          height=""
          className="!bg-transparent"
          alt=""
        />
      </div>
      <div className="w-[500px] mx-auto">
        <div className="text-center mt-2 w-full">
          <p className="text-xs leading-6 font-medium font-Quicksand text-black">
            {data?.reference ?? "-"}
          </p>
          <p className="mt-5 text-lg font-bold underline underline-offset-4 uppercase text-black inline-block">
            bon de consultation&nbsp;&nbsp;
          </p>
        </div>

        <div className="mt-5 w-full">
          <p
            className="text-10px text-left leading-normal font-medium text-black"
            style={{ fontFamily: "sans-serif" }}
          >
            En application de la convention entrant dans le cadre de la medecine
            de travail, nous avons I'honneur d'orienter, pour consultation,
            notre/nos agents(s) ci-après:
          </p>
        </div>

        <div className="mt-5 w-full">
          <table className="pdfTable w-full !border-collapse !bg-transparent">
            <thead>
              <tr>
                <th className="!bg-transparent !rounded-none !p-2 !border !border-solid !border-black !border-r-0">
                  <p className="text-10px text-left leading-normal font-bold text-black">
                    Personnel concerne
                  </p>
                </th>
                <th className="!bg-transparent !rounded-none !p-2 !border !border-solid !border-black">
                  <p className="text-10px text-left leading-normal font-bold text-black">
                    Observation
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="before:!hidden !bg-transparent">
              <tr>
                <td className="align-top !bg-transparent !rounded-none !p-1 font-medium text-black !border !border-solid !border-black !border-t-0 !border-r-0">
                  <p className="text-10px text-left leading-normal font-medium text-black mb-1 last:mb-0">
                    1-{" "}
                    {data?.employee?.loginUserData?.firstName +
                      " " +
                      data?.employee?.loginUserData?.lastName}
                  </p>
                  <p className="text-10px text-left leading-normal font-medium text-black mb-1 last:mb-0">
                    Date de Consultation:{" "}
                    {data.medicalDate
                      ? moment(data.medicalDate).format("DD MMMM YYYY")
                      : "-"}
                  </p>
                </td>
                <td className="align-top !bg-transparent !rounded-none !p-1 font-medium text-black !border !border-solid !border-black !border-t-0">
                  <>
                    {medicalTypeData?.map((item) => (
                      <p
                        key={item.id}
                        className={`text-10px text-left leading-normal font-medium  mb-1 ${
                          item?.id === data?.medicalTypeId
                            ? "text-primaryRed"
                            : "text-black pl-3.5"
                        }`}
                      >
                        {item?.id === data?.medicalTypeId && (
                          <span className="icon">
                            <RightCheck className="w-3 h-3 inline-block text-primaryRed" />
                          </span>
                        )}{" "}
                        {item?.id === data?.medicalTypeId ? item.name : ""}
                      </p>
                    ))}
                  </>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 w-full">
          <img
            alt="seal"
            className="object-contain max-w-full"
            src={`${
              data?.employee?.client?.stampLogo
                ? String(VITE_APP_API_URL + data?.employee?.client?.stampLogo)
                : "/assets/images/lred-stamp-logo.png"
            }`}
            // width={80}
            style={{ width: "3cm" }}
          />
          <p className="text-10px !text-left leading-normal font-medium text-black mb-1 last:mb-0">
            Hassi Messaoud le, {moment(data.createdAt).format("DD MMMM YYYY")}
            <br /> signature et Cachet
          </p>
        </div>
      </div>
      {/* <div className="sdsdsd text-center mt-4 w-full">
        <p className="text-10px leading-normal font-medium text-black mb-1 last:mb-0">
          SARL LRED Algerie RC n. 16/00-0125267B15
          <br /> NIF: 001530012526756
        </p>
        <p className="text-10px leading-normal font-medium text-primaryRed my-1 !p-2 ">
          Submitted by {data.createdByUser.loginUserData.name} on{" "}
          {moment(data.createdAt).format("DD MMMM YYYY")} at
          {moment(data.createdAt).format("LT")}
          {data?.status === "CANCELLED" &&
            ` , cancelled by ${
              data.updatedByUser.loginUserData.name
            } on ${moment(data.updatedAt).format("DD MMMM YYYY")} at ${moment(
              data.updatedAt
            ).format("LT")}`}
        </p>
      </div> */}
    </>
  );
};

export default MedicalPDF;
