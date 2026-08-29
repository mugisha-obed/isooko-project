import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import App from './App'
import Spinner from './components/Spinner/Spinner'

const Home = lazy(() => import('./pages/Home/Home'))
const About = lazy(() => import('./pages/About/About'))
const Programs = lazy(() => import('./pages/Programs/Programs'))
const Impact = lazy(() => import('./pages/Impact/Impact'))
const GetInvolved = lazy(() => import('./pages/GetInvolved/GetInvolved'))
const NewsEvents = lazy(() => import('./pages/NewsEvents/NewsEvents'))
const BlogPost = lazy(() => import('./pages/BlogPost/BlogPost'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))

const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminHome = lazy(() => import('./pages/Admin/AdminHome'))
const AdminBlogPosts = lazy(() => import('./pages/Admin/AdminBlogPosts'))
const AdminEvents = lazy(() => import('./pages/Admin/AdminEvents'))
const AdminTeam = lazy(() => import('./pages/Admin/AdminTeam'))
const AdminPrograms = lazy(() => import('./pages/Admin/AdminPrograms'))
const AdminGallery = lazy(() => import('./pages/Admin/AdminGallery'))
const AdminStats = lazy(() => import('./pages/Admin/AdminStats'))
const AdminTestimonials = lazy(() => import('./pages/Admin/AdminTestimonials'))
const AdminSubmissions = lazy(() => import('./pages/Admin/AdminSubmissions'))
const AdminEmployees = lazy(() => import('./pages/Admin/AdminEmployees'))
const AdminAttendance = lazy(() => import('./pages/Admin/AdminAttendance'))
const AdminLeaves = lazy(() => import('./pages/Admin/AdminLeaves'))

const EmployeeLogin = lazy(() => import('./pages/Employee/EmployeeLogin'))
const EmployeeDashboard = lazy(() => import('./pages/Employee/EmployeeDashboard'))

const wrap = (element: React.ReactNode) => (
  <Suspense fallback={<Spinner />}>{element}</Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: wrap(<Home />) },
      { path: 'about', element: wrap(<About />) },
      { path: 'programs', element: wrap(<Programs />) },
      { path: 'impact', element: wrap(<Impact />) },
      { path: 'get-involved', element: wrap(<GetInvolved />) },
      { path: 'news-events', element: wrap(<NewsEvents />) },
      { path: 'news-events/:slug', element: wrap(<BlogPost />) },
      { path: 'contact', element: wrap(<Contact />) },
      { path: '*', element: wrap(<NotFound />) },
    ],
  },
  {
    path: '/admin/login',
    element: wrap(<AdminLogin />),
  },
  {
    path: '/admin',
    element: wrap(<AdminDashboard />),
    children: [
      { index: true, element: wrap(<AdminHome />) },
      { path: 'blog-posts', element: wrap(<AdminBlogPosts />) },
      { path: 'events', element: wrap(<AdminEvents />) },
      { path: 'team', element: wrap(<AdminTeam />) },
      { path: 'programs', element: wrap(<AdminPrograms />) },
      { path: 'gallery', element: wrap(<AdminGallery />) },
      { path: 'stats', element: wrap(<AdminStats />) },
      { path: 'testimonials', element: wrap(<AdminTestimonials />) },
      { path: 'submissions', element: wrap(<AdminSubmissions />) },
      { path: 'employees', element: wrap(<AdminEmployees />) },
      { path: 'attendance', element: wrap(<AdminAttendance />) },
      { path: 'leaves', element: wrap(<AdminLeaves />) },
    ],
  },
  {
    path: '/employee/login',
    element: wrap(<EmployeeLogin />),
  },
  {
    path: '/employee',
    element: wrap(<EmployeeDashboard />),
  },
])

export default router
