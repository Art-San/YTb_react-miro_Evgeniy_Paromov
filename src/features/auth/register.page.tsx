import { Link } from 'react-router-dom'
import { AuthLayout } from './ui/auth-layout'
import { ROUTES } from '@/shared/model/routes'
import { RegisterForm } from './ui/register-form'

function RegisterPage() {
  return (
    <>
      <AuthLayout
        form={<RegisterForm />}
        title="Регистрация"
        description="Введите ваш email и пароль для регистрации в системе"
        footerText={
          <>
            Уже есть аккаунта? <Link to={ROUTES.LOGIN}>Войти</Link>
          </>
        }
      ></AuthLayout>
    </>
  )
}

export const Component = RegisterPage
