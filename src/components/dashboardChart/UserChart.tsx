import Chart from "react-apexcharts";
import { IChartInterface } from "@/interface/dashboard/dashboard";

const UserChart = (props: {
  lineData: number[];
  dateData: string[];
  isDynamicValue?: boolean;
}) => {
  const difference =
    props?.isDynamicValue && Math.max(...props?.lineData) > 0
      ? Math.ceil(Math.max(...props?.lineData) / 7)
      : 10;
  const maxValue =
    props?.isDynamicValue && Math.max(...props?.lineData) > 0
      ? Math.max(...props?.lineData) + difference
      : 10;
  const dataSet: IChartInterface = {
    series: [
      {
        type: "line",
        data: props.lineData ? props.lineData : [0],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: "350px",
        toolbar: { show: false },
        zoom: {
          enabled: false,
        },
      },
      colors: ["#29A073", "#5065F6", "#546E7A", "#F04B69", "#F1C717"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth", //or 'straight'
        width: 2,
      },
      grid: {
        show: true,
        borderColor: "#f0f0f0",
        xaxis: {
          lines: {
            show: true,
            opacity: 0.5,
            color: "#f0f0f0",
          },
        },
        yaxis: {
          lines: {
            show: false,
            opacity: 0.5,
            color: "#ffffff",
          },
        },
      },
      xaxis: {
        categories: props.dateData,
        axisTicks: {
          show: false,
        },
        labels: {
          offsetX: 2,
          offsetY: 5,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        min: 0,
        max: maxValue,
        tickAmount: 7,
        show: true,
        labels: {
          show: true,
          offsetX: -5,
          offsetY: 0,
        },
        axisBorder: {
          show: false,
        },
      },
      legend: { show: false },
      tooltip: { enabled: true },
      markers: {
        size: 5,
        fillOpacity: 1,
        shape: "circle",
        radius: 2,
        showNullDataPoints: true,
        hover: {
          size: undefined,
          sizeOffset: 5,
          strokeColors: "#fff",
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
        },
      },
    },
  };

  return (
    <>
      <div className="h-64 chart-wrapper">
        <Chart
          height={"100%"}
          options={dataSet.options}
          type="line"
          series={dataSet.series}
          width="100%"
        />
      </div>
    </>
  );
};

export default UserChart;
