import {
  createBrowserRouter,
  Form,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./routes/LoginPage/loginPage";
import HomePage from "./routes/HomePage/homePage";
import LeaveRequestFormPage from "./routes/Form/leaveRequestForm";
import Layout from "./layout/layout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
          path:"/login",
          element:<LoginPage/>
        },
        {
          path:"/form",
          element:<LeaveRequestFormPage/>
        },
      ]
    }
  ]);

  return (

    <RouterProvider router={router}/>
  );
}

export default App;