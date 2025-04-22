-- Drop existing table if it exists
DROP TABLE IF EXISTS public.chat_settings;

-- Create chat_settings table
CREATE TABLE public.chat_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    whatsapp_number TEXT,
    whatsapp_token TEXT,
    auto_reply_enabled BOOLEAN DEFAULT false,
    auto_reply_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Create indexes
CREATE INDEX idx_chat_settings_user_id ON public.chat_settings(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chat_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own chat settings" 
    ON public.chat_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own chat settings" 
    ON public.chat_settings FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat settings" 
    ON public.chat_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_chat_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_chat_settings_updated_at
    BEFORE UPDATE ON public.chat_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_chat_settings_updated_at(); 