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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{tSuccess('title')}</h3>
        <p className="text-white/60 mb-6">{tSuccess('description')}</p>
        <Button
          variant="outline"
          onClick={() => setShowSuccess(false)}
          className="border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10"
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
        <Label htmlFor="name" className="text-white/80">
          {t('name.label')} <span className="text-purple-400">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          required
          placeholder={t('name.placeholder')}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80">
          {t('email.label')} <span className="text-purple-400">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t('email.placeholder')}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white/80">
          {t('phone.label')}
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder={t('phone.placeholder')}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      {/* Event Type and Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Event Type */}
        <div className="space-y-2">
          <Label htmlFor="event_type" className="text-white/80">
            {t('eventType.label')}
          </Label>
          <Select name="event_type">
            <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20 [&>span]:text-white/50">
              <SelectValue placeholder={t('eventType.placeholder')} />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10">
              <SelectItem value="boda" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">{t('eventType.options.boda')}</SelectItem>
              <SelectItem value="corporativo" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">{t('eventType.options.corporativo')}</SelectItem>
              <SelectItem value="concierto" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">{t('eventType.options.concierto')}</SelectItem>
              <SelectItem value="privado" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">{t('eventType.options.privado')}</SelectItem>
              <SelectItem value="otro" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">{t('eventType.options.otro')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <Label htmlFor="event_date" className="text-white/80">
            {t('eventDate.label')}
          </Label>
          <input type="hidden" name="event_date" value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} />
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white focus:border-purple-500/50 focus:ring-purple-500/20"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-white/50" />
                {selectedDate ? (
                  format(selectedDate, 'PPP', { locale: locale === 'es' ? es : enUS })
                ) : (
                  <span className="text-white/50">{t('eventDate.placeholder')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-[#1a1a1a] border-white/10"
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
                className="rounded-md text-white [&_.rdp-day]:text-white [&_.rdp-day_button]:text-white [&_.rdp-head_cell]:text-white/60 [&_.rdp-caption]:text-white [&_.rdp-nav_button]:text-white [&_.rdp-nav_button:hover]:bg-purple-500/20 [&_.rdp-day_button:hover]:bg-purple-500/20 [&_.rdp-day_button[aria-selected=true]]:bg-purple-600 [&_.rdp-day_button[aria-selected=true]]:text-white"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-white/80">
          {t('message.label')} <span className="text-purple-400">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t('message.placeholder')}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 resize-none min-h-[120px]"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-purple-600/25"
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
