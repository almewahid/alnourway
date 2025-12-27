import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// 🆕 تحديد الصفحات التي تحتاج تسجيل دخول
const protectedPages = [
  'profile',                    // الملف الشخصي
  'settings',                   // الإعدادات
  'admin',                      // لوحة الإدارة
  'notifications',              // الإشعارات
  'favorites',                  // المفضلة
  'recommendations',            // التوصيات
  'advancedanalytics',          // التحليلات المتقدمة
  'reconciliationcommittee',    // لجنة المصالحة
  'jointeam',                   // انضم للفريق
  'chat',                       // المحادثات
  'contactpreacher',            // التواصل مع الداعية
  'contactscholar',             // التواصل مع العالم
  'contactteacher',             // التواصل مع المعلم
  'Docs',                       // المستندات
  // أضف أي صفحات أخرى تريد حمايتها
];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Public routes - متاحة للجميع */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<Navigate to="/auth" replace />} />
      
      {/* Main page - متاحة للجميع */}
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />

      {/* Dynamic routes - بعضها محمي وبعضها عام */}
      {Object.entries(Pages).map(([path, Page]) => {
        const isProtected = protectedPages.includes(path);
        
        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              isProtected ? (
                <ProtectedRoute>
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                </ProtectedRoute>
              ) : (
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              )
            }
          />
        );
      })}
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
          <VisualEditAgent />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App