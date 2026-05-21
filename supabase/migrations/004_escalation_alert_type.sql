-- ============================================================
-- UPDATE ALERTS TABLE CHECK CONSTRAINT
-- ============================================================

ALTER TABLE alerts DROP CONSTRAINT IF EXISTS alerts_type_check;
ALTER TABLE alerts ADD CONSTRAINT alerts_type_check 
  CHECK (type IN ('score_spike','crisis_keyword','consecutive_bad_days','missed_session','counsellor_escalation'));
