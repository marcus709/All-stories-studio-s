import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface TensionTimelineProps {
  storyId?: string;
}

export const TensionTimeline = ({ storyId }: TensionTimelineProps) => {
  const { data: tensionPoints } = useQuery({
    queryKey: ["timeline_tension_points", storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_tension_points")
        .select("*")
        .eq("story_id", storyId)
        .order("position");

      if (error) throw error;
      return data || [];
    },
    enabled: !!storyId,
  });

  const options: Highcharts.Options = {
    chart: {
      type: "areaspline",
      backgroundColor: "transparent",
      style: {
        fontFamily: "inherit"
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: tensionPoints?.map(point => `Event ${point.position}`),
      labels: {
        style: {
          color: "#9ca3af"
        }
      },
      lineColor: "#374151",
      tickColor: "#374151"
    },
    yAxis: {
      title: {
        text: undefined
      },
      gridLineColor: "#374151",
      labels: {
        style: {
          color: "#9ca3af"
        }
      }
    },
    series: [{
      name: "Tension",
      type: "areaspline",
      data: tensionPoints?.map(point => point.tension_level) || [],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "rgba(239, 68, 68, 0.8)"],
          [1, "rgba(239, 68, 68, 0)"]
        ]
      },
      lineWidth: 3
    }],
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
      backgroundColor: "#18181b",
      borderColor: "#374151",
      style: {
        color: "#fff"
      }
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5,
        marker: {
          radius: 6,
          symbol: "circle",
          fillColor: "#ef4444",
          lineWidth: 2,
          lineColor: "#fff"
        }
      }
    }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};