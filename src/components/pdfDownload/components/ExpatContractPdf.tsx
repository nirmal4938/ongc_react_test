import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import moment from "moment";

import { styles } from "../PDFGeneratorStyle";
import { Page, Text, View, Image, Document } from "@react-pdf/renderer";

export const Expat = ({
  contractDetails,
  isUpdate,
}: {
  contractDetails?: IContractSummaryData;
  isUpdate?: boolean;
}) => {
  const convertToThreeDigits = (number: number) => {
    let strNumber = String(number);

    while (strNumber.length < 3) {
      strNumber = "0" + strNumber;
    }

    return strNumber;
  };
  return (
    // <>
    <Document>
      <Page style={{ padding: "100 0 50px" }}>
        <View style={{ padding: " 20px 0 " }}>
          <Image
            style={{ width: "40%", margin: "0 auto" }}
            src="/assets/images/lred-logo-big.png"
          />
        </View>
        <View style={{ padding: " 30px 0 0 " }}>
          <Text
            style={[
              styles.Title,
              { textDecoration: "none", textAlign: "center" },
            ]}
          >
            CONTRACT NO.{"  "}
            {isUpdate
              ? `LRED/${contractDetails?.employeeDetail?.client?.code}/SC${
                  contractDetails?.employeeDetail?.client?.contractN
                    ? "/" +
                      contractDetails?.employeeDetail?.client?.contractN?.replaceAll(
                        " ",
                        ""
                      )
                    : ""
                }/23/${contractDetails?.newContractNumber}`
              : "……………………"}
          </Text>
        </View>
        <View style={{ padding: " 30px 0 10 " }}>
          <Text
            style={[
              styles.Title,
              { textDecoration: "none", textAlign: "center" },
            ]}
          >
            GENERAL AGREEMENT
          </Text>
        </View>
        <View style={{ padding: " 30px 0 0 " }}>
          <Text
            style={[
              styles.Title,
              { textDecoration: "none", textAlign: "center" },
            ]}
          >
            BETWEEN
          </Text>
        </View>
        <View style={{ padding: " 30px 0 0 " }}>
          <Text
            style={[
              styles.Title,
              { textDecoration: "none", textAlign: "center" },
            ]}
          >
            LRED CONSULTANCY SERVICES LIMITED
          </Text>
        </View>
        <View style={{ padding: " 30px 0 0 " }}>
          <Text
            style={[
              styles.Title,
              { textDecoration: "none", textAlign: "center" },
            ]}
          >
            AND
          </Text>
        </View>
        <View style={{ padding: " 30px 0 0 " }}>
          <Text
            style={[
              styles.Title,
              { textDecoration: "none", textAlign: "center" },
            ]}
          >
            {isUpdate
              ? contractDetails?.employeeDetail?.loginUserData?.lastName +
                " " +
                contractDetails?.employeeDetail?.loginUserData?.firstName
              : "……………………………"}
          </Text>
        </View>
      </Page>

      <Page style={{ padding: "40px 25px 60px 25px" }}>
        {/* HEADER */}
        <Image
          style={styles.header}
          src="/assets/images/lred-header.png"
          fixed
        />

        {/* BODY */}
        <View
          style={{
            padding: "40px 30px",
            fontSize: 14,
            textAlign: "justify",
            // color:'#555555 !important',
            // fontFamily: Satoshi,
          }}
        >
          <View style={{ textAlign: "center" }}>
            <Text
              style={[
                styles.header,
                { fontStyle: "italic", fontWeight: "bold" },
              ]}
            >
              Contents
            </Text>
          </View>
          {/* <View>
          <Text style={[styles.MB5, styles.BodyText1]}>
            Entre les soussignés :
          </Text>
          <Text style={[styles.BodyText1, styles.MB10]}>
            <Text style={styles.TextBlack}>LRED</Text>, dont le siège social
            est 18, Rue Hadj Ahmed Mohamed Hydra, Alger 16000 Algérie,
            représentée par
            <Text style={styles.TextBlack}> Dr. HANNACHI NIHAD</Text>,
            agissant en qualité de: Gérante
          </Text>
          <Text style={[styles.BodyText1, styles.MB10]}>
            À l'effet du présent contrat, ci-après désigné « l'employeur »
          </Text>
          <Text style={[styles.BodyText1, styles.MB10]}>D'une part,</Text>
        </View> */}
          <View style={[styles.TableBox]}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                padding: "30px 0 0",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 1
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  DEFINITIONS AND INTERPRETATION
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 3
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 2
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  TERM{" "}
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 4
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 3
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  MANNER OF PERFORMANCE
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 4
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 4
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  TITLES
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 6
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 5
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  CONFIDENTIAL INFORMATION
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 6
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 6
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  INVENTIONS
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 7
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 7
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  COMPENSATION
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 7
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 8
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  INDEPENDENT CONTRACTOR
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 8
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 9
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  TAX
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 9
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 10
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  TERMINATION
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 10
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 11
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  FORCE MAJEURE
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 11
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 12
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  NON-WAIVER
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 11
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 13
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ASSIGNMENT
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 11
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 14
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  LIABILITIES AND INDEMNITIES
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 12
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 15
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  INSURANCE
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 13
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 16
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  HEALTH, SAFETY AND ENVIRONMENT
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 14
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 17
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  NOTICES
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 15
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 18
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  GOVERNING LAW
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 15
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 19
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ENTIRE AGREEMENT
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 15
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
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  ARTICLE 20
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wSixty,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  GENERAL PROVISIONS
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 15
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.TableBox]}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "60%",
                margin: " 40px auto 0",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  Schedule I
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 17
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "60%",
                margin: " 0 auto",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  Schedule II
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 21
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "60%",
                margin: " 0 auto",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, { color: "#000" }]}
                >
                  Schedule III
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.wTwenty,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "right", color: "#000" },
                  ]}
                >
                  Page 22
                </Text>
              </View>
            </View>
          </View>

          {/* till page contents    */}

          <View>
            <Text
              style={[styles.MT10, styles.MB10, styles.BodyText1]}
              break={true}
            >
              This General Agreement is made effective as of the
              {isUpdate
                ? " " +
                  moment(contractDetails?.startDate).locale("fr").format("Do") +
                  " day of " +
                  moment(contractDetails?.startDate)
                    .locale("fr")
                    .format("MMMM YYYY")
                : "DD day of month year"}
              , by and between LRED Consultancy Services limited, a company
              registered in England under number 14774959 and having its
              registered office Brightwell Grange, Britwell Road, Burnham, Bucks
              SL1 8DF (“Company”) and{" "}
              {isUpdate
                ? contractDetails?.employeeDetail?.loginUserData?.lastName +
                  " " +
                  contractDetails?.employeeDetail?.loginUserData?.firstName +
                  " " +
                  (contractDetails?.employeeDetail?.address
                    ? "of " + contractDetails?.employeeDetail?.address
                    : "")
                : "XXXXXXX"}
              (“Contractor”).
            </Text>

            <Text style={[styles.BodyText1, styles.MB10]}>WHEREAS:</Text>
            <View
              style={{
                display: "flex",
                gap: "15px",
                flexDirection: "row",
                marginLeft: "20px",
              }}
            >
              <Text style={[styles.MB10, styles.BodyText1, { width: "2%" }]}>
                a)
              </Text>
              <Text style={[styles.MB10, styles.BodyText1, { width: "98%" }]}>
                The Company wishes to engage the Contractor to perform certain
                services as the Company may require.
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: "15px",
                flexDirection: "row",
                marginLeft: "20px",
              }}
            >
              <Text style={[styles.MB10, styles.BodyText1, { width: "2%" }]}>
                b)
              </Text>
              <Text style={[styles.MB10, styles.BodyText1, { width: "98%" }]}>
                Contractor represents that it has the necessary experience and
                expertise to provide such services; and
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                gap: "15px",
                flexDirection: "row",
                marginLeft: "20px",
              }}
            >
              <Text style={[styles.MB10, styles.BodyText1, { width: "2%" }]}>
                c)
              </Text>
              <Text style={[styles.MB10, styles.BodyText1, { width: "98%" }]}>
                Company and Contractor have agreed that Contractor shall perform
                provide such services on the terms and conditions of this
                Agreement.
              </Text>
            </View>
            <Text style={[styles.MB10, styles.BodyText1]}>
              NOW, THEREFORE the Parties hereto (hereinafter “Party” or
              “Parties”) mutually agree as follows:
            </Text>
          </View>

          {/* Article one */}

          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "15%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                ARTICLE 1
              </Text>
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "85%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                DEFINITIONS AND INTERPRETATION
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <Text style={[styles.MB10, styles.BodyText1]}>
                For all purposes of this agreement, except as may otherwise
                expressly be provided herein or unless the context otherwise
                requires a) the terms defined in the Article 1 shall have the
                meanings assigned to them in this Article 1 and shall include
                the plural as well as the singular; and b) all references to any
                Article, Clause or schedule shall be references to an Article,
                Clause or Schedule (as the case may be) of or to this agreement.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                “Affiliate” shall mean the respect to each of the Company,
                Contractor or the Client – any entity that, directly or
                indirectly through one or more intermediaries, controls, or is
                controlled by, or is under common control with each “control
                being the legal or beneficial ownership of more than fifty
                percent (50%) of the issued voting share capital of an entity,
                or the power to direct the decisions of the board of directors
                (or similar managerial body) or day-to-day activities or
                management of the entity.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                "Agreement" shall mean this general agreement (including the
                recital, Schedules I, II and Ill attached and any Work Order) as
                may be from time to time supplemented or amended in accordance
                with the applicable provisions hereof. Schedules I, II and Ill
                are hereby incorporated in and made a part of this Agreement. In
                the event of any ambiguity, inconsistency or conflict between
                any of the provisions of the Schedules, the Work Order and any
                of the terms and conditions contained in the main body of this
                Agreement, the latter shall prevail.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                "Client" shall mean any customer or potential customer of
                Company, or any company identified on the applicable Work Order,
                which has an agreement with the Company for the provision of
                works and services and / or personnel.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                "Client Group" shall mean Client, its Affiliates, its
                co-venturers and their Affiliates, Client's other contractors of
                any tier and the officers, directors and employees of all of
                them but shall not include any member of Company Group or
                Contractor Group.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                "Company" shall mean LRED consultancy services limited., the
                successor in interest. of that company, the permitted assignee
                of that company or of such successor in interest.
              </Text>

              <Text style={[styles.MB10, styles.BodyText1]} break={true}>
                "Company Group" shall mean the Company, its Affiliates, its
                co-venturers and their Affiliates, Company's other contractors
                of any tier and the officers, directors, employees, agents,
                owners, shareholders, invitees and insurers of each but shall
                not include any member of Client Group or Contractor Group.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                “Contractor” shall mean{" "}
                {isUpdate
                  ? contractDetails?.employeeDetail?.loginUserData?.lastName +
                    " " +
                    contractDetails?.employeeDetail?.loginUserData?.firstName
                  : "…………………"}
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                “Consultant” shall mean the person supplied by the Contractor in
                accordance with the Work Order for the performance of the Work.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                "Site Rules" shall mean those policies, work, administration and
                safety guidelines, procedures, rules, and standards developed,
                adopted or accepted by the Company (or by the Contractor who
                shall notify the Company and obtain written approval before
                accepting such policies rules etc.) for use by Company and its
                contractors in respect of Company or Client operations hereunder
                including those specified in the Work Order.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                “Subsidiary” shall mean “subsidiary” as that term is defined in
                Section 736 of the Companies Act 1985.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                “Work Order” shall mean a document as described in Schedule I,
                PART I, Clause B.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                “Work” and “Work Product” shall mean all work performed by the
                Consultant pursuant to the Agreement including that set out in
                the Schedules and including without limitation any information,
                materials, techniques, processes, concepts, developments,
                discoveries, improvements, innovations (whether patentable or
                not), computer programs, or software in object code and source
                code which Consultants develops, makes or conceives either
                solely or jointly under the Agreement.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                A person who is not a Party has no right under the Contracts
                (Rights of Third Parties) Act 1999 to enforce any term of this
                Agreement.
              </Text>
            </View>
          </View>

          {/* Article Two */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "15%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                ARTICLE 2
              </Text>
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "85%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                TERM
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <Text style={[styles.MB10, styles.BodyText1]}>
                This Agreement shall continue in full force and effect unless
                and until terminated earlier in accordance with its terms.
              </Text>
            </View>
          </View>

          {/* Article Theree */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "15%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                ARTICLE 3
              </Text>
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "85%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                MANNER OF PERFORMANCE
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  3.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall make available to the Company the
                  services of the Consultant during the term of this Contract
                  and t h e Contractor shall and shall procure that Consultant
                  shall perform the Work to the highest professional standards,
                  in a safe manner, in accordance with accepted practices in the
                  petroleum industry and with due regard to the protection of
                  the environment. Contractor shall further procure that
                  Consultant is fully competent to perform the Work and shall
                  carry out the Work in a competent and workmanlike manner with
                  all due skill, care and diligence and in accordance with such
                  directions as may be given by a duly authorised representative
                  of Company or Client as the case may be. The terms of this
                  Agreement shall apply to any performance of the Work by or on
                  behalf of the Contractor.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  3.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor warrants that it shall and it shall procure
                  that Consultant shall comply fully and at all times with all
                  applicable Site Rules including those specified in the Work
                  Order and with all applicable decrees, laws, regulations,
                  rules, orders and ordinances of any governmental and other
                  authorities having jurisdiction. Unless otherwise provided in
                  writing by Company, Consultant shall not be entitledto
                  represent Company in any dealings with third parties.
                </Text>
              </View>
              <View style={{ marginTop: "0px" }}>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                  >
                    3.3
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    For the purpose of this Article 3.3:
                  </Text>
                </View>
                <View style={{ marginLeft: "40px" }}>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                    >
                      3.3.1
                    </Text>
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "95%", display: "flex", gap: "15px" },
                      ]}
                    >
                      <Text style={[styles.MB10, styles.BodyText1]}>
                        “Government Official”
                      </Text>
                      <Text style={[styles.MB10, styles.BodyText1]}>
                        means: (i) any director, officer or employee of a Public
                        Body or any person acting in an official capacity on its
                        behalf; (ii) any officer, employee or candidate of any
                        political party or faction; (iii) anyone otherwise
                        holding a legislative, administrative or judicial
                        position at any Public Body; or (d) any director,
                        officer or employee of any public international
                        organization (e.g. the UN or World Bank). Government
                        Official also includes immediate family members of
                        anyone described above.
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                    >
                      3.3.2
                    </Text>
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "95%", display: "flex", gap: "15px" },
                      ]}
                    >
                      <Text style={[styles.MB10, styles.BodyText1]}>
                        “Public Body”
                      </Text>
                      <Text style={[styles.MB10, styles.BodyText1]}>
                        means any central or local government, or any ministry,
                        department, agency or instrumentality of, or entity
                        owned or controlled by, a government (e.g., a National
                        Oil Company).
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                    >
                      3.3.3
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      Contractor undertakes: (a) to conduct its business in
                      performing the Agreement in a way that is consistent with
                      the principles set out in the Client Code of Conduct (a
                      copy of which is available upon request) and with the
                      obligations set out below; and (b) for the duration of
                      this Agreement, to maintain and enforce its own policies
                      and procedures relating to business ethics, to ensure
                      compliance with the Relevant Requirements (as defined
                      below) and consistent with the Client Code of Conduct.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                    >
                      3.3.4
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      Contractor warrants, represents and agrees that:
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "5%", textAlign: "right" },
                      ]}
                    >
                      a)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      in entering into this Agreement it has complied, and in
                      performing this Agreement it shall comply, with all
                      applicable laws, statutes, regulations and orders relating
                      to anti-bribery, anti-corruption, competition and trade
                      control (“Relevant Requirements”)
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "5%", textAlign: "right" },
                      ]}
                    >
                      b)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      it shall not provide gifts or entertainment to the Company
                      or Client’s employees: (i) above a nominal value of two
                      hundred US Dollars ($200) or the equivalent in local
                      currency or in any manner that is deemed excessive or
                      extravagant; or (ii) in the case of an event (including
                      sporting or other entertainment events), where the
                      Contractor does not attend;
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "5%", textAlign: "right" },
                      ]}
                    >
                      c)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      it shall ensure that any payment or advantage made or
                      given to anyone on behalf, or for the benefit, of the
                      Client is properly and accurately recorded in the
                      Contractor’s books and records, including the amount or
                      value, purpose or receipt, which records shall be
                      maintained with supporting documentation and provided to
                      the Company and Client upon reasonable request;
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "5%", textAlign: "right" },
                      ]}
                    >
                      d)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      to the best of its knowledge, it has no Government
                      Officials as officers, employees or direct or indirect
                      owners of the Contractor as the date of this Agreement;
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "5%", textAlign: "right" },
                      ]}
                    >
                      e)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      it shall immediately notify the Company and the Client in
                      writing: (i) of any request or demand for any undue
                      financial or other advantage of any kind that it receives
                      in connection with the performance of this Agreement; (ii)
                      on becoming aware of or suspecting that a Government
                      Official is or becomes an officer or employee of the
                      Contractor or acquires a direct or indirect interest in
                      the Contractor; and/or (iii) on becoming aware of or
                      suspecting that there has been any breach of this Article
                      3.3;
                    </Text>
                  </View>
                  <View
                    break={true}
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.MB10,
                        styles.BodyText1,
                        { width: "5%", textAlign: "right" },
                      ]}
                    >
                      f)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                    >
                      it shall be liable and responsible to the Company for any
                      act or omission committed by any officer, employee or
                      agent of Contractor in breach of this Article 3.3.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Article Four */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "15%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                ARTICLE 4
              </Text>
              <Text
                style={[
                  styles.Title,
                  {
                    textDecoration: "none",
                    width: "85%",
                    padding: "0",
                    margin: "0",
                  },
                ]}
              >
                TITLES
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  4.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  (a) The Contractor acknowledges that unless otherwise agreed
                  title to, access to, copyright in, the right to possession of
                  and the free rights of use of all things created under or
                  arising out of the Work Product shall vest exclusively in the
                  Client immediately upon the date of commencement of the Work
                  or creation of the article or document as applicable.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  (b) The Contractor acknowledges that unless otherwise agreed
                  the Client shall have the sole and exclusive right to seek
                  patents of any item or idea arising out of the Work Product.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  (c) The Contractor agrees to promptly notify the Company of
                  any potential patentable ideas or registerable rights
                  conceived during the term of or as a direct result of working
                  under the Agreement. The Contractor further agrees to provide
                  all reasonable efforts in assisting the Company or the Client
                  at the request of the Company in obtaining such patents or
                  rights.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  (d) The Contractor and Consultant shall not have the right of
                  use, other than for the purposes of this Agreement, whether
                  directly or indirectly, of any patent, copyright, proprietary
                  right or confidential know-how, trademark or process provided
                  by the Client or the Company.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  4.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall save, indemnify, defend and hold harmless
                  the Company Group from all claims, losses, damages, costs
                  (including legal costs), expenses and liabilities of every
                  kind and nature for, or arising out of, any alleged
                  infringement of any patent or proprietary or protected right,
                  arising out of or in connection with the performance of the
                  obligations of the Contractor under this Agreement except
                  where such infringement necessarily arises from the Company’s
                  instructions. However, the Contractor shall use its reasonable
                  endeavours to identify any infringement in the Company’s or
                  Client’s instructions of any patent or proprietary or
                  protected right, and should the Contractor become aware of
                  such infringement then the Contractor shall inform the Company
                  immediately.
                </Text>
              </View>
            </View>
          </View>

          {/* Article Five */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 5
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                CONFIDENTIAL INFORMATION
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  5.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  As used herein, the term "Confidential Information" shall mean
                  all data and information which the Contractor, its
                  sub-contractors and the directors, officers and employees of
                  each of them, directly or indirectly, acquire from Company or
                  Client or from the performance of the Work or any other
                  information concerning the technical and business activities
                  and know-how of the Company or Client. Information including
                  (i) specifications, requirements and the like furnished by the
                  Company or the Client for the performance of the Work, and
                  (ii) documents or data of whatsoever nature or any notes,
                  conclusions, calculations, copies or documents prepared on the
                  basis thereof in connection with the data, reports and
                  material and (iii) any Work Product, report, analysis, study,
                  advice or recommendation generated or provided by Consultant
                  hereunder as part of the Work and (iv) the Agreement/the terms
                  of the Agreement.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  5.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor, its directors, officers and employees shall
                  hold all Confidential Information in confidence and shall not
                  disclose, and shall procure that its subcontractors and their
                  directors, officers and employees and Consultant shall not
                  disclose, any Confidential Information to any third party nor
                  use Confidential Information except as the Company or Client
                  may otherwise authorise in writing.
                </Text>
              </View>
              <View
                break={true}
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  5.3
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The term Confidential Information shall not include any
                  information which becomes public knowledge or for any other
                  reason ceases to be confidential otherwise than through a
                  breach of this Article.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  5.4
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall indemnify and hold harmless the Company
                  from and against any loss, claim, damage, expense or similar
                  which the Company may suffer as a result of a breach of this
                  Article 5.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  5.5
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The obligations under this Article 5 shall, as independent and
                  several obligations, survive the expiration, termination for
                  any cause or repudiation of this Agreement.
                </Text>
              </View>
            </View>
          </View>

          {/* Article Six */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 6
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                INVENTIONS
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <Text style={[styles.MB10, styles.BodyText1]}>
                The Contractor agrees to disclose promptly to the Company and
                the Client, all inventions which it, its sub-contractors and the
                directors, officers, employees of each of them may make as a
                result of the performance of the Work or which are wholly or in
                part based on or derived from Confidential Information as
                defined in Article 5. All rights, title and interest in and to
                such inventions shall belong, as the case may be, to the Client
                or their respective designee.
              </Text>
            </View>
          </View>

          {/* Article Seven */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 7
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                COMPENSATION
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  7.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Company shall pay Contractor for the Work in accordance
                  with the terms of Schedule II and at the rates quoted on the
                  application Work Order.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  7.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Company may, at its sole discretion, withhold payment of
                  amounts due under the Agreement to the Contractor until the
                  Company has received the following:
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  i.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  executed copies of this Agreement; and the applicable Work
                  Order;
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  ii.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  where relevant a copy of the Contractor’s Certificate of
                  Incorporation, its Insurance Certificates in compliance with
                  Article 15, and its VAT Registration Certificate (if
                  applicable).
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  iii.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Where requested by the Company full and valid certificates of
                  the following (as applicable):
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "60px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Medical Certificate.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "60px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  HSE Well Control Certificate I lWCF Well Control Certificate.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "60px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Offshore Survival I FireFighting Certificate for the area in
                  which any personnel of Contractor, its sub-contractors or any
                  Consultant will be working and detailed on the applicable Work
                  Order.
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  iv.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Copies of any visa / work permit valid for the area in which
                  any personnel of Contractor, its sub-contractors or any
                  Consultant will be working and detailed on the application
                  Work Order.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  v.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Emergency contact details of the Consultant’s next of kin.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  7.3
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  If a dispute arising out of or in connection with this
                  Agreement exists between the Company and the Contractor, the
                  Company may withhold from any money then or thereafter payable
                  either the equivalent of Company’s estimated value of (i) the
                  part of the Work under dispute, or (ii) the amount which is
                  the subject of the dispute. On settlement of the dispute the
                  Company shall make any further payment due in accordance with
                  the terms of Schedule II.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  7.4
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor acknowledges that if they choose to leave the
                  current contract they have been specifically deployed to
                  undertake, prematurely - at the discretion and direction of
                  the Customer - they may be required to pay any reasonable
                  costs incurred by the Customer (or have it deducted from their
                  invoice payment by LRED), if applicable, for the following:
                </Text>
              </View>
              {/* left 40px */}
              <View style={{ marginLeft: "40px" }}>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    &#x2022;
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    HET Training Costs
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    &#x2022;
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Flights and any required adjustment costs
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    &#x2022;
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Associated medical costs.
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    &#x2022;
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Associated Visa costs.
                  </Text>
                </View>
              </View>
              <View style={{ marginLeft: "0px" }}>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                  ></Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    The final cost of any deductions will be commensurate to the
                    number of days already worked on the respective project, or
                    time previously served with the customer, by the Contractor.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Article 8 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 8
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                INDEPENDENT CONTRACTOR
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  8.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall act as an independent contractor with
                  respect to the company pursuant to the terms of this Agreement
                  and Consultant shall in no sense be deemed to be an employee
                  of the Company or the Client. The Agreement shall not be
                  construed as creating a joint-venture, partnership or the
                  like. Neither Party shall act or be deemed to act on behalf of
                  the other Party (or its Affiliates), or have the right to bind
                  the other Party (or its Affiliates). Each Party shall at all
                  times during the performance of the Agreement be responsible
                  for the payment of wages and benefits to, and as applicable,
                  tax withholding from, its own employees. Without limiting the
                  generality of the foregoing, the employees and subcontractors
                  engaged by Contractor for the performance of the Agreement,
                  shall be the direct employees and subcontractors of Contractor
                  and Consultant shall remain solely responsible for all matters
                  related to compliance with relevant employment laws.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  8.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  In the performance of the Work hereunder, the Contractor shall
                  have the authority to {"\n"}control and direct the performance
                  of the details of the W o rk , subject to the Company and
                  Client’s right to give instructions and their right of
                  inspection and supervision. The presence of, and the
                  inspection and supervision by, the Client’s representative
                  shall not relieve the Contractor from its obligations and
                  responsibilities and accordingly, any provision of this
                  Agreement which may appear to give the Company or Client any
                  right of direction or control of the Work to be performed by
                  the Contractor shall not relate to the method or details of
                  performance by the Contractor but shall relate only to the
                  results of the work, which must be satisfactory to the Client.
                </Text>
              </View>
            </View>
          </View>

          {/* Article 9 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 9
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                TAX
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  9.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  This Agreement for the provision of Work does not imply a
                  master/servant or employer/employee relationship but relates
                  solely to the supply of Work of one independent Specialist
                  Company to another. The Contractor, its sub-contractors and
                  consultants may undertake work in addition to that defined in
                  this Agreement.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  9.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall pay all taxes assessed against it in
                  connection with the Work and agrees to indemnify the Company,
                  the Company's Affiliates and the Company's Clients in
                  connection with the Work against either or both of them being
                  required to make any payment (i) in respect of any taxation,
                  including fines, penalties and interest, assessed on
                  Contractor, its subcontractors, its or their employees, or on
                  any other party connected with Contractor or (ii) which might
                  have been assessed or assessable as aforesaid but for Company
                  having been required to make such payment. The Contractor
                  shall indemnify the Company against any assessment made on
                  Company under Schedule 15 of the Finance Act 1973 as a result
                  of the failure by Contractor to withhold income tax from any
                  of its employees, subcontractors or their employees, or any
                  party related to Contractor. Furthermore, Contractor agrees to
                  comply with the requirements of Chapter 11 of Part Ill of the
                  Finance (No. 2) Act 1975 and the regulations made thereunder
                  (known as the "Construction Industry Tax Deduction Scheme")
                  and any amendment thereto.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  9.3
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall assume full and exclusive liability for
                  the payment of all taxes (and associated penalties and
                  interest), including, by way of illustration and not
                  limitation, sales and use tax, value-added tax, customs and
                  import duties and levies and similar charges payable, levied
                  for imposed on the procurement of goods by the Contractor or
                  any of its employees, subcontractors or agents an arising
                  directly or indirectly from the performance of this Agreement.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  9.4
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The prices are exclusive of Value Added Tax and/or Sales Tax.
                  Notwithstanding the provisions of Article 6.4, if applicable,
                  Value Added Tax and/or Sales Tax will be added to Consultant’s
                  invoices and such invoices will be presented in accordance
                  with applicable regulations with respect to Value Added Tax
                  and/or Sales Tax.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  9.5
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  In the event that the Company receives a direct request from
                  any governmental authority requesting information regarding
                  the Contractor, and upon written request by the Company, the
                  Contractor shall provide evidence to confirm Contractor’s
                  compliance with governmental tax reporting and payment
                  obligations.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  9.6
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Company shall have the right at any time up to four (4)
                  years after expiry or termination of the Agreement, to audit
                  the Contractor’s books, records and data in any form to verify
                  compliance with the terms hereof and the correctness of any
                  invoice submitted by the Contractor. The said right shall be
                  exercised solely for the purposes defined in this Article.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  9.7
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The obligations under this Article 9 shall, as independent and
                  severable obligations, survive the expiration, termination for
                  any cause or repudiation of this Agreement.
                </Text>
              </View>
            </View>
          </View>

          {/* Article 10 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 10
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                TERMINATION
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  10.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Company may cancel all or any portion of the Work or
                  terminate this Agreement at any time by giving written notice
                  to Contractor without giving any reason therefore in which
                  case Contractor shall cease work as directed by Company and
                  shall vacate the site as soon as practicable and shall forward
                  to Company all completed or uncompleted drawings, reports,
                  computer software data and other documents created or supplied
                  in connection with the Work. In the event of such cancellation
                  or termination and subject to Article 10.3, the Company shall
                  be liable only for such charges as are accrued and due
                  hereunder in respect of the portion of the Work correctly
                  performed prior to such cancellation or termination.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  10.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Company may terminate the Agreement in whole or in part
                  forthwith:
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  If Contractor or any company of which it is a Subsidiary shall
                  become insolvent, or if insolvency, receivership or bankruptcy
                  proceedings shall be commenced by or against Contractor or any
                  company of which it is a Subsidiary, or if an administrator be
                  appointed (or the equivalent of any of the foregoing under the
                  laws of the place, incorporation or business of Contractor or
                  any company of which it is a Subsidiary), or if Contractor
                  shall assign this Agreement or any rights or interest herein,
                  except as permitted hereunder; or
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  b)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  if Consultant shall be guilty of material or persistent
                  dishonesty or misconduct or if Contractor or Consultant shall
                  commit any serious or persistent breach of any of the
                  obligations binding upon them under this Agreement; or
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  c)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  if Consultant by reason of illness, or any other cause, be
                  incapacitated from performing, or fails to perform, its duties
                  hereunder (which incapacity or failure results in Consultant’s
                  absence from Company’s or Client’s location for whatever
                  reason and not being leave to which Consultant is entitled)
                  for a period of fourteen (14) consecutive days or a period
                  aggregating twenty eight (28) working days in any consecutive
                  period of two (2) months; or
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  d)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  if the Agreement for the provision of works and services and /
                  or personnel between Company and Client is terminated; or
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  e)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  if Consultant shall fail to perform its duties to the
                  satisfaction of Company and / or Client; or
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  f)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  if a Force Majeure event occurs and such event continues for a
                  period of 45 consecutive days.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  g)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  if the Client instructs the Company to remove from its
                  premises any person engaged in any part of the Work who in the
                  reasonable opinion of the Client is either:
                </Text>
              </View>
            </View>

            <View style={{ marginLeft: "40px" }}>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "45px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Incompetent or negligent in the performance of his or her
                  duties; or
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "45px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Engaged in activities which are contrary or detrimental to the
                  interests of the Client; or
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "45px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Is not conforming to the Client’s Site Rules
                </Text>
              </View>
            </View>

            <View style={{ marginLeft: "20px" }}>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  h)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  in the case of such termination, Contractor shall execute all
                  papers and take all other steps which may be required to vest
                  in Company or Client, as the case may be, all rights, title,
                  set-offs and other benefits held by Contractor in connection
                  with the performance of the Work.
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  10.3
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Termination of this Agreement shall be without prejudice to
                  any rights or remedies accrued to either Party prior to such
                  termination.
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  10.4
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor may terminate this Agreement at any time by
                  giving forty-five (45) days prior written notice to the
                  Company.
                </Text>
              </View>
            </View>
          </View>

          {/* Article 11 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 11
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                FORCE MAJEURE
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  11.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  A delay in our failure of performance of any one or more of
                  its obligations by either Party shall not constitute default
                  hereunder nor give rise to any claim for damage if such delay
                  or failure is wholly and directly caused by any occurrence
                  which the affected Party is unable to prevent by the exercise
                  of reasonable diligence, the continuation of which, by the
                  exercise of reasonable diligence the affected Party is unable
                  to control and the consequences of which the affected Party is
                  unable to prevent, provided that the affected Party gives
                  prompt written notice to the other Party specifying the
                  circumstances constituting the occurrence and has used all
                  reasonable endeavours to minimise the effects thereof.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  11.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  If such a delay in or failure of performance causes the
                  suspension of operations hereunder for a continuous period of
                  five (5) days Company shall be entitled at any time thereafter
                  to terminate either this Agreement or Work Order, should
                  Company so elect, forthwith by written notice to Contractor.
                </Text>
              </View>
            </View>
          </View>

          {/* Article 12 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 12
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                NON-WAIVER
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <Text style={[styles.MB10, styles.BodyText1]}>
                Neither Party’s right to require strict performance in
                accordance with the terms of this Agreement shall be affected or
                waived by any failure by it to enforce any of the terms hereof.
              </Text>
            </View>
          </View>
          {/* Article 13 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 13
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                ASSIGNMENT
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <Text style={[styles.MB10, styles.BodyText1]}>
                Notwithstanding any other provisions of this Agreement
                Contractor shall not assign this Agreement in whole or in part
                or sub-contract or permit any sub-contractor to sub-contract any
                or all of the Work hereunder. Company shall have the right to
                assign this Agreement, such right to be exercised by written
                notice to Contractor.
              </Text>
            </View>
          </View>

          {/* Article 14 */}
          <View style={[styles.MT10]} break={true}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 14
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                LIABILITIES AND INDEMNITIES
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  14.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Neither party excludes or limits its liability for
                </Text>
              </View>
            </View>

            <View style={{ marginLeft: "65px" }}>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  death or personal injury caused by its negligence,
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  b)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  fraud or fraudulent misrepresentation; or
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  c)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  other liability which it cannot lawfully exclude.
                </Text>
              </View>
            </View>

            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  14.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Subject to Article 14.1 the Contractor shall indemnify and
                  keep indemnified the Company on demand in full from and
                  against all claims, proceedings, actions, damages, legal
                  costs, expenses and any other liabilities whatsoever arising
                  out of, in respect of or in connection with any death or
                  personal injury or loss of or damage to property, which is
                  caused by any act or omission of the Contractor arising from,
                  relating to or in connection with its performance or
                  non-performance of the terms of this Agreement.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  14.3
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall be responsible for and shall save,
                  indemnify, defend and hold harmless Company Group and Client
                  Group from and against all claims, losses, damages, costs
                  (including legal costs), expenses and liabilities in respect
                  of:
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "45px",
                }}
              >
                <Text
                  style={[
                    styles.MB5,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  loss of or damage to property of the Client whether owned,
                  hired, leased or otherwise provided by the Contractor Group;
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  14.4
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Fines and Penalties Without prejudice to the other provisions
                  of this Agreement, Contractor shall be liable for and shall
                  indemnify Company and Company's Personnel from and against all
                  Claims in respect of fines, penalties or charges imposed,
                  levied or incurred by reason of the failure or alleged failure
                  of Contractor, its sub-contractors or Contractor's Personnel
                  to comply with any applicable Site Rules or laws, regulations
                  or other rules or any decree, order or ordinance.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  14.5
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Consequential Loss Notwithstanding any provision to the
                  contrary elsewhere in the Agreement, Contractor shall save,
                  indemnify, defend and hold harmless Company Group from the
                  Contractor’s Consequential Loss, arising from, or related to
                  the performance or non performance of the Agreement.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  For the purposes of this Article 14.5 the expression
                  “Consequential Loss” shall mean consequential or indirect loss
                  under English law and loss and/or deferral of production, loss
                  of product, loss of use, loss of revenue, profit or
                  anticipated profit (if any) and business interruptions, in
                  each case whether direct or indirect and whether or not
                  foreseeable at the effective date of the Agreement.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  14.6
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  All exclusions of liability and indemnities given under
                  Article 14 shall apply irrespective of cause and
                  notwithstanding the negligence (whether sole, joint, active or
                  passive), breach of duty (whether statutory or otherwise) or
                  strict liability of the indemnified party or any other entity
                  or party and shall apply irrespective of any claim in tort,
                  under contract, statute civil law or otherwise at law.
                </Text>
              </View>
              <View
                break={true}
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  14.7
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Survival of Article 14 The obligations under this Article 14
                  shall, as independent and severable obligations, survive the
                  expiration, termination for any cause or repudiation of this
                  Agreement.
                </Text>
              </View>
            </View>
          </View>

          {/* Article 15 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 15
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                INSURANCE
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  15.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall at its own cost, obtain and maintain as a
                  minimum the following insurance cover in respect of its
                  obligations hereunder:
                </Text>
              </View>
              <View style={{ marginLeft: "45px" }}>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    a)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Comprehensive General Liability including but not limited to
                    Contractual Liability Cover, with limits in respect of
                    bodily injury and/or property damage of not less than US
                    Dollars two million (US$ 2,000,000) per occurrence;
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    b)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Workman’s Compensation in compliance with local statutory
                    requirements, and/or Employer’s Liability with limits of not
                    less than US Dollars one million (US$
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    c)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    ,000,000) per occurrence; and
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    d)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Travel and Personal Accident insurance; and
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    e)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Motor Vehicle Liability insurance, which shall comply with
                    all applicable laws, on all vehicles used in connection with
                    the performance of the Work.
                  </Text>
                </View>
              </View>

              <View
                break={true}
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  15.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  General Insurance Requirements
                </Text>
              </View>
              <View style={{ marginLeft: "45px" }}>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    a)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    All insurances required under Article 15.1 shall be on terms
                    and conditions issued by insurance companies or underwriters
                    acceptable to Company.
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    b)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Not later than the commencement of the Work, Contractor
                    shall furnish to Company evidence that all insurances
                    required under Article 15.1, have been duly effected and
                    shall provide certified copies of the certificates of
                    policies relating thereto which certificates shall
                    incorporate any exclusions. Renewal or replacement insurer's
                    certificates shall be obtained by Contractor as and when
                    necessary and certified copies thereof shall be forwarded
                    promptly to Company.
                  </Text>
                </View>
                <View
                  break={true}
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    c)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    To the extent of Contractor’s liabilities and indemnities
                    under Article 14 Contractor shall procure that its insurers
                    and such sub-contractors’ insurers waive all rights of
                    subrogation against Company, Client and their respective
                    directors, officers and employees.
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    d)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Contractor shall ensure that Company is named as an
                    additional insured on the policies which Contractor is
                    required to effect under Article 15.1 b) with respect to the
                    risks and liabilities assumed by Contractor under this
                    Agreement.
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    e)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    The insurance limits specified in Article 15.1 are minimum
                    requirements and shall not be construed as a limitation of
                    liability or as constituting acceptance by Company of
                    liability in excess of such limits.
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    f)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    Any policy deductibles and/or excesses applicable to the
                    insurances required hereunder shall be for the account of
                    Contractor.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Article 16 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 16
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                HEALTH, SAFETY AND ENVIRONMENT
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  16.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall ensure that all persons either employed
                  or supplied by Contractor to perform the Work pay due regard
                  to information and instructions provided on, observe and
                  comply with, those health, safety and environment procedures
                  and practices applicable at the site where the Work is to be
                  performed including those detailed in Schedule I Part II.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  16.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Medical Fitness
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall ensure that all persons either employed
                  or supplied by Contractor are at the time they are sent to
                  perform the Work or any part thereof fit to perform the Work
                  at the work site. For international operations they shall,
                  within the twelve (12)
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  months prior to the date such persons are so employed or
                  supplied, have been passed as medically fit to work in an
                  operational environment by a currently registered medical
                  practitioner familiar with the medical requirements for
                  persons working in the oil industry and shall promptly supply
                  documentary evidence if requested by Company. For
                  international travel Contractor shall ensure all immunisations
                  recommended by MASTA (Medical Advisory Service for Travellers
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Abroad) or equivalent for the area of travel, are current and
                  all certifications required for entry to the country are
                  valid. Should Contractor fail to have complied with the terms
                  of this Article 16.2 and any such persons require emergency,
                  unscheduled evacuation from the site for medical treatment,
                  Contractor shall, in addition to any other obligation or
                  liability it may have to Company at law or hereunder,
                  reimburse Company any costs incurred by Company arising out of
                  or in connection with such evacuation.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  16.3
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Safety Training
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall ensure that the Consultant and all other
                  persons either employed or supplied by the Contractor to
                  perform the Work or any part thereof on site have received
                  reasonable health and safety awareness training, the costs of
                  which shall be for the Contractor's account. Training shall as
                  a minimum include awareness of fire fighting, risk assessment,
                  substances harmful to health and general operational safety.
                  The Contractor undertakes to comply with such guidelines and
                  agrees to supply to the Company documentary evidence of
                  compliance. Failure to provide such evidence may result in
                  personnel being refused permission to travel to the work site.
                  The Contractor shall be liable for and shall indemnify the
                  Company from and against any and all Claims arising out of or
                  contributed to by a breach by the Contractor or by any of its
                  subcontractors of this Article 16.3.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  16.4
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Survival of Article 16.3
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "5%" }]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The obligations under Article 16.3 shall, as independent and
                  severable obligations, survive the expiration, termination or
                  any cause or repudiation of this Agreement.
                </Text>
              </View>
            </View>
          </View>

          {/* Article 17 */}
          <View style={[styles.MT10]} break={true}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 17
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                NOTICES
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  17.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Any notices required or permitted to be given hereunder shall
                  be deemed to have been properly given by a Party if delivered
                  personally to the other Party or prepaid mail or telefax to
                  the other Party at that other Party’s address as it appears in
                  Schedule II or at any other address designated in writing by
                  the receiving Party as the address to which notices are to be
                  sent hereunder.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  17.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Notice shall be deemed to have been received and effective:
                </Text>
              </View>
              <View style={{ marginLeft: "45px" }}>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    a)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    if delivered by hand – at the time of delivery;
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    b)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    if sent by mail or recorded delivery – at the time of
                    receipt by the addressee of such delivery or two (2)
                    business days after the date of mailing whichever occurs
                    first; or
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    c)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    if sent by telefax – at the time specified on the
                    transmission report, or in the event such time is outside
                    normal working hours at 0930 hours on the first business day
                    after the day of transmission.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Article 18 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 18
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                GOVERNING LAW
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <Text style={[styles.MB10, styles.BodyText1]}>
                This Agreement shall be governed by and construed in accordance
                with the laws of England. The courts of England shall have
                exclusive jurisdiction to settle any disputes which may arise
                out of or in connection with this Agreement.
              </Text>
            </View>
          </View>

          {/* Article 19 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 19
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                ENTIRE AGREEMENT
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  19.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  This Agreement constitutes the entire agreement between the
                  Parties with respect to the subject matter and supersedes any
                  and all prior or contemporaneous negotiations, understandings,
                  agreements or representations (including any made negligently
                  but excluding any made fraudulently), in each case whether
                  written or oral, with respect to the subject matter.
                </Text>
              </View>
              <View
                break={true}
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  19.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  This Agreement shall be varied or amended only by an
                  instrument in writing of date subsequent hereto signed by each
                  Party or its duly authorised representative.
                </Text>
              </View>
            </View>
          </View>

          {/* Article 20 */}
          <View style={[styles.MT10]}>
            <View
              style={[
                styles.MB5,
                { display: "flex", gap: "15px", flexDirection: "row" },
              ]}
            >
              <Text
                style={[styles.Title, { textDecoration: "none", width: "15%" }]}
              >
                ARTICLE 20
              </Text>
              <Text
                style={[styles.Title, { textDecoration: "none", width: "85%" }]}
              >
                GENERAL PROVISIONS
              </Text>
            </View>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  20.1
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Contractor and Consultant shall not for a period of twelve
                  (12) months after the date of termination of this Agreement,
                  howsoever terminated, on the account of either of them or on
                  behalf of any other person, firm or contractor directly or
                  indirectly solicit the employment of, or interfere with or
                  endeavour to entice away any person from the service of the
                  Company or the Client or any of their subsidiaries.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  20.2
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Contractor and Consultant shall not for a period of six (6)
                  months after the date of termination of this Agreement,
                  howsoever terminated, either on its own account or on behalf
                  of any other person, firm or company, directly or indirectly
                  carry on or be engaged or concerned in the business of the
                  Client unless mutually agreed in writing between Contractor
                  and Company.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  20.3
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Contractor and Consultant shall not after the date of
                  termination of this Agreement howsoever terminated, represent
                  themselves as being in any way connected with or interested in
                  any of the businesses of Company.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  20.4
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Contractor and Consultant agree that having regard to the
                  facts and matters set out above, the restrictive covenants
                  herein contained are reasonable and necessary for the
                  protection of Company and they further agree that having
                  regard to those circumstances those covenants do not work
                  harshly upon them.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  20.5
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Contractor shall correct any substandard or defective work
                  in its own time and at its own cost.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  20.6
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Company is under no obligation to offer a set amount of
                  work or additional Work Order documents to the Contractor. The
                  Contractor is not obliged to make its services or the services
                  of any Consultant available to the Company. Both parties agree
                  that they do not wish to create any mutuality of obligation
                  whatsoever.
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: "10px" }}>
            <Text style={[styles.MB10, styles.BodyText1, { display: "flex" }]}>
              <Text
                style={[
                  styles.BodyText1,
                  { color: "#000", marginRight: "15px" },
                ]}
              >
                IN WITNESS WHEREOF{" "}
              </Text>
              the Parties have executed and delivered this Agreement in
              duplicate as of the date first above written.
            </Text>
          </View>

          <View style={[styles.TableBox, styles.MT10]}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[styles.fontBold, styles.BodyText1, styles.TextBlack]}
                >
                  {isUpdate
                    ? contractDetails?.employeeDetail?.loginUserData?.lastName +
                      " " +
                      contractDetails?.employeeDetail?.loginUserData?.firstName
                    : "………………….."}
                  :
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.TextBlack,
                    { textAlign: "left" },
                  ]}
                >
                  LRED:
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1]}>
                  Signature:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "left" },
                  ]}
                >
                  Signature:
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1]}>Name:</Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "left" },
                  ]}
                >
                  Name/Title:
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1]}>Date: </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    { textAlign: "left" },
                  ]}
                >
                  Date:
                </Text>
              </View>
            </View>
          </View>

          {/* Schedule I – PART I */}
          <View style={[styles.MT10]} break={true}>
            <Text style={[styles.Title, styles.MB10, { textAlign: "center" }]}>
              Schedule I – PART I
            </Text>
            <Text style={[styles.Title, { textAlign: "center" }]}>
              THE WORK
            </Text>
          </View>

          <View style={[styles.MT10]}>
            <View style={{ marginLeft: "0px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  A.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Work to be performed under the terms of this Agreement
                  shall be the provision by Contractor of consultancy and
                  technical services as set out in this Schedule I or as agreed
                  to support
                  {isUpdate
                    ? " " +
                      contractDetails?.employeeDetail?.client?.loginUserData
                        ?.name +
                      " " +
                      (contractDetails?.employeeDetail?.client?.address
                        ? "in " +
                          contractDetails?.employeeDetail?.client?.address
                        : "")
                    : "XXXXX"}
                  .
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[styles.MB10, styles.BodyText1, { width: "100%" }]}
                >
                  The Contractor shall:
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  carry out its duties in accordance with the directions given
                  by a duly authorised representative of Company and where
                  assigned to the Client the duly authorised representative of
                  such Client;
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  b)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  devote such hours as may be required to ensure the proper
                  fulfilment of its services hereunder as Company and/ or Client
                  or the authorised representative of each shall reasonably
                  require, and
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  c)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  comply with all disciplinary and administrative regulations
                  and arrangements from time to time applicable to Company
                  and/or Client employees.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  B.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Each work task forming part of the Work shall be the subject
                  of a Company Work Order in the form included in Schedule I
                  PART II hereto. Such Work Order, which shall be agreed by both
                  Company and Contractor, shall detail among other things:
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  d)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  the name of Consultant to be provided;
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  e)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  the services to be provided by the Contractor;
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  f)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  the Client name (when applicable);
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  g)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  the intended date of commencement;
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  h)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  the estimated duration;
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  i)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  the rate(s) payable; and
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "40px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  such other details as may be required for the work assignment.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Contractor/Consultant shall not commence said work task until
                  the Work Order has been completed by Company and signed by
                  Contractor.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.MT10]} break={true}>
            <Text
              style={[
                styles.Title,
                { textAlign: "center", marginBottom: "5px" },
              ]}
            >
              Schedule I PART II
            </Text>
            <Text style={[styles.Title, styles.MB10, { textAlign: "center" }]}>
              WORK ORDER (N001)
            </Text>
          </View>

          <View style={[styles.TableBox, { maxWidth: "100%" }]}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Work Order Date:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate
                    ? moment(contractDetails?.workOrderDate)
                        .locale("fr")
                        .format("DD MMMM YYYY")
                    : "Day Month Year"}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Work Order Number:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {/* {isUpdate ? contractDetails?.workOrderNumber ?? "" : "XXX"} */}
                  {isUpdate
                    ? "LRED/" +
                      contractDetails?.employeeDetail?.client?.code +
                      (contractDetails?.newContractNumber
                        ? "/" + contractDetails?.newContractNumber
                        : "") +
                      (contractDetails?.uniqueWorkNumber
                        ? "/" +
                          convertToThreeDigits(
                            contractDetails?.uniqueWorkNumber
                          )
                        : "")
                    : "XXX"}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Contractor’s Name:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate
                    ? contractDetails?.employeeDetail?.loginUserData?.lastName +
                      " " +
                      contractDetails?.employeeDetail?.loginUserData?.firstName
                    : "XXX"}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Contrator’s Passport:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate ? contractDetails?.contractorsPassport : "XXX"}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Consultant’s Job Title:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate ? contractDetails?.employeeDetail?.fonction : "XXX"}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Work Location:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate ? contractDetails?.workLocation : "XXX"}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Client Name:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate
                    ? contractDetails?.employeeDetail?.client?.loginUserData
                        ?.name
                    : "XXX"}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Description of Assignment and Order Conditions:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {contractDetails?.descriptionOfAssignmentAndOrderConditions}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Commencement Date of Assignment:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate
                    ? moment(contractDetails?.startDate)
                        .locale("fr")
                        .format("DD MMMM YYYY")
                    : "XXXXXX"}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Duration of Assignment:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate ? contractDetails?.durationOfAssignment : "XXXXXX"}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  End of Assignment:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate
                    ? moment(contractDetails?.endOfAssignmentDate).format(
                        "DD MMMM YYYY"
                      )
                    : "XXXXXX"}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                margin: " 0 auto ",
              }}
            >
              <View
                style={[
                  styles.p4,
                  styles.hFull,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text style={[styles.fontBold, styles.BodyText1, styles.MB5]}>
                  Remuneration to Consultant:
                </Text>
              </View>
              <View
                style={[
                  styles.p4,
                  styles.half,
                  // styles.borderT,
                  // styles.borderB,
                  // styles.borderL,
                  // styles.borderR,
                  styles.half,
                ]}
              >
                <Text
                  style={[
                    styles.fontBold,
                    styles.BodyText1,
                    styles.MB5,
                    { textAlign: "left" },
                  ]}
                >
                  {isUpdate
                    ? (contractDetails?.workCurrency
                        ? contractDetails?.workCurrency + " "
                        : "") +
                      (contractDetails?.remuneration ?? 0) +
                      " "
                    : "XXX"}{" "}
                  per full day worked in country, 1/2 days be paid for each
                  travel day. {"\n"}the remuneration is to be paid monthly by
                  bank transfer in US dollars, net of Algerian taxes (i.e., All
                  Algerian Taxes paid with no deduction) Any costs of the
                  transfer will be borne by the Contractor. Reasonable expenses
                  are accepted and need to be claimed in an accordance with the
                  LRED process.Reasonable expenses include taxis and economy
                  class air travel from the place of residence (i.e.in Portugal)
                  to Hassi Messaoud. Evidence for any expense must be provided.
                  {"\n"}Visa/Work permit costs will be met by LRED. {"\n"}the
                  exchange rate shall be the rate published by xe.com, at the
                  time of transfer, should contractor choose to leave.
                </Text>
              </View>
            </View>
          </View>

          {/* expenses */}
          <View style={[]} break={true}>
            <Text style={[styles.Title, styles.MB10, { textAlign: "center" }]}>
              EXPENSES
            </Text>
          </View>

          <View style={[styles.MT10]}>
            <Text
              style={[
                styles.BodyText1,
                styles.MB10,
                { textDecoration: "none" },
              ]}
            >
              The Client shall provide:
            </Text>
            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Subsistence and Accommodation
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Client email address for the contractor and internet access,
                  local SIM card,
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Dedicated office were reasonably possible,
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Access to secretarial Support,
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Reasonable assistance with transport within country of
                  operation.
                </Text>
              </View>
            </View>
            <View style={[styles.MT10]}>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                Where it is not possible for the Client to provide support
                directly, the Consultant shall pay the above expenses and shall
                make a claim to the Company to be reimbursed for costs and
                expenses incurred during the performance of the Services, in
                accordance with the Agreement provided that such expenses are
                reasonable and are evidenced by acceptable documentation and
                after the appropriate written agreement by LRED has been
                received.
              </Text>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                The Consultant shall otherwise provide all personnel, equipment
                and materials required for the performance of the Work and such
                personnel, equipment and materials shall be compliant with
                standards set by the Client. The Consultant acknowledges that
                time is of the essence in relation to the Timing of any Work to
                be performed under the Agreement.
              </Text>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                The Contractor agrees that it shall not allow any liens to
                attach to any property of the Client in relation to the
                performance of the Work and that it shall furnish, upon request,
                receipts and releases in relation to the Work showing that all
                related costs and expenses have been paid (and thus, that no
                third party claims, liens, or rights of liens exist against the
                Company or Client or their property). The Contractor shall
                indemnify and hold the Company harmless from and against the
                said liens and claims.
              </Text>
            </View>
          </View>

          {/* ENVIRONMENT POLICY */}

          <View style={[styles.MT10]}>
            <Text style={[styles.Title, styles.MB10, { textAlign: "center" }]}>
              THE CLIENT’S QUALITY, HEALTH, SAFETY AND ENVIRONMENT POLICY
            </Text>
          </View>
          <View>
            <View style={[styles.MT10]}>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                The long-term business success of the Client depends on its
                ability to continually improve the quality of its products and
                services while protecting people and the environment. Emphasis
                must be placed on ensuring human health, operational safety,
                environmental protection, quality enhancement and community
                goodwill. This commitment is in the best interests of the
                Client’s customers, employees, stockholders and those in the
                communities in which it operates. .
              </Text>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                The Client requires the active commitment to, and support of
                QHSE from all employees and contractors. In addition, line
                management has a leadership role in the communication and
                implementation of, and ensuring compliance with, QHSE policies
                and standards. The Client is committed to:
              </Text>
            </View>

            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Protect the health and safety of its people at all times and
                  in all circumstances
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Eliminate QHSE accidents and events
                </Text>
              </View>

              <View
                break={true}
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Provide a framework for the setting of QHSE goals and
                  performance objectives, and the use of an effective management
                  system
                </Text>
              </View>
              <View
                break={true}
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Monitor, evaluate and continually improve its QHSE performance
                  through the definition of operational standards, training,
                  assessments and audits
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Be fully prepared to respond to any QHSE emergency
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Minimize its impact on the Environment through pollution
                  prevention and control of emissions, the efficient use of
                  natural resources and the reduction and recycling of waste
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Educate its employees, customers, contractors, and business
                  partners on the safe and environmentally responsible use of
                  its services and products, and how their actions can influence
                  QHSE performance.
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Communicate openly with interested parties about its QHSE
                  policy, programs and performance.
                </Text>
              </View>
            </View>
            <View style={[styles.MT10]}>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                The Client is committed to the proactive integration of QHSE
                objectives into its management system at all levels, actively
                reinforced by reward programs that recognize outstanding QHSE
                performance demonstrated by its employees and contractors.
              </Text>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                The commitments in this Policy are in addition to the Client’s
                basic obligation to comply with its standards, as well as all
                applicable laws and regulations where it operates. This is
                critical to its business success because it reduces risk and
                adds value to the Client’s products and services.
              </Text>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                If the Consultant is granted access to certain proprietary
                technology network networks, computer systems, software and/or
                premises of the Client or its Affiliate (“Systems”) to perform
                the Work under this Agreement , the Contractor acknowledges and
                agrees that it shall execute, and cause its personnel to
                execute, the Client’s standard forms/agreements in relation
                thereto.
              </Text>
              <Text
                style={[
                  styles.BodyText1,
                  styles.MB10,
                  { textDecoration: "none" },
                ]}
              >
                The Company may remove from the Client’s premises any person
                engaged in any part of the Work who in the reasonable opinion of
                the Client is either:
              </Text>
            </View>

            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  incompetent or negligent in the performance of his or her
                  duties; or
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  b)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  engaged in activities which are contrary or detrimental to the
                  interests of the Client or
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  c)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  is not conforming to the Site Rules and any other workplace
                  policies and standards of the Client
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.BodyText1,
                styles.MB10,
                { textDecoration: "none" },
              ]}
            >
              The term “Site Rules” shall include the following:
            </Text>

            <View style={{ marginLeft: "20px" }}>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Client’s Quality Safety Health and Environment Policy
                </Text>
              </View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  b)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  The Client’s Code of Conduct
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  c)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Any other policies pertaining to the Work or the Client’s
                  premises as notified by the Client
                </Text>
              </View>
            </View>
          </View>

          {/* Schedule II- COMPENSATION */}
          <View style={[styles.MT10]} break={true}>
            <Text style={[styles.Title, styles.MB10, { textAlign: "center" }]}>
              Schedule II- COMPENSATION
            </Text>
          </View>

          <View style={[styles.MT10]}>
            <View>
              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  A.
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  In consideration of its performance of the Work under the
                  terms of this Agreement the Contractor shall be compensated at
                  the rates quoted on the applicable Work Order (Schedule 1 Part
                  II).
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  (i)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Fees and Charges for Services/Consultant
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To be detailed on the applicable Work Order.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "25px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                ></Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Note:
                </Text>
              </View>
              <View style={{ marginLeft: "50px" }}>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    a)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    For office-based work: onshore day rate(s) shall be fully
                    inclusive and irrespective of the number of hours but pro
                    rata for any part thereof based on an twelve (12) hour day
                    where less than twelve (12) hours worked.
                  </Text>
                </View>
                <View
                  style={{ display: "flex", gap: "15px", flexDirection: "row" }}
                >
                  <Text
                    style={[
                      styles.MB10,
                      styles.BodyText1,
                      { width: "5%", textAlign: "right" },
                    ]}
                  >
                    b)
                  </Text>
                  <Text
                    style={[styles.MB10, styles.BodyText1, { width: "95%" }]}
                  >
                    For operations-based work: onshore/offshore day rate(s)
                    shall be fully inclusive and cover the normal operational
                    working schedule.
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "30px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  (ii)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  With prior written express permission, the Company shall
                  reimburse the Contractor at cost for all reasonable direct
                  expenses authorised by the Company and properly incurred by
                  Contractor/Consultant during the performance of the Work. No
                  other expenses which may be incurred by Contractor shall be
                  reimbursed to Contractor except and unless provided for on the
                  Work Order.
                </Text>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  B.
                </Text>
                <View style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "3%" }]}
                    >
                      (i)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "97%" }]}
                    >
                      The rates quoted on the Work Order are subject to any
                      withholding required by applicable law.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "3%" }]}
                    >
                      (ii)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "97%" }]}
                    >
                      The rates quoted on the Work Order shall be fixed and firm
                      for the duration of the Work specified on the Work Order
                      or such other duration as may be agreed in writing between
                      the Parties.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "4%" }]}
                    >
                      (iii)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "96%" }]}
                    >
                      The rates quoted on the Work Order are exclusive of Value
                      Added Tax (VAT) which shall be added at the appropriate
                      rate to each invoice where applicable.
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  C.
                </Text>
                <View style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "3%" }]}
                    >
                      (i)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "97%" }]}
                    >
                      The rates quoted on the Work Order are inclusive of, but
                      not limited to, wages, personal accident and sickness
                      payments, pensions, bonuses, overheads, profits and other
                      costs associated with payments made by Contractor its
                      consultants.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "3%" }]}
                    >
                      (ii)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "97%" }]}
                    >
                      Contractor and/or Consultant shall record weekly all
                      hours, days worked on a timesheet. These timesheets must
                      be signed by an authorised Company representative or if
                      assigned to Company's Client an authorised Client
                      representative. Contractor shall forward timesheets to the
                      Company at an arranged period of time. Company will only
                      accept liability to pay for days recorded on signed
                      timesheets. Contractor shall procure that Consultant shall
                      also complete such other timesheets (if any) as Client so
                      requires.
                    </Text>
                  </View>
                </View>
              </View>

              <View
                break={true}
                style={{ display: "flex", gap: "15px", flexDirection: "row" }}
              >
                <Text style={[styles.MB10, styles.BodyText1, { width: "5%" }]}>
                  D.
                </Text>
                <View style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "3%" }]}
                    >
                      (i)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "97%" }]}
                    >
                      Contractor shall submit invoices monthly in arrears to
                      Company at the following address, or such other address as
                      may be notified to Contractor from time to time:
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      marginLeft: "30px",
                    }}
                  >
                    <Text
                      style={[styles.MB5, styles.BodyText1, { width: "100%" }]}
                    >
                      LRED
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      marginLeft: "30px",
                    }}
                  >
                    <Text
                      style={[styles.MB5, styles.BodyText1, { width: "100%" }]}
                    >
                      Brightwell Grange, Britwell Road
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      marginLeft: "30px",
                    }}
                  >
                    <Text
                      style={[styles.MB5, styles.BodyText1, { width: "100%" }]}
                    >
                      Burnham, Bucks SL1 8DF, UK
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                      marginLeft: "30px",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "100%" }]}
                    >
                      Or by email to: nihad@lred.com
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "3%" }]}
                    >
                      (ii)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "97%" }]}
                    >
                      Contractor shall also submit original invoice, timesheet,
                      expenses form and all original receipts for expenses
                      incurred by post or courier to Company at same address as
                      in D. (i) above.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "3%" }]}
                    >
                      (ii)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "97%" }]}
                    >
                      Each invoice submitted by Contractor shall quote the
                      contract reference number and the appropriate Work Order
                      number and shall be accompanied by Company I Client
                      approved time records and such other documentation as
                      Company may reasonably require in order to verify the
                      correctness of items invoiced. To the extent said invoices
                      are properly presented and correct, and subject to the
                      provisions of this Agreement, Company shall pay said
                      invoices at the end of the following calendar month, or
                      within thirty (30) days of receipt of payment from Client,
                      whichever is earlier.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "4%" }]}
                    >
                      (iii)
                    </Text>
                    <Text
                      style={[styles.MB10, styles.BodyText1, { width: "96%" }]}
                    >
                      Contractor shall invoice in the currency of the rate(s)
                      quoted on the applicable Work Order and except as stated
                      on the Work Order the Company shall make payment in said
                      currency.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Schedule III */}

          <View style={[]}>
            <Text style={[styles.Title, styles.MB10, { textAlign: "center" }]}>
              Schedule III- HEALTH, SAFETY AND ENVIRONMENTAL STATEMENT
            </Text>
          </View>

          <View
            style={[styles.MT10, { display: "flex", flexDirection: "row" }]}
          >
            <Text
              style={[
                styles.Title,
                styles.MB10,
                { textDecoration: "none", width: "8%" },
              ]}
            >
              1.
            </Text>
            <View style={[styles.MB10, { width: "92%" }]}>
              <Text
                style={[styles.Title, styles.MB10, { textDecoration: "none" }]}
              >
                RESPONSIBILITIES OF CONTRACTOR
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                The Company and the Client place great emphasis on Health,
                Safety, and protection of the Environment.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                It is the responsibility of Contractor to ensure that this
                Schedule is read, understood, and adopted by consultant.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                Consultant has a duty to:
              </Text>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "15px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  a)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Take care of the health and safety of themselves and others.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "15px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  b)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Co-operate fully with its employer or any other body (e.g.,
                  Company and the Client) to enable them to comply with any
                  Health and Safety programme or plan.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "15px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  c)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Familiarise itself with and abide by the Health, Safety and
                  Environmental standards and procedures in place at the work
                  site.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "15px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  d)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Not intentionally nor recklessly to interfere with or misuse
                  anything provided in the interest of health, safety, or
                  welfare.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "15px",
                }}
                break={true}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  e)
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  Bring to the immediate notice of the staff concerned or, if
                  necessary, their supervisors any potential hazards to safety
                  or the environment caused by any faults in plant or equipment
                  or by the actions (voluntary or otherwise) of others.
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[styles.MT10, { display: "flex", flexDirection: "row" }]}
          >
            <Text
              style={[
                styles.Title,
                styles.MB10,
                { textDecoration: "none", width: "8%" },
              ]}
            >
              2.
            </Text>
            <View style={[styles.MB10, { width: "92%" }]}>
              <Text
                style={[styles.Title, styles.MB10, { textDecoration: "none" }]}
              >
                STATEMENT OF HEALTH AND SAFETY POLICY
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                It is the policy of Company and the Client to conduct operations
                in such a way as to avoid harm to its employees, contractors and
                all others who may be affected directly or indirectly by its
                activities.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                The Company and the Client are convinced that safe working
                practices contribute directly to the overall efficient operation
                of their business.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                Every employee and contractor are required to recognise their
                individual responsibility to ensure that this policy is pursued
                by doing all they can to prevent accidents to themselves and
                others.
              </Text>
              <Text style={[styles.MB10, styles.BodyText1]}>
                In accordance with this Policy, the following objectives have
                been set:
              </Text>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "10px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To prevent all injuries.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "10px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To provide a Safe and Healthy environment in which to work
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "10px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To establish safe systems of work.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "10px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To comply with all safety regulations and procedures.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "10px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To ensure that all employees and contractors have sufficient
                  training for their work.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "10px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To promote a high degree of safety awareness among all
                  employees and contractors.
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "row",
                  marginLeft: "10px",
                }}
              >
                <Text
                  style={[
                    styles.MB10,
                    styles.BodyText1,
                    { width: "5%", textAlign: "right" },
                  ]}
                >
                  &#x2022;
                </Text>
                <Text style={[styles.MB10, styles.BodyText1, { width: "95%" }]}>
                  To provide an effective system for monitoring and reviewing
                  health and safety performance.
                </Text>
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
        <View
          style={[
            styles.row,
            {
              display: "flex",
              justifyContent: "space-between",
              padding: "20px 0px 0px",
              position: "absolute",
              bottom: "20px",
              left: "25px",
              right: "25px",
            },
          ]}
          fixed={true}
        >
          {/* <View style={[styles.pageFooter , {display: "flex" , justifyContent: "space-between"}]} fixed={true}> */}
          {/* <Image style={[styles.footerImage]} src="/assets/images/footer.png" /> */}
          <Text
            style={[
              {
                fontSize: "9px",
                color: "#540000",
                width: "40%",
                textAlign: "left",
              },
            ]}
          >
            Contract Number:{" "}
            {isUpdate
              ? `LRED/${contractDetails?.employeeDetail?.client?.code}/SC${
                  contractDetails?.employeeDetail?.client?.contractN
                    ? "/" +
                      contractDetails?.employeeDetail?.client?.contractN?.replaceAll(
                        " ",
                        ""
                      )
                    : ""
                }/23/${contractDetails?.newContractNumber}`
              : "XXXXX"}
          </Text>
          <Text
            style={[
              {
                fontSize: "9px",
                color: "#540000",
                width: "20%",
                textAlign: "center",
              },
            ]}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber}/${totalPages}`
            }
          />
          <Text
            style={[
              {
                fontSize: "9px",
                color: "#540000",
                width: "40%",
                textAlign: "right",
              },
            ]}
          >
            Effective Date:{" "}
            {isUpdate
              ? moment(contractDetails?.startDate).format("DD MMMM YYYY")
              : "DD MMMM YYYY"}
          </Text>
        </View>
      </Page>
    </Document>

    // </>
  );
};
