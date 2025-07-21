export interface IAccountPODetails {
  id: number;
  type: string;
  poNumber: string;
  dailyRate: number;
  timesheetQty: number;
  isPaid: boolean;
  timesheet: {
    id: number;
    startDate: string;
    endDate: string;
    employee: {
      id: number;
      employeeNumber: string;
      fonction: string;
      loginUserData: {
        firstName: string;
        lastName: string;
      };
    };
  };
  segmentData: {
    id: number;
    name: string;
    code: string;
  } | null;
  subSegmentData: {
    id: number;
    name: string;
    code: string;
  } | null;
  medicalTotal: number;
  managers: string | null;
}

// export interface IAccountPODetails {
//   accountPODetails: {
//     id: number;
//     type: string;
//     poNumber: string;
//     dailyRate: number;
//     timesheetQty: number;
//     isPaid: boolean;
//     timesheet: {
//       id: number;
//       startDate: string;
//       endDate: string;
//       employee: {
//         id: number;
//         employeeNumber: string;
//         fonction: string;
//         loginUserData: {
//           firstName: string;
//           lastName: string;
//         };
//       };
//     };
//     segmentData: {
//       id: number;
//       name: string;
//       code: string;
//     } | null;
//     subSegmentData: {
//       id: number;
//       name: string;
//       code: string;
//     } | null;
//     medicalTotal: number;
//   }[];
//   managerNames: string[];
// }

export interface IAccountPODetailOnly {
  id: number;
  type: string;
  poNumber: string;
  dailyRate: number;
  timesheetQty: number;
  isPaid: boolean;
  timesheet: {
    id: number;
    startDate: string;
    endDate: string;
    employee: {
      id: number;
      employeeNumber: string;
      fonction: string;
      loginUserData: {
        firstName: string;
        lastName: string;
      };
    };
  };
  segmentData: {
    id: number;
    name: string;
    code: string;
  } | null;
  subSegmentData: {
    id: number;
    name: string;
    code: string;
  } | null;
}
