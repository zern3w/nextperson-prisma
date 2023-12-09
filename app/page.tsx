'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../app/layout'; 

import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';

import Alert from '@mui/material/Alert';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { AlertColor } from '@mui/material/Alert';

import { Person } from '../app/lib/person';

export default function IndexPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success'); // Set a default value

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch('/api/people');
      if (response.ok) {
        const data = await response.json();
        setPeople(data);
      } else {
        console.error('Error fetching people data.');
      }
    } catch (error) {
      console.error('Error fetching people data:', error);
    }
  };

  const handleOpen = (person: Person | null) => {
    setCurrentPerson(person);
    if (person) setEditMode(true);
    else setEditMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPerson(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/people/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPeople(prevPeople => prevPeople.filter(person => person.id !== id));
        setSnackbarMessage('Record deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Error deleting the record.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting the person:', error);
      setSnackbarMessage('Error deleting the record.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode && currentPerson) {
        const response = await fetch(`/api/people/${currentPerson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentPerson),
        });
        if (response.ok) {
          const updatedPerson: Person = await response.json();
          setPeople(prevPeople =>
            prevPeople.map(person => (person.id === updatedPerson.id ? updatedPerson : person))
          );
          setSnackbarMessage('Record updated successfully!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage('Error updating the record.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } else {
        const newPerson = {
          firstname: currentPerson!.firstname,
          lastname: currentPerson!.lastname,
          phone: currentPerson!.phone,
        };
        const response = await fetch('/api/people', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPerson),
        });
        if (response.ok) {
          const createdPerson: Person = await response.json();
          setPeople(prevPeople => [...prevPeople, createdPerson]);
          setSnackbarMessage('Record added successfully!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage('Error adding the record.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error('Error updating/adding the person:', error);
      setSnackbarMessage('Error updating/adding the record.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>

    <Container>
      <Button variant="contained" onClick={() => handleOpen(null)}>Add New Person</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {people.map(person => (
              <TableRow key={person.id}>
                <TableCell>{person.firstname}</TableCell>
                <TableCell>{person.lastname}</TableCell>
                <TableCell>{person.phone}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(person)}>Edit</Button>
                  <Button onClick={() => handleDelete(person.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Person' : 'Add Person'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={currentPerson?.firstname || ''}
            onChange={e =>
              setCurrentPerson(prev => ({ ...prev!, firstname: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={currentPerson?.lastname || ''}
            onChange={e =>
              setCurrentPerson(prev => ({ ...prev!, lastname: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={currentPerson?.phone || ''}
            onChange={e =>
              setCurrentPerson(prev => ({ ...prev!, phone: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          icon={<CheckRoundedIcon fontSize="inherit" />}
        >
          {snackbarMessage}
        </Alert>

      </Snackbar>
    </Container>
    </Layout>
  );
}
