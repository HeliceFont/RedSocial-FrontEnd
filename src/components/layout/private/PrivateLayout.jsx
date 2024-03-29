import { Navigate, Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import UseAuth from "../../../hooks/UseAuth"
import Loading from "../../../assets/img/Comecocos.svg"


export const PrivateLayout = () => {
    const { auth, loading } = UseAuth()

    if (loading) {
        return <div className="loading"><h1>Cargando...</h1>
                    <img src={Loading} alt="Cargando..." />
                </div>
    } else {
        return (
            <>
                {/* Layout */}

                {/* Cabecera */}
                <Header />

                {/* Contenido principal */}
                <section className="layout__content">
                    {auth._id ?
                        <Outlet />
                        :
                        <Navigate to="/login" />
                    }
                </section>
                {/* Barra Lateral */}
                <Sidebar />
            </>
        )
    }
}
