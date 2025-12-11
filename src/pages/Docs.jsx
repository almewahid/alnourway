import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Link2, Lock, Server, FileJson } from "lucide-react";

// Import documentation files
import entitiesSchema from "../components/docs/entitiesSchema";
import relations from "../components/docs/relations";
import authSchema from "../components/docs/authSchema";
import apiEndpoints from "../components/docs/apiEndpoints";
import sampleData from "../components/docs/sampleData";

export default function Docs() {
  const [activeTab, setActiveTab] = useState("entities");

  const tabs = [
    { id: "entities", label: "هيكل البيانات", icon: Database, data: entitiesSchema },
    { id: "relations", label: "العلاقات", icon: Link2, data: relations },
    { id: "auth", label: "المصادقة", icon: Lock, data: authSchema },
    { id: "api", label: "API Endpoints", icon: Server, data: apiEndpoints },
    { id: "sample", label: "بيانات تجريبية", icon: FileJson, data: sampleData },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12" dir="ltr">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-left flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">System Documentation</h1>
                <p className="text-gray-500">Technical reference for entities, API, and architecture.</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium">
                Internal Use Only
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-2 shadow-sm border h-auto flex-wrap justify-start">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2 px-4 py-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <tab.icon className="w-5 h-5 text-blue-600" />
                        <CardTitle>{tab.label}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[70vh] w-full">
                    <pre className="p-6 text-sm font-mono text-gray-800 bg-white">
                      {JSON.stringify(tab.data, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}