import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não estiver autenticado e tentar acessar rotas protegidas
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/buscar-clientes') ||
    req.nextUrl.pathname.startsWith('/meus-contatos') ||
    req.nextUrl.pathname.startsWith('/assinatura') ||
    req.nextUrl.pathname.startsWith('/configuracoes')
  )) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se estiver autenticado e tentar acessar login/registro
  if (session && (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 