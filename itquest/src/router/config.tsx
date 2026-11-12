import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/dashboard/page";
import Lessons from "../pages/lessons/page";
import LessonViewer from "../pages/lessons/LessonViewer";
import InstructorLessonViewer from "../pages/lessons/InstructorLessonViewer";
import Quests from "../pages/quests/page";
import QuestDetailPage from "../pages/quests/QuestDetailPage";
import Coding from "../pages/coding/page";
import ChallengeWorkspace from "../pages/coding/ChallengeWorkspace";
import QuizBattle from "../pages/quiz-battle/page";
import QuizArena from "../pages/quiz-battle/QuizArena";
import Leaderboard from "../pages/leaderboard/page";
import BossQuests from "../pages/boss-quests/page";
import BossQuestWorkspace from "../pages/boss-quests/BossQuestWorkspace";
import Badges from "../pages/badges/page";
import Profile from "../pages/profile/page";
import Notifications from "../pages/notifications/page";
import FacultyDashboard from "../pages/faculty-dashboard/page";
import AdminDashboard from "../pages/admin-dashboard/page";
import UserAccess from "../pages/admin-dashboard/components/UserAccess";
import FacultyQuestsPage from "../pages/faculty-quests/page";
import FacultyQuestDetail from "../pages/faculty-quests/FacultyQuestDetail";
import { ProtectedRoute, PublicOnlyRoute } from "../components/ProtectedRoute";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/lessons",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Lessons />
      </ProtectedRoute>
    ),
  },
  {
    path: "/lessons/instructor/:id",
    element: (
      <ProtectedRoute allowedRoles={['faculty', 'admin']}> 
        <InstructorLessonViewer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/lessons/:id",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <LessonViewer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quests",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Quests />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quests/:id",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <QuestDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coding",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Coding />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coding/:id",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <ChallengeWorkspace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quiz-battle",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <QuizBattle />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quiz-battle/:id",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <QuizArena />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Leaderboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/boss-quests",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <BossQuests />
      </ProtectedRoute>
    ),
  },
  {
    path: "/boss-quests/:id",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <BossQuestWorkspace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/badges",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Badges />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["faculty", "admin"]}>
        <FacultyDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-dashboard/users",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <UserAccess />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-quests",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <FacultyQuestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faculty-quests/:id",
    element: (
      <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
        <FacultyQuestDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

