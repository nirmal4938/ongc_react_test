import { StyleSheet, Font } from "@react-pdf/renderer";
import SatoshiLight from "/assets/fonts/Satoshi-Light.ttf";
import Satoshi from "/assets/fonts/Satoshi-Regular.ttf";
import SatoshiMedium from "/assets/fonts/Satoshi-Medium.ttf";
import SatoshiBold from "/assets/fonts/Satoshi-Bold.ttf";

Font.register({
  family: "Satoshi",
  fonts: [
    {
      src: SatoshiLight,
      fontWeight: "light",
    },
    {
      src: Satoshi,
      fontWeight: "normal",
    },
    {
      src: SatoshiMedium,
      fontWeight: "medium",
    },
    {
      src: SatoshiBold,
      fontWeight: "semibold",
    },
  ],
});

export const styles = StyleSheet.create({
  WaterMark: {
    position: "absolute",
    transform: "translateY(-50%)",
    top: "50%",
    left: "0",
    right: "0",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    textAlign: "center",
    height: "auto",
    opacity: 0.1,
  },
  WaterMarkImage: {
    maxWidth: "80%",
    width: "100%",
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    objectFit: "contain",
    objectPositionX: "center",
  },
  body: {
    paddingTop: 0,
    paddingBottom: "250px",
    // paddingHorizontal: 35,
    fontFamily: "Satoshi",
    fontSize: "12px",
    lineHeight: "1.25",
  },

  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
    // paddingBottom: "50px",
  },
  header: {
    fontSize: 14,
    fontStyle: "Italic",
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  p4: {
    padding: "4px",
  },
  half: {
    width: "50%",
  },
  borderT: {
    borderTop: "1px solid #e8e8e8",
  },
  borderB: {
    borderBottom: "1px solid #e8e8e8",
  },
  borderL: {
    borderLeft: "1px solid #e8e8e8",
  },
  borderR: {
    borderRight: "1px solid #e8e8e8",
  },
  fontBold: {
    fontWeight: "bold",
  },
  fontMedium: {
    fontWeight: "medium",
  },
  fontNormal: {
    fontWeight: "normal",
  },
  hFull: {
    height: "100%",
  },
  wFull: {
    width: "100%",
  },
  Text16: {
    fontSize: "16px",
    lineHeight: "1.3",
  },
  Text14: {
    fontSize: "14px",
    lineHeight: "1.3",
  },
  Text12: {
    fontSize: "12px",
    lineHeight: "1.3",
  },
  BodyText: {
    fontSize: "10px",
    lineHeight: "1.2",
    color: "#555555",
  },
  BodyText1: {
    fontSize: "11px",
    lineHeight: "1.2",
    color: "#555555",
  },
  TextPrimary: {
    color: "#555555",
  },
  TextBlack: {
    color: "#000000",
  },
  TextRed:{
    color: "#6b070d",
    marginRight: "40px",
  },
  footer:{
    textAlign: "right",
    position: "absolute",
    bottom:"0",
    right:"0",
    paddingBottom: "20px",
  },
  PR10:{
    paddingRight: "10px",
  },
  PL10:{
    paddingLeft: "10px",
  },
  MB14: {
    marginBottom: "14px",
  },
  MT14: {
    marginTop: "14px",
  },
  MB10: {
    marginBottom: "10px",
  },
  MR10: {
    marginRight: "10px",
  },
  ML10: {
    marginLeft: "10px",
  },
  MB5: {
    marginBottom: "5px",
  },
  MB2: {
    marginBottom: "2px",
  },
  MB20: {
    marginBottom: "20px",
  },
  MB60: {
    marginBottom: "60px",
  },
  MT20: {
    marginTop: "20px",
  },
  MT10: {
    marginTop: "10px",
  },
  MT2: {
    marginTop: "2px",
  },
  MT60: {
    marginTop: "60px",
  },
  TableBox: {
    width: "100%",
    maxWidth: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "0px",
  },
  Title: {
    marginBottom: "2px",
    fontSize: "12px",
    lineHeight: "1.4",
    fontWeight: "semibold",
    textDecoration: "underline",
    paddingBottom: "2px",
    color: "#000000",
  },
  footerImage: {
    width: "100%",
    height: "auto",
  },
  pageFooter: {
    position: "absolute",
    width: "100%",
    left: "0",
    bottom: "15px",
  },
  pageNumber: {
    position: "absolute",
    fontSize: "11px",
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    width: "100%",
    color: "#540000",
  },

  wTwenty: {
    width: "20%",
  },
  wSixty: {
    width: "60%",
  },
  table: { 
    // display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    margin: "0 auto"
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol: { 
    width: "38px", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    // borderTopWidth: 0,
    fontSize: 14,
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 14,
    height: 30,
    marginBottom: 0, 
  },
  woneFifty:{
    width: "150px",
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0, 
    fontSize: 14,
  },
  nborder:{
    borderBottom: "none",
    borderTop: "none",
    width: "17px"
  },
  atable: { 
    // display: "table",  
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginLeft: "37px",
    width: "12%" ,
  }, 
  atableCol: { 
    width: "250px", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    // borderTopWidth: 0,
    fontSize: 14,
    maxWidth: "300px"
  },
  atableRow: { 
    margin: "auto", 
    flexDirection: "row",
  },
});
