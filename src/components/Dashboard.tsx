import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clientNumbers, setClientNumbers] = useState<string[]>([]);
  const [selectedClientNumber, setSelectedClientNumber] = useState<string>("");
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/invoices")
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

  useEffect(() => {
    if (selectedClientNumber) {
      const filtered = invoices.filter(invoice => invoice.clientNumber === selectedClientNumber);
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [selectedClientNumber, invoices]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedClientNumber(event.target.value as string);
  };

  const getChartData = (filteredInvoices: any[], keys: string[], labels: string[], colors: string[]) => {
    return {
      labels: filteredInvoices.map(invoice => invoice.referenceMonth),
      datasets: keys.map((key, index) => ({
        label: labels[index],
        data: filteredInvoices.map(invoice => invoice[key]),
        borderColor: colors[index],
        backgroundColor: colors[index].replace('1)', '0.2)'),
      })),
    };
  };

  const energyChartColors = [
    'rgba(75, 192, 192, 1)',  // Aqua
    'rgba(255, 206, 86, 1)',  // Yellow
  ];

  const costChartColors = [
    'rgba(54, 162, 235, 1)',  // Blue
    'rgba(255, 99, 132, 1)',  // Red
  ];

  return (
    <div className="dashboard">
      <Typography variant="h2">Dashboard</Typography>
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

      {filteredInvoices.length > 0 && (
        <div className="charts">
          <div className="chart-container">
            <Line 
              data={getChartData(filteredInvoices, ["energyConsumption", "sceeEnergy"], ["Energy Consumption (kWh)", "Compensated Energy (kWh)"], energyChartColors)} 
            />
          </div>
          <div className="chart-container">
            <Line 
              data={getChartData(filteredInvoices, ["totalCost", "gdCost"], ["Total Cost (R$)", "GD Savings (R$)"], costChartColors)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
