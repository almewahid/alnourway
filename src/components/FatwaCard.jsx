import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, ChevronDown, ChevronUp } from "lucide-react";

export default function FatwaCard({ fatwa }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl leading-snug mb-2">{fatwa.question}</CardTitle>
            {fatwa.category && (
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                {fatwa.category}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {expanded && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-r-4 border-emerald-500">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-800">
                {fatwa.mufti || "المفتي"}
              </span>
            </div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {fatwa.answer}
            </p>
            {fatwa.reference && (
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">المرجع: </span>
                  {fatwa.reference}
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 ml-2" />
              إخفاء الجواب
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 ml-2" />
              عرض الجواب
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}