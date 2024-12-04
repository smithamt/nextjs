"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

function PlannerAttendanceDetailLink({ id }: { id: string }) {
  const [active, setActive] = useState("attendance");
  return (
    <div className="p-2 space-x-2">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Attendance</TabsTrigger>
          <TabsTrigger value="password">Shift</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default PlannerAttendanceDetailLink;
