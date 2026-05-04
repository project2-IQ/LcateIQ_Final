-- تشغيله مرة واحدة إذا كانت قاعدة locateiq موجودة بدون سجل الأدمن
-- (أو نفّذ محتوى الإدراج من schema.sql)

USE locateiq;

INSERT INTO users (name, email, password, language)
SELECT 'Admin', 'admin@locateiq.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'ar'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@locateiq.com' LIMIT 1);
