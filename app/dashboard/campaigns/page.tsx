import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import React from "react";

export default function CampaignsPage() {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      <Card className="w-full flex flex-col justify-center items-center">
        <CardTitle className="text-4xl font-bold font-mono py-10">
          Campaigns Page
        </CardTitle>
      </Card>

      <Card className="w-full flex flex-col justify-center items-center">
        <CardTitle className="text-4xl font-bold font-mono py-10">
          Campaigns Page
        </CardTitle>
      </Card>
    </div>
  );
}
