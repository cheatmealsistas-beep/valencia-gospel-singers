'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Check,
  Reply,
  Archive,
  Trash2,
  ExternalLink,
  Clock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  markAsReadAction,
  markAsRepliedAction,
  archiveContactAction,
  updateNotesAction,
  deleteContactAction,
} from '@/features/contact/contact.actions';
import type { ContactRequest } from '@/features/contact/types';

interface MessageListProps {
  messages: ContactRequest[];
}

type FilterStatus = 'all' | ContactRequest['status'];

export function MessageList({ messages }: MessageListProps) {
  const t = useTranslations('admin-mensajes');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const filteredMessages = filter === 'all'
    ? messages
    : messages.filter((m) => m.status === filter);

  const handleStatusChange = async (id: string, action: () => Promise<{ success: boolean; error: string | null }>) => {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast.success(t('toast.statusUpdated'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleSaveNotes = async (id: string) => {
    const noteContent = notes[id] || '';
    startTransition(async () => {
      const result = await updateNotesAction(id, noteContent);
      if (result.success) {
        toast.success(t('toast.notesSaved'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteContactAction(id);
      if (result.success) {
        toast.success(t('toast.deleted'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const getStatusBadge = (status: ContactRequest['status']) => {
    const variants: Record<string, string> = {
      pending: 'bg-neon/20 text-neon-foreground border-neon/30',
      read: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
      replied: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      archived: 'bg-gray-500/20 text-gray-600 dark:text-on-surface-muted border-gray-500/30',
    };
    return (
      <Badge className={`${variants[status]} border`}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = messages.filter((m) => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
        <TabsList>
          <TabsTrigger value="all">
            {t('filters.all')} ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('filters.pending')} {pendingCount > 0 && `(${pendingCount})`}
          </TabsTrigger>
          <TabsTrigger value="read">
            {t('filters.read')}
          </TabsTrigger>
          <TabsTrigger value="replied">
            {t('filters.replied')}
          </TabsTrigger>
          <TabsTrigger value="archived">
            {t('filters.archived')}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Message List */}
      {filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground">{t('empty.title')}</h3>
            <p className="text-muted-foreground/70">{t('empty.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`hover:border-neon/50 transition-all ${
                message.status === 'pending' ? 'border-l-4 border-l-neon' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">{message.name || 'Sin nombre'}</h3>
                      {getStatusBadge(message.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <a href={`mailto:${message.email}`} className="flex items-center gap-1 hover:text-neon-foreground transition-colors">
                        <Mail className="w-4 h-4" />
                        {message.email || 'Sin email'}
                      </a>
                      {message.phone && (
                        <a href={`tel:${message.phone}`} className="flex items-center gap-1 hover:text-neon-foreground transition-colors">
                          <Phone className="w-4 h-4" />
                          {message.phone}
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Info */}
                {(message.event_type || message.event_date) && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    {message.event_type && (
                      <span className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-neon-foreground" />
                        <span className="text-muted-foreground">{t('card.eventType')}:</span>
                        {t(`eventTypes.${message.event_type}`)}
                      </span>
                    )}
                    {message.event_date && (
                      <span className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-neon-foreground" />
                        <span className="text-muted-foreground">{t('card.eventDate')}:</span>
                        {new Date(message.event_date).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('card.message')}:</p>
                  <p className="whitespace-pre-wrap">{message.message || 'Sin mensaje'}</p>
                </div>

                {/* Notes (expandable) */}
                {expandedId === message.id && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">{t('card.notes')}:</p>
                    <Textarea
                      value={notes[message.id] ?? message.notes ?? ''}
                      onChange={(e) => setNotes({ ...notes, [message.id]: e.target.value })}
                      placeholder={t('card.notesPlaceholder')}
                      className="mb-2"
                      rows={3}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveNotes(message.id)}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                      {t('actions.saveNotes')}
                    </Button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {message.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(message.id, () => markAsReadAction(message.id))}
                      disabled={isPending}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {t('actions.markRead')}
                    </Button>
                  )}
                  {(message.status === 'pending' || message.status === 'read') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(message.id, () => markAsRepliedAction(message.id))}
                      disabled={isPending}
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      {t('actions.markReplied')}
                    </Button>
                  )}
                  {message.status !== 'archived' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(message.id, () => archiveContactAction(message.id))}
                      disabled={isPending}
                    >
                      <Archive className="w-4 h-4 mr-1" />
                      {t('actions.archive')}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {t('card.notes')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={`mailto:${message.email}?subject=Re: Mediterránea Gospel Singers - Tu consulta`}>
                      <Mail className="w-4 h-4 mr-1" />
                      {t('actions.reply')}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                  {message.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/10"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${message.phone.replace(/\D/g, '')}?text=Hola ${message.name}, gracias por contactar con Mediterránea Gospel Singers.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        {t('actions.whatsapp')}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('confirmDelete.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('confirmDelete.description')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t('confirmDelete.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(message.id)}
                          className="bg-red-600 hover:bg-red-500 text-white"
                        >
                          {t('confirmDelete.confirm')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
