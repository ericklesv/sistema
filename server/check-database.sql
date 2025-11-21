-- Verificar dados atuais no PostgreSQL
-- Execute no Shell do Render

-- Ver miniaturas base
SELECT id, name, brand, "isPreOrder", "releaseDate" FROM miniatura_base ORDER BY id;

-- Ver pré-vendas
SELECT id, name, description FROM pre_sales ORDER BY id;

-- Ver garagem
SELECT id, name, description FROM garage ORDER BY id;
