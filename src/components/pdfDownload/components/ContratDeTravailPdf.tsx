import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import { Page, Text, View, Image, Document } from "@react-pdf/renderer";
import { styles } from "../PDFGeneratorStyle";
import moment from "moment";

export const ContratDeTravail = ({
  contractDetails,
  isUpdate,
  rotation,
}: {
  contractDetails?: IContractSummaryData;
  isUpdate?: boolean;
  rotation?: "call-out" | "resident" | "non-resident";
}) => {
  const bonusData: [] = contractDetails?.employeeDetail?.customBonus
    ? JSON.parse(contractDetails?.employeeDetail?.customBonus)?.data
    : [];
  return (
    <Document>
      <Page style={{ padding: "0 0 50px" }}>
        {/* HEADER */}
        {/* <Image style={styles.header} src="/assets/images/header.png" fixed /> */}
        <Image
          style={styles.header}
          src="/assets/images/lred-header.png"
          fixed
        />

        {/* BODY */}
        <View
          style={{
            padding: "0px 40px",
            fontSize: 14,
            textAlign: "justify",
            // color:'#555555 !important',
            // fontFamily: Satoshi,
          }}
        >
          <View style={{ textAlign: "center" }}>
            <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>
              CONTRAT DE TRAVAIL A DUREE DETERMINEE
            </Text>
            <Text style={[styles.header]}>
              N°{" "}
              {isUpdate
                ? contractDetails?.employeeDetail?.client?.contractN ?? ""
                : "[N° number]"}{" "}
              / 2021LRED-{" "}
              {isUpdate
                ? contractDetails?.newContractNumber
                : "[CONTRACT-NUMBER]"}
            </Text>
          </View>
          <View>
            <Text style={[styles.MB5, styles.BodyText, styles.MT10]}>
              Entre les soussignés :
            </Text>
            <Text style={[styles.BodyText, styles.MB10]}>
              <Text style={[styles.TextBlack, styles.MB10]}>LRED</Text>, dont le
              siège social est 18, Rue Hadj Ahmed Mohamed Hydra, Alger 16000
              Algérie, représentée par
              <Text style={[styles.TextBlack, styles.MB10]}>
                {"\n"}
                Dr. HANNACHI NIHAD
              </Text>
              , agissant en qualité de: Gérante
            </Text>
            <Text style={[styles.BodyText, styles.MB10]}>
              À l'effet du présent contrat, ci-après désigné « l'employeur »
            </Text>
            <Text style={[styles.BodyText, styles.MB5]}>
              <Text style={[styles.TextBlack]}>D'une part,</Text>
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
                  styles.borderR,
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
                  // styles.borderL,
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
                    styles.borderR,
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
                    // styles.borderL,
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
                    styles.borderR,
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
                    // styles.borderL,
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
                    styles.borderR,
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
                    // styles.borderL,
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
                    // styles.borderL,
                    styles.borderR,
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
                    // styles.borderL,
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
          <View style={[styles.MT10, styles.MB5]}>
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
          <View style={[styles.MB5]}>
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
              par contrat N°.{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? contractDetails?.employeeDetail?.client?.contractN ?? ""
                  : "[N° number]"}
              </Text>
              .
            </Text>
          </View>
          <View style={[styles.MB5]}>
            <Text style={[styles.Title]}>Article 02 : Objet du contrat </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat de travail établi à l&apos;effet de fixer les
              conditions de la relation de travail du salarié ainsi que les
              droits et les obligations afférents à chaque partie en
              complémentarité de celles édictées par la législation du travail &
              du règlement intérieur de l&apos;employeur.
            </Text>
          </View>
          <View style={[styles.MB5]}>
            <Text style={[styles.Title]}>
              Article 03 : Poste de travail et lieu d&apos;affectation
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le Salarié qui déclare être libre de tout engagement professionnel
              autre que par les présentes est recruté par l&apos;employeur en
              qualité de:{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate ? contractDetails?.employeeDetail?.fonction : "XXX"}
              </Text>
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le salarié déclare par ailleurs consentir à toutes autres ré
              affectations professionnelles et géographiques décidées par
              l&apos;employeur par nécessité de service.
            </Text>
          </View>
          <View style={[styles.MB5]}>
            <Text style={[styles.Title]}>Article 04 : Motif du contrat</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat est conclu pour une durée déterminée à
              l&apos;égard du travail temporaire pour lequel le salarié est
              recruté ; l&apos;employeur étant lié à des contrats de prestations
              non renouvelables.
            </Text>
          </View>
          <View style={[styles.MB5]} break={true}>
            <Text style={[styles.Title]}>Article 05 : Classification</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le salarié recruté pour le poste su-indiqué percevra une
              rémunération comme Suite :
            </Text>
            <View style={[styles.TableBox, styles.MB5]}>
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
                    styles.borderR,
                    styles.half,
                  ]}
                >
                  <Text style={[styles.fontBold, styles.BodyText]}>
                    Salaire mensuel net de :
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
                      ? `${
                          contractDetails?.employeeDetail?.employeeSalary[0]?.monthlySalary?.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) ?? 0
                        } ${
                          contractDetails?.employeeDetail?.client?.currency ??
                          ""
                        }`
                      : "XXX"}
                  </Text>
                </View>
              </View>
              {isUpdate ? (
                contractDetails?.employeeDetail?.employeeBonus &&
                contractDetails?.employeeDetail?.employeeBonus?.length > 0 && (
                  <>
                    {contractDetails?.employeeDetail?.employeeBonus?.map(
                      (e: {
                        bonus: {
                          id: number;
                          name: string;
                          code: string;
                        };
                        code: string;
                        id: number;
                        name: string;
                        bonusId: number;
                        catalogueNumber: string;
                        coutJournalier: number;
                        employeeId: number;
                        endDate: string;
                        price: number;
                        startDate: string;
                      }) => (
                        <View
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row",
                          }}
                        >
                          {/* <> */}
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
                            <Text style={[styles.fontBold, styles.BodyText]}>
                              {e?.bonus?.name} Bonus de :
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
                            <Text style={[styles.fontBold, styles.BodyText]}>
                              <Text style={[styles.TextBlack]}>
                                {e.price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>{" "}
                              {
                                contractDetails?.employeeDetail?.client
                                  ?.currency
                              }{" "}
                              par jour de présence sur chantier (
                              {e?.bonus?.code})
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                    <View
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      {/* <> */}

                      {/* <Text style={[styles.fontBold, styles.BodyText]}>
                          Les bonus sont approuvés par le supérieur hiérarchique
                        </Text> */}
                    </View>

                    {/* <Text style={[styles.fontBold, styles.BodyText]}>
                          Les bonus sont payés chaque trois mois
                        </Text> */}
                  </>
                )
              ) : (
                <>
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
                        styles.borderR,
                        styles.half,
                      ]}
                    >
                      <Text style={[styles.fontBold, styles.BodyText]}>
                        Job bonus de :
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
                      <Text style={[styles.fontBold, styles.BodyText]}>
                        <Text style={[styles.TextBlack]}>XXX</Text> par jour de
                        présence sur chantier (Job)
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
                      <Text style={[styles.fontBold, styles.BodyText]}>
                        Rig bonus de :
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
                      <Text style={[styles.fontBold, styles.BodyText]}>
                        <Text style={[styles.TextBlack]}>XXX</Text> par jour de
                        présence sur chantier (Rig)
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
                      <Text style={[styles.fontBold, styles.BodyText]}>
                        Base bonus de :
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
                      <Text style={[styles.fontBold, styles.BodyText]}>
                        <Text style={[styles.TextBlack]}>XXX</Text> par jour de
                        présence sur base (Base)
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
            {((isUpdate &&
              contractDetails?.employeeDetail?.employeeBonus &&
              contractDetails?.employeeDetail?.employeeBonus?.length > 0) ||
              !isUpdate) && (
              <>
                <Text style={[styles.fontBold, styles.BodyText, styles.MT2]}>
                  Les bonus sont payés chaque trois mois
                </Text>
                <Text style={[styles.fontBold, styles.BodyText, styles.MT2]}>
                  Les bonus sont approuvés par le supérieur hiérarchique
                </Text>
              </>
            )}
            {/* <Text style={[styles.fontBold, styles.BodyText, styles.MT2]}>
              Les bonus sont approuvés par le supérieur hiérarchique Les bonus
              sont payés chaque trois mois
            </Text> */}
            <Text style={[styles.MB5, styles.MT10, styles.BodyText]}>
              Y compris toutes les indemnités, les primes et les retenues
              légales liées à cette position. Le décompte de la paie est opéré
              sur la base de l&apos;état de pointage établi par le Supérieur
              hiérarchique.
            </Text>
          </View>
          <View style={[styles.MB5]}>
            <Text style={[styles.Title]}>Article 06 : Durée du Contrat</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat est conclu pour une durée déterminée de : (
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? moment(contractDetails?.endDate)
                      .add(1, "month")
                      .diff(moment(contractDetails?.startDate), "months")
                      .toString()
                      .padStart(2, "0")
                  : "XXX"}
              </Text>
              ) mois à Compter du{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? moment(contractDetails?.startDate)
                      .locale("fr")
                      .format("DD MMMM YYYY")
                  : "XXXXXX"}
              </Text>{" "}
              au{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? moment(contractDetails?.endDate)
                      .locale("fr")
                      .format("DD MMMM YYYY")
                  : "XXXXX"}
              </Text>
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat prend fin le :{" "}
              <Text style={[styles.TextBlack]}>
                {isUpdate
                  ? moment(contractDetails?.endDate)
                      .locale("fr")
                      .format("DD MMMM YYYY")
                  : "XXX"}
              </Text>
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Dans le cas où les travaux ne sont pas terminés dans les délais
              impartis, la durée du contrat peut être prorogée par les deux
              parties par un simple « Avenant » et ce dans les mêmes conditions
              stipulées dans ce contrat.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              A la fin de la date sus indiquée, la relation de travail liant les
              deux (02) parties est rompue sans qu&apos;il soit utile de
              notifier un préavis.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat ne peut être en aucun cas reconduit tacitement.
              Vu les dispositions de l'article 12 de la loi 90_11 ordonnances n
              96_21du 09 juillet 1996
            </Text>
          </View>
          <View
            style={[styles.MB5]}
            // break={
            //   (bonusData?.length === 0 && !isUpdate) || bonusData?.length > 2
            //     ? true
            //     : false
            // }
            //  break={bonusData?.length === 0 && isUpdate ? true : false}
          >
            <Text style={[styles.Title]}>
              Article 07 : Période d&apos;essai
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le salarié est soumis à une période d&apos;essai de (03) Mois.
              Durant cette période d&apos;essai, le présent contrat peut être
              résilié à tout moment à l&apos;initiative de chaque partie sans
              indemnité ni préavis.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le travailleur nouvellement recrute peut-être soumis à une période
              d&apos;essai dont la durée ne peut excéder six (06) mois.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Au-delà de cette période le préavis est de : Un (01) mois maximum,
              en cas de démission du salarié. Si l'employé quitte dans les 30
              jours suivant la signature du contrat, LRED déduira toutes les
              charges raisonnables de toutes les sommes dues pour le temps
              nécessaire à l&apos;embauche de la personne, ce qui inclura le
              coût des visites médicales d&apos;embauche effectuées. Si des
              efforts supplémentaires étaient entrepris au cours de ce
              processus, LRED en déduirait un montant raisonnable, proportionnel
              au niveau d&apos;effort requis.
            </Text>
          </View>
          <View
            style={[styles.MB5]}
            // break={(bonusData?.length === 0 && !isUpdate) || bonusData?.length > 2
            //   ? true
            //   : false}
            // break={bonusData?.length === 0 && isUpdate ? true : false}
          >
            <Text style={[styles.Title]}>Article 08 : Horaire de travail</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              L&apos;horaire de travail est celui en vigueur sur le lieu
              d&apos;affectation, le volume de travail hebdomadaire est fixé par
              la loi.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              En cas de nécessité de service, le salarié est astreint à exécuter
              des heures supplémentaires conformément à la loi.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              En cas de baisse de volume de travail indépendamment de la volonté
              de l&apos;employeur, celui-ci peut recourir au travail à temps
              partiel dans la limite de la moitié de la durée légale de travail.
              Dans ce cas et après notification le salarié perçoit une
              rémunération proportionnelle au volume de travail pratiqué.
            </Text>
          </View>

          <View
            style={[styles.MB5]}
            break={
              (contractDetails?.employeeDetail?.employeeBonus &&
                contractDetails?.employeeDetail?.employeeBonus?.length === 0 &&
                !isUpdate) ||
              (contractDetails?.employeeDetail?.employeeBonus &&
                contractDetails?.employeeDetail?.employeeBonus?.length > 1)
                ? true
                : false
            }
            // break={bonusData?.length < 2 && isUpdate ? true : false}
          >
            <Text style={[styles.Title]}>Article 09 : Régime de travail</Text>
            {rotation === "call-out" && isUpdate && (
              <Text style={[styles.MB5, styles.BodyText]}>
                Votre régime de travail s&apos;effectuera suivant le système dit
                -Call Out- selon la nécessité de votre présence pour
                l&apos;exécution d&apos;un tel ou tel travail.
              </Text>
            )}
            {rotation === "resident" && isUpdate && (
              <Text style={[styles.MB5, styles.BodyText]}>
                Votre régime de travail s&apos;effectuera suivant le système dit
                régime famille (résident,{" "}
                {contractDetails?.employeeDetail?.rotation?.weekOff} jours
                congés annuels).
              </Text>
            )}
            {rotation === "non-resident" && isUpdate && (
              <Text style={[styles.MB5, styles.BodyText]}>
                Votre régime de travail s&apos;effectuera suivant le système dit
                de rotation sur le rythme de{" "}
                {contractDetails?.employeeDetail?.rotation?.weekOn} semaines de
                travail suivi de{" "}
                {contractDetails?.employeeDetail?.rotation?.weekOff} semaines de
                congé de récupération à votre domicile. Celui-ci couvrant la
                part afférente des congés annuels et des jours ferries légaux.
              </Text>
            )}
            {!isUpdate && (
              <>
                <Text style={[styles.MB5, styles.BodyText]}>
                  isCallOutRotation: Votre régime de travail s&apos;effectuera
                  suivant le système dit -Call Out- selon la nécessité de votre
                  présence pour l&apos;exécution d&apos;un tel ou tel travail.
                </Text>
                <Text style={[styles.MB5, styles.BodyText]}>
                  isResidentRotation: Votre régime de travail s&apos;effectuera
                  suivant le système dit régime famille (résident,{" "}
                  {isUpdate
                    ? contractDetails?.employeeDetail?.rotation?.weekOff
                    : "XXX (NUMBER)"}{" "}
                  jours congés annuels).
                </Text>
                <Text style={[styles.MB5, styles.BodyText]}>
                  isNonResidentRotation: Votre régime de travail
                  s&apos;effectuera suivant le système dit de rotation sur le
                  rythme de{" "}
                  {isUpdate
                    ? contractDetails?.employeeDetail?.rotation?.weekOn
                    : "XXX (NUMBER)"}{" "}
                  semaines de travail suivi de
                  {isUpdate
                    ? contractDetails?.employeeDetail?.rotation?.weekOff
                    : "XXX (NUMBER)"}{" "}
                  semaines de congé de récupération à votre domicile. Celui-ci
                  couvrant la part afférente des congés annuels et des jours
                  ferries légaux.
                </Text>
              </>
            )}
            <Text style={[styles.MB5, styles.BodyText]}>
              Le cycle de travail est fixé compte tenu des nécessités de service
              et de conditions imposées par les clients.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Les absences pour cause de maladie, doivent être justifiées par le
              dépôt ou l'envoi (cachet de la poste faisant foi) dans les 48
              heures qui suivent, du certificat médical original.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              A défaut l'employé sera considéré en absence non justifiée,
              susceptible d'entrainer la rupture du contrat de travail.
            </Text>
          </View>
          <View
            style={[styles.MB5]}
            break={bonusData?.length < 2 && isUpdate ? true : false}
          >
            <Text style={[styles.Title]}>
              Article 10 : Résiliation de Plein droit{" "}
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent Contrat de travail entre le{" "}
              <Text style={[styles.TextBlack]}>salarié & LRED</Text> est résilié
              dans les cas suivants :
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              - Tout refus d'affectation sera considéré comme un abandon de
              poste et entrainera la rupture immédiate du présent contrat de
              travail sans préavis ni indemnité.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              - Tout faux document ; fausse déclaration, ainsi que tout moyen
              frauduleux ou Manœuvre frauduleuse, fournis ou utilisés par
              l'employé afin de se faire recruter, découverts même après sa
              prise de fonction, entrainera la résiliation immédiate du contrat
              de travail, sans préavis ni indemnités.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              - Faute Professionnelle Grave Conformément au Règlement intérieur
              de l&apos;entreprise.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              - Rupture intempestive ou imprévisible du contrat entre LRED & le
              Client{" "}
              {isUpdate
                ? contractDetails?.employeeDetail?.client?.loginUserData?.name
                : "(XXX)"}
              .
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              - Cas de force majeure.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              - A la demande du Superviseur ou Supérieur hiérarchique du lieu
              d&apos;affectation.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              - A la demande et la recommandation du client{" "}
              {isUpdate
                ? contractDetails?.employeeDetail?.client?.loginUserData?.name
                : "(XXX)"}
              .
            </Text>
          </View>
          <View style={[styles.MB5]}>
            <Text style={[styles.Title]}>Article 11 : Litige</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Tout litige pouvant surgir à l'occasion de l‘interprétation et/ou
              de l'exécution du présent contrat du travail devra faire l‘objet
              d'une tentative de règlement amiable entre les deux parties.
            </Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Dans le cas où cette procédure préalable n'aboutit pas, le litige
              sera soumis à l&apos;arbitrage du tribunal de Bir Mourad Rais,
              Alger.
            </Text>
          </View>
          <View style={[styles.MB5]}>
            <Text style={[styles.Title]}>Article 12 : Modifications</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Toute modification apportée au présent contrat ne pourra se faire
              qu&apos;avec l&apos;accord des deux parties et devra faire
              l&apos;objet d&apos;un avenant écrit.
            </Text>
          </View>
          <View style={[styles.MB5]} break={!isUpdate ? true : false}>
            <Text style={[styles.Title]}>Article 13 : Formalités finales.</Text>
            <Text style={[styles.MB5, styles.BodyText]}>
              Le présent contrat sera signé par le salarié qui ajoutera la
              mention « Lu et approuvé » concomitamment à la signature de
              l&apos;employeur.
            </Text>
            <Text style={[styles.MB5, styles.BodyText, styles.MB60]}>
              Fait en deux exemplaires, dont une copie est remise au salarié.
            </Text>
          </View>
          <View style={[styles.MB2]}>
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
                    L&apos;employeur:
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
