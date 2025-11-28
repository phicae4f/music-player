import { Link } from "react-router-dom"
import { AuthForm } from "../components/AuthForm"

export const LoginPage = () => {
    return (
        <section className="auth">
            <div className="container">
                <div className="auth__wrapper">
                    <h2 className="auth__title">Авторизация</h2>
                    <AuthForm btnText="Войти" mode="login"/>
                    <Link className="auth__link" to="/register">Еще нет аккаунта?</Link>
                </div>
            </div>
        </section>
    )
}