import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlannerAttendanceDetailAttendance from "./_attendance/page";
import PlannerAttendanceDetailShift from "./_shift/page";

async function PlannerAttendanceDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="w-full h-full p-2">
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="shift">Shift</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <PlannerAttendanceDetailAttendance
            params={params}
            searchParams={searchParams}
          />
        </TabsContent>
        <TabsContent value="shift">
          <PlannerAttendanceDetailShift
            params={params}
            searchParams={searchParams}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PlannerAttendanceDetailPage;
