import { rqClient } from '@/shared/api/instance'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/kit/card'

function LoginPage() {
  const loginMutation = rqClient.useMutation('post', '/auth/login')
  return (
    <main className=" grow flex flex-col pt-[200px] items-center">
      <Card className=" w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
          <CardDescription>
            Введите ваш email и пароль для входа в систему
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  )
}

export const Component = LoginPage
