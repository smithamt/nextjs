"use client";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

const NotFound = () => {
  const router = useRouter();
  const onBack = () => router.back();
  return (
    <div className="min-h-screen w-full center">
      <div className="text-center w-1/2 mx-auto">
        <p className="font-bold mb-2">
          This content isn&apos;t available right now{" "}
        </p>
        <p className="mb-4">
          When this happens, it&apos;s usually because the owner only shared it
          with a small group of people, changed who can see it or it&apos;s been
          deleted.
        </p>
        <Button className="mr-2" onClick={() => router.push("/dashboard/home")}>
          Go To Dashboard
        </Button>
        <Button onClick={onBack}>Go To Previous Page</Button>
      </div>
    </div>
  );
};

export default NotFound;
