import { PDFExport } from "@progress/kendo-react-pdf";
import "react-quill/dist/quill.snow.css";
const PDFGenerator = ({
  PDFRef,
  fileName,
  content,
  paperSize,
  repeatHeaders,
  landscape = false,
  isTimesheetPdf = false,
  // isEmployeeLeavePdf = false,
  // isMedicalPdf = false,
  // repeatPageNumber,
  isShow = false,
  // isFooter,
  footerContent,
  marginBottom,
  marginTop,
}: {
  content: JSX.Element;
  PDFRef: React.LegacyRef<PDFExport>;
  fileName?: string;
  paperSize?: string;
  isTimesheetPdf?: boolean;
  isMedicalPdf?: boolean;
  isEmployeeLeavePdf?: boolean;
  landscape?: boolean;
  repeatHeaders?: boolean;
  repeatPageNumber?: boolean;
  isShow?: boolean;
  isFooter?: boolean;
  footerContent?: string[] | string;
  marginBottom?: string;
  marginTop?: string;
}) => {
  return (
    <div>
      <PDFExport
        paperSize={paperSize ? paperSize : "A4"}
        margin={{
          top: `${marginTop ?? "0cm"}`,
          left: "0cm",
          right: "0cm",
          bottom: `${marginBottom ?? "0cm"}`,
        }}
        ref={PDFRef}
        landscape={landscape}
        repeatHeaders={repeatHeaders}
        fileName={fileName ? fileName.trim() : "LRED"}
        keepTogether=".keepTogether"
        
        pageTemplate={(e:{pageNum:number,totalPages:number}) => (
          <>
            {footerContent && (
              <div className="absolute bottom-0 pointer-events-none !w-full right-0 pb-4 left-0 mx-auto !px-10">
                <div className="flex items-start justify-between">
                  <p
                    className={`${
                      isTimesheetPdf ? "text-xs" : "text-[8px]"
                    } leading-6 font-semibold font-sans px-4 text-primaryRed text-left w-[15%] m-0`}
                  >
                    Page {e.pageNum} of {e.totalPages}
                  </p>
                  <p
                    className={`${
                      isTimesheetPdf ? "text-xs" : "text-[8px]"
                    } leading-6 font-semibold font-sans px-4 text-primaryRed w-[85%] text-right `}
                  >
                    {Array.isArray(footerContent)
                      ? footerContent
                          .join(",")
                          .replaceAll("UNAPPROVED", "unapproved")
                          .replaceAll("APPROVED", "approved")
                      : footerContent}
                  </p>
                </div>
                {/* {isFooter && (
                  <img
                    src="/assets/images/footer.png"
                    alt="pdfLogo"
                    className="w-full max-w-full object-fill"
                  />
                )} */}
              </div>
            )}
            <div className="absolute top-1/2 mx-auto -translate-y-1/2 max-w-full w-[80%] left-0 right-0 pointer-events-none opacity-10">
              {/* <img src="/assets/images/lred-logo-big.png" alt="" /> */}
              <img src="/assets/images/new-lred-logo.png" alt=""/>
            </div>
          </>
        )}

        // pageTemplate={repeatPageNumber}
      >
        <div className="space-x-0 bg-white font-sans relative">
          <div className="header HeaderTemplate">
            <div className="img-wrapper absolute w-[350px] top-[30px] left-20">
              <img
                src={
                  // isTimesheetPdf || isMedicalPdf ||isEmployeeLeavePdf
                  isTimesheetPdf ? "/assets/images/new-lred-logo.png" : ""
                }
                alt=""
                className="w-full max-w-full"
              />
            </div>
          </div>
          {/*  !py-7 */}
          <div
            className={`content text-black font-normal ${
              isShow ? "!bg-transparent" : ""
            } p-0 flex flex-col items-start justify-normal relative`}
          >
            <div className="w-full">{content}</div>
          </div>
        </div>
      </PDFExport>

      <table className="space-x-0 hidden">
        <thead slot="headerTemplate">
          <tr>
            <img
              src={
                isTimesheetPdf
                  ? "/assets/images/header-timesheet.png"
                  : "/assets/images/header.png"
              }
              alt="pdfLogo"
              className="w-full max-w-full"
            />
          </tr>
          <tr>&nbsp;</tr>
        </thead>
        <tbody
          className={`${
            isShow ? "!bg-transparent" : ""
          }p-0 flex flex-col items-start justify-normal relative`}
        >
          <td className="!p-0 flex flex-col items-start justify-normal relative !bg-transparent z-10 !border-0">
            {content}
          </td>
        </tbody>
        {/* <tfoot className="bottom-0 left-0 w-full">
            <img
              src={`/assets/images/footer.png`}
              alt="pdfLogo"
              className="w-full max-w-full object-fill"
            />
          </tfoot> */}
      </table>
    </div>
  );
};

export default PDFGenerator;
