import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearAuthError, loginUser, registerUser } from "../store/authSlice";
import { Button } from "../ui/Button";
import { CustomInput } from "../ui/CustomInput";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface AuthFormProps {
  btnText: string;
  mode: "register" | "login";
}

interface AuthFormData {
  username: string;
  password: string;
}

export const AuthForm = ({ btnText, mode }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthFormData>();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
        dispatch(clearAuthError())
    }
  }, [dispatch])

  const onSubmit = async (data: AuthFormData) => {
    dispatch(clearAuthError());

    const credentials = { username: data.username, password: data.password };

    if(mode==="register"){
        const result = await dispatch(registerUser(credentials));
        if (result.type.endsWith("/fulfilled")) {
          navigate("/login");
        }
    } else {
        const result = await dispatch(loginUser(credentials))
        if(result.type.endsWith("/fulfilled")) {
            navigate("/")
        }
    }

  };
  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
    {error && <span className="auth-form__error">{error}</span>}
      <CustomInput
        labelText="Имя"
        type="text"
        id="username"
        placeholder="Ваше имя..."
        {...register("username", {
          required: "Поле обязательно",
          minLength: { value: 3, message: "Введите минимум 3 символа" },
        })}
        error={errors?.password?.message}
      />
      <CustomInput
        labelText="Пароль"
        type="password"
        id="password"
        placeholder="Ваш пароль..."
        {...register("password", {
          required: "Поле обязательно",
          minLength: { value: 6, message: "Введите минимум 6 символов" },
        })}
        error={errors?.password?.message}
      />
      <Button type="submit" text={isLoading ? "Загрузка..." : btnText} disabled={isLoading}/>
    </form>
  );
};
