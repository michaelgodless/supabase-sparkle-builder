-- Create featured properties table for homepage showcase
CREATE TABLE IF NOT EXISTS public.featured_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL CHECK (display_order >= 1 AND display_order <= 5),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek') NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek') NOT NULL,
  UNIQUE(property_id),
  UNIQUE(display_order)
);

-- Enable RLS
ALTER TABLE public.featured_properties ENABLE ROW LEVEL SECURITY;

-- Anyone can view featured properties
CREATE POLICY "Anyone can view featured properties"
ON public.featured_properties
FOR SELECT
USING (true);

-- Only super admins can manage featured properties
CREATE POLICY "Super admins can manage featured properties"
ON public.featured_properties
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_featured_properties_updated_at
BEFORE UPDATE ON public.featured_properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();