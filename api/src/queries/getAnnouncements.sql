SELECT *, COUNT(*) OVER() as total_count FROM announcements
WHERE (COALESCE($3::BOOLEAN, false) = false OR interval IS NOT NULL OR NOT sent)
  AND (COALESCE($4::BOOLEAN, false) = false OR (NOT sent AND (time IS NULL OR time <= NOW())))
  AND (COALESCE($5::TEXT, '') = '' OR title ILIKE '%' || $5 || '%' OR description ILIKE '%' || $5 || '%')
ORDER BY id DESC
LIMIT $2::INT
OFFSET ($1::INT * $2::INT);
