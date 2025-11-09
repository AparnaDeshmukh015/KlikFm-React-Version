import { toast } from "react-toastify";
import { callPostAPI } from "../../services/apis";
import { ENDPOINTS } from "../../utils/APIEndpoints";

export const onToggleButtonChange = async (
  e: any,
  ResRectCheck: any,
  setData: any,
  getDashboardDetails: any,
  IsResRectCheck: any,
  IsCheckValueRes: any
) => {
  setData(e.value);
  IsResRectCheck = ResRectCheck;
  if (e.value != null) {
    IsCheckValueRes = e.value;
    let locationStatus: any = false;
    await getDashboardDetails(locationStatus);
  }
};

export const AvgDashboardDataRes = (dataList: any, IsCheckValueRes: any) => {
  let v_data: any = [];
  const data: any = Object?.values(dataList);

  if (IsCheckValueRes === "Hour") {
    for (let i = 0; i < data?.length; i++) {
      const hours = Math.floor(data[i] / 60);
      v_data.push(`${hours}h`);
    }
  }
  if (IsCheckValueRes === "Day") {
    for (let i = 0; i < data?.length; i++) {
      const days = Math.floor(data[i] / (24 * 60));
      v_data.push(`${days}d`);
    }
  }
  return v_data;
};
export const AvgDashboardDataRect = (dataList: any, IsCheckValueRect: any) => {
  let v_data: any = [];
  const data: any = Object.values(dataList);

  if (IsCheckValueRect === "Hour") {
    for (let i = 0; i < data?.length; i++) {
      const hours = Math.floor(data[i] / 60);
      v_data.push(`${hours}h`);
    }
  }
  if (IsCheckValueRect === "Day") {
    for (let i = 0; i < data?.length; i++) {
      const days = Math.floor(data[i] / (24 * 60));
      v_data.push(`${days}d`);
    }
  }
  return v_data;
};

export const AvgTimeCalRes = (totalaval: any, IsCheckValueRes: any) => {
  var val = "0d 0h 0m";
  if (IsCheckValueRes === "Day") {
    const days = Math.floor(totalaval / (24 * 60));
    const hours = Math.floor((totalaval % (24 * 60)) / 60);
    const minutes = totalaval % 60;
    val = days + "d " + hours + "h " + minutes + "m";
  }
  if (IsCheckValueRes === "Hour") {
    const hours = Math.floor(totalaval / 60);
    const minutes = totalaval % 60;
    val = hours + "h " + minutes + "m";
  }
  return val;
};

export const AvgTimeCalRect = (totalaval: any, IsCheckValueRect: any) => {
  var val = "0d 0h 0m";
  if (IsCheckValueRect === "Day") {
    const days = Math.floor(totalaval / (24 * 60));
    const hours = Math.floor((totalaval % (24 * 60)) / 60);
    const minutes = totalaval % 60;
    val = days + "d " + hours + "h " + minutes + "m";
  }
  if (IsCheckValueRect === "Hour") {
    const hours = Math.floor(totalaval / 60);
    const minutes = totalaval % 60;
    val = hours + "h " + minutes + "m";
  }
  return val;
};

export async function getDashboardMasterDetails(
  setDateFilterList?: any,
  OnloadFilterList?: any,
  filterDateHandeler?: any
) {
  try {
    const res = await callPostAPI(ENDPOINTS.GET_DASHBOARD_MASTER, {}, null);
    setDateFilterList(res?.DATEFILTERLIST);
    OnloadFilterList = res?.DATEFILTERLIST;
    if (OnloadFilterList.length > 0) {
      await filterDateHandeler(OnloadFilterList[5]);
    }
  } catch (error: any) {
    toast.error(error);
  }
}

export const DashboardSeriesData = (detailsList: any = []) => {
  let dataDashboardSeriesData: any = Object.values(detailsList[0]);
  return dataDashboardSeriesData;
};

export const DashboardLabelData = (detailsList: any) => {
  let dataDashboardLabelData: any = Object.keys(detailsList[0]);
  return dataDashboardLabelData;
};

export const createDonutConfig = ({
  series,
  labels,
  title,
  colors = ["#e23b03", "#fff694", "#c3f060"],
  halfDonut = false,
}: {
  series: any[];
  labels: string[];
  title?: string;
  colors?: string[];
  halfDonut?: boolean;
}) => {
  return {
    series,
    options: {
      chart: {
        type: "donut",
      },
      colors,
      dataLabels: {
        enabled: false,
      },
      labels,
      grid: {
        padding: halfDonut ? { bottom: -60 } : {}, // ✅ Always at least an object
      },
      plotOptions: {
        pie: {
          ...(halfDonut ? { startAngle: -90, endAngle: 90, offsetY: 10 } : {}),
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                label: title,
                show: true,
                style: {
                  fontSize: "12px",
                  color: "grey",
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: halfDonut ? 200 : 300 },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  };
};

export const statusMap: any = {
  Open: "Open",
  "In Progress": "In Progress",
  "On Hold": "On-Hold",
  Rectified: "Rectified",
  "Pending Action": "Pending Action",
  "Re Open": "Re-open",
};

export const createChartConfig = (
  title: string,
  name: string,
  data: number[],
  xaxisTitle: string
) => ({
  series: [{ name, data }],
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    },
    colors: ["#7BD18A", "#9DE0A9", "#C0E5C6"],
    title: {
      text: title,
      align: "center",
      margin: 10,
      floating: true,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["High", "Medium", "Low"],
      title: { text: xaxisTitle },
    },
  },
});
