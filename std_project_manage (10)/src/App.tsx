import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { AdminDashboard } from "./components/AdminDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { Profile } from "./components/Profile";
import { ProfileSetup } from "./components/ProfileSetup";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

type UserType = "admin" | "student";
type View =
  | "login"
  | "registration"
  | "profileSetup"
  | "dashboard"
  | "profile";

// localStorage utility functions
const storage = {
  getAccounts: () => JSON.parse(localStorage.getItem('accounts') || '[]'),
  setAccounts: (accounts: any[]) => localStorage.setItem('accounts', JSON.stringify(accounts)),
  
  getProjects: () => JSON.parse(localStorage.getItem('projects') || '[]'),
  setProjects: (projects: any[]) => localStorage.setItem('projects', JSON.stringify(projects)),
  
  getSubmissions: () => JSON.parse(localStorage.getItem('submissions') || '[]'),
  setSubmissions: (submissions: any[]) => localStorage.setItem('submissions', JSON.stringify(submissions)),
  
  getTasks: () => JSON.parse(localStorage.getItem('tasks') || '[]'),
  setTasks: (tasks: any[]) => localStorage.setItem('tasks', JSON.stringify(tasks)),
  
  getMessages: () => JSON.parse(localStorage.getItem('messages') || '[]'),
  setMessages: (messages: any[]) => localStorage.setItem('messages', JSON.stringify(messages)),
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>("login");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data from localStorage on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      setIsLoading(true);
      
      // Load all data from localStorage
      const loadedAccounts = storage.getAccounts();
      const loadedProjects = storage.getProjects();
      const loadedSubmissions = storage.getSubmissions();
      const loadedTasks = storage.getTasks();
      const loadedMessages = storage.getMessages();

      setAccounts(loadedAccounts);
      setProjects(loadedProjects);
      setSubmissions(loadedSubmissions);
      setTasks(loadedTasks);
      setMessages(loadedMessages);

      // Initialize with default accounts if empty
      if (loadedAccounts.length === 0) {
        initializeDefaultAccounts();
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Unable to load data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultAccounts = () => {
    const defaultAccounts = [
      // Default admin accounts
      {
        id: 1,
        email: "ramcharan123@gmail.com",
        password: "1234",
        userType: "admin",
        fullName: "Ram Charan",
        phoneNumber: "9876543210",
        department: "Computer Science",
        profileComplete: true,
      },
      {
        id: 2,
        email: "anilpagadala583@gmail.com",
        password: "1234",
        userType: "admin",
        fullName: "Anil Pagadala",
        phoneNumber: "9876543211",
        department: "Information Technology",
        profileComplete: true,
      },
      {
        id: 3,
        email: "rahul123@gmail.com",
        password: "1234567",
        userType: "admin",
        fullName: "Rahul Kumar",
        phoneNumber: "9876543212",
        department: "Computer Science",
        profileComplete: true,
      },
      // Default student account
      {
        id: 4,
        email: "2400030525@kluniversity.in",
        password: "12345",
        userType: "student",
        fullName: "John Doe",
        studentId: "2400030525",
        phoneNumber: "9876543213",
        department: "Computer Science",
        academicYear: "3",
        profileComplete: true,
      },
    ];
    
    setAccounts(defaultAccounts);
    storage.setAccounts(defaultAccounts);
  };

  const handleRegister = (type: UserType, userData: any) => {
    try {
      const newAccount = {
        ...userData,
        id: Date.now(),
        userType: type,
        profileComplete: false,
      };

      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      storage.setAccounts(updatedAccounts);
      
      setUserType(type);
      setUser(newAccount);
      setCurrentView("profileSetup");
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleLogin = (type: UserType, userData: any) => {
    setUserType(type);
    setUser(userData);
    // Check if user has completed profile setup
    if (!userData.profileComplete) {
      setCurrentView("profileSetup");
    } else {
      setCurrentView("dashboard");
    }
  };

  const handleShowRegistration = () => {
    setCurrentView("registration");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleProfileSetupComplete = (profileData: any) => {
    try {
      const updatedUser = {
        ...user,
        ...profileData,
        profileComplete: true,
        // Initialize average grade as null - only admins can set this
        averageGrade: null,
      };

      const updatedAccounts = accounts.map((acc) =>
        acc.email === user.email ? updatedUser : acc,
      );
      setAccounts(updatedAccounts);
      storage.setAccounts(updatedAccounts);
      
      setUser(updatedUser);
      setCurrentView("dashboard");
      toast.success("Profile setup completed!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleShowProfile = () => {
    setCurrentView("profile");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleProfileUpdate = (updatedUser: any) => {
    try {
      const updatedAccounts = accounts.map((acc) =>
        acc.email === updatedUser.email ? updatedUser : acc,
      );
      setAccounts(updatedAccounts);
      storage.setAccounts(updatedAccounts);
      
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setUser(null);
    setCurrentView("login");
  };

  const handleUpdateProjects = (updatedProjects: any[]) => {
    setProjects(updatedProjects);
    storage.setProjects(updatedProjects);
  };

  const handleUpdateSubmissions = (updatedSubmissions: any[]) => {
    setSubmissions(updatedSubmissions);
    storage.setSubmissions(updatedSubmissions);
  };

  const handleUpdateTasks = (updatedTasks: any[]) => {
    setTasks(updatedTasks);
    storage.setTasks(updatedTasks);
  };

  const handleUpdateMessages = (updatedMessages: any[]) => {
    setMessages(updatedMessages);
    storage.setMessages(updatedMessages);
  };

  const handleCreateStudentAccount = (studentData: any) => {
    try {
      const newAccount = {
        ...studentData,
        id: Date.now(),
        userType: "student",
        profileComplete: true,
      };

      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      storage.setAccounts(updatedAccounts);
      
      toast.success("Student account created successfully!");
      return newAccount;
    } catch (error) {
      console.error("Error creating student account:", error);
      toast.error("Failed to create student account. Please try again.");
      return null;
    }
  };

  // Show loading screen while data loads
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FEDF-PS35 Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === "login" && (
        <Login
          onLogin={handleLogin}
          onShowRegistration={handleShowRegistration}
          accounts={accounts}
        />
      )}

      {currentView === "registration" && (
        <Registration
          onRegister={handleRegister}
          onBackToLogin={handleBackToLogin}
          existingAccounts={accounts}
        />
      )}

      {currentView === "profileSetup" && userType && (
        <ProfileSetup
          userType={userType}
          initialData={user}
          onComplete={handleProfileSetupComplete}
        />
      )}

      {currentView === "profile" && user && userType && (
        <Profile
          user={user}
          userType={userType}
          onBack={handleBackToDashboard}
          onUpdate={handleProfileUpdate}
        />
      )}

      {currentView === "dashboard" && user && userType && (
        <>
          {userType === "admin" ? (
            <AdminDashboard
              user={user}
              onShowProfile={handleShowProfile}
              onLogout={handleLogout}
              projects={projects}
              onUpdateProjects={handleUpdateProjects}
              submissions={submissions}
              onUpdateSubmissions={handleUpdateSubmissions}
              tasks={tasks}
              onCreateStudentAccount={
                handleCreateStudentAccount
              }
              allAccounts={accounts}
              messages={messages}
              onUpdateMessages={handleUpdateMessages}
            />
          ) : (
            <StudentDashboard
              user={user}
              onShowProfile={handleShowProfile}
              onLogout={handleLogout}
              projects={projects}
              onUpdateProjects={handleUpdateProjects}
              onUpdateSubmissions={handleUpdateSubmissions}
              submissions={submissions}
              tasks={tasks}
              onUpdateTasks={handleUpdateTasks}
              messages={messages}
              onUpdateMessages={handleUpdateMessages}
              allAccounts={accounts}
            />
          )}
        </>
      )}

      {!currentView && (
        <Login
          onLogin={handleLogin}
          onShowRegistration={handleShowRegistration}
          accounts={accounts}
        />
      )}

      <Toaster />
    </>
  );
}