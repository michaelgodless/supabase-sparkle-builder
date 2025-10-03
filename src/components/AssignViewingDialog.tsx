import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from 'lucide-react';

interface AssignViewingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyNumber: number;
}

export default function AssignViewingDialog({ 
  open, 
  onOpenChange, 
  propertyId, 
  propertyNumber 
}: AssignViewingDialogProps) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [minDateTime, setMinDateTime] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Set minimum datetime to 1 hour from now
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    // Format to YYYY-MM-DDTHH:MM for datetime-local input
    const formatted = now.toISOString().slice(0, 16);
    setMinDateTime(formatted);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
      });
      return;
    }

    if (!scheduledAt) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Укажите дату и время показа',
      });
      return;
    }

    setLoading(true);

    try {
      // Convert local datetime to ISO string with timezone
      const scheduledDate = new Date(scheduledAt);
      const scheduledISOString = scheduledDate.toISOString();

      const { error } = await supabase
        .from('viewings')
        .insert({
          property_id: propertyId,
          assigned_by: user.id,
          scheduled_at: scheduledISOString,
          notes: notes || null,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Показ назначен',
      });

      setScheduledAt('');
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating viewing:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось назначить показ',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Назначить показ
          </DialogTitle>
          <DialogDescription>
            Объект #{propertyNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scheduled_at">Дата и время показа *</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={minDateTime}
              required
            />
            <p className="text-xs text-muted-foreground">
              Показ должен быть назначен минимум на 1 час вперед
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Примечания</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительная информация о показе..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Назначение...' : 'Назначить показ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
