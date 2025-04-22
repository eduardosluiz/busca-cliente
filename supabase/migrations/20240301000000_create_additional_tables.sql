-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.email_settings;
DROP TABLE IF EXISTS public.chat_settings;
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.searches;

-- Create email_settings table
CREATE TABLE public.email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    smtp_host TEXT NOT NULL,
    smtp_port INTEGER NOT NULL,
    smtp_user TEXT NOT NULL,
    smtp_password TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create chat_settings table
CREATE TABLE public.chat_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    whatsapp_token TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    auto_reply_enabled BOOLEAN DEFAULT false,
    auto_reply_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL,
    status TEXT NOT NULL,
    searches_limit INTEGER NOT NULL,
    contacts_limit INTEGER NOT NULL,
    emails_limit INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create searches table
CREATE TABLE public.searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    query TEXT NOT NULL,
    location TEXT NOT NULL,
    results_count INTEGER NOT NULL,
    saved_contacts_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;

-- Create policies for email_settings
CREATE POLICY "Users can view their own email settings"
    ON public.email_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email settings"
    ON public.email_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email settings"
    ON public.email_settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email settings"
    ON public.email_settings FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for chat_settings
CREATE POLICY "Users can view their own chat settings"
    ON public.chat_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat settings"
    ON public.chat_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat settings"
    ON public.chat_settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat settings"
    ON public.chat_settings FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscription"
    ON public.subscriptions FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for searches
CREATE POLICY "Users can view their own searches"
    ON public.searches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own searches"
    ON public.searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own searches"
    ON public.searches FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own searches"
    ON public.searches FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_email_settings_user_id ON public.email_settings(user_id);
CREATE INDEX idx_chat_settings_user_id ON public.chat_settings(user_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_created_at ON public.searches(created_at);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for email_settings
CREATE TRIGGER handle_email_settings_updated_at
    BEFORE UPDATE ON public.email_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create triggers for chat_settings
CREATE TRIGGER handle_chat_settings_updated_at
    BEFORE UPDATE ON public.chat_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create triggers for subscriptions
CREATE TRIGGER handle_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create triggers for searches
CREATE TRIGGER handle_searches_updated_at
    BEFORE UPDATE ON public.searches
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 