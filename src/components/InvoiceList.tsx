import React, { useEffect, useState } from 'react';
import { fetchInvoiceByClient } from '../services/api';
import { List, ListItem, ListItemText, Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import './InvoiceLibrary.css';

const InvoiceLibrary: React.FC = () => {
  const [clientNumber, setClientNumber] = useState<string>('');
  const [invoices, setInvoices] = useState<any[]>([]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setClientNumber(event.target.value as string);
  };

  useEffect(() => {
    if (clientNumber) {
      const fetchData = async () => {
        try {
          const data = await fetchInvoiceByClient(clientNumber);
          setInvoices(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [clientNumber]);

  return (
    <div className='invoice-library'>
      <Typography variant='h5' gutterBottom className='header'>
        Invoice Library
      </Typography>
      <FormControl className='form-control'>
        <InputLabel id='clientNumber-select-label'>Client Number</InputLabel>
        <Select labelId='clientNumber-select-label' value={clientNumber} onChange={handleChange}>
          <MenuItem value='123'>123</MenuItem>
          <MenuItem value='456'>456</MenuItem>
        </Select>
      </FormControl>
      <List>
        {invoices.map((invoice) => (
          <ListItem key={invoice.id} button component='a' href={`/invoices/${invoice.id}`} className='list-item'>
            <ListItemText
              primary={`Client: ${invoice.clientNumber}`}
              secondary={`Month: ${invoice.referenceMonth} - Total Cost: $${invoice.totalCost}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default InvoiceLibrary;
