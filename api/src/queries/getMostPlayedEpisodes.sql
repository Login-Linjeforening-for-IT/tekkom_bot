SELECT e.name AS "name",
    ar.name AS show,
    e.listens,
    e."image",
    e.id
FROM episodes e
    JOIN artists ar ON e.show = ar.id
ORDER BY e.listens DESC
LIMIT 5;