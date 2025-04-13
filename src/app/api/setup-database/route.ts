import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        db: {
          schema: 'public'
        }
      }
    )

    // Criar tabela de perfis
    const { error: createProfilesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS profiles (
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

        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        DO $$
        BEGIN
          DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
          DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
          DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
          DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
          
          CREATE POLICY "Users can view their own profile"
            ON profiles FOR SELECT
            USING (auth.uid() = id);

          CREATE POLICY "Users can insert their own profile"
            ON profiles FOR INSERT
            WITH CHECK (auth.uid() = id);

          CREATE POLICY "Users can update their own profile"
            ON profiles FOR UPDATE
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);

          CREATE POLICY "Users can delete their own profile"
            ON profiles FOR DELETE
            USING (auth.uid() = id);
        END
        $$;

        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
      `
    })

    if (createProfilesError) {
      console.error('Erro ao criar tabela de perfis:', createProfilesError)
      return NextResponse.json({ error: createProfilesError.message }, { status: 500 })
    }

    // Criar tabela de contatos
    const { error: contactsError } = await supabase
      .from('contacts')
      .select()
      .limit(1)

    if (contactsError?.code === '42P01') {
      const { error: createContactsError } = await supabase
        .from('contacts')
        .select()
        .then(async () => {
          return await supabase.rpc('exec_sql', {
            sql_query: `
              CREATE TABLE IF NOT EXISTS contacts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
                company_name TEXT NOT NULL,
                fantasy_name TEXT,
                category TEXT NOT NULL,
                address JSONB NOT NULL,
                phone TEXT,
                email TEXT,
                website TEXT,
                status TEXT NOT NULL DEFAULT 'novo',
                cnpj TEXT,
                size TEXT,
                legal_nature TEXT,
                open_date TEXT,
                description TEXT,
                last_update_date TIMESTAMPTZ,
                created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
                UNIQUE(company_name, user_id)
              );

              ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

              CREATE POLICY "Users can view their own contacts"
                ON contacts FOR SELECT
                USING (auth.uid() = user_id);

              CREATE POLICY "Users can insert their own contacts"
                ON contacts FOR INSERT
                WITH CHECK (auth.uid() = user_id);

              CREATE POLICY "Users can update their own contacts"
                ON contacts FOR UPDATE
                USING (auth.uid() = user_id)
                WITH CHECK (auth.uid() = user_id);

              CREATE POLICY "Users can delete their own contacts"
                ON contacts FOR DELETE
                USING (auth.uid() = user_id);
            `
          })
        })

      if (createContactsError) {
        console.error('Erro ao criar tabela de contatos:', createContactsError)
        return NextResponse.json({ error: createContactsError.message }, { status: 500 })
      }
    }

    // Criar tabela de histórico
    const { error: historyError } = await supabase
      .from('contact_history')
      .select()
      .limit(1)

    if (historyError?.code === '42P01') {
      const { error: createHistoryError } = await supabase
        .from('contact_history')
        .select()
        .then(async () => {
          return await supabase.rpc('exec_sql', {
            sql_query: `
              CREATE TABLE IF NOT EXISTS contact_history (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
                change_type TEXT NOT NULL,
                old_data JSONB,
                new_data JSONB,
                created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
              );

              ALTER TABLE contact_history ENABLE ROW LEVEL SECURITY;

              CREATE POLICY "Users can view their own contact history"
                ON contact_history FOR SELECT
                USING (auth.uid() = user_id);

              CREATE POLICY "Users can insert their own contact history"
                ON contact_history FOR INSERT
                WITH CHECK (auth.uid() = user_id);
            `
          })
        })

      if (createHistoryError) {
        console.error('Erro ao criar tabela de histórico:', createHistoryError)
        return NextResponse.json({ error: createHistoryError.message }, { status: 500 })
      }
    }

    // Criar triggers
    const { error: createTriggersError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION handle_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        DROP TRIGGER IF EXISTS handle_contacts_updated_at ON contacts;
        CREATE TRIGGER handle_contacts_updated_at
          BEFORE UPDATE ON contacts
          FOR EACH ROW
          EXECUTE FUNCTION handle_updated_at();

        CREATE OR REPLACE FUNCTION handle_contact_history()
        RETURNS TRIGGER AS $$
        BEGIN
          IF (TG_OP = 'INSERT') THEN
            INSERT INTO contact_history (
              contact_id,
              user_id,
              change_type,
              new_data
            ) VALUES (
              NEW.id,
              NEW.user_id,
              'insert',
              row_to_json(NEW)
            );
          ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO contact_history (
              contact_id,
              user_id,
              change_type,
              old_data,
              new_data
            ) VALUES (
              NEW.id,
              NEW.user_id,
              'update',
              row_to_json(OLD),
              row_to_json(NEW)
            );
          ELSIF (TG_OP = 'DELETE') THEN
            INSERT INTO contact_history (
              contact_id,
              user_id,
              change_type,
              old_data
            ) VALUES (
              OLD.id,
              OLD.user_id,
              'delete',
              row_to_json(OLD)
            );
          END IF;
          RETURN COALESCE(NEW, OLD);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        DROP TRIGGER IF EXISTS handle_contacts_history ON contacts;
        CREATE TRIGGER handle_contacts_history
          AFTER INSERT OR UPDATE OR DELETE ON contacts
          FOR EACH ROW
          EXECUTE FUNCTION handle_contact_history();
      `
    })

    if (createTriggersError) {
      console.error('Erro ao criar triggers:', createTriggersError)
      return NextResponse.json({ error: createTriggersError.message }, { status: 500 })
    }

    // Criar índices
    const { error: createIndexesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
        CREATE INDEX IF NOT EXISTS idx_contacts_company_name ON contacts(company_name);
        CREATE INDEX IF NOT EXISTS idx_contacts_category ON contacts(category);
        CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
        CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
        CREATE INDEX IF NOT EXISTS idx_contact_history_contact_id ON contact_history(contact_id);
        CREATE INDEX IF NOT EXISTS idx_contact_history_user_id ON contact_history(user_id);
        CREATE INDEX IF NOT EXISTS idx_contact_history_created_at ON contact_history(created_at);
      `
    })

    if (createIndexesError) {
      console.error('Erro ao criar índices:', createIndexesError)
      return NextResponse.json({ error: createIndexesError.message }, { status: 500 })
    }

    console.log('Tabelas criadas com sucesso!')
    return NextResponse.json({ message: 'Tabelas criadas com sucesso!' })
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 