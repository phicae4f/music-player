import { Link } from "react-router-dom"
import { AuthForm } from "../components/AuthForm"

export const RegisterPage = () => {
    return (
        <section className="auth">
                    <div className="container">
                        <div className="auth__wrapper">
                            <h2 className="auth__title">Регистрация</h2>
                            <AuthForm btnText="Создать аккаунт" mode="register"/>
                            <Link to="/login">Уже есть аккаунт?</Link>
                        </div>
                    </div>
        </section>
    )
}