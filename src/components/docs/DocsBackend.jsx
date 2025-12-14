import React, { useState, useEffect } from 'react';
import { supabase } from "@/components/api/supabaseClient";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout, Layers, Eye, FileCode, Search, Wand2, RefreshCw } from "lucide-react";

export default function DocsBackend() {
    const [pageStats, setPageStats] = useState({});
    const [generatingSitemap, setGeneratingSitemap] = useState(false);
    const [optimizingPage, setOptimizingPage] = useState(null);

    // Definition of the site structure
    const siteStructure = [
        {
            name: "Home",
            path: "/home",
            description: "Landing page with hero, features, and quick access.",
            sections: ["Hero Section", "Features Grid", "Stats Row", "Daily Quote"],
            type: "Page",
            priority: 1.0
        },
        {
            name: "Learn Islam",
            path: "/learn-islam",
            description: "Educational hub for Islamic principles.",
            sections: ["Principles Cards", "Pillars of Islam", "Faith Pillars"],
            type: "Page",
            priority: 0.9
        },
        {
            name: "Fatwa",
            path: "/fatwa",
            description: "Fatwa browsing and requesting interface.",
            sections: ["Search Bar", "Fatwa List", "Ask Question Modal"],
            type: "Page",
            priority: 0.8
        },
        {
            name: "Courses",
            path: "/courses",
            description: "Course catalog and enrollment.",
            sections: ["Course List", "Filters", "My Courses"],
            type: "Page",
            priority: 0.8
        },
        {
            name: "Blog",
            path: "/blog",
            description: "Articles and written content.",
            sections: ["Article List", "Search", "Featured Article"],
            type: "Page",
            priority: 0.7
        },
        {
            name: "Live Streams",
            path: "/live-streams",
            description: "Live broadcasting and upcoming schedule.",
            sections: ["Live Player", "Upcoming Schedule"],
            type: "Page",
            priority: 0.7
        },
        {
            name: "Admin Dashboard",
            path: "/admin",
            description: "Content management system.",
            sections: ["Analytics", "Content Management", "Users", "Settings"],
            type: "System",
            priority: 0.0
        }
    ];

    useEffect(() => {
        fetchPageStats();
    }, []);

    const fetchPageStats = async () => {
        // Simple client-side aggregation for demo
        const { data } = await supabase
            .from('AnalyticsEvent')
            .select('content_id')
            .eq('event_type', 'view')
            .order('created_date', { ascending: false })
            .limit(2000);

        if (data) {
            const stats = {};
            data.forEach(item => {
                const key = item.content_id?.toLowerCase();
                stats[key] = (stats[key] || 0) + 1;
            });
            setPageStats(stats);
        }
    };

    const getViews = (pageName) => {
        const key = pageName.toLowerCase();
        const keyWithPage = `page_${key}`; 
        return (pageStats[key] || 0) + (pageStats[keyWithPage] || 0) + (pageStats[pageName] || 0);
    };

    const generateSitemap = async () => {
        setGeneratingSitemap(true);
        
        const baseUrl = window.location.origin;
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        siteStructure.filter(p => p.type === "Page").forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        });
        
        xml += `</urlset>`;
        
        const blob = new Blob([xml], { type: "text/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sitemap.xml";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => setGeneratingSitemap(false), 1000);
    };

    const optimizeMeta = async (page) => {
        setOptimizingPage(page.name);
        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate an SEO-optimized meta description for the following page on an Islamic platform:
                Page Name: ${page.name}
                Path: ${page.path}
                Current Description: ${page.description}
                Key Sections: ${page.sections.join(', ')}
                
                Requirements:
                - Language: Arabic
                - Length: 150-160 characters
                - Tone: Inviting and professional
                - Include relevant keywords
                
                Output only the meta description text.`,
            });
            
            alert(`Meta Description for ${page.name}:\n\n${result}`);
            // In a real app, you would save this to the database/page config
        } catch (error) {
            console.error("Meta optimization failed:", error);
            alert("Failed to generate meta description.");
        } finally {
            setOptimizingPage(null);
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* SEO Tools Header */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                        <Search className="w-5 h-5" />
                        أدوات SEO المتقدمة
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button 
                            onClick={generateSitemap} 
                            disabled={generatingSitemap}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                            {generatingSitemap ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
                            توليد Sitemap.xml
                        </Button>
                        <p className="text-sm text-blue-600/80">
                            قم بتوليد ملف خريطة الموقع تلقائياً بناءً على هيكلية الصفحات الحالية لتقديمه لمحركات البحث.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Pages Grid */}
            <div className="grid gap-6">
                {siteStructure.map((page, index) => (
                    <Card key={index} className="overflow-hidden border-l-4 border-l-emerald-500">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <Layout className="w-5 h-5 text-emerald-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {page.name}
                                            {page.type === "System" && <Badge variant="secondary" className="text-xs">System</Badge>}
                                        </CardTitle>
                                        <div className="text-sm text-gray-500 font-mono mt-1">{page.path}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {page.type === "Page" && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => optimizeMeta(page)}
                                            disabled={optimizingPage === page.name}
                                            className="text-purple-600 border-purple-200 hover:bg-purple-50 gap-2"
                                        >
                                            {optimizingPage === page.name ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                            تحسين Meta
                                        </Button>
                                    )}
                                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border shadow-sm h-9">
                                        <Eye className="w-4 h-4 text-gray-400" />
                                        <span className="font-bold text-gray-700">{getViews(page.name)}</span>
                                        <span className="text-xs text-gray-400">مشاهدة</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/30">
                                        <TableHead className="text-right w-1/3">القسم الداخلي</TableHead>
                                        <TableHead className="text-right">الوصف / الوظيفة</TableHead>
                                        <TableHead className="text-right w-24">النوع</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {page.sections.map((section, sIndex) => (
                                        <TableRow key={sIndex}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-gray-400" />
                                                {section}
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                جزء من صفحة {page.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-gray-50">UI Section</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}