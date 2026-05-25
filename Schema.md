-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 300 AND price <= 2500),

  -- CHANGED: store ONLY file name / path inside bucket
  image_path TEXT DEFAULT '',

  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  rating NUMERIC(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),

  category TEXT NOT NULL CHECK (
    category IN ('Classic',
    'Fruit',
    'Nut',
    'Chocolate',
    'Cookies',
    'Cheesecake',
    'Sorbet',
    'Kids',
    'Mint',
    'Premium',
    'Specialty')
  ),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  customer_email TEXT NOT NULL,
  customer_name TEXT DEFAULT '',

  items JSONB NOT NULL,

  total INTEGER NOT NULL
    CHECK (total >= 0),

  status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (
      status IN (
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      )
    ),

  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system' CHECK (
    type IN ('order', 'stock', 'system')
  ),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (PERFORMANCE)
-- ============================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_rating ON products(rating);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES (SAFE + PRODUCTION READY)
-- ============================================

-- PRODUCTS (Public Read, Admin Full Access)
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products"
ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admin full access products"
ON products FOR ALL
USING (true)
WITH CHECK (true);

-- ORDERS (Users can insert, Admin full access)
DROP POLICY IF EXISTS "Insert orders" ON orders;
CREATE POLICY "Insert orders"
ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read orders" ON orders;
CREATE POLICY "Admin read orders"
ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update orders" ON orders;
CREATE POLICY "Admin update orders"
ON orders FOR UPDATE USING (true);

-- NOTIFICATIONS (Admin only)
DROP POLICY IF EXISTS "Admin full notifications" ON notifications;
CREATE POLICY "Admin full notifications"
ON notifications FOR ALL
USING (true)
WITH CHECK (true);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  rating numeric(3, 1)
    check (rating is null or (rating >= 0 and rating <= 5)),
  comment text,
  created_at timestamptz not null default now(),
  product_id bigint
);

comment on table public.reviews is 'Customer-written reviews; optional product_id for flavor link.';

create index if not exists reviews_created_at_idx
  on public.reviews (created_at desc);

create index if not exists reviews_product_id_idx
  on public.reviews (product_id);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select_public" on public.reviews;
drop policy if exists "reviews_insert_public" on public.reviews;

-- Read reviews in the app (anon key). Tighten in production if needed.
create policy "reviews_select_public"
  on public.reviews
  for select
  to anon, authenticated
  using (true);

-- Allow submitting reviews from the storefront or SQL; lock down in production.
create policy "reviews_insert_public"
  on public.reviews
  for insert
  to anon, authenticated
  with check (true);

-- Realtime: UI listens for changes on this table.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'reviews'
  ) then
    alter publication supabase_realtime add table public.reviews;
  end if;
end $$;
-- ============================================
-- SEQUENCE FIX (IMPORTANT)
-- ============================================
SELECT setval(
  pg_get_serial_sequence('products', 'id'),
  COALESCE((SELECT MAX(id) FROM products), 1)
);

-- ============================================
-- SAMPLE DATA
-- ============================================
INSERT INTO products
(name, description, price, rating, category, image_path, stock)
VALUES
('Vanilla Ice Cream','Classic vanilla ice cream with rich creamy texture',320,4.6,'Classic','1. Vanilla Ice Cream.png',35),

('Strawberry Ice Cream','Fresh strawberry ice cream with fruity sweetness',340,4.7,'Fruit','2. Strawberry Ice Cream.png',34),

('Butterscotch Ice Cream','Creamy butterscotch ice cream with caramel crunch',420,4.8,'Classic','3. Butterscotch Ice Cream.png',28),

('Pistachio Ice Cream','Premium pistachio ice cream with nutty richness',450,4.8,'Nut','4. Pistachio Ice Cream.png',26),

('Mango Ice Cream','Tropical mango ice cream with smooth creamy flavor',430,4.9,'Fruit','5. Mango Ice Cream.png',30),

('Oreo Ice Cream','Cookies and cream Oreo ice cream with crunchy texture',480,4.9,'Cookies','6. Oreo Ice Cream.png',29),

('Chocolate Chip Ice Cream','Creamy chocolate chip ice cream with cocoa chunks',410,4.7,'Chocolate','7. Chocolate Chip Ice Cream.png',30),

('Caramel Ice Cream','Rich caramel ice cream with buttery sweetness',440,4.8,'Classic','8. Caramel Ice Cream.png',27),

('Hazelnut Ice Cream','Hazelnut flavored ice cream with roasted nut taste',460,4.7,'Nut','9. Hazelnut Ice Cream.png',25),

('Coconut Ice Cream','Refreshing coconut ice cream with tropical flavor',390,4.6,'Fruit','10. Coconut Ice Cream.png',31),

('Rocky Road Ice Cream','Chocolate rocky road ice cream with marshmallow crunch',520,4.9,'Chocolate','11. Rocky Road Ice Cream.png',24),

('Blueberry Cheesecake Ice Cream','Blueberry cheesecake ice cream with creamy richness',540,4.8,'Cheesecake','12. Blueberry Cheesecake Ice Cream.png',24),

('Lemon Sorbet Ice Cream','Refreshing lemon sorbet ice cream with citrus zing',360,4.5,'Sorbet','13. Lemon Sorbet Ice Cream.png',28),

('Peach Melba Ice Cream','Peach melba ice cream with fruity dessert flavor',490,4.7,'Fruit','14. Peach Melba Ice Cream.png',24),

('Brownie Ice Cream','Chocolate brownie ice cream with fudge chunks',560,4.9,'Chocolate','15. Brownie Ice Cream.png',22),

('Mango Lassi Ice Cream','Mango lassi inspired creamy Pakistani dessert ice cream',500,4.8,'Specialty','16. Mango Lassi Ice Cream.png',25),

('Toffee Crunch Ice Cream','Toffee crunch ice cream with caramel bits',520,4.8,'Classic','17. Toffee Crunch Ice Cream.png',24),

('Neapolitan Ice Cream','Classic neapolitan ice cream with three flavors',480,4.7,'Classic','18. Neapolitan Ice Cream.png',27),

('Bubblegum Ice Cream','Sweet bubblegum flavored colorful ice cream',400,4.5,'Kids','19. Bubblegum Ice Cream.png',30),

('Mint Chip Ice Cream','Mint chip ice cream with refreshing chocolate pieces',470,4.7,'Mint','20. Mint Chip Ice Cream.png',25),

('Cookies & Cream Ice Cream','Cookies and cream ice cream with crunchy cookie texture',510,4.8,'Cookies','21. Cookies & Cream Ice Cream.png',24),

('Butter Pecan Ice Cream','Butter pecan ice cream with roasted pecan nuts',500,4.7,'Nut','22. Butter Pecan Ice Cream.png',24),

('Rainbow Gumball Ice Cream','Colorful rainbow gumball ice cream for fun desserts',490,4.6,'Kids','23. Rainbow Gumball Ice Cream.png',26),

('Bubble Tea Ice Cream','Bubble tea inspired creamy specialty ice cream',540,4.7,'Specialty','24. Bubble Tea Ice Cream.png',22),

('Black Licorice Ice Cream','Black licorice flavored premium ice cream',430,4.3,'Specialty','25. Black Licorice Ice Cream.png',20),

('Saffron Rose Ice Cream','Luxury saffron rose ice cream with floral aroma',620,4.9,'Premium','26. Saffron Rose Ice Cream.png',18),

('Guava Pineapple Ice Cream','Guava and pineapple mixed tropical fruit ice cream',460,4.7,'Fruit','27. Guava Pineapple Ice Cream.png',25);