-- Adiciona o campo connection_status na tabela chat_settings
ALTER TABLE public.chat_settings
ADD COLUMN IF NOT EXISTS connection_status JSONB;

-- Atualiza os registros existentes para ter um status padrão
UPDATE public.chat_settings
SET connection_status = jsonb_build_object(
  'status', 'disconnected',
  'lastConnection', NULL,
  'error', NULL,
  'qrCode', NULL
)
WHERE connection_status IS NULL; 