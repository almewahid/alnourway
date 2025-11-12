import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function IslamicCenters() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: centers, isLoading } = useQuery({
    queryKey: ['islamic_centers'],
    queryFn: () => base44.entities.IslamicCenter.list("-created_date"),
    initialData: [],
  });

  const filteredCenters = centers.filter(center =>
    center.name?.includes(searchQuery) ||
    center.city?.includes(searchQuery) ||
    center.country?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            مراكز الدعوة
          </h1>
          <p className="text-xl text-gray-600">
            اعثر على أقرب مركز دعوة في منطقتك
          </p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Input
                placeholder="ابحث عن مركز حسب الاسم أو المدينة أو الدولة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-6 pr-12"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredCenters.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCenters.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{center.name}</h3>
                        <p className="text-gray-600">{center.city}, {center.country}</p>
                      </div>
                    </div>

                    {center.address && (
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-600 text-sm">{center.address}</p>
                      </div>
                    )}

                    {center.phone && (
                      <div className="flex items-center gap-2 mb-3">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a href={`tel:${center.phone}`} className="text-teal-600 hover:text-teal-700 text-sm">
                          {center.phone}
                        </a>
                      </div>
                    )}

                    {center.email && (
                      <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a href={`mailto:${center.email}`} className="text-teal-600 hover:text-teal-700 text-sm">
                          {center.email}
                        </a>
                      </div>
                    )}

                    {center.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{center.description}</p>
                    )}

                    {center.services && center.services.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {center.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                لا توجد مراكز
              </h3>
              <p className="text-gray-600">
                {searchQuery ? "لم نجد نتائج لبحثك" : "لا توجد مراكز دعوة متاحة حالياً"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}