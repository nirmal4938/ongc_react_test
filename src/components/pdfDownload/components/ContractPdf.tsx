const ContractPDF = ({ data }: { data: string | undefined }) => {
  return (
    <>
      <div className="mt-2 w-full">
        <div
          className="view ql-editor text-10px leading-normal font-medium text-black"
          dangerouslySetInnerHTML={{ __html: data ?? "" }}
        />
      </div>

      {/* <div className="w-full">
        <img
          alt="seal"
          className="w-24 h-24 mb-4 border border-white"
          src={`/assets/images/blue-stamp-with-sign.jpg`}
        />
      </div>

      <div className="sdsdsd text-center w-full">
        <p className="text-10px leading-normal font-medium text-black mb-1 last:mb-0">
          SARL LRED Algerie RC n. 16/00-0125267B15
          <br /> NIF: 001530012526756
        </p>
      </div> */}
    </>
  );
};

export default ContractPDF;
