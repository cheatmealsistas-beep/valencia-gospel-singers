'use client';

import { useState, useTransition, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Eye,
  EyeOff,
  Music,
  Loader2,
  Upload,
  X,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
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
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  toggleTeamMemberAction,
  deleteTeamMemberAction,
  uploadPhotoAction,
} from '@/features/admin/admin.actions';
import type { TeamMember, TeamMemberInput, PhotoPosition } from '@/features/admin/types';

interface TeamListProps {
  members: TeamMember[];
}

export function TeamList({ members }: TeamListProps) {
  const t = useTranslations('admin-equipo');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPosition, setPhotoPosition] = useState<PhotoPosition>('center');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('toast.invalidFileType'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('toast.fileTooLarge'));
      return;
    }

    setPhotoFile(file);
    // Generate preview
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('folder', 'team');

      const result = await uploadPhotoAction(formData);
      if (result.success && result.data) {
        return result.data.url;
      } else {
        toast.error(result.error || t('toast.uploadError'));
        return null;
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      // Upload photo first if selected
      let photoUrl: string | undefined;
      if (photoFile) {
        const url = await uploadPhoto();
        if (url) photoUrl = url;
        else return; // Upload failed
      }

      const input: TeamMemberInput = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        photo_url: photoUrl || undefined,
        photo_position: photoPosition,
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_active: formData.get('is_active') === 'on',
      };

      const result = await createTeamMemberAction(input);
      if (result.success) {
        toast.success(t('toast.created'));
        closeDialog();
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingMember) return;

    startTransition(async () => {
      // Upload new photo if selected
      let photoUrl: string | undefined;
      if (photoFile) {
        const url = await uploadPhoto();
        if (url) photoUrl = url;
        else return; // Upload failed
      }

      const input: Partial<TeamMemberInput> = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        photo_position: photoPosition,
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_active: formData.get('is_active') === 'on',
      };

      // Only update photo_url if a new photo was uploaded
      if (photoUrl) {
        input.photo_url = photoUrl;
      }

      const result = await updateTeamMemberAction(editingMember.id, input);
      if (result.success) {
        toast.success(t('toast.updated'));
        closeDialog();
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    startTransition(async () => {
      const result = await toggleTeamMemberAction(id, !currentActive);
      if (result.success) {
        toast.success(t('toast.toggled'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteTeamMemberAction(id);
      if (result.success) {
        toast.success(t('toast.deleted'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setPhotoPreview(member.photo_url);
    setPhotoFile(null);
    setPhotoPosition(member.photo_position || 'center');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingMember(null);
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhotoPosition('center');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setDialogOpen(false);
  };

  // Current photo to show: new preview > editing member's photo > nothing
  const currentPhoto = photoPreview || (editingMember?.photo_url ?? null);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-500">
              <Plus className="w-4 h-4 mr-2" />
              {t('add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? t('form.title.edit') : t('form.title.create')}
              </DialogTitle>
            </DialogHeader>
            <form action={editingMember ? handleUpdate : handleCreate} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('form.name.label')}</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={editingMember?.name || ''}
                  placeholder={t('form.name.placeholder')}
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">{t('form.role.label')}</Label>
                <Input
                  id="role"
                  name="role"
                  required
                  defaultValue={editingMember?.role || ''}
                  placeholder={t('form.role.placeholder')}
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>{t('form.photo.label')}</Label>
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/25">
                    {currentPhoto ? (
                      <div className="relative w-full h-full group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentPhoto}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: photoPosition }}
                        />
                        <button
                          type="button"
                          onClick={clearPhoto}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePhotoSelect}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t('form.photo.upload')}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {t('form.photo.hint')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Position - only show when there's a photo */}
              {currentPhoto && (
                <div className="space-y-2">
                  <Label>{t('form.photoPosition.label')}</Label>
                  <div className="flex gap-2">
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <Button
                        key={pos}
                        type="button"
                        size="sm"
                        variant={photoPosition === pos ? 'default' : 'outline'}
                        className={photoPosition === pos ? 'bg-purple-600 hover:bg-purple-500' : ''}
                        onClick={() => setPhotoPosition(pos)}
                      >
                        {t(`form.photoPosition.${pos}`)}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('form.photoPosition.hint')}
                  </p>
                </div>
              )}

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">{t('form.displayOrder.label')}</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  defaultValue={editingMember?.display_order || 0}
                  placeholder={t('form.displayOrder.placeholder')}
                  className="w-24"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_active">{t('form.isActive.label')}</Label>
                  <p className="text-xs text-muted-foreground">{t('form.isActive.description')}</p>
                </div>
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={editingMember?.is_active ?? true}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  {t('form.cancel')}
                </Button>
                <Button type="submit" disabled={isPending || isUploading}>
                  {(isPending || isUploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingMember ? t('form.submit.edit') : t('form.submit.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground">{t('empty.title')}</h3>
            <p className="text-muted-foreground/70">{t('empty.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card
              key={member.id}
              className={`hover:border-purple-500/50 transition-all ${
                !member.is_active ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-muted">
                    {member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: member.photo_position || 'center' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                      <Badge className={member.is_active ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30'}>
                        {member.is_active ? t('status.active') : t('status.inactive')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{t('card.order')}: {member.display_order}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(member)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    {t('actions.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggle(member.id, member.is_active)}
                    disabled={isPending}
                  >
                    {member.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10"
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
                          onClick={() => handleDelete(member.id)}
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
