import { Box, Button, Grid, Modal, Typography } from '@mui/material';

interface ConfirmModalProps {
  title: string;
  text?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal = ({ onClose, onConfirm, text, title }: ConfirmModalProps) => {
  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 2,
          outline: 'none',
          minWidth: 596,
          maxWidth: 1200,
          borderRadius: '4px',
          display: 'flex',
          overflow: 'hidden',
          flexDirection: 'column',
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Grid container flexDirection="column">
          <Grid item>
            {title && <Typography variant="h5">{title}</Typography>}
            {text && <Typography sx={{ mt: 1 }}>{title}</Typography>}
          </Grid>
          <Grid sx={{ mt: 2 }} item>
            <Grid container flexDirection="row" justifyContent="flex-end">
              <Button onClick={onClose}>Отмена</Button>
              <Button onClick={onConfirm}>Подтвердить</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
