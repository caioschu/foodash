/*
  # Create sales and payment tables

  1. New Tables
    - `sales_entries`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key)
      - `date` (date)
      - `channel` (text)
      - `revenue` (numeric)
      - `orders` (integer)
      - `rating` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payment_entries`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key)
      - `date` (date)
      - `payment_type` (text)
      - `amount` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
    - Ensure users can only access their own data
*/

-- Create sales_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sales_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL REFERENCES public.restaurant_profiles(id),
    date date NOT NULL,
    channel text NOT NULL,
    revenue numeric(10,2) NOT NULL,
    orders integer NOT NULL,
    rating numeric(3,1),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS for sales_entries
ALTER TABLE public.sales_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_entries with safety checks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sales_entries' 
        AND policyname = 'Users can view own sales entries'
    ) THEN
        CREATE POLICY "Users can view own sales entries"
            ON public.sales_entries
            FOR SELECT
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = sales_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sales_entries' 
        AND policyname = 'Users can insert own sales entries'
    ) THEN
        CREATE POLICY "Users can insert own sales entries"
            ON public.sales_entries
            FOR INSERT
            TO public
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = sales_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sales_entries' 
        AND policyname = 'Users can update own sales entries'
    ) THEN
        CREATE POLICY "Users can update own sales entries"
            ON public.sales_entries
            FOR UPDATE
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = sales_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sales_entries' 
        AND policyname = 'Users can delete own sales entries'
    ) THEN
        CREATE POLICY "Users can delete own sales entries"
            ON public.sales_entries
            FOR DELETE
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = sales_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;
END
$$;

-- Create trigger for updating updated_at if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_sales_entries_updated_at'
    ) THEN
        CREATE TRIGGER update_sales_entries_updated_at
            BEFORE UPDATE ON public.sales_entries
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Create payment_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payment_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL REFERENCES public.restaurant_profiles(id),
    date date NOT NULL,
    payment_type text NOT NULL,
    amount numeric(10,2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS for payment_entries
ALTER TABLE public.payment_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_entries with safety checks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payment_entries' 
        AND policyname = 'Users can view own payment entries'
    ) THEN
        CREATE POLICY "Users can view own payment entries"
            ON public.payment_entries
            FOR SELECT
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = payment_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payment_entries' 
        AND policyname = 'Users can insert own payment entries'
    ) THEN
        CREATE POLICY "Users can insert own payment entries"
            ON public.payment_entries
            FOR INSERT
            TO public
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = payment_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payment_entries' 
        AND policyname = 'Users can update own payment entries'
    ) THEN
        CREATE POLICY "Users can update own payment entries"
            ON public.payment_entries
            FOR UPDATE
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = payment_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payment_entries' 
        AND policyname = 'Users can delete own payment entries'
    ) THEN
        CREATE POLICY "Users can delete own payment entries"
            ON public.payment_entries
            FOR DELETE
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM restaurant_profiles
                    WHERE restaurant_profiles.id = payment_entries.restaurant_id
                    AND restaurant_profiles.user_id = auth.uid()
                )
            );
    END IF;
END
$$;

-- Create trigger for updating updated_at if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_payment_entries_updated_at'
    ) THEN
        CREATE TRIGGER update_payment_entries_updated_at
            BEFORE UPDATE ON public.payment_entries
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;