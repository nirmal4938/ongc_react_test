import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import moment from "moment";
import { Page, Text, View, Image, Document } from "@react-pdf/renderer";
import { styles } from "../PDFGeneratorStyle";

export const Avenant = ({
  contractDetails,
  isUpdate,
}: {
  contractDetails?: IContractSummaryData;
  isUpdate?: boolean;
}) => {
  return (
    <Document>
      <Page style={{ padding: "0 0 50px" }}>
        {/* HEADER */}
        <Image
          style={styles.header}
          src="/assets/images/lred-header.png"
          fixed
        />

        {/* BODY */}
        <View
          style={{
            padding: "0px 30px",
            fontSize: 14,
            textAlign: "justify",
            // color:'#555555 !important',
            // fontFamily: Satoshi,
            marginTop: "20px",
          }}
        >
          <View style={{ textAlign: "center" }}>
            <Text
              style={[
                styles.header,
                { fontStyle: "italic", fontWeight: "bold" },
              ]}
            >
              AVENANT N° 01 AU CONTRAT N°{" "}
              {isUpdate
                ? contractDetails?.employeeDetail?.client?.contractN ?? ""
                : "[N° number]"}{" "}
              / 2021LRED-
              {isUpdate
                ? contractDetails?.newContractNumber
                : "[CONTRACT-NUMBER]"}
            </Text>
          </View>
          <View>
            <Text style={[styles.MB5, styles.BodyText]}>
              Entre les soussignés :
            </Text>
            <Text style={[styles.BodyText, styles.MB10]}>
              <Text style={[styles.TextBlack]}>LRED</Text>, dont le siège social
              est 18, Rue Hadj Ahmed Mohamed Hydra, Alger 16000 Algérie,
              représentée par
              <Text style={[styles.TextBlack]}> Dr. HANNACHI NIHAD</Text>,
              agissant en qualité de:{" "}
              <Text style={[styles.TextBlack]}>Gérante</Text>
            </Text>
            <Text style={[styles.BodyText, styles.MB10]}>
              À l'effet du présent contrat, ci-après désigné « l'employeur »
            </Text>
            <Text style={[styles.BodyText, styles.MB10, styles.TextBlack]}>
              D'une part,
            </Text>
          </View>
          <View style={[styles.TableBox]}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  styles.borderT,
                  styles.borderB,
                  styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                >
                  Monsieur (Nom & Prénom):
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  styles.borderT,
                  styles.borderB,
                  styles.borderL,
                  styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                >
                  {isUpdate
                    ? contractDetails?.employeeDetail?.loginUserData?.lastName +
                      " " +
                      contractDetails?.employeeDetail?.loginUserData?.firstName
                    : "FAMILY NAME (in capital) First name (in small case)"}
                </Text>
              </View>
            </View>

            {isUpdate &&
            (contractDetails?.employeeDetail?.loginUserData?.birthDate ||
              contractDetails?.employeeDetail?.loginUserData?.placeOfBirth) ? (
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    // styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    Né(e) le:
                  </Text>
                </View>
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    {contractDetails?.employeeDetail?.loginUserData?.birthDate
                      ? moment(
                          contractDetails?.employeeDetail?.loginUserData
                            ?.birthDate
                        )
                          .locale("fr")
                          .format("DD MMMM YYYY")
                      : ""}{" "}
                    à{" "}
                    {contractDetails?.employeeDetail?.loginUserData
                      ?.placeOfBirth ?? ""}
                  </Text>
                </View>
              </View>
            ) : !isUpdate ? (
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    // styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    Né(e) le:
                  </Text>
                </View>
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    [DOB] à [PLACE-OF-BIRTH]
                  </Text>
                </View>
              </View>
            ) : (
              <></>
            )}

            {isUpdate && contractDetails?.employeeDetail?.address ? (
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    // styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    Demeurant à:
                  </Text>
                </View>
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    {contractDetails?.employeeDetail?.address}
                  </Text>
                </View>
              </View>
            ) : !isUpdate ? (
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    // styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    Demeurant à:
                  </Text>
                </View>
                <View
                  style={[
                    styles.p4,
                    styles.hFull,
                    // styles.borderT,
                    styles.borderB,
                    styles.borderL,
                    styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text
                    style={[styles.fontBold, styles.BodyText, styles.TextBlack]}
                  >
                    [ADDRESS]
                  </Text>
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
          <View style={[styles.MT20, styles.MB10]}>
            <Text style={[styles.MB5, styles.BodyText]}>
              Ci-après désigné « le Salarié »,
            </Text>
            <Text style={[styles.MB5, styles.BodyText, styles.TextBlack]}>
              D&apos;autre part
            </Text>
            <Text style={[styles.MB5, styles.BodyText, styles.TextBlack]}>
              Il a été convenu et arrêté ce qui suit :
            </Text>
          </View>
          <View style={[styles.MT20]}>
            <Text style={[styles.Title]}>Article 01 : Texte de Référence</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              La relation de travail entre les parties, faisant l&apos;objet du
              présent contrat, est régie par Les dispositions législatives et
              réglementaires de la République Algérienne Démocratique et
              Populaire en vigueur, notamment: La Loi n° 90-11 du 21.04.1990
              relative aux relations de travail, modifiée et complétée par la
              Loi n° 91-29 du 21.12.1991, et en particulier par les dispositions
              de son article 12 alinéa 1,2,3 & 4 et modifiée & complétée par
              l&apos;ordonnance N° 96-21 du 09/07/1996 relative & complémentaire
              à la Loi 90-11 qui autorisent le contrat à durée déterminée,
              l&apos;ordonnance N° 03/97 du 11/01/ 1997 relative à la durée
              légale de travail, Et enfin le règlement intérieur de
              l&apos;entreprise et aux procédures internes en vigueur.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Comme si l&apos;activité de l&apos;entreprise est liée à
              l&apos;industrie des hydrocarbures et essentiellement au contrat
              avec notre client{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? contractDetails?.employeeDetail?.client?.loginUserData?.name
                  : "XXX"}
              </Text>{" "}
              {isUpdate &&
              (contractDetails?.employeeDetail?.client?.contractN ||
                contractDetails?.employeeDetail?.client?.contractTagline)
                ? `(${
                    contractDetails?.employeeDetail?.client?.contractN ?? ""
                  } ${
                    contractDetails?.employeeDetail?.client?.contractTagline
                      ? `this contract is related to ${contractDetails?.employeeDetail?.client?.contractTagline}`
                      : ""
                  }).`
                : ""}
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat est lié directement et automatiquement à la
              relation de la LRED avec la société de{" "}
              {isUpdate
                ? contractDetails?.employeeDetail?.client?.loginUserData?.name
                : "XXX"}{" "}
              par contrat N°{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? contractDetails?.employeeDetail?.client?.contractN ?? ""
                  : "[N° number]"}
              </Text>
            </Text>
          </View>
          <View style={[styles.MT20]}>
            <Text style={[styles.Title]}>
              Article 02 : Référence de l&apos;Avenant :{" "}
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent avenant se réfère au contrat de travail à durée
              déterminée N°{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? contractDetails?.employeeDetail?.client?.contractN ?? ""
                  : "[N° number]"}{" "}
                /2021LRED{" "}
                {isUpdate
                  ? contractDetails?.newContractNumber
                  : "[CONTRACT-NUMBER]"}
              </Text>
            </Text>
          </View>
          <View style={[styles.MT20]}>
            <Text style={[styles.Title]}>
              Article 03 : Objet de l&apos;avenant :
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent avenant est établi à l&apos;effet de :
            </Text>
            {isUpdate &&
              moment(contractDetails?.employeeDetail?.fonctionDate).isBetween(
                contractDetails?.startDate,
                contractDetails?.endDate,
                null,
                "[]"
              ) && (
                <Text style={[styles.MB5, styles.BodyText]}>
                  • Changement de position à{" "}
                  <Text style={[styles.TextBlack]}>
                    {contractDetails?.employeeDetail?.fonction}
                  </Text>
                  .
                </Text>
              )}
            {!isUpdate && (
              <Text style={[styles.MB5, styles.BodyText]}>
                • Changement de position à{" "}
                <Text style={[styles.TextBlack]}>{"[fonction]"}</Text>.
              </Text>
            )}
            {!isUpdate && (
              <Text style={[styles.MB5, styles.BodyText]}>
                • Changement de rotation à{" "}
                <Text style={[styles.TextBlack]}>{"[Rotation-Name]"}</Text>
              </Text>
            )}
            {isUpdate &&
              contractDetails?.employeeDetail &&
              contractDetails?.employeeDetail?.employeeRotation?.length > 0 && (
                <Text style={[styles.MB5, styles.BodyText]}>
                  • Changement de rotation à{" "}
                  <Text style={[styles.TextBlack]}>
                    {
                      contractDetails?.employeeDetail?.employeeRotation[0]
                        ?.rotation?.name
                    }
                  </Text>
                </Text>
              )}
            {!isUpdate && (
              <Text style={[styles.MB5, styles.BodyText]}>
                • Augmentation du salaire à{" "}
                <Text style={[styles.TextBlack]}>{"[MONTHLY-SALARY]"} </Text>
                par mois
              </Text>
            )}
            {isUpdate &&
              contractDetails?.employeeDetail &&
              contractDetails?.employeeDetail?.employeeSalary?.length > 0 && (
                <Text style={[styles.MB5, styles.BodyText]}>
                  • Augmentation du salaire à{" "}
                  <Text style={[styles.TextBlack]}>
                    {`${
                      contractDetails?.employeeDetail?.employeeSalary[0]?.monthlySalary?.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      ) ?? 0
                    } ${
                      contractDetails?.employeeDetail?.client?.currency ?? ""
                    }`}{" "}
                  </Text>
                  par mois
                </Text>
              )}
            {isUpdate &&
              contractDetails?.employeeDetail &&
              contractDetails?.employeeDetail?.employeeBonus?.length > 0 &&
              contractDetails?.employeeDetail?.employeeBonus?.map((e) => {
                return (
                  <Text style={[styles.MB5, styles.BodyText]}>
                    • {e?.bonus?.name} Bonus de :
                    {e?.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {contractDetails?.employeeDetail?.client?.currency ?? ""}{" "}
                    par jour de présence sur chantier ({e?.bonus?.code})
                  </Text>
                );
              })}
            <Text style={[styles.MB5, styles.BodyText]}>
              • Le présent avenant entrera en vigueur le{" "}
              {isUpdate
                ? moment(contractDetails?.startDate)
                    .locale("fr")
                    .format("DD MMMM YYYY")
                : "[START-DATE]"}
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Les autres articles du contrat de travail N°{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? contractDetails?.employeeDetail?.client?.contractN ?? ""
                  : "[N° number]"}{" "}
                / 2021-LRED{" "}
                {isUpdate
                  ? contractDetails?.newContractNumber
                  : "[CONTRACT-NUMBER]"}{" "}
              </Text>
              restent inchangeables.
            </Text>
          </View>
          <View style={[{ marginTop: "23px" }]}>
            <Text style={[styles.Title]}>Article 13 : Formalités finales.</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat sera signé par le salarié qui ajoutera la
              mention « Lu et approuvé » concomitamment à la signature de
              l&apos;employeur.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Fait en deux exemplaires, dont une copie est remise au salarié.
            </Text>
          </View>
          <View style={[styles.MB10, styles.MT60]}>
            <View style={[styles.TableBox]}>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View style={[styles.hFull, { width: "45%" }]}></View>
                <View style={[styles.hFull, { width: "45%" }]}>
                  <Text
                    style={[
                      styles.fontBold,
                      styles.BodyText,
                      styles.TextBlack,
                      styles.Text12,
                    ]}
                  >
                    Alger, le :
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.TableBox, { maxWidth: "100%" }]}>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginBottom: "10px",
                }}
              >
                <View style={[styles.hFull, { width: "45%" }]}>
                  <Text
                    style={[
                      styles.fontBold,
                      styles.BodyText,
                      styles.TextBlack,
                      styles.Text12,
                    ]}
                  >
                    Le salarié
                  </Text>
                </View>
                <View style={[styles.hFull, { width: "45%" }]}>
                  <Text
                    style={[
                      styles.fontBold,
                      styles.BodyText,
                      styles.TextBlack,
                      styles.Text12,
                    ]}
                  >
                    L’employeur:
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View style={[styles.hFull, { width: "45%" }]}>
                  <Text
                    style={[
                      styles.fontBold,
                      styles.BodyText,
                      styles.TextBlack,
                      styles.Text12,
                    ]}
                  >
                    {isUpdate
                      ? contractDetails?.employeeDetail?.loginUserData
                          ?.lastName +
                        " " +
                        contractDetails?.employeeDetail?.loginUserData
                          ?.firstName
                      : "FAMILY NAME (in capital) First name (in small case)"}
                  </Text>
                </View>
                <View style={[styles.hFull, { width: "45%" }]}>
                  <Text
                    style={[
                      styles.fontBold,
                      styles.BodyText,
                      styles.TextBlack,
                      styles.Text12,
                    ]}
                  >
                    TRIKI Achour
                  </Text>
                  <Text
                    style={[
                      styles.fontBold,
                      styles.BodyText,
                      styles.TextBlack,
                      styles.Text12,
                    ]}
                  >
                    HR Manager LRED
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.WaterMark]} fixed={true}>
          <Image
            style={[styles.WaterMarkImage]}
            src="/assets/images/lred-logo-big.png"
          />
        </View>

        {/* FOOTER */}
        <View style={[styles.pageFooter]} fixed={true}>
          {/* <Image style={[styles.footerImage]} src="/assets/images/footer.png" /> */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber}/${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};
