import { RouterProvider } from "react-router-dom";
import router from "./routes";

export default function App() {
  console.log("App: Rendering App component");
  
  return (
    <div>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#10b981',
        color: 'white',
        padding: '8px 16px',
        fontSize: '14px',
        zIndex: 9999,
        fontFamily: 'monospace',
        textAlign: 'center'
      }}>
        ✅ App is running - {new Date().toLocaleTimeString()}
      </div>
      <div style={{ marginTop: '40px' }}>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
