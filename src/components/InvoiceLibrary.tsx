import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, List, ListItem, ListItemText, Button } from '@mui/material';
import './InvoiceLibrary.css';

const InvoiceLibrary: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clientNumbers, setClientNumbers] = useState<string[]>([]);
  const [selectedClientNumber, setSelectedClientNumber] = useState<string>("");
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);

  // Fetch invoices and extract unique client numbers
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/invoices`)
      .then(response => {
        const invoicesData: any[] = response.data;
        setInvoices(invoicesData);
        const uniqueClientNumbers: string[] = Array.from(new Set(invoicesData.map(invoice => invoice.clientNumber)));
        setClientNumbers(uniqueClientNumbers);
        setFilteredInvoices(invoicesData); // Inicialmente mostra todos os dados
      })
      .catch(error => {
        console.error("There was an error fetching the invoices!", error);
      });
  }, []);

  // Filter invoices based on selected client number
  useEffect(() => {
    if (selectedClientNumber) {
      const filtered = invoices.filter(invoice => invoice.clientNumber === selectedClientNumber);
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [selectedClientNumber, invoices]);

  // Handle client number change
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedClientNumber(event.target.value as string);
  };

  // Handle invoice download
  const handleDownload = (invoice: any) => {
    axios({
      url: `${process.env.REACT_APP_API_URL}/invoices/download/${invoice.id}`,
      method: 'GET',
      responseType: 'blob', // Important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoice.clientNumber}-${invoice.referenceMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch((error) => {
      console.error('Error downloading the invoice:', error);
    });
  };

  return (
    <div className="invoice-library">
      <Typography variant="h2">Invoice Library</Typography>
      <FormControl className="form-control">
        <InputLabel id="clientNumber-select-label">Client Number</InputLabel>
        <Select
          labelId="clientNumber-select-label"
          value={selectedClientNumber}
          onChange={handleChange}
        >
          <MenuItem value="">
            All Clients
          </MenuItem>
          {clientNumbers.map(clientNumber => (
            <MenuItem key={clientNumber} value={clientNumber}>
              {clientNumber}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <List>
        {filteredInvoices.map(invoice => (
          <ListItem key={invoice.id} className="invoice-item">
            <ListItemText
              primary={`Client: ${invoice.clientNumber} - Month: ${invoice.referenceMonth}`}
              secondary={`Total Cost: R$ ${invoice.totalCost}`}
            />
            <Button variant="contained" color="primary" onClick={() => handleDownload(invoice)}>
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default InvoiceLibrary;
