import { VITE_APP_API_URL } from "@/config";
import { IEmployeeLeavePDF } from "@/interface/employeeLeave/EmployeeLeaveInterface";
import moment from "moment";

const EmployeeLeavePdf = ({
  employeeLeaveDetail,
}: {
  employeeLeaveDetail: IEmployeeLeavePDF;
}) => {
  return (
    <div
      id="content"
      className="transparent"
      style={{ background: "transparent" }}
    >
      {employeeLeaveDetail?.status === "CANCELLED" && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-primaryRed font-bold font-sans text-5xl z-10">
          CANCELLED
        </div>
      )}

      <table
        className="small !border-0"
        style={{
          maxWidth: "100%",
          width: "100%",
          borderCollapse: "collapse",
          borderSpacing: "0",
          backgroundColor: "transparent !important",
          margin: "0 auto",
        }}
      >
        {/* <thead>
            <tr>
              <img
                src={`/assets/images/new-lred-logo.png`}
                alt="pdfLogo"
                className="w-full max-w-full"
              />
            </tr>
            <tr>
              <div className="mt-3 mb-5 border-t-2 border-solid border-primaryRed w-full"></div>
            </tr>
          </thead> */}
        <thead>
          <tr>
            <th className="!p-0">
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "10px",
                  // borderBottom: "2px solid #6b070d",
                }}
              >
                <div className="img-wrapper">
                  <img
                    src={`./assets/images/new-logo.png`}
                    width="100%"
                    height=""
                    className="!bg-transparent"
                    alt=""
                  />
                </div>

                <div className="text-wrap">
                  {/* <p
                    style={{
                      fontSize: "12px",
                      lineHeight: "15px",
                      fontWeight: "600",
                      fontFamily: "sans-serif",
                      textAlign: "right",
                      margin: "0",
                    }}
                  >
                    LRED <br />
                    18, Rue Hadj Ahmed Mohamed <br />
                    Hydra, Alger 16000 <br />
                    Algeria <br />
                    Mob: +213 (0) 658 450 505
                  </p> */}
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white before:!content-none ">
          <tr>
            <td
              style={{
                padding: "0",
                border: "none",
                background: "transparent",
              }}
            >
              <table
                style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
                className="small !border-0 !bg-transparent"
              >
                <tbody className="before:!content-none">
                  <div
                    className=""
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="!pt-0"
                      style={{
                        textAlign: "right",
                        fontSize: "10px",
                        lineHeight: "15px",
                        fontWeight: "400",
                        fontFamily: "sans-serif",
                        margin: "0",
                        border: "none",
                        paddingRight: "20px",
                        backgroundColor: "transparent",
                        color: "#000",
                      }}
                    >
                      Hassi Messaoud le,{" "}
                      {moment(employeeLeaveDetail?.createdAt).format(
                        "DD MMMM YYYY"
                      )}
                    </div>
                    <div
                      className="!pt-0"
                      style={{
                        textAlign: "left",
                        fontSize: "10px",
                        lineHeight: "15px",
                        fontWeight: "600",
                        fontFamily: "sans-serif",
                        margin: "0",
                        textDecoration: "underline",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#000",
                      }}
                    >
                      Réf: {employeeLeaveDetail?.reference}
                    </div>
                  </div>
                  <tr>
                    <td
                      style={{
                        padding: "15px 0 0",
                        fontWeight: "700",
                        fontSize: "20px",
                        fontFamily: "sans-serif",
                        textAlign: "center",
                        fontStyle: "italic",
                        textDecoration: "underline",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#000",
                      }}
                    >
                      TITRE DE CONGE
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      <table
                        style={{
                          width: "100%",
                          backgroundColor: "transparent  !important",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "#000",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Nom & Prénom:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail
                                ? employeeLeaveDetail?.employeeDetail
                                    .loginUserData.lastName +
                                  " " +
                                  employeeLeaveDetail?.employeeDetail
                                    .loginUserData.firstName
                                : "-"}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Fonction:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail?.employeeDetail.fonction}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Affectation:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail?.employeeDetail.segment
                                ?.name &&
                              employeeLeaveDetail?.employeeDetail.subSegment
                                ?.name
                                ? employeeLeaveDetail?.employeeDetail.segment
                                    .name +
                                  "-" +
                                  employeeLeaveDetail?.employeeDetail.subSegment
                                    .name
                                : employeeLeaveDetail?.employeeDetail.segment
                                    ?.name &&
                                  !employeeLeaveDetail?.employeeDetail
                                    .subSegment?.name
                                ? employeeLeaveDetail?.employeeDetail.segment
                                    ?.name
                                : "-"}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Date de Reprise:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail?.dateDeRepriseEndDate ?? "-"}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Debut de Congé:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail?.debutDeConge}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Date du Retour:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail?.dateDuRetour}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Droit de Congé:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail?.droitDeConge ?? "-"}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Reliquat:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail?.reliquatCalculationData ??
                                "-"}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "600",
                                color: "#000000",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              Lieu de Séjour:
                            </td>
                            <td
                              style={{
                                fontSize: "10px",
                                lineHeight: "18px",
                                fontWeight: "400",
                                color: "#666666",
                                fontFamily: "sans-serif",
                                margin: "0",
                                width: "30%",
                                padding: "1px 0",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              {employeeLeaveDetail.employeeDetail.address
                                ? employeeLeaveDetail.employeeDetail.address
                                : "-"}
                            </td>
                            <td
                              style={{
                                width: "20%",
                                padding: "1px 0",
                                lineHeight: "18px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      className=""
                      style={{
                        textAlign: "right",
                        fontSize: "10px",
                        lineHeight: "15px",
                        fontWeight: "600",
                        fontFamily: "sans-serif",
                        margin: "0",
                        fontStyle: "italic",
                        border: "none",
                        paddingTop: "50px",
                        paddingRight: "20px",
                        backgroundColor: "transparent",
                        color: "#000",
                      }}
                    >
                      Chargée de l&apos;Administration <br />
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="!p-0"
                      style={{
                        textAlign: "right",
                        fontFamily: "sans-serif",
                        margin: "0",
                        border: "none",
                        paddingTop: "0px",
                        paddingRight: "20px",
                        paddingBottom: "0px",
                        backgroundColor: "transparent",
                      }}
                    >
                      <img
                        alt="seal"
                        className="object-contain ml-auto max-w-full"
                        src={`${
                          employeeLeaveDetail?.employeeDetail?.client?.stampLogo
                            ? String(
                                VITE_APP_API_URL +
                                  employeeLeaveDetail?.employeeDetail?.client
                                    ?.stampLogo
                              )
                            : "/assets/images/lred-stamp-logo.png"
                        }`}
                        style={{ width: "3cm" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeLeavePdf;
