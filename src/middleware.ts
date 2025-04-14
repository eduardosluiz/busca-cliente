import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Verificação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export async function middleware(req: NextRequest) {
  try {
    // Se for a rota raiz, permitir acesso sem verificação
    if (req.nextUrl.pathname === '/') {
      return NextResponse.next()
    }

    // Criar response e cliente do Supabase
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Verificar sessão
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError)
      // Limpar a sessão em caso de erro
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Verificar se a sessão é válida
    if (session) {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('Sessão inválida:', userError)
        // Limpar a sessão se o usuário não for encontrado
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Log para debug
    console.log('Status da sessão:', session ? 'Autenticado' : 'Não autenticado')

    // Rotas protegidas que requerem autenticação
    const protectedRoutes = ['/dashboard', '/buscar-clientes', '/meus-contatos', '/assinatura', '/configuracoes']
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // Rotas de autenticação
    const authRoutes = ['/login', '/register']
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // Se for rota protegida e não houver sessão, redireciona para login
    if (isProtectedRoute && !session) {
      console.log('Acesso negado: usuário não autenticado tentando acessar rota protegida')
      const baseUrl = new URL(req.url).origin
      const redirectUrl = new URL('/login', baseUrl)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Se for rota de autenticação e houver sessão, redireciona para dashboard
    if (isAuthRoute && session) {
      console.log('Usuário autenticado tentando acessar página de login/registro')
      const baseUrl = new URL(req.url).origin
      return NextResponse.redirect(new URL('/dashboard', baseUrl))
    }

    // Atualizar cookies da sessão
    return res

  } catch (error) {
    console.error('Erro no middleware:', error)
    // Em caso de erro, limpar a sessão e redirecionar para login
    const errorRes = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res: errorRes })
    await supabase.auth.signOut()
    const baseUrl = new URL(req.url).origin
    const redirectUrl = new URL('/login', baseUrl)
    redirectUrl.searchParams.set('error', 'auth')
    return NextResponse.redirect(redirectUrl)
  }
}

// Configuração do matcher para aplicar o middleware em todas as rotas exceto assets estáticos e a rota raiz
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - / (root path)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/|$).*)',
  ],
} 