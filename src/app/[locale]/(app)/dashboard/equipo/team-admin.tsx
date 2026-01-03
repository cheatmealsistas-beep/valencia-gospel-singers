'use client';

import { useState, useTransition, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Linkedin,
  Search,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from '@/shared/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { TeamMember, TeamMemberInput } from '@/features/admin/types';
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  toggleTeamMemberAction,
  deleteTeamMemberAction,
} from '@/features/admin/admin.actions';

interface TeamAdminProps {
  initialTeamMembers: TeamMember[];
}

export function TeamAdmin({ initialTeamMembers }: TeamAdminProps) {
  const t = useTranslations('dashboard-equipo');
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<TeamMemberInput>({
    name: '',
    role: '',
    company: '',
    linkedin_url: '',
    photo_url: '',
    display_order: 0,
    is_active: true,
  });

  // Filter team members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      // Status filter
      if (filter === 'active' && !m.is_active) return false;
      if (filter === 'inactive' && m.is_active) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesCompany = m.company?.toLowerCase().includes(query);
        const matchesRole = m.role.toLowerCase().includes(query);
        if (!matchesName && !matchesCompany && !matchesRole) {
          return false;
        }
      }

      return true;
    });
  }, [teamMembers, filter, searchQuery]);

  const handleOpenForm = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        company: member.company || '',
        linkedin_url: member.linkedin_url || '',
        photo_url: member.photo_url || '',
        display_order: member.display_order,
        is_active: member.is_active,
      });
    } else {
      setEditingMember(null);
      // Get next order number
      const maxOrder = Math.max(...teamMembers.map((m) => m.display_order), 0);
      setFormData({
        name: '',
        role: '',
        company: '',
        linkedin_url: '',
        photo_url: '',
        display_order: maxOrder + 1,
        is_active: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editingMember) {
          const result = await updateTeamMemberAction(editingMember.id, formData);
          if (result.success) {
            setTeamMembers((prev) =>
              prev.map((m) =>
                m.id === editingMember.id ? { ...m, ...formData } : m
              ).sort((a, b) => a.display_order - b.display_order)
            );
            toast.success(t('messages.updated'));
            handleCloseForm();
          } else {
            toast.error(result.error || t('messages.error'));
          }
        } else {
          const result = await createTeamMemberAction(formData);
          if (result.success && result.data) {
            setTeamMembers((prev) =>
              [...prev, {
                ...formData,
                id: result.data.id,
                company: formData.company || null,
                linkedin_url: formData.linkedin_url || null,
                photo_url: formData.photo_url || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }].sort((a, b) => a.display_order - b.display_order)
            );
            toast.success(t('messages.created'));
            handleCloseForm();
          } else {
            toast.error(result.error || t('messages.error'));
          }
        }
      } catch {
        toast.error(t('messages.error'));
      }
    });
  };

  const handleToggleActive = (member: TeamMember) => {
    startTransition(async () => {
      const newActive = !member.is_active;
      const result = await toggleTeamMemberAction(member.id, newActive);
      if (result.success) {
        setTeamMembers((prev) =>
          prev.map((m) =>
            m.id === member.id ? { ...m, is_active: newActive } : m
          )
        );
        toast.success(newActive ? t('messages.activated') : t('messages.deactivated'));
      } else {
        toast.error(result.error || t('messages.error'));
      }
    });
  };

  const handleDelete = () => {
    if (!deletingMember) return;

    startTransition(async () => {
      const result = await deleteTeamMemberAction(deletingMember.id);
      if (result.success) {
        setTeamMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
        toast.success(t('messages.deleted'));
        setIsDeleteDialogOpen(false);
        setDeletingMember(null);
      } else {
        toast.error(result.error || t('messages.error'));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addNew')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">{t('filters.all')}</TabsTrigger>
            <TabsTrigger value="active">{t('filters.active')}</TabsTrigger>
            <TabsTrigger value="inactive">{t('filters.inactive')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <p className="text-lg font-medium">{t('empty.title')}</p>
          <p className="text-muted-foreground">{t('empty.description')}</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">{t('table.order')}</TableHead>
                <TableHead className="w-16">{t('table.photo')}</TableHead>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.role')}</TableHead>
                <TableHead>{t('table.company')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center text-muted-foreground">
                      <GripVertical className="h-4 w-4 mr-1" />
                      {member.display_order}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {member.photo_url ? (
                        <Image
                          src={member.photo_url}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {member.name}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.role}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.company || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={member.is_active}
                        onCheckedChange={() => handleToggleActive(member)}
                        disabled={isPending}
                      />
                      <span className={member.is_active ? 'text-green-600' : 'text-muted-foreground'}>
                        {member.is_active ? t('status.active') : t('status.inactive')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(member)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeletingMember(member);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? t('form.title.edit') : t('form.title.create')}
            </DialogTitle>
            <DialogDescription>
              {editingMember ? editingMember.name : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name.label')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('form.name.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t('form.role.label')}</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder={t('form.role.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t('form.company.label')}</Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder={t('form.company.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo_url">{t('form.photoUrl.label')}</Label>
              <Input
                id="photo_url"
                value={formData.photo_url || ''}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder={t('form.photoUrl.placeholder')}
              />
              <p className="text-xs text-muted-foreground">{t('form.photoUrl.help')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">{t('form.linkedinUrl.label')}</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder={t('form.linkedinUrl.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">{t('form.displayOrder.label')}</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">{t('form.displayOrder.help')}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                {t('form.isActive.label')}
                <span className="block text-xs text-muted-foreground">
                  {t('form.isActive.description')}
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseForm}>
              {t('form.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? t('form.saving') : t('form.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDelete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('confirmDelete.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {t('confirmDelete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
