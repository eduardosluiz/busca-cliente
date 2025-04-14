import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PostgrestError } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('Iniciando setup do banco de dados...')
    
    // Verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidas')
    }

    // Usar service_role key para ter permissões suficientes
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Verificando conexão com o Supabase...')
    
    // Testar conexão
    const { data: testConnection, error: connectionError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      
    if (connectionError && connectionError.message === 'Invalid API key') {
      throw new Error('Chave de API do Supabase inválida. Verifique suas credenciais.')
    }

    console.log('Criando tabela de perfis...')

    try {
      // Verificar se a tabela auth.users existe
      const { error: authCheckError } = await supabase.rpc('exec_sql', {
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'auth' 
            AND table_name = 'users'
          );
        `
      })

      if (authCheckError) {
        throw new Error('Não foi possível verificar a tabela auth.users: ' + authCheckError.message)
      }

      // Criar a tabela profiles
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql_query: `
          DO $$
        BEGIN
            CREATE TABLE IF NOT EXISTS public.profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              email TEXT NOT NULL,
              name TEXT,
              company TEXT,
              phone TEXT,
              cpf TEXT,
              email_notifications BOOLEAN DEFAULT true,
              system_notifications BOOLEAN DEFAULT true,
              created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
            );

            -- Habilitar RLS
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

            -- Garantir que as políticas existam
            DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
            DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
            DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
            DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

            -- Criar políticas
            CREATE POLICY "Users can view their own profile"
              ON public.profiles FOR SELECT
              USING (auth.uid() = id);

            CREATE POLICY "Users can insert their own profile"
              ON public.profiles FOR INSERT
              WITH CHECK (auth.uid() = id);

            CREATE POLICY "Users can update their own profile"
              ON public.profiles FOR UPDATE
              USING (auth.uid() = id)
              WITH CHECK (auth.uid() = id);

            CREATE POLICY "Users can delete their own profile"
              ON public.profiles FOR DELETE
              USING (auth.uid() = id);

            -- Criar índices
            CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
            CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
          END
          $$;
        `
      })

      if (createError) {
        console.error('Erro ao criar tabela:', createError)
        throw createError
      }

      // Verificar se a tabela foi criada e tem a estrutura correta
      const { error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
      .limit(1)

      if (checkError) {
        console.error('Erro ao verificar tabela:', checkError)
        throw checkError
      }

      console.log('Tabela profiles criada com sucesso!')
      return NextResponse.json({ 
        message: 'Tabelas criadas com sucesso!',
        status: 'success'
      })
    } catch (error) {
      const pgError = error as PostgrestError
      console.error('Erro durante a criação da tabela:', pgError)
      return NextResponse.json({ 
        error: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        status: 'error'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json({ 
      error: error.message,
      status: 'error'
    }, { status: 500 })
  }
} 