'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import { Send, CheckCircle, Loader2, CalendarIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { submitContactFormAction } from '@/features/contact/contact.actions';

export function ContactForm() {
  const t = useTranslations('contacto.form');
  const tSuccess = useTranslations('contacto.success');
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitContactFormAction, null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      toast.success(tSuccess('title'));
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, tSuccess]);

  if (showSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon to-neon-secondary mb-6">
          <CheckCircle className="w-8 h-8 text-on-surface" />
        </div>
        <h3 className="text-2xl font-bold text-on-surface mb-2">{tSuccess('title')}</h3>
        <p className="text-on-surface-muted mb-6">{tSuccess('description')}</p>
        <Button
          variant="outline"
          onClick={() => setShowSuccess(false)}
          className="border-hairline hover:border-neon/50 hover:bg-neon/10"
        >
          {tSuccess('cta')}
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-on-surface-muted">
          {t('name.label')} <span className="text-neon-foreground">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          required
          placeholder={t('name.placeholder')}
          className="h-12 bg-surface-elevated border-hairline text-on-surface placeholder:text-on-surface-muted focus:border-neon/50 focus:ring-neon/20"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-on-surface-muted">
          {t('email.label')} <span className="text-neon-foreground">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t('email.placeholder')}
          className="h-12 bg-surface-elevated border-hairline text-on-surface placeholder:text-on-surface-muted focus:border-neon/50 focus:ring-neon/20"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-on-surface-muted">
          {t('phone.label')}
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder={t('phone.placeholder')}
          className="h-12 bg-surface-elevated border-hairline text-on-surface placeholder:text-on-surface-muted focus:border-neon/50 focus:ring-neon/20"
        />
      </div>

      {/* Event Type and Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Event Type */}
        <div className="space-y-2">
          <Label htmlFor="event_type" className="text-on-surface-muted">
            {t('eventType.label')}
          </Label>
          <Select name="event_type">
            <SelectTrigger className="h-12 bg-surface-elevated border-hairline text-on-surface focus:border-neon/50 focus:ring-neon/20 [&>span]:text-on-surface-muted">
              <SelectValue placeholder={t('eventType.placeholder')} />
            </SelectTrigger>
            <SelectContent className="bg-surface-elevated border-hairline">
              <SelectItem value="boda" className="text-on-neon hover:bg-neon/20 focus:bg-neon/20">{t('eventType.options.boda')}</SelectItem>
              <SelectItem value="corporativo" className="text-on-neon hover:bg-neon/20 focus:bg-neon/20">{t('eventType.options.corporativo')}</SelectItem>
              <SelectItem value="concierto" className="text-on-neon hover:bg-neon/20 focus:bg-neon/20">{t('eventType.options.concierto')}</SelectItem>
              <SelectItem value="privado" className="text-on-neon hover:bg-neon/20 focus:bg-neon/20">{t('eventType.options.privado')}</SelectItem>
              <SelectItem value="otro" className="text-on-neon hover:bg-neon/20 focus:bg-neon/20">{t('eventType.options.otro')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <Label htmlFor="event_date" className="text-on-surface-muted">
            {t('eventDate.label')}
          </Label>
          <input type="hidden" name="event_date" value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} />
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-start text-left font-normal bg-surface-elevated border-hairline text-on-surface hover:bg-surface-elevated hover:text-on-surface focus:border-neon/50 focus:ring-neon/20"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-on-surface-muted" />
                {selectedDate ? (
                  format(selectedDate, 'PPP', { locale: locale === 'es' ? es : enUS })
                ) : (
                  <span className="text-on-surface-muted">{t('eventDate.placeholder')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-surface-elevated border-hairline"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                locale={locale === 'es' ? es : enUS}
                className="rounded-md text-on-neon [&_.rdp-day]:text-on-neon [&_.rdp-day_button]:text-on-neon [&_.rdp-head_cell]:text-on-neon/60 [&_.rdp-caption]:text-on-neon [&_.rdp-nav_button]:text-on-neon [&_.rdp-nav_button:hover]:bg-neon/20 [&_.rdp-day_button:hover]:bg-neon/20 [&_.rdp-day_button[aria-selected=true]]:bg-neon [&_.rdp-day_button[aria-selected=true]]:text-on-neon"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-on-surface/80">
          {t('message.label')} <span className="text-neon-foreground">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t('message.placeholder')}
          className="bg-on-surface/5 border-hairline text-on-surface placeholder:text-on-surface-muted focus:border-neon/50 focus:ring-neon/20 resize-none min-h-[120px]"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="w-full bg-gradient-to-r from-neon to-neon-secondary hover:from-neon hover:to-neon-secondary text-on-neon font-semibold shadow-lg shadow-[0_10px_40px_-10px_hsl(var(--glow)/0.4)]"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t('submit')}
          </>
        )}
      </Button>
    </form>
  );
}
