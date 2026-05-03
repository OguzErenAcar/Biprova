-- Soft delete support for messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Allow senders to soft-delete their own messages
CREATE POLICY "Users can soft-delete own messages"
  ON messages FOR UPDATE
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());
