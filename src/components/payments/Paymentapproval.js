import React, { useEffect, useState } from 'react';
import { getPendingPayments, approvePayment, rejectPayment } from '../../services/payments';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Alert
} from '@mui/material';

export default function PaymentApproval() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const pendingPayments = await getPendingPayments();
        setPayments(pendingPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const handleApprove = async (paymentId) => {
    try {
      await approvePayment(paymentId);
      setPayments(payments.filter(p => p.id !== paymentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (paymentId) => {
    try {
      await rejectPayment(paymentId, rejectionReason);
      setPayments(payments.filter(p => p.id !== paymentId));
      setRejectionReason('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Typography>Loading payments...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Payment Approvals</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.userId}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{payment.details}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(payment.id)}
                    sx={{ mr: 2 }}
                  >
                    Approve
                  </Button>
                  <TextField
                    size="small"
                    placeholder="Rejection reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    sx={{ mr: 2, width: '200px' }}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(payment.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
