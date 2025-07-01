import {Routes,Route, Navigate} from 'react-router';
import Homepage from './pages/homepage';
import Login from './pages/login';
import Signup from './pages/signup.jsx';
import { checkAuth } from './authslice.js';
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import ProblemPage from './pages/problempage.jsx';
import Admin from './pages/admin.jsx';
import AdminVideo from './components/adminvideo.jsx';
import AdminDelete from './components/admindelete.jsx';
import AdminUpload from './components/adminupload.jsx'
import CreateContest from './components/constestcomponent.jsx';
import ContestList from './pages/contestdisplay.jsx';
import ContestDetail from './pages/contestdetail.jsx';
import SolveContestProblem from './pages/solvecontets.jsx';
import Leaderboard from './components/leaderboard.jsx';
import Home from './pages/home.jsx';
import UserDashboard from './components/userdashboard.jsx';
import AdminCreate from './components/admincreate.jsx';
function App() {
  const {isAuthenticated,user,loading} = useSelector((state) => state.auth);
 const dispatch = useDispatch();
useEffect(() => {
  dispatch(checkAuth())},[dispatch]);
 
 return (
    <Routes>
      <Route 
  path="/" 
  element={isAuthenticated ? <Homepage /> : <Home />} 
/>
      <Route path="/login" element={ isAuthenticated?<Navigate to="/"/>:<Login></Login>} />
      <Route path="/signup" element={ isAuthenticated?<Navigate to="/"/>:<Signup></Signup>} />
      <Route path="/admin"  element={isAuthenticated &&user?.role==='admin'?<Admin></Admin>:<Navigate to='/'></Navigate>}></Route>
       <Route path="/admin/delete"  element={isAuthenticated &&user?.role==='admin'?<AdminDelete></AdminDelete>:<Navigate to='/'></Navigate>}></Route>
       <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
            <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      <Route path="/admin/createcontest" element={isAuthenticated && user?.role === 'admin' ? <CreateContest></CreateContest>: <Navigate to="/" />} />
      <Route path="/contests" element={isAuthenticated ? <ContestList /> : <Navigate to="/login" />} />
      <Route path="/contest/:id" element={isAuthenticated ? <ContestDetail /> : <Navigate to="/login" />} />
      <Route path="/contest/:contestId/problem/:problemId" element={isAuthenticated ? <SolveContestProblem /> : <Navigate to="/login" />} />
            <Route path="/contest/:contestId/leaderboard" element={isAuthenticated ?  <Leaderboard></Leaderboard> : <Navigate to="/login" />} />
            <Route path="/admin/create"  element={isAuthenticated &&user?.role==='admin'?<AdminCreate></AdminCreate>:<Navigate to='/'></Navigate>}></Route>
<Route path="/dashboard"element={isAuthenticated ?  <UserDashboard></UserDashboard>: <Navigate to="/"/>}/>
      <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}/>
    </Routes>
  );}
export default App;