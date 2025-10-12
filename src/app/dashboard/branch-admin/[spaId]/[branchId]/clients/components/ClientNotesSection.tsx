'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Switch } from '@/components/ui/Switch';
import {
  createClientNoteSchema,
  type CreateClientNoteFormData,
} from '@/types/forms';
import type { ClientNoteWithCreator } from '@/types/clients';
import {
  fetchClientNotes,
  createClientNote,
  updateClientNote,
  deleteClientNote,
} from '../actions';

interface ClientNotesSectionProps {
  clientId: string;
  spaId: string;
  branchId: string;
  currentUserId: string;
}

export function ClientNotesSection({
  clientId,
  spaId,
  branchId,
  currentUserId,
}: ClientNotesSectionProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<ClientNoteWithCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] =
    useState<ClientNoteWithCreator | null>(null);

  const form = useForm<CreateClientNoteFormData>({
    resolver: zodResolver(createClientNoteSchema),
    defaultValues: {
      content: '',
      isImportant: false,
    },
  });

  const editForm = useForm<CreateClientNoteFormData>({
    resolver: zodResolver(createClientNoteSchema),
    defaultValues: {
      content: '',
      isImportant: false,
    },
  });

  // Load notes
  useEffect(() => {
    loadNotes();
  }, [clientId]);

  const loadNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchClientNotes(clientId);
      if (result.success && result.data) {
        setNotes(result.data);
      } else {
        setError(result.error || 'Error al cargar las notas');
      }
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Error inesperado al cargar las notas');
    } finally {
      setIsLoading(false);
    }
  };

  // Create note
  const onSubmit = async (data: CreateClientNoteFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createClientNote(clientId, spaId, branchId, data);

      if (result.success) {
        form.reset();
        loadNotes();
        router.refresh();
      } else {
        setError(result.error || 'Error al crear la nota');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit note
  const handleEditNote = (note: ClientNoteWithCreator) => {
    setEditingNoteId(note.id);
    editForm.reset({
      content: note.content,
      isImportant: note.isImportant,
    });
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    editForm.reset();
  };

  const handleUpdateNote = async (noteId: string) => {
    const data = editForm.getValues();

    try {
      const result = await updateClientNote(noteId, spaId, branchId, data);

      if (result.success) {
        setEditingNoteId(null);
        loadNotes();
        router.refresh();
      } else {
        setError(result.error || 'Error al actualizar la nota');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  // Delete note
  const handleDeleteClick = (note: ClientNoteWithCreator) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      const result = await deleteClientNote(noteToDelete.id, spaId, branchId);

      if (result.success) {
        setDeleteDialogOpen(false);
        setNoteToDelete(null);
        loadNotes();
        router.refresh();
      } else {
        setError(result.error || 'Error al eliminar la nota');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      locale: es,
      addSuffix: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Create note form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Agregar Nueva Nota</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="content">Contenido de la Nota</Label>
              <Textarea
                id="content"
                {...form.register('content')}
                placeholder="Escribe una nota sobre este cliente (alergias, preferencias, etc.)..."
                rows={3}
                error={form.formState.errors.content?.message}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="isImportant"
                checked={form.watch('isImportant')}
                onCheckedChange={checked =>
                  form.setValue('isImportant', checked)
                }
              />
              <Label htmlFor="isImportant" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>Marcar como importante</span>
                </div>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Nota'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notes list */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Notas del Cliente ({notes.length})
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay notas
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Aún no se han agregado notas para este cliente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <Card
                key={note.id}
                className={note.isImportant ? 'border-orange-500 border-2' : ''}
              >
                <CardContent className="p-6">
                  {editingNoteId === note.id ? (
                    /* Edit mode */
                    <form className="space-y-4">
                      <Textarea
                        {...editForm.register('content')}
                        rows={3}
                        error={editForm.formState.errors.content?.message}
                      />

                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={editForm.watch('isImportant')}
                          onCheckedChange={checked =>
                            editForm.setValue('isImportant', checked)
                          }
                        />
                        <Label className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span>Marcar como importante</span>
                          </div>
                        </Label>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                        >
                          Guardar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    /* View mode */
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {note.creator.name || note.creator.email}
                          </span>
                          {note.isImportant && (
                            <Badge variant="warning">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Importante
                            </Badge>
                          )}
                        </div>
                        {note.createdBy === currentUserId && (
                          <div className="flex gap-1">
                            <IconButton
                              onClick={() => handleEditNote(note)}
                              variant="outline"
                              size="sm"
                              icon={<Pencil className="w-4 h-4" />}
                              title="Editar nota"
                            />
                            <IconButton
                              onClick={() => handleDeleteClick(note)}
                              variant="outline"
                              size="sm"
                              icon={<Trash2 className="w-4 h-4" />}
                              title="Eliminar nota"
                            />
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
                        {note.content}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(note.createdAt)}</span>
                        {note.updatedAt !== note.createdAt && (
                          <span className="italic">(editado)</span>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Nota"
        description="¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
