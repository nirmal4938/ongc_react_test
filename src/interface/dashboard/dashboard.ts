import { ApexOptions } from "apexcharts";
import { ILoginUserData } from "../user/userInterface";
import { IClientResponseData } from "../client/clientInterface";

export interface IEmployeeDashboardData {
  employeeDetail?: [
    {
      newContractNumber: number;
      employeeDetail: {
        id: number;
        loginUserData: ILoginUserData;
        medicalCheckDate: string;
        medicalCheckExpiry: string;
        segment: {
          name: string;
        };
      };
    }
  ];
  employeeName?: {
    id: number;
    slug: string;
    contractNumber: number | null;
    loginUserData: ILoginUserData;
    segment: {
      name: string;
    };
    employeeLeave:
      | {
          id: number | null;
          startDate: string | null;
        }[];
  };
  reliquatCalculation?: number | null;
  reliquatDate?: string | null;
  isMonthlyReliquat?: boolean;
}

export interface IDashboardTransportData {
  availableDriverData: {
    driverNo: string;
    id: number;
    unavailableDates: null | string;
  }[];
  availableVehicleData: {
    vehicleNo: string;
    id: number;
    unavailableDates: null | string;
  }[];
  bookedDriverData: {
    driverNo: string;
    id: number;
    unavailableDates: string;
  }[];
  bookedVehiclesData: {
    vehicleNo: string;
    id: number;
    unavailableDates: string;
  }[];
}
export interface IDashboardData {
  employeeCount: number;
  employeeData: [
    {
      newContractNumber: number;
      totalLeaveCount: string;
      employeeDetail: {
        id: number;
        loginUserData: ILoginUserData;
        medicalCheckDate: null | string;
        medicalCheckExpiry: null | string;
        segmentId: number;
        segment: {
          name: string;
        };
        employeeLeave: [
          {
            id: number;
            totalDays: number;
          }
        ];
      };
    }
  ];
  totalContractCount: number;
  totalMedicalExpiryCount: {
    count: number;
    rows: [
      {
        loginUserData: ILoginUserData;
        medicalCheckExpiry: string;
      }
    ];
  };
  totalContractEndCount: number;
  totalContractEndData: {
    endDate: string;
    contractName?: string;
    id?: number;
    employeeDetail: {
      id: string;
      loginUserData: ILoginUserData;
      contractEndDate?: Date | string | null;
    };
  }[];
  requestData: {
    count: number;
    rows: [
      {
        id: number;
        name: string;
        createdAt: string;
        contractNumber: number;
        documentTotal: number;
        deliveryDate: string;
        client: IClientResponseData;
        employee: {
          segment: {
            name: string;
          };
          subSegment?: {
            name: string;
          };
        };
      }
    ];
  };
  failedLoginData: [
    {
      createdAt: string;
      email: string;
      status: string;
    }
  ];
}

export interface IChartInterface {
  series?: ApexOptions["series"];
  options: {
    chart: {
      type?:
        | "line"
        | "area"
        | "bar"
        | "pie"
        | "donut"
        | "radialBar"
        | "scatter"
        | "bubble"
        | "heatmap"
        | "candlestick"
        | "boxPlot"
        | "radar"
        | "polarArea"
        | "rangeBar"
        | "rangeArea"
        | "treemap";
      height?: string | number;
      toolbar?: {
        show?: boolean;
      };
      zoom?: {
        enabled?: boolean;
      };
    };
    colors: Array<string>;
    dataLabels: {
      enabled?: boolean;
    };
    stroke: {
      curve?:
        | "smooth"
        | "straight"
        | "stepline"
        | ("smooth" | "straight" | "stepline")[];
      width?: number | number[];
    };
    grid: {
      show?: boolean;
      borderColor?: string;
      xaxis?: {
        lines?: {
          color?: string;
          opacity?: number;
          show?: boolean;
        };
      };
      yaxis?: {
        lines?: {
          color?: string;
          opacity?: number;
          show?: boolean;
        };
      };
    };
    xaxis: {
      categories?: string[];
      type?: "category" | "datetime" | "numeric";
      offsetX?: number;
      offsetY?: number;
      sorted?: boolean;
      labels?: {
        offsetX?: number;
        offsetY?: number;
      };
      axisBorder?: {
        show?: boolean;
      };
      axisTicks?: {
        show?: boolean;
      };
      tickPlacement?: string;
    };
    yaxis: {
      show?: boolean;
      tickAmount?: number;
      min?: number | ((min: number) => number);
      max?: number | ((max: number) => number);
      floating?: boolean;
      decimalsInFloat?: number;
      labels?: {
        show?: boolean;
        offsetX?: number;
        offsetY?: number;
      };
      axisBorder?: {
        show?: boolean;
      };
    };
    legend: {
      show?: boolean;
    };
    tooltip: {
      enabled?: boolean;
    };
    markers: {
      size?: number | number[];
      fillOpacity?: number | number[];
      discrete?: ApexDiscretePoint[];
      shape?: ApexMarkerShape;
      radius?: number;
      showNullDataPoints?: boolean;
      hover?: {
        strokeColors: string;
        size?: number;
        sizeOffset?: number;
        strokeWidth: number;
        strokeOpacity: number;
        strokeDashArray: number;
      };
    };
  };
}
