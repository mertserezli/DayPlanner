import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Button from '@mui/material/Button';

function DescriptionDialog({ saveDescription, item, open, onClose }) {
  const { t } = useTranslation();
  const [description, setDescription] = useState(item.description);

  useEffect(() => {
    if (open) {
      setDescription(item.description || '');
    }
  }, [open]);

  function handleSaveDescription() {
    onClose();
    saveDescription(description);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('descriptionDialog.title')}</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          minRows={6}
          fullWidth
          autoFocus
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('descriptionDialog.placeholder')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button type="submit" onClick={handleSaveDescription} variant="contained">
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DescriptionDialog;
