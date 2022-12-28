import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ModalOptions() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('a');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Atention
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
            Your data contains more than ... tokens and the OpenAI only allows about 3000 tokens, please choose among this options:
          </Typography>
          <div>
            <FormControlLabel
              value="b"
              control={
                <Radio 
                  checked={selectedValue === 'b'}
                  onChange={handleChange}
                  value="b"
                  name="radio-buttons"
                  inputProps={{ 'aria-label': 'B' }} 
                />
              }
              label="Analyze briefly (Recommended)"
              labelPlacement="end"
            />
            <Tooltip title="We randomly take a small portion of your data in order to give you an insight into what your data is about" placement="right-end">
              <InfoIcon style={{ verticalAlign: 'middle' }}/>
            </Tooltip>
            <br />
            <FormControlLabel
              value="top"
              control={
                <Radio 
                  checked={selectedValue === 'a'}
                  onChange={handleChange}
                  value="a"
                  name="radio-buttons"
                  inputProps={{ 'aria-label': 'A' }}
                />
              }
              label="Analyze all data (Expensive)"
              labelPlacement="end"
            />
            <Tooltip title="We analyze the entire data and provide insight from it. (This process is slower and more expensive)" placement="right-end">
              <InfoIcon style={{ verticalAlign: 'middle' }}/>
            </Tooltip>
          </div>
          <div style={{ marginTop: '15px', marginBottom: '10px', textAlign: 'right' }}>
            <Button variant="outlined" sx={{ mr: 1 }} onClick={handleOpen}>Cancel</Button>
            <Button variant="contained" onClick={handleOpen}>Accept</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}