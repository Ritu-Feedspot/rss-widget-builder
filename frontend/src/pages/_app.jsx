import "../styles/globals.css"
import { AuthProvider } from "../contexts/AuthContext"
import Sidebar from "../components/Sidebar"

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  )
}
